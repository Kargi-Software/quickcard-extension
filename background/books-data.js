
const OPENLIBRARY_ORIGIN = 'https://openlibrary.org';
const OPENLIBRARY_SEARCH_ENDPOINT = `${OPENLIBRARY_ORIGIN}/search.json`;
const OPENLIBRARY_COVERS_ENDPOINT = 'https://covers.openlibrary.org/b';

const BOOKS_SEARCH_TIMEOUT_MS = 16000;
const BOOKS_DETAILS_TIMEOUT_MS = 12000;

function booksCleanText(v){ return typeof v==='string'?v.replace(/\s+/g,' ').trim():''; }
function booksLogError() {}
function booksLog() {}
function booksUniqueStrings(values){ const seen=new Set(); const res=[]; for(const v of values||[]){ const c=booksCleanText(v); if(!c)continue; const k=c.toLowerCase(); if(seen.has(k))continue; seen.add(k); res.push(c);} return res; }

async function booksFetchJson(url, timeout=BOOKS_DETAILS_TIMEOUT_MS){
  return await fetchJson(url, { Accept: 'application/json' }, timeout);
}

function booksBuildCoverUrl(coverId,size='L'){ if(!coverId)return null; return `${OPENLIBRARY_COVERS_ENDPOINT}/id/${coverId}-${size}.jpg`; }
function booksExtractWorkIdFromKey(key){ if(!key)return null; const m=String(key).match(/\/works\/(OL\d+W)/i); return m?m[1]:null; }
function booksExtractDescription(d){ if(!d)return ''; if(typeof d==='string')return booksCleanText(d); if(typeof d==='object'&&typeof d.value==='string')return booksCleanText(d.value); return ''; }
function booksExtractFirstSentence(d){ if(!d)return ''; if(typeof d==='string')return booksCleanText(d); if(typeof d==='object'&&typeof d.value==='string')return booksCleanText(d.value); return ''; }
function booksExtractYear(str){ if(!str)return null; const m=String(str).match(/\b(1[0-9]{3}|20[0-9]{2})\b/); return m?Number(m[0]):null; }

const BOOKS_SUBJECT_BLACKLIST=['translation','accessible','protected','daisy','large print','in library','overdrive','fiction in','language:','print','audio'];
function booksIsSubjectBlacklisted(subject){
  const low=subject.toLowerCase();
  return BOOKS_SUBJECT_BLACKLIST.some(term=>low.includes(term));
}

function booksProcessSubjects(rawSubjects, genreNames){
  const cleaned=booksUniqueStrings(rawSubjects).filter(s=>!booksIsSubjectBlacklisted(s));
  const genreSet=new Set((genreNames||[]).map(g=>g.toLowerCase()));
  const genreMatches=[]; const rest=[];
  for(const s of cleaned){ (genreSet.has(s.toLowerCase())?genreMatches:rest).push(s); }
  rest.sort((a,b)=>{ const wc=a.split(/\s+/).length-b.split(/\s+/).length; return wc!==0?wc:a.length-b.length; });
  return [...genreMatches, ...rest];
}

async function booksFetchRatings(workKey){
  try{
    const data=await booksFetchJson(`${OPENLIBRARY_ORIGIN}${workKey}/ratings.json`);
    const summary=data?.summary||data;
    const average=typeof summary?.average==='number'?summary.average:null;
    const count=typeof summary?.count==='number'?summary.count:null;

    if(!count) return null;
    return {average,count};
  }catch(e){ booksLog('ratings fetch non-fatal', e.message); return null; }
}
async function booksFetchBookshelves(workKey){
  try{
    const data=await booksFetchJson(`${OPENLIBRARY_ORIGIN}${workKey}/bookshelves.json`);
    const counts=data?.counts||data;
    const wantToRead=typeof counts?.want_to_read==='number'?counts.want_to_read:null;
    const currentlyReading=typeof counts?.currently_reading==='number'?counts.currently_reading:null;
    const alreadyRead=typeof counts?.already_read==='number'?counts.already_read:null;

    if(!wantToRead&&!currentlyReading&&!alreadyRead) return null;
    return {wantToRead,currentlyReading,alreadyRead};
  }catch(e){ booksLog('bookshelves fetch non-fatal', e.message); return null; }
}

