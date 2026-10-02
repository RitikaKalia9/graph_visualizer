/* =========================================================================
   KEYBOARD
   ========================================================================= */
function onKeyDown(e) {
  if (e.target.tagName === 'INPUT') return;

  if (e.code === 'Space') {
    e.preventDefault();
    if (!spaceDown) {
      spaceDown = true;
      if (mode !== 'pan') canvasScroll.classList.add('space-ready');
    }
    return;
  }

  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedNodeId) { deleteNode(selectedNodeId); e.preventDefault(); }
    else if (selectedEdgeId) { deleteEdge(selectedEdgeId); e.preventDefault(); }
  }

  if (e.key === 'Escape') {
    isDrawingEdge = false;
    isDragging = false;
    edgeDrawSource = null;
    draggingNode = null;
    pendingEdgeFrom = null;
    mousePos = null;
    selectedNodeId = null;
    selectedEdgeId = null;
    renderGraph();
  }

  if (e.key === 'ArrowRight' && player.steps.length) { e.preventDefault(); stepForward(); }
  if (e.key === 'ArrowLeft'  && player.steps.length) { e.preventDefault(); stepBack(); }

  if (e.key === '=' || e.key === '+') { e.preventDefault(); zoomIn(); }
  if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomOut(); }
  if (e.key === '0') { e.preventDefault(); fitToView(); }
}

function onKeyUp(e) {
  if (e.code === 'Space') {
    spaceDown = false;
    if (mode !== 'pan') canvasScroll.classList.remove('space-ready');
  }
}
