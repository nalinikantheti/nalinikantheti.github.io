// Hash routes are directly shareable on GitHub Pages without server rewrites.
(() => {
  const slug = text => text.normalize('NFKD').replace(/[’']/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const workSlug = work => slug(work.title);
  const legacyWorkSlugs = {'collected-charms':'charms','pearls-talismans':'pearls','a-little-garden':'garden','pink-sparkbug':'sparkbug-pink','woodland-sparkbug':'sparkbug-woodland','green-sparkbug':'sparkbug-green','checkered-sparkbug':'sparkbug-checkered'};
  const storySlug = index => slug(stories[index].title);
  const paperSlug = index => slug(academicTitle(academicPapers[index]));
  const writingTabId = subsection => subsection==='academic'?'#academic-tab':subsection==='stories'?'#stories-tab':'#poetry-tab';
  const poemSlug = index => slug(poems[index].title);
  let applying = false;
  let artPath = '';
  let poemPath = '';
  let statusTimer;
  const hash = () => location.hash.slice(1);
  function write(path,{replace=false}={}) {
    if(hash()!==path) history[replace?'replaceState':'pushState']({path},'',`#${path}`);
  }
  function title(text) {document.title=`${text} — Nalini Kantheti`;}
  function closeOtherDialogs(keep) {
    document.querySelectorAll('dialog[open]').forEach(dialog=>{
      if(dialog===keep)return;
      if(dialog===reader && !restoringPlace)savePlace();
      if(dialog===academicReader && !paperRestore)savePaperPlace();
      dialog.close();
    });
  }
  function apply({focus=true}={}) {
    if(applying)return;
    applying=true;
    try {
      const parts=hash().split('/').filter(Boolean);
      let section=parts[0]||'home';
      if(section==='poetry')section='writing';
      if(section==='jewelry')section='work';
      if(section==='art') {
        const work=works.find(item=>workSlug(item)===parts[1]||item.id===parts[1]||item.id===legacyWorkSlugs[parts[1]]);
        if(!work){write('work',{replace:true});return applyFallback('work',focus);}
        const dialog=document.querySelector('#art-dialog');closeOtherDialogs(dialog);
        navigateMedium('work',{focus,updateHistory:false,fromRouter:true});openArt(work);title(displayTitle(work.title));return;
      }
      if(section==='writing'&&parts[1]==='academic'&&parts[2]) {
        const index=academicPapers.findIndex((item,i)=>paperSlug(i)===parts[2]||item.id===parts[2]);
        if(index<0){write('writing/academic',{replace:true});return applyFallback('writing',focus,'academic');}
        closeOtherDialogs(academicReader);navigateMedium('writing',{focus,updateHistory:false,fromRouter:true});selectWritingTab(document.querySelector('#academic-tab'));openAcademic(index);title(academicTitle(academicPapers[index]));return;
      }
      if(section==='writing'&&parts[1]==='stories'&&parts[2]) {
        const index=stories.findIndex((item,i)=>storySlug(i)===parts[2]||item.id===parts[2]);
        if(index<0){write('writing/stories',{replace:true});return applyFallback('writing',focus,'stories');}
        const requested=parts[3]==='chapter'?Number(parts[4]):1;
        const chapter=Number.isInteger(requested)&&requested>=1&&requested<=storyScenes[index].length?requested-1:0;
        closeOtherDialogs(reader);navigateMedium('writing',{focus,updateHistory:false,fromRouter:true});selectWritingTab(document.querySelector('#stories-tab'));
        const saved=readPlace(index);
        const ratio=parts[3]==='chapter'&&saved?.chapter===chapter&&!saved.completed?saved.ratio:0;
        showDialog(reader);renderStory(index,chapter,{focus:false,ratio});title(`${stories[index].title} · Chapter ${chapter+1}`);return;
      }
      if(section==='writing'&&parts[1]==='poetry'&&parts[2]) {
        const index=poems.findIndex((_,i)=>poemSlug(i)===parts[2]);
        if(index<0){write('writing/poetry',{replace:true});return applyFallback('writing',focus,'poetry');}
        const dialog=document.querySelector('#poem-dialog');closeOtherDialogs(dialog);navigateMedium('writing',{focus,updateHistory:false,fromRouter:true});selectWritingTab(document.querySelector('#poetry-tab'));openPoem(index);title(displayTitle(poems[index].title));return;
      }
      if(section==='henna'&&parts[1]==='photo') {
        const photo=document.querySelectorAll('.henna-photo')[Number(parts[2])-1];
        if(photo){closeOtherDialogs(document.querySelector('#art-dialog'));navigateMedium('henna',{focus,updateHistory:false,fromRouter:true});openArt({image:photo.dataset.hennaImage,title:photo.dataset.hennaTitle,medium:'Henna / Kantheti Designs',description:''});title(photo.dataset.hennaTitle);return;}
      }
      const route=Object.hasOwn(mediumLabels,section)?section:'home';
      applyFallback(route,focus,parts[1]);
      if(route==='music'&&parts[1]) {
        const selectors={'im-so-fucking-cool':'.featured-film','freestyle-01':'.video-card:nth-child(1)','freestyle-02':'.video-card:nth-child(2)'};
        const target=document.querySelector(selectors[parts[1]]||'.featured-film');
        requestAnimationFrame(()=>{target.scrollIntoView({block:'start',behavior:'instant'});});
      }
    } finally {applying=false;}
  }
  function applyFallback(route,focus,subsection) {
    closeOtherDialogs(null);navigateMedium(route,{focus,updateHistory:false,fromRouter:true});
    if(route==='writing')selectWritingTab(document.querySelector(writingTabId(subsection)));
    if(route==='work'&&subsection){const filter=[...document.querySelectorAll('[data-filter]')].find(button=>slug(button.dataset.filter)===subsection);filter?.click();}
  }
  window.siteRouter={
    navigate(path,{focus=true,replace=false}={}) {write(path,{replace});apply({focus});},
    artFilterChanged(filter) {if(!applying)write(filter==='All'?'work':`work/${slug(filter)}`);},
    artOpened(work) {
      const known=works.find(item=>item.id===work.id);
      const photo=[...document.querySelectorAll('.henna-photo')].findIndex(item=>item.dataset.hennaImage===work.image);
      artPath=known?`art/${workSlug(known)}`:photo>=0?`henna/photo/${photo+1}`:'';
      if(!applying&&artPath){const base=known?'work':'henna';if(currentRoute!==base)navigateMedium(base,{focus:false,updateHistory:false,fromRouter:true});write(artPath);title(displayTitle(work.title));}
    },
    poemOpened(index) {poemPath=`writing/poetry/${poemSlug(index)}`;if(!applying){write(poemPath);title(displayTitle(poems[index].title));}},
    writingTabChanged(tab) {if(!applying)write('writing/'+(tab.id==='academic-tab'?'academic':tab.id==='stories-tab'?'stories':'poetry'));},
    paperOpened(index) {if(!applying){write(`writing/academic/${paperSlug(index)}`);title(academicTitle(academicPapers[index]));}},
    storyChanged(index,chapter) {if(!applying){write(`writing/stories/${storySlug(index)}/chapter/${chapter+1}`);title(`${stories[index].title} · Chapter ${chapter+1}`);}}
  };
  // A close action returns to the matching collection, without leaving a stale detail URL.
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('close',()=>{
    if(dialog.open||applying)return;
    const path=hash();
    if(dialog.id==='art-dialog'&&(path.startsWith('art/')||path.startsWith('henna/photo/'))){const base=path.startsWith('art/')?'work':'henna';const filter=document.querySelector('[data-filter].active')?.dataset.filter;write(base==='work'&&filter&&filter!=='All'?`work/${slug(filter)}`:base,{replace:true});title(mediumLabels[base]);}
    if(dialog.id==='poem-dialog'&&path.startsWith('writing/poetry/')){write('writing/poetry',{replace:true});title('Writing');}
    if(dialog.id==='academic-dialog'&&path.startsWith('writing/academic/')){write('writing/academic',{replace:true});title('Academic Writing');}
    if(dialog.id==='story-dialog'&&path.startsWith('writing/stories/')){write('writing/stories',{replace:true});title('Writing');}
    document.body.classList.toggle('modal-open',Boolean(document.querySelector('dialog[open]')));
  }));
  // Follow the same URLs on click and on a fresh browser visit.
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link||!link.getAttribute('href').includes('/'))return;
    event.preventDefault();window.siteRouter.navigate(link.getAttribute('href').slice(1));
  });
  function announce(message) {
    const status=document.querySelector('#share-status');status.textContent=message;clearTimeout(statusTimer);statusTimer=setTimeout(()=>status.textContent='',3500);
  }
  document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
    const kind=button.dataset.copy;
    const path=kind==='paper'?`writing/academic/${paperSlug(currentPaper)}`:kind==='art'?artPath:kind==='poem'?poemPath:kind==='story'?`writing/stories/${storySlug(currentStory)}`:`writing/stories/${storySlug(currentStory)}/chapter/${currentChapter+1}`;
    const url=new URL(location.href);url.search='';url.hash=path;
    try {await navigator.clipboard.writeText(url.href);const label=button.textContent;button.textContent='Link Copied ✓';setTimeout(()=>button.textContent=label,1800);announce(kind==='chapter'?'Chapter link copied':'Link copied');}
    catch {
      // Keep a selectable URL inside the modal when clipboard permission is unavailable.
      let field=button.parentElement.querySelector('.share-url');
      if(!field){field=document.createElement('input');field.className='share-url';field.readOnly=true;field.setAttribute('aria-label','Shareable link');button.after(field);}
      field.value=url.href;field.focus();field.select();announce('Select and copy the link');
    }
  }));
  // Optional direct links for each video; these do not autoplay media.
  [...document.querySelectorAll('.featured-film,.video-card')].forEach((card,index)=>{
    const path=['music/im-so-fucking-cool','music/freestyle-01','music/freestyle-02'][index];
    const button=document.createElement('button');button.type='button';button.className='copy-link video-share';button.textContent='Copy Video Link';
    button.addEventListener('click',async()=>{const url=new URL(location.href);url.search='';url.hash=path;try{await navigator.clipboard.writeText(url.href);announce('Video link copied');}catch{window.siteRouter.navigate(path);announce('Copy this page’s address to share the video');}});
    (card.querySelector('.film-info')||card).append(button);
  });
  addEventListener('popstate',()=>apply());
  addEventListener('hashchange',()=>apply());
  apply({focus:false});
})();
