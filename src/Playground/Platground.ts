import {
  AxesHelper,
  Color,
  Fog,
  Group,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EColor } from './common/CommonConstants';
import { Cube } from './Cube';
import { generateCubes } from './CubeComposerStrategies';

export class Playground {
  public scene = new Scene();
  public camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    100,
    100000
  );
  public renderer = new WebGLRenderer();

  public controls = new OrbitControls(this.camera, this.renderer.domElement);

  public axisHelper = new AxesHelper(500);

  public cubeList: Cube[] = generateCubes(3);
  constructor(element: Element) {
    if (!element) {
      throw new Error('please specify element to append a cube to');
    }

    /** viewport sizes */
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.setCameraPosition();

    /** mounting point */
    element.appendChild(this.renderer.domElement);

    const cubeGroup = new Group();
    cubeGroup.add(...this.cubeList.map(cube => cube.mesh));
    this.scene.add(this.axisHelper);
    this.scene.add(cubeGroup);
    this.scene.background = new Color(EColor.blue);
    this.scene.fog = new Fog(EColor.blue, 1000, 16000);

    this.render();
  }

  public setCameraPosition() {
    /** camera position */
    this.camera.position.y = 8 * 100;
    this.camera.position.z = 8 * 100;
    this.camera.position.x = 8 * 100;
  }

  public render = () => {
    window.requestAnimationFrame(this.render);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
