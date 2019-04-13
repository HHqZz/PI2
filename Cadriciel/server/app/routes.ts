import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { GridGenerator } from "./ServiceGrid/GridGenerator";

// import * as http from "http";

// const io = require("socket.io")(http);
// const port = process.env.PORT ||  8000;

@injectable()
export class Routes {

    public constructor(@inject(Types.GridGenerator) private gridGenerator: GridGenerator) {}

    public  get routes(): Router {
        const router: Router = Router();

        router.get("/GridGenerator/:level",
                   async (req: Request, res: Response, next: NextFunction) => this.gridGenerator.getGrid(req, res, next));

        return router;
    }
}
