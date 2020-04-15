import { Vector3 } from 'three';
import {
  CUBE_FACE_EDGE_TYPE_MAP,
  EAxis,
  ECubeFace,
  EEdgeType,
} from './CommonConstants';
import { IAxisEdgeMap } from './CommonTypes';

export const getAxisEdgeMap = (vector: Vector3, n: number): IAxisEdgeMap => {
  const isEdgeNear = (index: number) => index === 0;
  const isEdgeFar = (index: number, nn: number) => index === nn - 1;
  const getEdgeType = (index: number, nn: number) => {
    if (isEdgeFar(index, nn)) {
      return EEdgeType.far;
    }
    if (isEdgeNear(index)) {
      return EEdgeType.near;
    }
    return null;
  };
  return {
    x: getEdgeType(vector.x, n),
    y: getEdgeType(vector.y, n),
    z: getEdgeType(vector.z, n),
  };
};

export const getCubeFace = (axis: EAxis, edgeType: EEdgeType) => {
  const [[face]] = [...CUBE_FACE_EDGE_TYPE_MAP].filter(
    ([_, { axis: mapAxis, edgeType: mapEdgeType }]) =>
      mapAxis === axis && mapEdgeType === edgeType
  );
  return face as ECubeFace;
};

export const getFaces = (vector: Vector3, n: number) => {
  return Object.entries(getAxisEdgeMap(vector, n))
    .map(([axis, edgeType]) => {
      return edgeType ? getCubeFace(axis as EAxis, edgeType) : null;
    })
    .filter(Boolean);
};
