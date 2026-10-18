const gallery = document.querySelector('#gallery');
function renderGallery(filter = 'All') {
  const selection = works.filter(work => filter === 'All' || work.medium === filter);
  gallery.replaceChildren(...selection.map(work => {
    const button = document.createElement('button');
    button.className = 'art-card';
    button.setAttribute('aria-label', `View ${work.title}`);
    const frame = document.createElement('span'); frame.className = 'art-frame';
    const img = document.createElement('img'); img.src = work.image; img.alt = work.title; img.loading = 'lazy'; frame.append(img);
    const meta = document.createElement('span'); meta.className = 'meta';
    const medium = document.createElement('span'); medium.textContent = work.medium === 'Digital' ? 'Digital illustration' : work.medium;
    const number = document.createElement('span'); number.textContent = String(works.indexOf(work) + 1).padStart(2, '0'); meta.append(medium, number);
    const title = document.createElement('h3'); title.textContent = work.title;
    button.append(frame, meta, title); button.addEventListener('click', () => openArt(work)); return button;
  }));
  document.querySelector('#gallery-status').textContent = `${selection.length} works shown`;
}
function showDialog(dialog) { dialog.showModal(); document.body.classList.add('modal-open'); }
function openArt(work) {
  const img = document.querySelector('#art-image'); img.src = work.image; img.alt = work.title;
  document.querySelector('#art-title').textContent = work.title;
  document.querySelector('#art-medium').textContent = work.medium;
  document.querySelector('#art-description').textContent = work.description;
  const dialog = document.querySelector('#art-dialog'); dialog.setAttribute('aria-labelledby', 'art-title'); showDialog(dialog);
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  renderGallery(button.dataset.filter);
}));
document.querySelector('#opening-poem').textContent = poems[0].text;
document.querySelectorAll('[data-poem]').forEach(button => button.addEventListener('click', () => {
  const poem = poems[Number(button.dataset.poem)]; document.querySelector('#poem-title').textContent = poem.title; document.querySelector('#poem-body').textContent = poem.text;
  const dialog = document.querySelector('#poem-dialog'); dialog.setAttribute('aria-labelledby', 'poem-title'); showDialog(dialog);
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
});
document.querySelector('#inquiry-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity() || form.elements._honey.value) return;
  const button = form.querySelector('[type="submit"]');
  const status = document.querySelector('#form-status');
  button.disabled = true; button.textContent = 'Sending…'; status.textContent = '';
  try {
    const response = await fetch(form.action, {
      method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const result = await response.json();
    if (!response.ok || (result.success !== true && result.success !== 'true')) throw new Error('Submission failed');
    status.textContent = 'Your inquiry was submitted. Thank you. If you don’t hear back, email kanthetidesigns@gmail.com directly.';
    form.reset();
  } catch {
    status.textContent = 'Your inquiry could not be submitted. Your details are still here. Please try again or email kanthetidesigns@gmail.com directly.';
  } finally {
    button.disabled = false; button.textContent = 'Send inquiry ↗';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
renderGallery();
