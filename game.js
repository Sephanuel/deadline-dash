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

// ==================================================
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

    ctx.fillStyle = "#1b1f24";

    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    const gridSize = 50;

    ctx.strokeStyle = "#2c323a";
    ctx.lineWidth = 1;


    const startX =
        -(camera.x % gridSize);

    const startY =
        -(camera.y % gridSize);


    for (
        let x = startX;
        x < GAME_WIDTH;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            GAME_HEIGHT
        );

        ctx.stroke();
    }


    for (
        let y = startY;
        y < GAME_HEIGHT;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            GAME_WIDTH,
            y
        );

        ctx.stroke();
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

            ctx.fillStyle = "#374151";

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


            // Windows

            ctx.fillStyle = "#38bdf8";


            for (
                let x = screenX + 30;
                x < screenX + obstacle.width - 20;
                x += 55
            ) {

                for (
                    let y = screenY + 30;
                    y < screenY + obstacle.height - 20;
                    y += 55
                ) {

                    ctx.fillRect(
                        x,
                        y,
                        25,
                        25
                    );
                }
            }


            // Building label

            ctx.fillStyle = "#ffffff";

            ctx.font = "14px Arial";

            ctx.fillText(
                "BUILDING",
                screenX + 10,
                screenY + obstacle.height - 10
            );
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
