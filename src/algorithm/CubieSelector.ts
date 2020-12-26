import { Vector3 } from "three";
import { Cubie } from "../Cubes/Cubie/Cubie";
import { SideSelector } from "./SideSelector";
import { EColor, ECubeFaceOrActions } from "../common/CommonConstants";
export class CubieSelector {
    public value: Cubie[];
    constructor(cubieList: Cubie[]) {
        this.value = cubieList;
    }
    public getTwoSided() {
        return new CubieSelector(this.value.filter(cubie => cubie.sides.length === 2));
    }
    public getThreeSided() {
        return new CubieSelector(this.value.filter(cubie => cubie.sides.length === 3));
    }
    public getByCoords(vector: Vector3) {
        return new CubieSelector(this.value.filter(cubie => cubie.coords.equals(vector)));
    }
    public sides() {
        return new SideSelector(this.value.map(cubie => cubie.sides).flat());
    }

    public thatHasColor(color: EColor) {
        return new CubieSelector(this.value.filter(cubie => new SideSelector(cubie.sides).ofColor(color).value.length));
    }
    public onFace(face: ECubeFaceOrActions) {
        return new CubieSelector(this.value.filter(cubie => new SideSelector(cubie.sides).withFace(face).value.length));
    }
}
