import { Document } from "mongoose";
import { ITrackSegment } from "../../../client/src/app/car_race/map/mapObjects/iTrackSegment";
import { ITime } from "../../../common/communication/map";

export interface IMap {
    name?: string;
    type?: string;
    description?: string;
    numberOfTimesPlayed?: number;
    bestTimes?: ITime[];
    segmentsArray?: ITrackSegment[];
    preview?: string;
}

export interface IMapModel extends IMap, Document { }
