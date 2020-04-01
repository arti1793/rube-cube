import { Scene, PerspectiveCamera, WebGLRenderer, Color, Group, AxesHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EColor } from './common/CommonConstants';
import { generateCubes } from './CubeComposerStrategies';
import { Cube } from './Cube';

export class Playground {

    scene = new Scene();
    camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 100, 100000);
    renderer = new WebGLRenderer();

    controls = new OrbitControls(this.camera, this.renderer.domElement);

    axisHelper = new AxesHelper(5000);

    cubeList: Cube[] = generateCubes(3);
    constructor(element: Element) {
        if (!element) throw new Error('please specify element to append a cube to');

        /** viewport sizes */
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.setCameraPosition();

        /** mounting point */
        element.appendChild(this.renderer.domElement);


        console.log(this.cubeList);
        const cubeGroup = new Group();
        cubeGroup.add(...this.cubeList.map(cube => cube.mesh));
        this.scene.add(this.axisHelper);
        this.scene.add(cubeGroup);
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
