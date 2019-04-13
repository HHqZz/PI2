import { Injectable } from "@angular/core";
import { ITrackSegment } from "./mapObjects/iTrackSegment";
import { TrackSegment } from "./mapObjects/trackSegment";
import { Vector3 } from "three";
import { MapService } from "./map.service";
import { Map } from "../../../../../common/communication/map";
import { SceneService } from "../render/scene.service";

@Injectable()
export class MapLoaderService {
    private segments: TrackSegment[];
    private loadedMap: Map;
    public mapToLoad: Map = new Map("");

    public constructor(private mapService: MapService, private sceneService: SceneService) {
        this.segments = [];
        this.loadedMap = new Map("", "");
        this.mapToLoad = new Map("");

    }
    public getMapLoaded(): Map {
        return this.loadedMap;
    }

    public setmapToLoadName(name: string): void {
        this.mapToLoad.name = name;
    }

    public async generateTrack(mapName: string ): Promise<void> {
        if (!this.segments.length) {
            await this.mapService.getMap(mapName)
                .then((response: Map) => {
                    this.loadedMap = response;
                    this.keepTrackSegment(this.loadedMap.segmentsArray);
                })
                .catch( this.handleError);

            this.drawTrack();
        }
    }

    private keepTrackSegment(segments: ITrackSegment[]): void {
        for (const segment of segments) {
            this.segments.push(this.createSegment(segment.start, segment.end));
            this.segments[this.segments.length - 1].isFirst = segment.isFirst;
        }
    }

    private drawTrack(): void {
        this.segments.forEach((segment) => {
            if (segment.isFirst) {
                segment.setAsFirst();
            }
            this.sceneService.saveSegment(segment);
            this.sceneService.add(segment.addJunction());
        });
    }

    private createSegment(start: Vector3, end: Vector3): TrackSegment {
        return new TrackSegment(start, end);
    }

    private async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }
}
