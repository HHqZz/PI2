import { Mesh } from "three";
import { Injectable } from "@angular/core";
import { SoundService } from "../sound-service/sound.service";
import { CarsService } from "../cars-service/cars.service";
import { OutTrackDetector } from "./outTrackDetector";
import { CarsCollisionDetector } from "./carsCollisionDetector";

@Injectable()
export class CollisionHandlerService {
    private outTrackDetectors: OutTrackDetector[];
    private carsCollisionDetector: CarsCollisionDetector;

    public constructor(private soundService: SoundService, private carsService: CarsService) {
        this.outTrackDetectors = [];
        this.carsCollisionDetector = new CarsCollisionDetector(this.soundService);
    }

    public setUp(trackSurfaces: Mesh[]): void {
        this.carsCollisionDetector.setUp(this.carsService.mainCar, this.carsService.aiCars);
        this.carsService.cars.forEach((car) => {
            this.outTrackDetectors.push(new OutTrackDetector(this.soundService));
            this.outTrackDetectors[this.outTrackDetectors.length - 1].setUp(car, trackSurfaces);
        });
    }

    public detectCollision(): void {
        this.carsCollisionDetector.detect();
        this.outTrackDetectors.forEach((detector) => { detector.detectOutTrack(); });
    }
}
