import { expect, assert } from "chai";
import { Map } from "../../../common/communication/map";
import { MapController } from "./mapController";

describe("MapController", () => {

    const mapController: MapController = new MapController;
    // tslint:disable-next-line:no-magic-numbers
    const map: Map = new Map("MTLCircuit", "MEDIUM", "Drive between all this beautiful and impressive buldings in Dowtown", 5 ,
                             [{rank: 1, time: "1m52s"}]);
    // tslint:disable-next-line:no-magic-numbers
    const map2: Map = new Map("TorontoCircuit", "HARD", "Drive this beautiful and impressive buldings in Dowtown", 2,
                              [{rank: 1, time: "1m52s"}]);

    it("Should insert data into the Database ", (done: MochaDone) => {

        mapController.insert(map).then((isInserted: boolean) => {
            expect(isInserted).to.be.equal(true);
        })
            .catch(mapController.handleError);
        done();
    });

    it("Should get all the maps in the Database ", (done: MochaDone) => {

        // tslint:disable-next-line:typedef
        mapController.getMaps().then((result) => {
            assert(result.length > 0);
        })
            .catch(mapController.handleError);
        done();
    });

    it("Should update data in the Database ", (done: MochaDone) => {

        mapController.update("MTLCircuit", map2)
            .then((isupdated: boolean) => {
                assert(isupdated);
            })
            .catch(mapController.handleError);
        done();
    });

    it("Should check if the first map exists in the Database ", (done: MochaDone) => {

        mapController.checkMapExist("TorontoCircuit")
            .then((exists: boolean) => {
                assert(exists);
            })
            .catch(mapController.handleError);
        done();
    });

    it("Should delete data in the Database ", (done: MochaDone) => {

        mapController.delete("TorontoCircuit")
            .then((isDeleted: boolean) => {
                assert(isDeleted);
            })
            .catch(mapController.handleError);
        done();
    });

    it("Should check if the second map exists in the Database ", (done: MochaDone) => {

        mapController.checkMapExist("SudburryCircuit")
            .then((exists: boolean) => {
                assert(!exists);
            })
            .catch(mapController.handleError);
        done();
    });

});
