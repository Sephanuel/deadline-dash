const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystick-knob");

// =========================
// GAME SETTINGS
// =========================

const GAME_WIDTH = 900;
const GAME_HEIGHT = 600;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// =========================
// INPUT
// =========================

const keys = {};

const input = {
    x: 0,
    y: 0
};

// Keyboard
window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// =========================
// PLAYER
// =========================

const player = {
    x: 100,
    y: 100,

    width: 32,
    height: 32,

    speed: 4
};

// =========================
// KEYBOARD INPUT
// =========================

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

    // Normalize diagonal movement
    if (x !== 0 || y !== 0) {

        const length = Math.sqrt(x * x + y * y);

        input.x = x / length;
        input.y = y / length;

    } else if (!joystickActive) {

        input.x = 0;
        input.y = 0;
    }
}

// =========================
// MOBILE JOYSTICK
// =========================

let joystickActive = false;

const joystickRadius = 60;

function updateJoystick(clientX, clientY) {

    const rect = joystick.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > joystickRadius) {

        dx = (dx / distance) * joystickRadius;
        dy = (dy / distance) * joystickRadius;
    }

    joystickKnob.style.transform =
        `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

    input.x = dx / joystickRadius;
    input.y = dy / joystickRadius;
}

function resetJoystick() {

    joystickActive = false;

    input.x = 0;
    input.y = 0;

    joystickKnob.style.transform =
        "translate(-50%, -50%)";
}

joystick.addEventListener("pointerdown", (event) => {

    joystickActive = true;

    joystick.setPointerCapture(event.pointerId);

    updateJoystick(event.clientX, event.clientY);
});

joystick.addEventListener("pointermove", (event) => {

    if (!joystickActive) {
        return;
    }

    updateJoystick(event.clientX, event.clientY);
});

joystick.addEventListener("pointerup", resetJoystick);
joystick.addEventListener("pointercancel", resetJoystick);

// =========================
// UPDATE
// =========================

function update() {

    updateKeyboardInput();

    player.x += input.x * player.speed;
    player.y += input.y * player.speed;

    // Keep player inside map

    player.x = Math.max(
        0,
        Math.min(player.x, GAME_WIDTH - player.width)
    );

    player.y = Math.max(
        0,
        Math.min(player.y, GAME_HEIGHT - player.height)
    );
}

// =========================
// DRAW
// =========================

function draw() {

    // Background
    ctx.fillStyle = "#20242b";

    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );

    // Border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;

    ctx.strokeRect(
        2,
        2,
        GAME_WIDTH - 4,
        GAME_HEIGHT - 4
    );

    // Player
    ctx.fillStyle = "#4da6ff";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";

    ctx.fillText(
        "Deadline Dash - V0.1",
        20,
        35
    );
}

// =========================
// GAME LOOP
// =========================

function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();