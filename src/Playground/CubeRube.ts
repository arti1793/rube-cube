import { Group } from 'three';
import { ISceneAttachable } from './common/CommonTypes';
import { Cube } from './Cube';
import { generateCubes } from './CubeComposerStrategies';

export class CubeRube implements ISceneAttachable {
  public threeObject: Group = new Group();
  private cubeList: Cube[];

  constructor(n: number) {
    this.cubeList = generateCubes(n);
    this.threeObject.add(...this.cubeList.map(({ threeObject: mesh }) => mesh));
  }
}
