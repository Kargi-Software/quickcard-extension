

const api = typeof browser !== 'undefined' ? browser : chrome;

const LOG_PREFIX = '[QuickCard][bg]';

const DEBUG_LOGS = false;
function log() {}
function logError() {}

async function fetchGoogleSuggestions(query, timeout = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { method: 'GET', signal: controller.signal, cache: 'no-store' });

    if (!res.ok) {
      logError('fetchGoogleSuggestions: HTTP not ok', res.status);
      return { ok: false, suggestions: [] };
    }

    const data = await res.json();

    const suggestions = Array.isArray(data) && Array.isArray(data[1]) ? data[1].slice(0, 6) : [];
    return { ok: true, suggestions };
  } catch (e) {
    if (e && e.name === 'AbortError') {
      logError('fetchGoogleSuggestions: timed out for', query);
    } else {
      logError('fetchGoogleSuggestions: failed for', query, '->', e && e.message ? e.message : e);
    }
    return { ok: false, suggestions: [] };
  } finally {
    clearTimeout(timer);
  }
}

const CORE_DEFAULT_SETTINGS = {
  featureLinkHover: true,
  featureTextSearch: true,
  featureContextMenuSearch: true,
  googleSuggestEnabled: true,
  enabledTopics: { movies: true, games: true, music: true, books: true, football: true, sports: true }
};

async function getCoreSettings() {
  const s = await api.storage.local.get(CORE_DEFAULT_SETTINGS);
  return {
    featureLinkHover: !!s.featureLinkHover,
    featureTextSearch: !!s.featureTextSearch,
    featureContextMenuSearch: !!s.featureContextMenuSearch,
    googleSuggestEnabled: s.googleSuggestEnabled !== false,
    enabledTopics: (s.enabledTopics && typeof s.enabledTopics === 'object')
      ? s.enabledTopics
      : CORE_DEFAULT_SETTINGS.enabledTopics
  };
}

const _inFlightFetches = new Map();

const FETCH_JSON_MAX_BYTES = 20 * 1024 * 1024;

async function readResponseTextWithSizeCap(res, maxBytes) {
  if (!res.body || typeof res.body.getReader !== 'function') {

    return res.text();
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let text = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > maxBytes) {
        const tooLargeErr = new Error(`Response exceeded ${maxBytes} byte cap`);
        tooLargeErr.isTooLarge = true;
        throw tooLargeErr;
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return text;
  } finally {
    try { reader.releaseLock(); } catch (e) {}
  }
}

async function fetchJson(url, headers = {}, timeout = 11000) {
  if (_inFlightFetches.has(url)) {
    log('fetchJson: reusing in-flight request for', url);
    return _inFlightFetches.get(url);
  }

  const requestPromise = (async () => {
    log('fetchJson: requesting', url);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    let res;
    try {
      res = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'omit',
        cache: 'no-store',
        signal: controller.signal
      });
    } catch (e) {
      if (e && e.name === 'AbortError') {
        logError('fetchJson: timed out after', timeout, 'ms for', url);
        const timeoutErr = new Error('Timed out');
        timeoutErr.isTimeout = true;
        throw timeoutErr;
      }
      logError('fetchJson: network/fetch error for', url, '->', e && e.message ? e.message : e);
      throw e;
    } finally {
      clearTimeout(timer);
    }

    log('fetchJson: response status', res.status, 'for', url);

    if (!res.ok) {
      let bodySnippet = '';
      try {
        bodySnippet = (await res.clone().text()).slice(0, 300);
      } catch (e) {}
      logError('fetchJson: HTTP not ok', res.status, 'body snippet:', bodySnippet);
      throw new Error(`HTTP ${res.status}`);
    }

    const declaredLength = Number(res.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > FETCH_JSON_MAX_BYTES) {
      logError('fetchJson: declared content-length', declaredLength, 'exceeds cap for', url);
      const tooLargeErr = new Error(`Response too large (${declaredLength} bytes)`);
      tooLargeErr.isTooLarge = true;
      throw tooLargeErr;
    }

    const text = await readResponseTextWithSizeCap(res, FETCH_JSON_MAX_BYTES);
    const json = JSON.parse(text);
    log('fetchJson: parsed JSON ok for', url);
    return json;
  })();

  _inFlightFetches.set(url, requestPromise);

  try {
    return await requestPromise;
  } finally {
    _inFlightFetches.delete(url);
  }
}

