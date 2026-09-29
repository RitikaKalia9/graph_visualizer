
    const svg = document.getElementById("graphCanvas");
    let nodes = [
      { id: "A", x: 300, y: 200 },
      { id: "B", x: 450, y: 150 },
      { id: "C", x: 450, y: 250 },
      { id: "D", x: 600, y: 200 }
    ];
    let edges = [
      ["A", "B"],
      ["A", "C"],
      ["B", "D"],
      ["C", "D"]
    ];
    let selectedNode = null;
    let draggingNode = null;
    let isDraggingEdge = false;
    let edgeStartNode = null;
    let highlightedEdge = null;

    // Initialize the graph
    drawGraph();

    svg.addEventListener("click", (e) => {
      if (isDraggingEdge) return;
      const rect = svg.getBoundingClientRect();
      const cursor = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      // Check if clicked on existing node
      for (let node of nodes) {
        if (distance(node, cursor) < 20) {
          selectedNode = node;
          drawGraph();
          return;
        }
      }
      
      // Create new node
      const newNodeId = String.fromCharCode(65 + nodes.length);
      nodes.push({ id: newNodeId, x: cursor.x, y: cursor.y });
      selectedNode = null;
      drawGraph();
      addLog(`Created new node: ${newNodeId}`);
    });

    svg.addEventListener("mousedown", (e) => {
      const rect = svg.getBoundingClientRect();
      const cursor = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      for (let node of nodes) {
        if (distance(node, cursor) < 20) {
          if (e.shiftKey) {
            isDraggingEdge = true;
            edgeStartNode = node;
            addLog(`Started edge from node: ${node.id}`);
          } else {
            draggingNode = node;
            selectedNode = node;
          }
          drawGraph();
          break;
        }
      }
    });

    svg.addEventListener("mousemove", (e) => {
      const rect = svg.getBoundingClientRect();
      const cursor = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // Edge drawing preview
      if (isDraggingEdge && edgeStartNode) {
        drawGraph(edgeStartNode, cursor);
        return;
      }

      // Node dragging
      if (draggingNode) {
        draggingNode.x = cursor.x;
        draggingNode.y = cursor.y;
        drawGraph();
      }
      
      // Edge hover effect
      let hoveredEdge = null;
      for (let i = 0; i < edges.length; i++) {
        const [u, v] = edges[i];
        const n1 = nodes.find(n => n.id === u);
        const n2 = nodes.find(n => n.id === v);
        if (n1 && n2 && isPointOnLine(cursor, n1, n2)) {
          hoveredEdge = i;
          break;
        }
      }
      
      if (hoveredEdge !== highlightedEdge) {
        highlightedEdge = hoveredEdge;
        drawGraph();
      }
    });

    svg.addEventListener("mouseup", (e) => {
      if (isDraggingEdge) {
        const rect = svg.getBoundingClientRect();
        const cursor = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };

        for (let node of nodes) {
          if (node !== edgeStartNode && distance(node, cursor) < 20) {
            const edgeExists = edges.some(e => 
              (e[0] === edgeStartNode.id && e[1] === node.id) || 
              (e[0] === node.id && e[1] === edgeStartNode.id)
            );
            
            if (!edgeExists) {
              edges.push([edgeStartNode.id, node.id]);
              addLog(`Created edge: ${edgeStartNode.id} → ${node.id}`);
            }
            break;
          }
        }
        
        isDraggingEdge = false;
        edgeStartNode = null;
      }

      draggingNode = null;
      drawGraph();
    });

    svg.addEventListener("dblclick", () => {
      selectedNode = null;
      drawGraph();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Delete" && selectedNode) {
        edges = edges.filter(([u, v]) => u !== selectedNode.id && v !== selectedNode.id);
        const nodeId = selectedNode.id;
        nodes = nodes.filter(n => n !== selectedNode);
        selectedNode = null;
        drawGraph();
        addLog(`Deleted node: ${nodeId}`);
      }
    });

    function distance(n1, n2) {
      return Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2);
    }
    
    function isPointOnLine(point, lineStart, lineEnd) {
      const d1 = distance(point, lineStart);
      const d2 = distance(point, lineEnd);
      const lineLength = distance(lineStart, lineEnd);
      const buffer = 5; // Sensitivity for edge hovering
      
      return d1 + d2 >= lineLength - buffer && d1 + d2 <= lineLength + buffer;
    }

    function drawGraph(edgeStart = null, cursor = null) {
      svg.innerHTML = "";

      // Draw edges
      edges.forEach(([u, v], idx) => {
        const n1 = nodes.find(n => n.id === u);
        const n2 = nodes.find(n => n.id === v);
        if (n1 && n2) {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", n1.x);
          line.setAttribute("y1", n1.y);
          line.setAttribute("x2", n2.x);
          line.setAttribute("y2", n2.y);
          line.setAttribute("stroke", "#6c757d");
          line.setAttribute("stroke-width", "2");
          line.setAttribute("class", "edge");
          
          if (idx === highlightedEdge) {
            line.setAttribute("class", "edge edge-hover");
          }
          
          svg.appendChild(line);
          
          // Edge label (weight)
          const midX = (n1.x + n2.x) / 2;
          const midY = (n1.y + n2.y) / 2;
          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", midX);
          label.setAttribute("y", midY - 8);
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("font-size", "14");
          label.setAttribute("fill", "#495057");
          label.setAttribute("class", "edge-label");
          label.textContent = "1"; // Default weight
          svg.appendChild(label);
        }
      });

      // Draw edge being created
      if (edgeStart && cursor) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", edgeStart.x);
        line.setAttribute("y1", edgeStart.y);
        line.setAttribute("x2", cursor.x);
        line.setAttribute("y2", cursor.y);
        line.setAttribute("stroke", "#f72585");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("stroke-dasharray", "5,5");
        svg.appendChild(line);
      }

      // Draw nodes
      nodes.forEach(node => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", "20");
        circle.setAttribute("class", "node");
        
        if (selectedNode === node) {
          circle.setAttribute("class", "node highlighted");
        }
        
        circle.addEventListener("mouseenter", () => {
          circle.setAttribute("class", "node node-hover");
        });
        
        circle.addEventListener("mouseleave", () => {
          if (selectedNode === node) {
            circle.setAttribute("class", "node highlighted");
          } else {
            circle.setAttribute("class", "node");
          }
        });
        
        svg.appendChild(circle);

        // Node label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", node.x);
        label.setAttribute("y", node.y + 5);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-size", "16");
        label.setAttribute("font-weight", "600");
        label.setAttribute("fill", "#fff");
        label.textContent = node.id;
        svg.appendChild(label);
      });
    }

    function runTraversal(type) {
      const start = document.getElementById("startNode").value.trim();
      const validNodes = nodes.map(n => n.id);
      
      if (!start || !validNodes.includes(start)) {
        addLog(`Error: Start node "${start}" is not valid. Valid nodes: ${validNodes.join(', ')}`, true);
        return;
      }
      
      // Clear previous outputs
      document.getElementById("logOutput").innerHTML = '';
      document.getElementById("queueOutput").innerHTML = '';
      document.getElementById("stackOutput").innerHTML = '';
      
      addLog(`Starting ${type.toUpperCase()} traversal from node: ${start}`);
      
      // Simulate traversal
      const traversalSteps = type === 'bfs' ? 
        simulateBFS(start, nodes, edges) : 
        simulateDFS(start, nodes, edges);
      
      // Animate the traversal
      animateTraversal(traversalSteps, type);
    }
    
    function simulateBFS(start, nodes, edges) {
      const steps = [];
      const visited = new Set();
      const queue = [start];
      const adjacency = createAdjacencyList(nodes, edges);
      
      visited.add(start);
      steps.push({
        current: start,
        visited: new Set(visited),
        queue: [...queue],
        stack: [],
        log: `Starting BFS from node ${start}`
      });
      
      while (queue.length > 0) {
        const current = queue.shift();
        
        steps.push({
          current,
          visited: new Set(visited),
          queue: [...queue],
          stack: [],
          log: `Processing node ${current}`
        });
        
        for (const neighbor of adjacency[current] || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
            
            steps.push({
              current,
              visited: new Set(visited),
              queue: [...queue],
              stack: [],
              log: `Discovered node ${neighbor}, adding to queue`
            });
          }
        }
      }
      
      steps.push({
        current: null,
        visited: new Set(visited),
        queue: [],
        stack: [],
        log: `BFS traversal complete! Visited nodes: ${[...visited].join(' → ')}`
      });
      
      return steps;
    }
    
    function simulateDFS(start, nodes, edges) {
      const steps = [];
      const visited = new Set();
      const stack = [start];
      const adjacency = createAdjacencyList(nodes, edges);
      
      visited.add(start);
      steps.push({
        current: start,
        visited: new Set(visited),
        queue: [],
        stack: [...stack],
        log: `Starting DFS from node ${start}`
      });
      
      while (stack.length > 0) {
        const current = stack.pop();
        
        steps.push({
          current,
          visited: new Set(visited),
          queue: [],
          stack: [...stack],
          log: `Processing node ${current}`
        });
        
        if (!adjacency[current]) continue;
        
        // To make DFS consistent, reverse neighbors so we process in alphabetical order
        const neighbors = [...adjacency[current]].reverse();
        
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            stack.push(neighbor);
            
            steps.push({
              current,
              visited: new Set(visited),
              queue: [],
              stack: [...stack],
              log: `Discovered node ${neighbor}, adding to stack`
            });
          }
        }
      }
      
      steps.push({
        current: null,
        visited: new Set(visited),
        queue: [],
        stack: [],
        log: `DFS traversal complete! Visited nodes: ${[...visited].join(' → ')}`
      });
      
      return steps;
    }
    
    function createAdjacencyList(nodes, edges) {
      const adjList = {};
      
      for (const node of nodes) {
        adjList[node.id] = [];
      }
      
      for (const [u, v] of edges) {
        if (!adjList[u]) adjList[u] = [];
        if (!adjList[v]) adjList[v] = [];
        
        adjList[u].push(v);
        adjList[v].push(u);
      }
      
      // Sort neighbors alphabetically for consistent order
      for (const node in adjList) {
        adjList[node].sort();
      }
      
      return adjList;
    }
    
    function animateTraversal(steps, type) {
  let i = 0;

  function nextStep() {
    if (i >= steps.length) {
      // Show final output
      const finalVisited = [...steps[steps.length - 1].visited];
      const outputDiv = document.getElementById("logOutput");

      const finalDiv = document.createElement("div");
      finalDiv.className = "log-entry";
      finalDiv.style.borderLeftColor = "#198754"; // green border for success
      finalDiv.innerHTML = `<i class="fas fa-check-circle"></i> Final Traversal Order: ${finalVisited.join(' → ')}`;
      outputDiv.appendChild(finalDiv);
      outputDiv.scrollTop = outputDiv.scrollHeight;
      return;
    }

    const step = steps[i];

    // Update log
    addLog(step.log);

    // Highlight current node
    drawGraph();
    if (step.current) {
      const node = nodes.find(n => n.id === step.current);
      if (node) {
        const nodeElements = document.querySelectorAll("circle");
        nodeElements.forEach(circle => {
          const cx = parseFloat(circle.getAttribute("cx"));
          const cy = parseFloat(circle.getAttribute("cy"));
          if (cx === node.x && cy === node.y) {
            circle.classList.add("highlighted");
          }
        });
      }
    }

    // Update queue/stack visualizations
    updateDataStructure("queueOutput", step.queue, "queue-item");
    updateDataStructure("stackOutput", step.stack, "stack-item");

    // Mark visited nodes
    step.visited.forEach(nodeId => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        const nodeElements = document.querySelectorAll("circle");
        nodeElements.forEach(circle => {
          const cx = parseFloat(circle.getAttribute("cx"));
          const cy = parseFloat(circle.getAttribute("cy"));
          if (cx === node.x && cy === node.y) {
            circle.classList.add("visited");
          }
        });
      }
    });

    i++;
    setTimeout(nextStep, 1200); // continue to next step
  }

  nextStep(); // start
}

    
    function updateDataStructure(containerId, items, itemClass) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      
      items.forEach(item => {
        const div = document.createElement("div");
        div.className = itemClass;
        div.textContent = item;
        container.appendChild(div);
      });
    }
    
    function addLog(message, isError = false) {
      const logOutput = document.getElementById("logOutput");
      const logEntry = document.createElement("div");
      logEntry.className = "log-entry";
      if (isError) logEntry.style.borderLeftColor = "#f72585";
      logEntry.innerHTML = `<i class="fas fa-${isError ? 'exclamation-circle' : 'arrow-right'}"></i> ${message}`;
      logOutput.appendChild(logEntry);
      logOutput.scrollTop = logOutput.scrollHeight;
    }
    
    function resetGraph() {
      nodes = [
        { id: "A", x: 300, y: 200 },
        { id: "B", x: 450, y: 150 },
        { id: "C", x: 450, y: 250 },
        { id: "D", x: 600, y: 200 }
      ];
      edges = [
        ["A", "B"],
        ["A", "C"],
        ["B", "D"],
        ["C", "D"]
      ];
      selectedNode = null;
      document.getElementById("logOutput").innerHTML = '';
      document.getElementById("queueOutput").innerHTML = '';
      document.getElementById("stackOutput").innerHTML = '';
      document.getElementById("startNode").value = "A";
      drawGraph();
      addLog("Graph has been reset to initial state");
    }
