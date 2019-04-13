import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer } from "three";
import { Car } from "../car/car";
import { CameraService } from "../camera-service/camera.service";
import { CollisionHandlerService } from "../collisionHandler-service/collisionHandler.service";
import { CarsService } from "../cars-service/cars.service";
import { RaceManagerService } from "../raceUtils/raceManager.service";
import { SceneService } from "./scene.service";
import { Ai } from "./../virtualPlayers/ai";

@Injectable()
export class RenderService {
    private container: HTMLDivElement;
    private renderer: WebGLRenderer;
    private stats: Stats;
    private lastDate: number;
    private ai: Ai;

    public constructor(
        private cameraService: CameraService,
        private collisionService: CollisionHandlerService,
        private carsService: CarsService,
        private raceManager: RaceManagerService,
        private sceneService: SceneService) { }

    public get car(): Car {
        return this.carsService.mainCar;
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        await this.createScene();
    }

    private async createScene(): Promise<void> {
        await this.carsService.initialize();
        this.sceneService.initialize();
        this.cameraService.initialize(this.container);
        this.cameraService.initializeCameras(this.car);

        this.carsService.cars.forEach((car) => {
            this.sceneService.add(car);
        });
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        if (this.raceManager.raceInProgress) { this.carsService.cars.forEach((car) => car.update(timeSinceLastFrame)); }
        if (this.raceManager.raceInProgress) { this.ai.updateAiCar(timeSinceLastFrame); }

        this.lastDate = Date.now();

        if (this.raceManager.raceInProgress) { this.collisionService.detectCollision(); }
        this.raceManager.update();

        this.cameraService.update();
        this.sceneService.skybox.updatePosition(this.carsService.mainCar.getPosition());
    }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();

        this.renderer.render(this.sceneService, this.cameraService.getCamera());
        this.stats.update();
    }

    public onResize(): void {
        this.cameraService.onResize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    private updateCameraOrientation(): void {
        this.cameraService.cameraOrientation = this.carsService.mainCar.orientation.y;
    }

    public nightDayMode(): void {
        this.sceneService.switchNightDay();
        this.carsService.cars.forEach((car) => car.switchHeadlights(this.sceneService.nightDayMode));
    }

    private setAI(): void {
        this.ai = new Ai(this.sceneService, this.carsService);
    }

    public trackLoaded(): void {
        this.carsService.carsInitialPosition(this.sceneService.firstSegment, this.sceneService.trackOrientation);
        this.updateCameraOrientation();

        this.collisionService.setUp(this.sceneService.trackSurfaces);
        this.setAI();

        this.initStats();
        this.startRenderingLoop();
    }
}
