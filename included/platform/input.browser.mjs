
const keysToButtons = {
    "w": "up",
    "s": "down",
    "a": "left",
    "d": "right",

    "arrowup": "up",
    "arrowdown": "down",
    "arrowleft": "left",
    "arrowright": "right",

    "enter": "start",

    " ": "primary",
    "shift": "secondary",
    "backspace": "secondary",

    "z": "primary",
    "x": "secondary",
};

const pressedKeys = {};
const pressedButtons = {};

function pressKey(key) {
    pressedKeys[key] = true;
    const button = keysToButtons[key];
    if(button) {
        pressedButtons[button] = true;
    }
}

function unpressKey(key) {
    delete pressedKeys[key];
    const button = keysToButtons[key];
    if(button) {
        delete pressedButtons[button];
    }
}

window.addEventListener("keydown", evt => {
    if(evt.repeat) return;
    pressKey(evt.key.toLowerCase());
})
window.addEventListener("keyup", evt => {
    unpressKey(evt.key.toLowerCase());
})

export default { pressedButtons };
