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
  const details = storyDetails[story.id];
  document.querySelector('#story-reader-meta').textContent = `${details.genres.join(' · ')} / ${storyMinutes(story)} minute read`;
  document.querySelector('#story-reader-blurb').textContent = details.blurb;
  const text = story.text.replace(/\r\n/g,'\n');
  // Omit a duplicate title line only when the document starts with its exact title.
  const body = text.startsWith(story.title+'\n') ? text.slice(story.title.length).trimStart() : text;
  const headings = new Set(details.headings);
  const blocks = body.split('\n').filter(line => line.trim()).map(line => {
    const content = line.trim();
    if (/^_{3,}$/.test(content)) {
      const divider = document.createElement('hr'); divider.className = 'story-scene-divider'; return divider;
    }
    if (headings.has(content)) {
      const heading = document.createElement('h3'); heading.className = 'story-scene-heading';
      const bold = document.createElement('strong'); bold.textContent = content; heading.append(bold); return heading;
    }
    const paragraph = document.createElement('p'); paragraph.textContent = line;
    if (content === 'Nalini Kantheti') paragraph.className = 'story-byline';
    return paragraph;
  });
  document.querySelector('#story-reader-body').replaceChildren(...blocks);
  document.querySelector('#previous-story').disabled = index === 0;
  document.querySelector('#next-story').disabled = index === stories.length-1;
  reader.scrollTop = 0;
}
const storyCards = document.querySelector('#story-cards');
stories.forEach((story,index) => {
  const button = document.createElement('button'); button.className = 'story-card';
  const number = document.createElement('span'); number.className = 'eyebrow'; number.textContent = `SHORT STORY / ${String(index+1).padStart(2,'0')}`;
  const title = document.createElement('h3'); title.textContent = story.title;
  const details = storyDetails[story.id];
  const genres = document.createElement('p'); genres.className = 'story-genres'; genres.textContent = details.genres.join(' · ');
  const blurb = document.createElement('p'); blurb.className = 'story-blurb'; blurb.textContent = details.blurb;
  const meta = document.createElement('p'); meta.className = 'story-reading-time'; meta.textContent = `${storyMinutes(story)} minute read`;
  const action = document.createElement('span'); action.className = 'story-action'; action.textContent = 'Read Story →';
  button.append(number,title,genres,blurb,meta,action);button.addEventListener('click',()=>{renderStory(index);showDialog(reader);});storyCards.append(button);
});
reader.querySelector('.story-close').addEventListener('click',()=>reader.close());
reader.addEventListener('close',()=>document.body.classList.remove('modal-open'));
document.querySelector('#previous-story').addEventListener('click',()=>{if(currentStory>0)renderStory(currentStory-1);});
document.querySelector('#next-story').addEventListener('click',()=>{if(currentStory<stories.length-1)renderStory(currentStory+1);});

const storyExpand = document.querySelector('#story-expand');
function setExpandedReading(expanded) {
  reader.classList.toggle('story-expanded', expanded);
  storyExpand.setAttribute('aria-pressed', String(expanded));
  storyExpand.setAttribute('aria-label', expanded ? 'Return to compact story reader' : 'Expand story to full screen');
  storyExpand.querySelector('span').textContent = expanded ? 'Exit Full Screen' : 'Full Screen';
}
storyExpand.addEventListener('click', () => setExpandedReading(!reader.classList.contains('story-expanded')));
reader.addEventListener('close', () => setExpandedReading(false));
