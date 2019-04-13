import { Injectable } from "@angular/core";
import { EventHandlerService, Command } from "../eventHandler-service/event-handler.service";
import { RenderService } from "../render/render.service";
import { CameraService } from "../camera-service/camera.service";
import { RaceManagerService } from "../raceUtils/raceManager.service";

@Injectable()
export class ControllerService {
    private eventHandler: EventHandlerService;

    public constructor (private cameraService: CameraService, private raceManager: RaceManagerService) {
        this.eventHandler = new EventHandlerService;
    }

    public startMoveHandler(event: KeyboardEvent, rended: RenderService): void {
        if (this.raceManager.raceInProgress) {
            switch (this.eventHandler.startMoveEvent(event)) {
                case Command.MOVE_FORWARD:
                    rended.car.isAcceleratorPressed = true;
                    break;
                case Command.ROTATE_LEFT:
                    rended.car.steerLeft();
                    break;
                case Command.ROTATE_RIGHT:
                    rended.car.steerRight();
                    break;
                case Command.BRAKE:
                    rended.car.brake();
                    break;
                case Command.SWITCH_CAMERA:
                    this.cameraService.toggleCamera();
                    break;
                case Command.NIGHT_DAY_MODE:
                    rended.nightDayMode();
                    break;
                case Command.ZOOM_IN:
                    this.cameraService.ZoomIn();
                    break;
                case Command.ZOOM_OUT:
                    this.cameraService.ZoomOut();
                    break;
                default: break;
            }
        }
    }

    public stopMoveHandler(event: KeyboardEvent, rended: RenderService): void {
        switch (this.eventHandler.stopMoveEvent(event)) {
            case Command.RELEASE_ACCELERATOR:
                rended.car.isAcceleratorPressed = false;
                break;
            case Command.RELEASE_STEERING:
                rended.car.releaseSteering();
                break;
            case Command.RELEASE_BRAKE:
                rended.car.releaseBrakes();
                break;
            default:
                break;
        }
    }
}
