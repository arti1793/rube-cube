import { Vector3 } from "three";
import { EColor, ECubeFace } from "../common/CommonConstants";
import { CubieSide } from "../Cubes/CubieSide/CubieSide";

export class SideSelector {
    public value: CubieSide[];
    constructor(sides: CubieSide[]) {
        this.value = sides;
    }
    public ofColor(color: EColor) {
        return new SideSelector(this.value.filter(side => side.color === color));
    }
    public withFace(face: ECubeFace) {
        return new SideSelector(this.value.filter(side => side.face === face));
    }
    public withCoords(vector: Vector3) {
        return new SideSelector(this.value.filter(side => side.))
    }
}
