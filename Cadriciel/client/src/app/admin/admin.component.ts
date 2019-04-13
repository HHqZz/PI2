import { AuthenticationService } from "./authentication.service";
import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-admin-component",
    templateUrl: "./admin.component.html",
})
export class AdminComponent implements OnInit {
    @Input()
    public correct: boolean;
    public selectedTab: string = "config";

    public constructor(private authentication: AuthenticationService) { }

    public ngOnInit(): void {
        this.correct = false;
    }

    public async login(password: string): Promise<boolean> {
        await this.authentication.login(password).then((res) => {
            this.correct = (res === "Login Succeded");
        });

        return  this.correct;
    }
}
