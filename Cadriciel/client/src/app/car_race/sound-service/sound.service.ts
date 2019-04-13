import { Injectable } from "@angular/core";
import { AudioListener, Audio, AudioLoader, AudioBuffer } from "three";
import { CameraService } from "../camera-service/camera.service";
import { SoundCondition } from "./soundConditionInterface";
import { DEFAULT_DRIVE_RATIO, DEFAULT_MAX_RPM, DEFAULT_MINIMUM_RPM } from "../car/engine";

const HIT_VOLUME: number = 10;
let RACE_START_PLAYED: boolean = false;
const SOUND_PATH: string = "../../../assets/sounds/";

export enum SoundType { ENGINE = "engineSound.ogg", RACE_START = "raceCountDown.ogg",
                        CARS_COLLISION = "carsCollision.ogg", INVISIBLE_WALLS = "invisibleWalls.ogg" }

const engineCondition: SoundCondition = {soundPath : SOUND_PATH + SoundType.ENGINE, loop : true };
const startRaceCondition: SoundCondition = {soundPath : SOUND_PATH + SoundType.RACE_START, loop : false };
const carsCollisionCondition: SoundCondition = {soundPath : SOUND_PATH + SoundType.CARS_COLLISION, loop : false };
const invisibleWallsCondition: SoundCondition = {soundPath : SOUND_PATH + SoundType.INVISIBLE_WALLS, loop : false };

@Injectable()
export class SoundService {
    private engineAudio: Audio;
    private startRaceAudio: Audio;
    private carsCollision: Audio;
    private invisibleWalls: Audio;
    private audioLoader: AudioLoader;

    public constructor(private cameraService: CameraService) {
        this.engineAudio = new Audio(new AudioListener());
        this.startRaceAudio = new Audio(new AudioListener());
        this.carsCollision = new Audio(new AudioListener());
        this.invisibleWalls = new Audio(new AudioListener());
        this.audioLoader = new AudioLoader();
    }

    public playSound(type: string): void {

        const listener: AudioListener = new AudioListener();
        this.cameraService.getCamera().add( listener );

        switch (type) {
            case SoundType.RACE_START:
                this.loadAudio(startRaceCondition, this.startRaceAudio = new Audio( listener ));
                break;

            case SoundType.ENGINE:
                this.loadAudio(engineCondition, this.engineAudio = new Audio( listener ));
                break;

            case SoundType.CARS_COLLISION:
                if (RACE_START_PLAYED) {
                    this.loadAudio(carsCollisionCondition, this.carsCollision = new Audio( listener ));
                }
                break;

            case SoundType.INVISIBLE_WALLS:
                if (RACE_START_PLAYED) {
                    this.loadAudio(invisibleWallsCondition, this.invisibleWalls = new Audio( listener ));
                    this.invisibleWalls.setVolume(HIT_VOLUME);
                }
                break;

            default:
                break;
        }
    }

    private loadAudio(condition: SoundCondition, addedAudio: Audio): void {
        this.audioLoader = new AudioLoader();
        this.audioLoader.load(condition.soundPath,
                              (buffer: AudioBuffer) => {
                                addedAudio.setBuffer(buffer);
                                addedAudio.setLoop(condition.loop);
                                if (addedAudio === this.startRaceAudio ) {
                                    this.startRaceAudio.play();
                                    RACE_START_PLAYED = this.startRaceAudio.isPlaying;
                                } else {
                                    addedAudio.play();
                                }
                            },
                              () => { },
                              (error: string) => console.error(error));
    }

    public changeFrequency(rpm: number): void {
        this.engineAudio.setPlaybackRate((DEFAULT_DRIVE_RATIO / DEFAULT_MAX_RPM) * (rpm - DEFAULT_MINIMUM_RPM) + 1);
    }

    public changeVolume(volume: number): void {
        this.engineAudio.setVolume(volume);
    }
}
