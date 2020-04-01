import { Cube } from './Cube';

export function CubeComposer(cubeList: Cube[]) {
    for (const [index, cube] of Object.entries(cubeList)) {
        cube.mesh.translateX(parseInt(index) * cube.shapeSize);
    }
    return cubeList.map(cube => cube.mesh);
}

/**
 * @param edges ребра
 * @param faces грани
 * @param tops вершины
 * @param n размерность
 */
export function generateCubes(edges: number, faces: number, tops: number, n: number) {
    const oneColored = n * n * faces;
    const twoColored = edges * (n - 2);
    const threeColored = tops;
    // TODO
}
