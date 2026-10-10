// ==================================================
// CANVAS SETUP
// ==================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 900;
const GAME_HEIGHT = 600;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;


// ==================================================
// WORLD
// ==================================================

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;


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
    width: GAME_WIDTH,
    height: GAME_HEIGHT
};


// ==================================================
// INPUT
// ==================================================

const input = {
    x: 0,
    y: 0
};

const keys = {};

// ==================================================
// MOBILE JOYSTICK
// ==================================================

const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystick-knob");

let joystickActive = false;

if (joystick && joystickKnob) {

    function updateJoystick(touch) {

        const rect = joystick.getBoundingClientRect();

        const centerX =
            rect.left + rect.width / 2;

        const centerY =
            rect.top + rect.height / 2;

        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;

        const maxDistance =
            rect.width / 2 - joystickKnob.offsetWidth / 2;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (distance > maxDistance) {

            dx =
                (dx / distance) *
                maxDistance;

            dy =
                (dy / distance) *
                maxDistance;
        }

        joystickKnob.style.transform =
            `translate(${dx}px, ${dy}px)`;

        input.x = dx / maxDistance;
        input.y = dy / maxDistance;
    }


    joystick.addEventListener(
        "touchstart",
        function (event) {

            event.preventDefault();

            joystickActive = true;

            updateJoystick(
                event.touches[0]
            );
        },
        { passive: false }
    );


    joystick.addEventListener(
        "touchmove",
        function (event) {

            if (!joystickActive) {
                return;
            }

            event.preventDefault();

            updateJoystick(
                event.touches[0]
            );
        },
        { passive: false }
    );


    joystick.addEventListener(
        "touchend",
        function (event) {

            event.preventDefault();

            joystickActive = false;

            input.x = 0;
            input.y = 0;

            joystickKnob.style.transform =
                "translate(0px, 0px)";
        },
        { passive: false }
    );
}

// ==================================================
// KEYBOARD INPUT
// ==================================================

window.addEventListener("keydown", function (event) {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", function (event) {
    keys[event.key.toLowerCase()] = false;
});


function updateKeyboardInput() {
    if (joystickActive) {
        return;
    }

    input.x = 0;
    input.y = 0;

    if (keys["w"] || keys["arrowup"]) {
        input.y = -1;
    }

    if (keys["s"] || keys["arrowdown"]) {
        input.y = 1;
    }

    if (keys["a"] || keys["arrowleft"]) {
        input.x = -1;
    }

    if (keys["d"] || keys["arrowright"]) {
        input.x = 1;
    }
}
// ==================================================
// C ASSIGNMENT QUESTION POOL
// ==================================================

const cAssignments = [

    {
        type: "syntax",
        task: "Find the syntax error",
        code: `#include <stdio.h>

int main() {
    int x = 10
    printf("%d", x);
    return 0;
}`,
        question: "Which line contains the syntax error?",
        answers: [
            "Line 1",
            "Line 2",
            "Line 3",
            "Line 4",
            "Line 5"
        ],
        correctAnswer: 3
    },


    {
        type: "syntax",
        task: "Find the syntax error",
        code: `#include <stdio.h>

int main() {
    int x = 5;
    printf("%d", x)
    return 0;
}`,
        question: "Which line contains the syntax error?",
        answers: [
            "Line 1",
            "Line 2",
            "Line 3",
            "Line 4",
            "Line 5"
        ],
        correctAnswer: 4
    },


    {
        type: "output",
        task: "Predict the output",
        code: `#include <stdio.h>

int main() {
    int x = 5;
    printf("%d", x + 2);
    return 0;
}`,
        question: "What will this program print?",
        answers: [
            "5",
            "7",
            "2",
            "10"
        ],
        correctAnswer: 2
    },


    {
        type: "output",
        task: "Predict the output",
        code: `#include <stdio.h>

int main() {
    int a = 10;
    int b = 3;
    printf("%d", a - b);
    return 0;
}`,
        question: "What will this program print?",
        answers: [
            "7",
            "13",
            "30",
            "3"
        ],
        correctAnswer: 1
    },


    {
        type: "logic",
        task: "Find the logic error",
        code: `int age = 20;

if (age < 18) {
    printf("Adult");
} else {
    printf("Minor");
}`,
        question: "What is wrong with this logic?",
        answers: [
            "Nothing",
            "The conditions are reversed",
            "age must be float",
            "printf is invalid"
        ],
        correctAnswer: 2
    }

];


