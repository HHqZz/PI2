import { Vector3, PointLight, Math, CircleGeometry, Mesh, MeshPhongMaterial } from "three";

const LIGHT_COLOR: number = 0xFF0000;
const OFF: number = 0;
const ON: number = 1;
const DISTANCE: number = 0.3;
const DECAY: number = 2;

const CIRCLE_COLOR: number = 0x660000;
const CIRCLE_RADIUS: number = 0.04;
const CIRCLE_ROTATION: number = 90;
const CIRCLE_ARCS: number = 32;
const CIRCLE_POSITION: number = -0.02;

export const LEFT_1_X: number  = -0.44;
export const LEFT_2_X: number  = -0.28;
export const RIGHT_1_X: number  = 0.28;
export const RIGHT_2_X: number  = 0.44;

export const BACK_EDGE_POSITION: number = 1.53;
export const BACK_MIDDLE_POSITION: number = 1.57;
export const LEVEL_EDGE: number = 0.61;
export const LEVEL_MIDDLE: number = 0.61;

export enum SpotBackPosition { LEFT_1_POSITION = 0, LEFT_2_POSITION = 1,
                           RIGHT_1_POSITION  = 2, RIGHT_2_POSITION  = 3 }

const spotPositions: Vector3[] = [
        new Vector3(LEFT_1_X, LEVEL_EDGE, BACK_EDGE_POSITION),
        new Vector3(LEFT_2_X, LEVEL_MIDDLE, BACK_MIDDLE_POSITION),
        new Vector3(RIGHT_1_X, LEVEL_MIDDLE, BACK_MIDDLE_POSITION),
        new Vector3(RIGHT_2_X, LEVEL_EDGE, BACK_EDGE_POSITION),
];

export class Rearlight extends PointLight {

    public constructor(spotType: number = 0) {
        super(LIGHT_COLOR, OFF, DISTANCE, DECAY);
        this.position.copy(spotPositions[Math.clamp(spotType, 0, spotPositions.length)]);
        this.initReflect();
    }

    private initReflect(): void {
        const circle: Mesh = new Mesh(new CircleGeometry(CIRCLE_RADIUS, CIRCLE_ARCS),
                                      new MeshPhongMaterial({color: CIRCLE_COLOR}));
        circle.position.set( 0, 0, CIRCLE_POSITION);
        circle.rotateZ(Math.degToRad(CIRCLE_ROTATION));

        this.add(circle);
    }

    public backLights(turnOn: boolean): void {
        this.intensity = turnOn ? ON : OFF;
    }
}
