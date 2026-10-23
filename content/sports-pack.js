

const SPORTS_PACK_ID = 'sports';
const SPORTS_THEME_CLASS = 'qc-theme-sports';
const SPORTS_DEFAULT_SETTINGS = {

  sportsFieldCountry: true,
  sportsFieldTeam: true,
  sportsFieldHeight: true,
  sportsFieldSport: true,
  sportsFieldOlympicMedals: true,
  sportsFieldWorldChampionships: true,
  sportsFieldContinentalChampionships: true,
  sportsFieldTitlesCount: true,
  sportsFieldProStats: true,
  sportsFieldCareerHighlights: true,
  sportsFieldEspnRecentGames: true,
  sportsFieldEspnNextGame: true,
  sportsFieldEspnAwards: true,

  sportsFieldTennisRecord: true,
  sportsFieldTennisTitles: true,
  sportsFieldTennisRankings: true,
  sportsFieldTennisGrandSlams: true,

  sportsFieldCricketRole: true,
  sportsFieldCricketStyles: true,
  sportsFieldCricketClubs: true,
  sportsFieldCricketSpan: true,
  sportsFieldCricketStats: true,

  sportsFieldGolfCareerWins: true,
  sportsFieldGolfTour: true,
  sportsFieldGolfSeason: true,
  sportsFieldGolfRankings: true,
  sportsFieldGolfRecent: true,

  sportsFieldMmaRecord: true,
  sportsFieldMmaWeightClass: true,
  sportsFieldMmaStyle: true,
  sportsFieldMmaTeam: true,
  sportsFieldMmaBreakdown: true,

  sportsFieldBoxingRecord: true,
  sportsFieldBoxingDivision: true,
  sportsFieldBoxingStance: true,
  sportsFieldBoxingReach: true,
  sportsFieldBoxingBreakdown: true,

  sportsFieldKickboxingRecord: true,
  sportsFieldKickboxingWeightClass: true,
  sportsFieldKickboxingStyle: true,
  sportsFieldKickboxingTeam: true,
  sportsFieldKickboxingBreakdown: true,

  sportsFieldMotorsportProfile: true,
  sportsFieldMotorsportCareerStats: true,
  sportsFieldMotorsportTimeline: true,

  sportsShowWikipediaLink: true,
  sportsShowEspnLink: true,
  sportsShowOlympicsLink: true,
  sportsShowOfficialLink: true,
  sportsShowSofascoreLink: true,
  sportsShowFlashscoreLink: true,
  sportsShowSpecialtyLink: true,
  sportsCustomLinks: [],
  sportsSiteFilterMode: 'blacklist',
  sportsWhitelistSites: [],
  sportsBlacklistSites: []
};

let sportsSettings = { ...SPORTS_DEFAULT_SETTINGS };

async function loadSportsSettings() {
  const stored = await api.storage.local.get(SPORTS_DEFAULT_SETTINGS);
  sportsSettings = {
    sportsFieldCountry: stored.sportsFieldCountry !== false,
    sportsFieldTeam: stored.sportsFieldTeam !== false,
    sportsFieldHeight: stored.sportsFieldHeight !== false,
    sportsFieldSport: stored.sportsFieldSport !== false,
    sportsFieldOlympicMedals: stored.sportsFieldOlympicMedals !== false,
    sportsFieldWorldChampionships: stored.sportsFieldWorldChampionships !== false,
    sportsFieldContinentalChampionships: stored.sportsFieldContinentalChampionships !== false,
    sportsFieldTitlesCount: stored.sportsFieldTitlesCount !== false,
    sportsFieldProStats: stored.sportsFieldProStats !== false,
    sportsFieldCareerHighlights: stored.sportsFieldCareerHighlights !== false,
    sportsFieldEspnRecentGames: stored.sportsFieldEspnRecentGames !== false,
    sportsFieldEspnNextGame: stored.sportsFieldEspnNextGame !== false,
    sportsFieldEspnAwards: stored.sportsFieldEspnAwards !== false,
    sportsFieldTennisRecord: stored.sportsFieldTennisRecord !== false,
    sportsFieldTennisTitles: stored.sportsFieldTennisTitles !== false,
    sportsFieldTennisRankings: stored.sportsFieldTennisRankings !== false,
    sportsFieldTennisGrandSlams: stored.sportsFieldTennisGrandSlams !== false,
    sportsFieldCricketRole: stored.sportsFieldCricketRole !== false,
    sportsFieldCricketStyles: stored.sportsFieldCricketStyles !== false,
    sportsFieldCricketClubs: stored.sportsFieldCricketClubs !== false,
    sportsFieldCricketSpan: stored.sportsFieldCricketSpan !== false,
    sportsFieldCricketStats: stored.sportsFieldCricketStats !== false,
    sportsFieldGolfCareerWins: stored.sportsFieldGolfCareerWins !== false,
    sportsFieldGolfTour: stored.sportsFieldGolfTour !== false,
    sportsFieldGolfSeason: stored.sportsFieldGolfSeason !== false,
    sportsFieldGolfRankings: stored.sportsFieldGolfRankings !== false,
    sportsFieldGolfRecent: stored.sportsFieldGolfRecent !== false,
    sportsFieldMmaRecord: stored.sportsFieldMmaRecord !== false,
    sportsFieldMmaWeightClass: stored.sportsFieldMmaWeightClass !== false,
    sportsFieldMmaStyle: stored.sportsFieldMmaStyle !== false,
    sportsFieldMmaTeam: stored.sportsFieldMmaTeam !== false,
    sportsFieldMmaBreakdown: stored.sportsFieldMmaBreakdown !== false,
    sportsFieldBoxingRecord: stored.sportsFieldBoxingRecord !== false,
    sportsFieldBoxingDivision: stored.sportsFieldBoxingDivision !== false,
    sportsFieldBoxingStance: stored.sportsFieldBoxingStance !== false,
    sportsFieldBoxingReach: stored.sportsFieldBoxingReach !== false,
    sportsFieldBoxingBreakdown: stored.sportsFieldBoxingBreakdown !== false,
    sportsFieldKickboxingRecord: stored.sportsFieldKickboxingRecord !== false,
    sportsFieldKickboxingWeightClass: stored.sportsFieldKickboxingWeightClass !== false,
    sportsFieldKickboxingStyle: stored.sportsFieldKickboxingStyle !== false,
    sportsFieldKickboxingTeam: stored.sportsFieldKickboxingTeam !== false,
    sportsFieldKickboxingBreakdown: stored.sportsFieldKickboxingBreakdown !== false,
    sportsFieldMotorsportProfile: stored.sportsFieldMotorsportProfile !== false,
    sportsFieldMotorsportCareerStats: stored.sportsFieldMotorsportCareerStats !== false,
    sportsFieldMotorsportTimeline: stored.sportsFieldMotorsportTimeline !== false,
    sportsShowWikipediaLink: stored.sportsShowWikipediaLink !== false,
    sportsShowEspnLink: stored.sportsShowEspnLink !== false,
    sportsShowOlympicsLink: stored.sportsShowOlympicsLink !== false,
    sportsShowOfficialLink: stored.sportsShowOfficialLink !== false,
    sportsShowSofascoreLink: stored.sportsShowSofascoreLink !== false,
    sportsShowFlashscoreLink: stored.sportsShowFlashscoreLink !== false,
    sportsShowSpecialtyLink: stored.sportsShowSpecialtyLink !== false,
    sportsCustomLinks: Array.isArray(stored.sportsCustomLinks)
      ? stored.sportsCustomLinks.filter(customLink => customLink && typeof customLink.urlTemplate === 'string' && customLink.urlTemplate.trim())
      : [],
    sportsSiteFilterMode: stored.sportsSiteFilterMode || 'blacklist',
    sportsWhitelistSites: Array.isArray(stored.sportsWhitelistSites) ? stored.sportsWhitelistSites : [],
    sportsBlacklistSites: Array.isArray(stored.sportsBlacklistSites) ? stored.sportsBlacklistSites : []
  };
  preloadCustomLinkIcons(sportsSettings.sportsCustomLinks);
  return sportsSettings;
}

const SPORTS_FULL_CARD_WIDTH = 528;

function isSportsAllowedOnThisSite() { return true; }

function isSportsAllowedForHoverOnThisSite() {
  const ownRulesAllow = siteAllowedByRules({
    siteFilterMode: sportsSettings.sportsSiteFilterMode,
    whitelistSites: sportsSettings.sportsWhitelistSites,
    blacklistSites: sportsSettings.sportsBlacklistSites
  });
  if (!ownRulesAllow) return false;
  return isAllowedByGlobalSiteRules(SPORTS_PACK_ID, 'hover');
}

