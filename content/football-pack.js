

const FOOTBALL_PACK_ID = 'football';
const FOOTBALL_THEME_CLASS = 'qc-theme-football';

const FOOTBALL_FULL_CARD_WIDTH = 526;

const FOOTBALL_DEFAULT_SETTINGS = {
  footballShowSofifaLink: true,
  footballShowFutbinLink: true,
  footballFieldHonours: true,
  footballFieldNationalTeamCareer: true,
  footballFieldClub: true,
  footballFieldPosition: true,
  footballFieldNationality: true,

  footballFieldDateOfBirth: true,
  footballFieldAge: true,
  footballFieldPhysical: true,
  footballFieldContract: true,
  footballFieldAgent: true,
  footballFieldMarketValue: true,

  footballFieldLastTransfer: true,

  footballFieldInjuryBadge: true,
  footballFieldLoanBadge: true,

  footballFieldCurrentSeasonStats: true,
  footballFieldCareerTotalStats: true,

  footballFieldTeamMarketValue: true,
  footballFieldTeamTopPlayers: true,
  footballFieldTeamTopPlayersPhotos: true,
  footballFieldTeamNextMatches: true,

  footballFieldTeamPrevMatches: true,

  footballFieldTeamHonours: true,

  footballFieldCoachContract: true,
  footballFieldCoachLicence: true,
  footballFieldCoachFormation: true,
  footballFieldCoachAvgTerm: true,
  footballFieldCoachAgent: true,

  footballFieldPlayerNextMatches: true,
  footballFieldPlayerPrevMatches: true,

  footballFieldFutRating: true,

  footballShowTransfermarktLink: true,
  footballShowWikipediaLink: true,
  footballShowOfficialSiteLink: true,

  footballShowSoccerwayLink: true,
  footballShowWhoscoredLink: true,

  footballShowYoutubeLink: true,
  footballCustomLinks: [],

  footballSiteFilterMode: 'blacklist',
  footballWhitelistSites: [],
  footballBlacklistSites: ['transfermarkt.com']
};

let footballSettings = { ...FOOTBALL_DEFAULT_SETTINGS };

async function loadFootballSettings() {
  const stored = await api.storage.local.get(FOOTBALL_DEFAULT_SETTINGS);

  footballSettings = {
    footballShowSofifaLink: stored.footballShowSofifaLink !== false,
    footballShowFutbinLink: stored.footballShowFutbinLink !== false,
    footballFieldHonours: stored.footballFieldHonours !== false,
    footballFieldNationalTeamCareer: stored.footballFieldNationalTeamCareer !== false,
    footballFieldClub: stored.footballFieldClub !== false,
    footballFieldPosition: stored.footballFieldPosition !== false,
    footballFieldNationality: stored.footballFieldNationality !== false,
    footballFieldDateOfBirth: stored.footballFieldDateOfBirth !== false,
    footballFieldAge: stored.footballFieldAge !== false,
    footballFieldPhysical: stored.footballFieldPhysical !== false,
    footballFieldContract: stored.footballFieldContract !== false,
    footballFieldAgent: stored.footballFieldAgent !== false,
    footballFieldMarketValue: stored.footballFieldMarketValue !== false,
    footballFieldLastTransfer: stored.footballFieldLastTransfer !== false,
    footballFieldInjuryBadge: stored.footballFieldInjuryBadge !== false,
    footballFieldLoanBadge: stored.footballFieldLoanBadge !== false,
    footballFieldCurrentSeasonStats: stored.footballFieldCurrentSeasonStats !== false,
    footballFieldCareerTotalStats: stored.footballFieldCareerTotalStats !== false,

    footballFieldTeamMarketValue: stored.footballFieldTeamMarketValue !== false,
    footballFieldTeamTopPlayers: stored.footballFieldTeamTopPlayers !== false,
    footballFieldTeamTopPlayersPhotos: stored.footballFieldTeamTopPlayersPhotos !== false,
    footballFieldTeamNextMatches: stored.footballFieldTeamNextMatches !== false,
    footballFieldTeamPrevMatches: stored.footballFieldTeamPrevMatches !== false,
    footballFieldTeamHonours: stored.footballFieldTeamHonours !== false,

    footballFieldCoachContract: stored.footballFieldCoachContract !== false,
    footballFieldCoachLicence: stored.footballFieldCoachLicence !== false,
    footballFieldCoachFormation: stored.footballFieldCoachFormation !== false,
    footballFieldCoachAvgTerm: stored.footballFieldCoachAvgTerm !== false,
    footballFieldCoachAgent: stored.footballFieldCoachAgent !== false,
    footballFieldPlayerNextMatches: stored.footballFieldPlayerNextMatches !== false,
    footballFieldPlayerPrevMatches: stored.footballFieldPlayerPrevMatches !== false,
    footballFieldFutRating: stored.footballFieldFutRating !== false,

    footballShowTransfermarktLink: stored.footballShowTransfermarktLink !== false,
    footballShowWikipediaLink: stored.footballShowWikipediaLink !== false,
    footballShowOfficialSiteLink: stored.footballShowOfficialSiteLink !== false,
    footballShowSoccerwayLink: stored.footballShowSoccerwayLink !== false,
    footballShowWhoscoredLink: stored.footballShowWhoscoredLink !== false,
    footballShowYoutubeLink: stored.footballShowYoutubeLink !== false,
    footballCustomLinks: Array.isArray(stored.footballCustomLinks)
      ? stored.footballCustomLinks.filter((l) => l && typeof l.urlTemplate === 'string' && l.urlTemplate.trim())
      : [],

    footballSiteFilterMode: stored.footballSiteFilterMode || 'blacklist',
    footballWhitelistSites: Array.isArray(stored.footballWhitelistSites) ? stored.footballWhitelistSites : [],
    footballBlacklistSites: Array.isArray(stored.footballBlacklistSites) ? stored.footballBlacklistSites : ['transfermarkt.com']
  };

  preloadCustomLinkIcons(footballSettings.footballCustomLinks);
  return footballSettings;
}

function isFootballAllowedOnThisSite() {
  return true;
}

function isFootballAllowedForHoverOnThisSite() {
  const ownRulesAllow = siteAllowedByRules({
    siteFilterMode: footballSettings.footballSiteFilterMode,
    whitelistSites: footballSettings.footballWhitelistSites,
    blacklistSites: footballSettings.footballBlacklistSites
  });
  if (!ownRulesAllow) return false;
  return isAllowedByGlobalSiteRules(FOOTBALL_PACK_ID, 'hover');
}

