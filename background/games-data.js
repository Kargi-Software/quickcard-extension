

const GAMESPOT_ORIGIN = 'https://www.gamespot.com';
const GAMESPOT_SEARCH_ENDPOINT = `${GAMESPOT_ORIGIN}/`;

const GAMES_SEARCH_TIMEOUT_MS = 16000;

function gamesCleanText(value) {
  return typeof value === 'string'
    ? value.replace(/\s+/g, ' ').trim()
    : '';
}

function gamesLogError() {}

function gamesLog() {}

const GAMES_DEFAULT_SETTINGS = {
  gamesFieldPublisher: true,
  gamesFieldDeveloper: true,
  gamesFieldSynopsis: true,
  gamesFieldMetascore: true,
  gamesShowSteamRating: true,
  gamesFieldSteamPrice: true,

  gamesFieldSystemRequirements: true,
  gamesFieldSteamTags: true,

  gamesSteamRegion: 'US',
  gamesPlayStationRegion: 'US',
  gamesXboxRegion: 'US',

  gamesShowSteamLink: true,
  gamesShowPlayStationLink: true,
  gamesShowXboxLink: true,
  gamesShowMetacriticLink: true,
  gamesShowOfficialWebsiteLink: true,
  gamesShowWikipediaLink: true,
  gamesShowGameSpotLink: true
};

async function getGamesSettings() {
  const s = await api.storage.local.get(GAMES_DEFAULT_SETTINGS);
  return {
    gamesFieldPublisher: s.gamesFieldPublisher !== false,
    gamesFieldDeveloper: s.gamesFieldDeveloper !== false,

    gamesFieldReleaseDate: true,
    gamesFieldGenre: true,
    gamesFieldSynopsis: s.gamesFieldSynopsis !== false,
    gamesFieldMetascore: s.gamesFieldMetascore !== false,
    gamesShowSteamRating: s.gamesShowSteamRating !== false,
    gamesFieldSteamPrice: s.gamesFieldSteamPrice !== false,
    gamesFieldSystemRequirements: s.gamesFieldSystemRequirements !== false,
    gamesFieldSteamTags: s.gamesFieldSteamTags !== false,

    gamesSteamRegion: s.gamesSteamRegion || 'US',
    gamesPlayStationRegion: s.gamesPlayStationRegion || 'US',
    gamesXboxRegion: s.gamesXboxRegion || 'US',

    gamesShowSteamLink: s.gamesShowSteamLink !== false,
    gamesShowPlayStationLink: s.gamesShowPlayStationLink !== false,
    gamesShowXboxLink: s.gamesShowXboxLink !== false,
    gamesShowMetacriticLink: s.gamesShowMetacriticLink !== false,
    gamesShowOfficialWebsiteLink: s.gamesShowOfficialWebsiteLink !== false,
    gamesShowWikipediaLink: s.gamesShowWikipediaLink !== false,
    gamesShowGameSpotLink: s.gamesShowGameSpotLink !== false
  };
}

function gamesAbsoluteUrl(value, baseUrl = GAMESPOT_ORIGIN) {
  if (!value || typeof value !== 'string') return null;

  try {
    return new URL(value, baseUrl).href;
  } catch (_) {
    return null;
  }
}

const GAMES_SEARCH_THUMBNAIL_WIDTH = 296;

function gamesApplySearchThumbnailSize(rawImageUrl) {
  if (!rawImageUrl) return rawImageUrl;

  try {
    const url = new URL(rawImageUrl);
    url.search = `?w=${GAMES_SEARCH_THUMBNAIL_WIDTH}`;
    return url.href;
  } catch (_) {
    return rawImageUrl;
  }
}

function gamesUniqueStrings(values) {
  const seen = new Set();
  const result = [];

  for (const value of values || []) {
    const cleaned = gamesCleanText(value);
    if (!cleaned) continue;

    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(cleaned);
  }

  return result;
}

function gamesToList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return gamesUniqueStrings(
      value.flatMap((item) => {
        if (typeof item === 'string') return [item];
        if (item && typeof item.name === 'string') return [item.name];
        return [];
      })
    );
  }

  if (typeof value === 'string') {
    return gamesUniqueStrings(
      value
        .split(/\s*(?:,|;|\||\/)\s*/)
        .map((item) => item.trim())
        .filter(Boolean)
    );
  }

  if (typeof value === 'object' && typeof value.name === 'string') {
    return [gamesCleanText(value.name)].filter(Boolean);
  }

  return [];
}

function gamesJoinList(values) {
  return gamesUniqueStrings(values).join(', ');
}

