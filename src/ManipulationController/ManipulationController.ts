import { EAxis, NUMBER_OF_CUBIES } from '../common/CommonConstants';
import { CubeRube } from '../Cube/CubeRube';

interface IActions {
  [key: string]: () => Promise<void>;
}
export class ManipulationController {
  private cubeRube: CubeRube;
  constructor(cubeRube: CubeRube) {
    this.cubeRube = cubeRube;
  }
  public async randomise() {
    const limit = 20;

    const actions = this.generateRandomActions(limit);
    for (const [key, action] of Object.entries(actions)) {
      console.log(key);
      await action();
    }
  }

  private getActions() {
    const nList: number[] = new Array(NUMBER_OF_CUBIES)
      .fill(null)
      .map((_, index) => index);

    const angleList: number[] = [90, -90];
    const actions: IActions = {};

    for (const [, axis] of Object.entries(EAxis)) {
      for (const angle of angleList) {
        for (const index of nList) {
          actions[`${axis}{${index}} ${angle}`] = () =>
            this.cubeRube.startAnimation(angle, axis, index);
        }
      }
    }
    return actions;
  }
  private generateRandomActions(count: number) {
    const possibleActions = this.getActions();
    const randNumber = () =>
      Math.round(Math.random() * (Object.keys(possibleActions).length - 1));

    return new Array(count)
      .fill(null)
      .map(() => Object.keys(possibleActions)[randNumber()])
      .reduce<IActions>((acc, key) => {
        acc[key] = possibleActions[key];
        return acc;
      }, {});
  }
}
