import { Vector3, Mesh, MeshBasicMaterial, PlaneGeometry, Vector2, CircleGeometry } from "three";
import { EDITOR_SEGMENT } from "../../constants";

const SEGMENT_COLOR: number = 0x4D004D;
const INVALID_SEGMENT_COLOR: number = 0xFF0000;
const NUMBER_TWO: number = 2;
const DEPTH: number = 0;
const WIDTH: number = 4;
const LENGTH_LIMIT: number = 7;
const ANGLE_MIN: number = Math.PI / (NUMBER_TWO * NUMBER_TWO);
const CLOCK_WISE: number = -1;
const COUNTER_CLOCK_WISE: number = 1;
const ALIGNED: number = 0;
enum INDEX {
        ZERO = 0, ONE = 1, TWO = 2, THREE = 3
      }

const RADIUS: number = 2;
const ARCS: number = 32;
export class Segment extends Mesh {

    private width: number;
    private length: number;
    private _isFirst: boolean;
    private _isValid: boolean;
    private _start: Vector3;
    private _end: Vector3;

    public constructor (start: Vector3, end: Vector3) {

        const geometry: PlaneGeometry = new PlaneGeometry(Math.sqrt((Math.pow((end.x - start.x), NUMBER_TWO)
             + Math.pow((end.y - start.y), NUMBER_TWO))), WIDTH);
        const segmentMaterial: MeshBasicMaterial = new MeshBasicMaterial({color: SEGMENT_COLOR, depthWrite: false});
        super(geometry, segmentMaterial);

        this["material"] = segmentMaterial;
        this.length = this.scaleLength(start, end);
        this.width = geometry.parameters.height;
        this._start = start;
        this._end = end;
        this._isFirst = false;
        this._isValid = true;
        this.name = EDITOR_SEGMENT;
    }

    public get start(): Vector3 {
        return this._start;
    }

    public get end(): Vector3 {
        return this._end;
    }

    private scaleLength(start: Vector3, end: Vector3): number {
        const length: number = Math.sqrt((Math.pow((end.x - start.x), NUMBER_TWO) + Math.pow((end.y - start.y), NUMBER_TWO)));

        const middleX: number = (start.x + end.x) / NUMBER_TWO;
        const middleY: number = (start.y + end.y) / NUMBER_TWO;

        const deltaX: number = end.x - start.x;
        const deltaY: number = end.y - start.y;
        const angle: number = Math.atan(deltaY / deltaX);

        this.position.set(middleX, middleY, DEPTH);
        this.rotation.z = angle;

        return length;
    }

    public setAsFirst(): void {
        this._isFirst = true;
    }

    public updateEnd(newEnd: Vector3): void {
        this._end = newEnd;
        this.updatePosition(newEnd);
    }

    public get isFirst(): boolean {
        return this._isFirst;
    }

    public get isValid(): boolean {
        return this._isValid;
    }

    public setAsInvalid(): void {
        this._isValid = false;
        const segMaterial: MeshBasicMaterial = this["material"] as MeshBasicMaterial;
        segMaterial.color.set(INVALID_SEGMENT_COLOR);
    }

    public setAsValid(): void {
        this._isValid = true;
        const segMaterial: MeshBasicMaterial = this["material"] as MeshBasicMaterial;
        segMaterial.color.set(SEGMENT_COLOR);
    }
    private angleWith( lastSegment: Segment): number {
        const lastSegmentPos: Vector3 = new Vector3(lastSegment._end.x - lastSegment._start.x,
                                                    lastSegment._end.y - lastSegment._start.y,
                                                    lastSegment._end.z - lastSegment._start.z);
        const newSegmentPos: Vector3 = new Vector3( this._end.x - this._start.x,
                                                    this._end.y - this._start.y,
                                                    this._end.z - this._start.z);

        return newSegmentPos.angleTo(lastSegmentPos);
    }

    private findRelatives (segments: Segment[]): Segment[] {
        const relatives: Segment[] = [];
        for ( const segment of segments ) {
            if (segment._start === this._end || segment._end === this._start) {
                relatives.push(segment);
            }
        }

        return relatives;
    }

    public checkIfValid(segments: Segment[]): Segment[] {
        const invalids: Segment[] = [];

        for (const segment of segments) {

            if (!this.findRelatives(segments).includes(segment) && this.checkIntersection(segment)) {
                if (!invalids.includes(segment)) { invalids.push(segment); }
                if (!invalids.includes(this)) {invalids.push(this); }
            }

            for (const relative of segment.findRelatives(segments)) {
                if (segment.checkAngle(relative) && !invalids.includes(segment)) {
                   invalids.push(segment);
                }
            }
            this.setAsValid();
        }
        this.checkLength();

        return invalids;
    }

    private checkLength(): void {
        if (LENGTH_LIMIT * this.width >= this.length) {
            this.setAsInvalid();
        }
    }

    private checkAngle(segment: Segment): boolean {
        return (Math.PI - this.angleWith(segment) < ANGLE_MIN);
    }

    private checkIntersection(segment: Segment): boolean {
        const points: Vector2[] = [
            new Vector2(this._start.x, this._start.y),
            new Vector2(this._end.x, this._end.y),
            new Vector2(segment._start.x, segment._start.y),
            new Vector2( segment._end.x, segment._end.y)
        ];
        if (this !== segment) {
            return this.intersects(points);
        }

        return false;
    }

    private rotationDirection(point1: Vector2, point2: Vector2, point3: Vector2): number {
        if (((point3.y - point1.y) * (point2.x - point1.x)) > ((point2.y - point1.y) * (point3.x - point1.x))) {
            return COUNTER_CLOCK_WISE;
        } else  if (((point3.y - point1.y) * (point2.x - point1.x)) === ((point2.y - point1.y) * (point3.x - point1.x))) {
            return ALIGNED;
        }

        return CLOCK_WISE;
    }

    private intersects(points: Vector2[]): boolean {
        return (this.rotationDirection(points[INDEX.ZERO], points[INDEX.ONE], points[INDEX.THREE])
         !== this.rotationDirection(points[INDEX.ZERO], points[INDEX.ONE], points[INDEX.TWO]))
         &&
         (this.rotationDirection(points[INDEX.ZERO], points[INDEX.TWO], points[INDEX.THREE])
          !== this.rotationDirection(points[INDEX.ONE], points[INDEX.TWO], points[INDEX.THREE]));
    }

    private checkIfMoved(pointPosition: Vector3): boolean {
        return (this._start === pointPosition) || (this._end === pointPosition);
    }

    public updatePosition(position: Vector3): void {
        if (this.checkIfMoved(position)) {
            this.length = this.scaleLength(this._start, this._end);
            this.scale.set(this.length / (this["geometry"] as PlaneGeometry).parameters.width, 1, 1);
        }
    }

    public previewMaterial(color: number = 0x000000): Mesh {
        (this.material as MeshBasicMaterial).color.set(color);
        const junction: Mesh = new Mesh(new CircleGeometry(RADIUS, ARCS),  new MeshBasicMaterial({ color: color, depthWrite: false }));
        junction.position.copy(this.start);

        return junction;
    }
}
