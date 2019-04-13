import { Vector3 } from "three";

/******** Maths ********/
export const STRAIGHT_ANGLE_DEG: number = 180;
export const DEG_TO_RAD: number = Math.PI / STRAIGHT_ANGLE_DEG;
export const MIN_TO_SEC: number = 60;
export const MS_TO_SECONDS: number = 1000;
export const GRAVITY: number = -9.81;
export const RAD_TO_DEG: number = STRAIGHT_ANGLE_DEG / Math.PI;
// tslint:disable-next-line:no-magic-numbers
export const PI_OVER_2: number = Math.PI / 2;
export const FACTOR_TWO: number = 2;
export const PRECISION: number = 2;

/******** Keycodes ********/
export const KEYCODE_BACKSPACE: number = 8;
export const KEYCODE_DELETE: number = 46;
export const KEYCODE_LARROW: number = 37;
export const KEYCODE_RARROW: number = 39;
export const ACCELERATE_CODE: string = "KeyW";      // w
export const LEFT_CODE: string = "KeyA";            // a
export const BRAKE_CODE: string = "KeyS";           // s
export const RIGHT_CODE: string = "KeyD";           // d
export const SWITCH_CAMERA_CODE: string = "KeyC";   // c
export const NIGHT_DAY_MODE_CODE: string = "KeyN";  // n
export const ZOOM_IN_CODE: string = "Equal";        // +
export const ZOOM_OUT_CODE: string = "Minus";       // -

/******** Cameras ********/
export const CAMERA_INITIAL_ZOOM: number = 1;
export const CAMERA_ZOOM: number = 0.05;

/******** Names ********/
export const BOUNDING_BOX: string = "Box";
export const PLAYER_CAR: string = "mainCar";
export const VIRTUAL_CAR: string = "virtualCar";
export const TRACK_SEGMENT: string = "TrackSegment";
export const JUNCTION: string = "Junction";
export const START_LINE: string = "StartLine";
export const GROUND: string = "Ground";
export const EDITOR_SEGMENT: string = "EditorSegment";
export const EDITOR_POINT: string = "EditorPoint";

/******** Raycasters ********/
export const CENTER_ELEVATION: number = 0.02;
/* tslint:disable: no-magic-numbers */
export const carFront: Vector3 = new Vector3(0, -1, -1.8);
export const carCorners: Vector3[] = [
    new Vector3(0.65, 0.65, -1.5),          // Front left
    new Vector3(0.325, 0.65, -1.5),         // Front middle left
    new Vector3(0, 0.65, -1.8),             // Front middle
    new Vector3(-0.325, 0.65, -1.5),        // Front middle right
    new Vector3(-0.65, 0.65, -1.5),         // Front right
    new Vector3(-0.7, 0.65, -0.75),         // Middle front right
    new Vector3(-0.7, 0.65, 0),             // Middle Right
    new Vector3(-0.7, 0.65, 0.75),          // Middle back right
    new Vector3(-0.65, 0.65, 1.5),          // Back Right
    new Vector3(-0.325, 0.65, 1.5),         // Back middle Right
    new Vector3(0, 0.65, 1.6),              // Back Middle
    new Vector3(0.325, 0.65, 1.5),          // Back Middle left
    new Vector3(0.65, 0.65, 1.5),           // Back Left
    new Vector3(0.7, 0.65, 0.75),           // Middle back left
    new Vector3(0.7, 0.65, 0),              // Middle left
    new Vector3(0.7, 0.65, -0.75)           // Middle front left
];
/* tslint:enable: no-magic-numbers */

/******** Factors ********/
export const TRACK_WIDTH: number = 10;
export const RIGHT: number = -1;
export const LEFT: number = 1;

/******** Cars Positions ********/
// tslint:disable:no-magic-numbers
export const CAR1_POSITION: Vector3 = new Vector3(-15, 0, 10);
export const CAR2_POSITION: Vector3 = new Vector3(-20, 0, -10);
export const CAR3_POSITION: Vector3 = new Vector3(-20, 0, 10);

export interface IPathType {
    position: number;
    side: number;
}
export const PATH_POSITIONS: IPathType [] = [
            { position: TRACK_WIDTH / 4, side: -1 },
            { position: TRACK_WIDTH / 4, side: 1 },
            { position: TRACK_WIDTH * 0.325, side: 1 },
            { position: TRACK_WIDTH / 6, side: -1 }
        ];
// tslint:enable:no-magic-numbers

export enum Path { ONE = 0, TWO = 1, THREE = 2, FOUR = 3 }
export enum CarNumber { PLAYER = 0, CAR_1 = 1, CAR_2 = 2, CAR_3 = 3 }

/******** CrossWord ********/
export const LEVEL_EASY: number = 1;
export const LEVEL_MEDIUM: number = 2;
export const LEVEL_HARD: number = 3;