async function searchBooks(query, limit=5){
  const q=booksCleanText(query); if(!q)return [];
  const url=`${OPENLIBRARY_SEARCH_ENDPOINT}?q=${encodeURIComponent(q)}&fields=key,title,author_name,first_publish_year,cover_i,isbn&limit=${limit}`;
  const data=await booksFetchJson(url, BOOKS_SEARCH_TIMEOUT_MS);
  const docs=Array.isArray(data?.docs)?data.docs:[];
  return docs.map(doc=>{
    const workId=booksExtractWorkIdFromKey(doc.key); if(!workId)return null;
    const label=booksCleanText(doc.title)||workId;
    const author=Array.isArray(doc.author_name)&&doc.author_name[0]?booksCleanText(doc.author_name[0]):'';
    const year=doc.first_publish_year||null;
    const coverId=doc.cover_i||null;

    const image=coverId?booksBuildCoverUrl(coverId,'M'):null;
    const description=author&&year?`${author} - ${year}`:author||(year?String(year):'');
    return {id:workId, key:doc.key, label, description, image, author, publishYear:year, coverId};
  }).filter(Boolean);
}
async function booksFetchAuthorInfo(ref){
  try{
    const key=typeof ref==='string'?ref:ref?.author?.key||ref?.key; if(!key)return null;
    const data=await booksFetchJson(`${OPENLIBRARY_ORIGIN}${key}.json`);
    const name=booksCleanText(data?.name); if(!name)return null;
    const m=key.match(/\/authors\/(OL\d+A)/i);
    return { name, id: m?m[1]:null };
  }catch(e){ return null; }
}

async function booksResolveWorkKey(rawId){
  const q=booksCleanText(String(rawId||''));
  if(!q) return q;
  if(q.startsWith('/works/')) return q;

  const workMatch=q.match(/(OL\d+W)/i);
  if(workMatch) return `/works/${workMatch[1].toUpperCase()}`;

  const editionMatch=q.match(/(OL\d+M)/i);
  if(editionMatch){
    try{
      const edition=await booksFetchJson(`${OPENLIBRARY_ORIGIN}/books/${editionMatch[1].toUpperCase()}.json`);
      const workKey=edition?.works?.[0]?.key;
      if(workKey) return workKey;
    }catch(e){ booksLog('booksResolveWorkKey: edition lookup non-fatal', e.message); }
  }
  return q;
}
async function getBooksDetails(workIdOrKey){
  const q=booksCleanText(String(workIdOrKey||'')); if(!q)throw new Error('Missing work id');
  let workKey=await booksResolveWorkKey(q);
  booksLog('getBooksDetails: resolved work key:', workKey, 'from:', q);

  let work=null;
  try{
    work=await booksFetchJson(`${OPENLIBRARY_ORIGIN}${workKey}.json`);
    booksLog('getBooksDetails: initial fetch status - work.type:', work?.type?.key, 'has title:', !!work?.title);
  }catch(e){
    booksLog('getBooksDetails: initial fetch failed for', workKey, '->', e.message);

  }

  let redirectAttempts=0;
  while(work && work.type && typeof work.type==='object' && work.type.key==='/type/redirect' && work.location && redirectAttempts<3){
    redirectAttempts++;
    const newKey=work.location;
    if(!newKey.startsWith('/works/')) {
      booksLog('getBooksDetails: invalid redirect location:', newKey);
      work=null;
      break;
    }
    booksLog('getBooksDetails: following redirect #'+redirectAttempts, workKey, '->', newKey);
    workKey=newKey;
    try{
      work=await booksFetchJson(`${OPENLIBRARY_ORIGIN}${workKey}.json`);
      booksLog('getBooksDetails: redirect fetch succeeded, has title:', !!work?.title);
    }catch(e){
      booksLog('getBooksDetails: redirect fetch failed:', e.message);
      work=null;
      break;
    }
  }

  if(!work||!work.title){
    if(q.startsWith('/works/')) {
      throw new Error(`Open Library work not found: "${workKey}" - likely a dead/invalid id`);
    }
    try{
      booksLog('getBooksDetails: work has no title, trying search fallback for:', q);
      const searchUrl=`${OPENLIBRARY_ORIGIN}/search.json?title=${encodeURIComponent(q)}&limit=5`;
      const searchResult=await booksFetchJson(searchUrl);
      if(searchResult?.docs && searchResult.docs.length>0){

        for(const doc of searchResult.docs){
          if(!doc.key) continue;
          try{
            work=await booksFetchJson(`${OPENLIBRARY_ORIGIN}${doc.key}.json`);
            if(work && work.title){
              booksLog('getBooksDetails: search fallback found:', doc.key);
              break;
            }
          }catch(e){ booksLog('getBooksDetails: fallback doc fetch failed:', e.message); }
        }
      }
    }catch(e){ booksLog('getBooksDetails: search fallback threw error:', e.message); }
    if(!work||!work.title) throw new Error(`Open Library: no data for "${q}"`);
  }
  const title=booksCleanText(work.title);
  const description=booksExtractDescription(work.description);
  const firstSentence=booksExtractFirstSentence(work.first_sentence);
  const rawSubjects=Array.isArray(work.subjects)?work.subjects:[];
  const covers=Array.isArray(work.covers)?work.covers:[]; const coverId=covers[0]||null;

  const coverUrl=coverId?booksBuildCoverUrl(coverId,'M'):null;
  const authorRefs=Array.isArray(work.authors)?work.authors.slice(0,3):[];

  const authors=[]; try{ const infos=await Promise.all(authorRefs.map(r=>booksFetchAuthorInfo(r))); for(const info of infos) if(info) authors.push(info); }catch(e){}
  const authorNames=authors.map(a=>a.name);

  const subjects=booksProcessSubjects(rawSubjects, []);

  const workFirstPublishYear=booksExtractYear(work.first_publish_date)||null;
  const workId=booksExtractWorkIdFromKey(workKey)||workIdOrKey;

  const wikidataId = (Array.isArray(work?.identifiers?.wikidata) && work.identifiers.wikidata[0]) || null;
  return { id:workId, key:workKey, title, authors, authorLine:authorNames.join(', '), description, firstSentence, subjects, rawSubjects, coverId, coverUrl, workFirstPublishYear, pages:null, firstEdition:null, ratings:null, bookshelves:null, community:null, wikidataId, openLibraryUrl:`${OPENLIBRARY_ORIGIN}${workKey}` };
}