function injectSportsTheme() {
  const root = ensureUiRoot();
  if (root.getElementById('quickcard-sports-theme')) return;

  const style = document.createElement('style');
  style.id = 'quickcard-sports-theme';
  style.textContent = `

    .${SPORTS_THEME_CLASS} {
      background-color: #fff !important;
      border: 1px solid #ececf0 !important;
      box-shadow: 0 10px 30px rgba(20,20,30,0.14) !important;
      color: #17171a !important;
      overflow: hidden !important;
    }
    .${SPORTS_THEME_CLASS}.qc-popup {
      cursor: default !important;
      user-select: text !important;
    }
    .${SPORTS_THEME_CLASS} button, .${SPORTS_THEME_CLASS} a {
      cursor: pointer !important;
      user-select: none !important;
    }
    .${SPORTS_THEME_CLASS} img {
      -webkit-user-drag: none !important;
      user-select: none !important;
    }

    .${SPORTS_THEME_CLASS} .qc-link-icon {
      background: #f1f2f4 !important;
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      min-height: 32px !important;
      border-radius: 10px !important;
      overflow: hidden !important;
    }
    .${SPORTS_THEME_CLASS} .qc-link-icon:hover {
      background: #e7e8ec !important;
    }
    .${SPORTS_THEME_CLASS} .qc-link-icon img {
      width: 18px !important;
      height: 18px !important;
      max-width: 18px !important;
      max-height: 18px !important;
      object-fit: contain !important;
      object-position: center !important;
      border: none !important;
      background: transparent !important;
      border-radius: 0 !important;
    }
    .${SPORTS_THEME_CLASS}.qc-style-full {
      width: ${SPORTS_FULL_CARD_WIDTH}px !important;
      max-width: min(${SPORTS_FULL_CARD_WIDTH}px, calc(100vw - 24px)) !important;
      box-sizing: border-box !important;
    }



    .${SPORTS_THEME_CLASS}.sport-team {
      background: #ffffff !important;
      color: #17171a !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-hero {
      position: relative !important;
      padding: 22px 20px !important;
      background: linear-gradient(135deg, #2a5adf 0%, #1e40af 55%, #1e3a8a 100%) !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-hero-grid {
      display: grid !important;
      grid-template-columns: 120px 1fr !important;
      gap: 16px !important;
      align-items: center !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-photo-wrap {
      position: relative !important;
    }

    .${SPORTS_THEME_CLASS}.sport-team .ts-photo {
      height: 108px !important;
      width: auto !important;
      max-width: 100% !important;
      min-width: 80px !important;
      display: block !important;
      margin: 0 auto !important;
      border-radius: 16px !important;
      object-fit: contain !important;
      border: 3px solid rgba(255,255,255,0.35) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-jersey {
      position: absolute !important;
      bottom: -8px !important;
      right: -8px !important;
      background: #fff !important;
      color: #2a5adf !important;
      font-size: 18px !important;
      font-weight: 900 !important;
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border: 3px solid #2a5adf !important;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-name {
      font-size: 22px !important;
      font-weight: 900 !important;
      line-height: 1.1 !important;
      margin: 0 0 4px 0 !important;
      text-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-team {
      font-size: 14px !important;
      color: rgba(255,255,255,0.85) !important;
      font-weight: 600 !important;
      margin: 0 0 8px 0 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-position {
      display: inline-block !important;
      background: rgba(255,255,255,0.2) !important;
      color: #fff !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      padding: 4px 10px !important;
      border-radius: 999px !important;
      letter-spacing: 0.05em !important;
    }

    .${SPORTS_THEME_CLASS}.sport-team .ts-section {
      padding: 16px 20px !important;
      background: #fff !important;
      border-bottom: 1px solid #e5e7eb !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-section-title {
      font-size: 11px !important;
      font-weight: 800 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: #2a5adf !important;
      margin: 0 0 12px 0 !important;
    }


    .${SPORTS_THEME_CLASS}.sport-team .ts-stats-wrap {
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-stats-grid {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 6px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-stat-box {
      flex: 1 1 calc(25% - 6px) !important;
      min-width: 64px !important;
      max-width: 100% !important;
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%) !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 8px !important;
      padding: 6px 8px !important;
      text-align: left !important;
      box-shadow: none !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      gap: 2px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-stat-box.ts-stat-career {
      flex: 1 1 calc(25% - 6px) !important;
      background: #fff !important;
      border: 1px dashed #e5e7eb !important;
      padding: 5px 7px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-stat-value {
      font-size: 14px !important;
      font-weight: 800 !important;
      color: #0f172a !important;
      line-height: 1.15 !important;
      letter-spacing: -0.02em !important;
      font-variant-numeric: tabular-nums !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-stat-career .ts-stat-value {
      font-size: 12px !important;
      font-weight: 700 !important;
      color: #475569 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-stat-label {
      font-size: 9px !important;
      color: #64748b !important;
      text-transform: uppercase !important;
      letter-spacing: 0.04em !important;
      margin-top: 0 !important;
      line-height: 1.2 !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-stat-career .ts-stat-label {
      font-size: 8px !important;
      color: #94a3b8 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-stats-subhead {
      font-size: 10px !important;
      font-weight: 700 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      color: #94a3b8 !important;
      margin: 0 0 2px 2px !important;
    }

    .${SPORTS_THEME_CLASS}.sport-team .ts-game-row {
      display: grid !important;
      grid-template-columns: 60px 1fr auto !important;
      gap: 12px !important;
      align-items: center !important;
      padding: 10px 12px !important;
      background: #f8fafc !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 12px !important;
      margin-bottom: 8px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-game-date {
      font-size: 11px !important;
      color: #6b7280 !important;
      font-weight: 600 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-game-result {
      font-size: 13px !important;
      color: #17171a !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-game-result .win {
      color: #16a34a !important;
      font-weight: 700 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-game-result .loss {
      color: #dc2626 !important;
      font-weight: 700 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-game-perf {
      font-size: 12px !important;
      color: #2a5adf !important;
      font-weight: 600 !important;
    }

    .${SPORTS_THEME_CLASS}.sport-team .ts-next-game {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
      border: 1px solid #bfdbfe !important;
      border-radius: 14px !important;
      padding: 14px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-next-label {
      font-size: 10px !important;
      color: #2a5adf !important;
      text-transform: uppercase !important;
      letter-spacing: 0.08em !important;
      margin-bottom: 6px !important;
      font-weight: 700 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-next-matchup {
      font-size: 15px !important;
      font-weight: 700 !important;
      color: #17171a !important;
      margin-bottom: 4px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-next-time {
      font-size: 12px !important;
      color: #4b5f8a !important;
    }

    .${SPORTS_THEME_CLASS}.sport-team .ts-awards-grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-award {
      background: #fffbeb !important;
      border: 1px solid #fde68a !important;
      border-radius: 12px !important;
      padding: 10px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-award-icon {
      font-size: 20px !important;
      margin-bottom: 4px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-award-name {
      font-size: 12px !important;
      color: #17171a !important;
      font-weight: 600 !important;
      line-height: 1.2 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .ts-award-count {
      font-size: 11px !important;
      color: #b45309 !important;
      font-weight: 700 !important;
      margin-top: 2px !important;
    }


    .${SPORTS_THEME_CLASS}.sport-tennis {
      background: #ffffff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-hero {
      position: relative !important;
      padding: 24px 20px !important;
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 55%, #2563eb 100%) !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-hero-grid {
      display: grid !important;
      grid-template-columns: 100px 1fr !important;
      gap: 16px !important;
      align-items: center !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-photo {
      height: 108px !important;
      width: auto !important;
      max-width: 100% !important;
      min-width: 80px !important;
      display: block !important;
      margin: 0 auto !important;
      border-radius: 16px !important;
      object-fit: contain !important;
      border: 3px solid rgba(255,255,255,0.35) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-name {
      font-size: 20px !important;
      font-weight: 800 !important;
      line-height: 1.2 !important;
      margin: 0 0 6px 0 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-country {
      font-size: 13px !important;
      color: rgba(255,255,255,0.85) !important;
      margin: 0 !important;
    }


    .${SPORTS_THEME_CLASS}.sport-tennis .ten-stats {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 0 !important;
      background: #fff !important;
      border-bottom: 1px solid #e5e7eb !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-stat {
      flex: 1 1 0 !important;
      min-width: 90px !important;
      padding: 16px 12px !important;
      text-align: center !important;
      border-right: 1px solid #e5e7eb !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-stat:last-child {
      border-right: none !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-stat-value {
      font-size: 22px !important;
      font-weight: 900 !important;
      color: #1e3a8a !important;
      line-height: 1 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-stat-label {
      font-size: 10px !important;
      color: #6b7280 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      margin-top: 4px !important;
    }

    .${SPORTS_THEME_CLASS}.sport-tennis .ten-section {
      padding: 16px 20px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-section-title {
      font-size: 12px !important;
      font-weight: 800 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      color: #1e3a8a !important;
      margin: 0 0 12px 0 !important;
    }

    .${SPORTS_THEME_CLASS}.sport-tennis .ten-slams-grid {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 10px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-slam {
      background: #f8fafc !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 14px !important;
      padding: 12px 8px !important;
      text-align: center !important;
      box-shadow: 0 1px 2px rgba(16,24,40,0.04) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-slam-name {
      font-size: 10px !important;
      color: #6b7280 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      margin-bottom: 6px !important;
      line-height: 1.2 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-slam-result {
      font-size: 14px !important;
      font-weight: 800 !important;
      padding: 4px 8px !important;
      border-radius: 6px !important;
      display: inline-block !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-slam-result.W {
      background: #fef3c7 !important;
      color: #92400e !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-slam-result.F {
      background: #e5e7eb !important;
      color: #374151 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-slam-result.SF {
      background: #fed7aa !important;
      color: #9a3412 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .ten-slam-years {
      font-size: 9px !important;
      color: #9ca3af !important;
      margin-top: 4px !important;
      line-height: 1.2 !important;
    }





    .${SPORTS_THEME_CLASS}.sport-cricket .ck-hero {
      position: relative !important;
      padding: 20px !important;
      background: linear-gradient(135deg, #10b981 0%, #047857 55%, #064e3b 100%) !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-golf .gf-hero {
      position: relative !important;
      padding: 20px !important;
      background: linear-gradient(135deg, #34d399 0%, #059669 50%, #065f46 100%) !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-hero-grid,
    .${SPORTS_THEME_CLASS}.sport-golf .gf-hero-grid {
      display: grid !important;
      grid-template-columns: 90px 1fr !important;
      gap: 16px !important;
      align-items: center !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-photo,
    .${SPORTS_THEME_CLASS}.sport-golf .gf-photo {
      height: 108px !important;
      width: auto !important;
      max-width: 100% !important;
      min-width: 80px !important;
      display: block !important;
      margin: 0 auto !important;
      border-radius: 12px !important;
      object-fit: contain !important;
      border: 3px solid rgba(255,255,255,0.35) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
      background: rgba(255,255,255,0.12) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-name,
    .${SPORTS_THEME_CLASS}.sport-golf .gf-name {
      font-size: 19px !important;
      font-weight: 800 !important;
      line-height: 1.2 !important;
      margin: 0 0 4px 0 !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-meta,
    .${SPORTS_THEME_CLASS}.sport-golf .gf-meta {
      font-size: 13px !important;
      color: rgba(255,255,255,0.9) !important;
      font-weight: 600 !important;
      margin: 0 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-section,
    .${SPORTS_THEME_CLASS}.sport-golf .gf-section {
      padding: 12px 20px !important;
      border-top: 1px solid #e5e7eb !important;
      background: #fff !important;
      color: #1f2937 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-section-title {
      font-size: 11px !important; font-weight: 800 !important; letter-spacing: 0.08em !important;
      text-transform: uppercase !important; color: #059669 !important; margin: 0 0 8px 0 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-golf .gf-section-title {
      font-size: 11px !important; font-weight: 800 !important; letter-spacing: 0.08em !important;
      text-transform: uppercase !important; color: #047857 !important; margin: 0 0 8px 0 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-stats-table {
      width: 100% !important; border-collapse: collapse !important; font-size: 12px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-stats-table th,
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-stats-table td {
      padding: 6px 4px !important; text-align: center !important; border-bottom: 1px solid #f3f4f6 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-stats-table th { color: #6b7280 !important; font-weight: 600 !important; }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-stats-table td:first-child,
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-stats-table th:first-child { text-align: left !important; font-weight: 600 !important; }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-fact,
    .${SPORTS_THEME_CLASS}.sport-golf .gf-fact {
      display: flex !important; justify-content: space-between !important;
      padding: 8px 0 !important; font-size: 13px !important; border-bottom: 1px solid #f3f4f6 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-fact span:first-child,
    .${SPORTS_THEME_CLASS}.sport-golf .gf-fact span:first-child {
      color: #6b7280 !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; font-size: 12px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-cricket .ck-fact span:last-child,
    .${SPORTS_THEME_CLASS}.sport-golf .gf-fact span:last-child {
      color: #1f2937 !important; font-weight: 600 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-golf .gf-stat-grid {
      display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-golf .gf-stat-box {
      background: #f9fafb !important; border-radius: 8px !important; padding: 8px !important; text-align: center !important;
    }
    .${SPORTS_THEME_CLASS}.sport-golf .gf-stat-value { font-size: 15px !important; font-weight: 700 !important; color: #111827 !important; }
    .${SPORTS_THEME_CLASS}.sport-golf .gf-stat-label { font-size: 10px !important; color: #6b7280 !important; text-transform: uppercase !important; }

    .${SPORTS_THEME_CLASS}.sport-mma .mma-hero {
      position: relative !important;
      padding: 20px !important;
      background: linear-gradient(135deg, #991b1b 0%, #450a0a 55%, #1c1917 100%) !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-hero-grid {
      display: grid !important;
      grid-template-columns: 90px 1fr !important;
      gap: 16px !important;
      align-items: center !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-photo {
      height: 108px !important;
      width: auto !important;
      max-width: 100% !important;
      min-width: 80px !important;
      display: block !important;
      margin: 0 auto !important;
      border-radius: 12px !important;
      object-fit: contain !important;
      border: 3px solid rgba(255,255,255,0.35) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important;
      background: rgba(255,255,255,0.1) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-name {
      font-size: 19px !important; font-weight: 800 !important; margin: 0 0 4px 0 !important; color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-meta {
      font-size: 13px !important; color: rgba(255,255,255,0.9) !important; font-weight: 600 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-record {
      font-size: 22px !important; font-weight: 800 !important; margin-top: 6px !important; color: #fca5a5 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-section {
      padding: 12px 20px !important; border-top: 1px solid #e5e7eb !important; background: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-section-title {
      font-size: 11px !important; font-weight: 800 !important; letter-spacing: 0.08em !important;
      text-transform: uppercase !important; color: #b91c1c !important; margin: 0 0 8px 0 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-fact {
      display: flex !important; justify-content: space-between !important;
      padding: 8px 0 !important; font-size: 13px !important; border-bottom: 1px solid #f3f4f6 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-fact span:first-child {
      color: #6b7280 !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; font-size: 12px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-fact span:last-child { color: #1f2937 !important; font-weight: 600 !important; }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-stat-grid {
      display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-stat-box {
      background: #fef2f2 !important; border-radius: 8px !important; padding: 8px !important; text-align: center !important;
    }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-stat-value { font-size: 15px !important; font-weight: 700 !important; color: #111827 !important; }
    .${SPORTS_THEME_CLASS}.sport-mma .mma-stat-label { font-size: 10px !important; color: #6b7280 !important; text-transform: uppercase !important; }

    .${SPORTS_THEME_CLASS}.sport-boxing .box-hero {
      position: relative !important; padding: 20px !important;
      background: linear-gradient(135deg, #b45309 0%, #78350f 55%, #1c1917 100%) !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-hero {
      position: relative !important; padding: 20px !important;
      background: linear-gradient(135deg, #c2410c 0%, #7c2d12 55%, #1c1917 100%) !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-hero-grid,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-hero-grid {
      display: grid !important; grid-template-columns: 90px 1fr !important; gap: 16px !important; align-items: center !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-photo,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-photo {
      height: 108px !important; width: auto !important; max-width: 100% !important; min-width: 80px !important;
      display: block !important; margin: 0 auto !important; border-radius: 12px !important; object-fit: contain !important;
      border: 3px solid rgba(255,255,255,0.35) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important;
      background: rgba(255,255,255,0.1) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-name,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-name {
      font-size: 19px !important; font-weight: 800 !important; margin: 0 0 4px 0 !important; color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-meta,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-meta {
      font-size: 13px !important; color: rgba(255,255,255,0.9) !important; font-weight: 600 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-record,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-record {
      font-size: 22px !important; font-weight: 800 !important; margin-top: 6px !important; color: #fcd34d !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-section,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-section {
      padding: 12px 20px !important; border-top: 1px solid #e5e7eb !important; background: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-section-title { font-size: 11px !important; font-weight: 800 !important; letter-spacing: 0.08em !important; text-transform: uppercase !important; color: #b45309 !important; margin: 0 0 8px 0 !important; }
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-section-title { font-size: 11px !important; font-weight: 800 !important; letter-spacing: 0.08em !important; text-transform: uppercase !important; color: #c2410c !important; margin: 0 0 8px 0 !important; }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-fact,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-fact {
      display: flex !important; justify-content: space-between !important; padding: 8px 0 !important; font-size: 13px !important; border-bottom: 1px solid #f3f4f6 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-fact span:first-child,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-fact span:first-child {
      color: #6b7280 !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; font-size: 12px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-fact span:last-child,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-fact span:last-child { color: #1f2937 !important; font-weight: 600 !important; }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-stat-grid,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-stat-grid {
      display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-stat-box,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-stat-box {
      background: #fffbeb !important; border-radius: 8px !important; padding: 8px !important; text-align: center !important;
    }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-stat-value,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-stat-value { font-size: 15px !important; font-weight: 700 !important; color: #111827 !important; }
    .${SPORTS_THEME_CLASS}.sport-boxing .box-stat-label,
    .${SPORTS_THEME_CLASS}.sport-kickboxing .kb-stat-label { font-size: 10px !important; color: #6b7280 !important; text-transform: uppercase !important; }

    .${SPORTS_THEME_CLASS}.sport-olympic {
      background: #ffffff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-hero {
      position: relative !important;
      padding: 20px !important;
      background: linear-gradient(135deg, #ef4444 0%, #b91c1c 55%, #7f1d1d 100%) !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-hero-grid {
      display: grid !important;
      grid-template-columns: 90px 1fr !important;
      gap: 16px !important;
      align-items: center !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-photo {
      height: 108px !important;
      width: auto !important;
      max-width: 100% !important;
      min-width: 80px !important;
      display: block !important;
      margin: 0 auto !important;
      border-radius: 12px !important;
      object-fit: contain !important;
      border: 3px solid rgba(255,255,255,0.35) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-name {
      font-size: 19px !important;
      font-weight: 800 !important;
      line-height: 1.2 !important;
      margin: 0 0 4px 0 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-sport {
      font-size: 13px !important;
      color: rgba(255,255,255,0.9) !important;
      font-weight: 600 !important;
      margin: 0 !important;
    }


    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medals-wrap {
      background: #fff !important;
      border-bottom: 1px solid #e5e7eb !important;
      padding-top: 14px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medals-title {
      font-size: 11px !important;
      font-weight: 800 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: #dc2626 !important;
      margin: 0 0 10px 0 !important;
      padding: 0 20px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medals {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 0 !important;
      background: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medal {
      padding: 16px 12px !important;
      text-align: center !important;
      border-right: 1px solid #e5e7eb !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medal:last-child {
      border-right: none !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medal-icon {
      font-size: 28px !important;
      margin-bottom: 4px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medal-count {
      font-size: 24px !important;
      font-weight: 900 !important;
      line-height: 1 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medal-count.gold { color: #d97706 !important; }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medal-count.silver { color: #6b7280 !important; }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medal-count.bronze { color: #b45309 !important; }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-medal-label {
      font-size: 10px !important;
      color: #6b7280 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      margin-top: 2px !important;
    }

    .${SPORTS_THEME_CLASS}.sport-olympic .oly-section {
      padding: 16px 20px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-section-title {
      font-size: 11px !important;
      font-weight: 800 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: #dc2626 !important;
      margin: 0 0 12px 0 !important;
    }

    .${SPORTS_THEME_CLASS}.sport-olympic .oly-timeline,
    .${SPORTS_THEME_CLASS}.sport-general .oly-timeline {
      position: relative !important;
      padding-left: 24px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-timeline::before,
    .${SPORTS_THEME_CLASS}.sport-general .oly-timeline::before {
      content: '' !important;
      position: absolute !important;
      left: 8px !important;
      top: 0 !important;
      bottom: 0 !important;
      width: 2px !important;
      background: #e5e7eb !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-timeline-item,
    .${SPORTS_THEME_CLASS}.sport-general .oly-timeline-item {
      position: relative !important;
      padding: 8px 0 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-timeline-item::before,
    .${SPORTS_THEME_CLASS}.sport-general .oly-timeline-item::before {
      content: '' !important;
      position: absolute !important;
      left: -20px !important;
      top: 12px !important;
      width: 10px !important;
      height: 10px !important;
      border-radius: 50% !important;
      background: #dc2626 !important;
      border: 2px solid #fff !important;
      box-shadow: 0 0 0 2px #dc2626 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-timeline-year,
    .${SPORTS_THEME_CLASS}.sport-general .oly-timeline-year {
      font-size: 12px !important;
      font-weight: 700 !important;
      color: #dc2626 !important;
      margin-bottom: 2px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-timeline-event,
    .${SPORTS_THEME_CLASS}.sport-general .oly-timeline-event {
      font-size: 13px !important;
      color: #1f2937 !important;
      line-height: 1.4 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-timeline-medal,
    .${SPORTS_THEME_CLASS}.sport-general .oly-timeline-medal {
      display: inline-block !important;
      font-size: 10px !important;
      font-weight: 700 !important;
      padding: 2px 6px !important;
      border-radius: 4px !important;
      margin-left: 6px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-timeline-medal.Gold,
    .${SPORTS_THEME_CLASS}.sport-general .oly-timeline-medal.Gold {
      background: #fef3c7 !important;
      color: #92400e !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-timeline-medal.Silver,
    .${SPORTS_THEME_CLASS}.sport-general .oly-timeline-medal.Silver {
      background: #e5e7eb !important;
      color: #374151 !important;
    }

    .${SPORTS_THEME_CLASS} .oly-timeline-more {
      display: block !important;
      margin: 8px 0 0 0 !important;
      padding: 4px 0 !important;
      border: none !important;
      background: none !important;
      color: #2563eb !important;
      font-size: 12px !important;
      cursor: pointer !important;
      text-align: left !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .oly-timeline-medal.Bronze,
    .${SPORTS_THEME_CLASS}.sport-general .oly-timeline-medal.Bronze {
      background: #fed7aa !important;
      color: #9a3412 !important;
    }


    .${SPORTS_THEME_CLASS}.sport-general {
      background: #ffffff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-general .gen-hero {
      position: relative !important;
      padding: 20px !important;
      background: linear-gradient(135deg, #6366f1 0%, #7c3aed 55%, #8b5cf6 100%) !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS}.sport-general .gen-hero-grid {
      display: grid !important;
      grid-template-columns: 90px 1fr !important;
      gap: 16px !important;
      align-items: center !important;
    }
    .${SPORTS_THEME_CLASS}.sport-general .gen-photo {
      height: 108px !important;
      width: auto !important;
      max-width: 100% !important;
      display: block !important;
      margin: 0 auto !important;
      border-radius: 12px !important;
      object-fit: contain !important;
      border: 3px solid rgba(255,255,255,0.35) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
      min-width: 80px;
    }
    .${SPORTS_THEME_CLASS}.sport-general .gen-name {
      font-size: 19px !important;
      font-weight: 800 !important;
      line-height: 1.2 !important;
      margin: 0 0 4px 0 !important;
    }
    .${SPORTS_THEME_CLASS}.sport-general .gen-sub {
      font-size: 13px !important;
      color: rgba(255,255,255,0.9) !important;
      margin: 0 !important;
    }

    .${SPORTS_THEME_CLASS}.sport-general .gen-section {
      padding: 16px 20px !important;
    }
    .${SPORTS_THEME_CLASS}.sport-general .gen-section-title {
      font-size: 11px !important;
      font-weight: 800 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: #6366f1 !important;
      margin: 0 0 12px 0 !important;
    }


    .${SPORTS_THEME_CLASS} .qc-mini-hero {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      padding: 14px 16px !important;
      color: #fff !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-photo {
      height: 72px !important;
      width: 72px !important;
      flex: 0 0 auto !important;
      border-radius: 10px !important;
      object-fit: cover !important;
      border: 2px solid rgba(255,255,255,0.35) !important;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-photo-fallback {
      height: 72px !important;
      width: 72px !important;
      flex: 0 0 auto !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 22px !important;
      border-radius: 10px !important;
      background: rgba(255,255,255,0.12) !important;
      border: 2px solid rgba(255,255,255,0.35) !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-name {
      font-size: 15px !important;
      font-weight: 800 !important;
      line-height: 1.25 !important;
      margin: 0 0 2px 0 !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-sub {
      font-size: 11px !important;
      color: rgba(255,255,255,0.88) !important;
      margin: 0 !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-body {
      padding: 12px 16px 14px 16px !important;
      background: #fff !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-section-label {
      font-size: 9.5px !important;
      font-weight: 800 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      color: #9aa0ab !important;
      margin: 0 0 6px 0 !important;
    }

    .${SPORTS_THEME_CLASS} .qc-mini-stat-row {
      display: flex !important;
      gap: 6px !important;
      flex-wrap: wrap !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-stat {
      flex: 1 1 60px !important;
      min-width: 72px !important;
      background: #f4f5f7 !important;
      border-radius: 10px !important;
      padding: 6px 8px !important;
      text-align: center !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-stat-num {
      font-size: 15px !important;
      font-weight: 800 !important;
      color: #17171a !important;
      line-height: 1.15 !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-stat-label {
      font-size: 9px !important;
      font-weight: 700 !important;
      color: #7b7c82 !important;
      margin-top: 2px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }

    .${SPORTS_THEME_CLASS} .qc-mini-fact {
      display: flex !important;
      align-items: flex-start !important;
      gap: 8px !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-fact + .qc-mini-fact {
      margin-top: 6px !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-fact-icon {
      width: 22px !important;
      height: 22px !important;
      border-radius: 7px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 11px !important;
      flex-shrink: 0 !important;
      margin-top: 1px !important;
      background: #f1f2f4 !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-fact-text {
      font-size: 12px !important;
      color: #374151 !important;
      line-height: 1.4 !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-fact-label {
      font-weight: 700 !important;
      color: #17171a !important;
    }

    .${SPORTS_THEME_CLASS} .qc-mini-chip-row {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 5px !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-chip {
      font-size: 11px !important;
      font-weight: 600 !important;
      padding: 4px 9px !important;
      border-radius: 999px !important;
      background: #f1f2f4 !important;
      color: #374151 !important;
      white-space: nowrap !important;
    }
    .${SPORTS_THEME_CLASS}.sport-team .qc-mini-hero {
      background: linear-gradient(135deg, #2a5adf 0%, #1e40af 55%, #1e3a8a 100%) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .qc-mini-hero {
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 55%, #2563eb 100%) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .qc-mini-hero {
      background: linear-gradient(135deg, #ef4444 0%, #b91c1c 55%, #7f1d1d 100%) !important;
    }
    .${SPORTS_THEME_CLASS}.sport-general .qc-mini-hero {
      background: linear-gradient(135deg, #6366f1 0%, #7c3aed 55%, #8b5cf6 100%) !important;
    }

    .${SPORTS_THEME_CLASS}.sport-team .qc-mini-fact-icon,
    .${SPORTS_THEME_CLASS}.sport-team .qc-mini-chip {
      background: #eaf0ff !important;
      color: #1e3a8a !important;
    }
    .${SPORTS_THEME_CLASS}.sport-tennis .qc-mini-fact-icon,
    .${SPORTS_THEME_CLASS}.sport-tennis .qc-mini-chip {
      background: #e7edfb !important;
      color: #1e3a8a !important;
    }
    .${SPORTS_THEME_CLASS}.sport-olympic .qc-mini-fact-icon,
    .${SPORTS_THEME_CLASS}.sport-olympic .qc-mini-chip {
      background: #fdeaea !important;
      color: #b91c1c !important;
    }
    .${SPORTS_THEME_CLASS}.sport-general .qc-mini-fact-icon,
    .${SPORTS_THEME_CLASS}.sport-general .qc-mini-chip {
      background: #f1ecfe !important;
      color: #6d28d9 !important;
    }


    .${SPORTS_THEME_CLASS} .ts-photo,
    .${SPORTS_THEME_CLASS} .ten-photo,
    .${SPORTS_THEME_CLASS} .oly-photo,
    .${SPORTS_THEME_CLASS} .gen-photo,
    .${SPORTS_THEME_CLASS} .ck-photo,
    .${SPORTS_THEME_CLASS} .gf-photo,
    .${SPORTS_THEME_CLASS} .mma-photo,
    .${SPORTS_THEME_CLASS} .box-photo,
    .${SPORTS_THEME_CLASS} .kb-photo {
      width: 90px !important;
      height: 108px !important;
      min-width: 90px !important;
      max-width: 90px !important;
      object-fit: cover !important;
      object-position: top center !important;
      border-radius: 12px !important;
      display: block !important;
      margin: 0 auto !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-photo,
    .${SPORTS_THEME_CLASS} .qc-mini-photo-fallback {
      width: 72px !important;
      height: 86px !important;
      min-width: 72px !important;
      max-width: 72px !important;
      flex: 0 0 72px !important;
      object-fit: cover !important;
      object-position: top center !important;
      border-radius: 10px !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-photo-fallback {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 26px !important;
    }





    .${SPORTS_THEME_CLASS} .sports-photo-empty {
      background: rgba(255,255,255,0.18) !important;
      position: relative !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
    }
    .${SPORTS_THEME_CLASS} .sports-photo-empty::after {
      content: '' !important;
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 46% !important;
      height: 46% !important;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff' fill-opacity='0.65'%3E%3Cpath d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z'/%3E%3C/svg%3E") !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      background-size: contain !important;
      opacity: 0.95 !important;
      pointer-events: none !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-photo.sports-photo-empty,
    .${SPORTS_THEME_CLASS} .qc-mini-photo-fallback.sports-photo-empty {
      background: rgba(0,0,0,0.08) !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-photo.sports-photo-empty::after,
    .${SPORTS_THEME_CLASS} .qc-mini-photo-fallback.sports-photo-empty::after {
      width: 50% !important;
      height: 50% !important;

      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af' fill-opacity='0.9'%3E%3Cpath d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z'/%3E%3C/svg%3E") !important;
    }


    .${SPORTS_THEME_CLASS} .ts-photo,
    .${SPORTS_THEME_CLASS} .ten-photo,
    .${SPORTS_THEME_CLASS} .oly-photo,
    .${SPORTS_THEME_CLASS} .gen-photo,
    .${SPORTS_THEME_CLASS} .ck-photo,
    .${SPORTS_THEME_CLASS} .gf-photo,
    .${SPORTS_THEME_CLASS} .mma-photo,
    .${SPORTS_THEME_CLASS} .box-photo,
    .${SPORTS_THEME_CLASS} .kb-photo {
      width: 86px !important;
      height: 120px !important;
      max-width: 86px !important;
      min-width: 86px !important;
      max-height: 120px !important;
      min-height: 120px !important;
      display: block !important;
      margin: 0 auto !important;
      border-radius: 12px !important;
      object-fit: cover !important;
      object-position: top center !important;
      background: rgba(255,255,255,0.1) !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-photo,
    .${SPORTS_THEME_CLASS} .qc-mini-photo-fallback {
      width: 52px !important;
      height: 72px !important;
      max-width: 52px !important;
      min-width: 52px !important;
      max-height: 72px !important;
      min-height: 72px !important;
      border-radius: 10px !important;
      object-fit: cover !important;
      object-position: top center !important;
      display: block !important;
      flex-shrink: 0 !important;
      background: rgba(0,0,0,0.06) !important;
    }
    .${SPORTS_THEME_CLASS} .qc-mini-photo-fallback {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 26px !important;
    }

.${SPORTS_THEME_CLASS} .qc-sports-desc {
      font-size: 11px !important;
      font-style: italic !important;
      opacity: 0.85 !important;
      margin: 2px 0 0 0 !important;
    }
    .${SPORTS_THEME_CLASS} .qc-collapsible-btn {
      font-size: 12px !important;
      color: #2a5adf !important;
      background: none !important;
      border: none !important;
      padding: 8px 0 !important;
      cursor: pointer !important;
      font-weight: 600 !important;
    }
    .${SPORTS_THEME_CLASS} .qc-collapsible-btn:hover {
      text-decoration: underline !important;
    }

    .${SPORTS_THEME_CLASS} .qc-sports-football-link {
      display: inline-block !important;
      font-size: 12.5px !important;
      font-weight: 700 !important;
      color: #2a5adf !important;
      background: #eef2ff !important;
      border-radius: 999px !important;
      padding: 6px 14px !important;
      cursor: pointer !important;
    }
    .${SPORTS_THEME_CLASS} .qc-sports-football-link:hover {
      background: #dfe6ff !important;
    }
  `;

  root.styleHost.appendChild(style);
}

