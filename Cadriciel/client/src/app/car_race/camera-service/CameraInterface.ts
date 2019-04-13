import { Vector3, Camera } from "three";

export class CameraInterface extends Camera {

    public constructor( width: number, height: number ) {
        super();
    }

    public updateProjectionMatrix(): void { }

    public updatePosition(positionVector: Vector3, directionVector: Vector3): void { }

    public setAspect(width: number, height: number): void { }

}
