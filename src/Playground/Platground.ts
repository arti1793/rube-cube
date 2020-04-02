import {
  AxesHelper,
  Color,
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
  public cubeGroup: Group;

  private fpsInterval = 15;

  private fps = 30;
  private lastDrawTime: number;
  private frameCount: number;
  private lastSampleTime: number;
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
    this.scene.background = new Color(EColor.white);

    this.startAnimating(this.fps);
  }

  public setCameraPosition = () => {
    /** camera position */
    this.camera.position.y = 8 * 100;
    this.camera.position.z = 8 * 100;
    this.camera.position.x = 8 * 100;
  };

  private startAnimating = (fps: number, sampleFreq: number = 500) => {
    this.fpsInterval = 1000 / fps;
    this.lastDrawTime = performance.now();
    this.lastSampleTime = this.lastDrawTime;
    this.frameCount = 0;

    this.animate(window.performance.now());

    setInterval(this.sampleFps, sampleFreq);
  };

  private sampleFps = () => {
    // sample FPS
    const now = performance.now();
    if (this.frameCount > 0) {
      const currentFps = (
        (this.frameCount / (now - this.lastSampleTime)) *
        1000
      ).toFixed(2);
      document.getElementById('fps').textContent = currentFps + ' fps';

      this.frameCount = 0;
    }

    this.lastSampleTime = now;
  };

  private animate = (now: number) => {
    // request another frame
    requestAnimationFrame(this.animate);

    // calc elapsed time since last loop
    const elapsed = now - this.lastDrawTime;

    // if enough time has elapsed, draw the next frame
    if (elapsed > this.fpsInterval) {
      // Get ready for next frame by setting lastDrawTime=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      this.lastDrawTime = now - (elapsed % this.fpsInterval);

      // draw
      this.render();

      this.frameCount++;
    }
  };

  private render = () => {
    // window.requestAnimationFrame(this.render);
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  };
}
