import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Model } from "../../../../common/communication/gridModel";
import { Answer } from "../../../../common/communication/answer";
import { STYLE_CLUE } from "../../../../common/communication/style";

@Injectable()
export class GridFactoryService {

    public gridModel: String[][];
    public gridPlayed: String[][];
    public answers: Answer[];
    public difficulty: number;

    public cheatActivated: boolean;
    public focusHorizontal: boolean;

    public stackLetterPlayed: number[];

    public wordsFound: boolean[];
    public numberOfWordsFound: number;
    public styleIndice: {}[];

    public constructor(private http: HttpClient) {
        this.gridModel = [];
        this.gridPlayed = [];
        this.answers = [];

        this.cheatActivated = false;
        this.focusHorizontal = true;

        this.stackLetterPlayed = [];

        this.wordsFound = [];
        this.numberOfWordsFound = 0;
        this.styleIndice = [];
    }

    public async startGame(difficulty: number): Promise<Model> {
        // Make the HTTP request:
        return this.http.get("http://localhost:3000/GridGenerator/" + difficulty.toString()).toPromise().then((data: Model) => {
            this.gridModel = data.grid;
            this.answers = data.answers;

            this.prepareGridPlayed();
            this.initWordsFound(this.answers.length);
            this.initBackgrounds(this.answers.length);

            return this.retrieveGridFromModel();
        });
    }

    private retrieveGridFromModel(): Model {
        const playableGridModel: Model = new Model();
        playableGridModel.grid = this.gridModel;
        playableGridModel.answers = this.answers;
        playableGridModel.gridPlayed = this.gridPlayed;
        playableGridModel.indice = this.styleIndice;
        playableGridModel.wordsFound = this.wordsFound;

        return playableGridModel;
    }

    private prepareGridPlayed(): void {
        this.initGridPlayed();
        this.copyBlackCells();
    }

    private initGridPlayed(): void {
        const maxSize: number = this.gridModel.length;
        this.gridPlayed = [];

        for (let i: number = 0; i < maxSize; i++) {
            this.gridPlayed[i] = [];
            for (let j: number = 0; j < maxSize; j++) {
                this.gridPlayed[i].push(String());
            }
        }
    }

    private copyBlackCells(): void {
        const maxSize: number = this.gridModel.length;

        for (let i: number = 0; i < maxSize; i++) {
            for (let j: number = 0; j < maxSize; j++) {
                if (this.gridModel[i][j] === "$$") {
                    this.gridPlayed[i][j] = "$$";
                }
            }
        }
    }

    private initWordsFound(nbWord: number): void {
        this.wordsFound = [];
        for (let i: number = 0; i < nbWord; i++) {
            this.wordsFound.push(false);
        }
        this.numberOfWordsFound = 0;
    }

    public getNumberWordFound(): number {
        let sum: number = 0;
        for (const word of this.wordsFound) {
            if (word) {
                sum++;
            }
        }

        return sum;
    }

    private initBackgrounds(length: number): void {
        this.initBackgroundIndices(length);
    }

    private initBackgroundIndices(length: number): void {
        this.styleIndice = [];
        for (let i: number = 0; i < length; i++) {
            this.styleIndice.push(STYLE_CLUE);
        }
    }
}
