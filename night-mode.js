/* Apply before first paint, and keep the choice when navigating or returning. */
(() => {
  const key = 'nalini-night-mode';
  let enabled = false;
  try { enabled = localStorage.getItem(key) === 'dark'; } catch (_) {}
  const apply = () => {
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
      enabled = !enabled;
      apply();
      try { localStorage.setItem(key, enabled ? 'dark' : 'light'); } catch (_) {}
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      enabled = event.newValue === 'dark';
      apply();
    }
  });
})();
