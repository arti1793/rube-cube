import {
  AxesHelper,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EColor, NUMBER_OF_CUBIES, EAxis } from '../common/CommonConstants';
import { CubeRube } from '../Cube/CubeRube';
import { ManipulationController } from '../ManipulationController/ManipulationController';

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

  public cubeRube = new CubeRube(NUMBER_OF_CUBIES);
  public manipulationController = new ManipulationController(this.cubeRube);

  private fpsInterval = 15;

  private fps = 40;
  private lastDrawTime: number;
  private frameCount: number;
  private lastSampleTime: number;
  constructor(element: Element) {
    if (!element) {
      throw new Error('please specify element to append a cuberube to');
    }

    /** viewport sizes */
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.setCameraPosition();

    /** mounting point */
    element.appendChild(this.renderer.domElement);
    this.renderButtons();

    this.scene.matrixAutoUpdate = true;
    this.scene.autoUpdate = true;
    this.cubeRube.connectTo(this.scene);
    this.scene.add(this.axisHelper);
    this.scene.background = new Color(EColor.white);

    this.startAnimating(this.fps);
  }

  public setCameraPosition = () => {
    /** camera position */
    this.camera.position.y = 8 * 100;
    this.camera.position.z = 8 * 100;
    this.camera.position.x = 8 * 100;
  };

  public renderButtons = () => {
    const nList: number[] = new Array(NUMBER_OF_CUBIES)
      .fill(null)
      .map((_, index) => index);

    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.bottom = '0';
    for (const [, axis] of Object.entries(EAxis)) {
      const wrapperAxis = document.createElement('div');

      for (const index of nList) {
        const button = document.createElement('button');
        button.textContent = `${axis}_${index}`;
        button.style.width = '100px';
        button.style.height = '50px';
        button.onclick = () => this.cubeRube.startAnimation(90, axis, index);
        button.oncontextmenu = () =>
          this.cubeRube.startAnimation(-90, axis, index);
        wrapperAxis.append(button);
      }
      wrapper.append(wrapperAxis);
    }
    document.body.append(wrapper);
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
    requestAnimationFrame(this.animate);

    const elapsed = now - this.lastDrawTime;
    if (elapsed > this.fpsInterval) {
      this.lastDrawTime = now - (elapsed % this.fpsInterval);

      this.render();

      this.frameCount++;
    }
  };

  private render = () => {
    this.controls.update();

    this.cubeRube.animationHook();

    this.renderer.render(this.scene, this.camera);
  };
}
