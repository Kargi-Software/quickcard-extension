

const api = typeof browser !== 'undefined' ? browser : chrome;

const LOG_PREFIX = '[QuickCard][page]';

const DEBUG_LOGS = false;
function log() {}
function logError() {}

const QuickCardPacks = {};
let activePack = null;

function registerPack(pack) {
  QuickCardPacks[pack.id] = pack;
}

const QUICKCARD_ABBREVIATION_PATTERN = /^[A-Z]{2,4}$/;

async function quickcardResolveAbbreviation(query) {
  try {
    const result = await api.runtime.sendMessage({ type: 'QUICKCARD_RESOLVE_ABBREVIATION', query });
    if (result && result.ok) return result;
  } catch (e) {
    logError('quickcardResolveAbbreviation: sendMessage failed for', query, e && e.message ? e.message : e);
  }
  return { type: 'none' };
}

function quickcardShowAbbreviationPicker(themeClass, options, onPick, query) {
  const items = options.map((title) => ({ title, isDirect: false }));
  if (query) items.push({ title: query, isDirect: true });

  showDisambiguationPicker(
    items,
    (item) => item.isDirect
      ? { name: `Search "${item.title}" directly`, subParts: ['Not one of the Wikipedia matches above'] }
      : { name: item.title },
    (item) => onPick(item.title),
    `<div class="pick-heading" style="margin-bottom:2px;">Did you mean one of these?</div>`
  );
}

function packFullWidth(packId) {
  const pack = QuickCardPacks[packId];
  if (pack && Number.isFinite(pack.fullWidth)) return pack.fullWidth;
  return 468;
}

function packNoDrag(packId) {
  const pack = QuickCardPacks[packId];
  return !!(pack && pack.noDrag);
}

function themeClassToPackId(themeClass) {
  const m = typeof themeClass === 'string' ? themeClass.match(/qc-theme-(\S+)/) : null;
  return m ? m[1] : null;
}

function popupChromeClasses(themeClass) {
  return packNoDrag(themeClassToPackId(themeClass)) ? ' qc-drag-free' : '';
}

function setActivePack(id) {
  activePack = QuickCardPacks[id] || null;

  if (typeof window.onActivePackChanged === 'function') window.onActivePackChanged(id);
}

const CORE_DEFAULT_SETTINGS = {
  featureLinkHover: true,
  featureTextSearch: true,
  featureContextMenuSearch: true,
  selectionSearchDelayMs: 1000,

  popupStyle: 'full',

  enabledTopics: { movies: true, games: true, music: true, books: true, football: true, sports: true },

  globalSiteFilterMode: 'blacklist',
  globalWhitelistSites: [],
  globalBlacklistSites: [],

  globalSiteRuleScope: 'both'
};

let coreSettings = { ...CORE_DEFAULT_SETTINGS };

async function loadCoreSettings() {
  const stored = await api.storage.local.get(CORE_DEFAULT_SETTINGS);

  coreSettings = {
    featureLinkHover: !!stored.featureLinkHover,
    featureTextSearch: !!stored.featureTextSearch,
    featureContextMenuSearch: !!stored.featureContextMenuSearch,
    selectionSearchDelayMs: Number.isFinite(stored.selectionSearchDelayMs)
      ? Math.max(0, stored.selectionSearchDelayMs)
      : 1000,
    popupStyle: stored.popupStyle === 'full' ? 'full' : 'mini',
    enabledTopics: (stored.enabledTopics && typeof stored.enabledTopics === 'object')
      ? stored.enabledTopics
      : CORE_DEFAULT_SETTINGS.enabledTopics,

    globalSiteFilterMode: stored.globalSiteFilterMode || 'blacklist',
    globalWhitelistSites: Array.isArray(stored.globalWhitelistSites) ? stored.globalWhitelistSites : [],
    globalBlacklistSites: Array.isArray(stored.globalBlacklistSites) ? stored.globalBlacklistSites : [],
    globalSiteRuleScope: ['hover', 'popup', 'both'].includes(stored.globalSiteRuleScope) ? stored.globalSiteRuleScope : 'both'
  };

  return coreSettings;
}

const ALL_TOPIC_PACKS = [

  { id: 'movies', label: 'Movies & TV', icon: 'icons/sites/movies.svg', placeholder: 'Search movies & TV...' },
  { id: 'games', label: 'Games', icon: 'icons/sites/games.svg', placeholder: 'Search games...' },
  { id: 'music', label: 'Music', icon: 'icons/sites/music.svg', placeholder: 'Search music...' },
  { id: 'books', label: 'Books', icon: 'icons/sites/books.svg', placeholder: 'Search books...' },
  { id: 'football', label: 'Football', icon: 'icons/sites/football.svg', placeholder: 'Search football...' },

  { id: 'sports', label: 'Athletes', icon: 'icons/sites/sports.svg', placeholder: 'Search athletes...' }
];

function getEnabledTopicPacks() {
  const enabled = coreSettings.enabledTopics || CORE_DEFAULT_SETTINGS.enabledTopics;
  return ALL_TOPIC_PACKS.filter((pack) => enabled[pack.id]);
}

function getPopupStyleClass() {
  if (isRunningAsExtensionPage()) return 'qc-style-full';
  if (qcFullOverride) return 'qc-style-full';
  return coreSettings.popupStyle === 'full' ? 'qc-style-full' : 'qc-style-mini';
}

function popupWidthFor(styleClass, isPersonType, packId) {
  if (styleClass === 'qc-style-full') {
    if (packId) return packFullWidth(packId);

    return 528;
  }
  return isPersonType ? 270 : 300;
}

function normalizeHost(host) {
  return String(host || '').toLowerCase().trim();
}

function hostMatchesRule(hostname, rule) {
  const host = normalizeHost(hostname);
  const item = normalizeHost(rule).replace(/^\*\./, '');
  if (!item) return false;
  return host === item || host.endsWith(`.${item}`);
}

function siteAllowedByRules(rules) {
  const host = normalizeHost(window.location.hostname);
  const mode = (rules && rules.siteFilterMode) || 'blacklist';

  if (mode === 'whitelist') {
    return ((rules && rules.whitelistSites) || []).some((item) => hostMatchesRule(host, item));
  }

  if (mode === 'blacklist') {
    return !((rules && rules.blacklistSites) || []).some((item) => hostMatchesRule(host, item));
  }

  return true;
}

