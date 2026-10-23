

let PACKS = [ALL_TOPIC_PACKS[0]];

let activePackId = PACKS[0].id;

function applyPopupWidthFor(packId, { commit = false } = {}) {
  const width = (Number.isFinite(packFullWidth(packId)) ? packFullWidth(packId) : 468) + 32;
  document.body.style.maxWidth = `${width}px`;

  if (commit) {
    document.body.style.width = `${width}px`;

    document.body.offsetHeight;
  } else {

    document.body.style.width = '';
  }
}

const LAST_QUERY_STORAGE_KEY = 'quickcardLastToolbarQuery';
const LAST_PACK_STORAGE_KEY = 'quickcardLastToolbarPack';

let bootSettled = false;

window.onActivePackChanged = (id) => {
  if (!bootSettled) return;
  if (activePackId === id) return;
  activePackId = id;
  renderPacks();
  updatePlaceholder();

  applyPopupWidthFor(activePackId, { commit: true });
  api.storage.local.set({ [LAST_PACK_STORAGE_KEY]: activePackId }).catch(() => {});
};

const input = document.getElementById('searchInput');
const packsRow = document.getElementById('packsRow');

function renderPacks() {
  if (PACKS.length <= 1) return;

  packsRow.style.display = 'flex';
  packsRow.innerHTML = '';

  PACKS.forEach((pack) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = pack.label;
    btn.className = pack.id === activePackId ? 'active' : '';

    if (pack.icon) {
      const img = document.createElement('img');
      img.src = api.runtime.getURL(pack.icon);
      img.alt = pack.label;
      btn.appendChild(img);
    } else if (pack.emoji) {
      const span = document.createElement('span');
      span.textContent = pack.emoji;
      span.style.fontSize = '14px';
      span.style.lineHeight = '1';
      span.style.display = 'block';
      btn.appendChild(span);
    }

    btn.addEventListener('click', () => {
      activePackId = pack.id;
      renderPacks();
      updatePlaceholder();
      applyPopupWidthFor(activePackId);

      api.storage.local.set({ [LAST_PACK_STORAGE_KEY]: activePackId }).catch(() => {});

      if (QuickCardPacks[pack.id]) {
        setActivePack(pack.id);
      }
    });

    packsRow.appendChild(btn);
  });
}

function updatePlaceholder() {
  const pack = PACKS.find((p) => p.id === activePackId) || PACKS[0];
  const isImplemented = !!QuickCardPacks[pack.id];

  input.placeholder = isImplemented ? pack.placeholder : `${pack.label} - coming soon`;
  input.disabled = !isImplemented;
  document.getElementById('searchBtn').disabled = !isImplemented;
}

const suggestBox = document.getElementById('suggestBox');
let suggestDebounceTimer = null;
let activeSuggestIndex = -1;
let currentSuggestions = [];

function hideSuggestions() {
  suggestBox.classList.remove('show');
  suggestBox.innerHTML = '';
  currentSuggestions = [];
  activeSuggestIndex = -1;
}

function renderSuggestions(items) {
  currentSuggestions = items;
  activeSuggestIndex = -1;

  if (!items.length) {
    hideSuggestions();
    return;
  }

  suggestBox.innerHTML = '';
  items.forEach((text, index) => {
    const row = document.createElement('div');
    row.className = 'suggest-item';
    row.textContent = text;
    row.addEventListener('mousedown', (e) => {

      e.preventDefault();
      input.value = text;
      hideSuggestions();
      runSearch(text);
    });
    row.addEventListener('mouseenter', () => {
      activeSuggestIndex = index;
      updateActiveSuggestion();
    });
    suggestBox.appendChild(row);
  });

  suggestBox.classList.add('show');
}

function updateActiveSuggestion() {
  Array.from(suggestBox.children).forEach((el, i) => {
    el.classList.toggle('active', i === activeSuggestIndex);
  });
}

async function fetchSuggestions(query) {
  try {
    const res = await api.runtime.sendMessage({ type: 'QUICKCARD_GOOGLE_SUGGEST', query });
    if (input.value.trim() !== query) return;
    renderSuggestions((res && res.ok && res.suggestions) || []);
  } catch (e) {

    hideSuggestions();
  }
}

