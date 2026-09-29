from django.shortcuts import render
from django.http import JsonResponse
from collections import deque
import json

def graph_view(request):
    return render(request, 'visualizer/graph.html')

def traverse(request):
    if request.method == "POST":
        data = json.loads(request.body)
        edges = data.get("edges", [])
        start = data.get("start", "")
        algo = data.get("algo", "bfs")

        graph = {}
        for u, v in edges:
            graph.setdefault(u, []).append(v)
            graph.setdefault(v, []).append(u)

        visited = set()
        order = []
        steps = []

        if algo == "bfs":
            queue = deque([start])
            visited.add(start)
            steps.append({
                "log": f"Enqueue: {start}",
                "node": start,
                "status": "enqueue",
                "stack": [],
                "queue": list(queue)
            })

            while queue:
                node = queue.popleft()
                order.append(node)
                steps.append({
                    "log": f"Dequeue: {node}",
                    "node": node,
                    "status": "dequeue",
                    "stack": [],
                    "queue": list(queue)
                })
                for neighbor in sorted(graph.get(node, [])):
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
                        steps.append({
                            "log": f"Enqueue: {neighbor}",
                            "node": neighbor,
                            "status": "enqueue",
                            "stack": [],
                            "queue": list(queue)
                        })

        elif algo == "dfs":
            stack = [start]
            steps.append({
                "log": f"Push: {start}",
                "node": start,
                "status": "push",
                "stack": list(stack),
                "queue": []
            })

            while stack:
                node = stack.pop()
                if node not in visited:
                    visited.add(node)
                    order.append(node)
                    steps.append({
                        "log": f"Pop: {node}",
                        "node": node,
                        "status": "pop",
                        "stack": list(stack),
                        "queue": []
                    })
                    for neighbor in sorted(graph.get(node, []), reverse=True):
                        if neighbor not in visited:
                            stack.append(neighbor)
                            steps.append({
                                "log": f"Push: {neighbor}",
                                "node": neighbor,
                                "status": "push",
                                "stack": list(stack),
                                "queue": []
                            })

        return JsonResponse({
            "order": order,
            "steps": steps
        })

    return JsonResponse({"error": "Invalid request"}, status=400)
