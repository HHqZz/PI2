
import { Vector3, CircleGeometry, MeshBasicMaterial, Mesh} from "three";
import { EDITOR_POINT } from "../../constants";

const POINTS_COLOR: number = 0x4D004D;
const FIRST_POINT_BOARDER: number = 0xCC99FF;
const RADIUS: number = 6;
const RADIUS_ADJUST: number = 2;
const ARCS: number = 32;
export const FIRST_POINT: string = "FirstPoint";

export class Point extends Mesh {

    public constructor () {

        const geometry: CircleGeometry = new CircleGeometry(RADIUS, ARCS);
        const material: MeshBasicMaterial = new MeshBasicMaterial({ color: POINTS_COLOR, depthWrite: false });

        super(geometry, material);
        this.renderOrder = 1;
        this.name = EDITOR_POINT;
    }

    public getPosition(): Vector3 { return this.position; }

    public setPosition(position: Vector3): void { this.position.set(position.x, position.y, position.z); }

    public setAsFirst(): void {
        const geometry: CircleGeometry = new CircleGeometry(RADIUS + RADIUS_ADJUST, ARCS);
        const material: MeshBasicMaterial = new MeshBasicMaterial({ color: FIRST_POINT_BOARDER, depthWrite: false });
        const firstPointStyle: Mesh = new Mesh(geometry, material);
        firstPointStyle.name = FIRST_POINT;

        this.add(firstPointStyle);
    }

    public previewMaterial(color: number = 0x000000): void {
        (this.material as MeshBasicMaterial).color.set(color);
        this.visible = false;
    }
}
