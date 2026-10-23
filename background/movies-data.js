

const KARGI_BASE_URL = 'https://api.kargi.top';

const WHATSON_BASE_URL = 'https://whatson-api.onrender.com';
const CINEMETA_MOVIE_BASE_URL = 'https://v3-cinemeta.strem.io/meta/movie';

const MOVIES_DEFAULT_SETTINGS = {
moviesPackEnabled: true,

kargiFieldImdb: true,
kargiFieldVotes: true,
kargiFieldRuntime: true,
kargiFieldType: true,
kargiFieldGenre: true,

titleFieldDirector: true,

kargiFieldWriter: true,

tvmazeFieldCreator: true,
kargiFieldActors: true,

ratingFieldRottenTomatoes: true,
ratingFieldMetacritic: true,

ratingFieldLetterboxd: true,
ratingFieldTmdb: true,
ratingFieldTrakt: true,

ratingFieldCinemaScore: true,

movieFieldPlot: true,

movieFieldCountry: true,

showYoutubeSearchLink: true,

showBoxOffice: null,

showActorPhotos: true,
actorPhotoCount: 5,
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

tvmazeFieldSummary: true,
tvmazeFieldCountry: true,
tvmazeShowLink: true,
malFieldScore: true,
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
showAniListLink: true,
showCrunchyrollLink: true,
showPeacockLink: true,
showHuluLink: true,
showTraktLink: true,
showAwards: true,

showTitleWikipediaLink: true,
showWikipediaLink: true,
showTwitterLink: true,
showInstagramLink: true,
showOfficialWebsiteLink: true,
showLetterboxdActorLink: true,
showBookSourceLink: true
};

function moviesBoolSetting(s, key, legacyKey) {
  if (Object.prototype.hasOwnProperty.call(s, key)) return s[key] !== false;
  if (legacyKey && Object.prototype.hasOwnProperty.call(s, legacyKey)) return s[legacyKey] !== false;
  return true;
}

async function getMoviesSettings() {

const s = await api.storage.local.get([
  ...Object.keys(MOVIES_DEFAULT_SETTINGS),
  'omdbFieldImdb', 'omdbFieldVotes', 'omdbFieldRuntime', 'omdbFieldType',
  'omdbFieldGenre', 'omdbFieldActors', 'omdbFieldWriter', 'omdbFieldPlot',
  'omdbFieldBoxOffice'
]);
return {
moviesPackEnabled: s.moviesPackEnabled !== false,
kargiFieldImdb: moviesBoolSetting(s, 'kargiFieldImdb', 'omdbFieldImdb'),
kargiFieldType: moviesBoolSetting(s, 'kargiFieldType', 'omdbFieldType'),
kargiFieldGenre: moviesBoolSetting(s, 'kargiFieldGenre', 'omdbFieldGenre'),
titleFieldDirector: s.titleFieldDirector !== false,
tvmazeFieldCreator: s.tvmazeFieldCreator !== false,

kargiFieldWriter: moviesBoolSetting(s, 'kargiFieldWriter', 'omdbFieldWriter'),
kargiFieldActors: moviesBoolSetting(s, 'kargiFieldActors', 'omdbFieldActors'),
ratingFieldRottenTomatoes: s.ratingFieldRottenTomatoes !== false,
ratingFieldMetacritic: s.ratingFieldMetacritic !== false,
ratingFieldLetterboxd: s.ratingFieldLetterboxd !== false,
ratingFieldTmdb: s.ratingFieldTmdb !== false,
ratingFieldTrakt: s.ratingFieldTrakt !== false,
  ratingFieldCinemaScore: s.ratingFieldCinemaScore !== false,
movieFieldPlot: moviesBoolSetting(s, 'movieFieldPlot', 'omdbFieldPlot'),
movieFieldCountry: s.movieFieldCountry !== false,
showYoutubeSearchLink: s.showYoutubeSearchLink !== false,

showBoxOffice: (s.showBoxOffice === null || s.showBoxOffice === undefined)
  ? (s.omdbFieldBoxOffice !== false)
  : (s.showBoxOffice !== false),
showActorPhotos: s.showActorPhotos !== false,

actorPhotoCount: Math.min(10, Math.max(3, parseInt(s.actorPhotoCount, 10) || 5)),

kargiFieldRuntime: moviesBoolSetting(s, 'kargiFieldRuntime', 'omdbFieldRuntime'),
kargiFieldVotes: moviesBoolSetting(s, 'kargiFieldVotes', 'omdbFieldVotes'),
personFieldAge: s.personFieldAge !== false,
personFieldBorn: s.personFieldBorn !== false,
personFieldBirthPlace: s.personFieldBirthPlace !== false,
personFieldOccupation: s.personFieldOccupation !== false,
personFieldKnownFor: s.personFieldKnownFor !== false,
personFieldKnownForImages: s.personFieldKnownForImages !== false,
personFieldBiography: s.personFieldBiography !== false,
personFieldAwards: s.personFieldAwards !== false,
tvmazeFieldEpisodes: s.tvmazeFieldEpisodes !== false,
tvmazeFieldStatus: s.tvmazeFieldStatus !== false,
tvmazeFieldNetwork: s.tvmazeFieldNetwork !== false,
tvmazeFieldSummary: s.tvmazeFieldSummary !== false,
tvmazeFieldCountry: s.tvmazeFieldCountry !== false,
tvmazeShowLink: s.tvmazeShowLink !== false,
malFieldScore: s.malFieldScore !== false,
showRottenTomatoesLink: s.showRottenTomatoesLink !== false,
showTmdbLink: s.showTmdbLink !== false,
showNetflixLink: s.showNetflixLink !== false,
showPlexLink: s.showPlexLink !== false,
showLetterboxdLink: s.showLetterboxdLink !== false,
showMetacriticLink: s.showMetacriticLink !== false,
showDisneyPlusLink: s.showDisneyPlusLink !== false,
showHboMaxLink: s.showHboMaxLink !== false,
showPrimeVideoLink: s.showPrimeVideoLink !== false,
showAppleTvLink: s.showAppleTvLink !== false,
showMyAnimeListLink: s.showMyAnimeListLink !== false,
showAniListLink: s.showAniListLink !== false,
showCrunchyrollLink: s.showCrunchyrollLink !== false,
showPeacockLink: s.showPeacockLink !== false,
showHuluLink: s.showHuluLink !== false,
showTraktLink: s.showTraktLink !== false,
showAwards: s.showAwards !== false,
showTitleWikipediaLink: s.showTitleWikipediaLink !== false,
showWikipediaLink: s.showWikipediaLink !== false,
showTwitterLink: s.showTwitterLink !== false,
showInstagramLink: s.showInstagramLink !== false,
showOfficialWebsiteLink: s.showOfficialWebsiteLink !== false,
showLetterboxdActorLink: s.showLetterboxdActorLink !== false,
showBookSourceLink: s.showBookSourceLink !== false
};
}

