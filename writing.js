const storyDetails = {
  "story-one": {
    "genres": [
      "Romance",
      "Comedy"
    ],
    "blurb": "A reluctant beauty-pageant contestant reunites with her former best friend, bringing years of history back into the spotlight. Between brutal rehearsals, old grudges, and spectacularly bad assumptions, Sareena discovers that competing for a crown may be easier than figuring out where she stands with Radhika.",
    "headings": [
      "2026: The StairMaster Incident",
      "2016: Angel Numbers",
      "2026: Instaspiral",
      "2019: Roses are Red",
      "2026: The Vulture",
      "2020: High School Sweethearts",
      "2026: Stand Up Straight",
      "2020: What Goes on Behind Closed Doors",
      "2026: And the Winner is"
    ]
  },
  "story-two": {
    "genres": [
      "Drama",
      "Thriller"
    ],
    "blurb": "When a family cruise becomes a fight for survival, Mandy is stranded at sea with the people who know her best—and understand her least. As supplies run low and old wounds surface, the line between surviving her family and saving them begins to blur.",
    "headings": [
      "Last Boat",
      "Tulips Over Tigerlilies",
      "Teach a Man to Fish",
      "Therapy Session",
      "Catch and Release",
      "Public Execution",
      "Family Dinner",
      "Dear Diary",
      "Thicker Than Water",
      "Epilogue",
      "The Bell Was Missing"
    ]
  }
};

