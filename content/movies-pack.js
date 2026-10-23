

const MOVIES_PACK_ID = 'movies';

const MOVIES_DEFAULT_SETTINGS = {
moviesPackEnabled: true,

kargiFieldImdb: true,
kargiFieldType: true,
kargiFieldGenre: true,

titleFieldDirector: true,
kargiFieldActors: true,

movieFieldCountry: true,

movieFieldPlot: true,

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

tvmazeFieldCreator: true,
tvmazeFieldSummary: true,
tvmazeFieldCountry: true,
tvmazeShowLink: true,
seasonTableEnabled: true,
malFieldScore: true,
ratingFieldCinemaScore: true,
showRottenTomatoesLink: true,
showTmdbLink: true,
showNetflixLink: true,
showPlexLink: true,
showLetterboxdLink: true,
showYoutubeSearchLink: true,
customLinks: [],
siteFilterMode: 'blacklist',
whitelistSites: [],
blacklistSites: ['imdb.com']
};

let moviesSettings = { ...MOVIES_DEFAULT_SETTINGS };

async function loadMoviesSettings() {

const stored = await api.storage.local.get([
  ...Object.keys(MOVIES_DEFAULT_SETTINGS),
  'omdbFieldImdb', 'omdbFieldType', 'omdbFieldGenre', 'omdbFieldActors', 'omdbFieldPlot'
]);
const pick = (key, legacy) => {
  if (Object.prototype.hasOwnProperty.call(stored, key)) return stored[key] !== false;
  if (legacy && Object.prototype.hasOwnProperty.call(stored, legacy)) return stored[legacy] !== false;
  return true;
};
moviesSettings = {
moviesPackEnabled: stored.moviesPackEnabled !== false,
kargiFieldImdb: pick('kargiFieldImdb', 'omdbFieldImdb'),
kargiFieldType: pick('kargiFieldType', 'omdbFieldType'),
kargiFieldGenre: pick('kargiFieldGenre', 'omdbFieldGenre'),
titleFieldDirector: stored.titleFieldDirector !== false,
kargiFieldActors: pick('kargiFieldActors', 'omdbFieldActors'),
movieFieldCountry: stored.movieFieldCountry !== false,
movieFieldPlot: pick('movieFieldPlot', 'omdbFieldPlot'),
showActorPhotos: stored.showActorPhotos !== false,
actorPhotoCount: Math.min(10, Math.max(3, parseInt(stored.actorPhotoCount, 10) || 5)),
personFieldAge: stored.personFieldAge !== false,
personFieldBorn: stored.personFieldBorn !== false,
personFieldBirthPlace: stored.personFieldBirthPlace !== false,
personFieldOccupation: stored.personFieldOccupation !== false,
personFieldKnownFor: stored.personFieldKnownFor !== false,
personFieldKnownForImages: stored.personFieldKnownForImages !== false,
personFieldBiography: stored.personFieldBiography !== false,
personFieldAwards: stored.personFieldAwards !== false,
tvmazeFieldEpisodes: stored.tvmazeFieldEpisodes !== false,
tvmazeFieldStatus: stored.tvmazeFieldStatus !== false,
tvmazeFieldNetwork: stored.tvmazeFieldNetwork !== false,
tvmazeFieldCreator: stored.tvmazeFieldCreator !== false,
tvmazeFieldSummary: stored.tvmazeFieldSummary !== false,
tvmazeFieldCountry: stored.tvmazeFieldCountry !== false,
tvmazeShowLink: stored.tvmazeShowLink !== false,
seasonTableEnabled: stored.seasonTableEnabled !== false,
malFieldScore: stored.malFieldScore !== false,
ratingFieldCinemaScore: stored.ratingFieldCinemaScore !== false,
showRottenTomatoesLink: stored.showRottenTomatoesLink !== false,
showTmdbLink: stored.showTmdbLink !== false,
showNetflixLink: stored.showNetflixLink !== false,
showPlexLink: stored.showPlexLink !== false,
showLetterboxdLink: stored.showLetterboxdLink !== false,
showYoutubeSearchLink: stored.showYoutubeSearchLink !== false,

customLinks: Array.isArray(stored.customLinks)
? stored.customLinks.filter((l) => l && typeof l.urlTemplate === 'string' && l.urlTemplate.trim())
: [],
siteFilterMode: stored.siteFilterMode || 'blacklist',
whitelistSites: Array.isArray(stored.whitelistSites) ? stored.whitelistSites : [],
blacklistSites: Array.isArray(stored.blacklistSites) ? stored.blacklistSites : ['imdb.com']
};
preloadCustomLinkIcons(moviesSettings.customLinks);
return moviesSettings;
}

function isMoviesAllowedOnThisSite() {
  return true;
}

function isMoviesAllowedForHoverOnThisSite() {
  const ownRulesAllow = siteAllowedByRules({
    siteFilterMode: moviesSettings.siteFilterMode,
    whitelistSites: moviesSettings.whitelistSites,
    blacklistSites: moviesSettings.blacklistSites
  });
  if (!ownRulesAllow) return false;
  return isAllowedByGlobalSiteRules(MOVIES_PACK_ID, 'hover');
}

const MOVIES_THEME_CLASS = 'qc-theme-movies';

const MOVIES_IMAGE_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="76" height="108"%3E%3Crect width="100%25" height="100%25" fill="%23d9d9de"/%3E%3C/svg%3E';

const MOVIES_TEXT_TEASER_THRESHOLD = 220;

function buildMoviesCollapsibleParagraph(text, extraStyle = '') {
  if (!text) return '';
  const styleAttr = extraStyle ? ` style="${extraStyle}"` : '';
  if (text.length <= MOVIES_TEXT_TEASER_THRESHOLD) {
    return `<p class="qc-full-desc qc-selectable"${styleAttr}>${escapeHtml(text)}</p>`;
  }
  return `<details><summary class="qc-full-desc qc-bio-teaser qc-selectable"${styleAttr}><span class="qc-bio-text">${escapeHtml(text)}</span><span class="qc-bio-toggle qc-bio-toggle-more">Show more ▾</span><span class="qc-bio-toggle qc-bio-toggle-less">Show less ▴</span></summary></details>`;
}

function injectMoviesTheme() {
const root = ensureUiRoot();
if (root.getElementById('quickcard-movies-theme')) return;
const style = document.createElement('style');
style.id = 'quickcard-movies-theme';
style.textContent = `

.${MOVIES_THEME_CLASS} {
background-color: #ffffff !important;
background-image: none !important;
backdrop-filter: none !important;
-webkit-backdrop-filter: none !important;
border: 1px solid #ececf0 !important;
box-shadow: 0 10px 30px rgba(20,20,30,0.14) !important;
color: #17171a !important;
}

.${MOVIES_THEME_CLASS}.qc-popup.qc-style-full {
width: 528px !important;
max-width: min(528px, calc(100vw - 24px)) !important;
box-sizing: border-box !important;
}
.${MOVIES_THEME_CLASS}.qc-popup.qc-style-full.person-type {
width: 528px !important;
max-width: min(528px, calc(100vw - 24px)) !important;
}
.${MOVIES_THEME_CLASS}.qc-popup.qc-style-full {
padding: 18px !important;
}

.${MOVIES_THEME_CLASS}.qc-popup.qc-style-full .row > img {
width: 170px !important;
height: 248px !important;
min-width: 170px !important;
min-height: 248px !important;
}
.${MOVIES_THEME_CLASS}.qc-popup.qc-style-full.person-type .row > img {
width: 170px !important;
height: 214px !important;
min-width: 170px !important;
min-height: 214px !important;
}

.${MOVIES_THEME_CLASS} .row {
position: relative !important;
}
.${MOVIES_THEME_CLASS} .qc-top-badge {
position: absolute !important;
top: 5px !important;
left: 5px !important;
z-index: 2 !important;
background: linear-gradient(135deg, #f6e9bf, #f6d383) !important;
color: #17171a !important;
font-size: 8.5px !important;
font-weight: 800 !important;
line-height: 1.25 !important;
padding: 3px 5px !important;
border-radius: 5px !important;
box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
letter-spacing: 0.1px !important;

max-width: 64px !important;
white-space: normal !important;
word-break: break-word !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-top-badge {
max-width: 140px !important;
font-size: 10px !important;
padding: 3px 6px !important;
}

.${MOVIES_THEME_CLASS} .qc-cinemascore-grade {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 26px !important;
  height: 20px !important;
  padding: 0 7px !important;
  border-radius: 4px !important;
  font-weight: 900 !important;
  font-size: 11.5px !important;
  line-height: 1 !important;
  letter-spacing: 0.02em !important;
  color: #2a2208 !important;
  background: linear-gradient(160deg, #f5e6a3 0%, #d4b84a 38%, #b8942a 72%, #9a7a1c 100%) !important;
  border: 1px solid #8a6f18 !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.18) !important;
  text-shadow: 0 1px 0 rgba(255,255,255,0.35) !important;
  cursor: default !important;
  vertical-align: middle !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-cinemascore-grade {
  min-width: 28px !important;
  height: 22px !important;
  font-size: 12.5px !important;
  padding: 0 8px !important;
}

.${MOVIES_THEME_CLASS} .meta,
.${MOVIES_THEME_CLASS} .name,
.${MOVIES_THEME_CLASS} .qc-subtitle {
color: #17171a !important;
}
.${MOVIES_THEME_CLASS} .meta b,
.${MOVIES_THEME_CLASS} .qc-fact-value {
color: #17171a !important;
}
.${MOVIES_THEME_CLASS} .qc-subtitle,
.${MOVIES_THEME_CLASS} .qc-score-inline,
.${MOVIES_THEME_CLASS} .qc-stat-label,
.${MOVIES_THEME_CLASS} .qc-icon-badge-label {
color: #5b5c63 !important;
}
.${MOVIES_THEME_CLASS} .qc-link,
.${MOVIES_THEME_CLASS} .qc-settings-link,
.${MOVIES_THEME_CLASS} .qc-retry-btn {
color: #3b6df0 !important;
}
.${MOVIES_THEME_CLASS} .qc-searchable:hover,
.${MOVIES_THEME_CLASS} .qc-nav-link:hover {
color: #3b6df0 !important;
opacity: 1 !important;
}
.${MOVIES_THEME_CLASS} .qc-link-icon {
background: #f1f2f4 !important;
}
.${MOVIES_THEME_CLASS} .qc-link-icon:hover {
background: #e7e8ec !important;
}
.${MOVIES_THEME_CLASS} .closebar span {
color: #17171a !important;
}
.${MOVIES_THEME_CLASS} .closebar span:hover {
background: #f1f2f4 !important;
}
.${MOVIES_THEME_CLASS} .translation-note {
color: #3c3d42 !important;
background: #f1f2f4 !important;
}
.${MOVIES_THEME_CLASS} .extra-error {
color: #b3261e !important;
}
.${MOVIES_THEME_CLASS} .extra-disabled {
color: #7b7c82 !important;
}
.${MOVIES_THEME_CLASS} .pick-heading {
color: #17171a !important;
}
.${MOVIES_THEME_CLASS} .qc-pick-btn {
background: #f7f7f8 !important;
}
.${MOVIES_THEME_CLASS} .qc-pick-btn:hover {
background: #ececf0 !important;
}
.${MOVIES_THEME_CLASS} .qc-pick-btn .pick-title {
color: #17171a !important;
}
.${MOVIES_THEME_CLASS} .qc-pick-btn .pick-sub {
color: #7b7c82 !important;
}
.${MOVIES_THEME_CLASS}.qc-selectbtn-icon {
width: 25px;
height: 25px;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-full-desc {
color: #3c3d42 !important;
}

.${MOVIES_THEME_CLASS} .qc-bio-teaser {
display: block !important;
cursor: pointer !important;
list-style: none !important;
}
.${MOVIES_THEME_CLASS} .qc-bio-teaser::-webkit-details-marker {
display: none !important;
}
.${MOVIES_THEME_CLASS} .qc-bio-text {
display: -webkit-box !important;
-webkit-box-orient: vertical !important;
-webkit-line-clamp: 3 !important;
overflow: hidden !important;
}
.${MOVIES_THEME_CLASS} details[open] > .qc-bio-teaser .qc-bio-text {
display: block !important;
-webkit-line-clamp: unset !important;
overflow: visible !important;
}
.${MOVIES_THEME_CLASS} .qc-bio-toggle {
display: inline-block !important;
margin-top: 4px !important;
color: #3b6df0 !important;
font-size: 12px !important;
font-weight: 600 !important;
}
.${MOVIES_THEME_CLASS} .qc-bio-toggle-less {
display: none !important;
}
.${MOVIES_THEME_CLASS} details[open] > .qc-bio-teaser .qc-bio-toggle-more {
display: none !important;
}
.${MOVIES_THEME_CLASS} details[open] > .qc-bio-teaser .qc-bio-toggle-less {
display: inline-block !important;
}

.${MOVIES_THEME_CLASS} .qc-kf-mini {
margin-top: 6px !important;
}
.${MOVIES_THEME_CLASS} .qc-kf-mini-summary {
display: block !important;
cursor: pointer !important;
list-style: none !important;
font-size: 12px !important;
font-weight: 700 !important;
color: #3b6df0 !important;
}
.${MOVIES_THEME_CLASS} .qc-kf-mini-summary::-webkit-details-marker {
display: none !important;
}
.${MOVIES_THEME_CLASS} .qc-kf-mini-row {
display: flex !important;
justify-content: space-between !important;
gap: 8px !important;
padding: 3px 0 !important;
font-size: 11.5px !important;
line-height: 1.4 !important;
}
.${MOVIES_THEME_CLASS} .qc-kf-mini-name {
font-weight: 600 !important;
}
.${MOVIES_THEME_CLASS} .qc-kf-mini-role {
color: #7b7c82 !important;
white-space: nowrap !important;
overflow: hidden !important;
text-overflow: ellipsis !important;
}

.${MOVIES_THEME_CLASS} .qc-kf-mini-more {
margin-top: 2px !important;
}
.${MOVIES_THEME_CLASS} .qc-kf-mini-more-summary {
display: block !important;
cursor: pointer !important;
list-style: none !important;
font-size: 11px !important;
font-weight: 600 !important;
color: #7b7c82 !important;
padding: 2px 0 !important;
}
.${MOVIES_THEME_CLASS} .qc-kf-mini-more-summary::-webkit-details-marker {
display: none !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-star {
color: #f5a623 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-badge-status {
background: #f1f2f4 !important;
color: #6b6c72 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-chip {
background: #f1f2f4 !important;
color: #2c2d31 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-fact-icon,
.${MOVIES_THEME_CLASS}.qc-style-full .qc-stat-block,
.${MOVIES_THEME_CLASS}.qc-style-full .qc-icon-badge {
background: #f1f2f4 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-divider {
background: #ececf0 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-known-for-list .qc-searchable,
.${MOVIES_THEME_CLASS}.qc-style-full .qc-known-for-list .qc-nav-link {
font-weight: 600 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-section-label {
color: #17171a !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box {
background: none !important;
border: none !important;
padding: 0 !important;
margin: 6px 0 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-section-label {
margin: 0 0 6px !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-stat-row {
flex-wrap: wrap !important;
row-gap: 8px !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-stat-row + .qc-stat-row {
margin-top: 8px !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-stat-block {
box-sizing: border-box !important;
min-width: 0 !important;
background: #f5f5f7 !important;
border-radius: 12px !important;
padding: 10px 8px !important;
text-align: center !important;
display: flex !important;
flex-direction: column !important;
align-items: center !important;
justify-content: center !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-stat-num {
font-size: 19px !important;
font-weight: 800 !important;
line-height: 1.15 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-stat-label {
margin-top: 3px !important;
font-size: 10.5px !important;
font-weight: 600 !important;
opacity: 0.75 !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-stat-block.qc-stat-win {
background: linear-gradient(135deg, #f6e9bf, #f6d383) !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-stat-block.qc-stat-win .qc-stat-num,
.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-stat-block.qc-stat-win .qc-stat-label {
color: #4a3200 !important;
opacity: 1 !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-award-quarter {
flex: 0 0 calc(25% - 7.5px) !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-movies-awards-box .qc-award-half {
flex: 0 0 calc(50% - 5px) !important;
}

.${MOVIES_THEME_CLASS} .qc-boxoffice-block {
margin: 8px 0 !important;

padding: 10px 12px !important;
background: #f4f4f6 !important;
border: 1px solid rgba(0,0,0,0.06) !important;
border-radius: 10px !important;
font-size: 12px !important;
line-height: 1.5 !important;
}
.${MOVIES_THEME_CLASS} .qc-boxoffice-title {
font-weight: 600 !important;
margin-bottom: 6px !important;
color: #1a1a1d !important;
}

.${MOVIES_THEME_CLASS} .qc-boxoffice-row {
display: grid !important;
grid-template-columns: 1fr auto !important;
align-items: baseline !important;
column-gap: 10px !important;
padding: 2px 0 !important;
}
.${MOVIES_THEME_CLASS} .qc-boxoffice-label {
color: #4a4a52 !important;
min-width: 0 !important;
}
.${MOVIES_THEME_CLASS} .qc-boxoffice-percent {
color: #8a8a93 !important;
font-size: 11px !important;
}
.${MOVIES_THEME_CLASS} .qc-boxoffice-amount {
font-weight: 600 !important;
color: #1a1a1d !important;
white-space: nowrap !important;
text-align: right !important;
}
.${MOVIES_THEME_CLASS} .qc-boxoffice-budget {
margin-top: 6px !important;
padding-top: 6px !important;
border-top: 1px dashed rgba(0,0,0,0.08) !important;
color: #4a4a52 !important;
}

.${MOVIES_THEME_CLASS} .qc-info-row {
display: flex !important;
gap: 8px !important;
margin: 8px 0 !important;
}
.${MOVIES_THEME_CLASS} .qc-info-row .qc-info-box {
margin: 0 !important;
flex: 1 1 0 !important;
min-width: 0 !important;
}
.${MOVIES_THEME_CLASS} .qc-info-box {
position: relative !important;
margin: 8px 0 !important;
padding: 8px 10px !important;
background: #f4f4f6 !important;
border: 1px solid rgba(0,0,0,0.06) !important;
border-radius: 10px !important;
}
.${MOVIES_THEME_CLASS} .qc-info-box-label {
font-size: 10px !important;
font-weight: 700 !important;
letter-spacing: 0.4px !important;
text-transform: uppercase !important;
color: #8a8a93 !important;
margin-bottom: 2px !important;
}
.${MOVIES_THEME_CLASS} .qc-info-box-value {
font-size: 13px !important;
font-weight: 600 !important;
color: #1a1a1d !important;
line-height: 1.4 !important;
}

.${MOVIES_THEME_CLASS} .qc-info-box-value.qc-info-box-value-padded {
padding-right: 62px !important;
}
.${MOVIES_THEME_CLASS} .qc-info-box-sub {
font-weight: 400 !important;
color: #8a8a93 !important;
}

.${MOVIES_THEME_CLASS} .qc-info-pill {
display: inline-block !important;
background: #17171a !important;
color: #fff !important;
font-size: 9px !important;
font-weight: 800 !important;
letter-spacing: 0.3px !important;
padding: 2px 8px !important;
border-radius: 999px !important;
vertical-align: middle !important;
}

.${MOVIES_THEME_CLASS} .qc-info-corner-badge {
position: absolute !important;
top: 8px !important;
right: 10px !important;
background: #eef2fb !important;
color: #3b5bdb !important;
font-size: 10px !important;
font-weight: 700 !important;
padding: 2px 8px !important;
border-radius: 999px !important;
white-space: nowrap !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-kf-list {
display: grid !important;
grid-template-columns: 1fr 1fr !important;
gap: 8px !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-kf-item {
display: flex !important;
align-items: center !important;
gap: 10px !important;
background: #f7f7f8 !important;
border: 1px solid #ececf0 !important;
border-radius: 10px !important;
padding: 8px 10px !important;
min-width: 0 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-kf-text {
flex: 1 !important;
min-width: 0 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-kf-title {
font-size: 12.5px !important;
font-weight: 600 !important;
color: #17171a !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-kf-role {
font-size: 11px !important;
color: #7b7c82 !important;
margin-top: 2px !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-kf-meta {
font-size: 11px !important;
color: #9a9aa1 !important;
margin-top: 2px !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-credit-tabs {
display: flex !important;
flex-wrap: wrap !important;
gap: 6px !important;
margin-bottom: 8px !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-credit-tab {
cursor: pointer !important;
font-size: 11px !important;
font-weight: 600 !important;
color: #3b6df0 !important;
background: #fff !important;
border: 1px solid #3b6df0 !important;
border-radius: 999px !important;
padding: 3px 10px !important;
margin: 0 !important;
white-space: nowrap !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-credit-tab-active {
color: #fff !important;
background: #3b6df0 !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-credits-load-more {
grid-column: 1 / -1 !important;
cursor: pointer !important;
font-size: 11.5px !important;
font-weight: 700 !important;
color: #3b6df0 !important;
background: none !important;
border: none !important;
padding: 2px 4px !important;
margin: 0 !important;
text-align: left !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-cast-list {
display: grid !important;
grid-template-columns: 1fr 1fr !important;
gap: 8px !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-actor-card {
display: flex !important;
align-items: center !important;
gap: 10px !important;
background: #f7f7f8 !important;
border: 1px solid #ececf0 !important;
border-radius: 10px !important;
padding: 8px 10px !important;
min-width: 0 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-actor-thumb {

width: 46px !important;
height: 64px !important;
border-radius: 6px !important;
object-fit: cover !important;
flex-shrink: 0 !important;
background: #e8e9ed !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-thumb-loading {
background: linear-gradient(90deg, #e8e9ed 25%, #f1f2f4 37%, #e8e9ed 63%) !important;
background-size: 400% 100% !important;
animation: qc-thumb-shimmer 1.4s ease infinite !important;
}
@keyframes qc-thumb-shimmer {
0% { background-position: 100% 50%; }
100% { background-position: 0 50%; }
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-thumb-empty {
background: #e8e9ed !important;
position: relative !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-thumb-empty::after {
content: '' !important;
position: absolute !important;
inset: 0 !important;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a9aab0' stroke-width='1.5'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E") !important;
background-repeat: no-repeat !important;
background-position: center !important;
background-size: 40% 40% !important;
opacity: 0.6 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-actor-name {
font-size: 12.5px !important;
font-weight: 600 !important;
color: #17171a !important;
overflow: hidden !important;
text-overflow: ellipsis !important;
white-space: nowrap !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-actor-text {
flex: 1 !important;
min-width: 0 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-actor-role {
font-size: 11px !important;
color: #7b7c82 !important;
margin-top: 2px !important;
overflow: hidden !important;
text-overflow: ellipsis !important;
white-space: nowrap !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-tabs {
display: flex !important;
flex-wrap: wrap !important;
gap: 6px !important;
margin-bottom: 10px !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-tab {
font-size: 11.5px !important;
font-weight: 700 !important;
padding: 4px 10px !important;
border-radius: 999px !important;
border: 1px solid #e2e3e8 !important;
background: #fff !important;
color: #5b5c63 !important;
cursor: pointer !important;
font-family: inherit !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-tab.active {
background: #17171a !important;
border-color: #17171a !important;
color: #fff !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-episode-table {

display: grid !important;
grid-template-columns: 22px minmax(0,1fr) minmax(60px,auto) !important;
column-gap: 8px !important;
row-gap: 4px !important;
overflow: hidden !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-episode-row {

display: grid !important;
grid-column: 1 / -1 !important;
grid-template-columns: subgrid !important;
align-items: center !important;
padding: 6px 8px !important;
border-radius: 8px !important;
background: #f7f7f8 !important;

border: none !important;
width: 100% !important;
max-width: 100% !important;
box-sizing: border-box !important;
text-align: left !important;
font: inherit !important;
color: inherit !important;
cursor: pointer !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-episode-row:hover {
background: #ececf0 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-episode-num {
font-size: 11px !important;
font-weight: 700 !important;
color: #9a9ba4 !important;
text-align: center !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-episode-name {
font-size: 12px !important;
font-weight: 600 !important;
color: #17171a !important;
overflow: hidden !important;
text-overflow: ellipsis !important;
white-space: nowrap !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-episode-date {
font-size: 10.5px !important;
color: #8a8a93 !important;
display: block !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-episode-rating {
font-size: 12px !important;
font-weight: 700 !important;
color: #b8860b !important;
text-align: left !important;
white-space: nowrap !important;
}

.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-episode-rating.qc-ep-rating-high {
color: #cfa964 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-episode-rating.qc-ep-rating-mid {
color: #6b6c74 !important;
}
.${MOVIES_THEME_CLASS}.qc-style-full .qc-season-episode-rating.qc-ep-rating-low {
color: #d98a8a !important;
}
`;
root.styleHost.appendChild(style);
}