function injectFootballTheme() {
  const root = ensureUiRoot();
  if (root.getElementById('quickcard-football-theme')) return;

  const style = document.createElement('style');
  style.id = 'quickcard-football-theme';
  style.textContent = `
    .${FOOTBALL_THEME_CLASS} {
      background-color: #ffffff !important;
      background-image: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      border: 1px solid #eef0f3 !important;
      box-shadow: 0 10px 30px rgba(16,24,40,0.12) !important;
      color: #101828 !important;
    }


    .${FOOTBALL_THEME_CLASS}.qc-popup {
      cursor: default !important;
      user-select: text !important;
    }
    .${FOOTBALL_THEME_CLASS} button,
    .${FOOTBALL_THEME_CLASS} a,
    .${FOOTBALL_THEME_CLASS} .qc-fb-toggle-btn {
      cursor: pointer !important;
      user-select: none !important;
    }
    .${FOOTBALL_THEME_CLASS} img {
      -webkit-user-drag: none !important;
      user-select: none !important;
      cursor: default !important;
    }
    .${FOOTBALL_THEME_CLASS} .meta,
    .${FOOTBALL_THEME_CLASS} .name,
    .${FOOTBALL_THEME_CLASS} .qc-subtitle {
      color: #101828 !important;
    }
    .${FOOTBALL_THEME_CLASS} .meta b,
    .${FOOTBALL_THEME_CLASS} .qc-fact-value {
      color: #101828 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-subtitle,
    .${FOOTBALL_THEME_CLASS} .qc-stat-label,
    .${FOOTBALL_THEME_CLASS} .qc-icon-badge-label {
      color: #667085 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-link,
    .${FOOTBALL_THEME_CLASS} .qc-settings-link,
    .${FOOTBALL_THEME_CLASS} .qc-retry-btn {
      color: #1d4ed8 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-searchable:hover {
      color: #1d4ed8 !important;
      opacity: 1 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-link-icon {
      background: #f2f4f7 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-link-icon:hover {
      background: #e4e7ec !important;
    }
    .${FOOTBALL_THEME_CLASS} .closebar span {
      color: #101828 !important;
    }
    .${FOOTBALL_THEME_CLASS} .closebar span:hover {
      background: #f2f4f7 !important;
    }
    .${FOOTBALL_THEME_CLASS} .translation-note {
      color: #344054 !important;
      background: #f2f4f7 !important;
    }
    .${FOOTBALL_THEME_CLASS} .extra-error {
      color: #b91c1c !important;
    }
    .${FOOTBALL_THEME_CLASS} .extra-disabled {
      color: #7b7c82 !important;
    }
    .${FOOTBALL_THEME_CLASS} .pick-heading {
      color: #101828 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-pick-btn {
      background: #f8f9fb !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-pick-btn:hover {
      background: #f2f4f7 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-pick-btn .pick-title {
      color: #101828 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-pick-btn .pick-sub {
      color: #7b7c82 !important;
    }
    .${FOOTBALL_THEME_CLASS}.qc-selectbtn-icon {
      width: 25px;
      height: 25px;
    }


    .${FOOTBALL_THEME_CLASS}.qc-style-full {
      width: ${FOOTBALL_FULL_CARD_WIDTH}px !important;
      ${isRunningAsExtensionPage() ? '' : 'max-width: min(' + FOOTBALL_FULL_CARD_WIDTH + 'px, calc(100vw - 24px)) !important;'}
      box-sizing: border-box !important;
    }


    .${FOOTBALL_THEME_CLASS}.qc-popup img,
    .${FOOTBALL_THEME_CLASS} .qc-pick-btn img {
      width: 72px !important;
      height: 94px !important;
      min-width: 72px !important;
      min-height: 94px !important;
      border-radius: 10px !important;
      object-fit: cover !important;
    }
    .${FOOTBALL_THEME_CLASS}.qc-style-full .row > img {
      width: 96px !important;
      height: 125px !important;
      aspect-ratio: 300 / 390 !important;
      min-width: 96px !important;
      min-height: 125px !important;
      border-radius: 12px !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-football-badge {
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      padding: 3px 9px !important;
      border-radius: 999px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-football-badge.injury {
      background: #fee2e2 !important;
      color: #b91c1c !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-football-badge.suspend {
      background: #fef3c7 !important;
      color: #92400e !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-football-badge.loan {
      background: #e0e7ff !important;
      color: #3730a3 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-football-mv {
      font-weight: 800 !important;
      color: #1d4ed8 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-football-mv-trend.up {
      color: #12b76a !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-football-mv-trend.down {
      color: #f04438 !important;
    }
    .${FOOTBALL_THEME_CLASS}.qc-style-full .qc-fact-icon {
      background: #eef4ff !important;
    }
    .${FOOTBALL_THEME_CLASS}.qc-style-full .qc-divider {
      background: #eef0f3 !important;
    }




    .${FOOTBALL_THEME_CLASS} .qc-fb-tile:nth-child(1) .lbl::before { content: ''; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile:nth-child(2) .lbl::before { content: ''; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile .lbl {
      text-transform: none !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-club-line {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      color: #101828 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-club-line .qc-fb-club-crest {
      width: 24px !important;
      height: 24px !important;
      border-radius: 50% !important;
      object-fit: contain !important;
      background: #fff !important;
      border: 1px solid #eef0f3 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-position-line {
      font-size: 12px !important;
      color: #667085 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-meta-line {
      font-size: 12px !important;
      color: #344054 !important;
      line-height: 1.3 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-meta-line.small {
      font-size: 11px !important;
      color: #667085 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-info-grid-ref {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 12px !important;
      margin-top: 14px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-info-cell .lbl {
      font-size: 10.5px !important;
      color: #667085 !important;
      font-weight: 600 !important;
      display: flex !important;
      align-items: center !important;
      gap: 4px !important;
      margin-bottom: 2px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-info-cell .val {
      font-size: 13px !important;
      font-weight: 700 !important;
      color: #101828 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-contract-card {
      margin-top: 12px !important;
      background: #f8f9fb !important;
      border: 1px solid #eef0f3 !important;
      border-radius: 12px !important;
      padding: 10px 12px !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-contract-card .row {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      font-size: 12.5px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-contract-card .row .lbl {
      color: #667085 !important;
      font-weight: 600 !important;
      display: flex !important;
      align-items: center !important;
      gap: 5px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-contract-card .row .val {
      color: #101828 !important;
      font-weight: 700 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-section-title .blue-bar {
      display: inline-block !important;
      width: 3px !important;
      height: 14px !important;
      background: #1d4ed8 !important;
      border-radius: 2px !important;
      margin-right: 8px !important;
      vertical-align: middle !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-stats-wrapper {
      background: #fff !important;
      border: 1px solid #eef0f3 !important;
      border-radius: 12px !important;
      padding: 12px !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-stats-header {
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 8px !important;
      margin-bottom: 10px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-toggle {
      display: flex !important;
      background: #f2f4f7 !important;
      border-radius: 8px !important;
      padding: 2px !important;
      gap: 2px !important;
      align-self: flex-start !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-toggle-btn {
      border: none !important;
      background: transparent !important;
      padding: 5px 12px !important;
      border-radius: 6px !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      color: #667085 !important;
      cursor: pointer !important;
      transition: all 0.15s !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-toggle-btn.active {
      background: #fff !important;
      color: #101828 !important;
      box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-view-full {
      display: block !important;
      text-align: right !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      color: #1d4ed8 !important;
      margin-top: 8px !important;
      text-decoration: none !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-stats-table .comp-dot {
      display: inline-block !important;
      width: 6px !important;
      height: 6px !important;
      background: #1d4ed8 !important;
      border-radius: 50% !important;
      margin-right: 6px !important;
      vertical-align: middle !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-football-card {
      display: flex !important;
      flex-direction: column !important;
      gap: 14px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-photo-wrap {
      position: relative !important;
      flex: none !important;
      width: 96px !important;
      aspect-ratio: 300 / 390 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-photo-wrap .qc-fb-photo,
    .${FOOTBALL_THEME_CLASS} .qc-fb-photo-wrap .qc-fb-photo-fallback {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 96px !important;
      height: 125px !important;
      aspect-ratio: 300 / 390 !important;
      min-width: 96px !important;
      min-height: 125px !important;
      aspect-ratio: 300 / 390 !important;
      border-radius: 14px !important;
      object-fit: cover !important;
      object-position: top center !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-photo-fallback {
      background: #cbd2e0 !important;
      color: #ffffff !important;
      font-size: 22px !important;
      font-weight: 800 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-name {
      font-size: 19px !important;
      font-weight: 800 !important;
      color: #101828 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-club-line {
      display: flex !important;
      align-items: center !important;
      gap: 5px !important;
      font-size: 13px !important;
      font-weight: 650 !important;
      color: #344054 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-club-line .qc-fb-club-crest {
      width: 16px !important;
      height: 16px !important;
      object-fit: contain !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-position-line,
    .${FOOTBALL_THEME_CLASS} .qc-fb-nation-age,
    .${FOOTBALL_THEME_CLASS} .qc-fb-height-foot {
      font-size: 12px !important;
      color: #667085 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-status-badges {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 6px !important;
      margin-top: 4px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-badge {
      display: inline-flex !important;
      align-items: center !important;
      padding: 2px 8px !important;
      border-radius: 999px !important;
      font-size: 10.5px !important;
      font-weight: 700 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-badge.injury {
      background: #fee2e2 !important;
      color: #b91c1c !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-badge.suspend {
      background: #fef3c7 !important;
      color: #92400e !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-badge.loan {
      background: #e0e7ff !important;
      color: #3730a3 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile {
      padding: 10px 8px 8px !important;
      border-radius: 12px !important;
      background: #f8f9fb !important;
      border: 1px solid #f2f4f7 !important;
      text-align: center !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 64px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile .num {
      font-size: 16px !important;
      font-weight: 800 !important;
      color: #101828 !important;
      line-height: 1.1 !important;
      letter-spacing: -0.2px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile .lbl {
      margin-top: 4px !important;
      color: #667085 !important;
      font-size: 10px !important;
      font-weight: 600 !important;
      line-height: 1.2 !important;
      display: flex !important;
      align-items: center !important;
      gap: 3px !important;
      white-space: nowrap !important;
    }
    @media (max-width: 480px) {
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile {
      padding: 8px 6px !important;
      border-radius: 10px !important;
      background: #f8f9fb !important;
      text-align: center !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile .num {
      font-size: 15px !important;
      font-weight: 800 !important;
      color: #101828 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile .lbl {
      overflow: hidden !important;
      margin-top: 2px !important;
      color: #667085 !important;
      font-size: 9.5px !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-sep {
      margin: 2px 0 !important;
      border: none !important;
      border-top: 1px solid #eef0f3 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-mv-box,
    .${FOOTBALL_THEME_CLASS} .qc-fb-last-transfer {
      flex: 1 1 200px !important;
      padding: 10px 12px !important;
      border-radius: 12px !important;
      background: #f8f9fb !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-mv-box .title,
    .${FOOTBALL_THEME_CLASS} .qc-fb-last-transfer .title {
      margin-bottom: 4px !important;
      color: #667085 !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      letter-spacing: 0.3px !important;
      text-transform: uppercase !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-mv-box .value {
      color: #1d4ed8 !important;
      font-size: 18px !important;
      font-weight: 800 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-mv-box .updated {
      margin-top: 4px !important;
      color: #98a2b3 !important;
      font-size: 10.5px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-mv-box .details-link {
      display: inline-block !important;
      margin-top: 6px !important;
      color: #1d4ed8 !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-decoration: none !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-last-transfer .row {
      display: flex !important;
      justify-content: space-between !important;
      margin-top: 3px !important;
      font-size: 12px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-last-transfer .row span:first-child {
      color: #667085 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-last-transfer .row span.fee {
      color: #101828 !important;
      font-weight: 800 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-section-title {
      margin-bottom: 8px !important;
      color: #101828 !important;
      font-size: 12.5px !important;
      font-weight: 800 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-stats-table {
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 11.5px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-stats-table th {
      padding: 4px 6px !important;
      border-bottom: 1px solid #eef0f3 !important;
      color: #98a2b3 !important;
      font-size: 10px !important;
      font-weight: 700 !important;
      text-align: left !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-stats-table td {
      padding: 5px 6px !important;
      border-bottom: 1px solid #f5f6f8 !important;
      color: #344054 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-stats-table th:not(:first-child),
    .${FOOTBALL_THEME_CLASS} .qc-fb-stats-table td:not(:first-child) {
      text-align: center !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-stats-table tr.total td {
      border-top: 1px solid #eef0f3 !important;
      color: #101828 !important;
      font-weight: 800 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-footer {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
      margin-top: 14px !important;
      padding-top: 12px !important;
      border-top: 1px solid #eef0f3 !important;
      align-items: center !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-footer .qc-link-icon,
    .${FOOTBALL_THEME_CLASS} .qc-footer-strip .qc-link-icon,
    .${FOOTBALL_THEME_CLASS} .qc-link-icon {
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      min-height: 32px !important;
      border-radius: 10px !important;
      padding: 0 !important;
      margin: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: #f1f2f4 !important;
      overflow: hidden !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-link-icon:hover {
      background: #e7e8ec !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-link-icon img {
      width: 18px !important;
      height: 18px !important;
      min-width: 18px !important;
      min-height: 18px !important;
      max-width: 18px !important;
      max-height: 18px !important;
      object-fit: contain !important;
      border: none !important;
      background: transparent !important;
      border-radius: 0 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-footer,
    .${FOOTBALL_THEME_CLASS} .qc-footer-strip {
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 8px !important;
    }


    .${FOOTBALL_THEME_CLASS} .qc-fb-tile:nth-child(1) .lbl::before { content: ''; }

    .${FOOTBALL_THEME_CLASS} .qc-football-card {
      overflow: hidden !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-name {
      line-height: 1.2 !important;
      word-break: break-word !important;
    }

.${FOOTBALL_THEME_CLASS} .qc-fb-header-v3 {
  display: flex !important; align-items: flex-start !important;
  gap: 14px !important; width: 100% !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-header-v3 .qc-fb-photo-wrap { flex: none !important; width: 96px !important; }
.${FOOTBALL_THEME_CLASS} .qc-fb-head-info {
  flex: 1 !important; min-width: 0 !important;
  display: flex !important; flex-direction: column !important; gap: 4px !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-head-info .qc-fb-player-name {
  font-size: 19px !important; font-weight: 800 !important;
  color: #101828 !important; line-height: 1.2 !important; word-break: break-word !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-club-line {
  display: flex !important; align-items: center !important; gap: 6px !important;
  font-size: 13px !important; font-weight: 700 !important; color: #101828 !important; min-width: 0 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-club-line > span {
  overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-head-info .qc-fb-club-line .qc-fb-club-crest,
.${FOOTBALL_THEME_CLASS} .qc-fb-club-line img {
  width: 20px !important; height: 20px !important;
  min-width: 20px !important; min-height: 20px !important;
  max-width: 20px !important; max-height: 20px !important;
  border-radius: 50% !important; object-fit: contain !important;
  background: #fff !important; border: 1px solid #eef0f3 !important; flex: none !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-head-info .qc-fb-position-line {
  font-size: 12px !important; color: #344054 !important; font-weight: 600 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-head-info .qc-fb-meta-line {
  font-size: 11.5px !important; color: #667085 !important; line-height: 1.5 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-stat-tiles-row {
  display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: 8px !important; margin-top: 14px !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-stat-tiles-row .qc-fb-tile { min-height: 62px !important; padding: 10px 6px 8px !important; }
.${FOOTBALL_THEME_CLASS} .qc-fb-stat-tiles-row .qc-fb-tile .lbl { white-space: nowrap !important; font-size: 9.5px !important; }
.${FOOTBALL_THEME_CLASS} .qc-fb-boxes-row { display: flex !important; gap: 12px !important; margin-top: 12px !important; flex-wrap: wrap !important; }
.${FOOTBALL_THEME_CLASS} .qc-fb-boxes-row > * { flex: 1 1 200px !important; min-width: 0 !important; }
@media (max-width: 480px) {
  .${FOOTBALL_THEME_CLASS} .qc-fb-stat-tiles-row { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
}

.${FOOTBALL_THEME_CLASS} .qc-fb-honours-row {
display: flex !important; flex-wrap: wrap !important; gap: 6px !important; margin-top: 4px !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-honour {
display: inline-flex !important; align-items: center !important; gap: 3px !important;
background: #fffbeb !important; border: 1px solid #fde68a !important; border-radius: 999px !important;
padding: 2px 7px !important; cursor: default !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-honour img {
width: 14px !important; height: 14px !important; min-width: 0 !important; min-height: 0 !important;
object-fit: contain !important; border-radius: 0 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-honour b { font-size: 10px !important; color: #92400e !important; }
.${FOOTBALL_THEME_CLASS} .qc-fb-flag {
width: 16px !important; height: 11px !important; min-width: 0 !important; min-height: 0 !important;
object-fit: cover !important; border-radius: 2px !important; margin-right: 4px !important;
vertical-align: middle !important; display: inline-block !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-nt-career td.team {
display: flex !important; align-items: center !important; gap: 6px !important; text-align: left !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-nt-career .nt-flag {
width: 18px !important; height: 13px !important; min-width: 0 !important; min-height: 0 !important;
object-fit: cover !important; border-radius: 2px !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-nt-career tr.current td { background: #f0f9ff !important; }

.${FOOTBALL_THEME_CLASS}.qc-popup img.qc-fb-flag,
.${FOOTBALL_THEME_CLASS} .qc-fb-info-grid-ref img.qc-fb-flag {
width: 18px !important; height: 13px !important;
min-width: 18px !important; min-height: 13px !important;
max-width: 18px !important; max-height: 13px !important;
object-fit: cover !important; border-radius: 2px !important;
margin-right: 4px !important; vertical-align: middle !important;
display: inline-block !important;
}
.${FOOTBALL_THEME_CLASS}.qc-popup img.nt-flag,
.${FOOTBALL_THEME_CLASS} .qc-fb-nt-career img.nt-flag {
width: 18px !important; height: 13px !important;
min-width: 18px !important; min-height: 13px !important;
max-width: 18px !important; max-height: 13px !important;
object-fit: cover !important; border-radius: 2px !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-honours-row {
display: flex !important; flex-wrap: wrap !important; align-items: center !important;
gap: 10px !important; margin: 2px 0 !important;
}

.${FOOTBALL_THEME_CLASS} .qc-fb-mini-section-title {
font-size: 10px !important; font-weight: 750 !important; color: #69707e !important;
text-transform: uppercase !important; letter-spacing: 0.04em !important;
margin: 6px 0 2px !important;
}

.${FOOTBALL_THEME_CLASS} .qc-fb-mini-player-sub {
display: flex !important; flex-wrap: wrap !important; align-items: center !important;
gap: 4px 6px !important; font-size: 11px !important; color: #667085 !important;
margin: 2px 0 6px !important; line-height: 1.4 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-fut-rating {
font-weight: 800 !important; color: #101828 !important;
background: none !important; border: none !important; padding: 0 !important;
border-radius: 0 !important; white-space: nowrap !important;
}
.${FOOTBALL_THEME_CLASS}.qc-popup img.qc-fb-mini-nat-flag,
.${FOOTBALL_THEME_CLASS} img.qc-fb-mini-nat-flag {
width: 18px !important; height: 13px !important;
min-width: 18px !important; min-height: 13px !important;
max-width: 18px !important; max-height: 13px !important;
object-fit: cover !important; border-radius: 2px !important;
margin-right: 0 !important; vertical-align: middle !important;
display: inline-block !important;
}
.${FOOTBALL_THEME_CLASS}.qc-popup img.qc-fb-mini-league-icon,
.${FOOTBALL_THEME_CLASS} img.qc-fb-mini-league-icon {
width: 16px !important; height: 16px !important;
min-width: 16px !important; min-height: 16px !important;
max-width: 16px !important; max-height: 16px !important;
object-fit: contain !important; border-radius: 3px !important;
vertical-align: middle !important; display: inline-block !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-season-wrap { margin-top: 6px !important; }
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-season-strip {
display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
gap: 6px !important; margin-top: 4px !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-season-stat {
display: inline-flex !important; flex-direction: column !important; align-items: center !important;
gap: 1px !important; background: #f8f9fb !important; border: 1px solid #eef0f3 !important;
border-radius: 8px !important; padding: 6px 4px !important; min-width: 0 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-season-stat b {
font-size: 14px !important; font-weight: 800 !important; color: #101828 !important;
line-height: 1.1 !important; white-space: nowrap !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-season-stat-label {
font-size: 9.5px !important; font-weight: 600 !important; color: #667085 !important;
line-height: 1.2 !important; white-space: nowrap !important;
}

.${FOOTBALL_THEME_CLASS} .qc-fb-mini-squad-list {
display: flex !important; flex-direction: column !important; gap: 3px !important;
margin-top: 4px !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-squad-row {
display: flex !important; align-items: center !important; gap: 8px !important;
font-size: 12px !important; line-height: 1.4 !important; min-width: 0 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-squad-num {
flex: none !important; width: 26px !important; text-align: right !important;
font-weight: 800 !important; color: #98a2b3 !important; font-size: 11px !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-squad-num-empty { opacity: 0.5 !important; }
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-squad-name {
min-width: 0 !important; overflow: hidden !important; text-overflow: ellipsis !important;
white-space: nowrap !important; color: #101828 !important; font-weight: 600 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-mini-squad-details { margin-top: 4px !important; }

.${FOOTBALL_THEME_CLASS}.qc-popup img.qc-fb-mini-team-flag,
.${FOOTBALL_THEME_CLASS} img.qc-fb-mini-team-flag {
width: 18px !important; height: 13px !important;
min-width: 18px !important; min-height: 13px !important;
max-width: 18px !important; max-height: 13px !important;
object-fit: cover !important; border-radius: 2px !important;
margin-right: 4px !important; vertical-align: middle !important;
display: inline-block !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-honour {
display: inline-flex !important; align-items: center !important; gap: 3px !important;
background: none !important; border: none !important; padding: 0 !important;
cursor: default !important;
}
.${FOOTBALL_THEME_CLASS}.qc-popup img.qc-fb-honour-img,
.${FOOTBALL_THEME_CLASS} .qc-fb-honour img.qc-fb-honour-img {
width: 22px !important; height: 22px !important;
min-width: 22px !important; min-height: 22px !important;
max-width: 22px !important; max-height: 22px !important;
object-fit: contain !important; border-radius: 0 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-honour-emoji { font-size: 16px !important; line-height: 1 !important; }
.${FOOTBALL_THEME_CLASS} .qc-fb-honour b {
font-size: 10px !important; color: #667085 !important; font-weight: 700 !important;
}

.${FOOTBALL_THEME_CLASS}.qc-popup img.comp-logo,
.${FOOTBALL_THEME_CLASS} .qc-fb-stats-table img.comp-logo {
width: 16px !important; height: 16px !important;
min-width: 16px !important; min-height: 16px !important;
max-width: 16px !important; max-height: 16px !important;
object-fit: contain !important; border-radius: 3px !important;
flex: none !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-stats-table td.comp-cell {
display: flex !important; align-items: center !important;
gap: 6px !important; text-align: left !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-joined-line,
.${FOOTBALL_THEME_CLASS} .qc-fb-foot-line {
font-size: 11.5px !important; color: #667085 !important; line-height: 1.5 !important;
}

.${FOOTBALL_THEME_CLASS} .qc-fb-head-info { gap: 5px !important; }
.${FOOTBALL_THEME_CLASS} .qc-fb-head-info .qc-fb-meta-line {
font-size: 12px !important; line-height: 1.55 !important; color: #475467 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-head-info .qc-fb-meta-line.small {
font-size: 11.5px !important; line-height: 1.55 !important;
}
.${FOOTBALL_THEME_CLASS} .qc-fb-head-info .qc-fb-club-line { margin-bottom: 1px !important; }


    .${FOOTBALL_THEME_CLASS} .qc-football-card-new {
      display: flex !important;
      flex-direction: column !important;
      gap: 0 !important;
      padding: 16px 16px 12px !important;
      background: #fff !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-top-new {
      display: flex !important;
      gap: 16px !important;
      align-items: flex-start !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-photo-col-new {
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
      flex: none !important;
      width: 132px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-photo-wrap-new {
      position: relative !important;
      width: 132px !important;
      height: 148px !important;
      border-radius: 16px !important;
      overflow: hidden !important;
      background: #f2f4f7 !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-photo-wrap-new .qc-fb-photo,
    .${FOOTBALL_THEME_CLASS} .qc-fb-photo-wrap-new img.qc-fb-photo {
      width: 132px !important;
      height: 148px !important;
      min-width: 132px !important;
      min-height: 148px !important;
      border-radius: 16px !important;
      object-fit: cover !important;
      display: block !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-photo-wrap-new .qc-fb-photo-fallback {
      width: 132px !important;
      height: 148px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-weight: 800 !important;
      font-size: 32px !important;
      background: #eef2ff !important;
      color: #1d4ed8 !important;
      border-radius: 16px !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-squad-num {
      position: absolute !important;
      bottom: 4px !important;
      right: 4px !important;
      min-width: 24px !important;
      height: 24px !important;
      padding: 0 5px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 999px !important;
      background: #1d4ed8 !important;
      color: #fff !important;
      font-size: 12.5px !important;
      font-weight: 800 !important;
      line-height: 1 !important;
      border: 2px solid #ffffff !important;
      box-shadow: 0 2px 6px rgba(16, 24, 40, 0.28) !important;
      z-index: 2 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-loan-pill {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      color: #1d4ed8 !important;
      background: #eef4ff !important;
      border: 1px solid #c7d2fe !important;
      border-radius: 999px !important;
      padding: 6px 10px !important;
      line-height: 1.2 !important;
      text-align: center !important;
      white-space: normal !important;
      word-break: break-word !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-main-col-new {
      flex: 1 !important;
      min-width: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-name-new {
      font-size: 22px !important;
      font-weight: 800 !important;
      color: #101828 !important;
      line-height: 1.2 !important;
      letter-spacing: -0.02em !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-honours-row-new {
      display: flex !important;
      gap: 12px !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      margin-top: 2px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-honour-new {
      display: inline-flex !important;
      align-items: center !important;
      gap: 4px !important;
      font-size: 12px !important;
      color: #475467 !important;
      font-weight: 600 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-honour-new img {
      width: 18px !important;
      height: 18px !important;
      min-width: 18px !important;
      min-height: 18px !important;
      object-fit: contain !important;
      border-radius: 0 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-club-pill {
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      background: #f8f9fb !important;
      border: 1px solid #eef0f3 !important;
      border-radius: 999px !important;
      padding: 5px 12px 5px 6px !important;
      font-size: 13px !important;
      font-weight: 700 !important;
      color: #101828 !important;
      width: fit-content !important;
      max-width: 100% !important;
      margin-top: 2px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-club-pill .qc-fb-club-crest {
      width: 22px !important;
      height: 22px !important;
      min-width: 22px !important;
      min-height: 22px !important;
      border-radius: 50% !important;
      object-fit: contain !important;
      background: #fff !important;
      border: 1px solid #eef0f3 !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-club-row {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 8px !important;
      width: 100% !important;
      margin-top: 2px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-club-row .qc-fb-club-pill {
      margin-top: 0 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-fut-rating {
      display: inline-flex !important;
      align-items: center !important;
      background: #0b8a3d !important;
      color: #fff !important;
      font-size: 11px !important;
      font-weight: 800 !important;
      border-radius: 999px !important;
      padding: 3px 9px !important;
      white-space: nowrap !important;
      flex-shrink: 0 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-info-2col-new {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 8px 16px !important;
      margin-top: 6px !important;
      padding-top: 8px !important;
      border-top: 1px solid #f2f4f7 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-info-item-new {
      display: flex !important;
      flex-direction: column !important;
      gap: 2px !important;
      min-width: 0 !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-info-item-new .lbl {
      font-size: 10.5px !important;
      font-weight: 700 !important;
      color: #98a2b3 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.04em !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-info-item-new .val {
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #1d2939 !important;
      line-height: 1.35 !important;
      overflow-wrap: break-word !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-info-item-new .qc-fb-flag-inline {
      width: 18px !important;
      height: 12px !important;
      min-width: 18px !important;
      min-height: 12px !important;
      border-radius: 2px !important;
      object-fit: cover !important;
      margin-right: 4px !important;
      vertical-align: middle !important;
      display: inline-block !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-stub-note {
      margin-top: 12px !important;
      padding-top: 10px !important;
      border-top: 1px solid #f2f4f7 !important;
      font-size: 11px !important;
      color: #98a2b3 !important;
      font-style: italic !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-coach-raw-dump {
      margin: 0 16px 12px !important;
      padding: 10px !important;
      background: #0b1220 !important;
      color: #d1e2f5 !important;
      border-radius: 8px !important;
      font-size: 10.5px !important;
      line-height: 1.5 !important;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
      white-space: pre-wrap !important;
      word-break: break-word !important;
      max-height: 320px !important;
      overflow-y: auto !important;
      user-select: text !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-injury-wrap {
      display: flex !important;
      justify-content: center !important;
      margin-top: 10px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-injury-pill {
      display: inline-flex !important;
      align-items: center !important;
      font-size: 11.5px !important;
      font-weight: 600 !important;
      color: #b42318 !important;
      background: #fef3f2 !important;
      border: 1px solid #fecdca !important;
      border-radius: 999px !important;
      padding: 6px 12px !important;
      line-height: 1.2 !important;
      text-align: center !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-stat-tiles-new {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 8px !important;
      margin-top: 14px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile-new {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 4px !important;
      background: #ffffff !important;
      border: 1px solid #eef0f3 !important;
      border-radius: 12px !important;
      padding: 10px 6px 8px !important;
      text-align: center !important;
      transition: all 0.15s !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile-new:hover {
      border-color: #d0d5dd !important;
      box-shadow: 0 2px 8px rgba(16,24,40,0.06) !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile-new .icon {
      font-size: 18px !important;
      line-height: 1 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile-new .txt {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 1px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile-new .num {
      font-size: 18px !important;
      font-weight: 800 !important;
      color: #101828 !important;
      line-height: 1.1 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-tile-new .lbl {
      font-size: 11px !important;
      font-weight: 500 !important;
      color: #667085 !important;
      line-height: 1.2 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-sep {
      border: none !important;
      border-top: 1px solid #eef0f3 !important;
      margin: 14px 0 0 !important;
    }


    .${FOOTBALL_THEME_CLASS} .qc-football-team-card {
      padding: 0 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-header {
      display: flex !important;
      gap: 16px !important;
      align-items: flex-start !important;
      padding: 16px 16px 0 !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-team-crest-col {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 8px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-honours-row.qc-fb-team-honours-row {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
      justify-content: flex-start !important;
      margin-top: 22px !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-team-crest-wrap {
      width: 64px !important;
      height: 64px !important;
      flex: none !important;
      border-radius: 12px !important;
      background: #f8f9fb !important;
      border: 1px solid #eef0f3 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: hidden !important;
    }
    .${FOOTBALL_THEME_CLASS} img.qc-fb-team-crest,
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-crest {
      width: 64px !important;
      height: 64px !important;
      min-width: 64px !important;
      min-height: 64px !important;
      object-fit: contain !important;
      border-radius: 12px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-crest-fallback,
    .${FOOTBALL_THEME_CLASS} .qc-fb-photo-fallback.qc-fb-team-crest-fallback {
      width: 64px !important;
      height: 64px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-weight: 800 !important;
      font-size: 20px !important;
      color: #fff !important;
      background: linear-gradient(135deg,#1e3a8a,#2563eb) !important;
      border-radius: 12px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-main {
      flex: 1 !important;
      min-width: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-league-row {
      font-size: 13px !important;
      color: #475467 !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-league-row b {
      color: #101828 !important;
      font-weight: 600 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-mv-block {
      margin-top: 6px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-mv-label {
      font-size: 11px !important;
      color: #667085 !important;
      font-weight: 600 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-mv-value {
      font-size: 20px !important;
      font-weight: 800 !important;
      color: #1d4ed8 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-overview-panel {
      border-left: 3px solid #1d4ed8 !important;
      padding-left: 14px !important;
      min-width: 200px !important;
      flex: none !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-overview-title {
      font-weight: 700 !important;
      font-size: 13px !important;
      color: #101828 !important;
      margin-bottom: 10px !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-overview-title .blue-bar {
      display: inline-block !important;
      width: 3px !important;
      height: 14px !important;
      background: #1d4ed8 !important;
      border-radius: 2px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-overview-grid {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 10px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-overview-item {
      text-align: center !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-overview-item .icon {
      font-size: 16px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-overview-item .num {
      font-size: 14px !important;
      font-weight: 800 !important;
      color: #101828 !important;
      margin-top: 2px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-overview-item .lbl {
      font-size: 10px !important;
      color: #667085 !important;
      margin-top: 2px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-info-row {
      display: flex !important;
      gap: 20px !important;
      flex-wrap: wrap !important;
      font-size: 13px !important;
      padding: 12px 16px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-info-item {
      display: flex !important;
      flex-direction: column !important;
      gap: 2px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-info-item .lbl {
      color: #98a2b3 !important;
      font-size: 11px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-info-item .val {
      font-weight: 600 !important;
      color: #101828 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-section-title {
      font-weight: 700 !important;
      font-size: 14px !important;
      color: #101828 !important;
      margin: 16px 16px 10px !important;
      border-left: 3px solid #1d4ed8 !important;
      padding-left: 10px !important;
      display: flex !important;
      align-items: center !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-section-title .blue-bar { display: none !important; }
    .${FOOTBALL_THEME_CLASS} table.qc-fb-team-players-table {
      width: calc(100% - 32px) !important;
      margin: 0 16px !important;
      border-collapse: collapse !important;
      font-size: 12.5px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-players-table th {
      text-align: left !important;
      color: #98a2b3 !important;
      font-weight: 600 !important;
      padding: 6px 4px !important;
      border-bottom: 1px solid #eef0f3 !important;
      font-size: 11px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-players-table td {
      padding: 8px 4px !important;
      border-bottom: 1px solid #f5f6f8 !important;
      vertical-align: middle !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-player-cell {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }
    .${FOOTBALL_THEME_CLASS} img.qc-fb-team-avatar,
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-avatar {
      width: 28px !important;
      height: 36px !important;
      min-width: 28px !important;
      min-height: 36px !important;
      border-radius: 20% !important;
      object-fit: cover !important;
      flex-shrink: 0 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-avatar-fallback {
      width: 34px !important;
      height: 34px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: linear-gradient(135deg,#94a3b8,#475569) !important;
      color: #fff !important;
      font-weight: 700 !important;
      font-size: 12px !important;
      flex-shrink: 0 !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-team-avatar-wrap {
      position: relative !important;
      width: 34px !important;
      height: 34px !important;
      flex-shrink: 0 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-avatar-num {
      position: absolute !important;
      bottom: -2px !important;
      right: -2px !important;
      min-width: 15px !important;
      height: 15px !important;
      padding: 0 3px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 999px !important;
      background: #1d4ed8 !important;
      color: #fff !important;
      font-size: 9px !important;
      font-weight: 800 !important;
      line-height: 1 !important;
      border: 1.5px solid #ffffff !important;
      box-shadow: 0 1px 3px rgba(16, 24, 40, 0.3) !important;
      z-index: 2 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-player-name {
      font-weight: 700 !important;
      color: #101828 !important;
      font-size: 13px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-player-role {
      font-size: 11px !important;
      color: #98a2b3 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-pos-tag {
      font-size: 11px !important;
      font-weight: 700 !important;
      padding: 2px 8px !important;
      border-radius: 6px !important;
      background: #e0e7ff !important;
      color: #3730a3 !important;
      white-space: nowrap !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-mv-cell {
      font-weight: 700 !important;
      color: #1d4ed8 !important;
      white-space: nowrap !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-view-all {
      display: block !important;
      text-align: center !important;
      font-size: 13px !important;
      color: #1d4ed8 !important;
      font-weight: 600 !important;
      margin: 12px 16px 0 !important;
      text-decoration: none !important;
      padding: 8px !important;
      border: 1px solid #eef0f3 !important;
      border-radius: 8px !important;
      background: #f8f9fb !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-view-all:hover {
      background: #eef4ff !important;
      border-color: #c7d2fe !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-matches-grid {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 8px !important;
      margin: 0 16px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-card {
      text-align: center !important;
      font-size: 11.5px !important;
      color: #475467 !important;
      padding: 10px 4px !important;
      background: #f8f9fb !important;
      border-radius: 10px !important;
      border: 1px solid #eef0f3 !important;
    }
    .${FOOTBALL_THEME_CLASS} img.qc-fb-team-match-badge,
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-badge {
      width: 34px !important;
      height: 34px !important;
      min-width: 34px !important;
      min-height: 34px !important;
      border-radius: 8px !important;
      object-fit: contain !important;
      margin: 0 auto 6px !important;
      display: block !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-badge-fallback {
      width: 34px !important;
      height: 34px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 auto 6px !important;
      background: linear-gradient(135deg,#64748b,#334155) !important;
      color: #fff !important;
      font-weight: 700 !important;
      font-size: 11px !important;
      border-radius: 8px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-opp {
      font-weight: 700 !important;
      color: #101828 !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 100% !important;
      display: block !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-card .qc-fb-team-match-opp .qc-nav-link {
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      display: inline-block !important;
      max-width: 100% !important;
      vertical-align: bottom !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-comp,
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-date {
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-card {
      min-width: 0 !important;
      overflow: hidden !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-matches-grid {
      align-items: start !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-comp {
      color: #98a2b3 !important;
      font-size: 10px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-date {
      font-weight: 600 !important;
      margin-top: 2px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-footer-links {
      margin: 16px 16px 12px !important;
      padding-top: 12px !important;
      border-top: 1px solid #eef0f3 !important;
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
      justify-content: center !important;
      align-items: center !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-team-footer-links .qc-link-icon {
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      min-height: 32px !important;
      border-radius: 10px !important;
      padding: 0 !important;
      border: none !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: .2s !important;
      background: #f1f2f4 !important;
      cursor: pointer !important;
      margin: 0 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-footer-links .qc-link-icon img {
      width: 18px !important;
      height: 18px !important;
      max-width: 18px !important;
      max-height: 18px !important;
      object-fit: contain !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-footer-links {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
      align-items: center !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-footer-links .qc-link-icon:hover {
      border-color: #d0d5dd !important;
      background: #f9fafb !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-team-footer-links .qc-link:not(.qc-link-icon) {
      font-size: 11px !important;
      color: #667085 !important;
      text-decoration: none !important;
      display: flex !important;
      align-items: center !important;
      gap: 5px !important;
      padding: 5px 10px !important;
      border: 1px solid #eef0f3 !important;
      border-radius: 20px !important;
      background: #fff !important;
      cursor: pointer !important;
      transition: .2s !important;
    }

    .${FOOTBALL_THEME_CLASS}.qc-popup img.qc-fb-flag.qc-fb-team-country-flag,
    .${FOOTBALL_THEME_CLASS} img.qc-fb-flag.qc-fb-team-country-flag,
    .${FOOTBALL_THEME_CLASS} .qc-fb-flag.qc-fb-team-country-flag {
      width: 20px !important;
      height: 14px !important;
      min-width: 20px !important;
      min-height: 14px !important;
      max-width: 20px !important;
      max-height: 14px !important;
      object-fit: cover !important;
      border-radius: 2px !important;
      margin-right: 4px !important;
      vertical-align: middle !important;
      display: inline-block !important;
    }
    .${FOOTBALL_THEME_CLASS}.qc-popup img.qc-fb-team-league-icon,
    .${FOOTBALL_THEME_CLASS} img.qc-fb-team-league-icon,
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-league-icon {
      width: 22px !important;
      height: 22px !important;
      min-width: 22px !important;
      min-height: 22px !important;
      max-width: 22px !important;
      max-height: 22px !important;
      object-fit: contain !important;
      border-radius: 4px !important;
      margin-right: 4px !important;
      vertical-align: middle !important;
      display: inline-block !important;
      background: #fff !important;
      border: 1px solid #eef0f3 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-flag.qc-fb-manager-flag {
      width: 18px !important;
      height: 13px !important;
      min-width: 18px !important;
      min-height: 13px !important;
      border-radius: 2px !important;
      margin-right: 6px !important;
      vertical-align: middle !important;
      display: inline-block !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-matches-future-grid {
      grid-template-columns: repeat(5, 1fr) !important;
      gap: 6px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-matches-past-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-card.qc-fb-team-match-future {
      padding: 6px 4px !important;
      font-size: 10.5px !important;
      background: #f8f9fb !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-card.qc-fb-team-match-past {
      padding: 12px 6px !important;
      background: #ffffff !important;
      border: 1.5px solid #eef0f3 !important;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04) !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-card.qc-fb-team-match-past .qc-fb-team-match-result {
      font-size: 18px !important;
      font-weight: 800 !important;
      color: #101828 !important;
      line-height: 1 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-card.qc-fb-team-match-past .qc-fb-team-match-opp-past {
      font-size: 13px !important;
      font-weight: 700 !important;
      margin-top: 6px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-card .qc-fb-team-match-link {
      text-decoration: none !important;
      color: inherit !important;
      display: block !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-match-card .qc-fb-team-match-link:hover {
      opacity: 0.9 !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-team-header {
      display: flex !important;
      gap: 16px !important;
      align-items: flex-start !important;
      flex-wrap: nowrap !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-main {
      flex: 1 1 0 !important;
      min-width: 0 !important;
      overflow: hidden !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-main .qc-fb-player-name-new {
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 100% !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-right-col {
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
      min-width: 200px !important;
      max-width: 220px !important;
      flex: none !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-team-manager-card {
      margin: 12px 16px !important;
      padding: 10px 12px !important;
      background: #f8f9fb !important;
      border: 1px solid #eef0f3 !important;
      border-left: 3px solid #1d4ed8 !important;
      border-radius: 8px !important;
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 10px !important;
    }

    .${FOOTBALL_THEME_CLASS} .qc-fb-team-manager-photo {
      width: 48px !important;
      height: 48px !important;
      min-width: 48px !important;
      min-height: 48px !important;
      max-width: 48px !important;
      max-height: 48px !important;
      flex: none !important;
      border-radius: 8px !important;
      object-fit: cover !important;
      background: #eef0f3 !important;
      border: 1px solid #eef0f3 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-manager-text {
      display: flex !important;
      flex-direction: column !important;
      gap: 4px !important;
      min-width: 0 !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-manager-card .lbl {
      color: #98a2b3 !important;
      font-size: 11px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-team-manager-card .val {
      font-weight: 700 !important;
      color: #101828 !important;
      display: flex !important;
      align-items: center !important;
      font-size: 13px !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-squad-hidden {
      display: none !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-squad-hidden.qc-fb-squad-visible {
      display: table-row-group !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-squad-toggle-btn {
      display: block !important;
      width: calc(100% - 32px) !important;
      margin: 8px 16px 0 !important;
      padding: 8px !important;
      background: #f8f9fb !important;
      border: 1px solid #eef0f3 !important;
      border-radius: 8px !important;
      color: #1d4ed8 !important;
      font-weight: 600 !important;
      font-size: 12px !important;
      cursor: pointer !important;
      text-align: center !important;
    }
    .${FOOTBALL_THEME_CLASS} .qc-fb-squad-toggle-btn:hover {
      background: #eef4ff !important;
      border-color: #c7d2fe !important;
    }


    .${FOOTBALL_THEME_CLASS} .qc-fb-player-matches-grid { display: grid !important; margin: 0 16px !important; gap: 6px !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-matches-future-grid { grid-template-columns: repeat(5, 1fr) !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-matches-past-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-section-title { font-weight: 700 !important; font-size: 14px !important; color: #101828 !important; margin: 16px 16px 10px !important; border-left: 3px solid #1d4ed8 !important; padding-left: 10px !important; display: flex !important; align-items: center !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-card { background: #f8f9fb !important; border: 1px solid #eef0f3 !important; border-radius: 12px !important; padding: 8px 6px !important; text-align: center !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-card:hover { background: #f2f4f7 !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-link { text-decoration: none !important; display: flex !important; flex-direction: column !important; gap: 4px !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-both { display: flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-team-side { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 3px !important; flex: 1 !important; min-width: 0 !important; }
    .${FOOTBALL_THEME_CLASS}.qc-popup img.qc-fb-player-match-badge,
    .${FOOTBALL_THEME_CLASS} img.qc-fb-player-match-badge { width: 28px !important; height: 28px !important; min-width: 28px !important; min-height: 28px !important; max-width: 28px !important; max-height: 28px !important; border-radius: 50% !important; object-fit: contain !important; background: #fff !important; border: 1px solid #eef0f3 !important; padding: 1px !important; display: block !important; margin: 0 auto !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-badge-fallback { width: 28px !important; height: 28px !important; min-width: 28px !important; min-height: 28px !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; background: #eef4ff !important; color: #1d4ed8 !important; font-size: 9px !important; font-weight: 800 !important; margin: 0 auto !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-team-name { font-size: 9px !important; font-weight: 700 !important; color: #344054 !important; line-height: 1.1 !important; max-width: 64px !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; text-align: center !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-vs { font-size: 8px !important; font-weight: 800 !important; color: #98a2b3 !important; flex: none !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-result { font-size: 14px !important; font-weight: 800 !important; color: #101828 !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-comp { font-size: 9px !important; color: #667085 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-date { font-size: 9px !important; color: #98a2b3 !important; }


    .${FOOTBALL_THEME_CLASS} .qc-fb-player-matches-grid { display: grid !important; margin: 0 16px !important; gap: 8px !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-matches-future-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-matches-past-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-section-title { font-weight: 700 !important; font-size: 14px !important; color: #101828 !important; margin: 16px 16px 10px !important; border-left: 3px solid #1d4ed8 !important; padding-left: 10px !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-card { background: #f8f9fb !important; border: 1px solid #eef0f3 !important; border-radius: 12px !important; padding: 6px 4px !important; text-align: center !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-link { text-decoration: none !important; display: flex !important; flex-direction: column !important; gap: 3px !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-both { display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 4px !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-team-side { display: flex !important; flex-direction: column !important; align-items: center !important; gap: 2px !important; flex: 1 !important; min-width: 0 !important; }
    .${FOOTBALL_THEME_CLASS}.qc-popup img.qc-fb-player-match-badge { width: 24px !important; height: 24px !important; min-width: 24px !important; min-height: 24px !important; max-width: 24px !important; max-height: 24px !important; border-radius: 50% !important; object-fit: contain !important; background: #fff !important; border: 1px solid #eef0f3 !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-badge-fallback { width: 24px !important; height: 24px !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; background: #eef4ff !important; color: #1d4ed8 !important; font-size: 8px !important; font-weight: 800 !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-team-name { font-size: 8px !important; font-weight: 700 !important; color: #344054 !important; max-width: 60px !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; text-align: center !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-vs { font-size: 7px !important; font-weight: 800 !important; color: #98a2b3 !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-vs.qc-fb-player-result-mid { font-size: 13px !important; font-weight: 800 !important; color: #101828 !important; background: #eef2ff !important; border: 1px solid #c7d2fe !important; border-radius: 6px !important; padding: 2px 7px !important; min-width: 32px !important; text-align: center !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-comp { font-size: 8px !important; color: #667085 !important; text-align: center !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-player-match-date { font-size: 8px !important; color: #98a2b3 !important; text-align: center !important; }

    .${FOOTBALL_THEME_CLASS} .qc-fb-coach-current-club { display: flex !important; gap: 12px !important; align-items: center !important; background: #f8f9fb !important; border: 1px solid #eef0f3 !important; border-radius: 12px !important; padding: 10px 12px !important; margin-bottom: 12px !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-coach-current-crest img { width: 40px !important; height: 40px !important; object-fit: contain !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-coach-current-name { font-size: 16px !important; font-weight: 800 !important; color: #101828 !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-coach-current-role { font-size: 11px !important; color: #667085 !important; font-weight: 600 !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-coach-league-line { font-size: 12px !important; color: #344054 !important; display: flex !important; align-items: center !important; gap: 4px !important; margin-top: 4px !important; }
    .${FOOTBALL_THEME_CLASS} .qc-fb-coach-meta { font-size: 11px !important; color: #667085 !important; margin-top: 2px !important; }

`;
  root.styleHost.appendChild(style);
}

