import {Vector3} from "three";
import {Camera3rdPerson} from "./Camera3rdPerson";

const WIDTH: number = 1500;
const HEIGHT: number = 800;

describe ("Camera", () => {
    let camera: Camera3rdPerson;

    beforeEach(async (done: () => void) => {
        camera = new Camera3rdPerson(WIDTH, HEIGHT);

        done();
    });

    it ("should be changing coordonates", () => {
        camera.updatePosition(new Vector3(1, 1, 1), new Vector3(1, 0, 1));
        /* tslint:disable: no-magic-numbers */
        expect(camera.position).toEqual(new Vector3 (-4, 3, -4));

    });

    it ("should be changing coordonates in time ", () => {
        camera.updatePosition(new Vector3(5, 6, 1), new Vector3(2, 0, 5));
        expect(camera.position).toEqual(new Vector3 (-5, 8, -24));

        camera.updatePosition(new Vector3(8, 12, 5), new Vector3(6, 0, 9 ));
        expect(camera.position).toEqual(new Vector3 (-22, 14, -40));

        camera.updatePosition(new Vector3(19, 11, 60), new Vector3(10, 15, -20));
        expect(camera.position).toEqual(new Vector3 (-31, 13, 160));

    });

});