async function httpGetText(url, headers = {}, timeout = 11000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  log('httpGetText: requesting', url);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
      credentials: 'omit',
      cache: 'no-store'
    });

    const text = await readResponseTextWithSizeCap(res, FETCH_JSON_MAX_BYTES);
    log('httpGetText: response status', res.status, 'for', url);
    return { ok: res.ok, status: res.status, text };
  } catch (e) {
    logError('httpGetText: fetch failed for', url, '->', e && e.name, e && e.message ? e.message : e);
    return { ok: false, status: 0, text: '', error: String(e && e.message ? e.message : e) };
  } finally {
    clearTimeout(timer);
  }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const CHUNK_SIZE = 8192;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

const WIKI_ABBREVIATION_PATTERN = /^[A-Z]{2,4}$/;

async function resolveWikipediaAbbreviation(query) {
  if (!WIKI_ABBREVIATION_PATTERN.test(query)) return { ok: true, type: 'none' };

  const summaryUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&redirects=1&prop=pageprops&ppprop=disambiguation&format=json&origin=*`;

  let res;
  try {
    res = await httpGetText(summaryUrl, { Accept: 'application/json' }, 6000);
  } catch (e) {
    logError('resolveWikipediaAbbreviation: fetch failed for', query, e && e.message);
    return { ok: true, type: 'none' };
  }
  if (!res || !res.ok || !res.text) return { ok: true, type: 'none' };

  let json;
  try { json = JSON.parse(res.text); }
  catch (e) { logError('resolveWikipediaAbbreviation: JSON.parse failed for', query, e); return { ok: true, type: 'none' }; }

  const pages = json && json.query && json.query.pages;
  if (!pages) return { ok: true, type: 'none' };

  const page = Object.values(pages)[0];

  if (!page || Object.prototype.hasOwnProperty.call(page, 'missing')) {
    log('resolveWikipediaAbbreviation: no page for', query);
    return { ok: true, type: 'none' };
  }

  const resolvedTitle = page.title;
  const isDisambiguation = page.pageprops &&
    Object.prototype.hasOwnProperty.call(page.pageprops, 'disambiguation');

  if (!isDisambiguation) {
    log('resolveWikipediaAbbreviation: direct resolve', query, '->', resolvedTitle);
    return { ok: true, type: 'direct', title: resolvedTitle };
  }

  const linksUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(resolvedTitle)}&prop=links&plnamespace=0&pllimit=20&format=json&origin=*`;

  let linksRes;
  try {
    linksRes = await httpGetText(linksUrl, { Accept: 'application/json' }, 6000);
  } catch (e) {
    logError('resolveWikipediaAbbreviation: links fetch failed for', resolvedTitle, e && e.message);
    return { ok: true, type: 'none' };
  }
  if (!linksRes || !linksRes.ok || !linksRes.text) return { ok: true, type: 'none' };

  let linksJson;
  try { linksJson = JSON.parse(linksRes.text); }
  catch (e) { logError('resolveWikipediaAbbreviation: links JSON.parse failed for', resolvedTitle, e); return { ok: true, type: 'none' }; }

  const linkPages = linksJson && linksJson.query && linksJson.query.pages;
  const linkPage = linkPages ? Object.values(linkPages)[0] : null;
  const rawLinks = (linkPage && Array.isArray(linkPage.links)) ? linkPage.links : [];

  const options = rawLinks
    .map((l) => l.title)
    .filter((t) => t && !/\(disambiguation\)$/i.test(t) && !/^List of /i.test(t))
    .slice(0, 8);

  if (!options.length) {
    log('resolveWikipediaAbbreviation: disambiguation page with no usable links for', resolvedTitle);
    return { ok: true, type: 'none' };
  }

  log('resolveWikipediaAbbreviation: disambiguation choices for', query, '->', options);
  return { ok: true, type: 'choices', options };
}

const bgImageCache = new Map();
const bgImageInflight = new Map();
const BG_IMAGE_CACHE_MAX = 80;

