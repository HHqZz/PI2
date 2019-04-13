import { TextAnimation } from "./textAnimation";

describe("TextAnimation", () => {

    let textAnim: TextAnimation;
    beforeEach(async (done: () => void) => {
        textAnim = new TextAnimation("T");
        done();
    });

    it ("should be created", () => {
        expect(textAnim).toBeTruthy();
    });

    it ("should be invisible when created", () => {
        expect(textAnim.visible).toEqual(false);
    });

    it ("should set the visibility to true", () => {
        textAnim.setVisibility(true);
        expect(textAnim.visible).toEqual(true);
    });
});
