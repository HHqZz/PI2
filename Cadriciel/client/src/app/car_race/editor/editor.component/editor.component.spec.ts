import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { EditorComponent } from "./editor.component";
import { EditorRenderService } from "../editorRender.service";
import { MapsFactory } from "../mapsFactory";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

describe("EditorComponent", () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  let mockEditorRender: Partial<EditorRenderService>;

  mockEditorRender = {
    onResize: () => {},
    initialize: (element: {}) => {}
  };

  let mockMapFactory: Partial<MapsFactory>;

  mockMapFactory = {
    onMouseDown: () => {},
    onMouseUp: () => {},
    onMouseMove: () => {}
  };

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [ EditorComponent ],
      imports: [FormsModule, ReactiveFormsModule, BrowserModule , HttpModule, RouterTestingModule],
      providers: [ { provide: EditorRenderService, useValue: mockEditorRender },
                   { provide: MapsFactory, useValue: mockMapFactory } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    component.ngAfterViewInit();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