// ==================================================
// CURRENT ASSIGNMENT
// ==================================================

const assignment = {
    subject: "C Programming",
    task: "Find the syntax error",
    status: "Not Started",
    completed: false,
    playerAnswerCorrect: false
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
// HINT SHEET COLLECTIBLE
// ==================================================

const hintSheet = {
    x: 620,
    y: 450,
    width: 30,
    height: 30,
    collected: false,
    used: false
};

// ==================================================
// CURRENT C QUESTION
// ==================================================

let currentCAssignment = null;
let lastCAssignmentIndex = -1;

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
// SUBMISSION DESK
// ==================================================

const submissionDesk = {
    x: 1200,
    y: 500,
    width: 90,
    height: 60,
    active: false
};


// ==================================================
// CAMPUS MAP OBSTACLES
// ==================================================

const obstacles = [

    // -------- CENTRAL BUILDING --------

    {
        type: "building",
        x: 650,
        y: 200,
        width: 300,
        height: 180
    },


    // -------- LEFT BENCH --------

    {
        type: "bench",
        x: 250,
        y: 600,
        width: 160,
        height: 40
    },


    // -------- RIGHT BENCH --------

    {
        type: "bench",
        x: 1250,
        y: 350,
        width: 160,
        height: 40
    },


    // -------- BOOKSHELF --------

    {
        type: "bookshelf",
        x: 450,
        y: 850,
        width: 60,
        height: 180
    },


    // -------- CLASSROOM BLOCK --------

    {
        type: "building",
        x: 1400,
        y: 650,
        width: 300,
        height: 180
    },


    // -------- SMALL WALL --------

    {
        type: "wall",
        x: 900,
        y: 950,
        width: 250,
        height: 35
    }

];

// ==================================================
// MINI GAME
// ==================================================

let miniGameOpen = false;

// ==================================================
// DEADLINE TIMER
// ==================================================

const DEADLINE_TIME = 90;

let timeLeft = DEADLINE_TIME;

let timerStarted = false;

let timerInterval = null;

// ==================================================
// ASSIGNMENT PICKUP
// ==================================================

function checkAssignmentPickup() {

    if (assignmentObject.collected) {
        return;
    }

    const touching =
        player.x < assignmentObject.x + assignmentObject.width &&
        player.x + player.width > assignmentObject.x &&
        player.y < assignmentObject.y + assignmentObject.height &&
        player.y + player.height > assignmentObject.y;

    if (touching) {

        assignmentObject.collected = true;

        assignment.status = "Started";

        document.getElementById(
            "assignment-status"
        ).textContent = "Status: Started";

        startDeadlineTimer();
    }
}

// ==================================================
// HINT SHEET PICKUP
// ==================================================

function checkHintSheetPickup() {
    if (!timerStarted || timerInterval === null) return;
    if (hintSheet.collected || assignment.completed) return;

    const touching =
        player.x < hintSheet.x + hintSheet.width &&
        player.x + player.width > hintSheet.x &&
        player.y < hintSheet.y + hintSheet.height &&
        player.y + player.height > hintSheet.y;

    if (touching) {
        hintSheet.collected = true;
        console.log("Hint sheet collected!");
    }
}

// ==================================================
// START DEADLINE TIMER
// ==================================================

function startDeadlineTimer() {

    if (timerStarted) {
        return;
    }

    timerStarted = true;

    timerInterval = setInterval(function () {

        timeLeft--;

        updateTimerDisplay();

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            timerInterval = null;

            handleDeadlineMissed();
        }

    }, 1000);
}

// ==================================================
// DEADLINE MISSED
// ==================================================

