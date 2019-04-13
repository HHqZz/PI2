import { GridComponent } from "../grid.component";
import { Answer } from "../../../../../../common/communication/answer";
import { KEYCODE_BACKSPACE, KEYCODE_DELETE, KEYCODE_LARROW, KEYCODE_RARROW } from "../../../constants";
import { SocketService } from "./../../serviceMultiplayer/connectionService";
import { IAnswerFound } from "../../../../../../common/communication/answerFoundInterface";
import * as Style from "../../../../../../common/communication/style";

export class EventInput {
    private lastFound: Answer = { word: null, indexI: -1, indexJ: -1, horizontal: false, definition: null };

    public constructor(private gridComponent: GridComponent, private connectionService: SocketService) {
        this.subscribeAnswerFound();
    }

    private subscribeAnswerFound(): void {
        this.connectionService.answerFound.subscribe((answerFound: IAnswerFound) => {
            if (answerFound.answer.word != null && this.connectionService.answerFound.getValue().answer.word !== this.lastFound.word) {
                this.lastFound = answerFound.answer;

                this.writeEntireAnswer(answerFound.answer);
                this.checkValidWords(false);
                if (answerFound.foundBy !== this.connectionService.getMyUsername()) {
                    this.gridComponent.opponentCounter++;
                    this.updateOpponentColor(answerFound);
                }

            }
        });
    }

    private writeEntireAnswer(answerToComplete: Answer): void {
        let compteur: number = 0;
        if (answerToComplete.horizontal) {
            for (let j: number = answerToComplete.indexJ; j < answerToComplete.word.length + answerToComplete.indexJ; j++) {
                this.gridComponent.gridPlayed[answerToComplete.indexI][j]
                    = answerToComplete.word.charAt(compteur++);
                (document.getElementById("cell" + answerToComplete.indexI + j) as HTMLInputElement).value
                    = answerToComplete.word.charAt(compteur - 1);

            }
        } else {
            for (let i: number = answerToComplete.indexI; i < answerToComplete.word.length + answerToComplete.indexI; i++) {
                this.gridComponent.gridPlayed[i][answerToComplete.indexJ]
                    = answerToComplete.word.charAt(compteur++);
                (document.getElementById("cell" + i + answerToComplete.indexJ) as HTMLInputElement).value
                    = answerToComplete.word.charAt(compteur - 1);

            }
        }
    }

    private updateOpponentColor(answerFound: IAnswerFound): void {
        this.changeColorClue(answerFound);
        this.changeColorCells(answerFound);
    }

    private changeColorClue(answerFound: IAnswerFound): void {
        for (let i: number = 0; i < this.gridComponent.answers.length; i++) {
            if (this.gridComponent.answers[i].word === answerFound.answer.word) {
                this.gridComponent.styleClues[i] = Style.STYLE_INDICE_OPPONENT;
            }
        }
    }

    private changeColorCells(answerFound: IAnswerFound): void {
        if (answerFound.answer.horizontal) {
            for (let j: number = answerFound.answer.indexJ; j < answerFound.answer.word.length + answerFound.answer.indexJ; j++) {
                this.changeBackground(answerFound.answer.indexI, j);
            }
        } else {
            for (let i: number = answerFound.answer.indexI; i < answerFound.answer.word.length + answerFound.answer.indexI; i++) {
                this.changeBackground(i, answerFound.answer.indexJ);
            }
        }
    }

    private getCellInput(i: number, j: number): HTMLInputElement {
        return (document.getElementById("cell" + i + j) as HTMLInputElement);
    }

    private changeBackground(i: number, j: number): void {
        this.getCellInput(i, j).style.background
        = (this.getCellInput(i, j).style.background === Style.COLOR_CURRENT_USER) ? Style.COLOR_BOTH : Style.COLOR_OPPONENT;
    }

    public newLetter(searchValue: String, i: number, j: number): void {
        const maxSize: number = this.gridComponent.gridModel.length;

        this.gridComponent.gridPlayed[i][j] =
            searchValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, "").replace(/'/g, "").toUpperCase();

        if (searchValue !== "") {
            let offset: number = 1;
            if (this.gridComponent.focusHorizontal && j !== maxSize - 1) {
                this.getCellInput(i, (j + offset)).focus();
                while (this.getCellInput(i, (j + offset)).disabled && (j + offset) !== maxSize - 1) {
                    this.getCellInput(i, (j + ++offset)).focus();
                }
            } else if (!this.gridComponent.focusHorizontal && i !== maxSize - 1) {
                this.getCellInput((i + offset), j).focus();
                while (this.getCellInput((i + offset), j).disabled && (i + offset) !== maxSize - 1) {
                    this.getCellInput((i + ++offset), j).focus();
                }
            }
        }

        this.gridComponent.stackLetterPlayed.push(j);
        this.gridComponent.stackLetterPlayed.push(i);
        this.checkValidWords(true);

    }

