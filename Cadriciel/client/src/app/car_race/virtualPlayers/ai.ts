import { SceneService } from "../render/scene.service";
import { CarsService, VirtualNumber } from "../cars-service/cars.service";
import { AiCarBehavior } from "./aiCarBehavior";
import {  PATH_POSITIONS, Path } from "../../constants";
import { PathGenerator, IAiPoint } from "./pathGenerator";

// const AI_VELOCITY_CAR1: number = -2;
// const AI_VELOCITY_CAR2: number = -5;
// const AI_VELOCITY_CAR3: number = -8;

export class Ai {

    private pathsList: IAiPoint[][];
    private aiBehavior: AiCarBehavior[];

    public constructor(private sceneService: SceneService, private carsService: CarsService) {
        this.pathsList = [[]];
        this.setAI();
    }

    private setAI(): void {
        this.assignPath();
        this.aiBehavior = [new AiCarBehavior(this.pathsList[Path.ONE]),
                           new AiCarBehavior(this.pathsList[Path.TWO]),
                           new AiCarBehavior(this.pathsList[Path.TWO]),
                           new AiCarBehavior(this.pathsList[Path.TWO])];
        this.matchAiCars();
    }
    private assignPath(): void {

        this.pathsList = [ new PathGenerator(this.sceneService, PATH_POSITIONS[Path.ONE]).generatePath(),
                           new PathGenerator(this.sceneService, PATH_POSITIONS[Path.TWO]).generatePath(),
                           new PathGenerator(this.sceneService, PATH_POSITIONS[Path.THREE]).generatePath(),
                           new PathGenerator(this.sceneService, PATH_POSITIONS[Path.FOUR]).generatePath()];
    }

    public updateAiCar(speed: number): void {
        this.aiBehavior[this.carsService.aiCarPositions[VirtualNumber.CAR_1]].updateAiCar(speed /* - AI_VELOCITY_CAR1 */);
        this.aiBehavior[this.carsService.aiCarPositions[VirtualNumber.CAR_2]].updateAiCar(speed /* AI_VELOCITY_CAR2 */);
        this.aiBehavior[this.carsService.aiCarPositions[VirtualNumber.CAR_3]].updateAiCar(speed /* - AI_VELOCITY_CAR3 */);
    }

    private matchAiCars(): void {

        this.aiBehavior[this.carsService.aiCarPositions[VirtualNumber.CAR_1]].aiCar =
                        this.carsService.carsAtPositions[this.carsService.aiCarPositions[VirtualNumber.CAR_1]];
        this.aiBehavior[this.carsService.aiCarPositions[VirtualNumber.CAR_2]].aiCar =
                        this.carsService.carsAtPositions[this.carsService.aiCarPositions[VirtualNumber.CAR_2]];
        this.aiBehavior[this.carsService.aiCarPositions[VirtualNumber.CAR_3]].aiCar =
                        this.carsService.carsAtPositions[this.carsService.aiCarPositions[VirtualNumber.CAR_3]];

    }

}