const CACHE = new Map();

function getCacheEntry(id) {
  if (!CACHE.has(id)) {
    CACHE.set(id, {
      baseHtml: null,
      finalHtml: null,

      baseHtmlStyle: null,
      finalHtmlStyle: null,
      isPersonType: false,
      extraLoaded: false
    });
  }
  return CACHE.get(id);
}

async function httpGet(url, headers = {}) {
  log('httpGet: routing via background for', url);

  try {
    const res = await api.runtime.sendMessage({
      type: 'QUICKCARD_HTTP_GET',
      url,
      headers
    });

    log('httpGet: background responded ok=', res && res.ok, 'status=', res && res.status, 'for', url);

    return {
      ok: !!(res && res.ok),
      status: res && typeof res.status === 'number' ? res.status : 0,
      text: res && typeof res.text === 'string' ? res.text : ''
    };
  } catch (e) {
    logError('httpGet: sendMessage to background failed for', url, '->', e && e.message ? e.message : e);
    return { ok: false, status: 0, text: '' };
  }
}

function suggestionRequest(query, callback) {
  const url = `https://v3.sg.media-imdb.com/suggestion/x/${encodeURIComponent(query)}.json`;
  log('suggestionRequest: fetching', url);

  httpGet(url, { Accept: 'application/json' })
    .then((res) => {
      log('suggestionRequest: response ok=', res.ok, 'status=', res.status, 'for query=', query);

      if (!res.ok) {
        logError('suggestionRequest: HTTP not ok, status=', res.status, 'body snippet:', String(res.text || '').slice(0, 300));
        callback(null, { ok: false, status: res.status });
        return;
      }

      try {
        const data = JSON.parse(res.text);
        const list = Array.isArray(data.d) ? data.d : [];
        log('suggestionRequest: parsed', list.length, 'suggestion(s) for query=', query);
        callback(list, { ok: true });
      } catch (e) {
        logError('suggestionRequest: JSON parse failed for query=', query, '-> raw text snippet:', String(res.text || '').slice(0, 300), '-> error:', e && e.message);
        callback(null, { ok: false, status: res.status, error: 'Invalid response format' });
      }
    })
    .catch((e) => {
      logError('suggestionRequest: fetch threw for query=', query, '->', e && e.message ? e.message : e);
      callback(null, { ok: false, error: String(e && e.message ? e.message : e) });
    });
}

function fetchSuggestionById(id, callback) {
  suggestionRequest(id, (list) => {
    if (!list) {
      callback(null);
      return;
    }

    callback(list.find((item) => item.id === id) || null);
  });
}

function searchImdb(query, callback) {
  suggestionRequest(query, (list, status) => {
    if (!list) {
      log('searchImdb: no list returned (request failed) for query=', query);
      callback(null, { ok: false, reason: 'network', status });
      return;
    }

    const candidates = list.filter((item) => /^(nm|tt)\d+$/.test(item.id));
    if (!candidates.length) {
      log('searchImdb: list returned but no nm/tt match for query=', query, 'list=', list);
      callback(null, { ok: true, reason: 'no-match' });
      return;
    }

    const normalize = (s) => String(s || '').trim().toLowerCase();
    const normalizedQuery = normalize(query);
    const exactMatches = candidates.filter((item) => normalize(item.l) === normalizedQuery);

    if (exactMatches.length === 1) {
      const match = exactMatches[0];
      log('searchImdb: unique exact match', match.id, 'for query=', query);
      callback({
        id: match.id,
        type: match.id.startsWith('nm') ? 'name' : 'title',
        entry: match
      }, { ok: true });
      return;
    }

    const topCandidates = candidates.slice(0, 3).map((match) => ({
      id: match.id,
      type: match.id.startsWith('nm') ? 'name' : 'title',
      entry: match
    }));

    log('searchImdb: ambiguous result for query=', query, '- offering', topCandidates.length, 'option(s)');
    callback(null, { ok: true, reason: 'ambiguous', candidates: topCandidates });
  });
}

function toSmallImdbPickerImage(url, w = 300) {
  if (!url || !url.includes('m.media-amazon.com')) return url;
  const base = url.split('._V1_')[0];
  return `${base}._V1_SX${w}.jpg`;
}

function describeCandidateForPicker(candidate) {
  const entry = candidate.entry;
  const name = entry.l || 'Unknown';
  const image = toSmallImdbPickerImage((entry.i && entry.i.imageUrl) || null);

  const subParts = [];
  if (candidate.type === 'title') {
    if (entry.y) subParts.push(String(entry.y));
    if (entry.q) subParts.push(entry.q);
  } else {
    if (entry.q) subParts.push(entry.q);
    if (entry.s) subParts.push(entry.s);
  }

  return { name, image, subParts };
}

const EXTRA_INFO_TIMEOUT_MS = 12000;

function fetchExtraInfo(id, type, callback) {
  log('fetchExtraInfo: sending MOVIES_GET_EXTRA_INFO for', id, type);

  let settled = false;

  const timeoutTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    logError('fetchExtraInfo: timed out after', EXTRA_INFO_TIMEOUT_MS, 'ms for', id);
    callback({ ok: false, timedOut: true });
  }, EXTRA_INFO_TIMEOUT_MS);

  api.runtime.sendMessage({
    type: 'MOVIES_GET_EXTRA_INFO',
    id,
    itemType: type
  }).then((res) => {
    log('fetchExtraInfo: got response for', id, '->', res);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback(res || null);
  }).catch((e) => {
    logError('fetchExtraInfo: sendMessage failed for', id, '->', e && e.message ? e.message : e);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback({ ok: false, error: String(e && e.message ? e.message : e) });
  });
}

const SITE_LINKS_TIMEOUT_MS = 15000;

function fetchSiteLinks(id, type, isSeries, title, isAnime, callback, wantKnownForExtras = true) {
  log('fetchSiteLinks: sending MOVIES_GET_SITE_LINKS for', id, type);
let settled = false;
const timeoutTimer = setTimeout(() => {
if (settled) return;
settled = true;
logError('fetchSiteLinks: timed out after', SITE_LINKS_TIMEOUT_MS, 'ms for', id);
callback({ ok: false, timedOut: true });
}, SITE_LINKS_TIMEOUT_MS);
api.runtime.sendMessage({
type: 'MOVIES_GET_SITE_LINKS',
id,
itemType: type,
isSeries: !!isSeries,
title: title || '',
isAnime: !!isAnime,
wantKnownForExtras: !!wantKnownForExtras
}).then((res) => {
log('fetchSiteLinks: got response for', id, '->', res);
if (settled) return;
settled = true;
clearTimeout(timeoutTimer);
callback(res || null);
}).catch((e) => {
logError('fetchSiteLinks: sendMessage failed for', id, '->', e && e.message ? e.message : e);
if (settled) return;
settled = true;
clearTimeout(timeoutTimer);
callback({ ok: false, error: String(e && e.message ? e.message : e) });
});
}

const BOX_OFFICE_TIMEOUT_MS = 12000;
function fetchBoxOfficeInfo(id, isMovie, callback) {
  log('fetchBoxOfficeInfo: sending MOVIES_GET_BOX_OFFICE for', id);
  let settled = false;
  const timeoutTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    logError('fetchBoxOfficeInfo: timed out after', BOX_OFFICE_TIMEOUT_MS, 'ms for', id);
    callback({ ok: false, timedOut: true });
  }, BOX_OFFICE_TIMEOUT_MS);
  api.runtime.sendMessage({
    type: 'MOVIES_GET_BOX_OFFICE',
    id,
    isMovie: !!isMovie
  }).then((res) => {
    log('fetchBoxOfficeInfo: got response for', id, '->', res);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback(res || null);
  }).catch((e) => {
    logError('fetchBoxOfficeInfo: sendMessage failed for', id, '->', e && e.message ? e.message : e);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback({ ok: false, error: String(e && e.message ? e.message : e) });
  });
}

function detectMoviesIsAnime(extra, tvmazeExtra) {

  const country = (tvmazeExtra && tvmazeExtra.countryRaw) || (extra && extra.countryRaw);
  return !!(extra
    && extra.genreRaw && /animation/i.test(extra.genreRaw)
    && country && /\bjapan\b/i.test(country));
}

const TVMAZE_INFO_TIMEOUT_MS = 19000;

const BIOGRAPHY_TIMEOUT_MS = 15000;
function fetchMoviesBiography(wikipediaUrl, callback) {
  log('fetchMoviesBiography: sending MOVIES_GET_BIOGRAPHY for', wikipediaUrl);
  let settled = false;
  const timeoutTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    logError('fetchMoviesBiography: timed out after', BIOGRAPHY_TIMEOUT_MS, 'ms for', wikipediaUrl);
    callback({ ok: false, timedOut: true });
  }, BIOGRAPHY_TIMEOUT_MS);
  api.runtime.sendMessage({ type: 'MOVIES_GET_BIOGRAPHY', wikipediaUrl }).then((res) => {
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback(res || null);
  }).catch((e) => {
    logError('fetchMoviesBiography: sendMessage failed for', wikipediaUrl, '->', e && e.message ? e.message : e);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback({ ok: false, error: String(e && e.message ? e.message : e) });
  });
}

