import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";
import { HttpErrorResponse } from "@angular/common/http/src/response";

@Injectable()
export class AuthenticationService {
    public constructor(public http: Http) { }

    private headers: Headers = new Headers({"Content-type": "application/json"});
    public url: string = "http://localhost:3000/api";

    private correctStatus(status: number): boolean {
        const inferiorRangeStatus: number = 200;
        const superiorRangeStatus: number = 400;

        return status >= inferiorRangeStatus && status < superiorRangeStatus;
    }

    public async login(password: string): Promise<string> {
        const url: string = this.url +  "/login" ;

        return this.http.post(url, JSON.stringify({"password": password}), {headers: this.headers})
                         .toPromise()
                         .then((response) => response.json().data)
                         .catch((reason: HttpErrorResponse) => this.correctStatus(reason.status));

    }

    public async loginSucced(): Promise<boolean> {

        return this.http.get(this.url, {headers: this.headers})
                         .toPromise()
                         .then((response) => response.ok)
                         .catch((reason: HttpErrorResponse) => this.correctStatus(reason.status));
    }

    public async changePassword(password: string, newPassword: string): Promise<string> {
        const passwords: {} = {"password": password, "newPassword": newPassword};
        const url: string = this.url + "/changepassword";

        return this.http.post(url, JSON.stringify(passwords), {headers: this.headers})
                         .toPromise()
                         .then((response) => response.json().data)
                         .catch((reason: HttpErrorResponse) => this.correctStatus(reason.status));

    }
}
