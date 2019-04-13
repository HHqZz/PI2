import { Map } from "../../../../../common/communication/map";

describe( "Map", () => {
    const map: Map = new Map ("name", "description");

    it("should be created", () => {
        expect(map).toBeDefined();
    });
});
