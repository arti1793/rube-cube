import { MathUtils, Matrix4, Vector3 } from 'three';
import { EAxis } from '../../common/CommonConstants';
import { ICubieMeta } from '../../common/CommonTypes';
import { CubieSide } from '../CubieSide/CubieSide';

export class CubieMeta implements ICubieMeta {
  public coords: Vector3;
  public sides: CubieSide[];

  constructor(meta: ICubieMeta) {
    this.coords = meta.coords;
    this.sides = meta.sides;
  }

  public rotateMatrix4(rotationalMatrix: Matrix4) {
    // const bias = new Vector3(
    //   Math.floor((NUMBER_OF_CUBIES - 1) / 2),
    //   Math.floor((NUMBER_OF_CUBIES - 1) / 2),
    //   Math.floor((NUMBER_OF_CUBIES - 1) / 2)
    // );
    return new CubieMeta({
      coords: this.coords
        .clone()
        // .sub(bias)
        .applyMatrix4(rotationalMatrix)
        // .add(bias)
        .round(),
      sides: this.sides.map((side) => side.rotate(rotationalMatrix)),
    });
  }

  public rotate(axis: EAxis, angle: number) {
    let pivot: Vector3;
    if (axis === EAxis.x) {
      pivot = new Vector3(1, 0, 0);
    }
    if (axis === EAxis.y) {
      pivot = new Vector3(0, 1, 0);
    }
    if (axis === EAxis.z) {
      pivot = new Vector3(0, 0, 1);
    }
    const rotationalMatrix = new Matrix4().makeRotationAxis(
      pivot,
      MathUtils.degToRad(angle)
    );

    return this.rotateMatrix4(rotationalMatrix);
  }
}