function isAllowedByGlobalSiteRules(topicId, featureName) {
  const scope = coreSettings.globalSiteRuleScope || 'both';
  if (scope !== 'both' && scope !== featureName) return true;

  return siteAllowedByRules({
    siteFilterMode: coreSettings.globalSiteFilterMode,
    whitelistSites: coreSettings.globalWhitelistSites,
    blacklistSites: coreSettings.globalBlacklistSites
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function sanitizeSelectionText(raw) {
  if (!raw) return '';

  let text = String(raw);

  text = text.replace(/<[^>]*>/g, ' ');

  text = text.replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, '');

  text = text.replace(/\s+/g, ' ');

  text = text.replace(/[\u2018\u2019\u201A\u201B\u2032\u02BC\u02BB]/g, "'");
  text = text.replace(/[\u201C\u201D\u201E\u2033]/g, '"');

  return text.trim();
}

function formatExtraInfoStatus(source, extraRes) {
  if (!extraRes) {
    return { hasError: true, message: `No response from ${source}` };
  }

  if (extraRes.timedOut) {
    return { hasError: true, message: `No response from ${source} (timed out)` };
  }

  if (extraRes.missingApiKey) {
    return { hasError: false, message: `${source} needs an API key`, missingApiKey: true };
  }

  if (extraRes.disabled) {
    return { hasError: false, message: `${source} info is disabled in settings` };
  }

  if (extraRes.noData) {
    return { hasError: false, message: `No ${source} data for this title` };
  }

  if (extraRes.ok === false) {
    return { hasError: true, message: `${source} error: ${extraRes.error || 'unknown error'}` };
  }

  return null;
}

const imageCache = new Map();

const imageInflight = new Map();

function preloadImage(src, callback) {
  if (!src) { callback(src); return; }
  const img = new Image();
  img.src = src;
  const done = () => callback(src);

  if (typeof img.decode === 'function') {
    img.decode().then(done).catch(done);
  } else {
    img.onload = done;
    img.onerror = done;
  }
}

function resolveImageUrl(url, callback) {
  if (!url) {
    callback(null);
    return;
  }

  if (url.startsWith('data:')) {
    callback(url);
    return;
  }

  if (imageCache.has(url)) {
    callback(imageCache.get(url));
    return;
  }

  let pending = imageInflight.get(url);
  if (!pending) {
    pending = api.runtime.sendMessage({ type: 'QUICKCARD_FETCH_IMAGE', url }).then((res) => {
      const resolved = (res && res.ok && res.dataUrl) ? res.dataUrl : url;
      imageCache.set(url, resolved);
      return resolved;
    }).catch((e) => {
      logError('resolveImageUrl: sendMessage failed for', url, '->', e && e.message ? e.message : e);
      imageCache.set(url, url);
      return url;
    }).finally(() => {
      imageInflight.delete(url);
    });
    imageInflight.set(url, pending);
  }

  pending.then((resolved) => {
    preloadImage(resolved, callback);
  });
}

const SITE_ICONS = {
  IMDb: 'icons/sites/imdb.svg',
  TVmaze: 'icons/sites/tvmaze.svg',
  'Rotten Tomatoes': 'icons/sites/rottentomatoes.svg',
  TMDb: 'icons/sites/tmdb.svg',
  Netflix: 'icons/sites/netflix.svg',
  Plex: 'icons/sites/plex.svg',
  Letterboxd: 'icons/sites/letterboxd.svg',
  Metacritic: 'icons/sites/metacritic.svg',
  'Box Office Mojo': 'icons/sites/boxofficemojo.svg',
  'Disney+': 'icons/sites/disneyplus.svg',
  Max: 'icons/sites/max.svg',
  'Prime Video': 'icons/sites/primevideo.svg',
  'Apple TV': 'icons/sites/appletv.svg',
  MyAnimeList: 'icons/sites/myanimelist.svg',
  AniList: 'icons/sites/anilist.svg',
  Crunchyroll: 'icons/sites/crunchyroll.svg',
  Peacock: 'icons/sites/peacock.svg',
  Hulu: 'icons/sites/hulu.svg',
  Trakt: 'icons/sites/trakt.svg',
  YouTube: 'icons/sites/youtube.svg',

  Trailer: 'icons/sites/youtube.svg',
  Awards: 'icons/sites/awards.svg',
  Wikipedia: 'icons/sites/wikipedia.svg',
  Twitter: 'icons/sites/twitter.svg',
  Instagram: 'icons/sites/instagram.svg',
  Website: 'icons/sites/website.svg',
  Steam: 'icons/sites/steam.svg',

  SoFIFA: 'icons/sites/sofifa.svg',
  Futbin: 'icons/sites/futbin.svg',

  Transfermarkt: 'icons/sites/transfermarkt.svg',

  WhoScored: 'icons/sites/whoscored.svg',

  Soccerway: 'icons/sites/soccerway.svg',

  'Open Library': 'icons/sites/openlibrary.svg',
  Goodreads: 'icons/sites/goodreads.svg',
  'Google Books': 'icons/sites/googlebooks.svg',

  Amazon: 'icons/sites/amazon.svg',
  'Barnes & Noble': 'icons/sites/barnesandnoble.svg',
  'Kobo (ebook)': 'icons/sites/kobo.svg',
  'Audible (audiobook)': 'icons/sites/audible.svg',

  Deezer: 'icons/sites/deezer.svg',
  Spotify: 'icons/sites/spotify.svg',
  'YouTube Music': 'icons/sites/youtube-music.svg',
  'Apple Music': 'icons/sites/itunes.svg',
  MusicBrainz: 'icons/sites/musicbrainz.svg',
  'Last.fm': 'icons/sites/lastfm.svg',
  TheAudioDB: 'icons/sites/theaudiodb.svg',

  'PlayStation Store': 'icons/sites/playstation.svg',
  'Xbox Store': 'icons/sites/xbox.svg',
  GOG: 'icons/sites/gog.svg',
  'Epic Games Store': 'icons/sites/epic-games.svg',
  GameSpot: 'icons/sites/gamespot.svg',
  'Official Website': 'icons/sites/official-website.svg',
  'Nintendo eShop': 'icons/sites/nintendo.svg',

  ESPN: 'icons/sites/espn.svg',

  'Olympics.com': 'icons/sites/olympics.svg',
  SofaScore: 'icons/sites/sofascore.svg',
  Flashscore: 'icons/sites/flashscore.svg',
  'Baseball Reference': 'icons/sites/sports-reference.svg',
  'Basketball Reference': 'icons/sites/sports-reference.svg',
  'Pro Football Reference': 'icons/sites/sports-reference.svg',
  'Hockey Reference': 'icons/sites/sports-reference.svg',
  'ATP Tour': 'icons/sites/atptour.svg',
  'Formula 1': 'icons/sites/formula1.svg',
  'PGA Tour': 'icons/sites/pgatour.svg',
  MotoGP: 'icons/sites/motogp.svg',
  WRC: 'icons/sites/wrc.svg',
  ESPNcricinfo: 'icons/sites/espncricinfo.svg',
  BoxRec: 'icons/sites/boxrec.svg',
  Sherdog: 'icons/sites/sherdog.svg',
  UFC: 'icons/sites/ufc.svg'
};

function buildInlineIconLink(label, url) {
  if (!url) return '';

  return ` <button class="qc-link qc-link-inline-arrow" data-link="${escapeHtml(url)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">↗</button>`;
}

function resolveLinkIconSrc(iconUrl) {
  if (!iconUrl) return null;
  if (iconUrl.startsWith('data:') || iconUrl.startsWith('chrome-extension:') || iconUrl.startsWith('moz-extension:')) {
    return iconUrl;
  }
  if (imageCache.has(iconUrl)) {
    const cached = imageCache.get(iconUrl);

    if (cached && (cached.startsWith('data:') || cached.startsWith('chrome-extension:') || cached.startsWith('moz-extension:'))) {
      return cached;
    }
  }
  return null;
}

function hydrateCustomLinkIcons(root) {
  if (!root || !root.querySelectorAll) return;
  const imgs = root.querySelectorAll('img[data-qc-icon-src]');
  imgs.forEach((img) => {
    const src = img.getAttribute('data-qc-icon-src');
    if (!src) return;
    const label = img.getAttribute('alt') || img.closest('button')?.getAttribute('aria-label') || 'Link';

    resolveImageUrl(src, (resolved) => {
      if (!img.isConnected) return;
      if (resolved && String(resolved).startsWith('data:')) {
        img.src = resolved;
        img.removeAttribute('data-qc-icon-src');
        return;
      }

      const btn = img.closest('button.qc-link');
      if (btn) {
        btn.classList.remove('qc-link-icon');
        btn.textContent = label;
        btn.removeAttribute('aria-label');
      } else {
        img.removeAttribute('data-qc-icon-src');
        img.remove();
      }
    });
  });
}

function preloadCustomLinkIcons(customLinks) {
  if (!Array.isArray(customLinks)) return;
  customLinks.forEach((l) => {
    if (l && l.icon && /^https?:\/\//i.test(l.icon)) {
      resolveImageUrl(l.icon, () => {});
    }
  });
}

function buildExternalLinksHtml(links) {
  return links
    .filter((l) => l && l.url)
    .map((l) => {

      let iconUrl = l.icon
        || (SITE_ICONS[l.label] ? api.runtime.getURL(SITE_ICONS[l.label]) : null)
        || (l.label && l.label.startsWith('ESPN') && SITE_ICONS.ESPN ? api.runtime.getURL(SITE_ICONS.ESPN) : null);

      if (!iconUrl) {
        return `<button class="qc-link" data-link="${escapeHtml(l.url)}">${escapeHtml(l.label)}</button>`;
      }

      const isRemote = /^https?:\/\//i.test(iconUrl);
      const cached = isRemote ? resolveLinkIconSrc(iconUrl) : iconUrl;
      if (isRemote && !cached) {

        return `<button class="qc-link qc-link-icon" data-link="${escapeHtml(l.url)}" title="${escapeHtml(l.label)}" aria-label="${escapeHtml(l.label)}"><img data-qc-icon-src="${escapeHtml(iconUrl)}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="${escapeHtml(l.label)}" width="16" height="16"></button>`;
      }
      return `<button class="qc-link qc-link-icon" data-link="${escapeHtml(l.url)}" title="${escapeHtml(l.label)}" aria-label="${escapeHtml(l.label)}"><img src="${escapeHtml(cached || iconUrl)}" alt="${escapeHtml(l.label)}" width="16" height="16"></button>`;
    })
    .join('');
}

function buildIconBadgeGridHtml(links, options = {}) {
  const showLabel = options.showLabel !== false;
  const items = links
    .filter((l) => l && l.url)
    .map((l) => {
      let iconUrl = l.icon
        || (SITE_ICONS[l.label] ? api.runtime.getURL(SITE_ICONS[l.label]) : null)
        || (l.label && l.label.startsWith('ESPN') && SITE_ICONS.ESPN ? api.runtime.getURL(SITE_ICONS.ESPN) : null);
      let iconHtml;
      if (!iconUrl) {
        iconHtml = escapeHtml(l.label.slice(0, 2));
      } else {
        const isRemote = /^https?:\/\//i.test(iconUrl);
        const cached = isRemote ? resolveLinkIconSrc(iconUrl) : iconUrl;
        if (isRemote && !cached) {
          iconHtml = `<img data-qc-icon-src="${escapeHtml(iconUrl)}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="${escapeHtml(l.label)}" width="24" height="24">`;
        } else {
          iconHtml = `<img src="${escapeHtml(cached || iconUrl)}" alt="${escapeHtml(l.label)}" width="24" height="24">`;
        }
      }
      const labelHtml = showLabel ? `<span class="qc-icon-badge-label">${escapeHtml(l.label)}</span>` : '';

      return `<button class="qc-link qc-icon-badge-item" data-link="${escapeHtml(l.url)}" title="${escapeHtml(l.label)}" aria-label="${escapeHtml(l.label)}">
        <span class="qc-icon-badge">${iconHtml}</span>
        ${labelHtml}
      </button>`;
    })
    .join('');

  const gridClass = showLabel ? 'qc-icon-badge-grid' : 'qc-icon-badge-grid no-label';
  return items ? `<div class="${gridClass}">${items}</div>` : '';
}

let hoverPopupEl = null;
let selectionPopupEl = null;
let hoverTimer = null;
let hoverHideTimer = null;
let hoverRemoveTimer = null;
let searchDelayTimer = null;
let currentAnchor = null;

let hoverRequestToken = 0;

let hoverPopupPinned = false;
let hoverPopupPinAnchor = null;
let selectionButton = null;
let selectionShowTimer = null;
let lastRetryFn = null;
let uiRoot = null;

const REMOVE_ANIM_MS = 220;

const QUICKCARD_BOOT_ID = 'qc-boot-' + Math.floor(Math.random() * 0xffffffff).toString(16) + '-' + Date.now().toString(16);

function isRunningAsExtensionPage() {
  return location.protocol === 'chrome-extension:' || location.protocol === 'moz-extension:';
}

function ensureUiRoot() {
  if (uiRoot) return uiRoot;

  if (isRunningAsExtensionPage()) {
    uiRoot = {
      host: document.body,
      styleHost: document.head,
      getElementById: (id) => document.getElementById(id)
    };
    bindImageFallbackDelegate(document.body);
    return uiRoot;
  }

  document.querySelectorAll('#quickcard-shadow-host').forEach((stale) => {
    try { stale.remove(); } catch (e) {  }
  });

  const host = document.createElement('div');
  host.id = 'quickcard-shadow-host';
  host.style.all = 'initial';
  host.style.display = 'block';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  uiRoot = {
    host: shadow,
    styleHost: shadow,
    getElementById: (id) => shadow.getElementById(id)
  };

  bindImageFallbackDelegate(shadow);
  return uiRoot;
}

function bindImageFallbackDelegate(root) {
  root.addEventListener('error', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;

    if (img.classList.contains('qc-game-console-icon')) {
      const fallback = img.dataset.fallbackSrc;

      if (fallback && img.src !== fallback) img.src = fallback;
    } else if (img.classList.contains('qc-game-external-icon')) {
      img.style.display = 'none';
    }
  }, true);
}

function composedClosest(e, selector) {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : [e.target];
  for (const node of path) {
    if (node instanceof Element && node.matches && node.matches(selector)) return node;
  }
  return null;
}

function stopEvent(e) {
  e.preventDefault();
  e.stopPropagation();
}

function openLinkInNewTab(url) {
  if (!url) return;
  api.runtime.sendMessage({ type: 'QUICKCARD_OPEN_LINK', url }).catch(() => {

    window.open(url, '_blank', 'noopener');
  });
}

function bindPopupButtons(root) {
  suppressNativeImageDrag(root);
  stampSelectableClasses(root);
  hydrateCustomLinkIcons(root);

  const viewFullBtn = root.querySelector('.qc-view-full-btn');
  if (viewFullBtn) {
    viewFullBtn.addEventListener('mousedown', stopEvent);
    viewFullBtn.addEventListener('click', (e) => {
      stopEvent(e);
      if (!navRerenderFullFn) return;
      requestFullVersionOnce();
      navRerenderFullFn();
    });
  }

  const closeEl = root !== hoverPopupEl ? root.querySelector('.qc-popup-close') : null;
  if (closeEl) {
    closeEl.addEventListener('mousedown', stopEvent);
    closeEl.addEventListener('click', (e) => {
      stopEvent(e);
      closeSelectionPopup();
    });
  }

  const backEl = root.querySelector('.qc-back-btn');
  if (backEl) {
    backEl.addEventListener('mousedown', stopEvent);
    backEl.addEventListener('click', (e) => {
      stopEvent(e);
      navGoBack();
    });
  }

  root.querySelectorAll('.qc-link, .qc-settings-link, .qc-title-link').forEach((btn) => {
    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      const link = btn.getAttribute('data-link');
      openLinkInNewTab(link);
    });
  });

  root.querySelectorAll('.qc-credit-tab').forEach((btn) => {
    if (btn.dataset.qcWired === '1') return;
    btn.dataset.qcWired = '1';
    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      moviesHandleCreditTabClick(btn);
    });
  });
  root.querySelectorAll('.qc-credits-load-more').forEach((btn) => {
    if (btn.dataset.qcWired === '1') return;
    btn.dataset.qcWired = '1';
    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      moviesHandleCreditsLoadMoreClick(btn);
    });
  });

  root.querySelectorAll('.oly-timeline-more').forEach((btn) => {
    if (btn.dataset.qcWired === '1') return;
    btn.dataset.qcWired = '1';
    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      if (typeof sportsHandleTimelineMoreClick === 'function') {
        sportsHandleTimelineMoreClick(btn);
      }
    });
  });
  const settingsBtn = root.querySelector('.qc-open-settings');
  if (settingsBtn) {
    settingsBtn.addEventListener('mousedown', stopEvent);
    settingsBtn.addEventListener('click', (e) => {
      stopEvent(e);
      api.runtime.sendMessage({ type: 'QUICKCARD_OPEN_OPTIONS_PAGE' }).catch(() => {});
    });
  }
  const retryBtn = root.querySelector('.qc-retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('mousedown', stopEvent);
    retryBtn.addEventListener('click', (e) => {
      stopEvent(e);
      if (lastRetryFn) lastRetryFn();
    });
  }
  root.querySelectorAll('.qc-pick-btn').forEach((btn) => {
    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      const index = parseInt(btn.getAttribute('data-index'), 10);
      handleDisambiguationPick(index);
    });
  });

  const insideSelectionPopup = !!selectionPopupEl && (root === selectionPopupEl || selectionPopupEl.contains(root));
  root.querySelectorAll('.qc-searchable').forEach((el) => {
    el.addEventListener('mousedown', stopEvent);
    el.addEventListener('click', (e) => {
      stopEvent(e);
      const text = el.getAttribute('data-search-text');
      if (!text || !activePack || typeof activePack.launchSearch !== 'function') return;

      if (insideSelectionPopup) {
        navPushCurrentCard();
      }
      const rect = selectionPopupEl ? selectionPopupEl.getBoundingClientRect() : null;
      const left = rect ? rect.left : Math.round(window.innerWidth / 2 - 150);
      const top = rect ? rect.top : Math.round(window.innerHeight / 2 - 80);
      activePack.launchSearch(text, left, top);
    });
  });

  const runTranslateEditSearch = (input) => {
    const text = input && input.value ? input.value.trim() : '';
    if (!text || !activePack || typeof activePack.launchSearch !== 'function') return;
    if (insideSelectionPopup) navPushCurrentCard();
    const rect = selectionPopupEl ? selectionPopupEl.getBoundingClientRect() : null;
    const left = rect ? rect.left : Math.round(window.innerWidth / 2 - 150);
    const top = rect ? rect.top : Math.round(window.innerHeight / 2 - 80);
    activePack.launchSearch(text, left, top);
  };
  root.querySelectorAll('.qc-translate-edit-go').forEach((btn) => {
    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      const input = btn.previousElementSibling;
      runTranslateEditSearch(input);
    });
  });
  root.querySelectorAll('.qc-translate-edit-input').forEach((input) => {

    input.addEventListener('mousedown', (e) => e.stopPropagation());
    input.addEventListener('click', (e) => e.stopPropagation());
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.stopPropagation();
      e.preventDefault();
      runTranslateEditSearch(input);
    });
  });

  root.querySelectorAll('.qc-nav-link').forEach((el) => {
    el.addEventListener('mousedown', stopEvent);
    el.addEventListener('click', (e) => {
      stopEvent(e);
      const kind = el.getAttribute('data-nav-kind');
      const id = el.getAttribute('data-nav-id');
      const targetPackId = el.getAttribute('data-nav-pack') || (activePack && activePack.id);
      const targetPack = targetPackId && QuickCardPacks[targetPackId];
      if (!kind || !id || !targetPack || typeof targetPack.navigateById !== 'function') return;
      if (insideSelectionPopup) {
        navPushCurrentCard();
      }
      targetPack.navigateById(kind, id);
    });
  });

  root.querySelectorAll('.qc-collapsible-btn').forEach((btn) => {
    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      const targetId = btn.getAttribute('data-coll-target');
      const count = btn.getAttribute('data-coll-count');
      const target = targetId && root.querySelector(`#${targetId}`);
      if (!target) return;
      const hidden = target.style.display === 'none';
      target.style.display = hidden ? 'block' : 'none';
      btn.textContent = hidden ? 'Show less' : `Show ${count} more`;
    });
  });

  window.onPopupContentBoundHandlers.forEach((fn) => {
    try { fn(root); } catch (e) { logError('onPopupContentBound handler failed', e); }
  });
}
window.onPopupContentBoundHandlers = window.onPopupContentBoundHandlers || [];
function registerPopupContentBoundHandler(fn) {
  if (typeof fn === 'function') window.onPopupContentBoundHandlers.push(fn);
}

