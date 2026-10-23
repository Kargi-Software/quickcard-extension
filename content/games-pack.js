

const GAMES_PACK_ID = 'games';
const GAMES_THEME_CLASS = 'qc-theme-games';

const GAMES_DEFAULT_SETTINGS = {
  gamesFieldPublisher: true,
  gamesFieldDeveloper: true,
  gamesFieldSynopsis: true,
  gamesFieldMetascore: true,
  gamesShowSteamRating: true,
  gamesFieldSteamPrice: true,

  gamesFieldPlayStationPrice: true,
  gamesFieldXboxPrice: true,
  gamesFieldSystemRequirements: true,
  gamesFieldSteamTags: true,

  gamesShowSteamLink: true,
  gamesShowPlayStationLink: true,
  gamesShowXboxLink: true,
  gamesShowMetacriticLink: true,
  gamesShowOfficialWebsiteLink: true,
  gamesShowWikipediaLink: true,
  gamesShowGameSpotLink: true,

  gamesShowStoreSearch: true,

  gamesShowIsThereAnyDealLink: true,
  gamesShowPSPriceLink: true,
  gamesShowGGDealsLink: true,
  gamesShowCheapSharkLink: true,

  gamesShowYoutubeLink: true,

  gamesSiteFilterMode: 'blacklist',
  gamesWhitelistSites: [],
  gamesBlacklistSites: ['gamespot.com'],
  gamesCustomLinks: []
};

let gamesSettings = { ...GAMES_DEFAULT_SETTINGS };

async function loadGamesSettings() {
  const stored = await api.storage.local.get(GAMES_DEFAULT_SETTINGS);

  gamesSettings = {
    gamesFieldPublisher: stored.gamesFieldPublisher !== false,
    gamesFieldDeveloper: stored.gamesFieldDeveloper !== false,
    gamesFieldReleaseDate: true,
    gamesFieldGenre: true,
    gamesFieldSynopsis: stored.gamesFieldSynopsis !== false,
    gamesFieldMetascore: stored.gamesFieldMetascore !== false,
    gamesShowSteamRating: stored.gamesShowSteamRating !== false,
    gamesFieldSteamPrice: stored.gamesFieldSteamPrice !== false,
    gamesFieldPlayStationPrice: stored.gamesFieldPlayStationPrice !== false,
    gamesFieldXboxPrice: stored.gamesFieldXboxPrice !== false,
    gamesFieldSystemRequirements: stored.gamesFieldSystemRequirements !== false,
    gamesFieldSteamTags: stored.gamesFieldSteamTags !== false,

    gamesShowSteamLink: stored.gamesShowSteamLink !== false,
    gamesShowPlayStationLink: stored.gamesShowPlayStationLink !== false,
    gamesShowXboxLink: stored.gamesShowXboxLink !== false,
    gamesShowMetacriticLink: stored.gamesShowMetacriticLink !== false,
    gamesShowOfficialWebsiteLink: stored.gamesShowOfficialWebsiteLink !== false,
    gamesShowWikipediaLink: stored.gamesShowWikipediaLink !== false,
    gamesShowGameSpotLink: stored.gamesShowGameSpotLink !== false,

    gamesShowStoreSearch: stored.gamesShowStoreSearch !== false,

    gamesShowIsThereAnyDealLink: stored.gamesShowIsThereAnyDealLink !== false,
    gamesShowPSPriceLink: stored.gamesShowPSPriceLink !== false,
    gamesShowGGDealsLink: stored.gamesShowGGDealsLink !== false,
    gamesShowCheapSharkLink: stored.gamesShowCheapSharkLink !== false,

    gamesShowYoutubeLink: stored.gamesShowYoutubeLink !== false,

    gamesSiteFilterMode: stored.gamesSiteFilterMode || 'blacklist',
    gamesWhitelistSites: Array.isArray(stored.gamesWhitelistSites) ? stored.gamesWhitelistSites : [],
    gamesBlacklistSites: Array.isArray(stored.gamesBlacklistSites) ? stored.gamesBlacklistSites : ['gamespot.com'],
    gamesCustomLinks: Array.isArray(stored.gamesCustomLinks)
      ? stored.gamesCustomLinks.filter((l) => l && typeof l.urlTemplate === 'string' && l.urlTemplate.trim())
      : []
  };

  preloadCustomLinkIcons(gamesSettings.gamesCustomLinks);
  return gamesSettings;
}

const GAMES_FULL_CARD_WIDTH = 528;

function isGamesAllowedOnThisSite() {
  return true;
}

function isGamesAllowedForHoverOnThisSite() {
  const ownRulesAllow = siteAllowedByRules({
    siteFilterMode: gamesSettings.gamesSiteFilterMode,
    whitelistSites: gamesSettings.gamesWhitelistSites,
    blacklistSites: gamesSettings.gamesBlacklistSites
  });
  if (!ownRulesAllow) return false;
  return isAllowedByGlobalSiteRules(GAMES_PACK_ID, 'hover');
}

const GAMES_CONSOLE_ICON_VERSION = 2;

function getConsoleIconUrl(fileName) {
  try {
    return `${api.runtime.getURL(`icons/consoles/${fileName || 'others.svg'}`)}?v=${GAMES_CONSOLE_ICON_VERSION}`;
  } catch (_) {
    return '';
  }
}

function buildConsoleIcon(fileName, alt = '') {
  const url = getConsoleIconUrl(fileName);
  if (!url) return '';

  const fallback = getConsoleIconUrl('others.svg');

  return `
    <img
      class="qc-game-console-icon"
      src="${escapeHtml(url)}"
      alt="${escapeHtml(alt)}"
      draggable="false"
      data-fallback-src="${escapeHtml(fallback)}"
    >
  `;
}

