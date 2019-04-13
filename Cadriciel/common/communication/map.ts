import { IMap, IMapModel } from "../../server/app/mapServer/interfaces";
import { ITrackSegment } from "../../client/src/app/car_race/map/mapObjects/iTrackSegment";
export class PisteModel {
    public userModel: IMapModel;

    constructor(userModel: IMapModel) {
        this.userModel = userModel;
    }
}

export class Map implements IMap {

    constructor(public name: string,
                public type?: string,
                public description?: string,
                public timesPlayed?: number,
                public bestTimes?: ITime[],
                public segmentsArray?: ITrackSegment[],
                public preview?: string,
               ) {
    }
}

export interface ITime {
    name?: string,
    rank?: number;
    time?: string;
}

