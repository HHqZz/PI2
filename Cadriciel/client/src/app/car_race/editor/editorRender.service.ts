import { Injectable } from "@angular/core";
import { WebGLRenderer, Scene, AmbientLight, PerspectiveCamera, GridHelper, Color,
         Object3D, Camera } from "three";
import { Segment } from "./segments";
import { EDITOR_SEGMENT, EDITOR_POINT, PI_OVER_2 } from "../../constants";
import { Point } from "./points";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 100;
const CAMERA_ELEVATION: number = 130;

export const GRID_SIZE: number = 300;
const GRID_SQUARES: number = 100;
const BACKGROUND_COLOR: number = 0xE6F2FF;
const GREEN: number = 0x006622;
const GREY: number = 0x333333;

@Injectable()
export class EditorRenderService {
    private container: HTMLDivElement;
    private renderer: WebGLRenderer;
    private _scene: THREE.Scene;
    private _camera: PerspectiveCamera;
    private  grid: GridHelper;

    public constructor() {
    }

    public getRenderer(): WebGLRenderer {
        return this.renderer;
    }
    public getScene(): THREE.Scene {
        return this._scene;
    }
    public initialize(container: HTMLDivElement): void {
        if (container) {
            this.container = container;
        }
        this.createScene();
        this.startRenderingLoop();
    }

    private update(): void {
        this._camera.position.set(0, 0, CAMERA_ELEVATION);
        this._camera.lookAt(this._scene.position);
    }

    private createScene(): void {
        this._scene = new Scene();

        this._camera = new PerspectiveCamera( FIELD_OF_VIEW, this.getAspectRatio(), NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE );
        this._scene.add(this._camera);
        this._camera.position.set(0, 0, CAMERA_ELEVATION);
        this._camera.lookAt(this._scene.position);

        this._scene.add( this.generateGrid() );
        this._scene.background = new Color(BACKGROUND_COLOR);
        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
    }

    private generateGrid(): GridHelper {
        this.grid = new GridHelper(GRID_SIZE, GRID_SQUARES);
        this.grid.rotateX(PI_OVER_2);
        this.grid.position.set(0, 0, -1);

        return this.grid;
    }

    public prepareForScreenShot(): void {
        this.switchEditorScene();
        this.hideGrid();
    }

    private switchEditorScene(): void {
        this.switchBackGround();
        this.setElementsMaterials();
    }

    private hideGrid(): void {
        this.grid.visible = false;
    }

    private switchBackGround(): void {
        this._scene.background = new Color(GREEN);
    }

    private setElementsMaterials(): void {
        this._scene.children.forEach((object) => {
            if (object.name === EDITOR_SEGMENT) {
                this._scene.add((object as Segment).previewMaterial(GREY));
            } else if (object.name === EDITOR_POINT) {
                (object as Point).previewMaterial(GREY);
            }
        });
    }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this.renderer.render(this._scene, this._camera);
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    public onResize(): void {
        this._camera.aspect = this.getAspectRatio();
        this._camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public addToScene(object: Object3D): void {
        this._scene.add(object);
    }

    public removeFromScene(object: Object3D): void {
        this._scene.remove(object);
    }

    public get camera(): Camera {
        return this._camera;
    }

    public get dom(): HTMLCanvasElement {
        return this.renderer.domElement;
    }
}
