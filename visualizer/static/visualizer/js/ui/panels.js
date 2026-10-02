/* =========================================================================
   PANEL RENDERING
   ========================================================================= */
function renderExplanation(s, i) {
  $('stepBadge').textContent = `Step ${i + 1} / ${player.steps.length}`;
  $('stepTitle').innerHTML = s.title;
  $('stepLines').innerHTML = s.lines.map(l => `<li>${l}</li>`).join('');

  const chips = $('visitedChips');
  if (s.visitedOrder.length) {
    chips.innerHTML = s.visitedOrder
      .map(v => `<span class="chip">${v}</span>`)
      .join('<span class="chip-arrow">→</span>');
  } else {
    chips.innerHTML = '<span class="muted">none yet</span>';
  }
  $('progressFill').style.width = ((i + 1) / player.steps.length * 100) + '%';
}

function renderQueuePanel(s) {
  const active = player.type === 'bfs';
  const out = $('queueOutput');
  const op = $('queueOp');
  out.innerHTML = '';

  if (!active) {
    out.innerHTML = '<div class="ds-empty">Only used by BFS</div>';
    op.className = 'ds-op'; op.innerHTML = '';
    return;
  }
  if (!s.dsItems.length) {
    out.innerHTML = '<div class="ds-empty">queue is empty</div>';
  } else {
    s.dsItems.forEach((id, idx) => {
      const d = document.createElement('div');
      d.className = 'ds-item';
      if (idx === 0) d.classList.add('front');
      else if (idx === s.dsItems.length - 1) d.classList.add('rear');
      if (s.added.includes(id)) d.classList.add('entering');
      d.innerHTML = `${id}<span class="ord">${idx + 1}</span>`;
      out.appendChild(d);
    });
  }
  if (s.removed) {
    op.className = 'ds-op out';
    op.innerHTML = `<i class="fas fa-arrow-left"></i> DEQUEUE "${s.removed}" from FRONT`;
  } else if (s.added.length) {
    op.className = 'ds-op in';
    op.innerHTML = `<i class="fas fa-arrow-right"></i> ENQUEUE "${s.added.join(', ')}" at REAR`;
  } else {
    op.className = 'ds-op'; op.innerHTML = '';
  }
}

function renderStackPanel(s) {
  const active = player.type === 'dfs';
  const out = $('stackOutput');
  const op = $('stackOp');
  out.innerHTML = '';

  if (!active) {
    out.innerHTML = '<div class="ds-empty">Only used by DFS</div>';
    op.className = 'ds-op'; op.innerHTML = '';
    return;
  }
  if (!s.dsItems.length) {
    out.innerHTML = '<div class="ds-empty">stack is empty</div>';
  } else {
    const total = s.dsItems.length;
    [...s.dsItems].reverse().forEach((id, idx) => {
      const d = document.createElement('div');
      d.className = 'ds-item';
      if (idx === 0) d.classList.add('top');
      if (s.added.includes(id)) d.classList.add('entering');
      d.innerHTML = `${id}<span class="ord">${total - idx}</span>`;
      out.appendChild(d);
    });
  }
  if (s.removed) {
    op.className = 'ds-op out';
    op.innerHTML = `<i class="fas fa-arrow-up"></i> POP "${s.removed}" from TOP`;
  } else if (s.added.length) {
    op.className = 'ds-op in';
    op.innerHTML = `<i class="fas fa-arrow-down"></i> PUSH "${s.added.join(', ')}" onto TOP`;
  } else {
    op.className = 'ds-op'; op.innerHTML = '';
  }
}

function renderLog(upto) {
  const log = $('logOutput');
  log.innerHTML = '';
  for (let k = 0; k <= upto; k++) {
    const s = player.steps[k];
    const div = document.createElement('div');
    div.className = 'log-entry ' + (s.phase || 'info');
    div.innerHTML = `<span class="log-num">${k + 1}</span> <b>${s.title}</b>`;
    log.appendChild(div);
  }
  log.scrollTop = log.scrollHeight;
}

function addLog(message, kind = 'edit') {
  const log = $('logOutput');
  const div = document.createElement('div');
  div.className = 'log-entry ' + kind;
  div.innerHTML = `<i class="fas fa-pen"></i> ${message}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

/* =========================================================================
   CLEAR TRAVERSAL
   ========================================================================= */
function clearTraversal() {
  pause();
  player.steps = [];
  player.index = -1;
  player.type = null;

  viz.visited.clear();
  viz.frontier.clear();
  viz.treeEdges.clear();
  viz.current = null;

  $('stepBadge').textContent = 'Step 0 / 0';
  $('algoBadge').textContent = '—';
  $('algoBadge').className = 'algo-badge';
  $('stepTitle').textContent = 'Ready';
  $('stepLines').innerHTML =
    '<li>Choose a start node, then press <b>Run BFS</b> or <b>Run DFS</b>.</li>' +
    '<li>The matching data structure (queue for BFS, stack for DFS) will light up right below.</li>' +
    '<li>Use <b>Play / Prev / Next</b> to move through the algorithm at your own pace.</li>';
  $('visitedChips').innerHTML = '<span class="muted">none yet</span>';
  $('progressFill').style.width = '0%';

  $('queueOutput').innerHTML = '<div class="ds-empty">—</div>';
  $('stackOutput').innerHTML = '<div class="ds-empty">—</div>';
  $('queueOp').className = 'ds-op'; $('queueOp').innerHTML = '';
  $('stackOp').className = 'ds-op'; $('stackOp').innerHTML = '';
  $('queueBox').classList.remove('active');
  $('stackBox').classList.remove('active');

  updateButtons();
}
