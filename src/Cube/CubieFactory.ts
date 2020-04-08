import { Vector3 } from 'three';
import {
  AXIS_EDGE_CUBE_SIDE_MAP,
  CUBE_FACE_EDGE_TYPE_MAP,
  EAxis,
  EColor,
  ECubeFace,
  EEdgeType,
} from '../common/CommonConstants';
import { IAxisEdgeMap, ICubieMeta } from '../common/CommonTypes';
import { Cubie, CubieMultiColored } from './Cubie';

export type TCubieFactory = (
  coords: { xIndex: number; yIndex: number; zIndex: number },
  n: number,
  cubeFaceColorMap: Map<ECubeFace, EColor>
) => Cubie;

const getCubeFace = (axis: EAxis, edgeType: EEdgeType) => {
  const [[face]] = [...CUBE_FACE_EDGE_TYPE_MAP].filter(
    ([_, { axis: mapAxis, edgeType: mapEdgeType }]) =>
      mapAxis === axis && mapEdgeType === edgeType
  );
  return face as ECubeFace;
};

const getAxisEdgeMap = (
  xIndex: number,
  yIndex: number,
  zIndex: number,
  n: number
): IAxisEdgeMap => {
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
    [EAxis.x]: getEdgeType(xIndex, n),
    [EAxis.y]: getEdgeType(yIndex, n),
    [EAxis.z]: getEdgeType(zIndex, n),
  };
};

export const CubieFactory: TCubieFactory = (
  coords: { xIndex: number; yIndex: number; zIndex: number },
  n: number,
  cubeFaceColorMap
) => {
  const axisEdgeMap: IAxisEdgeMap = getAxisEdgeMap(
    coords.xIndex,
    coords.yIndex,
    coords.zIndex,
    n
  );
  const sideColorCubeFaceMap: ICubieMeta = {
    coords: new Vector3(coords.xIndex, coords.yIndex, coords.zIndex),
    sides: Object.entries(axisEdgeMap)
      .map(([axis]) => {
        const edgeType = axisEdgeMap[(axis as unknown) as EAxis];
        return edgeType === null
          ? undefined
          : {
              color: cubeFaceColorMap.get(
                getCubeFace((axis as unknown) as EAxis, edgeType)
              ),
              cubeFace: getCubeFace((axis as unknown) as EAxis, edgeType),
              side: AXIS_EDGE_CUBE_SIDE_MAP[axis as EAxis][edgeType],
            };
      })
      .filter(Boolean),
  };

  const cubie = new CubieMultiColored(sideColorCubeFaceMap);
  return cubie;
};
