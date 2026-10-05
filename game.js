const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game size
const GAME_WIDTH = 900;
const GAME_HEIGHT = 600;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// =========================
// INPUT
// =========================

const keys = {};

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
// UPDATE
// =========================

function update() {

    // Keyboard movement
    if (keys["w"] || keys["arrowup"]) {
        player.y -= player.speed;
    }

    if (keys["s"] || keys["arrowdown"]) {
        player.y += player.speed;
    }

    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
    }

    // Keep player inside the map
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
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Map border
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

    // Temporary label
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.fillText("Deadline Dash - V0.1", 20, 35);
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