const writingTabs = [...document.querySelectorAll('.writing-tabs [role="tab"]')];
function selectWritingTab(tab) {
  writingTabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(item.getAttribute('aria-controls')); panel.hidden = !active;
    if(active && !reducedMotion.matches) panel.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300});
  });
}
writingTabs.forEach(tab => {
  tab.addEventListener('click', () => selectWritingTab(tab));
  tab.addEventListener('keydown', event => {
    if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? writingTabs[0] : event.key === 'End' ? writingTabs.at(-1) : writingTabs[(writingTabs.indexOf(tab)+1)%writingTabs.length];
      selectWritingTab(next); next.focus();
    }
  });
});
const reader = document.querySelector('#story-dialog');
let currentStory = 0;
function storyMinutes(story) {return Math.max(1,Math.ceil(story.text.trim().split(/\s+/).length/220));}
function renderStory(index) {
  currentStory = index;
  const story = stories[index];
  document.querySelector('#story-reader-title').textContent = story.title;
  document.querySelector('#story-reader-meta').textContent = `${storyMinutes(story)} minute read`;
  const text = story.text.replace(/\r\n/g,'\n');
  // Omit a duplicate title line only when the document starts with its exact title.
  const body = text.startsWith(story.title+'\n') ? text.slice(story.title.length).trimStart() : text;
  document.querySelector('#story-reader-body').replaceChildren(...body.split(/\n\s*\n/).map(paragraph => {
    const p = document.createElement('p'); p.textContent = paragraph; return p;
  }));
  document.querySelector('#previous-story').disabled = index === 0;
  document.querySelector('#next-story').disabled = index === stories.length-1;
  reader.scrollTop = 0;
}
const storyCards = document.querySelector('#story-cards');
stories.forEach((story,index) => {
  const button = document.createElement('button'); button.className = 'story-card';
  const number = document.createElement('span'); number.className = 'eyebrow'; number.textContent = `SHORT STORY / ${String(index+1).padStart(2,'0')}`;
  const title = document.createElement('h3'); title.textContent = story.title;
  const meta = document.createElement('p'); meta.textContent = `${storyMinutes(story)} minute read`;
  const action = document.createElement('span'); action.className = 'story-action'; action.textContent = 'Read Story →';
  button.append(number,title,meta,action);button.addEventListener('click',()=>{renderStory(index);showDialog(reader);});storyCards.append(button);
});
reader.querySelector('.story-close').addEventListener('click',()=>reader.close());
reader.addEventListener('close',()=>document.body.classList.remove('modal-open'));
document.querySelector('#previous-story').addEventListener('click',()=>{if(currentStory>0)renderStory(currentStory-1);});
document.querySelector('#next-story').addEventListener('click',()=>{if(currentStory<stories.length-1)renderStory(currentStory+1);});
