import { Vector3 } from "three";
import { EColor, ECubeFace } from "../common/CommonConstants";
import { CubeRube } from "../Cubes/CubeRube/CubeRube";
import { SideSelector } from "./SideSelector";
import { CubieSelector } from "./CubieSelector";


export class Algorithm {
  private cubeRube: CubeRube;
  constructor(cubeRube: CubeRube) {
    this.cubeRube = cubeRube;
  }
  public start() {
    this.whiteUp();
    this.solveWhite();
  }

  private solveWhite() {
    const targetSideVector = new Vector3(0, 1, 1);
    while (new CubieSelector(this.cubeRube.cubiesLocated).sides().ofColor(EColor.white).withFace(ECubeFace.U).value.length !== 4) {
      while (new CubieSelector(this.cubeRube.cubiesLocated).getByCoords(targetSideVector).sides().withFace(ECubeFace.U).ofColor(EColor.white).value.length) {
        // rotate cube by y;
      }
      const cubies = new CubieSelector(this.cubeRube.cubiesLocated).thatHasColor(EColor.white).onFace(ECubeFace.F);


    }
  }
  private whiteUp() { }

}
