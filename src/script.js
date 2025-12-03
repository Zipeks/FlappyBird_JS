const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const bird = new Bird(100, 50, "assets/images/yellowbird-midflap.png");
const world = new World(0, 0, "assets/images/background-day.png", 0, -0.5)
let pipes = [];
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
}

function genPipes() {
    for (let i = 0; i < 100; i++) {
        let h = Math.floor(world.img.height / 2);
        let pipe_height = getRandomNumber(h - 60, h + 60)
        // pipe_height - 320 bo 320 wysokość zdjęcia rury
        pipes.push([new Pipe(300 + i * 225, pipe_height - 320, "assets/images/pipe-green_down.png", world.speed * 2),
            new Pipe(300 + i * 225, pipe_height + 100, "assets/images/pipe-green_up.png", world.speed * 2)])
    }
}

genPipes();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPipes();
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

function drawPipes() {
    for (let i = 0; pipes.length; i++) {
        let c_pipes = pipes[i];
        let pipeDown = c_pipes.at(0);
        let pipeUp = c_pipes.at(1);
        pipeDown.update();
        pipeUp.update();
        ctx.drawImage(pipeDown.img, pipeDown.x, pipeDown.y);
        ctx.drawImage(pipeUp.img, pipeUp.x, pipeUp.y);
    }
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