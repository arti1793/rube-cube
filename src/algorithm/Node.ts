import { Matrix4, Vector3 } from 'three';
import { EAxis, ECubeFace, NUMBER_OF_CUBIES } from '../common/CommonConstants';
import { ICubieMeta } from '../common/CommonTypes';

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
  public values: ICubieMeta[];
  public identifierKey: string;
  constructor(values: ICubieMeta[], distance: number) {
    this.values = values;
    this.setKey();
    this.distance = distance;
  }
  public makeAction(actionString: string) {
    const { axis, angle, index } = Node.parseActionString(actionString);
    const cubiesRotated = this.values.map((cubieMeta) => {
      if (cubieMeta.coords[axis] === index) {
        // console.log('this', cubie.coords);
        const newCubieMeta = this.rotateCubieVector(cubieMeta, axis, angle);
        // console.log('become', coords);
        return { ...cubieMeta, newCubieMeta };
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
  private rotateCubieVector = (
    cubieMeta: ICubieMeta,
    axis: EAxis,
    angle: number
  ) => {
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
    const rotationalMatrix = new Matrix4().makeRotationAxis(pivot, angle);
    cubieMeta.sides.forEach((side) => side.rotate(rotationalMatrix));
    return cubieMeta.coords
      .clone()
      .sub(bias)
      .applyMatrix4(rotationalMatrix)
      .add(bias)
      .round();
  };
  private setKey() {
    this.identifierKey = JSON.stringify(this.values);
  }
}
