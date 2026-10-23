

async function getWikidataLinks(imdbId, propertyMap, includeWikipedia = false) {
  const keys = Object.keys(propertyMap || {});
  if (!keys.length && !includeWikipedia) return {};

  const optionalClauses = keys
    .map((key) => `OPTIONAL { ?item wdt:${propertyMap[key]} ?${key}. }`)
    .join('\n  ');
  const selectVars = keys.map((k) => `?${k}`).join(' ');

  const wikipediaClause = includeWikipedia
    ? `OPTIONAL {
    ?wikipediaArticle schema:about ?item;
                      schema:isPartOf <https://en.wikipedia.org/>.
  }`
    : '';

  const query = `
SELECT ${selectVars}${includeWikipedia ? ' ?wikipediaArticle' : ''} WHERE {
  ?item wdt:P345 "${imdbId}".
  ${optionalClauses}
  ${wikipediaClause}
}
LIMIT 1
  `.trim();

  const url =
    'https://query.wikidata.org/sparql?format=json&query=' +
    encodeURIComponent(query);

  const result = {};
  keys.forEach((key) => { result[key] = null; });
  if (includeWikipedia) result.wikipediaArticle = null;

  try {
    const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 8000);
    const bindings = json && json.results && Array.isArray(json.results.bindings)
      ? json.results.bindings
      : [];

    if (bindings.length) {
      const row = bindings[0];
      keys.forEach((key) => {
        const value = row[key] && row[key].value;
        result[key] = value ? String(value) : null;
      });
      if (includeWikipedia) {
        const value = row.wikipediaArticle && row.wikipediaArticle.value;
        result.wikipediaArticle = value ? String(value) : null;
      }
    }

    log('getWikidataLinks:', imdbId, '->', result);
    return result;
  } catch (e) {
    logError('getWikidataLinks: threw error for', imdbId, '->', e && e.message ? e.message : e);
    return result;
  }
}

async function getGamesWikidataLinks(gameSpotSlug, propertyMap, includeWikipedia) {
  const keys = Object.keys(propertyMap || {});
  if (!keys.length && !includeWikipedia) return {};

  const optionalClauses = keys
    .map((key) => `OPTIONAL { ?item wdt:${propertyMap[key]} ?${key}. }`)
    .join('\n  ');
  const selectVars = keys.map((k) => `?${k}`).join(' ');

  const wikipediaClause = includeWikipedia
    ? `OPTIONAL {
    ?wikipediaArticle schema:about ?item;
                      schema:isPartOf <https://en.wikipedia.org/>.
  }`
    : '';

  const query = `
SELECT ${selectVars}${includeWikipedia ? ' ?wikipediaArticle' : ''} WHERE {
  ?item wdt:P5494 "${gameSpotSlug}".
  ${optionalClauses}
  ${wikipediaClause}
}
LIMIT 1
  `.trim();

  const url =
    'https://query.wikidata.org/sparql?format=json&query=' +
    encodeURIComponent(query);

  const result = {};
  keys.forEach((key) => { result[key] = null; });
  if (includeWikipedia) result.wikipediaArticle = null;

  try {
    const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 8000);
    const bindings = json && json.results && Array.isArray(json.results.bindings)
      ? json.results.bindings
      : [];

    if (bindings.length) {
      const row = bindings[0];
      keys.forEach((key) => {
        const value = row[key] && row[key].value;
        result[key] = value ? String(value) : null;
      });
      if (includeWikipedia) {
        const value = row.wikipediaArticle && row.wikipediaArticle.value;
        result.wikipediaArticle = value ? String(value) : null;
      }
    }

    log('getGamesWikidataLinks:', gameSpotSlug, '->', result);
    return result;
  } catch (e) {
    logError('getGamesWikidataLinks: threw error for', gameSpotSlug, '->', e && e.message ? e.message : e);
    return result;
  }
}

async function getWikidataPersonBundle(imdbId) {
  const query = `
SELECT ?birthDate ?deathDate ?birthPlaceLabel ?occupationLabel
       ?twitterHandle ?instagramHandle ?officialWebsite
       ?letterboxdActorId ?wikipediaArticle
WHERE {
  ?person wdt:P345 "${imdbId}" .

  OPTIONAL { ?person wdt:P569 ?birthDate . }
  OPTIONAL { ?person wdt:P570 ?deathDate . }
  OPTIONAL { ?person wdt:P19 ?birthPlace . }
  OPTIONAL { ?person wdt:P106 ?occupation . }
  OPTIONAL { ?person wdt:P2002 ?twitterHandle . }
  OPTIONAL { ?person wdt:P2003 ?instagramHandle . }
  OPTIONAL { ?person wdt:P856 ?officialWebsite . }
  OPTIONAL { ?person wdt:P6119 ?letterboxdActorId . }

  OPTIONAL {
    ?wikipediaArticle schema:about ?person ;
                      schema:isPartOf <https://en.wikipedia.org/> .
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en" .
    ?birthPlace rdfs:label ?birthPlaceLabel .
    ?occupation rdfs:label ?occupationLabel .
  }
}
LIMIT 20
  `.trim();

  const url =
    'https://query.wikidata.org/sparql?format=json&query=' +
    encodeURIComponent(query);

  const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 8000);

  const bindings = json && json.results && Array.isArray(json.results.bindings)
    ? json.results.bindings
    : [];

  log('getWikidataPersonBundle:', imdbId, '-> bindings count:', bindings.length);

  if (!bindings.length) return null;

  let birthDate = null;
  let deathDate = null;
  let birthPlace = null;
  let twitterHandle = null;
  let instagramHandle = null;
  let officialWebsite = null;
  let letterboxdActorId = null;
  let wikipediaUrl = null;
  const occupations = [];

  for (const row of bindings) {
    if (!birthDate && row.birthDate && row.birthDate.value) birthDate = row.birthDate.value;
    if (!deathDate && row.deathDate && row.deathDate.value) deathDate = row.deathDate.value;
    if (!birthPlace && row.birthPlaceLabel && row.birthPlaceLabel.value) birthPlace = row.birthPlaceLabel.value;
    if (!twitterHandle && row.twitterHandle && row.twitterHandle.value) twitterHandle = row.twitterHandle.value;
    if (!instagramHandle && row.instagramHandle && row.instagramHandle.value) instagramHandle = row.instagramHandle.value;
    if (!officialWebsite && row.officialWebsite && row.officialWebsite.value) officialWebsite = row.officialWebsite.value;
    if (!letterboxdActorId && row.letterboxdActorId && row.letterboxdActorId.value) letterboxdActorId = row.letterboxdActorId.value;
    if (!wikipediaUrl && row.wikipediaArticle && row.wikipediaArticle.value) wikipediaUrl = row.wikipediaArticle.value;
    if (row.occupationLabel && row.occupationLabel.value) {
      const v = row.occupationLabel.value.trim();
      if (v && !occupations.includes(v)) occupations.push(v);
    }
  }

  return {
    birthDate, deathDate, birthPlace, occupations,
    twitterHandle, instagramHandle, officialWebsite, letterboxdActorId, wikipediaUrl
  };
}

