
const DEEZER_ORIGIN = 'https://api.deezer.com';
const MUSIC_SEARCH_TIMEOUT_MS = 16000;
const MUSIC_DETAILS_TIMEOUT_MS = 12000;
const MUSICBRAINZ_ORIGIN = 'https://musicbrainz.org';
const LYRICS_ORIGIN = 'https://api.lyrics.ovh/v1';

const THEAUDIODB_ORIGIN = 'https://www.theaudiodb.com/api/v1/json/2';

function musicCleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}
function musicLogError() {}
function musicLog() {}

const MUSIC_DEFAULT_SETTINGS = {

  musicFieldArtistGenre: true,
  musicFieldArtistCountry: true,
  musicFieldArtistFormed: true,
  musicFieldArtistOrigin: true,
  musicFieldArtistAlbums: true,
  musicFieldArtistTopTracks: true,
  musicFieldArtistSimilar: true,
  musicFieldArtistBio: true,
  musicFieldArtistGrammy: true,

  musicFieldMBArtistGenre: true,
  musicFieldMBArtistTags: true,

  musicFieldAlbumArtist: true,
  musicFieldAlbumGenre: true,
  musicFieldAlbumReleaseDate: true,
  musicFieldAlbumOriginalReleaseDate: true,
  musicFieldAlbumTrackCount: true,
  musicFieldAlbumTracks: true,
  musicFieldAlbumSales: true,
  musicFieldAlbumGrammy: true,

  musicFieldMBAlbumGenre: true,
  musicFieldMBAlbumTags: true,

  musicFieldTADBAlbumSales: true,
  musicFieldTADBAlbumLabel: true,
  musicFieldTADBMood: true,
  musicFieldTADBTheme: true,
  musicFieldTADBFormat: true,
  musicFieldTADBTempo: true,

  musicFieldTrackArtist: true,
  musicFieldTrackAlbum: true,
  musicFieldTrackGenre: true,
  musicFieldTrackReleaseDate: true,
  musicFieldTrackOriginalReleaseDate: true,
  musicFieldTrackDuration: true,
  musicFieldTrackTempo: true,
  musicFieldTrackPreview: true,
  musicFieldTrackLyrics: true,
  musicFieldTrackGrammy: true,

  musicFieldMBTrackGenre: true,
  musicFieldMBTrackTags: true,

  musicShowDeezerLink: true,
  musicShowSpotifyLink: true,
  musicShowYoutubeLink: true,
  musicShowYoutubeMusicLink: true,
  musicShowMusicBrainzLink: true,
  musicShowLastFmLink: true,
  musicShowTheAudioDBLink: true,
  musicShowWikipediaLink: true,
  musicShowAppleMusicLink: true
};

async function getMusicSettings() {
  const s = await api.storage.local.get(MUSIC_DEFAULT_SETTINGS);
  const out = {};
  for (const k of Object.keys(MUSIC_DEFAULT_SETTINGS)) out[k] = s[k] !== false;
  return out;
}

async function musicFetchJson(url, timeout = MUSIC_DETAILS_TIMEOUT_MS) {
  return await fetchJson(url, { Accept: 'application/json' }, timeout);
}

function musicFormatDuration(millisOrSec) {
  if (!millisOrSec) return null;
  const totalSec = typeof millisOrSec === 'number' && millisOrSec > 1000 ? Math.floor(millisOrSec/1000) : Math.floor(millisOrSec);
  if (isNaN(totalSec)) return null;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
}
function musicFormatNumber(value) {
  if (value === null || value === undefined) return null;
  const num = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g,''),10) : Number(value);
  if (isNaN(num) || num===0) return null;
  return num.toLocaleString('en-US');
}
function musicFormatFans(value) {
  if (value===null||value===undefined) return null;
  const num = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g,''),10) : Number(value);
  if (isNaN(num)) return null;
  return num.toLocaleString('en-US');
}
function musicFormatReleaseYear(dateString) {
  if (!dateString) return null;
  const m = String(dateString).match(/(\d{4})/);
  return m ? m[1] : musicCleanText(dateString);
}

function musicBuildCandidateFromDeezerArtist(item){
  return {
    id: String(item.id),
    type: 'artist',
    artistId: item.id,
    label: musicCleanText(item.name),
    description: `${item.nb_album ? item.nb_album + ' albums' : ''}${item.nb_fan ? ' • ' + item.nb_fan + ' fans' : ''}`.trim(),
    image: item.picture_medium || item.picture_big || item.picture || null,
    raw: item
  };
}
function musicBuildCandidateFromDeezerAlbum(item){
  return {
    id: String(item.id),
    type: 'album',
    collectionId: item.id,
    artistId: item.artist?.id || null,
    label: musicCleanText(item.title),
    description: `${musicCleanText(item.artist?.name || '')} • ${musicFormatReleaseYear(item.release_date) || ''}`.replace(/ • $/, ''),
    image: item.cover_medium || item.cover_big || item.cover || null,
    artistName: musicCleanText(item.artist?.name || ''),
    raw: item
  };
}
function musicBuildCandidateFromDeezerTrack(item){
  return {
    id: String(item.id),
    type: 'track',
    trackId: item.id,
    collectionId: item.album?.id || null,
    artistId: item.artist?.id || null,
    label: musicCleanText(item.title),
    description: `${musicCleanText(item.artist?.name || '')} • ${musicCleanText(item.album?.title || '')}`.replace(/ • $/, ''),
    image: item.album?.cover_medium || item.album?.cover_big || null,
    artistName: musicCleanText(item.artist?.name || ''),
    raw: item
  };
}