const BOOK_SOURCE_TIMEOUT_MS = 12000;

function fetchMovieBookSource(id, callback) {
  log('fetchMovieBookSource: sending MOVIES_GET_BOOK_SOURCE for', id);
  let settled = false;
  const timeoutTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    logError('fetchMovieBookSource: timed out after', BOOK_SOURCE_TIMEOUT_MS, 'ms for', id);
    callback({ ok: false, timedOut: true });
  }, BOOK_SOURCE_TIMEOUT_MS);
  api.runtime.sendMessage({ type: 'MOVIES_GET_BOOK_SOURCE', id }).then((res) => {
    log('fetchMovieBookSource: got response for', id, '->', res);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback(res || null);
  }).catch((e) => {
    logError('fetchMovieBookSource: sendMessage failed for', id, '->', e && e.message ? e.message : e);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback({ ok: false, error: String(e && e.message ? e.message : e) });
  });
}

const ACTOR_IMAGES_TIMEOUT_MS = 15000;
function fetchActorImages(actors, callback) {
  log('fetchActorImages: sending MOVIES_GET_ACTOR_IMAGES for', actors);
  let settled = false;
  const timeoutTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    logError('fetchActorImages: timed out after', ACTOR_IMAGES_TIMEOUT_MS, 'ms for', actors);
    callback({ ok: false, timedOut: true });
  }, ACTOR_IMAGES_TIMEOUT_MS);
  api.runtime.sendMessage({ type: 'MOVIES_GET_ACTOR_IMAGES', actors }).then((res) => {
    log('fetchActorImages: got response for', actors, '->', res);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback(res || null);
  }).catch((e) => {
    logError('fetchActorImages: sendMessage failed for', actors, '->', e && e.message ? e.message : e);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback({ ok: false, error: String(e && e.message ? e.message : e) });
  });
}

const TOP_LIST_TIMEOUT_MS = 12000;
function fetchMoviesTopListMembership(id, isSeries, callback) {
  log('fetchMoviesTopListMembership: sending MOVIES_CHECK_TOP_LIST for', id, 'isSeries=', isSeries);
  let settled = false;
  const timeoutTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    logError('fetchMoviesTopListMembership: timed out after', TOP_LIST_TIMEOUT_MS, 'ms for', id);
    callback({ ok: false, timedOut: true });
  }, TOP_LIST_TIMEOUT_MS);
  api.runtime.sendMessage({ type: 'MOVIES_CHECK_TOP_LIST', id, isSeries }).then((res) => {
    log('fetchMoviesTopListMembership: got response for', id, '->', res);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback(res || null);
  }).catch((e) => {
    logError('fetchMoviesTopListMembership: sendMessage failed for', id, '->', e && e.message ? e.message : e);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback({ ok: false, error: String(e && e.message ? e.message : e) });
  });
}

function fetchTvmazeInfo(id, callback) {
  log('fetchTvmazeInfo: sending MOVIES_GET_TVMAZE_INFO for', id);

  let settled = false;

  const timeoutTimer = setTimeout(() => {
    if (settled) return;
    settled = true;
    logError('fetchTvmazeInfo: timed out after', TVMAZE_INFO_TIMEOUT_MS, 'ms for', id);
    callback({ ok: false, timedOut: true });
  }, TVMAZE_INFO_TIMEOUT_MS);

  api.runtime.sendMessage({
    type: 'MOVIES_GET_TVMAZE_INFO',
    id
  }).then((res) => {
    log('fetchTvmazeInfo: got response for', id, '->', res);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback(res || null);
  }).catch((e) => {
    logError('fetchTvmazeInfo: sendMessage failed for', id, '->', e && e.message ? e.message : e);
    if (settled) return;
    settled = true;
    clearTimeout(timeoutTimer);
    callback({ ok: false, error: String(e && e.message ? e.message : e) });
  });
}

function truncateAtWord(text, max) {
  const str = String(text || '').trim();
  if (str.length <= max) return str;
  const cut = str.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '…';
}

function searchableName(name) {
  const safe = escapeHtml(name);
  return `<span class="qc-searchable qc-selectable" data-search-text="${safe}">${safe}</span>`;
}

function searchableNameByIds(name, id, kind = 'person') {
  const safe = escapeHtml(name);
  if (!id) return searchableName(name);
  const safeId = escapeHtml(id);
  return `<span class="qc-nav-link qc-selectable" data-nav-pack="movies" data-nav-kind="${kind}" data-nav-id="${safeId}">${safe}</span>`;
}

function searchableNameList(names,ids) {
  if (ids && ids.length) {
    return names.map((name, i) => searchableNameByIds(name, ids[i])).join(', ');
  }
    else
      {return names.map(searchableName).join(', ');}
}

function buildCastHtml(castList, actorImages, id, showPhotos) {
  if (!castList || !castList.length) return '';
  const images = actorImages || [];

  const imagesLoaded = images.length > 0;
  const actorCards = castList.map((actor, i) => {
    const imgUrl = showPhotos ? images[i] : null;
    let imgHtml;
    if (imgUrl) {
      imgHtml = `<img class="qc-actor-thumb" src="${escapeHtml(imgUrl)}" alt="" referrerpolicy="no-referrer">`;
    } else if (showPhotos && !imagesLoaded) {
      imgHtml = '<div class="qc-actor-thumb qc-thumb-loading"></div>';
    } else {
      imgHtml = '<div class="qc-actor-thumb qc-thumb-empty"></div>';
    }
    const nameHtml = actor.id ? searchableNameByIds(actor.name, actor.id) : searchableName(actor.name);
    const roleHtml = actor.characters ? `<div class="qc-actor-role">${escapeHtml(actor.characters)}</div>` : '';
    return `<div class="qc-actor-card">${imgHtml}<div class="qc-actor-text"><div class="qc-actor-name">${nameHtml}</div>${roleHtml}</div></div>`;
  }).join('');
  const fullCastLinkHtml = id ? buildTextLinkHtml('Full cast & crew', `https://www.imdb.com/title/${id}/fullcredits/`) : '';
  return `<div class="qc-section"><p class="qc-section-label">Top Cast</p><div class="qc-cast-list">${actorCards}</div>${fullCastLinkHtml}</div>`;
}

function buildTopListBadgeHtml(topListInfo, image) {
  if (!image || !topListInfo || !topListInfo.ok || !topListInfo.isTopList) return '';
  const label = topListInfo.isSeries ? 'IMDb Top TV Shows' : 'IMDb Top 250';
  const rankText = topListInfo.rank ? `${label} : #${topListInfo.rank}` : `${label} : TOP`;
  return `<span class="qc-top-badge" title="${escapeHtml(label)} — Rank ${escapeHtml(String(topListInfo.rank || '?'))}">${escapeHtml(rankText)}</span>`;
}

const WATCH_PROVIDER_LABELS = ['Netflix', 'Disney+', 'Max', 'Prime Video', 'Apple TV', 'Peacock', 'Hulu', 'Crunchyroll'];

function splitLinksForFullStyle(extraLinks) {
  const watch = [];
  const footer = [];
  extraLinks.forEach((l) => {
    (WATCH_PROVIDER_LABELS.includes(l.label) ? watch : footer).push(l);
  });
  return { watch, footer };
}

function buildEpisodeSeasonLinkHtml(id, epLabel) {
  const seasonMatch = epLabel && epLabel.match(/^S(\d+)E\d+/i);
  if (!seasonMatch || !id) return '';
  const seasonNum = parseInt(seasonMatch[1], 10);
  return ` <button class="qc-link qc-link-inline-arrow qc-selectable" data-link="https://www.imdb.com/title/${escapeHtml(id)}/episodes/?season=${seasonNum}" title="${escapeHtml(epLabel)}" aria-label="${escapeHtml(epLabel)}">↗</button>`;
}

function buildTextLinkHtml(label, url) {
  if (!url) return '';
  return `<button class="qc-link qc-text-link" data-link="${escapeHtml(url)}">${escapeHtml(label)} ↗</button>`;
}

function buildFactRow(icon, label, valueHtml) {
  return `<div class="qc-fact-row"><div><span class="qc-fact-label">${escapeHtml(label)}:</span> <span class="qc-fact-value">${valueHtml}</span></div></div>`;
}

function buildPersonHtml(name, image, extra, link, options = {}) {
  if (getPopupStyleClass() === 'qc-style-full') {
    return buildPersonFullHtml(name, image, extra, link, options);
  }

  const siteLinks = options.siteLinks || null;

  const siteLinksStatus = options.siteLinksStatus || null;
  const rows = [];

  if (extra && extra.ageInfo && typeof extra.ageInfo.age === 'number') {
    rows.push(extra.ageInfo.deceased
      ? `Died at: <b>${extra.ageInfo.age}</b>`
      : `Age: <b>${extra.ageInfo.age}</b>`);
  }

  if (extra && extra.born) rows.push(`Born: <b>${escapeHtml(extra.born)}</b>`);
  if (extra && extra.birthPlace) rows.push(`Birth place: <b>${escapeHtml(extra.birthPlace)}</b>`);
  if (extra && extra.occupation && extra.occupation.length) {
    rows.push(`Occupation: <b>${escapeHtml(extra.occupation.slice(0, 4).join(', '))}</b>`);
  }

  const knownForMiniHtml = buildKnownForMiniHtml(siteLinks);

  const awardsBreakdown = siteLinks && siteLinks.awardsBreakdown;
  const awardsMiniLine = awardsBreakdown ? moviesBuildAwardsMiniLine(awardsBreakdown, ['academy', 'goldenglobe', 'emmy']) : '';
  if (awardsMiniLine) {
    rows.push(`Awards: <b>${escapeHtml(awardsMiniLine)}</b>${buildInlineIconLink('Awards', siteLinks.awardsUrl)}`);
  }

  if (!rows.length && !knownForMiniHtml && options.statusMessage) {
    rows.push(`<span class="${options.statusMessage.hasError ? 'extra-error' : 'extra-disabled'}">${escapeHtml(options.statusMessage.message)}</span>`);
  }

  if (!siteLinks && siteLinksStatus) {
    rows.push(`<span class="${siteLinksStatus.hasError ? 'extra-error' : 'extra-disabled'}">${escapeHtml(siteLinksStatus.message)}</span>`);
  }

  const metaHtml = (rows.length || knownForMiniHtml)
    ? rows.map((r) => `<div>${r}</div>`).join('')
    : '<div>Person info: <b>N/A</b></div>';

  const extraLinks = [{ label: 'IMDb', url: link }];
  if (siteLinks) {
    if (siteLinks.wikipediaUrl) extraLinks.push({ label: 'Wikipedia', url: siteLinks.wikipediaUrl });
    if (siteLinks.twitterUrl) extraLinks.push({ label: 'Twitter', url: siteLinks.twitterUrl });
    if (siteLinks.instagramUrl) extraLinks.push({ label: 'Instagram', url: siteLinks.instagramUrl });
    if (siteLinks.letterboxdUrl) extraLinks.push({ label: 'Letterboxd', url: siteLinks.letterboxdUrl });
    if (siteLinks.officialWebsite) extraLinks.push({ label: 'Website', url: siteLinks.officialWebsite });

    if (!awardsMiniLine && siteLinks.awardsUrl) extraLinks.push({ label: 'Awards', url: siteLinks.awardsUrl });
  }
  const personIdMini = (link && link.includes('/name/')) ? (link.split('/name/')[1] || '').split('/')[0] : '';
  moviesAppendCustomLinks(extraLinks, personIdMini, name);

  const imgHtml = image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer">` : '';

  const bioText = siteLinks && siteLinks.biography;
  const bioHtml = bioText
    ? `<div class="qc-section"><p class="qc-section-label">Biography</p>${buildMoviesCollapsibleParagraph(bioText)}</div>`
    : '';

  return `
    <div class="row">
      ${imgHtml}
      <div class="content">
        <p class="name qc-selectable">${escapeHtml(name)}</p>
        <div class="meta qc-selectable">${metaHtml}</div>
        ${bioHtml}
        ${knownForMiniHtml}
        ${buildExternalLinksHtml(extraLinks)}
      </div>
    </div>
  `;
}

function buildCastMiniHtml(cast) {
  if (!cast || !cast.length) return '';
  const rows = cast.map((actor) => {
    const nameHtml = actor.id ? searchableNameByIds(actor.name, actor.id) : searchableName(actor.name);
    const roleHtml = actor.characters ? `<span class="qc-kf-mini-role">${escapeHtml(actor.characters)}</span>` : '';
    return `<div class="qc-kf-mini-row"><span class="qc-kf-mini-name">${nameHtml}</span>${roleHtml}</div>`;
  }).join('');
  return `<details class="qc-kf-mini"><summary class="qc-kf-mini-summary">Cast</summary>${rows}</details>`;
}

const MOVIES_CREDIT_CATEGORY_PRIORITY = [
  'actor', 'director', 'writer', 'producer',
  'cinematographer', 'editor', 'composer',
  'production_designer', 'costume_designer', 'make_up'
];
const MOVIES_CREDIT_CATEGORY_LABELS = {
  actor: 'Actor',
  director: 'Director',
  writer: 'Writer',
  producer: 'Producer',
  cinematographer: 'Cinematographer',
  editor: 'Editor',
  composer: 'Composer',
  production_designer: 'Production Designer',
  costume_designer: 'Costume Designer',
  make_up: 'Make Up'
};
const MOVIES_CREDITS_FIRST_PAGE_SIZE = 10;
const MOVIES_CREDITS_PAGE_SIZE = 20;

function moviesSortFilmographyByYear(items) {
  return items.slice().sort((a, b) => {
    const ay = (a.startYear == null) ? Infinity : a.startYear;
    const by = (b.startYear == null) ? Infinity : b.startYear;
    return by - ay;
  });
}

function moviesGroupFilmographyByCategory(filmography) {
  const groups = {};
  (filmography || []).forEach((item) => {
    if (!item || !item.category) return;
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });
  Object.keys(groups).forEach((cat) => {
    groups[cat] = moviesSortFilmographyByYear(groups[cat]);
  });
  return groups;
}

function moviesDefaultCreditCategory(groups) {
  for (const cat of MOVIES_CREDIT_CATEGORY_PRIORITY) {
    if (groups[cat] && groups[cat].length) return cat;
  }

  const rest = Object.keys(groups).filter((cat) => groups[cat] && groups[cat].length);
  return rest.length ? rest[0] : null;
}

function moviesFilmographyYearText(item) {
  if (!item.startYear) return 'TBA';
  if (item.endYear && item.endYear !== item.startYear) return `${item.startYear}\u2013${item.endYear}`;
  return String(item.startYear);
}

const moviesCreditsState = {};
function moviesGetCreditsState(personId) {
  if (!moviesCreditsState[personId]) moviesCreditsState[personId] = { groups: null, resolved: {} };
  return moviesCreditsState[personId];
}

function moviesBuildCreditItemHtml(item, resolved) {
  const nameHtml = item.id ? searchableNameByIds(item.title, item.id, 'title') : searchableName(item.title);
  const roleHtml = item.character
    ? `<div class="qc-kf-role">${escapeHtml(`as ${item.character}`)}</div>`
    : '';
  const yearText = moviesFilmographyYearText(item);
  const metaParts = [yearText];
  if (resolved && resolved.rating) metaParts.push(`\u2605 ${escapeHtml(resolved.rating)}`);
  const metaHtml = `<div class="qc-kf-meta">${metaParts.join(' \u2022 ')}</div>`;
  let thumbHtml;
  if (resolved && resolved.image) {
    thumbHtml = `<img class="qc-known-for-thumb" src="${escapeHtml(resolved.image)}" alt="" referrerpolicy="no-referrer">`;
  } else if (resolved) {

    thumbHtml = '<div class="qc-known-for-thumb qc-thumb-empty" aria-hidden="true"></div>';
  } else {
    thumbHtml = '<div class="qc-known-for-thumb qc-thumb-loading"></div>';
  }
  return `<div class="qc-kf-item" data-imdb-id="${escapeHtml(item.id || '')}">${thumbHtml}<div class="qc-kf-text"><div class="qc-kf-title">${nameHtml}</div>${roleHtml}${metaHtml}</div></div>`;
}

function moviesRenderCreditsList(personId, listEl, category, shownCount) {
  const state = moviesGetCreditsState(personId);
  const items = (state.groups && state.groups[category]) || [];
  const slice = items.slice(0, shownCount);
  const itemsHtml = slice.map((item) => moviesBuildCreditItemHtml(item, item.id ? state.resolved[item.id] : null)).join('');
  const remaining = items.length - shownCount;
  const moreHtml = remaining > 0
    ? `<button type="button" class="qc-credits-load-more">Show more</button>`
    : '';
  listEl.innerHTML = itemsHtml + moreHtml;
  bindPopupButtons(listEl);
  moviesFetchCreditsBatchIfNeeded(personId, listEl, slice);
}

