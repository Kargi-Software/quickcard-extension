(function () {
  'use strict';

  function centeredPosition() {
    return {
      left: Math.max(16, Math.round(window.innerWidth / 2 - 150)),
      top: Math.max(16, Math.round(window.innerHeight / 2 - 80))
    };
  }

  api.runtime.onMessage.addListener((message) => {
    if (!message || !message.type) return;

    if (message.type === 'QUICKCARD_CONTEXT_SEARCH') {
      if (!coreSettings.featureContextMenuSearch) return;

      const pack = QuickCardPacks[message.packId];
      if (!pack || !pack.isAllowedOnThisSite()) return;

      const pos = centeredPosition();
      pack.handleExternalSearch(message.query, pos.left, pos.top);
    }
  });

  async function boot() {
    try {
      await loadCoreSettings();

      injectCoreStyle();
      initPopupDragging();

      await initMoviesPack();
      await initGamesPack();
      await initFootballPack();
      await initBooksPack();
      await initMusicPack();
      await initSportsPack();
    } catch (e) {
      logError('boot: initialization failed ->', e && e.message ? e.message : e);
    }
  }

  boot();
})();

