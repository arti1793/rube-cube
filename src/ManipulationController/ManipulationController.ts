import { ActionParamsMapping, ECubeFace } from '../common/CommonConstants';
import { CubeRube } from '../Cubes/CubeRube/CubeRube';

export class ManipulationController {
  private cubeRube: CubeRube;

  private options = {
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

  public makeAction(action: ECubeFace) {
    const params = ActionParamsMapping.get(action);
    return this.cubeRube.startAnimation(
      params.angle,
      params.axis,
      params.slice
    );
  }

  private generateRandomActions(count: number): ECubeFace[] {
    const possibleActions = Object.keys(ECubeFace) as ECubeFace[];
    const randNumber = () =>
      Math.round(Math.random() * (possibleActions.length - 1));

    return new Array(count).fill(null).map(() => possibleActions[randNumber()]);
  }
}
