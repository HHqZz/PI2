import { Clock } from "three";
import { Injectable } from "@angular/core";
import { CarTimer } from "./carTimer";

import { PRECISION } from "../../../constants";

@Injectable()
export class TimeHandlerService {
    private countDown: Clock;
    private raceTimer: Clock;
    private mainCarTimer: CarTimer;
    private aiCarsTimers: CarTimer[];
    private totalTime: number;

    public constructor() {
        this.countDown = new Clock(false);
        this.raceTimer = new Clock(false);
        this.mainCarTimer = new CarTimer();
        this.aiCarsTimers = [new CarTimer(), new CarTimer(), new CarTimer()];
        this.totalTime = 0;
    }

    public get raceStartCountDown(): number {
        return (this.countDown.running) ? parseFloat(this.countDown.getElapsedTime().toFixed(PRECISION)) : 0;
    }

    public get sinceRaceStart(): number {
        return (this.raceTimer.running) ? parseFloat(this.raceTimer.getElapsedTime().toFixed(PRECISION)) : 0;
    }

    public get sinceLapStart(): number {
        return this.mainCarTimer.sinceLapStart;
    }

    public get timesForLaps(): number[] {
        return this.mainCarTimer.timesForLaps;
    }

    public get raceTotalTime(): number {
        return this.totalTime;
    }

    public get playerCarTimer(): CarTimer {
        return this.mainCarTimer;
    }

    public get virtualCarsTimers(): CarTimer[] {
        return this.aiCarsTimers;
    }

    public raceStartTimers(): void {
        this.stopCountDown();
        this.startRaceTimer();
        this.startCarsTimers();
    }

    private startCarsTimers(): void {
        this.mainCarTimer.startLapTimer();
        this.aiCarsTimers.forEach((timer) => timer.startLapTimer() );
    }

    public newLapSetup(timer: CarTimer): void {
        timer.stopLapTimer();
        timer.startLapTimer();
    }

    public endRaceStop(): void {
        this.stopRaceTimer();
        this.mainCarTimer.stopLapTimer();
        this.aiCarsTimers.forEach((timer) => timer.stopLapTimer() );
    }

    public startCountDown(): void {
        this.countDown.start();
    }

    public stopCountDown(): void {
        this.countDown.stop();
    }

    public startRaceTimer(): void {
        this.raceTimer.start();
    }

    public stopRaceTimer(): void {
        this.totalTime = parseFloat(this.raceTimer.getElapsedTime().toFixed(PRECISION));
        this.raceTimer.stop();
    }

    public startLapTimer(): void {
        this.mainCarTimer.startLapTimer();
    }

    public stopLapTimer(): void {
        this.mainCarTimer.stopLapTimer();
    }
}
