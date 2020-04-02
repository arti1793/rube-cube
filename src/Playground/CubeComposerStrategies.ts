import { Cube, ECubeSide, CubeMultiColored } from './Cube';
import { EColor } from './common/CommonConstants';


enum EEdgeAxisType {
    near = 'near',
    far = 'far',
}

enum EAxis {
    x = 'x',
    y = 'y',
    z = 'z',
}
interface IAxisEdgeMap {
    [EAxis.x]: EEdgeAxisType;
    [EAxis.y]: EEdgeAxisType;
    [EAxis.z]: EEdgeAxisType;
}

const AxisEdgeCubeSideMap = {
    [EAxis.x]: {
        [EEdgeAxisType.near]: ECubeSide.left,
        [EEdgeAxisType.far]: ECubeSide.right,
    },
    [EAxis.y]: {
        [EEdgeAxisType.near]: ECubeSide.bottom,
        [EEdgeAxisType.far]: ECubeSide.top,
    },
    [EAxis.z]: {
        [EEdgeAxisType.near]: ECubeSide.back,
        [EEdgeAxisType.far]: ECubeSide.front
    },
};

const CollorAxisMap = {
    [EAxis.x]: EColor.orange,
    [EAxis.y]: EColor.red,
    [EAxis.z]: EColor.blue,
};

const setCubeColorByAxisEdgeMap = (axisEdgeMap: IAxisEdgeMap) => {
    const sideColorMap: Map<ECubeSide, EColor> = new Map([]);

    for (const axis in axisEdgeMap) {
        const edgeType = axisEdgeMap[axis as unknown as EAxis];
        if (edgeType !== null) {
            const side = AxisEdgeCubeSideMap[axis as EAxis][edgeType];
            sideColorMap.set(side, CollorAxisMap[axis as EAxis]);
        }
    }
    return new CubeMultiColored(sideColorMap);
};

const isEdgeNear = (index: number) => index === 0;
const isEdgeFar = (index: number, n: number) => index === n - 1;
const getEdgeType = (index: number, n: number) => {
    if (isEdgeFar(index, n)) return EEdgeAxisType.far;
    if (isEdgeNear(index)) return EEdgeAxisType.near;
    return null;
};

function coordinateCubeFactory(xIndex: number, yIndex: number, zIndex: number, n: number) {
    // const cube = new CubeMultiColored();

    const axisEdgeMap: IAxisEdgeMap = {
        [EAxis.x]: getEdgeType(xIndex, n),
        [EAxis.y]: getEdgeType(yIndex, n),
        [EAxis.z]: getEdgeType(zIndex, n),
    };
    const cubeColored = setCubeColorByAxisEdgeMap(axisEdgeMap);
    cubeColored.coords = [xIndex, yIndex, zIndex];
    cubeColored.data = axisEdgeMap;


    const centerBias = n / 2 * cubeColored.shapeSize - cubeColored.shapeSize / 2;
    // const centerBias = 0;
    cubeColored.mesh.translateX(xIndex * (100 + cubeColored.shapeSize) - centerBias);
    cubeColored.mesh.translateY(yIndex * (100 + cubeColored.shapeSize) - centerBias);
    cubeColored.mesh.translateZ(zIndex * (100 + cubeColored.shapeSize) - centerBias);




    return cubeColored;
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