function gamesNormalizeImageValue(value) {
  if (!value) return null;

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const normalized = gamesNormalizeImageValue(item);
      if (normalized) return normalized;
    }

    return null;
  }

  if (typeof value === 'object') {
    return (
      value.url ||
      value.contentUrl ||
      value.src ||
      value.image ||
      null
    );
  }

  return null;
}

function gamesNormalizeDate(value) {
  const text = gamesCleanText(value);
  if (!text) return null;

  const humanDate = text.match(
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},\s+\d{4}\b/i
  );

  if (humanDate) return humanDate[0];

  const isoDate = text.match(/\d{4}-\d{2}-\d{2}/);
  if (isoDate) {
    const year = Number(isoDate[0].slice(0, 4));

    if (year >= 2090) return 'TBA';

    return isoDate[0];
  }

  return text;
}

function gamesExtractImageFromElement(element, baseUrl) {
  if (!element) return null;

  const candidates = [
    element.currentSrc,
    element.src,
    element.getAttribute?.('src'),
    element.getAttribute?.('data-src'),
    element.getAttribute?.('data-lazy'),
    element.getAttribute?.('data-original'),
    element.getAttribute?.('data-image'),
    element.getAttribute?.('content')
  ];

  const srcset =
    element.getAttribute?.('srcset') ||
    element.getAttribute?.('data-srcset');

  if (srcset) {
    const firstCandidate = srcset
      .split(',')
      .map((part) => part.trim().split(/\s+/)[0])
      .find(Boolean);

    if (firstCandidate) candidates.unshift(firstCandidate);
  }

  for (const candidate of candidates) {
    const absolute = gamesAbsoluteUrl(candidate, baseUrl);
    if (absolute && !absolute.startsWith('data:')) return absolute;
  }

  return null;
}

async function gamesFetchHtmlDocument(url, timeoutMs = 12000) {

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    const html = await response.text();

    return new DOMParser().parseFromString(html, 'text/html');
  } finally {
    clearTimeout(timeoutId);
  }
}

function gamesGetJsonLdObjects(document) {
  const result = [];

  const addValue = (value) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach(addValue);
      return;
    }

    if (typeof value !== 'object') return;

    if (Array.isArray(value['@graph'])) {
      value['@graph'].forEach(addValue);
    }

    result.push(value);
  };

  for (const script of document.querySelectorAll(
    'script[type="application/ld+json"]'
  )) {
    const raw = script.textContent?.trim();
    if (!raw) continue;

    try {
      addValue(JSON.parse(raw));
    } catch (_) {

    }
  }

  return result;
}

function gamesJsonLdHasType(item, wantedTypes) {
  const rawType = item && item['@type'];
  const types = Array.isArray(rawType) ? rawType : [rawType];

  return types.some((type) =>
    wantedTypes.includes(String(type || '').toLowerCase())
  );
}

function gamesFindGameJsonLd(document) {
  const objects = gamesGetJsonLdObjects(document);

  return (
    objects.find((item) =>
      gamesJsonLdHasType(item, [
        'videogame',
        'softwareapplication',
        'game'
      ])
    ) ||
    objects.find((item) =>
      item &&
      (
        item.gamePlatform ||
        item.operatingSystem ||
        item.genre ||
        item.datePublished
      )
    ) ||
    null
  );
}

function gamesFindLeafElementsByText(document, pattern) {
  return [...document.querySelectorAll('body *')].filter((element) => {
    if (element.children.length > 0) return false;

    const text = gamesCleanText(element.textContent);
    return text && pattern.test(text);
  });
}

function gamesGetSiblingValue(labelElement) {
  if (!labelElement) return '';

  const next = labelElement.nextElementSibling;
  if (next) {
    const value = gamesCleanText(next.textContent);
    if (value) return value;
  }

  const parent = labelElement.parentElement;
  if (!parent) return '';

  const children = [...parent.children];
  const labelIndex = children.indexOf(labelElement);

  if (labelIndex >= 0) {
    for (let i = labelIndex + 1; i < children.length; i += 1) {
      const value = gamesCleanText(children[i].textContent);
      if (value) return value;
    }
  }

  return '';
}

