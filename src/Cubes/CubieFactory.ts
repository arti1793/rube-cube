import { Vector3 } from 'three';
import {
  AXIS_EDGE_CUBE_SIDE_MAP,
  EAxis,
  EColor,
  ECubeFace,
} from '../common/CommonConstants';
import { IAxisEdgeMap } from '../common/CommonTypes';
import { getAxisEdgeMap, getCubeFace } from '../common/utils';
import { Cubie, CubieMultiColored } from './Cubie/Cubie';
import { CubieMeta } from './CubieMeta/CubieMeta';
import { CubieSide } from './CubieSide/CubieSide';

export type TCubieFactory = (
  coords: { xIndex: number; yIndex: number; zIndex: number },
  n: number,
  cubeFaceColorMap: Map<ECubeFace, EColor>
) => Cubie;

export const CubieFactory: TCubieFactory = (
  coords: { xIndex: number; yIndex: number; zIndex: number },
  n: number,
  cubeFaceColorMap
) => {
  const axisEdgeMap: IAxisEdgeMap = getAxisEdgeMap(
    new Vector3(coords.xIndex, coords.yIndex, coords.zIndex),
    n
  );
  const cubieMeta = new CubieMeta({
    coords: new Vector3(coords.xIndex, coords.yIndex, coords.zIndex),
    sides: Object.entries(axisEdgeMap)
      .map(([axis]) => {
        const edgeType = axisEdgeMap[(axis as unknown) as EAxis];
        return edgeType === null
          ? undefined
          : new CubieSide(
              cubeFaceColorMap.get(
                getCubeFace((axis as unknown) as EAxis, edgeType)
              ),
              AXIS_EDGE_CUBE_SIDE_MAP[axis as EAxis][edgeType],
              getCubeFace((axis as unknown) as EAxis, edgeType)
            );
      })
      .filter(Boolean),
  });

  const cubie = new CubieMultiColored(cubieMeta);
  return cubie;
};
