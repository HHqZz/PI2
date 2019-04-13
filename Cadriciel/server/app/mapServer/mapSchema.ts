import * as mongoose from "mongoose";

export const mapSchema: mongoose.Schema = new mongoose.Schema({

    name: String,
    type: String,
    description: String,
    timesPlayed: {type: Number, default: 0},
    bestTimes: [],
    segmentsArray: [],
    preview: String
});

mapSchema.pre("save",  (next: mongoose.HookNextFunction) => {
    next();
});