    private checkValidWords(foundByCurrentUser: boolean): void {
        for (let i: number = 0; i < this.gridComponent.answers.length; i++) {
            if (this.checkOneWord(this.gridComponent.answers[i]) && !this.gridComponent.wordsFound[i]) {
                this.gridComponent.wordsFound[i] = true;
                this.gridComponent.styleClues[i] = Style.STYLE_INDICE_CURRENT_USER;
                if (foundByCurrentUser) {
                    this.connectionService.emitWordFound(this.gridComponent.answers[i], this.connectionService.getMyUsername());
                }
                this.confirmeValidWord(this.gridComponent.answers[i], foundByCurrentUser);
            }
        }
    }

    private confirmeValidWord(element: Answer, foundByCurrentUser: boolean): void {
        if (element.horizontal) {
            for (let j: number = element.indexJ; j < element.word.length + element.indexJ; j++) {
                this.confirmOneCell(element.indexI, j, foundByCurrentUser);
            }
        } else {
            for (let i: number = element.indexI; i < element.word.length + element.indexI; i++) {
                this.confirmOneCell(i, element.indexJ, foundByCurrentUser);
            }
        }
    }

    private confirmOneCell(i: number, j: number, foundByCurrentUser: boolean): void {
        this.disableInput(i, j);
        if (foundByCurrentUser) {
            this.colorBackground(i, j);
        }
    }

    private disableInput(i: number, j: number): void {
        this.getCellInput(i, j).disabled = true;
    }

    private colorBackground(i: number, j: number): void {
        const belongToOpponent: boolean = this.getCellInput(i, j).style.background === Style.COLOR_OPPONENT;
        this.getCellInput(i, j).style.background = belongToOpponent ? Style.COLOR_BOTH : Style.COLOR_CURRENT_USER;
    }

    private checkOneWord(theWord: Answer): boolean {
        let k: number = 0;

        if (theWord.horizontal) {
            for (let j: number = theWord.indexJ; j < theWord.word.length + theWord.indexJ; j++) {
                if (this.gridComponent.gridPlayed[theWord.indexI][j] !== theWord.word.charAt(k++)) {
                    return false;
                }
            }
        } else {
            for (let i: number = theWord.indexI; i < theWord.word.length + theWord.indexI; i++) {
                if (this.gridComponent.gridPlayed[i][theWord.indexJ] !== theWord.word.charAt(k++)) {
                    return false;
                }
            }
        }

        return true;
    }

    public restrictKey(keyCode: number): boolean {
        if (keyCode === KEYCODE_BACKSPACE) {
            this.gridComponent.undo();
        }

        const keychar: string = String.fromCharCode(keyCode);
        const keycheck: RegExp = /[a-zA-Z]/;
        if (!keycheck.test(keychar)) {
            if (this.isNotSpecialKey(keyCode)) {
                return true;
            }
        }

        return false;
    }

    private isNotSpecialKey(keyCode: number): boolean {
        return keyCode !== KEYCODE_BACKSPACE && keyCode !== KEYCODE_DELETE && keyCode !== KEYCODE_LARROW && keyCode !== KEYCODE_RARROW;
    }

    public completeAnAnswer(): void {
        this.writeEntireAnswer(this.gridComponent.answers[this.gridComponent.wordsFound.indexOf(false)]);
        this.checkValidWords(true);

    }

    public highlightCells(wordIndexI: number, wordIndexJ: number): void {
        const styleForCell: {} = Style.STYLE_HIGHTLIGHTED_CELL;
        const answerToStyle: Answer = this.gridComponent.associatedAnswer[wordIndexI][wordIndexJ];
        this.applyToCells(styleForCell, answerToStyle);
    }

    public deleteHighlightCells(wordIndexI: number, wordIndexJ: number): void {
        const styleForCell: {} = Style.STYLE_NO_HIGHTLIGHTED_CELL;
        const answerToStyle: Answer = this.gridComponent.associatedAnswer[wordIndexI][wordIndexJ];
        this.applyToCells(styleForCell, answerToStyle);
    }

    private applyToCells(styleForCell: {}, answerToStyle: Answer): void {
        if (answerToStyle.horizontal) {
            for (let j: number = answerToStyle.indexJ; j < answerToStyle.word.length + answerToStyle.indexJ; j++) {
                this.gridComponent.styleInput[answerToStyle.indexI][j] = styleForCell;
            }
        } else {
            for (let i: number = answerToStyle.indexI; i < answerToStyle.word.length + answerToStyle.indexI; i++) {
                this.gridComponent.styleInput[i][answerToStyle.indexJ] = styleForCell;
            }
        }
    }
}
