import {Vector3} from "three";
import {CameraUpperView} from "./CameraUpperView";

describe ("Camera", () => {
    let camera: CameraUpperView;

    beforeEach(async (done: () => void) => {
        /* tslint:disable: no-magic-numbers */
        camera = new CameraUpperView(100, 100);
        done();
    });

    it ("should be changing cordonates", () => {
        camera.updatePosition(new Vector3(1, 0, 1) );
        expect(camera.position).toEqual(new Vector3 (1, 10, 1));
    });

    it ("should be changing coordonates in time ", () => {
        camera.updatePosition(new Vector3(2, 0, 5));
        expect(camera.position).toEqual(new Vector3 (2, 10, 5));

        camera.updatePosition(new Vector3(6, 0, 9));
        expect(camera.position).toEqual(new Vector3 (6, 10, 9));

        camera.updatePosition(new Vector3(10, 15, -20));
        expect(camera.position).toEqual(new Vector3 (10, 25, -20));

    });
});