async function searchMusic(query, limit = 8) {
  const q = musicCleanText(String(query || ''));
  if (!q) return [];
  try {

    const settled = await Promise.allSettled([
      musicFetchJson(`${DEEZER_ORIGIN}/search/artist?q=${encodeURIComponent(q)}&limit=${limit}`, 8000),
      musicFetchJson(`${DEEZER_ORIGIN}/search/album?q=${encodeURIComponent(q)}&limit=${limit}`, 8000),
      musicFetchJson(`${DEEZER_ORIGIN}/search/track?q=${encodeURIComponent(q)}&limit=${limit}`, 8000),
      musicFetchJson(`${DEEZER_ORIGIN}/search?q=${encodeURIComponent(q)}&limit=25`, 8000)
    ]);
    if (settled.every((r) => r.status === 'rejected')) {
      const firstError = settled[0].reason;
      throw firstError instanceof Error ? firstError : new Error(String(firstError));
    }
    const [artistRes, albumRes, trackRes, generalRes] = settled.map((r) => (r.status === 'fulfilled' ? r.value : { data: [] }));
    const candidates = [];
    const seen = new Set();
    for (const t of (generalRes.data || []).slice(0,25)) {
      if (t.id && t.title) {
        const c = musicBuildCandidateFromDeezerTrack(t);
        const key = `track:${c.id}`;
        if (!seen.has(key)) { seen.add(key); candidates.push(c); }
      }
      if (t.artist?.id) {
        const a = { id: t.artist.id, name: t.artist.name, picture_medium: t.artist.picture_medium };
        const c = musicBuildCandidateFromDeezerArtist(a);
        const key = `artist:${c.id}`;
        if (!seen.has(key)) { seen.add(key); candidates.push(c); }
      }
      if (t.album?.id) {
        const al = { id: t.album.id, title: t.album.title, cover_medium: t.album.cover_medium, artist: t.artist };
        const c = musicBuildCandidateFromDeezerAlbum(al);
        const key = `album:${c.id}`;
        if (!seen.has(key)) { seen.add(key); candidates.push(c); }
      }
    }
    for (const a of (artistRes.data || []).slice(0, limit)) {
      const c = musicBuildCandidateFromDeezerArtist(a);
      const key = `artist:${c.id}`;
      if (!seen.has(key)) { seen.add(key); candidates.push(c); }
    }
    for (const al of (albumRes.data || []).slice(0, limit)) {
      const c = musicBuildCandidateFromDeezerAlbum(al);
      const key = `album:${c.id}`;
      if (!seen.has(key)) { seen.add(key); candidates.push(c); }
    }
    for (const t of (trackRes.data || []).slice(0, limit)) {
      const c = musicBuildCandidateFromDeezerTrack(t);
      const key = `track:${c.id}`;
      if (!seen.has(key)) { seen.add(key); candidates.push(c); }
    }
    const artists = candidates.filter(c=>c.type==='artist').slice(0,3);
    const albums = candidates.filter(c=>c.type==='album').slice(0,3);
    const tracks = candidates.filter(c=>c.type==='track').slice(0,3);
    let mixed = [...artists, ...albums, ...tracks];
    if (mixed.length < limit) {
      const rest = candidates.filter(c=>!mixed.includes(c));
      mixed = [...mixed, ...rest].slice(0, limit);
    } else mixed = mixed.slice(0, limit);
    if (!mixed.length) mixed = candidates.slice(0, limit);
    return mixed;
  } catch(e){

    throw e;
  }
}

const MUSIC_MB_RETRY_DELAYS_MS = [600, 1300];
function musicIsRetryableMusicBrainzError(error) {
  const message = String(error && error.message ? error.message : error || '');
  return /^HTTP 5\d\d$/.test(message);
}
async function musicFetchMusicBrainzJson(url, timeout = 8000) {
  const headers = { 'Accept': 'application/json', 'User-Agent': 'QuickCard/1.0' };
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetchJson(url, headers, timeout);
    } catch (error) {
      if (attempt >= MUSIC_MB_RETRY_DELAYS_MS.length || !musicIsRetryableMusicBrainzError(error)) throw error;
      musicLog(`[music][mb] ${error.message} - retrying (${attempt + 1}/${MUSIC_MB_RETRY_DELAYS_MS.length}) in ${MUSIC_MB_RETRY_DELAYS_MS[attempt]}ms for`, url);
      await new Promise(resolve => setTimeout(resolve, MUSIC_MB_RETRY_DELAYS_MS[attempt]));
    }
  }
}

  const mbSortTags = (tags) => (tags || []).slice().sort((a,b)=>(b.count||0)-(a.count||0));
  async function musicFetchMusicBrainzArtistTags(name) {
    if (!name) return null;
    try {
      const url = `${MUSICBRAINZ_ORIGIN}/ws/2/artist/?query=artist:${encodeURIComponent(name)}&fmt=json&limit=1`;
      const data = await musicFetchMusicBrainzJson(url, 8000);
      const a = data?.artists?.[0];
      if (!a) return null;
      return {
        mbid: a.id || null,
        tags: mbSortTags((a.tags||[]).slice(0,8)).map(t=>t.name)
      };
    } catch(e){ return null; }
  }