const KNOWN_FOR_IMAGE_CONCURRENCY = 3;
async function getMoviesKnownForImages(imdbIds) {
  const ids = Array.isArray(imdbIds) ? imdbIds : [];
  if (!ids.length) return [];

  const results = new Array(ids.length).fill(null);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < ids.length) {
      const i = nextIndex++;
      const ttid = ids[i];
      if (!ttid || typeof ttid !== 'string') continue;
      try {
        const url = `https://images.metahub.space/poster/small/${ttid}/img`;
        const res = await fetchImageAsDataUrl(url, 8000);
        if (res && res.ok && res.dataUrl) {
          results[i] = res.dataUrl;
        } else {

          log('getMoviesKnownForImages: no image for', ttid, res && res.error ? res.error : '');
          results[i] = null;
        }
      } catch (e) {
        logError('getMoviesKnownForImages: error for', ttid, '->', e && e.message ? e.message : e);
        results[i] = null;
      }
    }
  }

  const workerCount = Math.min(KNOWN_FOR_IMAGE_CONCURRENCY, ids.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

async function getPersonAwards(imdbId) {
  try {
    const url = `${KARGI_BASE_URL}/awards?id=${encodeURIComponent(imdbId)}`;
    const data = await fetchJson(url, {}, 8000);
    if (!data || !data.total || !data.total.total) return null;
    const pick = (key) => ({
      wins: (data.awards[key] && data.awards[key].wins) || 0,
      nominations: (data.awards[key] && data.awards[key].nominations) || 0
    });
    return {
      academy: pick('academy'),
      goldenglobe: pick('goldenglobe'),
      emmy: pick('emmy')
    };
  } catch (e) {
    logError('getPersonAwards: threw error for', imdbId, '->', e && e.message ? e.message : e);
    return null;
  }
}

const MOVIES_BOOK_WORK_TYPE_VALUES = 'wd:Q7725634, wd:Q8261, wd:Q47461344, wd:Q571, wd:Q277759';
async function getMovieBookSource(imdbId) {
  if (!imdbId) return null;

  const sparql = `
SELECT ?sourceWork ?sourceWorkLabel ?sourceOlId ?seriesBook ?seriesBookLabel ?seriesBookOlId ?ordinal WHERE {
  ?item wdt:P345 "${imdbId}".
  ?item wdt:P144 ?sourceWork.
  ?sourceWork wdt:P31/wdt:P279* ?swType.
  FILTER(?swType IN (${MOVIES_BOOK_WORK_TYPE_VALUES}))
  OPTIONAL { ?sourceWork wdt:P648 ?sourceOlId. }
  OPTIONAL {
    ?seriesBook wdt:P179 ?sourceWork; wdt:P31 ?bookType.
    FILTER(?bookType IN (wd:Q7725634, wd:Q8261, wd:Q47461344, wd:Q571))
    ?seriesBook p:P179 [ ps:P179 ?sourceWork; pq:P1545 ?ordinal ].
    ?seriesBook wdt:P648 ?seriesBookOlId.
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 20
  `.trim();

  try {
    const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
    const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 10000);
    const bindings = (json && json.results && Array.isArray(json.results.bindings)) ? json.results.bindings : [];
    if (!bindings.length) { log('getMovieBookSource:', imdbId, '-> no P144 source work'); return null; }

    const exactRow = bindings.find((b) => b.sourceOlId && b.sourceOlId.value);
    if (exactRow) {
      const result = {
        olId: exactRow.sourceOlId.value,
        title: exactRow.sourceWorkLabel?.value || null,
        isSeriesFirstBook: false,
        seriesTitle: null
      };
      log('getMovieBookSource:', imdbId, '-> exact book', result);
      return result;
    }

    const seriesRows = bindings.filter((b) => b.seriesBookOlId && b.seriesBookOlId.value && b.ordinal && b.ordinal.value);
    if (seriesRows.length) {
      seriesRows.sort((a, b) => parseInt(a.ordinal.value, 10) - parseInt(b.ordinal.value, 10));
      const first = seriesRows[0];
      const result = {
        olId: first.seriesBookOlId.value,
        title: first.seriesBookLabel?.value || null,
        isSeriesFirstBook: true,
        seriesTitle: first.sourceWorkLabel?.value || null
      };
      log('getMovieBookSource:', imdbId, '-> first book of series', result);
      return result;
    }

    log('getMovieBookSource:', imdbId, '-> source work found but no usable Open Library id');
    return null;
  } catch (e) {
    logError('getMovieBookSource: threw error for', imdbId, '->', e && e.message ? e.message : e);
    return null;
  }
}

async function getWikipediaSummary(wikipediaUrl) {
  if (!wikipediaUrl) return null;
  const title = wikipediaUrl.split('/wiki/')[1];
  if (!title) return null;

  try {
    const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + title;
    const json = await fetchJson(url, { Accept: 'application/json' }, 8000);
    const extract = json && typeof json.extract === 'string' ? json.extract.trim() : '';
    log('getWikipediaSummary:', wikipediaUrl, '-> length:', extract.length);
    return extract || null;
  } catch (e) {
    logError('getWikipediaSummary: threw error for', wikipediaUrl, '->', e && e.message ? e.message : e);
    return null;
  }
}