async function getBooksDetailsExtra(workKey, rawSubjects, wantRatings){

  const [editionsResult, ratingsResult, bookshelvesResult]=await Promise.allSettled([
    (async()=>{
      const editionsUrl=`${OPENLIBRARY_ORIGIN}${workKey}/editions.json?limit=50`;
      const editionsData=await booksFetchJson(editionsUrl);
      const entries=Array.isArray(editionsData?.entries)?editionsData.entries:[];
      const parsed=entries.map(ed=>{
        const year=booksExtractYear(ed.publish_date)||null;
        const lang=(Array.isArray(ed.languages)?ed.languages.map(l=>(l.key||'').replace('/languages/','')).filter(Boolean):[]);
        const publisher=Array.isArray(ed.publishers)&&ed.publishers[0]?booksCleanText(ed.publishers[0]):'';
        const isbn=Array.isArray(ed.isbn_13)&&ed.isbn_13[0]?ed.isbn_13[0]:(Array.isArray(ed.isbn_10)&&ed.isbn_10[0]?ed.isbn_10[0]:'');
        const pages=ed.number_of_pages||null;
        return {year, lang, publisher, isbn, pages, rawDate:ed.publish_date};
      }).filter(e=>e.year!==null);
      parsed.sort((a,b)=>{ if(a.year!==b.year) return a.year-b.year; return String(a.rawDate||'').localeCompare(String(b.rawDate||'')); });
      const c=parsed[0];
      return c?{ year:c.year, publisher:c.publisher, isbn:c.isbn, pages:c.pages, languages:c.lang, rawDate:c.rawDate }:null;
    })(),
    wantRatings ? booksFetchRatings(workKey) : Promise.resolve(null),
    wantRatings ? booksFetchBookshelves(workKey) : Promise.resolve(null)

  ]);

  let firstEdition=null;
  if(editionsResult.status==='fulfilled') firstEdition=editionsResult.value;
  else booksLog('editions fetch non-fatal', editionsResult.reason?.message||editionsResult.reason);
  const ratings=(wantRatings && ratingsResult.status==='fulfilled')?ratingsResult.value:null;
  const bookshelves=(wantRatings && bookshelvesResult.status==='fulfilled')?bookshelvesResult.value:null;
  const community=null;

  const genreNames=community?.genres?.map(g=>g.name)||[];
  const subjects=booksProcessSubjects(rawSubjects||[], genreNames);

  let workFirstPublishYear=firstEdition?.year||null;
  const pages=firstEdition?.pages||null;

  return { firstEdition, pages, workFirstPublishYear, ratings, bookshelves, community, subjects };
}

