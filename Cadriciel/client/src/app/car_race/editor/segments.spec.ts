import { Segment } from "./segments";
import { Vector3, Vector2 } from "three";

describe ("Segments", () => {
    let firstSegment: Segment;
    let lastSegment: Segment;
    let newSegment: Segment;
    let segments: Segment[];
    beforeEach(async (done: () => void) => {
         /* tslint:disable: no-magic-numbers */
        firstSegment = new Segment(new Vector3(0, 2, 3), new Vector3(0, 6, 15));

        done();
    });

    it ("should be created", () => {
        firstSegment = new Segment(new Vector3(0, 2, 3), new Vector3(0, 6, 15));
        expect(firstSegment).toBeTruthy();
    });

    it ("should be marked as first", () => {
        firstSegment = new Segment(new Vector3(0, 2, 3), new Vector3(0, 6, 1));
        firstSegment.setAsFirst();
        expect(firstSegment.isFirst).toBeTruthy();
    });

    it ("should be marked as invalid ", () => {
        newSegment = new Segment(new Vector3(2, 3, 3), new Vector3(2, 1, 3));
        newSegment.setAsInvalid();
        expect(newSegment.isValid).toBeFalsy();
    });

    it ("should be marked as valid ", () => {
        newSegment = new Segment(new Vector3(26, 15, 3), new Vector3(20, 1, 3));
        newSegment.setAsValid();
        expect(newSegment.isValid).toBeTruthy();
    });

    it ("should return the angle with another segment", () => {
        /* tslint:disable: no-magic-numbers */
        lastSegment = new Segment(new Vector3(0, 2, -1), new Vector3(0, 6, -1));
        newSegment = new Segment(new Vector3(0, 6, -1), new Vector3(0, 4, -1));
        expect(newSegment["angleWith"](lastSegment)).toEqual(Math.PI);
    });

    it ("should return relatives", () => {
        /* tslint:disable: no-magic-numbers */
        const points: Vector3[] = [
            new Vector3(-1, 4, 8),
            new Vector3(0, 3, 5),
            new Vector3(20, 7, 6),
            new Vector3(10, -2, 7)
        ];
        const segmentA: Segment = new Segment(points[0], points[1]);
        const segmentB: Segment = new Segment(points[1], points[2]);
        const segmentC: Segment = new Segment(points[2], points[3]);

        const segmentsArray: Segment[] = [segmentA, segmentB, segmentC];
        const expectedRelatives: Segment[] = [segmentA, segmentC];

        expect(segmentB["findRelatives"](segmentsArray).length).toEqual(2);
        expect(segmentB["findRelatives"](segmentsArray)).toEqual(expectedRelatives);
    });

    it ("should be invalid because the angle is less than 45 degrees", () => {
        lastSegment = new Segment(new Vector3(8, 7, 3), new Vector3(26, 15, 3));
        newSegment = new Segment(new Vector3(26, 15, 3), new Vector3(20, 1, 3));
        segments = [lastSegment, newSegment];
        expect(newSegment.checkIfValid(segments)).toEqual(segments);
    });

    it ("should be marked as valid because the width is less than length*2*factor", () => {
        newSegment = new Segment(new Vector3(1, -10, -1), new Vector3(40, 20, -1));
        newSegment["checkLength"]();
        expect(newSegment.isValid).toBeTruthy();
    });

    it ("should be marked as invalid because the width is greater than length*2", () => {
        newSegment = new Segment(new Vector3(1, 2, -1), new Vector3(0, 1, -1));
        newSegment["checkLength"]();
        expect(newSegment.isValid).toBeFalsy();
    });

    it ("should be marked as invalid because the new segment is crossing another", () => {
        firstSegment = new Segment(new Vector3(4, 7, -1), new Vector3(21.5, 7, -1));
        lastSegment = new Segment(new Vector3(21.5, 7, -1), new Vector3(21.5, 1, -1));
        newSegment = new Segment(new Vector3(21.5, 1, -1), new Vector3(17, 15, -1));
        segments = [firstSegment, lastSegment, newSegment];
        const invalids: Segment[] = [firstSegment, newSegment, lastSegment ];
        expect(newSegment.checkIfValid(segments)).toEqual(invalids);
    });

    it ("should be valid because all contraints are respected", () => {
        firstSegment = new Segment(new Vector3(4, 14, -1), new Vector3(21.5, 14, -1));
        lastSegment = new Segment(new Vector3(21.5, 14, -1), new Vector3(21.5, 1, -1));
        newSegment = new Segment(new Vector3(21.5, 1, -1), new Vector3(21.5, -12, -1));
        segments = [firstSegment, lastSegment, newSegment];
        expect(newSegment.checkIfValid(segments)).toEqual([]);
    });

    it ("should detect the direction of the rotation", () => {
        newSegment = new Segment(new Vector3(21.5, 1, -1), new Vector3(17, 15, -1));
        const points: Vector2[] = [
            new Vector2(4, 7),
            new Vector2(21.5, 7),
            new Vector2(21.5, 1),
            new Vector2(17, 15)
        ];
        expect(newSegment["rotationDirection"](points[0], points[1], points[2])).toEqual(-1);
    });

    it ("should find an intersection", () => {
        newSegment = new Segment(new Vector3(21.5, 1, -1), new Vector3(17, 15, -1));
        const points: Vector2[] = [
            new Vector2(4, 7),
            new Vector2(21.5, 7),
            new Vector2(21.5, 1),
            new Vector2(17, 15)
        ];
        expect(newSegment["intersects"](points)).toBeTruthy();
    });
});
