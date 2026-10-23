
const BOOKS_PACK_ID='books';
const BOOKS_THEME_CLASS='qc-theme-books';
const BOOKS_DEFAULT_SETTINGS={
  booksFieldDescription:true, booksFieldFirstSentence:true, booksFieldSubjects:true,
  booksFieldFirstEdition:true, booksFieldRatings:true, booksFieldCommunity:true, booksFieldSeries:true, booksFieldAdaptations:true,
  booksFieldAuthorBorn:true, booksFieldAuthorBirthplace:true, booksFieldAuthorOccupation:true, booksFieldAuthorBio:true, booksFieldAuthorWorks:true,
  booksFieldAuthorAdaptations:true, booksFieldAuthorAwards:true,
  booksShowOpenLibraryLink:true, booksShowWikipediaLink:true, booksShowGoodreadsLink:true, booksShowGoogleBooksLink:true,
  booksShowAmazonLink:true, booksShowBarnesNobleLink:true, booksShowKoboLink:true, booksShowAudibleLink:true,
  booksShowYoutubeLink:true,

  booksCustomLinks: [],

  booksSiteFilterMode: 'blacklist',
  booksWhitelistSites: [],
  booksBlacklistSites: ['openlibrary.org']
};
let booksSettings={...BOOKS_DEFAULT_SETTINGS};
async function loadBooksSettings(){
  const stored=await api.storage.local.get(BOOKS_DEFAULT_SETTINGS);
  booksSettings={

    booksFieldAuthor:true,
    booksFieldFirstPublishYear:true,
    booksFieldPages:true,
    booksFieldDescription:stored.booksFieldDescription!==false,
    booksFieldFirstSentence:stored.booksFieldFirstSentence!==false,
    booksFieldSubjects:stored.booksFieldSubjects!==false,
    booksFieldFirstEdition:stored.booksFieldFirstEdition!==false,
    booksFieldRatings:stored.booksFieldRatings!==false,
    booksFieldCommunity:stored.booksFieldCommunity!==false,
    booksFieldSeries:stored.booksFieldSeries!==false,
    booksFieldAdaptations:stored.booksFieldAdaptations!==false,
    booksFieldAuthorBorn:stored.booksFieldAuthorBorn!==false,
    booksFieldAuthorBirthplace:stored.booksFieldAuthorBirthplace!==false,
    booksFieldAuthorOccupation:stored.booksFieldAuthorOccupation!==false,
    booksFieldAuthorBio:stored.booksFieldAuthorBio!==false,
    booksFieldAuthorWorks:stored.booksFieldAuthorWorks!==false,

    booksFieldAuthorAdaptations:stored.booksFieldAuthorAdaptations!==false,
    booksFieldAuthorAwards:stored.booksFieldAuthorAwards!==false,
    booksShowOpenLibraryLink:stored.booksShowOpenLibraryLink!==false,
    booksShowWikipediaLink:stored.booksShowWikipediaLink!==false,
    booksShowGoodreadsLink:stored.booksShowGoodreadsLink!==false,
    booksShowGoogleBooksLink:stored.booksShowGoogleBooksLink!==false,
    booksShowAmazonLink:stored.booksShowAmazonLink!==false,
    booksShowBarnesNobleLink:stored.booksShowBarnesNobleLink!==false,
    booksShowKoboLink:stored.booksShowKoboLink!==false,
    booksShowAudibleLink:stored.booksShowAudibleLink!==false,
    booksShowYoutubeLink:stored.booksShowYoutubeLink!==false,
    booksCustomLinks: Array.isArray(stored.booksCustomLinks)
      ? stored.booksCustomLinks.filter(l=>l&&typeof l.urlTemplate==='string'&&l.urlTemplate.trim())
      : [],
    booksSiteFilterMode: stored.booksSiteFilterMode || 'blacklist',
    booksWhitelistSites: Array.isArray(stored.booksWhitelistSites) ? stored.booksWhitelistSites : [],
    booksBlacklistSites: Array.isArray(stored.booksBlacklistSites) ? stored.booksBlacklistSites : ['openlibrary.org']
  }; preloadCustomLinkIcons(booksSettings.booksCustomLinks);
  return booksSettings;
}
const BOOKS_FULL_CARD_WIDTH=528;

function isBooksAllowedOnThisSite(){ return true; }

