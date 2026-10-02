/* =========================================================================
   MOUSE INTERACTION
   ========================================================================= */
svg.addEventListener('mousedown', onSvgMouseDown);
svg.addEventListener('click', onSvgClick);
svg.addEventListener('dblclick', onSvgDblClick);
document.addEventListener('mousemove', onDocMouseMove);
document.addEventListener('mouseup', onDocMouseUp);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

/* ---------------- PANNING ---------------- */
canvasScroll.addEventListener('mousedown', (ev) => {
  let shouldPan = (mode === 'pan') || spaceDown || (ev.button === 1);

  if (!shouldPan && ev.button === 0 && (mode === 'select' || mode === 'delete')) {
    const onNode = ev.target.closest && ev.target.closest('[data-node-id]');
    const onEdge = ev.target.closest && ev.target.closest('[data-edge-id]');
    const onHandle = ev.target.closest && ev.target.closest('.resize-handle');
    if (!onNode && !onEdge && !onHandle) shouldPan = true;
  }

  if (!shouldPan) return;
  ev.preventDefault();

  isPanning = true;
  panMoved = false;
  panStart = {
    x: ev.clientX,
    y: ev.clientY,
    scrollLeft: canvasScroll.scrollLeft,
    scrollTop:  canvasScroll.scrollTop
  };
  canvasScroll.classList.add('panning');
});

window.addEventListener('mousemove', (ev) => {
  if (!isPanning) return;
  const dx = ev.clientX - panStart.x;
  const dy = ev.clientY - panStart.y;
  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) panMoved = true;
  canvasScroll.scrollLeft = panStart.scrollLeft - dx;
  canvasScroll.scrollTop  = panStart.scrollTop  - dy;
});

window.addEventListener('mouseup', () => {
  if (!isPanning) return;
  isPanning = false;
  canvasScroll.classList.remove('panning');
  if (panMoved) {
    suppressNextSvgClick = true;
    setTimeout(() => { suppressNextSvgClick = false; }, 60);
  }
});

/* ---------------- WHEEL = ZOOM (snappy, centred on cursor) ---------------- */
canvasScroll.addEventListener('wheel', (ev) => {
  ev.preventDefault();

  const rect = canvasScroll.getBoundingClientRect();
  const mx = ev.clientX - rect.left;
  const my = ev.clientY - rect.top;

  const oldW = canvasW * zoom;
  const oldH = canvasH * zoom;
  const rx = (canvasScroll.scrollLeft + mx) / oldW;
  const ry = (canvasScroll.scrollTop  + my) / oldH;

  /* Smooth zoom: proportional to scroll amount, so trackpads (many tiny
     events) and mouse wheels (few big events) both feel gentle. */
  const unit = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? 100 : 1;
  const delta = Math.max(-60, Math.min(60, ev.deltaY * unit));
  zoom = Math.min(2.5, Math.max(0.5, +(zoom * Math.exp(-delta * 0.0015)).toFixed(3)));

  applyZoomUI();

  const newW = canvasW * zoom;
  const newH = canvasH * zoom;
  canvasScroll.scrollLeft = rx * newW - mx;
  canvasScroll.scrollTop  = ry * newH - my;
}, { passive: false });

/* ---------------- CANVAS RESIZE HANDLES ---------------- */
document.querySelectorAll('.resize-handle').forEach(h => {
  h.addEventListener('mousedown', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    resizeState = {
      dir: h.dataset.resize,
      startX: ev.clientX,
      startY: ev.clientY,
      startW: canvasW,
      startH: canvasH
    };
    document.body.classList.add('resizing');
    if (h.dataset.resize === 'w') document.body.style.cursor = 'ew-resize';
    else if (h.dataset.resize === 'h') document.body.style.cursor = 'ns-resize';
    else document.body.style.cursor = 'nwse-resize';
  });
});

window.addEventListener('mousemove', (ev) => {
  if (!resizeState) return;
  const dx = (ev.clientX - resizeState.startX) / zoom;
  const dy = (ev.clientY - resizeState.startY) / zoom;

  if (resizeState.dir === 'w' || resizeState.dir === 'both') {
    canvasW = Math.max(400, Math.min(4000, Math.round(resizeState.startW + dx)));
  }
  if (resizeState.dir === 'h' || resizeState.dir === 'both') {
    canvasH = Math.max(300, Math.min(3000, Math.round(resizeState.startH + dy)));
  }
  updateSizeUI();
  renderGraph();
});

window.addEventListener('mouseup', () => {
  if (!resizeState) return;
  resizeState = null;
  document.body.classList.remove('resizing');
  document.body.style.cursor = '';
});

