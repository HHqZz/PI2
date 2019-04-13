import { LapCounter } from "./lapCounter";
import { TrackSegment } from "./map/mapObjects/trackSegment";
import { Vector3 } from "three";
import { Car } from "./car/car";
/* import { Car } from "./car/car"; */

// tslint:disable:no-magic-numbers
const TEST_SEGMENTS: TrackSegment[] = [new TrackSegment(new Vector3(1, 0, 4), new Vector3(8, 0, 5)),
                                       new TrackSegment(new Vector3(9, 0, 6), new Vector3(10, 0, 8)),
                                       new TrackSegment(new Vector3(23, 0, -6), new Vector3(20, 0, -35))];
// tslint:enable:no-magic-numbers

describe("LapCounter", () => {
    const lapCounter: LapCounter = new LapCounter(new Car());

    it("should be created", () => {
        expect(lapCounter).toBeDefined();
   });

    it("should fill the checkpoint list", () => {
        lapCounter["mapCheckpoint"](TEST_SEGMENTS);
        expect(lapCounter["checkpoints"].length).toBeGreaterThan(0);
    });

    // tslint:disable:no-magic-numbers
    it("should find the vector with the positions (8, 0, 5) in the checkpoint list", () => {
        let firstVector: Vector3 = new Vector3();
        lapCounter["mapCheckpoint"](TEST_SEGMENTS);
        firstVector = lapCounter["checkpoints"].find((vector: Vector3) => {
            return vector.equals(new Vector3(8, 0, 5));
        });
        expect(firstVector.equals(new Vector3(8, 0, 5))).toBeTruthy();
    });

    it("the car should be inside the zone", () => {
        const carPosition: Vector3 = new Vector3(24, 0, -34);
        const zone: Vector3 = new Vector3(20, 0, -35);
        expect(lapCounter["insideZone"](carPosition, zone)).toBeTruthy();
    });

    it("the car should not be inside the zone", () => {
        const carPosition: Vector3 = new Vector3(-25, 0, -32);
        const zone: Vector3 = new Vector3(20, 0, -35.5 );
        expect(lapCounter["insideZone"](carPosition, zone)).toBeFalsy();
    });

    it("the car should leave the zone", () => {
        const carPosition: Vector3 = new Vector3(35, 0, -34);
        const zone: Vector3 = new Vector3(20, 0, -35);
        lapCounter["onCheckpoint"] = true;
        expect(lapCounter["leaveZone"](carPosition, zone)).toBeTruthy();
    });

    it("the car should still be the zone", () => {
        const carPosition: Vector3 = new Vector3(52, 0, 3);
        const zone: Vector3 = new Vector3(21, 0, -35);
        expect(lapCounter["leaveZone"](carPosition, zone)).toBeFalsy();
    });

    it("the car should still be the zone even though the distance is > TRACK_WIDTH + 1", () => {
        const carPosition: Vector3 = new Vector3(35, 0, -34);
        const zone: Vector3 = new Vector3(-6.897, 0, 32);
        expect(lapCounter["leaveZone"](carPosition, zone)).toBeFalsy();
    });

    it("the car should not pass the checkpoint", () => {
        const carPosition: Vector3 = new Vector3(-60.72777836061028, 0, 16.884572859290234);
        const zone: Vector3 = new Vector3(-30, 0, 35);
        lapCounter["insideZone"](carPosition, zone);
        lapCounter["leaveZone"](carPosition, zone);
        expect(lapCounter["checkpointPassed"](carPosition, zone)).toBeFalsy();
    });

    /* it("should flag an indexCheckpoint at 1", () => {
        let mockCar: Car = new Car();
        let index: number = 0;
        mockCar.setPosition(new Vector3(35, 0,-34));
        console.log(mockCar.getPosition());
        lapCounter["mapCheckpoint"](TEST_SEGMENTS);
        lapCounter["onCheckpoint"] = true;
        lapCounter["flagCheckpointPassed"](mockCar);
        index = (lapCounter["indexCheckpoints"].find((indexFound: Number) => {
            return (indexFound === 1);
        }));
        expect(index).toEqual(1);
    });

    it("should not flag any indexCheckpoint at 1", () => {
        let mockCar: Car = new Car();
        let index: number = 0;
        mockCar.setPosition(new Vector3(35, 0,-34));
        console.log(mockCar.getPosition());
        lapCounter["mapCheckpoint"](TEST_SEGMENTS);
        //lapCounter["onCheckpoint"] = true;
        lapCounter["flagCheckpointPassed"](mockCar);
        index = (lapCounter["indexCheckpoints"].find((indexFound: Number) => {
            return (indexFound === 0);
        }));
        expect(index).toEqual(0);
    }); */

    // tslint:enable:no-magic-numbers
});