function isBooksAllowedForHoverOnThisSite() {
  const ownRulesAllow = siteAllowedByRules({
    siteFilterMode: booksSettings.booksSiteFilterMode,
    whitelistSites: booksSettings.booksWhitelistSites,
    blacklistSites: booksSettings.booksBlacklistSites
  });
  if (!ownRulesAllow) return false;
  return isAllowedByGlobalSiteRules(BOOKS_PACK_ID, 'hover');
}
function injectBooksTheme(){
  const root=ensureUiRoot(); if(root.getElementById('quickcard-books-theme'))return;
  const style=document.createElement('style'); style.id='quickcard-books-theme';
  style.textContent=`
    .${BOOKS_THEME_CLASS}{background-color:#fff!important;border:1px solid #ececf0!important;box-shadow:0 10px 30px rgba(20,20,30,0.14)!important;color:#17171a!important;overflow:hidden!important}
    .${BOOKS_THEME_CLASS}.qc-popup{cursor:default!important;user-select:text!important}
    .${BOOKS_THEME_CLASS} button,.${BOOKS_THEME_CLASS} a{cursor:pointer!important;user-select:none!important}
    .${BOOKS_THEME_CLASS} img{-webkit-user-drag:none!important;user-select:none!important}
    .${BOOKS_THEME_CLASS}.qc-style-full{width:${BOOKS_FULL_CARD_WIDTH}px!important;max-width:min(${BOOKS_FULL_CARD_WIDTH}px,calc(100vw - 24px))!important;box-sizing:border-box!important}

    .${BOOKS_THEME_CLASS}.qc-style-full.person-type{width:${BOOKS_FULL_CARD_WIDTH}px!important;max-width:min(${BOOKS_FULL_CARD_WIDTH}px,calc(100vw - 24px))!important}

    .${BOOKS_THEME_CLASS}.qc-style-mini.person-type{width:300px!important}
    .${BOOKS_THEME_CLASS} .qc-book-hero{position:relative!important;display:grid!important;grid-template-columns:112px minmax(0,1fr)!important;gap:15px!important;margin:0 -20px!important;padding:16px 20px 14px 20px!important;border-bottom:1px solid #ece5d8!important;background:linear-gradient(160deg, #ececec  0%, #f9edd6  55%, #b39d74  100%), repeating-linear-gradient(115deg, transparent, transparent 3px, rgba(120,100,60,0.025) 3px, rgba(120,100,60,0.025) 5px)!important}
    .${BOOKS_THEME_CLASS} .qc-book-cover{width:112px!important;height:158px!important;object-fit:cover!important;border-radius:8px!important;background:#f5f5f7!important}
    .${BOOKS_THEME_CLASS} .qc-book-title{font-size:18px!important;font-weight:700!important;line-height:1.2!important;margin:0 0 6px 0!important}
    .${BOOKS_THEME_CLASS} .qc-book-meta{font-size:13px!important;color:#5a5a62!important;line-height:1.4!important}
    .${BOOKS_THEME_CLASS} .qc-book-meta .qc-searchable{color:#2a5adf!important;cursor:pointer!important;user-select:none!important}
    .${BOOKS_THEME_CLASS} .qc-book-meta .qc-searchable:hover{text-decoration:underline!important}
    .${BOOKS_THEME_CLASS} .qc-book-section{margin-top:14px!important}
    .${BOOKS_THEME_CLASS} .qc-book-label{font-size:11px!important;font-weight:700!important;letter-spacing:0.06em!important;text-transform:uppercase!important;color:#8a7f68!important;margin-bottom:6px!important;display:block!important;padding:8px 12px!important;background:linear-gradient(135deg, #fbf8f2 0%, #ececec  100%), repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(120,100,60,.02) 2px, rgba(120,100,60,.02) 4px)!important;border-radius:4px!important;margin-left:-20px!important;margin-right:-20px!important;margin-top:12px!important;padding-left:20px!important;padding-right:20px!important}
    .${BOOKS_THEME_CLASS} .qc-book-chips{display:flex!important;flex-wrap:wrap!important;gap:6px!important}
    .${BOOKS_THEME_CLASS} .qc-book-chip{font-size:11px!important;padding:4px 8px!important;border-radius:999px!important;background:#f2f2f5!important;color:#3a3a43!important}
    .${BOOKS_THEME_CLASS} .qc-book-desc{font-size:13px!important;line-height:1.55!important;color:#2a2a32!important;white-space:pre-wrap!important}
    .${BOOKS_THEME_CLASS} .qc-book-desc-p{margin:0 0 8px 0!important}
    .${BOOKS_THEME_CLASS} .qc-book-desc-p:last-child{margin-bottom:0!important}
    .${BOOKS_THEME_CLASS} .qc-book-desc-link{display:inline!important;margin:0!important;padding:0!important;font-size:inherit!important;font-weight:700!important;text-decoration:underline!important;cursor:pointer!important;background:none!important;border:none!important;font-family:inherit!important;color:inherit!important}
    .${BOOKS_THEME_CLASS} .qc-book-first{font-size:12px!important;background:#fafafb!important;border:1px solid #f0f0f2!important;border-radius:8px!important;padding:8px 10px!important;color:#4a4a54!important}
    .${BOOKS_THEME_CLASS} .qc-book-empty{font-size:12px!important;color:#9a9aa3!important;font-style:italic!important}

    .${BOOKS_THEME_CLASS} .qc-book-list{display:flex!important;flex-direction:column!important;gap:8px!important}
    .${BOOKS_THEME_CLASS} .qc-book-list-item{display:flex!important;justify-content:space-between!important;align-items:center!important;padding:8px 10px!important;background:#f7f7f8!important;border:1px solid #ececf0!important;border-radius:10px!important;text-decoration:none!important;color:inherit!important;transition:background-color 0.15s ease!important}
    .${BOOKS_THEME_CLASS} .qc-book-list-item:hover{background:#ececf0!important}
    .${BOOKS_THEME_CLASS} .qc-book-badge{font-size:10px!important;font-weight:700!important;background:#17171a!important;color:#fff!important;border-radius:999px!important;padding:2px 6px!important}

    .${BOOKS_THEME_CLASS} .qc-book-badge-other{background:#e4e4e8!important;color:#6b6b73!important;text-transform:uppercase!important;letter-spacing:0.3px!important;font-size:9px!important}
    .${BOOKS_THEME_CLASS} .qc-book-series-header{font-size:13px!important;font-weight:600!important;margin-bottom:8px!important}
    .${BOOKS_THEME_CLASS} .qc-book-subjects-summary{font-size:11px!important;color:#2a5adf!important;cursor:pointer!important;user-select:none!important;list-style:none!important;display:inline-block!important;margin-top:6px!important}
    .${BOOKS_THEME_CLASS} .qc-book-subjects-summary::-webkit-details-marker{display:none!important}


    .${BOOKS_THEME_CLASS} .qc-book-text-teaser{cursor:pointer!important;list-style:none!important;display:block!important}
    .${BOOKS_THEME_CLASS} .qc-book-text-teaser::-webkit-details-marker{display:none!important}
    .${BOOKS_THEME_CLASS} .qc-book-text-teaser .qc-book-text{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:3!important;overflow:hidden!important}
    .${BOOKS_THEME_CLASS} details[open]>.qc-book-text-teaser .qc-book-text{display:block!important;-webkit-line-clamp:unset!important;overflow:visible!important}
    .${BOOKS_THEME_CLASS} .qc-book-toggle{display:inline-block!important;margin-top:4px!important;color:#2a5adf!important;font-size:11px!important;font-weight:600!important}
    .${BOOKS_THEME_CLASS} .qc-book-toggle-less{display:none!important}
    .${BOOKS_THEME_CLASS} details[open]>.qc-book-text-teaser .qc-book-toggle-more{display:none!important}
    .${BOOKS_THEME_CLASS} details[open]>.qc-book-text-teaser .qc-book-toggle-less{display:inline-block!important}
    .${BOOKS_THEME_CLASS} .qc-book-obs-group{margin-top:6px!important}
    .${BOOKS_THEME_CLASS} .qc-book-obs-group:first-child{margin-top:0!important}
    .${BOOKS_THEME_CLASS} .qc-book-obs-title{font-size:11px!important;font-weight:600!important;color:#6a6a73!important;margin-bottom:4px!important}
    .${BOOKS_THEME_CLASS} .qc-book-obs-row{display:grid!important;grid-template-columns:84px minmax(0,1fr) 34px!important;align-items:center!important;gap:8px!important;font-size:11px!important;margin-bottom:4px!important}
    .${BOOKS_THEME_CLASS} .qc-book-obs-name{color:#3a3a43!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .${BOOKS_THEME_CLASS} .qc-book-obs-bar{height:6px!important;border-radius:999px!important;background:#f0f0f3!important;overflow:hidden!important}
    .${BOOKS_THEME_CLASS} .qc-book-obs-fill{height:100%!important;border-radius:999px!important;background:linear-gradient(90deg,#6a8dff,#2a5adf)!important}
    .${BOOKS_THEME_CLASS} .qc-book-obs-pct{color:#8a8a93!important;text-align:right!important}
  `;
  root.styleHost.appendChild(style);
}
function booksEscape(s){ return escapeHtml(s||''); }

function booksLinkify(escapedLabel, rawUrl){
  if(!rawUrl) return escapedLabel;

  const workMatch = rawUrl.match(/openlibrary\.org\/works\/(OL[\w]+W)/i);
  if(workMatch) return `<span class="qc-nav-link" data-nav-kind="book" data-nav-id="${booksEscape(workMatch[1])}">${escapedLabel}</span>`;
  const authorMatch = rawUrl.match(/openlibrary\.org\/authors\/(OL[\w]+A)/i);
  if(authorMatch) return `<span class="qc-nav-link" data-nav-kind="author" data-nav-id="${booksEscape(authorMatch[1])}">${escapedLabel}</span>`;
  return `<button class="qc-link qc-book-desc-link" data-link="${booksEscape(rawUrl)}">${escapedLabel}</button>`;
}

function booksStripRefDefinitions(text){
  const lines = String(text).replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
  const refMap = {};
  const bodyLines = [];
  const refLineRe = /^\s*\[(\d+)\]/;
  const urlRe = /https?:\/\/[^\s)]+/g;
  for(const line of lines){
    const refMatch = line.match(refLineRe);
    if(refMatch){

      const urls = line.match(urlRe);
      if(urls&&urls.length) refMap[refMatch[1]]=urls[urls.length-1].replace(/[).,]+$/,'');
      continue;
    }
    bodyLines.push(line);
  }
  return {body: bodyLines.join('\n').trim(), refMap};
}

