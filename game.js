const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystick-knob");

// ==================================================
// GAME SETTINGS
// ==================================================

const VIEW_WIDTH = 900;
const VIEW_HEIGHT = 600;

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;

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
// DISPLAY
// ==================================================

function resizeGame() {

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Keep the 900x600 gameplay viewport fixed.
    // Scale it to fit completely inside the mobile screen.
    const scale = Math.min(
        screenWidth / VIEW_WIDTH,
        screenHeight / VIEW_HEIGHT
    );

    canvas.style.width =
        `${VIEW_WIDTH * scale}px`;

    canvas.style.height =
        `${VIEW_HEIGHT * scale}px`;
}
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

    let dx =
        clientX - centerX;

    let dy =
        clientY - centerY;

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

    /*
     * Calculate the requested movement first.
     */

    let nextX =
        player.x +
        input.x * player.speed;

    let nextY =
        player.y +
        input.y * player.speed;

    /*
     * WORLD BOUNDARIES
     *
     * The player can never leave the world.
     */

    nextX = Math.max(
        0,
        nextX
    );

    nextX = Math.min(
        WORLD_WIDTH - player.width,
        nextX
    );

    nextY = Math.max(
        0,
        nextY
    );

    nextY = Math.min(
        WORLD_HEIGHT - player.height,
        nextY
    );

    player.x = nextX;
    player.y = nextY;
}

// ==================================================
// CAMERA UPDATE
// ==================================================

function updateCamera() {

    /*
     * Desired position:
     * keep the player in the center.
     */

    const desiredX =
        player.x +
        player.width / 2 -
        camera.width / 2;

    const desiredY =
        player.y +
        player.height / 2 -
        camera.height / 2;

    /*
     * Maximum camera positions.
     *
     * At these positions the camera's edge
     * exactly touches the world's edge.
     */

    const maxCameraX =
        WORLD_WIDTH - camera.width;

    const maxCameraY =
        WORLD_HEIGHT - camera.height;

    /*
     * HORIZONTAL
     *
     * Follow player normally.
     * Stop at left/right world borders.
     */

    camera.x = Math.max(
        0,
        Math.min(
            desiredX,
            maxCameraX
        )
    );

    /*
     * VERTICAL
     *
     * Follow player normally.
     * Stop at top/bottom world borders.
     */

    camera.y = Math.max(
        0,
        Math.min(
            desiredY,
            maxCameraY
        )
    );
}

// ==================================================
// DRAW WORLD
// ==================================================

function drawWorld() {

    // Clear background

    ctx.fillStyle = "#20242b";

    ctx.fillRect(
        0,
        0,
        VIEW_WIDTH,
        VIEW_HEIGHT
    );

    // ==================================================
    // GRID
    // ==================================================

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

    // Vertical lines

    for (
        let x = startX;
        x <= camera.x + camera.width;
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
            VIEW_HEIGHT
        );

        ctx.stroke();
    }

    // Horizontal lines

    for (
        let y = startY;
        y <= camera.y + camera.height;
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
            VIEW_WIDTH,
            screenY
        );

        ctx.stroke();
    }

    // ==================================================
    // WORLD BORDER
    // ==================================================

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 5;

    ctx.strokeRect(
        -camera.x,
        -camera.y,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );
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

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 2;

    ctx.strokeRect(
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
// DRAW
// ==================================================

function draw() {

    drawWorld();

    drawPlayer();

    drawUI();
}

// ==================================================
// GAME LOOP
// ==================================================

function gameLoop() {

    updatePlayer();

    updateCamera();

    draw();

    requestAnimationFrame(
        gameLoop
    );
}

gameLoop();
