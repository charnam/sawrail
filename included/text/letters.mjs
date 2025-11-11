import PolygonGroup from "../PolygonGroup.mjs"
import Polygon from "../Polygon.mjs"

function openPolygon(points) {
    return new Polygon({
        points,
        brightness: 1,
        closed: false
    })
}
function closedPolygon(points) {
    return new Polygon({
        points,
        brightness: 1,
        closed: true
    })
}

const letters = {
    " ": new PolygonGroup([]),

    "A": new PolygonGroup([
        openPolygon([
            [-1, 1],
            [0,-1],
            [1,1]
        ]),
        openPolygon([
            [-0.5,0],
            [0.5,0]
        ])
    ]),
    "B": new PolygonGroup([
        closedPolygon([
            [-1, 1],
            [-1,-1],
            [0.8,-1],
            [0.8,0],
            [-1,0],
            [1,0],
            [1,1]
        ]),
    ]),
    "C": new PolygonGroup([
        openPolygon([
            [1,1],
            [-1,1],
            [-1,-1],
            [1,-1]
        ])
    ]),
    "D": new PolygonGroup([
        closedPolygon([
            [-1,-1],
            [1,0],
            [-1,1],
        ])
    ]),
    "E": new PolygonGroup([
        openPolygon([
            [1, -1],
            [-1, -1],
            [-1, 0],
            [0.5, 0],
            [-1, 0],
            [-1, 1],
            [1, 1]
        ])
    ]),
    "F": new PolygonGroup([
        openPolygon([
            [1, -1],
            [-1, -1],
            [-1, 0],
            [0.5, 0],
            [-1, 0],
            [-1, 1],
        ])
    ]),
    "G": new PolygonGroup([
        openPolygon([
            [0, 0.2],
            [0, 0],
            [1, 0],
            [1, 1],
            [-1, 1],
            [-1, -1],
            [1, -1],
            [1, -0.5]
        ])
    ]),
    "H": new PolygonGroup([
        openPolygon([
            [-1, -1],
            [-1, 1]
        ]),
        openPolygon([
            [-1, 0],
            [1, 0]
        ]),
        openPolygon([
            [1, -1],
            [1, 1]
        ]),
    ]),
    "I": new PolygonGroup([
        openPolygon([
            [-1, -1],
            [1, -1]
        ]),
        openPolygon([
            [0, -1],
            [0, 1]
        ]),
        openPolygon([
            [-1, 1],
            [1, 1]
        ]),
    ]),
    "J": new PolygonGroup([
        openPolygon([
            [-1, -1],
            [1, -1]
        ]),
        openPolygon([
            [0, -1],
            [0, 1],
            [-1, 1]
        ])
    ]),
    "K": new PolygonGroup([
        openPolygon([
            [-1, -1],
            [-1, 1]
        ]),
        openPolygon([
            [1, 1],
            [-1, 0],
            [1, -1]
        ])
    ]),
    "L": new PolygonGroup([
        openPolygon([
            [-1, -1],
            [-1, 1],
            [1, 1]
        ]),
    ]),
    "M": new PolygonGroup([
        openPolygon([
            [-1, 1],
            [-1, -1],
            [0, 0],
            [1, -1],
            [1, 1],
        ]),
    ]),
    "N": new PolygonGroup([
        openPolygon([
            [-1, 1],
            [-1, -1],
            [1, 1],
            [1, -1],
        ]),
    ]),
    "O": new PolygonGroup([
        closedPolygon([
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1]
        ]),
    ]),
    "P": new PolygonGroup([
        openPolygon([
            [-1, 1],
            [-1, -1],
            [1, -1],
            [1, 0],
            [-1, 0]
        ]),
    ]),
    "Q": new PolygonGroup([
        closedPolygon([
            [-1, 1],
            [-1, -1],
            [1, -1],
            [1, 0.5],
            [0.5, 1],
            [-1, 1]
        ]),
        openPolygon([
            [1, 1],
            [0.5, 0.5]
        ])
    ]),
    "R": new PolygonGroup([
        openPolygon([
            [-1, 1],
            [-1, -1],
            [1, -1],
            [1, 0],
            [-1, 0],
            [0, 0],
            [1, 1]
        ]),
    ]),
    "S": new PolygonGroup([
        openPolygon([
            [-1, 1],
            [1, 1],
            [1, 0],
            [-1, 0],
            [-1, -1],
            [1, -1]
        ]),
    ]),
    "T": new PolygonGroup([
        openPolygon([
            [-1, -1],
            [1, -1]
        ]),
        openPolygon([
            [0, -1],
            [0, 1]
        ]),
    ]),
    "U": new PolygonGroup([
        openPolygon([
            [-1,-1],
            [-1,1],
            [1,1],
            [1,-1]
        ])
    ]),
    "V": new PolygonGroup([
        openPolygon([
            [-1,-1],
            [0,1],
            [1,-1]
        ])
    ]),
    "W": new PolygonGroup([
        openPolygon([
            [-1,-1],
            [-0.5,1],
            [0,0],
            [0.5,1],
            [1,-1]
        ]),
    ]),
    "X": new PolygonGroup([
        openPolygon([
            [-1,-1],
            [1, 1]
        ]),
        openPolygon([
            [-1,1],
            [1, -1]
        ]),
    ]),
    "Y": new PolygonGroup([
        openPolygon([
            [-1,-1],
            [0,0],
            [1,-1]
        ]),
        openPolygon([
            [0,0],
            [0,1]
        ]),
    ]),
    "Z": new PolygonGroup([
        openPolygon([
            [-1,-1],
            [1,-1],
            [-1,1],
            [1,1]
        ]),
    ]),
}

export default letters;