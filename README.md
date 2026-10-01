# Graph Algorithm Visualizer

An interactive web application for visualizing **BFS and DFS** graph traversal step by step.

## Features

- **Interactive Graph Editor:** Add, delete, and drag nodes. Create directed or undirected edges.
- **Weighted Graphs:** Assign weights to edges and edit them by double-clicking.
- **Step-by-Step Visualization:** Play, pause, step forward, and step backward through the algorithm's execution.
- **Data Structure Synchronization:** Watch the Queue (BFS), Stack (DFS), and Priority Queue (Dijkstra) update in real time alongside the graph canvas.
- **Dynamic Explanations:** A step history panel explains *why* the algorithm makes a specific move, not just *what* it does.
- **Distance Table:** Real-time tracking of tentative distances for shortest-path algorithms.
- **Canvas Controls:** Smooth panning, zooming, and auto-expansion.

## Supported Algorithms

## 🧠 Algorithms

| Algorithm | Time     | Space |
| --------- | -------- | ----- |
| BFS       | O(V + E) | O(V)  |
| DFS       | O(V + E) | O(V)  |

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules), SVG, FontAwesome
- **Backend:** Python, Django, Django REST Framework
- **Database:** SQLite (development), PostgreSQL (production-ready)

## Architecture

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

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/graph-algorithm-visualizer.git
   cd graph-algorithm-visualizer
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv

   # Windows
   venv\Scripts\activate

   # macOS / Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

```bash
git clone https://github.com/your-username/graph-algorithm-visualizer.git
cd graph-algorithm-visualizer
python -m http.server 8000
```

Open:

## Testing

## 🎮 Usage

1. Create or load a graph.
2. Select a starting node.
3. Choose **BFS** or **DFS**.
4. Run the visualization.
5. Use playback controls to analyze each step.

## Future Improvements

* Dijkstra's Algorithm
* A* Search
* Bellman-Ford
* Prim's and Kruskal's Algorithms
* Save/load graphs
* Backend integration
* Deployment


