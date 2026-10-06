const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystick-knob");

// ==================================================
// FIXED GAME VIEW
// ==================================================

const VIEW_WIDTH = 900;
const VIEW_HEIGHT = 600;

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;

// Canvas drawing resolution NEVER changes.
canvas.width = VIEW_WIDTH;
canvas.height = VIEW_HEIGHT;

// ==================================================
// PLAYER
// ==================================================

const player = {
    x: 300,
    y: 300,

    width: 32,
    height: 32,

    speed: 4
};

// ==================================================
// CAMERA
// ==================================================

const camera = {
    x: 0,
    y: 0,

    width: VIEW_WIDTH,
    height: VIEW_HEIGHT
};

// ==================================================
// RESPONSIVE DISPLAY
// ==================================================

function resizeGame() {

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Scale the fixed 900x600 game view
    // enough to cover the entire screen.
    const scale = Math.max(
        screenWidth / VIEW_WIDTH,
        screenHeight / VIEW_HEIGHT
    );

    const displayWidth =
        VIEW_WIDTH * scale;

    const displayHeight =
        VIEW_HEIGHT * scale;

    canvas.style.width =
        `${displayWidth}px`;

    canvas.style.height =
        `${displayHeight}px`;
}

window.addEventListener(
    "resize",
    resizeGame
);

resizeGame();

// ==================================================
// INPUT
// ==================================================

const keys = {};

const input = {
    x: 0,
    y: 0
};

let joystickActive = false;

window.addEventListener("keydown", (event) => {

    keys[event.key.toLowerCase()] = true;

});

window.addEventListener("keyup", (event) => {

    keys[event.key.toLowerCase()] = false;

});

// ==================================================
// KEYBOARD INPUT
// ==================================================

function updateKeyboardInput() {

    let x = 0;
    let y = 0;

    if (keys["a"] || keys["arrowleft"]) {
        x -= 1;
    }

    if (keys["d"] || keys["arrowright"]) {
        x += 1;
    }

    if (keys["w"] || keys["arrowup"]) {
        y -= 1;
    }

    if (keys["s"] || keys["arrowdown"]) {
        y += 1;
    }

    if (x !== 0 || y !== 0) {

        const length =
            Math.sqrt(x * x + y * y);

        input.x = x / length;
        input.y = y / length;

    } else if (!joystickActive) {

        input.x = 0;
        input.y = 0;
    }
}

// ==================================================
// MOBILE JOYSTICK
// ==================================================

const joystickRadius = 60;

function updateJoystick(clientX, clientY) {

    const rect =
        joystick.getBoundingClientRect();

    const centerX =
       
