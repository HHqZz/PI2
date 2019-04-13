import { TestBed, inject } from "@angular/core/testing";

import { CameraService } from "./camera.service";
import { CameraUpperView } from "./CameraUpperView";
import { Camera3rdPerson } from "./Camera3rdPerson";

describe("CameraService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CameraService]
    });
  });

  it("should be created", inject([CameraService], (service: CameraService) => {
    expect(service).toBeTruthy();
  }));

  it("should Create a 3rdCamera type for the Camera Service", inject([CameraService], (service: CameraService) => {
    const container: HTMLDivElement = document.createElement("div");
    service.initialize(container);
    expect((service.getCamera() instanceof Camera3rdPerson)).toBeTruthy();
  }));

  it("should change the camera type for the Camera Service", inject([CameraService], (service: CameraService) => {
    const container: HTMLDivElement = document.createElement("div");
    service.initialize(container);
    service.toggleCamera();
    expect((service.getCamera() instanceof CameraUpperView)).toBeTruthy();
  }));

  it("should zoom in the Camera Service", inject([CameraService], (service: CameraService) => {
    const container: HTMLDivElement = document.createElement("div");
    service.initialize(container);
    const initialZoomLevel: number = service.zoomLevel;
    service.ZoomIn();
    expect(service.zoomLevel).toBeGreaterThan(initialZoomLevel);
  }));

  it("should zoom Out the Camera Service", inject([CameraService], (service: CameraService) => {
    const container: HTMLDivElement = document.createElement("div");
    service.initialize(container);
    const initialZoomLevel: number = service.zoomLevel;
    service.ZoomOut();
    expect(service.zoomLevel).toBeLessThan(initialZoomLevel);
  }));

});
