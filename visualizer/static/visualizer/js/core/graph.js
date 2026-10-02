/* =========================================================================
   GRAPH SETUP / EXAMPLES
   ========================================================================= */
function loadDefaultGraph() {
  edgeSeq = 1;
  graph.nodes = [
    { id: 'A', x: 450, y: 80 },
    { id: 'B', x: 240, y: 210 },
    { id: 'C', x: 660, y: 210 },
    { id: 'D', x: 150, y: 360 },
    { id: 'E', x: 450, y: 360 },
    { id: 'F', x: 750, y: 360 }
  ];
  graph.edges = [
    makeEdge('A', 'B'), makeEdge('A', 'C'),
    makeEdge('B', 'D'), makeEdge('B', 'E'),
    makeEdge('C', 'E'), makeEdge('C', 'F')
  ];
}

function loadExample(type) {
  clearTraversal();
  directedMode = false;

  if (type === 'binaryTree') {
    graph.nodes = [
      { id: 'A', x: 450, y: 60 },
      { id: 'B', x: 260, y: 180 }, { id: 'C', x: 640, y: 180 },
      { id: 'D', x: 160, y: 320 }, { id: 'E', x: 360, y: 320 },
      { id: 'F', x: 540, y: 320 }, { id: 'G', x: 740, y: 320 }
    ];
    graph.edges = [
      makeEdge('A', 'B'), makeEdge('A', 'C'),
      makeEdge('B', 'D'), makeEdge('B', 'E'),
      makeEdge('C', 'F'), makeEdge('C', 'G')
    ];
    addLog('Loaded example: Binary Tree (undirected)', 'edit');
  }
  else if (type === 'directed') {
    directedMode = true;
    graph.nodes = [
      { id: 'A', x: 450, y: 70 },
      { id: 'B', x: 230, y: 200 }, { id: 'C', x: 450, y: 200 }, { id: 'D', x: 670, y: 200 },
      { id: 'E', x: 320, y: 350 }, { id: 'F', x: 580, y: 350 }
    ];
    graph.edges = [
      makeEdge('A', 'B', true), makeEdge('A', 'C', true),
      makeEdge('B', 'D', true), makeEdge('C', 'D', true),
      makeEdge('C', 'E', true), makeEdge('D', 'F', true),
      makeEdge('E', 'F', true)
    ];
    addLog('Loaded example: Directed Graph', 'edit');
  }
  else if (type === 'dag') {
    directedMode = true;
    graph.nodes = [
      { id: 'A', x: 450, y: 55 },
      { id: 'B', x: 210, y: 175 }, { id: 'C', x: 450, y: 175 }, { id: 'D', x: 690, y: 175 },
      { id: 'E', x: 300, y: 320 }, { id: 'F', x: 600, y: 320 },
      { id: 'G', x: 450, y: 450 }
    ];
    graph.edges = [
      makeEdge('A', 'B', true), makeEdge('A', 'C', true), makeEdge('A', 'D', true),
      makeEdge('B', 'E', true), makeEdge('C', 'E', true),
      makeEdge('C', 'F', true), makeEdge('D', 'F', true),
      makeEdge('E', 'G', true), makeEdge('F', 'G', true)
    ];
    addLog('Loaded example: Directed Acyclic Graph (DAG)', 'edit');
  }
  else if (type === 'multi' || type === 'dense') {
    graph.nodes = [
      { id: 'A', x: 450, y: 110 },
      { id: 'B', x: 180, y: 110 }, { id: 'C', x: 720, y: 110 },
      { id: 'D', x: 320, y: 360 }, { id: 'E', x: 580, y: 360 }
    ];
    graph.edges = [
      makeEdge('A', 'B'), makeEdge('A', 'C'), makeEdge('A', 'D'), makeEdge('A', 'E'),
      makeEdge('B', 'D'), makeEdge('B', 'E'),
      makeEdge('C', 'D'), makeEdge('C', 'E'),
      makeEdge('D', 'E')
    ];
    addLog('Loaded example: Multi-Connection Graph', 'edit');
  }

  $('directedModeStatus').textContent = directedMode ? 'ON' : 'OFF';
  renderGraph();
}

function clearGraph() {
  clearTraversal();
  edgeSeq = 1;
  graph.nodes = [];
  graph.edges = [];
  renderGraph();
  addLog('Canvas cleared — use "Add Node" mode to build a graph', 'edit');
}

function resetGraph() {
  clearTraversal();
  loadDefaultGraph();
  directedMode = false;
  $('directedModeStatus').textContent = 'OFF';
  $('startNode').value = 'A';
  renderGraph();
  addLog('Graph reset to the default example', 'edit');
}

/* =========================================================================
   HELPERS
   ========================================================================= */
const getNode = id => graph.nodes.find(n => n.id === id);

function nextNodeId() {
  const used = new Set(graph.nodes.map(n => n.id));
  for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(65 + i);
    if (!used.has(c)) return c;
  }
  let k = 1;
  while (used.has('N' + k)) k++;
  return 'N' + k;
}

function getNeighbors(id) {
  const out = [];
  graph.edges.forEach(e => {
    if (e.source === id) out.push(e.target);
    else if (!e.directed && e.target === id) out.push(e.source);
  });
  return out;
}

function findEdgeBetween(a, b) {
  return graph.edges.find(e =>
    (e.source === a && e.target === b) ||
    (!e.directed && e.source === b && e.target === a)
  );
}

function getPoint(ev) {
  const r = svg.getBoundingClientRect();
  return {
    x: (ev.clientX - r.left) / r.width  * canvasW,
    y: (ev.clientY - r.top)  / r.height * canvasH
  };
}

function nodeAt(x, y) {
  for (let i = graph.nodes.length - 1; i >= 0; i--) {
    const n = graph.nodes[i];
    if (Math.hypot(n.x - x, n.y - y) <= NODE_R + 4) return n;
  }
  return null;
}

/* Update the sliders + labels to match current canvas size */
function updateSizeUI() {
  const wSlider = $('widthSlider');
  const hSlider = $('heightSlider');
  if (canvasW > parseInt(wSlider.max)) wSlider.max = canvasW;
  if (canvasH > parseInt(hSlider.max)) hSlider.max = canvasH;
  wSlider.value = canvasW;
  hSlider.value = canvasH;
  $('widthValue').textContent = canvasW + 'px';
  $('heightValue').textContent = canvasH + 'px';
}

/* Only clamp lower bound: allows unbounded growth on right/bottom */
function clampNodes() {
  graph.nodes.forEach(n => {
    n.x = Math.max(NODE_R, n.x);
    n.y = Math.max(NODE_R, n.y);
  });
}
