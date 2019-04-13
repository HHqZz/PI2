import { Injectable } from "@angular/core";
import { ITime } from "../../../../../common/communication/map";

@Injectable()
export class BestTimesManagerService {

    private _mapBestTimes: ITime[];
    private _playerITime: ITime;
    private isBestTime: boolean;
    private readonly MAX_BEST_TIME: number = 5;

    public constructor() {
        this.isBestTime = false;
        this._playerITime = { name: " ", time: " " };
    }

    public init(mapTimes: ITime[]): void {
        this._mapBestTimes = mapTimes;
    }

    public setPlayer(name: string, finalTime: number, playerRank: number): void {
        this._playerITime.name = name;
        this._playerITime.time = String(finalTime) + "s";
        this._playerITime.rank = playerRank;
    }

    public get mapBestTimes(): ITime[] {
        return this._mapBestTimes;
    }

    public get playerITime(): ITime {
        return this._playerITime;
    }

    public checkIfBestime(finalTime: number, rank: number): boolean {
        if (this._mapBestTimes === undefined || this._mapBestTimes.length === 0) {
            this.isBestTime = true;
        } else {
            this._mapBestTimes.forEach((element: ITime) => {
                if (rank === 1 && this.parseTimeToNumber(finalTime.toString()) < this.parseTimeToNumber(element.time)
                    && this._mapBestTimes.indexOf(element) < this.MAX_BEST_TIME) {
                    this.isBestTime = true;
                }
            });
        }

        return this.isBestTime;
    }

    private parseTimeToNumber(time: string): string {
        return time.substring(0, time.length - 1);
    }

    public updateBestTimes(): void {
        if (this._playerITime.rank === 1) {
            let isInserted: boolean = false;
            if (this._mapBestTimes === undefined || this._mapBestTimes.length === 0) {
                this._playerITime.rank = 1;
                this._mapBestTimes.push(this._playerITime);
            } else {
                this._mapBestTimes.forEach((element: ITime) => {
                    if (this.parseTimeToNumber(this._playerITime.time) < this.parseTimeToNumber(element.time) && !isInserted) {

                        this._playerITime.rank = this._mapBestTimes[this._mapBestTimes.indexOf(element)].rank;
                        this._mapBestTimes.splice(this._mapBestTimes.indexOf(element), 0, this._playerITime);
                        isInserted = true;
                        for (let i: number = this.mapBestTimes.indexOf(element); i < this.mapBestTimes.length; i++) {
                            this.mapBestTimes[i].rank++;
                        }
                    }
                });
                while (this._mapBestTimes.length > this.MAX_BEST_TIME) {
                    this._mapBestTimes.pop();
                }

            }

        }

    }

}
