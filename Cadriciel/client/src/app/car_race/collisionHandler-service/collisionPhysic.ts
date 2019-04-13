import { Car } from "../car/car";
import { Object3D, Vector3, Matrix4, Quaternion } from "three";
import { SoundService, SoundType } from "../sound-service/sound.service";

const CAR_RADIUS: number = 2;
const FACTOR_TWO: number = 2;
let lastCollided: Car = new Car();

export class CollisionPhysic {

    private carA: Car;
    private carB: Car;
    public collisionHandled: boolean = false;

    public constructor(private soundService: SoundService) {
        this.carA = new Car();
        this.carB = new Car();
    }

    public setUpColliders(mainCar: Object3D, collidedCar: Object3D): void {
        this.carA = mainCar as Car;
        this.carB = collidedCar as Car;

        this.checkForNewCollision();
    }

    private checkForNewCollision(): void {
        if (lastCollided !== this.carB) {
            this.collisionHandled = false;
            lastCollided = this.carB;
        }
    }

    public enableCollisionTest(): void {
        if (this.collisionHandled && this.areSeparated) {
            this.collisionHandled = false;
        }
    }

    private get areSeparated(): boolean {
        return this.carsDefined && this.carsDistance > CAR_RADIUS;
    }

    private get carsDefined(): boolean {
        return (this.carA !== undefined) && (this.carB !== undefined);
    }

    private get carsDistance(): number {
        return Math.sqrt( Math.pow((this.carB.getPosition().x - this.carA.getPosition().x), FACTOR_TWO) +
                          Math.pow((this.carB.getPosition().z - this.carA.getPosition().z), FACTOR_TWO));
    }

    private get normalVector(): Vector3 {
        return (new Vector3(
            this.carB.getPosition().x - this.carA.getPosition().x,
            0,
            this.carB.getPosition().z - this.carA.getPosition().z
        ).normalize());
    }

    private get tangentVector(): Vector3 {
        return (new Vector3 (-this.normalVector.z, 0, this.normalVector.x));
    }

    private moveToCarCoordonates(car: Car, speed: Vector3): Quaternion {
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(car.mesh.matrix);
        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(rotationMatrix);
        speed.applyMatrix4(rotationMatrix);

        return rotationQuaternion;
    }

    private moveToWorldCoordonates(rotationQuaternion: Quaternion, speed: Vector3): Vector3 {
        return speed.applyQuaternion(rotationQuaternion.inverse());
    }

    private normalVelocity(speed: Vector3): number {
        return speed.dot(this.normalVector);
    }

    private tangentVelocity(speed: Vector3): number {
        return speed.dot(this.tangentVector);
    }

    private get systemMass(): number {
        return this.carA.mass + this.carB.mass;
    }

    private finalVelocity(normalVelocity: number, tangentVelocity: number): Vector3 {
        return this.normalVector.multiplyScalar(normalVelocity).add(this.tangentVector.multiplyScalar(tangentVelocity));
    }

    /* Two dimentional vector collision method : http://vobarian.com/collisions/2dcollisions2.pdf */
    public vectorElascticCollision(): void {
        if (! this.collisionHandled) {
            this.soundService.playSound(SoundType.CARS_COLLISION);
            const vAinit: Vector3 = this.carA.speed;
            const vBinit: Vector3 = this.carB.speed;

            const quatA: Quaternion = this.moveToCarCoordonates(this.carA, vAinit);
            const quatB: Quaternion = this.moveToCarCoordonates(this.carB, vBinit);

            const vAfinalNormal: number = (this.normalVelocity(vAinit) * (this.carA.mass - this.carB.mass)
                                            + this.carB.mass * this.normalVelocity(vBinit) * FACTOR_TWO) / this.systemMass;
            const vBfinalNormal: number = (this.normalVelocity(vBinit) * (this.carB.mass - this.carA.mass)
                                            + this.carA.mass * this.normalVelocity(vAinit) * FACTOR_TWO) / this.systemMass;

            this.carA.speed  = this.moveToWorldCoordonates(quatA, this.finalVelocity(vAfinalNormal, this.tangentVelocity(vAinit)));
            this.carB.speed  = this.moveToWorldCoordonates(quatB, this.finalVelocity(vBfinalNormal, this.tangentVelocity(vBinit)));

            this.collisionHandled = true;
        }
    }
}