const writingTabs = [...document.querySelectorAll('.writing-tabs [role="tab"]')];
function selectWritingTab(tab) {
  writingTabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(item.getAttribute('aria-controls')); panel.hidden = !active;
    if(active && !reducedMotion.matches) panel.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300});
  });
  window.siteRouter?.writingTabChanged(tab);
}
writingTabs.forEach(tab => {
  tab.addEventListener('click', () => selectWritingTab(tab));
  tab.addEventListener('keydown', event => {
    if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? writingTabs[0] : event.key === 'End' ? writingTabs.at(-1) : writingTabs[(writingTabs.indexOf(tab)+(event.key==='ArrowLeft'?-1:1)+writingTabs.length)%writingTabs.length];
      selectWritingTab(next); next.focus();
    }
  });
});
const reader = document.querySelector('#story-dialog');
let currentStory = 0;
let currentChapter = 0;
let saveTimer;
let restoringPlace = false;
let renderVersion = 0;
let storageAvailable = true;
const storyCardActions = new Map();
function storyMinutes(story) {return Math.max(1,Math.ceil(story.text.trim().split(/\s+/).length/220));}
function splitStoryScenes(story) {
  const text = story.text.replace(/\r\n/g,'\n');
  const body = text.startsWith(story.title+'\n') ? text.slice(story.title.length).trimStart() : text;
  const headings = new Set(storyDetails[story.id].headings);
  const scenes = []; const preface = [];
  body.split('\n').forEach(line => {
    const content = line.trim();
    if(!content || /^_{3,}$/.test(content)) return;
    if(headings.has(content)) scenes.push({title:content,paragraphs:[]});
    else if(scenes.length) scenes.at(-1).paragraphs.push(line);
    else preface.push(line);
  });
  scenes[0].paragraphs.unshift(...preface);
  return scenes;
}
const storyScenes = stories.map(splitStoryScenes);
function storageKey(story) {return `nalini-reading-v1:${story.id}`;}
function readPlace(storyIndex) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(stories[storyIndex])) || 'null');
    if(!saved || typeof saved !== 'object') return null;
    const chapters = storyScenes[storyIndex];
    const chapter = chapters.findIndex(item => item.title === saved.chapterTitle);
    if(chapter < 0) return null;
    return {chapter,ratio:Number.isFinite(saved.ratio) ? Math.min(1,Math.max(0,saved.ratio)) : 0,completed:saved.completed === true};
  } catch {storageAvailable=false; return null;}
}
function updateCardPlace(storyIndex) {
  const elements = storyCardActions.get(storyIndex); if(!elements) return;
  const saved = readPlace(storyIndex);
  elements.action.textContent = saved?.completed ? 'Read Again →' : saved ? 'Continue Reading →' : 'Read Story →';
  elements.place.textContent = saved?.completed ? 'Finished' : saved ? `Chapter ${saved.chapter+1} of ${storyScenes[storyIndex].length}` : '';
  elements.place.hidden = !saved;
}
function savePlace({completed=false,ratio} = {}) {
  clearTimeout(saveTimer);
  const extent = reader.scrollHeight-reader.clientHeight;
  const position = ratio === undefined ? (extent > 0 ? reader.scrollTop/extent : 0) : ratio;
  try {
    localStorage.setItem(storageKey(stories[currentStory]),JSON.stringify({chapterTitle:storyScenes[currentStory][currentChapter].title,ratio:position,completed,updatedAt:Date.now()}));
    storageAvailable=true;
  } catch {storageAvailable=false;}
  updateCardPlace(currentStory);
}
function renderStory(storyIndex,chapterIndex=0,{ratio=0,focus=false}={}) {
  clearTimeout(saveTimer); renderVersion++;
  const thisVersion=renderVersion;
  currentStory=storyIndex; currentChapter=chapterIndex; restoringPlace=true;
  const story=stories[storyIndex], details=storyDetails[story.id], scenes=storyScenes[storyIndex], scene=scenes[chapterIndex];
  document.querySelector('#story-reader-title').textContent=story.title;
  document.querySelector('#story-reader-meta').textContent=`${details.genres.join(' · ')} / ${storyMinutes(story)} minute read`;
  const blurb=document.querySelector('#story-reader-blurb'); blurb.textContent=details.blurb; blurb.hidden=chapterIndex!==0;
  const heading=document.createElement('h3');heading.className='story-scene-heading';heading.tabIndex=-1;
  const bold=document.createElement('strong');bold.textContent=scene.title;heading.append(bold);
  document.querySelector('#story-reader-body').replaceChildren(heading,...scene.paragraphs.map(line=>{
    const p=document.createElement('p');p.textContent=line;if(line.trim()==='Nalini Kantheti')p.className='story-byline';return p;
  }));
  document.querySelector('#chapter-select').replaceChildren(...scenes.map((item,index)=>{
    const option=document.createElement('option');option.value=String(index);option.textContent=`${index+1}. ${item.title}`;option.selected=index===chapterIndex;return option;
  }));
  document.querySelector('#chapter-position').textContent=`Chapter ${chapterIndex+1} of ${scenes.length}`;
  const progress=document.querySelector('#chapter-progress');progress.max=scenes.length;progress.value=chapterIndex+1;
  document.querySelector('#previous-chapter').disabled=chapterIndex===0;
  document.querySelector('#next-chapter').textContent=chapterIndex===scenes.length-1 ? 'Finish Story ✓' : 'Next Chapter →';
  const restore=()=>{
    if(thisVersion!==renderVersion)return;
    reader.scrollTop=ratio*Math.max(0,reader.scrollHeight-reader.clientHeight);
    restoringPlace=false;savePlace({ratio});
    if(focus)heading.focus({preventScroll:true});
  };
  window.siteRouter?.storyChanged(storyIndex,chapterIndex);
  requestAnimationFrame(()=>requestAnimationFrame(restore));
}
function openStory(index) {
  const saved=readPlace(index);
  showDialog(reader);
  renderStory(index,saved&&!saved.completed?saved.chapter:0,{ratio:saved&&!saved.completed?saved.ratio:0});
}
const storyCards=document.querySelector('#story-cards');
stories.forEach((story,index)=>{
  const button=document.createElement('button');button.className='story-card';
  const number=document.createElement('span');number.className='eyebrow';number.textContent=`SHORT STORY / ${String(index+1).padStart(2,'0')}`;
  const title=document.createElement('h3');title.textContent=story.title;
  const details=storyDetails[story.id];
  const genres=document.createElement('p');genres.className='story-genres';genres.textContent=details.genres.join(' · ');
  const blurb=document.createElement('p');blurb.className='story-blurb';blurb.textContent=details.blurb;
  const meta=document.createElement('p');meta.className='story-reading-time';meta.textContent=`${storyMinutes(story)} minute read · ${storyScenes[index].length} chapters`;
  const place=document.createElement('p');place.className='story-saved-place';place.hidden=true;
  const action=document.createElement('span');action.className='story-action';
  button.append(number,title,genres,blurb,meta,place,action);button.addEventListener('click',()=>openStory(index));storyCards.append(button);
  storyCardActions.set(index,{action,place});updateCardPlace(index);
});
function changeChapter(index) {savePlace();renderStory(currentStory,index,{focus:true});}
document.querySelector('#previous-chapter').addEventListener('click',()=>{if(currentChapter>0)changeChapter(currentChapter-1);});
document.querySelector('#next-chapter').addEventListener('click',()=>{
  if(currentChapter<storyScenes[currentStory].length-1)changeChapter(currentChapter+1);
  else {savePlace({completed:true,ratio:1});window.siteRouter?.finishedReading('story');reader.close();}
});
document.querySelector('#chapter-select').addEventListener('change',event=>changeChapter(Number(event.target.value)));
document.querySelector('#story-restart').addEventListener('click',()=>renderStory(currentStory,0,{focus:true}));
reader.addEventListener('scroll',()=>{
  if(!reader.open||restoringPlace)return;
  clearTimeout(saveTimer);saveTimer=setTimeout(()=>savePlace(),180);
},{passive:true});
reader.querySelector('.story-close').addEventListener('click',()=>{savePlace();reader.close();});
reader.addEventListener('cancel',()=>savePlace());
reader.addEventListener('close',()=>{clearTimeout(saveTimer);document.body.classList.remove('modal-open');});
addEventListener('pagehide',()=>{if(reader.open&&!restoringPlace)savePlace();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&reader.open&&!restoringPlace)savePlace();});
addEventListener('storage',()=>stories.forEach((_,index)=>updateCardPlace(index)));
const storyExpand=document.querySelector('#story-expand');
function setExpandedReading(expanded) {
  const extent=reader.scrollHeight-reader.clientHeight;
  const ratio=extent>0?reader.scrollTop/extent:0;
  reader.classList.toggle('story-expanded',expanded);
  storyExpand.setAttribute('aria-pressed',String(expanded));
  storyExpand.setAttribute('aria-label',expanded?'Return to compact story reader':'Expand story to full screen');
  storyExpand.querySelector('span').textContent=expanded?'Exit Full Screen':'Full Screen';
  if(reader.open){restoringPlace=true;requestAnimationFrame(()=>{reader.scrollTop=ratio*Math.max(0,reader.scrollHeight-reader.clientHeight);restoringPlace=false;savePlace();});}
}
storyExpand.addEventListener('click',()=>setExpandedReading(!reader.classList.contains('story-expanded')));
reader.addEventListener('close',()=>setExpandedReading(false));
