import { Vector3 } from "three";
import { FACTOR_TWO, TRACK_WIDTH, PATH_POSITIONS, Path, IPathType, CarNumber } from "../../constants";
import { TrackSegment } from "../map/mapObjects/trackSegment";

const DISTANCE_TO_MIDDLE: number = TRACK_WIDTH / (FACTOR_TWO * FACTOR_TWO);
const FRONT: number = 1;
const BACK: number = -1;

export class PositionsHelper {
    private trackOrientation: number;
    private _firstSegment: TrackSegment;
    private randomPositions: number[];

    public constructor() {
        this.trackOrientation = 1;
        this._firstSegment = new TrackSegment();
        this.randomPositions = [];
    }

    public get randomPosNumbers(): number[] {
        return this.randomPositions;
    }

    public startPositionSetUp(firstSegment: TrackSegment, trackOrientation: number): void {
        this._firstSegment = firstSegment;
        this.trackOrientation = trackOrientation;
    }

    public randomInitialPositions(): Vector3[] {
        this.randomizeCarsPosition();

        return [
            this.initialCarsPositions[this.randomPositions[CarNumber.PLAYER]],
            this.initialCarsPositions[this.randomPositions[CarNumber.CAR_1]],
            this.initialCarsPositions[this.randomPositions[CarNumber.CAR_2]],
            this.initialCarsPositions[this.randomPositions[CarNumber.CAR_3]]
        ];
    }

    private randomizeCarsPosition(): void {
        // tslint:disable-next-line:no-magic-numbers
        const tempNumbers: number[] = [0, 1, 2, 3];
        while (tempNumbers.length) {
            this.randomPositions.push(tempNumbers.splice(
                 tempNumbers.indexOf(this.generateRandomIntegers(0, tempNumbers.length)), 1)[0]);
        }
    }

    private generateRandomIntegers(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public get initialCarsPositions(): Vector3 [] {
        return [
            this.newPosition(PATH_POSITIONS[Path.ONE], FRONT),
            this.newPosition( PATH_POSITIONS[Path.TWO], FRONT),
            this.newPosition(PATH_POSITIONS[Path.THREE], BACK),
            this.newPosition(PATH_POSITIONS[Path.FOUR], BACK)
        ];
    }

    private newPosition(path: IPathType, frontBackFactor: number = 1): Vector3 {
        const pointPosition: Vector3 = new Vector3();

        pointPosition.x = this.newXCoordinate(path.position) * frontBackFactor;
        pointPosition.z = this.newZCoordinate(pointPosition.x, path.position)  * path.side;

        this.adjustPosition(pointPosition);

        return pointPosition;
    }

    private adjustPosition(pointPosition: Vector3): void {
        pointPosition.multiplyScalar(this.trackOrientation)
                     .applyAxisAngle(new Vector3(0, 1, 0), -this._firstSegment.getAngle())
                     .add(this._firstSegment.position);
    }

    private distanceToPoint(path: number): number {
        return Math.sqrt(Math.pow(DISTANCE_TO_MIDDLE, FACTOR_TWO) + Math.pow(path, FACTOR_TWO));
    }

    private newXCoordinate(path: number): number {
        return ( Math.pow(DISTANCE_TO_MIDDLE, FACTOR_TWO) + Math.pow(this.distanceToPoint(path), FACTOR_TWO)
               - Math.pow(path, FACTOR_TWO) ) / (DISTANCE_TO_MIDDLE * FACTOR_TWO);
    }

    private newZCoordinate(xPosition: number, path: number): number {
        return Math.sqrt(Math.pow(this.distanceToPoint(path), FACTOR_TWO) -
                         Math.pow(xPosition, FACTOR_TWO));
    }
}
