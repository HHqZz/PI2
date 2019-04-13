import { Component, OnInit } from "@angular/core";
import { RenderService } from "../../render/render.service";
import { MapInformationService } from "../mapInformation-service/map-information-service.service";

@Component({
    selector: "app-map-list-component",
    templateUrl: "./map-list.component.html",
    styleUrls: ["./map-list.component.css"],
    providers: [RenderService, MapInformationService]
})

export class MapListComponent implements OnInit {
    public constructor(private mapInfoService: MapInformationService) {

    }

    public ngOnInit(): void {
        this.mapInfoService.getMaps().catch(this.handleError);
    }

    public async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }
}
