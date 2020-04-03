import { Group } from 'three';
import { ISceneAttachable } from '../Playground/common/CommonTypes';
import { Cubie } from './Cubie';
import { TopologyGenerator } from './TopologyGenerator';

export class CubeRube implements ISceneAttachable {
  public threeObject: Group = new Group();
  private cubeList: Cubie[];

  constructor(n: number) {
    this.cubeList = TopologyGenerator(n);
    this.threeObject.add(
      ...this.cubeList.map(({ threeObject }) => threeObject)
    );
  }
}
