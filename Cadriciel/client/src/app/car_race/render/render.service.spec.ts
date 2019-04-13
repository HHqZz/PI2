import { TestBed, inject } from "@angular/core/testing";

import { RenderService } from "./render.service";
import { CameraService } from "../camera-service/camera.service";
import { SoundService } from "../sound-service/sound.service";
import { CollisionHandlerService } from "../collisionHandler-service/collisionHandler.service";
import { CarsService } from "../cars-service/cars.service";
import { RaceManagerService } from "../raceUtils/raceManager.service";
import { HeadUpDisplayService } from "../raceUtils/headUpDisplay.service";
import { TimeHandlerService } from "../raceUtils/time-handler/timeHandler.service";
import { SceneService } from "./scene.service";

const AMBIENT_LIGHT_DAY_OPACITY: number = 0.75;
const AMBIENT_LIGHT_NIGHT_OPACITY: number = 0.4;

const container: HTMLDivElement = document.createElement("div");
document.body.appendChild(container);

describe("RenderService", () => {
    let render: RenderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ RenderService, CameraService, CollisionHandlerService,
                         CarsService, RaceManagerService, SceneService, HeadUpDisplayService,
                         TimeHandlerService, SoundService ]
        });
    });

    beforeEach(inject([RenderService, CameraService, CollisionHandlerService,
                       CarsService, RaceManagerService, SceneService, HeadUpDisplayService, TimeHandlerService, SoundService],
                      (service: RenderService, cameraService: CameraService,
                       collisionService: CollisionHandlerService, carsService: CarsService,
                       raceManagerService: RaceManagerService, sceneService: SceneService) => {
        render = new RenderService(cameraService, collisionService, carsService, raceManagerService, sceneService);
    }));

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));

    it("should switch to night mode", async (done: () => void) => {
        await render.initialize(container);
        done();
        render.nightDayMode();

        expect(render["sceneService"].skybox.lighting["intensity"] ).toEqual(AMBIENT_LIGHT_NIGHT_OPACITY);
        done();
    });

    it("should switch to day mode", async (done: () => void) => {
        await render.initialize(container);
        done();
        render.nightDayMode();
        render.nightDayMode();

        expect(render["sceneService"].skybox.lighting["intensity"] ).toEqual(AMBIENT_LIGHT_DAY_OPACITY);
        done();
    });
    document.body.removeChild(container);
});
