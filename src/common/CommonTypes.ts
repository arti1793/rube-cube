import { Group, Mesh, Scene, Vector3 } from 'three';
import { CubieSide } from '../Cubes/CubieSide/CubieSide';
import { EAxis, EColor, ECubeFace, EEdgeType } from './CommonConstants';

export interface IAxisEdgeMap {
  [EAxis.x]: EEdgeType;
  [EAxis.y]: EEdgeType;
  [EAxis.z]: EEdgeType;
}

export interface ICubieMeta {
  coords: Vector3;
  sides: CubieSide[];
}
export type TThreeObject = Group | Mesh | Mesh[] | Group[];

export interface ISceneAttachable {
  threeObject: TThreeObject;
  connectTo: (scene: Scene) => void;
}

export interface IColorCubeFace {
  face: ECubeFace;
  color: EColor;
}
