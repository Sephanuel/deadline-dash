const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystick-knob");

// ==================================================
// GAME SETTINGS
// ==================================================

// Base gameplay resolution.
// This controls the actual gameplay scale.
const BASE_WIDTH = 900;
const BASE_HEIGHT = 600;

// Larger world than the visible screen.
const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;

// Camera zoom.
// 1 = normal gameplay scale.
const CAMERA_ZOOM = 1;

// ==================================================
// CANVAS
// ==================================================

canvas.width = BASE_WIDTH;
canvas.height = BASE_HEIGHT;

// ==================================================
// INPUT
// ==================================================

const keys = {};

const input = {
    x: 0,
    y: 0
};

let joystickActive = false;

// Keyboard

window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

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

    width: BASE_WIDTH,
    height: BASE_HEIGHT
};

// ==================================================
// RESPONSIVE CAMERA
// ==================================================

function updateCameraSize() {

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Keep gameplay scale consistent.
    const screenRatio =
        screenWidth / screenHeight;

    const baseRatio =
        BASE_WIDTH / BASE_HEIGHT;

    if (screenRatio > baseRatio) {

        // Wider screen.
        // Increase horizontal view without
        // changing vertical gameplay scale.

        camera.height = BASE_HEIGHT;

        camera.width =
            BASE_HEIGHT * screenRatio;

    } else {

        // Taller/narrower screen.
        // Increase vertical view without
        // changing horizontal gameplay scale.

        camera.width = BASE_WIDTH;

        camera.height =
            BASE_WIDTH / screenRatio;
    }

    // Prevent camera from becoming
    // larger than the entire world.

    camera.width = Math.min(
        camera.width,
        WORLD_WIDTH
    );

    camera.height = Math.min(
        camera.height,
        WORLD_HEIGHT
    );
}

// Update when screen size changes.

window.addEventListener(
    "resize",
    updateCameraSize
);

updateCameraSize();

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
        rect.left + rect.width / 2;

    const centerY =
        rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;

    const distance =
        Math.sqrt(dx * dx + dy * dy);

    if (distance > joystickRadius) {

        dx =
            (dx / distance) *
            joystickRadius;

        dy =
            (dy / distance) *
            joystickRadius;
    }

    joystickKnob.style.transform =
        `translate(
            calc(-50% + ${dx}px),
            calc(-50% + ${dy}px)
        )`;

    input.x =
        dx / joystickRadius;

    input.y =
        dy / joystickRadius;
}

function resetJoystick() {

    joystickActive = false;

    input.x = 0;
    input.y = 0;

    joystickKnob.style.transform =
        "translate(-50%, -50%)";
}

joystick.addEventListener(
    "pointerdown",
    (event) => {

        joystickActive = true;

        joystick.setPointerCapture(
            event.pointerId
        );

        updateJoystick(
            event.clientX,
            event.clientY
        );
    }
);

joystick.addEventListener(
    "pointermove",
    (event) => {

        if (!joystickActive) {
            return;
        }

        updateJoystick(
            event.clientX,
            event.clientY
        );
    }
);

joystick.addEventListener(
    "pointerup",
    resetJoystick
);

joystick.addEventListener(
    "pointercancel",
    resetJoystick
);

// ==================================================
// PLAYER UPDATE
// ==================================================

function updatePlayer() {

    updateKeyboardInput();

    player.x +=
        input.x * player.speed;

    player.y +=
        input.y * player.speed;

    // World boundaries

    player.x = Math.max(
        0,
        Math.min(
            player.x,
            WORLD_WIDTH - player.width
        )
    );

    player.y = Math.max(
        0,
        Math.min(
            player.y,
            WORLD_HEIGHT - player.height
        )
    );
}

// ==================================================
// CAMERA FOLLOW
// ==================================================

function updateCamera() {

    camera.x =
        player.x +
        player.width / 2 -
        camera.width / 2;

    camera.y =
        player.y +
        player.height / 2 -
        camera.height / 2;

    // Keep camera inside world.

    camera.x = Math.max(
        0,
        Math.min(
            camera.x,
            WORLD_WIDTH - camera.width
        )
    );

    camera.y = Math.max(
        0,
        Math.min(
            camera.y,
            WORLD_HEIGHT - camera.height
        )
    );
}

// ==================================================
// DRAW WORLD
// ==================================================

function drawWorld() {

    ctx.fillStyle = "#20242b";

    ctx.fillRect(
        0,
        0,
        BASE_WIDTH,
        BASE_HEIGHT
    );

    // Grid

    const gridSize = 100;

    ctx.strokeStyle =
        "rgba(255,255,255,0.08)";

    ctx.lineWidth = 1;

    const startX =
        Math.floor(camera.x / gridSize) *
        gridSize;

    const startY =
        Math.floor(camera.y / gridSize) *
        gridSize;

    for (
        let x = startX;
        x < camera.x + camera.width;
        x += gridSize
    ) {

        const screenX =
            x - camera.x;

        ctx.beginPath();

        ctx.moveTo(
            screenX,
            0
        );

        ctx.lineTo(
            screenX,
            BASE_HEIGHT
        );

        ctx.stroke();
    }

    for (
        let y = startY;
        y < camera.y + camera.height;
        y += gridSize
    ) {

        const screenY =
            y - camera.y;

        ctx.beginPath();

        ctx.moveTo(
            0,
            screenY
        );

        ctx.lineTo(
            BASE_WIDTH,
            screenY
        );

        ctx.stroke();
    }
}

// ==================================================
// DRAW PLAYER
// ==================================================

function drawPlayer() {

    const screenX =
        player.x - camera.x;

    const screenY =
        player.y - camera.y;

    ctx.fillStyle = "#4da6ff";

    ctx.fillRect(
        screenX,
        screenY,
        player.width,
        player.height
    );
}

// ==================================================
// DRAW UI
// ==================================================

function drawUI() {

    ctx.fillStyle = "#ffffff";

    ctx.font = "20px Arial";

    ctx.fillText(
        "Deadline Dash - V0.1",
        20,
        35
    );
}

// ==================================================
// RENDER
// ==================================================

function render() {

    /*
        Scale the base game to the available
        screen while preserving its aspect ratio.
    */

    const screenWidth =
        window.innerWidth;

    const screenHeight =
        window.innerHeight;

    const scale =
        Math.min(
            screenWidth / BASE_WIDTH,
            screenHeight / BASE_HEIGHT
        );

    const displayWidth =
        BASE_WIDTH * scale;

    const displayHeight =
        BASE_HEIGHT * scale;

    const offsetX =
        (screenWidth - displayWidth) / 2;

    const offsetY =
        (screenHeight - displayHeight) / 2;

    // Clear actual screen

    ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Draw game

    drawWorld();
    drawPlayer();
    drawUI();

    // CSS handles final screen scaling.
}

// ==================================================
// GAME LOOP
// ==================================================

function gameLoop() {

    updatePlayer();

    updateCamera();

    render();

    requestAnimationFrame(
        gameLoop
    );
}

gameLoop();
