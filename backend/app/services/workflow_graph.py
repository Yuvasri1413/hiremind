from collections import defaultdict, deque
from typing import Any


def node_type(node: dict[str, Any]) -> str:
    data = node.get("data")
    if isinstance(data, dict):
        node_type_value = data.get("nodeType")
        if isinstance(node_type_value, str):
            return node_type_value
    return ""


def node_config(node: dict[str, Any]) -> dict[str, Any]:
    data = node.get("data")
    if isinstance(data, dict):
        config = data.get("config")
        if isinstance(config, dict):
            return config
    return {}


def topological_sort(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> list[dict[str, Any]]:
    node_map = {
        node["id"]: node
        for node in nodes
        if isinstance(node.get("id"), str)
    }
    indegree: dict[str, int] = defaultdict(int)
    adjacency: dict[str, list[str]] = defaultdict(list)

    for node_id in node_map:
        indegree[node_id]

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        if isinstance(source, str) and isinstance(target, str) and source in node_map and target in node_map:
            adjacency[source].append(target)
            indegree[target] += 1

    queue = deque(node_id for node_id, degree in indegree.items() if degree == 0)
    ordered_ids: list[str] = []

    while queue:
        current = queue.popleft()
        ordered_ids.append(current)
        for nxt in adjacency[current]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)

    if len(ordered_ids) != len(node_map):
        fallback = sorted(node_map.values(), key=lambda item: item.get("position", {}).get("x", 0))
        return fallback

    return [node_map[node_id] for node_id in ordered_ids]
