import { Injectable } from "@angular/core";
import { TimeHandlerService } from "./time-handler/timeHandler.service";

@Injectable()
export class HeadUpDisplayService {
    private lapCounter: number;
    private _timeSinceLapStart: number;
    private _timeSinceRaceStart: number;

    public constructor(private timer: TimeHandlerService) {
        this.lapCounter = 0;
        this._timeSinceLapStart = 0;
        this._timeSinceRaceStart = 0;
    }
    public get lapCount(): number {
        return this.lapCounter;
    }

    public get timeSinceLapStart(): number {
        return this._timeSinceLapStart;
    }

    public get timeSinceRaceStart(): number {
        return this._timeSinceRaceStart;
    }

    public increaseLap(): void {
        this.lapCounter++;
    }

    public raceEnded(): void {
        this.lapCounter = 0;
    }

    public update(): void {
        this._timeSinceRaceStart = this.timer.sinceRaceStart;
        this._timeSinceLapStart = this.timer.sinceLapStart;
    }

}
