import { Group, Mesh, Scene, Vector3 } from 'three';
import { ECubieSide } from '../Cubes/Cubie/Cubie';
import { EAxis, EColor, ECubeFace, EEdgeType } from './CommonConstants';

export interface IAxisEdgeMap {
  [EAxis.x]: EEdgeType;
  [EAxis.y]: EEdgeType;
  [EAxis.z]: EEdgeType;
}

export interface ISidesMeta {
  side: ECubieSide;
  cubeFace: ECubeFace;
  color: EColor;
}
export interface ICubieMeta {
  coords: Vector3;
  sides: ISidesMeta[];
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