function sportsEscape(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function sportsFmtGameDate(iso) {
  const parsedDate = Date.parse(iso);
  if (isNaN(parsedDate)) return '';
  return new Date(parsedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function sportsFmtGameDateTime(iso) {
  const parsedTime = Date.parse(iso);
  if (isNaN(parsedTime)) return '';
  return new Date(parsedTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function sportsFormatOpponent(nextGame, ownTeam) {
  const competitors = nextGame && Array.isArray(nextGame.competitors) ? nextGame.competitors : [];
  if (!competitors.length) return '';
  const ownLower = String(ownTeam || '').trim().toLowerCase();
  const namesMatch = (competitor) => {
    const compName = String(competitor.name || '').toLowerCase();
    const compAbbrev = String(competitor.abbrev || '').toLowerCase();
    return ownLower && (compName.includes(ownLower) || ownLower.includes(compName) ||
      (compAbbrev && ownLower.includes(compAbbrev)));
  };
  const ownComp = ownLower ? competitors.find(namesMatch) : null;
  const opponentComp = ownLower ? competitors.find(competitor => !namesMatch(competitor)) : null;
  if (ownComp && opponentComp) {
    const prefix = ownComp.homeAway === 'home' ? 'vs' : '@';
    return `${prefix} ${sportsEscape(opponentComp.name || opponentComp.abbrev || '')}`;
  }

  return competitors
    .map(competitor => `${competitor.homeAway === 'home' ? 'vs' : '@'} ${sportsEscape(competitor.name || competitor.abbrev || '')}`)
    .join(' ');
}

function sportsBuildCollapsibleHtml(items, limit, renderItem, wrapperTag = 'div', wrapperClass = '') {
  if (!items || !items.length) return '';

  const visible = items.slice(0, limit);
  const hidden = items.slice(limit);
  const visibleHtml = visible.map(renderItem).join('');

  if (!hidden.length) {
    return wrapperClass ? `<${wrapperTag} class="${wrapperClass}">${visibleHtml}</${wrapperTag}>` : visibleHtml;
  }

  const hiddenHtml = hidden.map(renderItem).join('');
  const id = 'qc-coll-' + Math.random().toString(36).slice(2);
  const count = hidden.length;

  const wrapper = wrapperClass ? `<${wrapperTag} class="${wrapperClass}">` : `<${wrapperTag}>`;

  return `
    ${wrapper}
      ${visibleHtml}
      <div id="${id}" style="display:none;">${hiddenHtml}</div>
    </${wrapperTag}>
    <button class="qc-collapsible-btn" data-coll-target="${id}" data-coll-count="${count}">
      Show ${count} more
    </button>
  `;
}

function sportsBuildCustomLinkUrl(template, data) {
  if (!template) return '#';
  let url = template;
  const map = {
    '{name}': data.name || data.title || '',
    '{title}': data.name || data.title || '',
    '{id}': data.id || data.wikidataId || '',
    '{wikidataId}': data.wikidataId || '',
    '{sport}': data.sport || '',
    '{country}': data.country || ''
  };
  for (const [k, v] of Object.entries(map)) {
    url = url.split(k).join(encodeURIComponent(v));
  }
  return url;
}

function detectSportType(sport, espn, description) {
  const sportLower = (sport || '').toLowerCase();
  const descLower = String(description || '').toLowerCase();

  if (sportLower.includes('basketball') || sportLower.includes('american football') ||
      sportLower.includes('gridiron football') || sportLower.includes('baseball') ||
      sportLower.includes('ice hockey')) {
    return 'team-sport';
  }

  if (espn && espn.league) {
    const league = espn.league.toLowerCase();
    if (['nba', 'nfl', 'mlb', 'nhl'].includes(league)) {
      return 'team-sport';
    }
  }

  if (sportLower.includes('tennis')) {
    return 'tennis';
  }
  if (sportLower.includes('cricket')) {
    return 'cricket';
  }
  if (sportLower.includes('golf')) {
    return 'golf';
  }
  if (sportLower.includes('mixed martial arts') || sportLower.includes('mma') ||
      sportLower.includes('ufc') ||
      descLower.includes('mixed martial') || descLower.includes('mma fighter') ||
      descLower.includes('ufc fighter') ||
      (sportLower.includes('sambo') && (descLower.includes('mma') || descLower.includes('mixed martial') || descLower.includes('ufc'))) ||
      (sportLower.includes('martial art') && !sportLower.includes('judo') &&
       !sportLower.includes('taekwondo') && !sportLower.includes('karate') && !sportLower.includes('sambo'))) {
    return 'mma';
  }

  if (sportLower.includes('kickbox') || sportLower.includes('muay thai') || sportLower.includes('muaythai') ||
      descLower.includes('kickbox') || descLower.includes('muay thai') || descLower.includes('muaythai')) {
    return 'kickboxing';
  }
  if (sportLower.includes('boxing') ||
      (/\bprofessional boxer\b/.test(descLower) || (/\bboxer\b/.test(descLower) && !descLower.includes('kickbox')))) {
    return 'boxing';
  }

  if (sportLower.includes('wrestling') || sportLower.includes('judo') ||
      sportLower.includes('gymnastics') || sportLower.includes('swimming') || sportLower.includes('athletics') ||
      sportLower.includes('weightlifting') || sportLower.includes('fencing') || sportLower.includes('archery') ||
      sportLower.includes('shooting') || sportLower.includes('taekwondo') || sportLower.includes('karate') ||
      sportLower.includes('diving') || sportLower.includes('rowing') || sportLower.includes('sailing') ||
      sportLower.includes('cycling') || sportLower.includes('canoe') || sportLower.includes('kayak') ||
      sportLower.includes('equestrian') || sportLower.includes('badminton') || sportLower.includes('table tennis') ||
      sportLower.includes('volleyball') || sportLower.includes('handball') || sportLower.includes('water polo') ||
      sportLower.includes('triathlon') || sportLower.includes('pentathlon') || sportLower.includes('skateboarding') ||
      sportLower.includes('climbing') || sportLower.includes('surfing') || sportLower.includes('rugby') ||
      sportLower.includes('field hockey') || sportLower.includes('skiing') || sportLower.includes('skating') ||
      sportLower.includes('biathlon') || sportLower.includes('bobsled') || sportLower.includes('luge') ||
      sportLower.includes('curling') || sportLower.includes('snowboard')) {
    return 'olympic-sport';
  }

  return 'general';
}

function sportsBuildTeamSportHtml(athlete) {
  const sections = [];

  const photoHtml = athlete.image
    ? `<img class="ts-photo" data-sports-photo="1" src="${sportsEscape(athlete.image)}" alt="">`
    : sportsDefaultPhotoHtml('ts-photo');

  const jerseyNum = athlete.jersey || athlete.number || '';
  const jerseyHtml = jerseyNum ? `<div class="ts-jersey">${sportsEscape(jerseyNum)}</div>` : '';

  const teamName = athlete.team || '';

  const showTeamNow = !!athlete.espn;
  const position = athlete.position || '';

  const extraSports = Array.isArray(athlete.sports)
    ? athlete.sports.filter(label => label && label !== athlete.sport)
    : [];
  const sportsLine = [athlete.sport, ...extraSports].filter(Boolean).join(' • ');

  const careerSpan = [athlete.careerStart, athlete.careerEnd].filter(Boolean).join('–');
  const retiredHtml = athlete.isRetired
    ? `<span class="ts-position">${sportsEscape(`Retired${careerSpan ? ` ${careerSpan}` : ''}`)}</span>`
    : '';

  sections.push(`
    <div class="ts-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      <div class="ts-hero-grid">
        <div class="ts-photo-wrap">
          ${photoHtml}
          ${jerseyHtml}
        </div>
        <div>
          <h1 class="ts-name">${sportsEscape(athlete.name || athlete.label)}</h1>
          ${teamName ? `<p class="ts-team" id="qc-sports-team-line">${showTeamNow ? sportsEscape(teamName) : ''}</p>` : ''}
          ${sportsLine ? `<p class="ts-team">${sportsEscape(sportsLine)}</p>` : ''}
          ${position ? `<span class="ts-position">${sportsEscape(position)}</span>` : ''}${retiredHtml ? ` ${retiredHtml}` : ''}
        </div>
      </div>
    </div>
  `);

  const profileFacts = [];
  if (sportsSettings.sportsFieldCountry && athlete.country) profileFacts.push({ label: 'Country', value: athlete.country });
  if (sportsSettings.sportsFieldHeight) {
    if (athlete.height) profileFacts.push({ label: 'Height', value: athlete.height });
    if (athlete.weight) profileFacts.push({ label: 'Weight', value: athlete.weight });
  }
  if (profileFacts.length) {
    const profileFactsHtml = profileFacts.map(fact => `
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">${sportsEscape(fact.label)}</span>
        <span style="font-size:13px;color:#1f2937;font-weight:600;">${sportsEscape(fact.value)}</span>
      </div>
    `).join('');
    sections.push(`
      <div class="ts-section">
        <h2 class="ts-section-title">Profile</h2>
        ${profileFactsHtml}
      </div>
    `);
  }

  const stats = Object.entries(athlete.proStats || {})
    .filter(([k]) => k !== '__title' && !k.includes('[MLB StatsAPI') && !k.includes('[source'));
  const isCareerStat = (k) => /\(CAREER\)|\bCAREER\b/i.test(k);
  const cleanStatLabel = (k) => String(k).replace(/\s*\(CAREER\)\s*/i, '').replace(/\s*CAREER\s*/i, '').trim();
  const seasonStats = stats.filter(([k]) => !isCareerStat(k));
  const careerStats = stats.filter(([k]) => isCareerStat(k));
  const renderStatBox = (k, v, career) => `
    <div class="ts-stat-box${career ? ' ts-stat-career' : ''}">
      <div class="ts-stat-value">${sportsEscape(v)}</div>
      <div class="ts-stat-label">${sportsEscape(cleanStatLabel(k))}</div>
    </div>`;
  let statsInner = '';
  if (stats.length) {
    const parts = [];
    if (seasonStats.length) {
      parts.push(`<div class="ts-stats-grid">${seasonStats.map(([k, v]) => renderStatBox(k, v, false)).join('')}</div>`);
    }
    if (careerStats.length) {
      parts.push(`<div class="ts-stats-subhead">Career</div><div class="ts-stats-grid">${careerStats.map(([k, v]) => renderStatBox(k, v, true)).join('')}</div>`);
    }
    statsInner = `<div class="ts-stats-wrap">${parts.join('')}</div>`;
  }
  const games = (athlete.espn && athlete.espn.recentGames) || [];
  const fmtDate = (iso) => {
    const parsedDate = Date.parse(iso);
    if (isNaN(parsedDate)) return '';
    return new Date(parsedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  const gamesInner = games.length ? games.map(game => {
    const opp = game.opponentAbbrev || game.opponent || '';
    const resultClass = game.result === 'W' ? 'win' : 'loss';
    const perf = (game.points !== '' && game.points != null)
      ? `${sportsEscape(game.points)}${game.pointsLabel ? ' ' + sportsEscape(game.pointsLabel) : ''}`
      : '';
    return `
      <div class="ts-game-row">
        <div class="ts-game-date">${sportsEscape(fmtDate(game.date))}</div>
        <div class="ts-game-result">
          <span class="${resultClass}">${sportsEscape(game.result)}</span> ${sportsEscape(game.score)}
          ${game.atVs ? sportsEscape(game.atVs) + ' ' : ''}${sportsEscape(opp)}
        </div>
        ${perf ? `<div class="ts-game-perf">${perf}</div>` : ''}
      </div>
    `;
  }).join('') : '';
  const nextGame = athlete.espn && athlete.espn.nextGame;
  let nextInner = '';
  if (nextGame) {
    const parsedTime = Date.parse(nextGame.date);
    const when = isNaN(parsedTime)
      ? ''
      : new Date(parsedTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const comps = sportsFormatOpponent(nextGame, athlete.team);
    nextInner = `
      <div class="ts-next-game">
        <div class="ts-next-label">Next Game</div>
        <div class="ts-next-matchup">${comps}</div>
        <div class="ts-next-time">${sportsEscape(when)}${nextGame.location ? ' · ' + sportsEscape(nextGame.location) : ''}</div>
      </div>`;
  }
  const awards = (athlete.espn && athlete.espn.awards) || [];
  const awardsInner = awards.length ? `<div class="ts-awards-grid">${awards.map(award => `
    <div class="ts-award">
      <div class="ts-award-icon">🏆</div>
      <div class="ts-award-name">${sportsEscape(award.name)}</div>
      <div class="ts-award-count">${sportsEscape(award.displayCount || (award.seasons ? award.seasons.length + 'x' : ''))}</div>
    </div>
  `).join('')}</div>` : '';

  if (sportsSettings.sportsFieldProStats) {
    sections.push(`
      <div class="ts-section" id="qc-sports-prostats-section"${statsInner ? '' : ' style="display:none;"'}>
        <h2 class="ts-section-title">Season Stats</h2>
        <div id="qc-sports-prostats-slot">${statsInner}</div>
      </div>
    `);
  }

  if (sportsSettings.sportsFieldEspnRecentGames) {
    sections.push(`
      <div class="ts-section" id="qc-sports-recent-section"${gamesInner ? '' : ' style="display:none;"'}>
        <h2 class="ts-section-title">Recent Games</h2>
        <div id="qc-sports-recent-slot">${gamesInner}</div>
      </div>
    `);
  }

  if (sportsSettings.sportsFieldEspnNextGame) {
    sections.push(`
      <div class="ts-section" id="qc-sports-next-section"${nextInner ? '' : ' style="display:none;"'}>
        <div id="qc-sports-next-slot">${nextInner}</div>
      </div>
    `);
  }

  if (sportsSettings.sportsFieldEspnAwards) {
    sections.push(`
      <div class="ts-section" id="qc-sports-awards-section"${awardsInner ? '' : ' style="display:none;"'}>
        <h2 class="ts-section-title">Awards & Honors</h2>
        <div id="qc-sports-awards-slot">${awardsInner}</div>
      </div>
    `);
  }

  return sections.join('');
}

function sportsTeamSlotInner(slot, athlete) {
  if (slot === 'prostats') {
    const stats = Object.entries(athlete.proStats || {})
      .filter(([k]) => k !== '__title' && !k.includes('[MLB StatsAPI') && !k.includes('[source'));
    if (!stats.length) return '';
    const isCareerStat = (k) => /\(CAREER\)|\bCAREER\b/i.test(k);
    const cleanStatLabel = (k) => String(k).replace(/\s*\(CAREER\)\s*/i, '').replace(/\s*CAREER\s*/i, '').trim();
    const seasonStats = stats.filter(([k]) => !isCareerStat(k));
    const careerStats = stats.filter(([k]) => isCareerStat(k));
    const box = (k, v, career) => `<div class="ts-stat-box${career ? ' ts-stat-career' : ''}"><div class="ts-stat-value">${sportsEscape(v)}</div><div class="ts-stat-label">${sportsEscape(cleanStatLabel(k))}</div></div>`;
    const parts = [];
    if (seasonStats.length) parts.push(`<div class="ts-stats-grid">${seasonStats.map(([k,v]) => box(k,v,false)).join('')}</div>`);
    if (careerStats.length) parts.push(`<div class="ts-stats-subhead">Career</div><div class="ts-stats-grid">${careerStats.map(([k,v]) => box(k,v,true)).join('')}</div>`);
    return `<div class="ts-stats-wrap">${parts.join('')}</div>`;
  }
  if (slot === 'recent') {
    const games = (athlete.espn && athlete.espn.recentGames) || [];
    if (!games.length) return '';
    const fmtDate = (iso) => {
      const parsedDate = Date.parse(iso);
      if (isNaN(parsedDate)) return '';
      return new Date(parsedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };
    return games.map(game => {
      const opp = game.opponentAbbrev || game.opponent || '';
      const resultClass = game.result === 'W' ? 'win' : 'loss';
      const perf = (game.points !== '' && game.points != null)
        ? `${sportsEscape(game.points)}${game.pointsLabel ? ' ' + sportsEscape(game.pointsLabel) : ''}`
        : '';
      return `
        <div class="ts-game-row">
          <div class="ts-game-date">${sportsEscape(fmtDate(game.date))}</div>
          <div class="ts-game-result">
            <span class="${resultClass}">${sportsEscape(game.result)}</span> ${sportsEscape(game.score)}
            ${game.atVs ? sportsEscape(game.atVs) + ' ' : ''}${sportsEscape(opp)}
          </div>
          ${perf ? `<div class="ts-game-perf">${perf}</div>` : ''}
        </div>
      `;
    }).join('');
  }
  if (slot === 'next') {
    const nextGame = athlete.espn && athlete.espn.nextGame;
    if (!nextGame) return '';
    const parsedTime = Date.parse(nextGame.date);
    const when = isNaN(parsedTime)
      ? ''
      : new Date(parsedTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const comps = sportsFormatOpponent(nextGame, athlete.team);
    return `
      <div class="ts-next-game">
        <div class="ts-next-label">Next Game</div>
        <div class="ts-next-matchup">${comps}</div>
        <div class="ts-next-time">${sportsEscape(when)}${nextGame.location ? ' · ' + sportsEscape(nextGame.location) : ''}</div>
      </div>`;
  }
  if (slot === 'awards') {
    const awards = (athlete.espn && athlete.espn.awards) || [];
    if (!awards.length) return '';
    return `<div class="ts-awards-grid">${awards.map(award => `
      <div class="ts-award">
        <div class="ts-award-icon">🏆</div>
        <div class="ts-award-name">${sportsEscape(award.name)}</div>
        <div class="ts-award-count">${sportsEscape(award.displayCount || (award.seasons ? award.seasons.length + 'x' : ''))}</div>
      </div>
    `).join('')}</div>`;
  }
  return '';
}

function sportsTeamMiniBodyInner(athlete) {
  const sections = [];

  const profileFacts = [];
  if (sportsSettings.sportsFieldCountry && athlete.country) {
    profileFacts.push(['🌍', 'Country', athlete.country]);
  }
  if (sportsSettings.sportsFieldHeight && (athlete.height || athlete.weight)) {
    profileFacts.push(['📏', 'Size', [athlete.height, athlete.weight].filter(Boolean).join(' / ')]);
  }
  if (profileFacts.length) {
    const rows = profileFacts.map(([icon, label, value]) => `<div class="qc-mini-fact"><div class="qc-mini-fact-icon">${icon}</div><div class="qc-mini-fact-text"><span class="qc-mini-fact-label">${label}:</span> ${sportsEscape(value)}</div></div>`).join('');
    sections.push(`<div class="qc-mini-section">${rows}</div>`);
  }

  if (sportsSettings.sportsFieldProStats) {
    const stats = Object.entries(athlete.proStats || {})
      .filter(([k]) => k !== '__title' && !k.includes('[MLB StatsAPI') && !k.includes('[source'));
    if (stats.length) {
      const boxes = stats.map(([k, v]) => `<div class="qc-mini-stat"><div class="qc-mini-stat-num">${sportsEscape(v)}</div><div class="qc-mini-stat-label">${sportsEscape(k)}</div></div>`).join('');
      sections.push(`<div class="qc-mini-section"><div class="qc-mini-stat-row">${boxes}</div></div>`);
    }
  }

  const gameFacts = [];
  if (sportsSettings.sportsFieldEspnRecentGames) {
    const games = (athlete.espn && athlete.espn.recentGames) || [];

    const lastGame = games[0];
    if (lastGame) {
      const opp = lastGame.opponentAbbrev || lastGame.opponent || '';
      const perf = (lastGame.points !== '' && lastGame.points != null)
        ? ` (${sportsEscape(lastGame.points)}${lastGame.pointsLabel ? ' ' + sportsEscape(lastGame.pointsLabel) : ''})`
        : '';
      const text = `${sportsEscape(lastGame.result)} ${sportsEscape(lastGame.score)} ${lastGame.atVs ? sportsEscape(lastGame.atVs) + ' ' : ''}${sportsEscape(opp)}${perf} · ${sportsEscape(sportsFmtGameDate(lastGame.date))}`;
      gameFacts.push(`<div class="qc-mini-fact"><div class="qc-mini-fact-icon">🕹️</div><div class="qc-mini-fact-text"><span class="qc-mini-fact-label">Last:</span> ${text}</div></div>`);
    }
  }

  if (sportsSettings.sportsFieldEspnNextGame) {
    const nextGame = athlete.espn && athlete.espn.nextGame;
    if (nextGame) {
      const when = sportsFmtGameDateTime(nextGame.date);
      const comps = sportsFormatOpponent(nextGame, athlete.team);
      gameFacts.push(`<div class="qc-mini-fact"><div class="qc-mini-fact-icon">📅</div><div class="qc-mini-fact-text"><span class="qc-mini-fact-label">Next:</span> ${comps}${when ? ' · ' + sportsEscape(when) : ''}${nextGame.location ? ' · ' + sportsEscape(nextGame.location) : ''}</div></div>`);
    }
  }
  if (gameFacts.length) sections.push(`<div class="qc-mini-section">${gameFacts.join('')}</div>`);

  if (sportsSettings.sportsFieldEspnAwards) {
    const awards = (athlete.espn && athlete.espn.awards) || [];

    if (awards.length) {
      const chips = awards.map(award => `<span class="qc-mini-chip">🏆 ${sportsEscape(award.name)}${award.displayCount ? ' ' + sportsEscape(award.displayCount) : ''}</span>`).join('');
      sections.push(`<div class="qc-mini-section"><p class="qc-mini-section-label">Awards</p><div class="qc-mini-chip-row">${chips}</div></div>`);
    }
  }

  return sections.join('');
}

function sportsBuildTeamSportMiniHtml(athlete) {
  const photoHtml = athlete.image
    ? `<img class="qc-mini-photo" data-sports-photo="1" src="${sportsEscape(athlete.image)}" alt="">`
    : sportsDefaultPhotoHtml('qc-mini-photo');

  const jerseyNum = athlete.jersey || athlete.number || '';
  const extraSports = Array.isArray(athlete.sports)
    ? athlete.sports.filter(label => label && label !== athlete.sport)
    : [];
  const sportsLine = extraSports.length ? extraSports.join(' • ') : '';
  const careerSpan = [athlete.careerStart, athlete.careerEnd].filter(Boolean).join('–');

  const showTeamNow = !!athlete.espn;
  const teamLineParts = [jerseyNum ? `#${jerseyNum}` : '', showTeamNow ? athlete.team : '', athlete.position].filter(Boolean);
  const teamLine = teamLineParts.join(' · ');

  const hasAnyTeamLine = !!(jerseyNum || athlete.team || athlete.position);
  const retiredLine = athlete.isRetired ? `Retired${careerSpan ? ` ${careerSpan}` : ''}` : '';
  const body = sportsTeamMiniBodyInner(athlete);

  return `
    <div class="qc-mini-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      ${photoHtml}
      <div style="min-width:0;">
        <h1 class="qc-mini-name">${sportsEscape(athlete.name || athlete.label)}</h1>
        ${hasAnyTeamLine ? `<p class="qc-mini-sub" id="qc-sports-mini-team-line">${sportsEscape(teamLine)}</p>` : ''}
        ${sportsLine ? `<p class="qc-mini-sub">${sportsEscape(sportsLine)}</p>` : ''}
        ${retiredLine ? `<p class="qc-mini-sub">${sportsEscape(retiredLine)}</p>` : ''}
      </div>
    </div>
    <div class="qc-mini-body" id="qc-sports-mini-body"${body ? '' : ' style="display:none;"'}>${body}</div>
  `;
}

function sportsBuildTennisHtml(athlete) {

  const sections = [];
  const singles = (athlete.tennisInfo && athlete.tennisInfo.singles) || {};
  const slams = (athlete.tennisInfo && athlete.tennisInfo.grandSlams) || [];

  const photoHtml = athlete.image
    ? `<img class="ten-photo" data-sports-photo="1" src="${sportsEscape(athlete.image)}" alt="">`
    : sportsDefaultPhotoHtml('ten-photo');

  sections.push(`
    <div class="ten-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      <div class="ten-hero-grid">
        ${photoHtml}
        <div>
          <h1 class="ten-name">${sportsEscape(athlete.name || athlete.label)}</h1>
          ${athlete.country ? `<p class="ten-country">${sportsEscape(athlete.country)}</p>` : ''}
          ${(sportsSettings.sportsFieldHeight && (athlete.height || athlete.weight)) ? `<p class="ten-country">${sportsEscape([athlete.height, athlete.weight].filter(Boolean).join(' / '))}</p>` : ''}
          ${athlete.description ? `<p class="qc-sports-desc">${sportsEscape(athlete.description)}</p>` : ''}
        </div>
      </div>
    </div>
  `);

  const stats = [];
  if (sportsSettings.sportsFieldTennisRecord && singles.careerRecord) stats.push({ label: 'Record', value: singles.careerRecord });
  if (sportsSettings.sportsFieldTennisTitles && singles.careerTitles) stats.push({ label: 'Titles', value: singles.careerTitles });
  if (sportsSettings.sportsFieldTennisRankings) {
    if (singles.highestRanking) stats.push({ label: 'High Rank', value: singles.highestRanking });
    if (singles.currentRanking) stats.push({ label: 'Current', value: singles.currentRanking });
  }

  const statsHtml = stats.length ? stats.map(st => `
    <div class="ten-stat">
      <div class="ten-stat-value">${sportsEscape(st.value)}</div>
      <div class="ten-stat-label">${sportsEscape(st.label)}</div>
    </div>
  `).join('') : '';
  sections.push(`<div class="ten-stats" id="qc-sports-tennis-stats-section"${statsHtml ? '' : ' style="display:none;"'}><div id="qc-sports-tennis-stats-slot">${statsHtml}</div></div>`);

  const slamNames = {
    'Australian Open': 'Australian',
    'French Open': 'French',
    'Wimbledon': 'Wimbledon',
    'US Open': 'US Open'
  };
  const slamsInner = (sportsSettings.sportsFieldTennisGrandSlams && slams.length) ? `<div class="ten-slams-grid">${slams.map(sl => {
    const shortName = slamNames[sl.tournament] || sl.tournament;
    const years = (sl.years && sl.years.length) ? sl.years.join(', ') : '';

    return `
      <div class="ten-slam">
        <div class="ten-slam-name">${sportsEscape(shortName)}</div>
        <div class="ten-slam-result ${sportsEscape(sl.result)}">${sportsEscape(sl.result)}</div>
        ${years ? `<div class="ten-slam-years">${sportsEscape(years)}</div>` : ''}
      </div>
    `;
  }).join('')}</div>` : '';

  sections.push(`
    <div class="ten-section" id="qc-sports-tennis-slams-section"${slamsInner ? '' : ' style="display:none;"'}>
      <h2 class="ten-section-title">Grand Slam Singles</h2>
      <div id="qc-sports-tennis-slams-slot">${slamsInner}</div>
    </div>
  `);

  return sections.join('');
}

function sportsTennisSlamsInner(athlete) {
  if (!sportsSettings.sportsFieldTennisGrandSlams) return '';
  const slams = (athlete.tennisInfo && athlete.tennisInfo.grandSlams) || [];
  if (!slams.length) return '';
  const slamNames = {
    'Australian Open': 'Australian',
    'French Open': 'French',
    'Wimbledon': 'Wimbledon',
    'US Open': 'US Open'
  };
  return `<div class="ten-slams-grid">${slams.map(sl => {
    const shortName = slamNames[sl.tournament] || sl.tournament;
    const years = (sl.years && sl.years.length) ? sl.years.join(', ') : '';
    return `
      <div class="ten-slam">
        <div class="ten-slam-name">${sportsEscape(shortName)}</div>
        <div class="ten-slam-result ${sportsEscape(sl.result)}">${sportsEscape(sl.result)}</div>
        ${years ? `<div class="ten-slam-years">${sportsEscape(years)}</div>` : ''}
      </div>
    `;
  }).join('')}</div>`;
}

function sportsTennisStatsInner(athlete) {
  const singles = (athlete.tennisInfo && athlete.tennisInfo.singles) || {};
  const stats = [];
  if (sportsSettings.sportsFieldTennisRecord && singles.careerRecord) stats.push({ label: 'Record', value: singles.careerRecord });
  if (sportsSettings.sportsFieldTennisTitles && singles.careerTitles) stats.push({ label: 'Titles', value: singles.careerTitles });
  if (sportsSettings.sportsFieldTennisRankings) {
    if (singles.highestRanking) stats.push({ label: 'High Rank', value: singles.highestRanking });
    if (singles.currentRanking) stats.push({ label: 'Current', value: singles.currentRanking });
  }
  if (!stats.length) return '';
  return stats.map(st => `
    <div class="ten-stat">
      <div class="ten-stat-value">${sportsEscape(st.value)}</div>
      <div class="ten-stat-label">${sportsEscape(st.label)}</div>
    </div>
  `).join('');
}

function sportsTennisMiniBodyInner(athlete) {
  const sections = [];
  const singles = (athlete.tennisInfo && athlete.tennisInfo.singles) || {};
  const statBoxes = [];
  if (sportsSettings.sportsFieldTennisRecord && singles.careerRecord) statBoxes.push(['Record', singles.careerRecord]);
  if (sportsSettings.sportsFieldTennisTitles && singles.careerTitles) statBoxes.push(['Titles', singles.careerTitles]);
  if (sportsSettings.sportsFieldTennisRankings) {
    if (singles.highestRanking) statBoxes.push(['High Rank', singles.highestRanking]);
    if (singles.currentRanking) statBoxes.push(['Current Rank', singles.currentRanking]);
  }
  if (statBoxes.length) {
    const boxes = statBoxes.map(([k, v]) => `<div class="qc-mini-stat"><div class="qc-mini-stat-num">${sportsEscape(v)}</div><div class="qc-mini-stat-label">${sportsEscape(k)}</div></div>`).join('');
    sections.push(`<div class="qc-mini-section"><div class="qc-mini-stat-row">${boxes}</div></div>`);
  }

  const slams = (athlete.tennisInfo && athlete.tennisInfo.grandSlams) || [];
  if (sportsSettings.sportsFieldTennisGrandSlams && slams.length) {
    const slamNames = {
      'Australian Open': 'AO',
      'French Open': 'RG',
      'Wimbledon': 'Wimb',
      'US Open': 'US'
    };
    const chips = slams.map(sl => {
      const shortName = slamNames[sl.tournament] || sl.tournament;
      const years = (sl.years && sl.years.length) ? ` (${sl.years.join(',')})` : '';
      return `<span class="qc-mini-chip">${sportsEscape(shortName)} ${sportsEscape(sl.result)}${sportsEscape(years)}</span>`;
    }).join('');
    sections.push(`<div class="qc-mini-section"><p class="qc-mini-section-label">Grand Slams</p><div class="qc-mini-chip-row">${chips}</div></div>`);
  }

  return sections.join('');
}

function sportsBuildTennisMiniHtml(athlete) {
  const photoHtml = athlete.image
    ? `<img class="qc-mini-photo" data-sports-photo="1" src="${sportsEscape(athlete.image)}" alt="">`
    : sportsDefaultPhotoHtml('qc-mini-photo');
  const body = sportsTennisMiniBodyInner(athlete);

  return `
    <div class="qc-mini-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      ${photoHtml}
      <div style="min-width:0;">
        <h1 class="qc-mini-name">${sportsEscape(athlete.name || athlete.label)}</h1>
        ${athlete.country ? `<p class="qc-mini-sub">${sportsEscape(athlete.country)}</p>` : ''}
        ${(sportsSettings.sportsFieldHeight && (athlete.height || athlete.weight)) ? `<p class="qc-mini-sub">${sportsEscape([athlete.height, athlete.weight].filter(Boolean).join(' / '))}</p>` : ''}
        ${athlete.description ? `<p class="qc-sports-desc">${sportsEscape(athlete.description)}</p>` : ''}
      </div>
    </div>
    <div class="qc-mini-body" id="qc-sports-mini-body"${body ? '' : ' style="display:none;"'}>${body}</div>
  `;
}

function sportsBuildOlympicSportHtml(athlete) {
  const sections = [];

  const photoHtml = athlete.image
    ? `<img class="oly-photo" data-sports-photo="1" src="${sportsEscape(athlete.image)}" alt="">`
    : sportsDefaultPhotoHtml('oly-photo');

  sections.push(`
    <div class="oly-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      <div class="oly-hero-grid">
        ${photoHtml}
        <div>
          <h1 class="oly-name">${sportsEscape(athlete.name || athlete.label)}</h1>
          ${athlete.sport ? `<p class="oly-sport">${sportsEscape(athlete.sport)}</p>` : ''}
          ${athlete.description ? `<p class="qc-sports-desc">${sportsEscape(athlete.description)}</p>` : ''}
        </div>
      </div>
    </div>
  `);

  const profileFacts = [];
  if (sportsSettings.sportsFieldCountry && athlete.country) profileFacts.push({ label: 'Country', value: athlete.country });
  if (athlete.birthDate) profileFacts.push({ label: 'Born', value: athlete.birthDate });
  if (sportsSettings.sportsFieldHeight) {
    if (athlete.height) profileFacts.push({ label: 'Height', value: athlete.height });
    if (athlete.weight) profileFacts.push({ label: 'Weight', value: athlete.weight });
  }
  if (profileFacts.length) {
    const profileFactsHtml = profileFacts.map(fact => `
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">${sportsEscape(fact.label)}</span>
        <span style="font-size:13px;color:#1f2937;font-weight:600;">${sportsEscape(fact.value)}</span>
      </div>
    `).join('');
    sections.push(`
      <div class="oly-section">
        <h2 class="oly-section-title">Profile</h2>
        ${profileFactsHtml}
      </div>
    `);
  }

  const competitions = (athlete.medalRecord && athlete.medalRecord.competitions) || [];
  const olympicComp = competitions.find(comp => comp.category === 'olympic');

  function sportsMedalBlockHtml(comp) {
    if (!comp || !(comp.gold || comp.silver || comp.bronze)) return '';
    return `
          <div class="oly-medal">
            <div class="oly-medal-icon">🥇</div>
            <div class="oly-medal-count gold">${comp.gold || 0}</div>
            <div class="oly-medal-label">Gold</div>
          </div>
          <div class="oly-medal">
            <div class="oly-medal-icon">🥈</div>
            <div class="oly-medal-count silver">${comp.silver || 0}</div>
            <div class="oly-medal-label">Silver</div>
          </div>
          <div class="oly-medal">
            <div class="oly-medal-icon">🥉</div>
            <div class="oly-medal-count bronze">${comp.bronze || 0}</div>
            <div class="oly-medal-label">Bronze</div>
          </div>`;
  }
  function sportsSumCategory(comps, category) {
    const matched = (comps || []).filter(c => c.category === category);
    if (!matched.length) return null;
    return {
      gold: matched.reduce((s, c) => s + (c.gold || 0), 0),
      silver: matched.reduce((s, c) => s + (c.silver || 0), 0),
      bronze: matched.reduce((s, c) => s + (c.bronze || 0), 0)
    };
  }

  if (sportsSettings.sportsFieldOlympicMedals) {
    const medalsInner = sportsMedalBlockHtml(olympicComp);
    sections.push(`
      <div class="oly-medals-wrap" id="qc-sports-medals-section"${medalsInner ? '' : ' style="display:none;"'}>
        <div class="oly-medals-title">🏅 Olympic Medals</div>
        <div class="oly-medals">
          <div id="qc-sports-medals-slot" style="display:contents!important;">${medalsInner}</div>
        </div>
      </div>
    `);
  }
  if (sportsSettings.sportsFieldWorldChampionships) {
    const worldSum = sportsSumCategory(competitions, 'world');
    const worldInner = sportsMedalBlockHtml(worldSum);
    sections.push(`
      <div class="oly-medals-wrap" id="qc-sports-world-medals-section"${worldInner ? '' : ' style="display:none;"'}>
        <div class="oly-medals-title">🌍 World Championships</div>
        <div class="oly-medals">
          <div id="qc-sports-world-medals-slot" style="display:contents!important;">${worldInner}</div>
        </div>
      </div>
    `);
  }
  if (sportsSettings.sportsFieldContinentalChampionships) {
    const contSum = sportsSumCategory(competitions, 'continental');
    const contInner = sportsMedalBlockHtml(contSum);
    sections.push(`
      <div class="oly-medals-wrap" id="qc-sports-continental-medals-section"${contInner ? '' : ' style="display:none;"'}>
        <div class="oly-medals-title">🗺️ Continental Medals</div>
        <div class="oly-medals">
          <div id="qc-sports-continental-medals-slot" style="display:contents!important;">${contInner}</div>
        </div>
      </div>
    `);
  }

  if (sportsSettings.sportsFieldCareerHighlights) {
    const timeline = sportsCollectTimeline(competitions);
    const timelineInner = timeline.length ? sportsBuildTimelineItemsHtml(timeline, SPORTS_TIMELINE_PAGE_SIZE) : '';
    sections.push(`
      <div class="oly-section" id="qc-sports-timeline-section"${timelineInner ? '' : ' style="display:none;"'}>
        <h2 class="oly-section-title">Career Highlights</h2>
        <div id="qc-sports-timeline-slot">${timelineInner}</div>
      </div>
    `);
  }

  if (sportsSettings.sportsFieldTitlesCount) {
    const parts = [];
    if (athlete.titlesCount) {
      if (athlete.titlesCount.olympic) parts.push(`${athlete.titlesCount.olympic}x Olympic Champion`);
      if (athlete.titlesCount.world) parts.push(`${athlete.titlesCount.world}x World Champion`);
      if (athlete.titlesCount.european) parts.push(`${athlete.titlesCount.european}x European Champion`);
    }

    const titlesInner = parts.length ? `<div style="font-size:13px;color:#1f2937;line-height:1.6;">${parts.map(part => sportsEscape(part)).join(' · ')}</div>` : '';
    sections.push(`
      <div class="oly-section" id="qc-sports-titles-section"${titlesInner ? '' : ' style="display:none;"'}>
        <h2 class="oly-section-title">Championships</h2>
        <div id="qc-sports-titles-slot">${titlesInner}</div>
      </div>
    `);
  }

  return sections.join('');
}

function sportsMedalsInner(athlete) {
  const competitions = (athlete.medalRecord && athlete.medalRecord.competitions) || [];
  const olympicComp = competitions.find(comp => comp.category === 'olympic');
  if (!olympicComp || !(olympicComp.gold || olympicComp.silver || olympicComp.bronze)) return '';
  return `
    <div class="oly-medal">
      <div class="oly-medal-icon">🥇</div>
      <div class="oly-medal-count gold">${olympicComp.gold || 0}</div>
      <div class="oly-medal-label">Gold</div>
    </div>
    <div class="oly-medal">
      <div class="oly-medal-icon">🥈</div>
      <div class="oly-medal-count silver">${olympicComp.silver || 0}</div>
      <div class="oly-medal-label">Silver</div>
    </div>
    <div class="oly-medal">
      <div class="oly-medal-icon">🥉</div>
      <div class="oly-medal-count bronze">${olympicComp.bronze || 0}</div>
      <div class="oly-medal-label">Bronze</div>
    </div>`;
}

const SPORTS_TIMELINE_PAGE_SIZE = 20;

function sportsCollectTimeline(competitions) {
  const timeline = [];
  for (const comp of (competitions || [])) {
    for (const detail of (comp.details || [])) {
      timeline.push({
        year: detail.year,
        event: `${detail.type} — ${comp.name}${detail.event ? `, ${detail.event}` : ''}`,
        medal: detail.type,
        name: comp.name
      });
    }
  }
  timeline.sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));
  return timeline;
}

function sportsBuildTimelineItemsHtml(timeline, shownCount) {
  const page = SPORTS_TIMELINE_PAGE_SIZE;
  const shown = Math.min(shownCount || page, timeline.length);
  const itemsHtml = timeline.map((entry, i) => `
        <div class="oly-timeline-item"${i >= shown ? ' style="display:none!important;"' : ''}>
          <div class="oly-timeline-year">${sportsEscape(entry.year)}</div>
          <div class="oly-timeline-event">
            ${sportsEscape(entry.event)}
            <span class="oly-timeline-medal ${sportsEscape(entry.medal)}">${sportsEscape(entry.medal)}</span>
          </div>
        </div>
      `).join('');
  const moreHtml = shown < timeline.length
    ? `<button type="button" class="oly-timeline-more" data-shown="${shown}">Show more</button>`
    : '';
  return `<div class="oly-timeline" data-shown="${shown}">${itemsHtml}${moreHtml}</div>`;
}

function sportsTimelineInner(athlete) {
  const competitions = (athlete.medalRecord && athlete.medalRecord.competitions) || [];
  const timeline = sportsCollectTimeline(competitions);
  if (!timeline.length) return '';
  return sportsBuildTimelineItemsHtml(timeline, SPORTS_TIMELINE_PAGE_SIZE);
}

function sportsTitlesInner(athlete) {
  if (!athlete.titlesCount) return '';
  const parts = [];
  if (athlete.titlesCount.olympic) parts.push(`${athlete.titlesCount.olympic}x Olympic Champion`);
  if (athlete.titlesCount.world) parts.push(`${athlete.titlesCount.world}x World Champion`);
  if (athlete.titlesCount.european) parts.push(`${athlete.titlesCount.european}x European Champion`);
  if (!parts.length) return '';
  return `<div style="font-size:13px;color:#1f2937;line-height:1.6;">${parts.map(part => sportsEscape(part)).join(' · ')}</div>`;
}

function sportsOlympicMiniBodyInner(athlete) {
  const competitions = (athlete.medalRecord && athlete.medalRecord.competitions) || [];
  const olympicComp = competitions.find(comp => comp.category === 'olympic');
  const sections = [];

  const profileFacts = [];
  if (sportsSettings.sportsFieldCountry && athlete.country) {
    profileFacts.push(['🌍', 'Country', athlete.country]);
  }
  if (sportsSettings.sportsFieldHeight && (athlete.height || athlete.weight)) {
    profileFacts.push(['📏', 'Size', [athlete.height, athlete.weight].filter(Boolean).join(' / ')]);
  }
  if (profileFacts.length) {
    const rows = profileFacts.map(([icon, label, value]) => `<div class="qc-mini-fact"><div class="qc-mini-fact-icon">${icon}</div><div class="qc-mini-fact-text"><span class="qc-mini-fact-label">${label}:</span> ${sportsEscape(value)}</div></div>`).join('');
    sections.push(`<div class="qc-mini-section">${rows}</div>`);
  }

  if (sportsSettings.sportsFieldOlympicMedals && olympicComp && (olympicComp.gold || olympicComp.silver || olympicComp.bronze)) {
    const boxes = [];
    if (olympicComp.gold) boxes.push(['🥇', olympicComp.gold, 'Gold']);
    if (olympicComp.silver) boxes.push(['🥈', olympicComp.silver, 'Silver']);
    if (olympicComp.bronze) boxes.push(['🥉', olympicComp.bronze, 'Bronze']);
    const html = boxes.map(([emoji, count, label]) => `<div class="qc-mini-stat"><div class="qc-mini-stat-num">${emoji} ${sportsEscape(count)}</div><div class="qc-mini-stat-label">${label}</div></div>`).join('');
    sections.push(`<div class="qc-mini-section"><p class="qc-mini-section-label">Olympic</p><div class="qc-mini-stat-row">${html}</div></div>`);
  }
  if (sportsSettings.sportsFieldWorldChampionships) {
    const worldComps = competitions.filter(c => c.category === 'world');
    if (worldComps.length) {
      const g = worldComps.reduce((s, c) => s + (c.gold || 0), 0);
      const s = worldComps.reduce((s, c) => s + (c.silver || 0), 0);
      const b = worldComps.reduce((s, c) => s + (c.bronze || 0), 0);
      if (g || s || b) {
        const boxes = [];
        if (g) boxes.push(['🥇', g, 'Gold']);
        if (s) boxes.push(['🥈', s, 'Silver']);
        if (b) boxes.push(['🥉', b, 'Bronze']);
        const html = boxes.map(([emoji, count, label]) => `<div class="qc-mini-stat"><div class="qc-mini-stat-num">${emoji} ${sportsEscape(count)}</div><div class="qc-mini-stat-label">${label}</div></div>`).join('');
        sections.push(`<div class="qc-mini-section"><p class="qc-mini-section-label">World</p><div class="qc-mini-stat-row">${html}</div></div>`);
      }
    }
  }
  if (sportsSettings.sportsFieldContinentalChampionships) {
    const contComps = competitions.filter(c => c.category === 'continental');
    if (contComps.length) {
      const g = contComps.reduce((s, c) => s + (c.gold || 0), 0);
      const s = contComps.reduce((s, c) => s + (c.silver || 0), 0);
      const b = contComps.reduce((s, c) => s + (c.bronze || 0), 0);
      if (g || s || b) {
        const boxes = [];
        if (g) boxes.push(['🥇', g, 'Gold']);
        if (s) boxes.push(['🥈', s, 'Silver']);
        if (b) boxes.push(['🥉', b, 'Bronze']);
        const html = boxes.map(([emoji, count, label]) => `<div class="qc-mini-stat"><div class="qc-mini-stat-num">${emoji} ${sportsEscape(count)}</div><div class="qc-mini-stat-label">${label}</div></div>`).join('');
        sections.push(`<div class="qc-mini-section"><p class="qc-mini-section-label">Continental</p><div class="qc-mini-stat-row">${html}</div></div>`);
      }
    }
  }

  if (sportsSettings.sportsFieldTitlesCount && athlete.titlesCount) {
    const chips = [];
    if (athlete.titlesCount.olympic) chips.push(`${athlete.titlesCount.olympic}× Olympic Champion`);
    if (athlete.titlesCount.world) chips.push(`${athlete.titlesCount.world}× World Champion`);
    if (athlete.titlesCount.european) chips.push(`${athlete.titlesCount.european}× European Champion`);
    if (chips.length) {
      sections.push(`<div class="qc-mini-section"><div class="qc-mini-chip-row">${chips.map(c => `<span class="qc-mini-chip">🏅 ${sportsEscape(c)}</span>`).join('')}</div></div>`);
    }
  }

  if (sportsSettings.sportsFieldCareerHighlights) {
    const timeline = [];
    for (const comp of competitions) {
      for (const detail of (comp.details || [])) {
        timeline.push({ year: detail.year, medal: detail.type, name: comp.name });
      }
    }
    timeline.sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));
    if (timeline.length) {
      const medalEmoji = { Gold: '🥇', Silver: '🥈', Bronze: '🥉' };

      const page = SPORTS_TIMELINE_PAGE_SIZE;
      const chips = timeline.map((entry, i) =>
        `<span class="qc-mini-chip"${i >= page ? ' style="display:none!important;"' : ''}>${medalEmoji[entry.medal] || sportsEscape(entry.medal)} ${sportsEscape(entry.year)} ${sportsEscape(entry.name)}</span>`
      ).join('');
      const more = timeline.length > page
        ? `<button type="button" class="oly-timeline-more qc-mini-timeline-more" data-shown="${page}">Show more</button>`
        : '';
      sections.push(`<div class="qc-mini-section"><p class="qc-mini-section-label">Career Highlights</p><div class="qc-mini-chip-row" data-shown="${Math.min(page, timeline.length)}">${chips}</div>${more}</div>`);
    }
  }

  return sections.join('');
}

function sportsBuildOlympicSportMiniHtml(athlete) {
  const photoHtml = athlete.image
    ? `<img class="qc-mini-photo" data-sports-photo="1" src="${sportsEscape(athlete.image)}" alt="">`
    : sportsDefaultPhotoHtml('qc-mini-photo');
  const body = sportsOlympicMiniBodyInner(athlete);

  return `
    <div class="qc-mini-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      ${photoHtml}
      <div style="min-width:0;">
        <h1 class="qc-mini-name">${sportsEscape(athlete.name || athlete.label)}</h1>
        ${athlete.sport ? `<p class="qc-mini-sub">${sportsEscape(athlete.sport)}</p>` : ''}
        ${athlete.description ? `<p class="qc-sports-desc">${sportsEscape(athlete.description)}</p>` : ''}
      </div>
    </div>
    <div class="qc-mini-body" id="qc-sports-mini-body"${body ? '' : ' style="display:none;"'}>${body}</div>
  `;
}

function sportsBuildGeneralHtml(athlete) {
  const sections = [];

  const photoHtml = athlete.image
    ? `<img class="gen-photo" data-sports-photo="1" src="${sportsEscape(athlete.image)}" alt="">`
    : sportsDefaultPhotoHtml('gen-photo');

  sections.push(`
    <div class="gen-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      <div class="gen-hero-grid">
        ${photoHtml}
        <div>
          <h1 class="gen-name">${sportsEscape(athlete.name || athlete.label)}</h1>
          ${athlete.sport ? `<p class="gen-sub">${sportsEscape(athlete.sport)}</p>` : ''}
          ${athlete.country ? `<p class="gen-sub">${sportsEscape(athlete.country)}</p>` : ''}
          ${athlete.description ? `<p class="qc-sports-desc">${sportsEscape(athlete.description)}</p>` : ''}
        </div>
      </div>
    </div>
  `);

  const facts = [];
  if (sportsSettings.sportsFieldCountry && athlete.country) facts.push({ label: 'Country', value: athlete.country });
  if (athlete.birthDate) facts.push({ label: 'Born', value: athlete.birthDate });
  if (sportsSettings.sportsFieldTeam && athlete.team) facts.push({ label: 'Team', value: athlete.team });
  if (sportsSettings.sportsFieldHeight) {
    if (athlete.height) facts.push({ label: 'Height', value: athlete.height });
    if (athlete.weight) facts.push({ label: 'Weight', value: athlete.weight });
  }
  if (sportsSettings.sportsFieldSport && athlete.sport) facts.push({ label: 'Sport', value: athlete.sport });

  if (facts.length) {
    const factsHtml = facts.map(fact => `
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">${sportsEscape(fact.label)}</span>
        <span style="font-size:13px;color:#1f2937;font-weight:600;">${sportsEscape(fact.value)}</span>
      </div>
    `).join('');

    sections.push(`
      <div class="gen-section">
        <h2 class="gen-section-title">Profile</h2>
        ${factsHtml}
      </div>
    `);
  }

  const statsEntries = Object.entries(athlete.proStats || {}).filter(([k]) => k !== '__title');
  if (sportsSettings.sportsFieldProStats) {
    const statsInner = statsEntries.map(([k, v]) => `
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;">${sportsEscape(k)}</span>
        <span style="font-size:13px;color:#1f2937;font-weight:700;">${sportsEscape(v)}</span>
      </div>
    `).join('');

    sections.push(`
      <div class="gen-section" id="qc-sports-general-stats-section"${statsInner ? '' : ' style="display:none;"'}>
        <h2 class="gen-section-title">Statistics</h2>
        <div id="qc-sports-general-stats-slot">${statsInner}</div>
      </div>
    `);
  }

  const motorsportRows = (athlete.motorsportInfo && Object.keys(athlete.motorsportInfo).length)
    ? (() => {
        const motorsport = athlete.motorsportInfo;
        const rows = [];
        if (sportsSettings.sportsFieldMotorsportProfile) {
          rows.push(
            ['Nationality', motorsport.nationality],
            ['Current Team', motorsport.currentTeam],
            ['Active Years', motorsport.activeYears],
            ['Car Number', motorsport.carNumber]
          );
        }
        if (sportsSettings.sportsFieldMotorsportCareerStats) {
          rows.push(
            ['Championships', motorsport.championships],
            ['Wins', motorsport.wins],
            ['Podiums', motorsport.podiums],
            ['Career Points', motorsport.careerPoints],
            ['Pole Positions', motorsport.polePositions],
            ['Fastest Laps', motorsport.fastestLaps]
          );
        }
        if (sportsSettings.sportsFieldMotorsportTimeline) {
          rows.push(
            ['First Entry', motorsport.firstEntry],
            ['First Win', motorsport.firstWin],
            ['Last Win', motorsport.lastWin],
            ['Last Entry', motorsport.lastEntry],
            ['Last Season', motorsport.lastSeason ? `${motorsport.lastSeason}${motorsport.lastSeasonPosition ? ` — ${motorsport.lastSeasonPosition}` : ''}` : null]
          );
        }
        return rows.filter(([, v]) => v);
      })()
    : [];
  const f1Inner = motorsportRows.map(([k, v]) => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;">
      <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">${sportsEscape(k)}</span>
      <span style="font-size:13px;color:#1f2937;font-weight:700;">${sportsEscape(String(v))}</span>
    </div>
  `).join('');
  sections.push(`
    <div class="gen-section" id="qc-sports-f1-section"${f1Inner ? '' : ' style="display:none;"'}>
      <h2 class="gen-section-title">Career</h2>
      <div id="qc-sports-f1-slot">${f1Inner}</div>
    </div>
  `);

  if (sportsSettings.sportsFieldCareerHighlights) {
    const competitions = (athlete.medalRecord && athlete.medalRecord.competitions) || [];
    const timeline = sportsCollectTimeline(competitions);
    const timelineInner = timeline.length ? sportsBuildTimelineItemsHtml(timeline, SPORTS_TIMELINE_PAGE_SIZE) : '';
    sections.push(`
      <div class="gen-section" id="qc-sports-timeline-section"${timelineInner ? '' : ' style="display:none;"'}>
        <h2 class="gen-section-title">Career Highlights</h2>
        <div id="qc-sports-timeline-slot">${timelineInner}</div>
      </div>
    `);
  }
  if (sportsSettings.sportsFieldTitlesCount) {
    const titlesInner = sportsTitlesInner(athlete);
    sections.push(`
      <div class="gen-section" id="qc-sports-titles-section"${titlesInner ? '' : ' style="display:none;"'}>
        <h2 class="gen-section-title">Championships</h2>
        <div id="qc-sports-titles-slot">${titlesInner}</div>
      </div>
    `);
  }

  return sections.join('');
}

function sportsGeneralStatsInner(athlete) {
  const statsEntries = Object.entries(athlete.proStats || {}).filter(([k]) => k !== '__title');
  if (!statsEntries.length) return '';
  return statsEntries.map(([k, v]) => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;">
      <span style="font-size:12px;color:#6b7280;">${sportsEscape(k)}</span>
      <span style="font-size:13px;color:#1f2937;font-weight:700;">${sportsEscape(v)}</span>
    </div>
  `).join('');
}

function sportsF1Inner(athlete) {
  if (!athlete.motorsportInfo || !Object.keys(athlete.motorsportInfo).length) return '';
  const motorsport = athlete.motorsportInfo;
  const rows = [];
  if (sportsSettings.sportsFieldMotorsportProfile) {
    rows.push(
      ['Class', motorsport.class],
      ['Nationality', motorsport.nationality],
      ['Current Team', motorsport.currentTeam],
      ['Active Years', motorsport.activeYears],
      ['Number', motorsport.carNumber],
      ['Co-driver', motorsport.coDriver]
    );
  }
  if (sportsSettings.sportsFieldMotorsportCareerStats) {
    rows.push(
      ['Championships', motorsport.championships],
      ['Starts', motorsport.races],
      ['Wins', motorsport.wins],
      ['Podiums', motorsport.podiums],
      ['Career Points', motorsport.careerPoints],
      ['Pole Positions', motorsport.poles || motorsport.polePositions],
      ['Stage Wins', motorsport.stageWins],
      ['Fastest Laps', motorsport.fastestLaps]
    );
  }
  if (sportsSettings.sportsFieldMotorsportTimeline) {
    rows.push(
      ['First Entry', motorsport.firstEntry],
      ['First Win', motorsport.firstWin],
      ['Last Win', motorsport.lastWin],
      ['Last Entry', motorsport.lastEntry],
      ['Last Season', motorsport.lastSeason ? `${motorsport.lastSeason}${motorsport.lastSeasonPosition ? ` — ${motorsport.lastSeasonPosition}` : ''}` : null]
    );
  }
  const filtered = rows.filter(([, v]) => v);
  if (!filtered.length) return '';
  return filtered.map(([k, v]) => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;">
      <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">${sportsEscape(k)}</span>
      <span style="font-size:13px;color:#1f2937;font-weight:700;">${sportsEscape(String(v))}</span>
    </div>
  `).join('');
}

function sportsGeneralMiniBodyInner(athlete) {
  const sections = [];

  const profileFacts = [];
  if (sportsSettings.sportsFieldCountry && athlete.country) {
    profileFacts.push(['🌍', 'Country', athlete.country]);
  }
  if (athlete.birthDate) {
    profileFacts.push(['🎂', 'Born', athlete.birthDate]);
  }
  if (sportsSettings.sportsFieldTeam && athlete.team) {
    profileFacts.push(['🎽', 'Team', athlete.team]);
  }
  if (sportsSettings.sportsFieldHeight && (athlete.height || athlete.weight)) {
    profileFacts.push(['📏', 'Size', [athlete.height, athlete.weight].filter(Boolean).join(' / ')]);
  }
  if (profileFacts.length) {
    const rows = profileFacts.map(([icon, label, value]) => `<div class="qc-mini-fact"><div class="qc-mini-fact-icon">${icon}</div><div class="qc-mini-fact-text"><span class="qc-mini-fact-label">${label}:</span> ${sportsEscape(value)}</div></div>`).join('');
    sections.push(`<div class="qc-mini-section">${rows}</div>`);
  }

  if (sportsSettings.sportsFieldProStats) {
    const statsEntries = Object.entries(athlete.proStats || {}).filter(([k]) => k !== '__title');
    if (statsEntries.length) {
      const boxes = statsEntries.map(([k, v]) => `<div class="qc-mini-stat"><div class="qc-mini-stat-num">${sportsEscape(v)}</div><div class="qc-mini-stat-label">${sportsEscape(k)}</div></div>`).join('');
      sections.push(`<div class="qc-mini-section"><div class="qc-mini-stat-row">${boxes}</div></div>`);
    }
  }

  if (athlete.motorsportInfo && Object.keys(athlete.motorsportInfo).length) {
    const motorsport = athlete.motorsportInfo;

    const rows = [
      ['Nationality', motorsport.nationality],
      ['Team', motorsport.currentTeam],
      ['Active', motorsport.activeYears],
      ['Car #', motorsport.carNumber],
        ['Championships', motorsport.championships],
      ['Wins', motorsport.wins],
      ['Podiums', motorsport.podiums],
      ['Points', motorsport.careerPoints],
      ['Poles', motorsport.polePositions],
      ['Fastest Laps', motorsport.fastestLaps],
      ['First Entry', motorsport.firstEntry],
      ['First Win', motorsport.firstWin],
      ['Last Win', motorsport.lastWin],
      ['Last Entry', motorsport.lastEntry],
      ['Last Season', motorsport.lastSeason ? `${motorsport.lastSeason}${motorsport.lastSeasonPosition ? ` — ${motorsport.lastSeasonPosition}` : ''}` : null]
    ].filter(([, v]) => v);
    if (rows.length) {
      const chips = rows.map(([k, v]) => `<span class="qc-mini-chip">${sportsEscape(k)}: ${sportsEscape(String(v))}</span>`).join('');
      sections.push(`<div class="qc-mini-section"><p class="qc-mini-section-label">Career</p><div class="qc-mini-chip-row">${chips}</div></div>`);
    }
  }

  if (sportsSettings.sportsFieldCareerHighlights) {
    const competitions = (athlete.medalRecord && athlete.medalRecord.competitions) || [];
    const timeline = sportsCollectTimeline(competitions);
    if (timeline.length) {
      const bits = timeline.slice(0, 6).map(e => `${e.year || ''} ${e.medal || ''}`.trim()).filter(Boolean);
      if (bits.length) {
        sections.push(`<div class="qc-mini-section"><div class="qc-mini-section-label">Career Highlights</div><div class="qc-mini-muted">${bits.map(b => sportsEscape(b)).join(' · ')}</div></div>`);
      }
    }
  }
  if (sportsSettings.sportsFieldTitlesCount) {
    const titlesInner = sportsTitlesInner(athlete);
    if (titlesInner) {
      sections.push(`<div class="qc-mini-section"><div class="qc-mini-section-label">Championships</div>${titlesInner}</div>`);
    }
  }

  return sections.join('');
}

function sportsBuildGeneralMiniHtml(athlete) {
  const photoHtml = athlete.image
    ? `<img class="qc-mini-photo" data-sports-photo="1" src="${sportsEscape(athlete.image)}" alt="">`
    : sportsDefaultPhotoHtml('qc-mini-photo');
  const subLine = [athlete.sport, athlete.country].filter(Boolean).join(' · ');
  const body = sportsGeneralMiniBodyInner(athlete);

  return `
    <div class="qc-mini-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      ${photoHtml}
      <div style="min-width:0;">
        <h1 class="qc-mini-name">${sportsEscape(athlete.name || athlete.label)}</h1>
        ${subLine ? `<p class="qc-mini-sub">${sportsEscape(subLine)}</p>` : ''}
        ${athlete.description ? `<p class="qc-sports-desc">${sportsEscape(athlete.description)}</p>` : ''}
      </div>
    </div>
    <div class="qc-mini-body" id="qc-sports-mini-body"${body ? '' : ' style="display:none;"'}>${body}</div>
  `;
}

function sportsFilterLinksBySettings(links) {
  if (!links) return [];
  return links.filter(link => {
    if (link.kind === 'wikipedia' && !sportsSettings.sportsShowWikipediaLink) return false;
    if (link.kind === 'espn' && !sportsSettings.sportsShowEspnLink) return false;
    if (link.kind === 'olympics' && !sportsSettings.sportsShowOlympicsLink) return false;
    if (link.kind === 'official' && !sportsSettings.sportsShowOfficialLink) return false;
    if (link.kind === 'sofascore' && !sportsSettings.sportsShowSofascoreLink) return false;
    if (link.kind === 'flashscore' && !sportsSettings.sportsShowFlashscoreLink) return false;
    if (link.kind === 'specialty' && !sportsSettings.sportsShowSpecialtyLink) return false;
    return true;
  });
}

function sportsBuildExternalLinksHtml(allLinks, data) {
  const links = sportsFilterLinksBySettings(allLinks);
  const custom = (sportsSettings.sportsCustomLinks || []).map(cl => {
    if (!cl.urlTemplate) return null;
    return {
      label: (cl.label && cl.label.trim()) || 'Custom Link',
      url: sportsBuildCustomLinkUrl(cl.urlTemplate, data || {}),
      icon: cl.icon || null,
      kind: 'custom'
    };
  }).filter(Boolean);

  const finalLinks = [...links, ...custom];
  if (!finalLinks.length) return '';

  return buildExternalLinksHtml(finalLinks);
}

function sportsDefaultPhotoHtml(cls) {

  return `<div class="${cls} sports-photo-empty" aria-hidden="true"></div>`;
}

function sportsHeroPhotoHtml(athlete, cls) {
  if (athlete.image) {
    return `<img class="${cls}" data-sports-photo="1" src="${sportsEscape(athlete.image)}" alt="">`;
  }
  return sportsDefaultPhotoHtml(cls);
}

function sportsCricketFormats(athlete) {
  const formats = (athlete.cricketInfo && athlete.cricketInfo.formats) || [];

  const intl = formats.filter(f => /test|odi|t20/i.test(f.label || ''));
  return (intl.length ? intl : formats).slice(0, 3);
}

function sportsCricketBodyHtml(athlete) {
  const c = athlete.cricketInfo;
  let body = '';
  if (c === undefined) {
    return `<div class="ck-section"><div class="loading" style="padding:8px 0;">Loading cricket stats…</div></div>`;
  }
  if (!c) return '';
  const facts = [];

  if (sportsSettings.sportsFieldCountry && athlete.country) facts.push(['Country', athlete.country]);
  if (athlete.birthDate) facts.push(['Born', athlete.birthDate]);
  if (sportsSettings.sportsFieldHeight) {
    if (athlete.height) facts.push(['Height', athlete.height]);
    if (athlete.weight) facts.push(['Weight', athlete.weight]);
  }
  if (sportsSettings.sportsFieldCricketRole && c.role) facts.push(['Role', c.role]);
  if (sportsSettings.sportsFieldCricketStyles) {
    if (c.batting) facts.push(['Batting', c.batting]);
    if (c.bowling) facts.push(['Bowling', c.bowling]);
  }
  if (sportsSettings.sportsFieldCricketSpan && c.internationalSpan) facts.push(['International', c.internationalSpan]);
  if (sportsSettings.sportsFieldCricketClubs && c.clubs && c.clubs.length) {
    facts.push(['Clubs', c.clubs.slice(0, 4).join(', ')]);
  }
  if (facts.length) {
    body += `<div class="ck-section"><h3 class="ck-section-title">Profile</h3>${facts.map(([k,v]) =>
      `<div class="ck-fact"><span>${sportsEscape(k)}</span><span>${sportsEscape(v)}</span></div>`).join('')}</div>`;
  }
  const formats = sportsCricketFormats(athlete);
  if (sportsSettings.sportsFieldCricketStats && formats.length) {
    const showWk = formats.some(f => f.wickets && f.wickets !== '0' && f.wickets !== '–' && f.wickets !== '-');
    const head = `<tr><th>Format</th><th>Mat</th><th>Runs</th><th>Avg</th>${showWk ? '<th>Wkts</th>' : ''}</tr>`;
    const rows = formats.map(f => {
      const wk = showWk ? `<td>${sportsEscape(f.wickets || '')}</td>` : '';
      return `<tr><td>${sportsEscape(f.label)}</td><td>${sportsEscape(f.matches)}</td><td>${sportsEscape(f.runs)}</td><td>${sportsEscape(f.batAvg)}</td>${wk}</tr>`;
    }).join('');
    body += `<div class="ck-section"><h3 class="ck-section-title">Career batting</h3><table class="ck-stats-table"><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
  }
  return body;
}

function sportsGolfBodyHtml(athlete) {
  const g = athlete.golfWiki;
  const espnGolf = athlete.espn && athlete.espn.golf;
  let body = '';
  if (g === undefined) {
    body += `<div class="gf-section"><div class="loading" style="padding:8px 0;">Loading career…</div></div>`;
  } else if (g) {
    const facts = [];
    if (sportsSettings.sportsFieldCountry && athlete.country) facts.push(['Country', athlete.country]);
    if (athlete.birthDate) facts.push(['Born', athlete.birthDate]);
    if (sportsSettings.sportsFieldHeight) {
      if (athlete.height) facts.push(['Height', athlete.height]);
      if (athlete.weight) facts.push(['Weight', athlete.weight]);
    }
    if (sportsSettings.sportsFieldGolfTour && g.tour) facts.push(['Tour', g.tour]);
    if (sportsSettings.sportsFieldGolfTour && g.turnedPro) facts.push(['Turned pro', g.turnedPro]);
    if (facts.length) {
      body += `<div class="gf-section"><h3 class="gf-section-title">Profile</h3>${facts.map(([k,v]) =>
        `<div class="gf-fact"><span>${sportsEscape(k)}</span><span>${sportsEscape(v)}</span></div>`).join('')}</div>`;
    }
    if (sportsSettings.sportsFieldGolfCareerWins) {
      const wins = [
        g.majorWins && ['Majors', g.majorWins],
        g.pgaWins && ['PGA', g.pgaWins],
        g.euroWins && ['Europe', g.euroWins],
        g.proWins && ['Pro total', g.proWins]
      ].filter(Boolean);
      if (wins.length) {
        body += `<div class="gf-section"><h3 class="gf-section-title">Career wins</h3><div class="gf-stat-grid">${wins.map(([k,v]) =>
          `<div class="gf-stat-box"><div class="gf-stat-value">${sportsEscape(v)}</div><div class="gf-stat-label">${sportsEscape(k)}</div></div>`).join('')}</div></div>`;
      }
    }
  }
  if (athlete.espn === undefined) {
    body += `<div class="gf-section"><div class="loading" style="padding:8px 0;">Loading season…</div></div>`;
  } else if (espnGolf && sportsSettings.sportsFieldGolfSeason) {
    const hl = espnGolf.headline || [];
    if (hl.length) {
      body += `<div class="gf-section"><h3 class="gf-section-title">${sportsEscape(espnGolf.title || 'This season')}</h3><div class="gf-stat-grid">${hl.slice(0, 6).map(s =>
        `<div class="gf-stat-box"><div class="gf-stat-value">${sportsEscape(s.value)}</div><div class="gf-stat-label">${sportsEscape(s.label)}</div></div>`).join('')}</div></div>`;
    }
    if (sportsSettings.sportsFieldGolfRankings && espnGolf.rankings && espnGolf.rankings.length) {
      body += `<div class="gf-section"><h3 class="gf-section-title">Rankings</h3>${espnGolf.rankings.slice(0, 6).map(r =>
        `<div class="gf-fact"><span>${sportsEscape(r.label)}</span><span>${sportsEscape(r.value)}${r.rank ? ' · ' + sportsEscape(r.rank) : ''}</span></div>`).join('')}</div>`;
    }
    if (sportsSettings.sportsFieldGolfRecent && espnGolf.recent && espnGolf.recent.length) {
      body += `<div class="gf-section"><h3 class="gf-section-title">Recent</h3>${espnGolf.recent.map(r =>
        `<div class="gf-fact"><span>${sportsEscape(r.name)}</span><span>${sportsEscape(r.result || r.date || '')}</span></div>`).join('')}</div>`;
    }
  }
  return body;
}

function sportsBuildCricketHtml(athlete) {
  const photo = sportsHeroPhotoHtml(athlete, 'ck-photo');
  const meta = [athlete.country, athlete.sport].filter(Boolean).join(' · ');
  const body = sportsCricketBodyHtml(athlete);
  return `
    <div class="ck-hero">
      <div class="ck-hero-grid">
        ${photo}
        <div>
          <h2 class="ck-name">${sportsEscape(athlete.name || '')}</h2>
          <div class="ck-meta">${sportsEscape(meta)}</div>
        </div>
      </div>
    </div>
    <div id="qc-sports-cricket-slot">${body}</div>
  `;
}

function sportsBuildCricketMiniHtml(athlete) {
  const c = athlete.cricketInfo;
  const photo = sportsHeroPhotoHtml(athlete, 'qc-mini-photo');
  const formats = sportsCricketFormats(athlete);
  let chips = '';
  if (c && formats.length && sportsSettings.sportsFieldCricketStats) {
    chips = formats.slice(0, 3).map(f =>
      `<span class="qc-mini-chip">${sportsEscape(f.label)} ${sportsEscape(f.batAvg || f.runs || '')}</span>`
    ).join('');
  } else if (c === undefined) {
    chips = `<span class="qc-mini-chip">…</span>`;
  }
  return `
    <div class="qc-mini-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      ${photo}
      <div class="qc-mini-main">
        <div class="qc-mini-name">${sportsEscape(athlete.name || '')}</div>
        <div class="qc-mini-sub">${sportsEscape([athlete.country, c && c.role].filter(Boolean).join(' · '))}</div>
        <div class="qc-mini-chip-row">${chips}</div>
      </div>
    </div>
  `;
}

function sportsBuildGolfHtml(athlete) {
  const photo = sportsHeroPhotoHtml(athlete, 'gf-photo');
  const meta = [athlete.country, athlete.sport].filter(Boolean).join(' · ');
  const body = sportsGolfBodyHtml(athlete);
  return `
    <div class="gf-hero">
      <div class="gf-hero-grid">
        ${photo}
        <div>
          <h2 class="gf-name">${sportsEscape(athlete.name || '')}</h2>
          <div class="gf-meta">${sportsEscape(meta)}</div>
        </div>
      </div>
    </div>
    <div id="qc-sports-golf-slot">${body}</div>
  `;
}

function sportsBuildGolfMiniHtml(athlete) {
  const g = athlete.golfWiki;
  const espnGolf = athlete.espn && athlete.espn.golf;
  const photo = sportsHeroPhotoHtml(athlete, 'qc-mini-photo');
  const chips = [];
  if (g && sportsSettings.sportsFieldGolfCareerWins) {
    if (g.majorWins) chips.push(`Majors ${g.majorWins}`);
    if (g.pgaWins) chips.push(`PGA ${g.pgaWins}`);
  }
  if (espnGolf && espnGolf.headline) {
    const wins = espnGolf.headline.find(h => /win/i.test(h.label));
    const avg = espnGolf.headline.find(h => /avg|scoring/i.test(h.label));
    if (wins) chips.push(`Season wins ${wins.value}`);
    if (avg) chips.push(`Avg ${avg.value}`);
  }
  return `
    <div class="qc-mini-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      ${photo}
      <div class="qc-mini-main">
        <div class="qc-mini-name">${sportsEscape(athlete.name || '')}</div>
        <div class="qc-mini-sub">${sportsEscape(athlete.country || 'Golf')}</div>
        <div class="qc-mini-chip-row">${chips.map(c => `<span class="qc-mini-chip">${sportsEscape(c)}</span>`).join('')}</div>
      </div>
    </div>
  `;
}

function sportsMmaBodyHtml(athlete) {
  const m = athlete.mmaInfo;
  if (m === undefined) {
    return `<div class="mma-section"><div class="loading" style="padding:8px 0;">Loading MMA record…</div></div>`;
  }
  if (!m) return '';
  let body = '';
  const facts = [];
  if (sportsSettings.sportsFieldMmaRecord && m.record) facts.push(['Record', m.record]);
  if (sportsSettings.sportsFieldCountry && athlete.country) facts.push(['Country', athlete.country]);
  if (athlete.birthDate) facts.push(['Born', athlete.birthDate]);
  if (sportsSettings.sportsFieldHeight) {
    if (athlete.height) facts.push(['Height', athlete.height]);
    if (athlete.weight) facts.push(['Weight', athlete.weight]);
  }
  if (sportsSettings.sportsFieldMmaWeightClass && m.weightClass) facts.push(['Weight class', m.weightClass]);
  if (sportsSettings.sportsFieldMmaStyle) {
    if (m.style) facts.push(['Style', m.style]);
    if (m.stance) facts.push(['Stance', m.stance]);
  }
  if (sportsSettings.sportsFieldMmaTeam) {
    if (m.team) facts.push(['Team', m.team]);
    if (m.fightingOutOf) facts.push(['Out of', m.fightingOutOf]);
  }
  if (m.yearsActive) facts.push(['Active', m.yearsActive]);
  if (m.reach) facts.push(['Reach', m.reach]);
  if (facts.length) {
    body += `<div class="mma-section"><h3 class="mma-section-title">Profile</h3>${facts.map(([k,v]) =>
      `<div class="mma-fact"><span>${sportsEscape(k)}</span><span>${sportsEscape(v)}</span></div>`).join('')}</div>`;
  }
  if (sportsSettings.sportsFieldMmaBreakdown) {
    const boxes = [
      ['KO/TKO', m.koWins],
      ['Submission', m.subWins],
      ['Decision', m.decWins]
    ].filter(([, v]) => v);
    if (boxes.length) {
      body += `<div class="mma-section"><h3 class="mma-section-title">Win breakdown</h3><div class="mma-stat-grid">${boxes.map(([k,v]) =>
        `<div class="mma-stat-box"><div class="mma-stat-value">${sportsEscape(String(v))}</div><div class="mma-stat-label">${sportsEscape(k)}</div></div>`).join('')}</div></div>`;
    }
  }
  return body;
}

function sportsBuildMmaHtml(athlete) {
  const m = athlete.mmaInfo;
  const photo = sportsHeroPhotoHtml(athlete, 'mma-photo');
  const meta = [athlete.country, athlete.sport].filter(Boolean).join(' · ');

  const recordText = (m && m.record) ? m.record : (m === undefined ? '…' : '');
  const body = sportsMmaBodyHtml(athlete);
  return `
    <div class="mma-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      <div class="mma-hero-grid">
        ${photo}
        <div>
          <h2 class="mma-name">${sportsEscape(athlete.name || '')}</h2>
          <div class="mma-meta">${sportsEscape(meta)}</div>
          <div class="mma-record" id="qc-sports-mma-record"${recordText ? '' : ' style="display:none;"'}>${sportsEscape(recordText)}</div>
        </div>
      </div>
    </div>
    <div id="qc-sports-mma-slot">${body}</div>
  `;
}

function sportsBuildMmaMiniHtml(athlete) {
  const m = athlete.mmaInfo;
  const photo = sportsHeroPhotoHtml(athlete, 'qc-mini-photo');
  const chips = [];
  if (m && m.record) chips.push(m.record);
  if (m && m.weightClass) chips.push(m.weightClass.split('(')[0].trim());
  return `
    <div class="qc-mini-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      ${photo}
      <div class="qc-mini-main">
        <div class="qc-mini-name">${sportsEscape(athlete.name || '')}</div>
        <div class="qc-mini-sub">${sportsEscape(athlete.country || 'MMA')}</div>
        <div class="qc-mini-chip-row">${chips.map(c => `<span class="qc-mini-chip">${sportsEscape(c)}</span>`).join('')}</div>
      </div>
    </div>
  `;
}

function sportsBoxingBodyHtml(athlete) {
  const b = athlete.boxingInfo;
  if (b === undefined) return `<div class="box-section"><div class="loading" style="padding:8px 0;">Loading boxing record…</div></div>`;
  if (!b) return '';
  let body = '';
  const facts = [];
  if (sportsSettings.sportsFieldBoxingRecord && b.record) facts.push(['Record', b.record]);
  if (sportsSettings.sportsFieldCountry && athlete.country) facts.push(['Country', athlete.country]);
  if (athlete.birthDate) facts.push(['Born', athlete.birthDate]);
  if (sportsSettings.sportsFieldHeight) {
    if (athlete.height) facts.push(['Height', athlete.height]);
    if (athlete.weight) facts.push(['Weight', athlete.weight]);
  }
  if (sportsSettings.sportsFieldBoxingDivision && b.weight) facts.push(['Division', b.weight]);
  if (sportsSettings.sportsFieldBoxingStance && b.stance) facts.push(['Stance', b.stance]);
  if (sportsSettings.sportsFieldBoxingReach && b.reach) facts.push(['Reach', b.reach]);
  if (facts.length) {
    body += `<div class="box-section"><h3 class="box-section-title">Profile</h3>${facts.map(([k,v]) =>
      `<div class="box-fact"><span>${sportsEscape(k)}</span><span>${sportsEscape(String(v))}</span></div>`).join('')}</div>`;
  }
  if (sportsSettings.sportsFieldBoxingBreakdown) {
    const boxes = [
      ['Wins', b.wins],
      ['KO', b.ko],
      ['Losses', b.losses]
    ].filter(([, v]) => v != null && v !== '');
    if (boxes.length) {
      body += `<div class="box-section"><h3 class="box-section-title">Record breakdown</h3><div class="box-stat-grid">${boxes.map(([k,v]) =>
        `<div class="box-stat-box"><div class="box-stat-value">${sportsEscape(String(v))}</div><div class="box-stat-label">${sportsEscape(k)}</div></div>`).join('')}</div></div>`;
    }
  }
  return body;
}
function sportsBuildBoxingHtml(athlete) {
  const b = athlete.boxingInfo;
  const photo = sportsHeroPhotoHtml(athlete, 'box-photo');
  const meta = [athlete.country, athlete.sport].filter(Boolean).join(' · ');
  const recordText = (sportsSettings.sportsFieldBoxingRecord && b && b.record) ? b.record : (b === undefined ? '…' : '');
  return `
    <div class="box-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      <div class="box-hero-grid">${photo}<div>
        <h2 class="box-name">${sportsEscape(athlete.name || '')}</h2>
        <div class="box-meta">${sportsEscape(meta)}</div>
        <div class="box-record" id="qc-sports-boxing-record"${recordText ? '' : ' style="display:none;"'}>${sportsEscape(recordText)}</div>
      </div></div>
    </div>
    <div id="qc-sports-boxing-slot">${sportsBoxingBodyHtml(athlete)}</div>`;
}
function sportsBuildBoxingMiniHtml(athlete) {
  const b = athlete.boxingInfo;
  const photo = sportsHeroPhotoHtml(athlete, 'qc-mini-photo');
  const chips = [];
  if (sportsSettings.sportsFieldBoxingRecord && b && b.record) chips.push(b.record);
  if (sportsSettings.sportsFieldBoxingBreakdown && b && b.ko) chips.push(b.ko + ' KO');
  return `<div class="qc-mini-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
    ${photo}<div class="qc-mini-main">
      <div class="qc-mini-name">${sportsEscape(athlete.name || '')}</div>
      <div class="qc-mini-sub">${sportsEscape(athlete.country || 'Boxing')}</div>
      <div class="qc-mini-chip-row">${chips.map(c => `<span class="qc-mini-chip">${sportsEscape(String(c))}</span>`).join('')}</div>
    </div></div>`;
}

function sportsKickboxingBodyHtml(athlete) {
  const k = athlete.kickboxingInfo;
  if (k === undefined) return `<div class="kb-section"><div class="loading" style="padding:8px 0;">Loading record…</div></div>`;
  if (!k) return '';
  let body = '';
  const facts = [];
  if (sportsSettings.sportsFieldKickboxingRecord && k.record) facts.push(['Record', k.record]);
  if (sportsSettings.sportsFieldCountry && athlete.country) facts.push(['Country', athlete.country]);
  if (athlete.birthDate) facts.push(['Born', athlete.birthDate]);
  if (sportsSettings.sportsFieldHeight) {
    if (athlete.height) facts.push(['Height', athlete.height]);
    if (athlete.weight) facts.push(['Weight', athlete.weight]);
  }
  if (sportsSettings.sportsFieldKickboxingWeightClass && k.weightClass) facts.push(['Weight class', k.weightClass]);
  if (sportsSettings.sportsFieldKickboxingStyle) {
    if (k.style) facts.push(['Style', k.style]);
    if (k.stance) facts.push(['Stance', k.stance]);
  }
  if (sportsSettings.sportsFieldKickboxingTeam && k.team) facts.push(['Team', k.team]);
  if (k.yearsActive) facts.push(['Active', k.yearsActive]);
  if (facts.length) {
    body += `<div class="kb-section"><h3 class="kb-section-title">Profile</h3>${facts.map(([a,b]) =>
      `<div class="kb-fact"><span>${sportsEscape(a)}</span><span>${sportsEscape(String(b))}</span></div>`).join('')}</div>`;
  }
  if (sportsSettings.sportsFieldKickboxingBreakdown) {
    const boxes = [['Wins', k.wins], ['KO', k.koWins], ['Losses', k.losses]].filter(([, v]) => v != null && v !== '');
    if (boxes.length) {
      body += `<div class="kb-section"><h3 class="kb-section-title">Record breakdown</h3><div class="kb-stat-grid">${boxes.map(([a,b]) =>
        `<div class="kb-stat-box"><div class="kb-stat-value">${sportsEscape(String(b))}</div><div class="kb-stat-label">${sportsEscape(a)}</div></div>`).join('')}</div></div>`;
    }
  }
  return body;
}
function sportsBuildKickboxingHtml(athlete) {
  const k = athlete.kickboxingInfo;
  const photo = sportsHeroPhotoHtml(athlete, 'kb-photo');
  const meta = [athlete.country, athlete.sport].filter(Boolean).join(' · ');
  const recordText = (sportsSettings.sportsFieldKickboxingRecord && k && k.record) ? k.record : (k === undefined ? '…' : '');
  return `
    <div class="kb-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
      <div class="kb-hero-grid">${photo}<div>
        <h2 class="kb-name">${sportsEscape(athlete.name || '')}</h2>
        <div class="kb-meta">${sportsEscape(meta)}</div>
        <div class="kb-record" id="qc-sports-kickboxing-record"${recordText ? '' : ' style="display:none;"'}>${sportsEscape(recordText)}</div>
      </div></div>
    </div>
    <div id="qc-sports-kickboxing-slot">${sportsKickboxingBodyHtml(athlete)}</div>`;
}
function sportsBuildKickboxingMiniHtml(athlete) {
  const k = athlete.kickboxingInfo;
  const photo = sportsHeroPhotoHtml(athlete, 'qc-mini-photo');
  const chips = [];
  if (sportsSettings.sportsFieldKickboxingRecord && k && k.record) chips.push(k.record);
  return `<div class="qc-mini-hero" data-sports-id="${sportsEscape(athlete.wikidataId || athlete.id || '')}">
    ${photo}<div class="qc-mini-main">
      <div class="qc-mini-name">${sportsEscape(athlete.name || '')}</div>
      <div class="qc-mini-sub">${sportsEscape(athlete.country || 'Kickboxing')}</div>
      <div class="qc-mini-chip-row">${chips.map(c => `<span class="qc-mini-chip">${sportsEscape(String(c))}</span>`).join('')}</div>
    </div></div>`;
}

function sportsBuildSportsHtml(athlete) {
  const sportType = detectSportType(athlete.sport, athlete.espn, athlete.description || athlete.occupation);
  const isFull = getPopupStyleClass() === 'qc-style-full';

  let sportSpecificHtml = '';
  let themeClass = '';

  if (sportType === 'team-sport') {
    sportSpecificHtml = isFull ? sportsBuildTeamSportHtml(athlete) : sportsBuildTeamSportMiniHtml(athlete);
    themeClass = 'sport-team';
  } else if (sportType === 'tennis') {
    sportSpecificHtml = isFull ? sportsBuildTennisHtml(athlete) : sportsBuildTennisMiniHtml(athlete);
    themeClass = 'sport-tennis';
  } else if (sportType === 'olympic-sport') {
    sportSpecificHtml = isFull ? sportsBuildOlympicSportHtml(athlete) : sportsBuildOlympicSportMiniHtml(athlete);
    themeClass = 'sport-olympic';
  } else if (sportType === 'cricket') {
    sportSpecificHtml = isFull ? sportsBuildCricketHtml(athlete) : sportsBuildCricketMiniHtml(athlete);
    themeClass = 'sport-cricket';
  } else if (sportType === 'golf') {
    sportSpecificHtml = isFull ? sportsBuildGolfHtml(athlete) : sportsBuildGolfMiniHtml(athlete);
    themeClass = 'sport-golf';
  } else if (sportType === 'mma') {
    sportSpecificHtml = isFull ? sportsBuildMmaHtml(athlete) : sportsBuildMmaMiniHtml(athlete);
    themeClass = 'sport-mma';
  } else if (sportType === 'boxing') {
    sportSpecificHtml = isFull ? sportsBuildBoxingHtml(athlete) : sportsBuildBoxingMiniHtml(athlete);
    themeClass = 'sport-boxing';
  } else if (sportType === 'kickboxing') {
    sportSpecificHtml = isFull ? sportsBuildKickboxingHtml(athlete) : sportsBuildKickboxingMiniHtml(athlete);
    themeClass = 'sport-kickboxing';
  } else {
    sportSpecificHtml = isFull ? sportsBuildGeneralHtml(athlete) : sportsBuildGeneralMiniHtml(athlete);
    themeClass = 'sport-general';
  }

  const footballLinkHtml = (athlete.isSoccer && athlete.transfermarktId)
    ? `<div style="padding:12px 20px 0 20px;"><span class="qc-nav-link qc-sports-football-link" data-nav-pack="football" data-nav-kind="player" data-nav-id="${sportsEscape(String(athlete.transfermarktId))}">View Football Player Profile →</span></div>`
    : '';

  const linksInner = sportsBuildExternalLinksHtml(athlete.links || [], athlete);
  const linksHtml = linksInner
    ? `<div style="padding:16px 20px;border-top:1px solid #e5e7eb;"><div class="qc-section" style="margin:0;"><p class="qc-section-label" style="margin:0 0 10px 0;">More on</p><div id="qc-sports-links-slot" class="qc-footer-strip">${linksInner}</div></div></div>`
    : '';

  return `${sportSpecificHtml}${footballLinkHtml}${linksHtml}`;
}

function fetchSportsSearch(query) {
  return new Promise(resolve => {
    try {
      api.runtime.sendMessage({ type: 'SPORTS_SEARCH', query }, res => resolve(res));
    } catch (e) {
      resolve({ ok: false, reason: 'network', error: String(e) });
    }
  });
}

function fetchSportsDetails(id) {
  return new Promise(resolve => {
    try {
      api.runtime.sendMessage({ type: 'SPORTS_GET_DETAILS', id }, res => resolve(res));
    } catch (e) {
      resolve({ ok: false, reason: 'network', error: String(e) });
    }
  });
}

const SPORTS_EXTRA_TIMEOUT_MS = 20000;
function fetchSportsDetailsExtra(id) {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok: false, timedOut: true, error: 'Timed out' });
    }, SPORTS_EXTRA_TIMEOUT_MS);
    try {
      api.runtime.sendMessage({ type: 'SPORTS_GET_DETAILS_EXTRA', id }).then((res) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(res || { ok: false });
      }).catch((e) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve({ ok: false, reason: 'network', error: String(e && e.message ? e.message : e) });
      });
    } catch (e) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok: false, reason: 'network', error: String(e) });
    }
  });
}

