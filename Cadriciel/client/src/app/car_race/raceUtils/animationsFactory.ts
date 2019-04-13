import { TextAnimation } from "./textAnimation";

enum AnimationTime { FIRST = 1, SECOND = 2, THIRD = 3, FOURTH = 4 }
enum Text { ONE = 0, TWO = 1, THREE = 2, GO = 3 }
const TEXT_TO_SHOW: string[] = [ "1", "2", "3", "GO !"];

const DISTANCE_X_GO: number = -3.5;
const DISTANCE_X_ONE: number = -1.5;
const DISTANCE_X_OTHER: number = -1.25;
const DISTANCE_Y: number = 2;
const DISTANCE_Z: number = -4;
export class AnimationsFactory {
    private _textAnimations: TextAnimation[];

    public constructor() {
        this._textAnimations = [new TextAnimation(TEXT_TO_SHOW[Text.ONE]), new TextAnimation(TEXT_TO_SHOW[Text.TWO]),
                                new TextAnimation(TEXT_TO_SHOW[Text.THREE]), new TextAnimation(TEXT_TO_SHOW[Text.GO]) ];
    }

    public get textAnimations(): TextAnimation[] {
        return this._textAnimations;
    }

    public setAnimationsPosition(): void {
        this.textAnimations.forEach((textAnimation) => {
            textAnimation.position.set((textAnimation.text === TEXT_TO_SHOW[Text.GO]) ? DISTANCE_X_GO
            : (textAnimation.text === TEXT_TO_SHOW[Text.ONE]) ? DISTANCE_X_ONE
            : DISTANCE_X_OTHER,        DISTANCE_Y, DISTANCE_Z);
        });
    }

    public start(countDown: number): void {
        if (countDown <= AnimationTime.FIRST) {
            this.switchText(Text.THREE, true);
        } else if (countDown <= AnimationTime.SECOND) {
            this.switchText(Text.THREE, false, Text.TWO);
        } else if (countDown <= AnimationTime.THIRD) {
            this.switchText(Text.TWO, false, Text.ONE);
        } else if (countDown <= AnimationTime.FOURTH) {
            this.switchText(Text.ONE, false, Text.GO);
        } else {
            this.switchText(Text.GO, false);
        }
    }

    private switchText(index: number, isShown: boolean, nextIndex?: number): void {
        this.textAnimations[index].setVisibility(isShown);
        if (nextIndex !== undefined) {
            this.textAnimations[nextIndex].setVisibility(!isShown);
        }
    }

}
