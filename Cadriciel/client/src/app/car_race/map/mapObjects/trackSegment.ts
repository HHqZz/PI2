import { Vector3, Mesh, PlaneBufferGeometry, TextureLoader, PlaneGeometry,
         DoubleSide, RepeatWrapping, ClampToEdgeWrapping, CircleGeometry,
         MeshPhongMaterial } from "three";
import { ITrackSegment } from "./iTrackSegment";
import { TRACK_SEGMENT, JUNCTION, START_LINE, TRACK_WIDTH } from "../../../constants";

export const TRACK_TEXTURE: string = "../assets/maps/Textures/track_tile1.png";
export const TRACK_START_TEXTURE: string = "../assets/maps/Textures/track_tile1_start.png";
export const TRACK_JUNCTION_TEXTURE: string = "../assets/maps/Textures/track_tile1_junction.png";
const NUMBER_TWO: number = 2;
const ROTATION: number = Math.PI / NUMBER_TWO;
const TEXTURE_SIZE: number = 256;
const ARCS: number = 32;

export class TrackSegment extends Mesh implements ITrackSegment {
    public isFirst: boolean;
    private _start: Vector3;
    private _end: Vector3;

    public constructor(start: Vector3 = new Vector3(), end: Vector3 = new Vector3()) {

        super(new PlaneBufferGeometry(1, 1), new MeshPhongMaterial());
        this._start = new Vector3(start.x, start.y, start.z);
        this._end = new Vector3(end.x, end.y, end.z);
        this.initialize();
        this.isFirst = false;
    }

    public get start(): Vector3 {
        return this._start;
    }

    public get end(): Vector3 {
        return this._end;
    }

    private initialize(): void {

        this.geometry = new PlaneGeometry(this.scaleLength(), TRACK_WIDTH);
        this.material = this.initMaterial(TRACK_TEXTURE);
        this.setPosition();
        this.name = TRACK_SEGMENT;
    }

    private initMaterial(materialTexture: string): MeshPhongMaterial {
        const repeatRatio: number = materialTexture === TRACK_TEXTURE ?
            (TEXTURE_SIZE * this.scaleLength()) / (TEXTURE_SIZE * TRACK_WIDTH * NUMBER_TWO) :
            (TEXTURE_SIZE * TRACK_WIDTH) / (TEXTURE_SIZE * TRACK_WIDTH * NUMBER_TWO);

        return new MeshPhongMaterial({
            map: new TextureLoader().load(materialTexture, (texture) => {
                texture.wrapS = RepeatWrapping;
                texture.wrapT = ClampToEdgeWrapping;
                texture.repeat.set(repeatRatio, 1);
            }),
            side: DoubleSide,
            depthWrite: false,
            name: materialTexture
        });
    }

    private scaleLength(): number {
        return Math.sqrt((Math.pow((this._end.x - this._start.x), NUMBER_TWO) +
            Math.pow((this._end.z - this._start.z), NUMBER_TWO)));
    }

    private setPosition(): void {
        const middleX: number = (this._start.x + this._end.x) / NUMBER_TWO;
        const middleZ: number = (this._start.z + this._end.z) / NUMBER_TWO;
        this.position.set(middleX, 0, middleZ);

        this.rotateY(-this.getAngle());
        this.rotateX(ROTATION);
    }

    public getAngle(): number {
        const deltaX: number = this._end.x - this._start.x;
        const deltaZ: number = this._end.z - this._start.z;

        return Math.atan(deltaZ / deltaX);
    }

    public addJunction(): Mesh {
        const geometry: CircleGeometry = new CircleGeometry(TRACK_WIDTH / NUMBER_TWO, ARCS);
        const material: MeshPhongMaterial = new MeshPhongMaterial({
            map: new TextureLoader().load(TRACK_JUNCTION_TEXTURE),
            side: DoubleSide,
            depthWrite: false,
            name: TRACK_JUNCTION_TEXTURE
        });

        const junction: Mesh = new Mesh(geometry, material);
        junction.position.copy(this._start);
        junction.rotateX(ROTATION);
        junction.name = JUNCTION;

        return junction;
    }

    public setAsFirst(): void {
        const material: MeshPhongMaterial = new MeshPhongMaterial();
        const geometry: PlaneGeometry = new PlaneGeometry(TRACK_WIDTH, TRACK_WIDTH);

        const startLine: Mesh = new Mesh(geometry, material);
        startLine.material = this.initMaterial(TRACK_START_TEXTURE);
        startLine.name = START_LINE;
        startLine.renderOrder = 1;

        this.add(startLine);
    }
}
