import {
  ActionParamsMapping,
  ECubeFaceOrActions
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
    const actions: ECubeFaceOrActions[] = [
      ECubeFaceOrActions.Lr,
      ECubeFaceOrActions.D,
      ECubeFaceOrActions.F,
      ECubeFaceOrActions.R,
      ECubeFaceOrActions.D,
      ECubeFaceOrActions.Fr,
      ECubeFaceOrActions.B,
      ECubeFaceOrActions.Lr,
      ECubeFaceOrActions.Fr,
      ECubeFaceOrActions.Ur,
      ECubeFaceOrActions.L,
      ECubeFaceOrActions.Rr,
      ECubeFaceOrActions.F,
      ECubeFaceOrActions.Fr,
      ECubeFaceOrActions.Fr,
      ECubeFaceOrActions.B,
      ECubeFaceOrActions.R,
      ECubeFaceOrActions.B,
      ECubeFaceOrActions.B,
      ECubeFaceOrActions.Lr,
      ECubeFaceOrActions.F,
      ECubeFaceOrActions.B,
      ECubeFaceOrActions.Lr,
      ECubeFaceOrActions.B,
      ECubeFaceOrActions.R,
      ECubeFaceOrActions.B,
      ECubeFaceOrActions.B,
      ECubeFaceOrActions.Fr,
      ECubeFaceOrActions.Ur,
      ECubeFaceOrActions.D

    ]
    for (const action of actions) {
      await this.makeAction(action, true);
    }
  }

  public makeAction(action: ECubeFaceOrActions, fast = false) {
    const params = ActionParamsMapping.get(action);
    return this.cubeRube.startAnimation(
      params.angle,
      params.axis,
      params.slice,
      fast ? 45 : undefined
    );
  }

  private generateRandomActions(count: number): ECubeFaceOrActions[] {
    const possibleActions = Object.keys(ECubeFaceOrActions) as ECubeFaceOrActions[];
    const randNumber = () =>
      Math.round(Math.random() * (possibleActions.length - 1));

    return new Array(count).fill(null).map(() => possibleActions[randNumber()]);
  }
}
