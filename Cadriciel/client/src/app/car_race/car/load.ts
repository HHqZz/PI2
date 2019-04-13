import { ObjectLoader, Object3D } from "three";
import { PLAYER_CAR } from "../../constants";

export class Load {

    private _carType: string;

    public constructor() {
        this._carType = "";
    }

    public async load(): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load(this.filePath, (object) => {
                resolve(object);
            });
        });
    }

    private get filePath(): string {
        if (this._carType === PLAYER_CAR) {
            return "../../assets/car/camero/camero-2010-low-poly.json";
        }

        return "../../assets/car/virtual_car/virtual-camero-2010-low-poly.json";
    }

    public set carType(type: string) {
        this._carType = type;
    }
}
