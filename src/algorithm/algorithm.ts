import { Node } from './Node';

enum ESubtask {
  tops,
  halfOfEdges,
  complete,
}
export class Algorithm {
  private subTaskLimit = 2000;

  private actions = Node.getActions();

  private subTaskMap = {
    [ESubtask.tops]: (node: Node) =>
      Node.distanceToCompletionFactory([0, 0, 1])(node) === 0,
    [ESubtask.halfOfEdges]: (node: Node) =>
      Node.distanceToCompletionFactory([0, 1, 1])(node) === 0,
    [ESubtask.complete]: (node: Node) =>
      Node.distanceToCompletionFactory([1, 1, 1])(node) === 0,
  };
  private subTaskMetricMap = {
    [ESubtask.tops]: Node.distanceToCompletionFactory([0, 0, 1]),
    [ESubtask.halfOfEdges]: Node.distanceToCompletionFactory([0, 1, 1]),
    [ESubtask.complete]: Node.distanceToCompletionFactory([1, 1, 1]),
  };
  public start(startNode: Node) {
    console.time('tops');
    const tops = this.runSubTask(startNode, ESubtask.tops);
    console.timeEnd('tops');
    console.time('half');
    const halfs = this.runSubTask(tops.endNode, ESubtask.halfOfEdges);
    console.timeEnd('half');
    console.time('complete');
    const complete = this.runSubTask(halfs.endNode, ESubtask.complete);
    console.timeEnd('complete');
    return complete;
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

      // tslint:disable-next-line: no-unused-expression
      // i % 100 === 0 &&
      //   [...unVisitedNodes.entries()]
      //     .filter(([, nd]) => !nd.areTopsComplete())
      //     .forEach(([key, nd]) => {
      //       unVisitedNodes.delete(key);
      //       visitedNodes.set(key, nd);
      //     });
      // visitedNodes.delete(node.identifierKey);

      node = this.selectNextNode(node, unVisitedNodes);
      i % 25 === 0 &&
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
      console.log(`maximum steps exceeded`);
      return {
        actions: outNodes1
          .map(({ parentAction }) => parentAction)
          .filter(Boolean),
        endNode: node,
      };
    }
    // gather actions backwards
    const outNodes: Node[] = [node];
    while (outNodes[0].parent) {
      outNodes.unshift(outNodes[0].parent);
    }

    return {
      actions: outNodes.map(({ parentAction }) => parentAction).filter(Boolean),
      endNode: node,
    };
  }

  // private selectNextNode2(node: Node, unVisitedNodes: Map<string, Node>) {
  //   const unvisitedNodesList = [...unVisitedNodes.values()];
  //   return unvisitedNodesList[0];
  // }
  private selectNextNode(node: Node, unVisitedNodes: Map<string, Node>) {
    const unvisitedNodesList = [...unVisitedNodes.values()];
    const weights = unvisitedNodesList.map(
      (item) => node.distance - item.distance
    );
    // const weightsCorrectedForCompletedTops = weights.map((weight, index) =>
    //   unvisitedNodesList[index].areTopsComplete() ? weight ** (1 / 2) : weight
    // );
    const maxWeight = Math.max(...weights);
    return unvisitedNodesList[
      weights.findIndex((weight) => weight === maxWeight)
    ];
    // return (
    //   [...unVisitedNodes.values()].find(
    //     ({ distance }) => distance <= node.distance
    //   ) ||
    //   [...unVisitedNodes.values()].find(
    //     ({ distance }) =>
    //       distance ===
    //       Math.min(...[...unVisitedNodes.values()].map(({ distance: d }) => d))
    //   )
    // );
  }

  private createNodesFrom(
    node: Node,
    visitedNodes: Map<string, Node>,
    metric: (node: Node) => number
  ) {
    const newNodes: Node[] = [];
    for (const [key] of this.actions) {
      if (node.parentAction && Node.isInversingAction(node.parentAction, key)) {
        continue;
      }
      const newNode = node.makeAction(key);
      if (visitedNodes.has(newNode.identifierKey)) {
        continue;
      }
      const metricValue = metric(newNode);
      if (metricValue === 1) {
        continue;
      }
      newNode.distance = metricValue;
      newNodes.push(newNode);
    }
    /** filtering already visited */
    return newNodes;
  }
}
