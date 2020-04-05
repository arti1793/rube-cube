import {
  BoxGeometry,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
} from 'three';
import { EColor, NUMBER_OF_CUBIES } from '../common/CommonConstants';
import { ISceneAttachable } from '../common/CommonTypes';

export enum ECubieSide {
  right,
  left,
  top,
  bottom,
  front,
  back,
}

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

  /**
   * keeps in sync `this.meta.coords` and actual position and rotation of threejs mesh
   * @param matrix rotational matrix
   */
  public applyRotationMatrix(matrix: Matrix4) {
    // commits position of cubie saved in rotationGroup's matrix
    this.threeObject.applyMatrix4(matrix);
    // Updating coords metadata applying rotating matrix on biased index vectors
    this.meta.coords = this.rotateCoordsOnAxis(NUMBER_OF_CUBIES, matrix);
  }

  public connectTo(scene: Scene) {
    scene.add(this.threeObject);
  }
  public setCoords(vector: Vector3) {
    this.meta.coords = vector;
  }

  protected getMaterial(color: EColor) {
    return new MeshBasicMaterial({ color, wireframe: false });
  }

  private rotateCoordsOnAxis(n: number, matrix: Matrix4) {
    const bias = new Vector3(
      Math.floor((n - 1) / 2),
      Math.floor((n - 1) / 2),
      Math.floor((n - 1) / 2)
    );
    const cubieVector = this.meta.coords.clone();

    const biased: Vector3 = cubieVector.sub(bias);

    const matriced = biased.applyMatrix4(matrix);
    const result = matriced.add(bias);

    return result.round();
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
    this.meta.colors = [...new Set(sideColorMap.values())];
    this.materials = materials;
    this.threeObject.material = this.materials;
  };
}
