import { Application } from "./app";
import * as http from "http";
import Types from "./types";
import { injectable, inject } from "inversify";
import { IServerAddress } from "./iserver.address";
import * as io from "socket.io";
import { Room } from "../../common/communication/room";
import { IUser } from "../../common/communication/userInterface";
import { Model } from "../../common/communication/gridModel";
import { IRoom } from "../../common/communication/roomInterface";
import * as Event from "../../common/communication/socketEventName";
import { IAnswerFound } from "../../common/communication/answerFoundInterface";
import { Answer } from "../../common/communication/answer";

@injectable()
export class Server {

    private readonly appPort: string | number | boolean = this.normalizePort(process.env.PORT || "3000");
    private readonly baseDix: number = 10;
    private server: http.Server;
    private io: SocketIO.Server;
    private listRoomServer: Room[];
    public users: IUser[] = [];

    constructor(@inject(Types.Application) private application: Application) {
        this.listRoomServer = [];
    }

    public init(): void {
        this.application.app.set("port", this.appPort);
        this.server = http.createServer(this.application.app);
        this.server.listen(this.appPort);

        this.io = io(this.server);

        this.server.on("error", (error: NodeJS.ErrnoException) => this.onError(error));
        this.server.on("listening", () => this.onListening());
    }

    private normalizePort(val: number | string): number | string | boolean {
        const port: number = (typeof val === "string") ? parseInt(val, this.baseDix) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== "listen") { throw error; }
        const bind: string = (typeof this.appPort === "string") ? "Pipe " + this.appPort : "Port " + this.appPort;
        switch (error.code) {
            case "EACCES":
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Se produit lorsque le serveur se met à écouter sur le port.
     */
    private onListening(): void {
        const addr: IServerAddress = this.server.address();
        const bind: string = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
        // tslint:disable-next-line:no-console
        console.log(`Listening on ${bind}`);

        this.listenSocketIo();
    }

    private listenSocketIo(): void {
        this.io.on(Event.CONNECTION, (socket: SocketIO.Socket) => {
            this.addSocketEvent(socket);
        });
    }

    private addSocketEvent(socket: SocketIO.Socket): void {
        this.reactCreateARoom(socket);
        this.reactShowYourSocketId(socket);
        this.reactJoinRoom(socket);
        this.reactDisconnect(socket);
        this.reactUpdateRoomList(socket);
        this.reactNewUser(socket);
        this.reactGridToPlay(socket);
        this.reactWordFound(socket);
        this.reactNewGridNeeded(socket);
        this.reactHighlightCells(socket);
        this.reactDeleteHighlightCells(socket);
        this.reactWantReplay(socket);
    }

    private reactWantReplay(socket: SocketIO.Socket): void {
        socket.on(Event.PLAYER_WANT_REPLAY, (roomName: string) => {
            socket.broadcast.in(roomName).emit(Event.OPPONENT_WANT_REPLAY);
        });
    }

    private reactHighlightCells(socket: SocketIO.Socket): void {
        socket.on(Event.HIGHLIGHT_CELL, (answerToHighlight: Answer, roomName: string) => {
            socket.broadcast.in(roomName).emit(Event.HIGHLIGHT_OPPONENT, answerToHighlight);
        });
    }

    private reactDeleteHighlightCells(socket: SocketIO.Socket): void {
        socket.on(Event.DELETE_HIGHLIGHT_CELL, (answerToHighlight: Answer, roomName: string) => {
            socket.broadcast.in(roomName).emit(Event.DELETE_HIGHLIGHT_OPPONENT, answerToHighlight);
        });
    }

    private reactNewGridNeeded(socket: SocketIO.Socket): void {
        socket.on(Event.NEW_GRID_NEEDED, (roomJoined: string) => {
            socket.emit(Event.GRID_REQUEST, roomJoined); // Grid request
        });
    }

    private reactGridToPlay(socket: SocketIO.Socket): void {
        socket.on(Event.GRID_TO_PLAY, (grid: Model, room: IRoom) => {
            this.io.in(room.name).emit(Event.GRID_SENT, grid);
        });
    }

    private reactNewUser(socket: SocketIO.Socket): void {
        socket.on(Event.NEW_USER, (newUser: IUser) => {
            this.users.push(newUser);
            this.io.emit(Event.UPDATE_USERS, this.users);
        });
    }

    private reactCreateARoom(socket: SocketIO.Socket): void {
        socket.on(Event.CREATE_A_ROOM, (username: string, difficulty: number) => {
            const newRoom: Room = new Room(username, difficulty);
            newRoom.addPlayer(username);

            // A socket room is created et the current join it
            socket.join(username);

            // Update the list of room on the client
            this.io.emit(Event.ROOM_ADDED, newRoom);

            // Update the list of room on the server
            this.listRoomServer.push(newRoom);
        });
    }

    private reactShowYourSocketId(socket: SocketIO.Socket): void {
        socket.on(Event.SHOW_YOUR_SOCKET_ID, () => { socket.emit(Event.SHOW_ID); });
    }

    private reactJoinRoom(socket: SocketIO.Socket): void {
        socket.on(Event.JOIN_ROOM, (username: string, roomName: string) => {
            // The socket join the room with the name roomName
            socket.join(roomName);

            // Update the list of room on each client
            this.io.emit(Event.JOIN_ROOM, username, roomName);

            let roomJoined: Room;
            // Update the list of room on the server
            for (const currentRoom of this.listRoomServer) {
                if (currentRoom.getName() === roomName) {
                    currentRoom.addPlayer(username);
                    roomJoined = currentRoom;
                }
            }

            socket.emit(Event.GRID_REQUEST, roomJoined);
        });
    }

    private reactUpdateRoomList(socket: SocketIO.Socket): void {
        socket.on(Event.UPDATE_ROOM_LIST, () => {
            this.io.emit(Event.UPDATE_ROOM_LIST, this.listRoomServer);
        });
    }

    private reactDisconnect(socket: SocketIO.Socket): void {
        socket.on(Event.DISCONNECT, () => {
            this.disconnectUser(socket);
        });
    }

    private disconnectUser(socket: SocketIO.Socket): void {
        const userToDisconnect: IUser = this.getRequesterUsername(socket);
        if (userToDisconnect !== undefined) {
            this.deleteUser(userToDisconnect);
            this.io.emit(Event.DELETE_USER, userToDisconnect);
        }
    }

    private getRequesterUsername(socket: SocketIO.Socket): IUser {
        let userToDisconnect: IUser;
        for (const user of this.users) {
            if (user.socketId === socket.id) {
                userToDisconnect = user;
            }
        }

        return userToDisconnect;
    }

    private reactWordFound(socket: SocketIO.Socket): void {
        socket.on(Event.WORD_FOUND, (wordFound: IAnswerFound, roomName: string) => {
            this.io.in(roomName).emit(Event.CONFIRM_WORD, wordFound);
        });
    }

    private deleteUser(userToDisconnect: IUser): void {
        // delete from the user array
        this.users.splice(this.users.indexOf(userToDisconnect), 1);

        // delete from the room
        for (const currentRoom of this.listRoomServer) {
            for (const playerUsername of currentRoom.getPlayerInRoom()) {
                if (playerUsername === userToDisconnect.username) {
                    currentRoom.setPlayerInRoom(currentRoom.deletePlayer(userToDisconnect.username));
                }
                if (currentRoom.isEmpty()) {
                    this.destroyEmptyRoom(currentRoom);
                }
            }
        }
    }

    private destroyEmptyRoom(roomToDestroy: Room): void {
        this.listRoomServer.splice(this.listRoomServer.indexOf(roomToDestroy));
    }
}
