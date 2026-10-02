function buildDFSSteps(start) {
  const steps = [];
  const stack = [];
  const discovered = new Set();
  const order = [];
  const treeEdges = [];

  discovered.add(start);
  stack.push(start);

  steps.push(snap({
    dsItems: [...stack], visitedOrder: [], treeEdges: [],
    added: [start],
    title: 'Initialize the stack',
    lines: [
      'DFS uses a <b>Stack</b> — Last In, First Out (LIFO).',
      `Push the start node <b>${start}</b> onto the stack.`,
      `Stack (bottom → top) = [${stack.join(', ')}]`
    ],
    phase: 'init'
  }));

  while (stack.length) {
    const cur = stack.pop();
    order.push(cur);

    steps.push(snap({
      dsItems: [...stack], visitedOrder: [...order], treeEdges: [...treeEdges],
      current: cur, removed: cur,
      title: `Pop "${cur}" from the TOP`,
      lines: [
        `Remove the node at the <b>TOP</b> of the stack → <b>${cur}</b>.`,
        'Because the stack is LIFO, the <b>most recently pushed</b> node is explored first — DFS dives deep before backtracking.',
        `Stack now = [${stack.join(', ') || 'empty'}]${stack.length ? ` (top = ${stack[stack.length - 1]})` : ''}`
      ],
      phase: 'pop'
    }));

    const neighbors = [...new Set(getNeighbors(cur))].filter(n => !discovered.has(n));
    const toPush = neighbors.slice().reverse();

    toPush.forEach(n => {
      discovered.add(n);
      const e = findEdgeBetween(cur, n);
      if (e) treeEdges.push(e.id);
      stack.push(n);
    });

    steps.push(snap({
      dsItems: [...stack], visitedOrder: [...order], treeEdges: [...treeEdges],
      current: cur, added: toPush,
      title: toPush.length
        ? `Visit "${cur}" → push ${toPush.join(', ')}`
        : `Visit "${cur}" → dead end, backtrack`,
      lines: toPush.length ? [
        `Mark <b>${cur}</b> as <b>visited</b>. Visited order: ${order.join(' → ')}`,
        `Undiscovered neighbours of ${cur}: <b>${neighbors.join(', ')}</b>.`,
        'Push them onto the stack (reversed, so the first neighbour ends up on TOP).',
        `Stack = [${stack.join(', ')}] · top = ${stack[stack.length - 1]}`
      ] : [
        `Mark <b>${cur}</b> as <b>visited</b>. Visited order: ${order.join(' → ')}`,
        `All neighbours of ${cur} are already discovered — this is a <b>dead end</b>.`,
        `Backtrack: the next node is popped from the top of the stack. Stack = [${stack.join(', ') || 'empty'}]`
      ],
      phase: 'push'
    }));
  }

  steps.push(snap({
    dsItems: [], visitedOrder: [...order], treeEdges: [...treeEdges],
    title: 'DFS complete 🎉',
    lines: [
      'The stack is empty — DFS has backtracked out of every branch.',
      `DFS visit order: <b>${order.join(' → ')}</b>`,
      'The gold edges form the <b>DFS tree</b>.'
    ],
    phase: 'done'
  }));

  return steps;
}
