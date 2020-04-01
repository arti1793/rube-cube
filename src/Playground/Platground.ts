import { Scene, PerspectiveCamera, WebGLRenderer, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CubeOneColored, ECubeSide, CubeMultiColored } from './Cube';
import { EColor } from './common/CommonConstants';


// interface ICube {
//     geometry: BoxGeometry;
//     material: MeshBasicMaterial;
//     mesh: Mesh;
// }

// const CubeFactory = (shape: number) => ({ colors }: { color: ECubeColors }): ICube => {
//     const geometry = new BoxGeometry(shape, shape, shape, 10, 10, 10);
//     const material = [
//         new MeshBasicMaterial({ color, wireframe: true }), // right
//         new MeshBasicMaterial({ color, wireframe: true }), // left
//         new MeshBasicMaterial({ color, wireframe: true }), // top
//         new MeshBasicMaterial({ color, wireframe: true }), // bottom
//         new MeshBasicMaterial({ color, wireframe: true }), // front
//         new MeshBasicMaterial({ color, wireframe: true }), // back
//     ];
//     const mesh = new Mesh(geometry, material);
//     return {
//         geometry,
//         material,
//         mesh,
//     };
// };

export class Playground {


    // cubeShape = { w: 1000, h: 1000, d: 1000 };
    scene = new Scene();
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    renderer = new WebGLRenderer();

    controls = new OrbitControls(this.camera, this.renderer.domElement);

    // geometry = new BoxGeometry(this.cubeShape.h, this.cubeShape.w, this.cubeShape.d, 10, 10, 10);

    // material = new MeshBasicMaterial({ color: 0xfffff, wireframe: true });

    // cube = new Mesh(this.geometry, this.material);


    cube = [
        new CubeMultiColored(new Map([[ECubeSide.back, EColor.blue], [ECubeSide.left, EColor.red]])),
        new CubeMultiColored(new Map([[ECubeSide.bottom, EColor.blue], [ECubeSide.top, EColor.red]])),
    ]
    constructor(element: Element) {
        if (!element) throw new Error('please specify element to append a cube to');

        /** viewport sizes */
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        /** mounting point */
        element.appendChild(this.renderer.domElement);

        /** camera position */
        this.camera.position.y = 0;
        this.camera.position.z = 5 * 1000;
        this.camera.position.x = 0;

        /**cube centered on 0,0,0 */
        // this.cube.geometry.center();


        for (const [index, { mesh, shapeSize }] of Object.entries(this.cube)) {
            mesh.translateX(parseInt(index) * shapeSize)
            this.scene.add(mesh);
        }
        this.scene.background = new Color(EColor.white);


        this.renderer.domElement.addEventListener('mousemove', this.handleMouseMove);
        this.render();
    }

    handleMouseMove = () => {

    }

    render = () => {
        window.requestAnimationFrame(this.render);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
