import { Group, MathUtils, Scene, Vector3 } from 'three';
import { EAxis } from '../Playground/common/CommonConstants';
import { ISceneAttachable } from '../Playground/common/CommonTypes';
import { ICubieLocated, TopologyGenerator } from './TopologyGenerator';

export class CubeRube implements ISceneAttachable {
  public threeObject: Group = new Group();
  public rotatingGroup: Group = new Group();

  private clearGroup: () => void;

  private animationProgress: {
    progressDeg: number;
    stepDeg: number;
    endDeg: number;
    axis: EAxis;
    index: number;
  } | null = null;

  private cubiesLocated: ICubieLocated[];

  private axisRotationMap = {
    [EAxis.x]: new Vector3(1, 0, 0),
    [EAxis.y]: new Vector3(0, 1, 0),
    [EAxis.z]: new Vector3(0, 0, 1),
  };

  constructor(n: number) {
    this.cubiesLocated = TopologyGenerator(n);
    this.threeObject.add(
      ...this.cubiesLocated.map(({ cubie: { threeObject } }) => threeObject)
    );
  }

  public connectTo(scene: Scene) {
    scene.add(this.threeObject);
    scene.add(this.rotatingGroup);
  }

  public animationHook() {
    if (this.isContinuingAnimation()) {
      this.rotate();
    }
  }

  public rotate = () => {
    const { axis, stepDeg, endDeg, progressDeg } = this.animationProgress;

    let currentStep = stepDeg;
    if (progressDeg + stepDeg > endDeg) {
      currentStep = endDeg - progressDeg;
    }
    this.rotatingGroup.rotateOnAxis(
      this.axisRotationMap[axis],
      MathUtils.degToRad(currentStep)
    );
    this.animationProgress.progressDeg += currentStep;
  };

  public startAnimation(endDeg: number, axis: EAxis, index: number) {
    this.animationProgress = {
      axis,
      endDeg,
      index,
      progressDeg: 0,
      stepDeg: 4,
    };
    this.clearGroup = this.recombineRotatingElementsToGroup();
  }

  private recombineRotatingElementsToGroup() {
    const { axis, index } = this.animationProgress;
    const cubies = this.cubiesLocated
      .filter(({ coords: { [axis]: ind } }) => ind === index)
      .map(({ cubie }) => cubie.threeObject);

    this.rotatingGroup.add(...cubies);
    return () => {
      // TODO
      // this.rotatingGroup.remove(...cubies);
      // this.threeObject.add(...this.rotatingGroup.children);
    };
  }

  private isContinuingAnimation() {
    if (!this.animationProgress) {
      return false;
    }
    if (this.animationProgress.progressDeg >= this.animationProgress.endDeg) {
      this.animationProgress = null;
      this.clearGroup();
      return false;
    }
    return true;
  }
}
