import { Group, Mesh, Scene } from 'three';
import { EAxis, EEdgeType } from './CommonConstants';

export interface IAxisEdgeMap {
  [EAxis.x]: EEdgeType;
  [EAxis.y]: EEdgeType;
  [EAxis.z]: EEdgeType;
}

export type TThreeObject = Group | Mesh | Mesh[] | Group[];

export interface ISceneAttachable {
  threeObject: TThreeObject;
  connectTo: (scene: Scene) => void;
}