function getBooksSiteLinks(data, settings){
  const links=[];
  if(settings?.booksShowOpenLibraryLink&&data?.openLibraryUrl) links.push({label:'Open Library', url:data.openLibraryUrl});
  if(settings?.booksShowWikipediaLink&&data?.title) links.push({label:'Wikipedia', url:`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(data.title)}`});
  if(settings?.booksShowGoodreadsLink&&data?.title) links.push({label:'Goodreads', url:`https://www.goodreads.com/search?q=${encodeURIComponent(data.title)}`});
  if(settings?.booksShowGoogleBooksLink) links.push({label:'Google Books', url:data?.firstEdition?.isbn?`https://books.google.com/books?vid=ISBN${encodeURIComponent(data.firstEdition.isbn)}`:`https://books.google.com/books?q=${encodeURIComponent(data?.title||'')}`});
  const searchQuery=data?.firstEdition?.isbn||`${data?.title||''} ${data?.authorLine||''}`.trim();
  if(settings?.booksShowAmazonLink&&searchQuery) links.push({label:'Amazon', url:`https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&i=stripbooks`});
  if(settings?.booksShowBarnesNobleLink&&searchQuery) links.push({label:'Barnes & Noble', url:`https://www.barnesandnoble.com/s/${encodeURIComponent(searchQuery)}`});
  if(settings?.booksShowKoboLink&&data?.title) links.push({label:'Kobo (ebook)', url:`https://www.kobo.com/search?query=${encodeURIComponent(data.title)}`});
  if(settings?.booksShowAudibleLink&&data?.title) links.push({label:'Audible (audiobook)', url:`https://www.audible.com/search?keywords=${encodeURIComponent(data.title)}`});
  return links;
}

async function handleBooksSearch(query){
  try{
    const candidates=await searchBooks(booksCleanText(String(query||'')),5);

    return {ok:true,candidates};
  }
  catch(error){ booksLogError('handleBooksSearch failed', error.message); return {ok:false, reason:'network', error:String(error.message||error)}; }
}
async function handleBooksGetDetails(id){
  try{ const settings=await getBooksSettings(); const details=await getBooksDetails(id); const siteLinks=getBooksSiteLinks(details, settings); return {ok:true, data:{...details, siteLinks}}; }
  catch(error){ booksLogError('handleBooksGetDetails failed', error.message); return {ok:false, error:String(error.message||error)}; }
}

async function handleBooksGetDetailsExtra(workKey, rawSubjects, wantRatings){
  try{ const extra=await getBooksDetailsExtra(workKey, rawSubjects, wantRatings); return {ok:true, data:extra}; }
  catch(error){ booksLogError('handleBooksGetDetailsExtra failed', error.message); return {ok:false, error:String(error.message||error)}; }
}

async function handleBooksGetWikidataBundle(id, title, knownWikidataId, authorName, wantSeries, wantAdaptations, wantLinks){
  try{

    if (!wantSeries && !wantAdaptations && !wantLinks) {
      return { ok:true, data: { qid:null, series:null, seriesBooks:[], adaptations:[], awards:[], links:{} } };
    }

    let qid = null;
    let resolutionStage = 'not-found';
    if (knownWikidataId && /^Q\d+$/.test(knownWikidataId)) {
      qid = knownWikidataId;
      resolutionStage = 'openlibrary-identifiers';
    } else {
      const resolutionResult = await resolveBooksWorkQid(id || '', title || '', authorName || '');
      qid = resolutionResult && resolutionResult.qid ? resolutionResult.qid : null;
      resolutionStage = (resolutionResult && resolutionResult.resolutionStage) || 'not-found';
    }
    if (qid) {
      booksLog('Wikidata QID for "' + title + '" (' + id + ') -> ' + qid + ' (found via ' + resolutionStage + ')');
    } else {
      booksLog('Wikidata QID for "' + title + '" (' + id + ') -> NOT FOUND (all stages missed)');
    }
    const bundle = await getBooksWorkWikidataBundle(qid, { wantSeries, wantAdaptations, wantLinks });
    return { ok:true, data: { qid, ...bundle } };
  }catch(error){
    booksLogError('handleBooksGetWikidataBundle failed', error.message);
    return {ok:false, error:String(error.message||error)};
  }
}

