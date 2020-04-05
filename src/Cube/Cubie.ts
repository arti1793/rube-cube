import {
  BoxGeometry,
  MathUtils,
  Matrix3,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
} from 'three';
import { EAxis, EColor, NUMBER_OF_CUBIES } from '../common/CommonConstants';
import { ISceneAttachable } from '../common/CommonTypes';

export enum ECubieSide {
  right,
  left,
  top,
  bottom,
  front,
  back,
}

const rotationalMatrixX = (angle: number) => {
  const matrix = new Matrix3();
  matrix.elements = [
    [1, 0, 0],
    [0, Math.round(Math.cos(angle)), -Math.round(Math.sin(angle))],
    [0, Math.round(Math.sin(angle)), Math.round(Math.cos(angle))],
  ].flat(1);
  return matrix;
};
const rotationalMatrixY = (angle: number) => {
  const matrix = new Matrix3();
  matrix.elements = [
    [Math.round(Math.cos(angle)), 0, Math.round(Math.sin(angle))],
    [0, 1, 0],
    [-Math.round(Math.sin(angle)), 0, Math.round(Math.cos(angle))],
  ].flat(1);
  return matrix;
};

const rotationalMatrixZ = (angle: number) => {
  const matrix = new Matrix3();
  matrix.elements = [
    [Math.round(Math.cos(angle)), -Math.round(Math.sin(angle)), 0],
    [Math.round(Math.sin(angle)), Math.round(Math.cos(angle)), 0],
    [0, 0, 1],
  ].flat(1);
  return matrix;
};

/** black cube with given size */
export class Cubie implements ISceneAttachable {
  public readonly shapeSize = 100;

  public threeObject: Mesh;

  public meta: {
    coords?: Vector3;
    colors?: EColor[];
  } = {};

  // all the cubes are black from the start
  protected materials = [
    this.getMaterial(EColor.black),
    this.getMaterial(EColor.black),
    this.getMaterial(EColor.black),
    this.getMaterial(EColor.black),
    this.getMaterial(EColor.black),
    this.getMaterial(EColor.black),
  ];

  private axisToRotationalMatrixMap = {
    [EAxis.x]: rotationalMatrixX,
    [EAxis.y]: rotationalMatrixY,
    [EAxis.z]: rotationalMatrixZ,
  };

  private geometry: BoxGeometry;

  constructor() {
    this.geometry = new BoxGeometry(
      this.shapeSize,
      this.shapeSize,
      this.shapeSize,
      15,
      15,
      15
    );
    this.threeObject = new Mesh(this.geometry, this.materials);
  }

  public applyRotationMatrix(
    matrix: Matrix4,
    options: { axis: EAxis; positive: boolean; deg: number }
  ) {
    // commits position of cubie saved in rotationGroup's matrix
    this.threeObject.applyMatrix4(matrix);
    // Updating coords metadata applying rotating matrix on biased index vectors
    this.meta.coords = this.rotateCoordsOnAxis(
      options.axis,
      options.positive ? options.deg : -options.deg,
      NUMBER_OF_CUBIES
    );
  }

  public connectTo(scene: Scene) {
    scene.add(this.threeObject);
  }

  protected getMaterial(color: EColor) {
    return new MeshBasicMaterial({ color, wireframe: false });
  }

  private rotateCoordsOnAxis(axis: EAxis, angleDeg: number, n: number) {
    const angleInRadians = MathUtils.degToRad(-angleDeg);
    const bias = new Vector3(
      Math.floor((n - 1) / 2),
      Math.floor((n - 1) / 2),
      Math.floor((n - 1) / 2)
    );
    const cubieVector = this.meta.coords.clone();

    const biased: Vector3 = cubieVector.sub(bias);

    const matriced = biased.applyMatrix3(
      this.axisToRotationalMatrixMap[axis](angleInRadians)
    );
    const result = matriced.add(bias);

    return result;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CubieMultiColored extends Cubie {
  constructor(sideColorMap: Map<ECubieSide, EColor>) {
    super();
    this.changeSideColors(sideColorMap);
  }

  public changeSideColors = (sideColorMap: Map<ECubieSide, EColor>) => {
    const materials = this.materials.map((material, side) =>
      sideColorMap.has(side)
        ? this.getMaterial(sideColorMap.get(side))
        : material
    );
    this.materials = materials;
    this.threeObject.material = this.materials;
  };
}
