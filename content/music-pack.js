

const MUSIC_PACK_ID = 'music';
const MUSIC_THEME_CLASS = 'qc-theme-music';

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
  musicShowAppleMusicLink: true,

  musicSiteFilterMode: 'blacklist',
  musicWhitelistSites: [],
  musicBlacklistSites: ['deezer.com']
};

let musicSettings = { ...MUSIC_DEFAULT_SETTINGS };

async function loadMusicSettings() {
  const stored = await api.storage.local.get({
    ...MUSIC_DEFAULT_SETTINGS,
    musicCustomLinks: []
  });
  const out = {};
  for (const k of Object.keys(MUSIC_DEFAULT_SETTINGS)) out[k] = stored[k] !== false;

  out.musicSiteFilterMode = stored.musicSiteFilterMode || 'blacklist';
  out.musicWhitelistSites = Array.isArray(stored.musicWhitelistSites) ? stored.musicWhitelistSites : [];
  out.musicBlacklistSites = Array.isArray(stored.musicBlacklistSites) ? stored.musicBlacklistSites : ['deezer.com'];
  out.musicCustomLinks = Array.isArray(stored.musicCustomLinks)
    ? stored.musicCustomLinks.filter((l) => l && typeof l.urlTemplate === 'string' && l.urlTemplate.trim())
    : [];
  preloadCustomLinkIcons(out.musicCustomLinks);
  musicSettings = out;
  return out;
}
function musicFormatNumberLocal(v){ if(v===null||v===undefined) return null; const n=typeof v==='string'?parseInt(v.replace(/[^0-9]/g,''),10):Number(v); if(isNaN(n)||n===0) return null; return n.toLocaleString('en-US'); }

function isMusicAllowedOnThisSite() { return true; }

function isMusicAllowedForHoverOnThisSite() {
  const ownRulesAllow = siteAllowedByRules({
    siteFilterMode: musicSettings.musicSiteFilterMode,
    whitelistSites: musicSettings.musicWhitelistSites,
    blacklistSites: musicSettings.musicBlacklistSites
  });
  if (!ownRulesAllow) return false;
  return isAllowedByGlobalSiteRules(MUSIC_PACK_ID, 'hover');
}
const MUSIC_FULL_CARD_WIDTH = 528;

function injectMusicTheme() {
  const root = ensureUiRoot();
  if (root.getElementById('quickcard-music-theme')) return;
  const style = document.createElement('style');
  style.id = 'quickcard-music-theme';
  style.textContent = `
    .${MUSIC_THEME_CLASS} { background-color:#ffffff !important; border:1px solid #ececf0 !important; box-shadow:0 10px 30px rgba(20,20,30,0.14) !important; color:#17171a !important; overflow:hidden !important; }
    .${MUSIC_THEME_CLASS}.qc-popup { cursor:default !important; user-select:text !important; }
    .${MUSIC_THEME_CLASS} button, .${MUSIC_THEME_CLASS} a { cursor:pointer !important; user-select:none !important; }
    .${MUSIC_THEME_CLASS} img { -webkit-user-drag:none !important; user-select:none !important; }
    .${MUSIC_THEME_CLASS}.qc-style-full { width:${MUSIC_FULL_CARD_WIDTH}px !important; max-width:min(${MUSIC_FULL_CARD_WIDTH}px, calc(100vw - 24px)) !important; box-sizing:border-box !important; }
    .${MUSIC_THEME_CLASS} .qc-music-hero { position:relative !important; display:grid !important; grid-template-columns:112px minmax(0,1fr) !important; gap:15px !important; margin:0 -20px !important; padding:0 20px 14px 20px !important; border-bottom:1px solid #e7e9f0 !important; background:radial-gradient(circle at 90% 0%, #f2e6ff 0, transparent 42%), linear-gradient(180deg, #ffffff 0%, #fbf7ff 100%) !important; }
    .${MUSIC_THEME_CLASS} .qc-music-cover { width:112px !important; height:112px !important; overflow:hidden !important; border-radius:10px !important; background:#252832 !important; box-shadow:0 7px 20px rgba(25,30,45,0.18) !important; flex-shrink:0 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-cover img { display:block !important; width:100% !important; height:100% !important; object-fit:cover !important; }
    .${MUSIC_THEME_CLASS} .qc-music-cover.qc-music-cover-artist { border-radius:50% !important; }
    .${MUSIC_THEME_CLASS} .qc-music-summary { min-width:0 !important; padding-top:4px !important; }
    .${MUSIC_THEME_CLASS} .qc-music-hero .name { margin:0 0 6px 0 !important; font-size:19px !important; font-weight:800 !important; line-height:1.22 !important; display:-webkit-box !important; -webkit-box-orient:vertical !important; -webkit-line-clamp:2 !important; overflow:hidden !important; }
    .${MUSIC_THEME_CLASS} .qc-music-subline { margin-bottom:8px !important; color:#69707e !important; font-size:11px !important; }
    .${MUSIC_THEME_CLASS} .qc-music-badge { display:inline-flex !important; padding:2px 7px !important; border-radius:999px !important; background:#f1f2f4 !important; color:#5b5c63 !important; font-size:10px !important; font-weight:700 !important; text-transform:uppercase !important; }
    .${MUSIC_THEME_CLASS} .qc-music-body { padding-top:12px !important; }
    .${MUSIC_THEME_CLASS} .qc-music-grid { display:grid !important; grid-template-columns:1fr 1fr !important; gap:8px 16px !important; margin:8px 0 12px 0 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-fact { font-size:12px !important; line-height:1.35 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-fact b { color:#5b5c63 !important; font-weight:600 !important; font-size:10px !important; text-transform:uppercase !important; display:block !important; }
    .${MUSIC_THEME_CLASS} .qc-music-list { display:flex !important; flex-direction:column !important; gap:6px !important; }
    .${MUSIC_THEME_CLASS} .qc-music-list-row { display:grid !important; grid-template-columns:40px minmax(0,1fr) auto !important; gap:10px !important; align-items:center !important; padding:6px 8px !important; border-radius:8px !important; background:#f7f7f8 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-list-row:hover { background:#ececf0 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-list-row img { width:40px !important; height:40px !important; border-radius:6px !important; object-fit:cover !important; }
    .${MUSIC_THEME_CLASS} .qc-music-list-meta { font-size:11px !important; color:#7b7c82 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-section-title { font-size:12px !important; font-weight:700 !important; margin:14px 0 8px 0 !important; }
    .${MUSIC_THEME_CLASS} button.qc-music-lyrics-title-link {
      display: inline-block !important;
      background: none !important;
      border: none !important;
      padding: 0 !important;
      font: inherit !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      margin: 14px 0 8px 0 !important;
      cursor: pointer !important;
      color: inherit !important;
    }
    .${MUSIC_THEME_CLASS} button.qc-music-lyrics-title-link:hover {
      text-decoration: underline !important;
    }
    .${MUSIC_THEME_CLASS} .qc-music-about { background:#f7f7f8 !important; border-radius:10px !important; padding:10px 12px !important; margin:8px 0 !important; }

    .${MUSIC_THEME_CLASS} .qc-music-about-row { display:grid !important; grid-template-columns:112px minmax(0,1fr) !important; column-gap:10px !important; align-items:start !important; font-size:12px !important; margin:5px 0 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-about-row b { color:#5b5c63 !important; font-size:10px !important; text-transform:uppercase !important; white-space:nowrap !important; }
    .${MUSIC_THEME_CLASS} .qc-music-about-row span { min-width:0 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-collapse { display:none !important; }
    .${MUSIC_THEME_CLASS} .qc-music-collapse.qc-expanded { display:flex !important; flex-direction:column !important; gap:6px !important; }
    .${MUSIC_THEME_CLASS} .qc-music-showmore { margin-top:6px !important; font-size:12px !important; color:#3b6df0 !important; background:none !important; border:none !important; font-weight:600 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-back { display:inline-flex !important; align-items:center !important; gap:4px !important; margin-bottom:8px !important; font-size:12px !important; color:#3b6df0 !important; background:#f1f2f4 !important; border:none !important; border-radius:999px !important; padding:4px 10px !important; font-weight:600 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-lyrics-box { max-height:220px !important; overflow-y:auto !important; white-space:pre-wrap !important; font-size:12px !important; line-height:1.6 !important; background:#f7f7f8 !important; border-radius:8px !important; padding:10px 12px !important; }
    .${MUSIC_THEME_CLASS} .qc-music-lyrics-loading { font-size:12px !important; color:#8a8a93 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-enrich-loading { font-size:11px !important; color:#8a8a93 !important; padding:2px 0 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-enrich-error { font-size:11px !important; color:#c0392b !important; padding:2px 0 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-lyrics-collapsed { max-height:160px !important; overflow:hidden !important; }
    .${MUSIC_THEME_CLASS} .qc-music-mb-section { background:#fafafb !important; border:1px dashed #e2e3e8 !important; border-radius:10px !important; padding:10px 12px !important; margin:10px 0 !important; }

    .${MUSIC_THEME_CLASS} .qc-music-grammy { background:none !important; border:none !important; border-radius:0 !important; padding:0 !important; margin:8px 0 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-track-num { color:#9a9ba4 !important; font-size:11px !important; font-weight:600 !important; text-align:center !important; min-width:16px !important; }
    .${MUSIC_THEME_CLASS} .qc-music-tracklist-row { grid-template-columns:22px 40px minmax(0,1fr) auto !important; }
    .${MUSIC_THEME_CLASS} .qc-music-stat-row { display:flex !important; flex-wrap:wrap !important; gap:10px !important; margin-top:8px !important; }
    .${MUSIC_THEME_CLASS} .qc-music-stat-block { flex:0 0 calc(50% - 5px) !important; box-sizing:border-box !important; min-width:0 !important; border-radius:12px !important; padding:10px 8px !important; background:#f5f5f7 !important; text-align:center !important; display:flex !important; flex-direction:column !important; align-items:center !important; justify-content:center !important; }
    .${MUSIC_THEME_CLASS} .qc-music-stat-block.qc-stat-win { background:linear-gradient(135deg, #f6e9bf, #f6d383) !important; }
    .${MUSIC_THEME_CLASS} .qc-music-stat-block.qc-stat-win .qc-music-stat-num,
    .${MUSIC_THEME_CLASS} .qc-music-stat-block.qc-stat-win .qc-music-stat-label { color:#4a3200 !important; opacity:1 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-stat-block.qc-stat-nom { background:#f5f5f7 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-stat-num { font-size:19px !important; font-weight:800 !important; line-height:1.15 !important; color:#17171a !important; }
    .${MUSIC_THEME_CLASS} .qc-music-stat-label { font-size:10.5px !important; font-weight:600 !important; margin-top:3px !important; color:#5b5c63 !important; opacity:0.75 !important; }

    .${MUSIC_THEME_CLASS} .qc-music-summary-toggle { font-size:11px !important; color:#3b6df0 !important; cursor:pointer !important; user-select:none !important; list-style:none !important; display:inline-block !important; margin-top:6px !important; font-weight:600 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-summary-toggle::-webkit-details-marker { display:none !important; }

    .${MUSIC_THEME_CLASS} .qc-music-text-teaser { cursor:pointer !important; list-style:none !important; display:block !important; }
    .${MUSIC_THEME_CLASS} .qc-music-text-teaser::-webkit-details-marker { display:none !important; }
    .${MUSIC_THEME_CLASS} .qc-music-text-body { font-size:12px !important; line-height:1.55 !important; color:#33343a !important; white-space:pre-wrap !important; display:-webkit-box !important; -webkit-box-orient:vertical !important; -webkit-line-clamp:3 !important; overflow:hidden !important; }
    .${MUSIC_THEME_CLASS} details[open]>.qc-music-text-teaser .qc-music-text-body { display:block !important; -webkit-line-clamp:unset !important; overflow:visible !important; }
    .${MUSIC_THEME_CLASS} .qc-music-text-toggle { display:inline-block !important; margin-top:4px !important; color:#3b6df0 !important; font-size:11px !important; font-weight:600 !important; }
    .${MUSIC_THEME_CLASS} .qc-music-text-toggle-less { display:none !important; }
    .${MUSIC_THEME_CLASS} details[open]>.qc-music-text-teaser .qc-music-text-toggle-more { display:none !important; }
    .${MUSIC_THEME_CLASS} details[open]>.qc-music-text-teaser .qc-music-text-toggle-less { display:inline-block !important; }
  `;
  root.styleHost.appendChild(style);
}

