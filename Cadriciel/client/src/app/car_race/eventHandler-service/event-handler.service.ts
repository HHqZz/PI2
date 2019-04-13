import { Injectable } from "@angular/core";
import * as Constants from "../../constants";

export enum Command {
  NONE,
  MOVE_FORWARD,
  ROTATE_LEFT,
  ROTATE_RIGHT,
  BRAKE,
  SWITCH_CAMERA,
  RELEASE_STEERING,
  RELEASE_BRAKE,
  RELEASE_ACCELERATOR,
  NIGHT_DAY_MODE,
  ZOOM_IN,
  ZOOM_OUT
}

@Injectable()
export class EventHandlerService {

  public constructor() {
  }

  public startMoveEvent (event: KeyboardEvent): Command {
    switch (event.code) {
      case Constants.ACCELERATE_CODE:
          return Command.MOVE_FORWARD;
     case Constants.LEFT_CODE:
          return Command.ROTATE_LEFT;
      case Constants.RIGHT_CODE:
          return Command.ROTATE_RIGHT;
      case Constants.BRAKE_CODE:
          return Command.BRAKE;
      case Constants.SWITCH_CAMERA_CODE:
          return Command.SWITCH_CAMERA;
      case Constants.NIGHT_DAY_MODE_CODE:
          return Command.NIGHT_DAY_MODE;
      case Constants.ZOOM_IN_CODE:
          return Command.ZOOM_IN;
      case Constants.ZOOM_OUT_CODE:
          return Command.ZOOM_OUT;
      default:
          return Command.NONE;
    }
  }

  public stopMoveEvent (event: KeyboardEvent): Command {
    switch (event.code) {
      case Constants.ACCELERATE_CODE:
          return Command.RELEASE_ACCELERATOR;
      case Constants.RIGHT_CODE:
        return Command.RELEASE_STEERING;
      case Constants.LEFT_CODE:
        return Command.RELEASE_STEERING;
      case Constants.BRAKE_CODE:
        return Command.RELEASE_BRAKE;
      default:
        return Command.NONE;
    }
  }
}
