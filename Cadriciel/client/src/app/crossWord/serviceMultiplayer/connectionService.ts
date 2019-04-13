import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Room } from "../../../../../common/communication/room";
import { IRoom } from "../../../../../common/communication/roomInterface";
import { IUser } from "../../../../../common/communication/userInterface";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Model } from "../../../../../common/communication/gridModel";
import { GridFactoryService } from "../grid-factory.service";
import { Answer } from "../../../../../common/communication/answer";
import * as Event from "../../../../../common/communication/socketEventName";
import { IAnswerFound } from "../../../../../common/communication/answerFoundInterface";
import * as Style from "../../../../../common/communication/style";

const SERVER_URL: string = "http://localhost:3000";

@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket;
    private users: IUser[];

    public listRooms: BehaviorSubject<Room[]>;
    public answerFound: BehaviorSubject<IAnswerFound>;
    public model: BehaviorSubject<Model>;
    public styleInput: BehaviorSubject<{}[][]>;
    public opponentWantReplay: BehaviorSubject<boolean>;

    public constructor(public gridFactoryService: GridFactoryService ) {
        this.listRooms = new BehaviorSubject([]);
        this.users = [];
        this.answerFound = new BehaviorSubject(
            {answer: {word: null, indexI: -1, indexJ: -1, horizontal: false, definition: null}, foundBy: null});

        this.model = new BehaviorSubject(new Model());
        this.styleInput = new BehaviorSubject([]);
        this.opponentWantReplay = new BehaviorSubject(false);
    }

    public myRoomIsFull(): boolean {
        return this.checkIfMaxPlayerReached(this.getMyUsername());
    }

    private checkIfMaxPlayerReached(myUsername: string): boolean {
        for (const room of this.listRooms.getValue()) {
            for (const player of room.getPlayerInRoom()) {
                if (myUsername === player) {
                    return room.isFull();
                }
            }
        }

        return false;
    }

    public getOpponentUsername(): string {
        for (const room of this.listRooms.getValue()) {
            if (room.getPlayerInRoom().includes(this.getMyUsername())) {
                return room.getOpponentUsername(this.getMyUsername());
            }
        }

        return null;
    }

    public getDifficulty(): number {
        for (const room of this.listRooms.getValue()) {
            if (room.getPlayerInRoom().includes(this.getMyUsername())) {
                return room.getDifficulty();
            }
        }

        return -1;
    }

    public getMyUsername(): string {
        for (const user of this.users) {
            if ("/#" + this.socket.id === user.socketId) {
                return user.username;
            }
        }

        return null;
    }

    public getMyRoom(): Room {
        for (const room of this.listRooms.getValue()) {
            if (room.getPlayerInRoom().includes(this.getMyUsername())) {
                return room;
            }
        }

        return null;
    }

    public getPlayerIndexInRoom(): number {
        for (const room of this.listRooms.getValue()) {
            for (let i: number = 0; i < room.getPlayerInRoom().length; i++) {
                if (this.getMyUsername() === room.getPlayerInRoom()[i]) {
                    return i;
                }
            }
        }

        return null;
    }

    public initSocket(username: string): void {
        this.socket = io(SERVER_URL);
        this.initReactionsEvent();
        this.reactShowId(username);
    }

    private initReactionsEvent(): void {
        this.reactRoomAdded();
        this.reactJoinRoom();
        this.reactDeleteUser();
        this.reactUpdateRoomList();
        this.reactGridRequest();
        this.reactGridSent();
        this.reactUpdateUsers();
        this.reactConfirmWord();
        this.reactHighlightOpponent();
        this.reactDelteHighlightOpponent();
        this.reactOpponentWantReplay();
    }

    private reactOpponentWantReplay(): void {
        this.socket.on(Event.OPPONENT_WANT_REPLAY, () => {
            this.opponentWantReplay.next(true);
        });
    }

    private reactDelteHighlightOpponent(): void {
        this.socket.on(Event.DELETE_HIGHLIGHT_OPPONENT, (answerToHighlight: Answer) => {
            this.deleteHighlightCells(answerToHighlight, Style.STYLE_NO_HIGHTLIGHTED_CELL);
        });
    }

    private reactHighlightOpponent(): void {
        this.socket.on(Event.HIGHLIGHT_OPPONENT, (answerToHighlight: Answer) => {
            this.highlightCells(answerToHighlight, Style.STYLE_HIGHTLIGHTED_CELL_OPPONENT);
        });
    }

    private reactGridSent(): void {
        this.socket.on(Event.GRID_SENT, (gridModel: Model) => {
            this.model.next(gridModel);

            const tempArray: {}[][] = [];
            for (let i: number = 0; i < gridModel.grid.length; i++) {
                tempArray[i] = [];
                for (let j: number = 0; j < gridModel.grid.length; j++) {
                    tempArray[i][j] = Style.STYLE_NO_HIGHTLIGHTED_CELL;
                }
            }
            this.styleInput.next(tempArray);
            this.opponentWantReplay.next(false);
        });
    }

    private reactGridRequest(): void {
        this.socket.on(Event.GRID_REQUEST, async (roomInterface: IRoom) => {
            const grid: Model = await this.gridFactoryService.startGame(roomInterface.difficulty);
            this.socket.emit(Event.GRID_TO_PLAY, grid, roomInterface);
        });
    }

    private reactDeleteUser(): void {
        this.socket.on(Event.DELETE_USER, (userToDisconnect: IUser) => {
            this.socket.emit(Event.DELETE_USER, userToDisconnect);
            this.emitUpdateRoomList();
        });
    }

    private reactUpdateUsers(): void {
        this.socket.on(Event.UPDATE_USERS, (updatedList: IUser[]) => {
            this.users = updatedList;
        });
    }

    private reactUpdateRoomList(): void {
        this.socket.on(Event.UPDATE_ROOM_LIST, (listRoomServer: IRoom[]) => {
            this.listRooms.next(Room.JSONtoRoom(listRoomServer));
        });
    }

    private reactJoinRoom(): void {
        this.socket.on(Event.JOIN_ROOM, (username: string, roomName: string) => {
            this.addPlayerToARoom(username, roomName);
        });
    }

    private addPlayerToARoom(username: string, roomName: string): void {
        const updatedList: Room[] = this.listRooms.getValue();
        for (const currentRoom of updatedList) {
            if (currentRoom.getName() === roomName) {
                currentRoom.addPlayer(username);
            }
        }
        this.listRooms.next(updatedList);
    }

    private reactRoomAdded(): void {
        this.socket.on(Event.ROOM_ADDED, (roomAdded: IRoom) => {
            this.addARoom(roomAdded);
        });
    }

    private addARoom(roomAdded: IRoom): void {
        const newRoom: Room = new Room(roomAdded.name, roomAdded.difficulty);
        for (const player of roomAdded.playerInRoom) {
                newRoom.addPlayer(player);
            }
        const tempAllRooms: Room[] = this.listRooms.getValue();
        tempAllRooms.push(newRoom);

        this.listRooms.next(tempAllRooms);
    }
    private reactShowId(username: string): void {
        this.socket.on(Event.SHOW_ID, () => {
            this.emitNewUser(username);
        });
    }

    private reactConfirmWord(): void {
        this.socket.on(Event.CONFIRM_WORD, (answerFounded: IAnswerFound) => {
            if (this.answerFound.getValue().answer !== answerFounded.answer) {
                this.answerFound.next({answer: answerFounded.answer, foundBy: answerFounded.foundBy});
            }
        });
    }

    public emitShowYourSocketId(): void {
        this.socket.emit(Event.SHOW_YOUR_SOCKET_ID);
    }

    public emitcreateARoom(username: string, difficulty: number): void {
        this.socket.emit(Event.CREATE_A_ROOM, username, difficulty);
    }

    public emitJoinRoom(username: string, roomName: string): void {
        this.socket.emit(Event.JOIN_ROOM, username, roomName);
    }

    public emitWordFound(answer: Answer, username: string): void {
        const wordFound: IAnswerFound = {answer: answer, foundBy: username};
        this.socket.emit(Event.WORD_FOUND, wordFound, this.getMyRoom().getName());
    }

    public emitUpdateRoomList(): void {
        this.socket.emit(Event.UPDATE_ROOM_LIST);
    }

    public emitNewUser(username: string): void {
        const newUser: IUser = {username : username, socketId : "/#" + this.socket.id};
        this.socket.emit(Event.NEW_USER, newUser);
    }

    public emitNewGrid(): void {
        this.socket.emit(Event.NEW_GRID_NEEDED, this.getMyRoom());
    }

    public emitHighlightCell(answerToStyle: Answer): void {
        this.highlightCells(answerToStyle, Style.STYLE_HIGHTLIGHTED_CELL);
        this.socket.emit(Event.HIGHLIGHT_CELL, answerToStyle, this.getMyRoom().getName());
    }

    public emitDeleteHighlightCell(answerToStyle: Answer): void {
        this.deleteHighlightCells(answerToStyle, Style.STYLE_NO_HIGHTLIGHTED_CELL);
        this.socket.emit(Event.DELETE_HIGHLIGHT_CELL, answerToStyle, this.getMyRoom().getName());
    }

    private highlightCells(answerToStyle: Answer, styleForCell: {}): void {
        this.applyToCells(styleForCell, answerToStyle);
    }

    private deleteHighlightCells(answerToStyle: Answer, styleForCell: {}): void {
        this.applyToCells(styleForCell, answerToStyle);
    }

    private applyToCells(styleForCell: {}, answerToStyle: Answer): void {
        const updatedStyle: {}[][] = this.styleInput.getValue();
        if (answerToStyle.horizontal) {
            for (let j: number = answerToStyle.indexJ; j < answerToStyle.word.length + answerToStyle.indexJ; j++) {
                updatedStyle[answerToStyle.indexI][j] = styleForCell;
            }
        } else {
            for (let i: number = answerToStyle.indexI; i < answerToStyle.word.length + answerToStyle.indexI; i++) {
                updatedStyle[i][answerToStyle.indexJ] = styleForCell;
            }
        }

        this.styleInput.next(updatedStyle);
    }

    public emitWantReplay(): void {
        this.socket.emit(Event.PLAYER_WANT_REPLAY, this.getMyRoom().getName());
    }
}
