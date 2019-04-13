import { expect } from "chai";
import { Database } from "./database";
import { IMapModel } from "./interfaces";
import { Map } from "../../../common/communication/map";
import { mapSchema } from "./mapSchema";

describe("DataBase", () => {

    const collection: string = "Maps";
    const database: Database<Map, IMapModel> = new Database<Map, IMapModel>(collection, mapSchema);

    it("Should connect to the Database ", (done: MochaDone) => {
        database.connect().then((result: boolean) => {
            expect(result).to.be.equal(true);
            database.close();
        })
            .catch(database.handleError);
        done();
    });

});
