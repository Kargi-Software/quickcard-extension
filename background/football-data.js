

const TMAPI_BASE = 'https://tmapi.transfermarkt.technology';
const TM_BASE = 'https://www.transfermarkt.com';
const FOOTBALL_DEFAULT_SETTINGS = {
footballShowTransfermarktLink: true,
footballShowWikipediaLink: true,
footballFieldHonours: true,

footballFieldInjuryBadge: true,
footballFieldLoanBadge: true,

footballFieldTeamHonours: true,
footballFieldTeamNextMatches: true,
footballFieldTeamPrevMatches: true,

footballFieldPlayerNextMatches: true,
footballFieldPlayerPrevMatches: true,

footballFieldFutRating: true,
footballFieldCoachHonours: true
};
async function getFootballSettings() {
const s = await api.storage.local.get(FOOTBALL_DEFAULT_SETTINGS);
return {
footballShowTransfermarktLink: s.footballShowTransfermarktLink !== false,
footballShowWikipediaLink: s.footballShowWikipediaLink !== false,
footballFieldHonours: s.footballFieldHonours !== false,
footballFieldInjuryBadge: s.footballFieldInjuryBadge !== false,
footballFieldLoanBadge: s.footballFieldLoanBadge !== false,
footballFieldTeamHonours: s.footballFieldTeamHonours !== false,
footballFieldTeamNextMatches: s.footballFieldTeamNextMatches !== false,
footballFieldTeamPrevMatches: s.footballFieldTeamPrevMatches !== false,
footballFieldPlayerNextMatches: s.footballFieldPlayerNextMatches !== false,
footballFieldPlayerPrevMatches: s.footballFieldPlayerPrevMatches !== false,
footballFieldCoachHonours: s.footballFieldCoachHonours !== false,
footballFieldFutRating: s.footballFieldFutRating !== false
};
}

function footballLog(...args) { log('[football]', ...args); }
function footballLogError(...args) { logError('[football]', ...args); }
function footballCreateDocument(html) {
  if (typeof DOMParser === 'undefined') return null;
  try { return new DOMParser().parseFromString(html, 'text/html'); } catch (e) { return null; }
}
function footballText(el) { if (!el) return null; return cleanValue(el.textContent); }
function footballAbsoluteUrl(href, base = TM_BASE) { if (!href) return null; try { return new URL(href, base).href; } catch (e) { return null; } }
function footballJsonHeaders(extra = {}) {
  return { Accept: 'application/json, text/plain, */*', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36', ...extra };
}
async function footballFetchJson(url, timeout = 12000) {
  let res;
  try { res = await httpGetText(url, footballJsonHeaders(), timeout); }
  catch (e) { return { ok: false, reason: 'network', error: String(e && e.message ? e.message : e) }; }
  if (!res.ok) return { ok: false, reason: 'network', status: res.status };
  try { return { ok: true, data: JSON.parse(res.text) }; }
  catch (e) { footballLogError('JSON.parse failed', url, e); return { ok: false, reason: 'parse', error: String(e) }; }
}
function footballUnwrapEnvelope(payload) {
  if (!payload) return null;
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data && typeof payload.data === 'object') {
    return payload.data;
  }
  return payload;
}
function footballUsePhotoSize(url, size = 'big') { if (!url) return null; return url; }
function footballSlugify(name) { return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '-'; }
function footballDeepFind(obj, keys) {
  if (!obj) return null;
  const queue = [obj];
  const keySet = new Set(keys.map(k => k.toLowerCase()));
  while (queue.length) {
    const cur = queue.shift();
    if (!cur || typeof cur !== 'object') continue;
    for (const k in cur) {
      if (keySet.has(k.toLowerCase())) {
        const v = cur[k];
        if (v) return v;
      }
      const v = cur[k];
      if (v && typeof v === 'object') queue.push(v);
    }
  }
  return null;
}
function footballFormatDate(raw) {
  if (!raw) return null;
  const m = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return typeof raw === 'string' ? raw : null;
  const [, y, mo, d] = m;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const idx = parseInt(mo, 10) - 1;
  if (idx < 0 || idx > 11) return raw;
  return `${d} ${months[idx]} ${y}`;
}

function footballNormalizeNameForMatch(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function footballParseDobForMatch(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  const usMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (usMatch) {
    return { y: parseInt(usMatch[3], 10), m: parseInt(usMatch[1], 10), d: parseInt(usMatch[2], 10) };
  }
  const monthNames = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const dmyMatch = s.match(/^(\d{1,2})\s+([a-zA-Z]{3,})\s+(\d{4})/);
  if (dmyMatch) {
    const idx = monthNames.indexOf(dmyMatch[2].slice(0, 3).toLowerCase());
    if (idx !== -1) return { y: parseInt(dmyMatch[3], 10), m: idx + 1, d: parseInt(dmyMatch[1], 10) };
  }
  return null;
}

function footballDobsMatch(a, b) {
  const pa = footballParseDobForMatch(a);
  const pb = footballParseDobForMatch(b);
  if (!pa || !pb) return false;
  return pa.y === pb.y && pa.m === pb.m && pa.d === pb.d;
}

let _eaFcBuildId = null;
let _eaFcBuildIdInflight = null;

async function footballResolveEaFcBuildId() {
  if (_eaFcBuildId) return _eaFcBuildId;
  if (_eaFcBuildIdInflight) return _eaFcBuildIdInflight;

  _eaFcBuildIdInflight = (async () => {
    const url = 'https://www.ea.com/games/ea-sports-fc/ratings';
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 10000) : null;
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: ctrl ? ctrl.signal : undefined
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const html = await res.text();
      const m = html.match(/"buildId"\s*:\s*"([^"]+)"/);
      if (!m || !m[1]) throw new Error('buildId not found in ratings HTML');
      _eaFcBuildId = m[1];
      footballLog('footballResolveEaFcBuildId: got', _eaFcBuildId);
      return _eaFcBuildId;
    } finally {
      if (timer) clearTimeout(timer);
      _eaFcBuildIdInflight = null;
    }
  })();

  return _eaFcBuildIdInflight;
}

async function getEaFcRating(name, nationalityNames, dob) {
  if (!name) return null;
  try {
    let buildId;
    try {
      buildId = await footballResolveEaFcBuildId();
    } catch (e) {
      footballLogError('getEaFcRating: buildId resolve failed', e && e.message ? e.message : e);

      buildId = _eaFcBuildId || 'DO3P1GxCuQJYTuXacQAJB';
    }

    const url =
      `https://www.ea.com/_next/data/${encodeURIComponent(buildId)}/en/games/ea-sports-fc/ratings.json` +
      `?franchiseSlug=ea-sports-fc&search=${encodeURIComponent(name)}&page=1`;

    const res = await fetchJson(url, {
      'Accept': 'application/json',
      'Referer': 'https://www.ea.com/games/ea-sports-fc/ratings',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }, 10000);

    const items =
      (res && res.pageProps && res.pageProps.ratingDetails && res.pageProps.ratingDetails.items) ||
      (res && res.ratingDetails && res.ratingDetails.items) ||
      (res && res.items) ||
      null;

    if ((!items || !items.length) && _eaFcBuildId) {
      footballLog('getEaFcRating: empty items, refreshing buildId');
      _eaFcBuildId = null;
      try {
        buildId = await footballResolveEaFcBuildId();
        const url2 =
          `https://www.ea.com/_next/data/${encodeURIComponent(buildId)}/en/games/ea-sports-fc/ratings.json` +
          `?franchiseSlug=ea-sports-fc&search=${encodeURIComponent(name)}&page=1`;
        const res2 = await fetchJson(url2, {
          'Accept': 'application/json',
          'Referer': 'https://www.ea.com/games/ea-sports-fc/ratings'
        }, 10000);
        const items2 =
          (res2 && res2.pageProps && res2.pageProps.ratingDetails && res2.pageProps.ratingDetails.items) ||
          null;
        if (items2 && items2.length) {
          return footballPickEaFcMatch(items2, name, nationalityNames, dob);
        }
      } catch (e2) {
        footballLogError('getEaFcRating: retry after buildId refresh failed', e2 && e2.message ? e2.message : e2);
      }
      return null;
    }

    if (!items || !items.length) {
      footballLog('getEaFcRating: no items for', name);
      return null;
    }

    return footballPickEaFcMatch(items, name, nationalityNames, dob);
  } catch (e) {
    footballLogError('getEaFcRating: failed for', name, '->', e && e.message ? e.message : e);
    return null;
  }
}

function footballPickEaFcMatch(items, name, nationalityNames, dob) {
  const targetName = footballNormalizeNameForMatch(name);
  const targetNats = (nationalityNames || []).map(footballNormalizeNameForMatch).filter(Boolean);

  for (const item of items) {
    const candidateName = footballNormalizeNameForMatch(
      item.commonName || `${item.firstName || ''} ${item.lastName || ''}`
    );
    if (!candidateName ||
        (candidateName !== targetName &&
         !candidateName.includes(targetName) &&
         !targetName.includes(candidateName))) continue;

    const candidateNat = footballNormalizeNameForMatch(
      item.nationality && item.nationality.label
    );
    if (!candidateNat || !targetNats.includes(candidateNat)) continue;

    if (!footballDobsMatch(dob, item.birthdate)) continue;

    const rating = item.overallRating;
    if (typeof rating !== 'number') continue;
    footballLog('getEaFcRating: matched', name, '->', rating);
    return { rating, game: 'FC' };
  }

  footballLog('getEaFcRating: no confident match for', name, 'among', items.length, 'candidates');
  return null;
}

function footballExtractAgent(profile) {
const pickName = (v) => {
if (!v) return null;
if (typeof v === 'string') return v.trim() || null;
if (Array.isArray(v)) { for (const item of v) { const n = pickName(item); if (n) return n; } return null; }
if (typeof v === 'object') {
for (const k of ['name', 'agency', 'agentName', 'displayName', 'title', 'label', 'shortName']) {
if (typeof v[k] === 'string' && v[k].trim()) return v[k].trim();
}
for (const k of ['agent', 'agency', 'current']) { if (v[k]) { const n = pickName(v[k]); if (n) return n; } }
return null;
}
return null;
};
if (!profile) return null;
const attrs = profile.attributes || {};

const direct = pickName(profile.agent) || pickName(profile.agents) || pickName(profile.agentDetails) || pickName(profile.playerAgent) || pickName(profile.agency) || pickName(profile.agentName) || pickName(attrs.agent) || pickName(attrs.agency) || pickName(attrs.consultantAgency) || pickName(profile.consultantAgency);
if (direct) return direct;
const found = footballDeepFind(profile, ['agent', 'agents', 'agency', 'playerAgent', 'agentName', 'agentDetails', 'management', 'representative', 'consultantAgency', 'consultant']);
return pickName(found);
}

