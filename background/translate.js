

const TRANSLATE_CACHE_KEY = 'qc:translate:cache';
const TRANSLATE_CACHE_MAX = 600;
const TRANSLATE_TTL_OK_MS = 120 * 24 * 60 * 60 * 1000;
const TRANSLATE_TTL_FAIL_MS = 30 * 60 * 1000;
const TRANSLATE_MAX_INPUT = 120;
const MYMEMORY_MIN_MATCH = 0.4;
const TRANSLATE_HARD_TIMEOUT_MS = 2500;

const _storageArea = (function () {
  try {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
      return browser.storage.local;
    }
  } catch (_) {}
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return chrome.storage.local;
    }
  } catch (_) {}
  return null;
})();

function storageGet(key) {
  if (!_storageArea) return Promise.resolve({});
  try {
    const r = _storageArea.get(key);
    if (r && typeof r.then === 'function') return r;
    return new Promise(function (resolve) {
      _storageArea.get(key, function (out) { resolve(out || {}); });
    });
  } catch (e) {
    logError('storageGet failed ->', e && e.message ? e.message : e);
    return Promise.resolve({});
  }
}

function storageSet(obj) {
  if (!_storageArea) return Promise.resolve();
  try {
    const r = _storageArea.set(obj);
    if (r && typeof r.then === 'function') return r;
    return new Promise(function (resolve) {
      _storageArea.set(obj, function () { resolve(); });
    });
  } catch (e) {
    logError('storageSet failed ->', e && e.message ? e.message : e);
    return Promise.resolve();
  }
}

let _memCache = null;

function normalizeCacheKey(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[\u200B-\u200F\u0640]/g, '')
    .replace(/\u064A/g, '\u06CC')
    .replace(/\u0643/g, '\u06A9')
    .replace(/[\u0623\u0625\u0622]/g, '\u0627')
    .replace(/\s+/g, ' ');
}

async function cacheLoad() {
  if (_memCache) return _memCache;
  const stored = await storageGet(TRANSLATE_CACHE_KEY);
  const raw = stored && stored[TRANSLATE_CACHE_KEY];
  _memCache = (raw && typeof raw === 'object') ? raw : {};
  return _memCache;
}

async function cacheGet(text) {
  const cache = await cacheLoad();
  const key = normalizeCacheKey(text);
  const hit = cache[key];
  if (!hit) return null;

  const ttl = hit.ok ? TRANSLATE_TTL_OK_MS : TRANSLATE_TTL_FAIL_MS;
  if (Date.now() - (hit.ts || 0) > ttl) {
    delete cache[key];
    cachePersist();
    return null;
  }
  return hit;
}

async function cacheSet(text, entry) {
  const cache = await cacheLoad();
  const key = normalizeCacheKey(text);
  cache[key] = Object.assign({ ts: Date.now() }, entry);

  const keys = Object.keys(cache);
  if (keys.length > TRANSLATE_CACHE_MAX) {
    keys
      .sort(function (a, b) { return (cache[a].ts || 0) - (cache[b].ts || 0); })
      .slice(0, keys.length - TRANSLATE_CACHE_MAX)
      .forEach(function (k) { delete cache[k]; });
  }

  cachePersist();
}

function cachePersist() {

  const snapshot = {};
  snapshot[TRANSLATE_CACHE_KEY] = _memCache || {};
  storageSet(snapshot).catch(function (e) {
    logError('cachePersist failed ->', e && e.message ? e.message : e);
  });
}

async function clearTranslateCache() {
  _memCache = {};
  cachePersist();
  log('clearTranslateCache: done');
  return { ok: true };
}

async function getTranslateCacheStats() {
  const cache = await cacheLoad();
  const keys = Object.keys(cache);
  let hits = 0;
  keys.forEach(function (k) { if (cache[k].ok) hits++; });
  return { total: keys.length, resolved: hits, failed: keys.length - hits };
}

const _inFlight = new Map();

