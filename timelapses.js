// Muted inline playback only runs while the selected timelapse is visible.
const featuredTimelapses=[
  {title:works.find(work=>work.id==='beetle').title,file:'beetlejuice',width:720,height:502},
  {title:works.find(work=>work.id==='bird').title,file:'prismatic-plumage',width:720,height:720},
  {title:works.find(work=>work.id==='frog').title,file:'red-eyed-reverie',width:502,height:720},
  {title:works.find(work=>work.id==='fish').title,file:'blub-therefore-i-am',width:720,height:502},
  {title:'Tigerlily',file:'tigerlily',width:720,height:720}
];
let featuredTimelapseIndex=0;
const timelapseVideo=document.querySelector('#featured-timelapse');
const timelapseError=document.querySelector('#timelapse-error');
const timelapseAssetVersion='fast3';
let timelapseInView=false;
let warmTimelapseTimer;
let warmTimelapseRequest;
const warmedTimelapses=new Set();
const timelapseUrl=item=>`assets/timelapses/${item.file}.mp4?v=${timelapseAssetVersion}`;
const timelapseIsVisible=()=>timelapseInView&&currentRoute==='home'&&!document.hidden;
function stopTimelapseWarmup(){clearTimeout(warmTimelapseTimer);warmTimelapseRequest?.abort();}
function playVisibleTimelapse(){
  if(timelapseIsVisible()){
    timelapseVideo.muted=true;
    timelapseVideo.play().catch(()=>{}); // Native controls remain available if a browser blocks autoplay.
  }else{timelapseVideo.pause();stopTimelapseWarmup();}
}
function warmNextTimelapse(){
  stopTimelapseWarmup();
  const connection=navigator.connection;
  if(!timelapseIsVisible()||connection?.saveData||['slow-2g','2g'].includes(connection?.effectiveType))return;
  const url=timelapseUrl(featuredTimelapses[(featuredTimelapseIndex+1)%featuredTimelapses.length]);
  if(warmedTimelapses.has(url))return;
  // Let the visible clip start before fetching one adjacent clip into the browser cache.
  warmTimelapseTimer=setTimeout(async()=>{
    if(!timelapseIsVisible())return;
    const request=new AbortController();warmTimelapseRequest=request;
    try{const response=await fetch(url,{cache:'force-cache',signal:request.signal});if(!response.ok)return;await response.arrayBuffer();warmedTimelapses.add(url);}catch{}
  },600);
}
function selectTimelapse(index){
  stopTimelapseWarmup();timelapseVideo.pause();
  featuredTimelapseIndex=(index+featuredTimelapses.length)%featuredTimelapses.length;
  const item=featuredTimelapses[featuredTimelapseIndex];
  timelapseError.hidden=true;
  timelapseVideo.poster=`assets/timelapses/${item.file}.jpg?v=${timelapseAssetVersion}`;
  timelapseVideo.src=timelapseUrl(item);
  timelapseVideo.width=item.width;timelapseVideo.height=item.height;
  timelapseVideo.style.setProperty('--timelapse-ratio',item.width/item.height);
  timelapseVideo.setAttribute('aria-label',`${displayTitle(item.title)} — digital art timelapse`);
  document.querySelector('#living-title').textContent=displayTitle(item.title);
  document.querySelector('#art-position').textContent=`${String(featuredTimelapseIndex+1).padStart(2,'0')} / ${String(featuredTimelapses.length).padStart(2,'0')}`;
  timelapseVideo.load();playVisibleTimelapse();
}
timelapseVideo.muted=true;timelapseVideo.defaultMuted=true;
document.querySelectorAll('[data-art-step]').forEach(button=>button.addEventListener('click',()=>selectTimelapse(featuredTimelapseIndex+Number(button.dataset.artStep))));
timelapseVideo.addEventListener('error',()=>{timelapseError.hidden=false;});
timelapseVideo.addEventListener('loadeddata',()=>{timelapseError.hidden=true;});
timelapseVideo.addEventListener('playing',warmNextTimelapse);
document.querySelector('#timelapse-retry').addEventListener('click',()=>{timelapseError.hidden=true;timelapseVideo.load();playVisibleTimelapse();});
document.addEventListener('visibilitychange',playVisibleTimelapse);
if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{timelapseInView=entries[0].isIntersecting&&entries[0].intersectionRatio>=0.15;playVisibleTimelapse();},{threshold:0.15}).observe(timelapseVideo);
}else{
  const checkView=()=>{const rect=timelapseVideo.getBoundingClientRect();timelapseInView=rect.bottom>0&&rect.top<innerHeight;playVisibleTimelapse();};
  addEventListener('scroll',checkView,{passive:true});addEventListener('resize',checkView);checkView();
}
