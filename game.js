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
// ASSIGNMENT
// ==================================================

const assignment = {
    subject: "C Programming",
    task: "Find the syntax error",
    status: "Not Started",
    completed: false
};

// ==================================================
// ASSIGNMENT OBJECT
// ==================================================

const assignmentObject = {
    x: 500,
    y: 400,

    width: 40,
    height: 40,

    collected: false
};

// ==================================================
// WORKSTATION
// ==================================================

const workstation = {
    x: 900,
    y: 500,

    width: 80,
    height: 60,

    active: false
};

// ==================================================
// DISPLAY
// ==================================================

function resizeGame() {

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    // Use the mobile visual viewport when available.
    if (window.visualViewport) {
        screenWidth = window.visualViewport.width;
        screenHeight = window.visualViewport.height;
    }

    // Always fit the COMPLETE 900 × 600 game
    // inside the available screen.
    const scale = Math.min(
        screenWidth / VIEW_WIDTH,
        screenHeight / VIEW_HEIGHT
    );

    canvas.style.width =
        `${VIEW_WIDTH * scale}px`;

    canvas.style.height =
        `${VIEW_HEIGHT * scale}px`;
}

window.addEventListener(
    "resize",
    resizeGame
);

resizeGame();

if (window.visualViewport) {

    window.visualViewport.addEventListener(
        "resize",
        resizeGame
    );
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
// ASSIGNMENT PICKUP
// ==================================================

function checkAssignmentPickup() {

    if (assignmentObject.collected) {
        return;
    }

    const touching =
        player.x <
            assignmentObject.x +
            assignmentObject.width &&

        player.x +
            player.width >
            assignmentObject.x &&

        player.y <
            assignmentObject.y +
            assignmentObject.height &&

        player.y +
            player.height >
            assignmentObject.y;

    if (touching) {

        assignmentObject.collected = true;

        assignment.status = "Started";

        document.getElementById(
            "assignment-status"
        ).textContent =
            "Status: Started";
    }
}

// ==================================================
// WORKSTATION INTERACTION
// ==================================================

function checkWorkstationInteraction() {

    if (!assignmentObject.collected) {
        return;
    }

    if (assignment.completed) {
        return;
    }

    const touching =
        player.x <
            workstation.x + workstation.width &&

        player.x + player.width >
            workstation.x &&

        player.y <
            workstation.y + workstation.height &&

        player.y + player.height >
            workstation.y;

    if (touching) {

        workstation.active = true;

        document.getElementById(
            "assignment-status"
        ).textContent =
            "Status: Ready at workstation";
    }
}

// ==================================================
// PLAYER UPDATE
// ==================================================

function updatePlayer() {

    updateKeyboardInput();

    let nextX =
        player.x +
        input.x * player.speed;

    let nextY =
        player.y +
        input.y * player.speed;

    // WORLD BOUNDARIES

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

    const desiredX =
        player.x +
        player.width / 2 -
        camera.width / 2;

    const desiredY =
        player.y +
        player.height / 2 -
        camera.height / 2;

    const maxCameraX =
        WORLD_WIDTH - camera.width;

    const maxCameraY =
        WORLD_HEIGHT - camera.height;

    camera.x = Math.max(
        0,
        Math.min(
            desiredX,
            maxCameraX
        )
    );

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
// DRAW ASSIGNMENT
// ==================================================

function drawAssignment() {

    if (assignmentObject.collected) {
        return;
    }

    const screenX =
        assignmentObject.x - camera.x;

    const screenY =
        assignmentObject.y - camera.y;

    ctx.fillStyle = "#ffd54a";

    ctx.fillRect(
        screenX,
        screenY,
        assignmentObject.width,
        assignmentObject.height
    );

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        screenX,
        screenY,
        assignmentObject.width,
        assignmentObject.height
    );
}

// ==================================================
// DRAW WORKSTATION
// ==================================================

function drawWorkstation() {

    const screenX =
        workstation.x - camera.x;

    const screenY =
        workstation.y - camera.y;

    ctx.fillStyle = "#6b7280";

    ctx.fillRect(
        screenX,
        screenY,
        workstation.width,
        workstation.height
    );

    ctx.fillStyle = "#38bdf8";

    ctx.fillRect(
        screenX + 10,
        screenY + 8,
        workstation.width - 20,
        30
    );

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        screenX,
        screenY,
        workstation.width,
        workstation.height
    );

    ctx.fillStyle = "#ffffff";

    ctx.font = "14px Arial";

    ctx.fillText(
        "WORK",
        screenX + 20,
        screenY + 53
    );
}

// ==================================================
// OBJECTIVE ARROW
// ==================================================

function drawObjectiveArrow() {

    if (assignmentObject.collected) {
        return;
    }

    const playerCenterX =
        player.x +
        player.width / 2;

    const playerCenterY =
        player.y +
        player.height / 2;

    const objectiveCenterX =
        assignmentObject.x +
        assignmentObject.width / 2;

    const objectiveCenterY =
        assignmentObject.y +
        assignmentObject.height / 2;

    const dx =
        objectiveCenterX -
        playerCenterX;

    const dy =
        objectiveCenterY -
        playerCenterY;

    const angle =
        Math.atan2(dy, dx);

    const arrowDistance = 55;

    const screenPlayerX =
        playerCenterX -
        camera.x;

    const screenPlayerY =
        playerCenterY -
        camera.y;

    const arrowX =
        screenPlayerX +
        Math.cos(angle) *
        arrowDistance;

    const arrowY =
        screenPlayerY +
        Math.sin(angle) *
        arrowDistance;

    ctx.save();

    ctx.translate(
        arrowX,
        arrowY
    );

    ctx.rotate(angle);

    ctx.fillStyle = "#ffd54a";

    ctx.beginPath();

    ctx.moveTo(
        18,
        0
    );

    ctx.lineTo(
        -10,
        -11
    );

    ctx.lineTo(
        -5,
        0
    );

        ctx.lineTo(
        -10,
        11
    );

    ctx.closePath();

    ctx.fill();

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 2;

    ctx.stroke();

    ctx.restore();
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

    drawAssignment();

    drawWorkstation();

    drawPlayer();

    drawObjectiveArrow();

    drawUI();
}

// ==================================================
// GAME LOOP
// ==================================================

function gameLoop() {

    updatePlayer();

    checkAssignmentPickup();

    checkWorkstation();

    updateCamera();

    draw();

    requestAnimationFrame(
        gameLoop
    );
}

gameLoop();