function fetchFootballSearch(query) {
  return api.runtime
    .sendMessage({ type: 'FOOTBALL_SEARCH_PLAYERS', query })
    .catch((error) => {
      logError('fetchFootballSearch: sendMessage failed ->', error && error.message ? error.message : error);
      return { ok: false, reason: 'network', error: String(error) };
    });
}

function fetchFootballPlayerDetails(id, profileUrl, isMini) {
  return api.runtime
    .sendMessage({ type: 'FOOTBALL_GET_PLAYER_DETAILS', id, profileUrl, isMini })
    .catch((error) => {
      logError('fetchFootballPlayerDetails: sendMessage failed ->', error && error.message ? error.message : error);
      return { ok: false, error: String(error) };
    });
}

const FOOTBALL_CACHE = new Map();

function footballCacheKey(id) {
  return `${id}:${getPopupStyleClass()}`;
}

function getFootballCacheEntry(id) {
  const key = footballCacheKey(id);
  if (!FOOTBALL_CACHE.has(key)) {
    FOOTBALL_CACHE.set(key, { finalHtml: null });
  }
  return FOOTBALL_CACHE.get(key);
}

function fetchFootballCoachDetails(id) {
  return api.runtime
    .sendMessage({ type: 'FOOTBALL_GET_COACH_DETAILS', id })
    .catch((error) => {
      logError('fetchFootballCoachDetails: sendMessage failed ->', error && error.message ? error.message : error);
      return { ok: false, error: String(error) };
    });
}

function fetchFootballTeamDetails(id, isMini) {
  return api.runtime
    .sendMessage({ type: 'FOOTBALL_GET_TEAM_DETAILS', id, isMini })
    .catch((error) => {
      logError('fetchFootballTeamDetails: sendMessage failed ->', error && error.message ? error.message : error);
      return { ok: false, error: String(error) };
    });
}