function fetchMusicSearch(q){ return api.runtime.sendMessage({ type:'MUSIC_SEARCH', query:q }).catch(e=>({ ok:false, reason:'network' })); }
function fetchMusicArtistDetails(id){ return api.runtime.sendMessage({ type:'MUSIC_GET_ARTIST_DETAILS', artistId:id }).catch(e=>({ ok:false })); }
function fetchMusicAlbumDetails(id){ return api.runtime.sendMessage({ type:'MUSIC_GET_ALBUM_DETAILS', collectionId:id }).catch(e=>({ ok:false })); }
function fetchMusicTrackDetails(id){ return api.runtime.sendMessage({ type:'MUSIC_GET_TRACK_DETAILS', trackId:id }).catch(e=>({ ok:false })); }

const MUSIC_LYRICS_TIMEOUT_MS = 12000;
function fetchMusicTrackLyrics(artistName, trackName){
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok:false, timedOut:true });
    }, MUSIC_LYRICS_TIMEOUT_MS);
    api.runtime.sendMessage({ type:'MUSIC_GET_TRACK_LYRICS', artistName, trackName }).then((res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(res || { ok:false });
    }).catch(() => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok:false });
    });
  });
}

const MUSIC_ENRICHMENT_TIMEOUT_MS = 12000;
function fetchMusicEnrichment(entityType, payload){
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok:false, timedOut:true });
    }, MUSIC_ENRICHMENT_TIMEOUT_MS);
    api.runtime.sendMessage({ type:'MUSIC_GET_MUSIC_ENRICHMENT', entityType, payload }).then((res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(res || { ok:false });
    }).catch(() => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok:false });
    });
  });
}

const MUSIC_LIST_THUMBS_TIMEOUT_MS = 15000;
function fetchMusicListThumbs(rows){
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok:false, timedOut:true });
    }, MUSIC_LIST_THUMBS_TIMEOUT_MS);
    api.runtime.sendMessage({ type:'MUSIC_GET_LIST_THUMBS', rows }).then((res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(res || { ok:false });
    }).catch(() => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok:false });
    });
  });
}

function musicPatchListThumbs(host, thumbs){
  if (!host || !host.isConnected || !thumbs) return;
  let patched = 0;
  for (const [id, dataUrl] of Object.entries(thumbs)){
    host.querySelectorAll(`img[data-qc-thumb="${CSS.escape(String(id))}"]`).forEach(img => {
      img.src = dataUrl;
      patched += 1;
    });
  }
  if (patched) navRefreshLastRenderedCardHtml();
}

function musicCollectThumbRows(data){
  const rows = [];
  const seen = new Set();
  const push = (row) => {
    if (!row || !row.artwork) return;
    const key = row.trackId || row.collectionId || row.artistId;
    if (key == null || seen.has(String(key))) return;
    seen.add(String(key));
    rows.push({ trackId: row.trackId ?? null, collectionId: row.collectionId ?? null, artistId: row.artistId ?? null, artwork: row.artwork });
  };
  (data.albums || []).forEach(push);
  (data.topTracks || []).forEach(push);
  (data.tracks || []).forEach(push);
  (data.similarArtists || []).forEach(r => { if (r && r.image) push({ artistId: r.artistId, artwork: r.image }); });
  return rows;
}

function musicPatchListThumbsDirect(host, rows){
  if (!host || !host.isConnected || !rows) return;
  let patched = 0;
  rows.forEach(row => {
    const id = row.trackId ?? row.collectionId ?? row.artistId;
    if (id == null || !row.artwork) return;
    host.querySelectorAll(`img[data-qc-thumb="${CSS.escape(String(id))}"]`).forEach(img => {
      img.src = row.artwork;
      patched += 1;
    });
  });
  if (patched) navRefreshLastRenderedCardHtml();
}

async function musicLoadListThumbs(data, navToken){
  if (!data) return;
  const rows = musicCollectThumbRows(data);
  if (!rows.length) return;
  if (isRunningAsExtensionPage()) {
    if (!selectionPopupEl || !selectionPopupEl.isConnected) return;
    musicPatchListThumbsDirect(selectionPopupEl, rows);
    return;
  }
  const res = await fetchMusicListThumbs(rows);
  if (navToken !== undefined && !navIsTokenCurrent(navToken)) return;
  if (!selectionPopupEl || !selectionPopupEl.isConnected) return;
  if (!res || !res.ok || !res.thumbs) return;
  musicPatchListThumbs(selectionPopupEl, res.thumbs);
}

async function musicResolveHoverThumbs(data, myHoverToken, cacheEntry, anchor){
  const rows = musicCollectThumbRows(data);
  if (!rows.length) {
    cacheEntry.finalHtml = hoverPopupEl ? hoverPopupEl.innerHTML : cacheEntry.finalHtml;
    return;
  }
  const res = await fetchMusicListThumbs(rows);
  if (myHoverToken !== hoverRequestToken || !hoverPopupEl) return;
  if (!res || !res.ok || !res.thumbs) return;
  musicPatchListThumbs(hoverPopupEl, res.thumbs);

  if (myHoverToken === hoverRequestToken && hoverPopupEl) {
    cacheEntry.finalHtml = hoverPopupEl.innerHTML;
  }
  void anchor;
}