function musicCountryCodeToName(code) {
  if (!code) return null;
  const upper = String(code).toUpperCase();
  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const name = displayNames.of(upper);
    return name || upper;
  } catch (e) {
    return upper;
  }
}
async function musicFetchMusicBrainzArtistDetails(name) {
  if (!name) return null;
  const url = `${MUSICBRAINZ_ORIGIN}/ws/2/artist/?query=artist:${encodeURIComponent(name)}&fmt=json&limit=1`;
  const data = await musicFetchMusicBrainzJson(url, 8000);
  const a = data?.artists?.[0];
  if (!a) return null;
  return {
    mbid: a.id || null,
    country: a.country && a.country !== 'unknown' ? musicCountryCodeToName(a.country) : null,

    begin: a['begin-date'] || null,
    ended: !!a['end-date'],
    end: a['end-date'] || null,
    type: a.type || null,
    disambiguation: a.disambiguation || null,
    tags: mbSortTags((a.tags||[]).slice(0,8)).map(t=>t.name)
  };
}

async function musicFetchMusicBrainzReleaseIdByBarcode(upc) {
  if (!upc) return null;
  const url = `${MUSICBRAINZ_ORIGIN}/ws/2/release/?query=barcode:${encodeURIComponent(upc)}&fmt=json`;
  const data = await musicFetchMusicBrainzJson(url, 8000);
  const release = data?.releases?.[0];
  return release?.id || null;
}

async function musicFetchMusicBrainzReleaseGroupForRelease(releaseId) {
  if (!releaseId) return null;
  const url = `${MUSICBRAINZ_ORIGIN}/ws/2/release/${encodeURIComponent(releaseId)}?inc=release-groups&fmt=json`;
  const data = await musicFetchMusicBrainzJson(url, 8000);
  const rg = data?.['release-group'];
  if (!rg) return null;
  return { releaseGroupId: rg.id || null, originalReleaseDate: rg['first-release-date'] || null };
}

async function musicResolveAlbumReleaseByBarcode(upc) {
  const releaseId = await musicFetchMusicBrainzReleaseIdByBarcode(upc);
  if (!releaseId) return null;
  const group = await musicFetchMusicBrainzReleaseGroupForRelease(releaseId);
  if (!group || !group.releaseGroupId) return null;
  return { releaseId, releaseGroupId: group.releaseGroupId, originalReleaseDate: group.originalReleaseDate || null };
}

async function musicFetchMusicBrainzReleaseGroupTagsById(releaseGroupId) {
  if (!releaseGroupId) return null;
  const url = `${MUSICBRAINZ_ORIGIN}/ws/2/release-group/${encodeURIComponent(releaseGroupId)}?inc=tags&fmt=json`;
  const data = await musicFetchMusicBrainzJson(url, 8000);
  if (!data || !data.id) return null;
  return { mbid: data.id, tags: mbSortTags((data.tags||[]).slice(0,8)).map(t=>t.name) };
}

async function musicFetchMusicBrainzRecordingByIsrc(isrc) {
  if (!isrc) return null;
  const url = `${MUSICBRAINZ_ORIGIN}/ws/2/recording/?query=isrc:${encodeURIComponent(isrc)}&fmt=json`;
  const data = await musicFetchMusicBrainzJson(url, 8000);
  const rec = data?.recordings?.[0];
  if (!rec) return null;
  return {
    mbid: rec.id || null,
    tags: mbSortTags((rec.tags||[]).slice(0,8)).map(t=>t.name),
    originalReleaseDate: rec['first-release-date'] || null
  };
}

function musicBuildTadbAlbumPayload(album, fallbackMbid) {
  const clean = (v) => {
    const s = musicCleanText(v === null || v === undefined ? '' : String(v));
    return (!s || s.toLowerCase() === 'null') ? null : s;
  };

  let score = clean(album.intScore);
  const votes = parseInt(String(album.intScoreVotes ?? '').replace(/[^0-9]/g,''),10);
  if (score && (!votes || votes <= 0)) score = null;
  const payload = {
    idAlbum: album.idAlbum || null,
    strAlbum: clean(album.strAlbum),
    strArtist: clean(album.strArtist),
    strLabel: clean(album.strLabel),
    intSales: album.intSales || null,
    strMusicBrainzID: clean(album.strMusicBrainzID) || fallbackMbid || null,
    strMood: clean(album.strMood),
    strTheme: clean(album.strTheme),

    strSpeed: clean(album.strSpeed) && album.strSpeed !== '0' ? clean(album.strSpeed) : null,
    strReleaseFormat: clean(album.strReleaseFormat),
    strGenre: clean(album.strGenre),
    intScore: score,
    intScoreVotes: (!isNaN(votes) && votes > 0) ? votes : null
  };
  return payload;
}

