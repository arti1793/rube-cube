import { Node } from './Node';

// tslint:disable-next-line: max-classes-per-file
export class Algorithm {
  public start(startNode: Node) {
    let node = startNode;

    const visitedNodes: Map<string, Node> = new Map([
      [node.identifierKey, node],
    ]);
    while (!node.isComplete() && node) {
      const newNodes = this.createNodesFrom(node, visitedNodes);
      newNodes.forEach((newNode) =>
        visitedNodes.set(newNode.identifierKey, newNode)
      );
      visitedNodes.delete(node.identifierKey);
      node = this.selectNextNode(visitedNodes);
    }
    console.log('WIN');
    const outNodes: Node[] = [node];
    while (outNodes[0].parent) {
      outNodes.unshift(outNodes[0].parent);
    }

    console.log(outNodes.map(({ parentAction }) => parentAction));
    return outNodes.map(({ parentAction }) => parentAction);
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