function sportsPatchExtraSlots(host, athlete) {
  if (!host || !host.isConnected || !athlete) return;

  const setSlot = (slotId, inner, sectionId) => {
    const slot = host.querySelector(`#${slotId}`);
    if (!slot || !inner) return;
    slot.innerHTML = inner;
    if (sectionId) {
      const section = host.querySelector(`#${sectionId}`);
      if (section) section.style.display = '';
    }
  };
  setSlot('qc-sports-prostats-slot', sportsTeamSlotInner('prostats', athlete), 'qc-sports-prostats-section');
  setSlot('qc-sports-recent-slot', sportsTeamSlotInner('recent', athlete), 'qc-sports-recent-section');
  setSlot('qc-sports-next-slot', sportsTeamSlotInner('next', athlete), 'qc-sports-next-section');
  setSlot('qc-sports-awards-slot', sportsTeamSlotInner('awards', athlete), 'qc-sports-awards-section');
  setSlot('qc-sports-tennis-stats-slot', sportsTennisStatsInner(athlete), 'qc-sports-tennis-stats-section');
  setSlot('qc-sports-tennis-slams-slot', sportsTennisSlamsInner(athlete), 'qc-sports-tennis-slams-section');
  setSlot('qc-sports-medals-slot', sportsMedalsInner(athlete), 'qc-sports-medals-section');
  setSlot('qc-sports-timeline-slot', sportsTimelineInner(athlete), 'qc-sports-timeline-section');
  setSlot('qc-sports-titles-slot', sportsTitlesInner(athlete), 'qc-sports-titles-section');
  setSlot('qc-sports-general-stats-slot', sportsGeneralStatsInner(athlete), 'qc-sports-general-stats-section');
  setSlot('qc-sports-f1-slot', sportsF1Inner(athlete), 'qc-sports-f1-section');

  const ckSlot = host.querySelector('#qc-sports-cricket-slot');
  if (ckSlot && athlete.cricketInfo !== undefined) {
    ckSlot.innerHTML = sportsCricketBodyHtml(athlete);
  }
  const gfSlot = host.querySelector('#qc-sports-golf-slot');
  if (gfSlot && (athlete.golfWiki !== undefined || athlete.espn !== undefined)) {
    gfSlot.innerHTML = sportsGolfBodyHtml(athlete);
  }
  const mmaSlot = host.querySelector('#qc-sports-mma-slot');
  if (mmaSlot && athlete.mmaInfo !== undefined) {
    mmaSlot.innerHTML = sportsMmaBodyHtml(athlete);
  }
  const mmaRec = host.querySelector('#qc-sports-mma-record');
  if (mmaRec && athlete.mmaInfo !== undefined) {
    if (athlete.mmaInfo && athlete.mmaInfo.record) {
      mmaRec.textContent = athlete.mmaInfo.record;
      mmaRec.style.display = '';
    } else {
      mmaRec.style.display = 'none';
    }
  }
  const boxSlot = host.querySelector('#qc-sports-boxing-slot');
  if (boxSlot && athlete.boxingInfo !== undefined) {
    boxSlot.innerHTML = sportsBoxingBodyHtml(athlete);
  }
  const boxRec = host.querySelector('#qc-sports-boxing-record');
  if (boxRec && athlete.boxingInfo !== undefined) {
    if (athlete.boxingInfo && athlete.boxingInfo.record) {
      boxRec.textContent = athlete.boxingInfo.record;
      boxRec.style.display = '';
    } else {
      boxRec.style.display = 'none';
    }
  }
  const kbSlot = host.querySelector('#qc-sports-kickboxing-slot');
  if (kbSlot && athlete.kickboxingInfo !== undefined) {
    kbSlot.innerHTML = sportsKickboxingBodyHtml(athlete);
  }
  const kbRec = host.querySelector('#qc-sports-kickboxing-record');
  if (kbRec && athlete.kickboxingInfo !== undefined) {
    if (athlete.kickboxingInfo && athlete.kickboxingInfo.record) {
      kbRec.textContent = athlete.kickboxingInfo.record;
      kbRec.style.display = '';
    } else {
      kbRec.style.display = 'none';
    }
  }

  const teamLineFull = host.querySelector('#qc-sports-team-line');
  if (teamLineFull && athlete.team) teamLineFull.textContent = athlete.team;
  const teamLineMini = host.querySelector('#qc-sports-mini-team-line');
  if (teamLineMini) {
    const jerseyNum = athlete.jersey || athlete.number || '';
    const parts = [jerseyNum ? `#${jerseyNum}` : '', athlete.team, athlete.position].filter(Boolean);
    if (parts.length) teamLineMini.textContent = parts.join(' · ');
  }

  const miniBody = host.querySelector('#qc-sports-mini-body');
  if (miniBody) {
    const sportType = detectSportType(athlete.sport, athlete.espn, athlete.description || athlete.occupation);
    const miniInner = sportType === 'team-sport' ? sportsTeamMiniBodyInner(athlete)
      : sportType === 'tennis' ? sportsTennisMiniBodyInner(athlete)
      : sportType === 'olympic-sport' ? sportsOlympicMiniBodyInner(athlete)
      : sportsGeneralMiniBodyInner(athlete);
    if (miniInner) {
      miniBody.innerHTML = miniInner;
      miniBody.style.display = '';
    }
  }

  if (athlete.sport) {
    host.querySelectorAll('.gen-sub, .oly-sport, .qc-mini-sub').forEach((el, i, arr) => {

      const txt = (el.textContent || '').trim();
      if (!txt) return;
      if (/auto\s*racing|formula|motogp|rally|motorcycle/i.test(txt) || txt === athlete.sport) {

      }
    });

    host.querySelectorAll('.gen-section span, .oly-section span').forEach((el) => {
      if ((el.textContent || '').trim().toLowerCase() === 'sport') {
        const val = el.parentElement && el.parentElement.querySelector('span:last-child');
        if (val && val !== el) val.textContent = athlete.sport;
      }
    });
  }

  const linksSlot = host.querySelector('#qc-sports-links-slot');
  if (linksSlot && athlete.links && athlete.links.length) {
    linksSlot.innerHTML = sportsBuildExternalLinksHtml(athlete.links, athlete);
  }
  bindPopupButtons(host);
}

