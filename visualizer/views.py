from django.shortcuts import render


def graph_view(request):
    return render(request, "visualizer/graph.html")
