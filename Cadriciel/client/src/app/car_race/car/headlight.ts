import { SpotLight, Vector3, Math } from "three";

const LIGHT_COLOR: number = 0xEBD325;
const LIGHT_DISTANCE: number = 20;
const INTENSITY: number = 2;
const OFF: number = 0;
const DECAY: number = 2;
const CONE_ANGLE: number = 0.7;
const PENUMBRA: number = 1;

export const RIGHT_POSITION: number = -0.5;
export const LEFT_POSITION: number  = 0.5;
export const FRONT_POSITION: number = -1.5;
export const LEVEL: number = 0.7;

const TARGET_POSITION: number = -5;

export enum SpotPosition { FRONT_RIGHT = 0, FRONT_LEFT = 1 }

const spotPositions: Vector3[] = [
        new Vector3(RIGHT_POSITION, LEVEL, FRONT_POSITION),
        new Vector3(LEFT_POSITION, LEVEL, FRONT_POSITION)
];

export class Headlight extends SpotLight {

    public constructor(spotType: number = 0) {
        super(LIGHT_COLOR);
        this.initHeadlight();
        this.position.copy(spotPositions[Math.clamp(spotType, 0, spotPositions.length)]);
        this.initTarget();
    }

    private initHeadlight(): void {
        this.distance = LIGHT_DISTANCE;
        this.intensity = OFF;
        this.decay = DECAY;
        this.angle = CONE_ANGLE;
        this.penumbra = PENUMBRA;
    }

    private initTarget(): void {
        this.target.position.set(0, 0, TARGET_POSITION );
        this.add(this.target);
    }

    public switchHeadlights(dayMode: boolean): void {
        this.intensity = dayMode ? OFF : INTENSITY;
    }
}