function fetchFootballTeamCoreDetails(id) {
  return api.runtime
    .sendMessage({ type: 'FOOTBALL_GET_TEAM_CORE_DETAILS', id })
    .catch((error) => {
      logError('fetchFootballTeamCoreDetails: sendMessage failed ->', error && error.message ? error.message : error);
      return { ok: false, error: String(error) };
    });
}

const FOOTBALL_COACH_CACHE = new Map();

function getFootballCoachCacheEntry(id) {
  const key = footballCacheKey(id);
  if (!FOOTBALL_COACH_CACHE.has(key)) FOOTBALL_COACH_CACHE.set(key, { finalHtml: null });
  return FOOTBALL_COACH_CACHE.get(key);
}

const FOOTBALL_TEAM_CACHE = new Map();

function getFootballTeamCacheEntry(id) {
  const key = footballCacheKey(id);
  if (!FOOTBALL_TEAM_CACHE.has(key)) FOOTBALL_TEAM_CACHE.set(key, { finalHtml: null });
  return FOOTBALL_TEAM_CACHE.get(key);
}

function footballSearchableName(name) {
  const safe = escapeHtml(name);
  return `<span class="qc-searchable qc-selectable" data-search-text="${safe}">${safe}</span>`;
}

const FOOTBALL_PLACEHOLDER = '—';

function footballValueOrPlaceholder(value) {
  if (value === null || value === undefined) return FOOTBALL_PLACEHOLDER;
  const str = String(value).trim();
  return str ? escapeHtml(str) : FOOTBALL_PLACEHOLDER;
}
function footballDisplayNationalities(list){
  if (!Array.isArray(list) || !list.length) return null;
  const parts = list
    .map(n => (n && typeof n === 'object') ? (n.name || n.flag || '') : n)
    .map(v => (v == null ? '' : String(v).trim()))
    .filter(v => v && !/^\d+$/.test(v));
  return parts.length ? parts.join(', ') : null;
}

function footballInitials(name){
  if(!name) return '?';
  return name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('');
}

function buildFootballFactRow(enabled, icon, label, rawValue) {
  if (!enabled) return '';
  return `<div class="qc-fact-row"><div class="qc-fact-icon">${icon}</div><div><span class="qc-fact-label">${escapeHtml(label)}:</span> <span class="qc-fact-value">${footballValueOrPlaceholder(rawValue)}</span></div></div>`;
}

function buildFootballStatusBadgesHtml(data) {
  if ((!footballSettings.footballFieldInjuryBadge && !footballSettings.footballFieldLoanBadge) || !data.statusBadges || !data.statusBadges.length) return '';
  const icons = { injury: '🩹', suspend: '🟥', loan: '🔁' };
  return data.statusBadges.map((b) => `<span class="qc-football-badge ${escapeHtml(b.type)}">${icons[b.type] || ''} ${escapeHtml(b.label)}</span>`).join(' ');
}

function buildFootballMarketValueHtml(data) {
  if (!footballSettings.footballFieldMarketValue) return null;
  if (!data.marketValue || !data.marketValue.value) {
    return `<span class="qc-football-mv">${FOOTBALL_PLACEHOLDER}</span>`;
  }
  const { value, trend, percent } = data.marketValue;
  const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : null;
  const trendHtml = arrow
    ? ` <span class="qc-football-mv-trend ${trend}">${arrow}${typeof percent === 'number' ? ` ${percent.toFixed(1)}%` : ''}</span>`
    : '';
  return `<span class="qc-football-mv">${escapeHtml(value)}</span>${trendHtml}`;
}

function buildFootballStatTilesHtml(data) {
  const t = data.statTotals || {};
  const tiles = [
    { icon: '👕', label: 'Appearances', value: t.appearances },
    { icon: '⚽', label: 'Goals', value: t.goals },
    { icon: '🎯', label: 'Assists', value: t.assists },
    { icon: '⏱', label: 'Minutes', value: typeof t.minutes === 'number' ? `${t.minutes}'` : null }
  ];
  return `<div class="qc-stat-row">${tiles.map((tile) => `
    <div class="qc-stat-block">
      <div class="qc-stat-num">${footballValueOrPlaceholder(tile.value)}</div>
      <div class="qc-stat-label">${tile.icon} ${escapeHtml(tile.label)}</div>
    </div>
  `).join('')}</div>`;
}

function buildFootballLastTransferHtml(data) {
  if (!data.lastTransfer) return '';
  const { fee, date, season } = data.lastTransfer;

  const dateLine = [date, season ? `(${season})` : null].filter(Boolean).join(' ');
  return `
    <div class="qc-section">
      <p class="qc-section-label">Last Transfer</p>
      <div class="qc-fact-grid">
        <div class="qc-fact-row"><div class="qc-fact-icon">💰</div><div><span class="qc-fact-label">Fee:</span> <span class="qc-fact-value">${escapeHtml(fee)}</span></div></div>
        ${dateLine ? `<div class="qc-fact-row"><div class="qc-fact-icon">📅</div><div><span class="qc-fact-label">Date:</span> <span class="qc-fact-value">${escapeHtml(dateLine)}</span></div></div>` : ''}
      </div>
    </div>
  `;
}

function footballBuildStandardLinks(data, opts) {
  const kind = (opts && opts.kind) || 'player';
  const links = [];
  const query = encodeURIComponent(data.name || '');

  if (footballSettings.footballShowTransfermarktLink && opts.transfermarktUrl) {
    links.push({ label: 'Transfermarkt', url: opts.transfermarktUrl });
  }
  if (footballSettings.footballShowWikipediaLink) {
    const wikiUrl = data.wikipediaUrl || `https://en.wikipedia.org/wiki/Special:Search?search=${query}&go=Go`;
    links.push({ label: 'Wikipedia', url: wikiUrl });
  }
  if (kind !== 'coach' && footballSettings.footballShowOfficialSiteLink && data.officialSite) {
    links.push({ label: 'Website', url: data.officialSite });
  }

  if (footballSettings.footballShowSoccerwayLink) {
    const soccerwayUrl = data.soccerwayUrl || `https://us.soccerway.com/search/?q=${query}`;
    links.push({ label: 'Soccerway', url: soccerwayUrl });
  }
  if (footballSettings.footballShowWhoscoredLink) {
    links.push({ label: 'WhoScored', url: `https://www.whoscored.com/search/?t=${query}` });
  }
  if (kind !== 'coach' && footballSettings.footballShowYoutubeLink) {
    links.push({ label: 'YouTube', url: `https://www.youtube.com/results?search_query=${query}${kind === 'team' ? '+highlights' : ''}` });
  }

  if (kind !== 'coach' && footballSettings.footballShowSofifaLink) {
    links.push({ label: 'SoFIFA', url: kind === 'team' ? `https://sofifa.com/teams?keyword=${query}` : `https://sofifa.com/players?keyword=${query}` });
  }
  if (kind !== 'coach' && footballSettings.footballShowFutbinLink) {
    links.push({ label: 'Futbin', url: kind === 'team' ? `https://www.futbin.com/search?search=${query}` : `https://www.futbin.com/players?search=${encodeURIComponent(String(data.name || '').toLowerCase())}` });
  }

  for (const customLink of footballSettings.footballCustomLinks) {
    const url = String(customLink.urlTemplate || '').replace(/\{title\}/g, query);
    if (!url) continue;
    links.push({
      label: (customLink.label && customLink.label.trim()) || 'Custom Link',
      url,
      icon: customLink.icon || null
    });
  }
  return links;
}

function buildFootballExtraLinks(data) {
  const links = [];

  if (data.club && data.club.url) {
    links.push({ label: data.club.name || 'Club', url: data.club.url });
  }
  return links.concat(footballBuildStandardLinks(data, { kind: 'player', transfermarktUrl: data.profileUrl }));
}

function footballBuildMiniSeasonStatBox(statValue, statLabel) {
  return `<span class="qc-fb-mini-season-stat"><b>${statValue}</b><span class="qc-fb-mini-season-stat-label">${statLabel}</span></span>`;
}

function footballBuildMiniSeasonStripHtml(data) {
  if (!footballSettings.footballFieldCurrentSeasonStats || !data || data.retired) return '';
  const seasonTotal = data.detailedStats && data.detailedStats.total;
  if (!seasonTotal) return '';
  const gamesPlayed = seasonTotal.apps ?? 0;
  const goalsScored = seasonTotal.goals ?? 0;
  const assistsMade = seasonTotal.assists ?? 0;
  const minutesPlayed = `${seasonTotal.minutes ?? 0}'`;
  const seasonLabel = seasonTotal.seasonDisplay ? `This season (${escapeHtml(seasonTotal.seasonDisplay)})` : 'This season';
  return `<div class="qc-fb-mini-season-wrap"><div class="qc-fb-mini-section-title">${seasonLabel}</div><div class="qc-fb-mini-season-strip">${footballBuildMiniSeasonStatBox(gamesPlayed, 'Games')}${footballBuildMiniSeasonStatBox(goalsScored, 'Goals')}${footballBuildMiniSeasonStatBox(assistsMade, 'Assists')}${footballBuildMiniSeasonStatBox(minutesPlayed, 'Minutes')}</div></div>`;
}

function footballBuildMiniPlayerHeaderHtml(data) {
  const playerNameHtml = `<p class="name qc-selectable">${escapeHtml(data.name || 'Player')}</p>`;
  const headerMetaParts = [];
  if (footballSettings.footballFieldFutRating && data.eaFcRating && typeof data.eaFcRating.rating === 'number') {
    headerMetaParts.push(`<span class="qc-fb-mini-fut-rating" title="EA Sports FC Rating">FC Rating: ${escapeHtml(String(data.eaFcRating.rating))}</span>`);
  }
  const primaryNationalityName = (Array.isArray(data.nationalities) && data.nationalities.length) ? footballDisplayNationalities([data.nationalities[0]]) : null;
  const primaryNationalityId = (Array.isArray(data.nationalityIds) && data.nationalityIds.length) ? data.nationalityIds[0] : null;
  if (primaryNationalityName && primaryNationalityId) {
    headerMetaParts.push(`<img class="qc-fb-flag qc-fb-mini-nat-flag" src="https://tmssl.akamaized.net/images/flagge/originals/${encodeURIComponent(primaryNationalityId)}.png" alt="" referrerpolicy="no-referrer" data-fallback-hide>`);
  }
  if (primaryNationalityName) headerMetaParts.push(`<span>${escapeHtml(primaryNationalityName)}</span>`);
  const clubLeagueLabel = footballResolveMiniClubLeagueLabel(data);
  const clubLeagueIconUrl = footballResolveMiniClubLeagueIconUrl(data);
  if (clubLeagueIconUrl) {
    headerMetaParts.push(`<img class="qc-fb-mini-league-icon" src="${escapeHtml(clubLeagueIconUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>`);
  }
  if (clubLeagueLabel) headerMetaParts.push(`<span>${escapeHtml(clubLeagueLabel)}</span>`);
  const headerMetaHtml = headerMetaParts.length ? `<div class="qc-fb-mini-player-sub">${headerMetaParts.join('')}</div>` : '';
  return `${playerNameHtml}${headerMetaHtml}`;
}

function footballResolveMiniClubLeagueLabel(data) {
  if (data && data.club && data.club.leagueName) return String(data.club.leagueName);
  const clubCompetitionEntries = data && data.compMap ? Object.values(data.compMap) : [];
  for (const competitionEntry of clubCompetitionEntries) {
    if (competitionEntry && competitionEntry.name) return String(competitionEntry.name);
  }
  return '';
}

function footballResolveMiniClubLeagueIconUrl(data) {
  if (data && data.club && data.club.leagueLogoUrl) return String(data.club.leagueLogoUrl);
  const clubCompetitionEntries = data && data.compMap ? Object.values(data.compMap) : [];
  for (const competitionEntry of clubCompetitionEntries) {
    if (competitionEntry && competitionEntry.logoUrl) return String(competitionEntry.logoUrl);
  }
  return null;
}

function buildFootballMiniHtml(data) {
  const rows = [];

  const clubNameHtml = data.club && data.club.name
    ? (data.club.id ? footballNavLinkHtml(data.club.name, 'team', data.club.id) : escapeHtml(data.club.name))
    : FOOTBALL_PLACEHOLDER;
  rows.push(`Club: <b>${clubNameHtml}</b>`);
  rows.push(`Position: <b>${footballValueOrPlaceholder(data.position)}</b>`);
  if (footballSettings.footballFieldNationality) {
    rows.push(`Nationality: <b>${footballValueOrPlaceholder(footballDisplayNationalities(data.nationalities))}</b>`);  }
  {
    const ageVal = typeof data.age === 'number' ? `${data.age}${data.dob ? ` (${data.dob})` : ''}` : data.dob;
    rows.push(`Age: <b>${footballValueOrPlaceholder(ageVal)}</b>`);
  }
  if (footballSettings.footballFieldPhysical) {
    rows.push(`Height: <b>${footballValueOrPlaceholder(data.height)}</b> · Foot: <b>${footballValueOrPlaceholder(data.foot)}</b>`);
  }
  if (footballSettings.footballFieldContract) {
    rows.push(`Contract: <b>${footballValueOrPlaceholder(data.contractExpires)}</b>`);
  }
  if (footballSettings.footballFieldAgent) {
    rows.push(`Agent: <b>${footballValueOrPlaceholder(data.agent)}</b>`);
  }
  const mvHtml = buildFootballMarketValueHtml(data);
  if (mvHtml) rows.push(`Market value: ${mvHtml}`);

  const badgesHtml = buildFootballStatusBadgesHtml(data);
  if (badgesHtml) rows.push(badgesHtml);

  const miniSeasonStripHtml = footballBuildMiniSeasonStripHtml(data);

  let honoursHtml = '';
  if (footballSettings.footballFieldHonours && data.honours && data.honours.length) {
    honoursHtml = `<div class="qc-fb-mini-section-title">Honours</div><div class="qc-fb-honours-row qc-fb-honours-row-new">${data.honours.map(h => {
      const label = h.title ? `${h.count ? h.count+'x ' : ''}${h.title}${footballFormatHonourSeasons(h.seasons)}` : (h.label||'Trophy');
      const inner = h.logoUrl ? `<img class="qc-fb-honour-img" src="${escapeHtml(h.logoUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-replace-tag="span" data-fallback-replace-class="qc-fb-honour-emoji" data-fallback-replace-text="🏆">` : '<span class="qc-fb-honour-emoji">🏆</span>';
      return `<span class="qc-fb-honour" title="${escapeHtml(label)}">${inner}<b>${h.count?escapeHtml(String(h.count))+'x':''}</b></span>`;
    }).join('')}</div>`;
  }

  const imgHtml = data.photo ? `<img src="${escapeHtml(data.photo)}" alt="${escapeHtml(data.name)}" referrerpolicy="no-referrer">` : '';

  return `
    <div class="row">
      ${imgHtml}
      <div class="content">
        ${footballBuildMiniPlayerHeaderHtml(data)}
        <div class="meta qc-selectable">${rows.map((r) => `<div>${r}</div>`).join('')}</div>
        ${miniSeasonStripHtml}
        ${honoursHtml}
        ${buildExternalLinksHtml(buildFootballExtraLinks(data))}
      </div>
    </div>
  `;
}

function footballCitizenshipHtml(data) {
const names = footballDisplayNationalities(data.nationalities);
const ids = Array.isArray(data.nationalityIds) ? data.nationalityIds : [];
const flags = ids.map(cid => `<img class="qc-fb-flag" src="https://tmssl.akamaized.net/images/flagge/originals/${encodeURIComponent(cid)}.png" alt="" referrerpolicy="no-referrer" data-fallback-hide>`).join('');
if (!names && !flags) return null;
return `${flags}${names ? escapeHtml(names) : ''}`;
}

function buildFootballFullHtml(data) {
const name = data.name || 'Loading...';
const initials = footballInitials(name);
const photoHtml = data.photo ? `<img class="qc-fb-photo" src="${escapeHtml(data.photo)}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer" data-fallback-replace-tag="div" data-fallback-replace-class="qc-fb-photo-fallback" data-fallback-replace-text="${escapeHtml(initials)}">` : `<div class="qc-fb-photo-fallback">${escapeHtml(initials)}</div>`;
const squadHtml = data.squadNumber ? `<div class="qc-fb-squad-num">#${escapeHtml(String(data.squadNumber))}</div>` : '';

let clubLine='';

let joinedLine = '';
if (data.clubJoined && !data.retired) {
joinedLine = `<div class="qc-fb-joined-line">Joined: ${escapeHtml(String(data.clubJoined))}</div>`;
}
const position = data.position ? `<div class="qc-fb-position-line">${escapeHtml(data.position)}</div>` : '';

const primaryNatName = (footballSettings.footballFieldNationality && Array.isArray(data.nationalities) && data.nationalities.length)
  ? footballDisplayNationalities([data.nationalities[0]])
  : '';
const primaryNatId = (Array.isArray(data.nationalityIds) && data.nationalityIds.length) ? data.nationalityIds[0] : null;
const primaryNatFlagHtml = (primaryNatName && primaryNatId)
  ? `<img class="qc-fb-flag" src="https://tmssl.akamaized.net/images/flagge/originals/${encodeURIComponent(primaryNatId)}.png" alt="" referrerpolicy="no-referrer" data-fallback-hide>`
  : '';

const ageStr = data.age ? `${data.age} years old` : '';
const heightStr = (footballSettings.footballFieldPhysical && data.height && data.height !== '0.02 m' && !data.height.includes('0.02')) ? data.height : '';

