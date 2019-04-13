import { Headlight, LEFT_POSITION, RIGHT_POSITION, SpotPosition } from "./headlight";

describe ("Headlight", () => {
    let headlightRight: Headlight;

    beforeEach(async (done: () => void) => {
        headlightRight = new Headlight(SpotPosition.FRONT_RIGHT);

        done();
    });

    it("should create a headlight (default)", () => {
        const headlightDefault: Headlight = new Headlight();
        expect(headlightDefault).toBeTruthy();
        expect(headlightDefault.position.x).toBe(RIGHT_POSITION);
    });

    it("should create a left headlight", () => {
            const headlightLeft: Headlight = new Headlight(SpotPosition.FRONT_LEFT);
            expect(headlightLeft.position.x).toBe(LEFT_POSITION);
    });

    it("should create a right headlight", () => {
        expect(headlightRight.position.x).toBe(RIGHT_POSITION);
    });

    it ("should switch off the light", () => {
        const headlight: Headlight = new Headlight();
        expect(headlight.intensity).toBe(0);
        headlight.switchHeadlights(true);
        expect(headlight.intensity).toBe(0);
    });

    it ("should switch on the light", () => {
        const headlight: Headlight = new Headlight();
        expect(headlight.intensity).toBe(0);
        headlight.switchHeadlights(false);
        expect(headlight.intensity).toBeGreaterThan(0);
    });

});
