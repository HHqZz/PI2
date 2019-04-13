import { GridComponent } from "../grid.component";

const WEBSITE_PATH_HOME: string = "http://localhost:4200/home";
const EMPTY_CELL: string = "";

export class EventButton {
    public constructor(private gridComponent: GridComponent) {}

    public undo(): void {
        if (this.gridComponent.stackLetterPlayed.length !== 0) {
            const i: number = this.gridComponent.stackLetterPlayed.pop();
            const j: number = this.gridComponent.stackLetterPlayed.pop();
            if (this.gridComponent.gridPlayed[i][j] !== EMPTY_CELL
                && !(document.getElementById("cell" + i + j) as HTMLInputElement).disabled) {
                (document.getElementById("cell" + i + j) as HTMLInputElement).value = EMPTY_CELL;
                this.gridComponent.gridPlayed[i][j] = EMPTY_CELL;
                document.getElementById("cell" + i + j).focus();
            } else {
                this.undo();
            }
        }
    }

    public goToHomepage(): void {
        location.replace(WEBSITE_PATH_HOME);
    }
}
