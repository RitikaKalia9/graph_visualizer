/* =========================================================================
   PLAYER
   ========================================================================= */
function startTraversal(type) {
  const startId = $('startNode').value.trim().toUpperCase();
  if (!startId) { toast('Please enter a start node.'); return; }
  if (!getNode(startId)) {
    toast(`Node "${startId}" does not exist in the graph.`);
    addLog(`Start node "${startId}" not found.`, 'error');
    return;
  }

  player.type = type;
  player.steps = (type === 'bfs') ? buildBFSSteps(startId) : buildDFSSteps(startId);
  player.index = -1;
  player.playing = false;
  clearTimeout(player.timer);

  viz.visited.clear();
  viz.frontier.clear();
  viz.treeEdges.clear();
  viz.current = null;

  $('logOutput').innerHTML = '';
  const badge = $('algoBadge');
  badge.textContent = type.toUpperCase();
  badge.className = 'algo-badge ' + type;

  $('queueBox').classList.toggle('active', type === 'bfs');
  $('stackBox').classList.toggle('active', type === 'dfs');

  goToStep(0);
  play();
}

function goToStep(i) {
  if (!player.steps.length) return;
  i = Math.max(0, Math.min(i, player.steps.length - 1));
  player.index = i;

  const s = player.steps[i];
  viz.visited = new Set(s.visitedOrder);
  viz.frontier = new Set(s.dsItems);
  viz.current = s.current;
  viz.treeEdges = new Set(s.treeEdges);

  renderGraph();
  renderExplanation(s, i);
  renderQueuePanel(s);
  renderStackPanel(s);
  renderLog(i);
  updateButtons();
}

function play() {
  if (!player.steps.length) return;
  if (player.index >= player.steps.length - 1) goToStep(0);
  player.playing = true;
  updateButtons();
  tick();
}
function tick() {
  if (!player.playing) return;
  if (player.index >= player.steps.length - 1) {
    player.playing = false;
    updateButtons();
    return;
  }
  goToStep(player.index + 1);
  player.timer = setTimeout(tick, parseInt($('speedControl').value, 10));
}
function pause() {
  player.playing = false;
  clearTimeout(player.timer);
  updateButtons();
}
function togglePlay() {
  if (!player.steps.length) { toast('Run BFS or DFS first.'); return; }
  if (player.playing) pause(); else play();
}
function stepForward() {
  if (!player.steps.length) { toast('Run BFS or DFS first.'); return; }
  pause();
  if (player.index < player.steps.length - 1) goToStep(player.index + 1);
}
function stepBack() {
  if (!player.steps.length) { toast('Run BFS or DFS first.'); return; }
  pause();
  if (player.index > 0) goToStep(player.index - 1);
}
function updateButtons() {
  const has = player.steps.length > 0;
  $('btnPrev').disabled = !has;
  $('btnNext').disabled = !has;
  $('btnPlay').disabled = !has;
  const icon = player.playing ? 'fa-pause' : 'fa-play';
  const label = player.playing ? 'Pause' : 'Play';
  $('btnPlay').innerHTML = `<i class="fas ${icon}"></i> ${label}`;
}
