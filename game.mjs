
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

// A higher sample rate will result in higher game quality.
const SAMPLE_RATE = 48000;
const engine = new Engine(SAMPLE_RATE);

let initialMode = typeof window !== "undefined" ? (window.location.hash.split("#")[1]) : process.argv[2];

if(!initialMode)
    initialMode = "title"
const system = new ModedSystem({
    "stage_switch": {
        init: (info) => {
            engine.setMusic(Music.stage_switch);
            return {
                startTime: Date.now(),
                text: info.text ?? "ERROR",
                mode: Array.isArray(info.mode) && info.mode.length >= 1
                    ? info.mode
                    : ["title"]
            };
        },
        loop: state => {
            const textGroup =
                polygonizeText(state.text)
                    .applyEffect(Effects.scale, 0.1)
                    .applyEffect(Effects.wobble, (Date.now() - state.startTime) / 1000 * 0.01);
            
            if(state.startTime < Date.now() - 2000) {
                system.setMode(...state.mode);
            }
            
            engine.framebuffer = textGroup.toFrameBuffer();
        }
    },
    "ticktock": {
        init: () => {
            engine.setMusic(time => {
                let out = time * Math.floor(time + 1) * 30;
                if(time % 4 < 3)
                    out *= ((time % 1) * 0.1 + 1);
                else
                    out *= 1.2;
                return out;
            });
            
            return {
                startTime: Date.now(),
                stageStartTime: Date.now() + 4000,
                stage: 0,
                startDot: 0,
                abacabaStartSeq: 0
            };
        },
        loop: state => {
            const deltaTime = (Date.now() - state.startTime) / 1000;
            const stageTime = (Date.now() - state.stageStartTime) / 1000;
            const isPlaying = deltaTime > 4;
            
            const CLOCK_DOT_DISTANCE = 0.8;
            const CLOCK_DOT_COUNT = 16;
            const STAGE_SPEED_MULTIPLIER = 0.2;
            
            const getTimeStageMult = stage => stage * STAGE_SPEED_MULTIPLIER + 0.5;
            
            const timeStageMult = getTimeStageMult(state.stage);
            
            const setStage = (stage, startDot) => {
                state.stageStartTime = Date.now();
                state.stage = stage;
                state.target = startDot - 1;
                state.startDot = startDot;
                let fromOldTargetToNewTarget = state.target - startDot;
                if(fromOldTargetToNewTarget < 0)
                    fromOldTargetToNewTarget = CLOCK_DOT_COUNT + fromOldTargetToNewTarget;
                
                let timeStageMult = getTimeStageMult(state.stage);
                state.abacabaStartSeq = state.abacabaStartSeq + Math.floor(stageTime * 4 * timeStageMult);
                
                engine.setMusic((time) => {
                    const BEEP_LENGTH = 0.01;
                    const currentDotRelativeToTargetWhereTargetIsZero =
                        ((time * timeStageMult * 2 - fromOldTargetToNewTarget + CLOCK_DOT_COUNT) % CLOCK_DOT_COUNT);
                    
                    if((currentDotRelativeToTargetWhereTargetIsZero >= CLOCK_DOT_COUNT - 3.5 ||
                        currentDotRelativeToTargetWhereTargetIsZero < 1) &&
                        time * timeStageMult % 0.5 < BEEP_LENGTH * timeStageMult) {
                        return time * 1024;
                    }
                    
                    if(time * timeStageMult % 1 / timeStageMult < BEEP_LENGTH)
                        time *= 240;
                    else if(time * timeStageMult % 0.5 / timeStageMult < BEEP_LENGTH)
                        return time * 120;
                    else if(time * timeStageMult % 0.25 / timeStageMult < 0.01)
                        return time * 480;
                    
                    
                    return time * Music.getAbacabaFrequencyAtTime(state.abacabaStartSeq+time*4*timeStageMult);
                });
            }
            
            if(isPlaying && state.stage == 0) {
                setStage(1, CLOCK_DOT_COUNT);
            }
            
            const countdownText =
                polygonizeText(
                    ["THREE", "TWO", "ONE", "GO", ""][Math.min(Math.floor(deltaTime), 4)]
                )
                .applyEffect(Effects.wobble, (1-Easing.easeIn(deltaTime/4))/8)
                .applyEffect(Effects.scale, deltaTime * 0.1)
            
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
            }).applyEffect(Effects.rotateDegrees2D, -90);

            const clockOutline = generateCircle(8);

            const clockDot = generateCircle(4).withAppliedEffect(Effects.scale, 0.05);
            const clockDots = new PolygonGroup([]);
            
            const clockHandCycle = (stageTime * isPlaying / CLOCK_DOT_COUNT * 2 * timeStageMult + state.startDot / CLOCK_DOT_COUNT) % 1;
            
            clockHand
                .applyEffect(Effects.rotateDegrees2D, clockHandCycle * 360)
                .applyEffect(Effects.scale, 0.7);
            
            const selectedDot = Math.floor(clockHandCycle * CLOCK_DOT_COUNT);
            
            for(let i = 0; i < CLOCK_DOT_COUNT; i++) {
                const dot = 
                    clockDot
                        .withAppliedEffect(Effects.rotateDegrees2D, 45)
                        .withAppliedEffect(Effects.rotateDegrees2D, -i/CLOCK_DOT_COUNT*360)
                        .withAppliedEffect(Effects.translate, 0, -CLOCK_DOT_DISTANCE)
                        .withAppliedEffect(Effects.rotateDegrees2D, i/CLOCK_DOT_COUNT*360);
                
                if(i !== selectedDot) {
                    if(i == state.target)
                        dot.brightness = 0.4;
                    else
                        dot.brightness = 0.1;
                } else
                    dot.brightness = Easing.easeOut((clockHandCycle * CLOCK_DOT_COUNT) % 1)
                
                clockDots.polygons.push(dot)
            }
            
            const clockGroup = new PolygonGroup([
                clockOutline,
                clockDots,
                clockHand
            ]);
            clockGroup
                .applyEffect(Effects.wobble, 0.001 * state.stage)
                .applyEffect(Effects.scale, 0.9);
            
            const mainGroup = new PolygonGroup([
                clockGroup,
                countdownText
            ])

            engine.framebuffer = mainGroup.toFrameBuffer();
            
            if(input.pressedButtons.primary && isPlaying) {
                delete input.pressedButtons.primary;
                
                let distanceToDot = Math.abs(clockHandCycle - (state.target / CLOCK_DOT_COUNT));
                if(distanceToDot > 0.5) {
                    distanceToDot = 0.5 - (distanceToDot - 0.5);
                }
                
                if(distanceToDot <= 0.05 || input.pressedButtons.secondary) {
                    if(state.target !== 0) {
                        setStage(state.stage + 1, state.target);
                    } else {
                        system.setMode("stage_switch", {text: "GOOD JOB", mode: ["ticktock"]})
                    }
                } else {
                    system.setMode("stage_switch", {text: "WHOOPS", mode: ["title"]})
                }
            }
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
                .applyEffect(Effects.translate, Easing.easeIn(deltaTime/2 - 1) / 4, 0)
                .applyEffect(Effects.translate, -0.125 * (1 - Easing.easeInOut(deltaTime / 4 - 1)), 0)
                ;

            let leftPolygon = 
                rightPolygon.withAppliedEffect(Effects.rotateDegrees2D, 180);
            
            const polygonsGroup = new PolygonGroup([
                leftPolygon,
                rightPolygon,
            ]);
            polygonsGroup
                .applyEffect(Effects.scale, 1, Easing.easeInOut(-deltaTime/4))
                .applyEffect(Effects.scale, 1, 1 - 0.2 * (1 - Easing.easeInOut(deltaTime / 4 - 1)))

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
                system.setMode("stage_switch", {text: "NEW GAME", mode: ["ticktock"]})
            }
        }
    }
});
system.setMode(initialMode);

export default system;