async function musicFetchTheAudioDBAlbumByMBID(mbid) {
  if (!mbid) return null;
  try {
    const url = `${THEAUDIODB_ORIGIN}/Album-mb.php?i=${encodeURIComponent(mbid)}`;
    const data = await musicFetchJson(url, 8000);
    const album = data?.album?.[0];
    if (!album) return null;
    return musicBuildTadbAlbumPayload(album, mbid);
  } catch(e){ return null; }
}

function musicBuildTadbArtistPayload(artist) {
  const clean = (v) => {
    const s = musicCleanText(v === null || v === undefined ? '' : String(v));
    return (!s || s.toLowerCase() === 'null') ? null : s;
  };
  const cleanYear = (v) => {
    const s = clean(v);
    const n = s ? parseInt(s, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  };
  return {
    idArtist: artist.idArtist || null,
    strBiography: clean(artist.strBiographyEN) || clean(artist.strBiography),
    intFormedYear: cleanYear(artist.intFormedYear),
    intBornYear: cleanYear(artist.intBornYear),
    intDiedYear: cleanYear(artist.intDiedYear)
  };
}
async function musicFetchTheAudioDBArtistByMBID(mbid) {
  if (!mbid) return null;
  try {
    const url = `${THEAUDIODB_ORIGIN}/artist-mb.php?i=${encodeURIComponent(mbid)}`;
    const data = await musicFetchJson(url, 8000);
    const artist = data?.artists?.[0];
    if (!artist) return null;
    return musicBuildTadbArtistPayload(artist);
  } catch(e){ return null; }
}

const GRAMMY_API_ORIGIN = 'https://awapi.kargi.top/api';

async function musicFetchGrammyApi(path, params) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${GRAMMY_API_ORIGIN}/${path}?${query}`;
    return await fetchJson(url, { Accept: 'application/json' }, 8000);
  } catch(e){ return null; }
}

function musicNormalizeGrammyName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function musicGrammyRecordMatchesArtist(record, expectedArtist) {
  if (!expectedArtist) return true;
  const recordArtist = record && record.artist;
  if (!recordArtist) return true;
  return musicNormalizeGrammyName(recordArtist) === musicNormalizeGrammyName(expectedArtist);
}

function musicFindGrammyDictEntry(dict, name) {
  if (!dict || typeof dict !== 'object' || !name) return null;
  const target = musicNormalizeGrammyName(name);
  for (const key of Object.keys(dict)) {
    if (musicNormalizeGrammyName(key) === target) return dict[key];
  }
  return null;
}

function musicGrammyShapeFromRecord(record) {
  if (!record) return null;
  const wins = Number.isFinite(record.w) ? record.w : (Number.isFinite(record.wins) ? record.wins : 0);
  const nominations = Number.isFinite(record.n) ? record.n : (Number.isFinite(record.nominations) ? record.nominations : 0);
  return (wins || nominations) ? { wins, nominations } : null;
}

async function musicGetGrammyForArtist(artistName) {
  if (!artistName) return null;
  const record = await musicFetchGrammyApi('artists', { name: artistName });
  if (!record || !record.artist) return null;
  return musicGrammyShapeFromRecord(record);
}

async function musicGetGrammyForAlbum(albumName, artistName) {
  if (!albumName) return null;
  const byName = await musicFetchGrammyApi('albums', { name: albumName });
  if (byName && byName.album && musicGrammyRecordMatchesArtist(byName, artistName)) {
    return musicGrammyShapeFromRecord(byName);
  }
  if (artistName) {
    const byArtist = await musicFetchGrammyApi('albums', { artist: artistName });
    const match = musicFindGrammyDictEntry(byArtist, albumName);
    if (match) return musicGrammyShapeFromRecord(match);
  }
  return null;
}

async function musicGetGrammyForTrack(trackName, artistName) {
  if (!trackName) return null;
  const byName = await musicFetchGrammyApi('tracks', { name: trackName });
  if (byName && byName.track && musicGrammyRecordMatchesArtist(byName, artistName)) {
    return musicGrammyShapeFromRecord(byName);
  }
  if (artistName) {
    const byArtist = await musicFetchGrammyApi('tracks', { artist: artistName });
    const match = musicFindGrammyDictEntry(byArtist, trackName);
    if (match) return musicGrammyShapeFromRecord(match);
  }
  return null;
}

async function musicGetWikipediaBio(name) {
  if (!name) return null;
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(String(name).replace(/\s+/g,'_'))}`;
    const json = await fetchJson(url, { Accept: 'application/json' }, 8000);
    const extract = json && typeof json.extract === 'string' ? json.extract.trim() : '';

    if (!extract || /may refer to/i.test(extract)) return null;
    return extract;
  } catch(e){ return null; }
}

