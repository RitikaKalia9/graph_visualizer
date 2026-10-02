function buildBFSSteps(start) {
  const steps = [];
  const queue = [];
  const discovered = new Set();
  const order = [];
  const treeEdges = [];

  discovered.add(start);
  queue.push(start);

  steps.push(snap({
    dsItems: [...queue], visitedOrder: [], treeEdges: [],
    added: [start],
    title: 'Initialize the queue',
    lines: [
      'BFS uses a <b>Queue</b> — First In, First Out (FIFO).',
      `Mark <b>${start}</b> as discovered and <b>enqueue</b> it at the REAR.`,
      `Queue = [${queue.join(', ')}] · Visited = {}`
    ],
    phase: 'init'
  }));

  while (queue.length) {
    const cur = queue.shift();
    order.push(cur);

    steps.push(snap({
      dsItems: [...queue], visitedOrder: [...order], treeEdges: [...treeEdges],
      current: cur, removed: cur,
      title: `Dequeue "${cur}" from the FRONT`,
      lines: [
        `Take the node at the <b>FRONT</b> of the queue → <b>${cur}</b>.`,
        'Because the queue is FIFO, the <b>oldest</b> discovered node is processed first — BFS spreads out layer by layer.',
        `Queue now = [${queue.join(', ') || 'empty'}]`
      ],
      phase: 'pop'
    }));

    const neighbors = [...new Set(getNeighbors(cur))];
    const newlyAdded = [];
    neighbors.forEach(n => {
      if (!discovered.has(n)) {
        discovered.add(n);
        const e = findEdgeBetween(cur, n);
        if (e) treeEdges.push(e.id);
        queue.push(n);
        newlyAdded.push(n);
      }
    });

    steps.push(snap({
      dsItems: [...queue], visitedOrder: [...order], treeEdges: [...treeEdges],
      current: cur, added: newlyAdded,
      title: newlyAdded.length
        ? `Visit "${cur}" → enqueue ${newlyAdded.join(', ')}`
        : `Visit "${cur}" → no new neighbours`,
      lines: newlyAdded.length ? [
        `Mark <b>${cur}</b> as <b>visited</b>. Visited order: ${order.join(' → ')}`,
        `Neighbours of ${cur}: ${neighbors.length ? neighbors.join(', ') : 'none'}.`,
        `Not yet discovered: <b>${newlyAdded.join(', ')}</b> → <b>enqueue</b> each at the REAR.`,
        `Queue = [${queue.join(', ')}]`
      ] : [
        `Mark <b>${cur}</b> as <b>visited</b>. Visited order: ${order.join(' → ')}`,
        `Neighbours of ${cur}: ${neighbors.length ? neighbors.join(', ') : 'none'} — all already discovered.`,
        `Nothing new to enqueue. Queue = [${queue.join(', ') || 'empty'}]`
      ],
      phase: 'push'
    }));
  }

  steps.push(snap({
    dsItems: [], visitedOrder: [...order], treeEdges: [...treeEdges],
    title: 'BFS complete 🎉',
    lines: [
      'The queue is empty → every reachable node has been processed.',
      `BFS visit order: <b>${order.join(' → ')}</b>`,
      `The gold edges form the <b>BFS tree</b> — the shortest-path tree from ${start}.`
    ],
    phase: 'done'
  }));

  return steps;
}
