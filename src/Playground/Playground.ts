import {
  AxesHelper,
  Color,
  PerspectiveCamera,
  Scene,
  SpotLight,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Algorithm } from '../Algorithm/Algorithm';
import { Node } from '../Algorithm/Node';
import {
  EAxis,
  EColor,
  NUMBER_OF_CUBIES,
  EAction,
} from '../common/CommonConstants';
import { CubeRube } from '../Cubes/CubeRube/CubeRube';
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

  public algorithm = new Algorithm();

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
    this.setEnvironment();
    this.setLight();

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

  public async solve() {
    const solveActions = this.algorithm.start(
      new Node(this.cubeRube.cubiesLocated, Infinity)
    );
    for (const action of solveActions.actions) {
      const actionParsed = Node.parseActionString(action);
      await this.cubeRube.startAnimation(
        actionParsed.angle,
        actionParsed.axis,
        actionParsed.index - Math.floor(NUMBER_OF_CUBIES / 2)
      );
    }
  }
  public renderButtons = () => {
    const nList: number[] = new Array(NUMBER_OF_CUBIES)
      .fill(null)
      .map((_, index) => index);

    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.bottom = '0';
    for (const [axisIndex] of Object.values(EAxis)) {
      const wrapperAxis = document.createElement('div');
      for (const index of nList) {
        const button = document.createElement('button');
        button.textContent = `${
          Object.values(EAction)[parseInt(axisIndex, 10) + index]
        }`;
        button.style.width = '100px';
        button.style.height = '50px';
        button.onclick = () =>
          this.manipulationController.makeAction(
            Object.values(EAction)[parseInt(axisIndex, 10) + index] as EAction
          );
        // button.oncontextmenu = (ev) => {
        //   ev.preventDefault();
        //   this.cubeRube.startAnimation(
        //     -90,
        //     axis,
        //     index - Math.floor(NUMBER_OF_CUBIES / 2)
        //   );
        // };
        wrapperAxis.append(button);
      }
      wrapper.append(wrapperAxis);
    }
    const randomiseButton = document.createElement('button');
    randomiseButton.textContent = 'randomise';
    randomiseButton.style.width = '100px';
    randomiseButton.style.height = '50px';
    randomiseButton.onclick = () => this.manipulationController.randomise();
    wrapper.append(randomiseButton);
    document.body.append(wrapper);
  };

  // TODO
  private setLight() {
    const frontSpot = new SpotLight(0xeeeece);
    frontSpot.position.set(0, 0, 0);
    this.scene.add(frontSpot);
    const frontSpot2 = new SpotLight(0xddddce);
    frontSpot.position.set(500, 500, 500);
    this.scene.add(frontSpot2);
  }

  private setEnvironment() {
    // const loader = new TextureLoader();
    // const wallGeometry = new PlaneGeometry(6000, 6000, 2, 10);
    // const wallMaterial = new MeshBasicMaterial({
    // map: loader.load(background),
    // side: DoubleSide,
    // });
    // const wall = new Mesh(wallGeometry, wallMaterial);
    // wall.position.set(-500, -100, -500);
    // wall.rotateY(Math.PI / 4);
    // this.scene.add(wall);
  }

  private setCameraPosition = () => {
    /** camera position */
    this.camera.position.y = 10 * 100;
    this.camera.position.z = 10 * 100;
    this.camera.position.x = 10 * 100;
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
