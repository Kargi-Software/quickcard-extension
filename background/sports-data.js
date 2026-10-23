

if (typeof fetchJson === 'undefined') {
  async function fetchJson(url, headers = {}, timeout = 15000) {
    const ctrl = new AbortController();
    const timeoutHandle = setTimeout(() => ctrl.abort(), timeout);
    try {
      const res = await fetch(url, { headers, signal: ctrl.signal });
      if (!res.ok) throw new Error('http ' + res.status);
      return await res.json();
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}

const ESPN_LEAGUE_CONFIG = {
  nba: { sport: 'basketball', league: 'nba', webSlug: 'nba', label: 'NBA', prop: 'P3685 (player) or P3647 (coach, legacy)', sourcePrefix: 'ESPN NBA [Wikidata P3685]' },
  nfl: { sport: 'football', league: 'nfl', webSlug: 'nfl', label: 'NFL', prop: 'P3566 (player) or P3680 (coach, legacy)', sourcePrefix: 'ESPN NFL [Wikidata]' },
  mlb: { sport: 'baseball', league: 'mlb', webSlug: 'mlb', label: 'MLB', prop: 'P3571', sourcePrefix: 'ESPN MLB [Wikidata]' },
  nhl: { sport: 'hockey', league: 'nhl', webSlug: 'nhl', label: 'NHL', prop: 'P... (no confirmed ESPN-id property - P3522 is NHL.com\'s own id, not ESPN\'s)', sourcePrefix: 'ESPN NHL [Wikidata]' },
  tennis: { sport: 'tennis', league: 'atp', webSlug: 'tennis', label: 'ATP', prop: 'P...', sourcePrefix: 'ESPN Tennis [Wikidata]' },
  mma: { sport: 'mma', league: 'ufc', webSlug: 'mma', label: 'UFC', prop: 'P...', sourcePrefix: 'ESPN MMA [Wikidata]' },
  golf: { sport: 'golf', league: 'pga', webSlug: 'golf', label: 'PGA', prop: 'P...', sourcePrefix: 'ESPN Golf [Wikidata]' }
};

async function fetchEspnOverviewDirect(sport, league, espnId){
  const url = `https://site.web.api.espn.com/apis/common/v3/sports/${sport}/${league}/athletes/${espnId}/overview`;
  try { const json = await fetchJson(url, {}, 12000); return { data:json, url, ok:true }; } catch(e){ return { data:null, url, ok:false, error:String(e) }; }
}
async function fetchEspnStatsDirect(sport, league, espnId){
  const url = `https://site.web.api.espn.com/apis/common/v3/sports/${sport}/${league}/athletes/${espnId}/stats`;
  try { const json = await fetchJson(url, {}, 12000); return { data:json, url, ok:true }; } catch(e){ return { data:null, url, ok:false, error:String(e) }; }
}

const ESPN_SPORT_MAP = {
  'basketball': 'nba',
  'american football': 'nfl',
  'gridiron football': 'nfl',
  'baseball': 'mlb',
  'ice hockey': 'nhl',
  'tennis': 'tennis',
  'mixed martial arts': 'mma',
  'golf': 'golf'
};
function detectEspnLeagueKeyFromSport(sportLabel){
  const lowerSport = (sportLabel||'').toLowerCase();
  if (ESPN_SPORT_MAP[lowerSport]) return ESPN_SPORT_MAP[lowerSport];
  for (const key of Object.keys(ESPN_SPORT_MAP)){
    if (lowerSport.includes(key)) return ESPN_SPORT_MAP[key];
  }
  return null;
}

function espnAthleteNameScore(candidateName, targetName){
  if (!candidateName || !targetName) return 0;
  const normalizedCandidate = candidateName.toLowerCase().trim();
  const normalizedTarget = targetName.toLowerCase().trim();
  if (normalizedCandidate === normalizedTarget) return 100;
  let score = 0;
  const targetParts = normalizedTarget.split(/\s+/).filter(Boolean);
  const last = targetParts[targetParts.length - 1] || '';
  if (last && normalizedCandidate.includes(last)) score += 20;
  if (normalizedTarget && normalizedCandidate.includes(normalizedTarget)) score += 30;
  score += targetParts.filter(part => part.length > 1 && normalizedCandidate.includes(part)).length * 10;
  return score;
}

function espnNumericIdFromSearchResult(candidate) {
  const uidMatch = typeof candidate.uid === 'string' ? candidate.uid.match(/a:(\d+)/) : null;
  if (uidMatch) return uidMatch[1];
  const linkUrl = (candidate.link && (candidate.link.web || candidate.link.app)) || '';
  const linkMatch = typeof linkUrl === 'string' ? linkUrl.match(/\/id\/(\d+)/) : null;
  if (linkMatch) return linkMatch[1];
  return candidate.id;
}

function extractEspnAthleteCandidates(data){
  if (!data) return [];
  if (Array.isArray(data.athletes)) {
    return data.athletes.map(athlete => ({ id: athlete.id, displayName: athlete.displayName || athlete.fullName || athlete.name || '' }));
  }
  if (Array.isArray(data.items)) {
    return data.items.map(item => ({ id: item.id, displayName: item.displayName || item.name || '' }));
  }
  if (Array.isArray(data.results)) {

    const out = [];
    for (const r of data.results) {
      if (r.type !== 'player') continue;
      for (const c of (r.contents || [])) out.push({ id: espnNumericIdFromSearchResult(c), displayName: c.displayName || c.name || '' });
    }
    return out;
  }
  return [];
}

async function espnSearchAthleteIdByName(sport, league, name){
  const endpoints = [

    `https://site.web.api.espn.com/apis/search/v2?query=${encodeURIComponent(name)}&limit=10`,
    `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/athletes?limit=2000&search=${encodeURIComponent(name)}`,
    `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/athletes?limit=20000&active=true`
  ];
  for (const url of endpoints){
    try {
      const data = await fetchJson(url, {}, 12000);
      const candidates = extractEspnAthleteCandidates(data);
      if (!candidates.length) continue;
      let best = null, bestScore = 0;
      for (const cand of candidates){
        const score = espnAthleteNameScore(cand.displayName, name);
        if (score > bestScore) { bestScore = score; best = cand; }
      }

      if (best && best.id && bestScore >= 20) return { id: best.id, url, score: bestScore, displayName: best.displayName || '' };
    } catch (e) {  }
  }
  return null;
}

async function enrichMLBDirect(name){
  try {
    const searchUrl = `https://statsapi.mlb.com/api/v1/people/search?names=${encodeURIComponent(name)}`;
    const sData = await fetchJson(searchUrl, {}, 10000);
    const person = sData.people?.[0];
    if (!person) return null;
    const id = person.id;
    const statsUrl = `https://statsapi.mlb.com/api/v1/people/${id}/stats?stats=career&group=hitting,pitching`;
    const statsData = await fetchJson(statsUrl, {}, 10000);
    const proStats = {};
    for (const s of (statsData.stats||[])){
      const splits = s.splits?.[0]?.stat;
      if (!splits) continue;
      if (s.group.displayName==='hitting'){
        if (splits.avg) proStats['AVG [MLB StatsAPI - direct search]'] = splits.avg;
        if (splits.homeRuns) proStats['HR [MLB StatsAPI]'] = String(splits.homeRuns);
        if (splits.rbi) proStats['RBI [MLB StatsAPI]'] = String(splits.rbi);
      }
      if (s.group.displayName==='pitching'){
        if (splits.era) proStats['ERA [MLB StatsAPI]'] = splits.era;
        if (splits.wins) proStats['W [MLB StatsAPI]'] = String(splits.wins);
      }
    }
    return { proStats, mlbId:id, sources:[searchUrl, statsUrl] };
  } catch(e){ return { error:String(e) }; }
}

function parseEspnSeasonAverages(overview){
  const statistics = overview && overview.statistics;
  if (!statistics || !Array.isArray(statistics.labels) || !Array.isArray(statistics.splits)) return [];

  const names = Array.isArray(statistics.names) ? statistics.names.slice() : [];
  const out = [];
  for (const split of statistics.splits){
    if (!split || !Array.isArray(split.stats)) continue;
    out.push({ split: split.displayName || '', labels: statistics.labels.slice(), names, cells: split.stats.slice() });
  }
  return out;
}

const ESPN_HEADLINE_STAT_GROUPS = {
  nba: [
    { prefix: '', names: ['avgPoints', 'avgRebounds', 'avgAssists', 'avgSteals', 'avgBlocks', 'fieldGoalPct', 'threePointFieldGoalPct', 'freeThrowPct'] }
  ],
  nfl: [
    { prefix: 'Pass', names: ['passingYards', 'passingTouchdowns', 'interceptions', 'completionPct', 'QBRating', 'yardsPerPassAttempt'] },
    { prefix: 'Rush', names: ['rushingYards', 'rushingTouchdowns', 'yardsPerRushAttempt'] },
    { prefix: 'Rec', names: ['receptions', 'receivingYards', 'receivingTouchdowns', 'yardsPerReception'] },
    { prefix: 'Def', names: ['totalTackles', 'sacks', 'defensiveInterceptions'] }
  ],
  nhl: [

    { prefix: '', names: ['points', 'goals', 'assists', 'plusMinus', 'penaltyMinutes', 'shotsTotal'] },
    { prefix: '', names: ['wins', 'goalsAgainstAverage', 'savePct', 'shutouts'] }
  ],

  mlb_pitching: [{ prefix: '', names: ['earnedRunAverage', 'era', 'wins', 'strikeouts', 'saves', 'inningsPitched', 'whip'] }],
  mlb_hitting: [{ prefix: '', names: ['avg', 'homeRuns', 'RBIs', 'hits', 'stolenBases', 'OPS'] }]
};
function mlbHeadlineGroupFor(statsTitle){
  return /pitch/i.test(statsTitle || '') ? ESPN_HEADLINE_STAT_GROUPS.mlb_pitching : ESPN_HEADLINE_STAT_GROUPS.mlb_hitting;
}

function parseEspnRecentGames(overview, limit){
  const gameLog = overview && overview.gameLog;
  if (!gameLog || typeof gameLog.events !== 'object' || !gameLog.events) return [];
  const blocks = Array.isArray(gameLog.statistics) ? gameLog.statistics : [];
  const seen = new Set();
  const games = [];
  for (const statBlock of blocks){
    const names = Array.isArray(statBlock && statBlock.names) ? statBlock.names : [];
    let highlightIdx = names.indexOf('points');
    let highlightLabel = '';
    if (highlightIdx >= 0) {
      highlightLabel = 'pts';
    } else {
      highlightIdx = (Array.isArray(statBlock && statBlock.labels) ? statBlock.labels : []).indexOf('PTS');
      if (highlightIdx >= 0) highlightLabel = 'pts';
    }
    const blockEvents = statBlock && Array.isArray(statBlock.events) ? statBlock.events : [];
    for (const blockEvent of blockEvents){
      if (!blockEvent || blockEvent.eventId == null || !Array.isArray(blockEvent.stats)) continue;
      const key = String(blockEvent.eventId);
      if (seen.has(key)) continue;
      const meta = gameLog.events[key];
      if (!meta) continue;
      seen.add(key);
      games.push({
        id: key,
        date: meta.gameDate || '',
        atVs: meta.atVs || '',
        result: meta.gameResult || '',
        score: meta.score || '',
        note: meta.eventNote || '',
        opponent: (meta.opponent && meta.opponent.displayName) || '',
        opponentAbbrev: (meta.opponent && meta.opponent.abbreviation) || '',
        points: highlightIdx >= 0 ? blockEvent.stats[highlightIdx] : '',
        pointsLabel: highlightLabel
      });
    }
  }
  games.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  return typeof limit === 'number' ? games.slice(0, limit) : games;
}

function parseEspnNextGame(overview){
  const events = overview && overview.nextGame && overview.nextGame.league && Array.isArray(overview.nextGame.league.events)
    ? overview.nextGame.league.events : [];
  if (!events.length) return null;
  const nextEvent = events[0];
  const competitors = Array.isArray(nextEvent.competitors) ? nextEvent.competitors : [];
  return {
    name: nextEvent.name || '',
    shortName: nextEvent.shortName || '',
    date: nextEvent.date || '',
    location: nextEvent.location || '',
    competitors: competitors.map(competitor => ({
      homeAway: competitor.homeAway || '',
      name: competitor.displayName || '',
      abbrev: competitor.abbreviation || '',
      logo: competitor.logo || ''
    }))
  };
}

function parseEspnAwards(overview){
  const awards = overview && overview.awards;
  if (!Array.isArray(awards)) return [];
  const out = [];
  for (const award of awards){
    if (!award || !award.name) continue;
    out.push({
      name: award.name,
      displayCount: award.displayCount || '',
      seasons: Array.isArray(award.seasons) ? award.seasons.slice() : []
    });
  }
  return out;
}

const ESPN_STATS_CATEGORY_PREFERENCE = {
  nba: ['averages'],
  nfl: ['passing', 'rushing', 'receiving'],
  mlb: ['pitching', 'hitting'],
  nhl: []
};

const ESPN_SEASON_LOG_HIGHLIGHT_NAMES = {
  nba: ['avgPoints', 'avgRebounds', 'avgAssists'],
  nfl: ['passingYards', 'passingTouchdowns', 'interceptions'],
  nhl: ['points', 'goals', 'assists'],
  mlb: ['era', 'strikeouts', 'wins']
};
function parseEspnSeasonLog(statsData, leagueKey){
  const cats = statsData && Array.isArray(statsData.categories) ? statsData.categories : [];
  const teamsMap = (statsData && statsData.teams && typeof statsData.teams === 'object') ? statsData.teams : {};
  const teamNameById = {};
  for (const [slug, team] of Object.entries(teamsMap)){
    if (team && team.id != null) teamNameById[String(team.id)] = team.displayName || slug;
  }
  let category = null;
  const preferredNames = (leagueKey && ESPN_STATS_CATEGORY_PREFERENCE[leagueKey]) || [];
  for (const preferredName of preferredNames){
    category = cats.find(cat => cat && cat.name === preferredName && Array.isArray(cat.statistics) && cat.statistics.length);
    if (category) break;
  }
  if (!category) category = cats.find(cat => cat && Array.isArray(cat.statistics) && cat.statistics.length);
  if (!category) return [];
  const names = Array.isArray(category.names) ? category.names : [];
  const labels = Array.isArray(category.labels) ? category.labels.slice() : [];
  const lowerNames = names.map(name => String(name || '').toLowerCase());

  const highlightNamePrefs = (leagueKey && ESPN_SEASON_LOG_HIGHLIGHT_NAMES[leagueKey]) || [];
  const highlightIndexes = [];
  for (const highlightName of highlightNamePrefs){
    const idx = lowerNames.indexOf(highlightName.toLowerCase());
    if (idx >= 0) highlightIndexes.push(idx);
  }
  const rows = [];
  for (const seasonEntry of category.statistics){
    if (!seasonEntry || !Array.isArray(seasonEntry.stats)) continue;
    rows.push({
      year: (seasonEntry.season && seasonEntry.season.year) || 0,
      season: (seasonEntry.season && seasonEntry.season.displayName) || '',
      team: teamNameById[String(seasonEntry.teamId)] || seasonEntry.teamSlug || '',
      position: seasonEntry.position || '',
      labels,
      cells: seasonEntry.stats.slice(),
      highlightIndexes: highlightIndexes.slice()
    });
  }
  rows.sort((a, b) => (b.year || 0) - (a.year || 0));
  return rows;
}

function parseEspnGolfOverview(overview) {
  if (!overview || typeof overview !== 'object') return null;
  const stats = overview.statistics || {};
  const labels = stats.displayNames || stats.labels || [];
  const splits = Array.isArray(stats.splits) ? stats.splits : [];
  let headline = [];
  const prefer = splits.find(s => /pga/i.test(s.displayName || '')) || splits[0];
  if (prefer && Array.isArray(prefer.stats)) {
    headline = prefer.stats.map((val, i) => ({
      label: labels[i] || stats.labels?.[i] || `Stat ${i + 1}`,
      value: val
    })).filter(x => x.value != null && String(x.value).length);
  }
  const rankings = [];
  const cats = (overview.seasonRankings && overview.seasonRankings.categories) || [];
  for (const c of cats.slice(0, 8)) {
    if (!c) continue;
    rankings.push({
      label: c.shortDisplayName || c.displayName || c.name || '',
      value: c.displayValue || '',
      rank: c.rankDisplayValue || (c.rank != null ? String(c.rank) : '')
    });
  }
  const recent = [];
  const rt = overview.recentTournaments;
  const events = Array.isArray(rt) ? rt : (rt && rt.events) || [];
  for (const ev of (events || []).slice(0, 5)) {
    recent.push({
      name: ev.displayName || ev.name || ev.tournamentName || '',
      result: ev.position || ev.finish || ev.score || '',
      date: ev.date || ev.endDate || ''
    });
  }
  return {
    title: stats.displayName || 'Season',
    splits: splits.map(s => ({
      name: s.displayName || '',
      stats: (s.stats || []).map((val, i) => ({ label: labels[i] || '', value: val }))
    })),
    headline,
    rankings,
    recent,
    nextTournament: overview.nextTournament || null
  };
}

async function fetchAndParseEspnLeagueData(cfg, id, leagueKey, sources, verifiedName){
  const [overviewRes, statsRes] = await Promise.all([
    fetchEspnOverviewDirect(cfg.sport, cfg.league, id),
    fetchEspnStatsDirect(cfg.sport, cfg.league, id)
  ]);
  const athleteName = verifiedName || '';
  let espn = null;
  if (overviewRes.ok){
    const overview = overviewRes.data;
    espn = {
      id: String(id),
      league: cfg.label,
      pageUrl: espnPlayerPageUrl(cfg, id),
      athleteName,

      statsTitle: (overview && overview.statistics && overview.statistics.displayName) || '',
      seasonAverages: parseEspnSeasonAverages(overview),
      recentGames: parseEspnRecentGames(overview, 5),
      nextGame: parseEspnNextGame(overview),
      awards: parseEspnAwards(overview),
      seasonLog: []
    };

    if (leagueKey === 'golf' && overview) {
      espn.golf = parseEspnGolfOverview(overview);

      if (espn.golf && espn.golf.headline && espn.golf.headline.length) {
        espn.seasonAverages = espn.golf.headline;
      }
    }
    sources.push(`ESPN overview OK: ${overviewRes.url}`);
  } else {
    sources.push(`ESPN overview FAILED: ${overviewRes.url} - ${overviewRes.error || ''}`);
  }
  if (statsRes.ok){
    if (!espn) {
      espn = { id: String(id), league: cfg.label, pageUrl: espnPlayerPageUrl(cfg, id),
               athleteName,
               statsTitle: '', seasonAverages: [], recentGames: [], nextGame: null,
               awards: [], seasonLog: [] };
    }
    espn.seasonLog = parseEspnSeasonLog(statsRes.data, leagueKey);
    sources.push(`ESPN stats OK: ${statsRes.url}`);
  } else {
    sources.push(`ESPN stats FAILED: ${statsRes.url} - ${statsRes.error || ''}`);
  }
  if (espn){

  }
  return espn;
}

function espnPlayerPageUrl(cfg, id){
  return `https://www.espn.com/${cfg.webSlug || cfg.league}/player/_/id/${id}`;
}

async function getEspnEnrichmentFromWikidataIds(bundle){
  const espnIds = bundle.espnIds || {};
  const sportLabel = bundle.sport || '';
  const name = bundle.name || '';
  const lowerSport = sportLabel.toLowerCase();

  let proStats = {};
  let espnId = null;
  let team = '';
  let espn = null;
  const sources = [];
  const logs = [];

  logs.push(`[Wikidata ESPN IDs] found: ${JSON.stringify(espnIds)} for ${name} (${sportLabel})`);

  const leagueKey = detectEspnLeagueKeyFromSport(sportLabel);
  const cfg = leagueKey ? ESPN_LEAGUE_CONFIG[leagueKey] : null;

  const ESPN_TEAM_SPORT_LEAGUES = ['nba', 'nfl', 'mlb', 'nhl'];
  if (cfg && ESPN_TEAM_SPORT_LEAGUES.includes(leagueKey)) {
    let id = espnIds[leagueKey]?.id || null;

    let matchedDisplayName = '';
    if (id) {
      logs.push(`[ESPN ${cfg.label}] Using Wikidata ID ${id} (${espnIds[leagueKey].prop})`);
      sources.push(`Wikidata ${espnIds[leagueKey].label} (${espnIds[leagueKey].prop}) = ${id}`);
    } else {

      logs.push(`[ESPN ${cfg.label}] No Wikidata ID — trying name search for "${name}"`);
      const found = await espnSearchAthleteIdByName(cfg.sport, cfg.league, name);
      if (found) {
        id = found.id;
        matchedDisplayName = found.displayName || '';
        logs.push(`[ESPN ${cfg.label}] Name search matched id ${id} (score ${found.score}) via ${found.url}`);
        sources.push(`ESPN name search "${name}" -> id ${id} (score ${found.score}, ${found.url})`);
      } else {
        logs.push(`[ESPN ${cfg.label}] Name search found no confident match for "${name}"`);
        sources.push(`ESPN name search "${name}" — no confident match`);
      }
    }
    if (id) {
      espnId = id;
      const fromWikidataId = !!espnIds[leagueKey]?.id;
      const fetchedEspn = await fetchAndParseEspnLeagueData(cfg, id, leagueKey, sources, matchedDisplayName).catch(e => {
        logs.push(`[ESPN ${cfg.label}] fetch/parse threw: ${e}`);
        return null;
      });

      const retiredNote = bundle.isRetired
        ? `retired ${bundle.careerEnd || ''}`.trim() + ' — dropping live game blocks only'
        : '';
      const dropLiveBlocks = (espnObj) => {
        if (!espnObj || !bundle.isRetired) return espnObj;
        logs.push(`[ESPN ${cfg.label}] ${name} ${retiredNote}`);
        sources.push(`Wikidata career end ${bundle.careerEnd || ''} — live blocks dropped`.trim());
        return { ...espnObj, recentGames: [], nextGame: null };
      };

      const espnCurrentTeam = (espnObj) => espnObj?.seasonLog?.[0]?.team || '';
      if (fromWikidataId) {

        espn = dropLiveBlocks(fetchedEspn);
        team = espnCurrentTeam(espn) || team;
      } else if (fetchedEspn) {

        const overviewName = String(fetchedEspn.athleteName || '').toLowerCase();
        const wantName = String(name || '').toLowerCase();
        const wantParts = wantName.split(/\s+/).filter(part => part.length > 1);
        const nameMatches = overviewName && wantParts.length > 1 &&
          wantParts.every(part => overviewName.includes(part));
        if (nameMatches) {
          espn = dropLiveBlocks(fetchedEspn);
          team = espnCurrentTeam(espn) || team;
        } else {
          logs.push(`[ESPN ${cfg.label}] Name-search id ${id} rejected: overview athlete "${fetchedEspn.athleteName || ''}" does not match "${name}" — link only, no stats`);
          sources.push(`ESPN name search "${name}" -> id ${id} rejected (overview names "${fetchedEspn.athleteName || ''}")`);
          espn = { id: String(id), league: cfg.label, pageUrl: fetchedEspn.pageUrl,
                   athleteName: fetchedEspn.athleteName || '',
                   statsTitle: '', seasonAverages: [], recentGames: [], nextGame: null,
                   awards: [], seasonLog: [] };
        }
      } else {
        espn = null;
      }
    }
  } else if (cfg) {

    let id = espnIds[leagueKey]?.id || null;
    if (!id) {
      logs.push(`[ESPN ${cfg.label}] No Wikidata ID — trying name search for link only (no stats fetch for this sport)`);
      const found = await espnSearchAthleteIdByName(cfg.sport, cfg.league, name);
      if (found) {
        id = found.id;
        logs.push(`[ESPN ${cfg.label}] Name search matched id ${id} (score ${found.score}) for link purposes`);
        sources.push(`ESPN name search "${name}" -> id ${id} (score ${found.score}, link only)`);
      } else {
        logs.push(`[ESPN ${cfg.label}] Name search found no confident match for "${name}" (link)`);
      }
    }
    if (id) {
      espnId = id;
      espn = { id: String(id), league: cfg.label, pageUrl: espnPlayerPageUrl(cfg, id),
               athleteName: '',
               statsTitle: '', seasonAverages: [], recentGames: [], nextGame: null,
               awards: [], seasonLog: [] };
    }
  }

  if (lowerSport.includes('baseball')){
    const mlb = await enrichMLBDirect(name);
    if (mlb?.proStats){ Object.assign(proStats, mlb.proStats); sources.push(...(mlb.sources||[])); }
  }

  if (espn && espn.seasonAverages.length){
    const careerSplit = espn.seasonAverages.find(avg => /^career/i.test(avg.split || '')) ||
                        espn.seasonAverages[espn.seasonAverages.length - 1];
    const seasonSplit = espn.seasonAverages.find(avg => /regular/i.test(avg.split || ''));
    const groups = leagueKey === 'mlb' ? mlbHeadlineGroupFor(espn.statsTitle) : (ESPN_HEADLINE_STAT_GROUPS[leagueKey] || null);
    const toRows = (splitObj, tag) => {
      if (!splitObj) return;
      const lowerNames = (splitObj.names || []).map(n => String(n || '').toLowerCase());
      const pushed = new Set();
      const pushOne = (i, keyLabel) => {
        const val = splitObj.cells[i];
        if (val == null || val === '' || pushed.has(i)) return;
        proStats[`${keyLabel}${tag}`] = String(val);
        pushed.add(i);
      };
      if (groups && lowerNames.length){
        let matchedTotal = 0;
        for (const group of groups){
          for (const wantedName of group.names){
            const idx = lowerNames.indexOf(wantedName.toLowerCase());
            if (idx < 0) continue;
            const lab = splitObj.labels[idx];
            if (lab == null) continue;
            pushOne(idx, group.prefix ? `${group.prefix} ${lab}` : lab);
            matchedTotal++;
          }
        }
        logs.push(`[ESPN headline] ${leagueKey} matched ${matchedTotal} group names for ${splitObj.split || tag}; raw names=${JSON.stringify(splitObj.names || [])}`);
      }

      if (!pushed.size){
        splitObj.labels.forEach((lab, i) => pushOne(i, lab));
      }
    };
    if (espn.statsTitle && !/^(stats)$/i.test(espn.statsTitle.trim())) proStats.__title = espn.statsTitle;
    toRows(seasonSplit, '');
    toRows(careerSplit && careerSplit !== seasonSplit ? careerSplit : null, ' (Career)');
  }

  if (Object.keys(espnIds).length===0){
    logs.push(`[ESPN] No Wikidata ESPN ID property found for ${name} (sport: ${sportLabel}) — used name-search fallback where applicable.`);
  }

  return {
    espnId,
    espn,
    proStats,
    team: team || '',
    _sources: sources,
    _logs: logs,
    _debug: logs.join('\\n') + '\\nSources:\\n' + sources.join('\\n'),
    _espnIdsRaw: espnIds
  };
}

async function getEspnEnrichmentIfAvailable(sportLabel, name, bundle){

  if (bundle && bundle.espnIds){
    return await getEspnEnrichmentFromWikidataIds(bundle);
  }

  return {
    espnId:null,
    proStats:{},
    team:'',
    _sources:[`Fallback called without Wikidata IDs for ${name} / ${sportLabel} - need bundle.espnIds`],
    _debug:`No bundle.espnIds - please call getEspnEnrichmentFromWikidataIds(bundle) directly`
  };
}

function sportsGoogleSiteSearchUrl(domain, name) {
  return `https://www.google.com/search?q=${encodeURIComponent(`site:${domain} ${name}`)}`;
}

function sportsReferenceSearchUrl(domain, name) {
  return `https://www.${domain}/search/search.fcgi?search=${encodeURIComponent(name)}`;
}

function sportsReferenceDomainForSport(sportLower) {
  if (sportLower.includes('baseball')) return 'baseball-reference.com';
  if (sportLower.includes('basketball')) return 'basketball-reference.com';
  if (/\bfootball\b/.test(sportLower) && !/(association|soccer)/.test(sportLower)) return 'pro-football-reference.com';
  if (sportLower.includes('hockey')) return 'hockey-reference.com';
  return null;
}

function getSportsSiteLinks(data){
  const links=[];
  if (data.wikidataId){
    links.push({ label:'Wikipedia', url:`https://en.wikipedia.org/wiki/${encodeURIComponent((data.name||'').replace(/ /g,'_'))}`, kind:'wikipedia' });
  }

  const espnLeagueOrder = [];
  if (data.espn && data.espn.pageUrl){
    links.push({ label:`ESPN ${data.espn.league || ''}`.trim(), url:data.espn.pageUrl, kind:'espn' });
    const shownLeague = String(data.espn.league || '').toLowerCase();
    for (const key of Object.keys(ESPN_LEAGUE_CONFIG)){
      if (ESPN_LEAGUE_CONFIG[key].label.toLowerCase() === shownLeague) espnLeagueOrder.push(key);
    }
  }
  {
    if (data.espnIds){
      for (const [key, info] of Object.entries(data.espnIds)){
        if (espnLeagueOrder.includes(key)) continue;
        const cfg = ESPN_LEAGUE_CONFIG[key];
        if (cfg && info.id){
          links.push({
            label:`ESPN ${cfg.label}`,
            url:espnPlayerPageUrl(cfg, info.id),
            kind:'espn'
          });
        }
      }
    }
    if (data.espnId && !data.espnIds){
      links.push({ label:'ESPN', url:`https://www.espn.com/nba/player/_/id/${data.espnId}`, kind:'espn' });
    }
  }
  if (data.name){
    const q = encodeURIComponent(data.name);
    links.push({ label:'Olympics.com', url:`https://www.olympics.com/en/athletes/${encodeURIComponent(data.name.toLowerCase().replace(/\s+/g,'-'))}`, kind:'olympics' });

    links.push({ label:'SofaScore', url:sportsGoogleSiteSearchUrl('sofascore.com', data.name), kind:'sofascore' });
    links.push({ label:'Flashscore', url:sportsGoogleSiteSearchUrl('flashscore.com', data.name), kind:'flashscore' });

    const sportLower = String(data.sport || '').toLowerCase();
    const referenceDomain = sportsReferenceDomainForSport(sportLower);
    if (referenceDomain){

      const siteLabel = referenceDomain.replace('.com', '').split('-').map(word => word[0].toUpperCase()+word.slice(1)).join(' ');
      links.push({ label:siteLabel, url:sportsReferenceSearchUrl(referenceDomain, data.name), kind:'specialty' });
    } else if (sportLower.includes('tennis')){

      links.push({ label:'ATP Tour', url:sportsGoogleSiteSearchUrl('atptour.com', data.name), kind:'specialty' });
    } else if (sportLower.includes('formula one') || (sportLower.includes('auto racing') && !sportLower.includes('motorcycle'))){

      links.push({ label:'Formula 1', url:sportsGoogleSiteSearchUrl('formula1.com', data.name), kind:'specialty' });
    } else if (sportLower.includes('motorcycle') || sportLower.includes('motogp') || sportLower.includes('moto gp')){

      links.push({ label:'MotoGP', url:sportsGoogleSiteSearchUrl('motogp.com', data.name), kind:'specialty' });
    } else if (sportLower.includes('rally')){
      links.push({ label:'WRC', url:sportsGoogleSiteSearchUrl('wrc.com', data.name), kind:'specialty' });
    } else if (sportLower.includes('boxing')){

      links.push({ label:'BoxRec', url:sportsGoogleSiteSearchUrl('boxrec.com', data.name), kind:'specialty' });
    } else if (sportLower.includes('mixed martial') || sportLower.includes('mma') || sportLower.includes('ufc')){

      links.push({ label:'UFC', url:`https://www.ufc.com/search?query=${q}`, kind:'specialty' });
      links.push({ label:'Sherdog', url:`https://www.sherdog.com/stats/fightfinder?SearchTxt=${q}`, kind:'specialty' });
    } else if (sportLower.includes('cricket')){

      links.push({ label:'ESPNcricinfo', url:sportsGoogleSiteSearchUrl('espncricinfo.com', data.name), kind:'specialty' });
    } else if (sportLower.includes('golf')){

      links.push({ label:'PGA Tour', url:sportsGoogleSiteSearchUrl('pgatour.com', data.name), kind:'specialty' });
    }
  }
  return links;
}

async function handleSportsSearch(query){
  try {
    const candidates = await getWikidataSportsEnrichedCandidates(query);
    return { ok:true, candidates: candidates.slice(0,10) };
  } catch(e){
    return { ok:false, error:String(e), reason:'network', candidates:[] };
  }
}

function sportsEnrichmentFlags(bundle){
  const sportLower = String(bundle.sport || '').toLowerCase();
  const isTennis = sportLower.includes('tennis');
  const isSoccer = /\bfootball\b/i.test(sportLower) && !/american|gridiron|canadian|australian/i.test(sportLower);
  const isMotorsport = sportLower.includes('formula one') || sportLower.includes('auto racing') ||
    sportLower.includes('racing driver') || sportLower.includes('motorcycle') ||
    sportLower.includes('motogp') || sportLower.includes('moto gp') ||
    sportLower.includes('grand prix motorcycle') || sportLower.includes('rally') ||
    sportLower.includes('rallying') || sportLower.includes('motorsport');
  const isCricket = sportLower.includes('cricket');
  const isGolf = sportLower.includes('golf');
  const descLower = String(bundle.description || bundle.occupation || '').toLowerCase();

  const isMma = sportLower.includes('mixed martial arts') || sportLower.includes('mma') ||
    sportLower.includes('ufc') ||
    descLower.includes('mixed martial') || descLower.includes('mma fighter') ||
    descLower.includes('ufc ') || descLower.includes('ufc fighter') ||
    (sportLower.includes('sambo') && (descLower.includes('mma') || descLower.includes('mixed martial') || descLower.includes('ufc'))) ||
    (sportLower.includes('martial art') && !sportLower.includes('judo') &&
      !sportLower.includes('taekwondo') && !sportLower.includes('karate') && !sportLower.includes('sambo'));

  const isKickboxing = !isMma && (
    sportLower.includes('kickbox') || sportLower.includes('muay thai') || sportLower.includes('muaythai') ||
    descLower.includes('kickbox') || descLower.includes('muay thai') ||
    descLower.includes('muaythai')
  );

  const isBoxing = !isMma && !isKickboxing && (
    sportLower.includes('boxing') ||
    /\bprofessional boxer\b/.test(descLower) ||
    (/\bboxer\b/.test(descLower) && !descLower.includes('kickbox'))
  );
  return { sportLower, isTennis, isSoccer, isMotorsport, isCricket, isGolf, isMma, isBoxing, isKickboxing };
}

function sportsMergeEnrichment(bundle, enrichment, medalRecord, tennisInfo, motorsportInfo, isSoccer, staged){

  const data = {
    ...bundle,

    isSoccer,
    transfermarktId: bundle.transfermarktId || null,
    team: bundle.team,
    _staged: !!staged
  };
  if (staged) {
    data.proStats = undefined;
    data.espnStats = undefined;
    data.espn = undefined;
    data.espnId = undefined;
    data.medalRecord = undefined;
    data.tennisInfo = undefined;
    data.motorsportInfo = undefined;
    data.cricketInfo = undefined;
    data.golfWiki = undefined;
    data.mmaInfo = undefined;
    data.boxingInfo = undefined;
    data.kickboxingInfo = undefined;
    data.titlesText = undefined;
    data.titlesCount = undefined;
    data._enrichmentSources = [];
    data._enrichmentLogs = [];
    data._enrichmentDebug = '';
    data._espnIdsRaw = bundle.espnIds;
  } else {
    data.proStats = enrichment?.proStats || {};
    data.espnStats = enrichment?.proStats || {};

    data.espn = enrichment?.espn || null;
    data.espnId = enrichment?.espnId || null;
    data.team = enrichment?.team || bundle.team;
    data._enrichmentSources = enrichment?._sources || [];
    data._enrichmentLogs = enrichment?._logs || [];
    data._enrichmentDebug = enrichment?._debug || '';
    data._espnIdsRaw = enrichment?._espnIdsRaw || bundle.espnIds;

    data.medalRecord = {
      found: !!medalRecord?.found,
      competitions: medalRecord?.competitions || [],
      error: medalRecord?.error || null
    };

    data.tennisInfo = tennisInfo && tennisInfo.found ? {
      singles: tennisInfo.singles || {},
      grandSlams: tennisInfo.grandSlams || []
    } : null;

    data.motorsportInfo = motorsportInfo && motorsportInfo.found ? (motorsportInfo.career || {}) : null;

    if (data.motorsportInfo) {
      const cls = String(data.motorsportInfo.class || data.motorsportInfo.series || '').toLowerCase();
      if (/wrc|rally/.test(cls)) data.sport = 'Rallying';
      else if (/motogp|motorcycle|moto gp/.test(cls)) data.sport = 'MotoGP';
      else if (/formula|f1/.test(cls)) data.sport = 'Formula One';
      else if (data.motorsportInfo.class) data.sport = data.motorsportInfo.class;
    }
    data.titlesText = medalRecord?.titlesText || '';
    data.titlesCount = medalRecord?.titlesCount || null;
  }
  data.links = getSportsSiteLinks({ ...bundle, sport: data.sport, espnId: data.espnId, espnIds: bundle.espnIds, espn: data.espn });
  return data;
}

async function handleSportsGetDetails(id){
  try {

    let bundle = await getWikidataSportsBundle(id);
    if (!bundle) return { ok:false, error:'Not found' };
    if (bundle.error) return { ok:false, error: bundle.error, reason:'network' };
    let flags = sportsEnrichmentFlags(bundle);
    if (flags.isKickboxing && /football|soccer/i.test(bundle.sport || '')) {
      bundle = { ...bundle, sport: /muay/i.test(String(bundle.description||'')) ? 'Muay Thai' : 'Kickboxing' };
    } else if (flags.isMma && /sambo|football/i.test(bundle.sport || '')) {
      bundle = { ...bundle, sport: 'Mixed martial arts' };
    }
    const { isSoccer } = flags;
    const data = sportsMergeEnrichment(bundle, null, null, null, null, isSoccer, true);
    data.siteLinks = data.links;
    return { ok:true, data };
  } catch(e){

    return { ok:false, error:String(e), reason:'network' };
  }
}

async function handleSportsGetDetailsExtra(id){
  try {

    let bundle = await getWikidataSportsBundle(id);
    if (!bundle) return { ok:false, error:'Not found' };
    if (bundle.error) return { ok:false, error: bundle.error, reason:'network' };
    let { isTennis, isSoccer, isMotorsport, isCricket, isGolf, isMma, isBoxing, isKickboxing } = sportsEnrichmentFlags(bundle);

    if (isKickboxing && /football|soccer/i.test(bundle.sport || '')) {
      bundle = { ...bundle, sport: /muay/i.test(String(bundle.description||'')) ? 'Muay Thai' : 'Kickboxing' };
    } else if (isMma && /sambo|football/i.test(bundle.sport || '')) {
      bundle = { ...bundle, sport: 'Mixed martial arts' };
    } else if (isBoxing && /football/i.test(bundle.sport || '')) {
      bundle = { ...bundle, sport: 'Boxing' };
    }
    const title = bundle.wikipediaTitle || bundle.name;
    const [enrichment, medalRecord, tennisInfo, motorsportInfo, cricketInfo, golfWiki, mmaInfo, boxingInfo, kickboxingInfo] = await Promise.all([
      getEspnEnrichmentFromWikidataIds(bundle).catch(e => ({ error: String(e), proStats:{}, espn:null, _sources:[], _logs:[] })),
      getWikipediaMedalRecord(title).catch(e => ({ found:false, competitions:[], error:String(e) })),
      isTennis
        ? getWikipediaTennisInfo(title).catch(e => ({ found:false, singles:{}, grandSlams:[], error:String(e) }))
        : Promise.resolve(null),
      isMotorsport
        ? getWikipediaF1Info(title).catch(e => ({ found:false, career:{}, error:String(e) }))
        : Promise.resolve(null),
      isCricket
        ? getWikipediaCricketInfo(title).catch(e => ({ found:false, error:String(e) }))
        : Promise.resolve(null),
      isGolf
        ? getWikipediaGolfInfo(title).catch(e => ({ found:false, error:String(e) }))
        : Promise.resolve(null),
      isMma
        ? getWikipediaMmaInfo(title).catch(e => ({ found:false, error:String(e) }))
        : Promise.resolve(null),
      isBoxing
        ? getWikipediaBoxingInfo(title).catch(e => ({ found:false, error:String(e) }))
        : Promise.resolve(null),
      isKickboxing
        ? getWikipediaKickboxingInfo(title).catch(e => ({ found:false, error:String(e) }))
        : Promise.resolve(null)
    ]);
    const data = sportsMergeEnrichment(bundle, enrichment, medalRecord, tennisInfo, motorsportInfo, isSoccer, false);
    data.cricketInfo = cricketInfo && cricketInfo.found ? cricketInfo : null;
    data.golfWiki = golfWiki && golfWiki.found ? golfWiki : null;
    data.mmaInfo = mmaInfo && mmaInfo.found ? mmaInfo : null;
    data.boxingInfo = boxingInfo && boxingInfo.found ? boxingInfo : null;
    data.kickboxingInfo = kickboxingInfo && kickboxingInfo.found ? kickboxingInfo : null;
    data.siteLinks = data.links;
    return { ok:true, data };
  } catch(e){

    return { ok:false, error:String(e), reason:'network' };
  }
}

