

function detectNonLatinLangCode(text) {
  if (!text) return null;

  if (/[\u067E\u0686\u06A9\u06AF\u06CC]/.test(text)) return 'fa';

  if (/[\u0643\u064A\u0629\u0624\u0626\u0621]/.test(text)) return 'ar';

  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) return 'fa';

  if (/[\u0400-\u04FF]/.test(text)) return 'ru';

  if (/[\u0900-\u097F]/.test(text)) return 'hi';

  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';

  if (/[\uAC00-\uD7A3]/.test(text)) return 'ko';

  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';

  return null;
}

const translationCache = new Map();
const TRANSLATION_TIMEOUT_MS = 3000;
const TRANSLATION_CONFIDENCE_THRESHOLD = 0.7;

const TRANSLATION_NETWORK_RETRY_DELAYS_MS = [700, 1400];

function translateSelectionText(text, langCode, callback) {
  translateSelectionTextAttempt(text, langCode, 0, callback);
}

function translateSelectionTextAttempt(text, langCode, attempt, callback) {
  const cacheKey = `${langCode}:${text}`;

  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey);
    log(`translation: "${text}" -> "${cached.translatedText}" | provider: ${cached.provider || '?'} | srcLang: ${cached.srcLang || '?'} | cached (this page load)`);
    callback(cached);
    return;
  }

  log('translateSelectionText: requesting translation for', langCode, text, attempt ? `(attempt ${attempt + 1})` : '');

  let settled = false;

  const timeoutTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    logError('translateSelectionText: timed out after', TRANSLATION_TIMEOUT_MS, 'ms for', text);
    callback({ ok: false, timedOut: true });

  }, TRANSLATION_TIMEOUT_MS);

  api.runtime.sendMessage({
    type: 'QUICKCARD_TRANSLATE_TEXT',
    text,
    langCode
  }).then((res) => {
    log('translateSelectionText: response', res);

    const result = (res && res.ok && res.translatedText)
      ? {
          ok: true,
          translatedText: res.translatedText,
          match: res.match,
          provider: res.provider,
          srcLang: res.srcLang
        }
      : { ok: false, timedOut: !!(res && res.timedOut), networkError: !!(res && res.networkError) };

    log(result.ok
      ? `translation: "${text}" -> "${result.translatedText}" | provider: ${result.provider || '?'} | srcLang: ${result.srcLang || '?'}${result.match != null ? ` | match: ${result.match}` : ''}`
      : `translation: "${text}" -> FAILED${result.timedOut ? ' (timed out)' : ''}${result.networkError ? ' (network)' : ''}`);

    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);

    if (result.networkError && attempt < TRANSLATION_NETWORK_RETRY_DELAYS_MS.length) {
      setTimeout(() => {
        translateSelectionTextAttempt(text, langCode, attempt + 1, callback);
      }, TRANSLATION_NETWORK_RETRY_DELAYS_MS[attempt]);
      return;
    }

    if (result.ok) translationCache.set(cacheKey, result);
    callback(result);
  }).catch((e) => {
    logError('translateSelectionText: sendMessage failed ->', e && e.message ? e.message : e);

    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);

    if (attempt < TRANSLATION_NETWORK_RETRY_DELAYS_MS.length) {
      setTimeout(() => {
        translateSelectionTextAttempt(text, langCode, attempt + 1, callback);
      }, TRANSLATION_NETWORK_RETRY_DELAYS_MS[attempt]);
      return;
    }

    callback({ ok: false, networkError: true });
  });
}

function buildTranslationBanner(translationInfo) {
  if (!translationInfo) return '';

  const providerTag = translationInfo.provider ? ` <span class="translation-provider">${escapeHtml(translationInfo.provider)}</span>` : '';
  const warningPrefix = translationInfo.lowConfidence ? '⚠ Low-confidence translation of ' : 'Translated ';
  const warningSuffix = translationInfo.lowConfidence ? '. Results may be wrong.' : '';

  return `<div class="translation-note">${warningPrefix}"${escapeHtml(translationInfo.original)}" → ` +
    `<span class="qc-translate-edit-wrap">` +
      `<input type="text" class="qc-translate-edit-input" value="${escapeHtml(translationInfo.translated)}" spellcheck="false">` +
      `<button type="button" class="qc-translate-edit-go" title="Search this text" aria-label="Search this text">↻</button>` +
    `</span>${providerTag}${warningSuffix}</div>`;
}

function buildTranslationFailureHtml(originalText) {
  return `<div class="translation-note">Couldn't translate "${escapeHtml(originalText)}" - try typing it in English: ` +
    `<span class="qc-translate-edit-wrap">` +
      `<input type="text" class="qc-translate-edit-input" value="${escapeHtml(originalText)}" spellcheck="false">` +
      `<button type="button" class="qc-translate-edit-go" title="Search this text" aria-label="Search this text">↻</button>` +
    `</span></div>`;
}

function cleanTranslatedText(rawTranslatedText) {
  const cleaned = String(rawTranslatedText)
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    text: cleaned,
    stillHasNonLatin: detectNonLatinLangCode(cleaned) !== null
  };
}

