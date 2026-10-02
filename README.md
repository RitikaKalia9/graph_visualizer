# Graph Algorithm Visualizer

An interactive web application for visualizing **BFS and DFS graph traversal algorithms step by step**.

The visualizer allows users to create and modify graphs, run traversal algorithms, and understand each step through synchronized visualizations and explanations.

## Features

* **Interactive Graph Editor**

  * Add, delete, and drag nodes.
  * Create directed or undirected edges.
  * Edit graph structure interactively.

* **Weighted Graph Support**

  * Assign weights to edges.
  * Edit edge weights by double-clicking.

* **Step-by-Step Visualization**

  * Play and pause algorithm execution.
  * Move forward and backward through individual steps.
  * Observe the traversal directly on the graph.

* **Data Structure Visualization**

  * View the **Queue** used by BFS.
  * View the **Stack** used by DFS.
  * Track data structure changes as the algorithm executes.

* **Dynamic Explanations**

  * Step history explains **why** each algorithmic action occurs, not just what happens.

* **Graph Canvas Controls**

  * Pan across the graph.
  * Zoom in and out.
  * Automatically expand the canvas when required.

## Algorithms

| Algorithm | Time Complexity | Space Complexity |
| --------- | --------------- | ---------------- |
| BFS       | O(V + E)        | O(V)             |
| DFS       | O(V + E)        | O(V)             |

Where:

* `V` = Number of vertices
* `E` = Number of edges

## Tech Stack

* **Frontend:** HTML5, CSS3, vanilla JavaScript, SVG, Font Awesome (CDN)
* **Backend:** Python + Django (only serves the page and static files; all algorithm logic runs in the browser)

## Project Structure

```text
graph_visualizer/
├── manage.py
├── requirements.txt
├── pyproject.toml               # Vercel entrypoint
├── README.md
├── graph_visualizer/            # Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── visualizer/                  # Django app
    ├── views.py
    ├── urls.py
    ├── templates/visualizer/
    │   └── graph.html           # HTML only
    └── static/visualizer/
        ├── css/
        │   └── styles.css
        └── js/
            ├── main.js          # startup
            ├── core/
            │   ├── state.js     # constants, shared state, DOM refs
            │   └── graph.js     # graph setup, examples, helpers
            ├── algorithms/
            │   ├── common.js    # step snapshot helper
            │   ├── bfs.js       # BFS step builder
            │   └── dfs.js       # DFS step builder
            └── ui/
                ├── render.js        # SVG rendering
                ├── interaction.js   # mouse/touch, editing
                ├── controls.js      # mode buttons, zoom, canvas size
                ├── playback.js      # play/pause/step engine
                ├── panels.js        # queue/stack/log/explanation
                ├── keyboard.js      # shortcuts
                └── toast.js         # notifications
```

## Installation & Setup

### 1. Open the Project Folder

```bash
cd graph_visualizer
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

**Windows:**

```bash
venv\Scripts\activate
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the Django Development Server

```bash
python manage.py runserver
```

Open the application at:

```text
http://127.0.0.1:8000/
```

## Deploy to Vercel

1. Push the project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), import the repository and click **Deploy**. Vercel detects Django from `manage.py` automatically.
3. In **Project Settings → Environment Variables**, add:
   * `DJANGO_SECRET_KEY` — any long random string
   * `DJANGO_DEBUG` — `0`

Or use the CLI:

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

Static files are collected and served from Vercel's CDN automatically. Custom domains: add them to the `DJANGO_ALLOWED_HOSTS` variable (comma-separated).

## Usage

1. Create a graph using the graph editor.
2. Add nodes and connect them with edges.
3. Select a starting node.
4. Choose **BFS** or **DFS**.
5. Start the visualization.
6. Use the playback controls to move through the algorithm step by step.
7. Observe the graph, data structure, and explanation panel together.

## Architecture

Scripts are plain (non-module) files loaded in dependency order by `graph.html`, sharing one global scope. Keep that order when adding files: state → core → algorithms → UI → `main.js`.

To add an algorithm, create `algorithms/<name>.js` with a step builder like `buildBFSSteps`, then hook it into `startTraversal` in `ui/playback.js`.

## Future Improvements

* Dijkstra's Algorithm, A* Search, Bellman-Ford
* Prim's and Kruskal's Algorithms
* Save and load graphs
* Automated testing

## License

This project is intended for educational and portfolio purposes.
