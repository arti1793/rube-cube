export const NUMBER_OF_CUBIES = 3;
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

/**
 * viewer is on z+ axis for enum
 */
export enum ECubieSide {
  right,
  left,
  top,
  bottom,
  front,
  back,
}

export enum EAxis {
  x = 'x',
  y = 'y',
  z = 'z',
}


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

export enum ECubeFace {
  U = 'U',
  Ur = 'Ur',
  L = 'L',
  Lr = 'Lr',
  F = 'F',
  Fr = 'Fr',
  R = 'R',
  Rr = 'Rr',
  B = 'B',
  Br = 'Br',
  D = 'D',
  Dr = 'Dr',
}

export const CUBE_FACE_EDGE_TYPE_MAP = new Map([
  [ECubeFace.F, { axis: EAxis.z, edgeType: EEdgeType.far }],
  [ECubeFace.R, { axis: EAxis.x, edgeType: EEdgeType.far }],
  [ECubeFace.U, { axis: EAxis.y, edgeType: EEdgeType.far }],
  [ECubeFace.D, { axis: EAxis.y, edgeType: EEdgeType.near }],
  [ECubeFace.L, { axis: EAxis.x, edgeType: EEdgeType.near }],
  [ECubeFace.B, { axis: EAxis.z, edgeType: EEdgeType.near }],
]);
export const CUBE_FACE_COLOR_MAP = new Map([
  [ECubeFace.U, EColor.white],
  [ECubeFace.R, EColor.red],
  [ECubeFace.F, EColor.green],
  [ECubeFace.L, EColor.orange],
  [ECubeFace.B, EColor.blue],
  [ECubeFace.D, EColor.yellow],
]);

export const ActionParamsMapping = new Map([
  [ECubeFace.U, { axis: EAxis.y, slice: 1, angle: -90, }],
  [ECubeFace.Ur, { axis: EAxis.y, slice: 1, angle: 90, }],
  [ECubeFace.L, { axis: EAxis.x, slice: -1, angle: 90, }],
  [ECubeFace.Lr, { axis: EAxis.x, slice: -1, angle: -90, }],
  [ECubeFace.F, { axis: EAxis.z, slice: 1, angle: -90, }],
  [ECubeFace.Fr, { axis: EAxis.z, slice: 1, angle: 90, }],
  [ECubeFace.R, { axis: EAxis.x, slice: 1, angle: -90, }],
  [ECubeFace.Rr, { axis: EAxis.x, slice: 1, angle: 90, }],
  [ECubeFace.B, { axis: EAxis.z, slice: -1, angle: 90, }],
  [ECubeFace.Br, { axis: EAxis.z, slice: -1, angle: -90, }],
  [ECubeFace.D, { axis: EAxis.y, slice: -1, angle: 90, }],
  [ECubeFace.Dr, { axis: EAxis.y, slice: -1, angle: -90, }],
]);
