

const MENU_PARENT_ID = 'quickcard-root';

const CONTEXT_MENU_TOPICS = [
  { id: 'movies', menuId: 'quickcard-search-selection', title: 'Search Movies/TV' },
  { id: 'games', menuId: 'quickcard-search-games', title: 'Search Games' },
  { id: 'music', menuId: 'quickcard-search-music', title: 'Search Music' },
  { id: 'books', menuId: 'quickcard-search-books', title: 'Search Books' },
  { id: 'football', menuId: 'quickcard-search-football', title: 'Search Football Players' },
  { id: 'sports', menuId: 'quickcard-search-sports', title: 'Search Athletes' }
];

async function rebuildContextMenu() {
  const settings = await getCoreSettings();
  const moviesSettings = await getMoviesSettings();

  try {
    await api.contextMenus.remove(MENU_PARENT_ID);
  } catch (e) {

  }

  if (!settings.featureContextMenuSearch) return;

  const enabledTopics = settings.enabledTopics || {};
  const items = CONTEXT_MENU_TOPICS.filter((t) => {
    if (!enabledTopics[t.id]) return false;

    if (t.id === 'movies') return !!moviesSettings.moviesPackEnabled;
    return true;
  });

  if (!items.length) return;

  api.contextMenus.create({
    id: MENU_PARENT_ID,
    title: 'QuickCard',
    contexts: ['selection']
  });

  items.forEach((t) => {
    api.contextMenus.create({
      id: t.menuId,
      parentId: MENU_PARENT_ID,
      title: t.title,
      contexts: ['selection']
    });
  });
}

api.runtime.onInstalled.addListener((details) => {
  rebuildContextMenu();

  if (details.reason === 'install') {
    api.tabs.create({ url: api.runtime.getURL('onboarding.html') }).catch(() => {});
  }
});
api.runtime.onStartup.addListener(rebuildContextMenu);

api.storage.onChanged.addListener(async (changes, area) => {
  if (area !== 'local') return;
  await rebuildContextMenu();
});

api.contextMenus.onClicked.addListener(async (info, tab) => {
  const clicked = CONTEXT_MENU_TOPICS.find((t) => t.menuId === info.menuItemId);
  if (!clicked) return;
  if (!tab || !tab.id) return;

  const query = String(info.selectionText || '').trim();
  if (!query) return;

  try {
    await api.tabs.sendMessage(tab.id, {
      type: 'QUICKCARD_CONTEXT_SEARCH',
      packId: clicked.id,
      query
    });
  } catch (e) {}
});