function footballExtractProfileFields(profile) {
  const lifeDates = profile.lifeDates || {};
  const attributes = profile.attributes || {};

  const position = (attributes.position && (attributes.position.name || attributes.position.shortName)) || footballDeepFind(profile, ['position', 'positionName']) || null;

  let heightRaw = (attributes.height && attributes.height.value) ? attributes.height.value : (attributes.height || footballDeepFind(profile, ['height']) || null);
  let height = null;
  if (typeof heightRaw === 'number') {

    if (heightRaw > 3 && heightRaw < 300) height = `${(heightRaw / 100).toFixed(2)} m`;
    else if (heightRaw >= 1 && heightRaw <= 3) height = `${heightRaw.toFixed(2)} m`;
    else height = `${heightRaw} m`;
  }
  else if (typeof heightRaw === 'string') {
    const num = parseFloat(heightRaw);
    if (!isNaN(num) && num > 3) height = `${(num / 100).toFixed(2)} m`;
    else height = heightRaw;
  }
  else if (heightRaw && typeof heightRaw === 'object') {
    if (typeof heightRaw.value === 'number') {
      const v = heightRaw.value;
      if (v > 3 && v < 300) height = `${(v / 100).toFixed(2)} m`;
      else height = `${v} m`;
    }
    else height = heightRaw.display || heightRaw.value || null;
  }
  const dobRaw = lifeDates.birthDate || profile.birthDate || footballDeepFind(profile, ['birthDate', 'dateOfBirth', 'dob']);
  const dob = footballFormatDate(dobRaw) || dobRaw || null;
  let age = lifeDates.age ?? profile.age ?? footballDeepFind(profile, ['age']) ?? null;
  if (typeof age === 'string') age = parseInt(age, 10) || null;
  const birthPlace = lifeDates.birthPlace && lifeDates.birthPlace.city ? `${lifeDates.birthPlace.city}${(lifeDates.birthPlace && lifeDates.birthPlace.country) ? ', ' + (lifeDates.birthPlace && lifeDates.birthPlace.country) : ''}` : (footballDeepFind(profile, ['birthPlace', 'placeOfBirth', 'birthplace']) || null);

  const agent = footballExtractAgent(profile);
  const contractExpiresRaw = (profile.contract && profile.contract.expires) || profile.contractExpires || footballDeepFind(profile, ['contractExpires', 'contractUntil']) || null;
  const contractExpires = contractExpiresRaw ? footballFormatDate(contractExpiresRaw) || contractExpiresRaw : null;
  const squadNumber = profile.shirtNumber || profile.squadNumber || footballDeepFind(profile, ['shirtNumber', 'jerseyNumber', 'squadNumber']) || null;

  let footRaw = attributes.preferredFoot || attributes.foot || footballDeepFind(profile, ['preferredFoot', 'foot']) || null;
  let foot = null;
  if (typeof footRaw === 'string') foot = footRaw.charAt(0).toUpperCase() + footRaw.slice(1);
  else if (footRaw && typeof footRaw === 'object') {
  const n = footRaw.name || footRaw.value || footRaw.foot || null;

  if (typeof n === 'string') foot = n.charAt(0).toUpperCase() + n.slice(1);
  }

  const nationalityIds = [];
  const nationalityNames = [];
  const rawNat = profile.nationalities || profile.citizenships || profile.countries || [];
  if (Array.isArray(rawNat)) {
    rawNat.forEach(n => {
      if (!n) return;
      if (typeof n === 'string' || typeof n === 'number') { nationalityIds.push(String(n)); return; }
      if (n.id) nationalityIds.push(String(n.id));
      else if (n.countryId) nationalityIds.push(String(n.countryId));
      else if (n.country && n.country.id) nationalityIds.push(String(n.country.id));
      const nm = n.name || n.displayName || n.officialName || (n.country && (n.country.name || n.country.displayName)) || null;
      if (nm) nationalityNames.push(String(nm));
    });
  }

  const natDetails = (profile.nationalityDetails && profile.nationalityDetails.nationalities) ? profile.nationalityDetails.nationalities : null;
  if (natDetails) {
  for (const nk of ['nationalityId', 'secondNationalityId', 'thirdNationalityId']) {
  if (natDetails[nk]) nationalityIds.push(String(natDetails[nk]));
  if (natDetails[nk + 'Name']) nationalityNames.push(String(natDetails[nk + 'Name']));
  }
  if (natDetails.name) nationalityNames.push(String(natDetails.name));
  }
  const singleNatId = profile.nationalityId || profile.countryId || footballDeepFind(profile, ['nationalityId', 'countryId']);
  if (singleNatId) nationalityIds.push(String(singleNatId));
  return { age: typeof age === 'number' ? age : null, dob, birthPlace: birthPlace ? String(birthPlace) : null, height: height ? String(height) : null, foot: foot ? String(foot) : null, position: position ? String(position) : null, agent: agent ? String(agent) : null, contractExpires, squadNumber, nationalityIds: Array.from(new Set(nationalityIds)), nationalityNames: Array.from(new Set(nationalityNames)) };
}

function footballParseMarketValueNumber(str){
  if(!str) return 0;
  const s=String(str).toLowerCase().replace(/€/g,'').replace(/\s/g,'');
  const m=s.match(/([\d.,]+)(bn|b|m|k)?/);
  if(!m) return 0;
  let num=parseFloat(m[1].replace(',','.'));
  if(isNaN(num)) return 0;
  const suf=m[2]||'';
  if(suf==='k') num*=1e3;
  else if(suf==='m') num*=1e6;
  else if(suf==='b'||suf==='bn') num*=1e9;
  return num;
}

function footballCategorizePosition(pos){
  if(!pos) return null;
  const p=String(pos).toLowerCase();
  if(p.includes('goalkeeper')||p==='gk'||p.includes('torwart')) return 'GK';
  if(p.includes('back')||p.includes('defence')||p.includes('defense')||p.includes('centre-back')||p.includes('center-back')||p.includes('cb')||p.includes('lb')||p.includes('rb')||p.includes('verteidiger')) return 'DEF';
  if(p.includes('midfield')||p.includes('mid')||p.includes('mittelfeld')||p.includes('cm')||p.includes('dm')||p.includes('am')||p.includes('lm')||p.includes('rm')) return 'MID';
  if(p.includes('forward')||p.includes('striker')||p.includes('winger')||p.includes('sturm')||p.includes('cf')||p.includes('lw')||p.includes('rw')||p.includes('ss')) return 'FWD';
  return null;
}

function footballExtractMarketValue(profile) {
const mv = profile.marketValueDetails || profile.marketValue || {};
const cur = mv.current || mv;
let value = cur.compact ? `${cur.compact.prefix || ''}${cur.compact.content || ''}${cur.compact.suffix || ''}` : (cur.value || mv.value || null);
if (value && typeof value === 'object') value = null;
if (typeof value === 'number') value = `€${value}`;
const delta = mv.delta || null;
let trend = null, percent = null;
if (delta && typeof delta.percentage === 'number') { percent = delta.percentage; trend = percent > 0 ? 'up' : percent < 0 ? 'down' : null; }
else if (mv.change) { const ch = parseFloat(mv.change); if (!isNaN(ch)) { percent = ch; trend = ch > 0 ? 'up' : ch < 0 ? 'down' : null; } }

const lastUpdate = mv.lastUpdate || cur.determined || mv.determined || profile.marketValueLastUpdate || null;
return { value: value ? String(value) : null, trend, percent, lastUpdate: lastUpdate ? footballFormatDate(lastUpdate) || lastUpdate : null };
}

function footballFormatFeeNumber(v, currency) {
  if (typeof v !== 'number' || isNaN(v)) return null;
  const cur = currency || '€';
  if (v === 0) return 'Free';
  if (v >= 1000000) return `${cur}${(v / 1000000).toFixed(2).replace(/\.?0+$/, '')}M`;
  if (v >= 1000) return `${cur}${Math.round(v / 1000)}K`;
  return `${cur}${v}`;
}
function footballNormalizeFee(feeRaw) {
  if (!feeRaw) return null;
  if (typeof feeRaw === 'string') return feeRaw.trim() || null;
  if (typeof feeRaw === 'number') return footballFormatFeeNumber(feeRaw);
  if (typeof feeRaw === 'object') {
    if (feeRaw.compact) {
      const s = `${feeRaw.compact.prefix || ''}${feeRaw.compact.content || ''}${feeRaw.compact.suffix || ''}`.trim();
      if (s) return s;
    }
    for (const k of ['display', 'formatted', 'text', 'label', 'description']) {
      if (typeof feeRaw[k] === 'string' && feeRaw[k].trim()) return feeRaw[k].trim();
    }
    if (typeof feeRaw.value === 'string' && feeRaw.value.trim()) return feeRaw.value.trim();
    for (const k of ['value', 'rawValue', 'mainValue', 'amount']) {
      if (typeof feeRaw[k] === 'number') return footballFormatFeeNumber(feeRaw[k], feeRaw.currency);
    }
    for (const k of ['fee', 'transferFee', 'amount']) {
      if (feeRaw[k]) { const inner = footballNormalizeFee(feeRaw[k]); if (inner) return inner; }
    }
  }
  return null;
}

