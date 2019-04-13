import { Car } from "../car/car";
import { Vector3, Matrix4, Quaternion } from "three";
import { SoundService, SoundType } from "../sound-service/sound.service";
import { PLAYER_CAR } from "../../constants";

let collisionHandled: boolean = false;
const BREAK_COEFF: number = 3;
const REPOSITION_COEFF: number = 6;

export class CollisionOutTrack {
    private mainCar: Car;
    private origin: Vector3;
    private segmentStart: Vector3;

    public constructor(private soundService: SoundService) {
        this.mainCar = new Car();
        this.origin = new Vector3();
        this.segmentStart = new Vector3();
    }

    public set car(car: Car) {
        this.mainCar = car;
    }

    public hitCorner(center: Vector3): void {
        this.origin.copy(center);
        this.handleCollision(this.projectOnRadius);
}

    public hitWall(start: Vector3, end: Vector3): void {
        this.segmentStart.copy(start);
        this.origin.copy(end);
        this.handleCollision(this.projectOnSegment);
    }

    private handleCollision(projection: Vector3): void {
        if (!collisionHandled) {
            if (this.mainCar.name === PLAYER_CAR) { this.soundService.playSound(SoundType.INVISIBLE_WALLS); }

            this.slowCarDown();
            this.placeCar(projection);

            collisionHandled = true;
        }
    }

    private placeCar(projection: Vector3): void {
        this.mainCar.mesh.position.copy(this.computePosition(projection));
    }

    private computePosition(newPosition: Vector3): Vector3 {
        return this.origin.clone().add(newPosition);
    }

    private get projectOnRadius(): Vector3 {
        return this.collisionVector.clone().divideScalar(REPOSITION_COEFF);
    }

    private get projectOnSegment(): Vector3 {
        return this.collisionVector.clone().projectOnVector(this.segmentVector);
    }

    private get segmentVector(): Vector3 {
        return this.segmentStart.clone().sub(this.origin);
    }

    private get collisionVector(): Vector3 {
        return this.mainCar.getPosition().clone().sub(this.origin);
    }

    private slowCarDown(): void {
        const quaternion: Quaternion = this.moveToCarCoordonates();
        this.mainCar.speed.negate();
        this.mainCar.speed.divideScalar(BREAK_COEFF);

        this.moveToWorldCoordonates(quaternion);
    }

    private moveToCarCoordonates(): Quaternion {
        const rotationMatrix: Matrix4 = new Matrix4().extractRotation(this.mainCar.mesh.matrix);
        this.mainCar.speed.applyMatrix4(rotationMatrix);

        return new Quaternion().setFromRotationMatrix(rotationMatrix);
    }

    private moveToWorldCoordonates(rotationQuaternion: Quaternion): void {
        this.mainCar.speed = this.mainCar.speed.applyQuaternion(rotationQuaternion.inverse());
    }

    public enableCollisionTest(): void {
        collisionHandled = false;
    }
}
