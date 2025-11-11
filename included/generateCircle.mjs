
import Polygon from "./Polygon.mjs";

function circlePoints(count) {
	let points = [];
	for(let i = 0; i < count; i++)
		points.push([Math.sin(Math.PI*i*2/count), -Math.cos(Math.PI*i*2/count)]);
	return points;
}

function generateCircle(points) {
    return new Polygon({
        points: circlePoints(points),
        brightness: 1,
        closed: true
    });
}

export default generateCircle;
