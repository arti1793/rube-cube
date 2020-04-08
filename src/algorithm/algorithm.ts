import { MathUtils, Vector3 } from 'three';
import { EAxis, EColor, NUMBER_OF_CUBIES } from '../common/CommonConstants';

type TNodeActions = Map<string, (node: Node) => Node>;
export class Node {
  public static getActions(): TNodeActions {
    const nList: number[] = new Array(NUMBER_OF_CUBIES)
      .fill(null)
      .map((_, index) => index);

    const actions: TNodeActions = new Map();

    for (const [, axis] of Object.entries(EAxis)) {
      for (const angle of Node.ANGLE_LIST) {
        for (const index of nList) {
          actions.set(Node.formatActionString(axis, index, angle), (node) =>
            node.makeAction(Node.formatActionString(axis, index, angle))
          );
        }
      }
    }
    return actions;
  }
  private static ANGLE_LIST = [90, -90];
  private static ACTION_PARAMS_SEPARATOR = ' - ';
  private static formatActionString(axis: EAxis, index: number, angle: number) {
    return [axis, index, angle].join(this.ACTION_PARAMS_SEPARATOR);
  }

  private static parseActionString(actionString: string) {
    const [axis, index, angle] = actionString.split(
      this.ACTION_PARAMS_SEPARATOR
    );
    return {
      angle: parseInt(angle, 10),
      axis: axis as EAxis,
      index: parseInt(index, 10),
    };
  }

  public distance: number;

  public parent: Node;
  public parentAction: string;
  public values: Array<{
    colors: EColor[];
    coords: Vector3;
  }>;
  public identifierKey: string;

  constructor(
    values: Array<{
      colors: EColor[];
      coords: Vector3;
    }>,
    distance: number
  ) {
    this.values = values;
    this.setKey();
    this.distance = distance;
  }

  public makeAction(actionString: string) {
    const { axis, angle, index } = Node.parseActionString(actionString);

    const cubiesRotated = this.values.map((cubie) => {
      if (cubie.coords[axis] === index) {
        // console.log('this', cubie.coords);
        const coords = this.rotateCubieVector(cubie.coords, axis, angle);
        // console.log('become', coords);
        return { ...cubie, coords };
      }
      return cubie;
    });

    const newNode = new Node(cubiesRotated, this.distance + 1);
    newNode.parent = this;
    newNode.parentAction = actionString;
    return newNode;
  }

  public isSame(node: Node) {
    return node.identifierKey === this.identifierKey;
  }

  public areTopsComplete() {
    // todo
  }
  public isHalfOfEdgesComplete() {
    // todo
  }
  public isSecondHalfOfEdgesComplete() {
    // todo
  }
  /** refrite using faces map */
  public isComplete() {
    const colorsSet = [
      ...new Set(this.values.map(({ colors }) => colors).flat(1)),
    ].every((color) => {
      const colorsCoords = this.values
        .filter(({ colors }) => colors.includes(color))
        .map(({ coords }) => coords);
      const coordsSetByAxis = new Map<EAxis, Set<number>>([
        [EAxis.x, new Set(colorsCoords.map(({ x }) => x))],
        [EAxis.y, new Set(colorsCoords.map(({ y }) => y))],
        [EAxis.z, new Set(colorsCoords.map(({ z }) => z))],
      ]);

      // intersection
      return (
        [...coordsSetByAxis.get(EAxis.x)]
          .filter((el) => coordsSetByAxis.get(EAxis.y).has(el))
          .filter((el) => coordsSetByAxis.get(EAxis.z).has(el)).length === 1
      );
    });
    return colorsSet;
  }

  private rotateCubieVector = (vector: Vector3, axis: EAxis, angle: number) => {
    const bias = new Vector3(
      Math.floor((NUMBER_OF_CUBIES - 1) / 2),
      Math.floor((NUMBER_OF_CUBIES - 1) / 2),
      Math.floor((NUMBER_OF_CUBIES - 1) / 2)
    );
    let pivot: Vector3;
    if (axis === EAxis.x) {
      pivot = new Vector3(1, 0, 0);
    }
    if (axis === EAxis.y) {
      pivot = new Vector3(0, 1, 0);
    }
    if (axis === EAxis.z) {
      pivot = new Vector3(0, 0, 1);
    }

    return vector
      .clone()
      .sub(bias)
      .applyAxisAngle(pivot, MathUtils.degToRad(angle))
      .add(bias)
      .round();
  };

  private setKey() {
    // const colorsKeyStrings = [
    //   ...new Set(values.map(({ colors }) => colors).flat(1)),
    // ]
    //   .sort(this.sortPredicate)
    //   .map((color) => {
    //     const colorsCoords = values
    //       .filter(({ colors }) => colors.includes(color))
    //       .map(({ coords }) => coords);
    //     const coordsSetByAxis = new Map<EAxis, number[]>([
    //       [EAxis.x, colorsCoords.map(({ x }) => x).sort(this.sortPredicate)],
    //       [EAxis.y, colorsCoords.map(({ y }) => y).sort(this.sortPredicate)],
    //       [EAxis.z, colorsCoords.map(({ z }) => z).sort(this.sortPredicate)],
    //     ]);

    //     // intersection
    //     return `${color}_${EAxis.x}:${coordsSetByAxis
    //       .get(EAxis.x)
    //       .join(' ')}, ${EAxis.y}:${coordsSetByAxis.get(EAxis.z).join(' ')}.`;
    //   });
    // this.identifierKey = colorsKeyStrings.join('\n');
    this.identifierKey = JSON.stringify(this.values);
  }

  //   private sortPredicate(a: number, b: number) {
  //     return a < b ? +1 : -1;
  //   }
}

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
