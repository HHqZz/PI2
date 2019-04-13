import { Car } from "../car/car";
import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { TrackSegment } from "../map/mapObjects/trackSegment";
import { PLAYER_CAR, VIRTUAL_CAR, CAR1_POSITION, CAR2_POSITION,
         CAR3_POSITION, RIGHT, LEFT, CarNumber } from "../../constants";
import { PositionsHelper } from "./positionsHelper";

export const NUMBER_OF_VIRTUAL_CARS: number = 3;
export enum VirtualNumber { CAR_1 = 0, CAR_2 = 1, CAR_3 = 2 }

@Injectable()
export class CarsService {
    private playerCar: Car;
    private virtualCars: Car[];
    private positionsHelper: PositionsHelper;

    public constructor() {
        this.playerCar = new Car();
        this.virtualCars = [new Car(), new Car(), new Car()];
        this.positionsHelper = new PositionsHelper();

        this.setNames();
    }

    private setNames(): void {
        this.playerCar.name = PLAYER_CAR;
        for (let index: number = 0; index < NUMBER_OF_VIRTUAL_CARS; index++) {
            this.virtualCars[index].name = VIRTUAL_CAR + (index + 1);
        }
    }

    public async initialize(): Promise<void> {
        await this.playerCar.init();
        await this.virtualCars[VirtualNumber.CAR_1].init();
        await this.virtualCars[VirtualNumber.CAR_2].init();
        await this.virtualCars[VirtualNumber.CAR_3].init();

        this.virtualCars[VirtualNumber.CAR_1].setPosition(CAR1_POSITION);
        this.virtualCars[VirtualNumber.CAR_2].setPosition(CAR2_POSITION);
        this.virtualCars[VirtualNumber.CAR_3].setPosition(CAR3_POSITION);
    }

    public get mainCar(): Car {
        return this.playerCar;
    }

    public get cars(): Car[] {
        return [this.playerCar, this.virtualCars[VirtualNumber.CAR_1],
                this.virtualCars[VirtualNumber.CAR_2], this.virtualCars[VirtualNumber.CAR_3]];
    }

    public get aiCars(): Car[] {
        return this.virtualCars;
    }

    public carsInitialPosition(firstSegment: TrackSegment, trackOrientation: number): void {

        this.positionsHelper.startPositionSetUp(firstSegment, this.checkOritation(trackOrientation));

        let carIndex: number = 0;
        this.cars.forEach((car) => car.setPosition(this.positionsHelper.randomInitialPositions()[carIndex++]));

        this.setCarsDirection(firstSegment, this.checkOritation(trackOrientation));
    }

    private checkOritation(orientation: number): number {
        return orientation < 0 ? RIGHT : LEFT;
    }

    private setCarsDirection(firstSegment: TrackSegment, trackOrientaiton: number): void {
        this.cars.forEach((car) => {
            car.mesh.rotation.y = -car.orientation.angleTo(firstSegment.start.clone().sub(firstSegment.end))
                                    * trackOrientaiton;
        });
    }

    public stopCars(firstSegment: TrackSegment): void {
        this.cars.forEach((car) => car.speed = new Vector3());
        this.mainCar.setPosition(firstSegment.position.clone());
    }

    public get carsAtPositions(): Car[] {
        const carPos: Car[] = [new Car(), new Car(), new Car(), new Car()];
        carPos[this.positionsHelper.randomPosNumbers[CarNumber.PLAYER]] = this.mainCar;
        carPos[this.positionsHelper.randomPosNumbers[CarNumber.CAR_1]] = this.virtualCars[VirtualNumber.CAR_1];
        carPos[this.positionsHelper.randomPosNumbers[CarNumber.CAR_2]] = this.virtualCars[VirtualNumber.CAR_2];
        carPos[this.positionsHelper.randomPosNumbers[CarNumber.CAR_3]] = this.virtualCars[VirtualNumber.CAR_3];

        return carPos;
    }

    public get aiCarPositions(): number[] {
        const mainCarPos: number = this.carsAtPositions.indexOf(this.mainCar);

        let aiCarsPos: number[] = this.positionsHelper.randomPosNumbers.slice();
        aiCarsPos = aiCarsPos.filter((num) => num !== mainCarPos);

        return aiCarsPos;
    }
}
