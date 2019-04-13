import { LexicalReader } from "../ServiceLexical/lexical-service";
import { BorderedGridGenerator } from "./BorderedGridGenerator";
import * as cst from "../constants";

export class GridAlgo {
    public constructor(private grid: String[][]) {}
    public lexicalReader: LexicalReader = new LexicalReader();
    private allWords: string[] = this.lexicalReader.readWords(cst.PATH_TO_COMMON_WORDS); // Initialise en fonction du level

    public getGrid(level: number): String[][] {

        this.choosingLevel(level);
        this.suroundBlackCells();
        this.insertHorizontalWords();
        this.insertVerticalWords(level);
        this.fillBlackCells();
        this.deleteBorder();

        return this.grid;
    }

    private choosingLevel(level: number): void {
        switch (level) {
            case cst.EASY_LEVEL: {
                this.allWords = this.lexicalReader.readWords(cst.PATH_TO_COMMON_WORDS);
                break;
            }
            case cst.MEDIUM_LEVEL: {
                this.allWords = this.lexicalReader.readWords(cst.PATH_TO_COMMON_WORDS);
                break;
            }
            case cst.HARD_LEVEL: {
                this.allWords = this.lexicalReader.readWords(cst.PATH_TO_HARD_WORDS);
                break;
            }
            default: {   // Default get all the words
                this.allWords = this.lexicalReader.readWords(cst.PATH_TO_LEXIC);
                break;
            }
         }
    }

    private insertHorizontalWords(): void {
        let indexLastInvalid: number = this.insertFirstWord();

        for (let i: number = 2; i < this.grid.length - 1; i++) {
            indexLastInvalid = this.insertWordAtLine(i, indexLastInvalid);
        }
    }

    private insertWordAtLine(i: number, lastInvalid: number): number {
        let maxLength: number = 0;
        let startIndex: number = 0;

        // tslint:disable-next-line:no-magic-numbers
        if ( (i % 2) !== 0) { // a gauche  / si le nombre est impair
            // get a random between 0 to $$-2
            // get length from random to $$
            startIndex = this.getRandomBetween(1, lastInvalid - 1);
            maxLength = lastInvalid - startIndex + 1;

        } else { // a droite
            // get a random between $$ to end-2
            // get length from random to end
            startIndex = this.getRandomBetween(lastInvalid, (this.grid.length - 1) - cst.MIN_WORD_LENGTH);

            maxLength = (this.grid.length - cst.OFFSET_GRID) - startIndex + 1;

        }

        // get word this length
        //  this word starting (i, random)
        const word: string = this.getWordWithRandomLength(maxLength);
        if (word === "INVALID") {
            this.insertWordAtLine(i, lastInvalid);
        }

        this.placeWordHorizontal(i, startIndex, word);

        // tslint:disable-next-line:no-magic-numbers
        if ( i % 2 !== 0) { // ecrit a gauche / si le nombre est impair
            return startIndex + word.length;
        } else { // ecrit a droite

            return startIndex - 1;
        }
    }

    private placeWordHorizontal(i: number, startIndex: number, word: string): void {
        for (let j: number = 0; j < word.length; j++) {
            this.grid[i][j + startIndex] =
            word.charAt(j).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, "").replace(/'/g, "").toUpperCase();
        }
        //  $$ before and after
        this.grid[i][startIndex - 1] = "$$";
        this.grid[i][startIndex + word.length] = "$$";

        // Word can only be placed once :
        this.deleteWordFromLexic(word);
    }

    private insertFirstWord(): number {
        // on laisse les 2 dernieres cases dispo  5 = offset-1 + 2*min
        // const random: number = this.getRandomBetween(1, 6);
        const startIndex: number = this.getRandomBetween(1, ((cst.MAX_SIZE - 1) - cst.MIN_WORD_LENGTH));

        const maxLength: number = (cst.MAX_SIZE - 1) - startIndex;

        const wordToPlace: string = this.getWordWithRandomLength(maxLength);

        this.placeWordHorizontal(1, startIndex, wordToPlace);

        return startIndex + wordToPlace.length;
    }

    private insertVerticalWords(level: number): void {
        // Pour chaque colonne
        for (let j: number = 1 ; j < this.grid.length - 1  ; j++) {
            // on prend une case non noire comme depart
           const randomIndex: number = this.getAcceptableStartingCell(j);
           let potentialWords: string[] = [];
           let startIndex: number;
           let endIndex: number;
           let wordLength: number;
           let pattern: string;

           if (randomIndex >= 0) {
            startIndex = this.percolateUp(randomIndex, j);
            endIndex = this.percolateDown(randomIndex, j);
            wordLength = endIndex - startIndex + 1; // on ajoute + 1 car le mot commences des la premiere case
            pattern = this.getPattern(startIndex, j, wordLength) ;

            potentialWords = this.lexicalReader.getWordsMatchingGrid(pattern.toLowerCase(), this.allWords);
           }

           if (potentialWords.length ===  0 || randomIndex === -1) { // on relance l'algorithme
                this.choosingLevel(level);
                this.resetGrid(level);
                break;
            } else {
                const wordToPlace: string = potentialWords[this.getRandomBetween(0, potentialWords.length - 1)];
                this.placeVerticalWord(wordToPlace, startIndex, j);
            }

        }
    }

