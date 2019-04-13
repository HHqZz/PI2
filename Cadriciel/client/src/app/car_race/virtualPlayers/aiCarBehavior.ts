import { Vector3 } from "three";
import { Car } from "../car/car";
import { IAiPoint } from "./pathGenerator";
import { TRACK_WIDTH, FACTOR_TWO } from "../../constants";

const AI_VELOCITY: number = -8;

export class AiCarBehavior {
    public aiCar: Car;
    private pointsList: IAiPoint[];
    private actualPoint: IAiPoint;
    private index: number;

    public constructor( private aiPointsList: IAiPoint[]) {
        this.aiCar = new Car();
        this.pointsList = this.aiPointsList.slice();
        this.actualPoint = this.pointsList[0];
        this.index = 0;
    }

    private checkPosition(): boolean {
        return  this.aiCar.getPosition().distanceTo(this.actualPoint.position) <= TRACK_WIDTH / FACTOR_TWO;
    }

    private moveForward(speed: number = AI_VELOCITY): void {
        // this.aiCar.speed = new Vector3(0, 0, speed);
        this.aiCar.isAcceleratorPressed = true;
        this.aiCar.update(speed);
    }

    private intersectionAngle( lastPosition: Vector3, nextPosition: Vector3): number {
        const direction: Vector3 = this.actualPoint.position.clone().sub(lastPosition);
        const nextDirection: Vector3 = nextPosition.clone().sub(this.actualPoint.position);

        const crossProduct: Vector3 = direction.clone().cross(nextDirection);
        if (crossProduct.dot(new Vector3(0, 1, 0)) > 0 ) {
            return direction.angleTo(nextDirection);
        }

        return -direction.angleTo(nextDirection);
    }

    public updateAiCar(speed: number = AI_VELOCITY): void {
            this.actualPoint = this.pointsList[this.index];
            this.moveForward(speed);
            if (this.actualPoint.isCorner) {
                if ( this.checkPosition()) {
                    this.aiCar.mesh.position.copy(this.pointsList[this.index].position);
                    this.changeDirection();
                    this.index = (this.index === this.pointsList.length - 1) ? 0 : this.index + 1;
                }
            } else if (this.checkPosition()) {
                this.changeDirection();
                this.index = (this.index === this.pointsList.length - 1) ? 0 : this.index + 1;
            }
    }

    private changeDirection(): void {
        let nextIndex: number = this.index + 1;
        let lastIndex: number = this.index - 1;
        if (this.index === 0) {
            lastIndex = this.pointsList.length - 1;
        }
        if (this.index === this.pointsList.length - 1) {
            nextIndex = 0;
        }

        this.aiCar.mesh.rotateY(this.intersectionAngle(this.pointsList[lastIndex].position, this.pointsList[nextIndex ].position));

    }
}