function suppressNativeImageDrag(root) {
  root.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('draggable')) img.setAttribute('draggable', 'false');
  });
}

const QC_CONTROL_ANCESTOR_SELECTOR = 'button, a, summary, .qc-searchable, .qc-nav-link, .qc-pick-btn, .closebar, .qc-hover-pinbar';
function qcElementHasDirectText(el) {
  for (const node of el.childNodes) {

    if (node.nodeType === 3 && node.textContent && node.textContent.trim()) return true;
  }
  return false;
}
function stampSelectableClasses(root) {
  const popupEl = root instanceof Element && root.matches('.qc-popup') ? root : null;
  if (!popupEl || !popupEl.classList.contains('qc-drag-free')) return;
  reStampSelectableClasses(popupEl);
}

function reStampSelectableClasses(popupEl) {
  if (!popupEl || !popupEl.classList.contains('qc-drag-free')) return;
  popupEl.querySelectorAll('*').forEach((el) => {
    if (!(el instanceof Element)) return;
    if (!qcElementHasDirectText(el)) return;

    if (el.closest(QC_CONTROL_ANCESTOR_SELECTOR)) return;
    el.classList.add('qc-selectable');
  });
}
function destroyHoverPopup() {
  clearTimeout(hoverHideTimer);
  clearTimeout(hoverRemoveTimer);
  if (hoverPopupEl && hoverPopupEl.parentNode) hoverPopupEl.parentNode.removeChild(hoverPopupEl);
  hoverPopupEl = null;

  hoverPopupPinned = false;
  hoverPopupPinAnchor = null;
}

