const experiencePanels = [...document.querySelectorAll('.experience-panel')];
const mediumLabels = {home:'Home',work:'Visual Art',jewelry:'Jewelry',poetry:'Poetry',henna:'Henna',music:'Music',contact:'Contact'};
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let currentRoute = 'home';
function navigateMedium(route, {focus = true, updateHistory = true} = {}) {
  if (!Object.hasOwn(mediumLabels, route)) route = 'home';
  const panel = document.querySelector(route === 'home' ? '#home' : `#panel-${route === 'jewelry' ? 'work' : route}`);
  experiencePanels.forEach(item => item.hidden = item !== panel);
  document.querySelectorAll('.experience-header [data-route]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.route === route)));
  if (route === 'work' || route === 'jewelry') {
    const filter = route === 'jewelry' ? 'Jewelry' : 'All';
    document.querySelector(`[data-filter="${filter}"]`).click();
    panel.querySelector('.panel-toolbar>span').textContent = mediumLabels[route];
  }
  currentRoute = route;
  if (updateHistory && location.hash !== `#${route}`) history.pushState({route}, '', `#${route}`);
  document.title = `${mediumLabels[route]} — Nalini Kantheti`;
  if (!reducedMotion.matches) panel.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});
  if (focus) {
    window.scrollTo({top:0,behavior:'instant'});
    const target = panel.querySelector('h1, h2') || panel;
    target.tabIndex = -1; target.focus({preventScroll:true});
  }
}
document.querySelectorAll('[data-route]').forEach(button => button.addEventListener('click', () => navigateMedium(button.dataset.route)));
const anchorRoutes = {work:'work',words:'poetry',opening:'poetry',henna:'henna',freestyle:'music',inquire:'contact',home:'home'};
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const route = anchorRoutes[link.getAttribute('href').slice(1)];
  if (route) {event.preventDefault(); navigateMedium(route);}
}));
addEventListener('popstate', () => navigateMedium(location.hash.slice(1),{updateHistory:false}));
addEventListener('hashchange', () => {if(location.hash.slice(1) !== currentRoute) navigateMedium(location.hash.slice(1),{updateHistory:false});});
navigateMedium(location.hash.slice(1) || 'home',{focus:false,updateHistory:false});
// A small, visitor-controlled exhibition. No autoplay changes while reading.
const featuredWorks = ['beetle','bird','frog','fish'].map(id => works.find(work => work.id === id));
let featuredIndex = 0;
const livingImage = document.querySelector('#living-image');
document.querySelectorAll('[data-art-step]').forEach(button => button.addEventListener('click', () => {
  featuredIndex = (featuredIndex + Number(button.dataset.artStep) + featuredWorks.length) % featuredWorks.length;
  const work = featuredWorks[featuredIndex];
  livingImage.src = work.image; livingImage.alt = work.title;
  document.querySelector('#living-title').textContent = displayTitle(work.title);
  document.querySelector('#art-position').textContent = `${String(featuredIndex+1).padStart(2,'0')} / 04`;
  if(!reducedMotion.matches) livingImage.animate([{opacity:.15,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}],{duration:550,easing:'ease-out'});
}));
document.querySelector('.featured-art').addEventListener('click', () => openArt(featuredWorks[featuredIndex]));
// Fine-pointer movement adds depth; touch and reduced-motion users keep a still layout.
if (matchMedia('(pointer:fine)').matches && !reducedMotion.matches) {
  const art = document.querySelector('.living-art');
  art.addEventListener('pointermove', event => {
    const rect = art.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    art.style.transform = `perspective(1000px) rotateY(${x*3}deg) rotateX(${-y*3}deg)`;
  });
  art.addEventListener('pointerleave', () => art.style.transform = '');
}
