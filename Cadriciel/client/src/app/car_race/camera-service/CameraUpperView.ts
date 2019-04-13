import { OrthographicCamera, Vector3 } from "three";
import { CameraInterface } from "./CameraInterface";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const ORIENTATION_FACTOR: number = 70;

const INITIAL_CAMERA_POSITION_Y: number = 25;
const DISTANCE_TO_CAR: number = 10;

export class CameraUpperView extends OrthographicCamera implements CameraInterface {

    public constructor ( width: number, height: number ) {
        super( width  / ORIENTATION_FACTOR, width  / -ORIENTATION_FACTOR,
               height / -ORIENTATION_FACTOR, height / ORIENTATION_FACTOR,
               NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

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

    public updatePosition(positionVector: Vector3): void {
        this.setPosition( positionVector.x,
                          positionVector.y + DISTANCE_TO_CAR,
                          positionVector.z);
        this.lookAt(positionVector);
    }

    public setAspect(width: number, height: number): void {
        this.left = width  / ORIENTATION_FACTOR;
        this.right = width  / -ORIENTATION_FACTOR;
        this.top = height / -ORIENTATION_FACTOR;
        this.bottom = height / ORIENTATION_FACTOR;
        this.updateProjectionMatrix();
    }
}
