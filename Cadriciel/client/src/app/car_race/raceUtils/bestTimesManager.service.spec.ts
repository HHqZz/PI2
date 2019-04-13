import { BestTimesManagerService } from "./bestTimesManager.service";
import { ITime } from "../../../../../common/communication/map";
import { inject, TestBed } from "@angular/core/testing";

describe("BestTimesService", () => {

    let bestTimes: BestTimesManagerService;
    const times: ITime[] = [{ "name": "Bob", "rank": 1, "time": "112s" }, { "name": "Winnie", "rank": 2, "time": "125s" },
                            { "name": "Alex", "rank": 3, "time": "135s" }, { "name": "John", "rank": 3, "time": "180s" }];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BestTimesManagerService]
        });
    });
    beforeEach(inject([BestTimesManagerService],  () => {
         bestTimes = new BestTimesManagerService();
    }));

    it("Should initialize the bestTimes with the new Array", () => {
        bestTimes.init(times);
        expect(bestTimes.mapBestTimes.length > 0);
    });

    it("Should check if the new time is best One", () => {
        bestTimes.init(times);
        // tslint:disable-next-line:no-magic-numbers
        expect(bestTimes.checkIfBestime(120, 2)).toBe(false);
    });

    it("Should check if the new time is best One", () => {
        bestTimes.init(times);
        // tslint:disable-next-line:no-magic-numbers
        expect(bestTimes.checkIfBestime( 120, 1)).toBe(true);
    });

    it("Should check if the rank of the new time is correctly assigned", () => {
        bestTimes.init(times);
        // tslint:disable-next-line:no-magic-numbers
        bestTimes.setPlayer("Max", 120, 1);
        bestTimes.updateBestTimes();
        // tslint:disable-next-line:no-magic-numbers
        expect(bestTimes.playerITime.rank).toEqual(2);
    });

    it("Should check if the rank of the previous best times are updated", () => {
        bestTimes.init(times);
        // tslint:disable-next-line:no-magic-numbers
        bestTimes.setPlayer("Max", 120, 1);
        bestTimes.updateBestTimes();
        // tslint:disable-next-line:no-magic-numbers
        expect(bestTimes.mapBestTimes[4].rank).toEqual(5);
    });

    it("Should check if the new best time is inserted", () => {
        bestTimes.init(times);
        // tslint:disable-next-line:no-magic-numbers
        bestTimes.setPlayer("Max", 120, 1);
        bestTimes.updateBestTimes();
        // tslint:disable-next-line:no-magic-numbers
        expect(bestTimes.mapBestTimes.length).toEqual(5);
    });

});
