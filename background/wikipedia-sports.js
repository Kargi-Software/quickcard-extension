

const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';

function wikiCleanText(str) {
  if (!str) return '';
  let out = String(str);

  out = out.replace(/\{\{\s*(?:MGP|WRC|F1|Moto3|Moto2|MotoGP|NASCAR|IndyCar)\s*\|([^{}|]+)(?:\|[^{}]*)?\}\}/gi, (_, a) => {
    const year = String(a).trim().match(/\d{4}/);
    return year ? year[0] : String(a).trim();
  });

  for (let i = 0; i < 4; i++) {
    const before = out;
    out = out.replace(/\{\{\s*(?:Unbulleted\s*list|ubl|plainlist|flatlist)\s*\|([^{}]*)\}\}/gi, (_, inner) => {
      return String(inner).split('|').map(s => s.trim()).filter(Boolean).join(' · ');
    });
    if (out === before) break;
  }

  out = out.replace(/\{\{nowrap\|([^}]*)\}\}/gi, '$1');
  out = out.replace(/\{\{\s*(?:small|smaller|resize)\s*\|(?:[^{}|]*\|)?([^{}]*)\}\}/gi, '$1');
  out = out.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2');
  out = out.replace(/\[\[([^\]]+)\]\]/g, '$1');
  out = out.replace(/'{2,3}/g, '');
  out = out.replace(/<br\s*\/?>/gi, ' ');
  out = out.replace(/<ref[^>]*\/>/gi, '').replace(/<ref[\s\S]*?<\/ref>/gi, '');
  out = out.replace(/\{\{[^{}]*\}\}/g, '');
  out = out.replace(/\[\[|\]\]/g, '');
  out = out.replace(/\s+/g, ' ').trim();
  return out;
}

