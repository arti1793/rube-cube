import { ActionParamsMapping, EAction } from '../common/CommonConstants';
import { CubeRube } from '../Cubes/CubeRube/CubeRube';

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
    for (const action of actions) {
      await this.makeAction(action);
    }
  }

  public makeAction(action: EAction) {
    const params = ActionParamsMapping.get(action);
    return this.cubeRube.startAnimation(
      params.angle,
      params.axis,
      params.slice
    );
  }

  private generateRandomActions(count: number): EAction[] {
    const possibleActions = Object.keys(EAction) as EAction[];
    const randNumber = () =>
      Math.round(Math.random() * (possibleActions.length - 1));

    return new Array(count).fill(null).map(() => possibleActions[randNumber()]);
  }
}
