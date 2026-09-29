# Graph Algorithm Visualizer & Analyzer

An interactive, full-stack web application that helps students and developers visualize graph algorithms step by step. Built with **Django**, **Vanilla JavaScript**, and **SVG**, it provides a dynamic canvas where users can build graphs, set weights, and watch algorithms execute in real time with synchronized data structure visualizations.

![Project Demo](<INSERT_YOUR_GIF_OR_SCREENSHOT_LINK_HERE>)

## 🚀 Features

- **Interactive Graph Editor:** Add, delete, and drag nodes. Create directed or undirected edges.
- **Weighted Graphs:** Assign weights to edges and edit them by double-clicking.
- **Step-by-Step Visualization:** Play, pause, step forward, and step backward through the algorithm's execution.
- **Data Structure Synchronization:** Watch the Queue (BFS), Stack (DFS), and Priority Queue (Dijkstra) update in real time alongside the graph canvas.
- **Dynamic Explanations:** A step history panel explains *why* the algorithm makes a specific move, not just *what* it does.
- **Distance Table:** Real-time tracking of tentative distances for shortest-path algorithms.
- **Canvas Controls:** Smooth panning, zooming, and auto-expansion.

## 🧠 Supported Algorithms

| Category | Algorithm | Time Complexity | Space Complexity |
|---|---|---|---|
| **Traversal** | Breadth-First Search (BFS) | O(V + E) | O(V) |
| **Traversal** | Depth-First Search (DFS) | O(V + E) | O(V) |
| **Shortest Path** | Dijkstra's Algorithm | O((V + E) log V) | O(V) |

*Upcoming: A\*, Bellman-Ford, Prim's, Kruskal's, Topological Sort*

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules), SVG, FontAwesome
- **Backend:** Python, Django, Django REST Framework
- **Database:** SQLite (development), PostgreSQL (production-ready)

## 🏗️ Architecture

The project separates UI rendering from algorithm execution logic, keeping the codebase scalable and testable.

```text
graph_visualizer/
├── visualizer/                 # Django app (backend)
│   ├── algorithms/             # Python algorithm implementations (API layer)
│   ├── models.py               # Graph, Node, and Edge database models
│   ├── views.py                # REST API endpoints
│   └── templates/              # Django HTML templates
├── static/                     # Frontend assets (served by Django)
│   └── visualizer/
│       ├── css/                # Stylesheets
│       └── js/                 # Modular JavaScript
│           ├── core/           # Graph data structures
│           ├── algorithms/     # Step-generator logic
│           ├── ui/             # SVG rendering & playback controls
│           └── main.js         # Application entry point
└── manage.py
```

## ⚙️ Installation & Setup

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

4. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Start the development server**
   ```bash
   python manage.py runserver
   ```

6. **Open the application** at `http://127.0.0.1:8000/`

## 🎮 How to Use

1. **Build a graph:** Use the *Add Node* and *Add Edge* tools, or load a pre-built example (Binary Tree, DAG, Weighted Demo).
2. **Set weights:** Toggle *Weighted mode* to assign costs to edges. Double-click any edge to change its weight later.
3. **Run an algorithm:** Enter a start node (and a target node for Dijkstra), then click **Run BFS**, **Run DFS**, or **Run Dijkstra**.
4. **Analyze:** Use the Play/Pause and Step buttons to watch the algorithm progress. The right panel shows the active data structure and a step-by-step explanation of the logic.

## 🧪 Testing

Run the backend test suite:

```bash
python manage.py test
```

## 🔮 Future Improvements

- [ ] Implement A\* Search and Bellman-Ford
- [ ] Add Minimum Spanning Tree algorithms (Prim's and Kruskal's)
- [ ] User authentication to save and load custom graphs
- [ ] Algorithm comparison dashboard (e.g., Dijkstra vs. A\*)
- [ ] Deploy to production (Render/Railway + Vercel)

## 👩‍💻 Author

**[Your Name]**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)
