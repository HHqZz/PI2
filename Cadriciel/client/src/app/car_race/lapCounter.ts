import { Car } from "./car/car";
import { TrackSegment } from "./map/mapObjects/trackSegment";
import { Vector3 } from "three";
import { TRACK_WIDTH } from "../constants";

export class LapCounter {
    private startingZone: Vector3;
    private checkpoints: Array<Vector3>;
    private indexCheckpoints: number[];
    private lapCounter: number;
    private onCheckpoint: boolean;

    public constructor (private _car: Car) {
        this.lapCounter = 1;
        this.checkpoints = [];
        this.indexCheckpoints = [];
        this.startingZone = new Vector3();
        this.onCheckpoint = false;
    }

    public get car(): Car {
        return this._car;
    }

    public get lapCount(): number {
        return this.lapCounter;
    }

    public increaseLap(): void {
        this.lapCounter ++ ;
    }

    public mapCheckpoint(checkpoints: TrackSegment[]): void {
        this.checkpoints = checkpoints.map((c: TrackSegment) => {
            return new Vector3(c.end.x, c.end.y, c.end.z);
        });
        this.indexCheckpoints = checkpoints.map ((index) => 0);
        this.startingZone = checkpoints[0].position;
    }

    public lapCompleted(): boolean {
        this.flagCheckpoint();
        if (this.indexCheckpoints.indexOf(0) !== -1) {

            return false;
        }
        if (this.indexCheckpoints.every(this.isFlagged)) {
            if (this.checkpointPassed(this._car.getPosition(), this.startingZone)) {
                this.indexCheckpoints = this.checkpoints.map ((index) => 0);

                return true;
            }

            return false;
        }

        return false;
    }

    private insideZone(carPosition: Vector3, zone: Vector3): boolean {

        if (carPosition.distanceTo(zone as Vector3) < TRACK_WIDTH + 1) {

            return true;
        }

        return false;
    }

    private leaveZone(carPosition: Vector3, zone: Vector3): boolean {
        if (this.onCheckpoint && carPosition.distanceTo(zone as Vector3) >= TRACK_WIDTH + 1) {
            this.onCheckpoint = false;

            return true;
        }

        return false;
    }

    private checkpointPassed(carPosition: Vector3, checkpointZone: Vector3): boolean {
        if (this.insideZone(carPosition, checkpointZone.clone())) {
            this.onCheckpoint = true;
        }

        return this.leaveZone(carPosition, checkpointZone.clone());
    }

    private flagCheckpoint(): void {
        this.checkpoints.forEach((checkpoint, index) => {
            if (this.checkpointPassed(this._car.getPosition(), checkpoint)) {
                this.indexCheckpoints[index] = 1;
            }
        });
    }

    private isFlagged(value: number): boolean {
        return value > 0;
    }
}