function toggleHoverPopupPin() {
  hoverPopupPinned = !hoverPopupPinned;
  if (hoverPopupPinned) {
    hoverPopupPinAnchor = currentAnchor;
    clearTimeout(hoverHideTimer);
    clearTimeout(hoverRemoveTimer);
  } else {
    hoverPopupPinAnchor = null;
  }
  if (hoverPopupEl) {
    const bar = hoverPopupEl.querySelector('.qc-hover-pinbar');
    if (bar) bar.outerHTML = navBuildHoverPinBarHtml();
  }

  if (!hoverPopupPinned) scheduleHoverHide();
}

function closeHoverPopup() {
  clearTimeout(hoverHideTimer);
  clearTimeout(hoverRemoveTimer);
  if (hoverPopupEl) hoverPopupEl.classList.remove('show');
  setTimeout(destroyHoverPopup, REMOVE_ANIM_MS);
}

function navBuildHoverPinBarHtml(viewFullHtml = '') {
  const pinnedClass = hoverPopupPinned ? ' pinned' : '';
  const pinTitle = hoverPopupPinned ? 'Unpin' : 'Pin (keep this card open)';
  const closeHtml = hoverPopupPinned ? '<span class="qc-popup-close" title="Close">&times;</span>' : '';
  return `<div class="qc-hover-pinbar">${viewFullHtml}<span class="qc-hover-pin-btn${pinnedClass}" title="${escapeHtml(pinTitle)}">📌</span>${closeHtml}</div>`;
}

function destroySelectionPopup() {
  clearTimeout(searchDelayTimer);
  if (selectionPopupEl && selectionPopupEl.parentNode) selectionPopupEl.parentNode.removeChild(selectionPopupEl);
  selectionPopupEl = null;
}

function ensureHoverPopup(themeClass) {
  clearTimeout(hoverHideTimer);
  clearTimeout(hoverRemoveTimer);

  if (hoverPopupEl) return hoverPopupEl;

  hoverPopupEl = document.createElement('div');
  hoverPopupEl.className = `qc-popup ${themeClass}${popupChromeClasses(themeClass)} ${getPopupStyleClass()}`;
  hoverPopupEl.addEventListener('mouseenter', () => {
    clearTimeout(hoverHideTimer);
    clearTimeout(hoverRemoveTimer);
  });
  hoverPopupEl.addEventListener('mouseleave', scheduleHoverHide);

  hoverPopupEl.addEventListener('mousedown', (e) => {
    if (e.target.closest('.qc-hover-pin-btn, .qc-popup-close')) stopEvent(e);
  });
  hoverPopupEl.addEventListener('click', (e) => {
    if (e.target.closest('.qc-hover-pin-btn')) {
      stopEvent(e);
      toggleHoverPopupPin();
      return;
    }
    if (e.target.closest('.qc-popup-close')) {
      stopEvent(e);
      closeHoverPopup();
    }
  });
  ensureUiRoot().host.appendChild(hoverPopupEl);

  return hoverPopupEl;
}

function ensureSelectionPopup(themeClass) {
  if (selectionPopupEl) return selectionPopupEl;
  selectionPopupEl = document.createElement('div');
  selectionPopupEl.className = `qc-popup ${themeClass}${popupChromeClasses(themeClass)} ${getPopupStyleClass()}`;
  ensureUiRoot().host.appendChild(selectionPopupEl);
  return selectionPopupEl;
}

function clampPosition(left, top, width = 300) {
  if (left + width > window.innerWidth - 10) left = window.innerWidth - width - 10;
  if (left < 10) left = 10;

  const estimatedHeight = width >= 640 ? 360 : width > 400 ? 320 : 240;
  if (top + estimatedHeight > window.innerHeight) {
    top = Math.max(10, top - estimatedHeight - 16);
  }
  return { left, top };
}

