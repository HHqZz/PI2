import { Component, OnInit } from "@angular/core";
import { GridFactoryService } from "../grid-factory.service";
import { SocketService } from "../serviceMultiplayer/connectionService";
import { AllLevel } from "../../../../../common/communication/allLevel";
import { Room } from "../../../../../common/communication/room";

const NO_SELECTION: number = 0;
const SOLO_MODE: number = 1;
const MULTIPLAYER_MODE: number = 2 ;
const BASE_TEN: number = 10;

export enum PlayerMode {
    NO_MODE = "Select a mode",
    SOLO = "Solo",
    MULTIPLAYER = "Multiplayer"
 }

@Component({
    selector: "app-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.css"],
})

export class MenuComponent implements OnInit {
    public difficulty: number;
    private mode: number;
    private username: string;
    public isMultiplayerMode: boolean;

    public selectDifficultyOption: string[];
    public selectModeOption: string[];

    public waitingOpponent: boolean;
    public confirmedUsername: boolean;

    public allRooms: Room[];

    public constructor(public gridFactoryService: GridFactoryService, private connectionService: SocketService) {
        this.difficulty = NO_SELECTION;
        this.mode = NO_SELECTION;
        this.selectDifficultyOption = [AllLevel.NO_SELECTION, AllLevel.EASY, AllLevel.MEDIUM, AllLevel.HARD];
        this.selectModeOption = [PlayerMode.NO_MODE, PlayerMode.SOLO, PlayerMode.MULTIPLAYER];
        this.username = "";
        this.waitingOpponent = false;
        this.allRooms = [];
        this.confirmedUsername = false;
    }

    public ngOnInit(): void {
        this.connectionService.listRooms.subscribe((listRooms: Room[]) => { this.allRooms = listRooms; });
    }

    private initSocket(): void {
        this.connectionService.initSocket(this.username);
        this.connectionService.emitShowYourSocketId();
        this.connectionService.emitUpdateRoomList();
    }

    public isReady(): boolean {
        return (this.difficulty !== 0 && this.mode !== 0 && this.username.length !== 0);
    }

    public onSelectDifficulty(level: number): void {
        this.difficulty = this.gridFactoryService.difficulty = parseInt(level.toString(), BASE_TEN);
    }

    public onSelectMode(level: string): void {
        this.mode = Number.parseInt(level);
        this.isMultiplayerMode = this.mode === MULTIPLAYER_MODE;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public createGameSelected(): void {
        this.connectionService.emitcreateARoom(this.username, this.difficulty);

        if (this.mode === SOLO_MODE) {
            this.joinGameSelected(this.username);
        }
        this.waitingOpponent = true;
    }

    public joinGameSelected(roomName: string): void {
        this.connectionService.emitJoinRoom(this.username, roomName);
    }

    public confirmedUsernameSelected(): void {
        this.confirmedUsername = true;
        this.initSocket();
    }
}