let footLine = '';
if (footballSettings.footballFieldPhysical && data.foot) {
const f = typeof data.foot === 'object' ? (data.foot.name || data.foot.value || '') : data.foot;
if (f) footLine = `<div class="qc-fb-foot-line">Preferred Foot: ${escapeHtml(String(f))}</div>`;
}
let honoursHtml = '';
if (footballSettings.footballFieldHonours && data.honours && data.honours.length) {
honoursHtml = `<div class="qc-fb-honours-row">${data.honours.map(h => {
const label = `${h.count}x ${h.title}${footballFormatHonourSeasons(h.seasons)}${h.club ? ' - ' + h.club : ''}`;
const inner = h.logoUrl ? `<img class="qc-fb-honour-img" src="${escapeHtml(h.logoUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-replace-tag="span" data-fallback-replace-class="qc-fb-honour-emoji" data-fallback-replace-text="🏆">` : '<span class="qc-fb-honour-emoji">🏆</span>';
return `<span class="qc-fb-honour" title="${escapeHtml(label)}">${inner}<b>${h.count}x</b></span>`;
}).join('')}</div>`;
}
let badgesHtml = '';

const allowedBadgeTypes = [
    footballSettings?.footballFieldInjuryBadge ? 'injury' : null,
    footballSettings?.footballFieldLoanBadge ? 'loan' : null,
].filter(Boolean);

const visibleBadges = (data.statusBadges || []).filter(badge => {
    return allowedBadgeTypes.includes(badge.type);
});

if (visibleBadges.length) {
    badgesHtml = `
        <div class="qc-fb-status-badges">
            ${visibleBadges.map(badge => `
                <span class="qc-fb-badge ${escapeHtml(badge.type)}">
                    ${escapeHtml(badge.label)}
                </span>
            `).join('')}
        </div>
    `;
} else {
    badgesHtml = '';
}
const t = data.statTotals || {};
const tilesHtml = `
<div class="qc-fb-tile"> <div class="num">${footballValueOrPlaceholder(t.appearances)}</div> <div class="lbl">👕 Appearances</div> </div>
<div class="qc-fb-tile"> <div class="num">${footballValueOrPlaceholder(t.goals)}</div> <div class="lbl">⚽ Goals</div> </div>
<div class="qc-fb-tile"> <div class="num">${footballValueOrPlaceholder(t.assists)}</div> <div class="lbl">🎯 Assists</div> </div>
<div class="qc-fb-tile"> <div class="num">${footballValueOrPlaceholder(t.minutes ? t.minutes + "'" : null)}</div> <div class="lbl">⏱ Minutes</div> </div>
`;
const citizenshipHtml = footballCitizenshipHtml(data);

const infoGridHtml = `<div class="qc-fb-info-grid-ref">
${footballSettings.footballFieldDateOfBirth ? `<div class="qc-fb-info-cell"> <div class="lbl">📅 Date of Birth</div> <div class="val">${footballValueOrPlaceholder(data.dob)}</div> </div>` : ''}
${footballSettings.footballFieldNationality ? `<div class="qc-fb-info-cell"> <div class="lbl">📍 Place of Birth</div> <div class="val">${footballValueOrPlaceholder(data.birthPlace)}</div> </div>
<div class="qc-fb-info-cell"> <div class="lbl">⭐ Citizenship</div> <div class="val">${citizenshipHtml ? citizenshipHtml : FOOTBALL_PLACEHOLDER}</div> </div>` : ''}
</div>`;

const contractAgentHtmlInner = `${footballSettings.footballFieldContract ?` <div class="row"> <span class="lbl">📄 Contract Expires</span> <span class="val">${footballValueOrPlaceholder(data.contractExpires)}</span> </div> ` : ''} ${footballSettings.footballFieldAgent ?` <div class="row"> <span class="lbl">🤝 Agent</span> <span class="val">${footballValueOrPlaceholder(data.agent)}</span> </div>` : ''}`;
const contractAgentHtml = (footballSettings.footballFieldContract || footballSettings.footballFieldAgent)
? `<div class="qc-fb-contract-card">${contractAgentHtmlInner}</div>`
: '';
let mvBox='';
if(footballSettings.footballFieldMarketValue){
const mv = data.marketValue || {};
let val = mv.value || FOOTBALL_PLACEHOLDER;
if(typeof val === 'string' && val.toLowerCase().includes('free')) val = 'Free';
const trend = mv.trend==='up' ? `<span class="mv-up">▲ ${mv.percent? mv.percent.toFixed(1)+'%':''}</span>` : mv.trend==='down' ? `<span class="mv-down">▼ ${mv.percent? mv.percent.toFixed(1)+'%':''}</span>` : '';
mvBox = `<div class="qc-fb-mv-box"><div class="title">MARKET VALUE</div><div class="value">${escapeHtml(String(val))} ${trend}</div><div class="updated">Last update: ${footballValueOrPlaceholder(mv.lastUpdate)}</div>${data.marketValueUrl?`<a class="details-link" href="${escapeHtml(data.marketValueUrl)}" target="_blank">Market Value Details →</a>`:''}</div>`;
}
let transferBox='';
if(footballSettings.footballFieldLastTransfer && data.lastTransfer){
const lt = data.lastTransfer;
let feeDisplay = lt.fee;
if(!feeDisplay || feeDisplay === '—' || feeDisplay === '-' || (typeof feeDisplay==='string' && feeDisplay.trim()==='')){
feeDisplay = '—';
}
if(typeof feeDisplay === 'string'){
const low = feeDisplay.toLowerCase();
if(low.includes('free') || low === '0' || low.includes('€0') || low.includes('ablösefrei')){
feeDisplay = '<span style="color:#1d4ed8; font-weight:800;">Free</span>';
} else {
feeDisplay = escapeHtml(feeDisplay);
}
}

const fromDisplay = lt.from ? (lt.fromId ? footballNavLinkHtml(lt.from, 'team', lt.fromId) : escapeHtml(lt.from)) : FOOTBALL_PLACEHOLDER;
const toDisplay = lt.to ? (lt.toId ? footballNavLinkHtml(lt.to, 'team', lt.toId) : escapeHtml(lt.to)) : FOOTBALL_PLACEHOLDER;
transferBox = `<div class="qc-fb-last-transfer"><div class="title">LAST TRANSFER</div><div class="row"><span>From</span><span>${fromDisplay}</span></div><div class="row"><span>To</span><span>${toDisplay}</span></div><div class="row"><span>Fee</span><span class="fee">${feeDisplay}</span></div></div>`;
}

const isRetired = !!data.retired;
const wantCurrent = footballSettings.footballFieldCurrentSeasonStats && !isRetired;
const wantCareer = footballSettings.footballFieldCareerTotalStats;
let currentSeasonTable='';
if (wantCurrent && data.detailedStats && data.detailedStats.lastSeason && data.detailedStats.lastSeason.length) {
const last = data.detailedStats.lastSeason;
const total = data.detailedStats.total;

currentSeasonTable = `<table class="qc-fb-stats-table" data-table="current"> <thead><tr><th>Competition</th><th>👕</th><th>⚽</th><th>🎯</th><th>🟨</th><th>🟥</th><th>⏱</th></tr></thead> <tbody> ${last.map(row=>`<tr><td class="comp-cell">${row.competitionLogo ? `<img class="comp-logo" src="${escapeHtml(row.competitionLogo)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : ''}${escapeHtml(row.competitionName)}</td><td>${row.apps}</td><td>${row.goals}</td><td>${row.assists}</td><td>${row.yellow}</td><td>${row.red}</td><td>${row.minutes}'</td></tr>`).join('')} ${total ?`<tr class="total"><td>Total ${escapeHtml(total.seasonDisplay)}</td><td>${total.apps}</td><td>${total.goals}</td><td>${total.assists}</td><td>${total.yellow}</td><td>${total.red}</td><td>${total.minutes}'</td></tr>` : ''} </tbody> </table>`;
} else if (wantCurrent) {
currentSeasonTable = `<div style="font-size:12px; color:#98a2b3; padding:12px; background:#f8f9fb; border-radius:8px;">No current season data.</div>`;
}
let careerTable='';
if (wantCareer && data.careerByComp && data.careerByComp.length){
const totals = data.careerByComp.reduce((acc,c)=>{ acc.apps+=c.apps; acc.goals+=c.goals; acc.assists+=c.assists; acc.yellow+=c.yellow; acc.red+=c.red; acc.minutes+=c.minutes; return acc; }, {apps:0,goals:0,assists:0,yellow:0,red:0,minutes:0});
careerTable = `<table class="qc-fb-stats-table" data-table="career"${(isRetired || !wantCurrent) ? '' : ' style="display:none;"'}> <thead><tr><th>Competition</th><th>👕 Apps</th><th>⚽ Goals</th><th>🎯 Assists</th><th>⏱ Minutes</th></tr></thead> <tbody> ${data.careerByComp.map(row=>`<tr><td class="comp-cell">${row.logo ? `<img class="comp-logo" src="${escapeHtml(row.logo)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : '<span class="comp-dot"></span>'}${escapeHtml(row.competitionName)}</td><td>${row.apps || '-'}</td><td>${row.goals || '-'}</td><td>${row.assists || '-'}</td><td>${row.minutes ? row.minutes+"'" : '-'}</td></tr>`).join('')} <tr class="total"><td>Total:</td><td>${totals.apps}</td><td>${totals.goals}</td><td>${totals.assists}</td><td>${totals.minutes}'</td></tr> </tbody> </table>`;
} else if (wantCareer && data.detailedStats && data.detailedStats.all){
careerTable = `<div data-table="career" style="${(isRetired || !wantCurrent) ? '' : 'display:none;'} font-size:12px; color:#98a2b3; padding:12px;">No career data.</div>`;
}
const seasonLabel = data.detailedStats && data.detailedStats.total ? data.detailedStats.total.seasonDisplay : '';
const statsTitleDefault = isRetired
? `Career Stats — Last Season${seasonLabel ? ' — ' + seasonLabel : ''}`
: (wantCurrent ? `Detailed Stats (Current Season)${seasonLabel ? ' — ' + seasonLabel : ''}` : `Career Stats — Total by Competition`);
const showBothToggle = wantCurrent && wantCareer && !isRetired;
const toggleButtons = !showBothToggle ? '' : `<button class="qc-fb-toggle-btn active" data-target="current">Current Season</button> <button class="qc-fb-toggle-btn" data-target="career">Career Total</button>`;
const statsToggleSection = (!wantCurrent && !wantCareer) ? '' : `<div class="qc-fb-stats-wrapper"> <div class="qc-fb-stats-header"> <div class="qc-fb-section-title" style="margin:0;"><span class="blue-bar"></span><span id="qc-stats-title" data-default="${escapeHtml(statsTitleDefault)}">${escapeHtml(statsTitleDefault)}</span></div> ${toggleButtons ? `<div class="qc-fb-toggle"> ${toggleButtons} </div>` : ''} </div> <div class="qc-fb-tables"> ${currentSeasonTable} ${careerTable} </div> <a class="qc-fb-view-full" href="${data.profileUrl ? escapeHtml(data.profileUrl)+'/leistungsdaten' : '#'}" target="_blank">View full stats →</a> </div>`;

let nationalHtml='';
if (footballSettings.footballFieldNationalTeamCareer) {
if (data.nationalTeamCareer && data.nationalTeamCareer.length) {
nationalHtml = `<div class="qc-fb-section-title" style="margin-top:20px;"><span class="blue-bar"></span> National Team Career</div> <table class="qc-fb-stats-table qc-fb-nt-career"> <thead><tr><th>#</th><th>National team</th><th>Debut</th><th>👕</th><th>⚽</th></tr></thead> <tbody> ${data.nationalTeamCareer.map(r=>`<tr${r.isCurrent ? ' class="current"' : ''}><td>${r.shirtNumber != null ? r.shirtNumber : ''}</td><td class="team">${r.flagUrl ? `<img class="nt-flag" src="${escapeHtml(r.flagUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : ''}<span>${escapeHtml(r.teamName)}</span></td><td>${escapeHtml(r.debut || '—')}</td><td>${r.apps}</td><td>${r.goals}</td></tr>`).join('')} </tbody> </table>`;
} else if(data.nationalTeamStats && data.nationalTeamStats.length){
const nat = data.nationalTeamStats;
let natTotals = {apps:0, goals:0};
nat.forEach(r=>{ natTotals.apps+=Number(r.apps)||0; natTotals.goals+=Number(r.goals)||0; });
nationalHtml = `<div class="qc-fb-section-title" style="margin-top:20px;"><span class="blue-bar"></span> National Team — Senior</div> <table class="qc-fb-stats-table"> <thead><tr><th>Competition</th><th>Season</th><th>👕</th><th>⚽</th><th>⏱</th></tr></thead> <tbody> ${nat.map(row=>`<tr><td>${escapeHtml(row.competitionName||'National Team')}</td><td>${escapeHtml(row.seasonDisplay||'')}</td><td>${row.apps}</td><td>${row.goals}</td><td>${row.minutes||0}'</td></tr>`).join('')} <tr class="total"><td colspan="2">Total Senior NT</td><td>${natTotals.apps}</td><td>${natTotals.goals}</td><td></td></tr> </tbody> </table>`;
}
}
const footerLinks = buildExternalLinksHtml(buildFootballExtraLinks(data));
const footerHtml = `<div class="qc-fb-footer">${footerLinks}</div>`;

let loanBadgeHtml = '';
let injuryBadgesHtml = '';
if (visibleBadges.length) {
    const loans = visibleBadges.filter(b => b.type === 'loan');
    const injuries = visibleBadges.filter(b => b.type !== 'loan');
    if (loans.length) {
      loanBadgeHtml = loans.map(badge => `<div class="qc-fb-loan-pill">${escapeHtml(badge.label)}</div>`).join('');
    }
    if (injuries.length) {
      injuryBadgesHtml = `<div class="qc-fb-injury-wrap">${injuries.map(badge => `<span class="qc-fb-injury-pill">${escapeHtml(badge.label)}</span>`).join('')}</div>`;
    }
}
const primaryNatFlagInlineHtml = (primaryNatName && primaryNatId)
  ? `<img class="qc-fb-flag-inline" src="https://tmssl.akamaized.net/images/flagge/originals/${encodeURIComponent(primaryNatId)}.png" alt="" referrerpolicy="no-referrer" data-fallback-hide>`
  : '';
let joinedVal = data.clubJoined ? escapeHtml(String(data.clubJoined)) : '';
let positionVal = data.position ? escapeHtml(data.position) : '';
let footValTmp = '';
if (footballSettings.footballFieldPhysical && data.foot) {
  const fTmp = typeof data.foot === 'object' ? (data.foot.name || data.foot.value || '') : data.foot;
  if (fTmp) footValTmp = escapeHtml(String(fTmp));
}
const ageFullStrTmp = data.age ? `${data.age} years old` : (data.dob ? escapeHtml(String(data.dob)) : '');
const heightStrTmp = (footballSettings.footballFieldPhysical && data.height && data.height !== '0.02 m' && !data.height.includes('0.02')) ? escapeHtml(data.height) : '';

const tilesHtmlNew = `
<div class="qc-fb-tile-new"><div class="icon">👕</div><div class="txt"><div class="num">${footballValueOrPlaceholder(t.appearances)}</div><div class="lbl">Appearances</div></div></div>
<div class="qc-fb-tile-new"><div class="icon">⚽</div><div class="txt"><div class="num">${footballValueOrPlaceholder(t.goals)}</div><div class="lbl">Goals</div></div></div>
<div class="qc-fb-tile-new"><div class="icon">🎯</div><div class="txt"><div class="num">${footballValueOrPlaceholder(t.assists)}</div><div class="lbl">Assists</div></div></div>
<div class="qc-fb-tile-new"><div class="icon">⏱️</div><div class="txt"><div class="num">${footballValueOrPlaceholder(t.minutes ? t.minutes + "'" : null)}</div><div class="lbl">Minutes</div></div></div>
`;

if(data.club && data.club.name){
  const crestTmp = data.club.crestUrl ? `<img class="qc-fb-club-crest" src="${escapeHtml(data.club.crestUrl)}" alt="" referrerpolicy="no-referrer">` : '';

  const clubNameHtmlPill = data.club.id ? footballNavLinkHtml(data.club.name, 'team', data.club.id) : escapeHtml(data.club.name);
  const crestTmpHtml = (data.club.id && crestTmp) ? `<span class="qc-nav-link" data-nav-kind="team" data-nav-id="${escapeHtml(String(data.club.id))}">${crestTmp}</span>` : crestTmp;
  const clubPillHtml = `<div class="qc-fb-club-pill">${crestTmpHtml}<span>${clubNameHtmlPill}</span></div>`;

  const eaFcRatingHtml = (footballSettings.footballFieldFutRating && data.eaFcRating && typeof data.eaFcRating.rating === 'number')
    ? `<span class="qc-fb-fut-rating" title="EA Sports FC Rating">FC Rating: ${escapeHtml(String(data.eaFcRating.rating))}</span>`
    : '';
  clubLine = eaFcRatingHtml
    ? `<div class="qc-fb-club-row">${clubPillHtml}${eaFcRatingHtml}</div>`
    : clubPillHtml;
}

if (footballSettings.footballFieldHonours && data.honours && data.honours.length) {
  honoursHtml = `<div class="qc-fb-honours-row qc-fb-honours-row-new">${data.honours.map(h => {
    const label = `${h.count}x ${h.title}${footballFormatHonourSeasons(h.seasons)}${h.club ? ' - ' + h.club : ''}`;
    const inner = h.logoUrl ? `<img class="qc-fb-honour-img" src="${escapeHtml(h.logoUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-replace-tag="span" data-fallback-replace-class="qc-fb-honour-emoji" data-fallback-replace-text="🏆">` : '<span class="qc-fb-honour-emoji">🏆</span>';
    return `<span class="qc-fb-honour qc-fb-honour-new" title="${escapeHtml(label)}">${inner}<b>${h.count}x</b></span>`;
  }).join('')}</div>`;
}
return `<div class="qc-football-card qc-football-card-new">
<div class="qc-fb-top-new">
  <div class="qc-fb-photo-col-new">
    <div class="qc-fb-photo-wrap-new">${photoHtml}${squadHtml}</div>
    ${loanBadgeHtml}
  </div>
  <div class="qc-fb-main-col-new">
    <div class="qc-fb-player-name-new">${escapeHtml(name)}</div>
    ${honoursHtml}
    ${clubLine}
    <div class="qc-fb-info-2col-new">
      <div class="qc-fb-info-item-new"><div class="lbl">Joined</div><div class="val">${joinedVal || FOOTBALL_PLACEHOLDER}</div></div>
      <div class="qc-fb-info-item-new"><div class="lbl">Position</div><div class="val">${positionVal || FOOTBALL_PLACEHOLDER}</div></div>
      <div class="qc-fb-info-item-new"><div class="lbl">Age</div><div class="val">${ageFullStrTmp || FOOTBALL_PLACEHOLDER}</div></div>
      ${footballSettings.footballFieldNationality ? `<div class="qc-fb-info-item-new"><div class="lbl">Nationality</div><div class="val">${primaryNatFlagInlineHtml}${primaryNatName ? escapeHtml(primaryNatName) : FOOTBALL_PLACEHOLDER}</div></div>` : ''}
      ${footballSettings.footballFieldPhysical ? `<div class="qc-fb-info-item-new"><div class="lbl">Height</div><div class="val">${heightStrTmp || FOOTBALL_PLACEHOLDER}</div></div>` : ''}
      ${footballSettings.footballFieldPhysical ? `<div class="qc-fb-info-item-new"><div class="lbl">Preferred Foot</div><div class="val">${footValTmp || FOOTBALL_PLACEHOLDER}</div></div>` : ''}
    </div>
    ${injuryBadgesHtml}
  </div>
</div>
<div class="qc-fb-stat-tiles-new">${tilesHtmlNew}</div>
<hr class="qc-fb-sep">
${infoGridHtml}
${contractAgentHtml}
${(mvBox || transferBox) ? `<div class="qc-fb-boxes-row">${mvBox}${transferBox}</div>` : ''}
${footballBuildMatchesSectionHtml(footballSettings.footballFieldPlayerNextMatches ? data.nextMatches : null, false, 'Next Matches', 3, 'player')}
${footballBuildMatchesSectionHtml(footballSettings.footballFieldPlayerPrevMatches ? data.prevMatches : null, true, 'Previous Matches', 3, 'player')}
<div style="margin-top:18px;">${statsToggleSection}</div>
${nationalHtml}
${footerHtml}
</div>`;
}

let footballToggleBound = false;
function initFootballStatsToggle() {
  if (footballToggleBound) return;
  footballToggleBound = true;
  document.addEventListener('click', (e) => {
    const btn = composedClosest(e, '.qc-fb-toggle-btn');
    if (!btn) return;
    const wrapper = btn.closest('.qc-fb-stats-wrapper');
    if (!wrapper) return;
    e.preventDefault();
    e.stopPropagation();
    const which = btn.getAttribute('data-target');
    wrapper.querySelectorAll('.qc-fb-toggle-btn').forEach((b) => b.classList.toggle('active', b === btn));
    wrapper.querySelectorAll('[data-table]').forEach((t) => {
      t.style.display = t.getAttribute('data-table') === which ? '' : 'none';
    });
    const title = wrapper.querySelector('#qc-stats-title');
    if (title) {
      title.textContent = which === 'career'
        ? 'Career Stats — Total by Competition'
        : (title.getAttribute('data-default') || 'Detailed Stats (Current Season)');
    }
  }, true);
}

let footballSquadToggleBound = false;
function initFootballSquadToggle() {
  if (footballSquadToggleBound) return;
  footballSquadToggleBound = true;
  document.addEventListener('click', (e) => {
    const btn = composedClosest(e, '.qc-fb-squad-toggle-btn');
    if (!btn) return;
    const table = btn.closest('.qc-fb-team-players-table') || btn.parentElement;
    if (!table) return;
    const body = table.querySelector ? table.querySelector('.qc-fb-squad-hidden') : null;
    if (!body) return;
    e.preventDefault();
    e.stopPropagation();
    const isExp = btn.getAttribute('data-expanded') === '1';
    if (isExp) {
      body.classList.remove('qc-fb-squad-visible');
      btn.setAttribute('data-expanded', '0');
      btn.textContent = 'Show All ▼';
    } else {
      body.classList.add('qc-fb-squad-visible');
      btn.setAttribute('data-expanded', '1');
      btn.textContent = 'Show Less ▲';
    }
  }, true);
}

function buildFootballHtml(data) {
  return getPopupStyleClass() === 'qc-style-full'
    ? buildFootballFullHtml(data)
    : buildFootballMiniHtml(data);
}

function isFootballMiniStyle() {
  return getPopupStyleClass() !== 'qc-style-full';
}

async function renderFootballCard(id, profileUrl, banner = '', candidateName = '', candidateImage = null) {

  const navToken = navBeginRender();

  navSetRerenderFn(() => renderFootballCard(id, profileUrl, banner, candidateName, candidateImage));
  const cacheEntry = getFootballCacheEntry(id);

  if (cacheEntry.finalHtml) {
    updateSelectionPopup(`${banner}${cacheEntry.finalHtml}`, false);
    return;
  }

  updateSelectionPopup(`${banner}<div class="loading">Loading...</div>`, false);

  const response = await fetchFootballPlayerDetails(id, profileUrl, isFootballMiniStyle());
  if (!navIsTokenCurrent(navToken)) return;

  if (!response || !response.ok) {
    const error = response && response.error ? ` (${escapeHtml(response.error)})` : '';
    updateSelectionPopup(`${banner}<div class="loading">Couldn't load that player${error}.</div><div><button class="qc-retry-btn">Retry</button></div>`, false);
    lastRetryFn = () => renderFootballCard(id, profileUrl, banner, candidateName, candidateImage);
    return;
  }

  const data = response.data;
  resolveImageUrl(data.photo, (resolved) => {
    if (!navIsTokenCurrent(navToken)) return;
    data.photo = resolved;
    const html = buildFootballHtml(data);
    cacheEntry.finalHtml = html;
    updateSelectionPopup(`${banner}${html}`, false);
    setTimeout(()=>{ const root = document.getElementById('quickcard-root'); if(root) initFootballStatsToggle(root); }, 50);
  });
}

