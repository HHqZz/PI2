import * as express from "express";
import { MapController } from "../mapServer/mapController";
import {  Document } from "mongoose";

module Route {

    export class MapControllers {
        public async insert(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const mapController: MapController = new MapController();
            await mapController.insert(req.body);
        }

        public async getMaps(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const mapController: MapController = new MapController();
            const maps: Array<Document> = await mapController.getMaps();
            res.send(maps);
        }

        public async getMapByName(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const mapController: MapController = new MapController();
            const name: string = req.params.name;
            res.send(JSON.stringify(await mapController.getMapByName(name)));
        }

        public async checkMapExist(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const mapController: MapController = new MapController();
            const name: string = req.params.name;
            const mapName: boolean = await mapController.checkMapExist(name);
            res.send(mapName);
        }

        public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const mapController: MapController = new MapController();
            res.send(await mapController.update(req.body.oldMapName, req.body.newMap));
        }

        public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const mapController: MapController = new MapController();
            const name: string = req.params.name;
            await mapController.delete(name);
        }

        public async sendBestTimes(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            const mapController: MapController = new MapController();
            await mapController.sendBestTimes(req.body.name, req.body.bestTimes);
        }

    }

}
export = Route;
