import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-admin-config-component",
    templateUrl: "./admin-config.component.html",
    styleUrls: ["./admin-config.component.css"]
})
export class AdminConfigComponent implements OnInit {
    public changed: boolean;

    public constructor(private authentication: AuthenticationService, private route: ActivatedRoute) { }

    public ngOnInit(): void {
        this.changed = false;
    }

    public getRoute(): ActivatedRoute {
        return this.route;
    }

    public async changePassword(password: string, newPassword: string): Promise<boolean> {
        await this.authentication.changePassword(password, newPassword).then((res) => {
            this.changed = (res === "success");
        });

        return this.changed;
    }
}
