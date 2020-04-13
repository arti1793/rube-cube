import { Node } from './Node';

enum ESubtask {
  tops,
  halfOfEdges,
  complete,
}
export class Algorithm {
  private subTaskLimit = 100;

  private subTaskMap = {
    [ESubtask.complete]: (node: Node) => node.isComplete(),
    [ESubtask.halfOfEdges]: (node: Node) => node.isHalfOfEdgesComplete(),
    [ESubtask.tops]: (node: Node) => node.areTopsComplete(),
  };
  private runSubTask(startNode: Node, subTask: ESubtask) {
    let node = startNode;
    let i = this.subTaskLimit;

    const visitedNodes: Map<string, Node> = new Map([
      [node.identifierKey, node],
    ]);
    while (node && this.subTaskMap[subTask](node) && i !== 0) {
      i--;
      const newNodes = this.createNodesFrom(node, visitedNodes);
      newNodes.forEach((newNode) =>
        visitedNodes.set(newNode.identifierKey, newNode)
      );
      visitedNodes.delete(node.identifierKey);
      node = this.selectNextNode(visitedNodes);
    }

    if (i >= this.subTaskLimit) {
      throw new Error(`maximum steps exceeded ${i}`);
    }
    // gather actions backwards
    const outNodes: Node[] = [node];
    while (outNodes[0].parent) {
      outNodes.unshift(outNodes[0].parent);
    }

    // console.log(outNodes.map(({ parentAction }) => parentAction));
    return {
      endNode: outNodes[0],
      actions: outNodes.map(({ parentAction }) => parentAction),
    };
  }
  public start(startNode: Node) {
    console.log(this.runSubTask(startNode, ESubtask.tops));
    // let node = startNode;
    // let i = this.limit;
    // const visitedNodes: Map<string, Node> = new Map([
    //   [node.identifierKey, node],
    // ]);
    // while (
    //   [
    //     node.areTopsComplete(),
    //     node.isHalfOfEdgesComplete(),
    //     node.isComplete(),
    //   ].every(Boolean) &&
    //   node &&
    //   i !== 0
    // ) {
    //   i--;
    //   const newNodes = this.createNodesFrom(node, visitedNodes);
    //   newNodes.forEach((newNode) =>
    //     visitedNodes.set(newNode.identifierKey, newNode)
    //   );
    //   visitedNodes.delete(node.identifierKey);
    //   node = this.selectNextNode(visitedNodes);
    // }
    // if (i >= this.limit) {
    //   throw new Error(`maximum steps exceeded ${i}`);
    // }
    // const outNodes: Node[] = [node];
    // while (outNodes[0].parent) {
    //   outNodes.unshift(outNodes[0].parent);
    // }
    // // console.log(outNodes.map(({ parentAction }) => parentAction));
    // return outNodes.map(({ parentAction }) => parentAction);
  }
  private selectNextNode(visitedNodes: Map<string, Node>) {
    const visitedNodesList = [...visitedNodes.values()];
    const minimumDistance = Math.min(
      ...visitedNodesList.map(({ distance }) => distance)
    );
    return visitedNodesList.find(
      ({ distance }) => distance === minimumDistance
    );
  }

  private createNodesFrom(node: Node, visitedNodes: Map<string, Node>) {
    const newNodes: Node[] = [];
    for (const [key] of Node.getActions()) {
      const newNode = node.makeAction(key);
      newNodes.push(newNode);
    }
    /** filtering already visited */
    return newNodes.filter(({ identifierKey: key }) => !visitedNodes.has(key));
  }
}
