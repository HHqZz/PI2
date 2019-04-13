import { CollisionPhysic } from "./collisionPhysic";
import { Car } from "../car/car";
import { Vector3 } from "three";
import { TestBed, inject } from "@angular/core/testing";
import { SoundService } from "../sound-service/sound.service";
import { CameraService } from "../camera-service/camera.service";

describe("CollisionPhysic", () => {

    let collisionPhysic: CollisionPhysic;
    const carA: Car = new Car();
    const carB: Car = new Car();

    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [SoundService, CameraService]
        });
        done();
    });

    beforeEach(inject([SoundService], async (soundService: SoundService) => {
        collisionPhysic = new CollisionPhysic(soundService);
    }));

    beforeEach(async (done: () => void) => {
        await carA.init();
        await carB.init();
        done();
    });

    it("should be created", () => {
        expect(collisionPhysic).toBeTruthy();
    });

    it("should set cars colliding", () => {
        collisionPhysic.setUpColliders(carA, carB);
        expect(collisionPhysic["carA"]).toBe(carA);
        expect(collisionPhysic["carB"]).toBe(carB);
    });

    it("should prevent new collision testing with same cars", inject([SoundService], (soundService: SoundService) => {
        collisionPhysic = new CollisionPhysic(soundService);
        collisionPhysic.setUpColliders(carA, carB);
        expect(collisionPhysic["collisionHandled"]).toBe(false);

        collisionPhysic.vectorElascticCollision();
        collisionPhysic.setUpColliders(carA, carB);
        expect(collisionPhysic["collisionHandled"]).toBe(true);
    }));

    it("should allow new collision testing with new cars", inject([SoundService], (soundService: SoundService) => {
        collisionPhysic = new CollisionPhysic(soundService);
        collisionPhysic.setUpColliders(carA, carB);
        expect(collisionPhysic["collisionHandled"]).toBe(false);

        collisionPhysic.vectorElascticCollision();
        collisionPhysic.setUpColliders(carB, carA);
        expect(collisionPhysic["collisionHandled"]).toBe(false);
    }));

    // tslint:disable:no-magic-numbers
    it("should allow new collision testing based on distance", inject([SoundService], (soundService: SoundService) => {
        collisionPhysic = new CollisionPhysic(soundService);
        collisionPhysic.setUpColliders(carA, carB);
        collisionPhysic.vectorElascticCollision();
        expect(collisionPhysic["collisionHandled"]).toBe(true);

        carA.setPosition(new Vector3(10, 0, 10));
        collisionPhysic.enableCollisionTest();

        expect(collisionPhysic["collisionHandled"]).toBe(false);
    }));

    it("should return the distance between the cars", inject([SoundService], (soundService: SoundService) => {
        collisionPhysic = new CollisionPhysic(soundService);
        collisionPhysic.setUpColliders(carA, carB);
        carA.setPosition(new Vector3(10, 0, 10));
        carB.setPosition(new Vector3(20, 0, 40));

        expect(collisionPhysic["carsDistance"]).toEqual(Math.sqrt(1000));
    }));

    it("should return the normal vector of the collision", inject([SoundService], (soundService: SoundService) => {
        collisionPhysic = new CollisionPhysic(soundService);
        collisionPhysic.setUpColliders(carA, carB);
        carA.setPosition(new Vector3(4, 0, 7));
        carB.setPosition(new Vector3(8, 0, 10));
        const normal: Vector3 = collisionPhysic["normalVector"];
        normal.setZ(Number(normal.z.toFixed(1)));

        expect(normal).toEqual(new Vector3(4 / 5, 0, 3 / 5));
    }));

    it("should return the tangent vector of the collision", inject([SoundService], (soundService: SoundService) => {
        collisionPhysic = new CollisionPhysic(soundService);
        collisionPhysic.setUpColliders(carA, carB);
        carA.setPosition(new Vector3(4, 0, 7));
        carB.setPosition(new Vector3(8, 0, 10));
        const normal: Vector3 = collisionPhysic["normalVector"];

        expect(collisionPhysic["tangentVector"]).toEqual(new Vector3(-normal.z, 0, normal.x));
    }));

    it("should return the final velocity", inject([SoundService], (soundService: SoundService) => {
        collisionPhysic = new CollisionPhysic(soundService);
        collisionPhysic.setUpColliders(carA, carB);
        carA.setPosition(new Vector3(4, 0, 7));
        carB.setPosition(new Vector3(8, 0, 10));

        expect(collisionPhysic["finalVelocity"](10, 5)).toEqual(new Vector3(5, 0, 10));
    }));

    it("should set the cars' speeds after collision", inject([SoundService], (soundService: SoundService) => {
        collisionPhysic = new CollisionPhysic(soundService);
        carA.setPosition(new Vector3(4, 0, 7));
        carB.setPosition(new Vector3(8, 0, 10));
        collisionPhysic.setUpColliders(carA, carB);
        carA.speed = new Vector3(10, 0, 4);
        carB.speed = new Vector3(5, 0, 2);

        collisionPhysic.vectorElascticCollision();

        const finalASpeed: Vector3 = new Vector3(Number(carA.speed.x.toFixed(2)), carA.speed.y, Number(carA.speed.z.toFixed(2)));
        const finalBSpeed: Vector3 = new Vector3(Number(carB.speed.x.toFixed(2)), carB.speed.y, Number(carB.speed.z.toFixed(2)));

        expect(finalASpeed).toEqual(new Vector3(5.84, 0, 0.88));
        expect(finalBSpeed).toEqual(new Vector3(9.16, 0, 5.12));
    }));

    it("should only change cars' speed once after collision", inject([SoundService], (soundService: SoundService) => {
        collisionPhysic = new CollisionPhysic(soundService);
        collisionPhysic.setUpColliders(carA, carB);
        carA.setPosition(new Vector3(4, 0, 7));
        carB.setPosition(new Vector3(8, 0, 10));
        carA.speed = new Vector3(10, 0, 4);
        carB.speed = new Vector3(5, 0, 2);

        collisionPhysic.vectorElascticCollision();

        expect(collisionPhysic["collisionHandled"]).toBe(true);

        collisionPhysic.setUpColliders(carA, carB);
        carA.setPosition(new Vector3(4, 0, 7));
        carB.setPosition(new Vector3(8, 0, 11));
        expect(collisionPhysic["collisionHandled"]).toBe(true);

        collisionPhysic.vectorElascticCollision();

        const finalASpeed: Vector3 = new Vector3(Number(carA.speed.x.toFixed(2)), carA.speed.y, Number(carA.speed.z.toFixed(2)));
        const finalBSpeed: Vector3 = new Vector3(Number(carB.speed.x.toFixed(2)), carB.speed.y, Number(carB.speed.z.toFixed(2)));

        expect(finalASpeed).toEqual(new Vector3(5.84, 0, 0.88));
        expect(finalBSpeed).toEqual(new Vector3(9.16, 0, 5.12));
    }));
    // tslint:enable:no-magic-numbers
});