function gamesExtractLabeledValue(document, labels) {
  const escapedLabels = labels.map((label) =>
    label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  const exactPattern = new RegExp(
    `^(?:${escapedLabels.join('|')})\\s*:?$`,
    'i'
  );

  const inlinePattern = new RegExp(
    `^(?:${escapedLabels.join('|')})\\s*:?\\s*(.+)$`,
    'i'
  );

  for (const dt of document.querySelectorAll('dt')) {
    const labelText = gamesCleanText(dt.textContent);
    if (!exactPattern.test(labelText)) continue;

    const dd = dt.nextElementSibling;
    const value = gamesCleanText(dd?.textContent);
    if (value) return value;
  }

  for (const row of document.querySelectorAll('tr')) {
    const cells = [...row.querySelectorAll(':scope > th, :scope > td')];
    if (cells.length < 2) continue;

    const labelText = gamesCleanText(cells[0].textContent);
    if (!exactPattern.test(labelText)) continue;

    const value = gamesCleanText(
      cells.slice(1).map((cell) => cell.textContent).join(' ')
    );

    if (value) return value;
  }

  const candidates = gamesFindLeafElementsByText(
    document,
    new RegExp(`(?:${escapedLabels.join('|')})`, 'i')
  );

  for (const labelElement of candidates) {
    const labelText = gamesCleanText(labelElement.textContent);

    const inlineMatch = labelText.match(inlinePattern);
    if (inlineMatch && gamesCleanText(inlineMatch[1])) {
      return gamesCleanText(inlineMatch[1]);
    }

    if (!exactPattern.test(labelText)) continue;

    const siblingValue = gamesGetSiblingValue(labelElement);
    if (siblingValue && !exactPattern.test(siblingValue)) {
      return siblingValue;
    }

    const container = labelElement.closest(
      'li, tr, dl, article, section, [class*="fact"], [class*="detail"]'
    );

    if (!container) continue;

    const containerText = gamesCleanText(container.textContent);
    const containerMatch = containerText.match(inlinePattern);

    if (containerMatch && gamesCleanText(containerMatch[1])) {
      return gamesCleanText(containerMatch[1]);
    }
  }

  return '';
}

function gamesExtractLabeledLinks(document, labels) {
  const escapedLabels = labels.map((label) =>
    label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  const pattern = new RegExp(`(?:${escapedLabels.join('|')})`, 'i');
  const result = [];

  for (const element of gamesFindLeafElementsByText(document, pattern)) {
    const container = element.closest(
      'li, tr, dl, article, section, [class*="fact"], [class*="detail"], div'
    );

    if (!container) continue;

    for (const link of container.querySelectorAll('a[href]')) {
      const text = gamesCleanText(link.textContent);
      if (text) result.push(text);
    }
  }

  return gamesUniqueStrings(result);
}

function gamesIsGamePagePath(pathname) {
  return /^\/games\/[^/?#]+\/?$/i.test(pathname || '');
}

function gamesFindSearchResultContainer(link) {
  return (
    link.closest(
      'article, li, [class*="card"], [class*="result"], [class*="media"]'
    ) ||
    link.parentElement
  );
}

function gamesExtractSearchResultTitle(link, container) {
  const candidates = [
    link.getAttribute('aria-label'),
    link.getAttribute('title'),
    link.querySelector('h1, h2, h3, h4, h5')?.textContent,
    container?.querySelector('h1, h2, h3, h4, h5')?.textContent,
    link.textContent
  ];

  for (const candidate of candidates) {
    const title = gamesCleanText(candidate);

    if (
      title &&
      title.length >= 2 &&
      title.length <= 180 &&
      !/^games?$/i.test(title)
    ) {
      return title;
    }
  }

  return '';
}

function gamesExtractSearchResultDescription(container, title) {
  if (!container) return '';

  const candidates = [
    container.querySelector('p')?.textContent,
    container.querySelector('[class*="deck"]')?.textContent,
    container.querySelector('[class*="description"]')?.textContent,
    container.querySelector('[class*="summary"]')?.textContent
  ];

  for (const candidate of candidates) {
    const value = gamesCleanText(candidate);

    if (
      value &&
      value !== title &&
      value.length >= 4 &&
      value.length <= 300
    ) {
      return value;
    }
  }

  return '';
}

async function searchGames(query, limit = 3) {
  const q = gamesCleanText(String(query || ''));
  if (!q) return [];

  const searchUrl =
    `${GAMESPOT_SEARCH_ENDPOINT}?s=${encodeURIComponent(q)}`;

  const document = await gamesFetchHtmlDocument(searchUrl, GAMES_SEARCH_TIMEOUT_MS);
  const results = new Map();

    for (const link of document.querySelectorAll('a[href]')) {
      const href = link.getAttribute('href');
      if (!href) continue;

      const absoluteUrl = gamesAbsoluteUrl(href, GAMESPOT_ORIGIN);
      if (!absoluteUrl) continue;

      let parsedUrl;

      try {
        parsedUrl = new URL(absoluteUrl);
      } catch (_) {
        continue;
      }

      if (
        parsedUrl.hostname !== 'www.gamespot.com' &&
        parsedUrl.hostname !== 'gamespot.com'
      ) {
        continue;
      }

      if (!gamesIsGamePagePath(parsedUrl.pathname)) continue;

      parsedUrl.protocol = 'https:';
      parsedUrl.hostname = 'www.gamespot.com';
      parsedUrl.search = '';
      parsedUrl.hash = '';

      if (!parsedUrl.pathname.endsWith('/')) {
        parsedUrl.pathname += '/';
      }

      const canonicalUrl = parsedUrl.href;
      const container = gamesFindSearchResultContainer(link);
      const title = gamesExtractSearchResultTitle(link, container);

      if (!title) continue;

      const imageElement =
        container?.querySelector('img') ||
        link.querySelector('img');

      const image = gamesApplySearchThumbnailSize(
        gamesExtractImageFromElement(
          imageElement,
          canonicalUrl
        )
      );

      const description = gamesExtractSearchResultDescription(
        container,
        title
      );

      const existing = results.get(canonicalUrl);

      if (
        !existing ||
        (!existing.image && image) ||
        (!existing.description && description)
      ) {
        results.set(canonicalUrl, {
          id: canonicalUrl,
          label: title,
          description,
          image
        });
      }

      if (results.size >= Math.max(limit * 4, 12)) break;
    }

  return [...results.values()].slice(0, limit);
}

function gamesExtractScoreFromText(text) {

  const cleaned = gamesCleanText(text);
  if (!cleaned) return null;
  if (/\b(?:out\s+of\s*10|\/\s*10)\b/i.test(cleaned)) return null;

  const SEP = '[\\s:\\-–—]{0,8}';
  const patterns = [
    new RegExp(`\\bmetacritic\\b${SEP}(\\d{1,3})\\s*\\/\\s*100\\b`, 'i'),
    new RegExp(`\\bmetascore\\b${SEP}(\\d{1,3})\\s*\\/\\s*100\\b`, 'i'),
    new RegExp(`\\b(\\d{1,3})\\s*\\/\\s*100\\b${SEP}\\bmetacritic\\b`, 'i'),
    new RegExp(`\\b(\\d{1,3})\\s*\\/\\s*100\\b${SEP}\\bmetascore\\b`, 'i')
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (!match) continue;
    const score = Number(match[1]);
    if (Number.isFinite(score) && score >= 0 && score <= 100) return score;
  }
  return null;
}

function gamesExtractMetacritic(document, gamePageUrl) {
  const metacriticLinks = [
    ...document.querySelectorAll(
      'a[href*="metacritic.com"], a[href*="metascore"]'
    )
  ];

  for (const link of metacriticLinks) {
    let node = link;

    for (let depth = 0; node && depth < 6; depth += 1) {
      const text = gamesCleanText(node.textContent);

      if (text && text.length <= 500) {
        const score = gamesExtractScoreFromText(text);

        if (score !== null) {
          return {
            score,
            sourceURL: gamesAbsoluteUrl(
              link.getAttribute('href'),
              gamePageUrl
            ),
            gameSpotUrl: gamePageUrl,
            rawText: text
          };
        }
      }

      node = node.parentElement;
    }
  }

  const labels = gamesFindLeafElementsByText(
    document,
    /\b(?:metacritic|metascore)\b/i
  );

  for (const label of labels) {
    let node = label;

    for (let depth = 0; node && depth < 6; depth += 1) {
      const text = gamesCleanText(node.textContent);

      if (text && text.length <= 500) {
        const score = gamesExtractScoreFromText(text);

        if (score !== null) {
          const sourceLink = node.querySelector(
            'a[href*="metacritic.com"]'
          );

          return {
            score,
            sourceURL: gamesAbsoluteUrl(
              sourceLink?.getAttribute('href'),
              gamePageUrl
            ),
            gameSpotUrl: gamePageUrl,
            rawText: text
          };
        }
      }

      node = node.parentElement;
    }
  }

  return null;
}

function gamesExtractGameSpotSlug(gamePageUrl) {
  try {
    const path = new URL(gamePageUrl).pathname;
    const match = path.match(/^\/games\/([^/?#]+)\/?/i);
    return match ? match[1] : null;
  } catch (_) {
    return null;
  }
}

async function getGamesSiteLinks(gameSpotSlug, settings, gameName) {
  if (!gameSpotSlug) return {};

  const propertyMap = {};

  if (settings.gamesShowPlayStationLink) {
    propertyMap.psStoreIdNa = 'P5944';
    propertyMap.psStoreIdEu = 'P5971';
  }
  if (settings.gamesShowXboxLink) propertyMap.msStoreId = 'P5885';
  if (settings.gamesShowMetacriticLink) propertyMap.metacriticId = 'P1712';
  if (settings.gamesShowOfficialWebsiteLink) propertyMap.officialWebsite = 'P856';

  const includeWikipedia = !!settings.gamesShowWikipediaLink;

  if (!Object.keys(propertyMap).length && !includeWikipedia) {
    return {};
  }

  try {
    const links = (Object.keys(propertyMap).length || includeWikipedia)
      ? await getGamesWikidataLinks(gameSpotSlug, propertyMap, includeWikipedia)
      : {};

    const psStoreId = links.psStoreIdNa || links.psStoreIdEu || null;
    const psStoreIsEu = !links.psStoreIdNa && !!links.psStoreIdEu;

    return {
      playstationUrl: psStoreId
        ? `https://store.playstation.com/${psStoreIsEu ? 'en-gb' : 'en-us'}/product/${psStoreId}`
        : null,
      xboxUrl: links.msStoreId
        ? `https://www.xbox.com/en-us/games/store/x/${links.msStoreId}`
        : null,

      metacriticUrl: links.metacriticId
        ? `https://www.metacritic.com/${links.metacriticId}`
        : null,
      officialWebsite: links.officialWebsite || null,
      wikipediaUrl: links.wikipediaArticle || null
    };
  } catch (e) {
    gamesLogError(
      'getGamesSiteLinks: threw error for',
      gameSpotSlug,
      '->',
      e && e.message ? e.message : e
    );
    return {};
  }
}

function gamesExtractSteamRating(text) {
  const cleaned = gamesCleanText(text);
  if (!cleaned) return null;

  const pctMatch = cleaned.match(/(\d{1,3})\s*%\s*of\s+the\s+([\d,]+)\s+user\s+reviews/i);
  if (pctMatch) {
    const pct = Number(pctMatch[1]);
    const reviews = Number(pctMatch[2].replace(/,/g, ''));
    if (Number.isFinite(pct) && pct > 0 && pct <= 100 && Number.isFinite(reviews) && reviews > 0) {
      return { percent: pct, reviews };
    }
  }

  const summaryMatch = cleaned.match(/(overwhelmingly\s+positive|very\s+positive|mostly\s+positive|mixed|mostly\s+negative|negative|very\s+negative|overwhelmingly\s+negative)\s*\(?([\d,]+)?\)?/i);
  if (summaryMatch) {
    const reviews = summaryMatch[2] ? Number(summaryMatch[2].replace(/,/g, '')) : 0;
    const label = summaryMatch[1].toLowerCase();
    return { percent: null, reviews, label };
  }

  return null;
}

async function gamesGetSteamRating(appId, steamUrl) {

  if (!appId) return null;

  try {
    const data = await fetchJson(
      `https://store.steampowered.com/appreviews/${appId}?json=1&language=all&purchase_type=all&num_per_page=0`,
      { Accept: 'application/json' },
      12000
    );

    const summary = data && data.query_summary;
    if (!summary) return null;

    const totalPositive = Number(summary.total_positive);
    const totalReviews = Number(summary.total_reviews);
    const label = gamesCleanText(summary.review_score_desc).toLowerCase();

    if (
      Number.isFinite(totalPositive) &&
      Number.isFinite(totalReviews) &&
      totalReviews > 0
    ) {
      return {
        percent: Math.round((totalPositive / totalReviews) * 100),
        reviews: totalReviews,
        label
      };
    }

    if (label) return { percent: null, reviews: totalReviews || 0, label };

    return null;
  } catch (error) {
    gamesLogError(
      'gamesGetSteamRating: appreviews API failed for',
      steamUrl,
      '->',
      error && error.message ? error.message : error
    );

    return gamesGetSteamRatingFromStorePage(steamUrl);
  }
}

async function gamesGetSteamRatingFromStorePage(steamUrl) {
  if (!steamUrl) return null;

  try {
    const document = await gamesFetchHtmlDocument(steamUrl, 15000);
    const candidates = [];

    const summaryEl = document.querySelector('.game_review_summary');
    if (summaryEl) candidates.push(gamesCleanText(summaryEl.textContent));

    const reviewDesc = document.querySelector('.nonresponsive_hidden.responsive_review_desc, span[class*="review_desc"]');
    if (reviewDesc) candidates.push(gamesCleanText(reviewDesc.textContent));

    const metaDesc = document.querySelector('meta[property="og:description"]');
    if (metaDesc) candidates.push(gamesCleanText(metaDesc.getAttribute('content')));

    for (const candidate of candidates) {
      const rating = gamesExtractSteamRating(candidate);
      if (rating) return rating;
    }

    const reviewsArea = document.querySelector('.user_reviews');
    if (reviewsArea) {
      const rating = gamesExtractSteamRating(gamesCleanText(reviewsArea.textContent));
      if (rating) return rating;
    }

    return null;
  } catch (error) {
    gamesLogError(
      'gamesGetSteamRatingFromStorePage: failed for',
      steamUrl,
      '->',
      error && error.message ? error.message : error
    );
    return null;
  }
}

async function searchSteamAppId(gameName, regionCode) {
  if (!gameName) return null;

  const region = resolveStoreRegion(STEAM_REGIONS, regionCode);

  try {
    const data = await fetchJson(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(gameName)}&l=english&cc=${region.toLowerCase()}`,
      { Accept: 'application/json' },
      12000
    );

    const items = Array.isArray(data?.items) ? data.items : [];
    if (!items.length) return null;

    let best = null;
    let bestScore = 0;

    const scored = items.map((item) => ({ item, score: calculateTitleScore(item?.name, gameName) }));
    gamesLog('searchSteamAppId: candidates for', gameName, '->', scored.map((s) => `${s.item?.name} (id ${s.item?.id}, score ${s.score})`));

    for (const { item, score } of scored) {

      if (score > bestScore || (score === bestScore && best && String(item?.name || '').length < String(best?.name || '').length)) {
        bestScore = score;
        best = item;
      }
    }

    if (!best || bestScore < 600 || !best.id) return null;

    gamesLog('searchSteamAppId: picked', best.name, '(id', best.id, ', score', bestScore, ') for', gameName);
    return String(best.id);
  } catch (error) {
    gamesLogError(
      'searchSteamAppId: failed for',
      gameName,
      '->',
      error && error.message ? error.message : error
    );
    return null;
  }
}

function gamesParseSteamRequirementsHtml(html) {
  if (!html || typeof html !== 'string') return null;

  const rows = [];
  const liMatches = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];

  for (const li of liMatches) {
    const text = gamesCleanText(
      li
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
    );

    if (!text) continue;

    const separatorIndex = text.indexOf(':');

    if (separatorIndex > 0 && separatorIndex < text.length - 1) {
      rows.push({
        label: gamesCleanText(text.slice(0, separatorIndex)),
        value: gamesCleanText(text.slice(separatorIndex + 1))
      });
    } else {
      rows.push({ label: null, value: text });
    }
  }

  return rows.length ? rows : null;
}

function gamesSteamAppDetailsEntry(data, appId) {
  if (!data || typeof data !== 'object') return null;
  const key = String(appId);
  if (data[key] && data[key].success && data[key].data) return data[key];
  for (const k of Object.keys(data)) {
    const e = data[k];
    if (e && e.success && e.data) return e;
  }
  return data[key] || null;
}

async function gamesGetSteamPriceAndRequirements(appId, { wantsPrice, wantsRequirements, wantsTags, regionCode }) {
  if (!appId || (!wantsPrice && !wantsRequirements && !wantsTags)) {
    return { price: null, requirements: null, tags: null, metacriticScore: null };
  }

  const region = resolveStoreRegion(STEAM_REGIONS, regionCode);

  try {
    const data = await fetchJson(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${region.toLowerCase()}&l=en`,
      { Accept: 'application/json' },
      12000
    );

    const entry = gamesSteamAppDetailsEntry(data, appId);
    if (!entry || !entry.success || !entry.data) {
      return { price: null, requirements: null, tags: null, metacriticScore: null };
    }

    let price = null;

    if (wantsPrice) {
      if (entry.data.is_free) {
        price = { isFree: true, final: 'Free', initial: null, discountPercent: 0 };
      } else {
        const priceOverview = entry.data.price_overview;

        if (priceOverview) {
          price = {
            isFree: false,
            final: gamesCleanText(priceOverview.final_formatted) || null,
            initial: gamesCleanText(priceOverview.initial_formatted) || null,
            discountPercent: Number(priceOverview.discount_percent) || 0
          };
        }
      }
    }

    let requirements = null;

    if (wantsRequirements) {

      const isUsableRequirementsSource = (source) =>
        source &&
        typeof source === 'object' &&
        !Array.isArray(source) &&
        (source.minimum || source.recommended);

      const source =
        [
          entry.data.pc_requirements,
          entry.data.mac_requirements,
          entry.data.linux_requirements
        ].find(isUsableRequirementsSource) || null;

      const minimum = gamesParseSteamRequirementsHtml(source?.minimum);
      const recommended = gamesParseSteamRequirementsHtml(source?.recommended);

      if (minimum || recommended) {
        requirements = { minimum, recommended };
      }
    }

    let tags = null;
    if (wantsTags && Array.isArray(entry.data.categories)) {
      tags = entry.data.categories
        .map((c) => (c && c.description ? gamesCleanText(c.description) : ''))
        .filter(Boolean);
      if (!tags.length) tags = null;
    }

    let metacriticScore = null;
    if (entry.data.metacritic && entry.data.metacritic.score != null) {
      const n = Number(entry.data.metacritic.score);
      if (Number.isFinite(n) && n >= 0 && n <= 100) metacriticScore = n;
    }

    return { price, requirements, tags, metacriticScore };
  } catch (error) {
    gamesLogError(
      'gamesGetSteamPriceAndRequirements: failed for appId',
      appId,
      '->',
      error && error.message ? error.message : error
    );
    return { price: null, requirements: null, tags: null, metacriticScore: null };
  }
}

function gamesValidateGameSpotGameUrl(id) {
  const value = gamesCleanText(String(id || ''));
  if (!value) return null;

  let url;

  try {
    url = new URL(value, GAMESPOT_ORIGIN);
  } catch (_) {
    return null;
  }

  if (
    url.hostname !== 'www.gamespot.com' &&
    url.hostname !== 'gamespot.com'
  ) {
    return null;
  }

  if (!gamesIsGamePagePath(url.pathname)) {
    return null;
  }

  url.protocol = 'https:';
  url.hostname = 'www.gamespot.com';
  url.search = '';
  url.hash = '';

  if (!url.pathname.endsWith('/')) {
    url.pathname += '/';
  }

  return url.href;
}

function gamesExtractPlatforms(document, structuredGame) {
  const structured = [
    ...gamesToList(structuredGame?.gamePlatform),
    ...gamesToList(structuredGame?.operatingSystem)
  ];

  if (structured.length) return gamesUniqueStrings(structured);

  const linked = gamesExtractLabeledLinks(document, [
    'Platforms',
    'Platform'
  ]);

  if (linked.length) return linked;

  const value = gamesExtractLabeledValue(document, [
    'Platforms',
    'Platform'
  ]);

  return gamesToList(value);
}

function gamesExtractGenres(document, structuredGame) {
  const structured = gamesToList(structuredGame?.genre);
  if (structured.length) return structured;

  const linked = gamesExtractLabeledLinks(document, [
    'Genres',
    'Genre'
  ]);

  if (linked.length) return linked;

  return gamesToList(
    gamesExtractLabeledValue(document, ['Genres', 'Genre'])
  );
}

function gamesExtractDevelopers(document, structuredGame) {
  const structured = gamesUniqueStrings([
    ...gamesToList(structuredGame?.developer),
    ...gamesToList(structuredGame?.author),
    ...gamesToList(structuredGame?.creator)
  ]);

  if (structured.length) return structured;

  const linked = gamesExtractLabeledLinks(document, [
    'Developers',
    'Developer',
    'Developed By',
    'Developed by'
  ]);

  if (linked.length) return linked;

  return gamesToList(
    gamesExtractLabeledValue(document, [
      'Developers',
      'Developer',
      'Developed By',
      'Developed by'
    ])
  );
}

function gamesExtractPublishers(document, structuredGame) {
  const structured = gamesUniqueStrings([
    ...gamesToList(structuredGame?.publisher),
    ...gamesToList(structuredGame?.provider)
  ]);

  if (structured.length) return structured;

  const linked = gamesExtractLabeledLinks(document, [
    'Publishers',
    'Publisher',
    'Published By',
    'Published by'
  ]);

  if (linked.length) return linked;

  return gamesToList(
    gamesExtractLabeledValue(document, [
      'Publishers',
      'Publisher',
      'Published By',
      'Published by'
    ])
  );
}

async function getGameSpotInfo(id) {
  const gamePageUrl = gamesValidateGameSpotGameUrl(id);
  if (!gamePageUrl) return null;

  try {

    const settings = await getGamesSettings();
    const gameSpotSlug = gamesExtractGameSpotSlug(gamePageUrl);
    const [document, siteLinks] = await Promise.all([
      gamesFetchHtmlDocument(gamePageUrl, 15000),
      getGamesSiteLinks(gameSpotSlug, settings, null)
    ]);
    const structuredGame = gamesFindGameJsonLd(document);

    const canonicalUrl =
      gamesAbsoluteUrl(
        document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        gamePageUrl
      ) || gamePageUrl;

    const name =
      gamesCleanText(structuredGame?.name) ||
      gamesCleanText(document.querySelector('h1')?.textContent) ||
      gamesCleanText(
        document.querySelector('meta[property="og:title"]')
          ?.getAttribute('content')
      ) ||
      gamesCleanText(document.title).replace(/\s*-\s*GameSpot.*$/i, '');

    const description =
      gamesCleanText(structuredGame?.description) ||
      gamesCleanText(
        document.querySelector('meta[property="og:description"]')
          ?.getAttribute('content')
      ) ||
      gamesCleanText(
        document.querySelector('meta[name="description"]')
          ?.getAttribute('content')
      );

    const structuredImage = gamesNormalizeImageValue(
      structuredGame?.image
    );

    const image =
      gamesAbsoluteUrl(structuredImage, canonicalUrl) ||
      gamesAbsoluteUrl(
        document.querySelector('meta[property="og:image"]')
          ?.getAttribute('content'),
        canonicalUrl
      ) ||
      gamesAbsoluteUrl(
        document.querySelector('meta[name="twitter:image"]')
          ?.getAttribute('content'),
        canonicalUrl
      );

    const releaseDate = gamesNormalizeDate(
      structuredGame?.datePublished ||
      gamesExtractLabeledValue(document, [
        'First Released',
        'First released',
        'Release Date',
        'Release date',
        'Released'
      ])
    );

    const platformsList = gamesExtractPlatforms(
      document,
      structuredGame
    );

    const genresList = gamesExtractGenres(document, structuredGame);
    const developersList = gamesExtractDevelopers(
      document,
      structuredGame
    );
    const publishersList = gamesExtractPublishers(
      document,
      structuredGame
    );

    const metacritic = gamesExtractMetacritic(
      document,
      canonicalUrl
    );

    if (metacritic && !metacritic.sourceURL && siteLinks.metacriticUrl) {
      metacritic.sourceURL = siteLinks.metacriticUrl;
    }

    return {
      name,
      description,
      synopsis: description,
      image,
      releaseDate,

      developers: gamesJoinList(developersList),
      publishers: gamesJoinList(publishersList),
      platforms: gamesJoinList(platformsList),
      platformsList,
      genres: gamesJoinList(genresList),

      metacritic,

      gameSpotUrl: canonicalUrl,
      metacriticUrl: siteLinks.metacriticUrl || metacritic?.sourceURL || null,

      playstationUrl: siteLinks.playstationUrl,
      xboxUrl: siteLinks.xboxUrl,

      officialWebsite: siteLinks.officialWebsite,
      wikipediaUrl: siteLinks.wikipediaUrl
    };
  } catch (error) {
    gamesLogError(
      'getGameSpotInfo: failed for',
      gamePageUrl,
      '->',
      error && error.message ? error.message : error
    );

    return null;
  }
}

const GAMES_ROMAN_NUMERALS = {
  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
  6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
  11: 'XI', 12: 'XII', 13: 'XIII', 14: 'XIV', 15: 'XV',
  16: 'XVI', 17: 'XVII', 18: 'XVIII', 19: 'XIX', 20: 'XX'
};

function gamesQueryWithRomanNumerals(query) {
  return query.replace(/\b(\d{1,2})\b/g, (match, digits) => {
    const roman = GAMES_ROMAN_NUMERALS[Number(digits)];
    return roman || match;
  });
}

function gamesQueryWithoutStrayPunctuation(query) {
  return gamesCleanText(query.replace(/[:;,."'!?]/g, ' '));
}

async function handleGamesSearch(query) {

  try {
    const cleanQuery = gamesCleanText(String(query || ''));
    let candidates = await searchGames(cleanQuery, 5);

    if (!candidates.length) {
      const romanQuery = gamesQueryWithRomanNumerals(cleanQuery);
      if (romanQuery !== cleanQuery) {
        candidates = await searchGames(romanQuery, 5).catch(() => []);
      }
    }

    if (!candidates.length) {
      const strippedQuery = gamesQueryWithoutStrayPunctuation(cleanQuery);
      if (strippedQuery && strippedQuery !== cleanQuery) {
        candidates = await searchGames(strippedQuery, 5).catch(() => []);
      }
    }

    if (!candidates.length) {
      const combinedQuery = gamesQueryWithoutStrayPunctuation(gamesQueryWithRomanNumerals(cleanQuery));
      if (combinedQuery && combinedQuery !== cleanQuery) {
        candidates = await searchGames(combinedQuery, 5).catch(() => []);
      }
    }

    return {
      ok: true,
      candidates
    };
  } catch (error) {

    gamesLogError(
      'handleGamesSearch: search failed for',
      query,
      '->',
      error && error.message ? error.message : error
    );

    return {
      ok: false,
      reason: 'network',
      error: String(error && error.message ? error.message : error)
    };
  }
}

async function handleGamesGetDetails(id) {
  const info = await getGameSpotInfo(id);

  if (!info) {
    return {
      ok: false,
      error: 'Game not found'
    };
  }

  return {
    ok: true,
    data: info
  };
}