function musicTitleDash(title) {
  return String(title || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function musicAppendCustomLinks(siteLinks, data) {
  const links = Array.isArray(siteLinks) ? siteLinks.slice() : [];
  const title = data && data.name ? data.name : '';
  const artist = data && data.artistName ? data.artistName : '';
  for (const cl of (musicSettings.musicCustomLinks || [])) {
    const url = String(cl.urlTemplate || '')
      .replace(/\{title\}/g, encodeURIComponent(title))
      .replace(/\{artist\}/g, encodeURIComponent(artist))
      .replace(/\{title_dash\}/g, musicTitleDash(title));
    if (!url) continue;
    links.push({
      label: (cl.label && cl.label.trim()) || 'Custom Link',
      url,
      icon: cl.icon || null
    });
  }
  return links;
}
function musicLinksHtml(data) {
  const _ml = musicAppendCustomLinks(data && data.siteLinks, data || {});
  return _ml && _ml.length ? `<div class="qc-footer-strip">${buildExternalLinksHtml(_ml)}</div>` : '';
}

function musicEnrichmentWillRun(entityType){
  if (entityType === 'artist') {
    return !!(musicSettings.musicFieldArtistCountry || musicSettings.musicFieldMBArtistTags
      || musicSettings.musicFieldArtistBio || musicSettings.musicFieldArtistFormed
      || musicSettings.musicFieldArtistGrammy);
  }
  if (entityType === 'album') {
    return !!(musicSettings.musicFieldMBAlbumTags || musicSettings.musicFieldAlbumOriginalReleaseDate
      || musicSettings.musicFieldTADBAlbumSales || musicSettings.musicFieldTADBAlbumLabel
      || musicSettings.musicFieldTADBMood || musicSettings.musicFieldTADBTheme
      || musicSettings.musicFieldTADBFormat || musicSettings.musicFieldTADBTempo
      || musicSettings.musicFieldAlbumGrammy);
  }
  return !!(musicSettings.musicFieldMBTrackTags || musicSettings.musicFieldTrackOriginalReleaseDate
    || musicSettings.musicFieldTrackGrammy);
}

function musicEscapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function musicBuildEnrichRows(data){
  const rows=[];

  const wantsOriginalRelease = data.type === 'album' ? musicSettings.musicFieldAlbumOriginalReleaseDate : musicSettings.musicFieldTrackOriginalReleaseDate;
  if ((data.type === 'album' || data.type === 'track') && wantsOriginalRelease && data.musicbrainz?.originalReleaseDate) {
    rows.push(`<div class="qc-music-about-row qc-selectable"><b>Original Release</b><span>${musicEscapeHtml(data.musicbrainz.originalReleaseDate)}</span></div>`);
  }

  if (data.theaudiodb) {
    const t = data.theaudiodb;
    if (musicSettings.musicFieldTADBAlbumSales && t.intSales) {
      const salesVal = t.intSalesFormatted || musicFormatNumberLocal(t.intSales) || t.intSales;
      if (salesVal) rows.push(`<div class="qc-music-about-row qc-selectable"><b>Sales</b><span>${musicEscapeHtml(salesVal)} copies</span></div>`);
    }
    if (musicSettings.musicFieldTADBAlbumLabel && t.strLabel) {
      rows.push(`<div class="qc-music-about-row qc-selectable"><b>Label</b><span>${musicEscapeHtml(t.strLabel)}</span></div>`);
    }
    if (musicSettings.musicFieldTADBMood && t.strMood) {
      rows.push(`<div class="qc-music-about-row qc-selectable"><b>Mood</b><span>${musicEscapeHtml(t.strMood)}</span></div>`);
    }
    if (musicSettings.musicFieldTADBTheme && t.strTheme) {
      rows.push(`<div class="qc-music-about-row qc-selectable"><b>Theme</b><span>${musicEscapeHtml(t.strTheme)}</span></div>`);
    }

    if (musicSettings.musicFieldTADBTempo && t.strSpeed) {
      rows.push(`<div class="qc-music-about-row qc-selectable"><b>Tempo</b><span>${musicEscapeHtml(t.strSpeed)}</span></div>`);
    }
    if (musicSettings.musicFieldTADBFormat && t.strReleaseFormat) {
      rows.push(`<div class="qc-music-about-row qc-selectable"><b>Format</b><span>${musicEscapeHtml(t.strReleaseFormat)}</span></div>`);
    }

  }
  return rows;
}

function musicGeniusSearchUrl(artistName, trackName) {
  const q = [artistName, trackName].filter(Boolean).join(' ').trim();
  if (!q) return null;
  return 'https://genius.com/search?q=' + encodeURIComponent(q);
}

function musicLyricsSectionTitleHtml(data) {
  const url = data ? musicGeniusSearchUrl(data.artistName, data.name) : null;
  if (!url) return `<div class="qc-music-section-title">Lyrics</div>`;
  return `<button type="button" class="qc-link qc-music-section-title qc-music-lyrics-title-link" data-link="${musicEscapeHtml(url)}" title="Search lyrics on Genius">Lyrics ↗</button>`;
}

function musicWireLyricsSectionLinks(section) {
  if (!section) return;
  section.querySelectorAll('.qc-link[data-link]').forEach((btn) => {
    if (btn.dataset.qcWired === '1') return;
    btn.dataset.qcWired = '1';
    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      openLinkInNewTab(btn.getAttribute('data-link'));
    });
  });
}

function musicBuildGrammyHtml(data){
  const g = data?.grammy;
  if (!g || (!g.wins && !g.nominations)) return '';
  const winsHtml = g.wins > 0 ? `<div class="qc-music-stat-block qc-stat-win"><div class="qc-music-stat-num">${g.wins}×</div><div class="qc-music-stat-label">Grammy Wins</div></div>` : '';
  const nomHtml = g.nominations > 0 ? `<div class="qc-music-stat-block qc-stat-nom"><div class="qc-music-stat-num">${g.nominations}×</div><div class="qc-music-stat-label">Grammy Nominations</div></div>` : '';
  return `<div class="qc-music-section-title">Grammy Awards</div><div class="qc-music-stat-row">${winsHtml}${nomHtml}</div>`;
}

function musicBuildArtistDatesLine(tadb){
  if (!tadb) return '';
  const formed = tadb.intFormedYear || null;
  const born = tadb.intBornYear || null;
  const died = tadb.intDiedYear || null;
  if (!formed && !born) return '';
  const isBand = (formed && born && formed === born) || (formed && !born);
  if (isBand) return died ? `${formed}-${died}` : `${formed} -`;
  if (!born) return '';
  const age = (died || new Date().getFullYear()) - born;
  return died ? `Age: ${age} (${born} - ${died})` : `Age: ${age} (${born})`;
}

