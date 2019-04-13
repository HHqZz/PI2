import { MapsFactory } from "./mapsFactory";
import { EditorRenderService, GRID_SIZE } from "./editorRender.service";
import { Point } from "./points";
import { Vector3 } from "three";
import { inject, TestBed } from "@angular/core/testing";

describe ("MapsFactory", () => {
    let mapsFactory: MapsFactory;

    /* tslint:disable: no-magic-numbers */
    const clicks: Vector3[] = [ new Vector3(4, -5, 0),
                                new Vector3(4, -5, 0),
                                new Vector3(-4, 5, 0),
                                new Vector3(-4, -5, 0) ];

    const point1: Point = new Point();
    const point2: Point = new Point();
    const point3: Point = new Point();
    point1.setPosition(clicks[0]);
    point2.setPosition(clicks[1]);
    point3.setPosition(clicks[2]);

    const container: HTMLDivElement = document.createElement("div");
    document.body.appendChild(container);

    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [EditorRenderService]
        });
        done();
    });

    beforeEach(inject([EditorRenderService], (render: EditorRenderService) => {
        render.initialize(container);
        mapsFactory = new MapsFactory(render);
    }));

    it ("should be created",  inject([EditorRenderService], (render: EditorRenderService) => {
        render.initialize(container);
        mapsFactory = new MapsFactory(render);
        expect(mapsFactory).toBeTruthy();
    }));

    it ("should be empty when started", () => {
        /* tslint:disable: no-magic-numbers */
        expect(mapsFactory.getPoints().length).toEqual(0);
        expect(mapsFactory.getSegments().length).toEqual(0);
    });

    it ("should add new points", () => {
        /* tslint:disable: no-magic-numbers */
        mapsFactory["addPoints"](clicks[0]);
        mapsFactory["addPoints"](clicks[1]);
        mapsFactory["addPoints"](clicks[2]);
        expect(mapsFactory.getPoints().length).toEqual(3);
        expect(mapsFactory.getPoints()[0].getPosition()).toEqual(point1.getPosition());
        expect(mapsFactory.getPoints()[2].getPosition()).toEqual(point3.getPosition());
        expect(mapsFactory.getSegments().length).toEqual(2);
    });

    it ("should delete a point", () => {
        /* tslint:disable: no-magic-numbers */
        mapsFactory["addPoints"](clicks[0]);
        mapsFactory["addPoints"](clicks[1]);
        mapsFactory["addPoints"](clicks[2]);

        mapsFactory["removePoint"]();

        expect(mapsFactory.getPoints().length).toEqual(2);
        expect(mapsFactory.getPoints()[0].getPosition()).toEqual(point1.getPosition());
        expect(mapsFactory.getPoints()[1].getPosition()).toEqual(point2.getPosition());
        expect(mapsFactory.getSegments().length).toEqual(1);
        document.body.removeChild(container);
    });

    it ("should return selected point", () => {
        /* tslint:disable: no-magic-numbers */
        mapsFactory["addPoints"](clicks[0]);
        mapsFactory["addPoints"](clicks[1]);
        mapsFactory["addPoints"](clicks[2]);

        expect(mapsFactory["objectSelected"](clicks[0]).position).toEqual(clicks[0]);
    });

    it ("should be marked as valid", () => {
        const testClicks: Vector3[] = [ new Vector3(-26, 17, 0),
                                        new Vector3(9, 19, 0),
                                        new Vector3(10, -12, 0),
                                        new Vector3(-21, -15, 0) ];

        mapsFactory["addPoints"](testClicks[0]);
        mapsFactory["addPoints"](testClicks[1]);
        mapsFactory["addPoints"](testClicks[2]);
        mapsFactory["addPoints"](testClicks[3]);
        mapsFactory["trackClosed"] = true;

        expect(mapsFactory.trackValidity()).toBe(true);
    });

    it ("should close track and prevent adding new points", () => {
        mapsFactory["addPoints"](clicks[0]);
        mapsFactory["addPoints"](clicks[1]);
        mapsFactory["addPoints"](clicks[2]);

        mapsFactory["addPoints"](clicks[0]);
        mapsFactory["checkIfPointClicked"](clicks[0]);

        mapsFactory["addPoints"](clicks[3]);

        expect(mapsFactory.getPoints()[2].getPosition()).toEqual(point3.getPosition());
        expect(mapsFactory.getSegments().length).toEqual(3);
    });

    it ("should be marked as invalid", () => {

        mapsFactory["addPoints"](clicks[0]);
        mapsFactory["addPoints"](clicks[1]);
        mapsFactory["addPoints"](clicks[2]);

        mapsFactory["addSegment"]();
        mapsFactory["checkIfPointClicked"](clicks[0]);

        expect(mapsFactory.trackValidity()).toBe(false);
    });

    it ("should be marked as outside of the grid", () => {
        const invalidPosition: Vector3 = new Vector3(GRID_SIZE, GRID_SIZE, 0);
        expect(mapsFactory["checkIfInsideGrid"](invalidPosition)).toBe(false);
    });

    it ("should be marked as inside of the grid", () => {
        const validPosition: Vector3 = new Vector3(GRID_SIZE / 2 - 10, GRID_SIZE / 2 - 10, 0);
        expect(mapsFactory["checkIfInsideGrid"](validPosition)).toBe(true);
    });
});
