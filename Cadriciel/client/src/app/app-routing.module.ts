import { NgModule } from "@angular/core";
import { RouterModule, Routes, Router } from "@angular/router";

import { CrossWordComponent } from "./crossWord/crossword.component";
import { HomeComponent } from "./home/home.component";
import { CarRaceComponent } from "./car_race/car_race.component";
import { AuthenticationComponent } from "./admin/authentication.component";
import { AdminConfigComponent } from "./admin/admin-config.component";
import { EditorComponent } from "./car_race/editor/editor.component/editor.component";
import { MenuComponent } from "./crossWord/menu/menu.component";
import { MapListComponent } from "./car_race/map/map-list-component/map-list.component";
import { UserComponent } from "./car_race/map/user-component/user.component";

const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "crossword", component: CrossWordComponent },
    { path: "crossword/menu", component: MenuComponent},
    { path: "car_race/race/:mapName", component: CarRaceComponent } ,
    { path: "car_race/user", component: UserComponent } ,
    { path: "admin", component: AuthenticationComponent },
    { path: "admin/config", component: AdminConfigComponent },
    { path: "mapList", component: MapListComponent },
    { path: "editor", component: EditorComponent },
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "**", redirectTo: "home" }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {

  // Error handler
    public constructor(private router: Router) {
        this.router.errorHandler = (error: {}) => {
            this.router.navigate(["404"]); // or redirect to default route
        };
    }
}
