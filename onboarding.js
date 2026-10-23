
const api = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('qc-open-settings');
  if (!btn) return;
  btn.addEventListener('click', () => {
    try {
      if (api.runtime && typeof api.runtime.openOptionsPage === 'function') {
        api.runtime.openOptionsPage();
        return;
      }
    } catch (_) {  }

    try {
      const url = api.runtime.getURL('options.html');
      if (api.tabs && api.tabs.create) {
        api.tabs.create({ url });
        return;
      }
      window.open(url, '_blank');
    } catch (_) {
      window.open('options.html', '_blank');
    }
  });
});