function describeFootballCandidate(candidate) {
  return {
    name: candidate.label,
    image: candidate.image,
    subParts: candidate.description ? [candidate.description] : []
  };
}

function footballFormatHonourSeasons(seasons) {
  if (!seasons) return '';
  const text = Array.isArray(seasons) ? seasons.filter(Boolean).join(', ') : String(seasons).trim();
  return text ? ` (${text})` : '';
}

function footballNavLinkHtml(name, kind, id) {
  const safe = escapeHtml(name);
  return `<span class="qc-nav-link qc-selectable" data-nav-kind="${escapeHtml(kind)}" data-nav-id="${escapeHtml(String(id))}">${safe}</span>`;
}

function buildFootballCoachHtml(data) {
  const name = data.name || 'Loading...';
  const initials = footballInitials(name);
  const photoHtml = data.photo
    ? `<img class="qc-fb-photo" src="${escapeHtml(data.photo)}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer" data-fallback-replace-tag="div" data-fallback-replace-class="qc-fb-photo-fallback" data-fallback-replace-text="${escapeHtml(initials)}">`
    : `<div class="qc-fb-photo-fallback">${escapeHtml(initials)}</div>`;

  let currentClubHtml = '';
  const curClubName = (data.currentClub && data.currentClub.name) || data.club || '';
  const curClubId = (data.currentClub && data.currentClub.id) || data.clubId || null;
  const curClubCrest = (data.currentClub && data.currentClub.crestUrl) || data.clubCrest || '';
  const curLeague = (data.currentClub && data.currentClub.league) || data.league || '';
  const curLeagueFlag = (data.currentClub && data.currentClub.leagueFlagUrl) || data.leagueFlagUrl || '';
  const curAppointed = (data.currentClub && data.currentClub.appointed) || data.appointed || '';

  if (curClubName) {
    const crestImg = curClubCrest ? `<img class="qc-fb-club-crest" src="${escapeHtml(curClubCrest)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : '';
    const clubNameInner = curClubId ? footballNavLinkHtml(curClubName, 'team', curClubId) : escapeHtml(curClubName);
    const leagueInner = curLeague ? `<div class="qc-fb-coach-league-line">${curLeagueFlag ? `<img class="qc-fb-flag" src="${escapeHtml(curLeagueFlag)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : ''}${escapeHtml(curLeague)}</div>` : '';
    const appointedLine = curAppointed ? `<div class="qc-fb-coach-meta">Appointed: ${escapeHtml(curAppointed)}</div>` : '';

    currentClubHtml = `<div class="qc-fb-coach-current-club"><div class="qc-fb-coach-current-crest">${crestImg}</div><div class="qc-fb-coach-current-info"><div class="qc-fb-coach-current-name">${clubNameInner}</div><div class="qc-fb-coach-current-role">Manager</div>${leagueInner}${appointedLine}</div></div>`;
  }

  let clubLine = '';

  const ageStr = (data.age !== null && data.age !== undefined)
    ? `${data.age} years old`
    : (data.dob || '');

  const asPlayerLine = data.asPlayerId
    ? `<div class="qc-fb-club-line">${footballNavLinkHtml('Former player profile', 'player', data.asPlayerId)}</div>`
    : '';

  let honoursHtml = '';
  if (Array.isArray(data.honours) && data.honours.length) {
    honoursHtml = `<div class="qc-fb-section-title" style="margin-top:16px;"><span class="blue-bar"></span> Honours</div><div class="qc-fb-honours-row qc-fb-honours-row-new">${data.honours.map(h => {
      const label = h.title ? `${h.count ? h.count+'x ' : ''}${h.title}${footballFormatHonourSeasons(h.seasons)}` : (h.label||'Trophy');
      const inner = h.logoUrl ? `<img class="qc-fb-honour-img" src="${escapeHtml(h.logoUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-replace-tag="span" data-fallback-replace-class="qc-fb-honour-emoji" data-fallback-replace-text="🏆">` : '<span class="qc-fb-honour-emoji">🏆</span>';
      return `<span class="qc-fb-honour" title="${escapeHtml(label)}">${inner}<b>${h.count?escapeHtml(String(h.count))+'x':''}</b></span>`;
    }).join('')}</div>`;
  }

  const contractRow = footballSettings.footballFieldCoachContract
    ? `<div class="qc-fb-info-item-new"><div class="lbl">Contract Until</div><div class="val">${footballValueOrPlaceholder(data.contractUntil)}</div></div>` : '';
  const extraFieldsHtml = [
    (footballSettings.footballFieldCoachLicence && data.coachingLicence) ? `<div class="qc-fb-info-item-new"><div class="lbl">Coaching Licence</div><div class="val">${escapeHtml(data.coachingLicence)}</div></div>` : '',
    (footballSettings.footballFieldCoachFormation && data.preferredFormation) ? `<div class="qc-fb-info-item-new"><div class="lbl">Preferred Formation</div><div class="val">${escapeHtml(data.preferredFormation)}</div></div>` : '',
    (footballSettings.footballFieldCoachAvgTerm && data.avgTermAsCoach) ? `<div class="qc-fb-info-item-new"><div class="lbl">Avg. Term as Coach</div><div class="val">${escapeHtml(data.avgTermAsCoach)}</div></div>` : '',
    (footballSettings.footballFieldCoachAgent && data.agent) ? `<div class="qc-fb-info-item-new"><div class="lbl">Agent</div><div class="val">${escapeHtml(data.agent)}</div></div>` : ''
  ].join('');

  const coachLinks = footballBuildStandardLinks(data, { kind: 'coach', transfermarktUrl: data.profileUrl });
  const footerHtml = coachLinks.length ? `<div class="qc-fb-footer">${buildExternalLinksHtml(coachLinks)}</div>` : '';

  return `<div class="qc-football-card qc-football-card-new">
<div class="qc-fb-top-new">
  <div class="qc-fb-photo-col-new">
    <div class="qc-fb-photo-wrap-new">${photoHtml}</div>
  </div>
  <div class="qc-fb-main-col-new">
    <div class="qc-fb-player-name-new">${escapeHtml(name)}</div>
    ${currentClubHtml}
    ${asPlayerLine}
    <div class="qc-fb-info-2col-new">
      <div class="qc-fb-info-item-new"><div class="lbl">Role</div><div class="val">${footballValueOrPlaceholder(data.role)}</div></div>
      <div class="qc-fb-info-item-new"><div class="lbl">Age</div><div class="val">${ageStr || FOOTBALL_PLACEHOLDER}</div></div>
      ${contractRow}
      ${extraFieldsHtml}
    </div>
  </div>
