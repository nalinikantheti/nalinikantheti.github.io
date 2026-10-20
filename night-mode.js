/* Local daylight hours; a manual choice lasts until the next 6 AM / 6 PM boundary. */
(() => {
  const key = 'nalini-theme-override';
  let override = null;
  try { override = JSON.parse(localStorage.getItem(key)); } catch (_) {}
  const nextBoundary = now => {
    const next = new Date(now);
    const hour = now.getHours();
    next.setHours(hour < 6 ? 6 : hour < 18 ? 18 : 30, 0, 0, 0);
    return next.getTime();
  };
  const isNight = now => now.getHours() < 6 || now.getHours() >= 18;
  const apply = () => {
    const now = new Date();
    if (override && (!['dark', 'light'].includes(override.theme) || !(override.until > now.getTime()))) {
      override = null;
      try { localStorage.removeItem(key); } catch (_) {}
    }
    const enabled = override ? override.theme === 'dark' : isNight(now);
    document.documentElement.dataset.theme = enabled ? 'dark' : 'light';
    const button = document.getElementById('night-mode-toggle');
    if (!button) return;
    const label = enabled ? 'Turn off night mode' : 'Turn on night mode';
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', label);
    button.title = label;
    button.querySelector('span').textContent = enabled ? 'Day' : 'Night';
  };
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.getElementById('night-mode-toggle').addEventListener('click', () => {
      const now = new Date();
      override = { theme: document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', until: nextBoundary(now) };
      try { localStorage.setItem(key, JSON.stringify(override)); } catch (_) {}
      apply();
    });
  });
  // Also update an already-open page and recheck after background suspension.
  setInterval(apply, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) apply(); });
  window.addEventListener('focus', apply);
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      try { override = JSON.parse(event.newValue); } catch (_) { override = null; }
      apply();
    }
  });
})();