function booksConvertInlineMarkdown(escapedBody, refMap){
  let escaped = escapedBody;

  escaped = escaped.replace(/(\*{2,3})([^*\n]+?)\1\s*\[(\d+)\]:\s*(https?:\/\/\S+)/g, (m, stars, label, num, url) => {
    const cleanUrl = url.replace(/[).,]+$/,'');
    const boldLabel = stars.length===3 ? `<strong><em>${label}</em></strong>` : `<strong>${label}</strong>`;
    return booksLinkify(boldLabel, cleanUrl);
  });

  escaped = escaped.replace(/\[([^\[\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (m,label,url)=>booksLinkify(label,url));

  escaped = escaped.replace(/\[([^\[\]]+)\]\[(\d+)\]/g, (m,label,num)=>booksLinkify(label, refMap[num]));

  escaped = escaped.replace(/\[(\d+)\]:\s*(https?:\/\/\S+)/g, '');

  escaped = escaped.replace(/\*{3}([^*]+?)\*{3}/g, '<strong><em>$1</em></strong>');
  escaped = escaped.replace(/\*{2}([^*]+?)\*{2}/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

  escaped = escaped.replace(/#{2,6}\s*/g, '\n\n');

  escaped = escaped.replace(/\s-\s(?=<strong>)/g, '\n');
  return escaped;
}

function booksFormatRichText(text){
  if(!text) return '';
  const {body, refMap} = booksStripRefDefinitions(text);
  const escaped = booksConvertInlineMarkdown(booksEscape(body), refMap);
  const paragraphs = escaped.split(/\n\s*\n/).map(p=>p.split('\n').join('<br>')).filter(p=>p.trim().length);
  return paragraphs.map(p=>`<p class="qc-book-desc-p">${p}</p>`).join('');
}

function booksPlainPreviewLength(text){
  const {body} = booksStripRefDefinitions(text);
  return body
    .replace(/\[([^\[\]]+)\]\([^)]+\)/g,'$1')
    .replace(/\[([^\[\]]+)\]\[\d+\]/g,'$1')
    .replace(/\[(\d+)\]:\s*\S+/g,'')
    .replace(/#{2,6}\s*/g,'')
    .replace(/\*+/g,'')
    .length;
}

function booksFormatCount(n){
  if(typeof n!=='number'||Number.isNaN(n)) return '';
  if(n>=1000000) return (n/1000000).toFixed(n%1000000===0?0:1)+'m';
  if(n>=1000) return (n/1000).toFixed(n%1000===0?0:1)+'k';
  return String(n);
}

function booksBuildSubjectsHtml(subjects){
  if(!subjects||!subjects.length) return '';
  const chip=(sub)=>`<span class="qc-book-chip">${booksEscape(sub)}</span>`;
  const inner=booksBuildCollapsibleHtml(subjects, 8, chip, 'div', 'qc-book-chips');
  return `<div class="qc-book-section"><div class="qc-book-label">Subjects</div>${inner}</div>`;
}

function booksBuildRatingsHtml(ratings, bookshelves){
  if(!ratings&&!bookshelves) return '';
  const parts=[];
  if(ratings&&typeof ratings.average==='number'){
    const countStr=typeof ratings.count==='number'?` (${booksFormatCount(ratings.count)})`:'';
    parts.push(`★ ${ratings.average.toFixed(1)}${countStr}`);
  }
  if(bookshelves){
    const bits=[];
    if(typeof bookshelves.wantToRead==='number') bits.push(`${booksFormatCount(bookshelves.wantToRead)} Want`);
    if(typeof bookshelves.currentlyReading==='number') bits.push(`${booksFormatCount(bookshelves.currentlyReading)} Reading`);
    if(typeof bookshelves.alreadyRead==='number') bits.push(`${booksFormatCount(bookshelves.alreadyRead)} Have read`);
    if(bits.length) parts.push(`👁 ${bits.join(' • ')}`);
  }
  if(!parts.length) return '';
  return `<div class="qc-book-section"><div class="qc-book-meta" style="font-size:13px!important;">${parts.join('&nbsp;&nbsp;')}</div></div>`;
}

function booksBuildCommunityInner(community){
  if(!community||(!community.genres?.length&&!community.moods?.length)) return '';
  const buildRows=(items)=>{
    const total=items.reduce((sum,i)=>sum+(i.count||0),0)||1;
    return items.map(i=>{
      const pct=Math.round((i.count/total)*100);
      return `<div class="qc-book-obs-row"><span class="qc-book-obs-name">${booksEscape(i.name)}</span><div class="qc-book-obs-bar"><div class="qc-book-obs-fill" style="width:${pct}%!important;"></div></div><span class="qc-book-obs-pct">${pct}%</span></div>`;
    }).join('');
  };
  const genreBlock=community.genres?.length?`<div class="qc-book-obs-group"><div class="qc-book-obs-title">Genres</div>${buildRows(community.genres)}</div>`:'';
  const moodBlock=community.moods?.length?`<div class="qc-book-obs-group"><div class="qc-book-obs-title">Mood</div>${buildRows(community.moods)}</div>`:'';
  return `${genreBlock}${moodBlock}`;
}
function booksBuildCommunityHtml(community){
  const inner=booksBuildCommunityInner(community);
  if(!inner) return '';
  return `<div class="qc-book-section"><div class="qc-book-label">Community tags</div>${inner}</div>`;
}

function booksBuildFirstEditionSectionHtml(fe, mini){
  if(!fe) return '';
  const parts=[`${fe.year} • ${booksEscape(fe.publisher||'Unknown')}`];
  if(fe.pages) parts.push(`${booksEscape(String(fe.pages))} pages`);
  if(fe.languages&&fe.languages.length) parts.push(booksEscape(fe.languages.join(', ')));
  if(fe.isbn) parts.push(`ISBN ${booksEscape(fe.isbn)}`);
  const inner=`<div class="qc-book-first">${parts.join(' • ')}</div>`;
  return mini ? booksMiniCollapseSection('First edition', inner) : `<div class="qc-book-section"><div class="qc-book-label">First edition</div>${inner}</div>`;
}
function booksBuildAwardsHtml(awards){
  if(!awards||!awards.length) return '';
  return `<div class="qc-book-section"><div class="qc-book-label">Awards</div><div class="qc-book-chips qc-book-desc">${awards.map(a=>`<span class="qc-book-chip  qc-selectable" style="background:#fff4d6!important;color:#7a5b00!important;">${booksEscape(a.label)}${a.year?` (${a.year})`:''}</span>`).join('')}</div></div>`;
}

function booksBuildAuthorLine(authors){
  if(!authors||!authors.length) return '';
  return authors.map(a=>{
    const name=typeof a==='string'?a:a.name;
    const id=typeof a==='string'?null:a.id;
    if(id) return `<span class="qc-nav-link" data-nav-kind="author" data-nav-id="${booksEscape(id)}">${booksEscape(name)}</span>`;
    return `<span class="qc-searchable" data-search-text="${booksEscape(name)}">${booksEscape(name)}</span>`;
  }).join(', ');
}

function booksBuildCollapsibleHtml(items, visibleCount, renderItem, wrapperTag='div', wrapperClass=''){
  const visible=items.slice(0,visibleCount);
  const rest=items.slice(visibleCount);
  const open=(list)=>`<${wrapperTag}${wrapperClass?` class="${wrapperClass}"`:''}>${list.map(renderItem).join('')}</${wrapperTag}>`;
  const restHtml=rest.length?`<details class="qc-book-subjects-details"><summary class="qc-book-subjects-summary">+${rest.length} more</summary>${open(rest)}</details>`:'';
  return `${open(visible)}${restHtml}`;
}

function booksBuildCustomLinkUrl(template, data){
  const isbn=data?.firstEdition?.isbn||'';
  const title=data?.title||'';
  const author=data?.authorLine||'';
  const olId=data?.id||'';
  const titleDash=title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  return String(template||'')
    .replace(/\{isbn\}/g, encodeURIComponent(isbn))
    .replace(/\{ol_id\}/g, encodeURIComponent(olId))
    .replace(/\{author\}/g, encodeURIComponent(author))
    .replace(/\{title_dash\}/g, titleDash)
    .replace(/\{title\}/g, encodeURIComponent(title));
}
function booksBuildCustomLinks(data){
  if(!booksSettings.booksCustomLinks?.length) return [];
  return booksSettings.booksCustomLinks.map(l=>({
    label: (l.label&&l.label.trim())||'Custom Link',
    url: booksBuildCustomLinkUrl(l.urlTemplate, data),
    icon: l.icon||null
  }));
}
function booksFilterSiteLinks(siteLinks){
  const s=booksSettings;
  return (siteLinks||[]).filter(l=>{
    if(l.label==='Open Library'&&!s.booksShowOpenLibraryLink)return false;
    if(l.label==='Wikipedia'&&!s.booksShowWikipediaLink)return false;
    if(l.label==='Goodreads'&&!s.booksShowGoodreadsLink)return false;
    if(l.label==='Google Books'&&!s.booksShowGoogleBooksLink)return false;
    if(l.label==='Amazon'&&!s.booksShowAmazonLink)return false;
    if(l.label==='Barnes & Noble'&&!s.booksShowBarnesNobleLink)return false;
    if(l.label==='Kobo (ebook)'&&!s.booksShowKoboLink)return false;
    if(l.label==='Audible (audiobook)'&&!s.booksShowAudibleLink)return false;
    return true;
  });
}
function booksBuildLinksHtml(data){
  const s=booksSettings;
  const links=[...booksFilterSiteLinks(data.siteLinks)];

  if(s.booksShowYoutubeLink && data.title){
    links.push({ label:'YouTube', url:`https://www.youtube.com/results?search_query=${encodeURIComponent(data.title+' book review')}` });
  }
  links.push(...booksBuildCustomLinks(data));
  return links.length?`<div class="qc-footer-strip">${buildExternalLinksHtml(links)}</div>`:'';
}

function booksUpgradeLinksWithBundle(data, bundleLinks){
  if(!bundleLinks) return data.siteLinks;
  return (data.siteLinks||[]).map(l=>{
    if(l.label==='Goodreads'&&bundleLinks.goodreadsId) return {...l, url:`https://www.goodreads.com/book/show/${encodeURIComponent(bundleLinks.goodreadsId)}`};
    if(l.label==='Google Books'&&bundleLinks.googleBooksId) return {...l, url:`https://books.google.com/books?id=${encodeURIComponent(bundleLinks.googleBooksId)}`};
    if(l.label==='Wikipedia'&&bundleLinks.wikipediaUrl) return {...l, url:bundleLinks.wikipediaUrl};
    return l;
  });
}

function booksBuildFullHtml(data){
  const s=booksSettings;

  const coverHtml=data.coverUrl?`<img class="qc-book-cover" data-qc-book-cover src="${booksEscape(data.coverUrl)}" alt="">`:`<div class="qc-book-cover"></div>`;
  const year=data.workFirstPublishYear?String(data.workFirstPublishYear):'';
  const authorLine=s.booksFieldAuthor&&data.authors?.length?`<div class="qc-book-meta">${booksBuildAuthorLine(data.authors)}</div>`:'';

  const yearSlot=s.booksFieldFirstPublishYear?`<div id="qc-books-year-slot">${year?`<div class="qc-book-meta">First published ${booksEscape(year)}</div>`:''}</div>`:'';
  const pagesSlot=s.booksFieldPages?'<div id="qc-books-pages-slot"></div>':'';
  const ratingsSlot=s.booksFieldRatings?`<div id="qc-books-ratings-slot">${booksBuildRatingsHtml(data.ratings, data.bookshelves)}</div>`:'';

  const subjectsSlot=s.booksFieldSubjects?`<div id="qc-books-subjects-slot">${booksBuildSubjectsHtml(data.subjects)}</div>`:'';

  const descHtml=s.booksFieldDescription&&data.description?`<div class="qc-book-section"><div class="qc-book-label">Description</div>${booksCollapsibleText(data.description, 500, '', true)}</div>`:'';
  const subjectsAndDescHtml=`${subjectsSlot}${descHtml}`;
  const communitySlot=s.booksFieldCommunity?`<div id="qc-books-community-slot">${booksBuildCommunityHtml(data.community)}</div>`:'';
  const firstSentHtml=s.booksFieldFirstSentence&&data.firstSentence?`<div class="qc-book-section"><div class="qc-book-label">First sentence</div><div class="qc-book-desc" style="font-style:italic!important;">${booksEscape(data.firstSentence)}</div></div>`:'';
  const firstEditionSlot=s.booksFieldFirstEdition?`<div id="qc-books-firstedition-slot">${booksBuildFirstEditionSectionHtml(data.firstEdition, false)}</div>`:'';

  const bundleSlots=(s.booksFieldSeries||s.booksFieldAdaptations)
    ? `<div id="qc-books-series-slot">${s.booksFieldSeries?'<div class="loading">Loading series...</div>':''}</div><div id="qc-books-adaptations-slot">${s.booksFieldAdaptations?'<div class="loading">Loading adaptations...</div>':''}</div>`
    : '';
  const linksSlot=`<div id="qc-books-links-slot">${booksBuildLinksHtml(data)}</div>`;

  return `<div class="qc-book-hero" data-book-id="${booksEscape(data.id)}" data-book-title="${booksEscape(data.title||'')}" data-book-wikidata-id="${booksEscape(data.wikidataId||'')}" data-book-work-key="${booksEscape(data.key||'')}">${coverHtml}<div><div class="qc-book-title">${booksEscape(data.title||'Untitled')}</div>${authorLine}${yearSlot}${pagesSlot}</div></div>${ratingsSlot}${subjectsAndDescHtml}${communitySlot}${firstSentHtml}${firstEditionSlot}${bundleSlots}<div class="qc-book-section">${linksSlot}</div>`;
}

function booksCollapsibleText(text, threshold=160, extraStyle='', rich=false){
  if(!text) return '';
  const formattedText = rich ? booksFormatRichText(text) : booksEscape(text);
  const previewLength = rich ? booksPlainPreviewLength(text) : text.length;
  const descClass = `qc-book-desc qc-selectable${rich?' qc-book-desc-rich':''}`;

  const teaserTag = rich ? 'div' : 'span';
  if(previewLength<=threshold) return `<div class="${descClass}" style="${extraStyle}">${formattedText}</div>`;
  return `<details style="margin-top:8px!important;"><summary class="qc-book-text-teaser "><${teaserTag} class="${descClass} qc-book-text" style="${extraStyle}">${formattedText}</${teaserTag}><span class="qc-book-toggle qc-book-toggle-more">Show more ▾</span><span class="qc-book-toggle qc-book-toggle-less">Show less ▴</span></summary></details>`;
}

function booksMiniCollapseSection(label, innerHtml){
  return `<details class="qc-book-section" style="margin-top:14px!important;"><summary class="qc-book-subjects-summary" style="font-size:11px!important;text-transform:uppercase!important;letter-spacing:0.06em!important;font-weight:700!important;">${booksEscape(label)}</summary><div style="margin-top:8px!important;">${innerHtml}</div></details>`;
}

function booksBuildMiniHtml(data){
  const s=booksSettings;

  const coverHtml=data.coverUrl?`<img class="qc-book-cover" data-qc-book-cover src="${booksEscape(data.coverUrl)}" alt="">`:`<div class="qc-book-cover"></div>`;
  const year=data.workFirstPublishYear?String(data.workFirstPublishYear):'';
  const rows=[];
  if(s.booksFieldAuthor&&data.authors?.length) rows.push(`<div class="qc-book-meta">${booksBuildAuthorLine(data.authors)}</div>`);

  const yearBitsSlot=(s.booksFieldFirstPublishYear||s.booksFieldPages)
    ? `<div id="qc-books-yearbits-slot">${year&&s.booksFieldFirstPublishYear?`<div class="qc-book-meta">${booksEscape(year)}</div>`:''}</div>`
    : '';
  if(yearBitsSlot) rows.push(yearBitsSlot);
  const ratingsSlot=s.booksFieldRatings?`<div id="qc-books-ratings-slot">${booksBuildRatingsHtml(data.ratings, data.bookshelves)}</div>`:'';

  const subjectsInner=data.subjects?.length
    ?`<div class="qc-book-section"><div class="qc-book-label">Subjects</div>${booksBuildCollapsibleHtml(data.subjects, 6, (sub)=>`<span class="qc-book-chip">${booksEscape(sub)}</span>`, 'div', 'qc-book-chips')}</div>`
    :'';
  const subjectsSlot=s.booksFieldSubjects?`<div id="qc-books-subjects-slot">${subjectsInner}</div>`:'';
  const descHtml=s.booksFieldDescription?booksCollapsibleText(data.description, 160, 'margin-top:8px!important;', true):'';
  const firstSentHtml=s.booksFieldFirstSentence?booksCollapsibleText(data.firstSentence, 160, 'font-style:italic!important;margin-top:6px!important;font-size:12px!important;'):'';

  const communityInner=s.booksFieldCommunity?booksBuildCommunityInner(data.community):'';
  const communitySlot=s.booksFieldCommunity?`<div id="qc-books-community-slot">${communityInner?booksMiniCollapseSection('Community tags', communityInner):''}</div>`:'';
  const firstEditionSlot=s.booksFieldFirstEdition?`<div id="qc-books-firstedition-slot">${booksBuildFirstEditionSectionHtml(data.firstEdition, true)}</div>`:'';

  const bundleSlots=(s.booksFieldSeries||s.booksFieldAdaptations)
    ? [
        s.booksFieldSeries?booksMiniCollapseSection('Series', '<div id="qc-books-series-slot"><div class="loading">Loading series...</div></div>'):'',
        s.booksFieldAdaptations?booksMiniCollapseSection('Adaptations', '<div id="qc-books-adaptations-slot"><div class="loading">Loading adaptations...</div></div>'):''
      ].join('')
    : '';

  const linksHtml=`<div class="qc-book-section"><div id="qc-books-links-slot">${booksBuildLinksHtml(data)}</div></div>`;

  return `<div class="qc-book-hero" data-book-id="${booksEscape(data.id)}" data-book-title="${booksEscape(data.title||'')}" data-book-wikidata-id="${booksEscape(data.wikidataId||'')}" data-book-work-key="${booksEscape(data.key||'')}">${coverHtml}<div><div class="qc-book-title">${booksEscape(data.title||'Untitled')}</div>${rows.join('')}</div></div>${ratingsSlot}${subjectsSlot}${descHtml}${firstSentHtml}${firstEditionSlot}${communitySlot}${bundleSlots}${linksHtml}`;
}

function booksPatchExtraSlots(host, data, extra){
  if(!host||!extra) return;
  const s=booksSettings;
  const isMini=!!host.querySelector('#qc-books-yearbits-slot');

  const ratingsSlot=host.querySelector('#qc-books-ratings-slot');
  if(ratingsSlot) ratingsSlot.innerHTML=s.booksFieldRatings?booksBuildRatingsHtml(extra.ratings, extra.bookshelves):'';

  const feSlot=host.querySelector('#qc-books-firstedition-slot');
  if(feSlot) feSlot.innerHTML=s.booksFieldFirstEdition?booksBuildFirstEditionSectionHtml(extra.firstEdition, isMini):'';

  const communitySlot=host.querySelector('#qc-books-community-slot');
  if(communitySlot){
    if(!s.booksFieldCommunity) communitySlot.innerHTML='';
    else if(isMini){
      const inner=booksBuildCommunityInner(extra.community);
      communitySlot.innerHTML=inner?booksMiniCollapseSection('Community tags', inner):'';
    } else {
      communitySlot.innerHTML=booksBuildCommunityHtml(extra.community);
    }
  }

  const subjectsSlot=host.querySelector('#qc-books-subjects-slot');
  if(subjectsSlot&&s.booksFieldSubjects&&extra.subjects&&extra.subjects.length){
    subjectsSlot.innerHTML=isMini
      ?`<div class="qc-book-section"><div class="qc-book-label">Subjects</div>${booksBuildCollapsibleHtml(extra.subjects, 6, (sub)=>`<span class="qc-book-chip">${booksEscape(sub)}</span>`, 'div', 'qc-book-chips')}</div>`
      :booksBuildSubjectsHtml(extra.subjects);
  }

  if(isMini){
    const yearBitsSlot=host.querySelector('#qc-books-yearbits-slot');
    if(yearBitsSlot){
      const year=extra.workFirstPublishYear||data.workFirstPublishYear;
      const bits=[];
      if(s.booksFieldFirstPublishYear&&year) bits.push(booksEscape(String(year)));
      if(s.booksFieldPages&&extra.pages) bits.push(`${booksEscape(String(extra.pages))} pages`);
      if(bits.length) yearBitsSlot.innerHTML=`<div class="qc-book-meta">${bits.join(' • ')}</div>`;
    }
  } else {
    const yearSlot=host.querySelector('#qc-books-year-slot');
    if(yearSlot&&s.booksFieldFirstPublishYear&&extra.workFirstPublishYear){
      yearSlot.innerHTML=`<div class="qc-book-meta">First published ${booksEscape(String(extra.workFirstPublishYear))}</div>`;
    }
    const pagesSlot=host.querySelector('#qc-books-pages-slot');
    if(pagesSlot&&s.booksFieldPages&&extra.pages){
      pagesSlot.innerHTML=`<div class="qc-book-meta">${booksEscape(String(extra.pages))} pages <span style="color:#9a9aa3!important;">(first edition)</span></div>`;
    }
  }

  bindPopupButtons(host);

  navRefreshLastRenderedCardHtml();
}

function booksBuildSeriesHtml(series, seriesBooks){
  if(!series && (!seriesBooks||!seriesBooks.length)){
    return `<div class="qc-book-section"><div class="qc-book-label">Series</div><div class="qc-book-empty">Standalone - not part of a series</div></div>`;
  }
  const header = series ? `<div class="qc-book-series-header">${booksEscape(series.label)} — ${seriesBooks?.length||0} books</div>` : '';

  const anyHasOrdinal = !!(seriesBooks && seriesBooks.some((b) => b.ordinal != null));
  const renderItem=(b)=>{
    let ord = '';
    if(b.ordinal != null){
      ord = `<span class="qc-book-badge" style="margin-right:6px!important;">#${booksEscape(String(b.ordinal))}</span>`;
    } else if(anyHasOrdinal){
      ord = `<span class="qc-book-badge qc-book-badge-other" style="margin-right:6px!important;">other</span>`;
    }
    const navAttrs = b.olId ? ` qc-nav-link" data-nav-kind="book" data-nav-id="${booksEscape(b.olId)}` : ` qc-searchable" data-search-text="${booksEscape(b.label)}`;
    return `<span class="qc-book-list-item${navAttrs}"><span>${ord}${booksEscape(b.label)}</span><span>↗</span></span>`;
  };
  const list = seriesBooks && seriesBooks.length ? booksBuildCollapsibleHtml(seriesBooks, 4, renderItem, 'div', 'qc-book-list') : '';
  return `<div class="qc-book-section"><div class="qc-book-label">Series</div>${header}${list}</div>`;
}

function booksBuildAdaptationsHtml(adaptations){
  if(!adaptations||!adaptations.length){
    return `<div class="qc-book-section"><div class="qc-book-label">Adaptations</div><div class="qc-book-empty">No film/TV/game adaptations found</div></div>`;
  }
  const mediaBadge={movie:'Movie', tv:'TV', game:'Game'};
  const renderItem=(a)=>{
    const viaNote=(!a.isExactMatch&&a.sourceWorkLabel)?`<span style="display:block;font-size:11px;color:#8a8a93;">via ${booksEscape(a.sourceWorkLabel)}</span>`:'';
    return `<div class="qc-book-list-item qc-nav-link" data-nav-pack="${booksEscape(a.navPack)}" data-nav-kind="${booksEscape(a.kind)}" data-nav-id="${booksEscape(a.navId)}"><span><span>${booksEscape(a.label)}</span>${viaNote}</span><span style="font-size:11px;color:#8a8a93;white-space:nowrap;">${mediaBadge[a.mediaType]||''}</span></div>`;
  };
  const inner=booksBuildCollapsibleHtml(adaptations, 4, renderItem, 'div', 'qc-book-list');
  return `<div class="qc-book-section"><div class="qc-book-label">Adaptations — film / TV / games</div>${inner}</div>`;
}

function fetchBooksSearch(query){
  return api.runtime.sendMessage({type:'BOOKS_SEARCH', query}).catch(e=>{ logError('[books] search failed', e); return {ok:false, reason:'network', error:String(e?.message||e)}; });
}
function fetchBooksDetails(id){
  return api.runtime.sendMessage({type:'BOOKS_GET_DETAILS', id}).catch(e=>{ logError('[books] details failed', e); return {ok:false, error:String(e?.message||e)}; });
}

const BOOKS_BUNDLE_TIMEOUT_MS = 15000;
function fetchBooksWikidataBundle(id, title, wikidataId, authorName, wantSeries, wantAdaptations, wantLinks){
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok:false, timedOut:true, error:'Timed out' });
    }, BOOKS_BUNDLE_TIMEOUT_MS);
    api.runtime.sendMessage({type:'BOOKS_GET_WIKIDATA_BUNDLE', id, title, wikidataId, authorName, wantSeries, wantAdaptations, wantLinks}).then((res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(res || {ok:false});
    }).catch((e) => {
      logError('[books] wikidata bundle failed', e);
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ok:false, error:String(e?.message||e)});
    });
  });
}