function musicBuildArtistFullHtml(data){
  const cover = data.artwork ? `<div class="qc-music-cover qc-music-cover-artist"><img src="${musicEscapeHtml(data.artwork)}" alt=""/></div>` : `<div class="qc-music-cover qc-music-cover-artist" style="background:#e7e8ec"></div>`;

  let aboutHtml = '';
  {
    const rows=[];
    if (data.about?.fans) {
      const fansFormatted = data.about.fansFormatted || data.nb_fan_formatted || musicFormatNumberLocal(data.about.fans) || data.about.fans;
      rows.push(`<div class="qc-music-about-row qc-selectable"><b>Fans on Deezer</b><span>${musicEscapeHtml(String(fansFormatted))}</span></div>`);
    }
    if (rows.length) aboutHtml = `<div class="qc-music-about">${rows.join('')}</div>`;
  }

  const enrichSlotHtml = (musicEnrichmentWillRun('artist') ? `<div id="qc-music-enrichment-slot" data-qc-enrich-pending="1" data-music-entity-type="artist" data-music-entity-name="${musicEscapeHtml(data.name||'')}"><div class="qc-music-enrich-loading">Loading extra info…</div></div>` : `<div id="qc-music-enrichment-slot"></div>`);
  let grammyHtml = '';
  if (musicSettings.musicFieldArtistGrammy && data.grammy && (data.grammy.wins || data.grammy.nominations)) {
    grammyHtml = musicBuildGrammyHtml(data);
  }

  const thumbImg = (id, extraStyle) => `<div style="width:40px;height:40px;border-radius:${extraStyle && extraStyle.circular ? '50%' : '6px'};background:#ececf0;overflow:hidden"><img data-qc-thumb="${musicEscapeHtml(String(id))}" alt="" style="width:40px;height:40px;${extraStyle && extraStyle.circular ? 'border-radius:50%;' : 'border-radius:6px;'}object-fit:cover;display:block"/></div>`;
  let albumsHtml = '';
  if (musicSettings.musicFieldArtistAlbums && data.albums?.length) {
    const vis = data.albums.slice(0,5);
    const coll = data.albums.slice(5);
    const visRows = vis.map(a=>`<div class="qc-music-list-row qc-nav-link" data-nav-kind="album" data-nav-id="${a.collectionId}">${a.artwork ? thumbImg(a.collectionId) : '<div style="width:40px;height:40px;border-radius:6px;background:#ececf0"></div>'}<div><div style="font-weight:600;font-size:12px">${musicEscapeHtml(a.collectionName)}</div><div class="qc-music-list-meta">${musicEscapeHtml(a.releaseYear||'')}</div></div><div class="qc-music-list-meta"></div></div>`).join('');
    const collRows = coll.map(a=>`<div class="qc-music-list-row qc-nav-link" data-nav-kind="album" data-nav-id="${a.collectionId}">${a.artwork ? thumbImg(a.collectionId) : '<div style="width:40px;height:40px;border-radius:6px;background:#ececf0"></div>'}<div><div style="font-weight:600;font-size:12px">${musicEscapeHtml(a.collectionName)}</div><div class="qc-music-list-meta">${musicEscapeHtml(a.releaseYear||'')}</div></div><div></div></div>`).join('');
    albumsHtml = `<div class="qc-music-section-title">Albums (${data.albums.length})</div><div class="qc-music-list">${visRows}</div>${coll.length?`<div class="qc-music-collapse" id="qc-albums-collapse">${collRows}</div><button class="qc-music-showmore" data-toggle="qc-albums-collapse">Show all ${data.albums.length} ▾</button>`:''}`;
  }
  let tracksHtml = '';
  if (musicSettings.musicFieldArtistTopTracks && data.topTracks?.length) {
    const vis = data.topTracks.slice(0,5);
    const coll = data.topTracks.slice(5);
    const visRows = vis.map(t=>`<div class="qc-music-list-row qc-nav-link" data-nav-kind="track" data-nav-id="${t.trackId}">${t.artwork ? thumbImg(t.trackId) : '<div style="width:40px;height:40px;border-radius:6px;background:#ececf0"></div>'}<div><div style="font-weight:600;font-size:12px">${musicEscapeHtml(t.trackName)}</div><div class="qc-music-list-meta">${musicEscapeHtml(t.collectionName||'')}</div></div><div class="qc-music-list-meta">${musicEscapeHtml(t.durationFormatted||'')}</div></div>`).join('');
    const collRows = coll.map(t=>`<div class="qc-music-list-row qc-nav-link" data-nav-kind="track" data-nav-id="${t.trackId}">${t.artwork ? thumbImg(t.trackId) : '<div style="width:40px;height:40px;border-radius:6px;background:#ececf0"></div>'}<div><div style="font-weight:600;font-size:12px">${musicEscapeHtml(t.trackName)}</div><div class="qc-music-list-meta">${musicEscapeHtml(t.collectionName||'')}</div></div><div class="qc-music-list-meta">${musicEscapeHtml(t.durationFormatted||'')}</div></div>`).join('');
    tracksHtml = `<div class="qc-music-section-title">Top Tracks</div><div class="qc-music-list">${visRows}</div>${coll.length?`<div class="qc-music-collapse" id="qc-tracks-collapse">${collRows}</div><button class="qc-music-showmore" data-toggle="qc-tracks-collapse">Show more (${coll.length}) ▾</button>`:''}`;
  }
  let similarHtml = '';
  if (musicSettings.musicFieldArtistSimilar && data.similarArtists?.length) {
    similarHtml = `<div class="qc-music-section-title">Similar Artists</div><div class="qc-music-list">`+data.similarArtists.map(s=>{
      const img = s.image ? thumbImg(s.artistId, { circular: true }) : `<div style="width:40px;height:40px;border-radius:50%;background:#ececf0;display:flex;align-items:center;justify-content:center;font-weight:700">${musicEscapeHtml((s.artistName||'')[0]||'?')}</div>`;
      const fansF = s.fans ? (musicFormatNumberLocal(s.fans) || s.fans) : '';
      return `<div class="qc-music-list-row qc-nav-link" data-nav-kind="artist" data-nav-id="${s.artistId}">${img}<div><div style="font-weight:600;font-size:12px">${musicEscapeHtml(s.artistName)}</div><div class="qc-music-list-meta">${fansF?`${fansF} fans`:''}</div></div><div class="qc-music-list-meta">Artist</div></div>`;
    }).join('')+`</div>`;
  }
  const siteLinksHtml = musicLinksHtml(data);

  const datesSlotHtml = musicSettings.musicFieldArtistFormed ? `<div id="qc-music-artist-dates-slot" class="qc-music-subline qc-selectable"></div>` : '';
  return `<div class="qc-music-hero"><div>${cover}</div><div class="qc-music-summary"><div class="name">${musicEscapeHtml(data.name)}</div><div>${datesSlotHtml}<span class="qc-music-badge">Artist</span>${(data.genres||[]).slice(0,3).map(g=>` <span class="qc-music-badge">${musicEscapeHtml(g)}</span>`).join('')}</div></div></div><div class="qc-music-body">${aboutHtml}<div id="qc-music-artist-bio-slot"></div>${enrichSlotHtml}${tracksHtml}${albumsHtml}${grammyHtml}${similarHtml}<div style="margin-top:12px">${siteLinksHtml}</div></div>`;
}

function musicBuildAlbumOrTrackEnrichHtml(data, mbTagsSetting){
  let mbTagsRow = '';
  if (mbTagsSetting && data.musicbrainz?.tags?.length) {
    mbTagsRow = `<div class="qc-music-about-row qc-selectable"><b>Tags</b><span>${musicEscapeHtml(data.musicbrainz.tags.join(', '))}</span></div>`;
  }

  const enrichRows = [mbTagsRow, ...musicBuildEnrichRows(data)].filter(Boolean);
  return enrichRows.length ? `<div class="qc-music-about">${enrichRows.join('')}</div>` : '';
}

function musicBuildAlbumFullHtml(data){
  const cover = data.artwork ? `<div class="qc-music-cover"><img src="${musicEscapeHtml(data.artwork)}" alt=""/></div>` : `<div class="qc-music-cover"></div>`;
  const subline = [data.artistName, data.releaseYear].filter(Boolean).join(' • ');

  const headerBadges = (data.genres&&data.genres.length?data.genres:[data.genre].filter(Boolean)).slice(0,4)
    .map(g=>`<span class="qc-music-badge">${musicEscapeHtml(g)}</span>`).join(' ');

  const enrichSlotHtml = (() => {
    const initial = musicBuildAlbumOrTrackEnrichHtml(data, musicSettings.musicFieldMBAlbumTags);
    if (initial && musicEnrichmentWillRun('album')) return `<div id="qc-music-enrichment-slot" data-qc-enrich-pending="1" data-music-entity-type="album" data-music-entity-name="${musicEscapeHtml(data.name||'')}" data-music-entity-upc="${musicEscapeHtml(data.upc||'')}">${initial}</div>`;
    if (initial) return `<div id="qc-music-enrichment-slot">${initial}</div>`;
    if (musicEnrichmentWillRun('album')) return `<div id="qc-music-enrichment-slot" data-qc-enrich-pending="1" data-music-entity-type="album" data-music-entity-name="${musicEscapeHtml(data.name||'')}" data-music-entity-upc="${musicEscapeHtml(data.upc||'')}"><div class="qc-music-enrich-loading">Loading extra info…</div></div>`;
    return `<div id="qc-music-enrichment-slot"></div>`;
  })();

  let grammyHtml = '';
  if (musicSettings.musicFieldAlbumGrammy && data.grammy && (data.grammy.wins || data.grammy.nominations)) {
    grammyHtml = musicBuildGrammyHtml(data);
  }

  const tracksHtml = musicSettings.musicFieldAlbumTracks && data.tracks?.length ? `<div class="qc-music-section-title">Tracks</div><div class="qc-music-list">${data.tracks.map(t=>{
    const num = t.trackNumber ? `<div class="qc-music-track-num">${musicEscapeHtml(String(t.trackNumber))}</div>` : '<div></div>';
    const thumbSrc = t.artwork || data.artworkSmall || data.artwork || '';
    const thumb = thumbSrc ? `<div style="width:40px;height:40px;border-radius:4px;background:#ececf0;overflow:hidden"><img data-qc-thumb="${musicEscapeHtml(String(t.trackId))}" alt="" style="width:40px;height:40px;border-radius:4px;object-fit:cover;display:block"/></div>` : '<div style="width:40px;height:40px;border-radius:4px;background:#ececf0"></div>';
    return `<div class="qc-music-list-row qc-music-tracklist-row qc-nav-link" data-nav-kind="track" data-nav-id="${t.trackId}">${num}${thumb}<div><div style="font-weight:600;font-size:12px">${musicEscapeHtml(t.trackName)}</div><div class="qc-music-list-meta">${musicEscapeHtml(t.artistName||'')}</div></div><div class="qc-music-list-meta">${musicEscapeHtml(t.durationFormatted||'')}</div></div>`;
  }).join('')}</div>`:'';
  return `<div class="qc-music-hero" data-music-album="${musicEscapeHtml(data.name||'')}" data-music-album-artist="${musicEscapeHtml(data.artistName||'')}"><div>${cover}</div><div class="qc-music-summary"><div class="name">${musicEscapeHtml(data.name)}</div><div class="qc-music-subline">${musicEscapeHtml(subline)}</div><div><span class="qc-music-badge">Album</span>${headerBadges?` ${headerBadges}`:''}</div></div></div><div class="qc-music-body"><div class="qc-music-grid">${musicSettings.musicFieldAlbumArtist && data.artistName ? `<div class="qc-music-fact"><b>Artist</b><span class="qc-nav-link" data-nav-kind="artist" data-nav-id="${data.artistId}">${musicEscapeHtml(data.artistName)}</span></div>`:''}${musicSettings.musicFieldAlbumGenre && data.genre ? `<div class="qc-music-fact"><b>Genre</b>${musicEscapeHtml(data.genre)}</div>`:''}${musicSettings.musicFieldAlbumReleaseDate && data.releaseYear ? `<div class="qc-music-fact"><b>Year</b>${musicEscapeHtml(data.releaseYear)}</div>`:''}${musicSettings.musicFieldAlbumTrackCount && data.trackCount ? `<div class="qc-music-fact"><b>Tracks</b>${data.trackCount}</div>`:''}</div>${enrichSlotHtml}${tracksHtml}${grammyHtml}<div style="margin-top:12px">${musicLinksHtml(data)}</div></div>`;
}