async function getFootballTeamWikidataLinks(transfermarktTeamId) {
  if (!transfermarktTeamId) return {};

  const query = `
SELECT ?officialWebsite ?soccerwayId ?wikipediaArticle WHERE {
  ?item wdt:P7223 "${transfermarktTeamId}".
  OPTIONAL { ?item wdt:P856 ?officialWebsite. }
  OPTIONAL { ?item wdt:P6131 ?soccerwayId. }
  OPTIONAL {
    ?wikipediaArticle schema:about ?item;
                      schema:isPartOf <https://en.wikipedia.org/>.
  }
}
LIMIT 1
  `.trim();

  const url =
    'https://query.wikidata.org/sparql?format=json&query=' +
    encodeURIComponent(query);

  const result = { officialWebsite: null, soccerwayId: null, wikipediaArticle: null };

  try {
    const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 8000);
    const bindings = json && json.results && Array.isArray(json.results.bindings)
      ? json.results.bindings
      : [];

    if (bindings.length) {
      const row = bindings[0];
      result.officialWebsite = row.officialWebsite ? String(row.officialWebsite.value) : null;
      result.soccerwayId = row.soccerwayId ? String(row.soccerwayId.value) : null;
      result.wikipediaArticle = row.wikipediaArticle ? String(row.wikipediaArticle.value) : null;
    }

    log('getFootballTeamWikidataLinks:', transfermarktTeamId, '->', result);
    return result;
  } catch (e) {
    logError('getFootballTeamWikidataLinks: threw error for', transfermarktTeamId, '->', e && e.message ? e.message : e);
    return result;
  }
}

const BOOKS_ADAPTATION_TYPE_VALUES = 'wd:Q11424, wd:Q5398426, wd:Q1259759, wd:Q7889';

function parseBookAdaptationBinding(b, qid) {
  const id = b.adaptation?.value?.split('/').pop();
  if (!id) return null;
  const imdbId = b.imdbId?.value || null;
  const gamespotSlug = b.gamespotSlug?.value || null;
  const typeId = b.type?.value?.split('/').pop() || null;
  const isGame = typeId === 'Q7889';
  const navId = isGame ? gamespotSlug : imdbId;
  if (!navId) return null;
  const sourceWorkId = b.sourceWork?.value?.split('/').pop() || null;
  return {
    id,
    label: b.adaptationLabel?.value || id,
    kind: isGame ? 'game' : 'title',
    navPack: isGame ? 'games' : 'movies',
    navId,
    mediaType: isGame ? 'game' : (typeId === 'Q11424' ? 'movie' : 'tv'),

    sourceWorkId,
    sourceWorkLabel: b.sourceWorkLabel?.value || null,
    isExactMatch: !!qid && sourceWorkId === qid
  };
}
function dedupeBookAdaptations(bindings, qid) {
  const map = new Map();
  for (const b of bindings) {
    const parsed = parseBookAdaptationBinding(b, qid);
    if (!parsed) continue;
    const existing = map.get(parsed.id);

    if (!existing || (parsed.isExactMatch && !existing.isExactMatch)) map.set(parsed.id, parsed);
  }

  return [...map.values()].sort((a, b) => {
    if (a.isExactMatch !== b.isExactMatch) return a.isExactMatch ? -1 : 1;
    return a.navPack === b.navPack ? 0 : (a.navPack === 'movies' ? -1 : 1);
  });
}

const BOOKS_AWARD_PARENT_VALUES = 'wd:Q46525 wd:Q572316 wd:Q160082 wd:Q37922 wd:Q188914 wd:Q194285 wd:Q754655 wd:Q594886 wd:Q848963 wd:Q833154 wd:Q1341487';
async function getBooksLiteraryAwards(qid) {
  if (!qid) return [];
  const sparql = `
SELECT DISTINCT ?award ?awardLabel ?date WHERE {
  hint:Query hint:optimizer "Runtime".
  wd:${qid}  wdt:P166 ?award.
  {
    VALUES ?parent {
${BOOKS_AWARD_PARENT_VALUES}
    }
    { ?award wdt:P31|wdt:P361|wdt:P279 ?parent. }
    UNION
    { ?award wdt:P31|wdt:P361|wdt:P279 ?mid. ?mid wdt:P31|wdt:P361|wdt:P279 ?parent. }
    UNION
    { VALUES ?award { ${BOOKS_AWARD_PARENT_VALUES} } }
  }
  OPTIONAL {
    wd:${qid}  p:P166 ?stmt.
    ?stmt ps:P166 ?award.
    OPTIONAL { ?stmt pq:P585 ?date. }
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". ?award rdfs:label ?awardLabel }
}
ORDER BY DESC(?date)
  `.trim();
  try {
    const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
    const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 12000);
    const bindings = (json && json.results && Array.isArray(json.results.bindings)) ? json.results.bindings : [];
    const awardMap = new Map();
    for (const b of bindings) {
      const id = b.award?.value?.split('/').pop();
      if (!id || awardMap.has(id)) continue;
      awardMap.set(id, { id, label: b.awardLabel?.value || id, year: b.date?.value ? Number(String(b.date.value).slice(0, 4)) : null });
    }
    return [...awardMap.values()];
  } catch (e) {
    logError('getBooksLiteraryAwards: threw error for', qid, '->', e && e.message ? e.message : e);
    return [];
  }
}

