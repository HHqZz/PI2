import {MAX_SIZE, EASY_LEVEL, MEDIUM_LEVEL, HARD_LEVEL} from "../constants";
import { Answer } from "../../../common/communication/answer";
import { WordExtractor } from "./WordExtractor";
import { GridAlgo } from "./GridAlgo";
import { LexicalReader } from "../ServiceLexical/lexical-service";

export class Grid {
    private grid: String[][];
    private level: number;

    public constructor() {
        this.initGrid();
    }

    public addLetter(i: number, j: number, letter: String): void {
        this.grid[i][j] = letter.charAt(0);
    }

    public getGrid(): String[][] {
        return this.grid;
    }

    public initGrid(): void {
        this.grid = [];

        for (let i: number = 0; i < MAX_SIZE; i++) {
          this.grid[i] = [];
          for (let j: number = 0; j <  MAX_SIZE; j++) {
              this.grid[i][j] = String();
              this.grid[i][j] = "*";
            }
        }
    }

    public fillWithWords(): String[][] {
        const gridAlgo: GridAlgo = new GridAlgo(this.grid);

        this.grid = gridAlgo.getGrid(this.level);

        return this.grid;
    }

    public async getDefinitions(answers: Answer[]): Promise<String[]> {
        let definitions: String[] = [];
        const serviceLexical: LexicalReader = new LexicalReader();
        const promesse: Promise<String[]>[] = [];
        for (const answer of answers) {
            promesse.push(serviceLexical.getWordDefinitions(answer.word.toLowerCase()));
        }
        definitions = await Promise.all(promesse).then((allDefs: String[][]) => {
            return allDefs.map((elementCourant: String[]) => {
                switch (this.level) {
                    case EASY_LEVEL: {
                        return elementCourant[0];
                    }
                    case MEDIUM_LEVEL: {
                        if (elementCourant.length === 1) { return elementCourant[0]; }
                        const rand: number = Math.floor(Math.random() * elementCourant.length - 1) + 1;

                        return elementCourant[rand];
                    }
                    case HARD_LEVEL: {
                        return elementCourant[elementCourant.length - 1];
                    }
                    default: {
                        return elementCourant[0];
                    }
                }
            });
         });

        return definitions;
    }

    public async getAnswers(): Promise<Answer[]> {
        const wordExtractor: WordExtractor = new WordExtractor(this.grid);
        const primitiveAnswer: Answer[] = wordExtractor.retrieveWords();
        const test: String[] = await this.getDefinitions(wordExtractor.retrieveWords());

        for (let i: number = 0; i < primitiveAnswer.length; i++) {
            primitiveAnswer[i].definition = test[i];
        }

        return primitiveAnswer;
    }
}