function musicBuildTrackFullHtml(data){
  const cover = data.artwork ? `<div class="qc-music-cover"><img src="${musicEscapeHtml(data.artwork)}" alt=""/></div>` : `<div class="qc-music-cover"></div>`;
  const subline = [data.artistName, data.albumName].filter(Boolean).join(' \u2022 ');
  const headerBadges = (data.genres||[]).slice(0,3).map(g=>`<span class="qc-music-badge">${musicEscapeHtml(g)}</span>`).join(' ');

  const enrichSlotHtml = (() => {
    const initial = musicBuildAlbumOrTrackEnrichHtml(data, musicSettings.musicFieldMBTrackTags);
    if (initial && musicEnrichmentWillRun('track')) return `<div id="qc-music-enrichment-slot" data-qc-enrich-pending="1" data-music-entity-type="track" data-music-entity-name="${musicEscapeHtml(data.name||'')}" data-music-entity-artist="${musicEscapeHtml(data.artistName||'')}" data-music-entity-isrc="${musicEscapeHtml(data.isrc||'')}">${initial}</div>`;
    if (initial) return `<div id="qc-music-enrichment-slot">${initial}</div>`;
    if (musicEnrichmentWillRun('track')) return `<div id="qc-music-enrichment-slot" data-qc-enrich-pending="1" data-music-entity-type="track" data-music-entity-name="${musicEscapeHtml(data.name||'')}" data-music-entity-artist="${musicEscapeHtml(data.artistName||'')}" data-music-entity-isrc="${musicEscapeHtml(data.isrc||'')}"><div class="qc-music-enrich-loading">Loading extra info…</div></div>`;
    return `<div id="qc-music-enrichment-slot"></div>`;
  })();
  let grammyHtml = '';
  if (musicSettings.musicFieldTrackGrammy && data.grammy && (data.grammy.wins || data.grammy.nominations)) {
    grammyHtml = musicBuildGrammyHtml(data);
  }
  let lyricsHtml = '';
  if (musicSettings.musicFieldTrackLyrics) {

    lyricsHtml = `<div id="qc-music-lyrics-section">${musicLyricsSectionTitleHtml(data)}<div id="qc-music-lyrics-slot" class="qc-music-lyrics-loading">Loading lyrics...</div></div>`;
  }
  return `<div class="qc-music-hero" data-music-artist="${musicEscapeHtml(data.artistName||'')}" data-music-track="${musicEscapeHtml(data.name||'')}"><div>${cover}</div><div class="qc-music-summary"><div class="name">${musicEscapeHtml(data.name)}</div><div class="qc-music-subline">${musicEscapeHtml(subline)}</div><div><span class="qc-music-badge">Track</span>${headerBadges?` ${headerBadges}`:''}</div></div></div><div class="qc-music-body"><div class="qc-music-grid">${musicSettings.musicFieldTrackArtist && data.artistName ? `<div class="qc-music-fact"><b>Artist</b><span class="qc-nav-link" data-nav-kind="artist" data-nav-id="${data.artistId}">${musicEscapeHtml(data.artistName)}</span></div>`:''}${musicSettings.musicFieldTrackAlbum && data.albumName ? `<div class="qc-music-fact"><b>Album</b><span class="qc-nav-link" data-nav-kind="album" data-nav-id="${data.collectionId}">${musicEscapeHtml(data.albumName)}</span></div>`:''}${musicSettings.musicFieldTrackReleaseDate && data.releaseYear ? `<div class="qc-music-fact"><b>Year</b>${musicEscapeHtml(data.releaseYear)}</div>`:''}${musicSettings.musicFieldTrackDuration && data.durationFormatted ? `<div class="qc-music-fact"><b>Duration</b>${musicEscapeHtml(data.durationFormatted)}</div>`:''}${musicSettings.musicFieldTrackTempo && data.bpm ? `<div class="qc-music-fact"><b>Tempo</b>${musicEscapeHtml(String(data.bpm))} BPM</div>`:''}</div>${enrichSlotHtml}${grammyHtml}${musicSettings.musicFieldTrackPreview && data.previewUrl ? `<div style="margin-top:10px"><audio controls src="${musicEscapeHtml(data.previewUrl)}" style="width:100%"></audio></div>`:''}${lyricsHtml}<div style="margin-top:12px">${musicLinksHtml(data)}</div></div>`;
}

function musicBuildFullHtml(data){
  if (!data || !data.type) return '<div class="loading">No data</div>';
  if (data.type==='artist') return musicBuildArtistFullHtml(data);
  if (data.type==='album') return musicBuildAlbumFullHtml(data);
  if (data.type==='track') return musicBuildTrackFullHtml(data);
  return '<div class="loading">Unknown type</div>';
}

function musicBuildMiniCollapseList(items, kind, nameKey, subFn, titleOverride){
  if (!items || !items.length) return '';
  const rows = items.map(it=>{
    const id = kind==='album' ? it.collectionId : (kind==='track' ? it.trackId : it.artistId);
    const sub = subFn ? subFn(it) : '';
    return `<div class="qc-nav-link" data-nav-kind="${kind}" data-nav-id="${musicEscapeHtml(String(id))}" style="display:flex!important;justify-content:space-between!important;gap:8px!important;padding:3px 0!important;font-size:11.5px!important;"><span style="font-weight:600;">${musicEscapeHtml(it[nameKey]||'')}</span><span style="color:#7b7c82;white-space:nowrap;">${sub}</span></div>`;
  }).join('');

  const miniListTitle = titleOverride || (kind === 'album' ? 'Albums' : (kind === 'track' ? 'Tracks' : 'Artists'));
  return `<details style="margin-top:6px!important;"><summary class="qc-music-summary-toggle">${miniListTitle}</summary>${rows}</details>`;
}

function musicBuildArtistMiniHtml(data){
  const cover = data.artwork ? `<div class="qc-music-cover qc-music-cover-artist"><img src="${musicEscapeHtml(data.artwork)}" alt=""/></div>` : `<div class="qc-music-cover qc-music-cover-artist" style="background:#e7e8ec"></div>`;
  let aboutHtml = '';
  if (data.about?.fans) {
    const fansFormatted = data.about.fansFormatted || data.nb_fan_formatted || musicFormatNumberLocal(data.about.fans) || data.about.fans;
    aboutHtml = `<div class="qc-music-about"><div class="qc-music-about-row qc-selectable"><b>Fans on Deezer</b><span>${musicEscapeHtml(String(fansFormatted))}</span></div></div>`;
  }

  const albumsMini = musicSettings.musicFieldArtistAlbums ? musicBuildMiniCollapseList(data.albums, 'album', 'collectionName', a=>a.releaseYear||'') : '';
  const tracksMini = musicSettings.musicFieldArtistTopTracks ? musicBuildMiniCollapseList(data.topTracks, 'track', 'trackName', t=>t.durationFormatted||'', 'Top Tracks') : '';

  const bioSlotHtml = musicSettings.musicFieldArtistBio ? `<div id="qc-music-artist-bio-slot"></div>` : '';
  const enrichSlotHtml = (musicEnrichmentWillRun('artist') ? `<div id="qc-music-enrichment-slot" data-qc-enrich-pending="1" data-music-entity-type="artist" data-music-entity-name="${musicEscapeHtml(data.name||'')}"><div class="qc-music-enrich-loading">Loading extra info…</div></div>` : `<div id="qc-music-enrichment-slot"></div>`);

  const datesSlotHtml = musicSettings.musicFieldArtistFormed ? `<div id="qc-music-artist-dates-slot" class="qc-music-subline qc-selectable"></div>` : '';
  return `<div class="qc-music-hero"><div>${cover}</div><div class="qc-music-summary"><div class="name">${musicEscapeHtml(data.name)}</div><div>${datesSlotHtml}<span class="qc-music-badge">Artist</span>${(data.genres||[]).slice(0,3).map(g=>` <span class="qc-music-badge">${musicEscapeHtml(g)}</span>`).join('')}</div></div></div><div class="qc-music-body">${aboutHtml}${bioSlotHtml}${enrichSlotHtml}<div class="qc-music-grid">${musicSettings.musicFieldAlbumTrackCount && data.albumCount ? `<div class="qc-music-fact"><b>Albums</b>${data.albumCount}</div>`:''}</div>${albumsMini}${tracksMini}<div style="margin-top:12px">${musicLinksHtml(data)}</div></div>`;
}