function injectGamesTheme() {
  const root = ensureUiRoot();
  if (root.getElementById('quickcard-games-theme')) return;

  const style = document.createElement('style');
  style.id = 'quickcard-games-theme';

  style.textContent = `
    .${GAMES_THEME_CLASS} {
      background-color: #ffffff !important;
      border: 1px solid #ececf0 !important;
      box-shadow: 0 10px 30px rgba(20,20,30,0.14) !important;
      color: #17171a !important;
      overflow: hidden !important;
    }


    .${GAMES_THEME_CLASS}.qc-popup {
      cursor: default !important;
      user-select: text !important;
    }
    .${GAMES_THEME_CLASS} button,
    .${GAMES_THEME_CLASS} a,
    .${GAMES_THEME_CLASS} .qc-game-platform-chip,
    .${GAMES_THEME_CLASS} .qc-game-platform-group {
      cursor: pointer !important;
      user-select: none !important;
    }
    .${GAMES_THEME_CLASS} img {
      -webkit-user-drag: none !important;
      user-select: none !important;
      cursor: default !important;
    }


    .${GAMES_THEME_CLASS}.qc-style-full {
      width: ${GAMES_FULL_CARD_WIDTH}px !important;
      max-width: min(${GAMES_FULL_CARD_WIDTH}px, calc(100vw - 24px)) !important;
      box-sizing: border-box !important;
    }


    .${GAMES_THEME_CLASS} .qc-game-hero {
      position: relative !important;
      display: grid !important;
      grid-template-columns: 112px minmax(0, 1fr) !important;
      gap: 15px !important;
      padding-bottom: 14px !important;
      margin: 0 -20px 0 -20px !important;
      padding-left: 20px !important;
      padding-right: 20px !important;
      border-bottom: 1px solid #e7e9f0 !important;
      background:
        radial-gradient(circle at 90% 0%, #edf1ff 0, transparent 42%),
        linear-gradient(180deg, #ffffff 0%, #fafbff 100%) !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-cover {
      width: 112px !important;
      height: 158px !important;
      overflow: hidden !important;
      border-radius: 10px !important;
      background: #252832 !important;
      box-shadow: 0 7px 20px rgba(25, 30, 45, 0.18) !important;
      flex-shrink: 0 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-cover img {
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-summary {
      min-width: 0 !important;
      padding-top: 4px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-hero .name {
      margin: 0 0 6px 0 !important;
      overflow: hidden !important;
      font-size: 20px !important;
      font-weight: 800 !important;
      line-height: 1.18 !important;
      letter-spacing: -0.4px !important;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-box-orient: vertical !important;
      -webkit-line-clamp: 2 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-subline {
      margin-bottom: 10px !important;
      color: #69707e !important;
      font-size: 11px !important;
      font-weight: 500 !important;
    }


    .${GAMES_THEME_CLASS} .qc-game-platform-row {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 6px !important;
      margin-bottom: 11px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-platform-chip {
      display: inline-flex !important;
      align-items: center !important;
      gap: 5px !important;
      padding: 5px 8px !important;
      border: 1px solid #e7e9f0 !important;
      border-radius: 7px !important;
      background: #ffffff !important;
      color: #3b404b !important;
      font-size: 10px !important;
      font-weight: 800 !important;
      white-space: nowrap !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-console-icon {
      width: 25px !important;
      height: 25px !important;
      border-radius: 4px !important;
      flex-shrink: 0 !important;
      object-fit: contain !important;
      pointer-events: none !important;
    }
    .qc-game-platform-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .qc-game-platform-group {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }

    .${GAMES_THEME_CLASS} .qc-game-rating-line {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-score-badge {
      display: grid !important;
      width: 36px !important;
      height: 36px !important;
      flex-shrink: 0 !important;
      place-items: center !important;
      border-radius: 50% !important;
      font-size: 13px !important;
      font-weight: 900 !important;
      border: 2px solid #c7cad1 !important;
      color: #6b6f79 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-score-badge.good {
      border-color: #35a955 !important;
      color: #16823e !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-score-badge.mixed {
      border-color: #dd8a00 !important;
      color: #a8650a !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-score-badge.bad {
      border-color: #df4343 !important;
      color: #b53434 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-rating-copy strong {
      display: block !important;
      font-size: 12px !important;
      line-height: 1.2 !important;
      color: #17171a !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-rating-copy span {
      display: block !important;
      margin-top: 3px !important;
      color: #69707e !important;
      font-size: 10px !important;
    }

    .${GAMES_THEME_CLASS} .qc-game-steam-tags {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 5px !important;
      margin: 0 0 12px 0 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-steam-tags .qc-game-tag {
      font-size: 11px !important;
      font-weight: 600 !important;
      padding: 3px 8px !important;
      border-radius: 999px !important;
      background: rgba(0,0,0,0.06) !important;
      color: inherit !important;
      opacity: 0.9 !important;
      line-height: 1.3 !important;
    }

    .${GAMES_THEME_CLASS} .qc-game-body {
      padding-top: 14px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-section-heading {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      margin: 0 0 8px 0 !important;
      font-size: 13px !important;
      font-weight: 850 !important;
      color: #17171a !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-section + .qc-game-section-heading,
    .${GAMES_THEME_CLASS} .qc-game-section {
      margin-top: 15px !important;
    }


    .${GAMES_THEME_CLASS} .qc-game-details {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 8px 12px !important;
      padding: 10px 11px !important;
      border-radius: 10px !important;
      background: #f6f7fb !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-detail-label {
      display: block !important;
      margin-bottom: 3px !important;
      color: #69707e !important;
      font-size: 9px !important;
      font-weight: 750 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.25px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-detail-value {
      display: block !important;
      overflow: visible !important;
      color: #363b45 !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      white-space: normal !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;

    }


    .${GAMES_THEME_CLASS} .qc-game-prices {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)) !important;
      gap: 10px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-card {
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
      padding: 12px !important;
      border: 1px solid #e7e9f0 !important;
      border-radius: 12px !important;
      background: #ffffff !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-store-brand {
      display: flex !important;
      align-items: center !important;
      gap: 7px !important;
      color: #17171a !important;
      font-size: 12px !important;
      font-weight: 800 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-icon {
      width: 18px !important;
      height: 18px !important;
      border-radius: 4px !important;
      object-fit: contain !important;
      flex: none !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-store-name {
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-badge {
      display: flex !important;
      align-items: center !important;
      gap: 5px !important;
      font-size: 11px !important;
      font-weight: 700 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-badge-ps {
      color: #0070f3 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-badge-xbox {
      color: #107c10 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-badge-pill {
      display: inline-block !important;
      padding: 1px 6px !important;
      border: 1px solid currentColor !important;
      border-radius: 6px !important;
      font-size: 9px !important;
      font-weight: 850 !important;
      letter-spacing: 0.3px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-row {
      display: flex !important;
      align-items: baseline !important;
      flex-wrap: wrap !important;
      gap: 7px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-value {
      font-size: 20px !important;
      font-weight: 850 !important;
      letter-spacing: -0.2px !important;
      color: #17171a !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-old-price {
      color: #a3a8b2 !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      text-decoration: line-through !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-discount {
      padding: 1px 6px !important;
      border-radius: 5px !important;
      background: #d32f2f !important;
      color: #ffffff !important;
      font-size: 10px !important;
      font-weight: 800 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-unavailable {
      color: #858b97 !important;
      font-size: 11px !important;
      font-weight: 600 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-note {
      font-size: 10.5px !important;
      font-weight: 650 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-note-ps {
      color: #0070f3 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-note-xbox {
      color: #107c10 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-cta {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-top: auto !important;
      padding: 8px 10px !important;
      border-radius: 8px !important;
      color: #ffffff !important;
      font-size: 11.5px !important;
      font-weight: 750 !important;
      text-align: center !important;
      text-decoration: none !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-cta-steam {
      background: #0f1526 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-cta-ps {
      background: #0070f3 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-cta-xbox {
      background: #107c10 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-price-cta:hover {
      filter: brightness(1.08) !important;
    }


    .${GAMES_THEME_CLASS} .qc-game-purchase-links {
      display: flex !important;
      align-items: center !important;
      gap: 9px !important;
      margin-top: 12px !important;
      padding: 10px 11px !important;
      border: 1px solid #e7e9f0 !important;
      border-radius: 10px !important;
      background: #f6f7fb !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-purchase-label {
      margin-right: 2px !important;
      color: #69707e !important;
      font-size: 10px !important;
      font-weight: 750 !important;
      white-space: nowrap !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-store-circles {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-store-circle {
      position: relative !important;
      display: inline-flex !important;
      width: 30px !important;
      height: 30px !important;
      align-items: center !important;
      justify-content: center !important;
      border: 1px solid #e7e9f0 !important;
      border-radius: 50% !important;
      background: #ffffff !important;
      cursor: pointer !important;
      text-decoration: none !important;
      transition: transform 0.15s ease, box-shadow 0.15s ease !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-store-circle:hover {
      z-index: 1 !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 10px rgba(25, 30, 45, 0.15) !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-store-circle img {
      width: 17px !important;
      height: 17px !important;
      border-radius: 4px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-store-circle::after {
      position: absolute !important;
      bottom: -29px !important;
      left: 50% !important;
      z-index: 4 !important;
      padding: 5px 7px !important;
      border-radius: 5px !important;
      background: #242832 !important;
      color: #ffffff !important;
      content: attr(aria-label) !important;
      font-size: 10px !important;
      font-weight: 700 !important;
      opacity: 0 !important;
      pointer-events: none !important;
      transform: translateX(-50%) !important;
      transition: opacity 0.15s ease !important;
      white-space: nowrap !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-store-circle:hover::after {
      opacity: 1 !important;
    }



    .${GAMES_THEME_CLASS} .qc-game-description {
      color: #505663 !important;
      font-size: 11px !important;
      line-height: 1.55 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-description-teaser {
      display: block !important;
      cursor: pointer !important;
      list-style: none !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-description-teaser::-webkit-details-marker {
      display: none !important;
    }

    .${GAMES_THEME_CLASS} .qc-game-description-text {
      display: -webkit-box !important;
      -webkit-box-orient: vertical !important;
      -webkit-line-clamp: 3 !important;
      overflow: hidden !important;
    }
    .${GAMES_THEME_CLASS} details[open] > .qc-game-description-teaser .qc-game-description-text {
      display: block !important;
      -webkit-line-clamp: unset !important;
      overflow: visible !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-description-toggle {
      display: inline-block !important;
      margin-top: 4px !important;
      color: #2a5adf !important;
      font-size: 11px !important;
      font-weight: 600 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-description-toggle-less {
      display: none !important;
    }
    .${GAMES_THEME_CLASS} details[open] > .qc-game-description-teaser .qc-game-description-toggle-more {
      display: none !important;
    }
    .${GAMES_THEME_CLASS} details[open] > .qc-game-description-teaser .qc-game-description-toggle-less {
      display: inline-block !important;
    }


    .${GAMES_THEME_CLASS} .qc-game-external-links {
      display: flex !important;
      align-items: center !important;
      flex-wrap: wrap !important;
      gap: 6px !important;
      padding-top: 11px !important;
      border-top: 1px solid #e7e9f0 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-external-label {
      margin-right: 3px !important;
      color: #69707e !important;
      font-size: 10px !important;
      font-weight: 750 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-external-link {
      display: inline-flex !important;
      min-height: 27px !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 5px !important;
      padding: 0 10px !important;
      border-radius: 6px !important;
      background: #f4f5f8 !important;
      color: #5b6270 !important;
      font-size: 10px !important;
      font-weight: 800 !important;
      text-decoration: none !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-external-link:hover {
      background: #ebedf3 !important;
      color: #2e3440 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-external-icon {
      width: 15px !important;
      height: 15px !important;
      flex-shrink: 0 !important;
      border-radius: 3px !important;
      background: none !important;
      margin: 0 !important;
      pointer-events: none !important;
    }


    .${GAMES_THEME_CLASS} .qc-link,
    .${GAMES_THEME_CLASS} .qc-settings-link,
    .${GAMES_THEME_CLASS} .qc-retry-btn {
      color: #3b6df0 !important;
    }
    .${GAMES_THEME_CLASS} .qc-searchable:hover {
      color: #3b6df0 !important;
      opacity: 1 !important;
    }
    .${GAMES_THEME_CLASS} .qc-link-icon {
      background: #f1f2f4 !important;
    }
    .${GAMES_THEME_CLASS} .qc-link-icon:hover {
      background: #e7e8ec !important;
    }
    .${GAMES_THEME_CLASS} .closebar span {
      color: #17171a !important;
    }
    .${GAMES_THEME_CLASS} .closebar span:hover {
      background: #f1f2f4 !important;
    }
    .${GAMES_THEME_CLASS} .translation-note {
      color: #3c3d42 !important;
      background: #f1f2f4 !important;
    }
    .${GAMES_THEME_CLASS} .pick-heading {
      color: #17171a !important;
    }
    .${GAMES_THEME_CLASS} .qc-pick-btn {
      background: #f7f7f8 !important;
    }
    .${GAMES_THEME_CLASS} .qc-pick-btn:hover {
      background: #ececf0 !important;
    }
    .${GAMES_THEME_CLASS} .qc-pick-btn .pick-title {
      color: #17171a !important;
    }
    .${GAMES_THEME_CLASS} .qc-pick-btn .pick-sub {
      color: #7b7c82 !important;
    }


    .${GAMES_THEME_CLASS} .qc-game-requirements {
      border-radius: 10px !important;
      background: #f6f7fb !important;
      overflow: hidden !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-requirements-toggle {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 9px 11px !important;
      cursor: pointer !important;
      list-style: none !important;
      color: #363b45 !important;
      font-size: 11px !important;
      font-weight: 750 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-requirements-toggle::-webkit-details-marker {
      display: none !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-requirements-toggle::after {
      content: "\\25BE" !important;
      color: #9297a3 !important;
      transition: transform 0.15s ease !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-requirements[open] .qc-game-requirements-toggle::after {
      transform: rotate(180deg) !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-requirements-columns {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 0 10px !important;
      padding: 0 11px 11px 11px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-requirements-col-title {
      margin: 0 0 6px 0 !important;
      color: #69707e !important;
      font-size: 9px !important;
      font-weight: 750 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.25px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-requirements-row {
      margin-bottom: 5px !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-requirements-label {
      display: block !important;
      color: #69707e !important;
      font-size: 9px !important;
      font-weight: 700 !important;
    }
    .${GAMES_THEME_CLASS} .qc-game-requirements-value {
      display: block !important;
      color: #363b45 !important;
      font-size: 10.5px !important;
      font-weight: 550 !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
    }
  `;

  root.styleHost.appendChild(style);
}