const BOOKS_EXTRA_TIMEOUT_MS = 15000;
function fetchBooksDetailsExtra(workKey, rawSubjects, wantRatings){
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok:false, timedOut:true, error:'Timed out' });
    }, BOOKS_EXTRA_TIMEOUT_MS);
    api.runtime.sendMessage({type:'BOOKS_GET_DETAILS_EXTRA', workKey, rawSubjects, wantRatings}).then((res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(res || {ok:false});
    }).catch((e) => {
      logError('[books] details-extra fetch failed', e);
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ok:false, error:String(e?.message||e)});
    });
  });
}
const BOOKS_AUTHOR_TIMEOUT_MS = 15000;
function fetchBooksAuthor(authorId){
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok:false, timedOut:true, error:'Timed out' });
    }, BOOKS_AUTHOR_TIMEOUT_MS);
    api.runtime.sendMessage({type:'BOOKS_GET_AUTHOR', id:authorId}).then((res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(res || {ok:false});
    }).catch((e) => {
      logError('[books] author fetch failed', e);
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ok:false, error:String(e?.message||e)});
    });
  });
}

async function renderBookCard(id, banner=''){
  const token=navBeginRender();

  navSetRerenderFn(()=>renderBookCard(id, banner));
  const response=await fetchBooksDetails(id);
  if(!navIsTokenCurrent(token)) return;
  if(!response||!response.ok){ updateSelectionPopup(`${banner}<div class="loading">Couldn't load that book${response?.error?` (${booksEscape(response.error)})`:''}</div>`, false, BOOKS_THEME_CLASS); return; }
  const data=response.data;
  const isFull=getPopupStyleClass()==='qc-style-full';

  updateSelectionPopup(`${banner}${isFull?booksBuildFullHtml(data):booksBuildMiniHtml(data)}`, false, BOOKS_THEME_CLASS);
  if(data.coverUrl){
    resolveImageUrl(data.coverUrl, (resolved) => {
      if(!navIsTokenCurrent(token)) return;
      data.coverUrl = resolved;
      if(!resolved||!selectionPopupEl||!selectionPopupEl.isConnected) return;
      const coverImg = selectionPopupEl.querySelector('img[data-qc-book-cover]');
      if(coverImg) coverImg.src = resolved;

      navRefreshLastRenderedCardHtml();
    });
  }

  await Promise.all([booksLoadBundleSlots(data, token), booksLoadExtraSlots(data, token)]);
}