/* ---------------- TOUCH: PINCH + 2-FINGER PAN ---------------- */
canvasScroll.addEventListener('touchstart', (ev) => {
  if (ev.touches.length === 2) {
    ev.preventDefault();
    const [t1, t2] = ev.touches;
    touchState = {
      dist: Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY),
      midX: (t1.clientX + t2.clientX) / 2,
      midY: (t1.clientY + t2.clientY) / 2,
      zoom,
      scrollLeft: canvasScroll.scrollLeft,
      scrollTop: canvasScroll.scrollTop,
      moved: false
    };
  }
}, { passive: false });

canvasScroll.addEventListener('touchmove', (ev) => {
  if (ev.touches.length === 2 && touchState) {
    ev.preventDefault();
    const [t1, t2] = ev.touches;
    const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    const midX = (t1.clientX + t2.clientX) / 2;
    const midY = (t1.clientY + t2.clientY) / 2;

    touchState.moved = true;

    const scale = dist / touchState.dist;
    let newZoom = touchState.zoom * scale;
    newZoom = Math.max(0.5, Math.min(2.5, +newZoom.toFixed(2)));

    const rect = canvasScroll.getBoundingClientRect();
    const m1x = touchState.midX - rect.left;
    const m1y = touchState.midY - rect.top;
    const m2x = midX - rect.left;
    const m2y = midY - rect.top;

    const oldW = canvasW * touchState.zoom;
    const oldH = canvasH * touchState.zoom;
    const rx = (touchState.scrollLeft + m1x) / oldW;
    const ry = (touchState.scrollTop  + m1y) / oldH;

    zoom = newZoom;
    applyZoomUI();

    const newW = canvasW * zoom;
    const newH = canvasH * zoom;
    canvasScroll.scrollLeft = rx * newW - m2x;
    canvasScroll.scrollTop  = ry * newH - m2y;
  }
}, { passive: false });

canvasScroll.addEventListener('touchend', (ev) => {
  if (ev.touches.length < 2) {
    if (touchState && touchState.moved) {
      suppressNextSvgClick = true;
      setTimeout(() => { suppressNextSvgClick = false; }, 60);
    }
    touchState = null;
  }
}, { passive: true });

/* ---------------- SVG handlers ---------------- */
function onSvgMouseDown(ev) {
  if (mode === 'pan' || spaceDown || ev.button === 1) return;
  if (ev.button !== 0) return;

  suppressClick = false;
  didDrag = false;

  const pt = getPoint(ev);
  const node = nodeAt(pt.x, pt.y);
  if (!node) return;

  if (ev.shiftKey) {
    isDrawingEdge = true;
    edgeDrawSource = node;
    mousePos = pt;
    ev.preventDefault();
    renderGraph();
    return;
  }

  if (mode === 'select' || mode === 'delete') {
    isDragging = true;
    draggingNode = node;
    dragOffset = { x: node.x - pt.x, y: node.y - pt.y };
    ev.preventDefault();
    ev.stopPropagation();
  }
}

function onDocMouseMove(ev) {
  if (!isDragging && !isDrawingEdge && !pendingEdgeFrom) return;
  const pt = getPoint(ev);

  if (isDragging && draggingNode) {
    let nx = pt.x + dragOffset.x;
    let ny = pt.y + dragOffset.y;

    /* Lower clamp only — left/top edge */
    nx = Math.max(NODE_R, nx);
    ny = Math.max(NODE_R, ny);

    /* Auto-expand the logical canvas if dragged past right / bottom */
    const margin = 120;
    if (nx > canvasW - NODE_R) {
      canvasW = Math.ceil(nx + NODE_R + margin);
      updateSizeUI();
    }
    if (ny > canvasH - NODE_R) {
      canvasH = Math.ceil(ny + NODE_R + margin);
      updateSizeUI();
    }

    if (Math.hypot(nx - draggingNode.x, ny - draggingNode.y) > 3) didDrag = true;
    draggingNode.x = nx;
    draggingNode.y = ny;
    renderGraph();
    return;
  }

  if (isDrawingEdge || pendingEdgeFrom) {
    mousePos = pt;
    renderGraph();
  }
}

function onDocMouseUp(ev) {
  if (isDragging) {
    isDragging = false;
    draggingNode = null;
    return;
  }
  if (isDrawingEdge) {
    const pt = getPoint(ev);
    const target = nodeAt(pt.x, pt.y);
    if (target && target !== edgeDrawSource) createEdge(edgeDrawSource, target);
    isDrawingEdge = false;
    edgeDrawSource = null;
    mousePos = null;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 60);
    renderGraph();
  }
}

function onSvgClick(ev) {
  if (suppressClick || didDrag || suppressNextSvgClick) {
    didDrag = false;
    return;
  }

  const pt = getPoint(ev);
  const node = nodeAt(pt.x, pt.y);
  if (node) { handleNodeClick(node); return; }

  const edgeEl = ev.target.closest ? ev.target.closest('[data-edge-id]') : null;
  if (edgeEl) { handleEdgeClick(edgeEl.dataset.edgeId); return; }

  handleCanvasClick(pt);
}

