import { Vector3, Matrix4, Object3D, Euler, Quaternion, Mesh, BoxGeometry, MeshBasicMaterial } from "three";
import { Engine } from "./engine";
import { MS_TO_SECONDS, GRAVITY, PI_OVER_2, RAD_TO_DEG, BOUNDING_BOX } from "../../constants";
import { Wheel } from "./wheel";
import { Load } from "./load";
import { Headlight, SpotPosition } from "./headlight";
import { Rearlight, SpotBackPosition } from "./rearlight";

export const DEFAULT_WHEELBASE: number = 2.78;
export const DEFAULT_MASS: number = 1515;
export const DEFAULT_DRAG_COEFFICIENT: number = 0.35;

const load: Load = new Load();
const MAXIMUM_STEERING_ANGLE: number = 0.25;
const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
const MINIMUM_SPEED: number = 0.05;
const STOPPING_SPEED: number = 0.25;
const MAXIMUM_SPEED: number = 300;
const NUMBER_REAR_WHEELS: number = 2;
const NUMBER_WHEELS: number = 4;
const PLANE_LIMIT: number = 300;
const TIRE_SIDE_RESISTANCE: number = 0.7;
const TIRE_FRONT_RESISTANCE: number = 0.1;

const MAXIMUN_AI_SPEED: number = 13;
const RANDOM_SCALER_MIN: number = 3;
const RANDOM_SCALER_MAX: number = 5;

// tslint:disable:max-file-line-count
export class Car extends Object3D {
    public isAcceleratorPressed: boolean;
    private readonly engine: Engine;
    private readonly _mass: number;
    private readonly rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly dragCoefficient: number;

    private _speed: Vector3;
    private isBraking: boolean;
    private _mesh: Object3D;
    private steeringWheelDirection: number;
    private weightRear: number;

    private frontLights: Headlight[];
    private rearLights: Rearlight[];
    private boundingBox: Mesh;

    public get mesh(): Object3D {
        return this._mesh;
    }
    public get speed(): Vector3 {
        return this._speed.clone();
    }

    public set speed(newSpeed: Vector3) {
        this._speed = newSpeed;
    }

    public get mass(): number {
        return this._mass;
    }

    public get currentGear(): number {
        return this.engine.currentGear;
    }

    public get rpm(): number {
        return this.engine.rpm;
    }

    public get angle(): number {
        return this._mesh.rotation.y * RAD_TO_DEG;
    }

    public getPosition(): Vector3 {
        return (new Vector3(this._mesh.position.x, this._mesh.position.y, this._mesh.position.z));
    }

    public setPosition(vectorPosition: Vector3): void {
        this._mesh.position.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
    }

    private monitoringPosition(): void {
        if (this.getPosition().x >= PLANE_LIMIT || this.getPosition().x <= -PLANE_LIMIT
            || this.getPosition().z >= PLANE_LIMIT || this.getPosition().z <= -PLANE_LIMIT) {
            this.setPosition(new Vector3(0, 0, 0));
        }
    }

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = new Vector3(0, 0, -1);

