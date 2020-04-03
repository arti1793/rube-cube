import { Group, Mesh } from 'three';
import { EAxis, EEdgeType } from './CommonConstants';

export interface IAxisEdgeMap {
  [EAxis.x]: EEdgeType;
  [EAxis.y]: EEdgeType;
  [EAxis.z]: EEdgeType;
}

export type TThreeObject = Group | Mesh;

export interface ISceneAttachable {
  threeObject: TThreeObject;
}