    private resetGrid(level: number): void {
        this.grid = [];

        for (let i: number = 0; i < cst.MAX_SIZE; i++) {
            this.grid[i] = [];
            for (let j: number = 0; j <  cst.MAX_SIZE; j++) {
                this.grid[i][j] = String();
                this.grid[i][j] = "*";
            }
        }

        this.suroundBlackCells();
        this.insertHorizontalWords();
        this.insertVerticalWords(level);
        this.fillBlackCells();

    }

    private getAcceptableStartingCell(j: number): number {
        let maxTry: number = 0 ;
        let startIndex: number = 0; // startIndex=0 se situe sur le border
        while (this.grid[startIndex][j] === "$$" || ((this.grid[startIndex - 1][j] === "$$") && (this.grid[startIndex + 1][j] === "$$"))) {
            maxTry++;
            startIndex = this.getRandomBetween(1, (cst.MAX_SIZE - 1) - cst.MIN_WORD_LENGTH);
            if (maxTry === cst.MAX_SIZE * cst.MAX_SIZE) {
                return -1;
            }
        }

        return startIndex;
    }

    private percolateUp( randomIndex: number, j: number ): number {

        let startIndex: number = randomIndex - 1;  // on regarde en dessus a partir de la prochaine case
        while (this.grid[startIndex][j] === "*" ) {
           startIndex--;
        }
        if (this.grid[startIndex][j] === "$$" ) {
            return ++startIndex;
        } else {
            return startIndex;
        }
    }
    private percolateDown( randomIndex: number, j: number ): number {

        let endIndex: number = randomIndex + 1; // on regarde en dessous a partir de la prochaine case
        while (this.grid[endIndex][j] === "*" ) {
            endIndex++;
        }
        if (this.grid[endIndex][j] === "$$" ) {
            return --endIndex;
        } else {
            return endIndex;
        }
    }

    private getPattern(startIndex: number, j: number , length: number): string {
        let pattern: string = "" ;
        for (let k: number = 0; k < length; k++) {
            pattern = pattern + this.grid[startIndex + k][j];
        }

        return pattern;
    }

    private placeVerticalWord(wordToplace: string, startIndex: number, j: number): void {
        for (let n: number = 0; n < wordToplace.length; n++) {
            this.grid[startIndex + n][j] =
            wordToplace.charAt(n).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/-/g, "").replace(/'/g, "").toUpperCase();

            if (this.grid[startIndex + n][j - 1] === "*") {
                this.grid[startIndex + n][j - 1] = "$$";
            }

            if (this.grid[startIndex + n][j + 1] === "*") {
                this.grid[startIndex + n][j + 1] = "$$";
            }
        }

        // Word can only be placed once :
        this.deleteWordFromLexic(wordToplace);
    }

    private deleteWordFromLexic(word: string): void {
        const index: number = this.allWords.indexOf(word, 0);
        if (index > -1) {
            this.allWords.splice(index, 1);
        }
    }

    private fillBlackCells(): void {
        for (let i: number = 0; i < this.grid[0].length; i++) {
            for (let j: number = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j] === "*") {
                    this.grid[i][j] = "$$";
                }
            }
        }
    }

    private suroundBlackCells(): void {
        const borderGenerator: BorderedGridGenerator = new BorderedGridGenerator(this.grid);
        this.grid = borderGenerator.getBorderedGrid();
    }

    private deleteBorder(): void {
        const borderGenerator: BorderedGridGenerator = new BorderedGridGenerator(this.grid);
        this.grid = borderGenerator.deleteBorder();
    }

    private getRandomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public getWordWithRandomLength(maxLength: number): string  {
        const randomLength: number = this.getRandomBetween(cst.MIN_WORD_LENGTH, maxLength);
        let tabWords: string[] = this.lexicalReader.getWordsOfLength(randomLength, this.allWords);
        const randomIndex: number = this.getRandomBetween(0, tabWords.length - 1);

        if (tabWords.length === 0) {
            tabWords = this.lexicalReader.getWordsOfLength(cst.MIN_WORD_LENGTH, this.allWords);

            return "INVALID";
        }

        return tabWords[randomIndex];
    }
}
