import { MAX_SIZE } from "../constants";

export class BorderedGridGenerator {
    private localMaxSize: number;

    public constructor(private grid: String[][]) {
        this.localMaxSize = this.grid.length;
    }

    public getBorderedGrid(): String[][] {
        let gridBordered: String[][] = this.grid;
        gridBordered = [];

        for (let i: number = 0; i < this.localMaxSize + 1 + 1; i++) {
          gridBordered[i] = [];
          for (let j: number = 0; j < this.localMaxSize + 1 + 1; j++) {
            this.isABorder(i, j) ? gridBordered[i][j] = "$$" : gridBordered[i][j] = this.grid[i - 1][j - 1];
          }
        }

        return gridBordered;
    }

    private isABorder(i: number, j: number): boolean {
        if (i === 0 || j === 0 || i === this.localMaxSize + 1 || j === this.localMaxSize + 1) {
            return true;
        }

        return false;
    }

    public deleteBorder(): String[][] {

        const gridWithoutBorder: String[][] = [];

        for (let i: number = 0; i < MAX_SIZE; i++) {
            gridWithoutBorder[i] = [];
            for (let j: number = 0; j <  MAX_SIZE; j++) {
              gridWithoutBorder[i][j] = String();
              gridWithoutBorder[i][j] = "*";
            }
        }

        for (let i: number = 1; i < this.grid.length - 1; i++) {
            for (let j: number = 1; j < this.grid.length - 1; j++) {
                gridWithoutBorder[i - 1][j - 1] = this.grid[i][j];
            }
        }

        return gridWithoutBorder;
    }
}
