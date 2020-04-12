import { EAxis, ECubeFace, NUMBER_OF_CUBIES } from '../common/CommonConstants';
import { CubieMeta } from '../Cubes/CubieMeta/CubieMeta';

export type TNodeActions = Map<string, (node: Node) => Node>;

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
  public static formatActionString(axis: EAxis, index: number, angle: number) {
    return [axis, index, angle].join(this.ACTION_PARAMS_SEPARATOR);
  }
  public static parseActionString(actionString: string) {
    const [axis, index, angle] = actionString.split(
      this.ACTION_PARAMS_SEPARATOR
    );
    return {
      angle: parseInt(angle, 10),
      axis: axis as EAxis,
      index: parseInt(index, 10),
    };
  }
  private static ANGLE_LIST = [90, -90];
  private static ACTION_PARAMS_SEPARATOR = ' - ';

  public distance: number;
  public parent: Node;
  public parentAction: string;
  public values: CubieMeta[];
  public identifierKey: string;
  constructor(values: CubieMeta[], distance: number) {
    this.values = values;
    this.setKey();
    this.distance = distance;
  }
  public makeAction(actionString: string) {
    const { axis, angle, index } = Node.parseActionString(actionString);
    const cubiesRotated = this.values.map((cubieMeta) => {
      if (cubieMeta.coords[axis] === index) {
        console.log('this', cubieMeta.coords, cubieMeta.sides);
        cubieMeta.rotate(axis, angle);
        console.log('become', cubieMeta.coords, cubieMeta.sides);
        return cubieMeta;
      }
      return cubieMeta;
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
    return Object.entries(ECubeFace)
      .map(([face]) => [
        [face],
        new Set(
          this.values
            .filter((meta) => meta.sides.length === 3)
            .map((meta) => meta.sides.filter((side) => side.face === face))
            .flat(1)
            .map(({ color }) => color)
        ).size === 1,
      ])
      .every(([, isComplete]) => isComplete);
  }
  public isHalfOfEdgesComplete() {
    return Object.entries(ECubeFace)
      .map(([face]) => [
        [face],
        new Set(
          this.values
            .filter((meta) => meta.sides.length === 2)
            .map((meta) => meta.sides.filter((side) => side.face === face))
            .flat(1)
            .map(({ color }) => color)
        ).size,
      ])
      .every(([, isCompleteSize]) => isCompleteSize <= 2);
  }

  public isComplete() {
    return Object.entries(ECubeFace)
      .map(([face]) => [
        [face],
        new Set(
          this.values
            .map((meta) => meta.sides.filter((side) => side.face === face))
            .flat(1)
            .map(({ color }) => color)
        ).size === 1,
      ])
      .every(([, isComplete]) => isComplete);
  }

  private setKey() {
    this.identifierKey = JSON.stringify(this.values);
  }
}
