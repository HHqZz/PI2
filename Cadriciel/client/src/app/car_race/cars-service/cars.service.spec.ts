import { TestBed, inject } from "@angular/core/testing";
import { CarsService, NUMBER_OF_VIRTUAL_CARS } from "./cars.service";
import { CarNumber } from "../../constants";

describe("CarsService", () => {
    let carsService: CarsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ CarsService ]
        });
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ CarsService ]
        });
    });

    it("should be created", inject([CarsService], (service: CarsService) => {
        expect(service).toBeTruthy();
    }));

    it("should create the cars", () => {
        carsService = new CarsService();

        carsService.cars.forEach((car) => {
            expect(car).toBeDefined();
        });
    });

    it("should initialize the cars", async (done: () => void) => {
        carsService = new CarsService();
        await carsService.initialize();
        done();
        carsService.cars.forEach((car) => {
            expect(car.mesh).toBeTruthy();
        });
        done();
    });

    it("should return an array with all cars", async (done: () => void) => {
        carsService = new CarsService();
        await carsService.initialize();
        done();
        expect(carsService.cars.length).toEqual(NUMBER_OF_VIRTUAL_CARS + 1);
        expect(carsService.cars[CarNumber.PLAYER]).toEqual(carsService.mainCar);
        done();
    });

    it("should return an array only with vitual cars", async (done: () => void) => {
        carsService = new CarsService();
        await carsService.initialize();
        done();
        expect(carsService.aiCars.length).toEqual(NUMBER_OF_VIRTUAL_CARS);
        expect(carsService.aiCars.includes(carsService.mainCar)).toBe(false);
        done();

    });

    it("should randomize any two positions of cars", async (done: () => void) => {
        carsService = new CarsService();
        await carsService.initialize();
        done();
        carsService["positionsHelper"]["randomizeCarsPosition"]();
        // tslint:disable:no-magic-numbers
        expect((carsService["positionsHelper"]["randomPositions"][0] !== carsService["positionsHelper"]["randomPositions"][1]) &&
        (carsService["positionsHelper"]["randomPositions"][0] !== carsService["positionsHelper"]["randomPositions"][2]) &&
        (carsService["positionsHelper"]["randomPositions"][0] !== carsService["positionsHelper"]["randomPositions"][3]) &&
        (carsService["positionsHelper"]["randomPositions"][1] !== carsService["positionsHelper"]["randomPositions"][2]) &&
        (carsService["positionsHelper"]["randomPositions"][1] !== carsService["positionsHelper"]["randomPositions"][3]) &&
        (carsService["positionsHelper"]["randomPositions"][2] !== carsService["positionsHelper"]["randomPositions"][3])
        ).toBeTruthy();
        done();
    });

});
