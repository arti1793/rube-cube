import hash from 'object-hash';
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
      for (const index of nList) {
        for (const angle of Node.ANGLE_LIST) {
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

  public static distanceToTopsCompletion(node: Node): number {
    return (
      (Object.entries(ECubeFace)
        .map(
          ([face]) =>
            new Set(
              node.values
                .filter((meta) => meta.sides.length === 3)
                .map((meta) => meta.sides.filter((side) => side.face === face))
                .flat(1)
                .map(({ color }) => color)
            ).size
        )
        .reduce((acc, curr) => {
          return acc + curr;
        }, 0) /
        6 -
        1) /
      4
    );
  }
  public static distanceToHalfEdgesCompletion(node: Node): number {
    return (
      (Object.entries(ECubeFace)
        .map(
          ([face]) =>
            new Set(
              node.values
                .filter((meta) => meta.sides.length === 2)
                .map((meta) => meta.sides.filter((side) => side.face === face))
                .flat(1)
                .map(({ color }) => color)
            ).size
        )
        .reduce((acc, curr) => {
          return acc + curr;
        }, 0) /
        6 -
        1) /
      4
    );
  }
  public static distanceToCompletion(node: Node): number {
    return (
      (Object.entries(ECubeFace)
        .map(
          ([face]) =>
            new Set(
              node.values
                .map((meta) => meta.sides.filter((side) => side.face === face))
                .flat(1)
                .map(({ color }) => color)
            ).size
        )
        .reduce((acc, curr) => {
          return acc + curr;
        }, 0) /
        6 -
        1) /
      5
    );
  }

  public static isInversingAction(action1: string, action2: string) {
    const action1Parsed = Node.parseActionString(action1);
    const action2Parsed = Node.parseActionString(action2);
    return (
      action1Parsed.axis === action2Parsed.axis &&
      action1Parsed.index === action2Parsed.index &&
      action1Parsed.angle === -action2Parsed.angle
    );
  }
  private static ANGLE_LIST = [90, -90];
  private static ACTION_PARAMS_SEPARATOR = ' | ';

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
    const newNode = new Node(
      this.values.map((cubieMeta) => {
        if (
          cubieMeta.coords[axis] ===
          index - Math.floor(NUMBER_OF_CUBIES / 2)
        ) {
          // console.log('this', cubieMeta.coords, cubieMeta.sides);
          const newCubieMeta = cubieMeta.rotate(axis, angle);
          // console.log('become', newCubieMeta.coords, newCubieMeta.sides);
          return newCubieMeta;
        }
        return cubieMeta;
      }),
      null
    );

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
    this.identifierKey = hash(
      this.values.map((cubiemeta) => ({
        coords: cubiemeta.coords,
        sides: cubiemeta.sides,
      }))
    );
  }
}
