import { async, fakeAsync, tick, TestBed, inject } from "@angular/core/testing";
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";

import { Map } from "../../../../../common/communication/map";
import { MapService } from "./map.service";

describe("MapService", () => {
    let backend: MockBackend;
    let service: MapService;
    let connection: MockConnection;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                MapService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide : Http,
                    useFactory : (backEnd: MockBackend, options: BaseRequestOptions) => new Http(backEnd, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });
        backend = TestBed.get(MockBackend);
        service = TestBed.get(MapService);
    }));

    it("should be created", inject([MapService], (mapService: MapService) => {
        expect(mapService).toBeTruthy();
    }));

    it("get should return getted map", fakeAsync(() => {
        let response: Map;
        const result: Map = new Map("MTLCircuit", "Drive with the sensation of being in MTL");

        backend.connections.subscribe((c: MockConnection) => connection = c);
        service.getMap("MTLCircuit")
        .then((returnedMap: Map) => response = returnedMap)
        .catch((err: Error) => {
            console.error(err);
         });
        connection.mockRespond(new Response(new ResponseOptions(
            { body: JSON.stringify(result),
        })));
        tick();
        expect(response.name).toEqual("MTLCircuit");

    }));

    it("should save the specific map", fakeAsync(() => {
        const map: Map = new Map("name", "description" );
        let response: boolean;

        backend.connections.subscribe((c: MockConnection) => connection = c);
        service.insert(map)
        .then((isInserted: boolean) => response = isInserted)
        .catch((err: Error) => {
            console.error(err);
        });
        connection.mockRespond(new Response(new ResponseOptions(
            { body: JSON.stringify({ data: "success" }),
        })));
        tick();
        expect(response).toBe(true);
    }));

    it("Returns all the maps'name in the database", fakeAsync(() => {
        let mapsResult: Map[];

        backend.connections.subscribe((c: MockConnection) => connection = c);
        service.getAll()
        .then((maps: Map[]) => mapsResult = maps)
        .catch((err: Error) => {
            console.error(err);
        });
        connection.mockRespond(new Response(new ResponseOptions(
            { body: JSON.stringify(["MontrealCircuit", "TorontoCIrcuit"]),
        })));
        tick();
        expect(mapsResult.length).toBeGreaterThan(0);
    }));

    it("Not delete a map", fakeAsync(() => {
        const map: Map = new Map("name", "description" );
        let response: boolean;

        backend.connections.subscribe((c: MockConnection) => connection = c);
        service.insert(map)
        .then((isDeleted: boolean) => response = isDeleted)
        .catch((err: Error) => {
            console.error(err);
        });
        connection.mockRespond(new Response(new ResponseOptions(
            { body: JSON.stringify({ data: "errorConnection" }),
        })));
        tick();
        expect(response).toBe(true);

    }));
});
