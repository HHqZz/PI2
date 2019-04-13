import { MapLoaderService } from "./mapLoader.service";
import { TestBed, inject } from "@angular/core/testing";
import { Vector3, Mesh, MeshBasicMaterial} from "three";
import { MockBackend } from "@angular/http/testing";
import { BaseRequestOptions, Http, HttpModule } from "@angular/http";
import { TrackSegment, TRACK_TEXTURE } from "./mapObjects/trackSegment";
import { MapService } from "./map.service";
import { SceneService } from "../render/scene.service";
import { TRACK_SEGMENT, GROUND } from "../../constants";

describe ("MapLoaderService", () => {
    let mapLoarder: MapLoaderService;

    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                MapService,
                SceneService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide : Http,
                    useFactory : (backEnd: MockBackend, options: BaseRequestOptions) => new Http(backEnd, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });
        done();
    });

    beforeEach(inject([ Http, MapService, SceneService ],
                      (http: Http, mapService: MapService, sceneService: SceneService) => {
        mapLoarder = new MapLoaderService(mapService, sceneService);
    }));

    it ("should be created", () => {
        expect(mapLoarder).toBeTruthy();
    });

    it ("should create a segment", () => {
        /*tslint:disable:no-magic-numbers*/
        const refSegment: TrackSegment = new TrackSegment(new Vector3(0, 0, 3), new Vector3(5, 0, 10));
        const newSegment: TrackSegment = mapLoarder["createSegment"](new Vector3(0, 0, 3), new Vector3(5, 0, 10));

        expect(newSegment.position).toEqual(refSegment.position);
    });

    it ("should draw track's segements", () => {
        const initNumberOfElement: number = mapLoarder["sceneService"].children.length;

        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(0, 0, 3), new Vector3(5, 0, 10)));
        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(5, 0, 10), new Vector3(7, 0, 15)));
        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(7, 0, 15), new Vector3(-4, 0, 8)));
        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(-4, 0, 8), new Vector3(0, 0, 3)));

        mapLoarder["drawTrack"]();
        const numberOfElement: number = mapLoarder["sceneService"].children.length;

        expect(numberOfElement).toBeGreaterThanOrEqual(initNumberOfElement + 4);
        expect(mapLoarder["sceneService"].children[initNumberOfElement].position).toEqual(mapLoarder["segments"][0].position);
        expect(mapLoarder["sceneService"].children[numberOfElement - 2].position).toEqual(mapLoarder["segments"][3].position);
    });

    it ("should draw track's segments' junction", () => {
        const initNumberOfElement: number = mapLoarder["sceneService"].children.length;

        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(0, 0, 3), new Vector3(5, 0, 10)));
        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(5, 0, 10), new Vector3(7, 0, 15)));
        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(7, 0, 15), new Vector3(-4, 0, 8)));
        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(-4, 0, 8), new Vector3(0, 0, 3)));

        mapLoarder["drawTrack"]();
        const numberOfElement: number = mapLoarder["sceneService"].children.length;
        const object: Mesh = mapLoarder["sceneService"].children[initNumberOfElement + 1] as Mesh;

        expect(numberOfElement).toBeGreaterThanOrEqual(initNumberOfElement + 4);
        expect(mapLoarder["sceneService"].children[initNumberOfElement + 3].position)
                                .toEqual(mapLoarder["segments"][1]["start"]);
        expect(object.geometry.type).toBe("CircleGeometry");
    });

    it ("should draw track", () => {

        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(0, 0, 3), new Vector3(5, 0, 10)));
        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(5, 0, 10), new Vector3(7, 0, 15)));
        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(7, 0, 15), new Vector3(-4, 0, 8)));
        mapLoarder["segments"].push(mapLoarder["createSegment"](new Vector3(-4, 0, 8), new Vector3(0, 0, 3)));

        mapLoarder["drawTrack"]();
        const numberOfElement: number = mapLoarder["sceneService"].children.length;
        const object: Mesh = mapLoarder["sceneService"].children[1] as Mesh;

        expect(numberOfElement).toEqual(8);
        expect(mapLoarder["sceneService"].children[2].position).toEqual(mapLoarder["segments"][1].position);
        expect(object.geometry.type).toBe("CircleGeometry");
    });

    it ("should load only one track", async () => {
        const initNumberOfElement: number = mapLoarder["sceneService"].children.length;

        await mapLoarder["generateTrack"]("track_Operational.json");
        await mapLoarder["generateTrack"]("track_Operational.json");
        await mapLoarder["generateTrack"]("track_Operational.json");

        expect(mapLoarder["sceneService"].children.length).toEqual(initNumberOfElement);
    });

    it ("should load the track", async () => {

        await mapLoarder["generateTrack"]("track_Test.json");

        expect(mapLoarder["loadedMap"].name).toEqual("TestMap");
        expect(mapLoarder["loadedMap"].description).toEqual("Testing map containing just name, description, type and a segment.");
        expect(mapLoarder["loadedMap"].type).toEqual("Easy Peasy");
        expect(mapLoarder["loadedMap"].segmentsArray).toEqual(mapLoarder["segments"]);
    });

    it ("should save track's segment", () => {

        const refArray: TrackSegment[] = [
            mapLoarder["createSegment"](new Vector3(0, 0, 3), new Vector3(5, 0, 10)),
            mapLoarder["createSegment"](new Vector3(5, 0, 10), new Vector3(7, 0, 15)),
            mapLoarder["createSegment"](new Vector3(7, 0, 15), new Vector3(-4, 0, 8)),
            mapLoarder["createSegment"](new Vector3(-4, 0, 8), new Vector3(0, 0, 3))
        ];

        mapLoarder["keepTrackSegment"](refArray);

        expect(mapLoarder["segments"].length).toEqual(refArray.length);
        expect(mapLoarder["segments"].values).toEqual(refArray.values);
    });

    it ("should have a specified texture for the out track area", async () => {
        await mapLoarder["generateTrack"]("track_Test.json");
        const outTrack: Mesh = mapLoarder["sceneService"].getObjectByName(GROUND) as Mesh;
        expect(outTrack).toBeDefined();
        if (outTrack !== undefined) {
            expect(outTrack.material).toBeFalsy(TRACK_TEXTURE);
            expect((outTrack.material as MeshBasicMaterial).name).toBe("GroundTexture");
        }
    });

    it ("should have a different texture between the out track and the track", async () => {
        await mapLoarder["generateTrack"]("track_Test.json");
        const outTrack: Mesh = mapLoarder["sceneService"].getObjectByName(GROUND) as Mesh;
        const track: Mesh = mapLoarder["sceneService"].getObjectByName(TRACK_SEGMENT) as Mesh;
        expect(outTrack).toBeDefined();
        expect(track).toBeDefined();
        if (outTrack !== undefined && track !== undefined) {
            expect(outTrack.material).toBeFalsy(track.material);
        }
    });
});
