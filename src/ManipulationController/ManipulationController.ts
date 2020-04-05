import { EAxis, NUMBER_OF_CUBIES } from '../common/CommonConstants';
import { CubeRube } from '../Cube/CubeRube';

interface IActions {
  [key: string]: () => Promise<void>;
}
export class ManipulationController {
  private cubeRube: CubeRube;

  private options = {
    angleList: [90, -90],
    randomiseActionsCount: 50,
  };
  constructor(cubeRube: CubeRube) {
    this.cubeRube = cubeRube;
  }
  public async randomise() {
    const actions = this.generateRandomActions(
      this.options.randomiseActionsCount
    );
    for (const [key, action] of actions) {
      console.log(key);
      await action();
    }
  }
  public isComplete() {
    const colors = [
      ...new Set(
        this.cubeRube.cubiesLocated.map(({ meta }) => meta.colors).flat(1)
      ),
    ].every(color => {
      const colorsCoords = this.cubeRube.cubiesLocated
        .filter(({ meta }) => meta.colors.includes(color))
        .map(({ meta }) => meta.coords);
      const coordsSetByAxis = new Map<EAxis, Set<number>>([
        [EAxis.x, new Set(colorsCoords.map(({ x }) => x))],
        [EAxis.y, new Set(colorsCoords.map(({ y }) => y))],
        [EAxis.z, new Set(colorsCoords.map(({ z }) => z))],
      ]);

      // intersection
      return (
        [...coordsSetByAxis.get(EAxis.x)]
          .filter(el => coordsSetByAxis.get(EAxis.y).has(el))
          .filter(el => coordsSetByAxis.get(EAxis.z).has(el)).length === 1
      );
    });
    return colors;
  }

  private getActions() {
    const nList: number[] = new Array(NUMBER_OF_CUBIES)
      .fill(null)
      .map((_, index) => index);

    const actions: IActions = {};

    for (const [, axis] of Object.entries(EAxis)) {
      for (const angle of this.options.angleList) {
        for (const index of nList) {
          actions[`${axis}{${index}} ${angle}`] = () =>
            this.cubeRube.startAnimation(angle, axis, index);
        }
      }
    }
    return actions;
  }
  private generateRandomActions(
    count: number
  ): Array<[string, () => Promise<void>]> {
    const possibleActions = this.getActions();
    const randNumber = () =>
      Math.round(Math.random() * (Object.keys(possibleActions).length - 1));

    return new Array(count)
      .fill(null)
      .map(() => Object.keys(possibleActions)[randNumber()])
      .map(key => [key, possibleActions[key]]);
  }
}
