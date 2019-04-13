import { Component, OnInit, Pipe , PipeTransform } from "@angular/core";
import { MapInformationService } from "../mapInformation-service/map-information-service.service";
import { ITime } from "../../../../../../common/communication/map";

@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {

    public constructor(private mapInfoService: MapInformationService) {

    }

    public ngOnInit(): void {
        this.mapInfoService.getMaps().catch(this.handleError);
    }

    public async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }
}

@Pipe ({ name: "sort"})
export class SortArray implements PipeTransform {
    public transform(array: ITime[]): ITime[] {
        return array.sort((time1: ITime , time2: ITime) => {
            if (time1.rank > time2.rank) {
                return 1 ;
            } else if (time1.rank < time2.rank) {
                return 0;
            }

            return 0;
        });
    }
}
