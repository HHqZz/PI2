import { Intersection, Object3D, Vector3, Raycaster } from "three";
import { CollisionPhysic } from "./collisionPhysic";
import { Car } from "../car/car";
import { SoundService } from "../sound-service/sound.service";
import { carCorners, CENTER_ELEVATION } from "../../constants";

export class CarsCollisionDetector {
    private mainCar: Car;
    private collidableCars: Object3D[];
    private collidings: Intersection[];
    private physicsHandler: CollisionPhysic;
    private collisionDetected: boolean;

    public constructor(private soundService: SoundService) {
        this.mainCar = new Car();
        this.collidableCars = [];
        this.collidings = [];
        this.physicsHandler = new CollisionPhysic(this.soundService);
        this.collisionDetected = false;
    }

    public setUp(mainCar: Car, collidables: Car[]): void {
        this.mainCar = mainCar;
        collidables.forEach((object) => {
            if (this.mainCar.boundingbox !== object.boundingbox) {
                this.collidableCars.push(object.boundingbox);
            }
        });
    }

    public detect(): void {
        for (const corner of carCorners) {
            const ray: Raycaster = new Raycaster( this.carCenter, this.raysDirection(corner).clone().normalize() );
            this.collidings = ray.intersectObjects( this.collidableCars );

            if ( this.checkCollision(this.raysDirection(corner)) ) {
                this.collisionDetected = true;
            }
        }
        if (this.collisionDetected) {
            this.carsCollision();
            this.collisionDetected = false;
        }
        this.physicsHandler.enableCollisionTest();
    }

    private get carCenter(): Vector3 {
        return new Vector3(this.mainCar.getPosition().x, CENTER_ELEVATION, this.mainCar.getPosition().z);
    }

    private raysDirection(position: Vector3): Vector3 {
        return position.clone().applyMatrix4( this.mainCar.mesh.matrix )
                       .sub( this.mainCar.mesh.position );
    }

    private checkCollision(direction: Vector3): boolean {
        return this.collidings.length > 0 && this.collidings[0].distance < direction.length();
    }

    private carsCollision(): void {
        this.collidings.forEach((collided) => {
            this.physicsHandler.setUpColliders(this.mainCar, this.getCar(collided.object));
            this.physicsHandler.vectorElascticCollision();
        });
    }

    private getCar(object: Object3D): Object3D {
        return object.parent.parent;
    }
}
