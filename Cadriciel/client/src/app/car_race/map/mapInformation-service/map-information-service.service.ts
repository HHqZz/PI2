import { Injectable } from "@angular/core";
import { MapLoaderService } from "../mapLoader.service";
import { MapService } from ".././map.service";
import { Map } from "../../../../../../common/communication/map";

@Injectable()
export class MapInformationService {

    public levels: string[] = ["EASY", "MEDIUM", "HARD"];

    public maps: Map[];

    public choosedMap: Map;
    public nameChanged: boolean;
    public informationsChanged: boolean;

    public constructor(private mapService: MapService, private mapLoader: MapLoaderService) {
        this.nameChanged = false;
        this.informationsChanged = false;
    }

    public onSelect(map: Map): void {
        this.choosedMap = map;
        this.mapLoader.setmapToLoadName(this.choosedMap.name);
    }

    public async getMaps(): Promise<void> {

        return this.mapService.getAll().then((data: Map[]) => {
            this.maps = data;
        });

    }

    public onNameChange(): void {
        this.nameChanged = true;
    }

    public onInformationChange(): void {
        this.informationsChanged = true;
    }

    public async getMap(mapName: string): Promise<Map> {
        return this.mapService.getMap(mapName).then((data: Map) => {

            return data;
        });
    }

    public deleteMap(choosedMap: Map): void {
        const oldMap: Map = new Map(choosedMap.name, choosedMap.type, choosedMap.description);
        this.mapService.deleteMap(oldMap).catch(this.handleError);
        this.maps.splice(this.maps.indexOf(choosedMap), 1);
        this.choosedMap = null;
    }

    public async loadMap(name: string): Promise<void> {
        await this.mapLoader.generateTrack(name);
    }

    public initSave(mapName: string, selectedMap: Map): void {
        const mapToSave: Map = new Map(mapName, selectedMap.type, selectedMap.description,
                                       selectedMap.timesPlayed, selectedMap.bestTimes, selectedMap.segmentsArray);

        if (this.nameChanged) {
            this.mapService.insert(mapToSave).catch(this.handleError);
            this.maps.push(mapToSave);
        } else if (this.informationsChanged) {
            this.mapService.update(mapName, mapToSave).catch(this.handleError);
            this.maps[this.maps.indexOf(this.choosedMap)] = mapToSave;
        }

    }

    public async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }

}
