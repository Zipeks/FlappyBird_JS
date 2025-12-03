const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const bird = new Bird(100, 50, "assets/images/yellowbird-midflap.png");
const world = new World(0, 0, "assets/images/background-day.png", 0, -0.5)

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    bird.update();
    drawBird();
}

function drawBackground() {
    const w = world.img.width;
    world.position = (((world.position + world.speed) % w + w) % w)
    ctx.drawImage(world.img, world.position - w, world.y);
    ctx.drawImage(world.img, world.position - 2, world.y);
    ctx.drawImage(world.img, world.position + w - 4, world.y);
}

function drawBird() {
    ctx.save();

    ctx.translate(bird.x + bird.img.width / 2, bird.y + bird.img.height / 2);
    ctx.rotate(bird.angle);
    ctx.drawImage(bird.img, -bird.img.width / 2, -bird.img.height / 2);
    ctx.restore();
}


let pressed = false;
window.addEventListener('keydown', function (e) {
    if (!pressed && e.code === "Space") {
        bird.verticalSpeed = -3.5;
    }
    pressed = true;
})

window.addEventListener('keyup', function (e) {
    if (e.code === "Space") {
        pressed = false;
    }
})

setInterval(draw, 10);