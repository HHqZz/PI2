
import { Point } from "./points";
import { Vector3, MeshBasicMaterial, CircleGeometry } from "three";

const FIRST_POINT_BOARDER: number = 0xCC99FF;
const RADIUS: number = 2;

describe ("Points", () => {
    let point: Point;

    beforeEach(async (done: () => void) => {
        point = new Point();

        done();
    });

    it ("should be created", () => {
        point = new Point();
        expect(point).toBeTruthy();
    });

    it ("should set position", () => {
        /* tslint:disable: no-magic-numbers */
        point.setPosition( new Vector3(2, 3, 5));
        expect(point.position).toEqual(new Vector3 (2, 3, 5));
    });

    it ("should return position", () => {
        /* tslint:disable: no-magic-numbers */
        point.setPosition( new Vector3(2, 3, 5));
        expect(point.getPosition()).toEqual(new Vector3 (2, 3, 5));
    });

    it ("should be marked as first (different boarder and depth)", () => {
        const pointsArray: Point[] = [new Point(), new Point, new Point];
        pointsArray[0].setAsFirst();

        const firstPointChild: Point = pointsArray[0].children[0] as Point;
        const firstPointMaterial: MeshBasicMaterial = firstPointChild["material"] as MeshBasicMaterial;
        const firstPointGeometry: CircleGeometry = firstPointChild["geometry"] as CircleGeometry;

        expect(firstPointMaterial["color"].getHex()).toEqual(FIRST_POINT_BOARDER);
        expect(firstPointGeometry["parameters"]["radius"]).toBeGreaterThan(RADIUS);
        expect(firstPointChild.position.z).toEqual(0);
    });

});