function handleDeadlineMissed() {
    timeLeft = 0;
    updateTimerDisplay();

    document.getElementById("lose-title").textContent =
        "DEADLINE MISSED!";

    document.getElementById("lose-message").textContent =
        "You ran out of time.";

    document.getElementById("lose-screen").style.display = "flex";
}

// ==================================================
// UPDATE TIMER DISPLAY
// ==================================================

function updateTimerDisplay() {

    const timer =
        document.getElementById("deadline-timer");

    if (!timer) {
        return;
    }


    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    timer.textContent =
        "Time Left: " +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");


    // Remove previous urgency states

    timer.classList.remove(
        "timer-warning",
        "timer-critical"
    );


    // Critical: 10 seconds or less

    if (timeLeft <= 10) {

        timer.classList.add(
            "timer-critical"
        );

    }

    // Warning: 20 seconds or less

    else if (timeLeft <= 20) {

        timer.classList.add(
            "timer-warning"
        );

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

    if (miniGameOpen) {
        return;
    }

    const touching =
        player.x < workstation.x + workstation.width &&
        player.x + player.width > workstation.x &&
        player.y < workstation.y + workstation.height &&
        player.y + player.height > workstation.y;

    if (touching) {

        workstation.active = true;

        assignment.status = "Working";

        document.getElementById(
            "assignment-status"
        ).textContent = "Status: Working";

        openMiniGame();
    }
}

// ==================================================
// SUBMISSION DESK INTERACTION
// ==================================================

function checkSubmissionInteraction() {
    if (!assignment.completed) return;

    const touching =
        player.x < submissionDesk.x + submissionDesk.width &&
        player.x + player.width > submissionDesk.x &&
        player.y < submissionDesk.y + submissionDesk.height &&
        player.y + player.height > submissionDesk.y;

    if (touching) {
        submissionDesk.active = true;

        if (assignment.playerAnswerCorrect) {
            assignment.status = "Submitted";

            document.getElementById("assignment-status").textContent =
                "Status: Submitted";

            showWinScreen();

        } else {
            assignment.status = "Wrong Answer";

            document.getElementById("assignment-status").textContent =
                "Status: Wrong Answer";

            document.getElementById("lose-title").textContent =
                "WRONG ANSWER!";

            document.getElementById("lose-message").textContent =
                "Your answer was incorrect. The assignment cannot be submitted.";

            document.getElementById("lose-screen").style.display = "flex";
        }
    }
}

// ==================================================
// WIN SCREEN
// ==================================================

function showWinScreen() {

    // Stop deadline timer
    if (timerInterval !== null) {

        clearInterval(timerInterval);

        timerInterval = null;
    }

    document.getElementById(
        "win-screen"
    ).style.display = "flex";
}

// ==================================================
// RESTART GAME
// ==================================================

function restartGame() {

    // Reset player

    player.x = 300;
    player.y = 300;

    
    // Reset timer

if (timerInterval !== null) {

    clearInterval(timerInterval);

    timerInterval = null;
}

timeLeft = DEADLINE_TIME;

timerStarted = false;

updateTimerDisplay();

    
    // Reset assignment

    assignment.status = "Not Started";

    assignment.completed = false;

    assignment.playerAnswerCorrect = false;


    // Reset assignment object

    assignmentObject.collected = false;

    hintSheet.collected = false;
hintSheet.used = false;

document.getElementById("use-hint-button").style.display = "none";
document.getElementById("hint-message").style.display = "none";


    // Reset workstation

    workstation.active = false;


    // Reset submission desk

    submissionDesk.active = false;


    // Reset mini-game

    miniGameOpen = false;
    currentCAssignment = null;


    // Hide screens

    document.getElementById(
        "mini-game"
    ).style.display = "none";


    document.getElementById(
        "win-screen"
    ).style.display = "none";


    document.getElementById(
    "lose-screen"
).style.display = "none";


    // Reset assignment UI

    document.getElementById(
        "assignment-status"
    ).textContent = "Status: Not Started";


    // Reset camera

    camera.x = 0;
    camera.y = 0;

}

// ==================================================
// OPEN MINI GAME
// ==================================================

function openMiniGame() {

    miniGameOpen = true;


    // Pick a random C assignment

    let randomIndex;

do {

    randomIndex =
        Math.floor(
            Math.random() *
            cAssignments.length
        );

} while (
    randomIndex === lastCAssignmentIndex &&
    cAssignments.length > 1
);

lastCAssignmentIndex = randomIndex;

currentCAssignment =
    cAssignments[randomIndex];


    // Update assignment information

    assignment.task =
        currentCAssignment.task;


    document.getElementById(
        "assignment-task"
    ).textContent =
        currentCAssignment.task;


    // Update code

    document.getElementById(
        "code-question"
    ).textContent =
        currentCAssignment.code;


    // Update question

    document.querySelector(
        ".mini-game-question"
    ).textContent =
        currentCAssignment.question;


    // Update answer buttons

    const buttons =
        document.querySelectorAll(
            "#answer-buttons button"
        );


    buttons.forEach(function (button, index) {

        if (
            currentCAssignment.answers[index]
        ) {

            button.style.display = "block";

            button.textContent =
                currentCAssignment.answers[index];

        } else {

            button.style.display = "none";

        }

    });


    // Clear previous result

    document.getElementById(
        "mini-game-result"
    ).textContent = "";


    // Show mini-game

    document.getElementById(
        "mini-game"
    ).style.display = "flex";
}



// ==================================================// Configure the hint button for this question.
const hintButton = document.getElementById("use-hint-button");
const hintMessage = document.getElementById("hint-message");

hintButton.style.display =
    hintSheet.collected && !hintSheet.used ? "block" : "none";

hintMessage.style.display = "none";
hintMessage.textContent = "";

hintButton.onclick = function () {
    if (!hintSheet.collected || hintSheet.used || !currentCAssignment) {
        return;
    }

    const hints = {
        syntax: "Check each statement for missing punctuation, especially semicolons.",
        output: "Evaluate the expression inside printf before deciding what gets printed.",
        logic: "Trace the condition carefully and compare it with the intended outcome."
    };

    hintMessage.textContent =
        hints[currentCAssignment.type] ||
        "Read the code one statement at a time and trace what happens.";

    hintMessage.style.display = "block";
    hintSheet.used = true;
    hintButton.style.display = "none";
};

// CHECK C ANSWER
// ==================================================

function checkAnswer(answer) {
    const result = document.getElementById("mini-game-result");

    if (!currentCAssignment) return;

    assignment.completed = true;

    if (answer === currentCAssignment.correctAnswer) {
        assignment.playerAnswerCorrect = true;
        result.textContent = "Answer recorded.";
    } else {
        assignment.playerAnswerCorrect = false;
        result.textContent = "Answer recorded.";
    }

    setTimeout(function () {
        document.getElementById("mini-game").style.display = "none";
        miniGameOpen = false;
    }, 500);
}

// ==================================================
// PLAYER UPDATE
// ==================================================

function updatePlayer() {
    if (miniGameOpen) {
        return;
    }

    updateKeyboardInput();

    let moveX = input.x;
    let moveY = input.y;

    // Prevent diagonal movement from being faster
    const length = Math.sqrt(
        moveX * moveX +
        moveY * moveY
    );

    if (length > 1) {
        moveX /= length;
        moveY /= length;
    }

    let nextX = player.x + moveX * player.speed;
    let nextY = player.y + moveY * player.speed;

    // World boundaries
    nextX = Math.max(0, Math.min(WORLD_WIDTH - player.width, nextX));
    nextY = Math.max(0, Math.min(WORLD_HEIGHT - player.height, nextY));

    // X collision
    let blockedX = false;

    for (const obstacle of obstacles) {
        const collision =
            nextX < obstacle.x + obstacle.width &&
            nextX + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y;

        if (collision) {
            blockedX = true;
            break;
        }
    }

    if (!blockedX) {
        player.x = nextX;
    }

    // Y collision
    let blockedY = false;

    for (const obstacle of obstacles) {
        const collision =
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            nextY < obstacle.y + obstacle.height &&
            nextY + player.height > obstacle.y;

        if (collision) {
            blockedY = true;
            break;
        }
    }

    if (!blockedY) {
        player.y = nextY;
    }
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
        WORLD_WIDTH -
        camera.width;

    const maxCameraY =
        WORLD_HEIGHT -
        camera.height;


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
    // Grass base
    ctx.fillStyle = "#4f8d45";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Subtle grass texture, positioned in world space so it moves with the camera.
    const tile = 48;
    const startX = -((camera.x % tile) + tile) % tile;
    const startY = -((camera.y % tile) + tile) % tile;

    for (let y = startY; y < GAME_HEIGHT; y += tile) {
        for (let x = startX; x < GAME_WIDTH; x += tile) {
            const worldX = x + camera.x;
            const worldY = y + camera.y;
            const seed = Math.abs(Math.floor(worldX * 17 + worldY * 31)) % 7;
            ctx.fillStyle = seed < 3 ? "rgba(25, 85, 38, 0.10)" : "rgba(215, 240, 160, 0.07)";
            ctx.fillRect(x + (seed * 3), y + ((seed * 5) % 19), 13, 3);
        }
    }

    // Small campus courtyard lawn near the central building.
    ctx.fillStyle = "#5a994b";
    ctx.fillRect(520 - camera.x, 170 - camera.y, 500, 285);

    // Main paved pedestrian paths. These are visual only; movement/collision is unchanged.
    const pathRects = [
        { x: 0, y: 465, w: WORLD_WIDTH, h: 82 },       // main east-west path
        { x: 1010, y: 0, w: 82, h: WORLD_HEIGHT },     // north-south spine
        { x: 475, y: 385, w: 70, h: 130 },            // assignment pickup branch
        { x: 760, y: 365, w: 70, h: 135 },            // central building entrance
        { x: 1495, y: 805, w: 70, h: 180 },           // classroom entrance
        { x: 1060, y: 875, w: 470, h: 70 },           // lower garden walkway
        { x: 1450, y: 945, w: 82, h: 250 },           // garden connection
        { x: 1810, y: 465, w: 70, h: 320 },           // east campus connection
        { x: 1780, y: 745, w: 360, h: 70 }            // east-side path
    ];

    for (const path of pathRects) {
        const x = path.x - camera.x;
        const y = path.y - camera.y;
        ctx.fillStyle = "#c8bfa4";
        ctx.fillRect(x, y, path.w, path.h);
        ctx.fillStyle = "#e2d9c2";
        ctx.fillRect(x + 5, y + 5, Math.max(0, path.w - 10), Math.max(0, path.h - 10));
        ctx.strokeStyle = "rgba(105, 91, 68, 0.22)";
        ctx.lineWidth = 1;
        if (path.w > path.h) {
            for (let px = x + 24; px < x + path.w; px += 48) {
                ctx.beginPath(); ctx.moveTo(px, y + 7); ctx.lineTo(px, y + path.h - 7); ctx.stroke();
            }
        } else {
            for (let py = y + 24; py < y + path.h; py += 48) {
                ctx.beginPath(); ctx.moveTo(x + 7, py); ctx.lineTo(x + path.w - 7, py); ctx.stroke();
            }
        }
    }

    // Small paved plaza around the student work/submission zone.
    ctx.fillStyle = "#b7ad95";
    ctx.fillRect(830 - camera.x, 445 - camera.y, 505, 125);
    ctx.fillStyle = "#d7cfba";
    ctx.fillRect(838 - camera.x, 453 - camera.y, 489, 109);

    // Repaint the route over the plaza so it reads as one continuous walkway.
    ctx.fillStyle = "#e2d9c2";
    ctx.fillRect(830 - camera.x, 465 - camera.y, 505, 82);
}


// ==================================================
// DECORATIVE CAMPUS TREES (visual only; gameplay collision is unchanged)
// ==================================================

const campusTrees = [
    { x: 110, y: 150 }, { x: 210, y: 250 }, { x: 130, y: 760 },
    { x: 190, y: 980 }, { x: 330, y: 1160 }, { x: 560, y: 1250 },
    { x: 690, y: 1050 }, { x: 760, y: 1200 }, { x: 1180, y: 180 },
    { x: 1320, y: 210 }, { x: 1550, y: 160 }, { x: 1720, y: 250 },
    { x: 1950, y: 180 }, { x: 2150, y: 280 }, { x: 2260, y: 560 },
    { x: 2180, y: 1030 }, { x: 2020, y: 1190 }, { x: 1780, y: 1320 },
    { x: 1240, y: 1240 }, { x: 980, y: 1320 }, { x: 620, y: 700 },
    { x: 1350, y: 520 }, { x: 1680, y: 520 }, { x: 1950, y: 900 }
];

function drawCampusTrees() {
    for (const tree of campusTrees) {
        const x = tree.x - camera.x;
        const y = tree.y - camera.y;
        if (x < -45 || y < -45 || x > GAME_WIDTH + 45 || y > GAME_HEIGHT + 45) continue;

        // Soft ground shadow, trunk, and layered canopy.
        ctx.fillStyle = "rgba(28, 45, 25, 0.25)";
        ctx.beginPath(); ctx.ellipse(x + 4, y + 10, 21, 12, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#765238";
        ctx.fillRect(x - 4, y + 1, 9, 17);
        ctx.fillStyle = "#24633b";
        ctx.beginPath(); ctx.arc(x - 5, y - 3, 17, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#2f7a43";
        ctx.beginPath(); ctx.arc(x + 7, y - 8, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#489653";
        ctx.beginPath(); ctx.arc(x, y - 13, 11, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(20, 75, 39, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y - 5, 20, 0, Math.PI * 2); ctx.stroke();
    }
}

// ==================================================
// DRAW ASSIGNMENT
// ==================================================

function drawAssignment() {

    if (assignmentObject.collected) {
        return;
    }


    const screenX =
        assignmentObject.x -
        camera.x;

    const screenY =
        assignmentObject.y -
        camera.y;


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
// DRAW HINT SHEET
// ==================================================

function drawHintSheet() {
    if (hintSheet.collected) return;

    const screenX = hintSheet.x - camera.x;
    const screenY = hintSheet.y - camera.y;

    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "📄",
        screenX + hintSheet.width / 2,
        screenY + hintSheet.height / 2
    );

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(
        "HINT",
        screenX + hintSheet.width / 2,
        screenY + hintSheet.height + 12
    );

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
}

// ==================================================
// DRAW WORKSTATION
// ==================================================

function drawWorkstation() {

    const screenX =
        workstation.x -
        camera.x;

    const screenY =
        workstation.y -
        camera.y;


    ctx.fillStyle = "#6b7280";


    ctx.fillRect(
        screenX,
        screenY,
        workstation.width,
        workstation.height
    );


    // Monitor

    ctx.fillStyle = "#38bdf8";


    ctx.fillRect(
        screenX + 10,
        screenY + 8,
        workstation.width - 20,
        30
    );


    // Border

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;


    ctx.strokeRect(
        screenX,
        screenY,
        workstation.width,
        workstation.height
    );


    // Label

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";


    ctx.fillText(
        "WORK",
        screenX + 20,
        screenY + 53
    );
}

// ==================================================
// DRAW CAMPUS OBSTACLES
// ==================================================

function drawObstacles() {

    for (const obstacle of obstacles) {

        const screenX =
            obstacle.x - camera.x;

        const screenY =
            obstacle.y - camera.y;


        // ------------------------------------------
        // BUILDING
        // ------------------------------------------

        if (obstacle.type === "building") {
            // Shadow and outer walls give buildings a clear top-down footprint.
            ctx.fillStyle = "rgba(20, 35, 25, 0.22)";
            ctx.fillRect(screenX + 6, screenY + 7, obstacle.width, obstacle.height);
            ctx.fillStyle = "#b7b8ad";
            ctx.fillRect(screenX, screenY, obstacle.width, obstacle.height);
            ctx.fillStyle = "#dedfd3";
            ctx.fillRect(screenX + 7, screenY + 7, obstacle.width - 14, obstacle.height - 14);
            ctx.strokeStyle = "#6e776c";
            ctx.lineWidth = 3;
            ctx.strokeRect(screenX, screenY, obstacle.width, obstacle.height);

            // Windows in neat rows.
            for (let x = screenX + 24; x < screenX + obstacle.width - 30; x += 54) {
                for (let y = screenY + 24; y < screenY + obstacle.height - 38; y += 48) {
                    ctx.fillStyle = "#507f91";
                    ctx.fillRect(x, y, 27, 20);
                    ctx.fillStyle = "#a9d6df";
                    ctx.fillRect(x + 3, y + 3, 9, 5);
                    ctx.fillStyle = "#6b8d96";
                    ctx.fillRect(x + 13, y + 2, 2, 16);
                }
            }

            // Clearly visible south-facing entrance (visual cue only; collision stays unchanged).
            const doorX = screenX + obstacle.width / 2 - 18;
            const doorY = screenY + obstacle.height - 31;
            ctx.fillStyle = "#79533a";
            ctx.fillRect(doorX, doorY, 36, 31);
            ctx.fillStyle = "#c99b65";
            ctx.fillRect(doorX + 5, doorY + 5, 26, 26);
            ctx.fillStyle = "#4a3526";
            ctx.fillRect(doorX + 16, doorY + 5, 4, 26);
            ctx.fillStyle = "#e5c58a";
            ctx.beginPath(); ctx.arc(doorX + 26, doorY + 18, 2, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = "#344638";
            ctx.font = "bold 13px Arial";
            ctx.textAlign = "center";
            ctx.fillText(obstacle.x < 1000 ? "MAIN BLOCK" : "CLASSROOMS", screenX + obstacle.width / 2, screenY + obstacle.height - 8);
            ctx.textAlign = "left";
        }


        // ------------------------------------------
        // BENCH
        // ------------------------------------------

        else if (obstacle.type === "bench") {

            ctx.fillStyle = "#92400e";

            ctx.fillRect(
                screenX,
                screenY + 8,
                obstacle.width,
                12
            );


            ctx.fillRect(
                screenX,
                screenY + 25,
                obstacle.width,
                10
            );


            // Legs

            ctx.fillRect(
                screenX + 15,
                screenY + 35,
                10,
                8
            );

            ctx.fillRect(
                screenX + obstacle.width - 25,
                screenY + 35,
                10,
                8
            );
        }


        // ------------------------------------------
        // BOOKSHELF
        // ------------------------------------------

        else if (obstacle.type === "bookshelf") {

            ctx.fillStyle = "#7c2d12";

            ctx.fillRect(
                screenX,
                screenY,
                obstacle.width,
                obstacle.height
            );


            ctx.strokeStyle = "#ffffff";

            ctx.lineWidth = 2;

            ctx.strokeRect(
                screenX,
                screenY,
                obstacle.width,
                obstacle.height
            );


            // Shelf lines

            ctx.strokeStyle = "#fbbf24";

            for (
                let y = screenY + 35;
                y < screenY + obstacle.height;
                y += 40
            ) {

                ctx.beginPath();

                ctx.moveTo(
                    screenX,
                    y
                );

                ctx.lineTo(
                    screenX + obstacle.width,
                    y
                );

                ctx.stroke();
            }
        }


        // ------------------------------------------
        // WALL
        // ------------------------------------------

        else if (obstacle.type === "wall") {

            ctx.fillStyle = "#6b7280";

            ctx.fillRect(
                screenX,
                screenY,
                obstacle.width,
                obstacle.height
            );


            ctx.strokeStyle = "#ffffff";

            ctx.lineWidth = 2;

            ctx.strokeRect(
                screenX,
                screenY,
                obstacle.width,
                obstacle.height
            );
        }

    }
}

// ==================================================
// DRAW SUBMISSION DESK
// ==================================================

function drawSubmissionDesk() {

    const screenX =
        submissionDesk.x -
        camera.x;

    const screenY =
        submissionDesk.y -
        camera.y;


    // Desk

    ctx.fillStyle = "#8b5cf6";

    ctx.fillRect(
        screenX,
        screenY,
        submissionDesk.width,
        submissionDesk.height
    );


    // Border

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        screenX,
        screenY,
        submissionDesk.width,
        submissionDesk.height
    );


    // Label

    ctx.fillStyle = "#ffffff";

    ctx.font = "13px Arial";

    ctx.fillText(
        "SUBMIT",
        screenX + 18,
        screenY + 35
    );
}

// ==================================================
// DRAW PLAYER
// ==================================================

function drawPlayer() {

    const screenX =
        player.x -
        camera.x;

    const screenY =
        player.y -
        camera.y;


    ctx.fillStyle = "#4ade80";


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


    ctx.moveTo(18, 0);

    ctx.lineTo(-10, -11);

    ctx.lineTo(-5, 0);

    ctx.lineTo(-10, 11);


    ctx.closePath();


    ctx.fill();


    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;


    ctx.stroke();


    ctx.restore();
}

// ==================================================
// DRAW LOCATION LABELS
// ==================================================

function drawLocationLabels() {

    // Workstation label

    const workX =
        workstation.x - camera.x;

    const workY =
        workstation.y - camera.y;

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";

    ctx.fillText(
        "WORKSTATION",
        workX - 15,
        workY - 10
    );


    // Submission desk label

    const submitX =
        submissionDesk.x - camera.x;

    const submitY =
        submissionDesk.y - camera.y;

    ctx.fillText(
        "SUBMISSION",
        submitX - 10,
        submitY - 10
    );


    // Assignment label

    if (!assignmentObject.collected) {

        const assignmentX =
            assignmentObject.x - camera.x;

        const assignmentY =
            assignmentObject.y - camera.y;

        ctx.fillText(
            "ASSIGNMENT",
            assignmentX - 5,
            assignmentY - 10
        );
    }
}

// ==================================================
// GAME UI
// ==================================================

function drawUI() {

    ctx.fillStyle = "#ffffff";

    ctx.font = "14px Arial";


    ctx.fillText(
        "X: " +
        Math.floor(player.x) +
        "  Y: " +
        Math.floor(player.y),
        15,
        25
    );
}


// ==================================================
// DRAW EVERYTHING
// ==================================================

function draw() {

    drawWorld();

    drawObstacles();

    drawCampusTrees();

    drawAssignment();

    drawWorkstation();

    drawSubmissionDesk();

    drawLocationLabels();

    drawPlayer();

    drawObjectiveArrow();

    drawUI();
}


// ==================================================
// RESPONSIVE CANVAS DISPLAY
// ==================================================

function resizeGame() {

    const viewport =
        window.visualViewport;


    const viewportWidth =
        viewport
            ? viewport.width
            : window.innerWidth;


    const viewportHeight =
        viewport
            ? viewport.height
            : window.innerHeight;


    const scale = Math.min(

        viewportWidth /
        GAME_WIDTH,

        viewportHeight /
        GAME_HEIGHT

    );


    canvas.style.width =
        GAME_WIDTH * scale + "px";


    canvas.style.height =
        GAME_HEIGHT * scale + "px";
}


window.addEventListener(
    "resize",
    resizeGame
);


if (window.visualViewport) {

    window.visualViewport.addEventListener(
        "resize",
        resizeGame
    );
}


resizeGame();

function startGame() {
    const instructionsScreen =
        document.getElementById("instructions-screen");

    if (instructionsScreen) {
        instructionsScreen.style.display = "none";
    }
}

const startButton =
    document.getElementById("start-game-button");

if (startButton) {
    startButton.addEventListener("click", startGame);
}

// ==================================================
// GAME LOOP
// ==================================================

function gameLoop() {

    updatePlayer();

    checkAssignmentPickup();

    checkHintSheetPickup();

    checkWorkstationInteraction();

    checkSubmissionInteraction();

    updateCamera();

    draw();


    requestAnimationFrame(
        gameLoop
    );
}


// ==================================================
// START GAME
// ==================================================

gameLoop();
