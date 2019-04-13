import { AuthenticationService } from "./authentication.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-authentication-component",
    templateUrl: "./authentication.component.html",
    styleUrls: ["./authentication.component.css"]
})
export class AuthenticationComponent implements OnInit {
    public passwordCorrect: boolean;

    public constructor(private authentication: AuthenticationService, private router: Router) { }

    public ngOnInit(): void {
        this.passwordCorrect = false;
    }

    public login(password: string): void {
        this.authentication.login(password)
            .then((res) => {
                this.passwordCorrect = true;
                this.router.navigateByUrl("/mapList");
            }).catch(this.handleError);
    }

    private async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }
 }