        rotationMatrix.extractRotation(this._mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public get orientation(): Vector3 {
        const carDirection: Vector3 = this.direction;
        carDirection.y = this._mesh.rotation.y - PI_OVER_2;

        return carDirection;
    }

    public constructor(
        engine: Engine = new Engine(),
        rearWheel: Wheel = new Wheel(),
        wheelbase: number = DEFAULT_WHEELBASE,
        mass: number = DEFAULT_MASS,
        dragCoefficient: number = DEFAULT_DRAG_COEFFICIENT) {
        super();
        if (wheelbase <= 0) {
            console.error("Wheelbase should be greater than 0.");
            wheelbase = DEFAULT_WHEELBASE;
        }
        if (mass <= 0) {
            console.error("Mass should be greater than 0.");
            mass = DEFAULT_MASS;
        }
        if (dragCoefficient <= 0) {
            console.error("Drag coefficient should be greater than 0.");
            dragCoefficient = DEFAULT_DRAG_COEFFICIENT;
        }
        this.engine = engine;
        this.rearWheel = rearWheel;
        this.wheelbase = wheelbase;
        this._mass = mass;
        this.dragCoefficient = dragCoefficient;

        this.isBraking = false;
        this.steeringWheelDirection = 0;
        this.weightRear = INITIAL_WEIGHT_DISTRIBUTION;
        this._speed = new Vector3(0, 0, 0);
        this.frontLights = [];
        this.rearLights = [];
    }

    public async init(): Promise<void> {
        load.carType = this.name;
        this._mesh = await load.load();
        this._mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this.add(this._mesh);
        this.addHeadlights();

        this.boundingBox = this.setBoundingBox();
    }

    public get boundingbox(): Mesh {
        return this.boundingBox;
    }

    private setBoundingBox(): Mesh {
        // tslint:disable-next-line:no-magic-numbers
        const cube: Mesh =  new Mesh( new BoxGeometry(3.4, 1.3, 1.4),
                                      new MeshBasicMaterial( {color: 0x660099, opacity: 0, transparent: true}) );
        // tslint:disable-next-line:no-magic-numbers
        cube.position.setY((cube.geometry as BoxGeometry)["parameters"]["height"] / 2);
        cube.rotateY(PI_OVER_2);
        cube.name = BOUNDING_BOX + this._mesh.id.toString();
        this._mesh.add(cube);

        return cube;
    }

    private addHeadlights(): void {
        this.frontLights.push(new Headlight(SpotPosition.FRONT_RIGHT));
        this.frontLights.push(new Headlight(SpotPosition.FRONT_LEFT));
        this.rearLights.push(new Rearlight(SpotBackPosition.LEFT_1_POSITION));
        this.rearLights.push(new Rearlight(SpotBackPosition.LEFT_2_POSITION));
        this.rearLights.push(new Rearlight(SpotBackPosition.RIGHT_1_POSITION));
        this.rearLights.push(new Rearlight(SpotBackPosition.RIGHT_2_POSITION));

        this.frontLights.forEach((light) => this._mesh.add(light));
        this.rearLights.forEach((light) => this._mesh.add(light));
    }

    public steerLeft(): void {
        this.steeringWheelDirection = MAXIMUM_STEERING_ANGLE;
    }

    public steerRight(): void {
        this.steeringWheelDirection = -MAXIMUM_STEERING_ANGLE;
    }

    public releaseSteering(): void {
        this.steeringWheelDirection = 0;
    }

    public releaseBrakes(): void {
        this.isBraking = false;
        this.rearLights.forEach((light) => light.backLights(false));
    }

    public brake(): void {
        this.isBraking = true;
        this.rearLights.forEach((light) => light.backLights(true));
    }

    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;
        // Move to car coordinates
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(this._mesh.matrix);
        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(rotationMatrix);
        this._speed.applyMatrix4(rotationMatrix);

        // Physics calculations
        if (this.name !== "mainCar") {
            this.physicsUpdateAi(deltaTime);
        } else {
            this.physicsUpdate(deltaTime);
        }
        // Move back to world coordinates
        this._speed = this.speed.applyQuaternion(rotationQuaternion.inverse());
        // Angular rotation of the car
        const R: number = DEFAULT_WHEELBASE / Math.sin(this.steeringWheelDirection * deltaTime);
        const omega: number = this._speed.length() / R;
        this._mesh.rotateY(omega);
        // Limit position
        this.monitoringPosition();
    }

    public physicsUpdateAi(deltaTime: number): void {
        const accelerationAi: Vector3 = this.getLongitudinalForce().divideScalar(this._mass);
        const deltaSpeed: Vector3 = accelerationAi.multiplyScalar(deltaTime);
        this._speed.add(deltaSpeed);
        this._mesh.position.add(this.getDeltaPosition(deltaTime));
        this.rearWheel.update(this._speed.length());
        if (this._speed.length() >= MAXIMUN_AI_SPEED) {
            this._speed.setLength(MAXIMUN_AI_SPEED - this.generateRandomScaler(RANDOM_SCALER_MIN, RANDOM_SCALER_MAX));
        }
    }

