import { Answer } from "./answer";

export class Model {
    public grid: String[][];
    public answers: Answer[];
    public indice: {}[];
    public gridPlayed: String[][];
    public wordsFound: boolean[];
}