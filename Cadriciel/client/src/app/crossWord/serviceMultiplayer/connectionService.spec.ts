import { TestBed, inject } from "@angular/core/testing";
import { GridFactoryService } from "../grid-factory.service";
import {SocketService} from "./connectionService";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { IUser } from "../../../../../common/communication/userInterface";
import { Room } from "../../../../../common/communication/room";
import { IRoom } from "../../../../../common/communication/roomInterface";

describe("ConnectionService", () => {
    let socketService: SocketService;

    const player1: IUser = { username: "user1", socketId: "socket1"};
    const player2: IUser = { username: "user2", socketId: "socket2"};

    const room: Room = new Room("room", 1);
    const iRoom: IRoom = {name: "room", playerInRoom: ["user1", "user2"], difficulty: 1};
    const listRooms: Room[] = [room];

    beforeEach(() => {
        void TestBed.configureTestingModule({
            providers: [SocketService, GridFactoryService,
                        HttpClient, HttpHandler ]
        });
    });
    beforeEach(inject([HttpClient, HttpHandler, GridFactoryService,
                       SocketService ],
                      (gridFactoryService: GridFactoryService) => {
                        socketService = new SocketService(gridFactoryService);
    }));

    it("should be created", () => {
        expect(socketService).toBeTruthy();
    });

    it("should add a new room to the list of rooms", () => {
        socketService["addARoom"](iRoom);
        expect(socketService.listRooms.getValue().length).toEqual(1);
    });

    it("should add the first player to the room ", () => {
        socketService.listRooms.next(listRooms);
        socketService["addPlayerToARoom"](player1.username, room.getName());
        expect(socketService.listRooms.getValue()[0].getPlayerInRoom().length).toEqual(1);
    });

    it("should add the second player to the specified room ", () => {
        socketService.listRooms.next(listRooms);
        socketService["addPlayerToARoom"](player2.username, room.getName());
        // tslint:disable-next-line:no-magic-numbers
        expect(socketService.listRooms.getValue()[0].getPlayerInRoom().length).toEqual(2);

    });

    it("should notify that the maximum number of players in a room is reached ", () => {
        socketService.listRooms.next(listRooms);
        expect(socketService["checkIfMaxPlayerReached"]("user1")).toBeTruthy();
    });

});