function moviesFetchCreditsBatchIfNeeded(personId, listEl, items) {
  const state = moviesGetCreditsState(personId);
  const needed = items.filter((item) => item.id && !state.resolved[item.id]);
  if (!needed.length) return;
  const ids = needed.map((item) => item.id);
  api.runtime.sendMessage({ type: 'MOVIES_GET_FILMOGRAPHY_BATCH', imdbIds: ids, wantImages: !!moviesSettings.personFieldKnownForImages }).then((res) => {
    const d = res && res.ok && res.data;

    needed.forEach((item) => {
      state.resolved[item.id] = d
        ? { rating: d.ratings[item.id] || null, image: d.images[item.id] || null }
        : { rating: null, image: null };
    });
    needed.forEach((item) => {
      const node = listEl.isConnected ? listEl.querySelector(`.qc-kf-item[data-imdb-id="${CSS.escape(item.id)}"]`) : null;
      if (!node) return;
      const resolved = state.resolved[item.id];
      const thumb = node.querySelector('.qc-known-for-thumb');
      if (thumb) {
        if (resolved.image) {
          thumb.outerHTML = `<img class="qc-known-for-thumb" src="${escapeHtml(resolved.image)}" alt="" referrerpolicy="no-referrer">`;
        } else {
          thumb.outerHTML = '<div class="qc-known-for-thumb qc-thumb-empty" aria-hidden="true"></div>';
        }
      }
      if (resolved.rating) {
        const metaEl = node.querySelector('.qc-kf-meta');
        if (metaEl) metaEl.textContent = `${moviesFilmographyYearText(item)} \u2022 \u2605 ${resolved.rating}`;
      }
    });
  }).catch((e) => {
    logError('moviesFetchCreditsBatchIfNeeded: sendMessage failed for', ids, '->', e && e.message ? e.message : e);
    needed.forEach((item) => {
      state.resolved[item.id] = { rating: null, image: null };
      const node = listEl.isConnected ? listEl.querySelector(`.qc-kf-item[data-imdb-id="${CSS.escape(item.id)}"]`) : null;
      if (!node) return;
      const thumb = node.querySelector('.qc-known-for-thumb');
      if (thumb) thumb.outerHTML = '<div class="qc-known-for-thumb qc-thumb-empty" aria-hidden="true"></div>';
    });
  });
}

function moviesHandleCreditTabClick(btn) {
  const section = btn.closest('.qc-credits-section');
  const list = section && section.querySelector('.qc-credits-list');
  const personId = section && section.getAttribute('data-person-id');
  const category = btn.getAttribute('data-category');
  if (!section || !list || !personId || !category) return;
  const state = moviesGetCreditsState(personId);
  if (!state.groups || !state.groups[category]) return;
  section.querySelectorAll('.qc-credit-tab').forEach((t) => t.classList.toggle('qc-credit-tab-active', t === btn));
  list.setAttribute('data-category', category);
  list.setAttribute('data-shown', String(MOVIES_CREDITS_FIRST_PAGE_SIZE));
  moviesRenderCreditsList(personId, list, category, MOVIES_CREDITS_FIRST_PAGE_SIZE);
}

function moviesHandleCreditsLoadMoreClick(btn) {
  const list = btn.closest('.qc-credits-list');
  const section = list && list.closest('.qc-credits-section');
  const personId = section && section.getAttribute('data-person-id');
  const category = list && list.getAttribute('data-category');
  if (!list || !personId || !category) return;
  const shown = parseInt(list.getAttribute('data-shown'), 10) || MOVIES_CREDITS_FIRST_PAGE_SIZE;
  const newShown = shown + MOVIES_CREDITS_PAGE_SIZE;
  list.setAttribute('data-shown', String(newShown));
  moviesRenderCreditsList(personId, list, category, newShown);
}

function buildMoviesCreditsHtml(personId, filmography) {
  if (!filmography || !filmography.length) return '';
  const state = moviesGetCreditsState(personId);
  if (!state.groups) state.groups = moviesGroupFilmographyByCategory(filmography);
  const groups = state.groups;
  const defaultCat = moviesDefaultCreditCategory(groups);
  if (!defaultCat) return '';
  const tabsHtml = MOVIES_CREDIT_CATEGORY_PRIORITY
    .concat(Object.keys(groups).filter((c) => !MOVIES_CREDIT_CATEGORY_PRIORITY.includes(c)))
    .filter((cat) => groups[cat] && groups[cat].length)
    .map((cat) => {
      const active = cat === defaultCat ? ' qc-credit-tab-active' : '';
      const label = MOVIES_CREDIT_CATEGORY_LABELS[cat] || cat;
      return `<button type="button" class="qc-credit-tab${active}" data-category="${escapeHtml(cat)}">${escapeHtml(label)} \u00b7 ${groups[cat].length}</button>`;
    }).join('');
  const items = groups[defaultCat];
  const firstSlice = items.slice(0, MOVIES_CREDITS_FIRST_PAGE_SIZE);
  const itemsHtml = firstSlice.map((item) => moviesBuildCreditItemHtml(item, item.id ? state.resolved[item.id] : null)).join('');
  const remaining = items.length - MOVIES_CREDITS_FIRST_PAGE_SIZE;
  const moreHtml = remaining > 0
    ? `<button type="button" class="qc-credits-load-more">Show more</button>`
    : '';
  return `<div class="qc-section qc-credits-section" data-person-id="${escapeHtml(personId)}">
    <p class="qc-section-label">Credits</p>
    <div class="qc-credit-tabs">${tabsHtml}</div>
    <div class="qc-kf-list qc-credits-list" data-category="${escapeHtml(defaultCat)}" data-shown="${MOVIES_CREDITS_FIRST_PAGE_SIZE}">${itemsHtml}${moreHtml}</div>
  </div>`;
}

const MOVIES_MINI_CREDITS_FIRST = 5;
function buildKnownForMiniHtml(siteLinks) {
  if (!siteLinks || !siteLinks.filmography || !siteLinks.filmography.length) return '';
  const groups = moviesGroupFilmographyByCategory(siteLinks.filmography);
  const orderedCats = MOVIES_CREDIT_CATEGORY_PRIORITY
    .concat(Object.keys(groups).filter((c) => !MOVIES_CREDIT_CATEGORY_PRIORITY.includes(c)))
    .filter((cat) => groups[cat] && groups[cat].length);
  if (!orderedCats.length) return '';
  return orderedCats.map((cat) => {
    const items = groups[cat];
    const label = MOVIES_CREDIT_CATEGORY_LABELS[cat] || cat;
    const first = items.slice(0, MOVIES_MINI_CREDITS_FIRST);
    const rest = items.slice(MOVIES_MINI_CREDITS_FIRST);
    const rowHtml = (item) => {
      const nameHtml = item.id ? searchableNameByIds(item.title, item.id, 'title') : searchableName(item.title);
      return `<div class="qc-kf-mini-row"><span class="qc-kf-mini-name">${nameHtml}</span></div>`;
    };
    const visibleRows = first.map(rowHtml).join('');
    const moreBlock = rest.length
      ? `<details class="qc-kf-mini-more"><summary class="qc-kf-mini-more-summary">more</summary>${rest.map(rowHtml).join('')}</details>`
      : '';
    return `<details class="qc-kf-mini"><summary class="qc-kf-mini-summary">${escapeHtml(label)}</summary>${visibleRows}${moreBlock}</details>`;
  }).join('');
}

function buildPersonFullHtml(name, image, extra, link, options = {}) {
const siteLinks = options.siteLinks || null;
const facts = [];
if (extra && extra.ageInfo && typeof extra.ageInfo.age === 'number') {
facts.push(buildFactRow('📅', extra.ageInfo.deceased ? 'Died at' : 'Age', String(extra.ageInfo.age)));
}
if (extra && extra.born) facts.push(buildFactRow('🎂', 'Born', escapeHtml(extra.born)));
if (extra && extra.birthPlace) facts.push(buildFactRow('📍', 'Birthplace', escapeHtml(extra.birthPlace)));
if (extra && extra.occupation && extra.occupation.length) {
facts.push(buildFactRow('🎞️', 'Occupation', escapeHtml(extra.occupation.slice(0, 4).join(', '))));
}
const factGridHtml = facts.length ? `<div class="qc-fact-grid">${facts.join('')}</div>` : '';

const bioText = siteLinks && siteLinks.biography;

const aboutHtml = bioText
? `<div class="qc-section"><p class="qc-section-label">Biography</p>${buildMoviesCollapsibleParagraph(bioText)}</div>`
: '';

const personId = (link && link.includes("/name/")) ? (link.split("/name/")[1] || "").split("/")[0] : null;
const knownForHtml = (personId && siteLinks && siteLinks.filmography)
  ? buildMoviesCreditsHtml(personId, siteLinks.filmography)
  : '';

const awardsBreakdown = siteLinks && siteLinks.awardsBreakdown;
const awardsRowsHtml = awardsBreakdown
  ? moviesBuildAwardsRowHtml(awardsBreakdown, ['academy']) + moviesBuildAwardsRowHtml(awardsBreakdown, ['goldenglobe', 'emmy'])
  : '';
const awardsHtml = awardsRowsHtml
? `<div class="qc-section qc-movies-awards-box"> <p class="qc-section-label">Notable Awards</p> ${awardsRowsHtml} ${buildTextLinkHtml('Full awards history', siteLinks.awardsUrl)} </div>`
: '';
const extraLinks = [{ label: 'IMDb', url: link }];
if (siteLinks) {
if (siteLinks.wikipediaUrl) extraLinks.push({ label: 'Wikipedia', url: siteLinks.wikipediaUrl });
if (siteLinks.twitterUrl) extraLinks.push({ label: 'Twitter', url: siteLinks.twitterUrl });
if (siteLinks.instagramUrl) extraLinks.push({ label: 'Instagram', url: siteLinks.instagramUrl });
if (siteLinks.letterboxdUrl) extraLinks.push({ label: 'Letterboxd', url: siteLinks.letterboxdUrl });
if (siteLinks.officialWebsite) extraLinks.push({ label: 'Website', url: siteLinks.officialWebsite });
if (!awardsRowsHtml && siteLinks.awardsUrl) extraLinks.push({ label: 'Awards', url: siteLinks.awardsUrl });
}
moviesAppendCustomLinks(extraLinks, personId || '', name);
const footerHtml = `<div class="qc-section"><p class="qc-section-label">More on</p><div class="qc-footer-strip">${buildExternalLinksHtml(extraLinks)}</div></div>`;
const noDataHtml = (!facts.length && !knownForHtml && !aboutHtml && options.statusMessage)
? `<p class="${options.statusMessage.hasError ? 'extra-error' : 'extra-disabled'}">${escapeHtml(options.statusMessage.message)}</p>`
: '';
const imgHtml = image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer">` : '';
return `<div class="row"> ${imgHtml} <div class="content"> <p class="name qc-selectable">${escapeHtml(name)}</p> ${factGridHtml} </div> </div> ${noDataHtml} ${aboutHtml} ${knownForHtml} ${awardsHtml} ${footerHtml}`;
}

function moviesAppendCustomLinks(extraLinks, id, name) {
  for (const customLink of (moviesSettings.customLinks || [])) {
    const url = buildCustomLinkUrl(customLink.urlTemplate, id, name);
    if (!url) continue;
    extraLinks.push({
      label: (customLink.label && customLink.label.trim()) || 'Custom Link',
      url,
      icon: customLink.icon || null
    });
  }
  return extraLinks;
}

function buildCustomLinkUrl(template, imdbId, title) {
  const titleDash = String(title || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return String(template || '')
    .replace(/\{imdb_id\}/g, imdbId || '')
    .replace(/\{title_dash\}/g, titleDash)
    .replace(/\{title\}/g, encodeURIComponent(title || ''));
}

function buildBoxOfficeHtml(boxOffice) {
  if (!boxOffice || (!boxOffice.domestic && !boxOffice.worldwide)) return '';

  if (getPopupStyleClass() !== 'qc-style-full') return buildBoxOfficeMiniText(boxOffice);
  const line = (label, amount, percent) => `
    <div class="qc-boxoffice-row">
      <span class="qc-boxoffice-label">${escapeHtml(label)}${percent != null ? ` <span class="qc-boxoffice-percent">(${percent}%)</span>` : ''}</span>
      <span class="qc-boxoffice-amount">${escapeHtml(amount)}</span>
    </div>`;
  const rows = [];
  if (boxOffice.domestic) rows.push(line('Domestic', boxOffice.domestic, boxOffice.domesticPercent));
  if (boxOffice.international) rows.push(line('International', boxOffice.international, boxOffice.internationalPercent));
  if (boxOffice.worldwide) rows.push(line('Worldwide', boxOffice.worldwide, null));
  const budgetRow = boxOffice.budget
    ? `<div class="qc-boxoffice-budget">Budget: <b>${escapeHtml(boxOffice.budget)}</b></div>`
    : '';
  return `
    <div class="qc-boxoffice-block qc-selectable">
      <div class="qc-boxoffice-title">Box Office${buildInlineIconLink('Box Office Mojo', boxOffice.boxOfficeMojoUrl)}</div>
      ${rows.join('')}
      ${budgetRow}
    </div>`;
}

function buildBoxOfficeMiniText(boxOffice) {
  const miniRows = [];
  if (boxOffice.domestic) miniRows.push(`Domestic: <b>${escapeHtml(boxOffice.domestic)}</b>`);
  if (boxOffice.international) miniRows.push(`International: <b>${escapeHtml(boxOffice.international)}</b>`);
  if (boxOffice.worldwide) miniRows.push(`Worldwide: <b>${escapeHtml(boxOffice.worldwide)}</b>`);
  if (boxOffice.budget) miniRows.push(`Budget: <b>${escapeHtml(boxOffice.budget)}</b>`);
  if (!miniRows.length) return '';
  return miniRows.map((miniRow) => `<div>${miniRow}</div>`).join('');
}

function moviesQuickTypeLabelFromQualifier(qualifier) {
  const q = String(qualifier || '').toLowerCase();
  if (/episode/.test(q)) return 'Episode';
  if (/mini[- ]?series/.test(q)) return 'TV Mini-Series';
  if (/tv series/.test(q)) return 'TV Series';
  if (/tv movie/.test(q)) return 'TV Movie';
  if (/tv special/.test(q)) return 'TV Special';
  if (/video game/.test(q)) return 'Game';
  if (/short/.test(q)) return 'Short';
  if (/video/.test(q)) return 'Video';
  if (/series/.test(q)) return 'TV Series';
  return null;
}

function moviesAwardsBlockHtml(label, count, kind, sizeTier) {
  return count > 0 ? `<div class="qc-stat-block qc-stat-${kind} qc-award-${sizeTier}"><div class="qc-stat-num">${count}×</div><div class="qc-stat-label">${escapeHtml(label)}</div></div>` : '';
}

const MOVIES_AWARD_FAMILY_LABELS = { academy: 'Academy Awards', goldenglobe: 'Golden Globe', emmy: 'Emmy' };

function moviesAwardsBoxSizeTier(totalFamilySlotsInRow, boxesPresentInFamily) {
  if (totalFamilySlotsInRow === 1) return 'half';
  return boxesPresentInFamily === 1 ? 'half' : 'quarter';
}

function moviesBuildAwardsRowHtml(breakdown, familyKeys) {
  if (!breakdown) return '';
  const blocks = [];
  familyKeys.forEach((key) => {
    const family = breakdown[key];
    if (!family) return;
    const label = MOVIES_AWARD_FAMILY_LABELS[key];
    const boxesPresentInFamily = (family.wins > 0 ? 1 : 0) + (family.nominations > 0 ? 1 : 0);
    const sizeTier = moviesAwardsBoxSizeTier(familyKeys.length, boxesPresentInFamily);
    blocks.push(moviesAwardsBlockHtml(`${label} Wins`, family.wins, 'win', sizeTier));
    blocks.push(moviesAwardsBlockHtml(`${label} Nominations`, family.nominations, 'nom', sizeTier));
  });
  const inner = blocks.join('');
  return inner ? `<div class="qc-stat-row">${inner}</div>` : '';
}

function moviesBuildAwardsMiniLine(breakdown, familyKeys) {
  if (!breakdown) return '';
  const parts = [];
  familyKeys.forEach((key) => {
    const family = breakdown[key];
    if (!family) return;
    const label = MOVIES_AWARD_FAMILY_LABELS[key];
    if (family.wins > 0) parts.push(`${family.wins} ${label} wins`);
    if (family.nominations > 0) parts.push(`${family.nominations} ${label} nominations`);
  });
  return parts.join(', ');
}

function moviesAwardsFamiliesForType(titleType) {
  return titleType === 'movie' ? ['academy', 'goldenglobe'] : ['goldenglobe', 'emmy'];
}

const QC_RATING_CIRCLE_R = 16;
const QC_RATING_CIRCLE_C = 2 * Math.PI * QC_RATING_CIRCLE_R;

const QC_RATING_GAUGE_GAP_DEG = 90;
const QC_RATING_GAUGE_SWEEP_DEG = 360 - QC_RATING_GAUGE_GAP_DEG;
const QC_RATING_GAUGE_SWEEP_LEN = QC_RATING_CIRCLE_C * (QC_RATING_GAUGE_SWEEP_DEG / 360);
const QC_RATING_GAUGE_ROTATION_DEG = 90 + QC_RATING_GAUGE_GAP_DEG / 2;
let qcRatingCircleGradientSeq = 0;

function qcLightenHexColor(hex, amount) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return hex;
  const mix = (c) => Math.round(parseInt(c, 16) + (255 - parseInt(c, 16)) * amount);
  return `rgb(${mix(m[1])}, ${mix(m[2])}, ${mix(m[3])})`;
}