function sportsThemeClassFor(athlete) {
  const sportType = detectSportType(athlete.sport, athlete.espn, athlete.description || athlete.occupation);
  return sportType === 'team-sport' ? 'sport-team' :
         sportType === 'tennis' ? 'sport-tennis' :
         sportType === 'olympic-sport' ? 'sport-olympic' :
         sportType === 'cricket' ? 'sport-cricket' :
         sportType === 'golf' ? 'sport-golf' :
         sportType === 'mma' ? 'sport-mma' :
         sportType === 'boxing' ? 'sport-boxing' :
         sportType === 'kickboxing' ? 'sport-kickboxing' : 'sport-general';
}

async function renderSportsCard(id, banner = '') {
  const token = navBeginRender();

  navSetRerenderFn(() => renderSportsCard(id, banner));
  const response = await fetchSportsDetails(id);

  if (!navIsTokenCurrent(token)) return;

  if (!response || !response.ok) {
    updateSelectionPopup(
      `${banner}<div class="loading">Couldn't load that athlete${response?.error ? ` (${sportsEscape(response.error)})` : ''}</div>`,
      false,
      SPORTS_THEME_CLASS
    );
    return;
  }

  const athlete = response.data;
  const themeClass = sportsThemeClassFor(athlete);

  const originalImage = athlete.image;
  updateSelectionPopup(`${banner}${sportsBuildSportsHtml(athlete)}`, false, `${SPORTS_THEME_CLASS} ${themeClass}`);
  if (originalImage) {
    resolveImageUrl(originalImage, (resolved) => {
      if (!navIsTokenCurrent(token)) return;
      athlete.image = resolved;
      const photoEl = selectionPopupEl && selectionPopupEl.isConnected
        ? selectionPopupEl.querySelector('img[data-sports-photo]') : null;
      if (photoEl) photoEl.src = resolved;
    });
  }

  sportsLoadExtraSlots(id, athlete, token).catch(() => {});
}

