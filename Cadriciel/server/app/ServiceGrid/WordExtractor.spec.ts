import { WordExtractor } from "./WordExtractor";
import { Answer } from "../../../common/communication/answer";
import { assert } from "chai";

describe("Word Extractor", () => {
    let wordExtractor: WordExtractor;

    it("Should retrieve 4 specifics words ", () => {
        const mockGrid: String[][] = [];
        mockGrid[0] = [];
        mockGrid[1] = [];
        mockGrid[0].push("n");
        mockGrid[0].push("o");
        mockGrid[1].push("e");
        mockGrid[1].push("p");
        const mockAnswers: Answer[] = [];
        mockAnswers.push({indexI: 0, indexJ: 0, word: "no", horizontal: true, definition: ""});
        mockAnswers.push({indexI: 1, indexJ: 0, word: "ep", horizontal: true, definition: ""});
        mockAnswers.push({indexI: 0, indexJ: 0, word: "ne", horizontal: false, definition: ""});
        mockAnswers.push({indexI: 1, indexJ: 0, word: "op", horizontal: false, definition: ""});

        wordExtractor = new WordExtractor(mockGrid);
        if (wordExtractor.retrieveWords()[0].word === mockAnswers[0].word
            && wordExtractor.retrieveWords()[1].word === mockAnswers[1].word
            // tslint:disable-next-line:no-magic-numbers
            && wordExtractor.retrieveWords()[2].word === mockAnswers[2].word
            // tslint:disable-next-line:no-magic-numbers
            && wordExtractor.retrieveWords()[3].word === mockAnswers[3].word) {
            assert(true);
        } else {
            assert(false);
        }
    });

    it("Should return a array of 4 answers ", () => {
        const mockGrid: String[][] = [];
        mockGrid[0] = [];
        mockGrid[1] = [];
        mockGrid[0][0] = "n";
        mockGrid[0][1] = "o";
        mockGrid[1][0] = "e";
        mockGrid[1][1] = "p";

        wordExtractor = new WordExtractor(mockGrid);
        // tslint:disable-next-line:no-magic-numbers
        assert(wordExtractor.retrieveWords().length === 4);
    });
});
