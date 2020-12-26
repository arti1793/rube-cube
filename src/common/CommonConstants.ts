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

export enum ECubeFaceOrActions {
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
  [ECubeFaceOrActions.F, { axis: EAxis.z, edgeType: EEdgeType.far }],
  [ECubeFaceOrActions.R, { axis: EAxis.x, edgeType: EEdgeType.far }],
  [ECubeFaceOrActions.U, { axis: EAxis.y, edgeType: EEdgeType.far }],
  [ECubeFaceOrActions.D, { axis: EAxis.y, edgeType: EEdgeType.near }],
  [ECubeFaceOrActions.L, { axis: EAxis.x, edgeType: EEdgeType.near }],
  [ECubeFaceOrActions.B, { axis: EAxis.z, edgeType: EEdgeType.near }],
]);
export const CUBE_FACE_COLOR_MAP = new Map([
  [ECubeFaceOrActions.U, EColor.white],
  [ECubeFaceOrActions.R, EColor.red],
  [ECubeFaceOrActions.F, EColor.green],
  [ECubeFaceOrActions.L, EColor.orange],
  [ECubeFaceOrActions.B, EColor.blue],
  [ECubeFaceOrActions.D, EColor.yellow],
]);

export const ActionParamsMapping = new Map([
  [ECubeFaceOrActions.U, { axis: EAxis.y, slice: 1, angle: -90, }],
  [ECubeFaceOrActions.Ur, { axis: EAxis.y, slice: 1, angle: 90, }],
  [ECubeFaceOrActions.L, { axis: EAxis.x, slice: -1, angle: 90, }],
  [ECubeFaceOrActions.Lr, { axis: EAxis.x, slice: -1, angle: -90, }],
  [ECubeFaceOrActions.F, { axis: EAxis.z, slice: 1, angle: -90, }],
  [ECubeFaceOrActions.Fr, { axis: EAxis.z, slice: 1, angle: 90, }],
  [ECubeFaceOrActions.R, { axis: EAxis.x, slice: 1, angle: -90, }],
  [ECubeFaceOrActions.Rr, { axis: EAxis.x, slice: 1, angle: 90, }],
  [ECubeFaceOrActions.B, { axis: EAxis.z, slice: -1, angle: 90, }],
  [ECubeFaceOrActions.Br, { axis: EAxis.z, slice: -1, angle: -90, }],
  [ECubeFaceOrActions.D, { axis: EAxis.y, slice: -1, angle: 90, }],
  [ECubeFaceOrActions.Dr, { axis: EAxis.y, slice: -1, angle: -90, }],
]);