api.runtime.onMessage.addListener((message) => {
  if (!message || !message.type) return;

  log('onMessage received:', message.type, message.id || message.url || '');

  if (message.type === 'QUICKCARD_HTTP_GET') {
    const url = String(message.url || '');
    if (!url) return Promise.resolve({ ok: false, status: 0, text: '' });
    return httpGetText(url, message.headers || {});
  }

  if (message.type === 'QUICKCARD_FETCH_IMAGE') {
    const url = String(message.url || '');
    if (!url) return Promise.resolve({ ok: false, error: 'Missing URL' });
    return fetchImageAsDataUrl(url);
  }

 if (message.type === 'QUICKCARD_TRANSLATE_TEXT') {
  return translateQuery(message.text, { langHint: message.langCode });
}

  if (message.type === 'QUICKCARD_GOOGLE_SUGGEST') {
    return (async () => {
      const settings = await getCoreSettings();
      if (!settings.googleSuggestEnabled) return { ok: true, suggestions: [] };
      const query = String(message.query || '').trim();
      if (!query) return { ok: true, suggestions: [] };
      return fetchGoogleSuggestions(query);
    })();
  }

  if (message.type === 'QUICKCARD_OPEN_OPTIONS_PAGE') {
    return api.runtime.openOptionsPage();
  }

  if (message.type === 'QUICKCARD_RESOLVE_ABBREVIATION') {
    return resolveWikipediaAbbreviation(String(message.query || ''));
  }

if (message.type === 'GAMES_SEARCH') {
  return handleGamesSearch(message.query);
}

if (message.type === 'GAMES_GET_DETAILS') {
  return handleGamesGetDetails(message.id);
}

if (message.type === 'GAMES_GET_STORE_PRICES') {
  return handleGamesGetStorePrices(message.query, message.wantsPlayStation, message.wantsXbox, message.wantsSteam,message.ratingOnly);
}

if (message.type === 'FOOTBALL_SEARCH_PLAYERS') {
  return handleFootballSearch(message.query);
}

if (message.type === 'FOOTBALL_GET_PLAYER_DETAILS') {
  return getFootballPlayerInfo(message.id, message.profileUrl,message.isMini);
}

if (message.type === 'FOOTBALL_GET_COACH_DETAILS') {
  return getFootballCoachInfo(message.id);
}

if (message.type === 'FOOTBALL_GET_TEAM_CORE_DETAILS') {
  return getFootballTeamCoreInfo(message.id);
}

if (message.type === 'FOOTBALL_GET_TEAM_DETAILS') {
  return getFootballTeamInfo(message.id,message.isMini);
}

  if (message.type === 'SUBCAT') {
    if (message.action === 'lookup') {
      return SubscriptionCatalog.lookup(
        message.name,
        message.platforms ?? message.platform,
        message.opts
      )
        .then((data) => ({
          ok: true,
          data
        }))
        .catch((error) => ({
          ok: false,
          error: error?.message || String(error)
        }));
    }

    if (message.action === 'lookupMany') {
      return SubscriptionCatalog.lookupMany(
        message.items,
        message.opts
      )
        .then((data) => ({
          ok: true,
          data
        }))
        .catch((error) => ({
          ok: false,
          error: error?.message || String(error)
        }));
    }

    if (message.action === 'refresh') {
      return SubscriptionCatalog.refresh({
        force: true
      })
        .then((data) => ({
          ok: true,
          data
        }))
        .catch((error) => ({
          ok: false,
          error: error?.message || String(error)
        }));
    }

    if (message.action === 'meta') {
      return SubscriptionCatalog.getMeta()
        .then((data) => ({
          ok: true,
          data
        }))
        .catch((error) => ({
          ok: false,
          error: error?.message || String(error)
        }));
    }

    if (message.action === 'debug') {
      return SubscriptionCatalog.debugHeaders()
        .then((data) => ({
          ok: true,
          data
        }))
        .catch((error) => ({
          ok: false,
          error: error?.message || String(error)
        }));
    }

    return Promise.resolve({
      ok: false,
      error: `Unknown SUBCAT action: ${String(message.action || '')}`
    });
  }

  if (message.type === 'QUICKCARD_OPEN_LINK') {
    const url = String(message.url || '');
    if (!url) return Promise.resolve({ ok: false, error: 'Missing URL' });
    return api.tabs.create({ url, active: false })
      .then(() => ({ ok: true }))
      .catch((e) => ({ ok: false, error: String(e && e.message ? e.message : e) }));
  }

  if (message.type === 'MOVIES_GET_EXTRA_INFO') {
    return getMoviesExtraInfo(message.id, message.itemType);
  }

  if (message.type === 'MOVIES_GET_ACTOR_IMAGES') {
    const actors = message.actors || (message.actorIds || []).map((id) => ({ id, name: null }));
    return getActorImages(actors)
      .then((images) => ({ ok: true, images }))
      .catch((e) => ({ ok: false, error: String(e && e.message ? e.message : e) }));
  }

  if (message.type === 'MOVIES_GET_SITE_LINKS') {

    return getMoviesSiteLinks(message.id, message.itemType, !!message.isSeries, message.title, !!message.isAnime, message.wantKnownForExtras !== false);  }

  if (message.type === 'MOVIES_GET_BIOGRAPHY') {
    return getMoviesPersonBiography(String(message.wikipediaUrl || ''));
  }

  if (message.type === 'MOVIES_GET_FILMOGRAPHY_BATCH') {
    return handleMoviesGetFilmographyBatch(message.imdbIds || [], !!message.wantImages);
  }

  if (message.type === 'MOVIES_GET_BOOK_SOURCE') {
    return getMoviesBookSource(message.id);
  }

  if (message.type === 'MOVIES_GET_BOX_OFFICE') {
    return getMoviesBoxOfficeInfo(message.id, !!message.isMovie);
  }

if (message.type === 'BOOKS_SEARCH') return handleBooksSearch(message.query);
if (message.type === 'BOOKS_GET_DETAILS') return handleBooksGetDetails(message.id);
if (message.type === 'BOOKS_GET_DETAILS_EXTRA') return handleBooksGetDetailsExtra(message.workKey, message.rawSubjects, message.wantRatings);
if (message.type === 'BOOKS_GET_WIKIDATA_BUNDLE') return handleBooksGetWikidataBundle(message.id, message.title, message.wikidataId, message.authorName, message.wantSeries, message.wantAdaptations, message.wantLinks);
if (message.type === 'BOOKS_GET_AUTHOR') return handleBooksGetAuthor(message.id);
if (message.type === 'BOOKS_GET_AUTHOR_EXTRA') return handleBooksGetAuthorExtra(message.authorKey, message.id, message.name, message.wantKnownFor, message.wantAwards, message.wantWorks, message.wantFacts);

if (message.type === 'MUSIC_SEARCH') {
  return handleMusicSearch(message.query, message.limit);
}
if (message.type === 'MUSIC_GET_ARTIST_DETAILS') {
  return handleMusicGetArtistDetails(message.artistId);
}
if (message.type === 'MUSIC_GET_ALBUM_DETAILS') {
  return handleMusicGetAlbumDetails(message.collectionId);
}
if (message.type === 'MUSIC_GET_TRACK_DETAILS') {
  return handleMusicGetTrackDetails(message.trackId);
}

if (message.type === 'MUSIC_GET_TRACK_LYRICS') {
  return handleMusicGetTrackLyrics(message.artistName, message.trackName);
}

if (message.type === 'MUSIC_GET_MUSIC_ENRICHMENT') {
  return handleMusicGetEnrichment(message.entityType, message.payload);
}

if (message.type === 'MUSIC_GET_LIST_THUMBS') {
  return handleMusicGetListThumbs(message.rows || [])
    .then((res) => res)
    .catch((e) => ({ ok: false, error: String(e && e.message ? e.message : e) }));
}

if (message.type === 'SPORTS_SEARCH') {
  return handleSportsSearch(message.query);
}
if (message.type === 'SPORTS_GET_DETAILS') {
  return handleSportsGetDetails(message.id);
}
if (message.type === 'SPORTS_GET_DETAILS_EXTRA') {
  return handleSportsGetDetailsExtra(message.id);
}

if (message.type === 'MOVIES_GET_TVMAZE_INFO') {
    return getTvmazeInfo(message.id);
  }

  if (message.type === 'MOVIES_GET_SERIES_EPISODES') {
    return getKargiSeriesEpisodes(message.id);
  }

  if (message.type === 'MOVIES_GET_TOP_250') {
    return getMoviesTop250List();
  }

  if (message.type === 'MOVIES_GET_TOP_TV_SHOWS') {
    return getMoviesTopTvShowsList();
  }

  if (message.type === 'MOVIES_CHECK_TOP_LIST') {
    return getMoviesTopListMembership(message.id, !!message.isSeries);
  }
});
const SUBCAT_ALARM_NAME = 'subCatalog:monthly';
const SUBCAT_ALARMS = globalThis.browser?.alarms || chrome.alarms;

function millisecondsUntilNextMonth() {
  const now = new Date();

  const nextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
    3,
    0,
    0,
    0
  );

  return Math.max(60_000, nextMonth.getTime() - now.getTime());
}

function scheduleSubscriptionCatalogRefresh() {
  SUBCAT_ALARMS.create(SUBCAT_ALARM_NAME, {
    when: Date.now() + millisecondsUntilNextMonth(),
    periodInMinutes: 24 * 60
  });
}

api.runtime.onInstalled.addListener(() => {
  scheduleSubscriptionCatalogRefresh();

  SubscriptionCatalog.refresh({ force: true }).catch((error) => {

  });
});

api.runtime.onStartup.addListener(() => {
  scheduleSubscriptionCatalogRefresh();

  SubscriptionCatalog.ready().catch((error) => {

  });
});

SUBCAT_ALARMS.onAlarm.addListener((alarm) => {
  if (alarm.name !== SUBCAT_ALARM_NAME) return;

  SubscriptionCatalog.ready().catch((error) => {

  });
});

