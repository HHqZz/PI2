import { AnimationsFactory } from "./animationsFactory";

describe("AnimationsFactory", () => {

    let animations: AnimationsFactory;
    beforeEach(async (done: () => void) => {
        animations = new AnimationsFactory();
        done();
    });

    it ("should be created", () => {
        expect(animations).toBeTruthy();
    });
});
