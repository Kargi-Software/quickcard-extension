

let pendingDisambiguation = null;

function clearPendingDisambiguation() {
  pendingDisambiguation = null;
}

function buildDisambiguationHtml(items) {
  const rows = items.map((item, index) => {

    const alreadyResolved = item.image && String(item.image).startsWith('data:');
    const imgHtml = item.image
      ? `<img src="${alreadyResolved ? escapeHtml(item.image) : 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}" alt="${escapeHtml(item.name)}" referrerpolicy="no-referrer" data-pick-thumb-index="${index}">`
      : '';

    const subHtml = (item.subParts && item.subParts.length)
      ? `<div class="pick-sub">${escapeHtml(item.subParts.join(' · '))}</div>`
      : '';

    return `
      <button class="qc-pick-btn" data-index="${index}">
        ${imgHtml}
        <div class="pick-text">
          <div class="pick-title">${escapeHtml(item.name)}</div>
          ${subHtml}
        </div>
      </button>
    `;
  }).join('');

  return `<div class="pick-heading">Multiple matches found - pick one:</div>${rows}`;
}

function showDisambiguationPicker(candidates, describeFn, onPick, prefixHtml = '') {
  const items = candidates.map(describeFn);

  pendingDisambiguation = { candidates, onPick };

  updateSelectionPopup(`${prefixHtml}${buildDisambiguationHtml(items)}`, false);

  items.forEach((item, index) => {
    if (!item.image || String(item.image).startsWith('data:')) return;
    resolveImageUrl(item.image, (resolved) => {
      if (!pendingDisambiguation || pendingDisambiguation.candidates !== candidates) return;
      if (!resolved || !selectionPopupEl || !selectionPopupEl.isConnected) return;
      const img = selectionPopupEl.querySelector(`img[data-pick-thumb-index="${index}"]`);
      if (img) img.src = resolved;
    });
  });
}

function handleDisambiguationPick(index) {
  if (!pendingDisambiguation) return;
  if (!Number.isInteger(index) || !pendingDisambiguation.candidates[index]) return;

  const chosen = pendingDisambiguation.candidates[index];
  const onPick = pendingDisambiguation.onPick;
  pendingDisambiguation = null;
  onPick(chosen);
}

