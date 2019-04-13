import { TrackSegment, TRACK_START_TEXTURE, TRACK_JUNCTION_TEXTURE, TRACK_TEXTURE } from "./trackSegment";
import { Vector3, PlaneGeometry, MeshBasicMaterial, Mesh, CircleGeometry } from "three";
import { START_LINE } from "../../../constants";

describe ("TrackSegment", () => {
    let refSegment: TrackSegment;
    beforeEach(async (done: () => void) => {
         /* tslint:disable: no-magic-numbers */
        refSegment = new TrackSegment(new Vector3(0, 0, 3), new Vector3(5, 0, 10));
        done();
    });

    it ("should be created", () => {
        const segment: TrackSegment = new TrackSegment(new Vector3(0, 3, 0), new Vector3(5, 10, 0));
        expect(segment).toBeTruthy();
    });

    it ("should scale segment's length", () => {
        const distance: number = Math.sqrt((Math.pow((refSegment.end.x - refSegment.start.x), 2) +
                                            Math.pow((refSegment.end.z - refSegment.start.z), 2)));
        const newSegment: TrackSegment = new TrackSegment(new Vector3(0, 0, 3), new Vector3(5, 0, 10));
        expect(newSegment["scaleLength"]()).toEqual(distance);
    });

    it ("should calculate segment's angle", () => {
        const angle: number = Math.atan((refSegment.end.z - refSegment.start.z) / (refSegment.end.x - refSegment.start.x));
        const newSegment: TrackSegment = new TrackSegment(new Vector3(0, 0, 3), new Vector3(5, 0, 10));
        expect(newSegment["getAngle"]()).toEqual(angle);
    });

    it ("should set segment's position", () => {
        const angle: number = Math.atan((refSegment.end.z - refSegment.start.z) / (refSegment.end.x - refSegment.start.x));
        const position: Vector3 = new Vector3 ( ((refSegment.start.x + refSegment.end.x) / 2),
                                                0,
                                                ((refSegment.start.z + refSegment.end.z) / 2));
        const newSegment: TrackSegment = new TrackSegment(new Vector3(0, 0, 3), new Vector3(5, 0, 10));
        newSegment["setPosition"]();
        expect(newSegment.position).toEqual(position);
        expect(newSegment.rotation.y.toFixed(6)).toEqual(angle.toFixed(6));
    });

    it ("should set first segment's as start line", () => {
        const newSegment: TrackSegment = new TrackSegment(new Vector3(0, 0, 3), new Vector3(5, 0, 10));
        newSegment["setAsFirst"]();
        const startLine: Mesh = newSegment.getObjectByName(START_LINE) as Mesh;
        expect(startLine).toBeDefined();
        if (startLine !== undefined) {
            expect((startLine.material as MeshBasicMaterial).name).toEqual(TRACK_START_TEXTURE);
            expect((startLine.geometry as PlaneGeometry).parameters["width"])
                    .toEqual((newSegment.geometry as PlaneGeometry).parameters["height"]);
            expect((startLine.geometry as PlaneGeometry).parameters["height"])
                    .toEqual((newSegment.geometry as PlaneGeometry).parameters["height"]);
        }
    });

    it ("should draw segment's junction", () => {
        const newSegment: TrackSegment = new TrackSegment(new Vector3(0, 0, 3), new Vector3(5, 0, 10));
        const object: Mesh = newSegment["addJunction"]();
        expect((object.material as MeshBasicMaterial)["name"]).toEqual(TRACK_JUNCTION_TEXTURE);
        expect((object.geometry as CircleGeometry)["parameters"].radius)
                .toEqual((newSegment.geometry as PlaneGeometry).parameters["height"] / 2);
        expect(object.geometry.type).toBe("CircleGeometry");
        expect(object.position).toEqual(newSegment.start);
    });

    it ("should initialize segment's texture", () => {
        const newSegment: TrackSegment = new TrackSegment(new Vector3(0, 0, 3), new Vector3(5, 0, 10));
        const material: MeshBasicMaterial = newSegment["initMaterial"](TRACK_TEXTURE);
        expect(material.name).toEqual(TRACK_TEXTURE);
    });

    it ("should initialize segment", () => {
        const newSegment: TrackSegment = new TrackSegment(new Vector3(0, 0, 3), new Vector3(5, 0, 10));
        newSegment["initialize"]();
        const distance: number = Math.sqrt((Math.pow((refSegment.end.x - refSegment.start.x), 2) +
                                            Math.pow((refSegment.end.z - refSegment.start.z), 2)));
        const segmentGeometry: PlaneGeometry = newSegment["geometry"] as PlaneGeometry;
        const segmentMaterial: MeshBasicMaterial = newSegment["material"] as MeshBasicMaterial;
        expect(segmentGeometry["parameters"].width).toEqual(distance);
        expect(segmentMaterial.name).toEqual(TRACK_TEXTURE);
        expect(newSegment.position).toEqual(refSegment.position);
    });
});
