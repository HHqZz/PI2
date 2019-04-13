import { assert, expect } from "chai";
import { LexicalReader } from "./lexical-service";

describe("LexicalService", () => {

    const filePath: string = "../server/lexic/englishWords.txt";
    const lexicalReader: LexicalReader = new LexicalReader();

    it("Should not return an empty array while reading the lexic ", () => {
        const words: String[] = lexicalReader.readWords(filePath);

        assert(words !== []);
    });

    it("Should return the first word of the lexic", () => {
            const firstWord: string = lexicalReader.readWords(filePath)[0];
            assert(firstWord === "a");
    });

    it("Should return the fifth word of the lexic", () => {
        const wordIndex: number = 4;
        const firstWord: string = lexicalReader.readWords(filePath)[wordIndex];
        assert(firstWord === "aardwolf");
    });

    it("Should return the word at the index 33294 of the lexic", () => {
            const wordIndex: number = 33293 ;
            const firstWord: string = lexicalReader.readWords(filePath)[wordIndex];
            assert(firstWord === "decimalised");
    });

    it("Should return the last word ", () => {

        const words: string[] = lexicalReader.readWords(filePath);
        const lastWord: string = words[words.length - 1];
        assert(lastWord === "zythum");
    });

    it("Should return the first definition of the word observer", (done: MochaDone) => {
        lexicalReader.getWordDefinitions("observer")
        .then((input: string[]) => {
            expect(input[0].length).to.be.greaterThan(0);
            done();
        })
        .catch(lexicalReader.handleError);
    });

    it("Should return the sixth definition of the word snow", (done: MochaDone) => {
        const indexDefintion: number = 6;
        lexicalReader.getWordDefinitions("snow")
        .then((input: string[]) => {
            expect(input[indexDefintion].length).to.be.greaterThan(0);
            done();
        })
        .catch(lexicalReader.handleError);
    });

    it("Should return the last definition of the project ", (done: MochaDone) => {
        lexicalReader.getWordDefinitions("project")
        .then((input: string[]) => {
            expect(input[input.length - 1].length).to.be.greaterThan(0);
            done();
        })
        .catch(lexicalReader.handleError);
    });

    it("Should return all the definitions of the word abelmosk", (done: MochaDone) => {
        lexicalReader.getWordDefinitions("abelmosk")
        .then((input: string[]) => {
            expect(input.length).to.be.greaterThan(0);
            done();
        })
        .catch(lexicalReader.handleError);
    });

    it("Should return 18 as the frequency of the word weird", (done: MochaDone) => {
        const aWord: string = "weird";
        const frequencyOfWeird: number = 34 ;

        lexicalReader.getWordFrequency(aWord)
        .then((input: number) => {
            expect(input).to.equal(frequencyOfWeird);
            done();
        })
        .catch(lexicalReader.handleError);
    });

    it("Should return 169 as the frequency of the word voice", (done: MochaDone) => {
        const aWord: string = "voice";
        const frequencyOfWeird: number = 169 ;

        lexicalReader.getWordFrequency(aWord)
        .then((input: number) => {
            expect(input).to.equal(frequencyOfWeird);
            done();
        })
        .catch(lexicalReader.handleError);
    });

    it("Should not return -1 as the frequency of the word aba", (done: MochaDone) => {
        const aWord: string = "aba";
        const frequency: number = -1;

        lexicalReader.getWordFrequency(aWord)
        .then((input: number) => {
            expect(input).to.not.equal(frequency);
            done();
        })
        .catch(lexicalReader.handleError);
    });

    it("Should not return 882 as the frequency of the word life", (done: MochaDone) => {
        const aWord: string = "life";
        const frequency: number = 882;

        lexicalReader.getWordFrequency(aWord).
        then((input: number) => {
            expect(input).to.not.equal(frequency);
            done();
        })
        .catch(lexicalReader.handleError);
    });

    it("Should not return any words having 0 as length", () => {
    const words: string[] = lexicalReader.readWords(filePath);
    const wordsList: string[] = lexicalReader.getWordsOfLength(0, words);
    assert(wordsList.length === 0);
    });

    it("Should not return any words having 46 as length", () => {
        const wordLength: number = 46;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsList: string[] = lexicalReader.getWordsOfLength(wordLength, words);
        assert(wordsList.length === 0);
    });

    it("Should not return any words having 50 as length", () => {
        const wordLength: number = 50;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsList: string[] = lexicalReader.getWordsOfLength(wordLength, words);
        assert(wordsList.length === 0);
    });

    it("Should return a list containing all the words having 3 as length", () => {
        const wordLength: number = 3;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsList: string[] = lexicalReader.getWordsOfLength(wordLength, words);
        assert(wordsList.length !== 0);
        assert(wordsList.map((word: string) => {
            return word.length === wordLength;
        }).reduce((prev: boolean, cur: boolean) => {
            return prev && cur;
        }));
    });

    it("Should return a list containing all the words having 15 as length", () => {
        const wordLength: number = 15;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsList: string[] = lexicalReader.getWordsOfLength(wordLength, words);
        assert(wordsList.length !== 0);
        assert(wordsList.map((word: string) => {
            return word.length === wordLength;
        }).reduce((prev: boolean, cur: boolean) => {
            return prev && cur;
        }));
    });

    it("Should return an empty list when looking for a word having z at the index 50", () => {
        const wordLength: number = 50;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsList: string[] = lexicalReader.getWordWithLetterAt(wordLength, words, "z");
        assert(wordsList.length === 0);
    });

    it("Should return a list of words having t at the index 0", () => {
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsList: string[] = lexicalReader.getWordWithLetterAt(0, words, "t");
        assert(wordsList[0][0] === "t");
    });

    it("Should return the third letter which is l of the first word aalii", () => {
        const position: number = 2;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsList: string[] = lexicalReader.getWordWithLetterAt(position, words, "l");
        assert(wordsList[0][position] === "l");
    });

    it("Should return the last letter which is a of the first word casa", () => {
        const position: number = 6670;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsList: string[] = lexicalReader.getWordWithLetterAt(words[position].length - 1, words, "a");
        assert(wordsList[0][words[position].length - 1 ] === "a");
    });

    it("Should not return any words when looking for the pattern of an empty string", () => {
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsMatchingPattern: string[] = lexicalReader.getWordsMatchingGrid(" ", words);

        assert(wordsMatchingPattern.length === 0);
    });

    it("Should return words with 3 letters when searching the pattern of 3 spaces", () => {
        const patternLength: number = 3;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsMatchingPattern: string[] = lexicalReader.getWordsMatchingGrid("***" , words);

        assert(wordsMatchingPattern[patternLength].length === patternLength);
    });

    it("Should return words of eight letters, starting with a and ending with k when looking for this specific pattern: 'a      k'", () => {
        const patternPosition: number = 7;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsMatchingPattern: string[] = lexicalReader.getWordsMatchingGrid("a******k", words);

        assert(wordsMatchingPattern[0][0] === "a" && wordsMatchingPattern[0][patternPosition] === "k");
    });

    it("Should return words of six letters with an h at index 2, d at the index 4 and an h at index 6", () => {
        const patternPosition1: number = 1;
        const patternPosition2: number = 3;
        const patternPosition3: number = 5;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsMatchingPattern: string[] = lexicalReader.getWordsMatchingGrid("*h*d*h", words);

        assert(wordsMatchingPattern[0][patternPosition1] === "h" && wordsMatchingPattern[0][patternPosition2] === "d"
               && wordsMatchingPattern[0][patternPosition3] === "h" );
    });

    it("Should return words of eleven letters following the pattern specify", () => {
        const patternPosition1: number = 1;
        const patternPosition2: number = 2;
        const rate: number = 2;
        const words: string[] = lexicalReader.readWords(filePath);
        const wordsMatchingPattern: string[] = lexicalReader.getWordsMatchingGrid("*at*c*y*m*c", words);

        assert(wordsMatchingPattern[0][patternPosition1] === "a" && wordsMatchingPattern[0][patternPosition1 + 1] === "t"
                && wordsMatchingPattern[0][patternPosition2 + rate] === "c"
                && wordsMatchingPattern[0][patternPosition2 + rate + rate] === "y"
                && wordsMatchingPattern[0][patternPosition2 + rate + rate + rate] === "m"
                && wordsMatchingPattern[0][patternPosition2 + rate + rate + rate + rate] === "c");
    });

    it("Should return a non empty Array", () => {
        const wordsList: string[] = lexicalReader.readWords(filePath);
        const words: string[] = lexicalReader.getRandomWords(wordsList);
        assert(words !== []);
    });

    it("Should an Array of Length 40", () => {
        const lenght: number = 40;
        const wordsList: string[] = lexicalReader.readWords(filePath);
        const words: string[] = lexicalReader.getRandomWords(wordsList);
        assert(words.length = lenght);
    });

    it("Should get an Array of Common Words(frequency >1)", (done: MochaDone) => {
        const words: string[] = lexicalReader.readWords(filePath);

        lexicalReader.getCommonWords(words)
        .then( ((input: string[]) => {
            expect(input).not.to.be.equal([]);
            done();
        }) )
        .catch(lexicalReader.handleError);
    });

    it("Should get an Array of UnCommon Words(frequency >1)", (done: MochaDone) => {
        const words: string[] = lexicalReader.readWords(filePath);

        lexicalReader.getUnCommonWords(words)
        .then( ((input: string[]) => {
            expect(input).not.to.be.equal([]);
            done();
        }) )
        .catch(lexicalReader.handleError);
    });

});
