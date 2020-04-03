import { CUBE_FACE_COLOR_MAP } from '../Playground/common/CommonConstants';
import { Cubie } from './Cubie';
import { CubieFactory, TCubieFactory } from './CubieFactory';

export interface ICubieLocated {
  cubie: Cubie;
  coords: [number, number, number];
}

function CubieLocator(
  xIndex: number,
  yIndex: number,
  zIndex: number,
  n: number,
  cubieFactory: TCubieFactory
): ICubieLocated {
  const cubie = cubieFactory(
    { xIndex, yIndex, zIndex },
    n,
    CUBE_FACE_COLOR_MAP
  );

  cubie.threeObject.translateX(xIndex * (5 + cubie.shapeSize));
  cubie.threeObject.translateY(yIndex * (5 + cubie.shapeSize));
  cubie.threeObject.translateZ(zIndex * (5 + cubie.shapeSize));

  return { cubie, coords: [xIndex, yIndex, zIndex] };
}

/**
 * @param edges ребра
 * @param faces грани
 * @param tops вершины
 * @param n размерность
 */
export function TopologyGenerator(n: number): ICubieLocated[] {
  const range = new Array(n).fill(null).map((_, index) => index);

  const cubies: ICubieLocated[] = [];
  for (const xIndex of range) {
    for (const yIndex of range) {
      for (const zIndex of range) {
        cubies.push(CubieLocator(xIndex, yIndex, zIndex, n, CubieFactory));
      }
    }
  }
  return cubies;
}