function booksBuildAuthorPhotoUrl(authorId, size='L'){
  return authorId?`https://covers.openlibrary.org/a/olid/${authorId}-${size}.jpg`:null;
}

async function getBooksAuthorCore(authorId){
  const id=booksCleanText(String(authorId||'')).toUpperCase();
  if(!/^OL\d+A$/.test(id)) throw new Error('Invalid author id');
  const authorKey=`/authors/${id}`;
  const author=await booksFetchJson(`${OPENLIBRARY_ORIGIN}${authorKey}.json`);
  const name=booksCleanText(author?.name)||id;
  const bio=booksExtractDescription(author?.bio);

  const birthDate=booksCleanText(author?.birth_date)||null;
  const deathDate=booksCleanText(author?.death_date)||null;
  const hasPhoto=Array.isArray(author?.photos)&&author.photos.length&&author.photos[0]>0;
  const photoUrl=hasPhoto?booksBuildAuthorPhotoUrl(id):null;

  const links=[
    { label:'Open Library', url:`${OPENLIBRARY_ORIGIN}${authorKey}` },
    { label:'Wikipedia', url:`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(name)}` },
    { label:'Goodreads', url:`https://www.goodreads.com/search?q=${encodeURIComponent(name)}&search_type=authors` },
    { label:'Google Books', url:`https://books.google.com/books?q=inauthor:${encodeURIComponent(name)}` },
    { label:'Amazon', url:`https://www.amazon.com/s?k=${encodeURIComponent(name)}&i=stripbooks` },
    { label:'Twitter', url:`https://twitter.com/search?q=${encodeURIComponent(name)}` }
  ];

  return { id, key:authorKey, name, bio, birthDate, deathDate, birthPlace:null, occupations:[], photoUrl, works:[], knownFor:[], awards:[], links };
}
async function handleBooksGetAuthor(authorId){
  try{ const data=await getBooksAuthorCore(authorId); return {ok:true, data}; }
  catch(error){ booksLogError('handleBooksGetAuthor failed', error.message); return {ok:false, error:String(error.message||error)}; }
}

