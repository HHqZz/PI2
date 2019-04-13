import { async, fakeAsync, tick, TestBed } from "@angular/core/testing";
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";

import { AuthenticationService} from "./authentication.service";
import { HttpErrorResponse } from "@angular/common/http";

describe("AuthenticationService", () => {
    let backend: MockBackend;
    let service: AuthenticationService;
    let connection: MockConnection;
    const password: string = "truePassword";
    const wrongPassword: string = "wrongPassword";

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                AuthenticationService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide : Http,
                    useFactory : (backEnd: MockBackend, options: BaseRequestOptions) => new Http(backEnd, options),
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });

        backend = TestBed.get(MockBackend);
        service = TestBed.get(AuthenticationService);
    }));

    it("login() should query current service url", () => {
       service.login(password)
       .catch((err: Error) => { console.error(err); });
       backend.connections.subscribe((aConnection: MockConnection) => {
            expect(aConnection).toBeDefined("no http service connection at all?");
            expect(aConnection.request.url).toMatch(/api\/login$/, "url invalid");
        });
    });

    it("should login succesfully", () => {
        service.loginSucced()
        .catch((err: HttpErrorResponse) => {
             console.error(err);
         });
        backend.connections.subscribe((aConnection: MockConnection) => {
            expect(aConnection).toBeTruthy();
         });
     });

    it("login() should return Login succeded", fakeAsync(() => {
        let result: String ;

        backend.connections.subscribe((c: MockConnection) => connection = c);
        service.login(password)
        .then((forAuthentication: String) => result = forAuthentication)
        .catch((err: Error) => {
            console.error(err);
        });
        connection.mockRespond(new Response(new ResponseOptions(
            {body: JSON.stringify({ data: "Login succeded"}),
        })));
        tick();
        expect(result).toBe("Login succeded");
    }));

    it("login() should return invalid", fakeAsync(() => {
        let result: String;

        backend.connections.subscribe((c: MockConnection) => connection = c);
        service.login(wrongPassword)
        .then((forAuthentication: String) => result = forAuthentication)
        .catch((err: Error) => {
            console.error(err);
        });
        connection.mockRespond(new Response(new ResponseOptions(
            { body: JSON.stringify({ data: "Login failed" }),
        })));
        tick();
        expect(result).toBe("Login failed");
    }));

    it("changePassword() should query current service url", () => {
        service.changePassword(password, "newPassword")
        .catch((err: Error) => {
            console.error(err);
        });
        backend.connections.subscribe((aConnection: MockConnection) => {
            expect(aConnection).toBeDefined("no http service connection at all?");
            expect(aConnection.request.url).toMatch(/api\/changepassword$/, "url invalid");
        });
    });

    it("changePassword() should return success", fakeAsync(() => {
        let result: String;

        backend.connections.subscribe((c: MockConnection) => connection = c);
        service.changePassword(password, "newPassWord")
        .then((changedWord: String) => result = changedWord)
        .catch((err: HttpErrorResponse) => {
            console.error(err);
        });
        connection.mockRespond(new Response(new ResponseOptions(
            { body: JSON.stringify({ data: "success" }),
        })));
        tick();
        expect(result).toBe("success");
    }));

    it("changePassword() should return password incorrect", fakeAsync(() => {
        let result: String;
        backend.connections.subscribe((c: MockConnection) => connection = c);
        service.changePassword(wrongPassword, "newPassWord")
        .then((changedWord: String) => result = changedWord)
        .catch((err: HttpErrorResponse) => {
            console.error(err);
        });
        connection.mockRespond(new Response(new ResponseOptions(
            { body: JSON.stringify({ data: "Password incorrect" }),
        })));
        tick();
        expect(result).toBe("Password incorrect");
    }));
});
