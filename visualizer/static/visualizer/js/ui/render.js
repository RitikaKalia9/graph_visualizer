/* =========================================================================
   RENDERING
   ========================================================================= */
function renderGraph() {
  svg.setAttribute('viewBox', `0 0 ${canvasW} ${canvasH}`);
  svg.setAttribute('width',  canvasW * zoom);
  svg.setAttribute('height', canvasH * zoom);
  svg.innerHTML = '';

  const defs = document.createElementNS(NS, 'defs');
  const mkMarker = (id, color) => {
    const marker = document.createElementNS(NS, 'marker');
    marker.setAttribute('id', id);
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    const poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('points', '0 0, 10 3.5, 0 7');
    poly.setAttribute('fill', color);
    marker.appendChild(poly);
    return marker;
  };
  defs.appendChild(mkMarker('arrowBlue', '#6ab7ff'));
  defs.appendChild(mkMarker('arrowGold', '#ffd166'));
  svg.appendChild(defs);

  const bg = document.createElementNS(NS, 'rect');
  bg.setAttribute('x', 0); bg.setAttribute('y', 0);
  bg.setAttribute('width', canvasW); bg.setAttribute('height', canvasH);
  bg.setAttribute('fill', 'transparent');
  bg.setAttribute('pointer-events', 'all');
  bg.dataset.bg = '1';
  svg.appendChild(bg);

  graph.edges.forEach(edge => {
    const s = getNode(edge.source);
    const t = getNode(edge.target);
    if (!s || !t) return;

    const dx = t.x - s.x, dy = t.y - s.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const x1 = s.x + ux * NODE_R, y1 = s.y + uy * NODE_R;
    const x2 = t.x - ux * (NODE_R + 9), y2 = t.y - uy * (NODE_R + 9);

    const isTree = viz.treeEdges.has(edge.id);
    const isSel = selectedEdgeId === edge.id;

    const hit = document.createElementNS(NS, 'line');
    hit.setAttribute('x1', x1); hit.setAttribute('y1', y1);
    hit.setAttribute('x2', x2); hit.setAttribute('y2', y2);
    hit.setAttribute('class', 'edge-hit');
    hit.dataset.edgeId = edge.id;
    svg.appendChild(hit);

    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#6ab7ff');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('class', 'edge-line' + (isTree ? ' tree' : '') + (isSel ? ' selected' : ''));
    if (edge.directed) {
      line.setAttribute('marker-end', isTree ? 'url(#arrowGold)' : 'url(#arrowBlue)');
    }
    svg.appendChild(line);
  });

  const previewSource = isDrawingEdge ? edgeDrawSource : (pendingEdgeFrom ? getNode(pendingEdgeFrom) : null);
  if (previewSource && mousePos) {
    const p = document.createElementNS(NS, 'line');
    p.setAttribute('x1', previewSource.x);
    p.setAttribute('y1', previewSource.y);
    p.setAttribute('x2', mousePos.x);
    p.setAttribute('y2', mousePos.y);
    p.setAttribute('class', 'preview-line');
    svg.appendChild(p);
  }

  graph.nodes.forEach(node => {
    let fill = '#4a7bff';
    if (viz.visited.has(node.id)) fill = '#4ecdc4';
    else if (viz.frontier.has(node.id)) fill = '#7209b7';
    if (viz.current === node.id) fill = '#ffd166';

    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', NODE_R);
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', viz.current === node.id ? '#ffb703' : '#6ab7ff');
    circle.setAttribute('stroke-width', viz.current === node.id ? '3' : '2');
    circle.setAttribute('class', 'node'
      + (viz.current === node.id ? ' current' : '')
      + (selectedNodeId === node.id ? ' selected' : ''));
    circle.dataset.nodeId = node.id;
    svg.appendChild(circle);

    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y + 6);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', viz.current === node.id ? '#1a1205' : '#ffffff');
    text.setAttribute('font-weight', '800');
    text.setAttribute('font-size', '16');
    text.setAttribute('font-family', 'Segoe UI, sans-serif');
    text.setAttribute('pointer-events', 'none');
    text.textContent = node.id;
    svg.appendChild(text);
  });
}