async function getBooksWorkWikidataBundle(qid, opts) {
  const wantSeries = !!(opts && opts.wantSeries);
  const wantAdaptations = !!(opts && opts.wantAdaptations);
  const wantLinks = !!(opts && opts.wantLinks);
  if (!qid || (!wantSeries && !wantAdaptations && !wantLinks)) {
    return { series: null, seriesBooks: [], adaptations: [], awards: [], links: {} };
  }

  const seriesBooksSparql = `
SELECT ?series ?seriesLabel ?book ?bookLabel ?ordinal ?bookOlId ?pubDate WHERE {
  {
    SELECT ?series ?seriesLabel ?book ?bookLabel (SAMPLE(?ord) AS ?ordinal) (SAMPLE(?ol) AS ?bookOlId) (SAMPLE(?pd) AS ?pubDate) WHERE {
      hint:Query hint:optimizer "Runtime".
      wd:${qid} wdt:P179 ?series.
      ?book wdt:P179 ?series; wdt:P648 ?ol.
      VALUES ?type { wd:Q7725634 wd:Q8261 wd:Q47461344 wd:Q571 }
      ?book wdt:P31 ?type.
      FILTER NOT EXISTS { ?book wdt:P629 [] }
      OPTIONAL { ?book p:P179 ?st. ?st ps:P179 ?series; pq:P1545 ?ord }
      OPTIONAL { ?book wdt:P577 ?pd }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". ?series rdfs:label ?seriesLabel. ?book rdfs:label ?bookLabel }
    }
    GROUP BY ?series ?seriesLabel ?book ?bookLabel
  }
}
ORDER BY DESC(BOUND(?ordinal)) xsd:integer(?ordinal) ?pubDate ?bookLabel
  `.trim();
  const adaptationsSparql = `
SELECT ?adaptation ?adaptationLabel ?imdbId ?gamespotSlug ?type ?typeLabel ?sourceWork ?sourceWorkLabel WHERE {
  hint:Query hint:optimizer "Runtime".
  wd:${qid} wdt:P179* ?sourceWork.
  VALUES ?type { wd:Q11424 wd:Q5398426 wd:Q1259759 wd:Q7889 wd:Q58171467 }
  ?adaptation wdt:P144 ?sourceWork; wdt:P31/wdt:P279* ?type.
  OPTIONAL { ?adaptation wdt:P345 ?imdbId }
  OPTIONAL { ?adaptation wdt:P5494 ?gamespotSlug }
  FILTER(BOUND(?imdbId) || BOUND(?gamespotSlug))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". ?adaptation rdfs:label ?adaptationLabel. ?type rdfs:label ?typeLabel. ?sourceWork rdfs:label ?sourceWorkLabel }
}
LIMIT 30
  `.trim();

  const linksSparql = `
SELECT ?goodreadsId ?googleBooksId ?wikipediaArticle WHERE {
  OPTIONAL { wd:${qid} wdt:P2969 ?goodreadsId. }
  OPTIONAL { wd:${qid} wdt:P675 ?googleBooksId. }
  OPTIONAL { ?wikipediaArticle schema:about wd:${qid}; schema:isPartOf <https://en.wikipedia.org/>. }
} LIMIT 1
  `.trim();

  const runQuery = async (sparql) => {
    const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
    const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 12000);
    return (json && json.results && Array.isArray(json.results.bindings)) ? json.results.bindings : [];
  };

  const [seriesResult, adaptationsResult, linksResult] = await Promise.allSettled([
    wantSeries ? runQuery(seriesBooksSparql) : Promise.resolve('skipped'),
    wantAdaptations ? runQuery(adaptationsSparql) : Promise.resolve('skipped'),
    wantLinks ? runQuery(linksSparql) : Promise.resolve('skipped')
  ]);

  let series = null;
  let seriesBooks = [];
  if (wantSeries && seriesResult.status === 'fulfilled') {

    const booksMap = new Map();
    for (const b of seriesResult.value) {
      const seriesId = b.series?.value?.split('/').pop();
      if (!series) series = { id: seriesId, label: b.seriesLabel?.value || seriesId };
      const bookId = b.book?.value?.split('/').pop();
      if (!bookId || booksMap.has(bookId)) continue;
      booksMap.set(bookId, {
        id: bookId,
        label: b.bookLabel?.value || bookId,
        ordinal: b.ordinal?.value ? parseInt(b.ordinal.value, 10) : null,
        olId: b.bookOlId?.value || null,
        pubDate: b.pubDate?.value || null
      });
    }

    const normalizeTitle = (label) => String(label || '').toLowerCase().trim().replace(/\s+/g, ' ');
    const byTitle = new Map();
    for (const book of booksMap.values()) {
      const key = normalizeTitle(book.label);
      const existing = byTitle.get(key);
      if (!existing) { byTitle.set(key, book); continue; }
      const existingHasOrdinal = existing.ordinal != null;
      const bookHasOrdinal = book.ordinal != null;
      let keepNew = false;
      if (bookHasOrdinal && !existingHasOrdinal) keepNew = true;
      else if (bookHasOrdinal && existingHasOrdinal) keepNew = book.ordinal < existing.ordinal;
      else if (!bookHasOrdinal && !existingHasOrdinal) keepNew = !!(book.pubDate && (!existing.pubDate || book.pubDate < existing.pubDate));
      if (keepNew) byTitle.set(key, book);
    }

    seriesBooks = [...byTitle.values()].sort((a, b) => {
      const aHas = a.ordinal != null, bHas = b.ordinal != null;
      if (aHas && bHas) return a.ordinal - b.ordinal;
      if (aHas !== bHas) return aHas ? -1 : 1;
      return 0;
    });
  } else if (wantSeries && seriesResult.status === 'rejected') {
    logError('getBooksWorkWikidataBundle: seriesBooks query failed for', qid, '->', seriesResult.reason?.message || seriesResult.reason);
  }

  let adaptations = [];
  if (wantAdaptations && adaptationsResult.status === 'fulfilled') {
    adaptations = dedupeBookAdaptations(adaptationsResult.value, qid);
  } else if (wantAdaptations && adaptationsResult.status === 'rejected') {
    logError('getBooksWorkWikidataBundle: adaptations query failed for', qid, '->', adaptationsResult.reason?.message || adaptationsResult.reason);
  }

  const awards = [];

  let links = {};
  if (wantLinks && linksResult.status === 'fulfilled' && linksResult.value.length) {
    const row = linksResult.value[0];
    links = {
      goodreadsId: row.goodreadsId?.value || null,
      googleBooksId: row.googleBooksId?.value || null,
      wikipediaUrl: row.wikipediaArticle?.value || null
    };
  } else if (wantLinks && linksResult.status === 'rejected') {
    logError('getBooksWorkWikidataBundle: links query failed for', qid, '->', linksResult.reason?.message || linksResult.reason);
  }

  log('getBooksWorkWikidataBundle:', qid, '-> series:', !!series, 'seriesBooks:', seriesBooks.length, 'adaptations:', adaptations.length, 'awards:', awards.length, 'links:', links);
  return { series, seriesBooks, adaptations, awards, links };
}