function scriptCandidates(text) {
  const s = String(text || '');

  if (/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF]/.test(s)) {

    const urdu    = (s.match(/[\u067B\u0679\u0688\u0691\u06BA\u06BE\u06D2\u06C1]/g) || []).length;
    const persian = (s.match(/[\u067E\u0686\u0698\u06AF\u06A9\u06CC\u200C]/g) || []).length;
    const arabic  = (s.match(/[\u0643\u064A\u0629\u0649\u064B-\u0652]/g) || []).length;

    if (urdu > 0) return ['ur', 'fa', 'ar'];
    if (persian > arabic) return ['fa', 'ar'];
    if (arabic > persian) return ['ar', 'fa'];
    return ['fa', 'ar'];
  }

  if (/[\u0400-\u04FF]/.test(s)) return ['ru', 'uk'];
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(s)) return ['ja'];
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(s)) return ['ko'];
  if (/[\u4E00-\u9FFF]/.test(s)) return ['zh'];
  if (/[\u0590-\u05FF]/.test(s)) return ['he'];
  if (/[\u0E00-\u0E7F]/.test(s)) return ['th'];
  if (/[\u0900-\u097F]/.test(s)) return ['hi'];
  if (/[\u0370-\u03FF]/.test(s)) return ['el'];
  if (/[\u10A0-\u10FF]/.test(s)) return ['ka'];
  if (/[\u0530-\u058F]/.test(s)) return ['hy'];
  if (/[\u0980-\u09FF]/.test(s)) return ['bn'];
  if (/[\u0B80-\u0BFF]/.test(s)) return ['ta'];

  return ['auto'];
}

async function detectLanguages(text, langHint) {
  const out = [];
  const push = function (l) {
    if (l && l !== 'auto' && out.indexOf(l) === -1) out.push(l);
  };

  push(langHint);

  try {
    const api = (typeof browser !== 'undefined' && browser.i18n) ? browser.i18n
              : (typeof chrome !== 'undefined' && chrome.i18n) ? chrome.i18n
              : null;
    if (api && typeof api.detectLanguage === 'function') {
      const r = await new Promise(function (resolve) {
        try {
          const p = api.detectLanguage(String(text || ''));
          if (p && typeof p.then === 'function') p.then(resolve, function () { resolve(null); });
          else api.detectLanguage(String(text || ''), resolve);
        } catch (_) { resolve(null); }
      });
      const top = r && r.languages && r.languages[0];
      if (top && top.percentage >= 60) push(String(top.language).split('-')[0]);
    }
  } catch (e) {
    log('detectLanguages: i18n unavailable ->', e && e.message);
  }

  scriptCandidates(text).forEach(push);

  return out.length ? out.slice(0, 3) : ['auto'];
}

const NON_LATIN_RE = /[^\u0000-\u02AF\u1E00-\u1EFF\u2000-\u206F\u20A0-\u20CF]/;

const PROVIDER_JUNK_RE =
  /MYMEMORY\s+WARNING|QUERY\s+LENGTH\s+LIMIT|INVALID\s+(SOURCE|TARGET)\s+LANGUAGE|NO\s+QUERY\s+SPECIFIED|^\s*NONE\s*$/i;

