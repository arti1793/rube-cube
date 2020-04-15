import { Node } from './Node';

enum ESubtask {
  tops,
  halfOfEdges,
  complete,
}
export class Algorithm {
  private subTaskLimit = 700;

  private subTaskMap = {
    [ESubtask.complete]: (node: Node) => node.isComplete(),
    [ESubtask.halfOfEdges]: (node: Node) => node.isHalfOfEdgesComplete(),
    [ESubtask.tops]: (node: Node) => node.areTopsComplete(),
  };
  private subTaskMetricMap = {
    [ESubtask.tops]: (node: Node) => Node.distanceToCompletion(node) / 3,
    [ESubtask.halfOfEdges]: (node: Node) => Node.distanceToCompletion(node) / 2,
    [ESubtask.complete]: (node: Node) => Node.distanceToCompletion(node),
  };
  public start(startNode: Node) {
    // const tops = this.runSubTask(startNode, ESubtask.tops);
    // console.log('tops', tops);
    // const halfs = this.runSubTask(tops.endNode, ESubtask.halfOfEdges);
    // console.log('half', halfs);
    const complete = this.runSubTask(startNode, ESubtask.complete);
    console.log('completion', complete);
  }
  private runSubTask(startNode: Node, subTask: ESubtask) {
    let node = startNode;
    let i = this.subTaskLimit;

    const visitedNodes: Map<string, Node> = new Map([
      [node.identifierKey, node],
    ]);

    const unVisitedNodes: Map<string, Node> = new Map([]);

    while (i > 0 && node && !this.subTaskMap[subTask](node)) {
      i--;
      unVisitedNodes.delete(node.identifierKey);
      visitedNodes.set(node.identifierKey, node);
      const newNodes = this.createNodesFrom(
        node,
        visitedNodes,
        this.subTaskMetricMap[subTask]
      );

      newNodes.forEach((newNode) =>
        unVisitedNodes.set(newNode.identifierKey, newNode)
      );
      // visitedNodes.delete(node.identifierKey);

      node = this.selectNextNode(node, unVisitedNodes);
      console.log(
        'converge',
        node.distance,
        'size',
        unVisitedNodes.size,
        visitedNodes.size
      );
    }

    if (i <= 0) {
      const outNodes1: Node[] = [node];
      while (outNodes1[0].parent) {
        outNodes1.unshift(outNodes1[0].parent);
      }
      console.warn(outNodes1.map(({ parentAction }) => parentAction));
      throw new Error(`maximum steps exceeded`);
    }
    // gather actions backwards
    const outNodes: Node[] = [node];
    while (outNodes[0].parent) {
      outNodes.unshift(outNodes[0].parent);
    }

    return {
      actions: outNodes.map(({ parentAction }) => parentAction),
      endNode: node,
    };
  }
  private selectNextNode(prevNode: Node, unVisitedNodes: Map<string, Node>) {
    const unVisitedNodesList = [...unVisitedNodes.values()];
    // const minimumDistance = Math.min(
    //   ...unVisitedNodesList.map(({ distance }) => distance)
    // );
    return (
      unVisitedNodesList.find(({ distance }) => distance < prevNode.distance) ||
      unVisitedNodesList.find(
        ({ distance }) => distance === prevNode.distance
      ) ||
      unVisitedNodesList.find(
        ({ distance }) => Math.abs(distance - prevNode.distance) <= 0.01
      ) ||
      unVisitedNodes.values().next().value
    );
  }

  private createNodesFrom(
    node: Node,
    visitedNodes: Map<string, Node>,
    metric: (node: Node) => number
  ) {
    const newNodes: Node[] = [];
    for (const [key] of Node.getActions()) {
      if (node.parentAction && Node.isInversingAction(node.parentAction, key)) {
        continue;
      }
      const newNode = node.makeAction(key);
      const metricValue = metric(newNode);
      newNode.distance = metricValue;
      newNodes.push(newNode);
    }
    /** filtering already visited */
    return newNodes.filter(({ identifierKey: key }) => !visitedNodes.has(key));
  }
}
