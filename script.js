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
function prepareInquiry(download = false) {
  const form = document.querySelector('#inquiry-form');
  if (!form.reportValidity()) return;
  const values = Object.fromEntries(new FormData(form));
  const text = `ART / HENNA INQUIRY — NALINI K.\n\nName: ${values.name}\nEmail: ${values.email}\nRequest: ${values.type}\nIdeal date: ${values.date || 'Flexible'}\nLocation: ${values.location || 'Not specified'}\n\n${values.details}\n\nThis request has not been sent. Availability and pricing must be confirmed with the artist.`;
  if (!download) {
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:kanthetidesigns@gmail.com?subject=${encodeURIComponent(values.type + ' inquiry from ' + values.name)}&body=${encodeURIComponent(text)}`;
    emailLink.target = '_blank'; emailLink.rel = 'noopener';
    document.body.append(emailLink); emailLink.click(); emailLink.remove();
    document.querySelector('#form-status').textContent = 'Your email app will open with a draft. Please send it there to complete your inquiry. If it doesn’t open, download your request and email it to kanthetidesigns@gmail.com.';
    return;
  }
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'nalini-art-inquiry.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#form-status').textContent = 'Your request file is ready. Keep it to share with Nalini. No message has been sent.';
}
document.querySelector('#inquiry-form').addEventListener('submit', event => { event.preventDefault(); prepareInquiry(); });
document.querySelector('#download-request').addEventListener('click', () => prepareInquiry(true));
document.querySelector('#year').textContent = new Date().getFullYear();
renderGallery();
