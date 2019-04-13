import { STYLE_CLUE_MOUSE_ENTER, STYLE_CLUE } from "../../../../../../common/communication/style";

export class EventMouse {
    public mouseEnter(wordsFound: boolean, initStyle: {}): {} {
        if (wordsFound) {
            return initStyle;
        }

        return STYLE_CLUE_MOUSE_ENTER;
    }

    public mouseLeave(wordsFound: boolean, initStyle: {}): {} {
        if (wordsFound) {
            return initStyle;
        }

        return STYLE_CLUE;
    }
}
