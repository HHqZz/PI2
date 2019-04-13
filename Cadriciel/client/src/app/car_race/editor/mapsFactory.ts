import { Point } from "./points";
import { Segment } from "./segments";
import { EditorRenderService, GRID_SIZE } from "./editorRender.service";
import { Vector3, Object3D, Raycaster, Intersection } from "three";
import { ITrackSegment } from "../map/mapObjects/iTrackSegment";

const LEFT_CLICK: number = 0;
const RIGHT_CLICK: number = 2;
const TWO: number = 2;
let selectedPoint: Point;

export class MapsFactory {

    private points: Point[];
    private segments: Segment[];
    private window: HTMLCanvasElement;
    private trackClosed: boolean;
    private selectionMode: boolean;
    private isDragging: boolean;

    public constructor(private render: EditorRenderService) {
        this.points = [];
        this.segments = [];
        this.window = this.render.dom;
        this.trackClosed = false;
        this.selectionMode = false;
        this.isDragging = false;
    }

    public getPoints(): Point[] { return this.points; }
    public getSegments(): Segment[] { return this.segments; }

    public trackValidity(): boolean {
        for (const segment of this.segments) {
            if (!segment.isValid) { return false; }
        }

        return this.trackClosed;
    }

    public saveSegment(): ITrackSegment[] {
        const trackSegments: ITrackSegment[] = [];

        if (this.trackValidity()) {

            (this.segments).forEach((segment) => {
                trackSegments.push({
                    start: new Vector3(segment.start.x, 0, segment.start.y),
                    end: new Vector3(segment.end.x, 0, segment.end.y),
                    isFirst: segment.isFirst
                });
            });

        }

        return trackSegments;
    }

    public onMouseDown(event: MouseEvent): void {

        if (event.button === RIGHT_CLICK) {
            this.removePoint();
        }
        if (event.button === LEFT_CLICK) {
            if (this.selectionMode) {
                selectedPoint = this.objectSelected(this.mousePosition(event)) as Point;
                this.isDragging = true;
            } else {
                this.addPoints(this.mouseAddAdjust(this.mousePosition(event)));
                this.checkIfPointClicked(this.mousePosition(event));
            }
        }
    }

    public onMouseUp(): void {
        this.isDragging = false;
    }

    public onMouseMove(event: MouseEvent): void {
        if (this.isDragging) {
            if (this.checkIfInsideGrid(this.mouseAddAdjust(this.mousePosition(event)))) {
                selectedPoint.position.copy(this.mouseAddAdjust(this.mousePosition(event)));
                this.updateSegments(selectedPoint.position);
            }
        }
    }

    private mousePosition(event: MouseEvent): Vector3 {

        return new Vector3(((event.clientX - this.window.getBoundingClientRect().left) / this.window.clientWidth) * TWO - 1,
                           (-(event.clientY - this.window.getBoundingClientRect().top) / this.window.clientHeight) * TWO + 1, 0);
    }

    private mouseAddAdjust(clickingPos: Vector3): Vector3 {

        clickingPos.unproject(this.render.camera);

        const projection: Vector3 = clickingPos.sub(this.render.camera.position).normalize();

        const distanceToCamera: number = -this.render.camera.position.z / projection.z;

        return this.render.camera.position.clone()
            .add(projection.multiplyScalar(distanceToCamera));
    }

    private objectSelected(mouse: Vector3): Object3D {
        const raycaster: Raycaster = new Raycaster();
        raycaster.setFromCamera(mouse, this.render.camera);
        let selectedObject: Object3D = new Object3D();
        const intersects: Intersection[] = raycaster.intersectObjects(this.points);

        if (intersects.length > 0) {
            selectedObject = intersects[0].object;
        }

        return selectedObject;
    }

    private addPoints(mousePosition: Vector3): void {
        const newPoint: Point = new Point();
        newPoint.setPosition(mousePosition);

        if (this.points.length === 0) {
            newPoint.setAsFirst();
        }

        if (!this.trackClosed && this.checkIfInsideGrid(newPoint.position)) {
            this.render.addToScene(newPoint);
            this.points.push(newPoint);
            if (this.points.length > 1) {
                this.render.addToScene(this.addSegment());
            }
        }
    }

    private addSegment(): Segment {
        const newSegment: Segment = new Segment(this.points[this.points.length - TWO].getPosition(),
                                                this.points[this.points.length - 1].getPosition());

        if (this.segments.length === 0) {
            newSegment.setAsFirst();
        }
        this.segments.push(newSegment);
        this.updateSegments();

        return newSegment;
    }

    private updateSegments(newPosition: Vector3 = new Vector3(0, 0, 0)): void {
        if (this.segments.length > 0) {
            let invalids: Segment[] = [];
            this.segments.forEach((segment) => {
                invalids = invalids.concat(invalids, segment.checkIfValid(this.segments));
                if (this.isDragging) { segment.updatePosition(newPosition); }
            });
            invalids.forEach((invalid) => { invalid.setAsInvalid(); });
        }
    }

    private removePoint(): void {
        this.render.removeFromScene(this.points.pop());

        if (this.points.length > 0) {
            this.render.removeFromScene(this.segments.pop());
            // Remove Second segment if the point closing the track is removed
            if (this.trackClosed) {
                this.render.removeFromScene(this.segments.pop());
            }
        }
        this.trackClosed = false;
        this.selectionMode = false;
    }

    private checkIfPointClicked(mouse: Vector3): void {

        if (this.points.length > 1) {
            // First point clicked
            if (this.objectSelected(mouse) === this.points[0]) {
                this.segments[this.segments.length - 1].updateEnd(this.points[0].getPosition());
                this.render.removeFromScene(this.points.pop());

                if (this.segments.length === TWO) { // Have minimum 3 points
                    this.render.removeFromScene(this.segments.pop());
                } else {
                    this.selectionMode = true;
                    this.trackClosed = true;
                }
                // Existing point clicked
            } else if (this.points.includes(this.objectSelected(mouse) as Point)) {
                this.removePoint();
            }
        } else { /*Do nothing*/ }
    }

    private checkIfInsideGrid(position: Vector3): boolean {
        return (position.x >= -GRID_SIZE / TWO && position.x <= GRID_SIZE / TWO &&
            position.y >= -GRID_SIZE / TWO && position.y <= GRID_SIZE / TWO);
    }
}
