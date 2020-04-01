import { Cube } from './Cube';


function coordinateCubeFactory(xIndex: number, yIndex: number, zIndex: number, n: number) {
    const cube = new Cube();
    const centerBias = n / 2 * cube.shapeSize - cube.shapeSize / 2;
    cube.mesh.translateX(xIndex * cube.shapeSize - centerBias);
    cube.mesh.translateY(yIndex * cube.shapeSize - centerBias);
    cube.mesh.translateZ(zIndex * cube.shapeSize - centerBias);
    return cube;
}

/**
 * @param edges ребра
 * @param faces грани
 * @param tops вершины
 * @param n размерность
 */
export function generateCubes(n: number): Cube[] {
    // const oneColored = n * n * faces;
    // const twoColored = edges * (n - 2);
    // const threeColored = tops;

    const list = new Array(n).fill(null).map((_, index) => index);
    console.log(list, arguments);

    const cubes = [];
    for (const xIndex of list) {
        for (const yIndex of list) {
            for (const zIndex of list) {
                cubes.push(coordinateCubeFactory(xIndex, yIndex, zIndex, n));
            }
        }
    }
    return cubes;
}
