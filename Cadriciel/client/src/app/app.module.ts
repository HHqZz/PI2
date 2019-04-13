import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AdminModule } from "./admin/admin.module";

import { AppComponent } from "./app.component";
import { GameComponent } from "./car_race/game-component/game.component";
import { CrossWordComponent } from "./crossWord/crossword.component";
import { MenuComponent } from "./crossWord/menu/menu.component";
import { CarRaceComponent } from "./car_race/car_race.component";
import { HomeComponent } from "./home/home.component";
import { GridComponent } from "./crossWord/grid/grid.component";
import { EditorComponent } from "./car_race/editor/editor.component/editor.component";
import { MapListComponent } from "./car_race/map/map-list-component/map-list.component";
import { UserComponent } from "./car_race/map/user-component/user.component";

import { EditorRenderService } from "./car_race/editor/editorRender.service";
import { RenderService } from "./car_race/render/render.service";
import { SceneService } from "./car_race/render/scene.service";
import { EventHandlerService } from "./car_race/eventHandler-service/event-handler.service";
import { ControllerService } from "./car_race/eventHandler-service/controller.service";
import { CameraService } from "./car_race/camera-service/camera.service";
import { MapLoaderService } from "./car_race/map/mapLoader.service";
import { MapService } from "./car_race/map/map.service";
import { GridFactoryService } from "./crossWord/grid-factory.service";
import { SocketService} from "./crossWord/serviceMultiplayer/connectionService";
import { SoundService } from "./car_race/sound-service/sound.service";

import { CollisionHandlerService } from "./car_race/collisionHandler-service/collisionHandler.service";
import { MapInformationService } from "./car_race/map/mapInformation-service/map-information-service.service";
import { CarsService } from "./car_race/cars-service/cars.service";
import { HeadUpDisplayService } from "./car_race/raceUtils/headUpDisplay.service";
import { TimeHandlerService } from "./car_race/raceUtils/time-handler/timeHandler.service";
import { RaceManagerService } from "./car_race/raceUtils/raceManager.service";
import { SortArray } from "../app/car_race/map/user-component/user.component";
import { BestTimesManagerService } from "./car_race/raceUtils/bestTimesManager.service";

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        CrossWordComponent,
        MenuComponent,
        CarRaceComponent,
        HomeComponent,
        GridComponent,
        EditorComponent,
        MapListComponent,
        UserComponent,
        SortArray
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpModule,
        AppRoutingModule,
        AdminModule,
        FormsModule,
        ReactiveFormsModule,

    ],
    providers: [
        RenderService,
        SceneService,
        EventHandlerService,
        CameraService,
        EventHandlerService,
        ControllerService,
        MapService,
        GridFactoryService,
        EditorRenderService,
        MapLoaderService,
        MapService,
        SocketService,
        SoundService,
        CollisionHandlerService,
        MapInformationService,
        CarsService,
        HeadUpDisplayService,
        TimeHandlerService,
        RaceManagerService,
        BestTimesManagerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
