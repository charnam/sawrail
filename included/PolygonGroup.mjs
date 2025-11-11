import Polygon from "./Polygon.mjs";

class PolygonGroup {
    brightness = 1;
    constructor(polygons) {
        this.polygons = polygons;
    }
    applyEffect(effectFunction, ...args) {
        for(let polygon of this.polygons) {
            polygon.applyEffect(effectFunction, ...args);
        }
        return this;
    }
    withAppliedEffect(effectFunction, ...args) {
        return new PolygonGroup(
            this.polygons.map(polygon =>
                polygon.withAppliedEffect(effectFunction, ...args)
            )
        );
    }
    toFrameBuffer() {
        return this.polygons.map(polygon => {
            if(polygon instanceof Polygon) {
                polygon.brightness = polygon.brightness * this.brightness;
                return [polygon];
            } else if(polygon instanceof PolygonGroup) {
                polygon.brightness = polygon.brightness * this.brightness;
                return polygon.toFrameBuffer();
            }
        }).flat();
    }
}

export default PolygonGroup;