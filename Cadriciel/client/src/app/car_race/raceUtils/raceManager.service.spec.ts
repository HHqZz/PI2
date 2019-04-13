import { RaceManagerService } from "./raceManager.service";
import { inject, TestBed } from "@angular/core/testing";
import { CarsService } from "../cars-service/cars.service";
import { HeadUpDisplayService } from "./headUpDisplay.service";
import { TimeHandlerService } from "./time-handler/timeHandler.service";
import { SoundService } from "../sound-service/sound.service";
import { CameraService } from "../camera-service/camera.service";
import { SceneService } from "../render/scene.service";

describe("RaceManagerService", () => {

    let raceManagerService: RaceManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ RaceManagerService, CarsService, HeadUpDisplayService,
                         TimeHandlerService, SoundService, SceneService, CameraService ]
        });
    });

    beforeEach(inject([ RaceManagerService, CarsService, HeadUpDisplayService, TimeHandlerService,
                        SoundService, SceneService, CameraService ],
                      async (carsService: CarsService, headUpDisplay: HeadUpDisplayService,
                             timeHandler: TimeHandlerService, soundService: SoundService, sceneService: SceneService) => {
        raceManagerService = new RaceManagerService(carsService, headUpDisplay, timeHandler, soundService, sceneService);
    }));

    it("should be created", inject([RaceManagerService, CarsService, HeadUpDisplayService,
                                    TimeHandlerService, SoundService, SceneService, CameraService ],
                                   (service: RaceManagerService) => {
        expect(service).toBeTruthy();
    }));

});
