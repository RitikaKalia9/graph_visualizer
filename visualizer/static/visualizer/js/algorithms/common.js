/* =========================================================================
   STEP ENGINE (BFS / DFS)
   ========================================================================= */
function snap(o) {
  const s = Object.assign({
    dsItems: [], visitedOrder: [], treeEdges: [], current: null,
    added: [], removed: null, title: '', lines: [], phase: 'info'
  }, o);
  s.treeEdgeSet = new Set(s.treeEdges);
  return s;
}
