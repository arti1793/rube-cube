import { Matrix4, Vector3 } from 'three';
import { EColor, ECubeFace, ECubieSide } from '../../common/CommonConstants';

const SideVectorMap: Map<ECubieSide, Vector3> = new Map([
  [ECubieSide.top, new Vector3(0, 1, 0)],
  [ECubieSide.bottom, new Vector3(0, -1, 0)],
  [ECubieSide.left, new Vector3(-1, 0, 0)],
  [ECubieSide.right, new Vector3(1, 0, 0)],
  [ECubieSide.front, new Vector3(0, 0, 1)],
  [ECubieSide.back, new Vector3(0, 0, -1)],
]);

const CubeFaceVectorMap: Map<ECubeFace, Vector3> = new Map([
  [ECubeFace.top, new Vector3(0, 1, 0)],
  [ECubeFace.bottom, new Vector3(0, -1, 0)],
  [ECubeFace.backLeft, new Vector3(-1, 0, 0)],
  [ECubeFace.right, new Vector3(1, 0, 0)],
  [ECubeFace.left, new Vector3(0, 0, 1)],
  [ECubeFace.backRight, new Vector3(0, 0, -1)],
]);

/**
 * Cubieside. stores face of cube, cubie side and color. face of cube and cubie side are actialising by "rotate()" method
 */
export class CubieSide {
  public readonly color: EColor;
  public side: ECubieSide;
  public face: ECubeFace;
  private vector: Vector3;

  constructor(color: EColor, side: ECubieSide, face: ECubeFace) {
    this.color = color;
    this.side = side;
    this.face = face;
    this.vector = SideVectorMap.get(side).clone();
  }

  public rotate(matrix: Matrix4) {
    const newVector = this.vector.clone().applyMatrix4(matrix).round();

    const [newSide] = [...SideVectorMap.entries()].find(([, v]) =>
      v.equals(newVector)
    );

    const [newFace] = [...CubeFaceVectorMap.entries()].find(([, v]) =>
      v.equals(newVector)
    );

    this.face = newFace;
    this.side = newSide;
    this.vector = newVector;
  }
}