const MUSIC_THUMB_CONCURRENCY = 3;
async function musicResolveThumbUrls(urls) {
  const list = Array.isArray(urls) ? urls : [];
  if (!list.length) return [];
  const results = new Array(list.length).fill(null);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < list.length) {
      const i = nextIndex++;
      const url = list[i];
      if (!url) continue;
      try {
        const res = await fetchImageAsDataUrl(url, 8000);
        results[i] = (res && res.ok && res.dataUrl) ? res.dataUrl : null;
      } catch(e){
        musicLogError('[music] thumb resolve failed for', url, '->', e && e.message ? e.message : e);
        results[i] = null;
      }
    }
  }
  const workerCount = Math.min(MUSIC_THUMB_CONCURRENCY, list.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

async function getMusicLyrics(artistName, trackName) {
  if (!artistName || !trackName) return null;
  try {
    const url = `${LYRICS_ORIGIN}/${encodeURIComponent(artistName)}/${encodeURIComponent(trackName)}`;
    const data = await musicFetchJson(url, 10000).catch(()=>null);
    return data?.lyrics ? data.lyrics.slice(0,10000) : null;
  } catch(e){ return null; }
}

async function getMusicArtistDetails(artistId, settings) {
  const id = musicCleanText(String(artistId || ''));
  if (!id) throw new Error('Missing artistId');

  const wantAlbums = settings ? !!settings.musicFieldArtistAlbums : true;
  const wantTop = settings ? !!settings.musicFieldArtistTopTracks : true;
  const wantSimilar = settings ? !!settings.musicFieldArtistSimilar : true;
  const [artistData, albumsData, topData, relatedData] = await Promise.all([
    musicFetchJson(`${DEEZER_ORIGIN}/artist/${encodeURIComponent(id)}`, MUSIC_DETAILS_TIMEOUT_MS),
    wantAlbums
      ? musicFetchJson(`${DEEZER_ORIGIN}/artist/${encodeURIComponent(id)}/albums?limit=200&index=0`, MUSIC_DETAILS_TIMEOUT_MS).catch(()=>({data:[]}))
      : Promise.resolve({data:[]}),
    wantTop
      ? musicFetchJson(`${DEEZER_ORIGIN}/artist/${encodeURIComponent(id)}/top?limit=15`, 8000).catch(()=>({data:[]}))
      : Promise.resolve({data:[]}),
    wantSimilar
      ? musicFetchJson(`${DEEZER_ORIGIN}/artist/${encodeURIComponent(id)}/related?limit=12`, 8000).catch(()=>({data:[]}))
      : Promise.resolve({data:[]})
  ]);
  if (!artistData || !artistData.id) throw new Error('Artist not found');
  let albums = Array.isArray(albumsData?.data) ? albumsData.data : [];
  const studio = albums.filter(a=>a.record_type==='album');
  let albumsToUse = studio.length >=5 ? studio : albums;
  albumsToUse.sort((a,b)=> new Date(b.release_date||0) - new Date(a.release_date||0));
  const topTracks = (topData?.data || []).slice(0,10).map(t=>({
    trackId: t.id,
    trackName: musicCleanText(t.title),
    collectionName: musicCleanText(t.album?.title || ''),
    collectionId: t.album?.id || null,

    artwork: t.album?.cover_small || t.album?.cover_medium || null,
    durationFormatted: musicFormatDuration(t.duration)
  }));
  const similarArtists = (relatedData?.data || []).slice(0,6).map(r=>({
    artistId: r.id,
    artistName: musicCleanText(r.name),
    image: r.picture_small || r.picture_medium || null,
    fans: r.nb_fan || null
  }));
  const artwork = artistData.picture_xl || artistData.picture_big || null;

  return {
    id: String(artistData.id),
    type: 'artist',
    artistId: artistData.id,
    name: musicCleanText(artistData.name),
    artistLink: artistData.link || null,
    artwork,
    nb_album: artistData.nb_album || null,
    nb_fan: artistData.nb_fan || null,
    nb_fan_formatted: musicFormatFans(artistData.nb_fan),
    about: { fans: musicFormatFans(artistData.nb_fan), fansRaw: artistData.nb_fan },
    albums: albumsToUse.map(a=>({
      collectionId: a.id,
      collectionName: musicCleanText(a.title),

      artwork: a.cover_small || a.cover_medium || null,
      releaseYear: musicFormatReleaseYear(a.release_date),
      recordType: a.record_type || null
    })),
    topTracks,
    similarArtists,
    raw: artistData
  };
}

async function getMusicAlbumDetails(collectionId, settings) {
  const id = musicCleanText(String(collectionId || ''));
  if (!id) throw new Error('Missing collectionId');

  const wantTracks = settings ? !!settings.musicFieldAlbumTracks : true;
  const [albumData, tracksData] = await Promise.all([
    musicFetchJson(`${DEEZER_ORIGIN}/album/${encodeURIComponent(id)}`, MUSIC_DETAILS_TIMEOUT_MS),
    wantTracks
      ? musicFetchJson(`${DEEZER_ORIGIN}/album/${encodeURIComponent(id)}/tracks?limit=100`, 8000).catch(()=>({data:[]}))
      : Promise.resolve({data:[]})
  ]);
  if (!albumData || !albumData.id) throw new Error('Album not found');
  const tracks = Array.isArray(tracksData?.data) ? tracksData.data : (albumData.tracks?.data || []);

  return {
    id: String(albumData.id),
    type: 'album',
    collectionId: albumData.id,
    artistId: albumData.artist?.id || null,
    name: musicCleanText(albumData.title),
    artistName: musicCleanText(albumData.artist?.name || ''),

    genres: (albumData.genres?.data || []).map(g=>musicCleanText(g.name)).filter(Boolean),
    genre: albumData.genres?.data?.[0]?.name || null,
    releaseDate: albumData.release_date || null,
    releaseYear: musicFormatReleaseYear(albumData.release_date),
    trackCount: albumData.nb_tracks || tracks.length,
    artwork: albumData.cover_xl || albumData.cover_big || null,
    artworkSmall: albumData.cover_medium || albumData.cover_small || null,
    link: albumData.link || null,
    label: musicCleanText(albumData.label) || null,

    upc: albumData.upc ? String(albumData.upc) : null,
    tracks: tracks.map((t, idx)=>({
      trackId: t.id,
      trackNumber: t.track_position || idx+1,
      trackName: musicCleanText(t.title),
      durationFormatted: musicFormatDuration(t.duration),
      artistName: musicCleanText(t.artist?.name || albumData.artist?.name || ''),
      artwork: albumData.cover_small || albumData.cover_medium || null
    })),
    raw: albumData
  };
}

async function getMusicTrackDetails(trackId) {
  const id = musicCleanText(String(trackId || ''));
  if (!id) throw new Error('Missing trackId');

  const trackData = await musicFetchJson(`${DEEZER_ORIGIN}/track/${encodeURIComponent(id)}`, MUSIC_DETAILS_TIMEOUT_MS);
  if (!trackData || !trackData.id) throw new Error('Track not found');

  return {
    id: String(trackData.id),
    type: 'track',
    trackId: trackData.id,
    collectionId: trackData.album?.id || null,
    artistId: trackData.artist?.id || null,
    name: musicCleanText(trackData.title),
    artistName: musicCleanText(trackData.artist?.name || ''),
    albumName: musicCleanText(trackData.album?.title || ''),
    genres: (trackData.album?.genres?.data || []).map(g=>musicCleanText(g.name)).filter(Boolean),
    releaseYear: musicFormatReleaseYear(trackData.album?.release_date || trackData.release_date),
    durationFormatted: musicFormatDuration(trackData.duration),
    bpm: trackData.bpm ? Math.round(trackData.bpm) : null,
    rank: typeof trackData.rank === 'number' ? Math.round(trackData.rank) : null,
    artwork: trackData.album?.cover_xl || trackData.album?.cover_big || null,
    previewUrl: trackData.preview || null,
    link: trackData.link || null,

    isrc: trackData.isrc ? String(trackData.isrc) : null,
    raw: trackData
  };
}

async function musicFetchMusicBrainzReleaseMbids(groupMbid) {
  if (!groupMbid) return [];
  try {
    const url = `${MUSICBRAINZ_ORIGIN}/ws/2/release-group/${encodeURIComponent(groupMbid)}?fmt=json&inc=releases`;
    const data = await musicFetchMusicBrainzJson(url, 8000);
    const releases = Array.isArray(data?.releases) ? data.releases : [];
    const ids = releases.slice(0, 3).map(r => r && r.id).filter(id => typeof id === 'string' && !!id);
    return [...new Set(ids)];
  } catch(e){ return []; }
}

async function musicEnrichTadbAlbum(mbidListPromise) {
  const mbids = await mbidListPromise;
  if (!Array.isArray(mbids) || !mbids.length) return null;
  for (const id of mbids) {
    musicLog(`[music][tadb] trying MBID ${id}`);
    const byMbid = await musicFetchTheAudioDBAlbumByMBID(id).catch(()=>null);
    if (byMbid) {
      musicLog(`[music][tadb] MBID HIT ${id}`);
      return musicNormalizeTadbSales(byMbid);
    }
    musicLog(`[music][tadb] MBID miss ${id}`);
  }
  musicLog('[music][tadb] all MBIDs missed');
  return null;
}

function musicNormalizeTadbSales(tadb) {
  if (!tadb) return tadb;
  const salesNum = parseInt(String(tadb.intSales||'').replace(/[^0-9]/g,''),10);
  if (!salesNum || salesNum===0) {
    tadb.intSales = null;
    tadb.intSalesFormatted = null;
  } else {
    tadb.intSalesFormatted = musicFormatNumber(salesNum);
    tadb.intSalesRaw = salesNum;
  }
  return tadb;
}

function musicMbErrorResult(error) {
  return musicIsRetryableMusicBrainzError(error) ? { error: 'service_unavailable' } : null;
}

async function getMusicEnrichment(type, data) {
  const settings = await getMusicSettings();

  if (type === 'artist') {

    const wantsTadb = !!(settings.musicFieldArtistBio || settings.musicFieldArtistFormed);
    const wantsMbDirect = !!(settings.musicFieldArtistCountry || settings.musicFieldMBArtistTags);
    const wantsMb = wantsMbDirect || wantsTadb;
    const grammyPromise = settings.musicFieldArtistGrammy
      ? musicGetGrammyForArtist(data.name).catch(()=>null)
      : Promise.resolve(null);
    let mbDetails = null;
    if (wantsMb && data.name) {
      try {
        mbDetails = await musicFetchMusicBrainzArtistDetails(data.name);
      } catch (error) {
        mbDetails = musicMbErrorResult(error);
      }
    }

    const tadb = (wantsTadb && mbDetails?.mbid)
      ? await musicFetchTheAudioDBArtistByMBID(mbDetails.mbid).catch(()=>null)
      : null;
    const grammy = await grammyPromise;
    return { musicbrainz: mbDetails, theaudiodb: tadb, grammy, bio: null };
  }

  if (type === 'album') {
    const wantsTadb = !!(settings.musicFieldTADBAlbumSales || settings.musicFieldTADBAlbumLabel
      || settings.musicFieldTADBMood || settings.musicFieldTADBTheme
      || settings.musicFieldTADBFormat || settings.musicFieldTADBTempo);
    const wantsMbDirect = !!(settings.musicFieldMBAlbumTags || settings.musicFieldAlbumOriginalReleaseDate);
    const wantsMb = wantsMbDirect || wantsTadb;

    let resolveMbids;
    const mbidsPromise = new Promise((resolve) => { resolveMbids = resolve; });
    const mbPromise = (async () => {
      if (!wantsMb) { resolveMbids([]); return null; }

      if (!data.upc) { resolveMbids([]); return null; }
      try {
        const byBarcode = await musicResolveAlbumReleaseByBarcode(data.upc);
        if (!byBarcode) { resolveMbids([]); return null; }
        const tagsResult = await musicFetchMusicBrainzReleaseGroupTagsById(byBarcode.releaseGroupId).catch(()=>null);
        const mb = tagsResult || { mbid: byBarcode.releaseGroupId, tags: [] };
        mb.originalReleaseDate = byBarcode.originalReleaseDate;

        resolveMbids([byBarcode.releaseGroupId, byBarcode.releaseId].filter(Boolean));

        if (!wantsMbDirect) return { mbid: mb.mbid, tags: [] };
        return mb;
      } catch (error) {
        resolveMbids([]);
        return musicMbErrorResult(error);
      }
    })();
    const tadbPromise = wantsTadb
      ? musicEnrichTadbAlbum(mbidsPromise)
      : Promise.resolve(null);
    const grammyPromise = settings.musicFieldAlbumGrammy
      ? musicGetGrammyForAlbum(data.name, data.artistName).catch(()=>null)
      : Promise.resolve(null);
    const [mb, tadb, gr] = await Promise.all([mbPromise, tadbPromise, grammyPromise]);
    return { musicbrainz: mb, theaudiodb: tadb, grammy: gr, bio: null };
  }

  const wantsMb = !!(settings.musicFieldMBTrackTags || settings.musicFieldTrackOriginalReleaseDate);
  let mb = null;
  if (wantsMb && data.isrc) {
    try {
      mb = await musicFetchMusicBrainzRecordingByIsrc(data.isrc);
    } catch (error) {
      mb = musicMbErrorResult(error);
    }
  }
  const grammy = settings.musicFieldTrackGrammy
    ? await musicGetGrammyForTrack(data.name, data.artistName).catch(()=>null)
    : null;
  return { musicbrainz: mb, theaudiodb: null, grammy, bio: null };
}

function getMusicSiteLinks(data, settings) {
  const links = [];
  if (!data) return links;
  const q = data.artistName ? `${data.artistName} ${data.name}` : data.name;
  const qEnc = encodeURIComponent(q || '');
  const artistQ = encodeURIComponent(data.artistName || data.name || '');
  const nameQ = encodeURIComponent(data.name || '');
  if (settings?.musicShowDeezerLink && data.link) links.push({ label: 'Deezer', url: data.link });
  else if (settings?.musicShowDeezerLink && data.artistLink) links.push({ label: 'Deezer', url: data.artistLink });
  if (settings?.musicShowSpotifyLink && q) links.push({ label: 'Spotify', url: `https://open.spotify.com/search/${qEnc}` });
  if (settings?.musicShowYoutubeLink && q) links.push({ label: 'YouTube', url: `https://www.youtube.com/results?search_query=${qEnc}` });
  if (settings?.musicShowYoutubeMusicLink && q) links.push({ label: 'YouTube Music', url: `https://music.youtube.com/search?q=${qEnc}` });
  if (settings?.musicShowAppleMusicLink && q) links.push({ label: 'Apple Music', url: `https://music.apple.com/search?term=${qEnc}` });
  if (settings?.musicShowMusicBrainzLink) {
    if (data.type==='artist') links.push({ label: 'MusicBrainz', url: `https://musicbrainz.org/search?query=${artistQ}&type=artist` });
    else if (data.type==='album') links.push({ label: 'MusicBrainz', url: `https://musicbrainz.org/search?query=${qEnc}&type=release_group` });
    else links.push({ label: 'MusicBrainz', url: `https://musicbrainz.org/search?query=${qEnc}&type=recording` });
  }
  if (settings?.musicShowLastFmLink && q) {
    if (data.type==='artist') links.push({ label: 'Last.fm', url: `https://www.last.fm/music/${artistQ}` });
    else if (data.type==='album') links.push({ label: 'Last.fm', url: `https://www.last.fm/music/${artistQ}/${nameQ}` });
    else links.push({ label: 'Last.fm', url: `https://www.last.fm/music/${artistQ}/_/${nameQ}` });
  }

  if (settings?.musicShowTheAudioDBLink && (data.artistName || data.name)) {
    const artistForSearch = data.artistName || data.name;
    if (data.type==='album' && data.name) {
      links.push({ label: 'TheAudioDB', url: `https://www.theaudiodb.com/search.php?s=${encodeURIComponent(artistForSearch)}&a=${encodeURIComponent(data.name)}` });
    } else {
      links.push({ label: 'TheAudioDB', url: `https://www.theaudiodb.com/search.php?s=${encodeURIComponent(artistForSearch)}` });
    }
  }
  if (settings?.musicShowWikipediaLink) {
    const wq = data.artistName || data.name;
    if (wq) links.push({ label: 'Wikipedia', url: `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(wq)}` });
  }
  return links;
}

async function musicResolveCandidateImageUrl(rawArtworkUrl) {
  if (!rawArtworkUrl) return null;
  try {
    const imageResult = await fetchImageAsDataUrl(rawArtworkUrl, 8000);
    return (imageResult && imageResult.ok && imageResult.dataUrl) ? imageResult.dataUrl : null;
  } catch (resolveError) {
    musicLogError('[music] candidate image resolve failed for', rawArtworkUrl, '->', resolveError && resolveError.message ? resolveError.message : resolveError);
    return null;
  }
}
async function handleMusicSearch(query) {
  try {
    const candidates = await searchMusic(musicCleanText(String(query || '')), 8);

    const resolvedCandidates = await Promise.all(candidates.map(async (candidate) => {
      if (!candidate || !candidate.image || String(candidate.image).startsWith('data:')) return candidate;
      const resolvedImage = await musicResolveCandidateImageUrl(candidate.image);
      return { ...candidate, image: resolvedImage };
    }));
    return { ok: true, candidates: resolvedCandidates };
  } catch (error) {
    return { ok: false, reason: 'network', error: String(error?.message || error) };
  }
}

async function handleMusicGetListThumbs(rows) {
  try {
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) return { ok: true, thumbs: {} };
    const urls = list.map(r => r && r.artwork);
    const resolved = await musicResolveThumbUrls(urls);
    const thumbs = {};
    list.forEach((r, i) => {
      const key = r && (r.trackId || r.collectionId || r.artistId);
      if (key != null && resolved[i]) thumbs[String(key)] = resolved[i];
    });
    return { ok: true, thumbs };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}
async function handleMusicGetArtistDetails(artistId) {
  try {
    const settings = await getMusicSettings();
    const details = await getMusicArtistDetails(artistId, settings);
    const siteLinks = getMusicSiteLinks(details, settings);
    return { ok: true, data: { ...details, siteLinks } };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}
async function handleMusicGetAlbumDetails(collectionId) {
  try {
    const settings = await getMusicSettings();
    const details = await getMusicAlbumDetails(collectionId, settings);
    const siteLinks = getMusicSiteLinks(details, settings);
    return { ok: true, data: { ...details, siteLinks } };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}
async function handleMusicGetTrackDetails(trackId) {
  try {
    const settings = await getMusicSettings();
    const details = await getMusicTrackDetails(trackId);
    const siteLinks = getMusicSiteLinks(details, settings);
    return { ok: true, data: { ...details, siteLinks } };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

async function handleMusicGetTrackLyrics(artistName, trackName) {
  try {
    const settings = await getMusicSettings();
    if (!settings.musicFieldTrackLyrics) return { ok: true, lyrics: null };
    const lyrics = await getMusicLyrics(artistName, trackName);
    return { ok: true, lyrics };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

async function handleMusicGetEnrichment(type, payload) {
  try {
    const enriched = await getMusicEnrichment(type, payload || {});
    return { ok: true, ...enriched };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

