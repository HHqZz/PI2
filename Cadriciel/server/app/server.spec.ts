import { Server } from "./server";
import { assert, expect } from "chai";
import Types from "./types";
import { container } from "./inversify.config";
const TEST_SERVER_URL: string = "http://localhost:3001";

describe(" Server class", () => {
    const server: Server = container.get<Server>(Types.Server);
    server.init();
    // tslint:disable:no-any
    const socketServer: any = require("socket.io-client");
    const options: {} = {
        transports: ["websocket"],
        "force new connection": true,
        path: "/socket.io-client"
    };
    const client1: any = socketServer(TEST_SERVER_URL, options);
    const client2: any = socketServer(TEST_SERVER_URL, options);
    // tslint:enable:no-any

    it("can connect to socket", (done: MochaDone) => {
        client1.once("connect", () => {
            done();
        });
        done();
    });

    it("should send and receive a simple message", (done: MochaDone) => {
        client1.on("message", (msg: string) => {
            expect(msg).to.equal("test");
            client1.emit("message", "test");
        });
        done();
    });

    it("Should add a room to the list ", (done: MochaDone) => {
        // tslint:disable-next-line:no-magic-numbers
        const gameInfo: {}[] = ["username", 2];
        client1.on("connect", () => {
            server["reactCreateARoom"](client1);
            assert.equal<number>(server["listRoomServer"].length, 1);
            // expect(server.counter).to.equal(-100);
            // client1.emit("createARoom", (gameInfo));
            // assert.strictEqual<boolean>(server["isFull"], true);
            // assert.strictEqual<number>(server.counter, 8);
            // assert.strictEqual<boolean>(server["bool"], true);
        });
        client1.on("connect", () => {
            client1.emit("createARoom", (gameInfo));
            // assert.strictEqual<boolean>(server["isFull"], true);
        });
        // expect(server["listRoomServer"].length).to.equal(1);
        // assert.strictEqual<boolean>(server["isFull"], true);
        client1.on("disconnect");
        client2.on("disconnect");
        done();
    });

    it("Should add a new user to the user list ", (done: MochaDone) => {
        client1.on("connect", () => {
            server["reactNewUser"](client1);
            assert.strictEqual<number>(server["users"].length, 1);
            client1.emit("newUser", ("user1"));
        });
        done();
    });

    it("Should remove user from the user list ", (done: MochaDone) => {
        client1.on("connect", () => {
            server["reactNewUser"](client1);
            client1.emit("newUser", ("user1"));
        });
        server["deleteUser"](client1);
        assert.strictEqual<number>(server["users"].length, 0);

        done();
    });

    it("Should delete a user from list when he disconnects", (done: MochaDone) => {
        client1.on("connect", () => {
            server["reactNewUser"](client1);
            client1.on("disconnect", () => {
                server["reactDisconnect"](client1);
            });
        });
        assert.strictEqual<number>(server["users"].length, 0);

        done();
    });

    it("Should let the second client join the room created by the first one", (done: MochaDone) => {
        const gameInfo: {}[] = ["secondUser", "username"];
        // tslint:disable-next-line:no-magic-numbers
        const roomInfo: {}[] = ["username", 2];
        client1.on("connect", () => {
            server["reactCreateARoom"](client1);
            client1.emit("createARoom", (roomInfo));
        });
        client2.on("connect", () => {
            server["reactJoinRoom"](client2);
            client2.emit("joinRoom", gameInfo );
            assert.strictEqual<string>(server["listRoomServer"][0].getName(), "");
        });

        done();
    });

});