async function getBooksAuthorKnownFor(authorQid, limit = 25) {
  if (!authorQid) return [];
  const sparql = `
SELECT ?adaptation ?adaptationLabel ?imdbId ?gamespotSlug ?type ?sourceWork ?sourceWorkLabel WHERE {
  ?sourceWork wdt:P50 wd:${authorQid}.
  ?adaptation wdt:P144 ?sourceWork.
  ?adaptation wdt:P31/wdt:P279* ?type.
  FILTER(?type IN (${BOOKS_ADAPTATION_TYPE_VALUES}, wd:Q58171467))
  OPTIONAL { ?adaptation wdt:P345 ?imdbId. }
  OPTIONAL { ?adaptation wdt:P5494 ?gamespotSlug. }
  FILTER(BOUND(?imdbId) || BOUND(?gamespotSlug))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT ${limit}
  `.trim();
  try {
    const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
    const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 12000);
    const bindings = (json && json.results && Array.isArray(json.results.bindings)) ? json.results.bindings : [];
    return dedupeBookAdaptations(bindings);
  } catch (e) {
    logError('getBooksAuthorKnownFor: threw error for', authorQid, '->', e && e.message ? e.message : e);
    return [];
  }
}

async function getBooksAuthorWikidataFacts(qid) {
  if (!qid) return null;
  const query = `
SELECT ?birthDate ?deathDate ?birthPlaceLabel ?occupationLabel ?twitterHandle ?instagramHandle ?officialWebsite ?wikipediaArticle ?goodreadsAuthorId WHERE {
  OPTIONAL { wd:${qid} wdt:P569 ?birthDate. }
  OPTIONAL { wd:${qid} wdt:P570 ?deathDate. }
  OPTIONAL { wd:${qid} wdt:P19 ?birthPlace. }
  OPTIONAL { wd:${qid} wdt:P106 ?occupation. }
  OPTIONAL { wd:${qid} wdt:P2002 ?twitterHandle. }
  OPTIONAL { wd:${qid} wdt:P2003 ?instagramHandle. }
  OPTIONAL { wd:${qid} wdt:P856 ?officialWebsite. }
  OPTIONAL { wd:${qid} wdt:P2963 ?goodreadsAuthorId. }
  OPTIONAL {
    ?wikipediaArticle schema:about wd:${qid};
                      schema:isPartOf <https://en.wikipedia.org/>.
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 20
  `.trim();
  try {
    const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(query);
    const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 12000);
    const bindings = (json && json.results && Array.isArray(json.results.bindings)) ? json.results.bindings : [];
    if (!bindings.length) return null;
    let birthDate = null, deathDate = null, birthPlace = null, twitterHandle = null, instagramHandle = null, officialWebsite = null, wikipediaUrl = null, goodreadsAuthorId = null;
    const occupations = [];
    for (const row of bindings) {
      if (!birthDate && row.birthDate?.value) birthDate = row.birthDate.value;
      if (!deathDate && row.deathDate?.value) deathDate = row.deathDate.value;
      if (!birthPlace && row.birthPlaceLabel?.value) birthPlace = row.birthPlaceLabel.value;
      if (!twitterHandle && row.twitterHandle?.value) twitterHandle = row.twitterHandle.value;
      if (!instagramHandle && row.instagramHandle?.value) instagramHandle = row.instagramHandle.value;
      if (!officialWebsite && row.officialWebsite?.value) officialWebsite = row.officialWebsite.value;
      if (!wikipediaUrl && row.wikipediaArticle?.value) wikipediaUrl = row.wikipediaArticle.value;
      if (!goodreadsAuthorId && row.goodreadsAuthorId?.value) goodreadsAuthorId = row.goodreadsAuthorId.value;
      if (row.occupationLabel?.value) {
        const v = row.occupationLabel.value.trim();
        if (v && !occupations.includes(v)) occupations.push(v);
      }
    }
    return { birthDate, deathDate, birthPlace, occupations, twitterHandle, instagramHandle, officialWebsite, wikipediaUrl, goodreadsAuthorId };
  } catch (e) {
    logError('getBooksAuthorWikidataFacts: threw error for', qid, '->', e && e.message ? e.message : e);
    return null;
  }
}

async function resolveBooksAuthorWikidataQid(authorOlId) {
  if (!authorOlId) return null;
  const sparql = `SELECT ?author WHERE { ?author wdt:P648 "${authorOlId}". } LIMIT 1`;
  try {
    const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
    const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 8000);
    const bindings = (json && json.results && Array.isArray(json.results.bindings)) ? json.results.bindings : [];
    return bindings[0]?.author?.value?.split('/').pop() || null;
  } catch (e) {
    logError('resolveBooksAuthorWikidataQid: threw error for', authorOlId, '->', e && e.message ? e.message : e);
    return null;
  }
}

const BOOKS_WORK_ENTITY_TYPES = 'wd:Q571, wd:Q7725634, wd:Q8261, wd:Q1004, wd:Q14406742, wd:Q747381, wd:Q21198342, wd:Q47461344';

