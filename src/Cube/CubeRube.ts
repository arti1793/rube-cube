import { Group } from 'three';
import { ISceneAttachable } from '../Playground/common/CommonTypes';
import { ICubieLocated, TopologyGenerator } from './TopologyGenerator';

export class CubeRube implements ISceneAttachable {
  public threeObject: Group = new Group();
  private cubiesLocated: ICubieLocated[];

  constructor(n: number) {
    this.cubiesLocated = TopologyGenerator(n);
    this.threeObject.add(
      ...this.cubiesLocated.map(({ cubie: { threeObject } }) => threeObject)
    );
  }
}
