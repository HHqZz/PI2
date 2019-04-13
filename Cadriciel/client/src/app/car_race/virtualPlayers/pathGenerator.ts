import { Vector3 } from "three";
import { SceneService } from "../render/scene.service";
import { TrackSegment } from "../map/mapObjects/trackSegment";
import { FACTOR_TWO, PATH_POSITIONS, Path, IPathType } from "../../constants";

export interface IAiPoint {
    position: Vector3;
    isCorner?: boolean;
}
export enum RANK { ONE = 1, TWO = 2, THREE = 3, FOUR = 4 }

const RATIO: number = 0.95;
const SCALER: number = 0.0001;
const DIVISION: number = 4;

export class PathGenerator {
    private middlePoint: Vector3;

    public constructor(private sceneService: SceneService, private pathType: IPathType = PATH_POSITIONS[0] ) {
        this.middlePoint = new Vector3();
    }

    public generatePath(): IAiPoint[] {
        return this.generatePoints();
    }

    public generatePoints(): IAiPoint[] {
        let points: IAiPoint[] = [];
        let firstSeg: IAiPoint[];
        for (const segment of this.sceneService.trackSegments.slice()) {
            if (segment.isFirst) {
                firstSeg = this.chopSegment(segment);
                firstSeg.slice(DIVISION / FACTOR_TWO, DIVISION).forEach((point) => {
                    points.push(point);
                });
            } else {
                points = points.concat(this.chopSegment(segment).reverse());
            }
        }
        points = points.slice(0, DIVISION / FACTOR_TWO)
                       .concat(points.slice(DIVISION / FACTOR_TWO, points.length).reverse());

        firstSeg.slice(0, DIVISION / FACTOR_TWO).forEach((point) => {
            points.push(point);
        });

        return points;
    }

    private chopSegment(segment: TrackSegment): IAiPoint[] {
        const segmentChopped: IAiPoint[] = [];

        for (let i: number = 1; i <= DIVISION; i++) {
            const aiPoint: IAiPoint = { position: new Vector3(), isCorner: false};
            this.middlePoint = segment.start.clone().sub(segment.position).divideScalar(FACTOR_TWO).add(segment.position);

            if (i === RANK.ONE) {
                aiPoint.position = this.genPathPoint(segment, -1);
            } else if (i === RANK.TWO) {
                this.middlePoint = new Vector3(segment.position.x, segment.position.y, segment.position.z + SCALER );
                aiPoint.position = this.genPathPoint(segment);
            } else if (i === RANK.THREE) {
                aiPoint.position = this.genPathPoint(segment);
            } else if (i === RANK.FOUR) {
                this.middlePoint = segment.start.clone().sub(segment.position).multiplyScalar(RATIO).add(segment.position);
                aiPoint.position = this.genPathPoint(segment);
                aiPoint.isCorner = true;
            }

            segmentChopped.push(aiPoint);
        }

        return segmentChopped;
    }

    private genPathPoint(segment: TrackSegment, frontBackFactor: number = 1): Vector3 {
        let pointPosition: Vector3 = this.pathPoint(segment, this.pathType.side, frontBackFactor);

        if ( this.leftSidePoints) {
            if (!this.counterClockWise(segment.position.clone(), pointPosition.clone(), segment.start.clone())) {
                pointPosition = this.pathPoint(segment, -this.pathType.side, -frontBackFactor);
            }
        } else if (this.counterClockWise(segment.position.clone(), pointPosition.clone(), segment.start.clone())) {
            pointPosition = this.pathPoint(segment, -this.pathType.side, -frontBackFactor);
        }

        return pointPosition;
    }

    private pathPoint(segment: TrackSegment, leftRightFactor: number = 1, frontBackFactor: number = 1): Vector3 {
        const pointPosition: Vector3 = new Vector3();
        const distanceToMiddle: number = this.middlePoint.distanceTo(segment.position);

        pointPosition.x = this.newXCoordinate(distanceToMiddle) * frontBackFactor;
        pointPosition.z = this.newZCoordinate(distanceToMiddle, pointPosition.x)  * leftRightFactor;

        this.adjustPosition(pointPosition, segment);

        return pointPosition;
    }

    private adjustPosition(pointPosition: Vector3, segment: TrackSegment): void {
        pointPosition.multiplyScalar(this.sceneService.trackOrientation)
                     .applyAxisAngle(new Vector3(0, 1, 0), -segment.getAngle())
                     .add(segment.position);
    }

    private distanceToPoint(distanceToMiddle: number): number {
        return Math.sqrt(Math.pow(distanceToMiddle, FACTOR_TWO) + Math.pow(this.pathType.position, FACTOR_TWO));
    }

    private newXCoordinate(distanceToMiddle: number): number {
        return ( Math.pow(distanceToMiddle, FACTOR_TWO) + Math.pow(this.distanceToPoint(distanceToMiddle), FACTOR_TWO) -
                 Math.pow(this.pathType.position, FACTOR_TWO) ) / (distanceToMiddle * FACTOR_TWO);
    }

    private newZCoordinate(distanceToMiddle: number, xPosition: number): number {
        return Math.sqrt(Math.pow(this.distanceToPoint(distanceToMiddle), FACTOR_TWO) -
               Math.pow(xPosition, FACTOR_TWO));
    }

    private counterClockWise(point1: Vector3, point2: Vector3, point3: Vector3): boolean {
        return ((point3.z - point1.z) * (point2.x - point1.x)) > ((point2.z - point1.z) * (point3.x - point1.x));
    }

    private get leftSidePoints(): boolean {
        return this.pathType === PATH_POSITIONS[Path.ONE] || this.pathType === PATH_POSITIONS[Path.FOUR];
    }

}
