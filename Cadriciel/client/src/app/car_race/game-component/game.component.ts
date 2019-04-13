
import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnDestroy, } from "@angular/core";
import { RenderService } from "../render/render.service";
import { Car } from "../car/car";
import { ControllerService } from "../eventHandler-service/controller.service";
import { MapLoaderService } from "../map/mapLoader.service";
import { MapService } from "../map/map.service";
import { RaceManagerService } from "../raceUtils/raceManager.service";
import { BestTimesManagerService } from "../raceUtils/bestTimesManager.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [MapService]
})

export class GameComponent implements AfterViewInit, OnDestroy {

    @ViewChild("container")
    private containerRef: ElementRef;
    private playerName: string = "";
    protected isBestTime: boolean = false;
    protected showBestTime: boolean = false;
    protected showMessage: boolean = true;
    protected isFirstTime: boolean = true;
    protected mapName: string = "";

    public constructor(
        private controller: ControllerService,
        private renderService: RenderService,
        private mapLoader: MapLoaderService,
        private raceManager: RaceManagerService,
        private bestTimesManager: BestTimesManagerService,
        private route: ActivatedRoute,
        private mapService: MapService,
    ) {

    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.controller.startMoveHandler(event, this.renderService);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.controller.stopMoveHandler(event, this.renderService);
    }

    public ngAfterViewInit(): void {
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then(async () => { await this.loadMap(); })
            .catch(this.handleError);
    }

    public ngOnDestroy(): void {
        window.location.reload();
    }

    public get car(): Car {
        return this.renderService.car;
    }

    public async loadMap(): Promise<void> {
        this.route.params.subscribe((mapName) => {
            this.mapName = mapName["mapName"];
        });
        await this.mapLoader.generateTrack(this.mapName);
        this.bestTimesManager.init(this.mapLoader.getMapLoaded().bestTimes);
        this.renderService.trackLoaded();
        this.raceManager.raceStart();
    }

    public reloadPage(): void {
        this.mapLoader.setmapToLoadName(this.mapLoader.getMapLoaded().name);
        location.reload();
    }

    private async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }

    public checkIfEnded(): boolean {

        if (this.raceManager.raceEnded) {
            this.checkIfBestime();
            if (this.isFirstTime) {
                this.mapService.updatePlayedTime(this.mapLoader.getMapLoaded().name, this.mapLoader.getMapLoaded());
                this.isFirstTime = false;
            }

            return true;
        }

        return false;
    }

    public checkIfBestime(): void {
        this.isBestTime = this.bestTimesManager.checkIfBestime(this.raceManager.timeHandler.raceTotalTime, 1);
    }

    public updateBestTime(): void {
        this.bestTimesManager.setPlayer(this.playerName, this.raceManager.timeHandler.raceTotalTime, 1);
        this.bestTimesManager.updateBestTimes();
        this.mapService.sendBestTimes(this.mapLoader.getMapLoaded().name, this.bestTimesManager.mapBestTimes).catch(this.handleError);
    }

}