async function fetchImageAsDataUrl(url, timeout = 11000) {
  if (!url) return { ok: false, error: 'no url' };
  if (String(url).startsWith('data:')) return { ok: true, dataUrl: url };

  if (bgImageCache.has(url)) {
    log('fetchImageAsDataUrl: cache hit for', url);
    return bgImageCache.get(url);
  }
  if (bgImageInflight.has(url)) {
    log('fetchImageAsDataUrl: join inflight for', url);
    return bgImageInflight.get(url);
  }

  const work = (async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  log('fetchImageAsDataUrl: requesting', url);

  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'omit',

      signal: controller.signal
    });

    if (!res.ok) {
      logError('fetchImageAsDataUrl: HTTP not ok', res.status, 'for', url);
      return { ok: false, error: `HTTP ${res.status}` };
    }

    const contentType = (res.headers.get('content-type') || '').toLowerCase();

    const contentTypeLooksImage = !contentType
      || contentType.startsWith('image/')
      || contentType.includes('svg')
      || contentType.includes('icon')
      || contentType === 'application/octet-stream';
    const buffer = await res.arrayBuffer();
    if (!buffer || buffer.byteLength < 4) {
      logError('fetchImageAsDataUrl: body too small for', url, 'bytes=', buffer ? buffer.byteLength : 0);
      return { ok: false, error: 'Empty or tiny body' };
    }

    const bytes = new Uint8Array(buffer.slice(0, 12));
    const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8;
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
    const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
    const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
      && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

    const isIco = bytes[0] === 0x00 && bytes[1] === 0x00
      && (bytes[2] === 0x01 || bytes[2] === 0x02) && bytes[3] === 0x00;
    let headText = '';
    try {
      headText = new TextDecoder('utf-8').decode(buffer.slice(0, Math.min(256, buffer.byteLength))).trimStart();
    } catch (_) {}
    const isSvg = contentType.includes('svg')
      || headText.startsWith('<svg')
      || headText.startsWith('<?xml')
      || /^<\s*!DOCTYPE\s+svg/i.test(headText);
    if (!isJpeg && !isPng && !isGif && !isWebp && !isIco && !isSvg) {
      if (!contentTypeLooksImage) {
        logError('fetchImageAsDataUrl: non-image content-type', contentType, 'for', url);
        return { ok: false, error: `Non-image content-type: ${contentType}`, contentType };
      }
      logError('fetchImageAsDataUrl: not a recognized image magic for', url);
      return { ok: false, error: 'Unrecognized image data' };
    }
    let safeType;
    if (isSvg) safeType = 'image/svg+xml';
    else if (isIco) safeType = (contentType.includes('icon') ? contentType.split(';')[0].trim() : 'image/x-icon');
    else if (contentType.startsWith('image/')) safeType = contentType.split(';')[0].trim();
    else if (isJpeg) safeType = 'image/jpeg';
    else if (isPng) safeType = 'image/png';
    else if (isGif) safeType = 'image/gif';
    else safeType = 'image/webp';
    const base64 = arrayBufferToBase64(buffer);

    log('fetchImageAsDataUrl: success for', url, 'bytes=', buffer.byteLength, 'type=', safeType);
    const okResult = { ok: true, dataUrl: `data:${safeType};base64,${base64}`, contentType: safeType };
    if (bgImageCache.size >= BG_IMAGE_CACHE_MAX) {
      const oldest = bgImageCache.keys().next().value;
      if (oldest !== undefined) bgImageCache.delete(oldest);
    }
    bgImageCache.set(url, okResult);
    return okResult;
  } catch (e) {
    if (e && e.name === 'AbortError') {
      logError('fetchImageAsDataUrl: timed out for', url);
      return { ok: false, error: 'Timed out' };
    }
    logError('fetchImageAsDataUrl: failed for', url, '->', e && e.message ? e.message : e);
    return { ok: false, error: String(e && e.message ? e.message : e) };
  } finally {
    clearTimeout(timer);
  }
  })();

  bgImageInflight.set(url, work);
  try {
    return await work;
  } finally {
    bgImageInflight.delete(url);
  }
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&apos;/gi, "'")
    .replace(/&#0*39;/g, "'")
    .replace(/&#x0*27;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*34;/g, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&');
}

function cleanValue(value) {
  if (!value || value === 'N/A') return null;
  const text = String(value).trim();
  if (!text) return null;
  return decodeHtmlEntities(text);
}

function firstValue(...values) {
  for (const value of values) {
    const cleaned = cleanValue(value);
    if (cleaned) return cleaned;
  }
  return null;
}

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');

  return `${y}-${m}-${d}`;
}

function calculateAge(birthDateText, deathDateText) {
  const birth = new Date(birthDateText);
  const end = deathDateText ? new Date(deathDateText) : new Date();

  if (Number.isNaN(birth.getTime()) || Number.isNaN(end.getTime())) return null;

  let age = end.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = end.getUTCMonth() - birth.getUTCMonth();
  const dayDiff = end.getUTCDate() - birth.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age -= 1;

  return {
    age: age >= 0 ? age : null,
    deceased: !!deathDateText
  };
}

