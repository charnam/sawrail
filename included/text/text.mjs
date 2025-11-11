
import PolygonGroup from "../PolygonGroup.mjs";
import letters from "./letters.mjs";

import * as Effects from "../Effects.mjs";

function polygonizeText(text, options = {}) {
    options = {
        spacing: 0.5,
        widthScale: 0.7,
        anchor: "center",
        ...options
    }
    const polygons = [];
    let x = 1;
    for(let letter of text) {
        if(letters[letter]) {
            if(polygons.length > 0) {
                x += options.spacing + 1;
            }
            polygons.push(
                letters[letter].withAppliedEffect(Effects.transform, x, 0)
            );
            x += 1;
        }
    }
    return new PolygonGroup(polygons)
        .applyEffect(Effects.transform, -x * ["left", "center", "right"].indexOf(options.anchor) * 0.5, 0)
        .applyEffect(Effects.scale, options.widthScale, 1);
}

export default polygonizeText;