function buildRatingCircleHtml(value, max, color, subLabel, tooltipSourceLabel, count, url) {
  if (value == null) return '';
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  const filledLen = (QC_RATING_GAUGE_SWEEP_LEN * percent) / 100;
  const trackGapLen = QC_RATING_CIRCLE_C - QC_RATING_GAUGE_SWEEP_LEN;
  const mainText = max === 100 ? `${Math.round(value)}%` : (Number.isInteger(value) ? value : Math.round(value * 100) / 100);
  const tooltip = `${tooltipSourceLabel}${count != null ? ` - ${count.toLocaleString('en-US')} votes` : ''}`;

  const linkAttrs = url ? ` class="qc-rating-circle qc-title-link" data-link="${escapeHtml(url)}"` : ' class="qc-rating-circle"';

  const gradientId = `qc-rc-grad-${++qcRatingCircleGradientSeq}`;
  return `
    <div${linkAttrs} style="--qc-rc-color:${color};">
      <svg viewBox="0 0 40 40">
        <defs>
          <linearGradient id="${gradientId}" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${qcLightenHexColor(color, 0.55)}"></stop>
            <stop offset="100%" stop-color="${color}"></stop>
          </linearGradient>
        </defs>
        <circle class="qc-rc-bg" cx="20" cy="20" r="${QC_RATING_CIRCLE_R}" style="stroke-dasharray:${QC_RATING_GAUGE_SWEEP_LEN.toFixed(2)} ${trackGapLen.toFixed(2)};"></circle>
        <circle class="qc-rc-fg" cx="20" cy="20" r="${QC_RATING_CIRCLE_R}" stroke="url(#${gradientId})" style="stroke-dasharray:${filledLen.toFixed(2)} ${(QC_RATING_CIRCLE_C - filledLen).toFixed(2)};"></circle>
      </svg>
      <div class="qc-rating-circle-value"><b>${escapeHtml(String(mainText))}</b><small>${escapeHtml(subLabel)}</small></div>
      <div class="qc-rating-circle-tooltip">${escapeHtml(tooltip)}</div>
    </div>
  `;
}

function buildMoviesRatingsLineHtml(extra, siteLinks) {
  if (!extra) return '';
  const circles = [];

  const rt = extra.rottenTomatoes;
  if (rt) {
    if (rt.usersRating != null) circles.push(buildRatingCircleHtml(rt.usersRating, 100, '#fa320a', 'USERS', 'RT (Users)', rt.usersRatingCount));
    if (rt.criticsRating != null) circles.push(buildRatingCircleHtml(rt.criticsRating, 100, '#00a65a', 'CRITICS', 'RT (Critics)', rt.criticsRatingCount));
  }

  const mc = extra.metacritic;
  if (mc) {
    if (mc.usersRating != null) circles.push(buildRatingCircleHtml(mc.usersRating, 10, '#f5a623', '/10', 'Metacritic (Users)', mc.usersRatingCount));
    if (mc.criticsRating != null) circles.push(buildRatingCircleHtml(mc.criticsRating, 100, '#1a1a1a', '/100', 'Metacritic (Critics)', mc.criticsRatingCount));
  }

  const lb = extra.letterboxd;
  if (lb && lb.usersRating != null) circles.push(buildRatingCircleHtml(lb.usersRating, 5, '#ff8000', '/5', 'Letterboxd', lb.usersRatingCount));

  const tmdb = extra.tmdbRating;
  if (tmdb && tmdb.usersRating != null) circles.push(buildRatingCircleHtml(tmdb.usersRating, 10, '#01b4e4', '/10', 'TMDb', tmdb.usersRatingCount));

  const trakt = extra.trakt;
  if (trakt && trakt.usersRating != null) circles.push(buildRatingCircleHtml(trakt.usersRating, 100, '#715bff', '/100', 'Trakt', trakt.usersRatingCount));

  if (moviesSettings.malFieldScore && siteLinks && siteLinks.malScore != null) {
    circles.push(buildRatingCircleHtml(siteLinks.malScore, 10, '#2e51a2', '/10', 'MyAnimeList', null, siteLinks.malUrl));
  }

  if (!circles.length) return '';
  return `<div class="qc-rating-circles-row qc-selectable">${circles.join('')}</div>`;
}

function qcRatingMiniNum(value) {
  return Number.isInteger(value) ? value : Math.round(value * 100) / 100;
}
function buildMoviesRatingsMiniHtml(extra, siteLinks) {
  if (!extra) return '';
  const rows = [];

  const rt = extra.rottenTomatoes;
  if (rt) {
    if (rt.usersRating != null) rows.push(['RT (Users)', `${Math.round(rt.usersRating)}%`]);
    if (rt.criticsRating != null) rows.push(['RT (Critics)', `${Math.round(rt.criticsRating)}%`]);
  }

  const mc = extra.metacritic;
  if (mc) {
    if (mc.usersRating != null) rows.push(['Metacritic (Users)', `${qcRatingMiniNum(mc.usersRating)}/10`]);
    if (mc.criticsRating != null) rows.push(['Metacritic (Critics)', `${Math.round(mc.criticsRating)}/100`]);
  }

  const lb = extra.letterboxd;
  if (lb && lb.usersRating != null) rows.push(['Letterboxd', `${qcRatingMiniNum(lb.usersRating)}/5`]);

  const tmdb = extra.tmdbRating;
  if (tmdb && tmdb.usersRating != null) rows.push(['TMDb', `${qcRatingMiniNum(tmdb.usersRating)}/10`]);

  const trakt = extra.trakt;
  if (trakt && trakt.usersRating != null) rows.push(['Trakt', `${Math.round(trakt.usersRating)}%`]);

  if (moviesSettings.malFieldScore && siteLinks && siteLinks.malScore != null) {
    rows.push(['MyAnimeList', `${qcRatingMiniNum(siteLinks.malScore)}/10`, siteLinks.malUrl]);
  }

  if (!rows.length) return '';
  const rowsHtml = rows.map(([label, value, url]) => {
    const rowClass = url ? 'qc-kf-mini-row qc-title-link' : 'qc-kf-mini-row';
    const linkAttr = url ? ` data-link="${escapeHtml(url)}"` : '';
    return `<div class="${rowClass}"${linkAttr}><span class="qc-kf-mini-name">${escapeHtml(label)}</span><span class="qc-kf-mini-role">${escapeHtml(value)}</span></div>`;
  }).join('');
  return `<details class="qc-kf-mini"><summary class="qc-kf-mini-summary">Ratings</summary>${rowsHtml}</details>`;
}

function buildMoviesRatingsStatusHtml(extra, siteLinks, siteLinksReady = false) {
  if (!extra || !extra.ratingsStatusRaw) return '';

  if (extra.ratingsStatusRaw.disabled) return '';
  const status = formatExtraInfoStatus('Ratings', extra.ratingsStatusRaw);
  if (!status) return '';

  if (extra.ratingsStatusRaw.noData && moviesSettings.malFieldScore) {
    if (!siteLinksReady) return '';
    if (siteLinks && siteLinks.malScore != null) return '';
  }
  return `<p class="${status.hasError ? 'extra-error' : 'extra-disabled'}">${escapeHtml(status.message)}</p>`;
}

function buildMoviesYoutubeLinkEntry(extra, name) {
  if (extra && extra.trailerYoutubeId) {
    return { label: 'Trailer', url: `https://www.youtube.com/watch?v=${encodeURIComponent(extra.trailerYoutubeId)}` };
  }
  return { label: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(name)}` };
}

function buildTitleHtml(name, image, year, extra, link, statusMessage = null, tvmazeExtra = null, tvmazeStatusMessage = null, siteLinks = null, isSeries = false, id, bookSource = null, topListInfo = null, boxOffice = null, quickTypeLabel = null, siteLinksReady = false) {
  if (getPopupStyleClass() === 'qc-style-full') {
    return buildTitleFullHtml(name, image, year, extra, link, statusMessage, tvmazeExtra, tvmazeStatusMessage, siteLinks, isSeries, id, bookSource, topListInfo, boxOffice, quickTypeLabel, siteLinksReady);
  }

  const rows = [];

  if (extra && extra.titleTypeLabel) rows.push(`Type: <b>${escapeHtml(extra.titleTypeLabel)}</b>`);
  if (extra && extra.imdbRating) rows.push(`IMDb: <b>★ ${escapeHtml(extra.imdbRating)}/10</b>`);
  if (moviesSettings.ratingFieldCinemaScore && extra && extra.cinemaScore) {
    rows.push(`<span class="qc-cinemascore-grade" title="CinemaScore">${escapeHtml(extra.cinemaScore)}</span>`);
  }

  const miniRatingsRowHtml = buildMoviesRatingsMiniHtml(extra, siteLinks);

  const castMiniHtml = buildCastMiniHtml(extra && extra.cast);

  if (extra && extra.titleType === 'tvEpisode' && extra.seriesName && extra.parentId) {
    rows.push(`Series: <b>${searchableNameByIds(extra.seriesName, extra.parentId, 'title')}</b>`);
  }
  if (extra && extra.directorValue && extra.directorValue.length) rows.push(`Director: <b>${searchableNameList(extra.directorValue, extra.directorIds)}</b>`);

  if (tvmazeExtra && tvmazeExtra.creator && tvmazeExtra.creator.length) rows.push(`Creator: <b>${searchableNameList(tvmazeExtra.creator)}</b>`);
  if (extra && extra.writerValue && extra.writerValue.length) rows.push(`Writer: <b>${searchableNameList(extra.writerValue, extra.writerIds)}</b>`);

  if (extra && extra.awardsBreakdown) {
    const awardsMiniLine = moviesBuildAwardsMiniLine(extra.awardsBreakdown, moviesAwardsFamiliesForType(extra.titleType));
    if (awardsMiniLine) rows.push(`Awards: <b>${escapeHtml(awardsMiniLine)}</b>${buildInlineIconLink('Awards', extra.awardsUrl)}`);
  }

  if (tvmazeExtra && tvmazeExtra.status) rows.push(`Status: <b>${escapeHtml(tvmazeExtra.status)}</b>`);
  if (tvmazeExtra && tvmazeExtra.network) rows.push(`Network: <b>${escapeHtml(tvmazeExtra.network)}</b>`);
  if (tvmazeExtra && tvmazeExtra.schedule) rows.push(`Schedule: <b>${escapeHtml(tvmazeExtra.schedule)}</b>`);

  if (tvmazeExtra && tvmazeExtra.nextEpisodeInfo) {
    const ep = tvmazeExtra.nextEpisodeInfo;
    const epLabel = [ep.label, ep.name].filter(Boolean).join(' - ');
    const seasonLink = buildEpisodeSeasonLinkHtml(id, epLabel);
    rows.push(`Next episode: <b>${escapeHtml(ep.airdate)}</b>${epLabel ? ` (${escapeHtml(epLabel)})` : ''}${seasonLink}`);
  }

  if (tvmazeExtra && tvmazeExtra.previousEpisodeInfo) {
    const ep = tvmazeExtra.previousEpisodeInfo;
    const epLabel = [ep.label, ep.name].filter(Boolean).join(' - ');
    const seasonLink = buildEpisodeSeasonLinkHtml(id, epLabel);
    rows.push(`Last episode: <b>${escapeHtml(ep.airdate)}</b>${epLabel ? ` (${escapeHtml(epLabel)})` : ''}${seasonLink}`);
  }

  if (bookSource && bookSource.olId) {
    const bookLabel = bookSource.title || 'Book';
    const viaNote = bookSource.isSeriesFirstBook && bookSource.seriesTitle
      ? ` <span style="color:#8a8a93;">(first book of ${escapeHtml(bookSource.seriesTitle)})</span>`
      : '';
    rows.push(`Based on: <b><span class="qc-nav-link" data-nav-pack="books" data-nav-kind="book" data-nav-id="${escapeHtml(bookSource.olId)}">${escapeHtml(bookLabel)}</span></b>${viaNote}`);
  }

  if (!rows.length && year) rows.push(`Year: <b>${escapeHtml(year)}</b>`);

  const boxOfficeMiniRowsHtml = buildBoxOfficeHtml(boxOffice);
  if (boxOfficeMiniRowsHtml) rows.push(boxOfficeMiniRowsHtml);

  if (!extra && statusMessage) {
    rows.push(`<span class="${statusMessage.hasError ? 'extra-error' : 'extra-disabled'}">${escapeHtml(statusMessage.message)}</span>`);
  }
  if (!tvmazeExtra && tvmazeStatusMessage) {
    rows.push(`<span class="${tvmazeStatusMessage.hasError ? 'extra-error' : 'extra-disabled'}">${escapeHtml(tvmazeStatusMessage.message)}</span>`);
  }

  const extraLinks = [{ label: 'IMDb', url: link }];

  if (isSeries && moviesSettings.tvmazeShowLink && tvmazeExtra && tvmazeExtra.tvmazeUrl) {
    extraLinks.push({ label: 'TVmaze', url: tvmazeExtra.tvmazeUrl });
  }

  if (siteLinks) {
    if (siteLinks.rottenTomatoesUrl) extraLinks.push({ label: 'Rotten Tomatoes', url: siteLinks.rottenTomatoesUrl });
    if (siteLinks.metacriticUrl) extraLinks.push({ label: 'Metacritic', url: siteLinks.metacriticUrl });
    if (siteLinks.tmdbUrl) extraLinks.push({ label: 'TMDb', url: siteLinks.tmdbUrl });
    if (siteLinks.netflixUrl) extraLinks.push({ label: 'Netflix', url: siteLinks.netflixUrl });
    if (siteLinks.disneyPlusUrl) extraLinks.push({ label: 'Disney+', url: siteLinks.disneyPlusUrl });
    if (siteLinks.hboMaxUrl) extraLinks.push({ label: 'Max', url: siteLinks.hboMaxUrl });
    if (siteLinks.primeVideoUrl) extraLinks.push({ label: 'Prime Video', url: siteLinks.primeVideoUrl });
    if (siteLinks.appleTvUrl) extraLinks.push({ label: 'Apple TV', url: siteLinks.appleTvUrl });
    if (siteLinks.plexUrl) extraLinks.push({ label: 'Plex', url: siteLinks.plexUrl });
    if (siteLinks.letterboxdUrl) extraLinks.push({ label: 'Letterboxd', url: siteLinks.letterboxdUrl });
    if (siteLinks.myAnimeListUrl) extraLinks.push({ label: 'MyAnimeList', url: siteLinks.myAnimeListUrl });
    if (siteLinks.aniListUrl) extraLinks.push({ label: 'AniList', url: siteLinks.aniListUrl });
    if (siteLinks.crunchyrollUrl) extraLinks.push({ label: 'Crunchyroll', url: siteLinks.crunchyrollUrl });
    if (siteLinks.peacockUrl) extraLinks.push({ label: 'Peacock', url: siteLinks.peacockUrl });
    if (siteLinks.huluUrl) extraLinks.push({ label: 'Hulu', url: siteLinks.huluUrl });
    if (siteLinks.traktUrl) extraLinks.push({ label: 'Trakt', url: siteLinks.traktUrl });

    if (siteLinks.wikipediaUrl) extraLinks.push({ label: 'Wikipedia', url: siteLinks.wikipediaUrl });
  }

  if (moviesSettings.showYoutubeSearchLink && extra) {
    extraLinks.push(buildMoviesYoutubeLinkEntry(extra, name));
  }

  for (const customLink of moviesSettings.customLinks) {
    const url = buildCustomLinkUrl(customLink.urlTemplate, id, name);
    if (!url) continue;
    extraLinks.push({
      label: (customLink.label && customLink.label.trim()) || 'Custom Link',
      url,
      icon: customLink.icon || null
    });
  }

  const imgHtml = image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer">` : '';

  const topBadgeHtml = '';

  const miniRatingsStatusHtml = buildMoviesRatingsStatusHtml(extra, siteLinks, siteLinksReady);

  return `
    <div class="row">
      ${imgHtml}
      ${topBadgeHtml}
      <div class="content">
        <p class="name qc-selectable">${escapeHtml(name)}</p>
        <div class="meta qc-selectable">${rows.length ? rows.map((r) => `<div>${r}</div>`).join('') : '<div>Extra info: <b>N/A</b></div>'}</div>
        ${miniRatingsRowHtml}
        ${castMiniHtml}
        ${buildExternalLinksHtml(extraLinks)}
        ${miniRatingsStatusHtml}
      </div>
    </div>
  `;
}

