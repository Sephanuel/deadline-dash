const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

ctx.fillStyle = "#222";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "white";
ctx.font = "32px Arial";
ctx.textAlign = "center";

ctx.fillText(
    "DEADLINE DASH",
    canvas.width / 2,
    canvas.height / 2
);