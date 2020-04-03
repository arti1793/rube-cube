import { Group, MathUtils, Vector3 } from 'three';
import { ISceneAttachable } from '../Playground/common/CommonTypes';
import { ICubieLocated, TopologyGenerator } from './TopologyGenerator';

export class CubeRube implements ISceneAttachable {
  public threeObject: Group = new Group();
  public rotatingGroup: Group = new Group();
  private maxIndex: number;
  private cubiesLocated: ICubieLocated[];

  constructor(n: number) {
    this.maxIndex = n - 1;
    this.cubiesLocated = TopologyGenerator(n);
    this.threeObject.add(
      ...this.cubiesLocated.map(({ cubie: { threeObject } }) => threeObject)
    );
    this.threeObject.add(this.rotatingGroup);
  }

  public test = () => {
    const selectedX = this.maxIndex;
    const cubies = this.cubiesLocated
      .filter(({ coords: [x] }) => x === selectedX)
      .map(({ cubie }) => cubie.threeObject);
    this.rotatingGroup.add(...cubies);
    this.rotatingGroup.rotateOnAxis(
      new Vector3(1, 0, 0).normalize(),
      MathUtils.degToRad(90)
    );
  };
}
