import { HeadUpDisplayService } from "./headUpDisplay.service";
import { inject, TestBed } from "@angular/core/testing";
import { TimeHandlerService } from "./time-handler/timeHandler.service";

describe("HeadUpDisplayService", () => {

    let headUpDisplayService: HeadUpDisplayService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ HeadUpDisplayService, TimeHandlerService ]
        });
    });

    beforeEach(inject([HeadUpDisplayService, TimeHandlerService], async (timeHandler: TimeHandlerService) => {
        headUpDisplayService = new HeadUpDisplayService(timeHandler);
    }));

    it("should be created", inject([HeadUpDisplayService, TimeHandlerService], (service: HeadUpDisplayService ) => {
        expect(service).toBeTruthy();
    }));

    it("should increase the number of lap", () => {
        headUpDisplayService.increaseLap();
        headUpDisplayService.increaseLap();
        // tslint:disable-next-line:no-magic-numbers
        expect(headUpDisplayService.lapCount).toEqual(2);
    });

});
