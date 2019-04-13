import { TestBed, inject } from "@angular/core/testing";

import { GridFactoryService } from "./grid-factory.service";
import { HttpClient, HttpHandler } from "@angular/common/http";

describe("GridFactoryService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridFactoryService, HttpClient, HttpHandler]
    });
  });
  beforeEach(inject([HttpClient, HttpHandler ], (httpclient: HttpClient, httpHandler: HttpHandler) => {
  }));

  it("should be created", inject([GridFactoryService], (gridfactory: GridFactoryService) => {
    expect(gridfactory).toBeTruthy();
  }));
});
