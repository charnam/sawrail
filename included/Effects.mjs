
function wobble(points, ...n) {
    return points.map(vector => 
        vector.map((position, index) => 
            position + (Math.random() * 2 - 1) * (n[index] ?? n[0])
        )
    );
}
function translate(points, ...n) {
    return points.map(vector => 
        vector.map((position, index) => 
            position + (n[index] ?? n[0])
        )
    );
}
function scale(points, ...n) {
    return points.map(vector => 
        vector.map((position, index) =>
            position * (n[index] ?? n[0])
        )
    )
}
function rotateRadians2D(points, radians) {
    return points.map(point => [
        Math.cos(-radians) * point[0] + Math.sin(-radians) * point[1],
        Math.cos(-radians) * point[1] - Math.sin(-radians) * point[0]
    ])
}
function rotateDegrees2D(points, degrees) {
    return rotateRadians2D(points, degrees * Math.PI / 180);
}

export {
    translate,
    scale,
    wobble,
    rotateRadians2D,
    rotateDegrees2D
};