async function booksLoadExtraSlots(data, token, host, isStaleFn){
  host = host || selectionPopupEl;

  const workKey=data.key;
  if(!workKey) return;
  const wantRatings = !!booksSettings.booksFieldRatings;
  const extraRes=await fetchBooksDetailsExtra(workKey, data.rawSubjects||[], wantRatings);
  if(token!==undefined&&!navIsTokenCurrent(token)) return;
  if(isStaleFn&&isStaleFn()) return;
  if(!host||!host.isConnected) return;
  if(!extraRes||!extraRes.ok||!extraRes.data){
    logError('[books] details-extra response not ok', extraRes);
    return;
  }
  booksPatchExtraSlots(host, data, extraRes.data);
}

async function booksLoadBundleSlots(data, token, host, isStaleFn){
  host = host || selectionPopupEl;
  const {id, title, wikidataId, authorLine}=data;

  const wantSeries = !!booksSettings.booksFieldSeries;
  const wantAdaptations = !!booksSettings.booksFieldAdaptations;
  const wantLinks = !!(booksSettings.booksShowGoodreadsLink||booksSettings.booksShowGoogleBooksLink||booksSettings.booksShowWikipediaLink);
  if(!(wantSeries||wantAdaptations||wantLinks)) return;

  const bundleRes = await fetchBooksWikidataBundle(id, title, wikidataId, authorLine, wantSeries, wantAdaptations, wantLinks);
  if(token!==undefined&&!navIsTokenCurrent(token)) return;
  if(isStaleFn&&isStaleFn()) return;

  if(!host||!host.isConnected) return;
  const seriesSlot=host.querySelector('#qc-books-series-slot');
  const adaptationsSlot=host.querySelector('#qc-books-adaptations-slot');
  const linksSlot=host.querySelector('#qc-books-links-slot');

  if(!seriesSlot&&!adaptationsSlot&&!linksSlot) return;

  if(bundleRes&&bundleRes.ok&&bundleRes.data){
    const bundle=bundleRes.data;

    if(seriesSlot&&booksSettings.booksFieldSeries){ seriesSlot.innerHTML=booksBuildSeriesHtml(bundle.series, bundle.seriesBooks); bindPopupButtons(seriesSlot); }
    if(adaptationsSlot&&booksSettings.booksFieldAdaptations){ adaptationsSlot.innerHTML=booksBuildAdaptationsHtml(bundle.adaptations); bindPopupButtons(adaptationsSlot); }

    if(linksSlot&&bundle.links&&data.siteLinks){ linksSlot.innerHTML=booksBuildLinksHtml({...data, siteLinks:booksUpgradeLinksWithBundle(data, bundle.links)}); bindPopupButtons(linksSlot); }
  } else {
    logError('[books] wikidata bundle response not ok', bundleRes);

    const failMsg = bundleRes && bundleRes.timedOut
      ? '<div class="qc-book-empty">Timed out loading this</div>'
      : '<div class="qc-book-empty">Couldn\'t load this</div>';
    if(seriesSlot&&booksSettings.booksFieldSeries) seriesSlot.innerHTML=failMsg;
    if(adaptationsSlot&&booksSettings.booksFieldAdaptations) adaptationsSlot.innerHTML=failMsg;
  }

  navRefreshLastRenderedCardHtml();
}

