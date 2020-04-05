import { Group, MathUtils, Mesh, Scene, Vector3 } from 'three';
import { EAxis } from '../common/CommonConstants';
import { ISceneAttachable } from '../common/CommonTypes';
import { Cubie } from './Cubie';
import { TopologyGenerator } from './TopologyGenerator';

export class CubeRube implements ISceneAttachable {
  public threeObject: Mesh[];
  public rotatingGroup: Group;

  private defaultStepInDegrees = 4;
  private scene: Scene;

  private clearGroup: () => void;

  private animationProgress: {
    progressDeg: number;
    positive: boolean;
    stepInDegrees: number;
    targetInDegrees: number;
    axis: EAxis;
    sliceIndexByAxis: number;
  } | null = null;

  private cubiesLocated: Cubie[];

  constructor(n: number) {
    this.cubiesLocated = TopologyGenerator(n);
    this.threeObject = [
      ...this.cubiesLocated.map(({ threeObject }) => threeObject),
    ];
  }

  public connectTo(scene: Scene) {
    this.scene = scene;
    scene.add(...this.threeObject);
  }

  public animationHook() {
    if (this.isContinuingAnimation()) {
      this.rotate();
    }
  }

  public rotate = () => {
    const {
      axis,
      stepInDegrees,
      targetInDegrees,
      progressDeg,
      positive,
    } = this.animationProgress;

    let currentStep = stepInDegrees;
    if (progressDeg + stepInDegrees > targetInDegrees) {
      currentStep = targetInDegrees - progressDeg;
    }
    if (positive) {
      this.rotatingGroup.rotation[axis] += MathUtils.degToRad(currentStep);
    } else {
      this.rotatingGroup.rotation[axis] -= MathUtils.degToRad(currentStep);
    }
    this.animationProgress.progressDeg += currentStep;
  };

  public startAnimation(endDeg: number, axis: EAxis, sliceIndexByAxis: number) {
    if (endDeg % 90 !== 0) {
      throw new Error('rotation must be a multiple of 90');
    }
    this.animationProgress = {
      axis,
      positive: endDeg > 0,
      progressDeg: 0,
      sliceIndexByAxis,
      stepInDegrees: this.defaultStepInDegrees,
      targetInDegrees: Math.abs(endDeg),
    };
    this.clearGroup = this.recombineRotatingElementsToGroup();
  }

  private recombineRotatingElementsToGroup() {
    const { axis, sliceIndexByAxis } = this.animationProgress;
    const sliceOfCubies = this.cubiesLocated.filter(
      ({
        meta: {
          coords: { [axis]: index },
        },
      }) => index === sliceIndexByAxis
    );
    const cubiesThreeObjects = sliceOfCubies.map(cubie => cubie.threeObject);

    this.rotatingGroup = new Group();

    this.rotatingGroup.add(...cubiesThreeObjects);
    this.scene.add(this.rotatingGroup);

    return () => {
      this.scene.add(
        ...sliceOfCubies.map(cubie => {
          cubie.applyRotationMatrix(this.rotatingGroup.matrix);
          return cubie.threeObject;
        })
      );
    };
  }

  private isContinuingAnimation() {
    if (!this.animationProgress) {
      return false;
    }

    if (
      this.animationProgress.progressDeg >=
      this.animationProgress.targetInDegrees
    ) {
      this.clearGroup();
      this.animationProgress = null;
      return false;
    }
    return true;
  }
}