</div>
${honoursHtml}
${footerHtml}
</div>`;
}

function buildFootballCoachMiniHtml(data) {
  const rows = [];
  const curClubName = (data.currentClub && data.currentClub.name) || data.club || '';
  const curClubId = (data.currentClub && data.currentClub.id) || data.clubId || null;
  if (curClubName) {
    rows.push(`Club: <b>${curClubId ? footballNavLinkHtml(curClubName, 'team', curClubId) : escapeHtml(curClubName)}</b>`);
    if (data.role) rows.push(`Role: <b>${escapeHtml(data.role)}</b>`);
  }
  if (footballSettings.footballFieldNationality && footballDisplayNationalities(data.nationalities)) {
    rows.push(`Nationality: <b>${escapeHtml(footballDisplayNationalities(data.nationalities))}</b>`);
  }
  const ageStr = (data.age !== null && data.age !== undefined)
    ? `${data.age}${data.dob ? ` (${data.dob})` : ''}`
    : data.dob;
  rows.push(`Age: <b>${footballValueOrPlaceholder(ageStr)}</b>`);

  if (footballSettings.footballFieldCoachContract) rows.push(`Contract Until: <b>${footballValueOrPlaceholder(data.contractUntil)}</b>`);
  if (footballSettings.footballFieldCoachLicence && data.coachingLicence) rows.push(`Coaching Licence: <b>${escapeHtml(data.coachingLicence)}</b>`);
  if (footballSettings.footballFieldCoachFormation && data.preferredFormation) rows.push(`Preferred Formation: <b>${escapeHtml(data.preferredFormation)}</b>`);
  if (footballSettings.footballFieldCoachAvgTerm && data.avgTermAsCoach) rows.push(`Avg. Term as Coach: <b>${escapeHtml(data.avgTermAsCoach)}</b>`);
  if (footballSettings.footballFieldCoachAgent) rows.push(`Agent: <b>${footballValueOrPlaceholder(data.agent)}</b>`);

  let honoursHtml = '';
  if (footballSettings.footballFieldHonours && data.honours && data.honours.length) {
    honoursHtml = `<div class="qc-fb-mini-section-title">Honours</div><div class="qc-fb-honours-row qc-fb-honours-row-new">${data.honours.map(h => {
      const label = h.title ? `${h.count ? h.count+'x ' : ''}${h.title}${footballFormatHonourSeasons(h.seasons)}` : (h.label||'Trophy');
      const inner = h.logoUrl ? `<img class="qc-fb-honour-img" src="${escapeHtml(h.logoUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-replace-tag="span" data-fallback-replace-class="qc-fb-honour-emoji" data-fallback-replace-text="🏆">` : '<span class="qc-fb-honour-emoji">🏆</span>';
      return `<span class="qc-fb-honour" title="${escapeHtml(label)}">${inner}<b>${h.count?escapeHtml(String(h.count))+'x':''}</b></span>`;
    }).join('')}</div>`;
  }

  const imgHtml = data.photo ? `<img src="${escapeHtml(data.photo)}" alt="${escapeHtml(data.name)}" referrerpolicy="no-referrer">` : '';
  return `
    <div class="row">
      ${imgHtml}
      <div class="content">
        <p class="name qc-selectable">${escapeHtml(data.name || 'Coach')}</p>
        <div class="meta qc-selectable">${rows.map((r) => `<div>${r}</div>`).join('')}</div>
        ${honoursHtml}
        ${buildExternalLinksHtml(footballBuildStandardLinks(data, { kind: 'coach', transfermarktUrl: data.profileUrl }))}
      </div>
    </div>
  `;
}

function footballBuildMatchesSectionHtml(matches, isPast, title, limit, variant) {
  if (!Array.isArray(matches) || !matches.length) return '';

  const inferredVariant = variant || (matches[0] && matches[0]._variant) || (matches[0] && matches[0].homeTeam && matches[0].awayTeam && !matches[0].opponentId ? 'player' : 'team');
  const isPlayer = inferredVariant === 'player' || inferredVariant === 'Player';

  const cards = matches.slice(0, limit).map(m => {
    const reportLink = m.id ? `https://www.transfermarkt.com/spielbericht/index/spielbericht/${encodeURIComponent(m.id)}` : (m.link || '#');
    const comp = escapeHtml(m.competition || '');
    const date = m.date ? escapeHtml(String(m.date)) : '';

    if (isPlayer) {

      const homeId = m.homeTeam && m.homeTeam.id ? String(m.homeTeam.id) : null;
      const awayId = m.awayTeam && m.awayTeam.id ? String(m.awayTeam.id) : null;
      const homeName = m.homeTeam ? (m.homeTeam.name || 'Home') : 'Home';
      const awayName = m.awayTeam ? (m.awayTeam.name || 'Away') : 'Away';
      const homeCrestInner = m.homeTeam && m.homeTeam.crest ? `<img class="qc-fb-player-match-badge" src="${escapeHtml(m.homeTeam.crest)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : `<div class="qc-fb-player-match-badge-fallback">${escapeHtml(homeName.slice(0,3).toUpperCase())}</div>`;
      const awayCrestInner = m.awayTeam && m.awayTeam.crest ? `<img class="qc-fb-player-match-badge" src="${escapeHtml(m.awayTeam.crest)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : `<div class="qc-fb-player-match-badge-fallback">${escapeHtml(awayName.slice(0,3).toUpperCase())}</div>`;
      const homeCrest = homeId ? `<span class="qc-nav-link" data-nav-kind="team" data-nav-id="${escapeHtml(homeId)}">${homeCrestInner}</span>` : homeCrestInner;
      const awayCrest = awayId ? `<span class="qc-nav-link" data-nav-kind="team" data-nav-id="${escapeHtml(awayId)}">${awayCrestInner}</span>` : awayCrestInner;
      const homeLink = homeId ? footballNavLinkHtml(homeName, 'team', homeId) : escapeHtml(homeName);
      const awayLink = awayId ? footballNavLinkHtml(awayName, 'team', awayId) : escapeHtml(awayName);

      if (isPast) {
        return `<div class="qc-fb-player-match-card qc-fb-player-match-past"><a href="${escapeHtml(reportLink)}" target="_blank" class="qc-fb-player-match-link"><div class="qc-fb-player-match-both"><div class="qc-fb-player-team-side">${homeCrest}<div class="qc-fb-player-team-name" title="${escapeHtml(homeName)}">${homeLink}</div></div><span class="qc-fb-player-vs qc-fb-player-result-mid">${m.result ? escapeHtml(String(m.result)) : 'vs'}</span><div class="qc-fb-player-team-side">${awayCrest}<div class="qc-fb-player-team-name" title="${escapeHtml(awayName)}">${awayLink}</div></div></div><div class="qc-fb-player-match-comp">${comp}</div><div class="qc-fb-player-match-date">${date}</div></a></div>`;
      }
      return `<div class="qc-fb-player-match-card qc-fb-player-match-future"><a href="${escapeHtml(reportLink)}" target="_blank" class="qc-fb-player-match-link"><div class="qc-fb-player-match-both"><div class="qc-fb-player-team-side">${homeCrest}<div class="qc-fb-player-team-name" title="${escapeHtml(homeName)}">${homeLink}</div></div><span class="qc-fb-player-vs">vs</span><div class="qc-fb-player-team-side">${awayCrest}<div class="qc-fb-player-team-name" title="${escapeHtml(awayName)}">${awayLink}</div></div></div><div class="qc-fb-player-match-comp">${comp}</div><div class="qc-fb-player-match-date">${date}</div></a></div>`;
    } else {

      const oppId = m.opponentId ? String(m.opponentId) : null;
      const oppNameLink = oppId ? footballNavLinkHtml(m.opponent || 'Opponent', 'team', oppId) : escapeHtml(m.opponent || 'Opponent');
      const crestInner = m.crest ? `<img class="qc-fb-team-match-badge" src="${escapeHtml(m.crest)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : `<div class="qc-fb-team-match-badge-fallback">${escapeHtml((m.opponent || 'OPP').slice(0, 3).toUpperCase())}</div>`;
      const crestLink = oppId ? `<span class="qc-nav-link" data-nav-kind="team" data-nav-id="${escapeHtml(oppId)}">${crestInner}</span>` : crestInner;
      if (isPast) {
        return `<div class="qc-fb-team-match-card qc-fb-team-match-past"><a href="${escapeHtml(reportLink)}" target="_blank" class="qc-fb-team-match-link"><div class="qc-fb-team-match-result-row"><span class="qc-fb-team-match-result">${m.result ? escapeHtml(String(m.result)) : ''}</span></div>${crestLink}<div class="qc-fb-team-match-opp qc-fb-team-match-opp-past" title="${escapeHtml(m.opponent || '')}">${oppNameLink}</div><div class="qc-fb-team-match-comp">${comp}</div><div class="qc-fb-team-match-date">${date}</div></a></div>`;
      }
      return `<div class="qc-fb-team-match-card qc-fb-team-match-future"><a href="${escapeHtml(reportLink)}" target="_blank" class="qc-fb-team-match-link">${crestLink}<div class="qc-fb-team-match-opp" title="${escapeHtml(m.opponent || '')}">${oppNameLink}</div><div class="qc-fb-team-match-comp">${comp}</div><div class="qc-fb-team-match-date">${date}${m.isHome != null ? (m.isHome ? ' (H)' : ' (A)') : ''}</div></a></div>`;
    }
  }).join('');

  if (isPlayer) {
    const gridClass = isPast ? 'qc-fb-player-matches-past-grid' : 'qc-fb-player-matches-future-grid';
    const sectionClass = isPast ? 'qc-fb-player-section-title qc-fb-player-prev-title' : 'qc-fb-player-section-title qc-fb-player-next-title';
    return `<div class="${sectionClass}" style="margin-top:16px;"><span class="blue-bar"></span> ${escapeHtml(title)}</div><div class="qc-fb-player-matches-grid ${gridClass}">${cards}</div>`;
  } else {
    const gridClass = isPast ? 'qc-fb-team-matches-past-grid' : 'qc-fb-team-matches-future-grid';
    return `<div class="qc-fb-team-section-title" style="margin-top:16px;"><span class="blue-bar"></span> ${escapeHtml(title)}</div><div class="qc-fb-team-matches-grid ${gridClass}">${cards}</div>`;
  }
}

function buildFootballTeamHtml(data) {
  const name = data.name || 'Loading...';
  const initials = footballInitials(name);
  const crestHtml = data.crest
    ? `<img class="qc-fb-team-crest" src="${escapeHtml(data.crest)}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer" data-fallback-replace-tag="div" data-fallback-replace-class="qc-fb-photo-fallback qc-fb-team-crest-fallback" data-fallback-replace-text="${escapeHtml(initials.slice(0,3))}">`
    : `<div class="qc-fb-photo-fallback qc-fb-team-crest-fallback">${escapeHtml(initials.slice(0,3))}</div>`;

  const showManager = true;
  const showLeague = true;
  const showOverview = true;
  const showMarketValue = footballSettings.footballFieldTeamMarketValue !== false;
  const showTopPlayers = footballSettings.footballFieldTeamTopPlayers !== false;
  const showPhotos = footballSettings.footballFieldTeamTopPlayersPhotos !== false;
  const showNextMatches = footballSettings.footballFieldTeamNextMatches !== false;
  const showPrevMatches = footballSettings.footballFieldTeamPrevMatches !== false;
  const showHonours = footballSettings.footballFieldTeamHonours !== false;

  let leagueLabel = data.league || '';

  const LEAGUE_COUNTRY_ID_MAP = { IT1: 75, GB1: 189, ES1: 157, L1: 40, FR1: 50 };
  if(/^[A-Z]{2,4}[0-9]*$/.test(leagueLabel)){
    if(leagueLabel==='IT1') leagueLabel='Serie A';
    else if(leagueLabel==='GB1') leagueLabel='Premier League';
    else if(leagueLabel==='ES1') leagueLabel='LaLiga';
    else if(leagueLabel==='L1') leagueLabel='Bundesliga';
    else if(leagueLabel==='FR1') leagueLabel='Ligue 1';
  }
  if(!leagueLabel && data.leagueId){
    const up = String(data.leagueId).toUpperCase();
    if(up==='IT1') leagueLabel='Serie A';
    else if(up==='GB1') leagueLabel='Premier League';
    else if(up==='ES1') leagueLabel='LaLiga';
    else if(up==='L1') leagueLabel='Bundesliga';
    else if(up==='FR1') leagueLabel='Ligue 1';
    else leagueLabel = data.league || String(data.leagueId);
  }

  const leagueKeyForCountry = (data.leagueId || data.league || '').toString().toUpperCase();
  const resolvedCountryId = data.countryId || LEAGUE_COUNTRY_ID_MAP[leagueKeyForCountry] || null;
  const countryFlagUrl = resolvedCountryId ? `https://tmssl.akamaized.net/images/flagge/small/${encodeURIComponent(resolvedCountryId)}.png` : null;
  const countryFlagImg = countryFlagUrl ? `<img class="qc-fb-flag qc-fb-team-country-flag" src="${escapeHtml(countryFlagUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : '';

  const leagueIconImg = data.leagueLogoUrl ? `<img class="qc-fb-team-league-icon" src="${escapeHtml(data.leagueLogoUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : '';
  const leagueLine = showLeague && (leagueLabel || data.countryName || countryFlagUrl)
    ? `<div class="qc-fb-team-league-row">${countryFlagImg}${leagueIconImg} <b>${escapeHtml(leagueLabel|| data.countryName || '')}</b></div>`
    : '';

  const mvBlock = showMarketValue && data.marketValue
    ? `<div class="qc-fb-team-mv-block"><div class="qc-fb-team-mv-label">Market Value</div><div class="qc-fb-team-mv-value">${escapeHtml(String(data.marketValue))}</div></div>`
    : '';

  let managerHtmlInner = footballValueOrPlaceholder(data.manager);
  let managerPhotoHtml = '';
  if(showManager && data.managerDetails && data.managerDetails.name){
    const md = data.managerDetails;
    const flag = md.countryIcon ? `<img class="qc-fb-flag qc-fb-manager-flag" src="${escapeHtml(md.countryIcon)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : (md.countryId ? `<img class="qc-fb-flag qc-fb-manager-flag" src="https://tmssl.akamaized.net/images/flagge/small/${encodeURIComponent(md.countryId)}.png" alt="" referrerpolicy="no-referrer" data-fallback-hide>` : '');
    const contract = md.contractUntil && md.contractUntil!=='-' ? ` (${escapeHtml(String(md.contractUntil))})` : '';
    managerHtmlInner = data.managerId ? `${flag}${footballNavLinkHtml(md.name, 'coach', data.managerId)}${contract}` : `${flag}${escapeHtml(md.name)}${contract}`;

    if(md.profileImage){
      managerPhotoHtml = `<img class="qc-fb-team-manager-photo" src="${escapeHtml(md.profileImage)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>`;
    }
  } else if(showManager && data.manager && data.managerId){
    managerHtmlInner = footballNavLinkHtml(data.manager, 'coach', data.managerId);
  } else if(showManager && data.manager){
    managerHtmlInner = escapeHtml(data.manager);
  }

  const managerBlock = showManager ? `<div class="qc-fb-team-manager-card">${managerPhotoHtml}<div class="qc-fb-team-manager-text"><div class="lbl">👤 Manager</div><div class="val">${managerHtmlInner}</div></div></div>` : '';

  let overviewPanel = '';
  if(showOverview && data.squadOverview){
    const ov = data.squadOverview;
    overviewPanel = `<div class="qc-fb-team-overview-panel">
      <div class="qc-fb-team-overview-title"><span class="blue-bar"></span> Squad Overview</div>
      <div class="qc-fb-team-overview-grid">
        ${ov.total ? `<div class="qc-fb-team-overview-item"><div class="icon">👥</div><div class="num">${escapeHtml(String(ov.total))}</div><div class="lbl">Players</div></div>` : ''}
        ${ov.avgAge ? `<div class="qc-fb-team-overview-item"><div class="icon">🧍</div><div class="num">${escapeHtml(String(ov.avgAge))}</div><div class="lbl">Avg. Age</div></div>` : ''}
        ${ov.gk!=null ? `<div class="qc-fb-team-overview-item"><div class="icon">👕</div><div class="num">${escapeHtml(String(ov.gk))}</div><div class="lbl">GK</div></div>` : ''}
        ${ov.def!=null ? `<div class="qc-fb-team-overview-item"><div class="icon">🛡️</div><div class="num">${escapeHtml(String(ov.def))}</div><div class="lbl">DEF</div></div>` : ''}
        ${ov.mid!=null ? `<div class="qc-fb-team-overview-item"><div class="icon">🎯</div><div class="num">${escapeHtml(String(ov.mid))}</div><div class="lbl">MID</div></div>` : ''}
        ${ov.fwd!=null ? `<div class="qc-fb-team-overview-item"><div class="icon">⚡</div><div class="num">${escapeHtml(String(ov.fwd))}</div><div class="lbl">FWD</div></div>` : ''}
      </div>
    </div>`;
  }

  const rightCol = overviewPanel ? `<div class="qc-fb-team-right-col">${overviewPanel}</div>` : '';

  let honoursHtml = '';
  if(showHonours && Array.isArray(data.honours) && data.honours.length){
    honoursHtml = `<div class="qc-fb-honours-row qc-fb-team-honours-row">${data.honours.map(h=>{
      const label = h.title ? `${h.count ? h.count+'x ' : ''}${h.title}${footballFormatHonourSeasons(h.seasons)}` : (h.label||'Trophy');
      const inner = h.logoUrl ? `<img class="qc-fb-honour-img" src="${escapeHtml(h.logoUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-replace-tag="span" data-fallback-replace-class="qc-fb-honour-emoji" data-fallback-replace-text="🏆">` : '<span class="qc-fb-honour-emoji">🏆</span>';
      return `<span class="qc-fb-honour" title="${escapeHtml(label)}">${inner}<b>${h.count?escapeHtml(String(h.count))+'x':''}</b></span>`;
    }).join('')}</div>`;
  }

  function footballPosOrder(p){
    const raw = (p.position || p.shortPos || '').toString().toLowerCase();
    if(raw.includes('goalkeeper')||raw==='gk'||raw.includes('torwart')||raw.includes('keeper')) return 0;
    if(raw.includes('back')||raw.includes('defence')||raw.includes('defense')||raw.includes('defender')||raw.includes('centre-back')||raw.includes('center-back')) return 1;

    if(raw.includes('midfield')||raw.includes('mid')) return 2;
    if(raw.includes('winger')||raw.includes('forward')||raw.includes('striker')||raw.includes('attack')) return 3;
    const sp = (p.shortPos||'').toString().toUpperCase();
    if(sp==='GK') return 0;
    if(['CB','LB','RB','LWB','RWB','DF','DEF'].includes(sp)) return 1;
    if(['CM','DM','AM','LM','RM','MF','MID','CDM','CAM'].includes(sp)) return 2;
    if(['CF','ST','LW','RW','FW','FWD','SS'].includes(sp)) return 3;
    return 4;
  }
  let fullSquad = (Array.isArray(data.allSquad) && data.allSquad.length) ? data.allSquad.slice() : (Array.isArray(data.topPlayers) ? data.topPlayers.slice() : []);
  const seenIds = new Set();
  fullSquad = fullSquad.filter(p=>{ if(!p||!p.id) return true; const sid=String(p.id); if(seenIds.has(sid)) return false; seenIds.add(sid); return true; });
  fullSquad.sort((a,b)=>{
    const oa = footballPosOrder(a);
    const ob = footballPosOrder(b);
    if(oa!==ob) return oa-ob;
    return (b.marketValueNum||0) - (a.marketValueNum||0);
  });
  let players = fullSquad.slice(0,5);
  let remainingPlayers = fullSquad.slice(5);
  let playersSection = '';
  if(showTopPlayers){
    if(fullSquad.length){
      const buildRow = (p)=>{
        const pName = p.name || '—';
        const pId = p.id;
        const nameLink = pId ? footballNavLinkHtml(pName, 'player', pId) : escapeHtml(pName);
        const pos = p.shortPos || p.position || '—';
        const avatarInner = (()=>{
          if(!showPhotos) return `<div class="qc-fb-team-avatar-fallback">${escapeHtml(footballInitials(pName).slice(0,2))}</div>`;
          if(p.photo) return `<img class="qc-fb-team-avatar" src="${escapeHtml(p.photo.replace(/\/big\//, '/small/'))}" alt="${escapeHtml(pName)}" referrerpolicy="no-referrer" data-fallback-replace-tag="div" data-fallback-replace-class="qc-fb-team-avatar-fallback" data-fallback-replace-text="${escapeHtml(footballInitials(pName).slice(0,2))}">`;
          return `<div class="qc-fb-team-avatar-fallback">${escapeHtml(footballInitials(pName).slice(0,2))}</div>`;
        })();

        const avatar = p.shirtNumber
          ? `<div class="qc-fb-team-avatar-wrap">${avatarInner}<span class="qc-fb-team-avatar-num">${escapeHtml(String(p.shirtNumber))}</span></div>`
          : avatarInner;
        const role = p.position ? `<div class="qc-fb-team-player-role">${escapeHtml(p.position)}</div>` : '';
        const mv = p.marketValue ? `<span class="qc-fb-team-mv-cell">${escapeHtml(p.marketValue)}</span>` : FOOTBALL_PLACEHOLDER;
        return `<tr>
          <td><div class="qc-fb-team-player-cell">${avatar}<div><div class="qc-fb-team-player-name">${nameLink}</div>${role}</div></div></td>
          <td><span class="qc-fb-team-pos-tag">${escapeHtml(pos)}</span></td>
          <td>${mv}</td>
        </tr>`;
      };
      const visibleRows = players.map(buildRow).join('');
      const hiddenRows = remainingPlayers.map(buildRow).join('');
      const hasHidden = remainingPlayers.length>0;
      const hiddenBody = hasHidden ? `<tbody class="qc-fb-squad-hidden">${hiddenRows}</tbody>` : '';

      const toggleBtn = hasHidden ? `<button class="qc-fb-squad-toggle-btn" data-expanded="0">Show All ▼</button>` : '';
      playersSection = `<div class="qc-fb-team-section-title"><span class="blue-bar"></span> Top Players</div>
        <table class="qc-fb-team-players-table"><thead><tr><th>Player</th><th>Pos</th><th>Value</th></tr></thead><tbody>${visibleRows}</tbody>${hiddenBody}</table>${toggleBtn}`;
    } else {
      playersSection = `<div class="qc-fb-team-section-title"><span class="blue-bar"></span> Top Players</div><div class="qc-fb-stub-note">Squad list not loaded yet.</div>`;
    }
  }

  const viewAllLink = data.id ? `<a class="qc-fb-team-view-all" href="https://www.transfermarkt.com/-/kader/verein/${escapeHtml(String(data.id))}" target="_blank">View Full Squad →</a>` : '';

  let nextMatchesSection = footballBuildMatchesSectionHtml(showNextMatches ? data.nextMatches : null, false, 'Next 5 Matches', 5, 'team');
  let prevMatchesSection = footballBuildMatchesSectionHtml(showPrevMatches ? data.prevMatches : null, true, 'Previous Matches', 3, 'team');

  const teamLinks = footballBuildStandardLinks(data, {
    kind: 'team',
    transfermarktUrl: data.id ? `https://www.transfermarkt.com/-/startseite/verein/${data.id}` : null
  });

  const footerHtml = teamLinks.length ? `<div class="qc-fb-team-footer-links">${buildExternalLinksHtml(teamLinks)}</div>` : '';

  return `<div class="qc-football-card qc-football-card-new qc-football-team-card">
  <div class="qc-fb-team-header">
    <div class="qc-fb-team-crest-col">
      <div class="qc-fb-team-crest-wrap">${crestHtml}</div>
    </div>
    <div class="qc-fb-team-main">
      <div class="qc-fb-player-name-new">${escapeHtml(name)}</div>
      ${leagueLine}
      ${mvBlock}
    </div>
    ${rightCol}
  </div>
  ${honoursHtml}

  <hr class="qc-fb-sep">
  ${managerBlock}
  ${playersSection}
  ${viewAllLink}
  ${nextMatchesSection}
  ${prevMatchesSection}
  ${footerHtml}
</div>`;
}

function footballResolveMiniTeamLeagueLabel(data) {
  let leagueLabel = data.league || '';
  if (/^[A-Z]{2,4}[0-9]*$/.test(leagueLabel)) {
    if (leagueLabel === 'IT1') leagueLabel = 'Serie A';
    else if (leagueLabel === 'GB1') leagueLabel = 'Premier League';
    else if (leagueLabel === 'ES1') leagueLabel = 'LaLiga';
    else if (leagueLabel === 'L1') leagueLabel = 'Bundesliga';
    else if (leagueLabel === 'FR1') leagueLabel = 'Ligue 1';
  }
  if (!leagueLabel && data.leagueId) {
    const leagueCode = String(data.leagueId).toUpperCase();
    if (leagueCode === 'IT1') leagueLabel = 'Serie A';
    else if (leagueCode === 'GB1') leagueLabel = 'Premier League';
    else if (leagueCode === 'ES1') leagueLabel = 'LaLiga';
    else if (leagueCode === 'L1') leagueLabel = 'Bundesliga';
    else if (leagueCode === 'FR1') leagueLabel = 'Ligue 1';
    else leagueLabel = data.league || String(data.leagueId);
  }
  return leagueLabel;
}

function footballBuildMiniTeamSquadListHtml(data) {
  if (footballSettings.footballFieldTeamTopPlayers === false) return '';
  const squadPlayerList = (Array.isArray(data.allSquad) && data.allSquad.length)
    ? data.allSquad.slice()
    : (Array.isArray(data.topPlayers) ? data.topPlayers.slice() : []);
  if (!squadPlayerList.length) return '';
  const squadRowHtml = (squadPlayer) => {
    const playerDisplayName = squadPlayer.name || '—';
    const playerDisplayId = squadPlayer.id;
    const playerNameCell = playerDisplayId ? footballNavLinkHtml(playerDisplayName, 'player', playerDisplayId) : escapeHtml(playerDisplayName);
    const shirtNumberCell = (squadPlayer.shirtNumber !== null && squadPlayer.shirtNumber !== undefined && String(squadPlayer.shirtNumber).trim() !== '')
      ? `<span class="qc-fb-mini-squad-num">${escapeHtml(String(squadPlayer.shirtNumber))}</span>`
      : '<span class="qc-fb-mini-squad-num qc-fb-mini-squad-num-empty">–</span>';
    return `<span class="qc-fb-mini-squad-row">${shirtNumberCell}<span class="qc-fb-mini-squad-name">${playerNameCell}</span></span>`;
  };
  const visibleSquadPlayers = squadPlayerList.slice(0, 8);
  const hiddenSquadPlayers = squadPlayerList.slice(8);
  const visibleSquadHtml = visibleSquadPlayers.map(squadRowHtml).join('');
  const hiddenSquadHtml = hiddenSquadPlayers.length
    ? `<details class="qc-fb-mini-squad-details"><summary class="qc-book-subjects-summary">Show All</summary><div class="qc-fb-mini-squad-list">${hiddenSquadPlayers.map(squadRowHtml).join('')}</div></details>`
    : '';

  return `<div class="qc-fb-mini-section-title">Squad</div><div class="qc-fb-mini-squad-list">${visibleSquadHtml}</div>${hiddenSquadHtml}`;
}

