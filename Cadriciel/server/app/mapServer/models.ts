import { IMap, IMapModel } from "./interfaces";
import { ITime } from "../../../common/communication/map";

export class MapModel {
    public userModele: IMap;

    constructor(userModele: IMapModel) {
        this.userModele = userModele;
    }
}

export class Piste implements IMap {

    constructor(public name: string, public type: string, public description: string,
                public timesPlayes?: string, public bestTimes?: ITime[]) {
    }
}
