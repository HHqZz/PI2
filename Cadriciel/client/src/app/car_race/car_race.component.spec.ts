import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CarRaceComponent } from "./car_race.component";

describe("CarRaceComponent", () => {
  let component: CarRaceComponent;
  let fixture: ComponentFixture<CarRaceComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ CarRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