    private generateRandomScaler(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private physicsUpdate(deltaTime: number): void {
        this.rearWheel.angularVelocity += this.getAngularAcceleration() * deltaTime;
        this.engine.update(this._speed.length(), this.rearWheel.radius);
        this.weightRear = this.getWeightDistribution();
        this._speed.add(this.getDeltaSpeed(deltaTime));
        if ( this._speed.length() <= STOPPING_SPEED ) {
            this._speed.setLength(this.isBraking ? 0 : this._speed.length() <= MINIMUM_SPEED ? 0 : this._speed.length());
        } else if (this._speed.length() >= MAXIMUM_SPEED) {
            this._speed.setLength(MAXIMUM_SPEED);
        }
        this._mesh.position.add(this.getDeltaPosition(deltaTime));
        this.rearWheel.update(this._speed.length());
    }

    private getWeightDistribution(): number {
        const acceleration: number = this.getAcceleration().length();
        // tslint:disable:no-magic-numbers
        const distribution: number =
            this._mass + (1 / this.wheelbase) * this._mass * acceleration / 2;

        return Math.min(Math.max(0.25, distribution), 0.75);
    }
    // tslint:enable:no-magic-numbers

    private getLongitudinalForce(): Vector3 {
        const resultingForce: Vector3 = new Vector3();
        if (this._speed.length() >= MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce();
            const rollingResistance: Vector3 = this.getRollingResistance();
            resultingForce.add(dragForce).add(rollingResistance).add(this.tireResistance).add(this.backwardAdjustment);
        }
        if (this.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector3 = this.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce).add(this.tireResistance);
        } else if (this.isBraking && this.isGoingForward()) {
            const brakeForce: Vector3 = this.getBrakeForce();
            resultingForce.add(brakeForce).add(this.tireResistance);
        }

        return resultingForce;
    }

    private get backwardAdjustment(): Vector3 {
        const movement: Vector3 = new Vector3(0, 0, 0);

        if (this.backwardResistance < 0) {
            movement.copy(this._speed);
            movement.projectOnVector(this.direction);
            movement.multiplyScalar(this._mass * GRAVITY * TIRE_FRONT_RESISTANCE);
        }

        return movement;
    }

    private get backwardResistance(): number {
        return Math.sign(this.speed.dot(this.direction.normalize()));
    }

    private get tireResistance(): Vector3 {
        const movement: Vector3 = new Vector3(0, 0, 0);
        const sideVect: Vector3 = new Vector3(0, 0, 0);
        sideVect.crossVectors(this.direction, this._mesh.up);

        movement.copy(this._speed);
        movement.projectOnVector(sideVect);
        movement.multiplyScalar(this._mass * GRAVITY * TIRE_SIDE_RESISTANCE);

        return movement;
    }

    private getRollingResistance(): Vector3 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html
        // tslint:disable-next-line:no-magic-numbers
        const rollingCoefficient: number = (1 / tirePressure) * (Math.pow(this.speed.length() * 3.6 / 100, 2) * 0.0095 + 0.01) + 0.005;

        return this.direction.multiplyScalar(rollingCoefficient * this._mass * GRAVITY * this.backwardResistance);
    }

    private getDragForce(): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = this.direction;
        resistance.multiplyScalar(airDensity * carSurface * -this.dragCoefficient *
                                  this.speed.length() * this.speed.length() * this.backwardResistance);

        return resistance;
    }

    private getTractionForce(): number {
        const force: number = this.getEngineForce();
        const maxForce: number =
            this.rearWheel.frictionCoefficient * this._mass * GRAVITY * this.weightRear * NUMBER_REAR_WHEELS / NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }

    private getAngularAcceleration(): number {
        return this.getTotalTorque() / (this.rearWheel.inertia * NUMBER_REAR_WHEELS);
    }
    private getBrakeForce(): Vector3 {
        return this.direction.multiplyScalar(this.rearWheel.frictionCoefficient * this._mass * GRAVITY);
    }
    private getBrakeTorque(): number {
        return this.getBrakeForce().length() * this.rearWheel.radius;
    }
    private getTractionTorque(): number {
        return this.getTractionForce() * this.rearWheel.radius;
    }
    private getTotalTorque(): number {
        return this.getTractionTorque() * NUMBER_REAR_WHEELS + this.getBrakeTorque();
    }
    private getEngineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }
    private getAcceleration(): Vector3 {
        return this.getLongitudinalForce().divideScalar(this._mass);
    }
    private getDeltaSpeed(deltaTime: number): Vector3 {
        return this.getAcceleration().multiplyScalar(deltaTime);
    }
    private getDeltaPosition(deltaTime: number): Vector3 {
        return this.speed.multiplyScalar(deltaTime);
    }
    private isGoingForward(): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return this.speed.normalize().dot(this.direction) > 0.05;
    }
    public switchHeadlights(dayMode: boolean): void {
        this.frontLights.forEach((light) => light.switchHeadlights(dayMode));
    }
}
