import * as fs from "fs";
import * as request from "request";
import * as async from "async";

import { LEXIC_API , DEFINITIONS_SETTINGS , FREQUENCY_SETTINGS, RANDOM_WORDS_NUMBER } from "./settings";

export class LexicalReader {
    public readWords(file: string): string[] {
        const encoding: string = "utf8";

        return fs.readFileSync(file , encoding).split("\r\n");
    }

    public async getWordDefinitions(word: String): Promise<String []> {
        let definitions: string[] = [];

        return new Promise<string []>((resolve: (value?: string[] | PromiseLike<string[]> | undefined) => void,
                                       reject: (reason?: string) => void): void => {
            request(`${LEXIC_API}/${word}/${DEFINITIONS_SETTINGS}` , (error: Error , response: request.Response, body: string) => {
               const def: string[] = JSON.parse(body);
               const key: string = "text";
               if (def === []) {
                   definitions = [];
                } else  {
                    for (const i of def) {
                        definitions.push(i[key]) ;
                    }
                }
               try {
                    resolve(definitions);
                } catch (error) {
                    reject();
                }
            });
        });

}

    public async getWordFrequency(word: string): Promise<number> {
        return new Promise<number>((resolve: (value?: number | PromiseLike<number> | undefined) => void,
                                    reject: (reason?: string) => void): void => {
            request((`${LEXIC_API}/${word}/${FREQUENCY_SETTINGS}`) , (error: Error , response: request.Response , body: string ) => {
                const freq: number = JSON.parse(body).totalCount;
                try {
                    resolve(freq);
                } catch (error) {
                    reject();
                }
            });
        });
    }

    public getWordsOfLength(length: number, lexic: string[]): string[] {
        return lexic.filter((word: string) => {
            return length === word.length;
        });
    }

    public getWordWithLetterAt(position: number, lexic: string[], letter: string): string[] {
        const wordsWithLetter: string [] = [];
        for (const word of lexic) {
            if (word.charAt(position) === letter && position < word.length) {
                wordsWithLetter.push(word);
            }
        }

        return wordsWithLetter ;
    }

    public getWordsMatchingGrid(wordPattern: string, lexic: string[]): string[] {
        const wordsWithLetter: string[] = [];
        const wordsOnGrid: string[] = this.getWordsOfLength(wordPattern.length, lexic);
        for (const i of wordsOnGrid) {
            let find: boolean = true;
            for (let j: number = 0; j < wordPattern.length; j++) {
                if (i[j] !== wordPattern[j] && wordPattern[j] !== "*") {
                    find = false;
                }
            }
            if (find) {
                wordsWithLetter.push(i);
            }
        }

        return wordsWithLetter;
    }

    public getRandomWords( wordsList: string[] ): string[] {
        return  Array(RANDOM_WORDS_NUMBER).map((value: number) => {
             return wordsList[Math.floor(Math.random() * wordsList.length)];
          });
      }

    public async getCommonWords(wordsList: string[]): Promise<string[]> {
         const randomWords: string[] = this.getRandomWords(wordsList);

         return new Promise<string[]>((resolve: (value?: string[] | PromiseLike<string[]> | undefined) => void) => {
            async.filter(randomWords, (word: string, callback: async.AsyncBooleanResultCallback<Error>) => {
                this.getWordFrequency(word)
                .then((frequency: number) => {
                    callback(null, frequency >= 1);
                })
                .catch(this.handleError);
            },
                         (err: Error, results: string[]) => {resolve(results); }
            );
        });
    }

    public async getUnCommonWords(wordsList: string[]): Promise<string[]> {
        const randomWords: string[] = this.getRandomWords(wordsList);

        return new Promise<string[]>((resolve: (value?: string[] | PromiseLike<string[]> | undefined) => void) => {
            async.filter(randomWords, (word: string, callback: async.AsyncBooleanResultCallback<Error>) => {
                this.getWordFrequency(word)
                .then((frequency: number) => {
                    callback(null, frequency < 1);
                })
                .catch(this.handleError);
            },
                         (err: Error, results: string[]) => {resolve(results); }
            );
        });
    }

    public async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }
}
