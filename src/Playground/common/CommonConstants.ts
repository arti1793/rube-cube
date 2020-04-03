import { ECubieSide } from '../../Cube/Cubie';

export enum EColor {
  red = 0xff0000,
  white = 0xffffff,
  blue = 0x0000ff,
  orange = 0xffa500,
  yellow = 0xffff00,
  green = 0x00ff00,

  // for inner sides
  black = 0x000000,
}

export enum EEdgeType {
  near = 'near',
  far = 'far',
}

export enum ECubeFace {
  left = 'left',
  right = 'right',
  top = 'top',
  bottom = 'bottom',

  backLeft = 'backLeft',
  backRight = 'backRight',
}

export enum EAxis {
  x = 'x',
  y = 'y',
  z = 'z',
}

export const CUBE_FACE_EDGE_TYPE_MAP = new Map([
  [ECubeFace.left, { axis: EAxis.z, edgeType: EEdgeType.far }],
  [ECubeFace.right, { axis: EAxis.x, edgeType: EEdgeType.far }],
  [ECubeFace.top, { axis: EAxis.y, edgeType: EEdgeType.far }],
  [ECubeFace.bottom, { axis: EAxis.y, edgeType: EEdgeType.near }],
  [ECubeFace.backLeft, { axis: EAxis.x, edgeType: EEdgeType.near }],
  [ECubeFace.backRight, { axis: EAxis.z, edgeType: EEdgeType.near }],
]);

export const AXIS_EDGE_CUBE_SIDE_MAP = {
  [EAxis.x]: {
    [EEdgeType.near]: ECubieSide.left,
    [EEdgeType.far]: ECubieSide.right,
  },
  [EAxis.y]: {
    [EEdgeType.near]: ECubieSide.bottom,
    [EEdgeType.far]: ECubieSide.top,
  },
  [EAxis.z]: {
    [EEdgeType.near]: ECubieSide.back,
    [EEdgeType.far]: ECubieSide.front,
  },
};

export const CUBE_FACE_COLOR_MAP = new Map([
  [ECubeFace.left, EColor.blue],
  [ECubeFace.right, EColor.orange],
  [ECubeFace.top, EColor.red],
  [ECubeFace.bottom, EColor.white],
  [ECubeFace.backLeft, EColor.yellow],
  [ECubeFace.backRight, EColor.green],
]);
