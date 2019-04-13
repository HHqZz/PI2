import { TrackSegment } from "./mapObjects/trackSegment";

export class Map {
   public segmentsArray: TrackSegment[];
   public preview: {};
   public type: string;
   public bestTimes: {};
   public numberOfTimesPlayed: {};

   public constructor (public name: string, public description: string) {
       this.name = name;
       this.description = description;
       this.segmentsArray = this.segmentsArray;
       this.type = this.type;
   }
}