function booksNormalizeWorkTitleForSearch(rawTitle) {
  if (typeof rawTitle !== 'string') return '';
  let normalizedTitle = rawTitle.replace(/\s+/g, ' ').trim();
  if (!normalizedTitle) return '';

  const trailingParenMatch = normalizedTitle.match(/\s*\(([^()]*)\)\s*$/);
  if (trailingParenMatch) {
    const parenContent = trailingParenMatch[1] || '';
    const parenHasSeriesMeta = /#\s*\d/.test(parenContent)
      || /\b(vol\.?|volume|book|bk\.?|part|pt\.?|tome|band|chapter|no\.?)\s*#?\s*\d/i.test(parenContent);
    const parenIsMediumTag = /^\s*(graphic novel|light novel|manga|comics?|novel|book|collection|omnibus|complete(\s+collection)?|deluxe edition|special edition|annotated|illustrated)\s*$/i.test(parenContent);
    if (parenHasSeriesMeta || parenIsMediumTag) {
      normalizedTitle = normalizedTitle.slice(0, trailingParenMatch.index).trim();
    }
  }

  const commaSegments = normalizedTitle.split(',');
  if (commaSegments.length > 1) {
    const tailAfterComma = commaSegments.slice(1).join(',');
    const tailIsVolumeMeta = /\b(vol\.?|volume|book|bk\.?|part|pt\.?|tome|band|chapter)\b/i.test(tailAfterComma)
      || /#\s*\d/.test(tailAfterComma);
    if (tailIsVolumeMeta) normalizedTitle = commaSegments[0].trim();
  }

  normalizedTitle = normalizedTitle.replace(/\b(volumes?|vol\.?|books?|bk\.?|parts?|pt\.?|tomes?|bands?|chapters?|v\.?)\s*#?\s*(\d+|[ivxlc]+)(\s*[-–]\s*(\d+|[ivxlc]+))?\b/gi, ' ');

  normalizedTitle = normalizedTitle.replace(/#\s*\d+.*$/, ' ');

  normalizedTitle = normalizedTitle.replace(/\b\d+(st|nd|rd|th)\s+edition\b/gi, ' ');
  normalizedTitle = normalizedTitle.replace(/\b(revised|special|collector'?s?|deluxe|limited|illustrated|annotated|critical|definitive|updated|expanded|unabridged|abridged|first|second|third)\s+edition\b/gi, ' ');

  normalizedTitle = normalizedTitle.replace(/\b(complete\s+(edition|collection|series|works)|collected\s+works|omnibus)\s*$/gi, ' ');
  normalizedTitle = normalizedTitle.replace(/\b(unabridged|abridged|hardcover|paperback|kindle|audiobook|ebook|audio\s*cd)\s*$/gi, ' ');
  normalizedTitle = normalizedTitle.replace(/\s+[-–:,]?\s*(graphic novel|light novel|manga|comics?)\s*$/gi, ' ');

  const trailingYearMatch = normalizedTitle.match(/\s*[\(\[]\s*(1[0-9]{3}|20[0-9]{2})\s*[\)\]]\s*$/)
    || normalizedTitle.match(/\s+[-–:,]\s*(1[0-9]{3}|20[0-9]{2})\s*$/);
  if (trailingYearMatch && normalizedTitle.slice(0, trailingYearMatch.index).trim()) {
    normalizedTitle = normalizedTitle.slice(0, trailingYearMatch.index).trim();
  }

  normalizedTitle = normalizedTitle.replace(/\s*[-–:,;\/]+\s*$/g, '').replace(/\s{2,}/g, ' ').trim();
  return normalizedTitle;
}

async function booksResolveWorkQidByOpenLibraryId(openLibraryId) {
  const rawId = String(openLibraryId || '').toUpperCase();
  const idMatch = rawId.match(/(OL\d+[WM])/);
  if (!idMatch) return null;
  const cleanId = idMatch[1];
  const sparqlQuery = `SELECT ?item WHERE {\n  ?item wdt:P648 "${cleanId}".\n}\nLIMIT 1`;
  try {
    const requestUrl = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparqlQuery);
    const responseJson = await fetchJson(requestUrl, { Accept: 'application/sparql-results+json' }, 8000);
    const bindings = (responseJson && responseJson.results && Array.isArray(responseJson.results.bindings)) ? responseJson.results.bindings : [];
    const foundQid = bindings[0]?.item?.value?.split('/').pop() || null;
    if (foundQid) log('booksResolveWorkQidByOpenLibraryId:', cleanId, '->', foundQid);
    return foundQid;
  } catch (requestError) {
    logError('booksResolveWorkQidByOpenLibraryId: threw error for', cleanId, '->', requestError && requestError.message ? requestError.message : requestError);
    return null;
  }
}

async function booksSearchWorkCandidatesByRawTitle(normalizedTitle) {
  const searchText = String(normalizedTitle || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  if (!searchText) return [];
  const escapedSearchText = searchText.replace(/\\/g, ' ').replace(/"/g, ' ');
  const sparqlQuery = [
    'SELECT ?item ?itemLabel ?itemDescription ?sitelinks WHERE {',
    '  SERVICE wikibase:mwapi {',
    '    bd:serviceParam wikibase:endpoint "www.wikidata.org";',
    '                    wikibase:api "EntitySearch";',
    `                    mwapi:search "${escapedSearchText}";`,
    '                    mwapi:language "en";',
    '                    mwapi:limit "100".',
    '    ?item wikibase:apiOutputItem mwapi:item.',
    '  }',
    '  ?item wdt:P31 ?workType.',
    `  FILTER(?workType IN (${BOOKS_WORK_ENTITY_TYPES}))`,
    '  ?item wikibase:sitelinks ?sitelinks.',
    '  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul". }',
    '  hint:Query hint:optimizer "Runtime".',
    '}',
    'ORDER BY DESC(?sitelinks)',
    'LIMIT 20'
  ].join('\n');
  try {
    const requestUrl = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparqlQuery);
    const responseJson = await fetchJson(requestUrl, { Accept: 'application/sparql-results+json' }, 12000);
    const bindings = (responseJson && responseJson.results && Array.isArray(responseJson.results.bindings)) ? responseJson.results.bindings : [];
    const candidateList = [];
    for (const bindingRow of bindings) {
      const itemUrl = bindingRow.item && bindingRow.item.value;
      const candidateQid = itemUrl ? String(itemUrl).split('/').pop() : null;
      if (!candidateQid) continue;
      candidateList.push({
        qid: candidateQid,
        label: bindingRow.itemLabel ? String(bindingRow.itemLabel.value) : '',
        description: bindingRow.itemDescription ? String(bindingRow.itemDescription.value) : '',
        sitelinks: Number(bindingRow.sitelinks ? bindingRow.sitelinks.value : 0) || 0
      });
    }
    log('booksSearchWorkCandidatesByRawTitle:', searchText, '->', candidateList.length, 'candidates');
    return candidateList;
  } catch (requestError) {
    logError('booksSearchWorkCandidatesByRawTitle: threw error for', searchText, '->', requestError && requestError.message ? requestError.message : requestError);
    return [];
  }
}

function booksPickBestWorkCandidateByAuthor(candidateList, authorName) {
  if (!Array.isArray(candidateList) || !candidateList.length) return null;
  if (!authorName || !String(authorName).trim()) {
    log('booksPickBestWorkCandidateByAuthor: no author given, keeping top sitelinks hit:', candidateList[0].qid);
    return candidateList[0];
  }
  const authorPersons = String(authorName).split(/[,&;]+/).map((personName) => personName.trim()).filter(Boolean);
  const authorNameParts = [];
  for (const personName of authorPersons) {
    const nameTokens = personName.toLowerCase().split(/\s+/).filter(Boolean);
    if (!nameTokens.length) continue;
    authorNameParts.push({ fullName: nameTokens.join(' '), firstName: nameTokens[0], lastName: nameTokens[nameTokens.length - 1] });
  }
  if (!authorNameParts.length) return candidateList[0];

  let bestCandidate = null;
  let bestScore = -1;
  for (const candidate of candidateList) {
    const candidateDescription = String(candidate.description || '').toLowerCase();
    let candidateScore = 0;
    for (const authorParts of authorNameParts) {
      if (authorParts.fullName.length > 3 && candidateDescription.includes(authorParts.fullName)) candidateScore += 3;
      else if (authorParts.lastName.length >= 3 && candidateDescription.includes(authorParts.lastName)) candidateScore += 2;
      else if (authorParts.firstName.length >= 3 && candidateDescription.includes(authorParts.firstName)) candidateScore += 1;
    }
    if (candidateScore > bestScore) { bestScore = candidateScore; bestCandidate = candidate; }
  }
  if (bestCandidate && bestScore > 0) {
    log('booksPickBestWorkCandidateByAuthor: author match ->', bestCandidate.qid, '(score ' + bestScore + ')');
    return bestCandidate;
  }
  log('booksPickBestWorkCandidateByAuthor: no author match, keeping top sitelinks hit:', candidateList[0].qid);
  return candidateList[0];
}

async function resolveBooksWorkQid(openLibraryWorkId, title, authorName) {
  const trimmedTitle = String(title || '').replace(/\s+/g, ' ').trim();
  const displayLabel = '"' + trimmedTitle + '" (' + String(openLibraryWorkId || '').trim() + ')';
  try {

    const qidById = await booksResolveWorkQidByOpenLibraryId(openLibraryWorkId);
    if (qidById) {
      log('resolveBooksWorkQid: ' + displayLabel + ' -> ' + qidById + ' (stage: openlibrary-id P648)');
      return { qid: qidById, resolutionStage: 'openlibrary-id' };
    }
    log('resolveBooksWorkQid: ' + displayLabel + ' not found via openlibrary-id, trying SPARQL title search');

    const normalizedTitle = booksNormalizeWorkTitleForSearch(trimmedTitle);
    const searchTitle = normalizedTitle || trimmedTitle.slice(0, 120);
    if (searchTitle) {
      const candidateList = await booksSearchWorkCandidatesByRawTitle(searchTitle);
      const bestCandidate = booksPickBestWorkCandidateByAuthor(candidateList, authorName);
      if (bestCandidate && bestCandidate.qid) {
        const normalizedNote = searchTitle !== trimmedTitle ? ', normalized "' + trimmedTitle + '" -> "' + searchTitle + '"' : '';
        log('resolveBooksWorkQid: ' + displayLabel + ' -> ' + bestCandidate.qid + ' (stage: sparql-title-search' + normalizedNote + ')');
        return { qid: bestCandidate.qid, resolutionStage: 'sparql-title' };
      }
      log('resolveBooksWorkQid: ' + displayLabel + ' SPARQL found nothing for "' + searchTitle + '", trying legacy wbsearch fallback');
    }

    const legacyQid = await resolveBooksWikidataQidByTitle(title, authorName);
    if (legacyQid) {
      log('resolveBooksWorkQid: ' + displayLabel + ' -> ' + legacyQid + ' (stage: legacy-wbsearch)');
      return { qid: legacyQid, resolutionStage: 'legacy-wbsearch' };
    }
    log('resolveBooksWorkQid: ' + displayLabel + ' -> no Wikidata QID found (all stages missed)');
    return { qid: null, resolutionStage: 'not-found' };
  } catch (resolveError) {
    logError('resolveBooksWorkQid: ' + displayLabel + ' -> error, no QID (' + (resolveError && resolveError.message ? resolveError.message : resolveError) + ')');
    return { qid: null, resolutionStage: 'error' };
  }
}

async function resolveBooksWikidataQidByTitle(title, authorName) {
  const searchTitle = (title || '').trim().slice(0, 80);
  if (!searchTitle) return null;
  const author = (authorName || '').trim().slice(0, 60);
  if (!author) return null;

  try {

    const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(searchTitle)}&language=en&format=json&type=item&limit=10&origin=*`;
    const data = await fetchJson(url, { Accept: 'application/json' }, 8000);
    const candidates = Array.isArray(data?.search) ? data.search : [];
    if (!candidates.length) {
      log('resolveBooksWikidataQidByTitle: no candidates for', searchTitle);
      return null;
    }

    const authorLastName = author.split(/\s+/).pop()?.toLowerCase() || '';
    const authorFirstName = author.split(/\s+/)[0]?.toLowerCase() || '';

    for (const c of candidates) {
      const desc = (c.description || '').toLowerCase();
      if (desc && (desc.includes(authorLastName) || desc.includes(authorFirstName))) {
        log('resolveBooksWikidataQidByTitle:', searchTitle, `+ ${author} ->`, c.id, '(found in description)');
        return c.id;
      }
    }

    log('resolveBooksWikidataQidByTitle: not in description, checking authors for', searchTitle);
    const ids = candidates.map(c => c.id).join('|');
    const detailsUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids}&props=claims&languages=en&format=json&origin=*`;
    const details = await fetchJson(detailsUrl, { Accept: 'application/json' }, 8000);

    for (const id of Object.keys(details.entities || {})) {
      const e = details.entities[id];
      const p50 = JSON.stringify(e.claims?.P50 || '').toLowerCase();
      const p2093 = JSON.stringify(e.claims?.P2093 || '').toLowerCase();
      if (p50.includes(authorLastName) || p50.includes(authorFirstName) || p2093.includes(authorLastName) || p2093.includes(authorFirstName)) {
        log('resolveBooksWikidataQidByTitle:', searchTitle, `+ ${author} ->`, id, '(found in P50/P2093)');
        return id;
      }
    }

    log('resolveBooksWikidataQidByTitle: no match for', searchTitle, `+ ${author} -> null`);
    return null;

  } catch (e) {
    logError('resolveBooksWikidataQidByTitle: threw error for', `${searchTitle} + ${author}`, '->', e && e.message ? e.message : e);
    return null;
  }
}

async function getMusicArtistWikidataInfo(artistName) {
  const name = (artistName || '').trim();
  if (!name) return null;
  let qid = null;
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&type=item&limit=1&format=json&origin=*`;
    const data = await fetchJson(url, { Accept: 'application/json' }, 8000);
    qid = data?.search?.[0]?.id || null;
  } catch (e) {
    logError('getMusicArtistWikidataInfo: qid search failed for', name, '->', e && e.message ? e.message : e);
    return null;
  }
  if (!qid) return null;

  try {
    const sparql = `
SELECT ?originLabel ?countryLabel ?genreLabel ?formed ?inceptionLabel ?typeLabel ?mbid WHERE {
  OPTIONAL { wd:${qid} wdt:P740 ?origin. }
  OPTIONAL { wd:${qid} wdt:P495 ?country. }
  OPTIONAL { wd:${qid} wdt:P17 ?country. }
  OPTIONAL { wd:${qid} wdt:P136 ?genre. }
  OPTIONAL { wd:${qid} wdt:P571 ?formed. }
  OPTIONAL { wd:${qid} wdt:P2031 ?inception. }
  OPTIONAL { wd:${qid} wdt:P31 ?type. }
  OPTIONAL { wd:${qid} wdt:P434 ?mbid. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 20
    `.trim();
    const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
    const data = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 10000);
    const bindings = data && data.results && Array.isArray(data.results.bindings) ? data.results.bindings : [];
    if (!bindings.length) return null;
    const first = bindings[0];
    const genres = [...new Set(bindings.map((b) => b.genreLabel?.value).filter(Boolean))];
    const result = {
      qid,
      origin: first.originLabel?.value || null,
      country: first.countryLabel?.value || null,
      genreWikidata: genres,
      formed: first.formed?.value || first.inceptionLabel?.value || null,
      typeLabel: first.typeLabel?.value || null,
      mbid: first.mbid?.value || null
    };
    log('getMusicArtistWikidataInfo:', name, '->', qid, result);
    return result;
  } catch (e) {
    logError('getMusicArtistWikidataInfo: sparql failed for', name, qid, '->', e && e.message ? e.message : e);
    return null;
  }
}

async function getMusicAlbumWikidataInfo(artistName, albumName) {
  if (!artistName || !albumName) return null;
  let qid = null;
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(albumName + ' ' + artistName)}&language=en&type=item&limit=1&format=json&origin=*`;
    const data = await fetchJson(url, { Accept: 'application/json' }, 8000);
    qid = data?.search?.[0]?.id || null;
  } catch (e) {
    logError('getMusicAlbumWikidataInfo: qid search failed for', albumName, artistName, '->', e && e.message ? e.message : e);
    return null;
  }
  if (!qid) return null;

  try {
    const sparql = `
SELECT ?labelLabel ?sales ?awardLabel ?distributorLabel ?genreLabel WHERE {
  OPTIONAL { wd:${qid} wdt:P1114 ?sales. }
  OPTIONAL { wd:${qid} wdt:P1411 ?award. }
  OPTIONAL { wd:${qid} wdt:P750 ?distributor. }
  OPTIONAL { wd:${qid} wdt:P136 ?genre. }
  OPTIONAL { wd:${qid} wdt:P264 ?label. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 20
    `.trim();
    const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);
    const data = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 10000);
    const bindings = data && data.results && Array.isArray(data.results.bindings) ? data.results.bindings : [];
    if (!bindings.length) return null;
    const b = bindings[0];
    const genres = [...new Set(bindings.map((x) => x.genreLabel?.value).filter(Boolean))];
    const result = { qid, label: b.labelLabel?.value || null, sales: b.sales?.value || null, award: b.awardLabel?.value || null, distributor: b.distributorLabel?.value || null, genres };
    log('getMusicAlbumWikidataInfo:', albumName, artistName, '->', qid, result);
    return result;
  } catch (e) {
    logError('getMusicAlbumWikidataInfo: sparql failed for', albumName, artistName, qid, '->', e && e.message ? e.message : e);
    return null;
  }
}

async function getFootballPlayerWikidataLinks(transfermarktPlayerId) {
  if (!transfermarktPlayerId) return {};

  const query = `
SELECT ?officialWebsite ?soccerwayId ?wikipediaArticle WHERE {
  ?item wdt:P2446 "${transfermarktPlayerId}".
  OPTIONAL { ?item wdt:P856 ?officialWebsite. }
  OPTIONAL { ?item wdt:P2369 ?soccerwayId. }
  OPTIONAL {
    ?wikipediaArticle schema:about ?item;
                      schema:isPartOf <https://en.wikipedia.org/>.
  }
}
LIMIT 1
  `.trim();

  const url =
    'https://query.wikidata.org/sparql?format=json&query=' +
    encodeURIComponent(query);

  const result = { officialWebsite: null, soccerwayId: null, wikipediaArticle: null };

  try {
    const json = await fetchJson(url, { Accept: 'application/sparql-results+json' }, 8000);
    const bindings = json && json.results && Array.isArray(json.results.bindings)
      ? json.results.bindings
      : [];

    if (bindings.length) {
      const row = bindings[0];
      result.officialWebsite = row.officialWebsite ? String(row.officialWebsite.value) : null;
      result.soccerwayId = row.soccerwayId ? String(row.soccerwayId.value) : null;
      result.wikipediaArticle = row.wikipediaArticle ? String(row.wikipediaArticle.value) : null;
    }

    log('getFootballPlayerWikidataLinks:', transfermarktPlayerId, '->', result);
    return result;
  } catch (e) {
    logError('getFootballPlayerWikidataLinks: threw error for', transfermarktPlayerId, '->', e && e.message ? e.message : e);
    return result;
  }
}