function buildInfoBox(label, valueHtml, options = {}) {
  if (!valueHtml) return '';
  const cornerHtml = options.cornerBadge
    ? `<span class="qc-info-corner-badge">${options.cornerBadge}</span>`
    : '';
  const valueClass = options.cornerBadge ? 'qc-info-box-value qc-info-box-value-padded qc-selectable' : 'qc-info-box-value qc-selectable';
  return `<div class="qc-info-box">${cornerHtml}<div class="qc-info-box-label">${escapeHtml(label)}</div><div class="${valueClass}">${valueHtml}</div></div>`;
}

function buildInfoBoxRow(boxAHtml, boxBHtml) {
  const boxes = [boxAHtml, boxBHtml].filter(Boolean);
  if (!boxes.length) return '';
  return `<div class="qc-info-row qc-selectable">${boxes.join('')}</div>`;
}

function buildEpisodeInfoBox(labelText, ep, id) {
  if (!ep) return '';
  const epLabel = [ep.label, ep.name].filter(Boolean).join(' - ');
  const seasonLink = buildEpisodeSeasonLinkHtml(id, epLabel);
  const valueHtml = `${epLabel ? escapeHtml(epLabel) : 'Episode'}${seasonLink}`;
  return buildInfoBox(labelText, valueHtml, { cornerBadge: ep.airdate ? escapeHtml(ep.airdate) : '' });
}

function buildTitleFullHtml(name, image, year, extra, link, statusMessage, tvmazeExtra, tvmazeStatusMessage, siteLinks, isSeries, id, bookSource = null, topListInfo = null, boxOffice = null, quickTypeLabel = null, siteLinksReady = false) {
  const typeLabel = (extra && extra.titleTypeLabel) || quickTypeLabel || (isSeries ? 'TV Series' : 'Movie');

  const isEpisodeOrSeriesForDate = isSeries || quickTypeLabel === 'Episode' || (extra && extra.titleType === 'tvEpisode');
  const displayYear = (extra && extra.titleType === 'tvEpisode' && extra.releasedDate)
    || (extra && extra.titleYear)
    || (isEpisodeOrSeriesForDate ? null : year);

  const subtitleExtras = [];

  if (extra && extra.runtime) subtitleExtras.push(escapeHtml(extra.runtime));
  const subtitle = displayYear
    ? `${escapeHtml(typeLabel)} (${escapeHtml(displayYear)})${subtitleExtras.length ? ` • ${subtitleExtras.join(' • ')}` : ''}`
    : escapeHtml(typeLabel);

  const badges = [];
  if (extra && extra.imdbRating) {

    const votesHtml = extra.imdbVotes ? ` <span class="qc-badge-rating-votes">(${escapeHtml(extra.imdbVotes)})</span>` : '';
    badges.push(`<span class="qc-badge-rating" title="IMDb Rating"><span class="qc-star">★</span>${escapeHtml(extra.imdbRating)}${votesHtml}</span>`);
  }

  if (moviesSettings.ratingFieldCinemaScore && extra && extra.cinemaScore) {
    badges.push(`<span class="qc-cinemascore-grade" title="CinemaScore">${escapeHtml(extra.cinemaScore)}</span>`);
  }
  if (tvmazeExtra && tvmazeExtra.status) badges.push(`<span class="qc-badge-status">${escapeHtml(tvmazeExtra.status)}</span>`);
  const badgeRowHtml = badges.length ? `<div class="qc-badge-row">${badges.join('')}</div>` : '';

  const genreChips = (extra && extra.genre)
    ? extra.genre.split(',').map((g) => g.trim()).filter(Boolean)
    : [];

  const plotText = isSeries ? (tvmazeExtra && tvmazeExtra.summary) : (extra && extra.plot);

  const descHtml = buildMoviesCollapsibleParagraph(plotText, 'padding-top:20px;');
  const chipRowHtml = genreChips.length
    ? `<div class="qc-chip-row">${genreChips.map((g) => `<span class="qc-chip">${escapeHtml(g)}</span>`).join('')}</div>`
    : '';

  const castHtml = buildCastHtml(extra && extra.cast, extra && extra.actorImages, id, moviesSettings.showActorPhotos);

  const directorBoxHtml = (extra && extra.directorValue && extra.directorValue.length)
    ? buildInfoBox('Director', searchableNameList(extra.directorValue, extra.directorIds))
    : '';
  const creatorBoxHtml = (isSeries && tvmazeExtra && tvmazeExtra.creator && tvmazeExtra.creator.length)
    ? buildInfoBox('Creator', searchableNameList(tvmazeExtra.creator))
    : '';
  const writerBoxHtml = (extra && extra.writerValue && extra.writerValue.length)
    ? buildInfoBox('Writer', searchableNameList(extra.writerValue, extra.writerIds))
    : '';
  const networkBoxHtml = (tvmazeExtra && tvmazeExtra.network)
    ? buildInfoBox('Network', escapeHtml(tvmazeExtra.network))
    : '';

  const seriesBoxHtml = (extra && extra.titleType === 'tvEpisode' && extra.seriesName && extra.parentId)
    ? buildInfoBox('Series', searchableNameByIds(extra.seriesName, extra.parentId, 'title'))
    : '';
  const seriesRowHtml = seriesBoxHtml ? buildInfoBoxRow(seriesBoxHtml, '') : '';

  const row1Html = isSeries
    ? buildInfoBoxRow(creatorBoxHtml, networkBoxHtml)
    : buildInfoBoxRow(directorBoxHtml, writerBoxHtml);

  const statusBoxHtml = (tvmazeExtra && tvmazeExtra.status)
    ? buildInfoBox('Status', `${displayYear ? `  ${escapeHtml(displayYear)}` : ''} <span class="qc-info-pill">${escapeHtml(tvmazeExtra.status.toUpperCase())}</span>`)
    : '';
  const scheduleBoxHtml = (tvmazeExtra && tvmazeExtra.schedule)
    ? buildInfoBox('Schedule', escapeHtml(tvmazeExtra.schedule))
    : '';

  const row2Html = isSeries ? buildInfoBoxRow(statusBoxHtml, scheduleBoxHtml) : '';

  const bookBoxHtml = (bookSource && bookSource.olId)
    ? (() => {
        const bookLabel = bookSource.title || 'Book';
        const viaNote = bookSource.isSeriesFirstBook && bookSource.seriesTitle
          ? ` <span class="qc-info-box-sub">(first book of ${escapeHtml(bookSource.seriesTitle)})</span>`
          : '';
        return buildInfoBox('Based On', `<span class="qc-nav-link" data-nav-pack="books" data-nav-kind="book" data-nav-id="${escapeHtml(bookSource.olId)}">${escapeHtml(bookLabel)}</span>${viaNote}`);
      })()
    : '';

  const prevEpisodeBoxHtml = (isSeries && tvmazeExtra && tvmazeExtra.previousEpisodeInfo)
    ? buildEpisodeInfoBox('Last Episode', tvmazeExtra.previousEpisodeInfo, id)
    : '';
  const nextEpisodeBoxHtml = (isSeries && tvmazeExtra && tvmazeExtra.nextEpisodeInfo)
    ? buildEpisodeInfoBox('Next Episode', tvmazeExtra.nextEpisodeInfo, id)
    : '';

  const boxOfficeHtml = buildBoxOfficeHtml(boxOffice);

  const seasonTableHtml = (isSeries && id && moviesSettings.seasonTableEnabled)
    ? buildSeasonTablePlaceholderHtml(id, name)
    : '';

  const extraLinks = [{ label: 'IMDb', url: link }];
  if (isSeries && moviesSettings.tvmazeShowLink && tvmazeExtra && tvmazeExtra.tvmazeUrl) {
    extraLinks.push({ label: 'TVmaze', url: tvmazeExtra.tvmazeUrl });
  }
  if (siteLinks) {
    if (siteLinks.rottenTomatoesUrl) extraLinks.push({ label: 'Rotten Tomatoes', url: siteLinks.rottenTomatoesUrl });
    if (siteLinks.metacriticUrl) extraLinks.push({ label: 'Metacritic', url: siteLinks.metacriticUrl });
    if (siteLinks.tmdbUrl) extraLinks.push({ label: 'TMDb', url: siteLinks.tmdbUrl });
    if (siteLinks.netflixUrl) extraLinks.push({ label: 'Netflix', url: siteLinks.netflixUrl });
    if (siteLinks.disneyPlusUrl) extraLinks.push({ label: 'Disney+', url: siteLinks.disneyPlusUrl });
    if (siteLinks.hboMaxUrl) extraLinks.push({ label: 'Max', url: siteLinks.hboMaxUrl });
    if (siteLinks.primeVideoUrl) extraLinks.push({ label: 'Prime Video', url: siteLinks.primeVideoUrl });
    if (siteLinks.appleTvUrl) extraLinks.push({ label: 'Apple TV', url: siteLinks.appleTvUrl });
    if (siteLinks.plexUrl) extraLinks.push({ label: 'Plex', url: siteLinks.plexUrl });
    if (siteLinks.letterboxdUrl) extraLinks.push({ label: 'Letterboxd', url: siteLinks.letterboxdUrl });
    if (siteLinks.myAnimeListUrl) extraLinks.push({ label: 'MyAnimeList', url: siteLinks.myAnimeListUrl });
    if (siteLinks.aniListUrl) extraLinks.push({ label: 'AniList', url: siteLinks.aniListUrl });
    if (siteLinks.crunchyrollUrl) extraLinks.push({ label: 'Crunchyroll', url: siteLinks.crunchyrollUrl });
    if (siteLinks.peacockUrl) extraLinks.push({ label: 'Peacock', url: siteLinks.peacockUrl });
    if (siteLinks.huluUrl) extraLinks.push({ label: 'Hulu', url: siteLinks.huluUrl });
    if (siteLinks.traktUrl) extraLinks.push({ label: 'Trakt', url: siteLinks.traktUrl });

    if (siteLinks.wikipediaUrl) extraLinks.push({ label: 'Wikipedia', url: siteLinks.wikipediaUrl });
  }

  if (moviesSettings.showYoutubeSearchLink && extra) {
    extraLinks.push(buildMoviesYoutubeLinkEntry(extra, name));
  }
  for (const customLink of moviesSettings.customLinks) {
    const url = buildCustomLinkUrl(customLink.urlTemplate, id, name);
    if (!url) continue;
    extraLinks.push({
      label: (customLink.label && customLink.label.trim()) || 'Custom Link',
      url,
      icon: customLink.icon || null
    });
  }

  const { watch, footer } = splitLinksForFullStyle(extraLinks);

  const ratingsLineHtml = buildMoviesRatingsLineHtml(extra, siteLinks);
  const ratingsStatusHtml = buildMoviesRatingsStatusHtml(extra, siteLinks, siteLinksReady);
  const watchSectionHtml = watch.length
    ? `<div class="qc-section"><p class="qc-section-label">Where to Watch</p>${buildIconBadgeGridHtml(watch, { showLabel: false })}</div>`
    : '';
  const footerSectionHtml = footer.length
    ? `<div class="qc-section"><p class="qc-section-label">More on</p><div class="qc-footer-strip">${buildExternalLinksHtml(footer)}</div></div>`
    : '';

  const countryParts = [];
  if (isSeries) {
    if (moviesSettings.tvmazeFieldCountry && tvmazeExtra && tvmazeExtra.country) countryParts.push(tvmazeExtra.country);
  } else {
    if (moviesSettings.movieFieldCountry && extra && extra.country) countryParts.push(extra.country);
  }
  const countryBoxHtml = countryParts.length
    ? buildInfoBox('Country', escapeHtml(countryParts.join(' • ')))
    : '';

  const awardsRowHtml = extra ? moviesBuildAwardsRowHtml(extra.awardsBreakdown, moviesAwardsFamiliesForType(extra.titleType)) : '';
  const awardsBoxHtml = awardsRowHtml
    ? `<div class="qc-section qc-movies-awards-box"><p class="qc-section-label">Notable Awards</p>${awardsRowHtml}${buildTextLinkHtml('Full awards history', extra.awardsUrl)}</div>`
    : '';

  const imgHtml = image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer">` : '';
  const topBadgeHtml = buildTopListBadgeHtml(topListInfo, image);

  return `
    <div class="row">
      ${imgHtml}
      ${topBadgeHtml}
      <div class="content">
        <p class="name qc-selectable"><button type="button" class="qc-title-link" data-link="${escapeHtml(link)}" style="background:none;border:none;padding:0;margin:0;font:inherit;text-align:left;color:black;cursor:pointer;">${escapeHtml(name)}</button></p>
        <p class="qc-subtitle qc-selectable">${subtitle}</p>
        ${badgeRowHtml}
        ${chipRowHtml}
        ${descHtml}

      </div>
    </div>
    ${ratingsLineHtml}
    ${ratingsStatusHtml}
    ${watchSectionHtml}
    ${seriesRowHtml}
    ${row1Html}
    ${row2Html}
    ${bookBoxHtml}
    ${prevEpisodeBoxHtml}
    ${nextEpisodeBoxHtml}
    ${countryBoxHtml}
    ${awardsBoxHtml}
    ${castHtml}
    ${boxOfficeHtml}
    ${seasonTableHtml}
    ${footerSectionHtml}
  `;
}

const MOVIES_SEASON_CACHE = new Map();

const MOVIES_SEASON_CACHE_MAX_SHOWS = 20;
function moviesGetSeasonCacheEntry(id) {
  if (!MOVIES_SEASON_CACHE.has(id)) {
    if (MOVIES_SEASON_CACHE.size >= MOVIES_SEASON_CACHE_MAX_SHOWS) {
      const oldestKey = MOVIES_SEASON_CACHE.keys().next().value;
      MOVIES_SEASON_CACHE.delete(oldestKey);
    }
    MOVIES_SEASON_CACHE.set(id, {
      seriesPromise: null,
      activeSeasonNumber: null
    });
  }
  return MOVIES_SEASON_CACHE.get(id);
}

function buildSeasonTablePlaceholderHtml(id, showName) {
  return `<div class="qc-section qc-season-table" id="qc-movies-season-table" data-movies-show-id="${escapeHtml(String(id))}" data-movies-show-name="${escapeHtml(showName || '')}"><p class="qc-section-label">Episode Ratings</p><div class="loading">Loading seasons...</div></div>`;
}

function moviesRaceWithTimeout(promise, timeoutMs, timeoutResult) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(timeoutResult), timeoutMs))
  ]);
}

function fetchMoviesSeriesEpisodes(id) {
  return moviesRaceWithTimeout(
    api.runtime.sendMessage({ type: 'MOVIES_GET_SERIES_EPISODES', id }),
    15000,
    { ok: false, timedOut: true, error: 'Timed out loading seasons' }
  ).catch((e) => ({ ok: false, error: String(e && e.message ? e.message : e) }));
}

function moviesEpisodeRatingTierClass(rating) {
  if (rating == null) return '';
  if (rating >= 9) return '';
  if (rating >= 8) return ' qc-ep-rating-high';
  if (rating >= 6) return ' qc-ep-rating-mid';
  return ' qc-ep-rating-low';
}