function onSvgDblClick(ev) {
  const pt = getPoint(ev);
  const node = nodeAt(pt.x, pt.y);
  if (!node) return;
  const name = prompt('Rename node:', node.id);
  if (name === null) return;
  const clean = name.trim().toUpperCase().slice(0, 6);
  if (!clean) return;
  if (graph.nodes.some(n => n.id === clean && n !== node)) {
    toast('That name is already used.'); return;
  }
  const old = node.id;
  graph.edges.forEach(e => {
    if (e.source === old) e.source = clean;
    if (e.target === old) e.target = clean;
  });
  node.id = clean;
  if (selectedNodeId === old) selectedNodeId = clean;
  if ($('startNode').value.toUpperCase() === old) $('startNode').value = clean;
  clearTraversal();
  renderGraph();
  addLog(`Renamed node ${old} → ${clean}`, 'edit');
}

function handleNodeClick(node) {
  switch (mode) {
    case 'addEdge':
      if (!pendingEdgeFrom) {
        pendingEdgeFrom = node.id;
        toast(`Edge start: ${node.id} — now click the target node`);
      } else if (pendingEdgeFrom === node.id) {
        pendingEdgeFrom = null;
        toast('Edge creation cancelled');
      } else {
        createEdge(getNode(pendingEdgeFrom), node);
        pendingEdgeFrom = null;
      }
      renderGraph();
      break;
    case 'delete':
      deleteNode(node.id);
      break;
    case 'pan':
      break;
    default:
      selectedNodeId = node.id;
      selectedEdgeId = null;
      $('startNode').value = node.id;
      renderGraph();
      break;
  }
}

function handleEdgeClick(edgeId) {
  if (mode === 'delete') deleteEdge(edgeId);
  else if (mode !== 'pan') { selectedEdgeId = edgeId; selectedNodeId = null; renderGraph(); }
}

function handleCanvasClick(pt) {
  if (mode === 'addNode') addNodeAt(pt.x, pt.y);
  else if (mode === 'addEdge') {
    if (pendingEdgeFrom) { pendingEdgeFrom = null; toast('Edge creation cancelled'); }
    renderGraph();
  } else if (mode === 'pan') {
    /* nothing */
  } else {
    selectedNodeId = null;
    selectedEdgeId = null;
    renderGraph();
  }
}

/* =========================================================================
   GRAPH EDITING
   ========================================================================= */
function addNodeAt(x, y) {
  const id = nextNodeId();
  const cx = Math.max(NODE_R, x);
  const cy = Math.max(NODE_R, y);
  graph.nodes.push({ id, x: cx, y: cy });
  clearTraversal();
  renderGraph();
  addLog(`Created node ${id}`, 'edit');
  $('startNode').value = id;
}

function createEdge(sourceNode, targetNode) {
  if (!sourceNode || !targetNode) return;
  if (sourceNode.id === targetNode.id) { toast('Self-loops are not supported.'); return; }
  const exists = graph.edges.some(e =>
    (e.source === sourceNode.id && e.target === targetNode.id) ||
    (!e.directed && e.source === targetNode.id && e.target === sourceNode.id)
  );
  if (exists) { toast(`An edge between ${sourceNode.id} and ${targetNode.id} already exists.`); return; }

  graph.edges.push(makeEdge(sourceNode.id, targetNode.id, directedMode));
  clearTraversal();
  renderGraph();
  addLog(`Created ${directedMode ? 'directed' : 'undirected'} edge ${sourceNode.id} → ${targetNode.id}`, 'edit');
}

function deleteNode(id) {
  graph.nodes = graph.nodes.filter(n => n.id !== id);
  graph.edges = graph.edges.filter(e => e.source !== id && e.target !== id);
  if (selectedNodeId === id) selectedNodeId = null;
  clearTraversal();
  renderGraph();
  addLog(`Deleted node ${id} and its edges`, 'edit');
}

function deleteEdge(id) {
  const e = graph.edges.find(x => x.id === id);
  graph.edges = graph.edges.filter(x => x.id !== id);
  if (selectedEdgeId === id) selectedEdgeId = null;
  clearTraversal();
  renderGraph();
  if (e) addLog(`Deleted edge ${e.source} → ${e.target}`, 'edit');
}

function toggleDirectedMode() {
  directedMode = !directedMode;
  $('directedModeStatus').textContent = directedMode ? 'ON' : 'OFF';
  addLog(`Directed mode ${directedMode ? 'enabled' : 'disabled'} (applies to new edges)`, 'edit');
}
