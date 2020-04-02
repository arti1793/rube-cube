import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import { EColor } from './common/CommonConstants';

export enum ECubeSide {
  right,
  left,
  top,
  bottom,
  front,
  back,
}

export interface ICubeOptions {
  shapeSize: number;
}

/** black cube with given size */
export class Cube {
  public readonly shapeSize = 100;
  // all the cubes were black from the start
  public materials = [
    this.getMaterial(EColor.black),
    this.getMaterial(EColor.black),
    this.getMaterial(EColor.black),
    this.getMaterial(EColor.black),
    this.getMaterial(EColor.black),
    this.getMaterial(EColor.black),
  ];

  public mesh: Mesh;

  public geometry: BoxGeometry;

  constructor() {
    this.geometry = new BoxGeometry(
      this.shapeSize,
      this.shapeSize,
      this.shapeSize,
      15,
      15,
      15
    );
    this.mesh = new Mesh(this.geometry, this.materials);
  }

  protected getMaterial(color: EColor) {
    return new MeshBasicMaterial({ color, wireframe: false });
  }
}

// tslint:disable-next-line: max-classes-per-file
export class CubeMultiColored extends Cube {
  public coords: [number, number, number];
  public data = {};
  constructor(sideColorMap: Map<ECubeSide, EColor>) {
    super();
    this.changeSideColors(sideColorMap);
  }

  public changeSideColors = (sideColorMap: Map<ECubeSide, EColor>) => {
    const materials = this.materials.map((material, side) =>
      sideColorMap.has(side)
        ? this.getMaterial(sideColorMap.get(side))
        : material
    );
    this.materials = materials;
    this.mesh.material = this.materials;
  };
}
