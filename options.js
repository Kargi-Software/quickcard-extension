const api = typeof browser !== 'undefined' ? browser : chrome;

const OTHER_TOPICS = ['games', 'music', 'books', 'football', 'sports'];

const OTHER_TOPIC_DEFAULT_HOVER_BLACKLIST = {
  games: ['gamespot.com'],
  music: ['deezer.com'],
  books: ['openlibrary.org'],
  football: ['transfermarkt.com'],
  sports: []
};

const OTHER_TOPIC_DEFAULT_SETTINGS = {};
OTHER_TOPICS.forEach((t) => {
  OTHER_TOPIC_DEFAULT_SETTINGS[`${t}CustomLinks`] = [];
  OTHER_TOPIC_DEFAULT_SETTINGS[`${t}SiteFilterMode`] = 'blacklist';
  OTHER_TOPIC_DEFAULT_SETTINGS[`${t}WhitelistSites`] = [];
  OTHER_TOPIC_DEFAULT_SETTINGS[`${t}BlacklistSites`] = OTHER_TOPIC_DEFAULT_HOVER_BLACKLIST[t] || [];
});

const GAMES_REGION_SELECTS = [
  { id: 'gamesSteamRegion', table: typeof STEAM_REGIONS !== 'undefined' ? STEAM_REGIONS : {} },
  { id: 'gamesPlayStationRegion', table: typeof PSN_REGIONS !== 'undefined' ? PSN_REGIONS : {} },
  { id: 'gamesXboxRegion', table: typeof XBOX_REGIONS !== 'undefined' ? XBOX_REGIONS : {} }
];