async function sportsLoadExtraSlots(id, athlete, token, host) {
  host = host || selectionPopupEl;
  const extraRes = await fetchSportsDetailsExtra(id);
  if (token !== undefined && !navIsTokenCurrent(token)) return;
  if (!host || !host.isConnected) return;
  if (!extraRes || !extraRes.ok || !extraRes.data) return;

  const extra = extraRes.data;
  athlete.proStats = extra.proStats;
  athlete.espnStats = extra.espnStats;
  athlete.espn = extra.espn;
  athlete.espnId = extra.espnId;
  if (extra.team) athlete.team = extra.team;
  athlete.medalRecord = extra.medalRecord;
  athlete.tennisInfo = extra.tennisInfo;
  athlete.motorsportInfo = extra.motorsportInfo;
  if (extra.sport) athlete.sport = extra.sport;
  athlete.cricketInfo = extra.cricketInfo;
  athlete.golfWiki = extra.golfWiki;
  athlete.mmaInfo = extra.mmaInfo;
  athlete.boxingInfo = extra.boxingInfo;
  athlete.kickboxingInfo = extra.kickboxingInfo;
  athlete.titlesText = extra.titlesText;
  athlete.titlesCount = extra.titlesCount;
  athlete.links = extra.links;
  athlete.siteLinks = extra.siteLinks;
  athlete._staged = false;
  sportsPatchExtraSlots(host, athlete);
}

