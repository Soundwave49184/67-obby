const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gravity = 0.7;

const player = {
    x: 80,
    y: 100,
    width: 70,
    height: 70,
    velocityX: 0,
    velocityY: 0,
    speed: 7,
    jumping: false
};

const keys = {};

const platforms = [
    { x: 0, y: 500, width: 250, height: 50, color: "#2dc653" },
    { x: 320, y: 430, width: 180, height: 25, color: "#ffbe0b" },
    { x: 580, y: 360, width: 180, height: 25, color: "#8338ec" },
    { x: 860, y: 290, width: 180, height: 25, color: "#ff006e" },
    { x: 1080, y: 220, width: 120, height: 25, color: "#fb5607" }
];

const stars = [
    { x: 390, y: 390, collected: false },
    { x: 650, y: 320, collected: false },
    { x: 930, y: 250, collected: false },
    { x: 1130, y: 180, collected: false }
];

let score = 0;
let gameWon = false;

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function update() {

    if (gameWon) return;

    if (keys["ArrowLeft"] || keys["a"]) player.velocityX = -player.speed;
    else if (keys["ArrowRight"] || keys["d"]) player.velocityX = player.speed;
    else player.velocityX = 0;

    if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && !player.jumping) {
        player.velocityY = -15;
        player.jumping = true;
    }

    player.velocityY += gravity;

    player.x += player.velocityX;
    player.y += player.velocityY;

    for (let platform of platforms) {

        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height < platform.y + 15 &&
            player.y + player.height + player.velocityY >= platform.y
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
        }
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width)
        player.x = canvas.width - player.width;

    for (let star of stars) {

        if (
            !star.collected &&
            player.x < star.x + 20 &&
            player.x + player.width > star.x &&
            player.y < star.y + 20 &&
            player.y + player.height > star.y
        ) {
            star.collected = true;
            score++;
        }
    }

    if (score === stars.length) gameWon = true;
}

function drawBackgroundDecor() {

    ctx.fillStyle = "rgba(255,255,255,0.8)";

    ctx.beginPath();
    ctx.arc(170, 100, 40, 0, Math.PI * 2);
    ctx.arc(220, 90, 50, 0, Math.PI * 2);
    ctx.arc(270, 100, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(800, 120, 35, 0, Math.PI * 2);
    ctx.arc(850, 110, 45, 0, Math.PI * 2);
    ctx.arc(900, 120, 35, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlayer() {

    ctx.beginPath();
    ctx.arc(player.x + 35, player.y + 35, 45, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fill();

    ctx.fillStyle = "#ff006e";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 32px Arial";
    ctx.fillText("67", player.x + 10, player.y + 45);
}

function drawPlatforms() {

    for (let platform of platforms) {

        ctx.fillStyle = platform.color;

        ctx.beginPath();
        ctx.roundRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height,
            10
        );

        ctx.fill();
    }
}

function drawStars() {

    for (let star of stars) {

        if (!star.collected) {

            ctx.fillStyle = "gold";

            ctx.beginPath();
            ctx.arc(star.x, star.y, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
}

function drawScore() {

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("⭐ " + score + " / " + stars.length, 20, 40);
}

function drawWin() {

    if (!gameWon) return;

    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;

    ctx.shadowColor = "#00f5ff";
    ctx.shadowBlur = 25;

    ctx.textAlign = "center";

    // Main title
    ctx.fillStyle = "white";
    ctx.font = "bold 55px Arial";
    ctx.fillText("YOU WIN!", centerX, 220);

    // Subtitle
    ctx.font = "26px Arial";
    ctx.fillText("67 OBBY completed 🎉", centerX, 270);

    // BIG credit text (increased as requested)
    ctx.font = "bold 44px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("(made by islam)", centerX, 340);

    ctx.shadowBlur = 0;
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackgroundDecor();
    drawPlatforms();
    drawStars();
    drawPlayer();
    drawScore();
    drawWin();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
