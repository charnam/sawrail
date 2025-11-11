
import PolygonGroup from "./PolygonGroup.mjs";

class Polygon {
    brightness = 1;
    points = [];
    closed = true;

    get pointsOut() {
        const outputPoints = [
            ...this.points,
        ];
        if(this.closed)
            outputPoints.push(this.points[0]);
        return outputPoints;
    }
    constructor(data) {
        this.brightness = data.brightness;
        this.points = [...data.points.map(point => [...point])];
        this.closed = data.closed;
    }
    applyEffect(effectFunction, ...args) {
        this.points = effectFunction(this.points, ...args);
        return this;
    }
    withAppliedEffect(effectFunction, ...args) {
        return new Polygon({
            brightness: this.brightness,
            closed: this.closed,
            points: effectFunction(this.points, ...args)
        });
    }
    toFrameBuffer() {
        return new PolygonGroup([this]).toFrameBuffer();
    }
}

export default Polygon;
