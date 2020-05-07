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

export enum ECubeFace {
  front = 'front',
  right = 'right',
  top = 'top',
  bottom = 'bottom',

  left = 'left',
  back = 'back',
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

export const CUBE_FACE_EDGE_TYPE_MAP = new Map([
  [ECubeFace.front, { axis: EAxis.z, edgeType: EEdgeType.far }],
  [ECubeFace.right, { axis: EAxis.x, edgeType: EEdgeType.far }],
  [ECubeFace.top, { axis: EAxis.y, edgeType: EEdgeType.far }],
  [ECubeFace.bottom, { axis: EAxis.y, edgeType: EEdgeType.near }],
  [ECubeFace.left, { axis: EAxis.x, edgeType: EEdgeType.near }],
  [ECubeFace.back, { axis: EAxis.z, edgeType: EEdgeType.near }],
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
  [ECubeFace.front, EColor.blue],
  [ECubeFace.right, EColor.orange],
  [ECubeFace.top, EColor.red],
  [ECubeFace.bottom, EColor.white],
  [ECubeFace.left, EColor.yellow],
  [ECubeFace.back, EColor.green],
]);

export enum EAction {
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
export const ActionParamsMapping = new Map([
  [EAction.U, { axis: EAxis.y, slice: 1, angle: -90, }],
  [EAction.Ur, { axis: EAxis.y, slice: 1, angle: 90, }],
  [EAction.L, { axis: EAxis.x, slice: -1, angle: 90, }],
  [EAction.Lr, { axis: EAxis.x, slice: -1, angle: -90, }],
  [EAction.F, { axis: EAxis.z, slice: 1, angle: -90, }],
  [EAction.Fr, { axis: EAxis.z, slice: 1, angle: 90, }],
  [EAction.R, { axis: EAxis.x, slice: 1, angle: -90, }],
  [EAction.Rr, { axis: EAxis.x, slice: 1, angle: 90, }],
  [EAction.B, { axis: EAxis.z, slice: -1, angle: 90, }],
  [EAction.Br, { axis: EAxis.z, slice: -1, angle: -90, }],
  [EAction.D, { axis: EAxis.y, slice: -1, angle: 90, }],
  [EAction.Dr, { axis: EAxis.y, slice: -1, angle: -90, }],
]);