function musicBuildAlbumMiniHtml(data){
  const cover = data.artwork ? `<div class="qc-music-cover"><img src="${musicEscapeHtml(data.artwork)}" alt=""/></div>` : `<div class="qc-music-cover"></div>`;
  const subline = [data.artistName, data.releaseYear].filter(Boolean).join(' • ');
  const headerBadges = (data.genres&&data.genres.length?data.genres:[data.genre].filter(Boolean)).slice(0,4)
    .map(g=>`<span class="qc-music-badge">${musicEscapeHtml(g)}</span>`).join(' ');

  const tracksMini = musicSettings.musicFieldAlbumTracks ? musicBuildMiniCollapseList(data.tracks, 'track', 'trackName', t=>t.durationFormatted||'') : '';

  const enrichSlotHtml = (() => {
    const initial = musicBuildAlbumOrTrackEnrichHtml(data, musicSettings.musicFieldMBAlbumTags);
    if (initial && musicEnrichmentWillRun('album')) return `<div id="qc-music-enrichment-slot" data-qc-enrich-pending="1" data-music-entity-type="album" data-music-entity-name="${musicEscapeHtml(data.name||'')}" data-music-entity-upc="${musicEscapeHtml(data.upc||'')}">${initial}</div>`;
    if (initial) return `<div id="qc-music-enrichment-slot">${initial}</div>`;
    if (musicEnrichmentWillRun('album')) return `<div id="qc-music-enrichment-slot" data-qc-enrich-pending="1" data-music-entity-type="album" data-music-entity-name="${musicEscapeHtml(data.name||'')}" data-music-entity-upc="${musicEscapeHtml(data.upc||'')}"><div class="qc-music-enrich-loading">Loading extra info…</div></div>`;
    return `<div id="qc-music-enrichment-slot"></div>`;
  })();
  return `<div class="qc-music-hero" data-music-album="${musicEscapeHtml(data.name||'')}" data-music-album-artist="${musicEscapeHtml(data.artistName||'')}"><div>${cover}</div><div class="qc-music-summary"><div class="name">${musicEscapeHtml(data.name)}</div><div class="qc-music-subline">${musicEscapeHtml(subline)}</div><div><span class="qc-music-badge">Album</span>${headerBadges?` ${headerBadges}`:''}</div></div></div><div class="qc-music-body"><div class="qc-music-grid">${musicSettings.musicFieldAlbumArtist && data.artistName ? `<div class="qc-music-fact"><b>Artist</b><span class="qc-nav-link" data-nav-kind="artist" data-nav-id="${data.artistId}">${musicEscapeHtml(data.artistName)}</span></div>`:''}${musicSettings.musicFieldAlbumGenre && data.genre ? `<div class="qc-music-fact"><b>Genre</b>${musicEscapeHtml(data.genre)}</div>`:''}${musicSettings.musicFieldAlbumReleaseDate && data.releaseYear ? `<div class="qc-music-fact"><b>Year</b>${musicEscapeHtml(data.releaseYear)}</div>`:''}${musicSettings.musicFieldAlbumTrackCount && data.trackCount ? `<div class="qc-music-fact"><b>Tracks</b>${data.trackCount}</div>`:''}</div>${enrichSlotHtml}${tracksMini}<div style="margin-top:12px">${musicLinksHtml(data)}</div></div>`;
}

function musicBuildTrackMiniHtml(data){
  const cover = data.artwork ? `<div class="qc-music-cover"><img src="${musicEscapeHtml(data.artwork)}" alt=""/></div>` : `<div class="qc-music-cover"></div>`;
  const subline = [data.artistName, data.albumName].filter(Boolean).join(' • ');
  const headerBadges = (data.genres||[]).slice(0,3).map(g=>`<span class="qc-music-badge">${musicEscapeHtml(g)}</span>`).join(' ');

  const enrichSlotHtml = (() => {
    const initial = musicBuildAlbumOrTrackEnrichHtml(data, musicSettings.musicFieldMBTrackTags);
    if (initial && musicEnrichmentWillRun('track')) return `<div id="qc-music-enrichment-slot" data-qc-enrich-pending="1" data-music-entity-type="track" data-music-entity-name="${musicEscapeHtml(data.name||'')}" data-music-entity-artist="${musicEscapeHtml(data.artistName||'')}" data-music-entity-isrc="${musicEscapeHtml(data.isrc||'')}">${initial}</div>`;
    if (initial) return `<div id="qc-music-enrichment-slot">${initial}</div>`;
    if (musicEnrichmentWillRun('track')) return `<div id="qc-music-enrichment-slot" data-qc-enrich-pending="1" data-music-entity-type="track" data-music-entity-name="${musicEscapeHtml(data.name||'')}" data-music-entity-artist="${musicEscapeHtml(data.artistName||'')}" data-music-entity-isrc="${musicEscapeHtml(data.isrc||'')}"><div class="qc-music-enrich-loading">Loading extra info…</div></div>`;
    return `<div id="qc-music-enrichment-slot"></div>`;
  })();

  const previewHtml = musicSettings.musicFieldTrackPreview && data.previewUrl ? `<div style="margin-top:10px"><audio controls src="${musicEscapeHtml(data.previewUrl)}" style="width:100%"></audio></div>` : '';
  return `<div class="qc-music-hero" data-music-artist="${musicEscapeHtml(data.artistName||'')}" data-music-track="${musicEscapeHtml(data.name||'')}"><div>${cover}</div><div class="qc-music-summary"><div class="name">${musicEscapeHtml(data.name)}</div><div class="qc-music-subline">${musicEscapeHtml(subline)}</div><div><span class="qc-music-badge">Track</span>${headerBadges?` ${headerBadges}`:''}</div></div></div><div class="qc-music-body"><div class="qc-music-grid">${musicSettings.musicFieldTrackArtist && data.artistName ? `<div class="qc-music-fact"><b>Artist</b><span class="qc-nav-link" data-nav-kind="artist" data-nav-id="${data.artistId}">${musicEscapeHtml(data.artistName)}</span></div>`:''}${musicSettings.musicFieldTrackAlbum && data.albumName ? `<div class="qc-music-fact"><b>Album</b><span class="qc-nav-link" data-nav-kind="album" data-nav-id="${data.collectionId}">${musicEscapeHtml(data.albumName)}</span></div>`:''}${musicSettings.musicFieldTrackReleaseDate && data.releaseYear ? `<div class="qc-music-fact"><b>Year</b>${musicEscapeHtml(data.releaseYear)}</div>`:''}${musicSettings.musicFieldTrackDuration && data.durationFormatted ? `<div class="qc-music-fact"><b>Duration</b>${musicEscapeHtml(data.durationFormatted)}</div>`:''}${musicSettings.musicFieldTrackTempo && data.bpm ? `<div class="qc-music-fact"><b>Tempo</b>${musicEscapeHtml(String(data.bpm))} BPM</div>`:''}</div>${enrichSlotHtml}${previewHtml}<div style="margin-top:12px">${musicLinksHtml(data)}</div></div>`;
}

function musicBuildMiniHtml(data){
  if (!data || !data.type) return '<div class="loading">No data</div>';
  if (data.type==='artist') return musicBuildArtistMiniHtml(data);
  if (data.type==='album') return musicBuildAlbumMiniHtml(data);
  if (data.type==='track') return musicBuildTrackMiniHtml(data);
  return '<div class="loading">Unknown type</div>';
}

function musicCardBuilders(){
  const isFull=getPopupStyleClass()==='qc-style-full';
  return { build:isFull?musicBuildFullHtml:musicBuildMiniHtml, isFull };
}

function wireMusicNavLinks(){
  setTimeout(()=>{
    wireMusicCollapseToggles();
  },50);
}

const musicWiredToggleButtons = new WeakSet();
function wireMusicCollapseToggles(){

  const popup = selectionPopupEl && selectionPopupEl.isConnected ? selectionPopupEl : null;
  if (!popup) return;
  popup.querySelectorAll('[data-toggle]').forEach(btn=>{
    if (musicWiredToggleButtons.has(btn)) return;
    musicWiredToggleButtons.add(btn);
    btn.addEventListener('click', ()=>{
      const target = popup.querySelector(`#${btn.getAttribute('data-toggle')}`);
      if (!target) return;
      const exp = target.classList.toggle('qc-expanded');
      btn.textContent = exp ? 'Show less \u25B4' : `Show all ${target.children.length} \u25BE`;
    });
  });
}

registerCardRestoredHandler((themeClass) => {
  if (themeClass !== MUSIC_THEME_CLASS) return;
  setTimeout(()=>wireMusicCollapseToggles(), 50);
});

registerCardRestoredHandler((themeClass) => {
  if (themeClass !== MUSIC_THEME_CLASS) return;
  const slot = selectionPopupEl?.querySelector('#qc-music-enrichment-slot[data-qc-enrich-pending="1"]');
  if (!slot) return;
  const type = slot.getAttribute('data-music-entity-type');
  if (!type) return;
  const name = slot.getAttribute('data-music-entity-name') || '';
  const artistName = slot.getAttribute('data-music-entity-artist') || '';
  const upc = slot.getAttribute('data-music-entity-upc') || '';
  const isrc = slot.getAttribute('data-music-entity-isrc') || '';
  const token = navBeginRender();
  musicLoadEnrichmentSlot({ type, name, artistName, upc, isrc }, token);
});

function musicNavigateById(kind, id) {
  if (!id) return;
  setActivePack(MUSIC_PACK_ID);
  updateSelectionPopup('<div class="loading">Loading...</div>', false, MUSIC_THEME_CLASS);
  if (kind === 'artist') renderMusicArtistCard(id, '');
  else if (kind === 'album') renderMusicAlbumCard(id, '');
  else if (kind === 'track') renderMusicTrackCard(id, '');
}