async function getMoviesBookSource(imdbId) {
  const settings = await getMoviesSettings();
  if (!settings.showBookSourceLink) return { ok: true, disabled: true, data: null };
  try {
    const data = await getMovieBookSource(imdbId);
    return { ok: true, data };
  } catch (e) {
    logError('getMoviesBookSource: threw error for', imdbId, '->', e && e.message ? e.message : e);
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function getMalScore(malId, title) {

if (malId) {
try {
const json = await fetchJson(`https://api.tenrai.org/v1/anime/${encodeURIComponent(malId)}`, { Accept: 'application/json' }, 8000);
const score = json && json.data && typeof json.data.score === 'number' ? json.data.score : null;
if (score != null) {
log('getMalScore: direct via malId', malId, '->', score);
return { score, malId };
}
} catch (e) {
logError('getMalScore: direct fetch failed for malId', malId, '->', e && e.message ? e.message : e);

}
}

if (!title) return null;
try {
const json = await fetchJson(`https://api.tenrai.org/v1/anime?q=${encodeURIComponent(title)}&limit=3`, { Accept: 'application/json' }, 8000);
const results = json && json.data && Array.isArray(json.data) ? json.data : [];
if (!results.length) {
log('getMalScore: search returned no results for', title);
return null;
}

function normalizeAnimeTitle(t) {
  return (t || '')
    .toLowerCase()
    .trim()

    .replace(/[\s:;/•\-]+/g, ' ')

    .replace(/\s+/g, ' ')
    .trim();
}
const normalizedImdbTitle = normalizeAnimeTitle(title);
for (const result of results) {
const titleEnglish = normalizeAnimeTitle(result.title_english || '');
const titleJapanese = normalizeAnimeTitle(result.title || '');
const matches =
titleEnglish.includes(normalizedImdbTitle) ||
normalizedImdbTitle.includes(titleEnglish) ||
titleJapanese.includes(normalizedImdbTitle) ||
normalizedImdbTitle.includes(titleJapanese);
if (matches && typeof result.score === 'number') {
log('getMalScore: search match for', title, '->', result.score, '(matched:', result.title_english || result.title, 'mal_id:', result.mal_id, ')');
return { score: result.score, malId: result.mal_id ? String(result.mal_id) : null };
}
}

log('getMalScore: no title match found for', title, 'in top 3 results');
return null;
} catch (e) {
logError('getMalScore: search failed for', title, '->', e && e.message ? e.message : e);
return null;
}
}

async function getMoviesExtraInfo(id, itemType) {
  const settings = await getMoviesSettings();
  log('getMoviesExtraInfo:', id, itemType);

  if (itemType === 'title') {
    return getMergedTitleInfo(id, settings);
  }

  if (itemType === 'name') {
    return getWikidataPersonInfo(id, settings);
  }

  return { ok: false, type: itemType, error: 'Unsupported item type' };
}

async function getMoviesSiteLinks(id, itemType, isSeries, title, isAnime = false, wantKnownForExtras = true) {
    const settings = await getMoviesSettings();
if (itemType === 'title') {
const propertyMap = {};
if (settings.showRottenTomatoesLink) propertyMap.rottenTomatoesId = 'P1258';
if (settings.showTmdbLink || settings.showLetterboxdLink) propertyMap.tmdbId = isSeries ? 'P4983' : 'P4947';
if (settings.showNetflixLink) propertyMap.netflixId = 'P1874';
if (settings.showPlexLink) propertyMap.plexKey = 'P11460';
if (settings.showMetacriticLink) propertyMap.metacriticId = 'P1712';
if (settings.showDisneyPlusLink) propertyMap.disneyPlusId = isSeries ? 'P7596' : 'P7595';
if (settings.showHboMaxLink) propertyMap.hboMaxId = 'P8298';
if (settings.showPrimeVideoLink) propertyMap.primeVideoId = 'P8055';
if (settings.showAppleTvLink) propertyMap.appleTvId = isSeries ? 'P9751' : 'P9586';

if (settings.showMyAnimeListLink || settings.malFieldScore || isAnime) propertyMap.malId = 'P4086';
if (settings.showAniListLink || isAnime) propertyMap.aniListId = 'P8729';
if (settings.showCrunchyrollLink) propertyMap.crunchyrollId = 'P11330';
if (settings.showPeacockLink) propertyMap.peacockId = 'P11815';
if (settings.showHuluLink) propertyMap.huluId = isSeries ? 'P6467' : 'P6466';
if (settings.showTraktLink) propertyMap.traktId = 'P8013';

const wantTitleWikipedia = !!settings.showTitleWikipediaLink;
if (!Object.keys(propertyMap).length && !wantTitleWikipedia) {
   return { ok: true, type: 'title-links', disabled: true, data: null };
 }
 try {
   const links = await getWikidataLinks(id, propertyMap, wantTitleWikipedia);

  const malInfo = (settings.malFieldScore && isAnime) ? await getMalScore(links.malId, title) : null;
  const malScore = malInfo ? malInfo.score : null;
  const resolvedMalId = (malInfo && malInfo.malId) || links.malId || null;

  const malUrl = (isAnime && settings.showMyAnimeListLink)
    ? (resolvedMalId ? `https://myanimelist.net/anime/${resolvedMalId}` : `https://myanimelist.net/search/all?q=${encodeURIComponent(title)}&cat=all`)
    : null;
  const aniListUrl = (isAnime && settings.showAniListLink)
    ? (links.aniListId ? `https://anilist.co/anime/${links.aniListId}` : `https://anilist.co/search/anime?search=${encodeURIComponent(title)}`)
    : null;

      return {
     ok: true,
     type: 'title-links',
     isAnime: isAnime,
     data: {

       rottenTomatoesUrl: settings.showRottenTomatoesLink
         ? (links.rottenTomatoesId ? `https://www.rottentomatoes.com/${links.rottenTomatoesId}` : `https://www.rottentomatoes.com/search?search=${encodeURIComponent(title)}`)
         : null,
       tmdbUrl: (settings.showTmdbLink && links.tmdbId)
         ? `https://www.themoviedb.org/${isSeries ? 'tv' : 'movie'}/${links.tmdbId}`
         : (settings.showTmdbLink ? `https://www.themoviedb.org/search/${isSeries ? 'tv' : 'movie'}?query=${encodeURIComponent(title)}` : null),
       netflixUrl: links.netflixId ? `https://www.netflix.com/title/${links.netflixId}` : null,
       plexUrl: links.plexKey
         ? `https://app.plex.tv/desktop/#!/provider/tv.plex.provider.discover/details?key=%2Flibrary%2Fmetadata%2F${links.plexKey}`
         : null,
       letterboxdUrl: (settings.showLetterboxdLink && !isSeries && links.tmdbId)
         ? `https://letterboxd.com/tmdb/${links.tmdbId}/`
         : (settings.showLetterboxdLink && !isSeries ? `https://letterboxd.com/search/${encodeURIComponent(title)}/` : null),

       metacriticUrl: settings.showMetacriticLink
         ? (links.metacriticId ? `https://www.metacritic.com/${links.metacriticId}` : `https://www.metacritic.com/search/${encodeURIComponent(title)}/`)
         : null,
       disneyPlusUrl: links.disneyPlusId ? `https://www.disneyplus.com/${isSeries ? 'series' : 'movies'}/x/${links.disneyPlusId}` : null,
       hboMaxUrl: links.hboMaxId ? `https://play.max.com/${isSeries ? 'show' : 'movie'}/${links.hboMaxId}` : null,
       primeVideoUrl: links.primeVideoId ? `https://www.amazon.com/gp/video/detail/${links.primeVideoId}` : null,
       appleTvUrl: links.appleTvId
         ? `https://tv.apple.com/${isSeries ? 'show' : 'movie'}/${links.appleTvId}`
         : null,
       myAnimeListUrl: malUrl,
       aniListUrl: aniListUrl,
       crunchyrollUrl: links.crunchyrollId ? `https://www.crunchyroll.com/series/${links.crunchyrollId}` : null,

       peacockUrl: links.peacockId ? `https://www.peacocktv.com/stream-${links.peacockId}` : null,
       huluUrl: links.huluId
         ? `https://www.hulu.com/${isSeries ? 'series' : 'watch'}/${links.huluId}`
         : null,
       traktUrl: links.traktId ? `https://trakt.tv/${links.traktId}` : null,
       malScore: settings.malFieldScore ? malScore : null,
        malUrl: settings.malFieldScore ? malUrl : null,

       wikipediaUrl: wantTitleWikipedia
         ? (links.wikipediaArticle || `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}`)
         : null
     }
   };
 } catch (e) {

   logError('getMoviesSiteLinks: Wikidata failed for title', id, '->', e && e.message ? e.message : e);
   const searchFallbacks = {
     rottenTomatoesUrl: settings.showRottenTomatoesLink
       ? `https://www.rottentomatoes.com/search?search=${encodeURIComponent(title)}`
       : null,
     tmdbUrl: settings.showTmdbLink
       ? `https://www.themoviedb.org/search/${isSeries ? 'tv' : 'movie'}?query=${encodeURIComponent(title)}`
       : null,
     netflixUrl: null,
     plexUrl: null,
     letterboxdUrl: (settings.showLetterboxdLink && !isSeries)
       ? `https://letterboxd.com/search/${encodeURIComponent(title)}/`
       : null,
     metacriticUrl: settings.showMetacriticLink
       ? `https://www.metacritic.com/search/${encodeURIComponent(title)}/`
       : null,
     disneyPlusUrl: null,
     hboMaxUrl: null,
     primeVideoUrl: null,
     appleTvUrl: null,
     myAnimeListUrl: (isAnime && settings.showMyAnimeListLink)
       ? `https://myanimelist.net/search/all?q=${encodeURIComponent(title)}&cat=all`
       : null,
     aniListUrl: (isAnime && settings.showAniListLink)
       ? `https://anilist.co/search/anime?search=${encodeURIComponent(title)}`
       : null,
     crunchyrollUrl: null,
     peacockUrl: null,
     huluUrl: null,
     traktUrl: null,
     malScore: null,
     malUrl: null,
     wikipediaUrl: wantTitleWikipedia
       ? `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}`
       : null
   };
   return { ok: true, type: 'title-links', isAnime: isAnime, data: searchFallbacks };
 }
}
if (itemType === 'name') {
const wantAny = settings.showWikipediaLink || settings.showTwitterLink || settings.showInstagramLink
|| settings.showOfficialWebsiteLink || settings.showLetterboxdActorLink
|| settings.personFieldAwards || settings.personFieldKnownFor || settings.personFieldBiography;
if (!wantAny) {
   return { ok: true, type: 'name-links', disabled: true, data: null };
 }

 let awardsBreakdown = null;
 let filmography = [];
 const kargiTasks = [];
 if (settings.personFieldAwards) {
   kargiTasks.push(
     getPersonAwards(id)
       .then((awards) => { awardsBreakdown = awards; })
       .catch((e) => {
         logError('getMoviesSiteLinks: awards failed for', id, '->', e && e.message ? e.message : e);
         awardsBreakdown = null;
       })
   );
 }
 if (settings.personFieldKnownFor) {
   kargiTasks.push(
     getMoviesPersonFilmography(id)
       .then((list) => { filmography = list; })
       .catch((e) => {
         logError('getMoviesSiteLinks: filmography failed for', id, '->', e && e.message ? e.message : e);
         filmography = [];
       })
   );
 }
 const wikidataPromise = getWikidataPersonBundle(id)
   .catch((e) => {
     logError('getMoviesSiteLinks: Wikidata person bundle failed for', id, '->', e && e.message ? e.message : e);
     return null;
   });
 await Promise.all(kargiTasks);

 let personBundle = null;
 try {
   personBundle = await Promise.race([
     wikidataPromise,
     new Promise((resolve) => setTimeout(() => resolve(null), 2000))
   ]);
 } catch (e) {
   personBundle = null;
 }

 const wikipediaUrlForBio = settings.personFieldBiography
   ? ((personBundle && personBundle.wikipediaUrl) || null)
   : null;
 return {
   ok: true,
   type: 'name-links',
   data: {
     wikipediaUrl: settings.showWikipediaLink
       ? ((personBundle && personBundle.wikipediaUrl) || `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}`)
       : null,
     twitterUrl: (settings.showTwitterLink && personBundle && personBundle.twitterHandle)
       ? `https://twitter.com/${personBundle.twitterHandle}`
       : null,
     instagramUrl: (settings.showInstagramLink && personBundle && personBundle.instagramHandle)
       ? `https://www.instagram.com/${personBundle.instagramHandle}/`
       : null,
     officialWebsite: (settings.showOfficialWebsiteLink && personBundle && personBundle.officialWebsite) || null,
     letterboxdUrl: settings.showLetterboxdActorLink
       ? ((personBundle && personBundle.letterboxdActorId)
         ? `https://letterboxd.com/actor/${personBundle.letterboxdActorId}/`
         : `https://letterboxd.com/search/actors/${encodeURIComponent(title)}/`)
       : null,
     awardsUrl: settings.personFieldAwards ? `https://www.imdb.com/name/${id}/awards/` : null,
     awardsBreakdown,
     filmography,
     biography: null,
     biographyPending: !!wikipediaUrlForBio,
     wikipediaUrlForBio
   }
 };
}
return { ok: false, type: itemType, error: 'Unsupported item type' };
}

async function getMoviesPersonBiography(wikipediaUrl) {
  if (!wikipediaUrl) return { ok: true, type: 'biography', data: null };
  try {
    const biography = await getWikipediaSummary(wikipediaUrl);
    return { ok: true, type: 'biography', data: biography };
  } catch (e) {
    logError('getMoviesPersonBiography: threw error for', wikipediaUrl, '->', e && e.message ? e.message : e);
    return { ok: false, type: 'biography', error: String(e && e.message ? e.message : e) };
  }
}

function mapKargiType(type) {
  const t = String(type || '').trim();
  if (!t) return null;
  const known = {
    movie: 'Movie',
    tvMovie: 'TV Movie',
    tvSeries: 'TV Series',
    tvMiniSeries: 'TV Mini-Series',
    tvEpisode: 'Episode',
    tvSpecial: 'TV Special',
    tvShort: 'TV Short',
    video: 'Video',
    videoGame: 'Game',
    short: 'Short'
  };
  if (known[t]) return known[t];

  return t.charAt(0).toUpperCase() + t.slice(1).replace(/([A-Z])/g, ' $1').trim();
}

function kargiPersonList(list, limit) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const p of list) {
    if (!p || typeof p.name !== 'string' || !p.name.trim()) continue;
    const key = p.id || p.name;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleanValue(p.name));
    if (out.length >= limit) break;
  }
  return out;
}