function footballBuildMiniTeamOverviewStripHtml(data) {
  const squadOverview = data && data.squadOverview;
  if (!squadOverview) return '';
  const overviewStatBoxes = [];
  if (squadOverview.total) overviewStatBoxes.push(footballBuildMiniSeasonStatBox(escapeHtml(String(squadOverview.total)), 'Players'));
  if (squadOverview.avgAge) overviewStatBoxes.push(footballBuildMiniSeasonStatBox(escapeHtml(String(squadOverview.avgAge)), 'Avg. Age'));
  if (squadOverview.gk !== null && squadOverview.gk !== undefined) overviewStatBoxes.push(footballBuildMiniSeasonStatBox(escapeHtml(String(squadOverview.gk)), 'GK'));
  if (squadOverview.def !== null && squadOverview.def !== undefined) overviewStatBoxes.push(footballBuildMiniSeasonStatBox(escapeHtml(String(squadOverview.def)), 'DEF'));
  if (squadOverview.mid !== null && squadOverview.mid !== undefined) overviewStatBoxes.push(footballBuildMiniSeasonStatBox(escapeHtml(String(squadOverview.mid)), 'MID'));
  if (squadOverview.fwd !== null && squadOverview.fwd !== undefined) overviewStatBoxes.push(footballBuildMiniSeasonStatBox(escapeHtml(String(squadOverview.fwd)), 'FWD'));
  if (!overviewStatBoxes.length) return '';
  return `<div class="qc-fb-mini-section-title">Squad Overview</div><div class="qc-fb-mini-season-strip">${overviewStatBoxes.join('')}</div>`;
}

function buildFootballTeamMiniHtml(data) {
  const name = data.name || 'Team';
  const crestHtml = data.crest
    ? `<img src="${escapeHtml(data.crest)}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer">`
    : '';
  const rows = [];

  const teamMiniLeagueLabel = footballResolveMiniTeamLeagueLabel(data);
  if (teamMiniLeagueLabel || data.countryId || data.leagueLogoUrl) {
    const teamMiniLeagueCode = String(data.leagueId || data.league || '').toUpperCase();
    const teamMiniCountryId = data.countryId || null;
    const teamMiniCountryFlagHtml = teamMiniCountryId
      ? `<img class="qc-fb-flag qc-fb-mini-team-flag" src="https://tmssl.akamaized.net/images/flagge/small/${encodeURIComponent(teamMiniCountryId)}.png" alt="" referrerpolicy="no-referrer" data-fallback-hide>`
      : '';
    const teamMiniLeagueIconUrl = data.leagueLogoUrl || (teamMiniLeagueCode ? `https://img.a.transfermarkt.technology/logo/homepageWappen150x150/${encodeURIComponent(teamMiniLeagueCode.toLowerCase())}.png` : null);
    const teamMiniLeagueIconHtml = teamMiniLeagueIconUrl
      ? `<img class="qc-fb-mini-league-icon" src="${escapeHtml(teamMiniLeagueIconUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-hide>`
      : '';
    rows.push(`League: <b>${teamMiniCountryFlagHtml}${teamMiniLeagueIconHtml}${escapeHtml(teamMiniLeagueLabel)}</b>`);
  }
  if (footballSettings.footballFieldTeamMarketValue !== false && data.marketValue) {
    rows.push(`Market value: <b>${escapeHtml(String(data.marketValue))}</b>`);
  }
  if (data.manager) {
    rows.push(`Manager: <b>${data.managerId ? footballNavLinkHtml(data.manager, 'coach', data.managerId) : escapeHtml(data.manager)}</b>`);
  }

  let honoursHtml = '';
  if (footballSettings.footballFieldTeamHonours !== false && Array.isArray(data.honours) && data.honours.length) {
    honoursHtml = `<div class="qc-fb-mini-section-title">Honours</div><div class="qc-fb-honours-row qc-fb-honours-row-new">${data.honours.map(h => {
      const label = h.title ? `${h.count ? h.count+'x ' : ''}${h.title}${footballFormatHonourSeasons(h.seasons)}` : (h.label||'Trophy');
      const inner = h.logoUrl ? `<img class="qc-fb-honour-img" src="${escapeHtml(h.logoUrl)}" alt="" referrerpolicy="no-referrer" data-fallback-replace-tag="span" data-fallback-replace-class="qc-fb-honour-emoji" data-fallback-replace-text="🏆">` : '<span class="qc-fb-honour-emoji">🏆</span>';
      return `<span class="qc-fb-honour" title="${escapeHtml(label)}">${inner}<b>${h.count?escapeHtml(String(h.count))+'x':''}</b></span>`;
    }).join('')}</div>`;
  }

  const miniTeamOverviewHtml = footballBuildMiniTeamOverviewStripHtml(data);
  const miniTeamSquadHtml = footballBuildMiniTeamSquadListHtml(data);

  return `
    <div class="row">
      ${crestHtml}
      <div class="content">
        <p class="name qc-selectable">${escapeHtml(name)}</p>
        <div class="meta qc-selectable">${rows.map((r) => `<div>${r}</div>`).join('')}</div>
        ${honoursHtml}
        ${miniTeamOverviewHtml}
        ${miniTeamSquadHtml}
        ${buildExternalLinksHtml(footballBuildStandardLinks(data, {
          kind: 'team',
          transfermarktUrl: data.id ? `https://www.transfermarkt.com/-/startseite/verein/${data.id}` : null
        }))}
      </div>
    </div>
  `;
}

async function renderFootballCoachCard(id, banner = '') {

  const navToken = navBeginRender();

  navSetRerenderFn(() => renderFootballCoachCard(id, banner));
  const cacheEntry = getFootballCoachCacheEntry(id);

  if (cacheEntry.finalHtml) {
    updateSelectionPopup(`${banner}${cacheEntry.finalHtml}`, false);
    return;
  }

  updateSelectionPopup(`${banner}<div class="loading">Loading...</div>`, false);

  const response = await fetchFootballCoachDetails(id);
  if (!navIsTokenCurrent(navToken)) return;

  if (!response || !response.ok) {
    const error = response && response.error ? ` (${escapeHtml(response.error)})` : '';
    updateSelectionPopup(`${banner}<div class="loading">Couldn't load that coach${error}.</div><div><button class="qc-retry-btn">Retry</button></div>`, false);
    lastRetryFn = () => renderFootballCoachCard(id, banner);
    return;
  }

  const data = response.data;
  resolveImageUrl(data.photo, (resolved) => {
    if (!navIsTokenCurrent(navToken)) return;
    data.photo = resolved;

    const html = isFootballMiniStyle() ? buildFootballCoachMiniHtml(data) : buildFootballCoachHtml(data);
    cacheEntry.finalHtml = html;
    updateSelectionPopup(`${banner}${html}`, false);
  });
}

async function renderFootballTeamCard(id, banner = '') {

  const navToken = navBeginRender();

  navSetRerenderFn(() => renderFootballTeamCard(id, banner));
  const cacheEntry = getFootballTeamCacheEntry(id);

  if (cacheEntry.finalHtml) {
    updateSelectionPopup(`${banner}${cacheEntry.finalHtml}`, false);
    return;
  }

  let stage1Painted = false;
  const corePromise = fetchFootballTeamCoreDetails(id).then((coreResponse) => {
    if (!navIsTokenCurrent(navToken) || stage1Painted) return;
    if (!coreResponse || !coreResponse.ok) return;
    stage1Painted = true;

    const coreHtml = isFootballMiniStyle() ? buildFootballTeamMiniHtml(coreResponse.data) : buildFootballTeamHtml(coreResponse.data);
    updateSelectionPopup(`${banner}${coreHtml}`, false);
  }).catch(() => {});

  updateSelectionPopup(`${banner}<div class="loading">Loading...</div>`, false);

  const response = await fetchFootballTeamDetails(id, isFootballMiniStyle());
  stage1Painted = true;
  if (!navIsTokenCurrent(navToken)) return;

  if (!response || !response.ok) {
    const error = response && response.error ? ` (${escapeHtml(response.error)})` : '';
    updateSelectionPopup(`${banner}<div class="loading">Couldn't load that team${error}.</div><div><button class="qc-retry-btn">Retry</button></div>`, false);
    lastRetryFn = () => renderFootballTeamCard(id, banner);
    return;
  }

  const data = response.data;
  resolveImageUrl(data.crest, (resolvedCrest) => {
    if (!navIsTokenCurrent(navToken)) return;
    data.crest = resolvedCrest;

    if (isFootballMiniStyle()) {
      const miniHtml = buildFootballTeamMiniHtml(data);
      cacheEntry.finalHtml = miniHtml;
      updateSelectionPopup(`${banner}${miniHtml}`, false);
      return;
    }

    const managerPhotoUrl = data.managerDetails && data.managerDetails.profileImage;
    resolveImageUrl(managerPhotoUrl, (resolvedManagerPhoto) => {
      if (!navIsTokenCurrent(navToken)) return;
      if (data.managerDetails) data.managerDetails.profileImage = resolvedManagerPhoto;
      const html = buildFootballTeamHtml(data);
      cacheEntry.finalHtml = html;
      updateSelectionPopup(`${banner}${html}`, false);
    });
  });
}

const FOOTBALL_NETWORK_RETRY_DELAYS_MS = [700, 1400];

let footballSearchToken = null;

async function runFootballSearch(query, translationInfo, requestToken, watchdogTimer, sessionNavToken, attempt = 0) {
  const banner = buildTranslationBanner(translationInfo);

  const response = await fetchFootballSearch(query);

  if (footballSearchToken !== requestToken) return;

  if (!navIsTokenCurrent(sessionNavToken)) return;
  if (!selectionPopupEl) return;

  const isNetworkFailure = !!(response && response.ok === false && response.reason === 'network');

  if (isNetworkFailure && attempt < FOOTBALL_NETWORK_RETRY_DELAYS_MS.length) {
    const nextAttempt = attempt + 1;
    updateSelectionPopup(
      `${banner}<div class="loading">Network error — retrying... (${nextAttempt}/${FOOTBALL_NETWORK_RETRY_DELAYS_MS.length + 1})</div>`,
      false
    );
    setTimeout(() => {
      runFootballSearch(query, translationInfo, requestToken, watchdogTimer, sessionNavToken, nextAttempt);
    }, FOOTBALL_NETWORK_RETRY_DELAYS_MS[attempt]);
    return;
  }

  if (!response || !response.ok || !Array.isArray(response.candidates) || !response.candidates.length) {
    clearTimeout(watchdogTimer);

    const message = isNetworkFailure ? 'No response from Transfermarkt (network error)' : 'No players found.';
    const retryButtonHtml = isNetworkFailure ? '<div><button class="qc-retry-btn">Retry</button></div>' : '';

    if (isNetworkFailure) {
      lastRetryFn = () => runFootballSearch(query, translationInfo, requestToken, watchdogTimer, sessionNavToken, 0);
    }

    updateSelectionPopup(`${banner}<div class="loading">${escapeHtml(message)}</div>${retryButtonHtml}`, false);
    return;
  }

  clearTimeout(watchdogTimer);

  if (response.candidates.length === 1) {
    const only = response.candidates[0];
    await renderFootballCard(only.id, only.profileUrl, banner, only.label, only.image);
    return;
  }

  showDisambiguationPicker(
    response.candidates,
    describeFootballCandidate,
    (chosen) => {
      updateSelectionPopup(`${banner}<div class="loading">Loading...</div>`, false);
      renderFootballCard(chosen.id, chosen.profileUrl, banner, chosen.label, chosen.image);
    },
    banner
  );
}

async function footballLaunchSearch(query, left, top) {
  if (!query) return;

  setActivePack(FOOTBALL_PACK_ID);

  showSelectionPopupAt(FOOTBALL_THEME_CLASS, left, top, '<div class="loading">Searching...</div>', false);

  const requestToken = `${Date.now()}${Math.random()}`;
  footballSearchToken = requestToken;

  const watchdogNavToken = navGuardToken();

  const watchdogTimer = setTimeout(() => {
    if (footballSearchToken !== requestToken) return;
    if (!selectionPopupEl) return;

    if (!navIsTokenCurrent(watchdogNavToken)) return;
    logError('footballLaunchSearch: watchdog fired - no result after 22s for', query);
    lastRetryFn = () => footballLaunchSearch(query, left, top);
    updateSelectionPopup(
      '<div class="loading">No response (took too long)</div><div><button class="qc-retry-btn">Retry</button></div>',
      false
    );
  }, 22000);

  const langCode = detectNonLatinLangCode(query);

  if (!langCode) {
    await runFootballSearch(query, null, requestToken, watchdogTimer, watchdogNavToken);
    return;
  }

  log('footballLaunchSearch: non-Latin text detected, langCode=', langCode, 'query=', query);
  updateSelectionPopup('<div class="loading">Translating...</div>', false);

  translateSelectionText(query, langCode, async (res) => {
    if (footballSearchToken !== requestToken) return;

    if (!navIsTokenCurrent(watchdogNavToken)) return;
    if (!selectionPopupEl) return;

    if (!res || !res.ok || !res.translatedText) {

      clearTimeout(watchdogTimer);
      if (res && res.networkError) {
        lastRetryFn = () => footballLaunchSearch(query, left, top);
        updateSelectionPopup('<div class="loading">Network error while translating</div><div><button class="qc-retry-btn">Retry</button></div>', false);
      } else {
        updateSelectionPopup(buildTranslationFailureHtml(query), false);
      }
      return;
    }

    const { text: cleanedTranslation, stillHasNonLatin } = cleanTranslatedText(res.translatedText);

    if (!cleanedTranslation) {
      logError('footballLaunchSearch: translation became empty after cleanup for', query, '- showing manual entry');
      clearTimeout(watchdogTimer);
      updateSelectionPopup(buildTranslationFailureHtml(query), false);
      return;
    }

    const isLowConfidence =
      (typeof res.match === 'number' && res.match < TRANSLATION_CONFIDENCE_THRESHOLD) ||
      stillHasNonLatin;

    await runFootballSearch(cleanedTranslation, {
      original: query,
      translated: cleanedTranslation,
      lowConfidence: isLowConfidence
    }, requestToken, watchdogTimer, watchdogNavToken);
  });
}

function handleFootballExternalSearch(rawQuery, left, top) {
  const query = sanitizeSelectionText(rawQuery);
  if (!query) return;

  navClearHistory();
  footballLaunchSearch(query, left, top);
}

function footballEnsureSelectionPopupFromHover() {
  if (selectionPopupEl && selectionPopupEl.isConnected) return;
  if (!hoverPopupEl || !hoverPopupEl.isConnected) return;
  const hoverRect = hoverPopupEl.getBoundingClientRect();
  const fallbackLeft = Math.round(window.innerWidth / 2 - 150);
  const fallbackTop = Math.round(window.innerHeight / 2 - 80);
  const popupLeft = Number.isFinite(hoverRect.left) ? Math.round(hoverRect.left) : fallbackLeft;
  const popupTop = Number.isFinite(hoverRect.top) ? Math.round(hoverRect.top) : fallbackTop;
  showSelectionPopupAt(FOOTBALL_THEME_CLASS, popupLeft, popupTop, '<div class="loading">Loading...</div>', false);
}
function footballNavigateById(kind, id) {
  if (!kind || !id) return;
  setActivePack(FOOTBALL_PACK_ID);

  footballEnsureSelectionPopupFromHover();

  if (kind === 'team') {
    renderFootballTeamCard(id, '');
  } else if (kind === 'coach') {
    renderFootballCoachCard(id, '');
  } else if (kind === 'player') {
    renderFootballCard(id, null, '');
  }
}

function parseFootballPlayerUrl(href) {
  try {
    const u = new URL(href, location.href);
    if (!u.hostname.includes('transfermarkt.')) return null;

    const match = u.pathname.match(/\/profil\/spieler\/(\d+)/);
    if (!match) return null;

    return { id: match[1], url: u.href };
  } catch (e) {
    return null;
  }
}

let footballHoverTimer = null;

function attachFootball(anchor) {
  if (anchor.__quickcardFootballBound) return;

  const info = parseFootballPlayerUrl(anchor.href);
  if (!info) return;

  anchor.__quickcardFootballBound = true;

  anchor.addEventListener('mouseenter', () => {
    if (!coreSettings.featureLinkHover) return;

    clearTimeout(hoverHideTimer);
    clearTimeout(hoverRemoveTimer);
    clearTimeout(footballHoverTimer);

    currentAnchor = anchor;

    footballHoverTimer = setTimeout(() => {
      if (currentAnchor !== anchor) return;

      const myHoverToken = ++hoverRequestToken;
      setActivePack(FOOTBALL_PACK_ID);

      const renderFootballHover = (skipCache) => {
        showPopup(FOOTBALL_THEME_CLASS, anchor, '<div class="loading">Loading...</div>', false);

        const cacheEntry = getFootballCacheEntry(info.id);
        if (!skipCache && cacheEntry.finalHtml) {
          if (myHoverToken === hoverRequestToken && hoverPopupEl) showPopup(FOOTBALL_THEME_CLASS, anchor, cacheEntry.finalHtml, false);
          return;
        }

        fetchFootballPlayerDetails(info.id, info.url, isFootballMiniStyle()).then((response) => {
          if (myHoverToken !== hoverRequestToken || !hoverPopupEl) return;

          if (!response || !response.ok) {
            const error = response && response.error ? ` (${escapeHtml(response.error)})` : '';
            showPopup(FOOTBALL_THEME_CLASS, anchor, `<div class="loading">Couldn't load that player${error}.</div>`, false);
            return;
          }

          const data = response.data;
          resolveImageUrl(data.photo, (resolved) => {
            data.photo = resolved;
            const html = buildFootballHtml(data);
            cacheEntry.finalHtml = html;
            if (myHoverToken === hoverRequestToken && hoverPopupEl) { showPopup(FOOTBALL_THEME_CLASS, anchor, html, false); setTimeout(()=>{ const root = document.getElementById('quickcard-root'); if(root) initFootballStatsToggle(root); }, 50); }
          });
        });
      };
      navSetRerenderFn(() => renderFootballHover(true));
      renderFootballHover(false);
    }, 350);
  });

  anchor.addEventListener('mouseleave', () => {
    clearTimeout(footballHoverTimer);
    if (currentAnchor === anchor) currentAnchor = null;
    scheduleHoverHide();
  });
}

function scanFootballLinks(root) {
  root.querySelectorAll('a[href*="transfermarkt."][href*="/profil/spieler/"]').forEach(attachFootball);
}

function initFootballLinkObserver() {
  scanFootballLinks(document);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'A') {
          attachFootball(node);
        } else if (node.querySelectorAll) {
          scanFootballLinks(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

async function initFootballPackCore() {
  await loadFootballSettings();
  injectFootballTheme();
  initFootballStatsToggle();
  initFootballSquadToggle();
  registerPack({
    id: FOOTBALL_PACK_ID,
    fullWidth: FOOTBALL_FULL_CARD_WIDTH,

    noDrag: true,
    launchSearch: footballLaunchSearch,
    handleExternalSearch: handleFootballExternalSearch,
    isAllowedOnThisSite: isFootballAllowedOnThisSite,
    navigateById: footballNavigateById
  });
}

async function initFootballPack() {
  await initFootballPackCore();
  if (!isFootballAllowedForHoverOnThisSite()) return;
  initFootballLinkObserver();

}

