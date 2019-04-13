
import { GridAlgo } from "./GridAlgo";

import { assert } from "chai";
import { Answer } from "../../../common/communication/answer";
import { WordExtractor } from "./WordExtractor";
import { EASY_LEVEL, MAX_SIZE } from "../constants";
import { Grid } from "./Grid";

describe(" class GridAlgo", () => {
    let gridAlgo: GridAlgo;
    let gridToTest: String[][];

    beforeEach( () => {
        const gridObject: Grid = new Grid;
        gridAlgo = new GridAlgo(gridObject.getGrid());
        gridToTest = gridAlgo.getGrid(EASY_LEVEL);

    });

    it("Should return a grid of 10 by 10" , () => {
        assert(gridToTest.length === MAX_SIZE && gridToTest.length === MAX_SIZE);
    });

    // All tests to check if getGrid returns a valid grid
    it("Should not have any white init cell left ", () => {
       // tslint:disable-next-line:prefer-for-of
       for (let i: number = 0; i < gridToTest.length; i++) {
            for (let j: number = 0; j < gridToTest.length; j++) {
                if (gridToTest[i][j] === "*") {
                    assert(false);
                }
            }
        }
       assert(true);
    });

    it("Should not be bordered with black cells", () => {
        let haveNotBlackCall: boolean = false;
        for (let i: number = 0; i < gridToTest.length; i++) {
            if (gridToTest[0][i] !== "$$" || gridToTest[gridToTest.length - 1][i] !== "$$"
                || gridToTest[i][0] !== "$$" || gridToTest[i][gridToTest.length - 1] !== "$$") {
                    haveNotBlackCall = true;
            }
        }
        assert(haveNotBlackCall);
    });

    it("Should contains words", () => {
        const wordExtract: WordExtractor = new WordExtractor(gridToTest);
        const allAnswers: Answer[] = wordExtract.retrieveWords();
        assert(allAnswers.length !== 0);
    });

    it("Should contains a total of 2*MAX_SIZE words", () => {
        const wordExtract: WordExtractor = new WordExtractor(gridToTest);
        const allAnswers: Answer[] = wordExtract.retrieveWords();
        assert(allAnswers.length === MAX_SIZE + MAX_SIZE);
    });

    it("Should not contains two times the same word", () => {
        const wordExtract: WordExtractor = new WordExtractor(gridToTest);
        const allAnswers: Answer[] = wordExtract.retrieveWords();
        for (let i: number = 0; i < allAnswers.length; i++) {
            for (let j: number = 0; j < allAnswers.length; j++) {
                if (j !== i && allAnswers[i] === allAnswers[j]) {
                    assert(false);
                }
            }
        }
        assert(true);

     });
});
