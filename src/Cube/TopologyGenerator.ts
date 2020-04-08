import { CUBE_FACE_COLOR_MAP } from '../common/CommonConstants';
import { Cubie } from './Cubie';
import { CubieFactory, TCubieFactory } from './CubieFactory';

function CubieLocator(
  xIndex: number,
  yIndex: number,
  zIndex: number,
  n: number,
  cubieFactory: TCubieFactory
): Cubie {
  const cubie = cubieFactory(
    { xIndex, yIndex, zIndex },
    n,
    CUBE_FACE_COLOR_MAP
  );
  const gap = 5;

  const bias = cubie.shapeSize / 2 - (n / 2) * cubie.shapeSize - gap * (n - 2);
  cubie.threeObject.translateX(xIndex * (cubie.shapeSize + gap) + bias);
  cubie.threeObject.translateY(yIndex * (cubie.shapeSize + gap) + bias);
  cubie.threeObject.translateZ(zIndex * (cubie.shapeSize + gap) + bias);

  return cubie;
}

/**
 * @param edges ребра
 * @param faces грани
 * @param tops вершины
 * @param n размерность
 */
export function TopologyGenerator(n: number): Cubie[] {
  const range = new Array(n).fill(null).map((_, index) => index);

  const cubies: Cubie[] = [];
  for (const xIndex of range) {
    for (const yIndex of range) {
      for (const zIndex of range) {
        cubies.push(CubieLocator(xIndex, yIndex, zIndex, n, CubieFactory));
      }
    }
  }
  return cubies;
}