registerCardRestoredHandler((themeClass) => {
  if (themeClass !== SPORTS_THEME_CLASS) return;
  const hero = selectionPopupEl?.querySelector('[data-sports-id]');
  if (!hero) return;
  const id = hero.getAttribute('data-sports-id');
  if (!id) return;
  const token = navBeginRender();

  fetchSportsDetails(id).then((response) => {
    if (!navIsTokenCurrent(token)) return;
    if (!response || !response.ok || !response.data) return;
    const athlete = response.data;
    resolveImageUrl(athlete.image, () => {});
    sportsLoadExtraSlots(id, athlete, token).catch(() => {});
  }).catch(() => {});
});

function describeSportsCandidate(candidate) {
  return {
    name: candidate.label,
    image: candidate.image,
    subParts: [candidate.sport, candidate.description].filter(Boolean)
  };
}

const SPORTS_NETWORK_RETRY_DELAYS_MS = [700, 1400];
let sportsSearchToken = null;

async function runSportsSearch(query, requestToken, attempt = 0, translationInfo = null) {
  const banner = buildTranslationBanner(translationInfo);
  const response = await fetchSportsSearch(query);

  if (sportsSearchToken !== requestToken) return;
  if (!selectionPopupEl) return;

  const isNetworkFailure = !!(response && response.ok === false && response.reason === 'network');

  if (isNetworkFailure && attempt < SPORTS_NETWORK_RETRY_DELAYS_MS.length) {
    updateSelectionPopup(`${banner}<div class="loading">Network error — retrying...</div>`, false);
    setTimeout(() => runSportsSearch(query, requestToken, attempt + 1, translationInfo), SPORTS_NETWORK_RETRY_DELAYS_MS[attempt]);
    return;
  }

  if (!response || !response.ok || !response.candidates?.length) {

    const retryButtonHtml = isNetworkFailure ? '<div><button class="qc-retry-btn">Retry</button></div>' : '';
    if (isNetworkFailure) {
      lastRetryFn = () => runSportsSearch(query, requestToken, 0, translationInfo);
    }
    updateSelectionPopup(
      `${banner}<div class="loading">${isNetworkFailure ? 'No response from ESPN/Wikidata (network error)' : 'No athletes found.'}</div>${retryButtonHtml}`,
      false
    );
    return;
  }

  if (response.candidates.length === 1) {
    await renderSportsCard(response.candidates[0].id, banner);
    return;
  }

  showDisambiguationPicker(response.candidates, describeSportsCandidate, (chosen) => {
    updateSelectionPopup(`${banner}<div class="loading">Loading...</div>`, false);
    renderSportsCard(chosen.id, banner);
  }, banner);
}