function fetchGamesSearch(query) {
  return api.runtime
    .sendMessage({
      type: 'GAMES_SEARCH',
      query
    })
    .catch((error) => {
      logError(
        'fetchGamesSearch: sendMessage failed ->',
        error && error.message ? error.message : error
      );

      return {
        ok: false,
        error: String(error)
      };
    });
}

function fetchGamesDetails(id) {
  return api.runtime
    .sendMessage({
      type: 'GAMES_GET_DETAILS',
      id
    })
    .catch((error) => {
      logError(
        'fetchGamesDetails: sendMessage failed ->',
        error && error.message ? error.message : error
      );

      return {
        ok: false,
        error: String(error)
      };
    });
}

function fetchGamesStorePrices(gameName, wantsPlayStation, wantsXbox, wantsSteam, ratingOnly) {
  return api.runtime
    .sendMessage({
      type: 'GAMES_GET_STORE_PRICES',
      query: gameName,
      wantsPlayStation,
      wantsXbox,
      wantsSteam,
      ratingOnly
    })
    .catch((error) => {
      logError(
        'fetchGamesStorePrices: sendMessage failed ->',
        error && error.message ? error.message : error
      );

      return {
        ok: false,
        error: String(error)
      };
    });
}

function gamesSplitValues(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || '').trim())
      .filter(Boolean);
  }

  return String(value || '')
    .split(/\s*,\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const GAMES_PLATFORM_FAMILIES = [
  { key: 'playstation', label: 'PlayStation', icon: 'playstation.svg', test: (v) => /\bps\s*[1-5]\b/.test(v) || v.includes('playstation') || v.includes('ps vita') || v.includes('psp') },
  { key: 'xbox', label: 'Xbox', icon: 'xbox.svg', test: (v) => v.includes('xbox') || v.includes('xbsx') },
  { key: 'nintendo', label: 'Nintendo', icon: 'nintendo.svg', test: (v) => v.includes('nintendo') || v.includes('switch') || v.includes('wii') || v.includes('3ds') || v === 'ns' },
  { key: 'pc', label: 'PC', icon: 'pc.svg', test: (v) => v === 'pc' || v.includes('windows') || v.includes('linux') || v.includes('mac') },

  { key: 'mobile', label: 'Mobile', icon: 'mobile.svg', test: (v) => v.includes('android') || v.includes('ios') || v.includes('iphone') || v.includes('ipad') }
];

function gamesPlatformFamily(platform) {
  const value = String(platform || '').toLowerCase();

  for (const family of GAMES_PLATFORM_FAMILIES) {
    if (family.test(value)) return family;
  }

  return { key: 'other', label: 'Other', icon: 'others.svg' };
}

function buildGamePlatformRow(data) {
  const platforms = Array.isArray(data.platformsList) &&
    data.platformsList.length
    ? data.platformsList
    : gamesSplitValues(data.platforms);

  if (!platforms.length) return '';

  const groups = [];
  const groupsByKey = {};

for (const platform of platforms) {
  const family = gamesPlatformFamily(platform);

  if (!groupsByKey[family.key]) {
    const group = { family, platforms: [] };
    groupsByKey[family.key] = group;
    groups.push(group);
  }

  let name = platform
    .replace(/^playstation\s*/i, 'PS')
    .replace(/^nintendo\s+switch\s*/i, 'Switch');

  if (/^xbox\s+/i.test(name)) {
    name = name.replace(/^xbox\s+/i, '');
  }

  groupsByKey[family.key].platforms.push(name);
}

return `
<div class="qc-game-platform-row">
  ${groups.map((group) => `
    <div class="qc-game-platform-group">
      ${buildConsoleIcon(group.family.icon, group.family.label)}
      <span>${escapeHtml(group.platforms.join(', '))}</span>
    </div>
  `).join('')}
</div>`;
}

function buildGameSubline(data) {
  const parts = [];

  if (gamesSettings.gamesFieldReleaseDate && data.releaseDate) {
    const yearMatch = String(data.releaseDate).match(/^\d{4}/);
    if (yearMatch) parts.push(yearMatch[0]);
  }

  if (gamesSettings.gamesFieldDeveloper && data.developers) {
    parts.push(gamesSplitValues(data.developers)[0]);
  }

  if (gamesSettings.gamesFieldGenre && data.genres) {
    parts.push(gamesSplitValues(data.genres).join(', '));
  }

  if (!parts.length) return '';

  return `<div class="qc-game-subline">${escapeHtml(parts.join(' \u00b7 '))}</div>`;
}

function buildGameSteamRatingText(steamRating, steamPending) {
  if (steamPending) return 'Steam: Loading\u2026';

  const hasData = steamRating &&
    (Number.isFinite(steamRating.percent) || steamRating.label);
  if (!hasData) return 'Steam: no data';

  const pct = Number.isFinite(steamRating.percent) ? steamRating.percent : null;
  const reviews = Number.isFinite(steamRating.reviews) ? steamRating.reviews : null;
  const pctText = pct !== null ? `${pct}%` : (steamRating.label || '\u2014');
  return reviews !== null
    ? `Steam: ${pctText} \u00b7 ${reviews.toLocaleString('en-US')} reviews`
    : `Steam: ${pctText}`;
}

function buildGameSteamTagsHtml(tags) {
  if (!gamesSettings.gamesFieldSteamTags) return '';
  if (!Array.isArray(tags) || !tags.length) return '';

  const shown = tags.slice(0, 8);
  const chips = shown.map((tag) =>
    `<span class="qc-game-tag">${escapeHtml(tag)}</span>`
  ).join('');
  return `<div class="qc-game-section"><p class="qc-game-section-heading">Steam tags</p><div class="qc-game-steam-tags" title="Steam categories">${chips}</div></div>`;
}

function buildGameRatingLine(data, steamPending = false) {
  const showMeta = gamesSettings.gamesFieldMetascore;
  const showSteam = gamesSettings.gamesShowSteamRating;
  if (!showMeta && !showSteam) return '';

  const metacritic = data.metacritic;
  const hasScore = showMeta && metacritic && Number.isFinite(Number(metacritic.score));
  const score = hasScore ? String(Number(metacritic.score)) : '\u2014';

  let scoreTier = 'no-score';
  if (hasScore) {
    const n = Number(metacritic.score);
    scoreTier = n >= 75 ? 'good' : n >= 50 ? 'mixed' : 'bad';
  }

  const steamText = showSteam ? buildGameSteamRatingText(data.steamRating, steamPending) : '';

  if (!showMeta && !steamText) return '';

  return `
    <div class="qc-game-rating-line">
      ${showMeta ? `<div class="qc-game-score-badge ${scoreTier}">${escapeHtml(score)}</div>` : ''}
      <div class="qc-game-rating-copy">
        ${showMeta ? '<strong>Metascore</strong>' : ''}
        ${steamText ? `<span id="qc-game-steam-rating-inline">${escapeHtml(steamText)}</span>` : ''}
      </div>
    </div>
  `;
}

function buildGameDetail(label, value) {
  const safeValue = String(value || '').trim();
  if (!safeValue) return '';

  return `
    <div>
      <span class="qc-game-detail-label">${escapeHtml(label)}</span>
      <span class="qc-game-detail-value">${escapeHtml(safeValue)}</span>
    </div>
  `;
}

function buildGameDetailsGrid(data) {
  const items = [
    gamesSettings.gamesFieldDeveloper ? buildGameDetail('Developer', data.developers) : '',
    gamesSettings.gamesFieldPublisher ? buildGameDetail('Publisher', data.publishers) : '',
    gamesSettings.gamesFieldReleaseDate ? buildGameDetail('Release date', data.releaseDate) : '',
    gamesSettings.gamesFieldGenre ? buildGameDetail('Genres', data.genres) : ''
  ].join('');

  if (!items) return '';

  return `<div class="qc-game-details">${items}</div>`;
}

const GAMES_PRICE_STORE_STYLES = {
  steam: { icon: 'steam.svg', ctaLabel: 'View on Steam' },
  ps: { icon: 'playstation.svg', ctaLabel: 'View on PlayStation Store' },
  xbox: { icon: 'xbox.svg', ctaLabel: 'View on Microsoft Store' }
};

function buildGamePriceStoreCard({ store, storeName, url, badge, badgePill, price, oldPrice, discountPercent, note, isFree }) {
  const style = GAMES_PRICE_STORE_STYLES[store] || {};
  const hasDiscount = Number(discountPercent) > 0;
  const hasOldPrice = oldPrice && oldPrice !== price;
  const priceText = isFree ? 'Free' : (price || null);

  const iconUrl = style.icon
    ? (() => { try { return api.runtime.getURL(`icons/sites/${style.icon}`); } catch (_) { return ''; } })()
    : '';

  const priceRow = priceText
    ? `
      <div class="qc-game-price-row">
        ${hasOldPrice ? `<span class="qc-game-old-price">${escapeHtml(oldPrice)}</span>` : ''}
        <span class="qc-game-price-value">${escapeHtml(priceText)}</span>
        ${hasDiscount ? `<span class="qc-game-discount">-${escapeHtml(String(discountPercent))}%</span>` : ''}
      </div>
    `
    : `<div class="qc-game-price-unavailable">Not available for purchase</div>`;

  const cta = url
    ? `<a class="qc-game-price-cta qc-game-price-cta-${escapeHtml(store)}" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(style.ctaLabel || `View on ${storeName}`)}</a>`
    : '';

  return `
    <div class="qc-game-price-card">
      <div class="qc-game-store-brand">
        ${iconUrl ? `<img class="qc-game-price-icon" src="${escapeHtml(iconUrl)}" alt="" draggable="false">` : ''}
        <span class="qc-game-store-name">${escapeHtml(storeName)}</span>
      </div>
      ${badge ? `
        <span class="qc-game-price-badge qc-game-price-badge-${escapeHtml(store)}">
          ${escapeHtml(badge)}${badgePill ? `<span class="qc-game-price-badge-pill qc-game-price-badge-pill-${escapeHtml(store)}">${escapeHtml(badgePill)}</span>` : ''}
        </span>
      ` : ''}
      ${priceRow}
      ${note ? `<div class="qc-game-price-note qc-game-price-note-${escapeHtml(store)}">${escapeHtml(note)}</div>` : ''}
      ${cta}
    </div>
  `;
}

function buildGameSteamPriceCard(steam) {
  if (!gamesSettings.gamesFieldSteamPrice || !steam || !steam.price) return '';

  const price = steam.price;
  return buildGamePriceStoreCard({
    store: 'steam',
    storeName: 'Steam',
    url: steam.url || null,
    price: price.final,
    oldPrice: price.initial,
    discountPercent: price.discountPercent,
    isFree: price.isFree === true
  });
}

function buildGamePlayStationPriceCard(playstation) {
  if (!gamesSettings.gamesFieldPlayStationPrice) return '';
  if (!playstation || !playstation.isAvailable) return '';

  const tier = playstation.psPlusTier || null;
  const isDiscount = playstation.isDiscountOffer || tier === 'discount';
  const isTrial = playstation.isTrialOffer || tier === 'trial';

  let badge = null;
  let note = null;

  if (tier === 'extra') {
    badge = 'PlayStation Plus Extra';
  } else if (tier === 'premium') {
    badge = 'PlayStation Plus Premium';
  } else if (tier === 'trial') {
    badge = 'Trial on Premium';
  } else if (tier === 'discount') {

    badge = null;
    const rawText = String(playstation.rawUpsellText || playstation.upsellText || '');
    const discountMatch = rawText.match(/(\d+)\s*%/);
    const discountNum = discountMatch ? Number(discountMatch[1]) : (playstation.discountPercent || 0);
    if (discountNum > 0) {
      note = `Save ${discountNum}% with PlayStation Plus`;
    } else if (playstation.upsellText) {
      note = `${playstation.upsellText} with PlayStation Plus`;
    } else {
      note = `Discount with PlayStation Plus`;
    }
  } else {

    badge = playstation.includedWithSubscription
      ? (playstation.subscriptionName || 'PlayStation Plus')
      : null;

    if (!playstation.includedWithSubscription && playstation.hasSubscriptionOffer) {
      if (playstation.discountPercent > 0) {
        note = `Save ${playstation.discountPercent}% with ${playstation.subscriptionName || 'PlayStation Plus'}`;
      } else {
        note = `Trial available with ${playstation.subscriptionName || 'PlayStation Plus'}`;
      }
    }
  }

  return buildGamePriceStoreCard({
    store: 'ps',
    storeName: 'PlayStation Store',
    url: playstation.url || null,
    badge,
    price: playstation.formattedPrice,
    oldPrice: playstation.formattedBasePrice,
    discountPercent: playstation.discountPercent,
    note,
    isFree: playstation.isFree === true
  });
}

function gamesXboxTopTier(tiers) {
  return Array.isArray(tiers) && tiers.length ? tiers[tiers.length - 1] : null;
}

function gamesXboxTierPill(tierName) {
  if (!tierName) return null;
  const short = tierName.replace(/game pass/i, '').trim();
  return (short || tierName).toUpperCase();
}

function buildGameXboxPriceCard(xbox) {
  if (!gamesSettings.gamesFieldXboxPrice) return '';
  if (!xbox) return '';
  if (!xbox.isAvailableForPurchase && !xbox.includedWithGamePass) return '';

  const displayTiers = (Array.isArray(xbox.gamePassTiers) && xbox.gamePassTiers.length)
    ? xbox.gamePassTiers
    : (Array.isArray(xbox.gamePassPrimaryTiers) ? xbox.gamePassPrimaryTiers : []);

  let badgesHtml = '';
  if (xbox.includedWithGamePass && displayTiers && displayTiers.length) {

    const tierIcons = {
      'Game Pass Essential': 'essential',
      'Game Pass Premium': 'premium',
      'PC Game Pass': 'pc',
      'Game Pass Ultimate': 'ultimate',
      'Game Pass Core': 'core',
      'Game Pass Standard': 'standard'
    };
    badgesHtml = displayTiers.map(tier => {
      const pill = gamesXboxTierPill(tier);
      const shortName = tier.replace(/Game Pass/i, '').trim() || tier;

      return `<span class="qc-game-price-badge qc-game-price-badge-xbox" style="margin-bottom:4px"><span style="display:inline-flex;align-items:center;gap:4px"><span style="width:14px;height:14px;border-radius:3px;background:#107c10;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:8px;font-weight:900">${(pill||'GP').charAt(0)}</span>${escapeHtml(tier)}</span><span class="qc-game-price-badge-pill qc-game-price-badge-pill-xbox">${escapeHtml(pill||'GP')}</span></span>`;
    }).join('');
  } else if (xbox.includedWithGamePass) {
    badgesHtml = `<span class="qc-game-price-badge qc-game-price-badge-xbox">Xbox Game Pass</span>`;
  }

  const memberDisplayTiers = (Array.isArray(xbox.memberDiscountPrimaryTiers) && xbox.memberDiscountPrimaryTiers.length)
    ? xbox.memberDiscountPrimaryTiers
    : xbox.memberDiscountTiers;
  const topMemberTier = gamesXboxTopTier(memberDisplayTiers);
  const note = (xbox.hasGamePassMemberDiscount && xbox.gamePassMemberDiscountText)
    ? `${xbox.gamePassMemberDiscountText} for ${topMemberTier || 'Game Pass'} members`
    : null;

  let price = xbox.formattedPrice;
  let oldPrice = xbox.formattedBasePrice;
  let isFree = xbox.isFree === true;

  if ((!price || isFree) && xbox._fallbackPurchaseFormatted) {
    price = xbox._fallbackPurchaseFormatted;
    oldPrice = xbox._fallbackPurchaseBase ? (typeof xbox._fallbackPurchaseBase === 'string' ? xbox._fallbackPurchaseBase : null) : oldPrice;
    isFree = false;
  }

  const style = GAMES_PRICE_STORE_STYLES['xbox'] || {};
  const hasDiscount = Number(xbox.discountPercent) > 0;
  const hasOldPrice = oldPrice && oldPrice !== price;
  let priceText = null;
  if (isFree && price) {
    priceText = 'Free';
  } else if (isFree && !price && oldPrice) {
    priceText = 'Free';
  } else if (isFree && !price && !oldPrice) {
    priceText = null;
  } else {
    priceText = price || null;
  }
  const iconUrl = style.icon ? (() => { try { return api.runtime.getURL(`icons/sites/${style.icon}`); } catch (_) { return ''; } })() : '';
  const priceRow = priceText
    ? `<div class="qc-game-price-row">${hasOldPrice ? `<span class="qc-game-old-price">${escapeHtml(oldPrice)}</span>` : ''}<span class="qc-game-price-value">${escapeHtml(priceText)}</span>${hasDiscount ? `<span class="qc-game-discount">-${escapeHtml(String(xbox.discountPercent))}%</span>` : ''}</div>`
    : `<div class="qc-game-price-unavailable">Not available for purchase</div>`;
  const cta = xbox.url ? `<a class="qc-game-price-cta qc-game-price-cta-xbox" href="${escapeHtml(xbox.url)}" target="_blank" rel="noopener">${escapeHtml(style.ctaLabel || 'View on Microsoft Store')}</a>` : '';

  return `
    <div class="qc-game-price-card">
      <div class="qc-game-store-brand">
        ${iconUrl ? `<img class="qc-game-price-icon" src="${escapeHtml(iconUrl)}" alt="" draggable="false">` : ''}
        <span class="qc-game-store-name">Microsoft Store</span>
      </div>
      ${badgesHtml ? `<div style="display:flex;flex-direction:column;gap:4px;margin:4px 0">${badgesHtml}</div>` : ''}
      ${priceRow}
      ${note ? `<div class="qc-game-price-note qc-game-price-note-xbox">${escapeHtml(note)}</div>` : ''}
      ${cta}
    </div>
  `;
}

function buildGamePricesSection(data, pending) {
  const storePrices = data.storePrices || {};
  pending = pending || {};

  const loadingCard = (label) => `
    <div class="qc-game-price-card">
      <div class="qc-game-store-brand"><span class="qc-game-store-name">${escapeHtml(label)}</span></div>
      <div class="qc-game-price-note">Loading price...</div>
    </div>
  `;

  const cards = [
    pending.steam ? loadingCard('Steam') : buildGameSteamPriceCard(storePrices.steam),
    pending.playstation ? loadingCard('PlayStation Store') : buildGamePlayStationPriceCard(storePrices.playstation),
    pending.xbox ? loadingCard('Xbox') : buildGameXboxPriceCard(storePrices.xbox)

  ].filter(Boolean).join('');

  if (!cards) return '';

  return `
    <div class="qc-game-section" id="qc-game-prices-slot">
      <p class="qc-game-section-heading">Best Prices</p>
      <div class="qc-game-prices">${cards}</div>
    </div>
  `;
}

const GAMES_STORE_SEARCH_DEFINITIONS = [
  {
    id: 'steam',
    label: 'Steam',
    iconFile: 'steam.svg',
    platformTest: (v) => v === 'pc' || v.includes('windows') || v.includes('linux') || v.includes('mac'),
    buildUrl: (query) => `https://store.steampowered.com/search/?term=${encodeURIComponent(query)}`
  },
  {
    id: 'gog',
    label: 'GOG',
    iconFile: 'gog.svg',
    platformTest: (v) => v === 'pc' || v.includes('windows') || v.includes('linux') || v.includes('mac'),
    buildUrl: (query) => `https://www.gog.com/games?query=${encodeURIComponent(query)}`
  },
  {
    id: 'epic',
    label: 'Epic Games Store',
    iconFile: 'epic-games.svg',
    platformTest: (v) => v === 'pc' || v.includes('windows') || v.includes('linux') || v.includes('mac'),
    buildUrl: (query) => `https://store.epicgames.com/en-US/browse?q=${encodeURIComponent(query)}&sortBy=relevancy&sortDir=DESC`
  },
  {
    id: 'psn',
    label: 'PlayStation Store',
    iconFile: 'playstation.svg',
    platformTest: (v) => /\bps\s*[1-5]\b/.test(v) || v.includes('playstation') || v.includes('ps vita') || v.includes('psp'),
    buildUrl: (query) => `https://store.playstation.com/en-us/search/${encodeURIComponent(query)}`
  },
  {
    id: 'xbox',
    label: 'Microsoft Store',
    iconFile: 'xbox.svg',
    platformTest: (v) => v.includes('xbox') || v.includes('xbsx'),
    buildUrl: (query) => `https://www.xbox.com/en-us/search/results/games?q=${encodeURIComponent(query)}`
  },
  {

    id: 'nintendo',
    label: 'Nintendo eShop',
    iconFile: 'nintendo.svg',
    platformTest: (v) => v.includes('nintendo') || v.includes('switch') || v.includes('wii') || v.includes('3ds') || v.includes('ds'),
    buildUrl: (query) => `https://www.nintendo.com/us/search/#q=${encodeURIComponent(query)}&p=1&cat=gme`
  },
  {
    id: 'appstore',
    label: 'App Store',

    iconFile: 'appstore.svg',
    platformTest: (v) => v.includes('ios') || v.includes('iphone') || v.includes('ipad') || v === 'iOS'.toLowerCase(),
    buildUrl: (query) => `https://apps.apple.com/us/search?term=${encodeURIComponent(query)}`
  },
  {
    id: 'googleplay',
    label: 'Google Play',
    iconFile: 'googleplay.svg',
    platformTest: (v) => v.includes('android'),
    buildUrl: (query) => `https://play.google.com/store/search?q=${encodeURIComponent(query)}&c=apps`
  }
];

function gamesGetStoreSearchLinkObjects(data) {
  if (!gamesSettings.gamesShowStoreSearch) return [];
  const query = String(data.name || '').trim();
  if (!query) return [];
  const siteIconUrl = (fileName) => {
    try { return api.runtime.getURL(`icons/sites/${fileName}`); } catch (_) { return null; }
  };
  const platforms = (Array.isArray(data.platformsList) && data.platformsList.length
    ? data.platformsList
    : gamesSplitValues(data.platforms)
  ).map((p) => String(p).toLowerCase());
  return GAMES_STORE_SEARCH_DEFINITIONS
    .filter((store) => platforms.some((p) => store.platformTest(p)))
    .map((store) => ({ label: `Search on ${store.label}`, url: store.buildUrl(query), icon: siteIconUrl(store.iconFile) }));
}

function gamesGetDealSiteLinkObjects(data) {
  const query = String(data.name || '').trim();
  if (!query) return [];
  const siteIconUrl = (fileName) => {
    try { return api.runtime.getURL(`icons/sites/${fileName}`); } catch (_) { return null; }
  };
  const platforms = (Array.isArray(data.platformsList) && data.platformsList.length
    ? data.platformsList
    : gamesSplitValues(data.platforms)
  ).map((p) => String(p).toLowerCase());
  return GAMES_DEAL_SITE_DEFINITIONS
    .filter((site) => gamesSettings[site.settingKey] && site.platformTest(platforms))
    .map((site) => ({ label: `Check deals on ${site.label}`, url: site.buildUrl(query), icon: siteIconUrl(site.iconFile) }));
}

function buildGameSearchStoresSection(data) {
  const matched = gamesGetStoreSearchLinkObjects(data);
  if (!matched.length) return '';

  const circles = matched.map((link) => {
    const iconHtml = `<img class="qc-game-console-icon" src="${escapeHtml(link.icon || '')}" alt="${escapeHtml(link.label)}" draggable="false">`;
    return `
      <button
        class="qc-link qc-game-store-circle"
        data-link="${escapeHtml(link.url)}"
        aria-label="${escapeHtml(link.label)}"
        title="${escapeHtml(link.label)}"
      >
        ${iconHtml}
      </button>
    `;
  }).join('');

  return `
    <div class="qc-game-purchase-links">
      <span class="qc-game-purchase-label">Search Stores:</span>
      <div class="qc-game-store-circles">${circles}</div>
    </div>
  `;
}

const GAMES_DEAL_SITE_DEFINITIONS = [
  {
    id: 'isthereanydeal',
    label: 'IsThereAnyDeal',
    iconFile: 'isthereanydeal.svg',
    settingKey: 'gamesShowIsThereAnyDealLink',

    platformTest: () => true,
    buildUrl: (query) => `https://isthereanydeal.com/search/?q=${encodeURIComponent(query)}`
  },
  {
    id: 'psprice',
    label: 'PSPrice',
    iconFile: 'psprice.svg',
    settingKey: 'gamesShowPSPriceLink',
    platformTest: (platforms) => platforms.some((v) => /\bps\s*[1-5]\b/.test(v) || v.includes('playstation') || v.includes('ps vita') || v.includes('psp')),
    buildUrl: (query) => `https://psprices.com/region-us/games/?q=${encodeURIComponent(query)}`
  },
  {
    id: 'ggdeals',
    label: 'GG.deals',
    iconFile: 'gg.svg',
    settingKey: 'gamesShowGGDealsLink',
    platformTest: (platforms) => platforms.some((v) => v === 'pc' || v.includes('windows') || v.includes('linux') || v.includes('mac')),
    buildUrl: (query) => `https://gg.deals/games/?title=${encodeURIComponent(query)}`
  },
  {

    id: 'cheapshark',
    label: 'CheapShark',
    iconFile: 'cheapshark.svg',
    settingKey: 'gamesShowCheapSharkLink',
    platformTest: (platforms) => platforms.some((v) => v === 'pc' || v.includes('windows') || v.includes('linux') || v.includes('mac')),
    buildUrl: (query) => `https://www.cheapshark.com/browse?title=${encodeURIComponent(query)}`
  }
];

function buildGameDealSitesSection(data) {
  const matched = gamesGetDealSiteLinkObjects(data);
  if (!matched.length) return '';

  const circles = matched.map((link) => {
    const iconHtml = `<img class="qc-game-console-icon" src="${escapeHtml(link.icon || '')}" alt="${escapeHtml(link.label)}" draggable="false">`;
    return `
      <button
        class="qc-link qc-game-store-circle"
        data-link="${escapeHtml(link.url)}"
        aria-label="${escapeHtml(link.label)}"
        title="${escapeHtml(link.label)}"
      >
        ${iconHtml}
      </button>
    `;
  }).join('');

  return `
    <div class="qc-game-purchase-links">
      <span class="qc-game-purchase-label">Price Comparison:</span>
      <div class="qc-game-store-circles">${circles}</div>
    </div>
  `;
}

const GAME_ABOUT_TEASER_THRESHOLD = 220;
function buildGameAboutSection(data) {
  if (!gamesSettings.gamesFieldSynopsis) return '';

  const synopsis = String(data.synopsis || data.description || '').trim();
  if (!synopsis) return '';

  let bodyHtml;
  if (synopsis.length <= GAME_ABOUT_TEASER_THRESHOLD) {
    bodyHtml = `<p class="qc-game-description">${escapeHtml(synopsis)}</p>`;
  } else {
    bodyHtml = `<details><summary class="qc-game-description-teaser"><span class="qc-game-description qc-game-description-text">${escapeHtml(synopsis)}</span><span class="qc-game-description-toggle qc-game-description-toggle-more">Show more ▾</span><span class="qc-game-description-toggle qc-game-description-toggle-less">Show less ▴</span></summary></details>`;
  }

  return `
    <div class="qc-game-section">
      <p class="qc-game-section-heading">About</p>
      ${bodyHtml}
    </div>
  `;
}

const GAME_ABOUT_MINI_TEASER_THRESHOLD = 160;
function buildGameAboutMiniHtml(data) {
  if (!gamesSettings.gamesFieldSynopsis) return '';
  const synopsisText = String(data.synopsis || data.description || '').trim();
  if (!synopsisText) return '';
  let miniBodyHtml;
  if (synopsisText.length <= GAME_ABOUT_MINI_TEASER_THRESHOLD) {
    miniBodyHtml = `<p class="qc-game-description">${escapeHtml(synopsisText)}</p>`;
  } else {
    miniBodyHtml = `<details><summary class="qc-game-description-teaser"><span class="qc-game-description qc-game-description-text">${escapeHtml(synopsisText)}</span><span class="qc-game-description-toggle qc-game-description-toggle-more">Show more ▾</span><span class="qc-game-description-toggle qc-game-description-toggle-less">Show less ▴</span></summary></details>`;
  }
  return `
    <div class="qc-game-section">
      <p class="qc-game-section-heading">About</p>
      ${miniBodyHtml}
    </div>
  `;
}

function buildGameRequirementsColumn(title, rows) {
  if (!Array.isArray(rows) || !rows.length) return '';

  const rowsHtml = rows.map((row) => `
    <div class="qc-game-requirements-row">
      ${row.label ? `<span class="qc-game-requirements-label">${escapeHtml(row.label)}</span>` : ''}
      <span class="qc-game-requirements-value">${escapeHtml(row.value)}</span>
    </div>
  `).join('');

  return `
    <div>
      <p class="qc-game-requirements-col-title">${escapeHtml(title)}</p>
      ${rowsHtml}
    </div>
  `;
}

function buildGameRequirementsSection(data) {
  if (!gamesSettings.gamesFieldSystemRequirements) return '';

  const requirements = data.steamRequirements;
  if (!requirements) return '';

  const minimumHtml = buildGameRequirementsColumn('Minimum', requirements.minimum);
  const recommendedHtml = buildGameRequirementsColumn('Recommended', requirements.recommended);

  if (!minimumHtml && !recommendedHtml) return '';

  return `
    <details class="qc-game-requirements">
      <summary class="qc-game-requirements-toggle">System Requirements</summary>
      <div class="qc-game-requirements-columns">
        ${minimumHtml}
        ${recommendedHtml}
      </div>
    </details>
  `;
}

function gamesTitleDash(title) {
  return String(title || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function gamesBuildCustomLinkObjects(data) {
  const title = (data && data.name) || '';
  const out = [];
  for (const cl of (gamesSettings.gamesCustomLinks || [])) {
    const url = String(cl.urlTemplate || '')
      .replace(/\{title\}/g, encodeURIComponent(title))
      .replace(/\{title_dash\}/g, gamesTitleDash(title));
    if (!url) continue;
    out.push({
      label: (cl.label && cl.label.trim()) || 'Custom Link',
      url,
      icon: cl.icon || null
    });
  }
  return out;
}

function buildGameExternalLinksFooter(data) {

  const links = [
    gamesSettings.gamesShowGameSpotLink && data.gameSpotUrl ? { label: 'GameSpot', url: data.gameSpotUrl } : null,
    gamesSettings.gamesShowMetacriticLink && (data.metacriticUrl || data.metacritic?.sourceURL)
      ? { label: 'Metacritic', url: data.metacriticUrl || data.metacritic.sourceURL }
      : null,
    gamesSettings.gamesShowOfficialWebsiteLink && data.officialWebsite ? { label: 'Website', url: data.officialWebsite } : null,
    gamesSettings.gamesShowWikipediaLink && data.wikipediaUrl ? { label: 'Wikipedia', url: data.wikipediaUrl } : null,
    gamesSettings.gamesShowYoutubeLink && data.name
      ? { label: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(data.name)}` }
      : null
  ].filter(Boolean).concat(gamesBuildCustomLinkObjects(data));

  if (!links.length) return '';
  return `<div class="qc-section"><p class="qc-section-label">More on</p><div class="qc-footer-strip">${buildExternalLinksHtml(links)}</div></div>`;
}

function buildGameCover(data) {
  const img = data.image
    ? `<img data-qc-game-cover src="${escapeHtml(data.image)}" alt="${escapeHtml(data.name || 'Game cover')}" referrerpolicy="no-referrer" draggable="false">`
    : '';

  return `<div class="qc-game-cover">${img}</div>`;
}

function buildGameMiniLinkObjects(data) {
  const metacritic = data.metacritic;
  const links = [];

  if (gamesSettings.gamesShowMetacriticLink && (data.metacriticUrl || metacritic?.sourceURL)) {
    links.push({ label: 'Metacritic', url: data.metacriticUrl || metacritic.sourceURL });
  }
  if (gamesSettings.gamesShowOfficialWebsiteLink && data.officialWebsite) links.push({ label: 'Official Website', url: data.officialWebsite });
  if (gamesSettings.gamesShowWikipediaLink && data.wikipediaUrl) links.push({ label: 'Wikipedia', url: data.wikipediaUrl });

  return [...links, ...gamesGetStoreSearchLinkObjects(data), ...gamesGetDealSiteLinkObjects(data), ...gamesBuildCustomLinkObjects(data)];
}

function buildGameMiniHtml(data, pending) {
  pending = pending || {};
  const rows = [];

  if (gamesSettings.gamesFieldReleaseDate && data.releaseDate) rows.push(`Release Date: <b>${escapeHtml(data.releaseDate)}</b>`);
  if (gamesSettings.gamesFieldPublisher && data.publishers) rows.push(`Publisher: <b>${escapeHtml(gamesSplitValues(data.publishers).join(', '))}</b>`);
  if (gamesSettings.gamesFieldDeveloper && data.developers) rows.push(`Developer: <b>${escapeHtml(gamesSplitValues(data.developers).join(', '))}</b>`);
  if (gamesSettings.gamesFieldGenre && data.genres) rows.push(`Genre: <b>${escapeHtml(gamesSplitValues(data.genres).join(', '))}</b>`);
  if (data.platforms) rows.push(`Platforms: <b>${escapeHtml(gamesSplitValues(data.platforms).join(', '))}</b>`);

  if (gamesSettings.gamesFieldMetascore) {
    const metacritic = data.metacritic;
    const hasScore = metacritic && Number.isFinite(Number(metacritic.score));
    if (hasScore) rows.push(`Metascore: <b>${escapeHtml(String(Number(metacritic.score)))}/100</b>`);
  }

  const steamRatingSlotHtml = (pending.steam && gamesSettings.gamesShowSteamRating)
    ? `<div class="meta qc-selectable" id="qc-game-mini-steam-rating">${buildGameSteamRatingText(null, true)}</div>`
    : '';

  if (!rows.length) rows.push('Extra info: <b>N/A</b>');

  const allMiniLinks = buildGameMiniLinkObjects(data);

  const imgHtml = data.image
    ? `<img data-qc-game-cover src="${escapeHtml(data.image)}" alt="${escapeHtml(data.name || 'Game cover')}" referrerpolicy="no-referrer" draggable="false">`
    : '';

  const aboutMiniHtml = buildGameAboutMiniHtml(data);

  return `
    <div class="row" data-game-name="${escapeHtml(data.name || '')}" data-game-wants-steam="${pending.steam ? '1' : ''}" data-game-rating-only="1">
      ${imgHtml}
      <div class="content">
        <p class="name qc-selectable">${escapeHtml(data.name || 'Unknown Game')}</p>
        <div class="meta qc-selectable">${rows.map((r) => `<div>${r}</div>`).join('')}</div>
        ${steamRatingSlotHtml}
        ${aboutMiniHtml}
        <div id="qc-game-mini-links-slot">${buildExternalLinksHtml(allMiniLinks)}</div>
      </div>
    </div>
  `;
}

function buildGameHtml(data, pending, id) {
  if (getPopupStyleClass() === 'qc-style-full') return buildGameFullHtml(data, pending, id);
  return buildGameMiniHtml(data, pending);
}

function buildGameFullHtml(data, pending, id) {
  pending = pending || {};
  return `
    <div class="qc-game-card" data-game-id="${escapeHtml(String(id || ''))}" data-game-name="${escapeHtml(data.name || '')}" data-game-wants-ps="${pending.playstation ? '1' : ''}" data-game-wants-xbox="${pending.xbox ? '1' : ''}" data-game-wants-steam="${pending.steam ? '1' : ''}">
      <div class="qc-game-hero">
        ${buildGameCover(data)}
        <div class="qc-game-summary">
          <p class="name">${escapeHtml(data.name || 'Unknown Game')}</p>
          ${buildGameSubline(data)}
          ${buildGamePlatformRow(data)}
          ${buildGameRatingLine(data, pending.steam)}
        </div>
      </div>

      <div class="qc-game-body">
        ${buildGameDetailsGrid(data)}
        <div id="qc-game-steam-tags-slot"></div>
        ${buildGameAboutSection(data)}
        <div id="qc-game-requirements-slot">${pending.steam ? '' : buildGameRequirementsSection(data)}</div>
        ${buildGamePricesSection(data, pending)}
        ${buildGameSearchStoresSection(data)}
        ${buildGameDealSitesSection(data)}
        ${buildGameExternalLinksFooter(data)}
      </div>
    </div>
  `;
}

async function renderGameCard(id, banner = '') {
  const token = navBeginRender();

  navSetRerenderFn(() => renderGameCard(id, banner));
  const response = await fetchGamesDetails(id);
  if (!navIsTokenCurrent(token)) return;

  if (!response || !response.ok) {
    const error = response?.error
      ? ` (${escapeHtml(response.error)})`
      : '';

    updateSelectionPopup(
      `${banner}<div class="loading">Couldn't load that game${error}.</div>`,
      false,
      GAMES_THEME_CLASS
    );

    return;
  }

  const data = response.data;

  const platforms = Array.isArray(data.platformsList) && data.platformsList.length
    ? data.platformsList
    : gamesSplitValues(data.platforms);

  const isMiniCard = getPopupStyleClass() !== 'qc-style-full';

  const wantsPlayStation = !isMiniCard && gamesSettings.gamesFieldPlayStationPrice && platforms.some((p) => gamesPlatformFamily(p).key === 'playstation');
  const wantsXbox = !isMiniCard && gamesSettings.gamesFieldXboxPrice && platforms.some((p) => gamesPlatformFamily(p).key === 'xbox');
  const wantsSteam = platforms.some((p) => gamesPlatformFamily(p).key === 'pc');

  data.storePrices = null;

  updateSelectionPopup(
    `${banner}${buildGameHtml(data, { playstation: wantsPlayStation, xbox: wantsXbox, steam: wantsSteam }, id)}`,
    false,
    GAMES_THEME_CLASS
  );

  if (data.image) {
    resolveImageUrl(data.image, (resolved) => {
      if (!navIsTokenCurrent(token)) return;
      data.image = resolved;
      if (!resolved || !selectionPopupEl || !selectionPopupEl.isConnected) return;
      const coverImg = selectionPopupEl.querySelector('img[data-qc-game-cover]');
      if (coverImg) coverImg.src = resolved;

      navRefreshLastRenderedCardHtml();
    });
  }

  if (wantsPlayStation || wantsXbox || wantsSteam) {
    gamesLoadPricesSlot(data.name, wantsPlayStation, wantsXbox, wantsSteam, token, isMiniCard);
  }
}

async function gamesLoadPricesSlot(gameName, wantsPlayStation, wantsXbox, wantsSteam, token, ratingOnly = false) {
  const storePricesResponse = await fetchGamesStorePrices(gameName, wantsPlayStation, wantsXbox, wantsSteam, ratingOnly);
  if (token !== undefined && !navIsTokenCurrent(token)) return;
  if (!selectionPopupEl || !selectionPopupEl.isConnected) return;
  const storePrices = (storePricesResponse && storePricesResponse.ok) ? storePricesResponse.data : null;
  const steamResult = storePrices?.steam || null;

  const slot = selectionPopupEl.querySelector('#qc-game-prices-slot');
  if (slot) {
    const steamHtml = wantsSteam ? (buildGameSteamPriceCard(steamResult) || '') : '';
    const psHtml = wantsPlayStation ? (buildGamePlayStationPriceCard(storePrices?.playstation) || '') : '';
    const xboxHtml = wantsXbox ? (buildGameXboxPriceCard(storePrices?.xbox) || '') : '';
    const loadingCards = slot.querySelectorAll('.qc-game-price-card');
    const placeholderCount = (wantsSteam ? 1 : 0) + (wantsPlayStation ? 1 : 0) + (wantsXbox ? 1 : 0);
    const placeholders = Array.from(loadingCards).slice(loadingCards.length - placeholderCount);
    const replacement = document.createElement('div');
    replacement.innerHTML = steamHtml + psHtml + xboxHtml;

    const replacementEls = Array.from(replacement.children);
    placeholders.forEach((el, i) => {
      const newEl = replacementEls[i];
      if (newEl) el.replaceWith(newEl); else el.remove();
    });
  }

  if (!wantsSteam) return;

  const miniRatingSlot = selectionPopupEl.querySelector('#qc-game-mini-steam-rating');
  if (miniRatingSlot) miniRatingSlot.textContent = buildGameSteamRatingText(steamResult?.rating || null, false);

  const ratingSlot = selectionPopupEl.querySelector('#qc-game-steam-rating-inline');
  if (ratingSlot) ratingSlot.textContent = buildGameSteamRatingText(steamResult?.rating || null, false);

  if (gamesSettings.gamesFieldMetascore && steamResult && steamResult.metacriticScore != null) {
    const badge = selectionPopupEl.querySelector('.qc-game-score-badge');
    if (badge) {
      const n = Number(steamResult.metacriticScore);
      if (Number.isFinite(n)) {
        badge.textContent = String(n);
        badge.classList.remove('good', 'mixed', 'bad', 'no-score');
        badge.classList.add(n >= 75 ? 'good' : n >= 50 ? 'mixed' : 'bad');
      }
    }
  }

  const tagsSlot = selectionPopupEl.querySelector('#qc-game-steam-tags-slot');
  if (tagsSlot) tagsSlot.innerHTML = buildGameSteamTagsHtml(steamResult?.tags || null);

  const reqSlot = selectionPopupEl.querySelector('#qc-game-requirements-slot');
  if (reqSlot) reqSlot.innerHTML = buildGameRequirementsSection({ steamRequirements: steamResult?.requirements || null });
}

registerCardRestoredHandler((themeClass) => {
  if (themeClass !== GAMES_THEME_CLASS) return;
  const hero = selectionPopupEl?.querySelector('[data-game-name]');
  if (!hero) return;
  const gameName = hero.getAttribute('data-game-name') || '';
  if (!gameName) return;
  const ratingOnly = hero.getAttribute('data-game-rating-only') === '1';
  if (ratingOnly) {

    const miniSlot = selectionPopupEl.querySelector('#qc-game-mini-steam-rating');
    if (!miniSlot || miniSlot.textContent !== buildGameSteamRatingText(null, true)) return;
    const wantsSteam = hero.getAttribute('data-game-wants-steam') === '1';
    if (!wantsSteam) return;
    const token = navBeginRender();
    gamesLoadPricesSlot(gameName, false, false, true, token, true);
    return;
  }
  const slot = selectionPopupEl.querySelector('#qc-game-prices-slot .qc-game-price-note');
  if (!slot) return;
  const wantsPlayStation = hero.getAttribute('data-game-wants-ps') === '1';
  const wantsXbox = hero.getAttribute('data-game-wants-xbox') === '1';
  const wantsSteam = hero.getAttribute('data-game-wants-steam') === '1';
  if (!wantsPlayStation && !wantsXbox && !wantsSteam) return;
  const token = navBeginRender();
  gamesLoadPricesSlot(gameName, wantsPlayStation, wantsXbox, wantsSteam, token, false);
});

function describeGameCandidate(candidate) {
  return {
    name: candidate.label,
    image: candidate.image,
    subParts: candidate.description
      ? [candidate.description]
      : []
  };
}

const GAMES_NETWORK_RETRY_DELAYS_MS = [700, 1400];

async function runGamesSearch(query, translationInfo, requestToken, watchdogTimer, sessionNavToken, attempt = 0) {
  const banner = buildTranslationBanner(translationInfo);

  const response = await fetchGamesSearch(query);

  if (gamesSearchToken !== requestToken) return;

  if (!navIsTokenCurrent(sessionNavToken)) return;
  if (!selectionPopupEl) return;

  const isNetworkFailure = !!(response && response.ok === false && response.reason === 'network');

  if (isNetworkFailure && attempt < GAMES_NETWORK_RETRY_DELAYS_MS.length) {
    const nextAttempt = attempt + 1;
    updateSelectionPopup(
      `${banner}<div class="loading">Network error — retrying... (${nextAttempt}/${GAMES_NETWORK_RETRY_DELAYS_MS.length + 1})</div>`,
      false
    );
    setTimeout(() => {
      runGamesSearch(query, translationInfo, requestToken, watchdogTimer, sessionNavToken, nextAttempt);
    }, GAMES_NETWORK_RETRY_DELAYS_MS[attempt]);
    return;
  }

  if (
    !response ||
    !response.ok ||
    !Array.isArray(response.candidates) ||
    !response.candidates.length
  ) {
    clearTimeout(watchdogTimer);

    const message = isNetworkFailure
      ? 'No response from GameSpot (network error)'
      : 'No games found.';

    const retryButtonHtml = isNetworkFailure
      ? '<div><button class="qc-retry-btn">Retry</button></div>'
      : '';

    if (isNetworkFailure) {
      lastRetryFn = () => runGamesSearch(query, translationInfo, requestToken, watchdogTimer, sessionNavToken, 0);
    }

    updateSelectionPopup(`${banner}<div class="loading">${escapeHtml(message)}</div>${retryButtonHtml}`, false);
    return;
  }

  clearTimeout(watchdogTimer);

  if (response.candidates.length === 1) {
    await renderGameCard(response.candidates[0].id, banner);
    return;
  }

  showDisambiguationPicker(
    response.candidates,
    describeGameCandidate,
    (chosen) => {
      updateSelectionPopup(
        `${banner}<div class="loading">Loading...</div>`,
        false
      );

      renderGameCard(chosen.id, banner);
    },
    banner
  );
}

let gamesSearchToken = null;

async function gamesLaunchSearch(query, left, top) {
  if (!query) return;

  if (QUICKCARD_ABBREVIATION_PATTERN.test(query)) {
    const res = await quickcardResolveAbbreviation(query);
    if (res.type === 'direct' && res.title) {
      return runGamesLaunchSearch(res.title, left, top);
    }
    if (res.type === 'choices' && res.options && res.options.length) {
      setActivePack(GAMES_PACK_ID);
      showSelectionPopupAt(GAMES_THEME_CLASS, left, top, '<div class="loading">Searching...</div>', false);
      quickcardShowAbbreviationPicker(GAMES_THEME_CLASS, res.options, (title) => {
        runGamesLaunchSearch(title, left, top);
      }, query);
      return;
    }
  }

  return runGamesLaunchSearch(query, left, top);
}

async function runGamesLaunchSearch(query, left, top) {
  if (!query) return;

  setActivePack(GAMES_PACK_ID);

  showSelectionPopupAt(
    GAMES_THEME_CLASS,
    left,
    top,
    '<div class="loading">Searching...</div>',
    false
  );

  const requestToken = `${Date.now()}${Math.random()}`;
  gamesSearchToken = requestToken;

  const watchdogNavToken = navGuardToken();

  const watchdogTimer = setTimeout(() => {
    if (gamesSearchToken !== requestToken) return;
    if (!selectionPopupEl) return;

    if (!navIsTokenCurrent(watchdogNavToken)) return;
    logError('gamesLaunchSearch: watchdog fired - no result after 22s for', query);
    lastRetryFn = () => runGamesLaunchSearch(query, left, top);
    updateSelectionPopup(
      '<div class="loading">No response (took too long)</div><div><button class="qc-retry-btn">Retry</button></div>',
      false
    );
  }, 22000);

  const langCode = detectNonLatinLangCode(query);

  if (!langCode) {
    await runGamesSearch(query, null, requestToken, watchdogTimer, watchdogNavToken);
    return;
  }

  log('gamesLaunchSearch: non-Latin text detected, langCode=', langCode, 'query=', query);
  updateSelectionPopup('<div class="loading">Translating...</div>', false);

  translateSelectionText(query, langCode, async (res) => {
    if (gamesSearchToken !== requestToken) return;

    if (!navIsTokenCurrent(watchdogNavToken)) return;
    if (!selectionPopupEl) return;

    if (!res || !res.ok || !res.translatedText) {

      clearTimeout(watchdogTimer);
      if (res && res.networkError) {
        lastRetryFn = () => runGamesLaunchSearch(query, left, top);
        updateSelectionPopup('<div class="loading">Network error while translating</div><div><button class="qc-retry-btn">Retry</button></div>', false);
      } else {
        updateSelectionPopup(buildTranslationFailureHtml(query), false);
      }
      return;
    }

    const { text: cleanedTranslation, stillHasNonLatin } = cleanTranslatedText(res.translatedText);

    if (!cleanedTranslation) {
      logError('gamesLaunchSearch: translation became empty after cleanup for', query, '- showing manual entry');
      clearTimeout(watchdogTimer);
      updateSelectionPopup(buildTranslationFailureHtml(query), false);
      return;
    }

    const isLowConfidence =
      (typeof res.match === 'number' && res.match < TRANSLATION_CONFIDENCE_THRESHOLD) ||
      stillHasNonLatin;

    await runGamesSearch(cleanedTranslation, {
      original: query,
      translated: cleanedTranslation,
      lowConfidence: isLowConfidence
    }, requestToken, watchdogTimer, watchdogNavToken);
  });
}

function handleGamesExternalSearch(rawQuery, left, top) {
  const query = sanitizeSelectionText(rawQuery);
  if (!query) return;

  navClearHistory();
  gamesLaunchSearch(query, left, top);
}

function gamesNavigateById(kind, id) {
  if (!id) return;
  setActivePack(GAMES_PACK_ID);
  const path = /^https?:\/\//i.test(id) ? id : `/games/${String(id).replace(/^\/+|\/+$/g, '')}/`;
  renderGameCard(path, '');
}

function parseGameSpotUrl(href) {
  try {
    const u = new URL(href, location.href);
    if (u.hostname !== 'www.gamespot.com' && u.hostname !== 'gamespot.com') return null;

    if (!/^\/games\/[^/?#]+\/?$/i.test(u.pathname)) return null;
    u.protocol = 'https:';
    u.hostname = 'www.gamespot.com';
    u.search = '';
    u.hash = '';
    return { id: u.href };
  } catch (e) {
    return null;
  }
}

const GAMES_HOVER_CACHE = new Map();
function getGamesHoverCacheEntry(id) {
  if (!GAMES_HOVER_CACHE.has(id)) GAMES_HOVER_CACHE.set(id, {});
  return GAMES_HOVER_CACHE.get(id);
}

let gamesHoverTimer = null;

function attachGamesHover(anchor) {
  if (anchor.__quickcardGamesBound) return;
  const info = parseGameSpotUrl(anchor.href);
  if (!info) return;
  anchor.__quickcardGamesBound = true;

  anchor.addEventListener('mouseenter', () => {
    if (!coreSettings.featureLinkHover) return;

    clearTimeout(hoverHideTimer);
    clearTimeout(hoverRemoveTimer);
    clearTimeout(gamesHoverTimer);

    currentAnchor = anchor;

    gamesHoverTimer = setTimeout(() => {
      if (currentAnchor !== anchor) return;

      const myHoverToken = ++hoverRequestToken;
      setActivePack(GAMES_PACK_ID);

      const renderGamesHover = (skipCache) => {
        showPopup(GAMES_THEME_CLASS, anchor, '<div class="loading">Loading...</div>', false);

        const cacheEntry = getGamesHoverCacheEntry(info.id);
        if (!skipCache && cacheEntry.finalHtml) {
          if (myHoverToken === hoverRequestToken && hoverPopupEl) showPopup(GAMES_THEME_CLASS, anchor, cacheEntry.finalHtml, false);
          return;
        }

        fetchGamesDetails(info.id).then((response) => {
          if (myHoverToken !== hoverRequestToken || !hoverPopupEl) return;

          if (!response || !response.ok) {
            const error = response && response.error ? ` (${escapeHtml(response.error)})` : '';
            showPopup(GAMES_THEME_CLASS, anchor, `<div class="loading">Couldn't load that game${error}.</div>`, false);
            return;
          }

          const data = response.data;

          const html = buildGameHtml(data, {}, info.id);
          cacheEntry.finalHtml = html;
          if (myHoverToken !== hoverRequestToken || !hoverPopupEl) return;
          showPopup(GAMES_THEME_CLASS, anchor, html, false);
          if (data.image) {
            resolveImageUrl(data.image, (resolved) => {
              if (myHoverToken !== hoverRequestToken || !resolved) return;
              data.image = resolved;

              cacheEntry.finalHtml = buildGameHtml(data, {}, info.id);
              if (!hoverPopupEl || !hoverPopupEl.isConnected) return;
              const coverImg = hoverPopupEl.querySelector('img[data-qc-game-cover]');
              if (coverImg) coverImg.src = resolved;
            });
          }
        });
      };
      navSetRerenderFn(() => renderGamesHover(true));
      renderGamesHover(false);
    }, 350);
  });

  anchor.addEventListener('mouseleave', () => {
    clearTimeout(gamesHoverTimer);
    if (currentAnchor === anchor) currentAnchor = null;
    scheduleHoverHide();
  });
}

function scanGamesHoverLinks(root) {
  root.querySelectorAll('a[href*="gamespot.com"]').forEach(attachGamesHover);
}

function initGamesLinkObserver() {
  scanGamesHoverLinks(document);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;

        if (node.tagName === 'A') {
          attachGamesHover(node);
        } else if (node.querySelectorAll) {
          scanGamesHoverLinks(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

async function initGamesPackCore() {
  await loadGamesSettings();
  injectGamesTheme();

  registerPack({
    id: GAMES_PACK_ID,

    fullWidth: GAMES_FULL_CARD_WIDTH,

    noDrag: true,
    launchSearch: gamesLaunchSearch,
    handleExternalSearch: handleGamesExternalSearch,
    navigateById: gamesNavigateById,
    isAllowedOnThisSite: isGamesAllowedOnThisSite
  });
}

async function initGamesPack() {
  await initGamesPackCore();
  if (!isGamesAllowedForHoverOnThisSite()) return;
  initGamesLinkObserver();
}