registerCardRestoredHandler((themeClass) => {
  if(themeClass!==BOOKS_THEME_CLASS) return;
  const hero=selectionPopupEl?.querySelector('[data-book-id]');
  if(!hero) return;
  const id=hero.getAttribute('data-book-id');
  if(!id) return;
  const title=hero.getAttribute('data-book-title')||'';
  const wikidataId=hero.getAttribute('data-book-wikidata-id')||'';
  const key=hero.getAttribute('data-book-work-key')||'';
  const token=navBeginRender();
  const bundleSlotsStillLoading = ['#qc-books-series-slot','#qc-books-adaptations-slot']
    .some(sel => selectionPopupEl.querySelector(sel)?.innerHTML.includes('class="loading"'));
  if(bundleSlotsStillLoading) booksLoadBundleSlots({id, title, wikidataId}, token);

  booksLoadExtraSlots({id, key}, token);
});

registerCardRestoredHandler((themeClass) => {
  if(themeClass!==BOOKS_THEME_CLASS) return;
  const hero=selectionPopupEl?.querySelector('[data-book-author-id]');
  if(!hero) return;
  const id=hero.getAttribute('data-book-author-id');
  if(!id) return;
  const key=hero.getAttribute('data-book-author-key')||'';
  const name=hero.getAttribute('data-book-author-name')||'';
  const token=navBeginRender();
  booksLoadAuthorExtraSlots({id, key, name}, token);
});

function booksBuildAuthorFactsHtml(a){
  const facts=[];
  if(booksSettings.booksFieldAuthorBorn&&(a.birthDate||a.deathDate)){
    const label=a.deathDate?'Born – Died':'Born';
    const value=[a.birthDate, a.deathDate].filter(Boolean).join(' – ');
    facts.push(buildFactRow('🎂', label, booksEscape(value)));
  }
  if(booksSettings.booksFieldAuthorBirthplace&&a.birthPlace) facts.push(buildFactRow('📍', 'Birthplace', booksEscape(a.birthPlace)));
  if(booksSettings.booksFieldAuthorOccupation&&a.occupations?.length) facts.push(buildFactRow('✍️', 'Occupation', booksEscape(a.occupations.slice(0,4).join(', '))));
  return facts.length?`<div class="qc-fact-grid">${facts.join('')}</div>`:'';
}
function booksBuildAuthorAwardsHtml(a){

  return (booksSettings.booksFieldAuthorAwards&&a.awards?.length)?booksBuildAwardsHtml(a.awards):'';
}
function booksBuildAuthorWorksHtml(a, mini){

  if(!booksSettings.booksFieldAuthorWorks) return '';
  if(!a.works?.length) return '';
  const renderItem=(w)=>`<span class="qc-book-list-item qc-nav-link" data-nav-kind="book" data-nav-id="${booksEscape(w.id)}"><span>${booksEscape(w.title)}</span><span style="font-size:11px;color:#8a8a93;">${w.year||''}</span></span>`;

  if(mini) return booksMiniCollapseSection('Books written', `<div id="qc-books-author-works-list">${booksBuildCollapsibleHtml(a.works, 4, renderItem, 'div', 'qc-book-list')}</div>`);
  return `<div class="qc-book-section"><div class="qc-book-label">Books written</div>${booksBuildCollapsibleHtml(a.works, 4, renderItem, 'div', 'qc-book-list')}</div>`;
}
function booksBuildAuthorInMediaHtml(a, mini){

  if(!booksSettings.booksFieldAuthorAdaptations) return '';
  if(!a.knownFor?.length) return '';
  const mediaBadge={movie:'Movie', tv:'TV', game:'Game'};
  const renderItem=(k)=>{
    const viaNote=k.sourceWorkLabel?`<span style="display:block;font-size:11px;color:#8a8a93;">via ${booksEscape(k.sourceWorkLabel)}</span>`:'';
    return `<div class="qc-book-list-item qc-nav-link" data-nav-pack="${booksEscape(k.navPack)}" data-nav-kind="${booksEscape(k.kind)}" data-nav-id="${booksEscape(k.navId)}"><span><span>${booksEscape(k.label)}</span>${viaNote}</span><span style="font-size:11px;color:#8a8a93;white-space:nowrap;">${mediaBadge[k.mediaType]||''}</span></div>`;
  };

  if(mini) return booksMiniCollapseSection('In media', `<div id="qc-books-author-inmedia-list">${booksBuildCollapsibleHtml(a.knownFor, 4, renderItem, 'div', 'qc-book-list')}</div>`);
  return `<div class="qc-book-section"><div class="qc-book-label">In media</div>${booksBuildCollapsibleHtml(a.knownFor, 4, renderItem, 'div', 'qc-book-list')}</div>`;
}
function booksBuildAuthorHtml(a){
  const photoHtml=a.photoUrl?`<img class="qc-book-cover" src="${booksEscape(a.photoUrl)}" alt="">`:`<div class="qc-book-cover"></div>`;
  const factGridSlot=`<div id="qc-books-author-facts-slot">${booksBuildAuthorFactsHtml(a)}</div>`;
  const bioHtml=(booksSettings.booksFieldAuthorBio&&a.bio)?`<div class="qc-book-section">${booksCollapsibleText(a.bio, 160, '', true)}</div>`:'';
  const awardsSlot=`<div id="qc-books-author-awards-slot">${booksBuildAuthorAwardsHtml(a)}</div>`;

  const mini=getPopupStyleClass()==='qc-style-mini';
  const worksSlot=`<div id="qc-books-author-works-slot">${booksBuildAuthorWorksHtml(a, mini)}</div>`;
  const inMediaSlot=`<div id="qc-books-author-inmedia-slot">${booksBuildAuthorInMediaHtml(a, mini)}</div>`;
  const authorCustom = booksBuildCustomLinks({
    title: a.name || '',
    id: a.id || '',
    authorLine: a.name || '',
    firstEdition: {}
  }).filter((l) => l && l.url);
  const authorLinks = [...(a.links || []), ...authorCustom];
  const linksSlot=`<div id="qc-books-author-links-slot">${authorLinks.length?`<div class="qc-book-section"><div class="qc-footer-strip">${buildExternalLinksHtml(authorLinks)}</div></div>`:''}</div>`;
  return `<div class="qc-book-hero" data-book-author-id="${booksEscape(a.id)}" data-book-author-key="${booksEscape(a.key||'')}" data-book-author-name="${booksEscape(a.name||'')}">${photoHtml}<div><div class="qc-book-title">${booksEscape(a.name)}</div>${factGridSlot}</div></div>${bioHtml}${awardsSlot}${worksSlot}${inMediaSlot}${linksSlot}`;
}
const BOOKS_AUTHOR_EXTRA_TIMEOUT_MS = 15000;
function fetchBooksAuthorExtra(authorKey, id, name){

  const wantKnownFor = !!booksSettings.booksFieldAuthorAdaptations;
  const wantAwards = !!booksSettings.booksFieldAuthorAwards;
  const wantWorks = !!booksSettings.booksFieldAuthorWorks;

  const wantFacts = true;
  if (!wantKnownFor && !wantAwards && !wantWorks && !wantFacts) {
    return Promise.resolve({ ok: true, data: { birthDate:null, deathDate:null, birthPlace:null, occupations:[], works:[], knownFor:[], awards:[], linkUpgrades:{} } });
  }
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ ok:false, timedOut:true, error:'Timed out' });
    }, BOOKS_AUTHOR_EXTRA_TIMEOUT_MS);
    api.runtime.sendMessage({type:'BOOKS_GET_AUTHOR_EXTRA', authorKey, id, name, wantKnownFor, wantAwards, wantWorks, wantFacts}).then((res) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(res || {ok:false});
    }).catch((e) => {
      logError('[books] author-extra fetch failed', e);
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ok:false, error:String(e?.message||e)});
    });
  });
}