async function sportsLaunchSearch(query, left, top) {
  if (!query) return;

  setActivePack(SPORTS_PACK_ID);
  showSelectionPopupAt(SPORTS_THEME_CLASS, left, top, '<div class="loading">Searching...</div>', false);

  const requestToken = `${Date.now()}${Math.random()}`;
  sportsSearchToken = requestToken;

  const langCode = detectNonLatinLangCode(query);

  if (!langCode) {
    await runSportsSearch(query, requestToken, 0, null);
    return;
  }

  updateSelectionPopup('<div class="loading">Translating...</div>', false);

  translateSelectionText(query, langCode, (res) => {
    if (sportsSearchToken !== requestToken) return;
    if (!selectionPopupEl) return;

    if (!res || !res.ok || !res.translatedText) {

      if (res && res.networkError) {
        lastRetryFn = () => sportsLaunchSearch(query, left, top);
        updateSelectionPopup('<div class="loading">Network error while translating</div><div><button class="qc-retry-btn">Retry</button></div>', false);
      } else {
        updateSelectionPopup(buildTranslationFailureHtml(query), false);
      }
      return;
    }

    const { text: cleanedTranslation, stillHasNonLatin } = cleanTranslatedText(res.translatedText);

    if (!cleanedTranslation) {
      updateSelectionPopup(buildTranslationFailureHtml(query), false);
      return;
    }

    const isLowConfidence = (typeof res.match === 'number' && res.match < TRANSLATION_CONFIDENCE_THRESHOLD) || stillHasNonLatin;

    runSportsSearch(cleanedTranslation, requestToken, 0, {
      original: query,
      translated: cleanedTranslation,
      lowConfidence: isLowConfidence
    });
  });
}

function handleSportsExternalSearch(rawQuery, left, top) {
  const query = sanitizeSelectionText(rawQuery);
  if (!query) return;

  navClearHistory();
  sportsLaunchSearch(query, left, top);
}

function sportsNavigateById(kind, id) {
  if (!id) return;

  setActivePack(SPORTS_PACK_ID);
  updateSelectionPopup('<div class="loading">Loading...</div>', false, SPORTS_THEME_CLASS);
  renderSportsCard(id, '');
}

function sportsHandleTimelineMoreClick(btn) {
  if (!btn) return;
  const page = SPORTS_TIMELINE_PAGE_SIZE;
  let shown = parseInt(btn.getAttribute('data-shown'), 10) || page;
  const timeline = btn.closest('.oly-timeline');
  if (timeline) {
    const items = timeline.querySelectorAll('.oly-timeline-item');
    const next = Math.min(shown + page, items.length);
    items.forEach((el, i) => {
      if (i < next) el.style.display = '';
    });
    btn.setAttribute('data-shown', String(next));
    if (next >= items.length) btn.remove();
    return;
  }
  const row = btn.parentElement && btn.parentElement.querySelector('.qc-mini-chip-row');
  if (row) {
    const items = row.querySelectorAll('.qc-mini-chip');
    const next = Math.min(shown + page, items.length);
    items.forEach((el, i) => {
      if (i < next) el.style.display = '';
    });
    btn.setAttribute('data-shown', String(next));
    if (next >= items.length) btn.remove();
  }
}

async function initSportsPackCore() {
  await loadSportsSettings();
  injectSportsTheme();

  registerPack({
    id: SPORTS_PACK_ID,
    fullWidth: SPORTS_FULL_CARD_WIDTH,
    noDrag: true,
    launchSearch: sportsLaunchSearch,
    handleExternalSearch: handleSportsExternalSearch,
    navigateById: sportsNavigateById,
    isAllowedOnThisSite: isSportsAllowedOnThisSite
  });
}

async function initSportsPack() {
  await initSportsPackCore();
}

