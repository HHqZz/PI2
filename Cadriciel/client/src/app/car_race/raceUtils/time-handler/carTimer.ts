import { Clock } from "three";
import { PRECISION } from "../../../constants";

const RANDOM_TIME: number = 60;
const MAX: number = 3;

export class CarTimer {
    private lapTimer: Clock;
    private lapsTimes: number[];
    private totalTime: number;

    public constructor() {
        this.lapTimer = new Clock(false);
        this.lapsTimes = [];
        this.totalTime = 0;
    }

    public get sinceLapStart(): number {
        return (this.lapTimer.running) ? parseFloat(this.lapTimer.getElapsedTime().toFixed(PRECISION)) : 0;
    }

    public get timesForLaps(): number[] {
        return this.lapsTimes;
    }

    public setTimesForLaps(estimatedTime: number): number[] {
        if (estimatedTime > 0) {
            this.lapsTimes.push(estimatedTime);
        } else {
            this.lapsTimes.push(RANDOM_TIME);
        }

        return this.lapsTimes;
    }

    public finalTime(): number {
        if (this.lapsTimes.length === MAX) {
            for (let i: number = 0; i < MAX; i++) {
                this.totalTime = this.totalTime + this.lapsTimes[i];
            }

            return this.totalTime;
        } else {

            return this.totalTime;
        }

    }

    public startLapTimer(): void {
        this.lapTimer.start();
    }

    public stopLapTimer(): void {
        this.lapsTimes.push(parseFloat(this.lapTimer.getElapsedTime().toFixed(PRECISION)));
        this.lapTimer.stop();
    }

}
