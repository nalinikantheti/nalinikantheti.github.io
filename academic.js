// Keep the featured reading order independent of document imports and saved paper IDs.
const academicOrder = ['two-sides-of-the-same-coin','paper-five','paper-one','paper-two','paper-three','paper-four'];
academicPapers.sort((a,b)=>academicOrder.indexOf(a.id)-academicOrder.indexOf(b.id));
const academicReader = document.querySelector('#academic-dialog');
let currentPaper = 0;
let paperRestore = false;
let paperVersion = 0;
let paperSaveTimer;
let paperFinished = false;
let lastPaperRatio = 0;
const paperCards = new Map();
const academicTitle = paper => academicDetails[paper.id]?.title || paper.sourceTitle;
const academicMinutes = paper => Math.max(1,Math.ceil(paper.text.split(/\s+/).length/220));
function readPaperPlace(index) {
  try {
    const saved=JSON.parse(localStorage.getItem(`nalini-academic-v1:${academicPapers[index].id}`)||'null');
    if(!saved||!Number.isFinite(saved.ratio))return null;
    return {ratio:Math.max(0,Math.min(1,saved.ratio)),finished:saved.finished===true};
  } catch {return null;}
}
function updatePaperCard(index) {
  const card=paperCards.get(index);if(!card)return;
  const saved=readPaperPlace(index);
  card.action.textContent=saved?.finished?'Read Again →':saved?'Continue Reading →':'Read Paper →';
  card.place.hidden=!saved;
  card.place.textContent=saved?.finished?'Finished':saved?`${Math.round(saved.ratio*100)}% read`:'';
}
function paperRatio(){const extent=academicReader.scrollHeight-academicReader.clientHeight;return extent>0?Math.min(1,Math.max(0,academicReader.scrollTop/extent)):0;}
function setPaperProgress(ratio){lastPaperRatio=ratio;document.querySelector('#paper-progress').value=ratio*100;document.querySelector('#paper-progress-text').textContent=`${Math.round(ratio*100)}% read`;}
function savePaperPlace({ratio=academicReader.open?paperRatio():lastPaperRatio,finished=paperFinished}={}) {
  lastPaperRatio=ratio;
  clearTimeout(paperSaveTimer);
  try {
    localStorage.setItem(`nalini-academic-v1:${academicPapers[currentPaper].id}`,JSON.stringify({ratio,finished,updatedAt:Date.now()}));
  } catch {}
  updatePaperCard(currentPaper);
}
// Convert the imported document into a restricted reader fragment. Never execute document markup.
function academicFragment(paper) {
  const parsed=new DOMParser().parseFromString(paper.html,'text/html');
  const allowed=new Set(['P','EM','STRONG','B','I','U','S','BLOCKQUOTE','BR','HR','H1','H2','H3','H4','H5','H6','UL','OL','LI','A','IMG','TABLE','THEAD','TBODY','TFOOT','TR','TH','TD','CAPTION','SUP','SUB','SPAN','DIV','FIGURE','FIGCAPTION','MATH','MROW','MI','MN','MO','MSUP','MSUB','MFRAC','MSQRT','MTEXT','SEMANTICS','ANNOTATION']);
  const dangerous=new Set(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','FORM','INPUT','BUTTON','LINK','META']);
  const prefix=`paper-${paper.id}-`;
  function safeNode(node) {
    if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.textContent);
    if(node.nodeType!==Node.ELEMENT_NODE)return document.createDocumentFragment();
    const tag=node.tagName.toUpperCase();
    if(dangerous.has(tag))return document.createDocumentFragment();
    if(!allowed.has(tag)){const fragment=document.createDocumentFragment();node.childNodes.forEach(child=>fragment.append(safeNode(child)));return fragment;}
    const out=node.namespaceURI==='http://www.w3.org/1998/Math/MathML'?document.createElementNS(node.namespaceURI,node.localName):document.createElement(node.localName);
    const id=node.getAttribute('id');if(id&&/^[\w:.-]+$/.test(id))out.id=prefix+id;
    if(tag==='A'){
      const href=node.getAttribute('href')||'';
      if(href.startsWith('#'))out.setAttribute('href','#'+prefix+href.slice(1));
      else {try{const url=new URL(href);if(['https:','http:'].includes(url.protocol)){out.href=url.href;out.target='_blank';out.rel='noopener noreferrer';}}catch{}}
    }
    if(tag==='IMG') {
      const src=node.getAttribute('src')||'';
      if(!/^assets\/academic\/[a-z0-9-]+\/media\/[a-zA-Z0-9_.-]+$/.test(src))return document.createDocumentFragment();
      out.src=src;out.alt=node.getAttribute('alt')||'Figure from the paper';out.loading='eager';
      ['width','height'].forEach(attribute=>{const value=node.getAttribute(attribute);if(value&&/^\d+$/.test(value))out.setAttribute(attribute,value);});
    }
    if(['TH','TD'].includes(tag))['colspan','rowspan'].forEach(attribute=>{const value=node.getAttribute(attribute);if(value&&/^\d{1,2}$/.test(value))out.setAttribute(attribute,value);});
    node.childNodes.forEach(child=>out.append(safeNode(child)));
    return out;
  }
  const fragment=document.createDocumentFragment();parsed.body.childNodes.forEach(node=>fragment.append(safeNode(node)));
  // Promote actual numbered section labels and bibliography labels to readable headings.
  fragment.querySelectorAll('p').forEach(paragraph=>{
    const text=paragraph.textContent.trim();
    if((/^\d+(?:\.\d+)*\.?\s+/.test(text)&&text.length<120)||/^(Works Cited|References|Bibliography)$/i.test(text)){
      const heading=document.createElement(/^\d+\.\d+/.test(text)?'h3':'h2');heading.append(...paragraph.childNodes);paragraph.replaceWith(heading);
    }
  });
  fragment.querySelectorAll('table').forEach(table=>{const wrap=document.createElement('div');wrap.className='academic-table';table.replaceWith(wrap);wrap.append(table);});
  return fragment;
}
function openAcademic(index,{resume=true}={}) {
  if(academicReader.open&&!paperRestore)savePaperPlace();
  clearTimeout(paperSaveTimer);paperVersion++;const version=paperVersion;
  currentPaper=index;paperFinished=false;paperRestore=true;
  const paper=academicPapers[index],details=academicDetails[paper.id];
  const saved=resume?readPaperPlace(index):null;const ratio=saved&&!saved.finished?saved.ratio:0;
  document.querySelector('#paper-title').textContent=academicTitle(paper);
  document.querySelector('#paper-type').textContent=details.type;
  document.querySelector('#paper-description').textContent=details.description;
  document.querySelector('#paper-reading-time').textContent=`${academicMinutes(paper)} minute read`;
  const body=document.querySelector('#paper-body');body.replaceChildren(academicFragment(paper));
  showDialog(academicReader);academicReader.scrollTop=0;setPaperProgress(ratio);
  const restore=()=>{
    if(version!==paperVersion||!academicReader.open)return;
    academicReader.scrollTop=ratio*Math.max(0,academicReader.scrollHeight-academicReader.clientHeight);
    paperRestore=false;setPaperProgress(ratio);savePaperPlace({ratio});
  };
  const images=[...body.querySelectorAll('img')];
  const ready=Promise.all(images.map(img=>img.decode().catch(()=>{})));
  Promise.race([ready,new Promise(resolve=>setTimeout(resolve,2500))]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(restore)));
  window.siteRouter?.paperOpened(index);
}
academicPapers.forEach((paper,index)=>{
  const card=document.createElement('button');card.className='paper-card';
  const kind=document.createElement('span');kind.className='eyebrow paper-kind';kind.textContent=academicDetails[paper.id].type;
  const heading=document.createElement('h3');heading.textContent=academicTitle(paper);
  const description=document.createElement('p');description.className='paper-description';description.textContent=academicDetails[paper.id].description;
  const time=document.createElement('p');time.className='paper-time';time.textContent=`${academicMinutes(paper)} minute read`;
  const place=document.createElement('p');place.className='paper-place';place.hidden=true;
  const action=document.createElement('span');action.className='paper-action';
  card.append(kind,heading,description,time,place,action);card.addEventListener('click',()=>openAcademic(index));
  document.querySelector('#academic-cards').append(card);paperCards.set(index,{action,place});updatePaperCard(index);
});
academicReader.addEventListener('scroll',()=>{if(!academicReader.open||paperRestore)return;setPaperProgress(paperRatio());clearTimeout(paperSaveTimer);paperSaveTimer=setTimeout(()=>savePaperPlace(),180);},{passive:true});
document.querySelector('#paper-close').addEventListener('click',()=>{if(!paperRestore)savePaperPlace();academicReader.close();});
academicReader.addEventListener('cancel',()=>{if(!paperRestore)savePaperPlace();});
academicReader.addEventListener('close',()=>{if(!paperRestore)savePaperPlace({ratio:lastPaperRatio});clearTimeout(paperSaveTimer);paperVersion++;academicReader.classList.remove('paper-expanded');document.querySelector('#paper-expand').setAttribute('aria-pressed','false');document.querySelector('#paper-expand').textContent='Full Screen';document.body.classList.remove('modal-open');});
document.querySelector('#paper-finish').addEventListener('click',()=>{paperFinished=true;savePaperPlace({ratio:1,finished:true});window.siteRouter?.finishedReading('paper');academicReader.close();});
document.querySelector('#paper-expand').addEventListener('click',()=>{
  const ratio=paperRatio();paperRestore=true;
  const expanded=academicReader.classList.toggle('paper-expanded');
  document.querySelector('#paper-expand').setAttribute('aria-pressed',String(expanded));document.querySelector('#paper-expand').textContent=expanded?'Exit Full Screen':'Full Screen';
  requestAnimationFrame(()=>{academicReader.scrollTop=ratio*Math.max(0,academicReader.scrollHeight-academicReader.clientHeight);paperRestore=false;setPaperProgress(ratio);savePaperPlace({ratio});});
});
addEventListener('pagehide',()=>{if(academicReader.open&&!paperRestore)savePaperPlace();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&academicReader.open&&!paperRestore)savePaperPlace();});
addEventListener('storage',()=>academicPapers.forEach((_,index)=>updatePaperCard(index)));
document.querySelector('#paper-body').addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');if(!link)return;
  event.preventDefault();event.stopPropagation();document.getElementById(link.getAttribute('href').slice(1))?.scrollIntoView({block:'center'});
});
