import { Group, MathUtils, Mesh, Scene, Vector3 } from 'three';
import { EAxis, ERotation } from '../common/CommonConstants';
import { ISceneAttachable } from '../common/CommonTypes';
import { Cubie } from './Cubie';
import { TopologyGenerator } from './TopologyGenerator';

export class CubeRube implements ISceneAttachable {
  public threeObject: Mesh[];
  public rotatingGroup: Group;

  public axisRotationMap = {
    [EAxis.x]: new Vector3(1, 0, 0),
    [EAxis.y]: new Vector3(0, 1, 0),
    [EAxis.z]: new Vector3(0, 0, 1),
  };
  private scene: Scene;

  private clearGroup: () => void;

  private animationProgress: {
    progressDeg: number;
    stepDeg: number;
    endDeg: number;
    axis: EAxis;
    index: number;
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
    const { axis, stepDeg, endDeg, progressDeg } = this.animationProgress;

    let currentStep = stepDeg;
    if (progressDeg + stepDeg > endDeg) {
      currentStep = endDeg - progressDeg;
    }
    this.rotatingGroup.rotation[axis] += MathUtils.degToRad(currentStep);
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
    const sliceOfCubies = this.cubiesLocated.filter(
      ({ coords: { [axis]: ind } }) => ind === index
    );
    const cubiesThreeObjects = sliceOfCubies.map(cubie => cubie.threeObject);

    this.rotatingGroup = new Group();

    this.rotatingGroup.add(...cubiesThreeObjects);
    this.scene.add(this.rotatingGroup);

    return () => {
      this.scene.add(
        ...sliceOfCubies.map(cubie => {
          cubie.threeObject.applyMatrix4(this.rotatingGroup.matrix);
          console.log(
            'changing',
            cubie.coords,
            'to',
            cubie.rotateCoordsOnAxis(axis, ERotation.counterclockwise, 3)
          );
          cubie.coords = cubie.rotateCoordsOnAxis(
            axis,
            ERotation.counterclockwise,
            3
          );
          return cubie.threeObject;
        })
      );
      this.scene.remove(this.rotatingGroup);
      this.rotatingGroup = null;
    };
  }

  private isContinuingAnimation() {
    if (!this.animationProgress) {
      return false;
    }

    if (this.animationProgress.progressDeg >= this.animationProgress.endDeg) {
      this.clearGroup();
      this.animationProgress = null;
      return false;
    }
    return true;
  }
}