function splitTemplateArgsTopLevel(str) {
  const parts = [];
  let cur = '';
  let bracketDepth = 0;
  let braceDepth = 0;
  for (let idx = 0; idx < str.length; idx++) {
    const ch = str[idx];
    const nextCh = str[idx + 1];
    if (ch === '[' && nextCh === '[') { bracketDepth++; cur += ch; continue; }
    if (ch === ']' && nextCh === ']') { if (bracketDepth > 0) bracketDepth--; cur += ch; continue; }
    if (ch === '{' && nextCh === '{') { braceDepth++; cur += ch; continue; }
    if (ch === '}' && nextCh === '}') { if (braceDepth > 0) braceDepth--; cur += ch; continue; }
    if (ch === '|' && bracketDepth === 0 && braceDepth === 0) { parts.push(cur); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}

function extractAllTemplates(wikitext) {
  const templates = [];
  const len = wikitext.length;
  let pos = 0;
  while (pos < len - 1) {
    if (wikitext[pos] === '{' && wikitext[pos + 1] === '{') {
      let depth = 1;
      let scanPos = pos + 2;
      while (scanPos < len - 1 && depth > 0) {
        if (wikitext[scanPos] === '{' && wikitext[scanPos + 1] === '{') { depth++; scanPos += 2; }
        else if (wikitext[scanPos] === '}' && wikitext[scanPos + 1] === '}') { depth--; scanPos += 2; }
        else scanPos++;
      }
      const inner = wikitext.slice(pos + 2, Math.max(pos + 2, scanPos - 2));
      const parts = splitTemplateArgsTopLevel(inner);

      let name = (parts[0] || '').trim().replace(/<!--[\s\S]*?-->/g, '').trim();
      if (name) templates.push({ name, args: parts.slice(1).map(arg => arg.trim()) });
      pos += 1;
      continue;
    }
    pos++;
  }
  return templates;
}

const MEDAL_SKIP_NAMES = /^(medal\s*record|medaltop|medalbottom|medalbigtop|medalbigbottom|medalcountry|medalsport|medalend|medalname|medalcount)$/i;

function classifyCompetitionLabel(label) {
  const labelLower = (label || '').toLowerCase();
  if (!labelLower) return 'other';
  if (labelLower.includes('olympic')) return 'olympic';
  if (labelLower.includes('paralympic')) return 'olympic';
  if (labelLower.includes('world')) return 'world';
  if (labelLower.includes('european') || labelLower.includes('asia') || labelLower.includes('pan american') || labelLower.includes('pan am') ||
      labelLower.includes('african') || labelLower.includes('commonwealth') || labelLower.includes('regional') || labelLower.includes('games')) return 'continental';
  return 'other';
}

function extractYear(editionText) {
  const yearMatch = (editionText || '').match(/\d{4}/);
  return yearMatch ? yearMatch[0] : '';
}

function buildCompetitionSection(name, args) {
  const lname = name.toLowerCase();
  if (lname === 'medalcompetition') {
    const label = wikiCleanText(args[0]) || 'Competition';
    return { name: label, category: classifyCompetitionLabel(label) };
  }
  if (lname === 'medalolympicgames') return { name: 'Olympic Games', category: 'olympic' };
  if (lname === 'medalparalympicgames') return { name: 'Paralympic Games', category: 'olympic' };
  if (lname === 'medalworldchampionships' || lname === 'medalworldchampionship') {
    const prefix = wikiCleanText(args[0]);
    const label = prefix ? `${prefix} World Championships` : 'World Championships';
    return { name: label, category: 'world' };
  }
  if (lname === 'medaleuropeanchampionships' || lname === 'medaleuropeanchampionship') {
    return { name: 'European Championships', category: 'continental' };
  }
  if (lname === 'medalcommonwealth') return { name: 'Commonwealth Games', category: 'continental' };
  if (lname === 'medalregional') {
    const label = wikiCleanText(args[0]) || 'Regional Championships';
    return { name: label, category: 'continental' };
  }
  if (lname === 'medalgames') {
    const label = wikiCleanText(args[0]) || 'Games';
    return { name: label, category: classifyCompetitionLabel(label) };
  }

  const label = name.replace(/^Medal/i, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim() || 'Competition';
  return { name: label, category: classifyCompetitionLabel(label) };
}

function resolveMedalTypeToken(token) {
  const t = String(token || '').trim().toLowerCase();
  if (t === 'g' || t === 'gold' || t === '1st' || t === '1' || t === 'first') return 'gold';
  if (t === 's' || t === 'silver' || t === '2nd' || t === '2' || t === 'second') return 'silver';
  if (t === 'b' || t === 'bronze' || t === '3rd' || t === '3' || t === 'third') return 'bronze';
  return null;
}

function parseMedalRecordWikitext(wikitext) {
  const templates = extractAllTemplates(wikitext).filter(tmpl => /^Medal/i.test(tmpl.name));
  if (!templates.length) return { found: false, competitions: [] };

  const competitions = [];
  let current = null;
  const ensureOther = () => {
    if (!current) {
      current = { name: 'Other', category: 'other', gold: 0, silver: 0, bronze: 0, details: [] };
      competitions.push(current);
    }
    return current;
  };
  const pushMedal = (type, editionRaw, eventRaw) => {
    const section = ensureOther();
    const edition = wikiCleanText(editionRaw);
    const event = wikiCleanText(eventRaw);
    section[type] = (section[type] || 0) + 1;
    section.details.push({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      year: extractYear(edition),
      edition: edition || '',
      event: event || '',
      source: 'Wikipedia'
    });
  };

  for (const tmpl of templates) {
    const lname = tmpl.name.toLowerCase().replace(/\s+/g, '');
    if (MEDAL_SKIP_NAMES.test(tmpl.name) || lname === 'medalcount') continue;

    if (/^medal(gold|silver|bronze)$/.test(lname)) {
      pushMedal(lname.replace('medal', ''), tmpl.args[0], tmpl.args[1]);
      continue;
    }

    if (lname === 'medal') {
      const kindRaw = (tmpl.args[0] || '').trim();
      const kind = kindRaw.toLowerCase();
      if (kind === 'competition') {
        const label = wikiCleanText(tmpl.args[1]) || 'Competition';
        current = { name: label, category: classifyCompetitionLabel(label), gold: 0, silver: 0, bronze: 0, details: [] };
        competitions.push(current);
        continue;
      }
      if (kind === 'sport' || kind === 'country' || kind === 'name' || kind === 'discontinued') {
        continue;
      }
      const type = resolveMedalTypeToken(kindRaw);
      if (type) {
        pushMedal(type, tmpl.args[1], tmpl.args[2]);
        continue;
      }

      continue;
    }

    const built = buildCompetitionSection(tmpl.name, tmpl.args);
    current = { ...built, gold: 0, silver: 0, bronze: 0, details: [] };
    competitions.push(current);
  }

  const nonEmpty = competitions.filter(comp => (comp.gold + comp.silver + comp.bronze) > 0);
  for (const comp of nonEmpty) {
    comp.details.sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));
  }

  return { found: nonEmpty.length > 0, competitions: nonEmpty };
}

function buildTitlesText(competitions) {
  const counts = { olympic: 0, world: 0, continental: 0 };
  for (const c of competitions) {
    if (c.category === 'olympic') counts.olympic += c.gold;
    else if (c.category === 'world') counts.world += c.gold;
    else if (c.category === 'continental') counts.continental += c.gold;
  }
  const parts = [];
  if (counts.olympic) parts.push(`${counts.olympic}x Olympic Champion`);
  if (counts.world) parts.push(`${counts.world}x World Champion`);
  if (counts.continental) parts.push(`${counts.continental}x Continental Champion`);
  return { titlesText: parts.join(', '), titlesCount: counts };
}

async function fetchWikipediaWikitext(title) {
  const params = new URLSearchParams({
    action: 'parse',
    page: title,
    prop: 'wikitext',
    format: 'json',
    formatversion: '2',
    redirects: '1',
    origin: '*'
  });
  const data = await fetchJson(`${WIKIPEDIA_API}?${params.toString()}`, {}, 15000);
  if (data.error) throw new Error(data.error.info || data.error.code || 'wikipedia error');
  return { wikitext: data.parse?.wikitext || '', resolvedTitle: data.parse?.title || title };
}

function parseFigureSkatingMedals(wikitext) {
  if (!wikitext || !/figure\s*skating\s*infobox\s*medals/i.test(wikitext)) {
    return { found: false, competitions: [] };
  }
  const competitions = [];
  const byKey = {};
  function ensure(name, category) {
    const k = name.toLowerCase();
    if (!byKey[k]) {
      byKey[k] = { name, category, gold: 0, silver: 0, bronze: 0, details: [] };
      competitions.push(byKey[k]);
    }
    return byKey[k];
  }

  const countBlock = wikitext.match(/medalcount\s*=\s*yes\|([^|}\n]*(?:\|[^|}\n]*)*)/i);
  if (countBlock) {
    const map = {
      ogg: ['Olympic Games', 'olympic', 'gold'],
      ogs: ['Olympic Games', 'olympic', 'silver'],
      ogb: ['Olympic Games', 'olympic', 'bronze'],
      wcg: ['World Championships', 'world', 'gold'],
      wcs: ['World Championships', 'world', 'silver'],
      wcb: ['World Championships', 'world', 'bronze'],
      '4ccg': ['Four Continents Championships', 'continental', 'gold'],
      '4ccs': ['Four Continents Championships', 'continental', 'silver'],
      '4ccb': ['Four Continents Championships', 'continental', 'bronze']
    };
    for (const part of countBlock[1].split('|')) {
      const m = part.trim().match(/^([A-Za-z0-9]+)\s*=\s*(\d+)/);
      if (!m) continue;
      const key = m[1].toLowerCase();
      const n = parseInt(m[2], 10) || 0;
      if (!n || !map[key]) continue;
      const [name, cat, metal] = map[key];
      const sec = ensure(name, cat);
      sec[metal] = (sec[metal] || 0) + n;
    }
  }

  const fsRe = /\{\{\s*FS\s*medal\s*\|\s*([gsb])\s*\|\s*([A-Za-z0-9]+)\s*\|\s*(\d{4})/gi;
  const eventNames = {
    og: ['Olympic Games', 'olympic'],
    wc: ['World Championships', 'world'],
    '4cc': ['Four Continents Championships', 'continental'],
    gpf: ['Grand Prix Final', 'other'],
    jwc: ['World Junior Championships', 'other'],
    nc: ['National Championships', 'other']
  };
  let fm;
  while ((fm = fsRe.exec(wikitext)) !== null) {
    const metal = fm[1].toLowerCase() === 'g' ? 'gold' : fm[1].toLowerCase() === 's' ? 'silver' : 'bronze';
    const code = fm[2].toLowerCase();
    const year = fm[3];
    const info = eventNames[code] || [fm[2], 'other'];
    const sec = ensure(info[0], info[1]);
    sec.details.push({ type: metal, year, event: '' });

    if (!countBlock) sec[metal] = (sec[metal] || 0) + 1;
  }
  const nonEmpty = competitions.filter(c => c.gold || c.silver || c.bronze || (c.details && c.details.length));
  return { found: nonEmpty.length > 0, competitions: nonEmpty };
}

async function getWikipediaMedalRecord(title) {
  if (!title) return { found: false, competitions: [], titlesText: '', error: 'no title' };
  try {
    const { wikitext, resolvedTitle } = await fetchWikipediaWikitext(title);
    if (!wikitext) return { found: false, competitions: [], titlesText: '', resolvedTitle };
    let parsed = parseMedalRecordWikitext(wikitext);

    if (!parsed.found || !(parsed.competitions && parsed.competitions.length)) {
      const fs = parseFigureSkatingMedals(wikitext);
      if (fs.found) parsed = fs;
    } else {

      const fs = parseFigureSkatingMedals(wikitext);
      if (fs.found && fs.competitions.length) {
        const names = new Set((parsed.competitions || []).map(c => (c.name || '').toLowerCase()));
        for (const c of fs.competitions) {
          if (!names.has((c.name || '').toLowerCase())) parsed.competitions.push(c);
        }
      }
    }
    const { titlesText, titlesCount } = buildTitlesText(parsed.competitions);
    return {
      found: parsed.found,
      competitions: parsed.competitions,
      titlesText,
      titlesCount,
      resolvedTitle,
      source: 'Wikipedia'
    };
  } catch (e) {
    return { found: false, competitions: [], titlesText: '', error: String(e) };
  }
}

const TENNIS_SLAM_NAMES = [
  ['australianopen', 'Australian Open'],
  ['frenchopen', 'French Open'],
  ['wimbledon', 'Wimbledon'],
  ['usopen', 'US Open']
];

function wikiStripMarkupCell(cell) {
  let text = String(cell || '');
  text = text.replace(/<ref[^>]*\/>/gi, '').replace(/<ref[\s\S]*?<\/ref>/gi, '');

  text = text.replace(/\{\{\s*(?:F1|MGP|WRC|Moto2|Moto3|MotoGP)\s*\|([^{}]*)\}\}/gi, (_, inner) => {
    const parts = inner.split('|').map(s => s.trim()).filter(Boolean);
    const year = (parts[0] || '').match(/\d{4}/);
    return year ? year[0] : (parts.length ? parts[parts.length - 1] : '');
  });
  text = text.replace(/<br\s*\/?>/gi, '; ');
  text = text.replace(/\{\{\s*(?:Unbulleted\s*list|ubl|plainlist|flatlist)\s*\|([^{}]*)\}\}/gi, (_, inner) => {
    return String(inner).split('|').map(s => s.trim()).filter(Boolean).join(' · ');
  });
  text = text.replace(/\{\{\s*nowrap\s*\|([^{}]*)\}\}/gi, '$1');
  text = text.replace(/\{\{\s*(?:small|smaller|resize)\s*\|(?:[^{}|]*\|)?([^{}]*)\}\}/gi, '$1');

  text = text.replace(/\{\{\s*tennis\s*win\s*loss\s*percentage\s*\|([^{}]*)\}\}/gi, (_, inner) => {
    const parts = String(inner).split('|').map(s => s.trim());
    let w = '', l = '';
    for (const p of parts) {
      const m = p.match(/^([WwLl])\s*=\s*(\d+)/);
      if (m) { if (m[1].toUpperCase() === 'W') w = m[2]; else l = m[2]; }
    }
    if (w && l) return w + '\u2013' + l;
    if (w) return w;
    return '';
  });
  text = text.replace(/<[^>]+>/g, '');
  text = text.replace(/\{\{[^{}]*\}\}/g, '');
  text = text.replace(/\{\{[^{}]*\}\}/g, '');
  text = text.replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, '$2');
  text = text.replace(/\[\[([^\]]+)\]\]/g, '$1');
  text = text.replace(/'''?/g, '');
  return text.trim();
}

function parseTennisRankingValue(value) {
  const cleaned = wikiStripMarkupCell(value).replace(/\s+/g, ' ');
  if (!cleaned) return '';
  return cleaned;
}

function parseTennisSlamResult(raw) {

  let cleaned = wikiStripMarkupCell(raw).replace(/\s+/g, ' ').trim();
  if (!cleaned || /^[-–—]+$/.test(cleaned)) return null;
  const match = cleaned.match(/^([A-Za-z0-9]{1,4})\s*(?:\(([^)]*)\))?/);
  if (!match) return null;
  const years = [];
  const yearMatches = (match[2] || '').match(/\d{4}/g);
  if (yearMatches) years.push(...yearMatches);
  return { result: match[1], years };
}

function parseTennisInfoboxArgs(args) {
  const singles = {};
  const slams = [];
  for (const a of args) {
    const eq = a.indexOf('=');
    if (eq < 0) continue;
    const key = a.slice(0, eq).trim().toLowerCase().replace(/[_\s]+/g, '');
    const val = a.slice(eq + 1).trim();
    if (!key || !val) continue;
    if (['singlesrecord', 'careerrecord'].includes(key)) singles.careerRecord = parseTennisRankingValue(val);
    else if (['singlestitles', 'careertitles'].includes(key)) singles.careerTitles = parseTennisRankingValue(val);
    else if (['highestsinglesranking', 'highestranking'].includes(key)) singles.highestRanking = parseTennisRankingValue(val);
    else if (['currentsinglesranking', 'currentranking'].includes(key)) singles.currentRanking = parseTennisRankingValue(val);
    else {
      const slamMatch = TENNIS_SLAM_NAMES.find(([k]) => key === `${k}seniorresult` || key === `${k}result`);
      if (slamMatch) {
        const parsed = parseTennisSlamResult(val);
        if (parsed) slams.push({ tournament: slamMatch[1], result: parsed.result, years: parsed.years });
      }
    }
  }
  return { singles, slams };
}

function wikiTableRowCells(rowText) {

  const flat = rowText.replace(/\r/g, '');
  const cells = [];
  for (const chunk of flat.split(/\|\||!!/)) {
    let cellText = chunk;

    const attrMatch = cellText.match(/^\s*\|([^|]*)\|([\s\S]*)$/);
    if (attrMatch && /^\s*(style|class|bgcolor|scope|rowspan|colspan|align|width)/i.test(attrMatch[1])) {
      cellText = attrMatch[2];
    } else if (/^\s*\|/.test(cellText)) {
      cellText = cellText.replace(/^\s*\|/, '');
    }
    cellText = wikiStripMarkupCell(cellText).replace(/\s+/g, ' ').trim();
    if (cellText) cells.push(cellText);
  }
  return cells;
}

function parseTennisGrandSlamWikitable(wikitext) {
  const candidates = [];
  const tableRe = /\{\|[^\n]*\n([\s\S]*?)\n\|\}/g;
  let m;
  while ((m = tableRe.exec(wikitext)) !== null) {
    const body = m[1];
    const slamHits = TENNIS_SLAM_NAMES.filter(([, label]) =>
      new RegExp(label.split(' ').join('\\s*'), 'i').test(body)).length;
    if (slamHits < 3) continue;

    const rowChunks = body.split(/^\s*\|-/m);
    const parsedRows = [];
    for (const rc of rowChunks) {
      const cells = wikiTableRowCells(rc);
      if (cells.length >= 2) parsedRows.push(cells);
    }
    if (!parsedRows.length) continue;

    const yearFirstRows = parsedRows.filter(row => /^20\d{2}$|^19\d{2}$/.test(row[0])).length;
    if (yearFirstRows >= 3) continue;

    let dataRows = parsedRows;
    const looksLikeHeader = row => /tournament/i.test(row.join(' ')) && !/^\(/.test(row[1] || '');
    if (parsedRows.length > 1 && looksLikeHeader(parsedRows[0])) dataRows = parsedRows.slice(1);

    const RESULT_TOKEN = /^(W|F|SF|QF|4R|3R|2R|1R|RR|PO)$/i;
    const rowsOut = [];
    for (const row of dataRows) {
      const tournamentRaw = row[0];
      const slamIdx = TENNIS_SLAM_NAMES.findIndex(([, label]) =>
        tournamentRaw.toLowerCase().replace(/\s+/g, '') === label.toLowerCase().replace(/\s+/g, '') ||
        tournamentRaw.toLowerCase().includes(label.toLowerCase()));
      if (slamIdx < 0) continue;

      let resCell = null;
      for (let idx = 1; idx < Math.min(row.length, 4); idx++) {
        if (RESULT_TOKEN.test(row[idx])) { resCell = row[idx]; break; }
        const partialMatch = row[idx].match(/^(W|F|SF|QF)\s*\(/i);
        if (partialMatch) { resCell = row[idx]; break; }
      }
      if (!resCell) continue;
      const parsed = parseTennisSlamResult(resCell);
      if (!parsed) continue;
      rowsOut.push({ tournament: TENNIS_SLAM_NAMES[slamIdx][1], result: parsed.result, years: parsed.years });
    }
    if (rowsOut.length) candidates.push(rowsOut);
  }

  candidates.sort((a, b) => b.length - a.length);
  return candidates.length ? candidates[0] : [];
}

function parseTennisGrandSlamTemplateArgs(args) {
  const out = [];
  for (const a of args) {
    const eq = a.indexOf('=');
    if (eq < 0) continue;
    const key = a.slice(0, eq).trim().toLowerCase().replace(/[_\s]+/g, '');
    const val = a.slice(eq + 1).trim();
    if (!val) continue;
    const slam = TENNIS_SLAM_NAMES.find(([k, label]) => key === k.replace(/ /g, '') || key === label.toLowerCase().replace(/ /g, ''));
    if (!slam) continue;
    const parsed = parseTennisSlamResult(val);
    if (!parsed) continue;
    out.push({ tournament: slam[1], result: parsed.result, years: parsed.years });
  }
  return out;
}

function parseTennisPlayerWikitext(wikitext) {
  const templates = extractAllTemplates(wikitext);
  let singles = {};
  let slams = [];

  for (const t of templates) {
    const lname = t.name.toLowerCase().replace(/[\s_]+/g, '');
    if (lname === 'infoboxtennisplayer' || lname === 'infoboxtennisbiography') {
      const parsed = parseTennisInfoboxArgs(t.args);
      singles = { ...singles, ...parsed.singles };

      if (parsed.slams.length > slams.length) slams = parsed.slams;
    } else if (lname === 'infoboxtennisrecord' || lname === 'tennisrecords' ||
               lname === 'grandslamresults' || lname === 'infoboxtennisgrand_slamresults') {
      const fromArgs = parseTennisGrandSlamTemplateArgs(t.args);
      if (fromArgs.length > slams.length) slams = fromArgs;
    }
  }

  if (!slams.length) {
    slams = parseTennisGrandSlamWikitable(wikitext);
  }

  const hasAnything = Object.keys(singles).length > 0 || slams.length > 0;
  return { found: hasAnything, singles, grandSlams: slams };
}

function parseF1DriverInfoboxArgs(args) {
  const career = {};

  let bestYearTeam = null;
  for (const a of args) {
    const eq = a.indexOf('=');
    if (eq < 0) continue;
    const key = a.slice(0, eq).trim().toLowerCase().replace(/[_\s]+/g, '');
    const val = wikiStripMarkupCell(a.slice(eq + 1)).replace(/\s+/g, ' ').trim();
    if (!key || !val) continue;
    if (key === 'nationality') career.nationality = val;
    else if (key === 'years') career.activeYears = val;

    else if (key === 'teams' || key === 'team' || key === 'team(s)') career.teams = val;
    else if (key === 'carnumber') career.carNumber = val;

    else if (key === 'championships') career.championships = val;
    else if (key === 'wins') career.wins = val;
    else if (key === 'podiums') career.podiums = val;
    else if (key === 'points') career.careerPoints = val;
    else if (key === 'poles') career.polePositions = val;
    else if (key === 'fastestlaps') career.fastestLaps = val;
    else if (key === 'firstrace') career.firstEntry = val;
    else if (key === 'firstwin') career.firstWin = val;
    else if (key === 'lastwin') career.lastWin = val;
    else if (key === 'lastrace') career.lastEntry = val;
    else if (key === 'lastseason') career.lastSeason = val;
    else if (key === 'lastposition') career.lastSeasonPosition = val;
    else {
      const yearTeamMatch = key.match(/^(\d{4})team$/);
      if (yearTeamMatch) {
        const year = parseInt(yearTeamMatch[1], 10);
        if (!bestYearTeam || year > bestYearTeam.year) bestYearTeam = { year, val };
      }
    }
  }
  if (bestYearTeam) career.currentTeam = bestYearTeam.val;
  return career;
}

function parseF1DriverWikitext(wikitext) {
  const templates = extractAllTemplates(wikitext);
  for (const t of templates) {
    const lname = t.name.toLowerCase().replace(/[\s_]+/g, '');
    if (lname === 'infoboxf1driver') {
      const career = parseF1DriverInfoboxArgs(t.args);
      return { found: Object.keys(career).length > 0, career, kind: 'f1' };
    }
  }
  return { found: false, career: {} };
}

function parseMotorcycleRiderWikitext(wikitext) {
  const fields = parseInfoboxFields(wikitext, /infoboxmotorcyclerider/i);
  if (!fields) return { found: false, career: {} };
  const get = (...keys) => {
    for (const k of keys) {
      const norm = k.toLowerCase().replace(/[\s_]+/g, '');
      for (const fk of Object.keys(fields)) {
        if (fk.replace(/[\s_]+/g, '') === norm && fields[fk]) return fields[fk];
      }
    }
    return '';
  };
  const classPref = ['motogp', 'moto2', 'moto3', '125', '250', '500'];
  let prefix = '';
  for (const pfx of classPref) {
    if (get(pfx + ' championships') || get(pfx + ' race wins') || get(pfx + ' championships')) {
      prefix = pfx;
      break;
    }
  }

  const prefKey = (suffix) => {
    if (!prefix) return '';
    return get(prefix + ' ' + suffix, prefix + '_' + suffix, prefix + suffix);
  };
  const career = {
    nationality: get('nationality'),
    currentTeam: get('current team', 'current_team', 'team'),
    carNumber: get('bike number', 'bike_number', 'number'),
    activeYears: prefKey('active years') || get('active years'),
    championships: prefKey('championships'),
    races: prefKey('race starts') || prefKey('starts'),
    wins: prefKey('race wins') || prefKey('wins'),
    podiums: prefKey('podiums'),
    poles: prefKey('poles'),
    fastestLaps: prefKey('fastest laps'),
    careerPoints: prefKey('total points') || prefKey('points'),
    lastSeason: prefKey('last season'),
    lastSeasonPosition: prefKey('last position'),
    class: prefix ? prefix.toUpperCase().replace('MOTO', 'Moto') : 'Motorcycle'
  };

  Object.keys(career).forEach(k => { if (!career[k]) delete career[k]; });
  return { found: Object.keys(career).length > 1, career, kind: 'motorcycle' };
}

function parseRallyDriverWikitext(wikitext) {
  const fields = parseInfoboxFields(wikitext, /infoboxrallydriver/i);
  if (!fields) return { found: false, career: {} };
  const get = (...keys) => {
    for (const k of keys) {
      const norm = k.toLowerCase().replace(/[\s_]+/g, '');
      for (const fk of Object.keys(fields)) {
        if (fk.replace(/[\s_]+/g, '') === norm && fields[fk]) return fields[fk];
      }
    }
    return '';
  };
  const career = {
    nationality: get('nationality'),
    currentTeam: get('team', 'current team', 'teams'),
    carNumber: get('car number', 'number'),
    activeYears: get('years', 'active years'),
    championships: get('championships', 'wrc championships', 'titles'),
    wins: get('wins', 'rally wins', 'wrc wins'),
    podiums: get('podiums'),
    races: get('rallies', 'starts', 'entries'),
    careerPoints: get('points'),
    lastSeason: get('last season'),
    lastSeasonPosition: get('last position'),
    class: 'Rally'
  };
  Object.keys(career).forEach(k => { if (!career[k]) delete career[k]; });
  return { found: Object.keys(career).length > 1, career, kind: 'rally' };
}

function parseWRCDriverWikitext(wikitext) {

  const templates = extractAllTemplates(wikitext);
  for (const tmpl of templates) {
    const lname = String(tmpl.name || '').toLowerCase().replace(/[\s_]+/g, '');
    if (lname !== 'infoboxwrcdriver') continue;
    const career = {};
    for (const a of (tmpl.args || [])) {
      const eq = a.indexOf('=');
      if (eq < 0) continue;
      const key = a.slice(0, eq).trim().toLowerCase().replace(/[_\s]+/g, '');
      const val = wikiCleanText(a.slice(eq + 1));
      if (!key || !val || key === 'subbox' || key === 'embed') continue;
      if (key === 'years') career.activeYears = val;
      else if (key === 'teams' || key === 'team') career.currentTeam = val;
      else if (key === 'races' || key === 'starts') career.races = val;
      else if (key === 'championships') career.championships = val;
      else if (key === 'wins') career.wins = val;
      else if (key === 'podiums') career.podiums = val;
      else if (key === 'points') career.careerPoints = val;
      else if (key === 'stagewins') career.stageWins = val;
      else if (key === 'firstrace' || key === 'first_race') career.firstEntry = val;
      else if (key === 'firstwin' || key === 'first_win') career.firstWin = val;
      else if (key === 'lastwin' || key === 'last_win') career.lastWin = val;
      else if (key === 'lastrace' || key === 'last_race') career.lastEntry = val;
      else if (key === 'codriver') career.coDriver = val;
    }
    career.class = 'WRC';
    Object.keys(career).forEach(k => { if (!career[k]) delete career[k]; });
    if (Object.keys(career).length > 1) return { found: true, career, kind: 'wrc' };
  }
  return { found: false, career: {} };
}

function parseMotorsportWikitext(wikitext) {
  const f1 = parseF1DriverWikitext(wikitext);
  if (f1.found) return f1;
  const moto = parseMotorcycleRiderWikitext(wikitext);
  if (moto.found) return moto;
  const wrc = parseWRCDriverWikitext(wikitext);
  if (wrc.found) return wrc;
  const rally = parseRallyDriverWikitext(wikitext);
  if (rally.found) return rally;
  return { found: false, career: {} };
}

async function getWikipediaF1Info(title) {

  if (!title) return { found: false, career: {}, error: 'no title' };
  try {
    const { wikitext, resolvedTitle } = await fetchWikipediaWikitext(title);
    if (!wikitext) return { found: false, career: {}, resolvedTitle };
    const parsed = parseMotorsportWikitext(wikitext);
    return { ...parsed, resolvedTitle, source: 'Wikipedia' };
  } catch (e) {
    return { found: false, career: {}, error: String(e) };
  }
}

async function getWikipediaMotorsportInfo(title) {
  return getWikipediaF1Info(title);
}

async function getWikipediaTennisInfo(title) {
  if (!title) return { found: false, singles: {}, grandSlams: [], error: 'no title' };
  try {
    const { wikitext, resolvedTitle } = await fetchWikipediaWikitext(title);
    if (!wikitext) return { found: false, singles: {}, grandSlams: [], resolvedTitle };
    const parsed = parseTennisPlayerWikitext(wikitext);
    return { ...parsed, resolvedTitle, source: 'Wikipedia' };
  } catch (e) {
    return { found: false, singles: {}, grandSlams: [], error: String(e) };
  }
}

function parseInfoboxFields(wikitext, infoboxNameRe) {
  const templates = extractAllTemplates(wikitext);
  const box = templates.find(tmpl => infoboxNameRe.test(String(tmpl.name || '').replace(/\s+/g, '')));
  if (!box) return null;
  const fields = {};

  for (const raw of (box.args || [])) {
    const arg = String(raw || '').trim();
    if (!arg) continue;
    const eq = arg.indexOf('=');
    if (eq <= 0) continue;
    const key = arg.slice(0, eq).trim().toLowerCase().replace(/\s+/g, '_');
    const val = wikiCleanText(arg.slice(eq + 1));
    if (key) fields[key] = val;
  }

  if (!Object.keys(fields).length) {
    const m = wikitext.match(new RegExp('\\{\\{\\s*' + infoboxNameRe.source + '[\\s\\S]*?\\n\\}\\}', 'i'));
    if (m) {
      for (const line of m[0].split('\n')) {
        const lm = line.match(/^\s*\|\s*([^=|]+?)\s*=\s*(.*?)\s*$/);
        if (!lm) continue;
        const key = lm[1].trim().toLowerCase().replace(/\s+/g, '_');
        fields[key] = wikiCleanText(lm[2]);
      }
    }
  }
  return fields;
}

function parseCricketerWikitext(wikitext) {
  const fields = parseInfoboxFields(wikitext, /infoboxcricketer/i);
  if (!fields) return { found: false };

  const formats = [];
  const n = parseInt(fields.columns || '4', 10) || 4;
  for (let i = 1; i <= Math.min(n, 4); i++) {
    const label = fields[`column${i}`] || '';
    if (!label) continue;

    const row = {
      key: `c${i}`,
      label,
      matches: fields[`matches${i}`] || '',
      runs: fields[`runs${i}`] || '',
      batAvg: fields[`bat_avg${i}`] || fields[`bataverage${i}`] || fields[`bat avg${i}`] || '',
      wickets: fields[`wickets${i}`] || '',
      bowlAvg: fields[`bowl_avg${i}`] || fields[`bowlaverage${i}`] || '',
      bestBowling: fields[`best_bowling${i}`] || fields[`bestbowling${i}`] || '',
      catches: fields[`catches/stumpings${i}`] || fields[`catches${i}`] || ''
    };

    if (!row.batAvg) {
      for (const k of Object.keys(fields)) {
        if (k.replace(/_/g, '') === `batavg${i}` || k === `bat avg${i}`) row.batAvg = fields[k];
      }
    }
    formats.push(row);
  }

  const flexible = (base, i) => {
    const candidates = [
      `${base}${i}`, `${base}_${i}`, `${base} ${i}`,
      base.replace(/_/g, '') + i
    ];
    for (const c of candidates) {
      if (fields[c]) return fields[c];
      const found = Object.keys(fields).find(k => k.replace(/[\s_]/g, '') === c.replace(/[\s_]/g, ''));
      if (found) return fields[found];
    }
    return '';
  };
  for (let i = 0; i < formats.length; i++) {
    const idx = i + 1;
    if (!formats[i].batAvg) formats[i].batAvg = flexible('batavg', idx) || flexible('bat_avg', idx);
    if (!formats[i].bowlAvg) formats[i].bowlAvg = flexible('bowlavg', idx) || flexible('bowl_avg', idx);
    if (!formats[i].matches) formats[i].matches = flexible('matches', idx);
    if (!formats[i].runs) formats[i].runs = flexible('runs', idx);
    if (!formats[i].wickets) formats[i].wickets = flexible('wickets', idx);
  }

  const clubs = [];
  for (let i = 1; i <= 12; i++) {
    const c = fields[`club${i}`];
    if (c) clubs.push(c);
  }

  return {
    found: !!(formats.length || fields.role || fields.batting),
    role: fields.role || '',
    batting: fields.batting || '',
    bowling: fields.bowling || '',
    internationalSpan: fields.internationalspan || '',
    odishirt: fields.odishirt || fields.t20ishirt || fields.testshirt || '',
    clubs,
    formats,
    source: 'Wikipedia'
  };
}

async function getWikipediaCricketInfo(title) {
  if (!title) return { found: false, error: 'no title' };
  try {
    const { wikitext, resolvedTitle } = await fetchWikipediaWikitext(title);
    if (!wikitext) return { found: false, resolvedTitle };
    const parsed = parseCricketerWikitext(wikitext);
    return { ...parsed, resolvedTitle, source: 'Wikipedia' };
  } catch (e) {
    return { found: false, error: String(e) };
  }
}

function parseGolferWikitext(wikitext) {
  const fields = parseInfoboxFields(wikitext, /infoboxgolfer/i);
  if (!fields) return { found: false };

  const num = (v) => {
    if (!v) return '';
    const m = String(v).replace(/,/g, '').match(/(\d+)/);
    return m ? m[1] : wikiCleanText(v);
  };

  return {
    found: true,
    fullName: fields.fullname || fields.name || '',
    nickname: fields.nickname || '',
    turnedPro: fields.yearpro || '',
    tour: fields.tour || '',
    majorWins: num(fields.majorwins),
    pgaWins: num(fields.pgawins),
    euroWins: num(fields.eurowins),
    proWins: num(fields.prowins),
    otherWins: num(fields.otherwins),
    college: fields.college || '',
    source: 'Wikipedia'
  };
}

async function getWikipediaGolfInfo(title) {
  if (!title) return { found: false, error: 'no title' };
  try {
    const { wikitext, resolvedTitle } = await fetchWikipediaWikitext(title);
    if (!wikitext) return { found: false, resolvedTitle };
    const parsed = parseGolferWikitext(wikitext);
    return { ...parsed, resolvedTitle, source: 'Wikipedia' };
  } catch (e) {
    return { found: false, error: String(e) };
  }
}

function parseMartialArtistFromArgs(args) {
  const fields = {};
  for (const raw of (args || [])) {
    const arg = String(raw || '').trim();
    const eq = arg.indexOf('=');
    if (eq <= 0) continue;
    const key = arg.slice(0, eq).trim().toLowerCase().replace(/\s+/g, '_');
    fields[key] = wikiCleanText(arg.slice(eq + 1));
  }
  return fields;
}

function parseMartialArtistWikitext(wikitext) {
  const templates = extractAllTemplates(wikitext);
  let fields = null;
  for (const tmpl of templates) {
    const lname = String(tmpl.name || '').toLowerCase().replace(/[\s_]+/g, '');
    if (lname === 'infoboxmartialartist') {
      fields = parseMartialArtistFromArgs(tmpl.args);
      break;
    }
  }
  if (!fields) {
    fields = parseInfoboxFields(wikitext, /infoboxmartialartist/i);
  }
  if (!fields || !Object.keys(fields).length) return { found: false };

  const num = (k) => {
    const v = fields[k];
    if (v == null || v === '') return 0;
    const m = String(v).replace(/,/g, '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };
  const wins = num('mma_kowin') + num('mma_subwin') + num('mma_decwin');
  const losses = num('mma_koloss') + num('mma_subloss') + num('mma_decloss') + num('mma_dqloss');
  const draws = num('mma_draw');
  const nc = num('mma_nc');
  let record = wins + '-' + losses;
  if (draws) record += '-' + draws;
  if (nc) record += ' (' + nc + ' NC)';

  return {
    found: wins + losses > 0 || !!(fields.weight_class || fields.style || fields.team),
    name: fields.name || '',
    nickname: fields.nickname || fields.other_names || '',
    weightClass: fields.weight_class || '',
    style: fields.style || '',
    stance: fields.stance || '',
    team: fields.team || '',
    fightingOutOf: fields.fighting_out_of || '',
    yearsActive: fields.years_active || '',
    reach: fields.reach || '',
    record: record,
    wins: wins,
    losses: losses,
    draws: draws,
    nc: nc,
    koWins: num('mma_kowin'),
    subWins: num('mma_subwin'),
    decWins: num('mma_decwin'),
    sherdog: fields.sherdog || '',
    source: 'Wikipedia'
  };
}

async function getWikipediaMmaInfo(title) {
  if (!title) return { found: false, error: 'no title' };
  try {
    const { wikitext, resolvedTitle } = await fetchWikipediaWikitext(title);
    if (!wikitext) return { found: false, resolvedTitle };
    const parsed = parseMartialArtistWikitext(wikitext);
    return { ...parsed, resolvedTitle, source: 'Wikipedia' };
  } catch (e) {
    return { found: false, error: String(e) };
  }
}

function parseBoxerWikitext(wikitext) {
  const templates = extractAllTemplates(wikitext);
  let fields = null;
  for (const tmpl of templates) {
    const lname = String(tmpl.name || '').toLowerCase().replace(/[\s_]+/g, '');
    if (lname === 'infoboxboxer') {
      fields = parseMartialArtistFromArgs(tmpl.args);
      break;
    }
  }
  if (!fields) fields = parseInfoboxFields(wikitext, /infoboxboxer/i);
  if (!fields || !Object.keys(fields).length) return { found: false };

  const num = (k) => {
    const v = fields[k];
    if (v == null || v === '') return 0;
    const m = String(v).replace(/,/g, '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };
  const wins = num('wins');
  const losses = num('losses');
  const draws = num('draws');
  const ko = num('ko');
  const total = num('total') || (wins + losses + draws);
  let record = wins + '-' + losses;
  if (draws) record += '-' + draws;
  return {
    found: wins + losses > 0 || total > 0,
    nickname: fields.nickname || '',
    weight: fields.weight || '',
    stance: fields.stance || '',
    reach: fields.reach || '',
    record: record,
    wins: wins,
    losses: losses,
    draws: draws,
    ko: ko,
    total: total,
    boxRec: fields.box_rec || fields.boxrec || '',
    source: 'Wikipedia'
  };
}

async function getWikipediaBoxingInfo(title) {
  if (!title) return { found: false, error: 'no title' };
  try {
    const { wikitext, resolvedTitle } = await fetchWikipediaWikitext(title);
    if (!wikitext) return { found: false, resolvedTitle };
    const parsed = parseBoxerWikitext(wikitext);
    return { ...parsed, resolvedTitle, source: 'Wikipedia' };
  } catch (e) {
    return { found: false, error: String(e) };
  }
}

function parseKickboxerWikitext(wikitext) {
  const templates = extractAllTemplates(wikitext);
  let fields = null;
  for (const tmpl of templates) {
    const lname = String(tmpl.name || '').toLowerCase().replace(/[\s_]+/g, '');
    if (lname === 'infoboxmartialartist') {
      fields = parseMartialArtistFromArgs(tmpl.args);
      break;
    }
  }
  if (!fields) fields = parseInfoboxFields(wikitext, /infoboxmartialartist/i);
  if (!fields) return { found: false };

  const num = (k) => {
    const v = fields[k];
    if (v == null || v === '') return 0;
    const m = String(v).replace(/,/g, '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };
  const wins = num('kickbox_win');
  const losses = num('kickbox_loss');
  const draws = num('kickbox_draw');
  const ko = num('kickbox_kowin');
  const nc = num('kickbox_nc');
  if (wins + losses === 0) return { found: false };
  let record = wins + '-' + losses;
  if (draws) record += '-' + draws;
  if (nc) record += ' (' + nc + ' NC)';
  return {
    found: true,
    weightClass: fields.weight_class || '',
    style: fields.style || '',
    stance: fields.stance || '',
    team: fields.team || '',
    fightingOutOf: fields.fighting_out_of || '',
    yearsActive: fields.years_active || '',
    record: record,
    wins: wins,
    losses: losses,
    draws: draws,
    koWins: ko,
    source: 'Wikipedia'
  };
}

async function getWikipediaKickboxingInfo(title) {
  if (!title) return { found: false, error: 'no title' };
  try {
    const { wikitext, resolvedTitle } = await fetchWikipediaWikitext(title);
    if (!wikitext) return { found: false, resolvedTitle };
    const parsed = parseKickboxerWikitext(wikitext);
    return { ...parsed, resolvedTitle, source: 'Wikipedia' };
  } catch (e) {
    return { found: false, error: String(e) };
  }
}

