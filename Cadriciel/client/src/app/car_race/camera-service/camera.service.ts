import { Injectable } from "@angular/core";
import { Camera3rdPerson } from "../camera-service/Camera3rdPerson";
import { CameraUpperView } from "../camera-service/CameraUpperView";
import { CameraInterface } from "../camera-service/CameraInterface";
import { Car } from "../car/car";
import { CAMERA_ZOOM, CAMERA_INITIAL_ZOOM } from "../../constants";
import { Math } from "three";

const ZOOM_MIN: number = 0.7;
const ZOOM_MAX: number = 1.5;

@Injectable()
export class CameraService {

    private camera3rdPerson: Camera3rdPerson;
    private cameraUpperView: CameraUpperView;
    private currentCamera: CameraInterface;
    private objectToFollow: Car;
    private _zoomLevel: number;
    public cameraOrientation: number;

    public constructor() {
        this.camera3rdPerson = new Camera3rdPerson(0, 0);
        this.cameraUpperView = new CameraUpperView(0, 0);
        this.currentCamera = new CameraInterface(0, 0);
        this.objectToFollow = new Car();

        this.cameraOrientation = 0;
        this._zoomLevel = CAMERA_INITIAL_ZOOM;
    }

    public get zoomLevel(): number {
        return  this._zoomLevel;
    }

    public initialize(container: HTMLElement): void {
        this.camera3rdPerson = new Camera3rdPerson(container.clientWidth, container.clientHeight);
        this.cameraUpperView = new CameraUpperView(container.clientWidth, container.clientHeight);
        this.currentCamera = this.camera3rdPerson;
    }

    public initializeCameras(objectToFollow: Car): void {
        this.objectToFollow = objectToFollow;
        this.initializeCamerasPositions();
    }
    public update(): void {
        this.currentCamera.updatePosition(this.objectToFollow.getPosition(), this.objectToFollow.orientation);
        if (this.currentCamera.type === "OrthographicCamera") {
            this.currentCamera.rotation.z = this.cameraOrientation;
        }
    }

    private initializeCamerasPositions(): void {
        this.cameraUpperView.updatePosition(this.objectToFollow.getPosition());
        this.camera3rdPerson.updatePosition(this.objectToFollow.getPosition(), this.objectToFollow.orientation);
    }
    public getCamera(): CameraInterface {
        return this.currentCamera;
    }

    public onResize(width: number, height: number): void {
        this.currentCamera.setAspect(width, height);
        this.currentCamera.updateProjectionMatrix();
    }

    public toggleCamera(): void {
        this.currentCamera = (this.currentCamera instanceof Camera3rdPerson) ?
            this.cameraUpperView : this.camera3rdPerson;
    }

    public ZoomIn(): void {
        this._zoomLevel += CAMERA_ZOOM;
        this.updateZoom();
    }

    public ZoomOut(): void {
        this._zoomLevel -= CAMERA_ZOOM;
        this.updateZoom();
    }

    public updateZoom(): void {

        if (this._zoomLevel >= ZOOM_MAX) {
            this._zoomLevel = ZOOM_MAX;
        }
        if (this._zoomLevel <= ZOOM_MIN) {
            this._zoomLevel = ZOOM_MIN;
        }

        this.cameraUpperView.zoom = Math.clamp(this._zoomLevel, ZOOM_MIN, ZOOM_MAX);
        this.cameraUpperView.updateProjectionMatrix();

        this.camera3rdPerson.zoom = Math.clamp(this._zoomLevel, ZOOM_MIN, ZOOM_MAX);
        this.camera3rdPerson.updateProjectionMatrix();
    }
}
