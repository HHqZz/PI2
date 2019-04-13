import { TimeHandlerService } from "./timeHandler.service";
import { inject, TestBed } from "@angular/core/testing";
import { Clock } from "three";
import { PRECISION } from "../../../constants";

describe("TimeHandlerService", () => {

    let timeHandler: TimeHandlerService;
    let timerTest: Clock;
    enum TestsTimeouts { oneStart = 1, oneEnd = 50, twoStart = 55, twoEnd = 100,
                         threeStart = 105, threeEnd = 150, fourthStart = 155, fourthEnd = 200,
                         fithStart = 205, fithEnd = 250 }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ TimeHandlerService ]
        });
    });

    beforeEach(inject([TimeHandlerService], async () => {
        timeHandler = new TimeHandlerService();
        timerTest = new Clock(false);
    }));

    it("should be created", inject([TimeHandlerService], (service: TimeHandlerService ) => {
        expect(service).toBeTruthy();
    }));

    it("should start timers", async (done: () => void) => {

        setTimeout(() => {
            timeHandler.startCountDown();
            timeHandler.startLapTimer();
            timeHandler.startRaceTimer();
        },         TestsTimeouts.oneStart);
        setTimeout(() => {
            expect(timeHandler["countDown"].running).toBe(true);
            expect(timeHandler.playerCarTimer["lapTimer"].running).toBe(true);
            expect(timeHandler["raceTimer"].running).toBe(true);
            done();
        },         TestsTimeouts.oneEnd);
    });

    it("should stop timers", async (done: () => void) => {
        setTimeout(() => {
            timeHandler.startCountDown();
            timeHandler.startLapTimer();
            timeHandler.startRaceTimer();
        },         TestsTimeouts.twoStart);

        setTimeout(() => {
            timeHandler.stopCountDown();
            timeHandler.stopLapTimer();
            timeHandler.stopRaceTimer();

            expect(timeHandler["countDown"].running).toBe(false);
            expect(timeHandler.playerCarTimer["lapTimer"].running).toBe(false);
            expect(timeHandler["raceTimer"].running).toBe(false);
            done();
        },         TestsTimeouts.twoEnd);
    });

    it("should return time elapsed for each timer", async (done: () => void) => {
        setTimeout(() => {
            timeHandler.startLapTimer();
            timeHandler.startRaceTimer();
            timeHandler.startCountDown();
            timerTest.start();
        },         TestsTimeouts.threeStart);

        setTimeout(() => {
            expect(timeHandler.sinceLapStart).toEqual(parseFloat(timerTest.getElapsedTime().toFixed(PRECISION)));
            expect(timeHandler.sinceRaceStart).toEqual(parseFloat(timerTest.getElapsedTime().toFixed(PRECISION)));
            done();
        },         TestsTimeouts.threeEnd);
    });

    it("should keep time after one lap ended", async (done: () => void)  => {
        setTimeout(() => {
            timeHandler.startLapTimer();
            timerTest.start();
        },         TestsTimeouts.fourthStart);

        setTimeout(() => {
            timeHandler.stopLapTimer();
            expect(timeHandler.playerCarTimer.timesForLaps[0]).toEqual(parseFloat(timerTest.getElapsedTime().toFixed(PRECISION)));
            done();
        },         TestsTimeouts.fourthEnd);
    });

    it("should keep time after race ended", async (done: () => void)  => {
        setTimeout(() => {
            timeHandler.startRaceTimer();
            timerTest.start();
        },         TestsTimeouts.fithStart);

        setTimeout(() => {
            timeHandler.stopRaceTimer();
            expect(timeHandler.raceTotalTime).toEqual(parseFloat(timerTest.getElapsedTime().toFixed(PRECISION)));
            done();
        },         TestsTimeouts.fithEnd);
    });
});
