import { assert } from "chai";
import { Grid } from "./Grid";
import { MAX_SIZE, OFFSET_GRID} from "../constants";
import { Answer } from "../../../common/communication/answer";

describe(" class Grid", () => {
    let grid: Grid;

    beforeEach( () => {
        grid = new Grid();
    });

    it("Should be the same length as the given constant " , () => {
        assert(grid.getGrid().length === MAX_SIZE);
    });

    it("Should add a letter to position [0;0]", () => {
        grid.addLetter(0, 0, "f");
        assert(grid.getGrid()[0][0] === "f");
    });

    it("Should add only the first letter to position [0;0]", () => {
        grid.addLetter(0, 0, "faaa");
        assert(grid.getGrid()[0][0] === "f");
    });

    it("Should not be the same letter at [0;0]", () => {
        grid.addLetter(0, 0, "f");
        assert(!(grid.getGrid()[0][0] === "a"));
    });

    it("Should not have any black cells", () => {
        let isBlackCell: boolean = false ;
        // tslint:disable-next-line:prefer-for-of
        for (let i: number = 0 ; i < grid.getGrid().length; i++) {
            for (let j: number = 0; j < grid.getGrid().length; j++) {
                if (grid.getGrid()[i][j] === "$$") {
                    isBlackCell = true;
                }
            }
        }
        assert(!(isBlackCell));
     });

    it("Should return an array of maxSize*2 answers", () => {
        grid.getAnswers().then((answers: Answer[]) => {
            assert(answers.length === MAX_SIZE * OFFSET_GRID);
        }).catch((err: Error) => {
            console.error(err);
        });
    });

});
