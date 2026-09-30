# Graph Algorithm Visualizer

An interactive web application for visualizing **BFS and DFS** graph traversal step by step.

## 🚀 Features

* Interactive graph editor
* Add, delete, and drag nodes
* Directed and undirected edges
* BFS and DFS visualization
* Play, pause, forward, and backward controls
* Real-time Queue (BFS) and Stack (DFS) visualization
* Step-by-step algorithm explanations
* Zoom and pan controls
* Prebuilt graph examples

## 🧠 Algorithms

| Algorithm | Time     | Space |
| --------- | -------- | ----- |
| BFS       | O(V + E) | O(V)  |
| DFS       | O(V + E) | O(V)  |

## 🛠️ Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript (ES6 Modules)
* SVG
* Font Awesome

## 📁 Structure

```text
graph-algorithm-visualizer/
├── static/
│   └── visualizer/
│       ├── css/
│       └── js/
│           ├── core/
│           ├── algorithms/
│           ├── ui/
│           └── main.js
├── templates/
│   └── visualizer/
│       └── graph.html
└── README.md
```

## ⚙️ Setup

```bash
git clone https://github.com/your-username/graph-algorithm-visualizer.git
cd graph-algorithm-visualizer
python -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

## 🎮 Usage

1. Create or load a graph.
2. Select a starting node.
3. Choose **BFS** or **DFS**.
4. Run the visualization.
5. Use playback controls to analyze each step.

## 🔮 Future Improvements

* Dijkstra's Algorithm
* A* Search
* Bellman-Ford
* Prim's and Kruskal's Algorithms
* Save/load graphs
* Backend integration
* Deployment

## 👩‍💻 Author

**Ritika Kalia**
