import { BoxGeometry, Matrix4, Mesh, MeshBasicMaterial, Scene } from 'three';
import { EColor } from '../../common/CommonConstants';
import { ICubieMeta, ISceneAttachable } from '../../common/CommonTypes';
import { CubieMeta } from '../CubieMeta/CubieMeta';
import { CubieSide } from '../CubieSide/CubieSide';

/** black cube with given size */
export class Cubie extends CubieMeta implements ISceneAttachable {
  public readonly shapeSize = 100;

  public threeObject: Mesh;

  // public meta: Partial<ICubieMeta> = {};

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

  constructor(meta: ICubieMeta) {
    super(meta);
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
    // TODO: actualise cube face data
    const newCubieMeta = super.rotateMatrix4(matrix);
    this.coords = newCubieMeta.coords;
    this.sides = newCubieMeta.sides;
  }

  public connectTo(scene: Scene) {
    scene.add(this.threeObject);
  }

  protected getMaterial(color: EColor) {
    return new MeshBasicMaterial({ color, wireframe: false });
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CubieMultiColored extends Cubie {
  constructor(sidesMeta: CubieMeta) {
    super(sidesMeta);
    this.changeSideColors(sidesMeta);
  }

  public changeSideColors = (sidesMeta: CubieMeta) => {
    const materials = this.materials.map((material, side) => {
      const sideDescription: CubieSide = sidesMeta.sides.find(
        (cubieSide) => side === cubieSide.side
      );
      return sideDescription
        ? this.getMaterial(sideDescription.color)
        : material;
    });
    this.coords = sidesMeta.coords;
    this.sides = sidesMeta.sides;
    this.materials = materials;
    this.threeObject.material = this.materials;
  };
}
