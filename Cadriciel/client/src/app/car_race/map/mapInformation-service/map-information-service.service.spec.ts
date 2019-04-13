import { TestBed, inject } from "@angular/core/testing";

import { MapInformationService } from "./map-information-service.service";
import { MapService } from "../map.service";
import { HttpModule } from "@angular/http";
import { MapLoaderService } from "../mapLoader.service";
import { RenderService } from "../../render/render.service";
import { CameraService } from "../../camera-service/camera.service";
import { SoundService } from "../../sound-service/sound.service";
import { CollisionHandlerService } from "../../collisionHandler-service/collisionHandler.service";
import { CarsService } from "../../cars-service/cars.service";
import { RaceManagerService } from "../../raceUtils/raceManager.service";
import { HeadUpDisplayService } from "../../raceUtils/headUpDisplay.service";
import { TimeHandlerService } from "../../raceUtils/time-handler/timeHandler.service";
import { SceneService } from "../../render/scene.service";

describe("MapInformationServiceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapInformationService, MapService,
                  MapLoaderService, RenderService,
                  CameraService, SoundService, SceneService,
                  CollisionHandlerService, CarsService,
                  RaceManagerService, HeadUpDisplayService, TimeHandlerService, SceneService  ],
      imports: [HttpModule]
    });
  });

  it("should be created", inject([MapInformationService], (service: MapInformationService) => {
    expect(service).toBeTruthy();
  }));
});
