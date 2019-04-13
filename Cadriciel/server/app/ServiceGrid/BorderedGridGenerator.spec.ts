import { assert } from "chai";
import { BorderedGridGenerator } from "./BorderedGridGenerator";

describe("BorderedGridGenerator", () => {
    let borderedGridGenerator: BorderedGridGenerator;
    let grid: String[][] = [];
    let gridBordered: String[][];

    beforeEach( () => {
        grid = [];
        grid[0] = [];
        grid[1] = [];
        grid[0].push("n");
        grid[0].push("o");
        grid[1].push("e");
        grid[1].push("p");

        borderedGridGenerator = new BorderedGridGenerator(grid);

        gridBordered = borderedGridGenerator.getBorderedGrid();
    });

    it("Should create a bigger grid", () => {
        assert(grid.length < gridBordered.length);
    });

    it("Should create a grid with 2 columns more and 2 rows more", () => {
        // tslint:disable-next-line:no-magic-numbers
        if (gridBordered.length === grid.length + 2
            // tslint:disable-next-line:no-magic-numbers
            && gridBordered[0].length === grid[0].length + 2) {
                assert(true);
        } else {
            assert(false);
        }
    });

    it("Should return a grid with invalid border", () => {
        let oneInvalid: boolean = false;
        for (let i: number = 0; i < gridBordered.length; i++) {
            if (gridBordered[0][i] !== "$$"
                && gridBordered[i][0] !== "$$"
                && gridBordered[gridBordered.length - 1][i] !== "$$"
                && gridBordered[i][gridBordered.length - 1] !== "$$") {
                    oneInvalid = true;
             }
        }

        assert(!oneInvalid);
    });
});
