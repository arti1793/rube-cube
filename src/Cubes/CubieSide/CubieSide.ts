import { Matrix4, Vector3 } from 'three';
import { EColor, ECubeFaceOrActions, ECubieSide } from '../../common/CommonConstants';

const SideVectorMap: Map<ECubieSide, Vector3> = new Map([
  [ECubieSide.top, new Vector3(0, 1, 0)],
  [ECubieSide.bottom, new Vector3(0, -1, 0)],
  [ECubieSide.left, new Vector3(-1, 0, 0)],
  [ECubieSide.right, new Vector3(1, 0, 0)],
  [ECubieSide.front, new Vector3(0, 0, 1)],
  [ECubieSide.back, new Vector3(0, 0, -1)],
]);

const CubeFaceVectorMap: Map<ECubeFaceOrActions, Vector3> = new Map([
  [ECubeFaceOrActions.U, new Vector3(0, 1, 0)],
  [ECubeFaceOrActions.D, new Vector3(0, -1, 0)],
  [ECubeFaceOrActions.L, new Vector3(-1, 0, 0)],
  [ECubeFaceOrActions.R, new Vector3(1, 0, 0)],
  [ECubeFaceOrActions.F, new Vector3(0, 0, 1)],
  [ECubeFaceOrActions.B, new Vector3(0, 0, -1)],
]);

/**
 * Cubieside. stores face of cube, cubie side and color. face of cube and cubie side are actualising by "rotate()" method
 */
export class CubieSide {
  public readonly color: EColor;
  public side: ECubieSide;
  public face: ECubeFaceOrActions;

  constructor(color: EColor, side: ECubieSide, face: ECubeFaceOrActions) {
    this.color = color;
    this.side = side;
    this.face = face;
  }

  public rotate(matrix: Matrix4) {
    const newVector = SideVectorMap.get(this.side)
      .clone()
      .clone()
      .applyMatrix4(matrix)
      .round();

    const [newSide] = [...SideVectorMap.entries()].find(([, v]) =>
      v.equals(newVector)
    );

    const [newFace] = [...CubeFaceVectorMap.entries()].find(([, v]) =>
      v.equals(newVector)
    );

    return new CubieSide(this.color, newSide, newFace);
  }
}
