import { Vector3 } from "three";

export interface ITrackSegment {
    start?: Vector3;
    end?: Vector3;
    isFirst?: boolean;
}
