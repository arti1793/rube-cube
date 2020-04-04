import { BoxGeometry, Mesh, MeshBasicMaterial, Scene } from 'three';
import { EColor } from '../Playground/common/CommonConstants';
import { ISceneAttachable } from '../Playground/common/CommonTypes';

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

  public connectTo(scene: Scene) {
    scene.add(this.threeObject);
  }

  protected getMaterial(color: EColor) {
    return new MeshBasicMaterial({ color, wireframe: false });
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
