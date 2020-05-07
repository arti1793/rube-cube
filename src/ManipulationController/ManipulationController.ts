import {
  ActionParamsMapping,
  ECubeFace
} from '../common/CommonConstants';
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
  public async deterministicShuffle() {
    const actions: ECubeFace[] = [
      ECubeFace.Lr,
      ECubeFace.D,
      ECubeFace.F,
      ECubeFace.R,
      ECubeFace.D,
      ECubeFace.Fr,
      ECubeFace.B,
      ECubeFace.Lr,
      ECubeFace.Fr,
      ECubeFace.Ur,
      ECubeFace.L,
      ECubeFace.Rr,
      ECubeFace.F,
      ECubeFace.Fr,
      ECubeFace.Fr,
      ECubeFace.B,
      ECubeFace.R,
      ECubeFace.B,
      ECubeFace.B,
      ECubeFace.Lr,
      ECubeFace.F,
      ECubeFace.B,
      ECubeFace.Lr,
      ECubeFace.B,
      ECubeFace.R,
      ECubeFace.B,
      ECubeFace.B,
      ECubeFace.Fr,
      ECubeFace.Ur,
      ECubeFace.D

    ]
    for (const action of actions) {
      await this.makeAction(action, true);
    }
  }

  public makeAction(action: ECubeFace, fast = false) {
    const params = ActionParamsMapping.get(action);
    return this.cubeRube.startAnimation(
      params.angle,
      params.axis,
      params.slice,
      fast ? 45 : undefined
    );
  }

  private generateRandomActions(count: number): ECubeFace[] {
    const possibleActions = Object.keys(ECubeFace) as ECubeFace[];
    const randNumber = () =>
      Math.round(Math.random() * (possibleActions.length - 1));

    return new Array(count).fill(null).map(() => possibleActions[randNumber()]);
  }
}