function populateRegionSelects() {
  GAMES_REGION_SELECTS.forEach(({ id, table }) => {
    const select = document.getElementById(id);
    if (!select || select.options.length) return;

    Object.keys(table)
      .sort((a, b) => table[a].name.localeCompare(table[b].name))
      .forEach((code) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${table[code].name} (${code})`;
        select.appendChild(option);
      });
  });
}

const OTHER_TOPIC_FIELD_DEFAULTS = {
  games: {
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

    gamesShowYoutubeLink: true
  },
  music: {
    musicFieldArtistGenre: true,
    musicFieldArtistCountry: true,
    musicFieldArtistFormed: true,
    musicFieldArtistAlbums: true,
    musicFieldArtistTopTracks: true,
    musicFieldArtistSimilar: true,
    musicFieldMBArtistTags: true,
    musicFieldArtistBio: true,
    musicFieldArtistGrammy: true,
    musicFieldAlbumArtist: true,
    musicFieldAlbumGenre: true,
    musicFieldAlbumReleaseDate: true,
    musicFieldAlbumOriginalReleaseDate: true,
    musicFieldAlbumTrackCount: true,
    musicFieldAlbumTracks: true,
    musicFieldMBAlbumTags: true,
    musicFieldTADBAlbumSales: true,
    musicFieldTADBAlbumLabel: true,
    musicFieldTADBMood: true,
    musicFieldTADBTheme: true,
    musicFieldTADBFormat: true,
    musicFieldTADBTempo: true,
    musicFieldAlbumGrammy: true,
    musicFieldTrackArtist: true,
    musicFieldTrackAlbum: true,
    musicFieldTrackGenre: true,
    musicFieldTrackReleaseDate: true,
    musicFieldTrackOriginalReleaseDate: true,
    musicFieldTrackDuration: true,
    musicFieldTrackTempo: true,
    musicFieldTrackPreview: true,
    musicFieldTrackLyrics: true,
    musicFieldMBTrackTags: true,
    musicFieldTrackGrammy: true,
    musicShowDeezerLink: true,
    musicShowSpotifyLink: true,
    musicShowYoutubeLink: true,
    musicShowYoutubeMusicLink: true,
    musicShowMusicBrainzLink: true,
    musicShowLastFmLink: true,
    musicShowTheAudioDBLink: true,
    musicShowWikipediaLink: true,
    musicShowAppleMusicLink: true
  },
  books: {
    booksFieldDescription: true,
    booksFieldFirstSentence: true,
    booksFieldSubjects: true,
    booksFieldFirstEdition: true,
    booksFieldRatings: true,
    booksFieldCommunity: true,
    booksFieldSeries: true,
    booksFieldAdaptations: true,
    booksFieldAuthorBorn: true,
    booksFieldAuthorBirthplace: true,
    booksFieldAuthorOccupation: true,
    booksFieldAuthorBio: true,
    booksFieldAuthorWorks: true,
    booksFieldAuthorAdaptations: true,
    booksFieldAuthorAwards: true,
    booksShowOpenLibraryLink: true,
    booksShowWikipediaLink: true,
    booksShowGoodreadsLink: true,
    booksShowGoogleBooksLink: true,
    booksShowAmazonLink: true,
    booksShowBarnesNobleLink: true,
    booksShowKoboLink: true,
    booksShowAudibleLink: true,
    booksShowYoutubeLink: true
  },
  football: {
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

  footballShowTransfermarktLink: true,
  footballShowWikipediaLink: true,
  footballShowOfficialSiteLink: true,
  footballShowSoccerwayLink: true,
  footballShowWhoscoredLink: true,
  footballShowYoutubeLink: true,
  footballShowSofifaLink: true,
  footballShowFutbinLink: true,

  footballFieldHonours: true,
  footballFieldPlayerNextMatches: true,
  footballFieldPlayerPrevMatches: true,
  footballFieldNationalTeamCareer: true,

  footballFieldTeamMarketValue: true,
  footballFieldTeamTopPlayers: true,
  footballFieldTeamTopPlayersPhotos: true,
  footballFieldTeamHonours: true,
  footballFieldTeamNextMatches: true,
  footballFieldTeamPrevMatches: true,

  footballFieldCoachHonours: true,

  footballFieldCoachContract: true,
  footballFieldCoachLicence: true,
  footballFieldCoachFormation: true,
  footballFieldCoachAvgTerm: true,
  footballFieldCoachAgent: true,

  footballFieldFutRating: true
  },
  sports: {
    sportsFieldCountry: true,
    sportsFieldTeam: true,
    sportsFieldHeight: true,
    sportsFieldSport: true,
    sportsFieldOlympicMedals: true,
    sportsFieldWorldChampionships: true,
    sportsFieldContinentalChampionships: true,
    sportsFieldTitlesCount: true,
    sportsFieldProStats: true,
    sportsFieldEspnRecentGames: true,
    sportsFieldEspnNextGame: true,
    sportsFieldEspnAwards: true,
    sportsFieldCareerHighlights: true,
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
    sportsShowSpecialtyLink: true
  }
};
const OTHER_TOPIC_FIELD_DEFAULTS_FLAT = Object.assign({}, ...Object.values(OTHER_TOPIC_FIELD_DEFAULTS));

const DEFAULT_SETTINGS = {
  enabledTopics: { movies: true, games: true, music: true, books: true, football: true, sports: true },
  ...OTHER_TOPIC_DEFAULT_SETTINGS,
  ...OTHER_TOPIC_FIELD_DEFAULTS_FLAT,

  gamesSteamRegion: 'US',
  gamesPlayStationRegion: 'US',
  gamesXboxRegion: 'US',

  featureLinkHover: true,
  featureTextSearch: true,
  featureContextMenuSearch: true,
  googleSuggestEnabled: true,
  selectionSearchDelayMs: 1000,
  popupStyle: 'full',
  siteFilterMode: 'blacklist',
  whitelistSites: [],
  blacklistSites: ['imdb.com'],

  globalSiteFilterMode: 'blacklist',
  globalWhitelistSites: [],
  globalBlacklistSites: [],
  globalSiteRuleScope: 'both',

  kargiFieldImdb: true,
  kargiFieldVotes: true,
  kargiFieldRuntime: true,
  kargiFieldType: true,
  kargiFieldGenre: true,

  titleFieldDirector: true,
  kargiFieldWriter: true,
  kargiFieldActors: true,

  ratingFieldRottenTomatoes: true,
  ratingFieldMetacritic: true,
  ratingFieldCinemaScore: true,

  ratingFieldLetterboxd: true,
  ratingFieldTmdb: true,
  ratingFieldTrakt: true,

  movieFieldPlot: true,

  movieFieldCountry: true,

  showActorPhotos: true,
  actorPhotoCount: 5,

  showBoxOffice: true,

  personFieldAge: true,
  personFieldBorn: true,
  personFieldBirthPlace: true,
  personFieldOccupation: true,
  personFieldKnownFor: true,
  personFieldKnownForImages: true,
  personFieldBiography: true,
  personFieldAwards: true,

  tvmazeFieldEpisodes: true,
  tvmazeFieldStatus: true,
  tvmazeFieldNetwork: true,

  tvmazeFieldCreator: true,
  tvmazeFieldSummary: true,
  tvmazeFieldCountry: true,
  tvmazeShowLink: true,

  seasonTableEnabled: true,

  showRottenTomatoesLink: true,
  showTmdbLink: true,
  showNetflixLink: true,
  showPlexLink: true,
  showLetterboxdLink: true,
  showMetacriticLink: true,
  showDisneyPlusLink: true,
  showHboMaxLink: true,
  showPrimeVideoLink: true,
  showAppleTvLink: true,
  showMyAnimeListLink: true,
  malFieldScore: true,
  showAniListLink: true,
  showCrunchyrollLink: true,
  showPeacockLink: true,
  showHuluLink: true,
  showTraktLink: true,
  showYoutubeSearchLink: true,
  customLinks: [],
  showAwards: true,
  showTitleWikipediaLink: true,
  showWikipediaLink: true,
  showTwitterLink: true,
  showInstagramLink: true,
  showOfficialWebsiteLink: true,
  showLetterboxdActorLink: true,
  showBookSourceLink: true
};

function storageGet(defaults) {
  return new Promise((resolve) => {
    api.storage.local.get(defaults, (result) => resolve(result || {}));
  });
}

function storageSet(data) {
  return new Promise((resolve) => {
    api.storage.local.set(data, () => resolve(true));
  });
}

function parseSiteList(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim().toLowerCase())
    .filter(Boolean);
}

function createCustomLinkRow(link) {
  const row = document.createElement('div');
  row.className = 'custom-link-row';
  row.innerHTML = `
    <input type="text" class="cl-icon" placeholder="Icon URL (png/svg/ico, optional)">
    <input type="text" class="cl-label" placeholder="Label (e.g. Torrent Site)">
    <input type="text" class="cl-template" placeholder="https://test.com/search?s={title}">
    <button type="button" class="custom-link-remove-btn">Remove</button>
  `;

  row.querySelector('.cl-icon').value = (link && link.icon) || '';
  row.querySelector('.cl-label').value = (link && link.label) || '';
  row.querySelector('.cl-template').value = (link && link.urlTemplate) || '';

  row.querySelector('.custom-link-remove-btn').addEventListener('click', () => {
    row.remove();
  });

  return row;
}

function renderCustomLinks(links, containerId = 'customLinksContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  links.forEach((link) => container.appendChild(createCustomLinkRow(link)));
}

function collectCustomLinks(containerId = 'customLinksContainer') {
  const rows = document.querySelectorAll(`#${containerId} .custom-link-row`);
  const links = [];

  rows.forEach((row) => {
    const icon = row.querySelector('.cl-icon').value.trim();
    const label = row.querySelector('.cl-label').value.trim();
    const urlTemplate = row.querySelector('.cl-template').value.trim();

    if (!urlTemplate) return;

    links.push({ icon, label, urlTemplate });
  });

  return links;
}

function getTopicCheckboxes() {
  return Array.from(document.querySelectorAll('[data-topic-checkbox]'));
}

function syncTopicTabState() {
  getTopicCheckboxes().forEach((cb) => {
    const topic = cb.getAttribute('data-topic-checkbox');
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${topic}"]`);
    if (!tabBtn) return;
    tabBtn.disabled = !cb.checked;

    if (!cb.checked && tabBtn.classList.contains('active')) {
      document.querySelector('.tab-btn[data-tab="general"]').click();
    }
  });
}

function enforceAtLeastOneTopic(changedCheckbox) {
  const boxes = getTopicCheckboxes();
  const anyChecked = boxes.some((cb) => cb.checked);
  if (!anyChecked) {
    changedCheckbox.checked = true;
  }
}

function initTopics() {
  getTopicCheckboxes().forEach((cb) => {
    cb.addEventListener('change', () => {
      enforceAtLeastOneTopic(cb);
      syncTopicTabState();
    });
  });
}

function setChecked(id, value) {
  document.getElementById(id).checked = !!value;
}

function getChecked(id) {
  return document.getElementById(id).checked;
}

async function restoreOptions() {
  populateRegionSelects();

  const data = await storageGet(DEFAULT_SETTINGS);

  const enabledTopics = { movies: true, games: true, music: true, books: true, football: true, sports: true, ...(data.enabledTopics || {}) };
  getTopicCheckboxes().forEach((cb) => {
    const topic = cb.getAttribute('data-topic-checkbox');
    cb.checked = !!enabledTopics[topic];
  });
  syncTopicTabState();

  const globalMode = data.globalSiteFilterMode || 'blacklist';
  const globalModeEl = document.querySelector(`input[name="globalSiteFilterMode"][value="${globalMode}"]`);
  if (globalModeEl) globalModeEl.checked = true;

  const globalScope = ['hover', 'popup', 'both'].includes(data.globalSiteRuleScope) ? data.globalSiteRuleScope : 'both';
  const globalScopeEl = document.querySelector(`input[name="globalSiteRuleScope"][value="${globalScope}"]`);
  if (globalScopeEl) globalScopeEl.checked = true;

  document.getElementById('globalWhitelistSites').value =
    (Array.isArray(data.globalWhitelistSites) ? data.globalWhitelistSites : []).join('\n');
  document.getElementById('globalBlacklistSites').value =
    (Array.isArray(data.globalBlacklistSites) ? data.globalBlacklistSites : []).join('\n');

  OTHER_TOPICS.forEach((t) => {
    const mode = data[`${t}SiteFilterMode`] || 'blacklist';
    const modeEl = document.querySelector(`input[name="siteFilterMode-${t}"][value="${mode}"]`);
    if (modeEl) modeEl.checked = true;

    const whitelistEl = document.getElementById(`whitelistSites-${t}`);
    if (whitelistEl) whitelistEl.value = (Array.isArray(data[`${t}WhitelistSites`]) ? data[`${t}WhitelistSites`] : []).join('\n');

    const blacklistEl = document.getElementById(`blacklistSites-${t}`);
    if (blacklistEl) blacklistEl.value = (Array.isArray(data[`${t}BlacklistSites`]) ? data[`${t}BlacklistSites`] : []).join('\n');

    renderCustomLinks(Array.isArray(data[`${t}CustomLinks`]) ? data[`${t}CustomLinks`] : [], `customLinksContainer-${t}`);
  });

  OTHER_TOPICS.forEach((t) => {
    const fieldDefaults = OTHER_TOPIC_FIELD_DEFAULTS[t] || {};
    Object.keys(fieldDefaults).forEach((field) => {
      const el = document.getElementById(field);
      if (el) el.checked = data[field] !== false;
    });
  });

  GAMES_REGION_SELECTS.forEach(({ id }) => {
    const select = document.getElementById(id);
    if (select) select.value = data[id] || 'US';
  });

  setChecked('featureLinkHover', data.featureLinkHover);
  setChecked('featureTextSearch', data.featureTextSearch);
  setChecked('featureContextMenuSearch', data.featureContextMenuSearch);
  setChecked('googleSuggestEnabled', data.googleSuggestEnabled !== false);

  document.getElementById('selectionSearchDelayMs').value =
    Number.isFinite(data.selectionSearchDelayMs) ? data.selectionSearchDelayMs : 1000;

  setChecked('kargiFieldImdb', (data.kargiFieldImdb ?? data.omdbFieldImdb) !== false);
  setChecked('kargiFieldVotes', (data.kargiFieldVotes ?? data.omdbFieldVotes) !== false);
  setChecked('kargiFieldRuntime', (data.kargiFieldRuntime ?? data.omdbFieldRuntime) !== false);
  setChecked('movieFieldCountry', data.movieFieldCountry !== false);
  setChecked('kargiFieldType', (data.kargiFieldType ?? data.omdbFieldType) !== false);
  setChecked('kargiFieldGenre', (data.kargiFieldGenre ?? data.omdbFieldGenre) !== false);
  setChecked('titleFieldDirector', data.titleFieldDirector !== false);
  setChecked('kargiFieldWriter', (data.kargiFieldWriter ?? data.omdbFieldWriter) !== false);
  setChecked('kargiFieldActors', (data.kargiFieldActors ?? data.omdbFieldActors) !== false);
  setChecked('ratingFieldRottenTomatoes', data.ratingFieldRottenTomatoes !== false);
  setChecked('ratingFieldMetacritic', data.ratingFieldMetacritic !== false);
  setChecked('ratingFieldCinemaScore', data.ratingFieldCinemaScore !== false);
  setChecked('ratingFieldLetterboxd', data.ratingFieldLetterboxd !== false);
  setChecked('ratingFieldTmdb', data.ratingFieldTmdb !== false);
  setChecked('ratingFieldTrakt', data.ratingFieldTrakt !== false);
  setChecked('movieFieldPlot', (data.movieFieldPlot ?? data.omdbFieldPlot) !== false);
  setChecked('showActorPhotos', data.showActorPhotos !== false);
  document.getElementById('actorPhotoCount').value = Math.min(10, Math.max(3, parseInt(data.actorPhotoCount, 10) || 5));

  setChecked('showBoxOffice', (data.showBoxOffice !== undefined) ? (data.showBoxOffice !== false) : (data.omdbFieldBoxOffice !== false));

  setChecked('personFieldAge', data.personFieldAge !== false);
  setChecked('personFieldBorn', data.personFieldBorn !== false);
  setChecked('personFieldBirthPlace', data.personFieldBirthPlace !== false);
  setChecked('personFieldOccupation', data.personFieldOccupation !== false);
  setChecked('personFieldKnownFor', data.personFieldKnownFor !== false);
  setChecked('personFieldKnownForImages', data.personFieldKnownForImages !== false);
  setChecked('personFieldBiography', data.personFieldBiography !== false);
  setChecked('personFieldAwards', data.personFieldAwards !== false);

  setChecked('tvmazeFieldEpisodes', data.tvmazeFieldEpisodes !== false);
  setChecked('tvmazeFieldStatus', data.tvmazeFieldStatus !== false);
  setChecked('tvmazeFieldNetwork', data.tvmazeFieldNetwork !== false);
  setChecked('tvmazeFieldCreator', data.tvmazeFieldCreator !== false);
  setChecked('tvmazeFieldSummary', data.tvmazeFieldSummary !== false);
  setChecked('tvmazeFieldCountry', data.tvmazeFieldCountry !== false);
  setChecked('tvmazeShowLink', data.tvmazeShowLink !== false);

  setChecked('seasonTableEnabled', data.seasonTableEnabled !== false);

  setChecked('showRottenTomatoesLink', data.showRottenTomatoesLink !== false);
  setChecked('showTmdbLink', data.showTmdbLink !== false);
  setChecked('showNetflixLink', data.showNetflixLink !== false);
  setChecked('showPlexLink', data.showPlexLink !== false);
  setChecked('showLetterboxdLink', data.showLetterboxdLink !== false);
  setChecked('showMetacriticLink', data.showMetacriticLink !== false);
  setChecked('showDisneyPlusLink', data.showDisneyPlusLink !== false);
  setChecked('showHboMaxLink', data.showHboMaxLink !== false);
  setChecked('showPrimeVideoLink', data.showPrimeVideoLink !== false);
  setChecked('showAppleTvLink', data.showAppleTvLink !== false);
  setChecked('showMyAnimeListLink', data.showMyAnimeListLink !== false);
  setChecked('malFieldScore', data.malFieldScore !== false);
  setChecked('showAniListLink', data.showAniListLink !== false);
  setChecked('showCrunchyrollLink', data.showCrunchyrollLink !== false);
  setChecked('showPeacockLink', data.showPeacockLink !== false);
  setChecked('showHuluLink', data.showHuluLink !== false);
  setChecked('showTraktLink', data.showTraktLink !== false);
  setChecked('showYoutubeSearchLink', data.showYoutubeSearchLink !== false);
  setChecked('showBookSourceLink', data.showBookSourceLink !== false);
  setChecked('showTitleWikipediaLink', data.showTitleWikipediaLink !== false);
  setChecked('showAwards', data.showAwards !== false);
  setChecked('showWikipediaLink', data.showWikipediaLink !== false);
  setChecked('showTwitterLink', data.showTwitterLink !== false);
  setChecked('showInstagramLink', data.showInstagramLink !== false);
  setChecked('showOfficialWebsiteLink', data.showOfficialWebsiteLink !== false);
  setChecked('showLetterboxdActorLink', data.showLetterboxdActorLink !== false);

  const mode = data.siteFilterMode || 'blacklist';
  const modeEl = document.querySelector(`input[name="siteFilterMode"][value="${mode}"]`);
  if (modeEl) modeEl.checked = true;

  const popupStyle = data.popupStyle === 'mini' ? 'mini' : 'full';
  const popupStyleEl = document.querySelector(`input[name="popupStyle"][value="${popupStyle}"]`);
  if (popupStyleEl) popupStyleEl.checked = true;

  document.getElementById('whitelistSites').value =
    (Array.isArray(data.whitelistSites) ? data.whitelistSites : []).join('\n');

  document.getElementById('blacklistSites').value =
    (Array.isArray(data.blacklistSites) ? data.blacklistSites : ['imdb.com']).join('\n');

  renderCustomLinks(Array.isArray(data.customLinks) ? data.customLinks : []);
}

async function saveOptions() {
  const siteFilterMode = document.querySelector('input[name="siteFilterMode"]:checked').value;
  const popupStyle = document.querySelector('input[name="popupStyle"]:checked').value;

  const enabledTopics = {};
  getTopicCheckboxes().forEach((cb) => {
    enabledTopics[cb.getAttribute('data-topic-checkbox')] = cb.checked;
  });

  const perTopicSettings = {};
  OTHER_TOPICS.forEach((t) => {
    const modeEl = document.querySelector(`input[name="siteFilterMode-${t}"]:checked`);
    perTopicSettings[`${t}SiteFilterMode`] = modeEl ? modeEl.value : 'blacklist';

    const whitelistEl = document.getElementById(`whitelistSites-${t}`);
    perTopicSettings[`${t}WhitelistSites`] = whitelistEl ? parseSiteList(whitelistEl.value) : [];

    const blacklistEl = document.getElementById(`blacklistSites-${t}`);
    perTopicSettings[`${t}BlacklistSites`] = blacklistEl ? parseSiteList(blacklistEl.value) : [];

    perTopicSettings[`${t}CustomLinks`] = collectCustomLinks(`customLinksContainer-${t}`);
  });

  OTHER_TOPICS.forEach((t) => {
    const fieldDefaults = OTHER_TOPIC_FIELD_DEFAULTS[t] || {};
    Object.keys(fieldDefaults).forEach((field) => {
      const el = document.getElementById(field);
      if (el) perTopicSettings[field] = el.checked;
    });
  });

  GAMES_REGION_SELECTS.forEach(({ id }) => {
    const select = document.getElementById(id);
    if (select) perTopicSettings[id] = select.value || 'US';
  });

  const globalSiteFilterMode = document.querySelector('input[name="globalSiteFilterMode"]:checked').value;
  const globalSiteRuleScope = document.querySelector('input[name="globalSiteRuleScope"]:checked').value;

  await storageSet({
    enabledTopics,
    ...perTopicSettings,

    globalSiteFilterMode,
    globalWhitelistSites: parseSiteList(document.getElementById('globalWhitelistSites').value),
    globalBlacklistSites: parseSiteList(document.getElementById('globalBlacklistSites').value),
    globalSiteRuleScope,

    featureLinkHover: getChecked('featureLinkHover'),
    featureTextSearch: getChecked('featureTextSearch'),
    featureContextMenuSearch: getChecked('featureContextMenuSearch'),
    googleSuggestEnabled: getChecked('googleSuggestEnabled'),
    selectionSearchDelayMs: Math.max(0, parseInt(document.getElementById('selectionSearchDelayMs').value, 10) || 0),
    popupStyle,

    kargiFieldImdb: getChecked('kargiFieldImdb'),
    kargiFieldVotes: getChecked('kargiFieldVotes'),
    kargiFieldRuntime: getChecked('kargiFieldRuntime'),
    movieFieldCountry: getChecked('movieFieldCountry'),
    kargiFieldType: getChecked('kargiFieldType'),
    kargiFieldGenre: getChecked('kargiFieldGenre'),
    titleFieldDirector: getChecked('titleFieldDirector'),
    kargiFieldWriter: getChecked('kargiFieldWriter'),
    kargiFieldActors: getChecked('kargiFieldActors'),
    ratingFieldRottenTomatoes: getChecked('ratingFieldRottenTomatoes'),
    ratingFieldMetacritic: getChecked('ratingFieldMetacritic'),
    ratingFieldCinemaScore: getChecked('ratingFieldCinemaScore'),
    ratingFieldLetterboxd: getChecked('ratingFieldLetterboxd'),
    ratingFieldTmdb: getChecked('ratingFieldTmdb'),
    ratingFieldTrakt: getChecked('ratingFieldTrakt'),
    movieFieldPlot: getChecked('movieFieldPlot'),
    showActorPhotos: getChecked('showActorPhotos'),
    actorPhotoCount: Math.min(10, Math.max(3, parseInt(document.getElementById('actorPhotoCount').value, 10) || 5)),
    showBoxOffice: getChecked('showBoxOffice'),

    personFieldAge: getChecked('personFieldAge'),
    personFieldBorn: getChecked('personFieldBorn'),
    personFieldBirthPlace: getChecked('personFieldBirthPlace'),
    personFieldOccupation: getChecked('personFieldOccupation'),
    personFieldKnownFor: getChecked('personFieldKnownFor'),
    personFieldKnownForImages: getChecked('personFieldKnownForImages'),
    personFieldBiography: getChecked('personFieldBiography'),
    personFieldAwards: getChecked('personFieldAwards'),

    tvmazeFieldEpisodes: getChecked('tvmazeFieldEpisodes'),
    tvmazeFieldStatus: getChecked('tvmazeFieldStatus'),
    tvmazeFieldNetwork: getChecked('tvmazeFieldNetwork'),
    tvmazeFieldCreator: getChecked('tvmazeFieldCreator'),
    tvmazeFieldSummary: getChecked('tvmazeFieldSummary'),
    tvmazeFieldCountry: getChecked('tvmazeFieldCountry'),
    tvmazeShowLink: getChecked('tvmazeShowLink'),

    seasonTableEnabled: getChecked('seasonTableEnabled'),

    showRottenTomatoesLink: getChecked('showRottenTomatoesLink'),
    showTmdbLink: getChecked('showTmdbLink'),
    showNetflixLink: getChecked('showNetflixLink'),
    showPlexLink: getChecked('showPlexLink'),
    showLetterboxdLink: getChecked('showLetterboxdLink'),
    showMetacriticLink: getChecked('showMetacriticLink'),
    showDisneyPlusLink: getChecked('showDisneyPlusLink'),
    showHboMaxLink: getChecked('showHboMaxLink'),
    showPrimeVideoLink: getChecked('showPrimeVideoLink'),
    showAppleTvLink: getChecked('showAppleTvLink'),
    showMyAnimeListLink: getChecked('showMyAnimeListLink'),
    malFieldScore: getChecked('malFieldScore'),
    showAniListLink: getChecked('showAniListLink'),
    showCrunchyrollLink: getChecked('showCrunchyrollLink'),
    showPeacockLink: getChecked('showPeacockLink'),
    showHuluLink: getChecked('showHuluLink'),
    showTraktLink: getChecked('showTraktLink'),
    showYoutubeSearchLink: getChecked('showYoutubeSearchLink'),
    showBookSourceLink: getChecked('showBookSourceLink'),
    showTitleWikipediaLink: getChecked('showTitleWikipediaLink'),
    customLinks: collectCustomLinks(),
    showAwards: getChecked('showAwards'),
    showWikipediaLink: getChecked('showWikipediaLink'),
    showTwitterLink: getChecked('showTwitterLink'),
    showInstagramLink: getChecked('showInstagramLink'),
    showOfficialWebsiteLink: getChecked('showOfficialWebsiteLink'),
    showLetterboxdActorLink: getChecked('showLetterboxdActorLink'),

    siteFilterMode,
    whitelistSites: parseSiteList(document.getElementById('whitelistSites').value),
    blacklistSites: parseSiteList(document.getElementById('blacklistSites').value)
  });

  const status = document.getElementById('status');
  status.textContent = 'Saved';
  setTimeout(() => {
    status.textContent = '';
  }, 1500);
}

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.id === `tab-${tabId}`);
      });
    });
  });
}