function clampPopupElementIntoView(popupEl) {
  if (!popupEl) return;
  requestAnimationFrame(() => {
    if (!popupEl.isConnected) return;
    const rect = popupEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    let left = rect.left;
    let top = rect.top;
    let changed = false;
    if (rect.right > window.innerWidth - 10) { left = window.innerWidth - rect.width - 10; changed = true; }
    if (left < 10) { left = 10; changed = true; }
    if (rect.bottom > window.innerHeight - 10) { top = Math.max(10, window.innerHeight - rect.height - 10); changed = true; }
    if (top < 10) { top = 10; changed = true; }
    if (changed) {
      popupEl.style.left = `${Math.round(left)}px`;
      popupEl.style.top = `${Math.round(top)}px`;
    }
  });
}

function withPreservedDetailsState(container, applyFn) {
  if (!container) {
    applyFn();
    return;
  }
  const openMarks = [];
  container.querySelectorAll('details').forEach((el, i) => {
    if (el.open) openMarks.push({ index: i, className: el.className });
  });
  applyFn();
  if (!openMarks.length) return;
  const freshDetails = container.querySelectorAll('details');
  openMarks.forEach(({ index, className }) => {
    const candidate = freshDetails[index];

    if (candidate && candidate.className === className) candidate.open = true;
  });
}

function showPopup(themeClass, anchor, html, isPersonType) {

  if (hoverPopupPinned && anchor !== hoverPopupPinAnchor) return;
  const styleClass = getPopupStyleClass();

  const width = popupWidthFor(styleClass, isPersonType);
  const rect = anchor.getBoundingClientRect();
  const pos = clampPosition(rect.left, rect.bottom + 8, width);
  const popup = ensureHoverPopup(themeClass);

  popup.className = isPersonType
    ? `qc-popup ${themeClass}${popupChromeClasses(themeClass)} ${styleClass} person-type ${QUICKCARD_BOOT_ID}`
    : `qc-popup ${themeClass}${popupChromeClasses(themeClass)} ${styleClass} ${QUICKCARD_BOOT_ID}`;
  popup.style.left = `${pos.left}px`;
  popup.style.top = `${pos.top}px`;

  withPreservedDetailsState(popup, () => {
    popup.innerHTML = navBuildHoverPinBarHtml(navBuildMiniFullSwitchHtml(styleClass, qcIsLoadingOnlyHtml(html))) + html;
  });
  bindPopupButtons(popup);
  clampPopupElementIntoView(popup);
  requestAnimationFrame(() => popup.classList.add('show'));
}

function showSelectionPopupAt(themeClass, x, y, html, isPersonType) {

  navBeginRender();
  const styleClass = getPopupStyleClass();
  const packId = (activePack && activePack.id) || null;
  const width = popupWidthFor(styleClass, isPersonType, packId);
  destroySelectionPopup();

  destroyHoverPopup();
  const pos = clampPosition(x, y, width);

  if (styleClass === 'qc-style-full' && !isRunningAsExtensionPage()) {
    pos.top = 30;
  }
  const popup = ensureSelectionPopup(themeClass);
  popup.className = isPersonType
    ? `qc-popup ${themeClass}${popupChromeClasses(themeClass)} ${styleClass} person-type show ${QUICKCARD_BOOT_ID}`
    : `qc-popup ${themeClass}${popupChromeClasses(themeClass)} ${styleClass} show ${QUICKCARD_BOOT_ID}`;
  popup.style.left = `${pos.left}px`;
  popup.style.top = `${pos.top}px`;
  popup.innerHTML = navBuildClosebarHtml(navBuildMiniFullSwitchHtml(styleClass, qcIsLoadingOnlyHtml(html))) + `<div id="qc-card-root">${html}</div>`;

  popup.dataset.qcSessionToken = String(navRenderToken);
  navTrackRenderedCard(themeClass, html, isPersonType);
  bindPopupButtons(popup);
  clampPopupElementIntoView(popup);
}

function updateSelectionPopup(html, isPersonType, themeClass) {
  if (!selectionPopupEl || !selectionPopupEl.isConnected) {

    if (!themeClass) return;
    const left = Math.round(window.innerWidth / 2 - 150);
    const top = Math.round(window.innerHeight / 2 - 80);
    showSelectionPopupAt(themeClass, left, top, html, isPersonType);
    return;
  }

  const resolvedThemeClass = themeClass || (selectionPopupEl.className.match(/qc-theme-\S+/) || [''])[0];
  const styleClass = getPopupStyleClass();
  selectionPopupEl.className = isPersonType
    ? `qc-popup ${resolvedThemeClass}${popupChromeClasses(resolvedThemeClass)} ${styleClass} person-type show ${QUICKCARD_BOOT_ID}`
    : `qc-popup ${resolvedThemeClass}${popupChromeClasses(resolvedThemeClass)} ${styleClass} show ${QUICKCARD_BOOT_ID}`;
  withPreservedDetailsState(selectionPopupEl, () => {
    selectionPopupEl.innerHTML = navBuildClosebarHtml(navBuildMiniFullSwitchHtml(styleClass, qcIsLoadingOnlyHtml(html))) + `<div id="qc-card-root">${html}</div>`;
  });

  selectionPopupEl.dataset.qcSessionToken = String(navRenderToken);
  navTrackRenderedCard(resolvedThemeClass, html, isPersonType);
  bindPopupButtons(selectionPopupEl);
  clampPopupElementIntoView(selectionPopupEl);
}

let popupInteractionActive = false;

function scheduleHoverHide() {

  if (hoverPopupPinned) return;

  if (!document.hasFocus()) return;
  if (popupInteractionActive) return;
  clearTimeout(hoverHideTimer);
  hoverHideTimer = setTimeout(() => {
    if (!hoverPopupEl) return;
    hoverPopupEl.classList.remove('show');
    clearTimeout(hoverRemoveTimer);
    hoverRemoveTimer = setTimeout(destroyHoverPopup, REMOVE_ANIM_MS);
  }, 200);
}

function closeSelectionPopup() {
  if (selectionButton) selectionButton.dataset.requestToken = '';
  clearTimeout(searchDelayTimer);
  clearPendingDisambiguation();

  clearFullVersionOverride();
  navSetRerenderFn(null);

  navClearHistory();
  if (typeof window.onQuickCardPopupClosed === 'function') window.onQuickCardPopupClosed();
  if (!selectionPopupEl) return;
  selectionPopupEl.classList.remove('show');
  clearTimeout(searchDelayTimer);
  setTimeout(destroySelectionPopup, REMOVE_ANIM_MS);
}

let navRenderToken = 0;
function navBeginRender() {
  return ++navRenderToken;
}
function navIsTokenCurrent(token) {
  return token === navRenderToken;
}

function navGuardToken() {
  return navRenderToken;
}

let navHistoryStack = [];
let navLastRenderedCard = null;

function navTrackRenderedCard(themeClass, html, isPersonType) {
  navLastRenderedCard = {
    themeClass: themeClass || '',
    html,
    isPersonType: !!isPersonType,
    packId: (activePack && activePack.id) || null
  };
}

function navPushCurrentCard() {
  if (!navLastRenderedCard) return;
  if (qcIsLoadingOnlyHtml(navLastRenderedCard.html)) { navLastRenderedCard = null; return; }
  navHistoryStack.push(navLastRenderedCard);
  navLastRenderedCard = null;
}

function navRefreshLastRenderedCardHtml() {
  if (!navLastRenderedCard || !selectionPopupEl || !selectionPopupEl.isConnected) return;
  const root = selectionPopupEl.querySelector('#qc-card-root');
  if (root) navLastRenderedCard.html = root.innerHTML;
}

function navClearHistory() {
  navHistoryStack = [];
  navLastRenderedCard = null;
  navBeginRender();
}

function navBuildClosebarHtml(viewFullHtml = '') {
  const backHtml = navHistoryStack.length
    ? '<span class="qc-back-btn" title="Back">←</span>'
    : '';
  return `<div class="closebar">${viewFullHtml}${backHtml}<span class="qc-popup-close">&times;</span></div>`;
}

