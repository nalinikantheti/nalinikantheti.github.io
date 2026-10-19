const experiencePanels = [...document.querySelectorAll('.experience-panel')];
const mediumLabels = {home:'Home',work:'Visual Art',writing:'Writing',henna:'Henna',music:'Music',contact:'Contact',bookshelf:'Favorite Books',resume:'Academic Résumé'};
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let currentRoute = 'home';
function navigateMedium(route, {focus = true, updateHistory = true, fromRouter = false} = {}) {
  if (window.siteRouter && !fromRouter) return window.siteRouter.navigate(route,{focus});
  if (route === 'poetry') route = 'writing';
  if (route === 'jewelry') route = 'work';
  if (!Object.hasOwn(mediumLabels, route)) route = 'home';
  const panel = document.querySelector(route === 'home' ? '#home' : `#panel-${route}`);
  experiencePanels.forEach(item => item.hidden = item !== panel);
  document.querySelectorAll('.experience-header [data-route]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.route === (route==='bookshelf'?'home':route==='resume'?'contact':route))));
  if (route === 'work') {
    const filter = 'All';
    document.querySelector(`[data-filter="${filter}"]`).click();
    panel.querySelector('.panel-toolbar>span').textContent = mediumLabels[route];
  }
  if (route !== 'music') document.querySelectorAll('.video-frame video').forEach(video => video.pause());
  if (route !== 'home') document.querySelector('#featured-timelapse')?.pause();
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
const anchorRoutes = {work:'work',words:'writing',opening:'writing',henna:'henna',freestyle:'music',inquire:'contact',home:'home',resume:'resume'};
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const route = anchorRoutes[link.getAttribute('href').slice(1)];
  if (route) {event.preventDefault(); navigateMedium(route);}
}));
