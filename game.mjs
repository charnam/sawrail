
import Engine from "./included/Engine.mjs";
import Polygon from "./included/Polygon.mjs";
import PolygonGroup from "./included/PolygonGroup.mjs";
import * as Effects from "./included/Effects.mjs";
import * as Easing from "./included/easing.mjs";

import * as Music from "./music.mjs"
import polygonizeText from "./included/text/text.mjs";

// A higher sample rate will result in higher game quality.
const SAMPLE_RATE = 48000;
const engine = new Engine(SAMPLE_RATE);

const initialMode = window.location.hash.length > 1 ? window.location.hash.split("#")[1] : "title";
const modes = {
    "text": {
        init: () => {
            engine.setMusic(Music.debug);
            return {};
        },
        loop: () => {
            const group =
                polygonizeText("QRSTUVWXYZ", {anchor: "right"})
                    .withAppliedEffect(Effects.scale, 0.1);
            
            engine.framebuffer = group.toFrameBuffer();
        }
    },
    "title": {
        init: () => {
            const state = {};
            engine.setMusic(Music.sawpi);
            state.startTime = Date.now();
            return state;
        },
        loop: state => {
            const deltaTime = (Date.now() - state.startTime) / 1000;

            let rightPolygon =
                new Polygon({
                    brightness: 1,
                    closed: true,
                    points: [
                        [0, 0.5],
                        [0, -1],
                        [0.5, 0],
                    ]
                });
                /*new Polygon({
                    brightness: 1,
                    closed: true,
                    points: [
                        [0, 1],
                        [0, 0],
                        [-0.5, 0]
                    ]
                });*/
            let leftPolygon = 
                rightPolygon.withAppliedEffect(Effects.rotateDegrees2D, 180)
            
            leftPolygon
                .applyEffect(Effects.transform, -Easing.easeOut(deltaTime), 0);
            rightPolygon
                .applyEffect(Effects.transform, Easing.easeOut(deltaTime), 0);
            
            const text =
                polygonizeText("SAWRAIL", {anchor: "center"})
                    .withAppliedEffect(Effects.scale, 0.1);
            
            text.brightness = 5;
            
            const mainGroup = new PolygonGroup([
                leftPolygon,
                rightPolygon,
                text
            ]);
            mainGroup
                .applyEffect(Effects.scale, Easing.easeOut(1-deltaTime))
                .applyEffect(Effects.wobble, 0.1 * Easing.easeOut(deltaTime % 0.5 * 2))
                .applyEffect(Effects.scale, 1 - 0.8 * Easing.easeOut(deltaTime % 0.5 * 2))

            engine.framebuffer = mainGroup.toFrameBuffer();
        }
    }
}

export { initialMode, modes };
