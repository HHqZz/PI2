import { Injectable } from "@angular/core";
import { DEFAULT_MINIMUM_RPM } from "../car/engine";
import { CarsService } from "../cars-service/cars.service";
import { HeadUpDisplayService } from "./headUpDisplay.service";
import { TimeHandlerService } from "./time-handler/timeHandler.service";
import { AnimationsFactory } from "./animationsFactory";
import { SoundService, SoundType } from "../sound-service/sound.service";
import { SceneService } from "../render/scene.service";
import { LapCounter } from "../lapCounter";
import { Car } from "../car/car";
import { CarTimer } from "./time-handler/carTimer";

export interface ICarsTime {
    position: number;
    carName: string;
    timeLapOne: number;
    timeLapTwo: number;
    timeLapThree: number;
    finalTime: number;
}

const MAX_LAPS: number = 3;
const COUNT_DOWN_MAX: number = 4;
const INDEX_1: number = 1;
const INDEX_2: number = 2;

@Injectable()
export class RaceManagerService {
    private _raceStarted: boolean;
    private _raceEnded: boolean;
    private animations: AnimationsFactory;
    private carsTimers: Map<Car, CarTimer>;
    private lapCounters: LapCounter[];
    private finalRank: Car[];
    private _carsTimes: ICarsTime[];

    public constructor(private carsService: CarsService, public headUpDisplay: HeadUpDisplayService,
                       private _timeHandler: TimeHandlerService, private soundService: SoundService,
                       private sceneService: SceneService) {
        this.animations = new AnimationsFactory();
        this._raceEnded = false;
        this.carsTimers = new Map<Car, CarTimer>();
        this.lapCounters = [];
        this.finalRank = [];
        this._carsTimes = [];
    }

    public get carsTimes(): ICarsTime[] {
        return this._carsTimes;
    }

    private initLapsHandler(): void {
        let timerIndex: number = 0;
        this.carsService.cars.forEach((car) => {
            this.lapCounters.push(new LapCounter(car));
            if (car === this.carsService.mainCar) {
                this.carsTimers.set(car, this._timeHandler.playerCarTimer);
            } else {
                this.carsTimers.set(car, this._timeHandler.virtualCarsTimers[timerIndex++]);
            }
        });
    }

    public get timeHandler(): TimeHandlerService {
        return this._timeHandler;
    }

    public get raceStarted(): boolean {
        return this._raceStarted;
    }

    public get raceEnded(): boolean {
        return this._raceEnded;
    }

    public get raceInProgress(): boolean {
        return this._raceStarted && !this._raceEnded;
    }

    public raceStart(): void {
        this.initLapsHandler();
        this.lapCounters.forEach((lapCounter) => lapCounter.mapCheckpoint(this.sceneService.trackSegments));
        this._timeHandler.startCountDown();
        this.soundService.playSound(SoundType.RACE_START);
        this.animations.textAnimations.forEach((textAnimation) => {
            this.carsService.mainCar.mesh.add(textAnimation);
        });
        this.animations.setAnimationsPosition();
    }

    public update(): void {
        if (!this._raceStarted) {
            this.animations.start(this._timeHandler.raceStartCountDown);
        }
        if (this._timeHandler.raceStartCountDown > COUNT_DOWN_MAX) {
            this.afterCountDown();
        }
        if (this.carsService.mainCar.rpm > DEFAULT_MINIMUM_RPM) {
            this.soundService.changeFrequency(this.carsService.mainCar.rpm);
        }

        if (this.raceStarted) {
            this.checkCarsPositions();
        }
        this.headUpDisplay.update();
    }

    private checkCarsPositions(): void {
        this.lapCounters.forEach((lapCounter) => {
            if (lapCounter.lapCompleted()) {
                this.handleNewLap(lapCounter);
            }
        });
    }

