import { ECubeSide } from '../Cube';

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

export const CubeFaceEdgeTypeMap = new Map([
  [ECubeFace.left, { axis: EAxis.z, edgeType: EEdgeType.far }],
  [ECubeFace.right, { axis: EAxis.x, edgeType: EEdgeType.far }],
  [ECubeFace.top, { axis: EAxis.y, edgeType: EEdgeType.far }],
  [ECubeFace.bottom, { axis: EAxis.y, edgeType: EEdgeType.near }],
  [ECubeFace.backLeft, { axis: EAxis.x, edgeType: EEdgeType.near }],
  [ECubeFace.backRight, { axis: EAxis.z, edgeType: EEdgeType.near }],
]);

export const AxisEdgeCubeSideMap = {
  [EAxis.x]: {
    [EEdgeType.near]: ECubeSide.left,
    [EEdgeType.far]: ECubeSide.right,
  },
  [EAxis.y]: {
    [EEdgeType.near]: ECubeSide.bottom,
    [EEdgeType.far]: ECubeSide.top,
  },
  [EAxis.z]: {
    [EEdgeType.near]: ECubeSide.back,
    [EEdgeType.far]: ECubeSide.front,
  },
};

export const CubeFaceColorMap = {
  [ECubeFace.left]: EColor.blue,
  [ECubeFace.right]: EColor.orange,
  [ECubeFace.top]: EColor.red,
  [ECubeFace.bottom]: EColor.white,
  [ECubeFace.backLeft]: EColor.yellow,
  [ECubeFace.backRight]: EColor.green,
};
