import { Answer } from "../../../common/communication/answer";
import {BorderedGridGenerator} from "./BorderedGridGenerator";

export class WordExtractor {
    private answers: Answer[];

    public constructor(private grid: String[][]) {}

    public retrieveWords(): Answer[]  {
        this.answers = this.checkWordHorizontally().concat(this.checkWordVertically());
        this.answers = this.answers.sort((a: Answer, b: Answer) => b.word.length - a.word.length);

        return this.answers;
    }

    private checkWordHorizontally(): Answer[] {
        const borderGenerator: BorderedGridGenerator = new BorderedGridGenerator(this.grid);
        const gridBordered: String[][] = borderGenerator.getBorderedGrid();

        let departI: number = 0;
        let departJ: number = 0;

        let theWord: String = "";
        const answers: Answer[] = [];

        // HORIZONTALE
        for (let i: number = 0; i < gridBordered.length; i++) {
          departI = i - 1; // because blackcells border
          departJ = 0;
          for (let j: number = 0; j < gridBordered.length; j++) {
            if (gridBordered[i][j] === "$$") {
              theWord = this.getTheWordHorizontal(departI, departJ, i, j - 1);
              if ( theWord.length > 1 ) {
                answers.push({indexI: departI, indexJ: departJ, word: theWord, horizontal: true, definition: ""});
              }
              departJ = j;
            }
          }
        }

        return answers;
      }

    private checkWordVertically(): Answer[] {
        const borderGenerator: BorderedGridGenerator = new BorderedGridGenerator(this.grid);
        const gridBordered: String[][] = borderGenerator.getBorderedGrid();

        let departI: number = 0;
        let departJ: number = 0;

        let theWord: String = "";
        const answers: Answer[] = [];

        // VERTICALE
        for (let j: number = 0; j < gridBordered.length; j++) {
          departJ = j - 1; // because blackcells border
          departI = 0;
          for (let i: number = 0; i < gridBordered.length; i++) {
            if (gridBordered[i][j] === "$$") {
              theWord = this.getTheWordVertical(departI, departJ, i - 1, j);
              if ( theWord.length > 1 ) {
                answers.push({indexI: departI, indexJ: departJ, word: theWord, horizontal: false, definition: ""});
              }
              departI = i;
            }
          }
        }

        return answers;
      }

    private getTheWordHorizontal(departI: number, departJ: number, finI: number, finJ: number): String {
        let theWord: string = "";
        for (let i: number = departI; i < finI; i++) {
          for (let j: number = departJ; j < finJ; j++) {
            theWord = theWord + this.grid[i][j];
          }
        }

        return theWord;
      }

    private getTheWordVertical(departI: number, departJ: number, finI: number, finJ: number): String {
        let theWord: string = "";
        for (let j: number = departJ; j < finJ; j++) {
          for (let i: number = departI; i < finI; i++) {
            theWord = theWord + this.grid[i][j];
          }
        }

        return theWord;
      }
}
