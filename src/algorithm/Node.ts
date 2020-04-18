import hash from 'object-hash';
import { Vector3 } from 'three';
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
  public static distanceToTopsAndEdgesCompletion(node: Node): number {
    return (
      (Object.entries(ECubeFace)
        .map(
          ([face]) =>
            new Set(
              node.values
                .filter((meta) => meta.sides.length >= 2)
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

  public static distanceToPivotCubies(node: Node) {
    return Node.findPivotCubies(node).length >= 2 ? 0 : 1;
  }

  public static findPivotCubies(node: Node) {
    const tops = node.values.filter((cubie) => cubie.sides.length === 3);
    const cubies: CubieMeta[][] = [];
    for (const top of tops) {
      for (const top2 of tops) {
        if (top !== top2) {
          if (
            top.coords.clone().add(top2.coords).equals(new Vector3(0, 0, 0)) &&
            new Set([...top.sides, ...top2.sides].map(({ color }) => color))
              .size === 6
          ) {
            !(
              cubies.find(([, cubie]) => cubie === top) ||
              cubies.find(([cubie]) => cubie === top2)
            ) && cubies.push([top, top2]);
          }
        }
      }
    }
    return cubies;
  }

  public static distanceToCompletionFactory(weights: number[]) {
    return (node: Node) => {
      const sidesOnFaceCount = [1, 4 * (NUMBER_OF_CUBIES - 2), 4];
      const numbers: number[] = [];
      for (const top of node.values.filter(
        (cubie) => cubie.sides.length === 3
      )) {
        for (const { face, color } of top.sides) {
          const metricOfFace = new Array(3)
            .fill(null)
            .map((_, index) => index + 1)
            .map((sidesCount) =>
              node.values
                .filter((cubie) => cubie.sides.length === sidesCount)
                .map(({ sides }) => sides)
                .flat(1)
            )

            .map(
              (sides) =>
                sides.filter(
                  (side) => side.color === color && side.face === face
                ).length
            )
            .map((count, index) => count / sidesOnFaceCount[index])
            .reduce((acc, curr, index) => acc + curr * weights[index], 0);
          numbers.push(
            metricOfFace / weights.reduce((acc, curr) => acc + curr, 0)
          );
        }
      }

      return (
        1 - numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length || 0
      );
    };
  }
  public static distanceToCompletion4(node: Node) {
    const weights = [1, 1, 1];
    const sidesOnFaceCount = [1, 4 * (NUMBER_OF_CUBIES - 2), 4];
    const numbers: number[] = [];
    for (const top of node.values.filter((cubie) => cubie.sides.length === 3)) {
      for (const { face, color } of top.sides) {
        const metricOfFace = new Array(3)
          .fill(null)
          .map((_, index) => index + 1)
          .map((sidesCount) =>
            node.values
              .filter((cubie) => cubie.sides.length === sidesCount)
              .map(({ sides }) => sides)
              .flat(1)
          )

          .map(
            (sides) =>
              sides.filter((side) => side.color === color && side.face === face)
                .length
          )
          .map((count, index) => count / sidesOnFaceCount[index])
          .reduce((acc, curr, index) => acc + curr * weights[index], 0);
        numbers.push(
          metricOfFace / weights.reduce((acc, curr) => acc + curr, 0)
        );
      }
    }

    return (
      1 - numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length || 0
    );
  }
  /**
   *
   * @param node
   * distanse to completion
   * [0,1] 0 - completed 1 - not completed
   */
  public static distanceToCompletion3(node: Node) {
    const pivotTops = Node.findPivotCubies(node);
    const metric = [0];
    for (const pivotPair of pivotTops) {
      metric.push(Node.metricOfCompletionByPairOfTops(node, pivotPair));
    }
    const min = 1 - Math.max(...metric);
    return min;
  }

  /**
   *
   * @param node
   * @param tops
   * [0,1] 0- not completed 1-completed
   */
  public static metricOfCompletionByPairOfTops(
    node: Node,
    tops: CubieMeta[]
  ): number {
    const weights = [0, 1, 10];
    const sidesOnFaceCount = [1, 4 * (NUMBER_OF_CUBIES - 2), 4];
    const numbers: number[] = [];
    for (const top of tops) {
      for (const { face, color } of top.sides) {
        const metricOfFace = new Array(3)
          .fill(null)
          .map((_, index) => index + 1)
          .map((sidesCount) =>
            node.values
              .filter((cubie) => cubie.sides.length === sidesCount)
              .map(({ sides }) => sides)
              .flat(1)
          )

          .map(
            (sides) =>
              sides.filter((side) => side.color === color && side.face === face)
                .length
          )
          .map((count, index) => count / sidesOnFaceCount[index])
          .reduce((acc, curr, index) => acc + curr * weights[index], 0);
        numbers.push(
          metricOfFace / weights.reduce((acc, curr) => acc + curr, 0)
        );
      }
    }

    // numbers = numbers.sort((a, b) => b - a).slice(0, 3);
    // console.log(numbers);
    return numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length || 0;
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