const QC_SETTINGS_FORMAT = 'quickcard-settings';
const QC_SETTINGS_VERSION = 1;

function setImportExportStatus(msg, kind) {
  const el = document.getElementById('importExportStatus');
  if (!el) return;
  el.textContent = msg || '';
  el.classList.remove('ok', 'err');
  if (kind) el.classList.add(kind);
}

async function exportSettings() {
  try {
    setImportExportStatus('Exporting…');
    const all = await new Promise((resolve) => {
      api.storage.local.get(null, (result) => resolve(result || {}));
    });
    let extensionVersion = '';
    try {
      extensionVersion = (api.runtime.getManifest && api.runtime.getManifest().version) || '';
    } catch (_) {  }
    const payload = {
      format: QC_SETTINGS_FORMAT,
      version: QC_SETTINGS_VERSION,
      extensionVersion,
      exportedAt: new Date().toISOString(),
      settings: all
    };
    const text = JSON.stringify(payload, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const day = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `quickcard-settings-${day}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setImportExportStatus('Exported.', 'ok');
  } catch (e) {
    setImportExportStatus('Export failed: ' + (e && e.message ? e.message : e), 'err');
  }
}

function parseSettingsImport(text) {
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object') throw new Error('Invalid file');

  if (data.format === QC_SETTINGS_FORMAT && data.settings && typeof data.settings === 'object') {
    return data.settings;
  }

  if (data.settings && typeof data.settings === 'object' && data.format) {
    return data.settings;
  }

  if (!data.format) return data;
  throw new Error('Unrecognized settings file');
}

async function importSettingsFromText(text) {
  const settings = parseSettingsImport(text);
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    throw new Error('Settings object missing');
  }

  await new Promise((resolve, reject) => {
    try {
      api.storage.local.set(settings, () => {
        const err = api.runtime.lastError;
        if (err) reject(new Error(err.message || String(err)));
        else resolve(true);
      });
    } catch (e) {
      reject(e);
    }
  });
  await restoreOptions();
}

function initImportExport() {
  const exportBtn = document.getElementById('exportSettingsBtn');
  const importBtn = document.getElementById('importSettingsBtn');
  const fileInput = document.getElementById('importSettingsFile');
  if (!exportBtn || !importBtn || !fileInput) return;

  exportBtn.addEventListener('click', () => { exportSettings(); });

  importBtn.addEventListener('click', () => {
    setImportExportStatus('');
    fileInput.value = '';
    fileInput.click();
  });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    try {
      setImportExportStatus('Importing…');
      const text = await file.text();
      await importSettingsFromText(text);
      setImportExportStatus('Imported. Settings applied.', 'ok');
    } catch (e) {
      setImportExportStatus('Import failed: ' + (e && e.message ? e.message : e), 'err');
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.addEventListener('DOMContentLoaded', initImportExport);
document.addEventListener('DOMContentLoaded', initTabs);
document.addEventListener('DOMContentLoaded', initTopics);
document.getElementById('saveBtn').addEventListener('click', saveOptions);
document.getElementById('addCustomLinkBtn').addEventListener('click', () => {
  document.getElementById('customLinksContainer').appendChild(createCustomLinkRow(null));
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.custom-link-add-btn[data-topic]').forEach((btn) => {
    const topic = btn.getAttribute('data-topic');
    btn.addEventListener('click', () => {
      document.getElementById(`customLinksContainer-${topic}`).appendChild(createCustomLinkRow(null));
    });
  });
});

