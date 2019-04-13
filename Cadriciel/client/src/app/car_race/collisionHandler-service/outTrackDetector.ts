import { Mesh, Intersection, Vector3, Raycaster } from "three";
import { Car } from "../car/car";
import { CollisionOutTrack } from "./collisionOutTrack";
import { SoundService } from "../sound-service/sound.service";
import { TrackSegment } from "../map/mapObjects/trackSegment";
import { carFront, CENTER_ELEVATION, JUNCTION, TRACK_SEGMENT } from "../../constants";

export class OutTrackDetector {

    private mainCar: Car;
    private collidings: Intersection[];
    private outTrackHandler: CollisionOutTrack;
    private surfaces: Mesh[];
    private cornerCollision: boolean;
    private junctionCenter: Vector3;
    private segmentPoints: Vector3[];

    public constructor(private soundService: SoundService) {
        this.mainCar = new Car();
        this.collidings = [];
        this.outTrackHandler = new CollisionOutTrack(this.soundService);
        this.surfaces = [];
        this.cornerCollision = false;
        this.junctionCenter = new Vector3();
        this.segmentPoints = [new Vector3(), new Vector3()];
    }

    public setUp(car: Car, surafaces: Mesh[]): void {
        this.mainCar = car;
        surafaces.forEach((object) => {
            this.surfaces.push(object as Mesh);
        });
    }

    public detectOutTrack(): void {
        const ray: Raycaster = new Raycaster( this.carCenter, this.raysDirection(carFront).clone().normalize() );
        this.collidings = ray.intersectObjects( this.surfaces );

        if ( this.collidings.length > 0 ) {
            this.keepTrackPosition();
        } else {
            this.outTrackCollision();
        }
    }

    private get carCenter(): Vector3 {
        return new Vector3(this.mainCar.getPosition().x, CENTER_ELEVATION, this.mainCar.getPosition().z);
    }

    private raysDirection(position: Vector3 ): Vector3 {
        return position.clone().applyMatrix4( this.mainCar.mesh.matrix )
                       .sub( this.mainCar.mesh.position );
    }

    private outTrackCollision(): void {
        this.outTrackHandler.car = this.mainCar;
        if (this.cornerCollision) {
            this.outTrackHandler.hitCorner(this.junctionCenter);
        } else {
            this.outTrackHandler.hitWall(this.segmentPoints[0], this.segmentPoints[1]);
        }
        this.outTrackHandler.enableCollisionTest();
    }

    private keepTrackPosition(): void {
        this.cornerCollision = false;
        this.collidings.forEach((object: Intersection) => {
            if (object.object.name === JUNCTION) {
                this.junctionCenter = object.object.position;
                this.cornerCollision = true;
            } else if (object.object.name === TRACK_SEGMENT) {
                this.segmentPoints[0] = (object.object as TrackSegment).start;
                this.segmentPoints[1] = (object.object as TrackSegment).end;
            }
        });
    }
}