function moviesBuildEpisodeRowHtml(showName, seasonNumber, ep) {
  const num = ep.number != null ? String(ep.number) : '–';

  const safeRating = (typeof ep.rating === 'number' && Number.isFinite(ep.rating)) ? ep.rating : (typeof ep.rating === 'string' && !isNaN(parseFloat(ep.rating)) ? parseFloat(ep.rating) : null);

  const ratingHtml = safeRating != null
    ? (safeRating >= 9 ? `★ ${escapeHtml(safeRating.toFixed(1))}` : escapeHtml(safeRating.toFixed(1)))
    : '<span style="color:#c7c7cc;">–</span>';

  const safeVotes = (typeof ep.votes === 'number' && Number.isFinite(ep.votes)) ? ep.votes : (typeof ep.votes === 'string' && !isNaN(parseInt(ep.votes,10)) ? parseInt(ep.votes,10) : null);
  const votesHtml = safeVotes != null ? ` <span class="qc-badge-rating-votes">(${escapeHtml(safeVotes.toLocaleString('en-US'))})</span>` : '';
  const metaHtml = `${ratingHtml}${votesHtml}`;
  const ratingTierClass = moviesEpisodeRatingTierClass(safeRating);

  const nameHtml = escapeHtml(ep.name || `Episode ${num}`);
  const rowInner = `<span class="qc-season-episode-num">${escapeHtml(num)}</span><span class="qc-season-episode-name">${nameHtml}</span><span class="qc-season-episode-rating${ratingTierClass}">${metaHtml}</span>`;
  if (ep.imdbId) {
    return `<div class="qc-season-episode-row qc-nav-link" data-nav-pack="movies" data-nav-kind="title" data-nav-id="${escapeHtml(ep.imdbId)}">${rowInner}</div>`;
  }
  const searchText = `${showName} S${seasonNumber}E${num}${ep.name ? ` ${ep.name}` : ''}`;
  return `<div class="qc-season-episode-row qc-searchable" data-search-text="${escapeHtml(searchText)}">${rowInner}</div>`;
}

const MOVIES_MAX_RENDERED_EPISODES = 100;
function moviesBuildSeasonTableInnerHtml(showName, seriesRes, activeSeasonNumber, id) {

  if (!seriesRes || !Array.isArray(seriesRes.seasons)) return '<div class="qc-book-empty">No season data</div>';
  if (seriesRes.seasons.length > 200) return '<div class="qc-book-empty">Too many seasons</div>';
  const seasons = seriesRes.seasons;
  const tabsHtml = `<div class="qc-season-tabs">${seasons.map((s) => `<button type="button" class="qc-season-tab${s.number === activeSeasonNumber ? ' active' : ''}" data-season-number="${escapeHtml(String(s.number))}">S${escapeHtml(String(s.number))}</button>`).join('')}</div>`;

  const moreSeasonsHtml = seriesRes.extraSeasonsCount > 0
    ? buildTextLinkHtml(`+${seriesRes.extraSeasonsCount} more seasons on IMDb`, `https://www.imdb.com/title/${id}/episodes`)
    : '';

  const rawEpisodes = seriesRes.episodesBySeasonNumber && typeof seriesRes.episodesBySeasonNumber === 'object' ? seriesRes.episodesBySeasonNumber[activeSeasonNumber] : null;
  const episodes = Array.isArray(rawEpisodes) ? rawEpisodes : [];
  let bodyHtml;
  if (!episodes.length) {
    bodyHtml = '<div class="qc-book-empty">No episodes listed for this season</div>';
  } else {
    const visibleEpisodes = episodes.slice(0, MOVIES_MAX_RENDERED_EPISODES);
    const remaining = episodes.length - visibleEpisodes.length;
    const rowsHtml = visibleEpisodes.map((ep) => moviesBuildEpisodeRowHtml(showName, activeSeasonNumber, ep)).join('');
    const moreEpisodesHtml = (id && remaining > 0)
      ? buildTextLinkHtml(`+${remaining} more episodes on IMDb`, `https://www.imdb.com/title/${id}/episodes/?season=${activeSeasonNumber}`)
      : '';
    bodyHtml = `<div class="qc-season-episode-table">${rowsHtml}</div>${moreEpisodesHtml}`;
  }
  return `${tabsHtml}${bodyHtml}${moreSeasonsHtml}`;
}

function moviesLoadSeasonInto(container, id, showName, seriesRes, seasonNumber) {
  const cache = moviesGetSeasonCacheEntry(id);
  cache.activeSeasonNumber = seasonNumber;
  container.innerHTML = moviesBuildSeasonTableInnerHtml(showName, seriesRes, seasonNumber, id);
  moviesWireSeasonTableInteractions(container, id, showName, seriesRes);
}

function moviesWireSeasonTableInteractions(container, id, showName, seriesRes) {
  container.querySelectorAll('.qc-season-tab').forEach((btn) => {
    if (btn.dataset.qcWired === '1') return;
    btn.dataset.qcWired = '1';
    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      const seasonNumber = parseInt(btn.getAttribute('data-season-number'), 10);
      if (Number.isNaN(seasonNumber)) return;
      moviesLoadSeasonInto(container, id, showName, seriesRes, seasonNumber);
    });
  });

  bindPopupButtons(container);
  reStampSelectableClasses(container);
}

function moviesPaintSeasonTable(target, id, showName, res) {
  if (!target || target.getAttribute('data-movies-show-id') !== id) return;

  if (target.getAttribute('data-movies-season-ready') === '1') return;

  const cache = moviesGetSeasonCacheEntry(id);
  if (!res || !res.ok || !Array.isArray(res.seasons) || !res.seasons.length) {
    const msg = (res && res.timedOut)
      ? 'Timed out loading seasons'
      : (res && res.error ? String(res.error) : 'No season data found');
    target.innerHTML = `<p class="qc-section-label">Episode Ratings</p><div class="loading">${escapeHtml(msg)}</div>`;
    target.setAttribute('data-movies-season-ready', '1');

    return;
  }
  const seasons = res.seasons;
  const defaultSeasonNumber = seasons.some((s) => s.number === 1) ? 1 : seasons[0].number;
  const startSeasonNumber = cache.activeSeasonNumber && seasons.some((s) => s.number === cache.activeSeasonNumber)
    ? cache.activeSeasonNumber
    : defaultSeasonNumber;
  target.innerHTML = `<p class="qc-section-label">Episode Ratings</p><div class="qc-season-table-body"></div>`;
  target.setAttribute('data-movies-season-ready', '1');
  const body = target.querySelector('.qc-season-table-body');
  if (body) moviesLoadSeasonInto(body, id, showName, res, startSeasonNumber);
}

function moviesWireSeasonTable(root) {
  const container = (root && root.id === 'qc-movies-season-table')
    ? root
    : (root && root.querySelector ? root.querySelector('#qc-movies-season-table') : null);
  if (!container) return;
  const id = container.getAttribute('data-movies-show-id');
  const showName = container.getAttribute('data-movies-show-name') || '';
  if (!id) return;
  const cache = moviesGetSeasonCacheEntry(id);

  if (cache.seriesRes !== undefined && cache.seriesRes !== null) {
    moviesPaintSeasonTable(container, id, showName, cache.seriesRes);
    return;
  }

  if (!cache.seriesPromise) {
    cache.seriesPromise = fetchMoviesSeriesEpisodes(id).then((res) => {
      cache.seriesRes = res || { ok: false, error: 'No season data found' };
      return cache.seriesRes;
    }).catch((e) => {
      cache.seriesRes = { ok: false, error: String(e && e.message ? e.message : e) };
      return cache.seriesRes;
    });
  }

  if (cache.paintAttached) return;
  cache.paintAttached = true;
  cache.seriesPromise.then((res) => {
    cache.paintAttached = false;
    const popupContainer = selectionPopupEl && selectionPopupEl.isConnected
      ? selectionPopupEl.querySelector('#qc-movies-season-table')
      : null;
    const target = (container.isConnected && container.getAttribute('data-movies-show-id') === id)
      ? container
      : popupContainer;
    if (target) moviesPaintSeasonTable(target, id, showName, res);
  });
}
registerPopupContentBoundHandler(moviesWireSeasonTable);

function fetchImdbInfo(id, type, callback) {
  const cacheEntry = getCacheEntry(id);

  const currentStyle = getPopupStyleClass();

  if (cacheEntry.finalHtml && cacheEntry.finalHtmlStyle === currentStyle) {
    callback(cacheEntry.finalHtml, cacheEntry.isPersonType);
    return;
  }

  if (cacheEntry.baseHtml && cacheEntry.baseHtmlStyle === currentStyle) {
    callback(cacheEntry.baseHtml, cacheEntry.isPersonType);
    if (cacheEntry.extraLoaded) return;
  }

  fetchSuggestionById(id, (entry) => {
    if (!entry) {
      callback('<div class="loading">No info found</div>', false);
      return;
    }

    buildAndLoadInfo(id, type, entry, callback);
  });
}

function buildAndLoadInfo(id, type, entry, callback) {
const cacheEntry = getCacheEntry(id);

const name = entry.l || 'Unknown';

const image = toSmallImdbPickerImage((entry.i && entry.i.imageUrl) || null, 500);
const isPersonType = type === 'name';
if (isPersonType) {
const link = `https://www.imdb.com/name/${id}/`;
const baseHtml = (cacheEntry.baseHtml && cacheEntry.baseHtmlStyle === getPopupStyleClass())
  ? cacheEntry.baseHtml
  : buildPersonHtml(name, image ? MOVIES_IMAGE_PLACEHOLDER : null, null, link, {});
cacheEntry.baseHtml = baseHtml;
cacheEntry.baseHtmlStyle = getPopupStyleClass();
cacheEntry.isPersonType = true;
callback(baseHtml, true);
let extraRes = null;
let siteLinksRes = null;

let bioRes = null;
let resolvedImage = image ? MOVIES_IMAGE_PLACEHOLDER : null;
let pending = 3;
let lastHtml = null;

const renderNow = () => {
  const extra = extraRes && extraRes.ok && extraRes.data ? extraRes.data : null;
  const statusMessage = extraRes ? formatExtraInfoStatus('Wikidata', extraRes) : null;
  const siteLinks = siteLinksRes && siteLinksRes.ok && siteLinksRes.data ? { ...siteLinksRes.data } : null;

  if (siteLinks && bioRes && bioRes.ok) siteLinks.biography = bioRes.data;
  const siteLinksStatus = siteLinksRes ? formatExtraInfoStatus('Wikidata links', siteLinksRes) : null;
  lastHtml = buildPersonHtml(name, resolvedImage, extra, link, {
    statusMessage,
    siteLinks,
    siteLinksStatus
  });
  callback(lastHtml, true);
};
const finish = () => {
  pending -= 1;
  renderNow();
  if (pending > 0) return;

  cacheEntry.finalHtml = lastHtml;
  cacheEntry.finalHtmlStyle = getPopupStyleClass();
  cacheEntry.extraLoaded = true;
};

const isFullPersonStyle = getPopupStyleClass() === 'qc-style-full';

let bioFetchStarted = false;
const maybeStartBiography = (wikipediaUrl) => {
  if (bioFetchStarted || !wikipediaUrl || !moviesSettings.personFieldBiography) return;
  bioFetchStarted = true;
  pending += 1;
  fetchMoviesBiography(wikipediaUrl, (bres) => { bioRes = bres; finish(); });
};
fetchExtraInfo(id, 'name', (res) => {
  extraRes = res;
  const wikiUrl = res && res.ok && res.data && res.data.wikipediaUrl;
  if (wikiUrl) maybeStartBiography(wikiUrl);
  finish();
});
fetchSiteLinks(id, 'name', false, name, false, (res) => {
  siteLinksRes = res;
  const d = res && res.ok && res.data;

  if (d && d.wikipediaUrlForBio) maybeStartBiography(d.wikipediaUrlForBio);

  if (d && d.filmography && d.filmography.length && isFullPersonStyle) {
    const state = moviesGetCreditsState(id);
    state.groups = moviesGroupFilmographyByCategory(d.filmography);
    const defaultCat = moviesDefaultCreditCategory(state.groups);
    if (defaultCat) {
      const firstPage = state.groups[defaultCat].slice(0, MOVIES_CREDITS_FIRST_PAGE_SIZE);
      const idsNeeded = firstPage.filter((item) => item.id).map((item) => item.id);
      if (idsNeeded.length) {
        pending += 1;

        api.runtime.sendMessage({ type: 'MOVIES_GET_FILMOGRAPHY_BATCH', imdbIds: idsNeeded, wantImages: !!moviesSettings.personFieldKnownForImages }).then((bres) => {
          const bd = bres && bres.ok && bres.data;
          if (bd) {
            firstPage.forEach((item) => {
              if (!item.id) return;
              state.resolved[item.id] = { rating: bd.ratings[item.id] || null, image: bd.images[item.id] || null };
            });
          }
          finish();
        }).catch((e) => {
          logError('Credits initial batch fetch failed for', id, '->', e && e.message ? e.message : e);
          finish();
        });
      }
    }
  }
  finish();
}, isFullPersonStyle);
resolveImageUrl(image, (resolved) => { resolvedImage = resolved; finish(); });
return;
}
const link = `https://www.imdb.com/title/${id}/`;

const isSeries = /series/i.test(entry.q || '');
const quickTypeLabel = moviesQuickTypeLabelFromQualifier(entry.q);

const isEpisodeQuick = quickTypeLabel === 'Episode';
const baseHtml = (cacheEntry.baseHtml && cacheEntry.baseHtmlStyle === getPopupStyleClass())
  ? cacheEntry.baseHtml
  : buildTitleHtml(name, image ? MOVIES_IMAGE_PLACEHOLDER : null, entry.y || '', null, link, null, null, null, null, isSeries, entry.id, null, null, null, quickTypeLabel);
cacheEntry.baseHtml = baseHtml;
cacheEntry.baseHtmlStyle = getPopupStyleClass();
cacheEntry.isPersonType = false;
callback(baseHtml, false);
let extraRes = null;
let siteLinksRes = null;
let resolvedImage = image ? MOVIES_IMAGE_PLACEHOLDER : null;
let tvmazeRes = isSeries ? null : { ok: true, disabled: true, data: null };
let bookSourceRes = null;
let topListRes = null;
let boxOfficeRes = null;

let pending = (isSeries ? 4 : 3) + 1 + 1 + 1;
let lastHtml = null;

const renderNow = () => {
const extra = extraRes && extraRes.ok && extraRes.data ? extraRes.data : null;
const statusMessage = extraRes ? formatExtraInfoStatus('Title info', extraRes) : null;
const tvmazeExtra = tvmazeRes && tvmazeRes.ok && tvmazeRes.data ? tvmazeRes.data : null;
const tvmazeStatusMessage = (isSeries && tvmazeRes) ? formatExtraInfoStatus('TVmaze', tvmazeRes) : null;
const siteLinks = siteLinksRes && siteLinksRes.ok && siteLinksRes.data ? siteLinksRes.data : null;

const bookSource = bookSourceRes && bookSourceRes.ok && bookSourceRes.data ? bookSourceRes.data : null;

const topListInfo = topListRes && topListRes.ok ? topListRes : null;

const boxOffice = boxOfficeRes && boxOfficeRes.ok && boxOfficeRes.data ? boxOfficeRes.data : null;
lastHtml = buildTitleHtml(name, resolvedImage, entry.y || '', extra, link, statusMessage, tvmazeExtra, tvmazeStatusMessage, siteLinks, isSeries, entry.id, bookSource, topListInfo, boxOffice, quickTypeLabel, siteLinksRes != null);
callback(lastHtml, false);
};
const finish = () => {
pending -= 1;
renderNow();
if (pending > 0) return;

cacheEntry.finalHtml = lastHtml;
cacheEntry.finalHtmlStyle = getPopupStyleClass();
cacheEntry.extraLoaded = true;
};

let startedSiteLinks = false;
function maybeStartSiteLinks() {
if (startedSiteLinks) return;
if (!extraRes) return;
if (isSeries && tvmazeRes === null) return;
startedSiteLinks = true;
const extra = extraRes && extraRes.ok && extraRes.data ? extraRes.data : null;
const tvmazeExtra = isSeries && tvmazeRes && tvmazeRes.ok && tvmazeRes.data ? tvmazeRes.data : null;

const isAnime = detectMoviesIsAnime(extra, tvmazeExtra);

const isEpisodeResult = !!(extra && extra.titleType === 'tvEpisode');
const siteLinksId = (isEpisodeResult && extra.parentId) ? extra.parentId : id;
const siteLinksName = (isEpisodeResult && extra.seriesName) ? extra.seriesName : name;
const siteLinksIsSeries = isEpisodeResult ? true : isSeries;
fetchSiteLinks(siteLinksId, 'title', siteLinksIsSeries, siteLinksName, isAnime, (res) => { siteLinksRes = res; finish(); });
}
fetchExtraInfo(id, 'title', (res) => {
extraRes = res;
const extra = res && res.ok && res.data ? res.data : null;

if (extra && moviesSettings.showActorPhotos && getPopupStyleClass() === 'qc-style-full' && extra.cast && extra.cast.length) {
  const actorsForPhotos = extra.cast.map((c) => ({ id: c.id, name: c.name }));
  pending += 1;
  fetchActorImages(actorsForPhotos, (result) => {
    if (result && result.ok && result.images && extraRes && extraRes.ok && extraRes.data) {
      extraRes.data.actorImages = result.images;
    }
    finish();
  });
}

maybeStartSiteLinks();
finish();
});
resolveImageUrl(image, (resolved) => { resolvedImage = resolved; finish(); });
if (isSeries) {
fetchTvmazeInfo(id, (res) => { tvmazeRes = res; finish(); maybeStartSiteLinks(); });
}

if (!isEpisodeQuick) {
  fetchMovieBookSource(id, (res) => { bookSourceRes = res; finish(); });
} else {
  bookSourceRes = { ok: true, disabled: true, data: null };
  finish();
}

fetchBoxOfficeInfo(id, !isSeries && !isEpisodeQuick, (res) => { boxOfficeRes = res; finish(); });

fetchMoviesTopListMembership(entry.id, isSeries, (res) => { topListRes = res; finish(); });
}

