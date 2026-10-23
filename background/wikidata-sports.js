

const WIKIDATA_SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';
const WBSEARCH_ENDPOINT = 'https://www.wikidata.org/w/api.php';

async function sparqlQuery(query){
  const url = `${WIKIDATA_SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
  return fetchJson(url, { 'Accept':'application/sparql-results+json', 'User-Agent':'QuickCard/1.0' }, 25000);
}

const WIKIDATA_SEARCH_PHOTO_WIDTH = 330;
const WIKIDATA_PAGE_PHOTO_WIDTH = 500;

function wikidataApplyImageThumbWidth(rawImageUrl, widthPx) {
  if (!rawImageUrl) return rawImageUrl;

  try {
    const url = new URL(rawImageUrl);
    url.searchParams.set('width', String(widthPx));
    return url.href;
  } catch (_) {
    return rawImageUrl;
  }
}

async function wikidataGeneratorSearchQidsRaw(gsrsearch, limit){
  const params = new URLSearchParams({
    action:'query',
    generator:'search',
    gsrsearch,
    gsrlimit: String(limit),
    prop:'pageprops',
    ppprop:'wikibase_item',
    origin:'*',
    format:'json'
  });
  const data = await fetchJson(`${WBSEARCH_ENDPOINT}?${params.toString()}`, {}, 10000);
  if (data && data.error) throw new Error(data.error.info || data.error.code || 'wikidata search error');
  const pages = Object.values((data.query||{}).pages||{});
  const seen = new Set();
  const qids = [];
  for (const page of pages){
    let qid = page && page.pageprops && page.pageprops.wikibase_item;
    if ((typeof qid !== 'string' || !/^Q\d+$/.test(qid)) && page && typeof page.title === 'string' && /^Q\d+$/.test(page.title)){
      qid = page.title;
    }
    if (typeof qid === 'string' && /^Q\d+$/.test(qid) && !seen.has(qid)){
      seen.add(qid);
      qids.push(qid);
    }
  }
  return { qids, pageCount: pages.length };
}

async function wikidataGeneratorSearchQids(query, limit=40){
  const strict = await wikidataGeneratorSearchQidsRaw(`${query} haswbstatement:P31=Q5 haswbstatement:P641`, limit);

  if (strict.qids.length) return strict.qids;
  const relaxed = await wikidataGeneratorSearchQidsRaw(`${query} haswbstatement:P31=Q5`, limit);

  return relaxed.qids;
}

async function fetchSportsCandidatesRanked(qids, limit=10){
  if (!qids.length) return [];
  const values = qids.map(qid=>`wd:${qid}`).join(' ');
  const query = `
SELECT ?item ?itemLabel ?desc ?image ?sitelinks ?sports WHERE {
  {
    SELECT ?item (SAMPLE(?l) AS ?itemLabel) (SAMPLE(?d) AS ?desc) (SAMPLE(?img) AS ?image) (SAMPLE(?sl) AS ?sitelinks) (SAMPLE(?s) AS ?sports) WHERE {
      VALUES ?item { ${values} }
      ?item rdfs:label ?l FILTER(LANG(?l) IN ("en","mul"))
      ?item wikibase:sitelinks ?sl .
      OPTIONAL { ?item wdt:P18 ?img. }
      OPTIONAL { ?item schema:description ?d FILTER(LANG(?d) IN ("en","mul")) }
      OPTIONAL {
        SELECT ?item (GROUP_CONCAT(DISTINCT ?sportLabel; separator=", ") AS ?s) WHERE {
          VALUES ?item { ${values} }
          ?item wdt:P641 ?sp.
          ?sp rdfs:label ?sportLabel FILTER(LANG(?sportLabel) IN ("en","mul"))
        }
        GROUP BY ?item
      }
    }
    GROUP BY ?item
  }
}
ORDER BY DESC(?sitelinks)
LIMIT ${limit}
`;
  const data = await sparqlQuery(query);
  const out = [];
  for (const binding of (data.results?.bindings||[])){
    const itemVal = binding.item?.value || '';
    const id = itemVal.split('/').pop();
    if (!/^Q\d+$/.test(id)) continue;
    out.push({
      id,
      wikidataId:id,
      label: binding.itemLabel?.value || id,
      description: binding.desc?.value || '',
      sport: binding.sports?.value || '',
      country: '',
      image: binding.image?.value || '',
      sportQid:'',
      sitelinks: parseInt(binding.sitelinks?.value||'0',10)||0
    });
  }
  return out;
}

async function enrichStageOneQidsFallback(qids){
  if (!qids.length) return [];
  try {
    const params = new URLSearchParams({
      action:'wbgetentities',
      ids: qids.join('|'),
      props:'labels|descriptions',
      languages:'en',
      format:'json',
      origin:'*'
    });
    const data = await fetchJson(`${WBSEARCH_ENDPOINT}?${params.toString()}`, {}, 10000);
    const entities = (data && data.entities) || {};
    return qids.map(qid=>{
      const entity = entities[qid] || {};
      return {
        id: qid,
        wikidataId: qid,
        label: (entity.labels && entity.labels.en && entity.labels.en.value) || qid,
        description: (entity.descriptions && entity.descriptions.en && entity.descriptions.en.value) || '',
        sport: '',
        country: '',
        image: '',
        sportQid:'',
        sitelinks: 0
      };
    });
  } catch(e){

    return qids.map(qid=>({
      id: qid, wikidataId: qid, label: qid, description: '', sport: '', country: '', image: '', sportQid:'', sitelinks: 0
    }));
  }
}

async function wikidataSearchAthletes(query, limit=10){
  const qids = await wikidataGeneratorSearchQids(query, 40);
  if (!qids.length) return [];
  const CHUNK = 15;
  let ranked = [];
  try {
    for (let i = 0; i < qids.length; i += CHUNK){
      const chunkRanked = await fetchSportsCandidatesRanked(qids.slice(i, i + CHUNK), CHUNK);
      ranked.push(...chunkRanked);
    }
    ranked.sort((a, b)=>(b.sitelinks||0)-(a.sitelinks||0));
  } catch(e){

    ranked = [];
  }

  if (ranked.length < qids.length){
    const rankedIds = new Set(ranked.map(c=>c.id));
    const missing = qids.filter(qid=>!rankedIds.has(qid));
    if (missing.length){

      const fallback = await enrichStageOneQidsFallback(missing);
      ranked.push(...fallback);
    }
  }
  return ranked.slice(0,limit);
}

const ESPN_WIKIDATA_PROPS = {
  P3685: 'nba',
  P3647: 'nba',
  P3566: 'nfl',
  P3680: 'nfl',
  P3571: 'mlb'
};

const ESPN_WIKIDATA_PROP_LABELS = {
  P3685: 'ESPN.com NBA player ID',
  P3647: 'ESPN.com NBA coach ID',
  P3566: 'ESPN.com NFL player ID',
  P3680: 'ESPN.com NFL coach ID',
  P3571: 'ESPN.com MLB player ID'
};
async function fetchWikidataEspnIds(wikidataId){

  const propKeys = Object.keys(ESPN_WIKIDATA_PROPS);
  const optionals = propKeys.map(prop => `OPTIONAL { ?item wdt:${prop} ?${prop}. }`).join('\n  ');
  const query = `
SELECT ${propKeys.map(prop => `?${prop}`).join(' ')} WHERE {
  BIND(wd:${wikidataId} AS ?item)
  ${optionals}
}
LIMIT 1
`;
  try {
    const data = await sparqlQuery(query);
    const binding = data.results?.bindings?.[0] || {};
    const ids = {};
    for (const [prop, leagueKey] of Object.entries(ESPN_WIKIDATA_PROPS)){
      const value = binding[prop]?.value || '';
      if (!value) continue;

      if (!ids[leagueKey]) ids[leagueKey] = { id: value, prop, label: ESPN_WIKIDATA_PROP_LABELS[prop] || prop };
    }
    return ids;
  } catch(e){

    return {};
  }
}

async function fetchWikidataSportLabels(wikidataId){

  const query = `
SELECT ?sport ?sportLabel ?start ?end ?rank (COUNT(DISTINCT ?ref) AS ?refs) WHERE {
  BIND(wd:${wikidataId} AS ?item)
  ?item p:P641 ?st.
  ?st ps:P641 ?sport.
  OPTIONAL { ?st pq:P580 ?start. }
  OPTIONAL { ?st pq:P582 ?end. }
  OPTIONAL { ?st wikibase:rank ?rank. }
  OPTIONAL { ?st prov:wasDerivedFrom ?ref. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?sport ?sportLabel ?start ?end ?rank
`;
  try {
    const data = await sparqlQuery(query);
    const byLabel = new Map();
    for (const binding of (data.results?.bindings||[])){
      const qid = (binding.sport?.value||'').split('/').pop();
      const label = binding.sportLabel?.value || '';
      if (!label) continue;
      const rankUri = binding.rank?.value || '';
      const rank = /PreferredRank/i.test(rankUri) ? 2 : (/DeprecatedRank/i.test(rankUri) ? 0 : 1);
      const refs = parseInt(binding.refs?.value || '0', 10) || 0;
      const start = (binding.start?.value||'').slice(0,4);
      const end = (binding.end?.value||'').slice(0,4);
      const prev = byLabel.get(label);

      if (!prev || rank > prev.rank || (rank === prev.rank && refs > prev.refs)) {
        byLabel.set(label, { qid, label, rank, refs, start, end });
      }
    }
    return [...byLabel.values()];
  } catch(e){

    return [];
  }
}

function pickPrimarySportLabel(allSports, espnIds, occupation, description){
  if (!allSports || !allSports.length) return '';
  const occ = String(occupation || '').toLowerCase();
  const desc = String(description || '').toLowerCase();
  const year = new Date().getFullYear();
  const scored = allSports.map((entry) => {
    const label = entry.label || '';
    const lower = label.toLowerCase();
    const leagueKey = sportsPrimaryLeagueKeyFromLabel(label);
    let score = 0;
    if (leagueKey && espnIds && espnIds[leagueKey]?.id) score += 1000;
    score += (entry.rank || 1) * 100;
    const endY = parseInt(entry.end, 10) || 0;
    const startY = parseInt(entry.start, 10) || 0;
    if (!endY || endY >= year) score += 80;
    else score -= 40;
    score += Math.min(entry.refs || 0, 10) * 15;
    if (startY) score += Math.min(startY - 1990, 40);
    if (occ && (occ.includes(lower) || lower.split(/\s+/).some(w => w.length > 4 && occ.includes(w)))) score += 60;
    if (desc && (desc.includes(lower) || (lower.includes('american football') && /football|quarterback|nfl/i.test(desc)))) score += 50;
    if (lower.includes('american football') || lower.includes('gridiron')) score += 5;

    if (lower === 'baseball' && (entry.refs || 0) === 0) score -= 30;
    return { label, score, leagueKey };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.label || allSports[0].label || '';
}

async function fetchWikidataTeams(wikidataId){
  const query = `
SELECT ?team ?teamLabel ?start ?end WHERE {
  BIND(wd:${wikidataId} AS ?item)
  ?item p:P54 ?st.
  ?st ps:P54 ?team.
  OPTIONAL { ?st pq:P580 ?start. }
  OPTIONAL { ?st pq:P582 ?end. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;
  try {
    const data = await sparqlQuery(query);
    const out = [];
    for (const binding of (data.results?.bindings || [])) {
      const label = binding.teamLabel?.value || '';
      if (!label) continue;
      out.push({
        label,
        start: (binding.start?.value || '').slice(0, 4),
        end: (binding.end?.value || '').slice(0, 4)
      });
    }
    return out;
  } catch (e) {

    return [];
  }
}

function pickCurrentTeamLabel(teams){
  if (!Array.isArray(teams) || !teams.length) return '';
  const year = new Date().getFullYear();
  const scored = teams.map((t) => {
    const startY = parseInt(t.start, 10) || 0;
    const endY = parseInt(t.end, 10) || 0;
    const current = !endY || endY >= year;

    const score = (current ? 100000 : 0) + startY * 10 + endY;
    return { label: t.label, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.label || '';
}

function sportsPrimaryLeagueKeyFromLabel(sportLabel){
  const lower = String(sportLabel||'').toLowerCase();
  if (lower.includes('basketball')) return 'nba';
  if (lower.includes('baseball')) return 'mlb';
  if (lower.includes('ice hockey') || (lower.includes('hockey') && !lower.includes('field'))) return 'nhl';
  if (lower.includes('american football') || lower.includes('gridiron') || lower.includes('canadian football')) return 'nfl';
  return null;
}

async function fetchWikidataCareerSpans(wikidataId){
  const query = `
SELECT ?sport ?sportLabel ?start ?end WHERE {
  BIND(wd:${wikidataId} AS ?item)
  ?item p:P641 ?st.
  ?st ps:P641 ?sport.
  OPTIONAL { ?st pq:P580 ?start. }
  OPTIONAL { ?st pq:P582 ?end. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;
  try {
    const data = await sparqlQuery(query);
    const out = [];
    for (const binding of (data.results?.bindings||[])){
      const sportQid = (binding.sport?.value||'').split('/').pop();
      const sportLabel = binding.sportLabel?.value || '';
      if (!sportLabel) continue;
      out.push({
        sport: sportQid,
        sportLabel,
        start: (binding.start?.value||'').slice(0,4),
        end: (binding.end?.value||'').slice(0,4)
      });
    }
    return out;
  } catch(e){

    return [];
  }
}

async function getWikidataSportsBundle(wikidataId){
  const baseQ = `
  SELECT ?athlete ?athleteLabel ?sport ?sportLabel ?occupation ?occupationLabel ?countryLabel ?teamLabel ?height ?mass ?birthDate ?image ?desc ?wikipediaTitle ?transfermarktId
WHERE {
  BIND(wd:${wikidataId} AS ?athlete)
  OPTIONAL { ?athlete wdt:P641 ?sport. }
  OPTIONAL { ?athlete wdt:P27 ?country. ?country rdfs:label ?countryLabel. FILTER(LANG(?countryLabel)='en') }
  OPTIONAL { ?athlete wdt:P54 ?team. ?team rdfs:label ?teamLabel. FILTER(LANG(?teamLabel)='en') }
  # Amin's screenshot: a real NFL player's card showed "178.00 m" as
  # height instead of "1.78 m" - the same raw-value/unit bug as weight
  # below, just for P2048 (height): the old query read wdt:P2048 raw and
  # always appended ' m', but this athlete's height was entered in
  # Wikidata in centimeters, so the raw number (178) was actually
  # centimeters mislabeled as meters. Same fix as mass: read the
  # NORMALIZED node so Wikidata itself converts to the property's
  # standard unit (metre) regardless of the source unit.
  OPTIONAL { ?athlete p:P2048/psn:P2048 ?heightNode. ?heightNode wikibase:quantityAmount ?height. }
  # Amin: "وزن بعضی بازیکن ها پونده ولی همیشه کیلو نشون میدیم" - the old
  # query read the RAW wdt:P2067 amount and blindly appended ' kg', but
  # some athletes (mostly American ones) have mass entered in Wikidata in
  # pounds, not kg, so that raw number was sometimes actually a pound
  # value mislabeled as kg. Reading the NORMALIZED statement node
  # (p:P2067/psn:P2067 -> wikibase:quantityAmount) instead makes Wikidata
  # itself convert the stored value to the property's standard unit
  # (kilogram) regardless of what unit the original editor entered it in,
  # so the number is always genuinely in kg.
  OPTIONAL { ?athlete p:P2067/psn:P2067 ?massNode. ?massNode wikibase:quantityAmount ?mass. }
  OPTIONAL { ?athlete wdt:P569 ?birthDate. }
  OPTIONAL { ?athlete wdt:P18 ?image. }
  OPTIONAL { ?athlete wdt:P106 ?occupation.}
  OPTIONAL { ?athlete schema:description ?desc. FILTER(LANG(?desc)='en') }
  # Amin: "اگر ورزش کسی فوتبال بود لینک به قسمت فوتبال پروژه خودمون بزار" -
  # P2446 is the same Transfermarkt player ID the Football pack itself
  # already navigates by (footballNavigateById('player', id) ->
  # renderFootballCard(id,...)), so fetching it here is all that's needed
  # to cross-link a soccer athlete straight into that pack's own card -
  # no separate lookup/matching step, and harmless to fetch for every
  # sport even though only football players will ever have it set.
  OPTIONAL { ?athlete wdt:P2446 ?transfermarktId. }
  OPTIONAL {
    ?wikipediaArticle schema:about ?athlete;
                       schema:isPartOf <https://en.wikipedia.org/>;
                       schema:name ?wikipediaTitle.
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 1
`;

  try {
    const [baseData, espnIds, allSports, careerSpans, teamRows] = await Promise.all([
      sparqlQuery(baseQ),
      fetchWikidataEspnIds(wikidataId),
      fetchWikidataSportLabels(wikidataId),
      fetchWikidataCareerSpans(wikidataId),
      fetchWikidataTeams(wikidataId)
    ]);

    const baseBinding = baseData.results?.bindings?.[0];
    if (!baseBinding) return null;

    const baseSportLabel = baseBinding.sportLabel?.value || '';
    const occupationEarly = baseBinding.occupationLabel?.value || '';
    const descEarly = baseBinding.desc?.value || '';
    let sport = pickPrimarySportLabel(allSports, espnIds, occupationEarly, descEarly) || baseSportLabel;

    const rawSports = allSports.length ? allSports.map(entry => entry.label) : (baseSportLabel ? [baseSportLabel] : []);
    const sports = sport
      ? [sport, ...rawSports.filter(s => s !== sport)]
      : rawSports;

    const idLeague = sportsPrimaryLeagueKeyFromLabel(sport);
    const hasEspnForPrimary = !!(idLeague && espnIds[idLeague]?.id);
    if (!hasEspnForPrimary) {
      const combatRe = /muay thai|kickbox|mixed martial|\bmma\b|boxing|sambo|judo|wrestling|taekwondo|karate/i;
      const ballRe = /association football|football|soccer|basketball|baseball|ice hockey|american football/i;
      const combatHit = sports.find(s => combatRe.test(s));
      if (combatHit && ballRe.test(sport || '')) {
        sport = combatHit;
      } else if (combatHit && !combatRe.test(sport || '')) {
        sport = combatHit;
      }
    }

    const currentYear = new Date().getFullYear();
    const primarySpan = careerSpans.find(span => span.sportLabel === sport)
      || careerSpans.find(span => sportsPrimaryLeagueKeyFromLabel(span.sportLabel));
    const careerEnd = primarySpan?.end || '';
    const careerStart = primarySpan?.start || '';
    const careerEndYear = parseInt(careerEnd, 10) || 0;
    const isRetired = careerEndYear > 0 && careerEndYear < currentYear;
    const country = baseBinding.countryLabel?.value || '';
    const team = pickCurrentTeamLabel(teamRows) || baseBinding.teamLabel?.value || '';
    const occupation = baseBinding.occupationLabel?.value || '';
    const height = baseBinding.height?.value ? (parseFloat(baseBinding.height.value).toFixed(2)+' m') : '';

    const weight = baseBinding.mass?.value
      ? (parseFloat(baseBinding.mass.value).toFixed(1).replace(/\.0$/, '')+' kg')
      : '';
    let birthDate = '';
    if (baseBinding.birthDate && baseBinding.birthDate.value) {
      const raw = String(baseBinding.birthDate.value);
      const day = raw.slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
        const parts = day.split('-');
        birthDate = parts[2] + '/' + parts[1] + '/' + parts[0];
      } else if (/^\d{4}/.test(raw)) {
        birthDate = raw.slice(0, 4);
      }
    }
    const image = wikidataApplyImageThumbWidth(baseBinding.image?.value || '', WIKIDATA_PAGE_PHOTO_WIDTH);

    const rawWikipediaTitle = baseBinding.wikipediaTitle?.value || '';
    const cleanWikipediaTitle = rawWikipediaTitle.replace(/\s*\([^)]*\)\s*$/, '').trim();
    const rawLabel = baseBinding.athleteLabel?.value || '';
    const name = cleanWikipediaTitle || rawLabel || wikidataId;
    const wikipediaTitle = rawWikipediaTitle || name;
    if (!sport && occupation) {
      sport = occupation.replace(/\s+player\s*$/i, '').trim();
    }
    return {
      id: wikidataId,
      wikidataId,
      name,
      label: name,
      sport,
      sports,
      careerStart,
      careerEnd,
      isRetired,
      careerSpans,
      country,
      team,
      occupation,
      height,
      weight,
      birthDate,
      image,
      description: baseBinding.desc?.value || '',
      wikipediaTitle,
      transfermarktId: baseBinding.transfermarktId?.value || null,
      espnIds,
      proStats: {},
      links: []
    };
  } catch(e){
    return { error: String(e) };
  }
}

async function getWikidataSportsEnrichedCandidates(query){
  const ranked = await wikidataSearchAthletes(query, 10);

  return ranked.map((candidate) => ({
    id: candidate.wikidataId || candidate.id,
    wikidataId: candidate.wikidataId || candidate.id,
    label: candidate.label,
    description: candidate.description,
    sport: candidate.sport,
    country: candidate.country || '',
    image: candidate.image ? wikidataApplyImageThumbWidth(candidate.image, WIKIDATA_SEARCH_PHOTO_WIDTH) : null,
    sportQid: candidate.sportQid||''
  }));
}

