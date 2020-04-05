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
