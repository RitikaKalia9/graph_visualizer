/* =========================================================================
   MODE BUTTONS
   ========================================================================= */
const MODE_HINTS = {
  select: 'Click a node to select it & set it as the start node · Drag nodes to reposition (canvas auto-expands) · Drag empty space to pan the view · Shift+drag between two nodes to connect them · Double-click a node to rename it',
  addNode: 'Click anywhere on the empty canvas to create a new node. New nodes are added to the existing graph.',
  addEdge: 'Click the SOURCE node, then click the TARGET node. (Shift+drag also works.)',
  delete: 'Click a node or an edge to delete it.',
  pan: 'Drag anywhere to move the canvas around. Wheel to zoom. Great for large graphs.'
};

function applyModeUI() {
  document.querySelectorAll('.mode-btn[data-mode]').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  canvasScroll.classList.toggle('pan-mode', mode === 'pan');
  $('hintBar').innerHTML = '<i class="fas fa-circle-info"></i> ' + MODE_HINTS[mode];
}

document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    pendingEdgeFrom = null;
    applyModeUI();
    renderGraph();
  });
});

/* =========================================================================
   CANVAS SIZE + ZOOM CONTROLS
   ========================================================================= */
$('widthSlider').addEventListener('input', function () {
  canvasW = parseInt(this.value, 10);
  $('widthValue').textContent = canvasW + 'px';
  renderGraph();
});

$('heightSlider').addEventListener('input', function () {
  canvasH = parseInt(this.value, 10);
  $('heightValue').textContent = canvasH + 'px';
  renderGraph();
});

$('zoomSlider').addEventListener('input', function () {
  zoom = parseInt(this.value, 10) / 100;
  applyZoomUI();
});

function zoomIn()  { zoom = Math.min(2.5, +(zoom + 0.1).toFixed(2)); applyZoomUI(); }
function zoomOut() { zoom = Math.max(0.5, +(zoom - 0.1).toFixed(2)); applyZoomUI(); }

/* Resets zoom to 100% but keeps the canvas / graph as-is */
function resetView() {
  zoom = 1;
  applyZoomUI();
  toast('Zoom reset to 100%');
}

/* Fit the whole graph into the viewport */
function fitToView() {
  if (!graph.nodes.length) { resetView(); return; }
  let maxX = 400, maxY = 300, minX = Infinity, minY = Infinity;
  graph.nodes.forEach(n => {
    maxX = Math.max(maxX, n.x + NODE_R + 80);
    maxY = Math.max(maxY, n.y + NODE_R + 80);
    minX = Math.min(minX, n.x - NODE_R - 80);
    minY = Math.min(minY, n.y - NODE_R - 80);
  });
  canvasW = Math.max(400, Math.ceil(maxX - Math.min(0, minX)));
  canvasH = Math.max(300, Math.ceil(maxY - Math.min(0, minY)));
  updateSizeUI();
  zoom = 1;
  applyZoomUI();
  canvasScroll.scrollLeft = 0;
  canvasScroll.scrollTop  = 0;
  toast('Fitted graph to view');
}

function applyZoomUI() {
  const pct = Math.round(zoom * 100);
  $('zoomSlider').value = pct;
  $('zoomValue').textContent = pct + '%';
  $('zoomDisplay').textContent = pct + '%';
  renderGraph();
}

$('speedControl').addEventListener('input', function () {
  $('speedValue').textContent = this.value + 'ms';
});
