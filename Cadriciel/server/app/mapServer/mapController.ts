import { Database } from "./database";
import { Document } from "mongoose";
import { IMapModel } from "./interfaces";
import { Map, ITime } from "../../../common/communication/map";
import { mapSchema } from "./mapSchema";

export class MapController {

    public async insert(map: Map): Promise<boolean> {
        const database: Database<Map, IMapModel> = new Database<Map, IMapModel>("Maps", mapSchema);
        await database.connect();
        await database.insert(map).catch(this.handleError);
        database.close();

        return true;
    }

    public async getMaps(): Promise<Array<Document>> {

        const database: Database<Map, IMapModel> = new Database<Map, IMapModel>("Maps", mapSchema);
        await database.connect();

        return database.find().then((data: Array<Document>) => {
            database.close();

            return data;
        }).catch(this.handleError);
    }

    public async getMapByName(name: string): Promise<Map> {

        const database: Database<Map, IMapModel> = new Database<Map, IMapModel>("Maps", mapSchema);
        await database.connect();

        return database.getFindOne({ name }).then((data: Document) => {
            database.close();

            return data.toJSON();
        }).catch((this.handleError));
    }

    public async checkMapExist(name: string): Promise<boolean> {
        const database: Database<Map, IMapModel> = new Database<Map, IMapModel>("Maps", mapSchema);
        await database.connect();

        return database.findOne({ name: name }).then((isFounded: boolean) => {
            database.close();

            return isFounded;
        }).catch( this.handleError);

    }

    public async update(name: string, map: Map): Promise<boolean> {

        const database: Database<Map, IMapModel> = new Database<Map, IMapModel>("Maps", mapSchema);
        const oldInformation: Map = { name: name };
        const newInformation: Map = map;
        await database.connect();

        return database.update(oldInformation, newInformation).then((result: boolean) => {
            database.close();

            return result;
        })
            .catch(this.handleError);

    }

    public async delete(name: string): Promise<boolean> {

        const database: Database<Map, IMapModel> = new Database<Map, IMapModel>("Maps", mapSchema);
        await database.connect();

        return database.delete({ name: name }).then(() => {
            database.close();

            return true;
        }).catch(this.handleError);

    }

    public async sendBestTimes(name: string, bestTimes: ITime[]): Promise<boolean> {
        const map: Map = ( await this.getMapByName(name));
        map.bestTimes = bestTimes;

        return this.update(map.name, map).catch(this.handleError);
    }

    public async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }
}
