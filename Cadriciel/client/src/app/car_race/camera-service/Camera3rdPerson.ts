import { PerspectiveCamera, Vector3 } from "three";
import { CameraInterface } from "./CameraInterface";

const FAR_CLIPPING_PLANE: number = 2000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Y: number = 25;
const DISTANCE_TO_CAR: number = -5;
const ELEVATION_ON_Y_AXIS: number = 2;

export class Camera3rdPerson extends PerspectiveCamera implements CameraInterface {

    public constructor (width: number, height: number) {
        super(FIELD_OF_VIEW, width / height, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

        this.position.x = 0;
        this.position.y = INITIAL_CAMERA_POSITION_Y;
        this.position.z = 0;

        this.lookAt(new Vector3(0, 0, 0));
    }

    private setPosition( posX: number, posY: number, posZ: number): void {
        this.position.x = posX;
        this.position.y = posY;
        this.position.z = posZ;
    }

    public updatePosition(positionVector: Vector3, directionVector: Vector3): void {
        const newPosition: Vector3
                       = directionVector.multiplyScalar(DISTANCE_TO_CAR)
                                        .add(new Vector3(0, ELEVATION_ON_Y_AXIS - directionVector.y, 0));

        this.setPosition(newPosition.x + positionVector.x,
                         newPosition.y + positionVector.y,
                         newPosition.z + positionVector.z);
        this.lookAt(new Vector3(positionVector.x, newPosition.y, positionVector.z));
    }

    public setAspect(width: number, height: number): void {
        this.aspect = width / height;
    }
}