async function musicLoadEnrichmentSlot(data, navToken){
  const entityType = data?.type;
  if (!entityType) return;

  if (!musicEnrichmentWillRun(entityType)) {
    const idleSlot = selectionPopupEl && selectionPopupEl.isConnected
      ? selectionPopupEl.querySelector('#qc-music-enrichment-slot')
      : null;
    if (idleSlot) {
      idleSlot.removeAttribute('data-qc-enrich-pending');
      if (idleSlot.querySelector('.qc-music-enrich-loading')) idleSlot.innerHTML = '';
    }
    return;
  }
  const payload = { name:data.name, artistName:data.artistName||'', upc:data.upc||null, isrc:data.isrc||null };
  const res = await fetchMusicEnrichment(entityType, payload);
  if (navToken !== undefined && !navIsTokenCurrent(navToken)) return;
  if (!selectionPopupEl || !selectionPopupEl.isConnected) return;
  const slot = selectionPopupEl.querySelector('#qc-music-enrichment-slot');
  if (!slot) return;

  slot.removeAttribute('data-qc-enrich-pending');
  if (!res || !res.ok) {

    if (slot.querySelector('.qc-music-enrich-loading')) {
      slot.innerHTML = `<div class="qc-music-enrich-error">${res && res.timedOut ? 'Timed out loading extra info' : "Couldn't load extra info"}</div>`;
      navRefreshLastRenderedCardHtml();
    }
    return;
  }

  const artistBio = res.theaudiodb?.strBiography;
  if (entityType==='artist' && artistBio) {
    const bioSlot = selectionPopupEl.querySelector('#qc-music-artist-bio-slot');
    if (bioSlot) {
      const threshold=160;

      bioSlot.innerHTML = (artistBio.length>threshold)
        ? `<div class="qc-music-section-title">Biography</div><details><summary class="qc-music-text-teaser qc-selectable"><span class="qc-music-text-body">${musicEscapeHtml(artistBio)}</span><span class="qc-music-text-toggle qc-music-text-toggle-more">Show more ▾</span><span class="qc-music-text-toggle qc-music-text-toggle-less">Show less ▴</span></summary></details>`
        : `<div class="qc-music-section-title">Biography</div><div class="qc-selectable" style="font-size:12px!important;line-height:1.55!important;white-space:pre-wrap!important;">${musicEscapeHtml(artistBio)}</div>`;
    }
  }

  if (entityType==='artist' && musicSettings.musicFieldArtistFormed) {
    const datesSlot = selectionPopupEl.querySelector('#qc-music-artist-dates-slot');
    if (datesSlot) datesSlot.textContent = musicBuildArtistDatesLine(res.theaudiodb);
  }

  const merged = { ...data, musicbrainz: res.musicbrainz, theaudiodb: res.theaudiodb, grammy: res.grammy, enrichLoaded: true };
  let html = '';
  let rows = [];

  const mbErrored = merged.musicbrainz && merged.musicbrainz.error === 'service_unavailable';
  const mbErrorHtml = mbErrored
    ? `<div class="qc-music-about"><div class="qc-music-enrich-error">MusicBrainz: internal error</div><div style="margin-top:6px"><button class="qc-retry-btn">Retry</button></div></div>`
    : '';
  if (entityType === 'artist') {

    const mb = mbErrored ? null : merged.musicbrainz;
    if (mb) {
      if (musicSettings.musicFieldArtistCountry && mb.country) {
        rows.push(`<div class="qc-music-about-row qc-selectable"><b>Country</b><span>${musicEscapeHtml(mb.country)}</span></div>`);
      }
      if (musicSettings.musicFieldMBArtistTags && mb.tags?.length) {
        rows.push(`<div class="qc-music-about-row qc-selectable"><b>Tags</b><span>${musicEscapeHtml(mb.tags.join(', '))}</span></div>`);
      }
    }
  } else {
    let mbTagsRow = '';
    const mbTagsOn = entityType==='album' ? musicSettings.musicFieldMBAlbumTags : musicSettings.musicFieldMBTrackTags;
    const mb = mbErrored ? null : merged.musicbrainz;
    if (mbTagsOn && mb?.tags?.length) {
      mbTagsRow = `<div class="qc-music-about-row qc-selectable"><b>Tags</b><span>${musicEscapeHtml(mb.tags.join(', '))}</span></div>`;
    }
    rows = [mbTagsRow, ...musicBuildEnrichRows(mbErrored ? { ...merged, musicbrainz: null } : merged)];
  }
  rows = rows.filter(Boolean);
  if (rows.length) html += `<div class="qc-music-about">${rows.join('')}</div>`;
  html += mbErrorHtml;

  {
    const gOn = entityType==='artist' ? musicSettings.musicFieldArtistGrammy
      : entityType==='album' ? musicSettings.musicFieldAlbumGrammy
      : musicSettings.musicFieldTrackGrammy;
    if (gOn && merged.grammy && (merged.grammy.wins || merged.grammy.nominations)) {
      html += musicBuildGrammyHtml(merged);
    }
  }

  if (html) {
    slot.innerHTML = html;
    if (mbErrored) {

      lastRetryFn = () => {
        slot.setAttribute('data-qc-enrich-pending', '1');
        slot.innerHTML = `<div class="qc-music-enrich-loading">Loading extra info…</div>`;
        musicLoadEnrichmentSlot(data, navToken);
      };
      bindPopupButtons(selectionPopupEl);
    }
  }
  else slot.remove();

  reStampSelectableClasses(selectionPopupEl);

  navRefreshLastRenderedCardHtml();
}

async function musicResolveArtworkAndRender(navToken, data, banner) {

  await new Promise((resolve) => {
    resolveImageUrl(data.artwork, (resolved) => {
      data.artwork = resolved;
      resolve();
    });
  });
  if (!navIsTokenCurrent(navToken)) return false;
  const { build } = musicCardBuilders();
  updateSelectionPopup(`${banner}${build(data)}`,false); wireMusicNavLinks();
  return true;
}
async function renderMusicArtistCard(id,banner=''){
  const navToken = navBeginRender();

  navSetRerenderFn(()=>renderMusicArtistCard(id, banner));
  const r = await fetchMusicArtistDetails(id);
  if (!navIsTokenCurrent(navToken)) return;
  if (!r||!r.ok){ updateSelectionPopup(`${banner}<div class="loading">Couldn't load artist</div>`,false); return; }
  if (!(await musicResolveArtworkAndRender(navToken, r.data, banner))) return;

  musicLoadEnrichmentSlot(r.data, navToken);

  musicLoadListThumbs(r.data, navToken);
}
async function renderMusicAlbumCard(id,banner=''){
  const navToken = navBeginRender();
  navSetRerenderFn(()=>renderMusicAlbumCard(id, banner));
  const r = await fetchMusicAlbumDetails(id);
  if (!navIsTokenCurrent(navToken)) return;
  if (!r||!r.ok){ updateSelectionPopup(`${banner}<div class="loading">Couldn't load album</div>`,false); return; }
  if (!(await musicResolveArtworkAndRender(navToken, r.data, banner))) return;
  musicLoadEnrichmentSlot(r.data, navToken);
  musicLoadListThumbs(r.data, navToken);
}
async function renderMusicTrackCard(id,banner=''){
  const navToken = navBeginRender();
  navSetRerenderFn(()=>renderMusicTrackCard(id, banner));
  const r = await fetchMusicTrackDetails(id);
  if (!navIsTokenCurrent(navToken)) return;
  if (!r||!r.ok){ updateSelectionPopup(`${banner}<div class="loading">Couldn't load track</div>`,false); return; }
  if (!(await musicResolveArtworkAndRender(navToken, r.data, banner))) return;
  const { isFull } = musicCardBuilders();
  musicLoadEnrichmentSlot(r.data, navToken);

  if (isFull && musicSettings.musicFieldTrackLyrics) musicLoadLyricsSlot(r.data, navToken);
}

async function musicLoadLyricsSlot(data, navToken){
  const artistName = data?.artistName || '';
  const trackName = data?.name || '';
  if (!artistName || !trackName) return;
  const res = await fetchMusicTrackLyrics(artistName, trackName);
  if (navToken !== undefined && !navIsTokenCurrent(navToken)) return;
  if (!selectionPopupEl || !selectionPopupEl.isConnected) return;
  const section = selectionPopupEl.querySelector('#qc-music-lyrics-section');
  if (!section) return;
  if (res && res.ok && res.lyrics) {
    section.innerHTML = `${musicLyricsSectionTitleHtml(data)}<div class="qc-music-lyrics-box">${musicEscapeHtml(res.lyrics)}</div>`;
    reStampSelectableClasses(selectionPopupEl);
    musicWireLyricsSectionLinks(section);
  } else if (res && res.ok) {
    section.remove();
  } else {

    section.innerHTML = `${musicLyricsSectionTitleHtml(data)}<div class="qc-music-lyrics-loading qc-music-enrich-error">${res && res.timedOut ? 'Timed out loading lyrics' : "Couldn't load lyrics"}</div>`;
    musicWireLyricsSectionLinks(section);
  }

  navRefreshLastRenderedCardHtml();
}

registerCardRestoredHandler((themeClass) => {
  if (themeClass !== MUSIC_THEME_CLASS) return;
  const hero = selectionPopupEl?.querySelector('[data-music-track]');
  if (!hero) return;
  const loadingSlot = selectionPopupEl.querySelector('#qc-music-lyrics-slot');
  if (!loadingSlot) return;
  const artistName = hero.getAttribute('data-music-artist') || '';
  const trackName = hero.getAttribute('data-music-track') || '';
  if (!trackName) return;
  const token = navBeginRender();
  musicLoadLyricsSlot({ artistName, name: trackName }, token);
});

