import { Injectable } from "@angular/core";
import { Scene, Mesh, Vector3 } from "three";
import { Skybox } from "./skybox";
import { TrackSegment } from "../map/mapObjects/trackSegment";
import { JUNCTION, PLAYER_CAR, RIGHT, LEFT } from "../../constants";
import { Car } from "../car/car";

@Injectable()
export class SceneService extends Scene {

    private _skybox: Skybox;
    private segments: TrackSegment[];
    private _firstSegment: TrackSegment;

    public constructor() {
        super();
        this._skybox = new Skybox();
        this.segments = [];
        this._firstSegment = new TrackSegment(new Vector3(), new Vector3());
    }

    public initialize(): boolean {
        this.add(this._skybox);
        this.add(this._skybox.ground);
        this.add(this._skybox.lighting);

        return this.children.includes(this._skybox);
    }

    public switchNightDay(): void {
        this.remove(this._skybox.lighting);
        this._skybox.switchDayNight();
        this.add(this._skybox.lighting);
    }

    public get skybox(): Skybox {
        return this._skybox;
    }

    public get nightDayMode(): boolean {
        return this._skybox.nightAndDay;
    }

    public get trackSegments(): TrackSegment[] {
        return this.segments;
    }

    public get firstSegment(): TrackSegment {
        return this._firstSegment;
    }

    public saveSegment(segment: TrackSegment): void {
        this.segments.push(segment);
        if (segment.isFirst) { this._firstSegment = segment; }
        this.add(segment);
    }

    public get trackSurfaces(): Mesh[] {
        const surfaces: Mesh[] = this.segments.slice();
        this.children.forEach((object) => {
            if (object.name === JUNCTION) {
                surfaces.push(object as Mesh);
            }
        });

        return surfaces;
    }

    private get playerCar(): Car {
        return this.children.filter((object: Car) => object.name === PLAYER_CAR) [0] as Car;
    }

    public get trackOrientation(): number {
        if (this.orientNormal.dot(new Vector3(0, 1, 0)) > 0) {
            return RIGHT;
        }

        return LEFT;
    }

    private get orientNormal(): Vector3 {
        return this.playerCar.orientation.clone().cross(this.firstSegment.start.clone().sub(this.firstSegment.end));
    }
}
