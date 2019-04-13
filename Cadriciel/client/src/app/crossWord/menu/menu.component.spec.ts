import { MenuComponent, PlayerMode } from "./menu.component";
import { SocketService } from "../serviceMultiplayer/connectionService";
import { GridFactoryService } from "../grid-factory.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

// tslint:disable:no-magic-numbers

const SOLO: string = "1";
const MULTIPLAYER: string = "2";
const EASY: number = 1;
const NORMAL: number = 2;
const HARD: number = 3;

describe("MenuComponent", () => {
    let component: MenuComponent;
    let mockSocketService: Partial<SocketService>;
    mockSocketService = {
        initSocket: () => {},
        emitcreateARoom: (username: string, difficulty: number) => {}
    };
    let mockGridFactoryService: Partial<GridFactoryService>;

    mockGridFactoryService = {
        getNumberWordFound: (): number => 0
    };

    beforeEach(async() => {
        void TestBed.configureTestingModule({
            imports: [RouterModule],
            declarations: [MenuComponent],
            providers: [
                {provide: SocketService, useValue: mockSocketService},
                {provide: GridFactoryService, useValue: mockGridFactoryService},
                HttpClient, HttpHandler, SocketService]
        });

    });

    beforeEach(inject([HttpClient, HttpHandler, GridFactoryService,
                       SocketService ],
                      (socketService: SocketService,
                       gridFactoryService: GridFactoryService) => {
                        component = new MenuComponent(gridFactoryService, socketService);
    }));

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should not set readyToStart to true", () => {
        component.onSelectDifficulty(EASY) ;
        component.onSelectMode(MULTIPLAYER);
        expect(component.isReady()).toBeFalsy();
    });

    it("should set readyToStart to true", () => {
        component.onSelectDifficulty(EASY) ;
        component.onSelectMode(PlayerMode.MULTIPLAYER);
        component.setUsername("user");
        expect(component.isReady()).toBeTruthy();
    });

    it("should set the playing mode to multiplayer", () => {
        component.onSelectMode(MULTIPLAYER);
        expect(component["mode"]).toEqual(2);
    });

    it("should set the playing mode to solo", () => {
        component.onSelectMode(SOLO);
        expect(component["mode"]).toEqual(1);
    });

    it("should set the game difficulty to easy", () => {
        component.onSelectDifficulty(EASY);
        expect(component["difficulty"]).toEqual(1);
    });

    it("should set the game difficulty to normal", () => {
        component.onSelectDifficulty(NORMAL);
        expect(component["difficulty"]).toEqual(2);
    });

    it("should set the game difficulty to hard", () => {
        component.onSelectDifficulty(HARD);
        expect(component["difficulty"]).toEqual(3);
    });

    it("should set the username", () => {
        component.setUsername("user1");
        expect(component["username"]).toEqual("user1");
    });
});
