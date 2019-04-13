import { SoundService, SoundType } from "./sound.service";
import { TestBed, inject } from "@angular/core/testing";
import { CameraService } from "../camera-service/camera.service";

describe("SoundService", () => {

    const container: HTMLDivElement = document.createElement("div");
    document.body.appendChild(container);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
            SoundService, CameraService
        ]
        });
    });

    beforeEach(inject([SoundService, CameraService], (soundService: SoundService, cameraService: CameraService) => {
    }));

    it("should be created", inject([SoundService, CameraService], (soundService: SoundService, cameraService: CameraService) => {
        const service: SoundService = new SoundService(cameraService);
        expect(service).toBeTruthy();
    }));

    it("should change the frequency of the sound", inject([SoundService, CameraService],
                                                          (soundService: SoundService, cameraService: CameraService) => {

        const service: SoundService = new SoundService(cameraService);
        cameraService.initialize(container);
        service.playSound(SoundType.ENGINE);

        expect(service["engineAudio"].getPlaybackRate()).toBe(1);

        // tslint:disable-next-line:no-magic-numbers
        service.changeFrequency(1000);
        service.changeVolume(0);

        expect(service["engineAudio"].getPlaybackRate()).toBeGreaterThan(1);
    }));

});