function navBuildMiniFullSwitchHtml(styleClass, isLoading) {
  if (styleClass !== 'qc-style-mini') return '';

  if (typeof pendingDisambiguation !== 'undefined' && pendingDisambiguation) return '';

  if (isLoading) return '';
  return '<span class="qc-view-full-btn" title="View Full Version">⛶</span>';
}

function qcIsLoadingOnlyHtml(html) {
  if (!html || html.indexOf('class="loading"') === -1) return false;
  const stripped = html
    .replace(/<div class="loading">[\s\S]*?<\/div>/g, '')
    .replace(/<div>\s*<button class="qc-retry-btn">[\s\S]*?<\/button>\s*<\/div>/g, '')
    .replace(/<div class="translation-note">[\s\S]*?<\/div>/g, '')
    .replace(/<div class="qc-translation-banner">[\s\S]*?<\/div>/g, '')
    .trim();
  return stripped === '';
}

let qcFullOverride = false;
function requestFullVersionOnce() {
  qcFullOverride = true;
}
function clearFullVersionOverride() {
  qcFullOverride = false;
}

let navRerenderFullFn = null;
function navSetRerenderFn(fn) {
  navRerenderFullFn = typeof fn === 'function' ? fn : null;
}

function navGoBack() {
  if (!navHistoryStack.length) return;
  if (!selectionPopupEl || !selectionPopupEl.isConnected) return;

  navBeginRender();

  if (selectionButton) selectionButton.dataset.requestToken = '';

  let entry = navHistoryStack.pop();
  while (entry && qcIsLoadingOnlyHtml(entry.html) && navHistoryStack.length) {
    entry = navHistoryStack.pop();
  }
  if (!entry || qcIsLoadingOnlyHtml(entry.html)) return;

  if (entry.packId && QuickCardPacks[entry.packId]) {
    setActivePack(entry.packId);
  }
  const styleClass = getPopupStyleClass();
  selectionPopupEl.className = entry.isPersonType
    ? `qc-popup ${entry.themeClass}${popupChromeClasses(entry.themeClass)} ${styleClass} person-type show ${QUICKCARD_BOOT_ID}`
    : `qc-popup ${entry.themeClass}${popupChromeClasses(entry.themeClass)} ${styleClass} show ${QUICKCARD_BOOT_ID}`;

  selectionPopupEl.innerHTML = navBuildClosebarHtml(navBuildMiniFullSwitchHtml(styleClass, qcIsLoadingOnlyHtml(entry.html))) + `<div id="qc-card-root">${entry.html}</div>`;

  selectionPopupEl.dataset.qcSessionToken = String(navRenderToken);
  navTrackRenderedCard(entry.themeClass, entry.html, entry.isPersonType);
  bindPopupButtons(selectionPopupEl);
  clampPopupElementIntoView(selectionPopupEl);

  window.onCardRestoredHandlers.forEach((fn) => {
    try { fn(entry.themeClass); } catch (e) { logError('onCardRestored handler failed', e); }
  });
  if (typeof window.onCardRestored === 'function') window.onCardRestored(entry.themeClass);
}
window.onCardRestoredHandlers = window.onCardRestoredHandlers || [];
function registerCardRestoredHandler(fn) {
  if (typeof fn === 'function') window.onCardRestoredHandlers.push(fn);
}

function initPopupDragging() {
  let dragState = null;

  document.addEventListener('mousedown', (e) => {
    const popupEl = composedClosest(e, '.qc-popup');
    if (!popupEl) return;

    if (composedClosest(e, 'button, a, .qc-popup-close, img, .qc-selectable')) return;

    if (!popupEl.classList.contains(QUICKCARD_BOOT_ID)) return;

    popupInteractionActive = true;

    const themeMatch = popupEl.className.match(/qc-theme-(\S+)/);
    const packId = themeMatch ? themeMatch[1] : null;
    if (packId && packNoDrag(packId)) return;

    const rect = popupEl.getBoundingClientRect();
    dragState = {
      el: popupEl,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };
    popupEl.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragState) return;

    let newLeft = e.clientX - dragState.offsetX;
    let newTop = e.clientY - dragState.offsetY;

    newLeft = Math.max(-dragState.el.offsetWidth + 60, Math.min(newLeft, window.innerWidth - 60));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - 30));

    dragState.el.style.left = `${newLeft}px`;
    dragState.el.style.top = `${newTop}px`;
  });

  document.addEventListener('mouseup', () => {
    popupInteractionActive = false;
    if (!dragState) return;
    dragState.el.classList.remove('dragging');
    dragState = null;
  });
}

