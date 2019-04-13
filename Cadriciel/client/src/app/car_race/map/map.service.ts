import { Map, ITime } from "../../../../../common/communication/map";
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

const URL: string = "http://localhost:3000";
const PATH: string = "map";
const ALLPATHS: string = "maps";
const UPDATE: string = "update";

const LOCAL_URL: string = "http://localhost:4200/assets/maps/MockMaps/";

@Injectable()
export class MapService {
    public constructor(private http: Http) { }

    public async getMap(mapName: string): Promise<Map> {
        return this.http.get(`${URL}/${PATH}/${mapName}`)
            .toPromise()
            .then((response) => {
                return response.json() as Map;
            }).catch(this.handleError);
    }

    public async getMockMap(mapName: string): Promise<Map> {
        return this.http.get(LOCAL_URL.concat(mapName))
            .toPromise()
            .then((response) => {
                return response.json() as Map;
            })
            .catch(this.handleError);
    }

    public async insert(map: Map): Promise<boolean> {
        return this.http
            .post(`${URL}/${PATH}`, map)
            .toPromise()
            .then((response) => {
                return (response.json()) ? true : false;
            })
            .catch(this.handleError);
    }

    public async sendBestTimes(name: string, bestTimes: ITime[]): Promise<boolean> {
        return this.http
        .post(`${URL}/${ALLPATHS}/` + "times" , { name: name, bestTimes: bestTimes })
        .toPromise()
        .then( (response) => {
            return (response.json()) ? true : false;
        }).catch(this.handleError);
    }

    public async update(oldMapName: string, newMap: Map): Promise<boolean> {
        return this.http
        .post(`${URL}/${ALLPATHS}/${UPDATE}` , { oldMapName: oldMapName, newMap: newMap })
            .toPromise()
            .then((response) => {
                if (response.json()) {
                    return true;
                }

                return false;
            });
    }

    public async getAll(): Promise<Map[]> {
        return this.http.get(`${URL}/${ALLPATHS}`)
            .toPromise()
            .then((response) => {
                return response.json();
            })
            .catch(this.handleError);
    }

    public async deleteMap(map: Map): Promise<boolean> {
        return this.http
            .delete(`${URL}/${PATH}/${map.name}`)
            .toPromise().then((response) => {
                return (response.json()) ? true : false;
            }).catch(this.handleError);
    }

    public updatePlayedTime(oldMapName: string, newMap: Map): void {
        this.update(oldMapName, new Map(newMap.name, newMap.type, newMap.description, (newMap.timesPlayed + 1),
                                        newMap.bestTimes, newMap.segmentsArray, newMap.preview)).catch(this.handleError);
    }

    private async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }
}