function isUsableTranslation(out, input) {
  const s = String(out || '').trim();
  if (!s) return false;
  if (s.length > 200) return false;
  if (PROVIDER_JUNK_RE.test(s)) return false;
  if (/https?:\/\//i.test(s)) return false;
  if (NON_LATIN_RE.test(s)) return false;
  if (s.toLowerCase() === String(input || '').trim().toLowerCase()) return false;
  return true;
}

async function wikiLanglink(lang, title) {
  const url =
    'https://' + lang + '.wikipedia.org/w/api.php' +
    '?action=query&format=json&formatversion=2&origin=*&redirects=1' +
    '&prop=langlinks&lllang=en&lllimit=1' +
    '&titles=' + encodeURIComponent(title);

  const data = await fetchJson(url);
  const pages = data && data.query && data.query.pages;
  if (!Array.isArray(pages) || !pages.length) return null;

  const page = pages[0];
  if (page.missing) return null;

  const link = page.langlinks && page.langlinks[0] && page.langlinks[0].title;
  return link ? String(link).trim() : null;
}

async function wikiSearchTopTitle(lang, query) {
  const url =
    'https://' + lang + '.wikipedia.org/w/api.php' +
    '?action=query&format=json&formatversion=2&origin=*' +
    '&list=search&srlimit=1&srnamespace=0&srinfo=&srprop=' +
    '&srsearch=' + encodeURIComponent(query);

  const data = await fetchJson(url);
  const first = data && data.query && data.query.search && data.query.search[0];
  return first && first.title ? String(first.title) : null;
}

async function translateViaWikipedia(text, langs) {
  const clean = String(text || '').trim();
  const cands = (langs || []).filter(function (l) { return l && l !== 'auto'; });
  if (!clean || !cands.length) return { ok: false, error: 'No language candidates' };

  const direct = await Promise.allSettled(cands.map(function (l) {
    return wikiLanglink(l, clean);
  }));

  for (let i = 0; i < direct.length; i++) {
    const r = direct[i];
    if (r.status === 'fulfilled' && isUsableTranslation(r.value, clean)) {
      log('translateViaWikipedia: direct hit', cands[i], clean, '->', r.value);
      return { ok: true, translatedText: r.value.trim(), provider: 'wikipedia', srcLang: cands[i] };
    }
    if (r.status === 'rejected') {
      logError('translateViaWikipedia:', cands[i], 'direct failed ->',
        r.reason && r.reason.message ? r.reason.message : r.reason);
    }
  }

  const searched = await Promise.allSettled(cands.map(async function (l) {
    const title = await wikiSearchTopTitle(l, clean);
    if (!title) return null;
    return await wikiLanglink(l, title);
  }));

  for (let i = 0; i < searched.length; i++) {
    const r = searched[i];
    if (r.status === 'fulfilled' && isUsableTranslation(r.value, clean)) {
      log('translateViaWikipedia: search hit', cands[i], clean, '->', r.value);
      return { ok: true, translatedText: r.value.trim(), provider: 'wikipedia-search', srcLang: cands[i] };
    }
  }

  return { ok: false, error: 'No langlink found' };
}

async function translateViaWikidata(text) {
  const clean = String(text || '').trim();
  if (!clean) return { ok: false, error: 'Missing text' };

  try {
    const searchUrl =
      'https://www.wikidata.org/w/api.php' +
      '?action=query&format=json&formatversion=2&origin=*' +
      '&list=search&srlimit=3&srnamespace=0&srprop=' +
      '&srsearch=' + encodeURIComponent(clean);

    const found = await fetchJson(searchUrl);
    const results = (found && found.query && found.query.search) || [];
    const ids = results
      .map(function (r) { return r && r.title; })
      .filter(function (t) { return /^Q\d+$/.test(String(t || '')); });

    if (!ids.length) return { ok: false, error: 'No Wikidata item' };

    const labelUrl =
      'https://www.wikidata.org/w/api.php' +
      '?action=wbgetentities&format=json&formatversion=2&origin=*' +
      '&props=labels&languages=en&ids=' + encodeURIComponent(ids.join('|'));

    const entities = await fetchJson(labelUrl);
    const bag = entities && entities.entities;
    if (!bag) return { ok: false, error: 'No entities returned' };

    for (let i = 0; i < ids.length; i++) {
      const ent = bag[ids[i]];
      const label = ent && ent.labels && ent.labels.en && ent.labels.en.value;
      if (isUsableTranslation(label, clean)) {
        log('translateViaWikidata:', clean, '->', label, '(' + ids[i] + ')');
        return {
          ok: true,
          translatedText: String(label).trim(),
          provider: 'wikidata',
          wikidataId: ids[i]
        };
      }
    }

    return { ok: false, error: 'No usable English label' };
  } catch (e) {
    logError('translateViaWikidata: threw for', clean, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, timedOut: true };
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function translateWithGoogle(text, langCode) {
  const clean = String(text || '').trim();
  if (!clean) return { ok: false, error: 'Missing text' };

  const sl = (langCode && langCode !== 'auto') ? langCode : 'auto';

  try {
    const url =
      'https://translate.googleapis.com/translate_a/single' +
      '?client=gtx&dt=t&ie=UTF-8&oe=UTF-8' +
      '&sl=' + encodeURIComponent(sl) + '&tl=en' +
      '&q=' + encodeURIComponent(clean);

    const data = await fetchJson(url);
    const segments = (Array.isArray(data) && Array.isArray(data[0])) ? data[0] : null;
    if (!segments) return { ok: false, error: 'Unexpected Google payload' };

    const out = segments
      .map(function (s) { return (s && typeof s[0] === 'string') ? s[0] : ''; })
      .join('')
      .trim();

    const detected = (typeof data[2] === 'string' && data[2]) ? data[2].split('-')[0] : null;
    log('translateWithGoogle:', sl, '->', out, detected ? '(detected ' + detected + ')' : '');

    if (!isUsableTranslation(out, clean)) {
      return { ok: false, error: 'Unusable Google output', srcLang: detected };
    }

    return { ok: true, translatedText: out, provider: 'google', srcLang: detected };
  } catch (e) {
    logError('translateWithGoogle: threw for', clean, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, timedOut: true };
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function translateWithLingva(text, langCode) {
  const clean = String(text || '').trim();
  if (!clean) return { ok: false, error: 'Missing text' };

  const sl = (langCode && langCode !== 'auto') ? langCode : 'auto';

  try {
    const url =
      'https://lingva.ml/api/v1/' +
      encodeURIComponent(sl) + '/en/' +
      encodeURIComponent(clean);

    const data = await fetchJson(url);
    const out = data && data.translation ? String(data.translation).trim() : '';
    log('translateWithLingva:', sl, '->', out);

    if (!isUsableTranslation(out, clean)) {
      return { ok: false, error: 'Unusable Lingva output' };
    }
    return { ok: true, translatedText: out, provider: 'lingva', srcLang: sl === 'auto' ? null : sl };
  } catch (e) {
    logError('translateWithLingva: threw for', clean, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, timedOut: true };
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function translateWithMyMemory(text, langCode) {
  const clean = String(text || '').trim();
  const lang = String(langCode || '').trim();

  if (!clean || !lang || lang === 'auto') {
    return { ok: false, error: 'Missing text or langCode' };
  }

  try {
    const url =
      'https://api.mymemory.translated.net/get?q=' +
      encodeURIComponent(clean) +
      '&langpair=' + encodeURIComponent(lang) + '|en';

    const data = await fetchJson(url);
    log('translateWithMyMemory:', lang, '->', data && data.responseData);

    const translatedText = data && data.responseData && data.responseData.translatedText;
    if (!translatedText) {
      logError('translateWithMyMemory: no translatedText in response for', clean);
      return { ok: false, error: 'No translation returned' };
    }

    const match = typeof (data.responseData && data.responseData.match) === 'number'
      ? data.responseData.match
      : null;

    if (!isUsableTranslation(translatedText, clean)) {
      logError('translateWithMyMemory: rejected output for', clean, '->', translatedText);
      return { ok: false, error: 'Unusable MyMemory output' };
    }

    if (match !== null && match < MYMEMORY_MIN_MATCH) {
      logError('translateWithMyMemory: low match', match, 'for', clean);
      return { ok: false, error: 'Low confidence match', match: match };
    }

    return {
      ok: true,
      translatedText: String(translatedText).trim(),
      provider: 'mymemory',
      srcLang: lang,
      match: match
    };
  } catch (e) {
    logError('translateWithMyMemory: threw error for', clean, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, timedOut: true };
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function runTranslateChain(text, opts) {
  const clean = String(text || '').trim();
  const langs = await detectLanguages(clean, (opts && (opts.langHint || opts.langCode)) || null);
  const tried = [];

  log('runTranslateChain:', clean, 'candidates =', langs.join(','));

  try {
    const r = await translateViaWikipedia(clean, langs);
    tried.push(r.provider || 'wikipedia');
    if (r.ok) return Object.assign(r, { tried: tried });
  } catch (e) {
    tried.push('wikipedia');
    logError('runTranslateChain: wikipedia threw ->', e && e.message ? e.message : e);
  }

  try {
    const r = await translateViaWikidata(clean);
    tried.push('wikidata');
    if (r.ok) return Object.assign(r, { srcLang: r.srcLang || langs[0], tried: tried });
  } catch (e) {
    tried.push('wikidata');
    logError('runTranslateChain: wikidata threw ->', e && e.message ? e.message : e);
  }

  let detectedByGoogle = null;
  try {
    const r = await translateWithGoogle(clean, 'auto');
    tried.push('google');
    if (r.srcLang) detectedByGoogle = r.srcLang;
    if (r.ok) return Object.assign(r, { tried: tried });
  } catch (e) {
    tried.push('google');
    logError('runTranslateChain: google threw ->', e && e.message ? e.message : e);
  }

  try {
    const r = await translateWithLingva(clean, detectedByGoogle || 'auto');
    tried.push('lingva');
    if (r.ok) return Object.assign(r, { srcLang: r.srcLang || detectedByGoogle, tried: tried });
  } catch (e) {
    tried.push('lingva');
    logError('runTranslateChain: lingva threw ->', e && e.message ? e.message : e);
  }

  const mmLangs = [];
  [detectedByGoogle].concat(langs).forEach(function (l) {
    if (l && l !== 'auto' && mmLangs.indexOf(l) === -1) mmLangs.push(l);
  });

  for (let i = 0; i < mmLangs.length; i++) {
    try {
      const r = await translateWithMyMemory(clean, mmLangs[i]);
      tried.push('mymemory:' + mmLangs[i]);
      if (r.ok) return Object.assign(r, { tried: tried });
    } catch (e) {
      tried.push('mymemory:' + mmLangs[i]);
      logError('runTranslateChain: mymemory threw ->', e && e.message ? e.message : e);
    }
  }

  return {
    ok: false,
    error: 'All translation providers failed',
    srcLang: detectedByGoogle || langs[0] || null,
    tried: tried
  };
}

async function translateQuery(text, opts) {
  const clean = String(text || '').trim();
  const options = opts || {};

  if (!clean) return { ok: false, error: 'Missing text' };
  if (clean.length > TRANSLATE_MAX_INPUT) {
    return { ok: false, error: 'Query too long (' + clean.length + ' chars)' };
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    log('translateQuery: navigator.onLine is false, skipping providers for', clean);
    return { ok: false, networkError: true, error: 'Offline' };
  }

  if (!options.noCache) {
    try {
      const hit = await cacheGet(clean);
      if (hit && hit.ok) {
        log('translateQuery: cache hit', clean, '->', hit.translatedText);
        return {
          ok: true,
          translatedText: hit.translatedText,
          provider: hit.provider,
          srcLang: hit.srcLang || null,
          cached: true
        };
      }
      if (hit && !hit.ok) {
        log('translateQuery: negative cache hit for', clean);
        return { ok: false, error: hit.error || 'Cached failure', cached: true };
      }
    } catch (e) {
      logError('translateQuery: cache read failed ->', e && e.message ? e.message : e);
    }
  }

  const flightKey = normalizeCacheKey(clean);
  if (_inFlight.has(flightKey)) {
    log('translateQuery: joining in-flight request for', clean);
    return _inFlight.get(flightKey);
  }

  const chainPromise = runTranslateChain(clean, options).then(async function (result) {
    try {
      if (result.ok) {
        await cacheSet(clean, {
          ok: true,
          translatedText: result.translatedText,
          provider: result.provider,
          srcLang: result.srcLang || null
        });
      } else if (!result.networkError) {

        await cacheSet(clean, { ok: false, error: result.error });
      }
    } catch (e) {
      logError('translateQuery: cache write failed ->', e && e.message ? e.message : e);
    }

    log('translateQuery:', clean, '->',
      result.ok ? result.translatedText : ('FAILED (' + result.error + ')'),
      '| chain:', (result.tried || []).join(' > '));

    return result;
  });

  _inFlight.set(flightKey, chainPromise);
  chainPromise.finally(function () { _inFlight.delete(flightKey); });

  const timeoutMs = options.timeoutMs || TRANSLATE_HARD_TIMEOUT_MS;
  const timeoutPromise = new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ ok: false, error: 'Translation chain timed out', timedOut: true, tried: ['timeout'] });
    }, timeoutMs);
  });

  return Promise.race([chainPromise, timeoutPromise]);
}

cacheLoad()
  .then(function (c) { log('translate cache ready:', Object.keys(c).length, 'entries'); })
  .catch(function (e) { logError('translate cache preload failed ->', e && e.message ? e.message : e); });

(function (root) {
  root.QuickCardTranslate = {
    translateQuery: translateQuery,
    clearTranslateCache: clearTranslateCache,
    getTranslateCacheStats: getTranslateCacheStats,

    providers: {
      wikipedia: translateViaWikipedia,
      wikidata: translateViaWikidata,
      google: translateWithGoogle,
      lingva: translateWithLingva,
      mymemory: translateWithMyMemory
    }
  };
})(typeof self !== 'undefined' ? self : this);