function injectCoreStyle() {
  const root = ensureUiRoot();
  if (root.getElementById('quickcard-core-style')) return;

  const style = document.createElement('style');
  style.id = 'quickcard-core-style';
  style.textContent = `
    .qc-popup {
      position: fixed !important;
      z-index: 2147483647 !important;
      width: 300px !important;
      padding: 14px !important;
      border-radius: 20px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, Arial, sans-serif !important;
      opacity: 0 !important;
      transform: translateY(6px) scale(0.97) !important;
      transition: opacity 0.18s ease, transform 0.18s ease !important;
      pointer-events: auto !important;
      direction: ltr !important;
      text-align: left !important;
      box-sizing: border-box !important;
      cursor: grab !important;
      user-select: none !important;
    }
    .qc-popup.dragging {
      transition: none !important;
      cursor: grabbing !important;
      opacity: 1 !important;
    }
    :host-context(.qc-no-drag) .qc-popup,
    body.qc-no-drag .qc-popup {
      cursor: default !important;
    }

    .qc-popup.qc-drag-free {
      cursor: default !important;
      user-select: text !important;
    }

    :host-context(.qc-inline-result) .qc-popup,
    body.qc-inline-result .qc-popup {
      position: static !important;
      left: auto !important;
      top: auto !important;
      margin: 8px auto !important;
    }
    .qc-popup button,
    .qc-popup a {
      cursor: pointer !important;
    }
    .qc-popup * {
      direction: ltr !important;
      text-align: left !important;
      box-sizing: border-box !important;
    }
    .qc-popup.show {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
    }
    .qc-popup.person-type {
      width: 270px !important;
    }
    .qc-popup .row {
      display: flex !important;
      gap: 12px !important;
      align-items: stretch !important;
      width: 100% !important;
      flex-wrap: nowrap !important;
    }
    .qc-popup .content {
      flex: 1 !important;
      min-width: 0 !important;
      word-break: break-word !important;
    }

    .qc-popup img {
      width: 76px !important;
      height: 108px !important;
      object-fit: cover !important;
      border-radius: 12px !important;
      border: 1px solid rgba(255,255,255,0.8) !important;
      background: rgba(255,255,255,0.4) !important;
      flex-shrink: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      cursor: grab !important;
    }

    .qc-popup .qc-link-icon img,
    .qc-popup .qc-icon-badge-item img,
    .qc-popup .qc-icon-badge img {
      width: 18px !important;
      height: 18px !important;
      max-width: 18px !important;
      max-height: 18px !important;
      min-width: 18px !important;
      min-height: 18px !important;
      object-fit: contain !important;
      object-position: center center !important;
      border-radius: 0 !important;
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      flex-shrink: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      cursor: pointer !important;
    }
    .qc-popup .name {
      font-weight: 700 !important;
      font-size: 15px !important;
      margin: 0 0 6px 0 !important;
      line-height: 1.25 !important;
      padding: 0 !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
    }
    .qc-popup .meta {
      font-size: 12.5px !important;
      line-height: 1.55 !important;
      opacity: 0.92 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .qc-popup .meta div {
      margin: 3px 0 !important;
      padding: 0 !important;
    }
    .qc-popup .meta b {
      font-weight: 700 !important;
    }
    .qc-popup .qc-selectable {
      user-select: text !important;
      cursor: text !important;
    }

    .qc-popup .qc-view-full-btn {
      display: inline-block !important;
      cursor: pointer !important;
      font-size: 13px !important;
      line-height: 1 !important;
      padding: 3px 6px !important;
      border-radius: 8px !important;
      opacity: 0.55 !important;
      background: rgba(255,255,255,0.45) !important;
    }
    .qc-popup .qc-view-full-btn:hover {
      opacity: 0.9 !important;
      background: rgba(255,255,255,0.8) !important;
    }
    .qc-popup .qc-searchable {
      cursor: pointer !important;
      text-decoration: underline !important;
      text-decoration-style: dotted !important;
      text-underline-offset: 2px !important;
    }
    .qc-popup .qc-searchable:hover {
      text-decoration-style: solid !important;
      opacity: 0.75 !important;
    }

    .qc-popup .qc-nav-link {
      cursor: pointer !important;
      text-decoration: underline !important;
      text-decoration-style: dotted !important;
      text-underline-offset: 2px !important;
    }
    .qc-popup .qc-nav-link:hover {
      text-decoration-style: solid !important;
      opacity: 0.75 !important;
    }
    .qc-popup .loading {
      font-size: 13px !important;
      text-align: center !important;
      padding: 10px 0 !important;
      min-height: 60px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .qc-popup .qc-link,
    .qc-popup .qc-settings-link,
    .qc-popup .qc-retry-btn {
      display: inline-block !important;
      margin-top: 8px !important;
      margin-right: 8px !important;
      font-size: 11.5px !important;
      font-weight: 700 !important;
      text-decoration: underline !important;
      cursor: pointer !important;
      background: none !important;
      border: none !important;
      padding: 0 !important;
      font-family: inherit !important;
    }
    .qc-popup .qc-link-icon {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      min-height: 32px !important;
      margin: 0 6px 0 0 !important;
      padding: 0 !important;
      border-radius: 10px !important;
      background: #f1f2f4 !important;
      text-decoration: none !important;
      vertical-align: middle !important;
      overflow: hidden !important;
      flex-shrink: 0 !important;
      box-sizing: border-box !important;
    }
    .qc-popup .qc-link-icon:hover {
      background: #e7e8ec !important;
    }
    .qc-popup .qc-footer-strip {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 8px !important;
    }
    .qc-popup .qc-footer-strip .qc-link-icon {
      margin: 0 !important;
    }
    .qc-popup .qc-link-inline-arrow {
      display: inline !important;
      margin: 0 0 0 3px !important;
      padding: 0 !important;
      background: none !important;
      border: none !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      line-height: 1 !important;
      cursor: pointer !important;
      text-decoration: none !important;
      vertical-align: 1px !important;
      opacity: 0.75 !important;
    }
    .qc-popup .qc-link-inline-arrow:hover {
      opacity: 1 !important;
    }
    .qc-popup .closebar {
      text-align: right !important;
      margin: -6px -6px 4px 0 !important;
      direction: ltr !important;
    }
    .qc-popup .closebar span {
      cursor: pointer !important;
      font-size: 16px !important;
      font-weight: 700 !important;
      padding: 2px 8px !important;
      border-radius: 8px !important;
    }

    .qc-popup .qc-hover-pinbar {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: flex-end !important;
      gap: 4px !important;
      margin: -6px -6px 4px 0 !important;
    }
    .qc-popup .qc-hover-pin-btn {
      cursor: pointer !important;
      font-size: 13px !important;
      line-height: 1 !important;
      padding: 3px 6px !important;
      border-radius: 8px !important;
      opacity: 0.55 !important;
      background: rgba(255,255,255,0.45) !important;
    }
    .qc-popup .qc-hover-pin-btn:hover {
      opacity: 0.85 !important;
      background: rgba(255,255,255,0.8) !important;
    }
    .qc-popup .qc-hover-pin-btn.pinned {
      opacity: 1 !important;
      background: rgba(255,255,255,0.8) !important;
    }
    .qc-popup .qc-hover-pinbar .qc-popup-close {
      cursor: pointer !important;
      font-size: 16px !important;
      font-weight: 700 !important;
      padding: 2px 8px !important;
      border-radius: 8px !important;
    }
    .qc-popup .translation-note {
      font-size: 11px !important;
      line-height: 1.4 !important;
      border-radius: 10px !important;
      padding: 6px 8px !important;
      margin: 0 0 8px 0 !important;
    }
    .qc-popup .translation-note b {
      font-weight: 700 !important;
    }

    .qc-popup .qc-translate-edit-wrap {
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      vertical-align: middle !important;
    }
    .qc-popup .qc-translate-edit-input {
      font: inherit !important;
      font-weight: 700 !important;
      color: inherit !important;
      background: rgba(255,255,255,0.6) !important;
      border: 1px solid rgba(0,0,0,0.15) !important;
      border-radius: 6px !important;
      padding: 1px 6px !important;
      min-width: 60px !important;
      max-width: 160px !important;
    }
    .qc-popup .qc-translate-edit-go {
      font-size: 12px !important;
      line-height: 1 !important;
      background: none !important;
      border: none !important;
      color: inherit !important;
      cursor: pointer !important;
      padding: 2px 4px !important;
      border-radius: 6px !important;
      opacity: 0.8 !important;
    }
    .qc-popup .qc-translate-edit-go:hover {
      opacity: 1 !important;
      background: rgba(0,0,0,0.08) !important;
    }

    .qc-popup .translation-provider {
      display: inline-block !important;
      font-size: 9.5px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.02em !important;
      padding: 1px 6px !important;
      border-radius: 999px !important;
      background: rgba(29, 78, 216, 0.12) !important;
      color: #1d4ed8 !important;
      vertical-align: middle !important;
    }
    .qc-popup .extra-error {
      font-weight: 600 !important;
    }
    .qc-popup .extra-disabled {
      font-style: italic !important;
    }
    .qc-popup .pick-heading {
      font-size: 12.5px !important;
      font-weight: 700 !important;
      margin: 2px 0 8px !important;
    }
    .qc-popup .qc-pick-btn {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      width: 100% !important;
      text-align: left !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 6px 8px !important;
      margin: 0 0 6px !important;
      cursor: pointer !important;
      font-family: inherit !important;
    }
    .qc-popup .qc-pick-btn img {
      width: 76px !important;
      height: 108px !important;
      object-fit: cover !important;
      border-radius: 4px !important;
      flex-shrink: 0 !important;
    }
    .qc-popup .qc-pick-btn .pick-text {
      min-width: 0 !important;
    }
    .qc-popup .qc-pick-btn .pick-title {
      font-size: 12.5px !important;
      font-weight: 700 !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .qc-popup .qc-pick-btn .pick-sub {
      font-size: 11px !important;
    }

    .qc-selectbtn {
      position: fixed !important;
      z-index: 2147483647 !important;
      display: none;
      direction: ltr !important;
      flex-direction: row !important;
      align-items: center;
      gap: 3px;
      background: rgba(255,255,255,0.85);
      border-radius: 8px;
      padding: 3px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .qc-selectbtn-icon {
      background: none;
      color: inherit;
      border: none;
      padding: 3px;
      border-radius: 6px;
      font: inherit;
      cursor: pointer;
      outline: inherit;
      line-height: 0;
    }
    .qc-selectbtn-icon:hover {
      background: rgba(0,0,0,0.08);
    }
    .qc-selectbtn-icon.active {
      background: rgba(0,0,0,0.12);
    }


    .qc-popup.qc-style-full {
      width: 468px !important;
      padding: 18px 20px 20px !important;
      border-radius: 18px !important;
    }

    ${isRunningAsExtensionPage() ? '' : `
    .qc-popup.qc-style-full {
      max-height: calc(100vh - 32px) !important;
      overflow-y: auto !important;
    }`}

    .qc-popup.qc-style-mini {
      max-height: calc(100vh - 32px) !important;
      overflow-y: auto !important;
    }
    .qc-theme-movies.qc-style-full.person-type {
      width: 452px !important;
    }
    .qc-popup.qc-style-full .row > img {
      width: 150px !important;
      height: 220px !important;
      min-width: 150px !important;
      min-height: 220px !important;
      border-radius: 14px !important;
    }
    .qc-popup.qc-style-full.person-type .row > img {
      width: 150px !important;
      height: 190px !important;
      min-width: 150px !important;
      min-height: 190px !important;
      border-radius: 14px !important;
    }
    .qc-popup.qc-style-full .name {
      font-size: 22px !important;
      margin: 0 0 2px 0 !important;
    }
    .qc-popup .qc-subtitle {
      font-size: 13px !important;
      margin: 0 0 9px 0 !important;
      opacity: 0.75 !important;
    }
    .qc-popup .qc-full-desc {
      font-size: 12.5px !important;
      line-height: 1.6 !important;
      margin: 2px 0 0 0 !important;
    }
    .qc-popup .qc-star {
      font-size: 15px !important;
    }
    .qc-popup .qc-badge-row {
      display: flex !important;
      align-items: center !important;
      gap: 9px !important;
      flex-wrap: wrap !important;
      margin: 0 0 10px 0 !important;
    }
    .qc-popup .qc-badge-rating {
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      font-size: 14px !important;
      font-weight: 800 !important;
    }

    .qc-popup .qc-badge-rating-votes {
      font-size: 11px !important;
      font-weight: 600 !important;
      opacity: 0.65 !important;
    }
    .qc-popup .qc-badge-status {
      font-size: 11.5px !important;
      font-weight: 700 !important;
      padding: 3px 10px !important;
      border-radius: 999px !important;
    }
    .qc-popup .qc-score-inline {
      font-size: 12px !important;
    }
    .qc-popup .qc-score-inline b {
      font-weight: 700 !important;
    }

    .qc-popup .qc-rating-circles-row {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
      margin: 10px 0 !important;
      padding-left: 20px;
    }
    .qc-popup .qc-rating-circle {
      position: relative !important;
      width: 52px !important;
      height: 52px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: default !important;
    }
    .qc-popup a.qc-rating-circle,
    .qc-popup button.qc-rating-circle,
    .qc-popup .qc-rating-circle.qc-title-link {
      cursor: pointer !important;
    }
    .qc-popup .qc-rating-circle svg {
      width: 100% !important;
      height: 100% !important;

      transform: rotate(135deg) !important;
    }
    .qc-popup .qc-rating-circle circle {
      fill: none !important;
      stroke-width: 3.5 !important;
    }
    .qc-popup .qc-rating-circle .qc-rc-bg {
      stroke: rgba(0, 0, 0, 0.1) !important;
    }
    .qc-popup .qc-rating-circle .qc-rc-fg {

      stroke-linecap: round !important;
    }
    .qc-popup .qc-rating-circle-value {
      position: absolute !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      line-height: 1 !important;
      pointer-events: none !important;
    }
    .qc-popup .qc-rating-circle-value b {
      font-size: 12px !important;
      font-weight: 800 !important;
    }
    .qc-popup .qc-rating-circle-value small {
      font-size: 7.5px !important;
      font-weight: 700 !important;
      opacity: 0.6 !important;
      letter-spacing: 0.2px !important;
    }
    .qc-popup .qc-rating-circle-tooltip {
      position: absolute !important;
      bottom: 100% !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      margin-bottom: 6px !important;
      background: #111 !important;
      color: #fff !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      padding: 4px 8px !important;
      border-radius: 6px !important;
      white-space: nowrap !important;
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 0.15s !important;
      z-index: 5 !important;
    }
    .qc-popup .qc-rating-circle:hover .qc-rating-circle-tooltip {
      opacity: 1 !important;
    }
    .qc-popup .qc-chip-row {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 6px !important;
    }
    .qc-popup .qc-chip {
      font-size: 12px !important;
      font-weight: 600 !important;
      padding: 4px 11px !important;
      border-radius: 999px !important;
    }
    .qc-popup .qc-section {
      margin-top: 16px !important;
    }
    .qc-popup .qc-section-label {
      font-size: 13px !important;
      font-weight: 800 !important;
      margin: 0 0 10px 0 !important;
    }
    .qc-popup .qc-divider {
      height: 1px !important;
      margin: 16px 0 !important;
      border: none !important;
    }
    .qc-popup .qc-fact-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 10px 16px !important;
    }
    .qc-popup.person-type .qc-fact-grid {
      grid-template-columns: 1fr !important;
    }
    .qc-popup .qc-fact-row {
      display: flex !important;
      align-items: flex-start !important;
      gap: 9px !important;
      font-size: 12.5px !important;
    }
    .qc-popup .qc-fact-icon {
      width: 24px !important;
      height: 24px !important;
      border-radius: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 12px !important;
      flex-shrink: 0 !important;
      margin-top: 1px !important;
    }
    .qc-popup .qc-fact-label {
      font-weight: 700 !important;
    }
    .qc-popup .qc-stat-row {
      display: flex !important;
      gap: 10px !important;
    }
    .qc-popup .qc-stat-block {
      flex: 1 !important;
      border-radius: 12px !important;
      padding: 10px 11px 9px !important;
    }
    .qc-popup .qc-stat-num {
      font-size: 17px !important;
      font-weight: 800 !important;
    }
    .qc-popup .qc-stat-label {
      font-size: 10.5px !important;
      font-weight: 600 !important;
      margin-top: 2px !important;
    }
    .qc-popup .qc-known-for-list {
      margin: 0 !important;
      padding: 0 !important;
      list-style: none !important;
    }
    .qc-popup .qc-known-for-list li {
      font-size: 12.5px !important;
      line-height: 1.9 !important;
      padding: 0 !important;
    }
    .qc-popup .qc-known-for-list li::before {
      content: "•" !important;
      margin-right: 6px !important;
      opacity: 0.5 !important;
    }
    .qc-popup .qc-known-for-list.has-images {
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
    }
    .qc-popup .qc-known-for-list.has-images li {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      line-height: 1.3 !important;
    }
    .qc-popup .qc-known-for-list.has-images li::before {
      content: none !important;
      margin: 0 !important;
    }
    .qc-popup .qc-known-for-thumb {

      width: 46px !important;
      height: 64px !important;
      border-radius: 6px !important;
      object-fit: cover !important;
      flex-shrink: 0 !important;
      background: #e8e9ed !important;
    }
    .qc-popup .qc-icon-badge-grid {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 11px !important;
    }
    .qc-popup .qc-icon-badge-item {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 5px !important;
      width: 60px !important;
      background: none !important;
      border: none !important;
      padding: 0 !important;
      margin: 0 !important;
      font-family: inherit !important;
    }
    .qc-popup .qc-icon-badge {
      width: 46px !important;
      height: 46px !important;
      border-radius: 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .qc-popup .qc-icon-badge img {
      width: 24px !important;
      height: 24px !important;
      min-width: 0 !important;
      min-height: 0 !important;
      border-radius: 0 !important;
      border: none !important;
      background: none !important;
      margin: 0 !important;
    }
    .qc-popup .qc-icon-badge-label {
      font-size: 9.5px !important;
      font-weight: 600 !important;
      text-align: center !important;
    }
    .qc-popup .qc-icon-badge-grid.no-label .qc-icon-badge-item {
      width: 46px !important;
      gap: 0 !important;
    }
    .qc-popup .qc-icon-badge-grid.no-label .qc-icon-badge {
      border-radius: 50% !important;
    }
    .qc-popup .qc-text-link {
      display: inline-block !important;
      margin-top: 8px !important;
      font-size: 11.5px !important;
      font-weight: 700 !important;
      background: none !important;
      border: none !important;
      padding: 0 !important;
      font-family: inherit !important;
    }
    .qc-popup .qc-text-link:hover {
      text-decoration: underline !important;
    }
    .qc-popup .qc-footer-strip {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 8px !important;
    }
    .qc-popup.qc-style-full .qc-link-icon {
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      min-height: 32px !important;
      border-radius: 10px !important;
      margin: 0 !important;
      overflow: hidden !important;
      background: #f1f2f4 !important;
    }
    .qc-popup.qc-style-full .qc-link-icon:hover {
      background: #e7e8ec !important;
    }
    .qc-popup.qc-style-full .qc-link-icon img {
      width: 18px !important;
      height: 18px !important;
      max-width: 18px !important;
      max-height: 18px !important;
      min-width: 18px !important;
      min-height: 18px !important;
      object-fit: contain !important;
      object-position: center center !important;
    }
  `;
  root.styleHost.appendChild(style);
}

