import { EventInput } from "./EventInput";
import { GridComponent } from "../grid.component";
import { KEYCODE_LARROW, KEYCODE_RARROW, KEYCODE_DELETE } from "../../../constants";
import { TestBed, inject } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { GridFactoryService } from "../../grid-factory.service";
import { SocketService } from "../../serviceMultiplayer/connectionService";

describe("EventInput", () => {
    let eventIn: EventInput;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GridComponent, HttpHandler, HttpClient, GridFactoryService, SocketService, GridComponent]
        });
    });
    beforeEach(inject([HttpClient, HttpHandler, GridFactoryService, SocketService],
                      (httpclient: HttpClient, httpHandler: HttpHandler,
                       gridfactory: GridFactoryService,
                       socket: SocketService,
                       gridcomponent: GridComponent) => {
            eventIn = new EventInput(gridcomponent, socket);
        }));

    // tslint:disable:no-magic-numbers

    it("should not restrict 'a'", () => {
        expect(!eventIn.restrictKey(65)).toBe(true);
    });

    it("should not restrict 'z'", () => {
        expect(!eventIn.restrictKey(90)).toBe(true);
    });

    // it("should not restrict BACKSPACE", () => {
    //   expect(!eventIn.restrictKey(KEYCODE_BACKSPACE)).toBe(true);
    // });

    it("should not restrict ARROWS", () => {
        expect(!eventIn.restrictKey(KEYCODE_LARROW) && !eventIn.restrictKey(KEYCODE_RARROW)).toBe(true);
    });

    it("should not restrict DELETE", () => {
        expect(!eventIn.restrictKey(KEYCODE_DELETE)).toBe(true);
    });

    it("should restrict '1'", () => {
        expect(eventIn.restrictKey(49)).toBe(true);
    });

    it("should restrict all numbers", () => {
        expect(eventIn.restrictKey(48) // 0
            && eventIn.restrictKey(49) // 1
            && eventIn.restrictKey(50) // 2
            && eventIn.restrictKey(51) // 3
            && eventIn.restrictKey(52) // 4
            && eventIn.restrictKey(53) // 5
            && eventIn.restrictKey(54) // 6
            && eventIn.restrictKey(55) // 7
            && eventIn.restrictKey(56) // 8
            && eventIn.restrictKey(57)).toBe(true);  // 9
    });

});
