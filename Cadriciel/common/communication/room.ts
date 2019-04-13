import { IRoom } from "./roomInterface";
import { AllLevel } from "./allLevel";

const MAX_PLAYER_PER_ROOM: number = 2;

export class Room {
    private name:string;

    private playerInRoom: string[];
    private difficulty: number;

    public constructor(name: string, difficulty: number) {
        this.name = name;
        this.difficulty = difficulty;
        this.playerInRoom = [];
    }

    public isFull(): boolean {
        return (this.getPlayerInRoom().length === MAX_PLAYER_PER_ROOM);
    }

    public addPlayer(username: string): void {
        this.playerInRoom.push(username);
    }

    public setPlayerInRoom(players: string[]): void {
        this.playerInRoom = players;
    }

    public deletePlayer(username: string): string[] {
        while(this.playerInRoom.indexOf(username) > -1) {
            this.playerInRoom.splice(this.playerInRoom.indexOf(username),1);
        }

        return this.playerInRoom;
    }

    public getName(): string {
        return this.name;
    }

    public getDifficulty(): number {
        return this.difficulty;
    }

    public getDifficultyName(): string {
        switch(this.difficulty.toString()){
            case "1": return AllLevel.EASY;
            case "2": return AllLevel.MEDIUM;
            default: return AllLevel.HARD;
        }
    }

    public getPlayerInRoom(): string[] {
        return this.playerInRoom;
    }

    public isEmpty(): boolean {
        return this.getPlayerInRoom().length === 0;
    }

    public getOpponentUsername(myUsername: string): string {
        for (const player of this.getPlayerInRoom()) {
            if (myUsername !== player) {
                return player;
            }
        }

        return myUsername;
    }

    static JSONtoRoom(roomList: IRoom[]): Room[] {
        const tempRooms: Room[] = [];
        for (const room of roomList) {
            const newRoom: Room = new Room(room.name, room.difficulty);
            for (const player of room.playerInRoom) {
                newRoom.addPlayer(player);
            }

            tempRooms.push(newRoom);
        }

        return tempRooms;
    }
}