import { CUBE_FACE_COLOR_MAP } from '../Playground/common/CommonConstants';
import { Cubie } from './Cubie';
import { CubieFactory, TCubieFactory } from './CubieFactory';

function CubieLocator(
  xIndex: number,
  yIndex: number,
  zIndex: number,
  n: number,
  cubieFactory: TCubieFactory
) {
  const cube = cubieFactory({ xIndex, yIndex, zIndex }, n, CUBE_FACE_COLOR_MAP);

  cube.threeObject.translateX(xIndex * (5 + cube.shapeSize));
  cube.threeObject.translateY(yIndex * (5 + cube.shapeSize));
  cube.threeObject.translateZ(zIndex * (5 + cube.shapeSize));

  return cube;
}

/**
 * @param edges ребра
 * @param faces грани
 * @param tops вершины
 * @param n размерность
 */
export function TopologyGenerator(n: number): Cubie[] {
  const range = new Array(n).fill(null).map((_, index) => index);

  const cubes = [];
  for (const xIndex of range) {
    for (const yIndex of range) {
      for (const zIndex of range) {
        cubes.push(CubieLocator(xIndex, yIndex, zIndex, n, CubieFactory));
      }
    }
  }
  return cubes;
}
