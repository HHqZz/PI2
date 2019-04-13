
import * as THREE from "three";
import { GROUND, PI_OVER_2 } from "../../constants";

const SKYBOX_SIDE_SIZE: number = 800;
const PLANE_SIZE: number = 800;
const REPEAT_RATIO: number = 200;
const CLOUD_MOUVEMENT: number = 0.00015;

const TEXTURE_DAY_PATH: string = "../../../assets/skybox/Day/";
const TEXTURE_NIGHT_PATH: string = "../../../assets/skybox/Night/";
const GROUND_DAY_TEXTURE: string = TEXTURE_DAY_PATH + "grass_tile.png";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_DAY_OPACITY: number = 0.75;
const AMBIENT_LIGHT_NIGHT_OPACITY: number = 0.4;

export class Skybox extends THREE.Mesh {
    private dayMode: boolean;
    private plane: THREE.Mesh;
    private light: THREE.AmbientLight;

    public constructor () {

        super(new THREE.BoxGeometry(SKYBOX_SIDE_SIZE, SKYBOX_SIDE_SIZE, SKYBOX_SIDE_SIZE),
              new THREE.MultiMaterial);
        this.dayMode = true;
        this.material = this.initMaterial();
        this.plane = this.initGround();
        this.light = this.initLight();    }

    public get ground(): THREE.Mesh {
        return this.plane;
    }

    public get lighting(): THREE.AmbientLight {
        return this.light;
    }

    public get nightAndDay(): boolean {
        return this.dayMode;
    }

    private initMaterial(): THREE.MultiMaterial {
        const materials: THREE.MeshBasicMaterial[] = [];
        for (const image of this.textureImages) {
            materials.push(new THREE.MeshBasicMaterial({
                map : new THREE.TextureLoader().load(image),
                side : THREE.DoubleSide
            }));
        }

        return new THREE.MultiMaterial(materials);
    }

    private get textureImages(): string[] {
        if (this.dayMode) {
            return [
                TEXTURE_DAY_PATH + "posx.jpg",
                TEXTURE_DAY_PATH + "negx.jpg",
                TEXTURE_DAY_PATH + "posy.jpg",
                TEXTURE_DAY_PATH + "negy.jpg",
                TEXTURE_DAY_PATH + "posz.jpg",
                TEXTURE_DAY_PATH + "negz.jpg"
            ];
        } else {
            return [
                TEXTURE_NIGHT_PATH + "posx.jpg",
                TEXTURE_NIGHT_PATH + "negx.jpg",
                TEXTURE_NIGHT_PATH + "posy.jpg",
                TEXTURE_NIGHT_PATH + "negy.jpg",
                TEXTURE_NIGHT_PATH + "posz.jpg",
                TEXTURE_NIGHT_PATH + "negz.jpg"
            ];
        }
    }

    private initGround(): THREE.Mesh {

        const geometry: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(PLANE_SIZE, PLANE_SIZE);
        const material: THREE.MeshPhongMaterial   = new THREE.MeshPhongMaterial({
                        map: new THREE.TextureLoader().load( GROUND_DAY_TEXTURE, (texture) => {
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.wrapT = THREE.RepeatWrapping;
                                texture.offset.set( 0, 0 );
                                texture.repeat.set( REPEAT_RATIO, REPEAT_RATIO );
                            }),
                        side: THREE.DoubleSide,
                        depthWrite: false
                        });
        const plane: THREE.Mesh = new THREE.Mesh(geometry, material);
        plane.rotateX(PI_OVER_2);
        plane.name = GROUND;

        return plane;
    }

    private initLight(): THREE.AmbientLight {
        return new THREE.AmbientLight(
            WHITE,
            (this.dayMode) ? AMBIENT_LIGHT_DAY_OPACITY : AMBIENT_LIGHT_NIGHT_OPACITY);
    }

    public switchDayNight(): void {
        this.dayMode = !this.dayMode;
        this.material = this.initMaterial();
        this.light = this.initLight();
    }

    public updatePosition(newPosition: THREE.Vector3): void {
        this.position.copy(newPosition);
        this.rotation.y += CLOUD_MOUVEMENT;
    }
}
