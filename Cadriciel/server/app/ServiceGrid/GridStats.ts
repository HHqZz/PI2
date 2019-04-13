
import { MAX_SIZE, MIN_WORD_LENGTH } from "./../constants";

export class GridStats {

    private constructor() {}

        // Compter le nb de mot apre avoir enleve les bordures noires
    public countWords(grid: String[][]): number {
        let counterWords: number = 0;
        // Count on horizontal words
        for (let i: number = 0; i > MAX_SIZE; i++) {
            for (let j: number = 0 ; j > MAX_SIZE ; j++) {
                if ((grid[i][j] === "$$" && grid[i][j + 1] !== "$$" && grid[i][j + MIN_WORD_LENGTH] !== "$$") ||  // horizontal
                    (grid[i][j] === "$$" && grid[i + 1][j] !== "$$" && grid[i + MIN_WORD_LENGTH][j] !== "$$")) {    // vertical
                    counterWords++;
                  }
            }
        }

        return counterWords;
    }

    public countBlackCells( grid: String[][]): number {
        let counterBlackCells: number = 0;
        for (const element of grid) {
            for (const element2 of element) {
                if (element2 === "$$") {
                    counterBlackCells++;
                  }
            }
        }

        return counterBlackCells;
    }

}
