from collections import defaultdict

VALID_NODE_TYPES = {"parse", "screen", "match", "evaluate", "rank", "interview"}


def validate_workflow(nodes: list[dict], edges: list[dict]) -> list[str]:
    errors: list[str] = []

    if not nodes:
        errors.append("Workflow must include at least one node.")
        return errors

    parse_nodes = [
        node for node in nodes if _node_type(node) == "parse"
    ]
    if not parse_nodes:
        errors.append("Workflow must include a Parse node.")
    if len(parse_nodes) > 1:
        errors.append("Only one Parse node is allowed.")

    unknown_types = {
        _node_type(node)
        for node in nodes
        if _node_type(node) and _node_type(node) not in VALID_NODE_TYPES
    }
    if unknown_types:
        errors.append(f"Unknown node types: {', '.join(sorted(unknown_types))}.")

    if _has_cycle(nodes, edges):
        errors.append("Workflow contains a cycle. Pipeline must flow in one direction.")

    disconnected = _find_disconnected_nodes(nodes, edges)
    if len(nodes) > 1 and disconnected:
        errors.append("All nodes must be connected to the pipeline.")

    return errors


def _node_type(node: dict) -> str | None:
    data = node.get("data")
    if not isinstance(data, dict):
        return None
    node_type = data.get("nodeType")
    return node_type if isinstance(node_type, str) else None


def _has_cycle(nodes: list[dict], edges: list[dict]) -> bool:
    adjacency: dict[str, list[str]] = defaultdict(list)
    for node in nodes:
        node_id = node.get("id")
        if isinstance(node_id, str):
            adjacency[node_id]

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        if isinstance(source, str) and isinstance(target, str):
            adjacency[source].append(target)

    visiting: set[str] = set()
    visited: set[str] = set()

    def dfs(node_id: str) -> bool:
        if node_id in visiting:
            return True
        if node_id in visited:
            return False

        visiting.add(node_id)
        for next_id in adjacency.get(node_id, []):
            if dfs(next_id):
                return True
        visiting.remove(node_id)
        visited.add(node_id)
        return False

    for node in nodes:
        node_id = node.get("id")
        if isinstance(node_id, str) and dfs(node_id):
            return True
    return False


def _find_disconnected_nodes(nodes: list[dict], edges: list[dict]) -> list[str]:
    if len(nodes) <= 1:
        return []

    connected: set[str] = set()
    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        if isinstance(source, str):
            connected.add(source)
        if isinstance(target, str):
            connected.add(target)

    return [
        node["id"]
        for node in nodes
        if isinstance(node.get("id"), str) and node["id"] not in connected
    ]
