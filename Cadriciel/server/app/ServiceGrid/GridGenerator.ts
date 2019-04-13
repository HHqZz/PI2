import {Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable } from "inversify";
import { Model } from "../../../common/communication/gridModel";
import { Grid } from "./Grid";
import { Answer } from "../../../common/communication/answer";

module ServiceGrid {

  @injectable()
  export class GridGenerator {

    public async getGrid(req: Request, res: Response, next: NextFunction): Promise<void> {
      const grid: Grid = new Grid;
      const model: Model = new Model();

      model.grid = grid.fillWithWords();

      grid.getAnswers().then((data: Answer[]) => {
        model.answers = data;
        res.send(JSON.stringify(model));
      }).catch((err: Error) => {
        console.error(err);
      });
    }
  }
}
export = ServiceGrid;
