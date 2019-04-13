import { TestBed, inject } from "@angular/core/testing";

import { EventHandlerService } from "./event-handler.service";

describe("EventHandlerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventHandlerService]
    });
  });

  it("should be created", inject([EventHandlerService], (service: EventHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
