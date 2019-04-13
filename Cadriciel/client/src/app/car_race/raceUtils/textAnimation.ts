import { TextGeometry, FontLoader, Font, MeshPhongMaterial, Mesh, Geometry } from "three";

const FONT_PATH: string = "../../assets/fonts/helvetiker_regular.typeface.json";
const INCLINE_RATIO: number = 25;

export class TextAnimation extends Mesh {
    private _text: string;

    public constructor(text: string = " ") {
        const material: MeshPhongMaterial = new MeshPhongMaterial({ color: 0x0080FF});
        super(new Geometry(), material);
        this._text = text;
        this.createText(text)
            .then(() => {})
            .catch((error) => console.error(error));
        this.rotateGeometry();
        this.setVisibility(false);
    }

    private async fontLoader(): Promise <Font> {
        return new Promise<Font>((resolve, reject) => {
            const loader: FontLoader = new FontLoader();
            loader.load(FONT_PATH, (font: Font) => {
               resolve(font);
            });
        });
    }

    private async createText(text: string): Promise <void> {
        let font: Font;
        font = await this.fontLoader();
        this.geometry = new TextGeometry(text, {
                font: font,
                size: 3, height: 0.7,
                curveSegments: 0, bevelEnabled: false,
                bevelThickness: 0, bevelSize: 0
            });
    }

    private rotateGeometry(): void {
        this.rotation.x = Math.PI + Math.PI / INCLINE_RATIO;
        this.rotation.y = Math.PI ;
        this.rotation.z = Math.PI ;
    }

    public get text(): string {
        return this._text;
    }

    public setVisibility(bool: boolean): void {
        this.visible = bool;
    }
}
