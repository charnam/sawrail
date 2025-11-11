
import Engine from "./included/Engine.mjs";
import ModedSystem from "./included/ModedSystem.mjs";
import Polygon from "./included/Polygon.mjs";
import PolygonGroup from "./included/PolygonGroup.mjs";
import * as Effects from "./included/Effects.mjs";
import * as Easing from "./included/easing.mjs";

import input from "./included/input.mjs";

import * as Music from "./music.mjs"
import polygonizeText from "./included/text/text.mjs";
import generateCircle from "./included/generateCircle.mjs";
import createClockFace from "./game/generateClockFace.mjs";

// A higher sample rate will result in higher game quality.
const SAMPLE_RATE = 48000;
const engine = new Engine(SAMPLE_RATE);

let initialMode = typeof window !== "undefined" ? (window.location.hash.split("#")[1]) : process.argv[2];

if(!initialMode)
    initialMode = "title"
const system = new ModedSystem({
    "ticktock": {
        init: () => {
            engine.setMusic(Music.ticktock);
            return {startTime: Date.now()};
        },
        loop: state => {
            const deltaTime = (Date.now() - state.startTime) / 1000;
            const isPlaying = deltaTime > 3;
            
            const countdownText =
                polygonizeText(
                    ["THREE", "TWO", "ONE", ""][Math.min(Math.floor(deltaTime), 3)]
                )
                .applyEffect(Effects.scale, deltaTime * 0.1);
            
            const clockHand = new Polygon({
                points: [
                    [1, 0],
                    [0, -0.2],
                    [-0.2, 0],
                    [0, 0.2],
                    [1, 0],
                    [0, 0],
                ],
                closed: true,
                brightness: 1
            });

            clockHand
                .applyEffect(Effects.rotateDegrees2D, deltaTime * 360 * isPlaying)
                .applyEffect(Effects.scale, 0.7);

            const clockOutline = generateCircle(8);

            const clockDot = generateCircle(4).withAppliedEffect(Effects.scale, 0.05);
            const clockDots = new PolygonGroup([]);
            const CLOCK_DOT_DISTANCE = 0.8;
            const CLOCK_DOT_COUNT = 12;
            for(let i = 0; i < CLOCK_DOT_COUNT; i++) {
                clockDots.polygons.push(
                    clockDot
                        .withAppliedEffect(Effects.rotateDegrees2D, 45)
                        .withAppliedEffect(Effects.rotateDegrees2D, -i/12*360)
                        .withAppliedEffect(Effects.translate, 0, -CLOCK_DOT_DISTANCE)
                        .withAppliedEffect(Effects.rotateDegrees2D, i/12*360)
                )
            }

            const clockGroup = new PolygonGroup([
                clockOutline,
                clockDots,
                clockHand
            ]);
            
            const mainGroup = new PolygonGroup([
                clockGroup,
                countdownText
            ])

            engine.framebuffer = mainGroup.toFrameBuffer();
        }
    },
    "text": {
        init: () => {
            engine.setMusic(Music.slow);
            return {zoom: 0.05, x: 0, y: 0};
        },
        loop: state => {
            const group =
                polygonizeText("ABCDEFGHIJKLMNOPQRSTUVWXYZ", {anchor: "center"})
                    .withAppliedEffect(Effects.translate, state.x, state.y)
                    .withAppliedEffect(Effects.scale, state.zoom);
            
            if(input.pressedButtons.right)
                state.x -= 0.1 / state.zoom;
            if(input.pressedButtons.left)
                state.x += 0.1 / state.zoom;
            if(input.pressedButtons.secondary)
                state.zoom /= 1.1;
            if(input.pressedButtons.primary)
                state.zoom *= 1.1;

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
            // Number of seconds since this mode was made visible
            const deltaTime = (Date.now() - state.startTime) / 1000;

            // Animation for polygons / "triangles" in title screen
            let rightPolygon =
                new Polygon({
                    brightness: 1,
                    closed: deltaTime < 4,
                    points: [
                        [0, -0.5 - 0.5 * (1 - Easing.easeInOut(deltaTime / 4 - 1))],
                        [0.5, 0],
                        [0, 0.5],
                    ]
                });
            
            rightPolygon
                .applyEffect(Effects.translate, Easing.easeIn(deltaTime/2 - 1) / 2, 0);

            let leftPolygon = 
                rightPolygon.withAppliedEffect(Effects.rotateDegrees2D, 180);
            
            const polygonsGroup = new PolygonGroup([
                leftPolygon,
                rightPolygon,
            ]);
            polygonsGroup
                .applyEffect(Effects.scale, 1, Easing.easeInOut(-deltaTime/4));

            if(deltaTime > 8) {
                polygonsGroup
                    .applyEffect(Effects.scale, 1 - 0.8 * Easing.easeOut(deltaTime % 0.5 * 2))
            }

            // Animation & definition for "SAWRAIL" title text
            let titleText = "SAWRAIL"
            
            const titleGroup =
                polygonizeText(titleText, {anchor: "center"})
                    .withAppliedEffect(Effects.scale, 0.1);
            
            for(let letter of titleGroup.polygons) {
                letter.brightness = Easing.easeOut(Math.random()-0.3);
                if(Math.random() < 0.1) {
                    //titleText = titleText.slice(0,Math.max(0, letter - 1)) + " " + titleText.slice(letter);
                }
            }

            titleGroup.brightness = 5;
            titleGroup
                .applyEffect(Effects.scale, Easing.easeOut(2-deltaTime/4));

            if(deltaTime > 8)
                titleGroup.applyEffect(Effects.wobble, 0.2 * Easing.easeOut(deltaTime % 1 * 2))
            
            // Join polygons and title, making a new polygon group
            const logoGroup = new PolygonGroup([
                polygonsGroup,
                titleGroup,
            ]);

            logoGroup.applyEffect(Effects.scale, Easing.easeOut(1-deltaTime/2));

            // PRESS START / PRESS ENTER text
            const pressEnterGroup =
                polygonizeText(deltaTime % 2 < 1 ? "PRESS START" : "PRESS ENTER")
                    .applyEffect(Effects.scale, 0.05)
                    .applyEffect(Effects.translate, 0, 0.5);

            pressEnterGroup.brightness = Easing.easeIn(9-deltaTime) * Math.abs(Math.sin(deltaTime * Math.PI)) * 2;
            
            // Merge logo and other things
            const mainGroup = new PolygonGroup([
                logoGroup,
                pressEnterGroup
            ])

            // Return final framebuffer
            engine.framebuffer = mainGroup.toFrameBuffer();

            // Game logic
            if(input.pressedButtons.start) {
                system.setMode("text")
            }
        }
    }
});
system.setMode(initialMode);

export default system;