function booksUpgradeAuthorLinksWithExtra(links, name, upgrades){
  if(!upgrades) return links;
  return links.map((l) => {
    if(l.label==='Wikipedia'&&upgrades.wikipediaUrl) return {...l, url:upgrades.wikipediaUrl};
    if(l.label==='Goodreads'&&upgrades.goodreadsAuthorId) return {...l, url:`https://www.goodreads.com/author/show/${encodeURIComponent(upgrades.goodreadsAuthorId)}`};
    if(l.label==='Twitter'&&upgrades.twitterHandle) return {...l, url:`https://twitter.com/${encodeURIComponent(upgrades.twitterHandle)}`};
    return l;
  }).concat(
    (upgrades.instagramHandle&&!links.some(l=>l.label==='Instagram')) ? [{label:'Instagram', url:`https://instagram.com/${encodeURIComponent(upgrades.instagramHandle)}`}] : [],
    (upgrades.officialWebsite&&!links.some(l=>l.label==='Website')) ? [{label:'Website', url:upgrades.officialWebsite}] : []
  );
}

function booksPatchAuthorExtraSlots(host, coreData, extra){
  if(!host||!extra) return;
  const factsSlot=host.querySelector('#qc-books-author-facts-slot');
  if(factsSlot) factsSlot.innerHTML=booksBuildAuthorFactsHtml({...coreData, birthPlace:extra.birthPlace, occupations:extra.occupations, birthDate:coreData.birthDate||extra.birthDate, deathDate:coreData.deathDate||extra.deathDate});
  const awardsSlot=host.querySelector('#qc-books-author-awards-slot');
  if(awardsSlot) awardsSlot.innerHTML=booksBuildAuthorAwardsHtml({awards:extra.awards});

  const popupEl=host.querySelector('.qc-popup');
  const mini=popupEl?popupEl.classList.contains('qc-style-mini'):getPopupStyleClass()==='qc-style-mini';
  const worksSlot=host.querySelector('#qc-books-author-works-slot');
  if(worksSlot){ worksSlot.innerHTML=booksBuildAuthorWorksHtml({works:extra.works}, mini); bindPopupButtons(worksSlot); }
  const inMediaSlot=host.querySelector('#qc-books-author-inmedia-slot');
  if(inMediaSlot){ inMediaSlot.innerHTML=booksBuildAuthorInMediaHtml({knownFor:extra.knownFor}, mini); bindPopupButtons(inMediaSlot); }
  const linksSlot=host.querySelector('#qc-books-author-links-slot');
  if(linksSlot&&coreData.links){
    const upgraded=booksUpgradeAuthorLinksWithExtra(coreData.links, coreData.name, extra.linkUpgrades);
    const authorCustom=booksBuildCustomLinks({title:coreData.name||'', id:coreData.id||'', authorLine:coreData.name||'', firstEdition:{}}).filter(l=>l&&l.url);
    const merged=[...upgraded, ...authorCustom];
    linksSlot.innerHTML=merged.length?`<div class="qc-book-section"><div class="qc-footer-strip">${buildExternalLinksHtml(merged)}</div></div>`:'';
    bindPopupButtons(linksSlot);
  }

  navRefreshLastRenderedCardHtml();
}
async function renderBookAuthorCard(authorId, banner=''){
  const token=navBeginRender();
  navSetRerenderFn(()=>renderBookAuthorCard(authorId, banner));
  const response=await fetchBooksAuthor(authorId);
  if(!navIsTokenCurrent(token)) return;
  if(!response||!response.ok){ updateSelectionPopup(`${banner}<div class="loading">Couldn't load that author${response?.error?` (${booksEscape(response.error)})`:''}</div>`, true, BOOKS_THEME_CLASS); return; }
  const data=response.data;
  updateSelectionPopup(`${banner}${booksBuildAuthorHtml(data)}`, true, BOOKS_THEME_CLASS);
  await booksLoadAuthorExtraSlots(data, token);
}

async function booksLoadAuthorExtraSlots(data, token){
  if(!data.key) return;
  const extraRes=await fetchBooksAuthorExtra(data.key, data.id, data.name);
  if(token!==undefined&&!navIsTokenCurrent(token)) return;
  if(!selectionPopupEl||!selectionPopupEl.isConnected) return;
  if(!extraRes||!extraRes.ok||!extraRes.data){
    logError('[books] author-extra response not ok', extraRes);
    return;
  }
  booksPatchAuthorExtraSlots(selectionPopupEl, data, extraRes.data);
}

function booksNavigateById(kind, id){
  if(!id) return;
  setActivePack(BOOKS_PACK_ID);
  if(kind==='author'){ updateSelectionPopup('<div class="loading">Loading...</div>', true, BOOKS_THEME_CLASS); renderBookAuthorCard(id, ''); return; }
  updateSelectionPopup('<div class="loading">Loading...</div>', false, BOOKS_THEME_CLASS);
  renderBookCard(id, '');
}

function describeBookCandidate(c){ return {name:c.label, image:c.image, subParts:c.description?[c.description]:[]}; }
const BOOKS_NETWORK_RETRY_DELAYS_MS=[700,1400];
let booksSearchToken=null;