async function getBooksAuthorExtra(authorKey, id, name, wantKnownFor, wantAwards, wantWorks, wantFacts){

  const wantQid = wantFacts || wantKnownFor || wantAwards;

  const authorQid=wantQid ? await resolveBooksAuthorWikidataQid(id) : null;

  const [worksResult, knownForResult, factsResult, awardsResult] = await Promise.allSettled([
    wantWorks ? (async()=>{
      const data=await booksFetchJson(`${OPENLIBRARY_ORIGIN}${authorKey}/works.json?limit=50`);
      const entries=Array.isArray(data?.entries)?data.entries:[];
      return entries.map(w=>({
        id: booksExtractWorkIdFromKey(w.key)||w.key,
        title: booksCleanText(w.title),
        year: w.first_publish_date?booksExtractYear(w.first_publish_date):null
      })).filter(w=>w.id&&w.title);
    })() : Promise.resolve([]),
    (authorQid && wantKnownFor) ? getBooksAuthorKnownFor(authorQid) : Promise.resolve([]),
    (authorQid && wantFacts) ? getBooksAuthorWikidataFacts(authorQid) : Promise.resolve(null),

    (authorQid && wantAwards) ? getBooksLiteraryAwards(authorQid) : Promise.resolve([])
  ]);

  let works=[];
  if(worksResult.status==='fulfilled') works=worksResult.value;
  else booksLogError('getBooksAuthorExtra: works fetch non-fatal', worksResult.reason?.message||worksResult.reason);
  works.sort((a,b)=>(b.year||0)-(a.year||0));

  const knownFor=knownForResult.status==='fulfilled'?knownForResult.value:[];
  if(knownForResult.status==='rejected') booksLogError('getBooksAuthorExtra: knownFor non-fatal', knownForResult.reason?.message||knownForResult.reason);

  const facts=factsResult.status==='fulfilled'?factsResult.value:null;
  if(factsResult.status==='rejected') booksLogError('getBooksAuthorExtra: facts non-fatal', factsResult.reason?.message||factsResult.reason);

  const birthDate=facts?.birthDate?facts.birthDate.slice(0,10):null;
  const deathDate=facts?.deathDate?facts.deathDate.slice(0,10):null;
  const birthPlace=facts?.birthPlace||null;
  const occupations=facts?.occupations||[];

  const linkUpgrades={
    wikipediaUrl: facts?.wikipediaUrl||null,
    goodreadsAuthorId: facts?.goodreadsAuthorId||null,
    twitterHandle: facts?.twitterHandle||null,
    instagramHandle: facts?.instagramHandle||null,

    officialWebsite: facts?.officialWebsite||null
  };

  const awards=awardsResult.status==='fulfilled'?awardsResult.value:[];
  if(awardsResult.status==='rejected') booksLogError('getBooksAuthorExtra: awards non-fatal', awardsResult.reason?.message||awardsResult.reason);

  return { birthDate, deathDate, birthPlace, occupations, works, knownFor, awards, linkUpgrades };
}
async function handleBooksGetAuthorExtra(authorKey, id, name, wantKnownFor, wantAwards, wantWorks, wantFacts){
  try{ const data=await getBooksAuthorExtra(authorKey, id, name, wantKnownFor, wantAwards, wantWorks, wantFacts); return {ok:true, data}; }
  catch(error){ booksLogError('handleBooksGetAuthorExtra failed', error.message); return {ok:false, error:String(error.message||error)}; }
}

const BOOKS_DEFAULT_SETTINGS={
  booksFieldSubjects:true, booksFieldDescription:true, booksFieldFirstSentence:true,
  booksFieldFirstEdition:true, booksFieldRatings:true, booksFieldCommunity:true, booksFieldSeries:true, booksFieldAdaptations:true,
  booksFieldAuthorAdaptations:true, booksFieldAuthorAwards:true,
  booksShowOpenLibraryLink:true, booksShowWikipediaLink:true, booksShowGoodreadsLink:true, booksShowGoogleBooksLink:true,
  booksShowAmazonLink:true, booksShowBarnesNobleLink:true, booksShowKoboLink:true, booksShowAudibleLink:true
};
async function getBooksSettings(){
  const s=await api.storage.local.get(BOOKS_DEFAULT_SETTINGS);
  return {
    booksFieldAuthor:true,
    booksFieldFirstPublishYear:true,
    booksFieldPages:true,
    booksFieldDescription:s.booksFieldDescription!==false,
    booksFieldFirstSentence:s.booksFieldFirstSentence!==false,
    booksFieldSubjects:s.booksFieldSubjects!==false,
    booksFieldFirstEdition:s.booksFieldFirstEdition!==false,
    booksFieldRatings:s.booksFieldRatings!==false,
    booksFieldCommunity:s.booksFieldCommunity!==false,
    booksFieldSeries:s.booksFieldSeries!==false,
    booksFieldAdaptations:s.booksFieldAdaptations!==false,
    booksFieldAuthorAdaptations:s.booksFieldAuthorAdaptations!==false,
    booksFieldAuthorAwards:s.booksFieldAuthorAwards!==false,
    booksShowOpenLibraryLink:s.booksShowOpenLibraryLink!==false,
    booksShowWikipediaLink:s.booksShowWikipediaLink!==false,
    booksShowGoodreadsLink:s.booksShowGoodreadsLink!==false,
    booksShowGoogleBooksLink:s.booksShowGoogleBooksLink!==false,
    booksShowAmazonLink:s.booksShowAmazonLink!==false,
    booksShowBarnesNobleLink:s.booksShowBarnesNobleLink!==false,
    booksShowKoboLink:s.booksShowKoboLink!==false,
    booksShowAudibleLink:s.booksShowAudibleLink!==false
  };
}