function describeMusicCandidate(c){
  const type = c.type ? c.type.charAt(0).toUpperCase()+c.type.slice(1) : '';
  const parts=[]; if(type) parts.push(type); if(c.description) parts.push(c.description);
  return { name:c.label, image:c.image, subParts:parts };
}
const MUSIC_NETWORK_RETRY_DELAYS_MS=[700,1400];
let musicSearchToken=null;

async function runMusicSearch(query, token, attempt=0, trans=null, sessionNavToken=null){
  const banner = trans ? `<div class="qc-translation-banner">Translated from "${escapeHtml(trans.original)}" \u2192 "${escapeHtml(trans.translated)}"</div>` : '';
  const res = await fetchMusicSearch(query);
  if (musicSearchToken!==token) return;
  if (sessionNavToken!==null&&!navIsTokenCurrent(sessionNavToken)) return;
  if (!selectionPopupEl) return;
  const isNet = !!(res && res.ok===false && res.reason==='network');
  if (isNet && attempt < MUSIC_NETWORK_RETRY_DELAYS_MS.length){
    updateSelectionPopup(`<div class="loading">Network error \u2014 retrying...</div>`,false);
    setTimeout(()=>runMusicSearch(query,token,attempt+1,trans,sessionNavToken), MUSIC_NETWORK_RETRY_DELAYS_MS[attempt]); return;
  }
  if (!res||!res.ok||!res.candidates?.length){

    if (isNet) {
      lastRetryFn = () => runMusicSearch(query, token, 0, trans, sessionNavToken);
      updateSelectionPopup(`${banner}<div class="loading">No response from Deezer (network error)</div><div><button class="qc-retry-btn">Retry</button></div>`, false);
    } else {
      updateSelectionPopup(`${banner}<div class="loading">No music found.</div>`,false);
    }
    return;
  }
  if (res.candidates.length===1){
    const ch=res.candidates[0];
    if (ch.type==='artist') await renderMusicArtistCard(ch.artistId||ch.id,banner);
    else if (ch.type==='album') await renderMusicAlbumCard(ch.collectionId||ch.id,banner);
    else await renderMusicTrackCard(ch.trackId||ch.id,banner);
    return;
  }
  showDisambiguationPicker(res.candidates, describeMusicCandidate, ch=>{
    updateSelectionPopup('<div class="loading">Loading...</div>',false);

    if (ch.type==='artist') renderMusicArtistCard(ch.artistId||ch.id,banner);
    else if (ch.type==='album') renderMusicAlbumCard(ch.collectionId||ch.id,banner);
    else renderMusicTrackCard(ch.trackId||ch.id,banner);
  }, banner);
}
async function musicLaunchSearch(query, left, top){
  if (!query) return;
  setActivePack(MUSIC_PACK_ID);
  showSelectionPopupAt(MUSIC_THEME_CLASS, left, top, '<div class="loading">Searching...</div>', false);
  const token = `${Date.now()}${Math.random()}`;
  musicSearchToken = token;

  const launchNavToken=navGuardToken();

  if (QUICKCARD_ABBREVIATION_PATTERN.test(query)) {
    const res = await quickcardResolveAbbreviation(query);
    if (musicSearchToken !== token) return;
    if (res.type === 'direct' && res.title) {
      return runMusicSearch(res.title, token, 0, null, launchNavToken);
    }
    if (res.type === 'choices' && res.options && res.options.length) {
      quickcardShowAbbreviationPicker(MUSIC_THEME_CLASS, res.options, (title) => {
        runMusicSearch(title, token, 0, null, launchNavToken);
      }, query);
      return;
    }
  }

  const lang = (typeof detectNonLatinLangCode==='function') ? detectNonLatinLangCode(query) : null;
  if (!lang){ await runMusicSearch(query,token,0,null,launchNavToken); return; }
  updateSelectionPopup('<div class="loading">Translating...</div>',false);
  translateSelectionText(query, lang, res=>{
    if (musicSearchToken!==token) return;
    if (!navIsTokenCurrent(launchNavToken)) return;

    if (!res||!res.ok||!res.translatedText){
      if (res && res.networkError) {
        lastRetryFn = () => musicLaunchSearch(query, left, top);
        updateSelectionPopup('<div class="loading">Network error while translating</div><div><button class="qc-retry-btn">Retry</button></div>', false);
      } else {
        updateSelectionPopup(buildTranslationFailureHtml(query), false);
      }
      return;
    }
    const { text:clean } = cleanTranslatedText(res.translatedText);
    if (!clean){ updateSelectionPopup(buildTranslationFailureHtml(query), false); return; }
    runMusicSearch(clean,token,0,{ original:query, translated:clean }, launchNavToken);
  });
}
function handleMusicExternalSearch(raw,left,top){
  const q = sanitizeSelectionText(raw);
  if (!q) return;
  navClearHistory(); musicLaunchSearch(q,left,top);
}

function parseDeezerUrl(href) {
  try {
    const u = new URL(href, location.href);
    if (!u.hostname.includes('deezer.com')) return null;

    const m = u.pathname.match(/\/(artist|album|track)\/(\d+)/i);
    if (!m) return null;
    return { type: m[1].toLowerCase(), id: m[2] };
  } catch (e) {
    return null;
  }
}

const MUSIC_HOVER_CACHE = new Map();
function getMusicHoverCacheEntry(key) {
  if (!MUSIC_HOVER_CACHE.has(key)) MUSIC_HOVER_CACHE.set(key, {});
  return MUSIC_HOVER_CACHE.get(key);
}

let musicHoverTimer = null;

function attachMusicHover(anchor) {
  if (anchor.__quickcardMusicBound) return;
  const info = parseDeezerUrl(anchor.href);
  if (!info) return;
  anchor.__quickcardMusicBound = true;

  anchor.addEventListener('mouseenter', () => {
    if (!coreSettings.featureLinkHover) return;

    clearTimeout(hoverHideTimer);
    clearTimeout(hoverRemoveTimer);
    clearTimeout(musicHoverTimer);

    currentAnchor = anchor;

    musicHoverTimer = setTimeout(() => {
      if (currentAnchor !== anchor) return;

      const myHoverToken = ++hoverRequestToken;
      setActivePack(MUSIC_PACK_ID);

      const cacheKey = `${info.type}:${info.id}`;
      const fetchFn = info.type === 'artist' ? fetchMusicArtistDetails
        : info.type === 'album' ? fetchMusicAlbumDetails
        : fetchMusicTrackDetails;

      const renderMusicHover = (skipCache) => {
        showPopup(MUSIC_THEME_CLASS, anchor, '<div class="loading">Loading...</div>', false);

        const cacheEntry = getMusicHoverCacheEntry(cacheKey);

        if (!skipCache && cacheEntry.finalHtml) {
          if (myHoverToken === hoverRequestToken && hoverPopupEl) showPopup(MUSIC_THEME_CLASS, anchor, cacheEntry.finalHtml, false);
          return;
        }

        fetchFn(info.id).then((response) => {
          if (myHoverToken !== hoverRequestToken || !hoverPopupEl) return;

          if (!response || !response.ok) {
            showPopup(MUSIC_THEME_CLASS, anchor, `<div class="loading">Couldn't load that ${musicEscapeHtml(info.type)}.</div>`, false);
            return;
          }

          const data = response.data;

          resolveImageUrl(data.artwork, (resolved) => {
            if (myHoverToken !== hoverRequestToken || !hoverPopupEl) return;
            data.artwork = resolved;
            const { build } = musicCardBuilders();
            const html = build(data);

            showPopup(MUSIC_THEME_CLASS, anchor, html, false);
            musicResolveHoverThumbs(data, myHoverToken, cacheEntry, anchor);
          });
        });
      };
      navSetRerenderFn(() => renderMusicHover(true));
      renderMusicHover(false);
    }, 350);
  });

  anchor.addEventListener('mouseleave', () => {
    clearTimeout(musicHoverTimer);
    if (currentAnchor === anchor) currentAnchor = null;
    scheduleHoverHide();
  });
}

function scanMusicHoverLinks(root) {
  root.querySelectorAll('a[href*="deezer.com"]').forEach(attachMusicHover);
}

function initMusicLinkObserver() {
  scanMusicHoverLinks(document);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;

        if (node.tagName === 'A') {
          attachMusicHover(node);
        } else if (node.querySelectorAll) {
          scanMusicHoverLinks(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

async function initMusicPackCore(){
  await loadMusicSettings();
  injectMusicTheme();
  registerPack({ id:MUSIC_PACK_ID, fullWidth:MUSIC_FULL_CARD_WIDTH, noDrag:true, launchSearch:musicLaunchSearch, handleExternalSearch:handleMusicExternalSearch, navigateById:musicNavigateById, isAllowedOnThisSite:isMusicAllowedOnThisSite });
}
async function initMusicPack(){
  await initMusicPackCore();
  if (!isMusicAllowedForHoverOnThisSite()) return;
  initMusicLinkObserver();
}

