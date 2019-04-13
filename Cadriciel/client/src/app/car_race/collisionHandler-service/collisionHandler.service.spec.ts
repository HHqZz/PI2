import { CollisionHandlerService } from "./collisionHandler.service";
import { inject, TestBed } from "@angular/core/testing";
import { Car } from "../car/car";
import { Object3D, Vector3, Mesh } from "three";
import { SoundService } from "../sound-service/sound.service";
import { CameraService } from "../camera-service/camera.service";
import { CarsService } from "../cars-service/cars.service";

describe("CollisionHandlerService", () => {

    let collisionHandler: CollisionHandlerService;
    const carA: Car = new Car();
    const carB: Car = new Car();
    const carC: Car = new Car();
    let cars: Car[] = [];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ CollisionHandlerService, SoundService, CameraService, CarsService ]
        });
    });

    beforeEach(inject([SoundService], async (soundService: SoundService, carsService: CarsService) => {
        collisionHandler = new CollisionHandlerService(soundService, carsService);
    }));

    beforeEach(async (done: () => void) => {
        await carA.init();
        await carB.init();
        await carC.init();
        cars.push(carA);
        cars.push(carB);
        cars.push(carC);
        done();
    });

    it("should be created", inject([CollisionHandlerService], (service: CollisionHandlerService) => {
        expect(service).toBeTruthy();
    }));

    it("should setUp with cars' boxes as collidable objects", () => {
        collisionHandler["carsCollisionDetector"]["setUp"](carA, cars);
        expect(collisionHandler["carsCollisionDetector"]["mainCar"] as Car).toBe(carA);
        expect(collisionHandler["carsCollisionDetector"]["collidableCars"][0] as Mesh).toBe(carB.boundingbox);
        expect(collisionHandler["carsCollisionDetector"]["collidableCars"][1] as Mesh).toBe(carC.boundingbox);
    });

    it("should not have the main car as a collidable object", () => {
        collisionHandler["carsCollisionDetector"]["setUp"](carA, cars);
        expect(collisionHandler["carsCollisionDetector"]["mainCar"] as Car).toBe(carA);
        expect(collisionHandler["carsCollisionDetector"]["collidableCars"].includes(carA.boundingbox)).toBe(false);
    });

    it("should get the car of the collided object", () => {
        collisionHandler["carsCollisionDetector"]["setUp"](carA, cars);
        const collided: Object3D = collisionHandler["carsCollisionDetector"]["collidableCars"][0] as Object3D;
        expect(collisionHandler["carsCollisionDetector"]["getCar"](collided)).toBe(carB);
    });

    // tslint:disable:no-magic-numbers
    it("should detect the collision", () => {
        carA.setPosition(new Vector3(10, 0, 10));
        carB.setPosition(new Vector3(11, 0, 12));
        collisionHandler["carsCollisionDetector"]["setUp"](carA, cars);
        collisionHandler["carsCollisionDetector"]["detect"]();
        expect(collisionHandler["carsCollisionDetector"]["collidings"].length).toBeGreaterThan(0);
        expect(collisionHandler["carsCollisionDetector"]["collidings"][0].object).toBe(carB.boundingbox);
    });

    it("should not detect collision when there isn't any", () => {
        carA.setPosition(new Vector3(10, 0, 10));
        carC.setPosition(new Vector3(-20, 0, -20));
        cars = [carA, carC];
        collisionHandler["carsCollisionDetector"]["setUp"](carA, cars);
        collisionHandler["carsCollisionDetector"]["detect"]();

        const sameObject: boolean = collisionHandler["carsCollisionDetector"]["collidings"][0].object === carC.boundingbox;
        const isColliding: boolean = sameObject && collisionHandler["carsCollisionDetector"]["collidings"][0].distance < 3;
        expect(isColliding).toBe(false);
    });

    it("should detect the collision with a specific car", () => {
        carA.setPosition(new Vector3(10, 0, 10));
        carB.setPosition(new Vector3(10, 0, 11));
        cars = [carA, carB];
        collisionHandler["carsCollisionDetector"]["setUp"](carA, cars);
        collisionHandler["carsCollisionDetector"]["detect"]();
        expect(collisionHandler["carsCollisionDetector"]["collidings"][0].object.name).toBe(carB.boundingbox.name);
    });

    it("should handle the collision", () => {
        carA.setPosition(new Vector3(10, 0, 10));
        carB.setPosition(new Vector3(10, 0, 11));
        carA.speed = new Vector3(10, 0, 3);
        carB.speed = new Vector3(-10, 0, 3);

        cars = [carA, carB];
        collisionHandler["carsCollisionDetector"]["mainCar"] = carA;
        collisionHandler["carsCollisionDetector"]["setUp"](carA, cars);

        const vAinitial: Vector3 = carA.speed;
        const vBinitial: Vector3 = carB.speed;
        collisionHandler["carsCollisionDetector"]["detect"]();

        expect(vAinitial === carA.speed).toBe(false);
        expect(vBinitial === carB.speed).toBe(false);
    });
    // tslint:enable:no-magic-numbers
});