function parseImdbUrl(href) {
  try {
    const u = new URL(href, location.href);
    if (!u.hostname.includes('imdb.com')) return null;

    const titleMatch = u.pathname.match(/\/title\/(tt\d+)/);
    const nameMatch = u.pathname.match(/\/name\/(nm\d+)/);

    if (titleMatch) return { type: 'title', id: titleMatch[1] };
    if (nameMatch) return { type: 'name', id: nameMatch[1] };

    return null;
  } catch (e) {
    return null;
  }
}

function attach(anchor) {

  const bindKey = '__quickcardBound_' + QUICKCARD_BOOT_ID;
  if (anchor[bindKey]) return;

  const info = parseImdbUrl(anchor.href);
  if (!info) return;

  anchor[bindKey] = true;

  anchor.addEventListener('mouseenter', () => {
    if (!coreSettings.featureLinkHover) return;

    clearTimeout(hoverHideTimer);
    clearTimeout(hoverRemoveTimer);
    clearTimeout(hoverTimer);

    currentAnchor = anchor;

    hoverTimer = setTimeout(() => {
      if (currentAnchor !== anchor) return;

      const myHoverToken = ++hoverRequestToken;
      const paintHover = (loadingOnly) => {
        if (loadingOnly) {
          showPopup(MOVIES_THEME_CLASS, anchor, '<div class="loading">Loading...</div>', info.type === 'name');
          return;
        }
        fetchImdbInfo(info.id, info.type, (html, isPersonType) => {
          if (myHoverToken !== hoverRequestToken || !hoverPopupEl) return;
          showPopup(MOVIES_THEME_CLASS, anchor, html, isPersonType);
        });
      };

      navSetRerenderFn(() => paintHover(false));
      paintHover(true);
      paintHover(false);
    }, 350);
  });

  anchor.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    if (currentAnchor === anchor) currentAnchor = null;
    scheduleHoverHide();
  });
}

function scanLinks(root) {
  root.querySelectorAll('a[href*="imdb.com"]').forEach(attach);
}

function initLinkObserver() {
  scanLinks(document);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;

        if (node.tagName === 'A') {
          attach(node);
        } else if (node.querySelectorAll) {
          scanLinks(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

let selectionActivePreviewId = 'movies';

function getPopupAllowedPacks() {
  return getEnabledTopicPacks().filter((pack) => isAllowedByGlobalSiteRules(pack.id, 'popup'));
}

function ensureSelectionButton() {
  if (selectionButton) return selectionButton;

  selectionButton = document.createElement('div');
  selectionButton.className = 'qc-selectbtn';

  renderSelectionButtonIcons();
  ensureUiRoot().host.appendChild(selectionButton);

  return selectionButton;
}

function renderSelectionButtonIcons() {
  selectionButton.innerHTML = '';

  const enabledPacks = getPopupAllowedPacks();
  if (!enabledPacks.some((p) => p.id === selectionActivePreviewId)) {
    selectionActivePreviewId = (enabledPacks[0] && enabledPacks[0].id) || 'movies';
  }

  if (enabledPacks.length <= 1) {
    const pack = enabledPacks[0] || ALL_TOPIC_PACKS[0];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'qc-selectbtn-icon';

    const img = document.createElement('img');
    img.src = api.runtime.getURL(pack.icon);
    img.alt = pack.label;
    img.width = 25;
    img.height = 25;
    btn.appendChild(img);

    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      onSelectionButtonClick(pack.id);
    });

    selectionButton.appendChild(btn);
    return;
  }

  enabledPacks.forEach((pack) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = pack.label;
    btn.className = pack.id === selectionActivePreviewId
      ? 'qc-selectbtn-icon active'
      : 'qc-selectbtn-icon';

    const img = document.createElement('img');
    img.src = api.runtime.getURL(pack.icon);
    img.alt = pack.label;
    img.width = 20;
    img.height = 20;
    btn.appendChild(img);

    btn.addEventListener('mousedown', stopEvent);
    btn.addEventListener('click', (e) => {
      stopEvent(e);
      selectionActivePreviewId = pack.id;
      renderSelectionButtonIcons();
      onSelectionButtonClick(pack.id);
    });

    selectionButton.appendChild(btn);
  });
}

function hideSelectionButton() {
  if (selectionButton) selectionButton.style.display = 'none';
}

function onSelectionButtonClick(packId) {
  const query = selectionButton && selectionButton.dataset.query;
  if (!query) return;
  const pack = QuickCardPacks[packId];
  if (!pack || typeof pack.launchSearch !== 'function') return;

  if (!isAllowedByGlobalSiteRules(packId, 'popup')) {
    hideSelectionButton();
    return;
  }

  navClearHistory();
  const btnRect = selectionButton.getBoundingClientRect();
  pack.launchSearch(query, btnRect.left, btnRect.bottom + 6);
}

function moviesRenderFromSearchChoice(id, type, entry, banner, onPainted) {
  if (!selectionPopupEl || !selectionPopupEl.isConnected) return;
  const token = navGuardToken();
  const cacheEntry = getCacheEntry(id);
  const currentStyle = getPopupStyleClass();

  if (cacheEntry.finalHtml && cacheEntry.finalHtmlStyle === currentStyle) {
    updateSelectionPopup(`${banner}${cacheEntry.finalHtml}`, cacheEntry.isPersonType);
    if (onPainted) onPainted();
    return;
  }

  updateSelectionPopup(`${banner}<div class="loading">Searching...</div>`, false);

  buildAndLoadInfo(id, type, entry, (html, isPersonType) => {
    if (!selectionPopupEl || !selectionPopupEl.isConnected) return;
    if (!navIsTokenCurrent(token)) return;
    updateSelectionPopup(`${banner}${html}`, isPersonType);
    if (onPainted) onPainted();
  });
}

function launchSearch(query, left, top) {
  if (!query) return;

  hideSelectionButton();
  clearTimeout(selectionShowTimer);
  clearTimeout(searchDelayTimer);
  clearPendingDisambiguation();
  const preSel = window.getSelection();
  if (preSel) {
    try { preSel.removeAllRanges(); } catch (e) {}
  }

  if (QUICKCARD_ABBREVIATION_PATTERN.test(query)) {
    quickcardResolveAbbreviation(query).then((res) => {
      if (res.type === 'direct' && res.title) {
        runMoviesLaunchSearch(res.title, left, top);
      } else if (res.type === 'choices' && res.options && res.options.length) {
        setActivePack(MOVIES_PACK_ID);
        showSelectionPopupAt(MOVIES_THEME_CLASS, left, top, '<div class="loading">Searching...</div>', false);
        quickcardShowAbbreviationPicker(MOVIES_THEME_CLASS, res.options, (title) => {
          runMoviesLaunchSearch(title, left, top);
        }, query);
      } else {
        runMoviesLaunchSearch(query, left, top);
      }
    });
    return;
  }

  runMoviesLaunchSearch(query, left, top);
}

function runMoviesLaunchSearch(query, left, top) {
  if (!query) return;

  setActivePack(MOVIES_PACK_ID);

  hideSelectionButton();
  clearTimeout(selectionShowTimer);
  clearTimeout(searchDelayTimer);
  clearPendingDisambiguation();

  const sel = window.getSelection();
  if (sel) {
    try {
      sel.removeAllRanges();
    } catch (e) {}
  }

  const requestToken = `${Date.now()}${Math.random()}`;
  if (selectionButton) selectionButton.dataset.requestToken = requestToken;

  let sessionNavToken = null;
  const isSessionCurrent = () => {
    if (selectionButton && selectionButton.dataset.requestToken !== requestToken) return false;
    if (sessionNavToken !== null && !navIsTokenCurrent(sessionNavToken)) return false;
    return true;
  };

  (() => {
    if (!isSessionCurrent()) return;

    showSelectionPopupAt(MOVIES_THEME_CLASS, left, top, '<div class="loading">Searching...</div>', false);

    sessionNavToken = navGuardToken();

    const watchdogTimer = setTimeout(() => {
      if (!isSessionCurrent()) return;
      if (!selectionPopupEl) return;
      logError('launchSearch: watchdog fired - no result after 22s for', query);
      lastRetryFn = () => runMoviesLaunchSearch(query, left, top);
      updateSelectionPopup(
        '<div class="loading">No response (took too long)</div><div><button class="qc-retry-btn">Retry</button></div>',
        false
      );
    }, 22000);

    const langCode = detectNonLatinLangCode(query);

    const NETWORK_RETRY_DELAYS_MS = [700, 1400];

    const runImdbSearch = (searchQuery, translationInfo, attempt = 0) => {
      searchImdb(searchQuery, (result, status) => {
        if (!isSessionCurrent()) return;
        if (!selectionPopupEl) return;

        const banner = buildTranslationBanner(translationInfo);
        const isNetworkFailure = !result && status && status.reason === 'network';

        if (isNetworkFailure && attempt < NETWORK_RETRY_DELAYS_MS.length) {
          const nextAttempt = attempt + 1;
          updateSelectionPopup(
            `${banner}<div class="loading">Network error — retrying... (${nextAttempt}/${NETWORK_RETRY_DELAYS_MS.length + 1})</div>`,
            false
          );
          setTimeout(() => {
            runImdbSearch(searchQuery, translationInfo, nextAttempt);
          }, NETWORK_RETRY_DELAYS_MS[attempt]);
          return;
        }

        if (!result && status && status.reason === 'ambiguous') {
          clearTimeout(watchdogTimer);

          showDisambiguationPicker(status.candidates, describeCandidateForPicker, (chosen) => {
            if (!isSessionCurrent()) return;
            if (!selectionPopupEl) return;

            const { id, type, entry } = chosen;
            const cacheEntry = getCacheEntry(id);

            const currentStyle = getPopupStyleClass();

            navSetRerenderFn(() => moviesRenderFromSearchChoice(id, type, entry, banner));

            if (cacheEntry.finalHtml && cacheEntry.finalHtmlStyle === currentStyle) {
              updateSelectionPopup(`${banner}${cacheEntry.finalHtml}`, cacheEntry.isPersonType);
              return;
            }

            updateSelectionPopup(`${banner}<div class="loading">Searching...</div>`, false);

            buildAndLoadInfo(id, type, entry, (html, isPersonType) => {
              if (!isSessionCurrent()) return;
              if (!selectionPopupEl) return;
              updateSelectionPopup(`${banner}${html}`, isPersonType);
            });
          }, banner);
          return;
        }

        if (!result) {
          clearTimeout(watchdogTimer);

          const message = isNetworkFailure
            ? 'No response from IMDb (network error)'
            : 'No results found';

          const retryButtonHtml = isNetworkFailure
            ? '<div><button class="qc-retry-btn">Retry</button></div>'
            : '';

          if (isNetworkFailure) {
            lastRetryFn = () => runImdbSearch(searchQuery, translationInfo, 0);
          }

          updateSelectionPopup(`${banner}<div class="loading">${escapeHtml(message)}</div>${retryButtonHtml}`, false);
          return;
        }

        const { id, type, entry } = result;
        const cacheEntry = getCacheEntry(id);

        const currentStyle = getPopupStyleClass();

        navSetRerenderFn(() => moviesRenderFromSearchChoice(id, type, entry, banner));

        if (cacheEntry.finalHtml && cacheEntry.finalHtmlStyle === currentStyle) {
          clearTimeout(watchdogTimer);
          updateSelectionPopup(`${banner}${cacheEntry.finalHtml}`, cacheEntry.isPersonType);
          return;
        }

        updateSelectionPopup(`${banner}<div class="loading">Searching...</div>`, false);

        buildAndLoadInfo(id, type, entry, (html, isPersonType) => {
          if (!isSessionCurrent()) return;
          if (!selectionPopupEl) return;
          clearTimeout(watchdogTimer);
          updateSelectionPopup(`${banner}${html}`, isPersonType);
        });
      });
    };

    if (!langCode) {
      runImdbSearch(query, null);
      return;
    }

    log('launchSearch: non-Latin text detected, langCode=', langCode, 'query=', query);
    updateSelectionPopup('<div class="loading">Translating...</div>', false);

    translateSelectionText(query, langCode, (res) => {
      if (!isSessionCurrent()) return;
      if (!selectionPopupEl) return;

      if (!res || !res.ok || !res.translatedText) {

        clearTimeout(watchdogTimer);
        if (res && res.networkError) {
          lastRetryFn = () => runMoviesLaunchSearch(query, left, top);
          updateSelectionPopup('<div class="loading">Network error while translating</div><div><button class="qc-retry-btn">Retry</button></div>', false);
        } else {
          updateSelectionPopup(buildTranslationFailureHtml(query), false);
        }
        return;
      }

      const { text: cleanedTranslation, stillHasNonLatin } = cleanTranslatedText(res.translatedText);

      if (!cleanedTranslation) {
        logError('launchSearch: translation became empty after cleanup for', query, '- showing manual entry');
        clearTimeout(watchdogTimer);
        updateSelectionPopup(buildTranslationFailureHtml(query), false);
        return;
      }

      const isLowConfidence =
        (typeof res.match === 'number' && res.match < TRANSLATION_CONFIDENCE_THRESHOLD) ||
        stillHasNonLatin;

      if (isLowConfidence) {
        log('launchSearch: low-confidence translation (match=', res.match, 'stillHasNonLatin=', stillHasNonLatin, ') for', query, '->', cleanedTranslation);
      }

      runImdbSearch(cleanedTranslation, {
        original: query,
        translated: cleanedTranslation,
        lowConfidence: isLowConfidence
      });
    });
  })();
}

function initSelectionHandling() {
  document.addEventListener('mouseup', (e) => {
    if (!coreSettings.featureTextSearch) return;

    if (composedClosest(e, '.qc-popup') || composedClosest(e, '.qc-selectbtn')) {
      return;
    }

    if (selectionButton) selectionButton.dataset.requestToken = '';
    navBeginRender();
    hideSelectionButton();

    clearTimeout(selectionShowTimer);
    selectionShowTimer = setTimeout(() => {
      const sel = window.getSelection();
      const text = sanitizeSelectionText(sel && sel.toString());

      if (!text || text.length < 2 || text.length > 60 || !sel.rangeCount) {
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (!rect || (!rect.width && !rect.height)) {
        return;
      }

      if (getPopupAllowedPacks().length === 0) {
        return;
      }

      const btn = ensureSelectionButton();
      btn.dataset.query = text;

      btn.style.left = '-9999px';
      btn.style.top = '-9999px';
      btn.style.display = 'flex';
      const btnWidth = btn.offsetWidth || 40;
      const margin = 6;
      let left = rect.left;
      if (left + btnWidth > window.innerWidth - margin) left = window.innerWidth - btnWidth - margin;
      if (left < margin) left = margin;
      const top = rect.bottom + 6;

      btn.style.left = `${Math.round(left)}px`;
      btn.style.top = `${Math.round(top)}px`;
      btn.style.display = 'flex';
    }, coreSettings.selectionSearchDelayMs);
  });
}

function handleExternalSearch(rawQuery, left, top) {
  const query = sanitizeSelectionText(rawQuery);
  if (!query) return;

  navClearHistory();
  launchSearch(query, left, top);
}

function moviesNavigateById(kind, id) {
  if (!id) return;
  setActivePack(MOVIES_PACK_ID);

  const navToken = navBeginRender();
  const type = kind === 'person' ? 'name' : 'title';
  updateSelectionPopup('<div class="loading">Loading...</div>', type === 'name', MOVIES_THEME_CLASS);

  navSetRerenderFn(() => moviesNavigateById(kind, id));
  fetchImdbInfo(id, type, (html, isPersonType) => {
    if (!navIsTokenCurrent(navToken)) return;
    updateSelectionPopup(html, isPersonType, MOVIES_THEME_CLASS);
  });
}

async function initMoviesPackCore() {
  await loadMoviesSettings();

  if (!moviesSettings.moviesPackEnabled) return;

  injectMoviesTheme();

  registerPack({
    id: MOVIES_PACK_ID,

    fullWidth: 528,
    launchSearch,
    handleExternalSearch,
    navigateById: moviesNavigateById,
    isAllowedOnThisSite: isMoviesAllowedOnThisSite
  });
  setActivePack(MOVIES_PACK_ID);
}

async function initMoviesPack() {
  await initMoviesPackCore();
  if (!moviesSettings.moviesPackEnabled) return;

  initSelectionHandling();
  if (!isMoviesAllowedForHoverOnThisSite()) return;
  initLinkObserver();
}