    private handleNewLap(lapCounter: LapCounter): void {
        if (lapCounter.car === this.carsService.mainCar) {
            this.handlePlayerNewLap();
        } else {
            this.handleVirtualNewLap(lapCounter);
        }
        this._carsTimes = this._carsTimes.sort((time1, time2) => {
            if (time1.finalTime > time2.finalTime) {

                return 1;
            } else if (time1.finalTime < time2.finalTime) {

                return 0;
            }

            return 0;
        });

        this._carsTimes = this._carsTimes.filter((toRemove) => ((!isNaN(toRemove.finalTime))));
        this._carsTimes = this._carsTimes.filter((toRemove) => (((toRemove.finalTime !== 0))));

    }

    private handleVirtualNewLap(lapCounter: LapCounter): void {
        lapCounter.increaseLap();

        if (lapCounter.lapCount < MAX_LAPS) {
            this._timeHandler.newLapSetup(this.carsTimers.get(lapCounter.car));
        } else {
            this.carsTimers.get(lapCounter.car).stopLapTimer();
            this.finalRank.push(lapCounter.car);
            this.simulateRank();
        }
        this._carsTimes.push({
            position: this.finalRank.indexOf(lapCounter.car),
            carName: lapCounter.car.name,
            timeLapOne: (this.carsTimers.get(lapCounter.car).timesForLaps[0]),
            timeLapTwo: (this.carsTimers.get(lapCounter.car).timesForLaps[INDEX_1]),
            timeLapThree: (this.carsTimers.get(lapCounter.car).timesForLaps[INDEX_2]),
            finalTime: (this.carsTimers.get(lapCounter.car).timesForLaps[0] +
                this.carsTimers.get(lapCounter.car).timesForLaps[INDEX_1] +
                this.carsTimers.get(lapCounter.car).timesForLaps[INDEX_2])
        });
    }

    private generateVirtualTimes(car: Car): number[] {
        let times: number[] = [];
        let counter: number = 0;
        while (this.carsTimers.get(car).timesForLaps.length <= MAX_LAPS) {
            counter = this.carsTimers.get(car).timesForLaps.length;
            times = (counter === 1) ?
                    this.carsTimers.get(car).setTimesForLaps(this._timeHandler.playerCarTimer.timesForLaps[0] + Math.random()) :
                    this.carsTimers.get(car).setTimesForLaps(this.carsTimers.get(car).timesForLaps[counter - 1] + Math.random());
        }

        return times;
    }

    private simulateRank(): void {
        this.carsService.aiCars.forEach((car) => {
            if (!this.finalRank.includes(car)) {
                this.generateVirtualTimes(car);
                this.finalRank.push(car);
            }
        });
    }

    private afterCountDown(): void {
        this._timeHandler.raceStartTimers();
        this.headUpDisplay.increaseLap();
        this._raceStarted = true;
        this.animations.textAnimations.forEach((textAnimation) => {
            this.carsService.mainCar.mesh.remove(textAnimation);
        });
        this.soundService.playSound(SoundType.ENGINE);
    }

    private handlePlayerNewLap(): void {
        if (this.headUpDisplay.lapCount < MAX_LAPS) {
            this._timeHandler.newLapSetup(this._timeHandler.playerCarTimer);
            this.headUpDisplay.increaseLap();
        } else {
            this._timeHandler.endRaceStop();
            this.headUpDisplay.raceEnded();
            this.carsService.stopCars(this.sceneService.firstSegment);
            this._raceEnded = true;
        }
        this._carsTimes.push({
            position: this.finalRank.indexOf(this.carsService.mainCar),
            carName: this.carsService.mainCar.name,
            timeLapOne: this._timeHandler.timesForLaps[0],
            timeLapTwo: this._timeHandler.timesForLaps[INDEX_1],
            timeLapThree: this._timeHandler.timesForLaps[INDEX_2],
            finalTime: this.carsTimers.get(this.carsService.mainCar).finalTime()
        });
    }
}
