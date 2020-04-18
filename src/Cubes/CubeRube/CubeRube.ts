import { Group, MathUtils, Mesh, Scene } from 'three';
import { EAxis, ECubeFace } from '../../common/CommonConstants';
import { ISceneAttachable } from '../../common/CommonTypes';
import { Cubie } from '../Cubie/Cubie';
import { TopologyGenerator } from '../TopologyGenerator';

export class CubeRube implements ISceneAttachable {
  public threeObject: Mesh[];
  public rotatingGroup: Group;

  public readonly cubiesLocated: Cubie[];

  private defaultStepInDegrees = 15;
  private scene: Scene;

  private clearGroup: () => void;

  private animationProgress: {
    progressDeg: number;
    isPositive: boolean;
    stepInDegrees: number;
    targetInDegrees: number;
    axis: EAxis;
    sliceIndexByAxis: number;
  } | null = null;
  private resolver: () => void;

  constructor(n: number) {
    this.cubiesLocated = TopologyGenerator(n);
    this.threeObject = [
      ...this.cubiesLocated.map(({ threeObject }) => threeObject),
    ];
  }

  public showCubeMeta() {
    const info = Object.entries(ECubeFace)
      .map(([face]) => ({
        [face]: new Set(
          this.cubiesLocated
            .map((cubie) => cubie.sides.filter((side) => side.face === face))
            .flat(1)
            .map((side) => side.color)
        ),
      }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
    // tslint:disable-next-line: no-console
    console.log(info);
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
      isPositive: positive,
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

  public startAnimation(
    endDeg: number,
    axis: EAxis,
    sliceIndexByAxis: number
  ): Promise<void> {
    if (endDeg % 90 !== 0) {
      throw new Error('rotation must be a multiple of 90');
    }
    if (this.animationProgress) {
      throw new Error('animation now in progress');
    }
    this.animationProgress = {
      axis,
      isPositive: endDeg > 0,
      progressDeg: 0,
      sliceIndexByAxis,
      stepInDegrees: this.defaultStepInDegrees,
      targetInDegrees: Math.abs(endDeg),
    };
    this.clearGroup = this.recombineRotatingElementsToGroup();
    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  private recombineRotatingElementsToGroup() {
    const { axis, sliceIndexByAxis } = this.animationProgress;
    const sliceOfCubies = this.cubiesLocated.filter(
      ({ coords: { [axis]: index } }) => index === sliceIndexByAxis
    );
    const cubiesThreeObjects = sliceOfCubies.map((cubie) => cubie.threeObject);

    this.rotatingGroup = new Group();

    this.rotatingGroup.add(...cubiesThreeObjects);
    this.scene.add(this.rotatingGroup);

    return () => {
      this.scene.add(
        ...sliceOfCubies.map((cubie) => {
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
      this.resolver();
      return false;
    }
    return true;
  }
}
