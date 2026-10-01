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

### Frontend

* HTML5
* CSS3
* JavaScript (ES6 Modules)
* SVG
* Font Awesome

### Backend

* Python
* Django
* Django REST Framework

### Database

* SQLite (development)
* PostgreSQL (production-ready)

## Project Structure

```text
graph-algorithm-visualizer/
│
├── static/
│   └── visualizer/
│       ├── css/
│       └── js/
│           ├── core/
│           ├── algorithms/
│           ├── ui/
│           └── main.js
│
├── templates/
│   └── visualizer/
│       └── graph.html
│
├── manage.py
├── requirements.txt
└── README.md
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/graph-algorithm-visualizer.git
cd graph-algorithm-visualizer
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

## Usage

1. Create a graph using the graph editor.
2. Add nodes and connect them with edges.
3. Select a starting node.
4. Choose **BFS** or **DFS**.
5. Start the visualization.
6. Use the playback controls to move through the algorithm step by step.
7. Observe the graph, data structure, and explanation panel together.

## Architecture

The application separates the main functionality into independent modules:

* **Core** — graph representation and canvas-related functionality.
* **Algorithms** — BFS and DFS implementations.
* **UI** — controls, visualization panels, and step history.
* **Main** — application initialization and module coordination.

This modular structure makes the visualizer easier to maintain and extend with additional graph algorithms.

## Future Improvements

* Dijkstra's Algorithm
* A* Search
* Bellman-Ford Algorithm
* Prim's Algorithm
* Kruskal's Algorithm
* Save and load graphs
* Algorithm comparison mode
* Automated testing
* Backend/API integration
* Cloud deployment

## License

This project is intended for educational and portfolio purposes.
