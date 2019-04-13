import { Component, OnInit } from "@angular/core";
import { Answer } from "../../../../../common/communication/answer";
import { EventInput } from "./eventHandler/EventInput";
import { EventButton } from "./eventHandler/EventButton";
import { EventMouse } from "./eventHandler/EventMouse";
import { SocketService } from "../serviceMultiplayer/connectionService";
import { Model } from "./../../../../../common/communication/gridModel";
import * as Style from "../../../../../common/communication/style";

@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})
export class GridComponent implements OnInit {

    public gridModel: String[][];
    public gridPlayed: String[][];
    public answers: Answer[];

    public cheatActivated: boolean;
    public focusHorizontal: boolean;
    public opponentHasJoined: boolean;

    public opponentCounter: number;
    public stackLetterPlayed: number[];
    public wordsFound: boolean[];
    public styleClues: {}[];

    private eventButton: EventButton;
    private eventMouse: EventMouse;
    private eventInput: EventInput;

    public associatedAnswer: Answer[][];
    public styleInput: {}[][];
    public opponentWantReplay: boolean;
    public noClick: boolean;

    public constructor(private connectionService: SocketService) {
        this.gridModel = [];
        this.gridPlayed = [];
        this.answers = [];

        this.cheatActivated = false;
        this.focusHorizontal = true;
        this.opponentHasJoined = false;

        this.stackLetterPlayed = [];

        this.opponentCounter = 0;
        this.wordsFound = [];
        this.styleClues = [];

        this.eventButton = new EventButton(this);
        this.eventMouse = new EventMouse();
        this.eventInput = new EventInput(this, this.connectionService);

        this.associatedAnswer = [];
        this.styleInput = [];
        this.opponentWantReplay = false;
        this.noClick = true;
    }

    public ngOnInit(): void {
        this.connectionService.model.subscribe((modelparam) => {
            this.receiveGridData(modelparam);
            this.opponentCounter = 0;
            if (this.answers !== undefined) {
                this.associateCellToAnswer();
            }

        });

        this.connectionService.styleInput.subscribe((styleArrayInput) => {
            this.styleInput = styleArrayInput;
        });

        this.connectionService.opponentWantReplay.subscribe((opponentWantReplay) => {
            this.opponentWantReplay = opponentWantReplay;
        });
    }

    private receiveGridData(model: Model): void {
        this.gridModel = model.grid;
        this.answers = model.answers;
        this.styleClues = model.indice;
        this.gridPlayed = model.gridPlayed;
        this.wordsFound = model.wordsFound;
        this.noClick = true;
    }

    public focusOnStart(k: number): void {
        if (!this.wordsFound[k]) {
            this.focusOnFirstCellAvailable(this.answers[k].indexI, this.answers[k].indexJ, k);

            if (this.answers[k].horizontal !== this.focusHorizontal) {
                this.changeFocusDirection();
            }
        }
    }

    private focusOnFirstCellAvailable(i: number, j: number, k: number): void {
        while ((document.getElementById("cell" + i + j) as HTMLInputElement).disabled) {
            this.answers[k].horizontal ? j++ : i++;
        }
        document.getElementById("cell" + i.toString() + j.toString()).focus();
    }

    public currentUserScore(): number {
        return (this.getNumberWordFound() - this.opponentCounter);
    }

    public isWinner(): boolean {
        return this.currentUserScore() > this.opponentCounter;
    }

    public getNumberWordFound(): number {
        let sum: number = 0;
        for (const wordIsFound of this.wordsFound) {
            if (wordIsFound) {
                sum++;
            }
        }

        return sum;
    }

    public newLetter(searchValue: String, i: number, j: number): void {
        this.eventInput.newLetter(searchValue, i, j);
    }

    public restrictKey(event: KeyboardEvent): void {
        const key: number = event.keyCode;
        if (this.eventInput.restrictKey(key)) {
            event.preventDefault();
        }
    }

    public undo(): void {
        this.eventButton.undo();
    }

    public changeFocusDirection(): void {
        this.focusHorizontal = !this.focusHorizontal;
    }

    public cheat(): void {
        this.cheatActivated = !this.cheatActivated;
    }

    public ultimateCheat(): void {
        this.eventInput.completeAnAnswer();
    }

    public mouseEnter(k: number): void {
        this.styleClues[k] = this.eventMouse.mouseEnter(this.wordsFound[k], this.styleClues[k]);
    }

    public mouseLeave(k: number): void {
        this.styleClues[k] = this.eventMouse.mouseLeave(this.wordsFound[k], this.styleClues[k]);
    }

    public goToHomepage(): void {
        this.eventButton.goToHomepage();
    }

    public replayGame(): void {
        // trigger the loading screen
        this.wordsFound = undefined;

        this.connectionService.emitNewGrid();
    }

    public allowReplay(): boolean {
        return this.opponentWantReplay || this.connectionService.getMyUsername() === this.connectionService.getOpponentUsername();
    }

    public wantToReplay(): void {
        this.noClick = false;
        this.connectionService.emitWantReplay();
    }

    public associateCellToAnswer(): void {
        this.initAssociatedAnswer();

        for (const element of this.answers) {
            if (element.horizontal) {
                for (let j: number = element.indexJ; j < element.word.length + element.indexJ; j++) {
                    this.associatedAnswer[element.indexI][j] = element;
                }
            } else {
                for (let i: number = element.indexI; i < element.word.length + element.indexI; i++) {
                    this.associatedAnswer[i][element.indexJ] = element;
                }
            }
        }
    }

    private initAssociatedAnswer(): void {
        for (let i: number = 0; i < this.gridModel.length; i++) {
            this.associatedAnswer[i] = [];
        }
    }

    public onFocusIn(i: number, j: number): void {
        const answerToStyle: Answer = this.associatedAnswer[i][j];
        this.connectionService.emitHighlightCell(answerToStyle);
        this.styleClues[this.answers.indexOf(answerToStyle)] = Style.STYLE_CLUE_MOUSE_ENTER;
    }

    public onFocusOut(i: number, j: number): void {
        const answerToStyle: Answer = this.associatedAnswer[i][j];
        this.connectionService.emitDeleteHighlightCell(answerToStyle);
        if (!this.wordsFound[this.answers.indexOf(answerToStyle)]) {
            this.styleClues[this.answers.indexOf(answerToStyle)] = Style.STYLE_CLUE;
        }
    }
}
