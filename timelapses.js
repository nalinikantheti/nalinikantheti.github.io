// One inline player keeps downloads and native controls scoped to the selected timelapse.
const featuredTimelapses=[
  {title:works.find(work=>work.id==='beetle').title,file:'beetlejuice',width:752,height:1080},
  {title:works.find(work=>work.id==='bird').title,file:'prismatic-plumage',width:1088,height:1088},
  {title:works.find(work=>work.id==='frog').title,file:'red-eyed-reverie',width:752,height:1080},
  {title:works.find(work=>work.id==='fish').title,file:'blub-therefore-i-am',width:752,height:1080},
  {title:'Tigerlily',file:'tigerlily',width:1088,height:1088}
];
let featuredTimelapseIndex=0;
const timelapseVideo=document.querySelector('#featured-timelapse');
const timelapseError=document.querySelector('#timelapse-error');
function selectTimelapse(index){
  const continuePlaying=!timelapseVideo.paused&&!timelapseVideo.ended;
  timelapseVideo.pause();
  featuredTimelapseIndex=(index+featuredTimelapses.length)%featuredTimelapses.length;
  const item=featuredTimelapses[featuredTimelapseIndex];
  timelapseError.hidden=true;
  timelapseVideo.poster=`assets/timelapses/${item.file}.jpg`;
  timelapseVideo.src=`assets/timelapses/${item.file}.mp4`;
  timelapseVideo.width=item.width;timelapseVideo.height=item.height;
  timelapseVideo.style.setProperty('--timelapse-ratio',item.width/item.height);
  timelapseVideo.setAttribute('aria-label',`${displayTitle(item.title)} — digital art timelapse`);
  document.querySelector('#living-title').textContent=displayTitle(item.title);
  document.querySelector('#art-position').textContent=`${String(featuredTimelapseIndex+1).padStart(2,'0')} / ${String(featuredTimelapses.length).padStart(2,'0')}`;
  timelapseVideo.load();
  if(continuePlaying&&currentRoute==='home'&&!document.hidden)timelapseVideo.play().catch(()=>{});
}
document.querySelectorAll('[data-art-step]').forEach(button=>button.addEventListener('click',()=>selectTimelapse(featuredTimelapseIndex+Number(button.dataset.artStep))));
timelapseVideo.addEventListener('error',()=>{timelapseError.hidden=false;});
timelapseVideo.addEventListener('loadeddata',()=>{timelapseError.hidden=true;});
document.querySelector('#timelapse-retry').addEventListener('click',()=>{timelapseError.hidden=true;timelapseVideo.load();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)timelapseVideo.pause();});