async function runBooksSearch(query, requestToken, attempt=0, translationInfo=null, sessionNavToken=null){
  const banner=buildTranslationBanner(translationInfo);
  const response=await fetchBooksSearch(query);
  if(booksSearchToken!==requestToken) return;
  if(sessionNavToken!==null&&!navIsTokenCurrent(sessionNavToken)) return;
  if(!selectionPopupEl) return;
  const isNetworkFailure=!!(response&&response.ok===false&&response.reason==='network');
  if(isNetworkFailure&&attempt<BOOKS_NETWORK_RETRY_DELAYS_MS.length){
    updateSelectionPopup(`${banner}<div class="loading">Network error — retrying...</div>`, false);
    setTimeout(()=>runBooksSearch(query, requestToken, attempt+1, translationInfo, sessionNavToken), BOOKS_NETWORK_RETRY_DELAYS_MS[attempt]); return;
  }
  if(!response||!response.ok||!response.candidates?.length){
    updateSelectionPopup(`${banner}<div class="loading">${isNetworkFailure?'No response from Open Library':'No books found.'}</div>`, false); return;
  }
  if(response.candidates.length===1){ await renderBookCard(response.candidates[0].id, banner); return; }
  showDisambiguationPicker(response.candidates, describeBookCandidate, (chosen)=>{ updateSelectionPopup(`${banner}<div class="loading">Loading...</div>`, false); renderBookCard(chosen.id, banner); }, banner);
}

async function booksLaunchSearch(query, left, top){
  if(!query)return;
  setActivePack(BOOKS_PACK_ID);
  showSelectionPopupAt(BOOKS_THEME_CLASS, left, top, '<div class="loading">Searching...</div>', false);
  const requestToken=`${Date.now()}${Math.random()}`;
  booksSearchToken=requestToken;

  const launchNavToken=navGuardToken();

  if (QUICKCARD_ABBREVIATION_PATTERN.test(query)) {
    const res = await quickcardResolveAbbreviation(query);
    if (booksSearchToken !== requestToken) return;
    if (res.type === 'direct' && res.title) {
      return runBooksSearch(res.title, requestToken, 0, null, launchNavToken);
    }
    if (res.type === 'choices' && res.options && res.options.length) {
      quickcardShowAbbreviationPicker(BOOKS_THEME_CLASS, res.options, (title) => {
        runBooksSearch(title, requestToken, 0, null, launchNavToken);
      }, query);
      return;
    }
  }

  const langCode=detectNonLatinLangCode(query);
  if(!langCode){ await runBooksSearch(query, requestToken, 0, null, launchNavToken); return; }

  updateSelectionPopup('<div class="loading">Translating...</div>', false);
  translateSelectionText(query, langCode, (res)=>{
    if(booksSearchToken!==requestToken) return;
    if(!navIsTokenCurrent(launchNavToken)) return;
    if(!selectionPopupEl) return;

    if(!res||!res.ok||!res.translatedText){
      if (res && res.networkError) {
        lastRetryFn = () => booksLaunchSearch(query, left, top);
        updateSelectionPopup('<div class="loading">Network error while translating</div><div><button class="qc-retry-btn">Retry</button></div>', false);
      } else {
        updateSelectionPopup(buildTranslationFailureHtml(query), false);
      }
      return;
    }
    const { text: cleanedTranslation, stillHasNonLatin } = cleanTranslatedText(res.translatedText);
    if(!cleanedTranslation){ updateSelectionPopup(buildTranslationFailureHtml(query), false); return; }
    const isLowConfidence = (typeof res.match==='number' && res.match<TRANSLATION_CONFIDENCE_THRESHOLD) || stillHasNonLatin;
    runBooksSearch(cleanedTranslation, requestToken, 0, { original: query, translated: cleanedTranslation, lowConfidence: isLowConfidence }, launchNavToken);
  });
}
function handleBooksExternalSearch(rawQuery, left, top){
  const query=sanitizeSelectionText(rawQuery); if(!query)return;

  navClearHistory();
  booksLaunchSearch(query, left, top);
}

function parseOpenLibraryUrl(href) {
  try {
    const u = new URL(href, location.href);
    if (!u.hostname.includes('openlibrary.org')) return null;
    const workMatch = u.pathname.match(/\/works\/(OL\d+W)/i);
    if (workMatch) return { id: workMatch[1].toUpperCase() };
    const editionMatch = u.pathname.match(/\/books\/(OL\d+M)/i);
    if (editionMatch) return { id: editionMatch[1].toUpperCase() };
    return null;
  } catch (e) {
    return null;
  }
}

const BOOKS_HOVER_CACHE = new Map();
function getBooksHoverCacheEntry(id) {
  if (!BOOKS_HOVER_CACHE.has(id)) BOOKS_HOVER_CACHE.set(id, {});
  return BOOKS_HOVER_CACHE.get(id);
}

let booksHoverTimer = null;

function attachBooksHover(anchor) {
  if (anchor.__quickcardBooksBound) return;
  const info = parseOpenLibraryUrl(anchor.href);
  if (!info) return;
  anchor.__quickcardBooksBound = true;

  anchor.addEventListener('mouseenter', () => {
    if (!coreSettings.featureLinkHover) return;

    clearTimeout(hoverHideTimer);
    clearTimeout(hoverRemoveTimer);
    clearTimeout(booksHoverTimer);

    currentAnchor = anchor;

    booksHoverTimer = setTimeout(() => {
      if (currentAnchor !== anchor) return;

      const myHoverToken = ++hoverRequestToken;
      setActivePack(BOOKS_PACK_ID);

      const renderBooksHover = (skipCache) => {
        showPopup(BOOKS_THEME_CLASS, anchor, '<div class="loading">Loading...</div>', false);

        const cacheEntry = getBooksHoverCacheEntry(info.id);
        const isStale = () => myHoverToken !== hoverRequestToken || !hoverPopupEl;

        const loadSlots = (data) => {
          booksLoadBundleSlots(data, undefined, hoverPopupEl, isStale);
          booksLoadExtraSlots(data, undefined, hoverPopupEl, isStale);
        };

        if (!skipCache && cacheEntry.finalHtml && cacheEntry.data) {
          if (!isStale()) {
            showPopup(BOOKS_THEME_CLASS, anchor, cacheEntry.finalHtml, false);
            loadSlots(cacheEntry.data);
          }
          return;
        }

        fetchBooksDetails(info.id).then((response) => {
          if (isStale()) return;

          if (!response || !response.ok) {
            const error = response && response.error ? ` (${booksEscape(response.error)})` : '';
            showPopup(BOOKS_THEME_CLASS, anchor, `<div class="loading">Couldn't load that book${error}.</div>`, false);
            return;
          }

          const data = response.data;

          const isFull = getPopupStyleClass() === 'qc-style-full';
          const html = isFull ? booksBuildFullHtml(data) : booksBuildMiniHtml(data);
          cacheEntry.finalHtml = html;
          cacheEntry.data = data;
          if (isStale()) return;
          showPopup(BOOKS_THEME_CLASS, anchor, html, false);
          loadSlots(data);
          if (data.coverUrl) {
            resolveImageUrl(data.coverUrl, (resolved) => {
              if (isStale() || !resolved) return;
              data.coverUrl = resolved;

              cacheEntry.finalHtml = isFull ? booksBuildFullHtml(data) : booksBuildMiniHtml(data);
              if (!hoverPopupEl || !hoverPopupEl.isConnected) return;
              const coverImg = hoverPopupEl.querySelector('img[data-qc-book-cover]');
              if (coverImg) coverImg.src = resolved;
            });
          }
        });
      };
      navSetRerenderFn(() => renderBooksHover(true));
      renderBooksHover(false);
    }, 350);
  });

  anchor.addEventListener('mouseleave', () => {
    clearTimeout(booksHoverTimer);
    if (currentAnchor === anchor) currentAnchor = null;
    scheduleHoverHide();
  });
}

function scanBooksHoverLinks(root) {
  root.querySelectorAll('a[href*="openlibrary.org"]').forEach(attachBooksHover);
}

function initBooksLinkObserver() {
  scanBooksHoverLinks(document);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;

        if (node.tagName === 'A') {
          attachBooksHover(node);
        } else if (node.querySelectorAll) {
          scanBooksHoverLinks(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

async function initBooksPackCore(){ await loadBooksSettings(); injectBooksTheme(); registerPack({id:BOOKS_PACK_ID, fullWidth:BOOKS_FULL_CARD_WIDTH, noDrag:true, launchSearch:booksLaunchSearch, handleExternalSearch:handleBooksExternalSearch, navigateById:booksNavigateById, isAllowedOnThisSite:isBooksAllowedOnThisSite}); }
async function initBooksPack(){
  await initBooksPackCore();
  if (!isBooksAllowedForHoverOnThisSite()) return;
  initBooksLinkObserver();
}