input.addEventListener('input', () => {
  clearTimeout(suggestDebounceTimer);
  const query = input.value.trim();

  if (!query) {
    hideSuggestions();
    return;
  }

  suggestDebounceTimer = setTimeout(() => fetchSuggestions(query), 250);
});

input.addEventListener('blur', () => {

  setTimeout(hideSuggestions, 120);
});

document.getElementById('closeBtn').addEventListener('click', () => window.close());

document.getElementById('settingsBtn').addEventListener('click', () => {
  api.runtime.openOptionsPage();
  window.close();
});

function runSearch(query) {
  if (!query || !activePack) return;

  api.storage.local.set({ [LAST_QUERY_STORAGE_KEY]: query }).catch(() => {});

  api.storage.local.set({ [LAST_PACK_STORAGE_KEY]: activePackId }).catch(() => {});

  document.body.classList.add('qc-inline-result');
  applyPopupWidthFor(activePackId, { commit: true });

  activePack.handleExternalSearch(query, 10, 10);
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' && currentSuggestions.length) {
    e.preventDefault();
    activeSuggestIndex = Math.min(activeSuggestIndex + 1, currentSuggestions.length - 1);
    updateActiveSuggestion();
    return;
  }

  if (e.key === 'ArrowUp' && currentSuggestions.length) {
    e.preventDefault();
    activeSuggestIndex = Math.max(activeSuggestIndex - 1, -1);
    updateActiveSuggestion();
    return;
  }

  if (e.key === 'Escape') {
    hideSuggestions();
    return;
  }

  if (e.key !== 'Enter') return;

  if (activeSuggestIndex >= 0 && currentSuggestions[activeSuggestIndex]) {
    const chosen = currentSuggestions[activeSuggestIndex];
    input.value = chosen;
    hideSuggestions();
    runSearch(chosen);
    return;
  }

  const query = input.value.trim();
  if (!query) return;
  hideSuggestions();
  runSearch(query);
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = input.value.trim();
  if (!query) return;
  hideSuggestions();
  runSearch(query);
});

async function boot() {
  await loadCoreSettings();
  PACKS = getEnabledTopicPacks();
  if (!PACKS.length) PACKS = [ALL_TOPIC_PACKS[0]];
  activePackId = PACKS[0].id;

  try {
    const storedPack = await api.storage.local.get(LAST_PACK_STORAGE_KEY);
    const lastPackId = storedPack && storedPack[LAST_PACK_STORAGE_KEY];

    if (lastPackId && PACKS.some((p) => p.id === lastPackId)) {
      activePackId = lastPackId;
    }
  } catch (e) {
    logError('popup boot: failed to restore last pack ->', e && e.message ? e.message : e);
  }

  renderPacks();
  updatePlaceholder();

  applyPopupWidthFor(activePackId);

  window.onQuickCardPopupClosed = () => {
    document.body.classList.remove('qc-inline-result');

    applyPopupWidthFor(activePackId);
  };

  try {
    const stored = await api.storage.local.get(LAST_QUERY_STORAGE_KEY);
    if (stored && stored[LAST_QUERY_STORAGE_KEY]) {
      input.value = stored[LAST_QUERY_STORAGE_KEY];
    }
  } catch (e) {
    logError('popup boot: failed to restore last query ->', e && e.message ? e.message : e);
  }

  injectCoreStyle();
  document.body.classList.add('qc-no-drag');
  await initMoviesPackCore();
  await initGamesPackCore();
  await initFootballPackCore();
  await initBooksPackCore();
  await initMusicPackCore();
  await initSportsPackCore();

  if (QuickCardPacks[activePackId]) {
    setActivePack(activePackId);
  }

  bootSettled = true;

  updatePlaceholder();

  applyPopupWidthFor(activePackId);

  input.focus();
  input.select();

  const flushActivePack = () => {
    try { api.storage.local.set({ [LAST_PACK_STORAGE_KEY]: activePackId }); } catch (_) {}
  };
  window.addEventListener('blur', flushActivePack);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushActivePack();
  });
}

boot();

