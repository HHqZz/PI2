// tslint:disable:no-useless-files
// import { TestBed, inject } from "@angular/core/testing";
// import { GridComponent } from "./grid.component";
// import { HttpClientTestingModule } from "@angular/common/http/testing";
// import { HttpHandler, HttpClient } from "@angular/common/http";
// import { SocketService } from "../serviceMultiplayer/connectionService";
// import { GridFactoryService } from "../grid-factory.service";
// // import { EventInput } from "./eventHandler/EventInput";

// let component: GridComponent;
// describe("GridComponent", () => {
//   beforeEach(async () =>  {
//     void TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       declarations: [GridComponent],
//       providers: [GridComponent, HttpClient,
//                   HttpHandler, SocketService, GridFactoryService ]
//     });
//   });

//   beforeEach(inject([GridComponent, HttpClient, HttpHandler, SocketService, GridFactoryService ],
//                     (socketService: SocketService) => {
//                       component = new GridComponent(socketService);
// }));
//   it ("should be created", inject([GridComponent, HttpClient, HttpHandler, SocketService, GridFactoryService ],
//                                   (socketService: SocketService) => {
//       component = new GridComponent(socketService);
//       expect(socketService).toBeTruthy();
//       expect(component).toBeTruthy();
//     }));
//   it("should return an Observable<User[]>", () => {
//       component.changeFocusDirection();
//       expect(component.focusHorizontal).toBe(false);
//     });
//   it("should change the background color when the mouse enter the clue", () => {
//       component.mouseEnter(1);
//       expect(component.styleIndice[1]).toEqual({"background-color":  "rgb(140,140,140)", "text-decoration": ""});
//     });
//   it("should reset the background color when the mouse enter the clue and then leaves it", () => {
//       component.mouseEnter(1);
//       component.mouseLeave(1);
//       expect(component.styleIndice[1]).toEqual({"background-color": "white", "text-decoration": ""});
//     });
//   it("should not the background color when the mouse hover on a clue that have been already solved", () => {
//       component.styleIndice[1] = {"background-color": "blue"};
//       component.wordsFound[1] = true;
//       component.mouseEnter(1);
//       component.mouseLeave(1);
//       expect(component.styleIndice[1] ).toEqual({"background-color": "blue"});
//     });
//   it("should activate the cheat mode", () => {
//       component.cheatActivated = false;
//       component.cheat();
//       expect(component.cheatActivated).toBe(true);
//     });
//   it("should desactivate the cheat mode", () => {
//       component.cheatActivated = true;
//       component.cheat();
//       expect(!component.cheatActivated).toBe(true);
//     });
//   it("should focus horizontally", () => {
//       component.focusHorizontal = false;
//       component.changeFocusDirection();
//       expect(component.focusHorizontal).toBe(true);
//     });
//   it("should focus vertically", () => {
//       component.focusHorizontal = true;
//       component.changeFocusDirection();
//       expect(!component.focusHorizontal).toBe(true);
//     });
//   });
