import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import {AuthenticationComponent} from "./authentication.component";
import {AdminConfigComponent} from "./admin-config.component";
import {AdminComponent} from "./admin.component";

import {AuthenticationService} from "./authentication.service";
import {AppRoutingModule} from "../app-routing.module";

@NgModule({
    declarations: [
        AuthenticationComponent,
        AdminComponent,
        AdminConfigComponent,

    ],
    imports: [
        FormsModule,
        CommonModule,
        AppRoutingModule,
        HttpClientModule,

    ],
    exports: [
        AdminComponent
    ],
    providers: [
        AuthenticationService
    ],
})
export class AdminModule { }
