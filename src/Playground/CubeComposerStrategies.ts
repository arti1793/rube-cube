import { Cube, ECubeSide, CubeMultiColored } from './Cube';
import { EColor, EAxis, EEdgeType, ECubeFace, AxisEdgeCubeSideMap, CubeFaceColorMap } from './common/CommonConstants';
import { IAxisEdgeMap } from './common/CommonTypes';

const getCubeFace = (axis: EAxis, edgeType: EEdgeType) => {
    const cubeFaceEdgeTypeMap = {
        [ECubeFace.left]: axis === EAxis.z && edgeType === EEdgeType.far,
        [ECubeFace.right]: axis === EAxis.x && edgeType === EEdgeType.far,
        [ECubeFace.top]: axis === EAxis.y && edgeType === EEdgeType.far,
        [ECubeFace.bottom]: axis === EAxis.y && edgeType === EEdgeType.near,
        [ECubeFace.backLeft]: axis === EAxis.x && edgeType === EEdgeType.near,
        [ECubeFace.backRight]: axis === EAxis.z && edgeType === EEdgeType.near,
    };
    const [[face]] = Object.entries(cubeFaceEdgeTypeMap).filter(([_, check]) => check);
    return face as ECubeFace;
};

const getCubeColoredByAxisEdgeMap = (axisEdgeMap: IAxisEdgeMap) => {
    const sideColorMap: Map<ECubeSide, EColor> = new Map([]);

    for (const axis in axisEdgeMap) {
        const edgeType = axisEdgeMap[axis as unknown as EAxis];
        if (edgeType !== null) {
            const side = AxisEdgeCubeSideMap[axis as EAxis][edgeType];

            sideColorMap.set(side, CubeFaceColorMap[getCubeFace(axis as unknown as EAxis, edgeType)]);
        }
    }
    return new CubeMultiColored(sideColorMap);
};



const getAxisEdgeMap = (xIndex: number, yIndex: number, zIndex: number, n: number): IAxisEdgeMap => {
    const isEdgeNear = (index: number) => index === 0;
    const isEdgeFar = (index: number, n: number) => index === n - 1;
    const getEdgeType = (index: number, n: number) => {
        if (isEdgeFar(index, n)) return EEdgeType.far;
        if (isEdgeNear(index)) return EEdgeType.near;
        return null;
    };
    return {
        [EAxis.x]: getEdgeType(xIndex, n),
        [EAxis.y]: getEdgeType(yIndex, n),
        [EAxis.z]: getEdgeType(zIndex, n),
    };
};

function coordinateCubeFactory(xIndex: number, yIndex: number, zIndex: number, n: number) {
    const axisEdgeMap: IAxisEdgeMap = getAxisEdgeMap(xIndex, yIndex, zIndex, n);
    const cube = getCubeColoredByAxisEdgeMap(axisEdgeMap);
    cube.coords = [xIndex, yIndex, zIndex];
    cube.data = axisEdgeMap;


    const centerBias = n / 2 * cube.shapeSize - cube.shapeSize / 2;
    cube.mesh.translateX(xIndex * (100 + cube.shapeSize) - centerBias);
    cube.mesh.translateY(yIndex * (100 + cube.shapeSize) - centerBias);
    cube.mesh.translateZ(zIndex * (100 + cube.shapeSize) - centerBias);

    return cube;
}

/**
 * @param edges ребра
 * @param faces грани
 * @param tops вершины
 * @param n размерность
 */
export function generateCubes(n: number): Cube[] {

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
