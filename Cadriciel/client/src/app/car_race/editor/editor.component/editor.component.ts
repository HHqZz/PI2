import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { EditorRenderService } from "../editorRender.service";
import { MapsFactory } from "../mapsFactory";
import { MapService } from "../../map/map.service";
import { Map } from "../../../../../../common/communication/map";

@Component({
    selector: "app-editor",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.css"],
    providers: [EditorRenderService, MapService],
})
export class EditorComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    private mapsFactory: MapsFactory;
    public selectionIsFinished: boolean;
    public mapModel: Map;

    public constructor(private render: EditorRenderService, private mapService: MapService) {
        this.selectionIsFinished = false;
        this.mapModel = new Map("");
    }

    public types: string[] = ["EASY", "MEDIUM", "HARD"];

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.render.onResize();
    }

    @HostListener("window:mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        this.mapsFactory.onMouseDown(event);
    }

    @HostListener("window:mouseup", ["$event"])
    public onMouseUp(event: MouseEvent): void {
        this.mapsFactory.onMouseUp();
    }

    @HostListener("window:mousemove", ["$event"])
    public onMouseMove(event: MouseEvent): void {
        this.mapsFactory.onMouseMove(event);
    }

    public onCreate(): void {
        if (this.mapsFactory.trackValidity()) {
            this.genPreview();
            this.selectionIsFinished = true;
            this.mapModel.segmentsArray = this.mapsFactory.saveSegment();
        }
    }

    public onSubmit(): void {
        this.mapService.insert(this.mapModel).then().catch(this.handleError);
        alert("New Map Created");
    }

    public ngAfterViewInit(): void {
        this.render.initialize(this.containerRef.nativeElement);
        this.mapsFactory = new MapsFactory(this.render);
    }

    private async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }

    private genPreview(): void {
        const image: HTMLImageElement = new Image();
        this.render.prepareForScreenShot();
        this.render.getRenderer().render(this.render.getScene(), this.render.camera);
        image.src = this.render.dom.toDataURL();
        this.mapModel.preview = image.src;
    }
}