function kargiPersonListWithIds(list, limit) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const p of list) {
    if (!p || typeof p.name !== 'string' || !p.name.trim()) continue;
    const pid = (typeof p.id === 'string' && /^nm\d+$/.test(p.id)) ? p.id : null;
    const key = pid || p.name;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ id: pid, name: cleanValue(p.name) });
    if (out.length >= limit) break;
  }
  return out;
}

function kargiCastList(list, limit) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const c of list) {
    if (!c || typeof c.name !== 'string' || !c.name.trim()) continue;
    const cid = (typeof c.id === 'string' && /^nm\d+$/.test(c.id)) ? c.id : null;
    const key = cid || c.name;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ id: cid, name: cleanValue(c.name), characters: cleanValue(c.characters) });
    if (out.length >= limit) break;
  }
  return out;
}

async function getWhatsonRatings(imdbId, settings) {
  if (!settings.ratingFieldRottenTomatoes && !settings.ratingFieldMetacritic
    && !settings.ratingFieldLetterboxd && !settings.ratingFieldTmdb && !settings.ratingFieldTrakt) {
    return { ok: true, disabled: true, data: null };
  }
  try {
    const url = `${WHATSON_BASE_URL}/?imdbId=${encodeURIComponent(imdbId)}`;
    const data = await fetchJson(url, { Accept: 'application/json' }, 10000);
    log('getWhatsonRatings: data for', imdbId, '->', data);

    if (!data) {
      return { ok: false, error: 'whatson-api request failed' };
    }

    const entry = (Array.isArray(data.results) && data.results.length) ? data.results[0] : null;
    if (!entry) {
      return { ok: true, noData: true, data: null };
    }

    const rt = entry.rotten_tomatoes || null;
    const mc = entry.metacritic || null;
    const lb = entry.letterboxd || null;
    const tmdb = entry.tmdb || null;
    const trakt = entry.trakt || null;

    const rottenTomatoes = (settings.ratingFieldRottenTomatoes && rt)
      ? {
          usersRating: typeof rt.users_rating === 'number' ? rt.users_rating : null,
          usersRatingCount: typeof rt.users_rating_count === 'number' ? rt.users_rating_count : null,
          criticsRating: typeof rt.critics_rating === 'number' ? rt.critics_rating : null,
          criticsRatingCount: typeof rt.critics_rating_count === 'number' ? rt.critics_rating_count : null
        }
      : null;

    const metacritic = (settings.ratingFieldMetacritic && mc)
      ? {
          usersRating: typeof mc.users_rating === 'number' ? mc.users_rating : null,
          usersRatingCount: typeof mc.users_rating_count === 'number' ? mc.users_rating_count : null,
          criticsRating: typeof mc.critics_rating === 'number' ? mc.critics_rating : null,
          criticsRatingCount: typeof mc.critics_rating_count === 'number' ? mc.critics_rating_count : null
        }
      : null;

    const letterboxd = (settings.ratingFieldLetterboxd && lb && typeof lb.users_rating === 'number')
      ? { usersRating: lb.users_rating, usersRatingCount: typeof lb.users_rating_count === 'number' ? lb.users_rating_count : null }
      : null;

    const tmdbRating = (settings.ratingFieldTmdb && tmdb && typeof tmdb.users_rating === 'number')
      ? { usersRating: tmdb.users_rating, usersRatingCount: typeof tmdb.users_rating_count === 'number' ? tmdb.users_rating_count : null }
      : null;

    const trakt2 = (settings.ratingFieldTrakt && trakt && typeof trakt.users_rating === 'number')
      ? { usersRating: trakt.users_rating, usersRatingCount: typeof trakt.users_rating_count === 'number' ? trakt.users_rating_count : null }
      : null;

    if (!rottenTomatoes && !metacritic && !letterboxd && !tmdbRating && !trakt2) {
      return { ok: true, noData: true, data: null };
    }

    return { ok: true, data: { rottenTomatoes, metacritic, letterboxd, tmdb: tmdbRating, trakt: trakt2 } };
  } catch (e) {
    logError('getWhatsonRatings: threw error for', imdbId, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, timedOut: true };

    if (e && /^HTTP 404\b/.test(e.message || '')) return { ok: true, noData: true, data: null };
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function getCinemetaMovieInfo(imdbId, settings) {

  const wantCountryForAnime = settings.malFieldScore || settings.showMyAnimeListLink || settings.showAniListLink;
  if (!settings.movieFieldCountry && !settings.movieFieldPlot && !settings.showYoutubeSearchLink && !wantCountryForAnime) {
    return { ok: true, disabled: true, data: null };
  }
  try {
    const url = `${CINEMETA_MOVIE_BASE_URL}/${encodeURIComponent(imdbId)}.json`;
    const data = await fetchJson(url, { Accept: 'application/json' }, 10000);
    log('getCinemetaMovieInfo: data for', imdbId, '->', data);

    const meta = data && data.meta ? data.meta : null;
    if (!meta) {
      return { ok: true, noData: true, data: null };
    }

    const trailers = Array.isArray(meta.trailers) ? meta.trailers : [];
    const firstTrailer = trailers.length ? trailers[0] : null;
    const trailerYoutubeId = (settings.showYoutubeSearchLink && firstTrailer && typeof firstTrailer.source === 'string' && firstTrailer.source.trim())
      ? firstTrailer.source.trim()
      : null;

    return {
      ok: true,
      data: {
        country: settings.movieFieldCountry ? cleanValue(meta.country) : null,

        countryRaw: cleanValue(meta.country),
        plot: settings.movieFieldPlot ? cleanValue(meta.description) : null,
        trailerYoutubeId
      }
    };
  } catch (e) {
    logError('getCinemetaMovieInfo: threw error for', imdbId, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, timedOut: true };
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

function moviesCinemaScoreQueryTitle(title) {

  let t = String(title || '').trim();
  t = t.replace(/\s*\(\d{4}\)\s*$/, '').trim();

  const m = t.match(/^(The|A|An)\s+(.+)$/i);
  if (m) t = m[2].trim() + ', ' + m[1];

  t = t.replace(/\s+/g, ' ').trim().toUpperCase();
  return t;
}

function moviesCinemaScorePickGrade(results, year) {
  if (!Array.isArray(results) || !results.length) return null;
  const usable = results.filter(r => r && r.GRADE && r.TITLE && !/^no results$/i.test(r.TITLE));
  if (!usable.length) return null;
  const y = year ? String(year).slice(0, 4) : '';
  if (y) {
    const hit = usable.find(r => String(r.YEAR || '') === y);
    if (hit) return { grade: hit.GRADE, title: hit.TITLE, year: hit.YEAR };
  }

  return { grade: usable[0].GRADE, title: usable[0].TITLE, year: usable[0].YEAR || null };
}

async function getCinemaScore(title, year, settings) {
  if (!settings || !settings.ratingFieldCinemaScore) return { ok: false, skipped: true };
  if (!title) return { ok: false, error: 'no title' };
  try {
    const q = moviesCinemaScoreQueryTitle(title);
    if (!q) return { ok: false, error: 'empty query' };

    const encoded = (typeof btoa === 'function')
      ? btoa(q)
      : Buffer.from(q, 'ascii').toString('base64');
    const url = 'https://webapp.cinemascore.com/guest/search/title/' + encoded;
    const data = await fetchJson(url, {
      'Accept': 'application/json',
      'Origin': 'https://www.cinemascore.com',
      'Referer': 'https://www.cinemascore.com/'
    }, 10000);
    const picked = moviesCinemaScorePickGrade(data, year);
    if (!picked) return { ok: false, noData: true };
    return { ok: true, data: picked };
  } catch (e) {
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function getMergedTitleInfo(id, settings) {
  const kargiRes = await getKargiTitleInfo(id, settings);
  if (!kargiRes.ok) return kargiRes;
  if (kargiRes.disabled || kargiRes.noData || !kargiRes.data) return kargiRes;

  const merged = { ...kargiRes.data };
  const isMovie = merged.titleType === 'movie';
  const isEpisode = merged.titleType === 'tvEpisode';
  const isSeriesContainer = merged.titleType === 'tvSeries' || merged.titleType === 'tvMiniSeries';

  merged.rottenTomatoes = null;
  merged.metacritic = null;
  merged.letterboxd = null;
  merged.tmdbRating = null;
  merged.trakt = null;
  merged.ratingsStatusRaw = null;
  merged.country = null;
  merged.plot = null;
  merged.trailerYoutubeId = null;
  merged.releasedDate = null;
  merged.countryPlotStatusRaw = null;
  merged.seriesName = null;

  merged.cinemaScore = null;
  if (isMovie) {
    const yearForCs = merged.titleYear ? String(merged.titleYear).slice(0, 4) : '';
    const [ratingsRes, cinemetaRes, cinemaScoreRes] = await Promise.all([
      getWhatsonRatings(id, settings),
      getCinemetaMovieInfo(id, settings),
      getCinemaScore(merged.title || merged.name, yearForCs, settings)
    ]);
    merged.ratingsStatusRaw = ratingsRes;
    if (ratingsRes.ok && ratingsRes.data) {
      merged.rottenTomatoes = ratingsRes.data.rottenTomatoes;
      merged.metacritic = ratingsRes.data.metacritic;
      merged.letterboxd = ratingsRes.data.letterboxd;
      merged.tmdbRating = ratingsRes.data.tmdb;
      merged.trakt = ratingsRes.data.trakt;
    }
    merged.countryPlotStatusRaw = cinemetaRes;
    if (cinemetaRes.ok && cinemetaRes.data) {
      merged.country = cinemetaRes.data.country;

      merged.countryRaw = cinemetaRes.data.countryRaw || null;
      merged.plot = cinemetaRes.data.plot;
      merged.trailerYoutubeId = cinemetaRes.data.trailerYoutubeId;
    }
    if (cinemaScoreRes && cinemaScoreRes.ok && cinemaScoreRes.data) {
      merged.cinemaScore = cinemaScoreRes.data.grade;
    }
  } else if (isSeriesContainer) {
    const ratingsRes = await getWhatsonRatings(id, settings);
    merged.ratingsStatusRaw = ratingsRes;
    if (ratingsRes.ok && ratingsRes.data) {
      merged.rottenTomatoes = ratingsRes.data.rottenTomatoes;
      merged.metacritic = ratingsRes.data.metacritic;
      merged.letterboxd = ratingsRes.data.letterboxd;
      merged.tmdbRating = ratingsRes.data.tmdb;
      merged.trakt = ratingsRes.data.trakt;
    }

  } else if (isEpisode) {
    if (merged.parentId && merged.seasonNumber && merged.episodeNumber) {
      const epRes = await getTvmazeEpisodeInfo(merged.parentId, merged.seasonNumber, merged.episodeNumber);
      const epData = (epRes && epRes.ok) ? epRes.data : null;
      merged.releasedDate = epData ? epData.airdate : null;
      merged.plot = (settings.tvmazeFieldSummary && epData) ? epData.summary : null;

      merged.seriesName = epData ? epData.seriesName : null;
    }
  }

  return { ok: true, type: 'title', data: merged };
}

async function getKargiTitleInfo(id, settings) {
  try {
    const url = `${KARGI_BASE_URL}/all?id=${encodeURIComponent(id)}`;
    const data = await fetchJson(url, {}, 10000);
    log('getKargiTitleInfo: data for', id, '->', data);

    if (!data || !data.id) {
      log('getKargiTitleInfo: no data for', id);
      return { ok: true, type: 'title', data: null, noData: true };
    }

    const titleType = data.type || null;
    const isMovie = titleType === 'movie';

    const isSeriesContainer = titleType === 'tvSeries' || titleType === 'tvMiniSeries';
    const isEpisode = titleType === 'tvEpisode';

    const directorsWithIds = kargiPersonListWithIds(data.directors, 5);
    const writersWithIds = kargiPersonListWithIds(data.writers, 5);
    const directorsNames = directorsWithIds.map((p) => p.name);
    const writersNames = writersWithIds.map((p) => p.name);

    const castList = kargiCastList(data.actors, settings.actorPhotoCount);

    const ratingAvg = data.rating && typeof data.rating.average === 'number' ? data.rating.average : null;
    const ratingVotes = data.rating && typeof data.rating.votes === 'number' ? data.rating.votes : null;

    const genres = Array.isArray(data.genres) ? data.genres.filter(Boolean) : [];

    const runtimeMinutes = typeof data.runtime === 'number' ? data.runtime : null;

    const rawAwards = data.awards || null;
    const awardsBreakdown = (settings.showAwards && rawAwards && rawAwards.total && rawAwards.total.total)
      ? {
          academy: { wins: (rawAwards.awards.academy && rawAwards.awards.academy.wins) || 0, nominations: (rawAwards.awards.academy && rawAwards.awards.academy.nominations) || 0 },
          goldenglobe: { wins: (rawAwards.awards.goldenglobe && rawAwards.awards.goldenglobe.wins) || 0, nominations: (rawAwards.awards.goldenglobe && rawAwards.awards.goldenglobe.nominations) || 0 },
          emmy: { wins: (rawAwards.awards.emmy && rawAwards.awards.emmy.wins) || 0, nominations: (rawAwards.awards.emmy && rawAwards.awards.emmy.nominations) || 0 }
        }
      : null;

    return {
      ok: true,
      type: 'title',
      data: {
        titleType,
        titleTypeLabel: settings.kargiFieldType ? mapKargiType(titleType) : null,

        title: cleanValue(data.title) || cleanValue(data.primaryTitle) || cleanValue(data.name) || null,

        titleYear: data.startYear
          ? (data.endYear && data.endYear !== data.startYear ? `${data.startYear}–${data.endYear}` : (isSeriesContainer && !data.endYear ? `${data.startYear}–` : String(data.startYear)))
          : null,

        parentId: isEpisode ? cleanValue(data.parentId) : null,
        seasonNumber: isEpisode ? data.seasonNumber : null,
        episodeNumber: isEpisode ? data.episodeNumber : null,
        imdbRating: (settings.kargiFieldImdb && ratingAvg != null) ? ratingAvg.toFixed(1) : null,

        imdbVotes: (settings.kargiFieldVotes && ratingVotes != null) ? ratingVotes.toLocaleString('en-US') : null,

        runtime: (settings.kargiFieldRuntime && runtimeMinutes != null) ? `${runtimeMinutes} min` : null,
        genre: settings.kargiFieldGenre ? genres.join(', ') : null,

        genreRaw: genres.length ? genres.join(', ') : null,

        directorValue: ((isMovie || isEpisode) && settings.titleFieldDirector) ? directorsNames : [],

        directorIds: ((isMovie || isEpisode) && settings.titleFieldDirector) ? directorsWithIds.map((p) => p.id) : [],

        writerValue: ((isMovie || isEpisode) && settings.kargiFieldWriter) ? writersNames : [],
        writerIds: ((isMovie || isEpisode) && settings.kargiFieldWriter) ? writersWithIds.map((p) => p.id) : [],

        actors: settings.kargiFieldActors ? castList.map((c) => c.name) : [],
        actorIds: settings.kargiFieldActors ? castList.map((c) => c.id) : [],

        cast: settings.kargiFieldActors ? castList : [],

        actorImages: [],
        awardsBreakdown,
        awardsUrl: settings.showAwards ? `https://www.imdb.com/title/${id}/awards/` : null

      }
    };
  } catch (e) {
    logError('getKargiTitleInfo: threw error for', id, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, type: 'title', timedOut: true };
    return { ok: false, type: 'title', error: String(e && e.message ? e.message : e) };
  }
}

async function getMoviesBoxOfficeInfo(id, isMovie) {
  const settings = await getMoviesSettings();
  if (!settings.showBoxOffice) {
    return { ok: true, type: 'box-office', data: null };
  }

  if (!isMovie) {
    return { ok: true, type: 'box-office', data: null };
  }
  try {
    const bomData = await getBoxOfficeMojoData(id);
    if (!bomData) {
      return { ok: true, type: 'box-office', data: null };
    }
    const domesticPercent = calculateBoxOfficePercentage(bomData.domestic, bomData.worldwide);
    const internationalPercent = calculateBoxOfficePercentage(bomData.international, bomData.worldwide);
    return {
      ok: true,
      type: 'box-office',
      data: {
        domestic: bomData.domestic || null,
        domesticPercent,
        international: bomData.international || null,
        internationalPercent,
        worldwide: bomData.worldwide || null,
        budget: bomData.budget || null,
        boxOfficeMojoUrl: `https://www.boxofficemojo.com/title/${id}/`
      }
    };
  } catch (e) {
    logError('getMoviesBoxOfficeInfo: threw error for', id, '->', e && e.message ? e.message : e);
    return { ok: false, type: 'box-office', error: String(e && e.message ? e.message : e) };
  }
}

function calculateBoxOfficePercentage(domestic, total) {
  if (!domestic || !total) return null;
  const dom = parseInt(String(domestic).replace(/\$|,/g, ''), 10);
  const tot = parseInt(String(total).replace(/\$|,/g, ''), 10);
  if (isNaN(dom) || isNaN(tot) || tot === 0) return null;
  const percent = ((dom / tot) * 100).toFixed(1);
  return parseFloat(percent);
}

async function getBoxOfficeMojoData(imdbId) {
  const url = `https://www.boxofficemojo.com/title/${encodeURIComponent(imdbId)}/`;
  log('getBoxOfficeMojoData: fetching', url);
  try {
    const res = await httpGetText(url, {}, 10000);
    if (!res || !res.ok || !res.text) {
      log('getBoxOfficeMojoData: fetch failed or empty for', imdbId, '-> ok:', res && res.ok, 'status:', res && res.status);
      return null;
    }
    const html = res.text;
    log('getBoxOfficeMojoData: got', html.length, 'chars for', imdbId);

    const summaryIdx = html.indexOf('mojo-performance-summary-table');
    const summaryHtml = summaryIdx !== -1 ? html.slice(summaryIdx, summaryIdx + 3000) : '';
    if (summaryIdx === -1) {
      log('getBoxOfficeMojoData: mojo-performance-summary-table section not found for', imdbId, '- BOM may have changed the page again');
    }

    const extractFromSummary = (label) => {

      const labelRegex = new RegExp(`\\b${label}\\b(?!\\s*(Distributor|Opening))`, 'i');
      const labelMatch = labelRegex.exec(summaryHtml);
      if (!labelMatch) {
        log('getBoxOfficeMojoData:', label, 'label not found in summary widget for', imdbId);
        return null;
      }
      const window = summaryHtml.slice(labelMatch.index, labelMatch.index + 500);
      const moneyMatch = window.match(/class="money">\s*(\$[\d,]+)/i);
      if (!moneyMatch) {
        log('getBoxOfficeMojoData:', label, 'label found but no $ figure nearby for', imdbId);
        return null;
      }
      log('getBoxOfficeMojoData:', label, '=', moneyMatch[1], 'for', imdbId);
      return moneyMatch[1];
    };

    const extractMoneyFullPage = (label) => {
      const regex = new RegExp(`>\\s*${label}\\s*<`, 'gi');
      let match;
      let sawLabel = false;
      while ((match = regex.exec(html)) !== null) {
        sawLabel = true;
        const idx = match.index;
        const window = html.slice(idx, idx + 400);
        const moneyMatch = window.match(/class="money"[^>]*>\s*(\$[\d,]+)/i);
        if (moneyMatch) {
          log('getBoxOfficeMojoData:', label, '=', moneyMatch[1], 'for', imdbId);
          return moneyMatch[1];
        }
      }
      if (!sawLabel) {
        log('getBoxOfficeMojoData:', label, 'label not found for', imdbId);
      } else {
        log('getBoxOfficeMojoData:', label, 'label found but no $ figure nearby in any occurrence for', imdbId);
      }
      return null;
    };

    const domestic = extractFromSummary('Domestic');
    const international = extractFromSummary('International');
    const worldwide = extractFromSummary('Worldwide');
    const budget = extractMoneyFullPage('Budget');

    if (!domestic && !worldwide && !budget) {
      log('getBoxOfficeMojoData: nothing recognizable on the page for', imdbId, '- either this title has no BOM entry, or the page format has changed and this scraper needs updating');
      return null;
    }

    return { domestic, international, worldwide, budget };
  } catch (e) {
    logError('getBoxOfficeMojoData: threw error for', imdbId, '->', e && e.message ? e.message : e);
    return null;
  }
}

function splitActors(text, limit) {
  const value = cleanValue(text);
  if (!value) return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

async function getWikidataPersonInfo(id, settings) {

  const wantFacts = settings.personFieldAge || settings.personFieldBorn
    || settings.personFieldBirthPlace || settings.personFieldOccupation;
  const wantBioUrl = !!settings.personFieldBiography;
  if (!wantFacts && !wantBioUrl) {
    log('getWikidataPersonInfo: all person fields disabled, skipping', id);
    return { ok: true, type: 'name', disabled: true, data: null };
  }

  try {
    const person = await getWikidataPersonBundle(id);

    if (!person) {
      logError('getWikidataPersonInfo: no Wikidata match for', id);
      return { ok: false, type: 'name', error: 'No Wikidata match found' };
    }

    return {
      ok: true,
      type: 'name',
      data: {
        ageInfo: settings.personFieldAge && person.birthDate
          ? calculateAge(person.birthDate, person.deathDate)
          : null,
        born: settings.personFieldBorn && person.birthDate
          ? formatDate(person.birthDate)
          : null,
        birthPlace: settings.personFieldBirthPlace ? person.birthPlace : null,
        occupation: settings.personFieldOccupation ? person.occupations : [],

        wikipediaUrl: wantBioUrl ? (person.wikipediaUrl || null) : null
      }
    };
  } catch (e) {
    logError('getWikidataPersonInfo: threw error for', id, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, type: 'name', timedOut: true };
    return { ok: false, type: 'name', error: String(e && e.message ? e.message : e) };
  }
}

function formatEpisodeInfo(episode) {
  if (!episode) return null;

  const airdate = formatDate(episode.airdate);
  if (!airdate) return null;

  const seasonNum = Number.isFinite(episode.season) ? episode.season : null;
  const episodeNum = Number.isFinite(episode.number) ? episode.number : null;
  const label = (seasonNum !== null && episodeNum !== null)
    ? `S${String(seasonNum).padStart(2, '0')}E${String(episodeNum).padStart(2, '0')}`
    : null;

  return {
    airdate,
    label,
    name: cleanValue(episode.name)
  };
}

async function getTvmazeInfo(imdbId) {
  const settings = await getMoviesSettings();

  const wantEpisodes = settings.tvmazeFieldEpisodes;
  const wantStatus = settings.tvmazeFieldStatus;
  const wantNetwork = settings.tvmazeFieldNetwork;

  const wantCreator = settings.tvmazeFieldCreator;

  const wantSummary = settings.tvmazeFieldSummary;
  const wantCountry = settings.tvmazeFieldCountry;

  const wantCountryForAnime = settings.malFieldScore || settings.showMyAnimeListLink || settings.showAniListLink;

  if (!wantEpisodes && !wantStatus && !wantNetwork && !wantCreator && !wantSummary && !wantCountry && !wantCountryForAnime) {
    log('getTvmazeInfo: all TVmaze fields disabled, skipping', imdbId);
    return { ok: true, type: 'tvmaze', disabled: true, data: null };
  }

  try {
    let show = null;

    const embedParts = [];
    if (wantEpisodes) embedParts.push('embed[]=nextepisode', 'embed[]=previousepisode');
    if (wantCreator) embedParts.push('embed[]=crew');
    const embedParams = embedParts.length ? `?${embedParts.join('&')}` : '';

    show = await fetchJson(`https://api.tvmaze.com/lookup/shows?imdb=${encodeURIComponent(imdbId)}`, {}, 8000);

    if ((wantEpisodes || wantCreator) && show && show.id) {
      try {
        show = await fetchJson(`https://api.tvmaze.com/shows/${show.id}${embedParams}`, {}, 8000);
      } catch (e) {
        logError('getTvmazeInfo: episode embed fetch failed for', imdbId, '->', e && e.message ? e.message : e);
      }
    }

    if (!show) {
      logError('getTvmazeInfo: no TVmaze show found for', imdbId);
      return { ok: false, type: 'tvmaze', error: 'No TVmaze match found' };
    }

    const embedded = show._embedded || {};
    const nextEpisode = embedded.nextepisode || null;
    const previousEpisode = embedded.previousepisode || null;

    const crew = Array.isArray(embedded.crew) ? embedded.crew : [];
    const creator = wantCreator
      ? crew.filter((c) => c && c.type && /creator/i.test(c.type)).map((c) => cleanValue(c.person && c.person.name)).filter(Boolean)
      : [];

    const scheduleDays = Array.isArray(show.schedule && show.schedule.days) ? show.schedule.days : [];
    const scheduleTime = show.schedule && show.schedule.time;

    const nextEpisodeInfo = wantEpisodes ? formatEpisodeInfo(nextEpisode) : null;
    const previousEpisodeInfo = wantEpisodes ? formatEpisodeInfo(previousEpisode) : null;

    const nextEpisodeHasDate = !!(nextEpisode && formatDate(nextEpisode.airdate));

    const countryName = firstValue(
      show.network && show.network.country && show.network.country.name,
      show.webChannel && show.webChannel.country && show.webChannel.country.name
    );

    return {
      ok: true,
      type: 'tvmaze',
      data: {
        nextEpisodeInfo,
        previousEpisodeInfo,
        creator,
        status: wantStatus ? cleanValue(show.status) : null,
        network: wantNetwork
          ? firstValue(
              show.network && show.network.name,
              show.webChannel && show.webChannel.name
            )
          : null,
        schedule: wantNetwork && nextEpisodeHasDate && scheduleDays.length
          ? `${scheduleDays.join('/')}${scheduleTime ? ' ' + scheduleTime : ''}`
          : null,

        summary: wantSummary ? stripHtmlTags(show.summary) || null : null,
        country: wantCountry ? cleanValue(countryName) : null,

        countryRaw: cleanValue(countryName),
        tvmazeUrl: cleanValue(show.url)
      }
    };
  } catch (e) {
    logError('getTvmazeInfo: threw error for', imdbId, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, type: 'tvmaze', timedOut: true };
    return { ok: false, type: 'tvmaze', error: String(e && e.message ? e.message : e) };
  }
}

function stripHtmlTags(html) {
  return decodeHtmlEntities(String(html || '').replace(/<[^>]*>/g, '')).trim();
}

async function getTvmazeEpisodeInfo(parentImdbId, seasonNumber, episodeNumber) {
  try {

    const show = await fetchJson(`https://api.tvmaze.com/lookup/shows?imdb=${encodeURIComponent(parentImdbId)}`, {}, 8000);
    const tvmazeShowId = show && show.id;
    const seriesName = cleanValue(show && show.name);

    if (!tvmazeShowId) {
      logError('getTvmazeEpisodeInfo: no TVmaze show found for parent', parentImdbId);
      return { ok: false, type: 'tvmazeEpisode', error: 'No TVmaze match found' };
    }

    const episode = await fetchJson(
      `https://api.tvmaze.com/shows/${tvmazeShowId}/episodebynumber?season=${encodeURIComponent(seasonNumber)}&number=${encodeURIComponent(episodeNumber)}`,
      {},
      8000
    );

    if (!episode) {
      logError('getTvmazeEpisodeInfo: no TVmaze episode found for', parentImdbId, 'S', seasonNumber, 'E', episodeNumber);
      return { ok: false, type: 'tvmazeEpisode', error: 'No TVmaze episode match found' };
    }

    return {
      ok: true,
      type: 'tvmazeEpisode',
      data: {
        airdate: formatDate(episode.airdate) || null,
        summary: stripHtmlTags(episode.summary) || null,
        seriesName: seriesName || null
      }
    };
  } catch (e) {
    logError('getTvmazeEpisodeInfo: threw error for', parentImdbId, 'S', seasonNumber, 'E', episodeNumber, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, type: 'tvmazeEpisode', timedOut: true };
    return { ok: false, type: 'tvmazeEpisode', error: String(e && e.message ? e.message : e) };
  }
}

const MOVIES_MAX_RAW_EPISODES = 20000;

function normalizeKargiEpisodes(raw) {
  const out = [];

  if (!raw) return out;
  if (typeof raw === 'string') {

    if (raw.trim().startsWith('<') || raw.length > 10000) return out;
    try { raw = JSON.parse(raw); } catch(e) { return out; }
  }

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    if (raw.error || raw.message) {
      const keys = Object.keys(raw);
      const hasEpisodeKey = keys.some(k => /^tt\d+$/.test(k));
      if (!hasEpisodeKey && keys.length < 10) return out;
    }
  }

  const pushEntry = (epIdRaw, item) => {
    if (out.length >= MOVIES_MAX_RAW_EPISODES) return;
    if (!item) return;
    const epId = (typeof epIdRaw === 'string' && /^tt\d+$/.test(epIdRaw))
      ? epIdRaw
      : ((typeof item.id === 'string' && /^tt\d+$/.test(item.id)) ? item.id : null);
    const r = item.rating && typeof item.rating === 'object' ? item.rating : null;
    const season = Number.isFinite(item.s) ? item.s
      : (Number.isFinite(item.season) ? item.season
      : (r && Number.isFinite(r.season) ? r.season : null));
    const episode = Number.isFinite(item.e) ? item.e
      : (Number.isFinite(item.episode) ? item.episode
      : (r && Number.isFinite(r.episode) ? r.episode : null));
    const rating = (r && typeof r.average === 'number') ? r.average
      : (typeof item.r === 'number' ? item.r : null);
    const votes = (r && typeof r.votes === 'number') ? r.votes
      : (typeof item.v === 'number' ? item.v : null);
    const title = cleanValue(item.title || item.name);
    out.push({ id: epId, season, episode, rating, votes, title });
  };

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (out.length >= MOVIES_MAX_RAW_EPISODES) break;
      pushEntry(item && item.id, item);
    }
    if (raw.length > MOVIES_MAX_RAW_EPISODES) {
      logError('normalizeKargiEpisodes: raw array had', raw.length, 'entries - truncated at', MOVIES_MAX_RAW_EPISODES, 'to avoid freezing the background worker');
    }
    return out;
  }
  if (raw && typeof raw === 'object') {

    const rawKeyCount = Object.keys(raw).length;
    if (rawKeyCount > MOVIES_MAX_RAW_EPISODES) {
      logError('normalizeKargiEpisodes: raw object had', rawKeyCount, 'top-level keys - truncating at', MOVIES_MAX_RAW_EPISODES, 'to avoid freezing the background worker');
    }
    for (const [key, value] of Object.entries(raw)) {
      if (out.length >= MOVIES_MAX_RAW_EPISODES) break;
      if (!value || typeof value !== 'object') continue;
      if (value.rating || 'title' in value) {
        pushEntry(key, value);
      } else {

        for (const [epId, item] of Object.entries(value)) {
          if (out.length >= MOVIES_MAX_RAW_EPISODES) break;
          pushEntry(epId, item);
        }
      }
    }
  }
  return out;
}

const MOVIES_MAX_SEASONS = 50;

const MOVIES_MAX_KEPT_EPISODES_PER_SEASON = 500;

async function getKargiSeriesEpisodes(imdbId) {
  try {
    const url = `${KARGI_BASE_URL}/series?id=${encodeURIComponent(imdbId)}`;
    const data = await fetchJson(url, {}, 10000);

    if (!data || (typeof data === 'string')) {
      logError('getKargiSeriesEpisodes: invalid data type for', imdbId, 'type:', typeof data);
      return { ok: false, error: 'No season data found' };
    }
    if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0) {
      return { ok: false, error: 'No season data found' };
    }
    const flat = normalizeKargiEpisodes(data);
    if (!flat.length) return { ok: false, error: 'No season data found' };
    log('getKargiSeriesEpisodes:', imdbId, '->', flat.length, 'raw episodes parsed');

    const bySeason = new Map();
    flat.forEach((ep) => {
      const seasonNum = Number.isFinite(ep.season) ? ep.season : 1;
      if (!bySeason.has(seasonNum)) bySeason.set(seasonNum, []);
      bySeason.get(seasonNum).push(ep);
    });

    const allSeasonNumbers = [...bySeason.keys()].sort((a, b) => a - b);
    const extraSeasonsCount = Math.max(0, allSeasonNumbers.length - MOVIES_MAX_SEASONS);
    const seasonNumbers = allSeasonNumbers.slice(0, MOVIES_MAX_SEASONS);

    const seasons = seasonNumbers.map((n) => ({ id: n, number: n, episodeOrder: null, premiereDate: null }));
    const episodesBySeasonNumber = {};
    seasonNumbers.forEach((n) => {
      const seasonEpisodes = bySeason.get(n);
      const sorted = seasonEpisodes.slice(0, MOVIES_MAX_KEPT_EPISODES_PER_SEASON).sort((a, b) => {
        const ae = Number.isFinite(a.episode) ? a.episode : 0;
        const be = Number.isFinite(b.episode) ? b.episode : 0;
        return ae - be;
      });
      episodesBySeasonNumber[n] = sorted.map((ep) => ({
        number: Number.isFinite(ep.episode) ? ep.episode : null,
        name: ep.title,

        airdate: null,
        rating: ep.rating,
        votes: ep.votes,
        runtime: null,
        imdbId: ep.id
      }));
    });

    return { ok: true, seasons, episodesBySeasonNumber, extraSeasonsCount };
  } catch (e) {
    logError('getKargiSeriesEpisodes: threw error for', imdbId, '->', e && e.message ? e.message : e);
    if (e && e.isTimeout) return { ok: false, timedOut: true };
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function getKargiRatingsForIds(imdbIds) {
  const clean = [...new Set((imdbIds || []).filter((id) => typeof id === 'string' && /^tt\d+$/.test(id)))];
  if (!clean.length) return {};
  try {
    const url = `${KARGI_BASE_URL}/ratings?ids=${encodeURIComponent(clean.join(','))}`;
    const data = await fetchJson(url, {}, 8000);
    if (!data || typeof data === 'string') return {};
    const list = Array.isArray(data) ? data : (data ? [data] : []);
    const map = {};
    list.forEach((item) => {
      const itemId = item && item.id;
      const avg = item && (typeof item.average === 'number' ? item.average : (item.rating && typeof item.rating.average === 'number' ? item.rating.average : null));
      if (typeof itemId === 'string' && avg != null) {
        const votes = typeof item.votes === 'number' ? item.votes : (item.rating && typeof item.rating.votes === 'number' ? item.rating.votes : null);
        map[itemId] = { average: avg, votes };
      }
    });
    return map;
  } catch (e) {
    logError('getKargiRatingsForIds: threw error ->', e && e.message ? e.message : e);
    return {};
  }
}

async function getMoviesPersonFilmography(id) {
  try {
    const url = `${KARGI_BASE_URL}/person?id=${encodeURIComponent(id)}`;
    const data = await fetchJson(url, {}, 12000);
    const raw = Array.isArray(data?.filmography) ? data.filmography : [];
    const cleanYear = (y) => {
      if (typeof y === 'number' && y) return y;
      if (typeof y === 'string' && y.trim()) {
        const n = parseInt(y, 10);
        return Number.isFinite(n) ? n : null;
      }
      return null;
    };
    return raw.map((f) => ({
      id: cleanValue(f && f.id),
      category: cleanValue(f && f.category),
      character: cleanValue(f && f.character),
      title: cleanValue(f && f.title),
      startYear: cleanYear(f && f.startYear),
      endYear: cleanYear(f && f.endYear)
    })).filter((f) => f.id && f.title && f.category);
  } catch (e) {
    logError('getMoviesPersonFilmography: threw error for', id, '->', e && e.message ? e.message : e);
    return [];
  }
}

async function getMoviesFilmographyBatch(imdbIds, wantImages) {
  const ids = Array.isArray(imdbIds) ? imdbIds.filter((wid) => typeof wid === 'string' && wid) : [];
  if (!ids.length) return { ratings: {}, images: {} };
  const [ratingsMap, imagesArr] = await Promise.all([
    getKargiRatingsForIds(ids),
    wantImages ? getMoviesKnownForImages(ids) : Promise.resolve([])
  ]);
  const ratings = {};
  const images = {};
  ids.forEach((wid, i) => {
    const r = ratingsMap[wid];
    ratings[wid] = r ? r.average.toFixed(1) : null;
    images[wid] = imagesArr[i] || null;
  });
  return { ratings, images };
}

async function handleMoviesGetFilmographyBatch(imdbIds, wantImages) {
  try {
    const data = await getMoviesFilmographyBatch(imdbIds, wantImages);
    return { ok: true, data };
  } catch (e) {
    logError('handleMoviesGetFilmographyBatch: threw error ->', e && e.message ? e.message : e);
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function getMoviesTop250List() {
  try {
    const CACHE_KEY = 'MOVIES_TOP_250_CACHE_V3';
    const CACHE_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

    let cached = null;
    try {
      const result = typeof chrome !== 'undefined' && chrome.storage
        ? await chrome.storage.local.get(CACHE_KEY)
        : { [CACHE_KEY]: null };
      cached = result[CACHE_KEY];
    } catch (e) {
      logError('[TOP250] cache read error:', e.message);
    }

    if (cached && cached.list && cached.timestamp && Array.isArray(cached.list) && cached.list.length > 0) {
      const age = Date.now() - cached.timestamp;
      if (age < CACHE_EXPIRY_MS) {
        log('[TOP250] returning cached list (age:', Math.round(age / 1000 / 60), 'min, count:', cached.list.length, ')');
        return { ok: true, list: cached.list, cached: true };
      } else {
        log('[TOP250] cache expired (age:', Math.round(age / 1000 / 60 / 60), 'h)');
      }
    }

    log('[TOP250] fetching fresh from iCheckMovies...');
    const icmUrl = 'https://www.icheckmovies.com/lists/imdbs+top+250/';

    let response;
    try {
      response = await fetch(icmUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        credentials: 'omit',
        cache: 'no-store'
      });

      if (!response.ok) {
        logError('[TOP250] iCheckMovies fetch failed, status:', response.status);
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      log('[TOP250] fetched HTML, length:', html.length, 'bytes');

      const patterns = [
        /href="\/movies\/imdb\/(tt\d{7,8})\//g,
        /data-imdb="(tt\d{7,8})"/g,
        /imdb\.com\/title\/(tt\d{7,8})\//g
      ];

      let imdbIds = [];
      for (const pattern of patterns) {
        const matches = html.match(pattern) || [];
        if (matches.length > 0) {
          log('[TOP250] pattern matched:', pattern, 'found:', matches.length, 'items');
          const extracted = matches.map(m => {
            const match = m.match(/tt\d{7,8}/);
            return match ? match[0] : null;
          }).filter(Boolean);
          imdbIds = [...new Set(extracted)];
          break;
        }
      }

      if (imdbIds.length < 200) {
        logError('[TOP250] parse found only', imdbIds.length, 'IMDb IDs (expected ~250)');
        throw new Error(`iCheckMovies parse found only ${imdbIds.length} IDs`);
      }

      imdbIds = imdbIds.slice(0, 250);
      log('[TOP250] successfully parsed', imdbIds.length, 'unique IMDb IDs');

      const cacheData = { list: imdbIds, timestamp: Date.now() };
      try {
        if (typeof chrome !== 'undefined' && chrome.storage) {
          await chrome.storage.local.set({ [CACHE_KEY]: cacheData });
          log('[TOP250] cache saved successfully');
        }
      } catch (e) {
        logError('[TOP250] cache write error:', e.message);
      }

      log('[TOP250] SUCCESS - fetched and cached', imdbIds.length, 'IMDb IDs from iCheckMovies');
      return { ok: true, list: imdbIds, cached: false };

    } catch (e) {
      logError('[TOP250] fetch error:', e.message);
      throw e;
    }

  } catch (e) {
    logError('[TOP250] FAILED -', e && e.message ? e.message : String(e));
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function getMoviesTopTvShowsList() {
  try {
    const CACHE_KEY = 'MOVIES_TOP_TV_SHOWS_CACHE_V1';
    const CACHE_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

    let cached = null;
    try {
      const result = typeof chrome !== 'undefined' && chrome.storage
        ? await chrome.storage.local.get(CACHE_KEY)
        : { [CACHE_KEY]: null };
      cached = result[CACHE_KEY];
    } catch (e) {
      logError('[TOPTVSHOWS] cache read error:', e.message);
    }

    if (cached && cached.list && cached.timestamp && Array.isArray(cached.list) && cached.list.length > 0) {
      const age = Date.now() - cached.timestamp;
      if (age < CACHE_EXPIRY_MS) {
        log('[TOPTVSHOWS] returning cached list (age:', Math.round(age / 1000 / 60), 'min, count:', cached.list.length, ')');
        return { ok: true, list: cached.list, cached: true };
      } else {
        log('[TOPTVSHOWS] cache expired (age:', Math.round(age / 1000 / 60 / 60), 'h)');
      }
    }

    log('[TOPTVSHOWS] fetching fresh from iCheckMovies...');
    const icmUrl = 'https://icheckmovies.com/lists/imdb+top+rated+tv+shows+updated+regularly/xianjiro/';

    let response;
    try {
      response = await fetch(icmUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        credentials: 'omit',
        cache: 'no-store'
      });

      if (!response.ok) {
        logError('[TOPTVSHOWS] iCheckMovies fetch failed, status:', response.status);
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      log('[TOPTVSHOWS] fetched HTML, length:', html.length, 'bytes');

      const patterns = [
        /href="\/movies\/imdb\/(tt\d{7,8})\//g,
        /data-imdb="(tt\d{7,8})"/g,
        /imdb\.com\/title\/(tt\d{7,8})\//g
      ];

      let imdbIds = [];
      for (const pattern of patterns) {
        const matches = html.match(pattern) || [];
        if (matches.length > 0) {
          log('[TOPTVSHOWS] pattern matched:', pattern, 'found:', matches.length, 'items');
          const extracted = matches.map(m => {
            const match = m.match(/tt\d{7,8}/);
            return match ? match[0] : null;
          }).filter(Boolean);
          imdbIds = [...new Set(extracted)];
          break;
        }
      }

      if (imdbIds.length < 100) {
        logError('[TOPTVSHOWS] parse found only', imdbIds.length, 'IMDb IDs (expected ~250)');
        throw new Error(`iCheckMovies parse found only ${imdbIds.length} IDs`);
      }

      imdbIds = imdbIds.slice(0, 500);
      log('[TOPTVSHOWS] successfully parsed', imdbIds.length, 'unique IMDb IDs');

      const cacheData = { list: imdbIds, timestamp: Date.now() };
      try {
        if (typeof chrome !== 'undefined' && chrome.storage) {
          await chrome.storage.local.set({ [CACHE_KEY]: cacheData });
          log('[TOPTVSHOWS] cache saved successfully');
        }
      } catch (e) {
        logError('[TOPTVSHOWS] cache write error:', e.message);
      }

      log('[TOPTVSHOWS] SUCCESS - fetched and cached', imdbIds.length, 'IMDb IDs from iCheckMovies');
      return { ok: true, list: imdbIds, cached: false };

    } catch (e) {
      logError('[TOPTVSHOWS] fetch error:', e.message);
      throw e;
    }

  } catch (e) {
    logError('[TOPTVSHOWS] FAILED -', e && e.message ? e.message : String(e));
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

async function getMoviesTopListMembership(id, isSeries) {
  try {
    if (!id) return { ok: false, error: 'Missing id' };
    const listResult = isSeries ? await getMoviesTopTvShowsList() : await getMoviesTop250List();
    if (!listResult || !listResult.ok || !Array.isArray(listResult.list)) {
      log('[TOPLIST] list unavailable for', id, '(isSeries=', isSeries, ') ->', listResult && listResult.error);
      return { ok: false, error: (listResult && listResult.error) || 'List unavailable' };
    }
    const index = listResult.list.indexOf(id);
    const isTopList = index !== -1;
    log('[TOPLIST]', id, isSeries ? '(series)' : '(movie)', isTopList ? `found at rank #${index + 1}` : 'not on list');
    return { ok: true, isTopList, rank: isTopList ? index + 1 : null, isSeries };
  } catch (e) {
    logError('[TOPLIST] FAILED for', id, '->', e && e.message ? e.message : e);
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
}

const ACTOR_IMAGE_CONCURRENCY = 3;
async function getActorImages(actors) {
  if (!actors || actors.length === 0) return [];

  const results = new Array(actors.length).fill(null);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < actors.length) {
      const i = nextIndex++;
      try {
        results[i] = await getActorImage(actors[i]);
      } catch (e) {
        logError('getActorImages: error fetching image for', actors[i], '->', e && e.message ? e.message : e);
        results[i] = null;
      }
    }
  }

  const workerCount = Math.min(ACTOR_IMAGE_CONCURRENCY, actors.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

const ACTOR_IMAGE_CACHE = new Map();
const ACTOR_IMAGE_CACHE_MAX = 300;
function actorImageCacheSet(nconstId, entry) {
  if (ACTOR_IMAGE_CACHE.size >= ACTOR_IMAGE_CACHE_MAX && !ACTOR_IMAGE_CACHE.has(nconstId)) {
    const oldestKey = ACTOR_IMAGE_CACHE.keys().next().value;
    ACTOR_IMAGE_CACHE.delete(oldestKey);
  }
  ACTOR_IMAGE_CACHE.set(nconstId, entry);
}
function toSmallImdb(url, w = 140) {
  if (!url ||!url.includes('m.media-amazon.com')) return url;
  const base = url.split('._V1_')[0];
  return `${base}._V1_SX${w}.jpg`;
}

async function getActorImage(actor) {

  const nconstId = actor && actor.id;
  const name = actor && actor.name;
  if (!nconstId && !name) return null;

  const cacheKey = nconstId || `name:${name}`;

  if (ACTOR_IMAGE_CACHE.has(cacheKey)) {
    const cached = ACTOR_IMAGE_CACHE.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.url;
    }
    ACTOR_IMAGE_CACHE.delete(cacheKey);
  }

  try {
    let actorMatch = null;

    if (nconstId) {

      const suggestUrl = `https://v2.sg.media-imdb.com/suggestion/${nconstId.charAt(0).toLowerCase()}/${encodeURIComponent(nconstId)}.json`;
      const suggestData = await fetchJson(suggestUrl, {}, 5000);
      actorMatch = (suggestData && Array.isArray(suggestData.d))
        ? suggestData.d.find((item) => item && item.id === nconstId)
        : null;
    } else {

      const suggestUrl = `https://v2.sg.media-imdb.com/suggestion/${name.charAt(0).toLowerCase()}/${encodeURIComponent(name)}.json`;
      const suggestData = await fetchJson(suggestUrl, {}, 5000);
      actorMatch = (suggestData && Array.isArray(suggestData.d))
        ? suggestData.d.find((item) => item && typeof item.id === 'string' && item.id.startsWith('nm'))
        : null;
    }

    if (!actorMatch) {
      log('getActorImage: no IMDb suggest result for', nconstId || name);
      return null;
    }

    const matchedId = (typeof actorMatch.id === 'string' && /^nm\d+$/.test(actorMatch.id)) ? actorMatch.id : nconstId;

    let imageUrl = null;
    if (actorMatch.i) {
      if (typeof actorMatch.i.imageUrl === 'string') {
        imageUrl = actorMatch.i.imageUrl;
      } else if (Array.isArray(actorMatch.i) && typeof actorMatch.i[0] === 'string') {
        imageUrl = actorMatch.i[0];
      }
    }

    if (!imageUrl && matchedId) {
      const imdbUrl = `https://www.imdb.com/name/${matchedId}/`;
      const res = await httpGetText(imdbUrl, {}, 6000);
      if (!res || !res.ok || !res.text) {
        log('getActorImage: no photo in suggestion API and page fetch failed for', matchedId, '-> ok:', res && res.ok, 'status:', res && res.status);
      } else {
        const pageHtml = res.text;
        const jsonLdMatch = pageHtml.match(/"image":\s*{\s*"url":\s*"([^"]+)"/);
        imageUrl = jsonLdMatch ? jsonLdMatch[1] : null;
        if (!imageUrl) {
          const ogImageMatch = pageHtml.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
          imageUrl = ogImageMatch ? ogImageMatch[1] : null;
        }
        if (!imageUrl) {
          const imgMatch = pageHtml.match(/m\.media-amazon\.com\/images\/M\/[^"]+\.jpg/);
          imageUrl = imgMatch ? 'https://' + imgMatch[0] : null;
        }
      }
    }

    if (imageUrl) {
      imageUrl = toSmallImdb(imageUrl, 140);
      const dataUrlRes = await fetchImageAsDataUrl(imageUrl, 8000);
      imageUrl = (dataUrlRes && dataUrlRes.ok && dataUrlRes.dataUrl) ? dataUrlRes.dataUrl : null;
    }

    actorImageCacheSet(cacheKey, {
      url: imageUrl,
      expires: Date.now() + (30 * 24 * 60 * 60 * 1000)
    });

    if (imageUrl) {
      log('getActorImage: found image for', cacheKey);
    }

    return imageUrl;
  } catch (e) {
    logError('getActorImage: error for', cacheKey, '->', e && e.message ? e.message : e);
    return null;
  }
}