function footballTransferLooksLikeLoan(t) {
if (!t || typeof t !== 'object') return false;

if (t.typeDetails && typeof t.typeDetails === 'object') {
const tt = `${t.typeDetails.type || ''} ${t.typeDetails.name || ''} ${t.typeDetails.feeDescription || ''}`;
if (/loan/i.test(tt) && !/return|end of loan/i.test(tt)) return true;
}
const loanWord = (s) => typeof s === 'string' && /loan|leased|leihe/i.test(s);
for (const k of ['transferType', 'type', 'kind', 'transferKind', 'category', 'transferCategory']) {
const v = t[k];
if (loanWord(v)) return true;
if (v && typeof v === 'object') {
if (loanWord(v.name) || loanWord(v.label) || loanWord(v.text) || loanWord(v.display) || loanWord(v.type)) return true;
}
}
for (const k of ['isLoan', 'onLoan', 'loanTransfer', 'isLoanTransfer']) {
if (t[k] === true) return true;
}
for (const k of ['fee', 'transferFee', 'feeText', 'transferFeeText']) {
const v = t[k];
if (loanWord(v)) return true;
if (v && typeof v === 'object') {
if (loanWord(v.text) || loanWord(v.display) || loanWord(v.label) || loanWord(v.description)) return true;
}
}
return false;
}
function footballBuildStatusBadges(injuryData, transferData, clubMap, currentClubId, clubAssignments, profile, wantInjury = true, wantLoan = true) {
const badges = [];
const injuries = injuryData && Array.isArray(injuryData.injuries) ? injuryData.injuries : [];

const isCurrentInjury = (injury) => {
    if (!injury || !injury.name) return false;

    if (injury.end == null) return true;

    const endDate = new Date(injury.end);
    if (isNaN(endDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return endDate >= today;
};

const current = wantInjury ? injuries.find(isCurrentInjury) : null;
if (current) {
badges.push({
type: 'injury',
label: `${current.name}${current.start ? ' (since ' + (footballFormatDate(current.start) || current.start) + ')' : ''}`
});
}

if (!wantLoan) return badges;
const ribbonType = profile && profile.ribbon && profile.ribbon.ribbonType ? String(profile.ribbon.ribbonType) : '';
const ribbonIsLoan = /loan/i.test(ribbonType);
let loanParentId = null;
const scanLoanEntries = (arr) => {
if (!Array.isArray(arr)) return;
arr.forEach(t => {
if (loanParentId || !t || !t.typeDetails) return;
const tt = `${t.typeDetails.type || ''} ${t.typeDetails.name || ''} ${t.typeDetails.feeDescription || ''}`;
if (/loan/i.test(tt) && !/return|end of loan/i.test(tt)) {
const src = t.transferSource && t.transferSource.clubId ? String(t.transferSource.clubId) : null;
if (src) loanParentId = src;
}
});
};
if (transferData) {
scanLoanEntries(transferData.terminated);
scanLoanEntries(transferData.pending);
}

const mostRecent = (transferData && (transferData.mostRecentTransfer || transferData.lastTransfer || (Array.isArray(transferData.transfers) ? transferData.transfers[0] : null) || (Array.isArray(transferData.terminated) ? transferData.terminated[0] : null))) || null;
const legacyLoan = !!(mostRecent && footballTransferLooksLikeLoan(mostRecent));
let loanAssignment = null;
if (!ribbonIsLoan && !loanParentId && !legacyLoan && Array.isArray(clubAssignments)) {
loanAssignment = clubAssignments.find(a => a && typeof a.type === 'string' && /loan/i.test(a.type)) || null;
}
if (ribbonIsLoan || loanParentId || legacyLoan || loanAssignment) {
let parentName = null;
if (loanParentId && clubMap && clubMap[loanParentId]) parentName = clubMap[loanParentId].name;
if (!parentName && mostRecent) {
const src = mostRecent.transferSource || mostRecent.from || {};
const srcId = src.clubId ? String(src.clubId) : null;
if (srcId && clubMap && clubMap[srcId]) parentName = clubMap[srcId].name;
}
badges.push({ type: 'loan', label: parentName ? `On loan from ${parentName}` : 'On loan' });
}

return badges;
}
function footballExtractLastTransfer(transferData, clubMap) {
if (!transferData) return null;

const mostRecent = transferData.mostRecentTransfer || transferData.lastTransfer || (Array.isArray(transferData.transfers) ? transferData.transfers[0] : null) || (Array.isArray(transferData.terminated) ? transferData.terminated[0] : null) || null;
if (!mostRecent) return null;
const src = mostRecent.transferSource || mostRecent.from || {};
const dst = mostRecent.transferDestination || mostRecent.to || {};

let fee = footballNormalizeFee(mostRecent.fee)
|| footballNormalizeFee(mostRecent.transferFee)
|| footballNormalizeFee(footballDeepFind(mostRecent, ['fee', 'transferFee', 'feeText', 'transferFeeText', 'feeDisplay', 'feeDescription']));
const details = mostRecent.details || null;
const date = mostRecent.date || mostRecent.transferDate || (details && details.date) || null;
const season = mostRecent.season?.display || (details && details.season ? (details.season.nonCyclicalName || details.season.display) : null) || mostRecent.season || null;
const fromId = src.clubId ? String(src.clubId) : null;
const toId = dst.clubId ? String(dst.clubId) : null;
const fromName = fromId && clubMap && clubMap[fromId] ? clubMap[fromId].name : (src.clubName || src.name || null);
const toName = toId && clubMap && clubMap[toId] ? clubMap[toId].name : (dst.clubName || dst.name || null);
return { from: fromName, to: toName, fromId, toId, fee: fee ? String(fee) : null, date: date ? footballFormatDate(date) || date : null, season: season ? String(season) : null };
}

async function footballResolveCountriesViaTmapi(countryIds) {
  return {};
}
async function footballResolveCountriesViaTmapi_DISABLED_deadEndpoints(countryIds) {
  const ids = Array.from(new Set((countryIds || []).filter(Boolean).map(String)));
  if (!ids.length) return {};
  const result = {};
  const ingest = (c) => {
    if (!c || typeof c !== 'object') return;
    const cid = String(c.id || c.countryId || (c.country && c.country.id) || '');
    if (!cid) return;
    const name = c.name || c.displayName || c.officialName || c.countryName || c.shortName || c.title || (c.country && (c.country.name || c.country.displayName)) || null;
    if (name) result[cid] = String(name);
  };
  const ingestPayload = (payload) => {
    const before = Object.keys(result).length;
    const data = footballUnwrapEnvelope(payload);
    if (Array.isArray(data)) { data.forEach(ingest); }
    else if (data && typeof data === 'object') {
      const entries = Object.entries(data);
      if (entries.length && entries.every(([, v]) => typeof v === 'string' || typeof v === 'number')) {
        entries.forEach(([k, v]) => { result[k] = String(v); });
      } else if (Array.isArray(data.data)) { data.data.forEach(ingest); }
      else { Object.values(data).forEach(v => { if (v && typeof v === 'object') ingest(v); }); }
    }
    return Object.keys(result).length > before;
  };
  const chunks = [];
  for (let i = 0; i < ids.length; i += 20) chunks.push(ids.slice(i, i + 20));
  for (const chunk of chunks) {
    const qs = chunk.map(id => `ids[]=${encodeURIComponent(id)}`).join('&');
    const urls = [
      `${TMAPI_BASE}/countries?${qs}`,
      `${TMAPI_BASE}/country?${qs}`,
      `${TMAPI_BASE}/countries/list?${qs}`
    ];
    let done = false;
    for (const url of urls) {
      const res = await footballFetchJson(url, 8000).catch(() => ({ ok: false }));
      if (!res.ok) continue;
      if (ingestPayload(res.data)) { done = true; break; }
    }
    if (!done) {

      for (const id of chunk) {
        const perUrls = [
          `${TMAPI_BASE}/countries/${encodeURIComponent(id)}`,
          `${TMAPI_BASE}/country/${encodeURIComponent(id)}`
        ];
        for (const url of perUrls) {
          const res = await footballFetchJson(url, 8000).catch(() => ({ ok: false }));
          if (!res.ok) continue;
          const d = footballUnwrapEnvelope(res.data);
          const name = d && (d.name || d.displayName || d.officialName || d.countryName);
          if (name) { result[id] = String(name); break; }
        }
      }
    }
    if (!done) footballLog('countries resolve failed for', chunk);
  }
  return result;
}
async function footballResolveCompetitionsViaTmapi(compIds) {
const ids = Array.from(new Set((compIds || []).filter(Boolean).map(String)));
if (!ids.length) return {};
const chunks = [];
for (let i = 0; i < ids.length; i += 20) chunks.push(ids.slice(i, i + 20));
const result = {};
for (const chunk of chunks) {
const qs = chunk.map(id => `ids[]=${encodeURIComponent(id)}`).join('&');
const urls = [`${TMAPI_BASE}/competitions?${qs}`, `${TMAPI_BASE}/competition?${qs}`];
let fetched = false;
for (const url of urls) {
const res = await footballFetchJson(url, 8000).catch(() => ({ ok: false }));
if (!res.ok) continue;
const data = footballUnwrapEnvelope(res.data);
let list = Array.isArray(data) ? data : (data && typeof data === 'object' ? Object.values(data).filter(v => v && typeof v === 'object') : []);
if (!list.length) continue;
list.forEach(comp => {
if (!comp) return;
const cid = String(comp.id || comp.competitionId || '');
if (!cid) return;

result[cid] = {
name: comp.name || comp.shortName || comp.abbreviation || cid,
logoUrl: comp.logoUrl || (comp.historical && comp.historical.images && comp.historical.images[0] && comp.historical.images[0].url) || null
};
});
fetched = true; break;
}
if (!fetched) footballLog('competitions resolve failed for', chunk);
}
return result;
}

async function footballFetchPerformanceGame(id) {
  const url = `${TMAPI_BASE}/player/${encodeURIComponent(id)}/performance-game`;
  const res = await footballFetchJson(url, 15000).catch(() => ({ ok: false }));
  if (!res.ok) return null;
  return footballUnwrapEnvelope(res.data);
}

function footballClassifyCompetition(name) {
  const low = String(name || '').toLowerCase();

  if (/\bu\s*[-]?\s*\d{1,2}\b/.test(low) || /\byouth\b|\bjunior\b|\bacademy\b|\bolympic\b/.test(low)) return 'youth';

  if (/club world cup|fifa club|champions league|europa|conference league|premier league|primeira liga|bundesliga|serie a|ligue 1|eredivisie|la liga|fa cup|efl cup|league cup|carabao|super cup|copa del rey|dfb|libertadores|sudamericana|community shield|play-?off/.test(low)) return 'club';

  if (/world cup|nations league|european championship|\beuro\b|copa am|afcon|africa cup|asian cup|gold cup|international friendl|national team|qualif|finalissima/.test(low)) return 'national';

  return 'club';
}

function footballIsYouthTeamName(name) {
const low = String(name || '').toLowerCase();
return /\bu\s*[-]?\s*\d{1,2}\b/.test(low) || /\byouth\b|\bjunior\b|\bacademy\b|\bolympic\b/.test(low);
}

function footballNormalizeCountryName(name) {
let s = String(name || '').trim();
if (!s) return s;
let prev;
do {
prev = s;
s = s.replace(/\s+u\s*-?\s*\d{1,2}$/i, '').trim();
s = s.replace(/\s+(women|w|youth|junior|olympic|academy|b)$/i, '').trim();
} while (s !== prev && s.length);
return s || String(name || '').trim();
}

function footballPerfGamesList(perfData) {
  if (!perfData) return [];
  if (Array.isArray(perfData)) return perfData;
  if (perfData.performance && Array.isArray(perfData.performance)) return perfData.performance;
  if (perfData.data && Array.isArray(perfData.data)) return perfData.data;
  if (typeof perfData === 'object') {
    const vals = Object.values(perfData);
    if (vals.length && vals[0] && vals[0].gameInformation) return vals;
  }
  return [];
}

function footballCompetitionLogoFor(compId, compMap) {
const cid = String(compId || '');
if (!cid) return null;
if (compMap && compMap[cid] && compMap[cid].logoUrl) return compMap[cid].logoUrl;
return `https://tmssl.akamaized.net/images/logo/medium/${encodeURIComponent(cid.toLowerCase())}.png`;
}

function footballCompetitionNameFor(gi, compMap) {
  const compId = String(gi.competitionId || 'unknown');
  return (compMap[compId] && compMap[compId].name) || gi.competitionName || (gi.competition && gi.competition.name) || compId;
}

function footballBuildDetailedStatsFromPerformance(perfData, compMap) {
if (!perfData) return null;
const games = footballPerfGamesList(perfData).filter(g => {
if (!g || !g.gameInformation) return false;

if (g.gameInformation.isNationalGame === true) return false;
return footballClassifyCompetition(footballCompetitionNameFor(g.gameInformation, compMap)) === 'club';
});
if (!games.length) return null;
const groups = {};
let maxSeasonId = -1;
games.forEach(g => {
if (!g || !g.gameInformation) return;
const gi = g.gameInformation;
const seasonId = gi.seasonId || gi.season?.id || 0;
if (seasonId > maxSeasonId) maxSeasonId = seasonId;
const compId = String(gi.competitionId || 'unknown');
const key = `${seasonId}__${compId}`;
if (!groups[key]) {
groups[key] = {
seasonId,
seasonDisplay: gi.season?.nonCyclicalName || gi.season?.display || String(seasonId),
competitionId: compId,
competitionName: footballCompetitionNameFor(gi, compMap),

competitionLogo: footballCompetitionLogoFor(compId, compMap),
apps: 0, goals: 0, assists: 0, yellow: 0, red: 0, minutes: 0
};
}
const stats = g.statistics || {};
const gen = stats.generalStatistics || {};
const goal = stats.goalStatistics || {};
const card = stats.cardStatistics || {};
const time = stats.playingTimeStatistics || {};
const played = gen.participationState === 'played' || (time.playedMinutes && time.playedMinutes > 0);
if (played) groups[key].apps += 1;
groups[key].goals += (goal.goalsScoredTotal || 0);
groups[key].assists += (goal.assists || 0);
groups[key].yellow += (card.yellowCardGross || card.yellowCardNet || 0);
const red = (card.redCards || 0) + (card.secondYellowCard || 0) + (card.redCard || 0);
groups[key].red += red;
groups[key].minutes += (time.playedMinutes || 0);
});
const all = Object.values(groups).sort((a, b) => b.seasonId !== a.seasonId ? b.seasonId - a.seasonId : b.apps - a.apps);
const lastSeason = all.filter(g => g.seasonId === maxSeasonId);
let total = null;
if (lastSeason.length) {
total = { seasonDisplay: lastSeason[0].seasonDisplay, seasonId: maxSeasonId, apps: 0, goals: 0, assists: 0, yellow: 0, red: 0, minutes: 0 };
lastSeason.forEach(g => { total.apps += g.apps; total.goals += g.goals; total.assists += g.assists; total.yellow += g.yellow; total.red += g.red; total.minutes += g.minutes; });
}
return { all, lastSeason, total, maxSeasonId };
}

function searchFootballPlayers(query) {
  return footballSearchPlayers(query);
}
async function footballSearchPlayers(query) {
  const q = String(query || '').trim();
  if (!q) return { ok: true, candidates: [] };
  const url = `${TM_BASE}/spieler/searchSpielerDaten?q=${encodeURIComponent(q)}`;
  footballLog('footballSearchPlayers: fetching', url);
  let res;
  try {
    res = await httpGetText(url, footballJsonHeaders(), 10000);
  } catch (e) {
    footballLogError('searchFootballPlayers: network error', q, e);
    return { ok: false, reason: 'network', error: String(e && e.message ? e.message : e) };
  }
  if (!res.ok) {
    return { ok: false, reason: 'network', status: res.status };
  }
  const text = (res.text || '').trim();
  if (!text) {
    return { ok: false, reason: 'network', error: 'empty response' };
  }
  let json;
  try { json = JSON.parse(text); }
  catch (e) {
    footballLogError('footballSearchPlayers: JSON.parse failed for', q, 'first200:', text.slice(0, 200), e);
    return { ok: false, reason: 'parse', error: String(e && e.message ? e.message : e) };
  }
  let items = [];
  if (Array.isArray(json)) items = json;
  else if (json && Array.isArray(json.results)) items = json.results;
  else if (json && json.data && Array.isArray(json.data)) items = json.data;
  else if (json && json.data && json.data.results && Array.isArray(json.data.results)) items = json.data.results;
  else if (json && typeof json === 'object') {
    for (const k in json) { if (Array.isArray(json[k])) { items = json[k]; break; } }
  }
  const candidates = items.slice(0, 8).map((item) => {
    const id = String(item.id || item.playerId || item.spielerId || '').trim();
    if (!id) return null;
    const parsed = footballParseSearchNameHtml(String(item.name || item.title || ''));
    if (!parsed.name) return null;
    const rawImage = item.portraitUrl || item.image || item.photo || null;
    const image = rawImage ? footballUsePhotoSize(rawImage) : null;
    return {
      id,
      label: parsed.name,
      description: parsed.sub || '',
      image,
      profileUrl: `${TM_BASE}/${footballSlugify(parsed.name)}/profil/spieler/${id}`
    };
  }).filter(Boolean);
  if (candidates.length > 1) {
    await footballEnrichCandidatePhotos(candidates);
  } else {

    await Promise.all(candidates.map(async (singleCandidate) => {
      if (!singleCandidate || !singleCandidate.image || String(singleCandidate.image).startsWith('data:')) return;
      singleCandidate.image = await footballResolveCandidateImageUrl(singleCandidate.image);
    }));
  }
  footballLog('footballSearchPlayers: found', candidates.length, 'for', q);
  return { ok: true, candidates };
}
function footballParseSearchNameHtml(html) {
  if (!html) return { name: null, sub: '' };
  const doc = footballCreateDocument(`<div>${html}</div>`);
  if (doc) {
    const img = doc.querySelector('img[title]');
    if (img) {
      const iEl = doc.querySelector('i');
      return { name: (img.getAttribute('title') || '').trim(), sub: iEl ? (footballText(iEl) || '') : '' };
    }
    const iEl = doc.querySelector('i');
    const sub = iEl ? (footballText(iEl) || '') : '';
    if (iEl) iEl.remove();
    const name = (footballText(doc.body) || '').split('\n')[0].trim();
    if (name) return { name, sub };
  }
  const titleMatch = html.match(/title="([^"]+)"/);
  const iMatch = html.match(/<i[^>]*>([^<]*)<\/i>/);
  const sub = iMatch ? iMatch[1].replace(/&amp;/g, '&').trim() : '';
  if (titleMatch) return { name: titleMatch[1].trim(), sub };
  const stripped = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return { name: stripped || null, sub };
}

async function footballResolveCandidateImageUrl(rawImageUrl) {
  if (!rawImageUrl) return null;
  try {
    const imageResult = await fetchImageAsDataUrl(rawImageUrl, 8000);
    return (imageResult && imageResult.ok && imageResult.dataUrl) ? imageResult.dataUrl : null;
  } catch (resolveError) {
    footballLog('footballResolveCandidateImageUrl: failed for', rawImageUrl, '->', resolveError && resolveError.message ? resolveError.message : resolveError);
    return null;
  }
}
async function footballEnrichCandidatePhotos(candidates) {
  await Promise.all(candidates.map(async (candidate) => {
    try {
      const res = await footballFetchJson(`${TMAPI_BASE}/player/${encodeURIComponent(candidate.id)}`, 8000);
      if (!res.ok) return;
      const profile = footballUnwrapEnvelope(res.data);
      if (profile && profile.portraitUrl) {
        const rawPortrait = footballUsePhotoSize(profile.portraitUrl, 'big');

        candidate.image = await footballResolveCandidateImageUrl(rawPortrait);
      }
    } catch (e) {}
  }));
}

async function getFootballPlayerInfo(id, profileUrl, isMini) {
const url = `${TMAPI_BASE}/player/${encodeURIComponent(id)}`;
footballLog('getFootballPlayerInfo: fetching', url);
const fbSettings = await getFootballSettings();

const wantStats = fbSettings.footballFieldCurrentSeasonStats !== false || fbSettings.footballFieldCareerTotalStats !== false;

const [profileRes, transferRes, perfRaw, natCareerRaw, honoursHtml, injuryRaw, wikidataLinks] = await Promise.all([
footballFetchJson(url, 12000),
footballFetchJson(`${TMAPI_BASE}/transfer/history/player/${encodeURIComponent(id)}`, 10000).catch(() => ({ ok: false })),
wantStats
? footballFetchPerformanceGame(id).then(data => ({ ok: !!data, data })).catch(() => ({ ok: false }))
: Promise.resolve({ ok: false }),
(!isMini && fbSettings.footballFieldNationalTeamCareer !== false)
? footballFetchNationalCareer(id).then(data => ({ ok: !!data, data })).catch(() => ({ ok: false }))
: Promise.resolve({ ok: false }),
(fbSettings.footballFieldHonours !== false)
? footballFetchHonoursPage(id, profileUrl).catch(() => null)
: Promise.resolve(null),
(fbSettings.footballFieldInjuryBadge !== false)
? footballFetchInjury(id).then(data => ({ ok: !!data, data })).catch(() => ({ ok: false }))
: Promise.resolve({ ok: false }),
getFootballPlayerWikidataLinks(String(id)).catch(() => ({}))
]);
if (!profileRes.ok) {
footballLogError('getFootballPlayerInfo: profile fetch failed for', id, '->', profileRes);
return { ok: false, reason: profileRes.reason || 'network', status: profileRes.status };
}
const profile = footballUnwrapEnvelope(profileRes.data);
const transferData = transferRes && transferRes.ok ? footballUnwrapEnvelope(transferRes.data) : null;
const perfData = perfRaw && perfRaw.ok ? perfRaw.data : null;
const natCareerData = natCareerRaw && natCareerRaw.ok ? natCareerRaw.data : null;
const injuryData = injuryRaw && injuryRaw.ok ? injuryRaw.data : null;

const clubIdsNeeded = [];
const clubAssignmentsAll = Array.isArray(profile.clubAssignments) ? profile.clubAssignments : [];
const currentAssignment = clubAssignmentsAll.find(a => a && a.type === 'current') || clubAssignmentsAll[0] || null;
if (currentAssignment && currentAssignment.clubId) clubIdsNeeded.push(String(currentAssignment.clubId));

clubAssignmentsAll.forEach(a => { if (a && a.type === 'nationalTeam' && a.clubId) clubIdsNeeded.push(String(a.clubId)); });
if (natCareerData && Array.isArray(natCareerData.clubIds)) {
natCareerData.clubIds.forEach(cid => { if (cid) clubIdsNeeded.push(String(cid)); });
}
const mostRecentTransfer = transferData && (transferData.mostRecentTransfer || transferData.lastTransfer);
if (mostRecentTransfer) {
const src = mostRecentTransfer.transferSource || mostRecentTransfer.from || {};
const dst = mostRecentTransfer.transferDestination || mostRecentTransfer.to || {};
if (src.clubId) clubIdsNeeded.push(String(src.clubId));
if (dst.clubId) clubIdsNeeded.push(String(dst.clubId));
}

if (transferData) {
const tEntries = [].concat(Array.isArray(transferData.terminated) ? transferData.terminated : [], Array.isArray(transferData.pending) ? transferData.pending : []);
tEntries.slice(0, 3).forEach(t => {
if (!t) return;
if (t.transferSource && t.transferSource.clubId) clubIdsNeeded.push(String(t.transferSource.clubId));
if (t.transferDestination && t.transferDestination.clubId) clubIdsNeeded.push(String(t.transferDestination.clubId));
});
}

let compIds = [];
if (perfData) {
  footballPerfGamesList(perfData).forEach(g => { const cid = g?.gameInformation?.competitionId; if (cid) compIds.push(String(cid)); });
}
const [clubMap, compMap, playerNextMatches, playerPrevMatches] = await Promise.all([
  footballResolveClubsViaTmapi(clubIdsNeeded),
  footballResolveCompetitionsViaTmapi(compIds),

  (!isMini && fbSettings.footballFieldPlayerNextMatches && currentAssignment && currentAssignment.clubId)
    ? footballFetchTeamNextMatches(String(currentAssignment.clubId),id,"Player", 3).catch(() => [])
    : Promise.resolve([]),
  (!isMini && fbSettings.footballFieldPlayerPrevMatches && currentAssignment && currentAssignment.clubId)
    ? footballFetchTeamPrevMatches(String(currentAssignment.clubId),id,"Player", 3).catch(() => [])
    : Promise.resolve([])
]);

const countryIdsNeeded = [];
const nationalityIdsFromProfile = (function () {
const raw = profile.nationalities || profile.citizenships || profile.countries || [];
const ids = [];
if (Array.isArray(raw)) {
raw.forEach(n => {
if (!n) return;
if (typeof n === 'string' || typeof n === 'number') ids.push(String(n));
else if (n.id) ids.push(String(n.id));
else if (n.countryId) ids.push(String(n.countryId));
});
}

const nd = profile.nationalityDetails && profile.nationalityDetails.nationalities ? profile.nationalityDetails.nationalities : null;
if (nd) { ['nationalityId', 'secondNationalityId', 'thirdNationalityId'].forEach(k => { if (nd[k]) ids.push(String(nd[k])); }); }
if (profile.nationalityId) ids.push(String(profile.nationalityId));
if (profile.countryId) ids.push(String(profile.countryId));
return Array.from(new Set(ids));
})();
nationalityIdsFromProfile.forEach(id2 => countryIdsNeeded.push(id2));

Object.values(clubMap).forEach(c => { if (c.countryId) countryIdsNeeded.push(String(c.countryId)); });

const countryMap = await footballResolveCountriesViaTmapi(countryIdsNeeded);

Object.values(clubMap).forEach(c => {
if (!c || !c.crestUrl || !c.name) return;
const fm = String(c.crestUrl).match(/\/flagge\/[^/]*\/(\d+)\.png/);
if (fm && !countryMap[fm[1]]) countryMap[fm[1]] = footballNormalizeCountryName(c.name);
});

if (currentAssignment && currentAssignment.clubId) {
  const currentClubEntry = clubMap[String(currentAssignment.clubId)];
  const currentClubLeagueId = currentClubEntry && currentClubEntry.leagueId ? String(currentClubEntry.leagueId) : null;
  if (currentClubLeagueId && !compMap[currentClubLeagueId]) {
    const leagueCompMap = await footballResolveCompetitionsViaTmapi([currentClubLeagueId]);
    if (leagueCompMap[currentClubLeagueId]) compMap[currentClubLeagueId] = leagueCompMap[currentClubLeagueId];
  }
  if (currentClubLeagueId && compMap[currentClubLeagueId]) {
    if (currentClubEntry) {
      currentClubEntry.leagueName = compMap[currentClubLeagueId].name || null;
      currentClubEntry.leagueLogoUrl = compMap[currentClubLeagueId].logoUrl || null;
    }
  }
}
const detailedStats = footballBuildDetailedStatsFromPerformance(perfData, compMap);
const nationalTeamStats = footballBuildNationalTeamStats(perfData, compMap, clubMap);
const nationalTeamCareer = footballBuildNationalTeamCareer(natCareerData, clubMap);
const honours = honoursHtml ? footballParseHonours(honoursHtml) : [];
const careerByComp = footballAggregateCareerByCompetition(detailedStats && detailedStats.all ? detailedStats.all : []);
try {
const data = footballBuildPlayerData(id, profile, null, transferData, null, profileUrl, clubMap, countryMap, compMap, detailedStats, nationalTeamStats, careerByComp);

const retiredClubId = currentAssignment && currentAssignment.clubId ? String(currentAssignment.clubId) : null;
data.retired = retiredClubId === '123' || !!(clubMap[retiredClubId] && /retired/i.test(clubMap[retiredClubId].name || ''));
data.honours = honours;

data.eaFcRating = (fbSettings.footballFieldFutRating && !data.retired)
  ? await getEaFcRating(data.name, data.nationalities, data.dob)
  : null;

data.nextMatches = playerNextMatches;
data.prevMatches = playerPrevMatches;
data.nationalTeamCareer = nationalTeamCareer;

if (wikidataLinks && wikidataLinks.wikipediaArticle) data.wikipediaUrl = wikidataLinks.wikipediaArticle;
data.officialSite = (wikidataLinks && wikidataLinks.officialWebsite) || null;
data.soccerwayUrl = (wikidataLinks && wikidataLinks.soccerwayId) ? `https://www.scorebar.com/players/-/${encodeURIComponent(wikidataLinks.soccerwayId)}/` : null;

data.statusBadges = footballBuildStatusBadges(injuryData, transferData, clubMap, retiredClubId, clubAssignmentsAll, profile, fbSettings.footballFieldInjuryBadge, fbSettings.footballFieldLoanBadge);
footballLog('getFootballPlayerInfo: parsed ok for', id, '->', data.name);
return { ok: true, data };
} catch (e) {
footballLogError('getFootballPlayerInfo: build failed for', id, '->', e && e.message ? e.message : e);
return { ok: false, error: String(e && e.message ? e.message : e) };
}
}

function footballAggregateCareerByCompetition(allStats) {
if (!allStats || !allStats.length) return [];
const map = {};
allStats.forEach(r => {
const comp = r.competitionName || 'Unknown';
if (!map[comp]) {
map[comp] = { competitionName: comp, logo: r.competitionLogo || null, apps: 0, goals: 0, assists: 0, yellow: 0, red: 0, minutes: 0 };
}

if (!map[comp].logo && r.competitionLogo) map[comp].logo = r.competitionLogo;
map[comp].apps += Number(r.apps) || 0;
map[comp].goals += Number(r.goals) || 0;
map[comp].assists += Number(r.assists) || 0;
map[comp].yellow += Number(r.yellow) || 0;
map[comp].red += Number(r.red) || 0;
map[comp].minutes += Number(r.minutes) || 0;
});

return Object.values(map).sort((a, b) => b.apps - a.apps);
}

function footballBuildNationalTeamStats(perfData, compMap, ntTeamMap) {
if (!perfData) return [];
const games = footballPerfGamesList(perfData);
const map = {};
games.forEach(g => {
if (!g || !g.gameInformation) return;
const gi = g.gameInformation;

if (gi.isNationalGame !== true) return;
const ntClubId = String((g.clubsInformation && g.clubsInformation.club && g.clubsInformation.club.clubId) || '');
const ntName = (ntTeamMap && ntTeamMap[ntClubId] && ntTeamMap[ntClubId].name) ? ntTeamMap[ntClubId].name : footballCompetitionNameFor(gi, compMap);
if (footballIsYouthTeamName(ntName)) return;
const compId = String(gi.competitionId || 'nt');
const seasonId = gi.seasonId || (gi.season && gi.season.id) || 0;
const seasonDisplay = (gi.season && (gi.season.nonCyclicalName || gi.season.display)) || String(seasonId);
const key = `${compId}__${seasonId}`;
if (!map[key]) map[key] = { competitionName: compNameForNT(gi, compMap, ntName), seasonDisplay, seasonId, apps: 0, goals: 0, assists: 0, minutes: 0, yellow: 0, red: 0 };
const stats = g.statistics || {};
const gen = stats.generalStatistics || {};
const goal = stats.goalStatistics || {};
const card = stats.cardStatistics || {};
const time = stats.playingTimeStatistics || {};
const played = gen.participationState === 'played' || (time.playedMinutes && time.playedMinutes > 0);
if (played) map[key].apps += 1;
map[key].goals += (goal.goalsScoredTotal || 0);
map[key].assists += (goal.assists || 0);
map[key].minutes += (time.playedMinutes || 0);
map[key].yellow += (card.yellowCardGross || card.yellowCardNet || 0);
map[key].red += (card.redCards || 0) + (card.secondYellowCard || 0) + (card.redCard || 0);
});
return Object.values(map).sort((a, b) => b.seasonId !== a.seasonId ? b.seasonId - a.seasonId : b.apps - a.apps);
}
function compNameForNT(gi, compMap, fallbackName) {

return fallbackName || footballCompetitionNameFor(gi, compMap);
}

async function footballFetchNationalCareer(id) {
const url = `${TMAPI_BASE}/player/${encodeURIComponent(id)}/national-career-history`;
const res = await footballFetchJson(url, 10000).catch(() => ({ ok: false }));
if (!res.ok) return null;
return footballUnwrapEnvelope(res.data);
}

async function footballFetchInjury(id) {
const url = `${TMAPI_BASE}/player/${encodeURIComponent(id)}/injury`;
const res = await footballFetchJson(url, 10000).catch(() => ({ ok: false }));
if (!res.ok) return null;
return footballUnwrapEnvelope(res.data);
}

function footballBuildNationalTeamCareer(natCareerData, clubMap) {
if (!natCareerData || !Array.isArray(natCareerData.history)) return [];
const rows = [];
natCareerData.history.forEach(h => {
if (!h) return;
const cid = String(h.clubId || '');
const club = (cid && clubMap && clubMap[cid]) ? clubMap[cid] : null;
rows.push({
teamId: cid,
teamName: club && club.name ? club.name : (cid || 'Unknown'),

flagUrl: club && club.crestUrl ? club.crestUrl : null,
shirtNumber: typeof h.shirtNumber === 'number' ? h.shirtNumber : null,
debut: h.debut ? (footballFormatDate(h.debut) || h.debut) : null,
apps: typeof h.gamesPlayed === 'number' ? h.gamesPlayed : 0,
goals: typeof h.goalsScored === 'number' ? h.goalsScored : 0,
isCurrent: h.careerState === 'CURRENT_NATIONAL_PLAYER'
});
});
return rows;
}

async function footballFetchHonoursPage(id, profileUrl) {
const slugMatch = String(profileUrl || '').match(/\/([^/]+)\/profil\/spieler\//);
const slug = slugMatch ? slugMatch[1] : footballSlugify('player');
const url = `${TM_BASE}/${slug}/erfolge/spieler/${encodeURIComponent(id)}`;
footballLog('footballFetchHonoursPage: fetching', url);
let res;
try { res = await httpGetText(url, footballJsonHeaders(), 12000); }
catch (e) { footballLogError('footballFetchHonoursPage: network error', id, e); return null; }
if (!res || !res.ok || !res.text) return null;
return res.text;
}

async function footballFetchCoachHonoursPage(id, name) {
  const slug = footballSlugify(name || 'trainer');
  const url = `${TM_BASE}/${slug}/erfolge/trainer/${encodeURIComponent(id)}`;
  footballLog('footballFetchCoachHonoursPage: fetching', url);
  let res;
  try { res = await httpGetText(url, footballJsonHeaders(), 12000); }
  catch (e) { footballLogError('footballFetchCoachHonoursPage: network error', id, e); return null; }
  if (!res || !res.ok || !res.text) return null;
  return res.text;
}

async function footballFetchCoachProfilePage(id, name) {
  const slug = footballSlugify(name || 'trainer');
  const url = `${TM_BASE}/${slug}/profil/trainer/${encodeURIComponent(id)}`;
  footballLog('footballFetchCoachProfilePage: fetching', url);
  let res;
  try { res = await httpGetText(url, footballJsonHeaders(), 12000); }
  catch (e) { footballLogError('footballFetchCoachProfilePage: network error', id, e); return null; }
  if (!res || !res.ok || !res.text) return null;
  return res.text;
}

function footballParseCoachProfilePage(html) {
  const doc = footballCreateDocument(html);
  if (!doc) return null;
  const out = {};

  const normLabel = (s) => (s || '').toLowerCase().replace(/[:\s/]+$/g, '').replace(/\s+/g, ' ').trim();

  doc.querySelectorAll('table.auflistung > tbody > tr').forEach((tr) => {
    const th = tr.querySelector('th');
    const td = tr.querySelector('td');
    if (!th || !td) return;
    const label = normLabel(th.textContent);
    const text = td.textContent.replace(/\s+/g, ' ').trim();
    const flagImg = td.querySelector('img.flaggenrahmen');
    const flagUrl = flagImg ? flagImg.getAttribute('src') : null;
    const flagName = flagImg ? flagImg.getAttribute('title') : null;

    if (label.includes('name in home country') || label.includes('full name')) out.fullName = text || null;
    else if (label.includes('date of birth')) {
      const m = text.match(/^(.*?)(?:\s*\((\d+)\))?$/);
      out.dobScraped = m && m[1] ? m[1].trim() : text;
      out.ageScraped = m && m[2] ? parseInt(m[2], 10) : null;
    }
    else if (label.includes('place of birth')) { out.placeOfBirth = text || null; out.placeOfBirthFlagUrl = flagUrl; out.placeOfBirthCountry = flagName; }
    else if (label.includes('citizenship')) { out.citizenship = text || null; out.citizenshipFlagUrl = flagUrl; out.citizenshipCountry = flagName; }
    else if (label.includes('contract until')) out.contractUntilScraped = text || null;
    else if (label.includes('avg. term as coach') || label.includes('avg term as coach')) out.avgTermAsCoach = text || null;
    else if (label.includes('coaching licence') || label.includes('coaching license')) out.coachingLicence = text || null;
    else if (label.includes('preferred formation')) out.preferredFormation = text || null;
    else if (label.includes('agent')) {
      const link = td.querySelector('a');
      out.agent = text || null;
      out.agentUrl = link ? footballAbsoluteUrl(link.getAttribute('href')) : null;
    }
  });

  doc.querySelectorAll('.dataProfileDaten .data-header__label').forEach((span) => {
    const contentSpan = span.querySelector('.data-header__content');
    const value = contentSpan ? contentSpan.textContent.replace(/\s+/g, ' ').trim() : '';
    const fullText = span.textContent.replace(/\s+/g, ' ').trim();
    const label = normLabel(fullText.replace(value, ''));
    if (!value) return;
    if (label.includes('last club')) out.lastClub = value;
    else if (label.includes('most games for')) out.mostGamesFor = value;
    else if (label.includes('retired')) out.retiredDate = value;
  });

  try {
    const clubBox = doc.querySelector('.data-header__box__club-link, .data-header__club-info');
    const clubLink = doc.querySelector('.data-header__club a[href*="/startseite/verein/"]') || doc.querySelector('.data-header__box__club-link a[href*="/startseite/verein/"]');
    const clubImg = doc.querySelector('.data-header__box__club-link img, .data-header__club-info + * img, .data-header__box__club-link img');

    const crestImg = doc.querySelector('a.data-header__box__club-link img, .data-header__box__club-link + a img, .data-header__club-info img');
    const actualCrest = doc.querySelector('.data-header__box__club-link a img, a[title] img[src*="wappen"]');

    let curName = null, curId = null, curCrest = null;
    if (clubLink) {
      curName = (clubLink.getAttribute('title') || clubLink.textContent || '').replace(/\s+/g,' ').trim() || null;
      const href = clubLink.getAttribute('href') || '';
      const m = href.match(/\/verein\/(\d+)/);
      if (m) curId = m[1];
    }

    const crestEl = doc.querySelector('a[href*="/startseite/verein/"] img, .data-header__box__club-link img');
    if (crestEl) curCrest = crestEl.getAttribute('src') || null;

    const leagueLink = doc.querySelector('.data-header__league a');
    let leagueName = null, leagueFlag = null;
    if (leagueLink) {
      const b = leagueLink.querySelector('b');
      leagueName = (b ? b.textContent : leagueLink.textContent || '').replace(/\s+/g,' ').trim() || null;
      const flag = leagueLink.querySelector('img');
      if (flag) leagueFlag = flag.getAttribute('src') || null;
    }

    let appointed = null, contractUntilHeader = null;
    doc.querySelectorAll('.data-header__club-info .data-header__label').forEach((span)=>{
      const content = span.querySelector('.data-header__content');
      const val = content ? content.textContent.replace(/\s+/g,' ').trim() : '';
      const full = span.textContent.replace(/\s+/g,' ').trim().toLowerCase();
      if (full.includes('appointed')) appointed = val || null;
      if (full.includes('contract until')) contractUntilHeader = val || null;
    });

    if (curName || curId) {
      out.currentClub = {
        name: curName,
        id: curId,
        crestUrl: curCrest ? footballAbsoluteUrl(curCrest) : null,
        league: leagueName,
        leagueFlagUrl: leagueFlag ? footballAbsoluteUrl(leagueFlag) : null,
        appointed: appointed,
        contractUntil: contractUntilHeader
      };
    } else if (appointed || contractUntilHeader) {

      out.currentClub = {
        name: null, id: null, crestUrl: null,
        league: leagueName, leagueFlagUrl: leagueFlag ? footballAbsoluteUrl(leagueFlag) : null,
        appointed, contractUntil: contractUntilHeader
      };
    }
  } catch(e) {}

  try {
    let playerLink = doc.querySelector('a.data-header__box--link[href*="/profil/spieler/"]');
    if (!playerLink) {

      doc.querySelectorAll('.dataProfileDaten a[href*="/profil/spieler/"], a[href*="/profil/spieler/"]').forEach(a => {
        if (!playerLink) playerLink = a;
      });
    }
    if (playerLink) {
      const href = playerLink.getAttribute('href') || '';
      const m = href.match(/\/profil\/spieler\/(\d+)/);
      if (m) out.asPlayerIdScraped = m[1];
      out.asPlayerUrlScraped = footballAbsoluteUrl(href);
    }
  } catch(e) {}

  return Object.keys(out).length ? out : null;
}

function footballParseTeamHonours(doc){
  const honours=[];
  try{
    const boxes = doc.querySelectorAll('.box');
    boxes.forEach(box=>{
      const h2 = box.querySelector('.header h2, h2');
      if(!h2) return;
      const text = (h2.textContent||'').replace(/\s+/g,' ').trim();
      const m = text.match(/^(\d+)\s*x\s+(.+)$/i);
      if(!m) return;
      const count = parseInt(m[1],10);
      const title = m[2].trim();
      let logoUrl = null;
      const img = box.querySelector('.erfolg_bild_box img, img');
      if(img && img.getAttribute('src')) logoUrl = img.getAttribute('src');
      let seasonsRaw = '';
      const infoBox = box.querySelector('.erfolg_infotext_box');
      if(infoBox) seasonsRaw = (infoBox.textContent||'').replace(/\s+/g,' ').trim();
      const seasons = seasonsRaw ? seasonsRaw.split(',').map(s=>s.trim()).filter(Boolean) : [];
      honours.push({ count, title, logoUrl, seasons, seasonsText: seasonsRaw });
    });
  }catch(e){}
  return honours;
}

function footballParseHonours(html) {
const doc = footballCreateDocument(html);
if (!doc) return [];
const honours = [];
const headings = doc.querySelectorAll('h1, h2, h3');
for (const h of headings) {
const text = (h.textContent || '').replace(/\s+/g, ' ').trim();
if (/^all titles$/i.test(text)) break;
const m = text.match(/^(\d+)\s*x\s+(.+)$/i);
if (!m) continue;
const title = m[2].trim();
let logoUrl = null;
const seasons = [];
let club = null;
let node = h.nextElementSibling;
if (node) {
const img = node.querySelector('img');
if (img && img.getAttribute('src')) logoUrl = img.getAttribute('src');
node.querySelectorAll('tr').forEach(tr => {
const cells = tr.querySelectorAll('td');
if (!cells.length) return;
const s = (cells[0].textContent || '').trim();
if (s) seasons.push(s);
const c = (cells[cells.length - 1].textContent || '').trim();
if (c && !club) club = c;
if (!logoUrl) { const ti = tr.querySelector('img'); if (ti && ti.getAttribute('src')) logoUrl = ti.getAttribute('src'); }
});
}
honours.push({ count: parseInt(m[1], 10), title, seasons, club, logoUrl });
if (honours.length >= 12) break;
}
return honours;
}

function footballBuildPlayerData(id, profile, historyData, transferData, statsData, fallbackProfileUrl, clubMap = {}, countryMap = {}, compMap = {}, detailedStats = null, nationalTeamStats = null, careerByComp = null) {
const name = profile.name || profile.shortName || 'Unknown player';
const photo = footballUsePhotoSize(profile.portraitUrl, 'big');
const { age, dob, birthPlace, height, foot, position, agent, contractExpires, squadNumber, nationalityIds, nationalityNames } = footballExtractProfileFields(profile);
const clubAssignments = Array.isArray(profile.clubAssignments) ? profile.clubAssignments : [];
const currentAssignment = clubAssignments.find(a => a && a.type === 'current') || clubAssignments[0] || null;
const currentClubId = currentAssignment && currentAssignment.clubId ? String(currentAssignment.clubId) : null;
const clubInfo = currentClubId && clubMap[currentClubId] ? clubMap[currentClubId] : null;

const club = clubInfo ? { name: clubInfo.name, id: currentClubId, crestUrl: clubInfo.crestUrl, countryId: clubInfo.countryId, leagueName: clubInfo.leagueName || null, leagueLogoUrl: clubInfo.leagueLogoUrl || null } : (currentClubId ? { name: currentClubId, id: currentClubId } : null);

const clubJoined = currentAssignment && currentAssignment.start ? (footballFormatDate(currentAssignment.start) || currentAssignment.start) : null;

const nationalities = [];
if (nationalityNames && nationalityNames.length) {
nationalityNames.forEach(n => nationalities.push(n));
} else if (nationalityIds && nationalityIds.length) {
nationalityIds.forEach(cid => {
const resolved = countryMap && countryMap[cid] ? countryMap[cid] : null;
nationalities.push(resolved || cid);
});
}
const marketValue = footballExtractMarketValue(profile);
const lastTransfer = footballExtractLastTransfer(transferData, clubMap);
let statTotals = null;
if (detailedStats && detailedStats.total) {
statTotals = { appearances: detailedStats.total.apps, goals: detailedStats.total.goals, assists: detailedStats.total.assists, minutes: detailedStats.total.minutes };
}
const profileUrl = fallbackProfileUrl || `${TM_BASE}/${footballSlugify(name)}/profil/spieler/${id}`;
const slugMatch = profileUrl.match(/transfermarkt\.[a-z.]+\/([^/]+)\//i);
const slug = slugMatch ? slugMatch[1] : '-';
return {
id, name, photo, club, clubJoined, squadNumber, position, nationalities, nationalityIds, dob, age, birthPlace, height, foot, agent, contractExpires, marketValue, lastTransfer, statTotals, detailedStats, compMap, nationalTeamStats, careerByComp,
statusBadges: [],
profileUrl,
marketValueUrl: footballAbsoluteUrl(`/${slug}/marktwertverlauf/spieler/${id}`),
nationalTeamUrl: footballAbsoluteUrl(`/${slug}/nationalmannschaft/spieler/${id}`),
wikipediaUrl: buildFootballWikipediaUrl(name)
};
}

function footballFormatDateAlias(raw) { return footballFormatDate(raw); }
function buildFootballWikipediaUrl(name) {
  if (!name) return null;
  return `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}&go=Go`;
}

async function handleFootballSearch(query) {

  const q = String(query || '').trim();
  if (!q) return { ok: false, reason: 'empty' };
  const res = await footballSearchPlayers(q);
  if (!res.ok) return { ok: false, reason: res.reason || 'network' };
  return { ok: true, candidates: res.candidates };
}

async function getFootballCoachInfo(id) {
  const url = `${TMAPI_BASE}/coach/${encodeURIComponent(id)}`;
  footballLog('getFootballCoachInfo: fetching', url);
  const res = await footballFetchJson(url, 10000);
  if (!res.ok) return { ok: false, error: res.reason === 'network' ? 'network error' : (res.error || 'failed to load') };

  const profile = footballUnwrapEnvelope(res.data);
  if (!profile) return { ok: false, error: 'empty profile' };

  const name = profile.name || profile.shortName || null;
  const portraitRaw = profile.portraitUrl || footballDeepFind(profile, ['portraitUrl', 'imageUrl']);
  const photo = portraitRaw ? footballUsePhotoSize(portraitRaw, 'big') : null;

  const fields = footballExtractProfileFields(profile);

  const assignments = Array.isArray(profile.clubAssignments) ? profile.clubAssignments : [];
  const current = assignments.find((a) => a && a.type === 'current') || assignments[0] || null;

  let club = null;
  let clubId = null;
  if (current && current.clubId) {
    clubId = String(current.clubId);
    const clubMap = await footballResolveClubsViaTmapi([current.clubId]);
    const info = clubMap[clubId];
    club = info ? info.name : null;
  }
  const role = (current && current.role) || footballDeepFind(profile, ['role']) || 'Head Coach';

  let nationality = null;
  if (fields.nationalityNames && fields.nationalityNames.length) {
    nationality = fields.nationalityNames[0];
  } else if (fields.nationalityIds && fields.nationalityIds.length) {
    const countryMap = await footballResolveCountriesViaTmapi(fields.nationalityIds);
    nationality = countryMap[fields.nationalityIds[0]] || null;
  }

  const fbSettings = await getFootballSettings();
  const [honours, scraped] = await Promise.all([
    fbSettings.footballFieldCoachHonours !== false
      ? footballFetchCoachHonoursPage(id, name).then(html => html ? footballParseHonours(html) : []).catch(() => [])
      : Promise.resolve([]),
    footballFetchCoachProfilePage(id, name).then(html => html ? footballParseCoachProfilePage(html) : null).catch(() => null)
  ]);

  const dob = (scraped && scraped.dobScraped) || fields.dob;
  const age = (scraped && scraped.ageScraped != null) ? scraped.ageScraped : fields.age;
  const contractUntil = (scraped && scraped.contractUntilScraped) || fields.contractExpires;

  const resolvedAsPlayerId = (scraped && scraped.asPlayerIdScraped) || null;

  let finalCurrentClub = null;
  if (scraped && scraped.currentClub) finalCurrentClub = scraped.currentClub;

  const slug = footballSlugify(name || 'trainer');
  const profileUrl = `${TM_BASE}/${slug}/profil/trainer/${id}`;

  return {
    ok: true,
    data: {
      id: String(profile.id || id),
      name,
      photo,
      profileUrl,
      dob,
      age,
      nationality,
      club,
      clubId,
      currentClub: finalCurrentClub,
      role,
      contractUntil,
      asPlayerId: resolvedAsPlayerId,
      honours,

      fullName: scraped && scraped.fullName,
      placeOfBirth: scraped && scraped.placeOfBirth,
      placeOfBirthFlagUrl: scraped && scraped.placeOfBirthFlagUrl,
      citizenship: scraped && scraped.citizenship,
      citizenshipFlagUrl: scraped && scraped.citizenshipFlagUrl,
      avgTermAsCoach: scraped && scraped.avgTermAsCoach,
      coachingLicence: scraped && scraped.coachingLicence,
      preferredFormation: scraped && scraped.preferredFormation,
      agent: scraped && scraped.agent,
      agentUrl: scraped && scraped.agentUrl
    }
  };
}

async function footballFetchSquadPlayerSummaries(ids) {
  const uniqIds = Array.from(new Set((ids || []).filter(Boolean).map(String)));
  if (!uniqIds.length) return [];

  const parseOne = (p, fallbackId) => {
    if (!p) return null;
    const attrs = p.attributes || {};
    const position = (attrs.position && (attrs.position.name || attrs.position.shortName)) || footballDeepFind(p, ['position','positionName']) || null;
    const shortPos = (attrs.position && attrs.position.shortName) || attrs.shortPosition || (position ? position.split(' ').map(w=>w[0]).join('').slice(0,3).toUpperCase() : null);
    const marketObj = footballExtractMarketValue(p);
    const marketValue = marketObj.value;
    const marketValueNum = footballParseMarketValueNumber(marketValue);
    const portraitRaw = p.portraitUrl || p.imageUrl || p.photoUrl || (Array.isArray(p.images) && p.images[0] && p.images[0].url) || footballDeepFind(p, ['portraitUrl','imageUrl','photoUrl','image']) || null;
    const photo = portraitRaw ? footballUsePhotoSize(portraitRaw, 'big') : null;
    const life = p.lifeDates || {};
    let age = life.age ?? p.age ?? footballDeepFind(p, ['age']) ?? null;
    if(typeof age==='string') age=parseInt(age,10)||null;
    const shirt = attrs.shirtNumber || footballDeepFind(p, ['shirtNumber','jerseyNumber','number','squadNumber']) || null;
    const nationalityRaw = footballDeepFind(p, ['nationality','nationalityName','citizenship']) || (p.nationalityDetails && p.nationalityDetails.nationalities && p.nationalityDetails.nationalities[0]) || null;
    let nationality = null;
    if(typeof nationalityRaw==='string') nationality=nationalityRaw;
    else if(nationalityRaw && typeof nationalityRaw==='object' && nationalityRaw.name) nationality=nationalityRaw.name;
    return { id: String(p.id || fallbackId), name: p.name || null, position, shortPos, marketValue, marketValueNum, photo, age, shirtNumber: shirt, nationality };
  };

  const bulkResults = [];
  let bulkOk = true;
  const chunks = [];
  for (let i = 0; i < uniqIds.length; i += 40) chunks.push(uniqIds.slice(i, i + 40));
  for (const chunk of chunks) {
    const qs = chunk.map(pid => `ids[]=${encodeURIComponent(pid)}`).join('&');
    const res = await footballFetchJson(`${TMAPI_BASE}/players?${qs}`, 12000).catch(() => ({ ok: false }));
    if (!res.ok) { bulkOk = false; break; }
    const data = footballUnwrapEnvelope(res.data);
    let list = [];
    if (Array.isArray(data)) list = data;
    else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) list = data.data;
      else if (Array.isArray(data.players)) list = data.players;
      else list = Object.entries(data).map(([k, v]) => (v && typeof v === 'object' ? { id: v.id || k, ...v } : null)).filter(Boolean);
    }
    if (!list.length) { bulkOk = false; break; }
    list.forEach(p => { const parsed = parseOne(p, p && p.id); if (parsed) bulkResults.push(parsed); });
  }
  const usable = bulkResults.filter(p => p && p.name).length;
  if (bulkOk && usable >= Math.ceil(uniqIds.length * 0.6)) {
    footballLog('footballFetchSquadPlayerSummaries: bulk /players fetch worked,', usable, 'of', uniqIds.length);
    return bulkResults;
  }

  footballLog('footballFetchSquadPlayerSummaries: bulk /players fetch unusable, falling back to per-player fetches');
  const results = await Promise.all(uniqIds.map(async (pid) => {
    try {
      const res = await footballFetchJson(`${TMAPI_BASE}/player/${encodeURIComponent(pid)}`, 8000);
      if (!res.ok) return null;
      return parseOne(footballUnwrapEnvelope(res.data), pid);
    } catch (e) {
      return null;
    }
  }));
  return results.filter(Boolean);
}

async function footballFetchTeamMatches(id){
  try{
    const res = await footballFetchJson(`${TMAPI_BASE}/club/${encodeURIComponent(id)}/matches`, 8000);
    if(!res.ok) return [];
    const d = footballUnwrapEnvelope(res.data);
    const list = Array.isArray(d && d.matches) ? d.matches : (Array.isArray(d) ? d : []);
    return list.slice(0,3).map(m=>{
      const opp = m.opponent && m.opponent.name ? m.opponent.name : (m.opponentName || m.clubName || 'Opponent');
      const oppCrest = m.opponent && m.opponent.crestUrl ? m.opponent.crestUrl : (m.opponentCrest || null);
      const comp = m.competition && m.competition.name ? m.competition.name : (m.competitionName || '');
      const date = m.date || m.matchDate || m.kickoff || null;
      const isHome = m.isHome ?? (m.location==='H');
      return { opponent: opp, crest: oppCrest, competition: comp, date: date ? footballFormatDate(date) || date : null, isHome };
    });
  }catch(e){ return []; }
}

async function footballFetchCeapiJson(url, timeout=10000){
  let res;
  try { res = await httpGetText(url, { Accept: 'application/json, text/plain, */*', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' }, timeout); }
  catch(e){ return { ok:false, reason:'network', error:String(e) }; }
  if(!res.ok) return { ok:false, reason:'network', status:res.status };
  try { return { ok:true, data: JSON.parse(res.text) }; } catch(e){ return { ok:false, reason:'parse', error:String(e) }; }
}

async function footballResolveClubsViaTmapi(ids){
  try{
    const uniq=[...new Set(ids.map(String))].filter(Boolean);
    if(!uniq.length) return {};

    const parseClub = (p, fallbackId) => {
      if(!p) return null;
      const cid = String(p.id || fallbackId || '');
      if(!cid) return null;
      const leagueId = p.primaryCompetitionId || (p.competition && p.competition.id) || footballDeepFind(p, ['primaryCompetitionId', 'competitionId']) || null;
      return { id: cid, name: p.name || (p.baseDetails && p.baseDetails.shortName) || null, crestUrl: p.crestUrl || null, leagueId: leagueId ? String(leagueId) : null };
    };

    const bulkMap = {};
    let bulkOk = true;
    const chunks = [];
    for (let i = 0; i < uniq.length; i += 40) chunks.push(uniq.slice(i, i + 40));
    for (const chunk of chunks) {
      const qs = chunk.map(cid => `ids[]=${encodeURIComponent(cid)}`).join('&');
      const res = await footballFetchJson(`${TMAPI_BASE}/clubs?${qs}`, 10000).catch(() => ({ ok: false }));
      if (!res.ok) { bulkOk = false; break; }
      const data = footballUnwrapEnvelope(res.data);
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data && typeof data === 'object') {
        if (Array.isArray(data.data)) list = data.data;
        else if (Array.isArray(data.clubs)) list = data.clubs;
        else list = Object.entries(data).map(([k, v]) => (v && typeof v === 'object' ? { id: v.id || k, ...v } : null)).filter(Boolean);
      }
      if (!list.length) { bulkOk = false; break; }
      list.forEach(p => { const c = parseClub(p); if (c) bulkMap[c.id] = { name: c.name, crestUrl: c.crestUrl, leagueId: c.leagueId }; });
    }
    const usable = Object.values(bulkMap).filter(c => c.name).length;
    if (bulkOk && usable >= Math.ceil(uniq.length * 0.6)) {
      footballLog('footballResolveClubsViaTmapi: bulk /clubs fetch worked,', usable, 'of', uniq.length);
      return bulkMap;
    }

    footballLog('footballResolveClubsViaTmapi: bulk /clubs fetch unusable, falling back to per-club fetches');

    const results = await Promise.all(uniq.map(async (cid)=>{
      try{
        const res = await footballFetchJson(`${TMAPI_BASE}/club/${encodeURIComponent(cid)}`, 6000);
        if(!res.ok) return null;
        return parseClub(footballUnwrapEnvelope(res.data), cid);
      }catch(e){ return null; }
    }));
    const map={};
    results.filter(Boolean).forEach(c=>{ map[String(c.id)]={name:c.name, crestUrl:c.crestUrl, leagueId:c.leagueId}; });
    return map;
  }catch(e){ return {}; }
}
async function footballFetchTeamStaffDynamic(id, competitionId){
  const now = new Date();
  let year = now.getFullYear();
  const month = now.getMonth()+1;
  let currentSaison = month>=7 ? year+1 : year;
  const seasons = [currentSaison, currentSaison-1, currentSaison+1, year, year+1, year-1, 2026, 2025, 2024];
  const uniq = [...new Set(seasons)];
  for(const saison of uniq){
    const urls = [];
    if(competitionId){
      urls.push(`${TM_BASE}/ceapi/staff/team/${encodeURIComponent(id)}/?saison_id=${saison}&wettbewerb_id=${encodeURIComponent(competitionId)}`);
    }
    urls.push(`${TM_BASE}/ceapi/staff/team/${encodeURIComponent(id)}/?saison_id=${saison}`);
    for(const u of urls){
      try{
        const res = await footballFetchCeapiJson(u, 8000);
        if(!res.ok) continue;
        const d = footballUnwrapEnvelope(res.data) || res.data;
        let staffList = null;
        if(Array.isArray(d)) staffList = d;
        else if(d && Array.isArray(d.staff)) staffList = d.staff;
        else if(d && Array.isArray(d.data)) staffList = d.data;
        if(!staffList || !staffList.length) continue;
        let mgr = staffList.find(s=> (s.position||'').toLowerCase().includes('manager')) || staffList[0];
        if(mgr){
          return { id: String(mgr.id||''), name: mgr.name||null, age: mgr.age||null, contractUntil: mgr.contractUntil||null, profileImage: mgr.profileImage||null, countryIcon: mgr.countryIcon||null, countryId: mgr.countryId||null };
        }
      }catch(e){ continue; }
    }
  }
  return null;
}
async function footballFetchTeamHonoursHtml(clubId, relativeUrl){
  try{
    let b = relativeUrl || `/a/verein/${clubId}`;
    let erfolgePath = b.replace('/startseite/', '/erfolge/');
    if(!erfolgePath.includes('/erfolge/')){
      const slugMatch = relativeUrl ? relativeUrl.match(/^\/([^\/]+)\//) : null;
      const slug = slugMatch ? slugMatch[1] : 'a';
      erfolgePath = `/${slug}/erfolge/verein/${clubId}`;
    }
    const url = `${TM_BASE}${erfolgePath}`;
    footballLog('footballFetchTeamHonoursHtml: fetching', url);
    const res = await httpGetText(url, { Accept: 'text/html', 'User-Agent': 'Mozilla/5.0' }, 10000).catch(()=>({ ok:false }));
    if(!res || !res.ok) return [];
    const doc = footballCreateDocument(res.text);
    if(!doc) return [];
    if(typeof footballParseTeamHonours === 'function'){
      const parsedTeam = footballParseTeamHonours(doc);
      if(parsedTeam.length) return parsedTeam.map(h=>({ count: h.count, title: h.title, logoUrl: h.logoUrl, seasons: h.seasonsText||'', club: null }));
    }
    return [];
  }catch(e){ return []; }
}
async function footballFetchTeamNextMatches(id,pId, type ,limit=5){
  try{
    const endpointType = type === "Player" ? "player" : "team";
    const searchId = pId  ? encodeURIComponent(pId) : encodeURIComponent(id);
    const url = `${TM_BASE}/ceapi/nextMatches/${endpointType}/${searchId}?limit=${limit}`;
    const res = await footballFetchCeapiJson(url, 8000);
    if(!res.ok) return [];
    const d = footballUnwrapEnvelope(res.data) || res.data;
    const rawList = Array.isArray(d && d.matches) ? d.matches : (Array.isArray(d) ? d : []);
    const list = rawList.slice(0,limit);

    const teamIds = [];
    list.forEach(item=>{
      const m=item.match||item;
      if(m.home!==undefined && m.home!==null) teamIds.push(String(m.home));
      if(m.away!==undefined && m.away!==null) teamIds.push(String(m.away));
    });
    const teamMap = teamIds.length ? await footballResolveClubsViaTmapi([...new Set(teamIds)]) : {};
    return list.map(item=>{
      const comp = item.competition || {};
      const m = item.match || item;
      const homeId = m.home!=null ? String(m.home) : null;
      const awayId = m.away!=null ? String(m.away) : null;
      const homeInfo = homeId ? teamMap[homeId] : null;
      const awayInfo = awayId ? teamMap[awayId] : null;

      let opponentId=null, isHome=null;
      if(type!=="Player" && homeId && awayId){
        if(String(awayId)===String(id)){ opponentId=String(homeId); isHome=false; }
        else { opponentId=String(awayId); isHome=true; }
      }
      const oppInfo = opponentId ? teamMap[opponentId] : null;
      return {
        id: item.id||m.id||null,
        link: m.link||item.link||null,

        homeTeam: { id: homeId, name: homeInfo ? homeInfo.name : (homeId ? `Club ${homeId}` : ''), crest: homeInfo ? homeInfo.crestUrl : null },
        awayTeam: { id: awayId, name: awayInfo ? awayInfo.name : (awayId ? `Club ${awayId}` : ''), crest: awayInfo ? awayInfo.crestUrl : null },

        opponent: oppInfo ? oppInfo.name : (type==="Player" ? '' : `Club ${opponentId||''}`.trim()),
        crest: oppInfo ? oppInfo.crestUrl : null,
        competition: comp.label||comp.name||'',
        competitionId: comp.id||null,
        date: m.time ? new Date(m.time*1000).toLocaleDateString() : null,
        isHome,
        opponentId,
        _variant: type==="Player" ? "player" : "team"
      };
    });
  }catch(e){ return []; }
}
async function footballFetchTeamPrevMatches(id,pId, type ,limit=3){
  try{
    const endpointType = type === "Player" ? "player" : "team";
    const searchId = pId  ? encodeURIComponent(pId) : encodeURIComponent(id);
    const url = `${TM_BASE}/ceapi/previousMatches/${endpointType}/${searchId}?limit=${limit}`;
    const res = await footballFetchCeapiJson(url, 8000);
    if(!res.ok) return [];
    const d = footballUnwrapEnvelope(res.data) || res.data;
    const rawList = Array.isArray(d && d.matches) ? d.matches : (Array.isArray(d) ? d : []);
    const list = rawList.slice(0,limit);
    const teamIds = [];
    list.forEach(item=>{
      const m=item.match||item;
      if(m.home!==undefined && m.home!==null) teamIds.push(String(m.home));
      if(m.away!==undefined && m.away!==null) teamIds.push(String(m.away));
    });
    const teamMap = teamIds.length ? await footballResolveClubsViaTmapi([...new Set(teamIds)]) : {};
    return list.map(item=>{
      const comp = item.competition || {};
      const m = item.match || item;
      const homeId = m.home!=null ? String(m.home) : null;
      const awayId = m.away!=null ? String(m.away) : null;
      const homeInfo = homeId ? teamMap[homeId] : null;
      const awayInfo = awayId ? teamMap[awayId] : null;
      let opponentId=null, isHome=null;
      if(type!=="Player" && homeId && awayId){
        if(String(awayId)===String(id)){ opponentId=String(homeId); isHome=false; }
        else { opponentId=String(awayId); isHome=true; }
      }
      const oppInfo = opponentId ? teamMap[opponentId] : null;
      return {
        id: item.id||m.id||null,
        link: m.link||item.link||null,
        homeTeam: { id: homeId, name: homeInfo ? homeInfo.name : (homeId ? `Club ${homeId}` : ''), crest: homeInfo ? homeInfo.crestUrl : null },
        awayTeam: { id: awayId, name: awayInfo ? awayInfo.name : (awayId ? `Club ${awayId}` : ''), crest: awayInfo ? awayInfo.crestUrl : null },
        opponent: oppInfo ? oppInfo.name : (type==="Player" ? '' : `Club ${opponentId||''}`.trim()),
        crest: oppInfo ? oppInfo.crestUrl : null,
        competition: comp.label||comp.name||'',
        competitionId: comp.id||null,
        date: m.time ? new Date(m.time*1000).toLocaleDateString() : null,
        result: m.result||null,
        isHome,
        opponentId,
        _variant: type==="Player" ? "player" : "team"
      };
    });
  }catch(e){ return []; }
}

async function getFootballTeamCoreInfo(id) {
  const url = `${TMAPI_BASE}/club/${encodeURIComponent(id)}`;
  footballLog('getFootballTeamCoreInfo: fetching', url);
  const res = await footballFetchJson(url, 10000);
  if (!res.ok) return { ok: false, error: res.reason === 'network' ? 'network error' : (res.error || 'failed to load') };

  const profile = footballUnwrapEnvelope(res.data);
  if (!profile) return { ok: false, error: 'empty profile' };

  const name = profile.name || (profile.baseDetails && profile.baseDetails.shortName) || profile.shortName || null;
  const crest = profile.crestUrl || (Array.isArray(profile.images) && profile.images[0] && profile.images[0].url) || footballDeepFind(profile, ['crestUrl', 'logoUrl', 'crest']) || null;
  const relativeUrl = profile.metadata && profile.metadata.relativeUrl ? profile.metadata.relativeUrl : (profile.relativeUrl || null);
  const primaryCompetitionId = profile.primaryCompetitionId || (profile.competition && profile.competition.id) || footballDeepFind(profile, ['primaryCompetitionId','competitionId']) || null;
  const league = primaryCompetitionId || null;
  const countryId = profile.countryId
    || (profile.location && profile.location.countryId)
    || (profile.baseDetails && profile.baseDetails.countryId)
    || footballDeepFind(profile, ['countryId', 'nationalityId'])
    || null;
  const squadDetails = profile.squadDetails || {};
  const marketValue = (squadDetails.currentMarketValue && squadDetails.currentMarketValue.compact) ? `${squadDetails.currentMarketValue.compact.prefix||''}${squadDetails.currentMarketValue.compact.content||''}${squadDetails.currentMarketValue.compact.suffix||''}` : footballExtractMarketValue(profile).value;
  const squadCount = squadDetails.squadSize || 0;
  const avgAgeDisplay = squadDetails.averageAgeDisplay || (squadDetails.averageAge ? String(squadDetails.averageAge) : null);

  return {
    ok: true,
    data: {
      id: String(profile.id || id),
      name,
      crest,
      league,
      leagueId: primaryCompetitionId,
      leagueLogoUrl: null,
      countryId,
      countryName: null,
      marketValue,
      officialSite: null,
      wikipediaUrl: null,
      soccerwayUrl: null,
      relativeUrl,
      topPlayers: [],
      allSquad: [],
      squadCount: squadCount || null,
      squadOverview: squadCount ? { total: squadCount, avgAge: avgAgeDisplay, gk: null, def: null, mid: null, fwd: null } : null,
      manager: null,
      managerId: null,
      managerDetails: null,
      honours: [],
      nextMatches: [],
      prevMatches: [],
      isCore: true
    }
  };
}

async function getFootballTeamInfo(id, isMini) {
  const fbSettings = await getFootballSettings();
  const url = `${TMAPI_BASE}/club/${encodeURIComponent(id)}`;
  footballLog('getFootballTeamInfo: fetching', url);
  const res = await footballFetchJson(url, 10000);
  if (!res.ok) return { ok: false, error: res.reason === 'network' ? 'network error' : (res.error || 'failed to load') };

  const profile = footballUnwrapEnvelope(res.data);
  if (!profile) return { ok: false, error: 'empty profile' };

  const name = profile.name || (profile.baseDetails && profile.baseDetails.shortName) || profile.shortName || null;
  const crest = profile.crestUrl || (Array.isArray(profile.images) && profile.images[0] && profile.images[0].url) || footballDeepFind(profile, ['crestUrl', 'logoUrl', 'crest']) || null;
  const relativeUrl = profile.metadata && profile.metadata.relativeUrl ? profile.metadata.relativeUrl : (profile.relativeUrl || null);
  const primaryCompetitionId = profile.primaryCompetitionId || (profile.competition && profile.competition.id) || footballDeepFind(profile, ['primaryCompetitionId','competitionId']) || null;
  const league = primaryCompetitionId || null;

  const countryId = profile.countryId
    || (profile.location && profile.location.countryId)
    || (profile.baseDetails && profile.baseDetails.countryId)
    || footballDeepFind(profile, ['countryId', 'nationalityId'])
    || null;
  const countryName = null;
  const squadDetails = profile.squadDetails || {};
  const marketValue = (squadDetails.currentMarketValue && squadDetails.currentMarketValue.compact) ? `${squadDetails.currentMarketValue.compact.prefix||''}${squadDetails.currentMarketValue.compact.content||''}${squadDetails.currentMarketValue.compact.suffix||''}` : footballExtractMarketValue(profile).value;

  let officialSite = null;

  let allSquad = [];
  let topPlayers = [];
  let squadOverview = null;
  let squadCount = squadDetails.squadSize || 0;
  let avgAgeDisplay = squadDetails.averageAgeDisplay || (squadDetails.averageAge ? String(squadDetails.averageAge) : null);

  const squadTask = (async () => {
    const squadRes = await footballFetchJson(`${TMAPI_BASE}/club/${encodeURIComponent(id)}/squad`, 10000).catch(() => ({ ok: false }));
    if (!squadRes.ok) return;
    const squadData = footballUnwrapEnvelope(squadRes.data);
    const squadList = Array.isArray(squadData && squadData.squad) ? squadData.squad : (Array.isArray(squadData) ? squadData : []);
    const current = squadList.filter((s) => s && s.type !== 'former' && s.playerId);
    if(!squadCount) squadCount = current.length;

    const idsAll = current.map((s) => String(s.playerId));
    if (idsAll.length) {
      allSquad = await footballFetchSquadPlayerSummaries(idsAll);
      allSquad.sort((a,b)=> (b.marketValueNum||0) - (a.marketValueNum||0));
      topPlayers = allSquad.slice(0,5);
      const posCounts = { GK:0, DEF:0, MID:0, FWD:0 };
      allSquad.forEach(p=>{ const cat = footballCategorizePosition(p.position); if(cat && posCounts[cat]!==undefined) posCounts[cat]++; });
      squadOverview = { total: squadCount || allSquad.length, avgAge: avgAgeDisplay, gk: posCounts.GK, def: posCounts.DEF, mid: posCounts.MID, fwd: posCounts.FWD };
    }
  })();

  const managerTask = footballFetchTeamStaffDynamic(id, primaryCompetitionId).catch(() => null);

  const leagueLogoTask = primaryCompetitionId
    ? footballResolveCompetitionsViaTmapi([primaryCompetitionId]).then(compMap => (compMap && compMap[String(primaryCompetitionId)] && compMap[String(primaryCompetitionId)].logoUrl) || null).catch(() => null)
    : Promise.resolve(null);

  const honoursTask = fbSettings.footballFieldTeamHonours
    ? footballFetchTeamHonoursHtml(id, relativeUrl).catch(() => [])
    : Promise.resolve([]);
  const nextMatchesTask = (!isMini && fbSettings.footballFieldTeamNextMatches)
    ? footballFetchTeamNextMatches(id,null,"Team", 5).catch(() => [])
    : Promise.resolve([]);
  const prevMatchesTask = (!isMini && fbSettings.footballFieldTeamPrevMatches)
    ? footballFetchTeamPrevMatches(id,null,"Team", 3).catch(() => [])
    : Promise.resolve([]);

  const wikidataTask = getFootballTeamWikidataLinks(String(profile.id || id)).catch(() => ({}));

  const [ , managerDetails, leagueLogoUrl, honours, nextMatches, prevMatches, wikidataLinks ] = await Promise.all([
    squadTask, managerTask, leagueLogoTask, honoursTask, nextMatchesTask, prevMatchesTask, wikidataTask
  ]);

  if(!squadOverview && squadCount){ squadOverview = { total: squadCount, avgAge: avgAgeDisplay, gk: null, def: null, mid: null, fwd: null }; }

  const manager = managerDetails && managerDetails.name ? managerDetails.name : null;
  const managerId = managerDetails && managerDetails.id ? String(managerDetails.id) : null;

  officialSite = (wikidataLinks && wikidataLinks.officialWebsite) || officialSite;
  const wikipediaUrl = (wikidataLinks && wikidataLinks.wikipediaArticle) || null;

  const soccerwayUrl = (wikidataLinks && wikidataLinks.soccerwayId) ? `https://www.scorebar.com/teams/-/-/${encodeURIComponent(wikidataLinks.soccerwayId)}/` : null;

  return {
    ok: true,
    data: {
      id: String(profile.id || id),
      name,
      crest,
      league,
      leagueId: primaryCompetitionId,
      leagueLogoUrl,
      countryId,
      countryName,
      marketValue,
      officialSite,
      wikipediaUrl,
      soccerwayUrl,
      relativeUrl,
      topPlayers,
      allSquad,
      squadCount: squadCount || (topPlayers.length ? topPlayers.length : null),
      squadOverview,
      manager,
      managerId,
      managerDetails,
      honours,
      nextMatches,
      prevMatches
    }
  };
}


