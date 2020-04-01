import { Scene, PerspectiveCamera, WebGLRenderer, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ECubeSide, CubeMultiColored } from './Cube';
import { EColor } from './common/CommonConstants';
import { CubeComposer } from './CubeComposerStrategies';

export class Playground {

    scene = new Scene();
    camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    renderer = new WebGLRenderer();

    controls = new OrbitControls(this.camera, this.renderer.domElement);

    cubeList = [
        new CubeMultiColored(new Map([[ECubeSide.back, EColor.blue], [ECubeSide.left, EColor.red]])),
        new CubeMultiColored(new Map([[ECubeSide.bottom, EColor.blue], [ECubeSide.top, EColor.red]])),
    ];
    constructor(element: Element) {
        if (!element) throw new Error('please specify element to append a cube to');

        /** viewport sizes */
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.setCameraPosition();

        /** mounting point */
        element.appendChild(this.renderer.domElement);


        this.scene.add(...CubeComposer(this.cubeList));
        this.scene.background = new Color(EColor.white);


        this.renderer.domElement.addEventListener('mousemove', this.handleMouseMove);
        this.render();
    }

    setCameraPosition() {
        /** camera position */
        this.camera.position.y = 0;
        this.camera.position.z = 5 * 1000;
        this.camera.position.x = 0;
    }

    handleMouseMove = () => {

    }

    render = () => {
        window.requestAnimationFrame(this.render);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
