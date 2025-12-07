class Game {
    constructor() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        if (window.localStorage.getItem("topScores") == null) {
            window.localStorage.setItem("topScores", JSON.stringify([]));
        }
        this.scoreSaved = false;

        this.backgroundMusic = new Audio();
        this.dieSound = new Audio("assets/Sound Efects/die.ogg");
        this.pointSound = new Audio("assets/Sound Efects/points.ogg");

        this.world = new World(0, 0, "assets/images/background-day.png", 0, -1);
        this.bird = new Bird(50, this.canvas.height / 2, "assets/images/yellowbird-midflap.png");
        this.base = new World(0, this.canvas.height - 112, "assets/images/base.png", 0, this.world.speed * 2);
        this.startInfo = new Sprite(this.canvas.width / 2 - 92, this.canvas.height / 2 - 133, "assets/UI/message.png");
        this.gameOverInfo = new Sprite(this.canvas.width / 2 - 92, this.canvas.height / 2 - 150, "assets/UI/gameover.png");
        this.scoreNumbers = [];
        for (let i = 0; i < 10; i++) {
            this.scoreNumbers.push(new Image());
            this.scoreNumbers.at(-1).src = `assets/UI/Numbers/${i}.png`;
        }
        this.pipes = [];
        this.pressed = false;
        this.isRunning = false;
        this.gameOver = false;
        this.score =  0;
        this.loop = this.loop.bind(this);

        this.genPipes();
        this.addControls();
        this.loop();
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    genPipes() {
        let worldHeight = this.world.img.height || 600;

        for (let i = 0; i < 100; i++) {
            let difficulty = Math.floor(i / 10)*5;
            let h = Math.floor(worldHeight / 2 - 100);
            let pipe_height = this.getRandomNumber(h - 60, h + 60);

            this.pipes.push([
                new Pipe(300 + i * 225, pipe_height - 320, "assets/images/pipe-green_down.png", this.world.speed * 2),
                new Pipe(300 + i * 225, pipe_height + 100 - difficulty, "assets/images/pipe-green_up.png", this.world.speed * 2)
                //     +52 bo pipe width + 32 ptak wyleciał
                , new Pipe(300 + i * 225 + 52 + 32, 0, "assets/images/background-day.png", this.world.speed * 2,)]);
        }
    }

    loop() {
        this.draw();
        requestAnimationFrame(this.loop);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.drawPipes();
        this.drawBase();
        this.drawScore();
        if (this.isRunning) {
            if (!this.gameOver) {
                this.bird.update();
            } else {
                if (this.bird.fall(this.base.y)) {
                    this.isRunning = false;
                }
            }
            if (!this.gameOver && this.checkCollisions()) {
                this.bird.verticalSpeed = 6;
                this.gameOver = true;
            }
        }
        this.drawBird();
        if (!this.isRunning && !this.gameOver) {
            this.drawStartInfo();
        } else if (!this.isRunning && this.gameOver) {
            if (!this.scoreSaved) {
                this.dieSound.play();
                this.updateTopScores();
                this.scoreSaved = true;
            }
            this.drawEndScreen();
        }
    }

    drawScore() {
        if (this.score < 10) {
            this.ctx.drawImage(this.scoreNumbers[this.score], this.canvas.width - 30, 10)
        } else {
            if (this.score < 20) {
                this.ctx.drawImage(this.scoreNumbers[Math.floor(this.score / 10)], this.canvas.width - 50, 10)
            } else {
                this.ctx.drawImage(this.scoreNumbers[Math.floor(this.score / 10)], this.canvas.width - 55, 10)
            }
            this.ctx.drawImage(this.scoreNumbers[this.score % 10], this.canvas.width - 30, 10)
        }
    }

    drawStartInfo() {
        this.ctx.drawImage(this.startInfo.img, this.startInfo.x, this.startInfo.y);
    }

    drawEndScreen() {
        this.ctx.drawImage(this.gameOverInfo.img, this.gameOverInfo.x, this.gameOverInfo.y);
        let arr = JSON.parse(window.localStorage.getItem("topScores"));
        for (let i = 0; i < arr.length; i++) {
            let topScore = arr[i];
            if (topScore < 10) {
                this.ctx.drawImage(this.scoreNumbers[topScore], this.gameOverInfo.x, this.gameOverInfo.y + 50 + i * 50);
            } else {
                this.ctx.drawImage(this.scoreNumbers[Math.floor(topScore / 10)], this.gameOverInfo.x, this.gameOverInfo.y + 50 + i * 50);
                if (topScore < 20) {
                    this.ctx.drawImage(this.scoreNumbers[topScore % 10], this.gameOverInfo.x + 20, this.gameOverInfo.y + 50 + i * 50)
                } else {
                    this.ctx.drawImage(this.scoreNumbers[topScore % 10], this.gameOverInfo.x + 30, this.gameOverInfo.y + 50 + i * 50)
                }
            }

        }
    }

    drawBackground() {
        if (!this.world.img) return;

        const w = this.world.img.width;
        if (this.isRunning && !this.gameOver) {
            this.world.position = (((this.world.position + this.world.speed) % w + w) % w);
        }

        this.ctx.drawImage(this.world.img, this.world.position - w, this.world.y);
        this.ctx.drawImage(this.world.img, this.world.position - 2, this.world.y);
        this.ctx.drawImage(this.world.img, this.world.position + w - 4, this.world.y);
    }

    drawBase() {
        if (!this.base.img) return;

        const w = this.base.img.width;
        if (this.isRunning && !this.gameOver) {
            this.base.position = (((this.base.position + this.base.speed) % w + w) % w);
        }

        this.ctx.drawImage(this.base.img, this.base.position - w, this.base.y);
        this.ctx.drawImage(this.base.img, this.base.position, this.base.y);
        this.ctx.drawImage(this.base.img, this.base.position + w, this.base.y);
    }

    drawBird() {
        this.ctx.save();
        this.ctx.translate(this.bird.x + this.bird.img.width / 2, this.bird.y + this.bird.img.height / 2);
        this.ctx.rotate(this.bird.angle);
        this.ctx.drawImage(this.bird.img, -this.bird.img.width / 2, -this.bird.img.height / 2);
        this.ctx.restore();
    }

    drawPipes() {
        for (let i = 0; i < this.pipes.length; i++) {
            let c_pipes = this.pipes[i];
            let pipeDown = c_pipes[0];
            let pipeUp = c_pipes[1];
            let scorePipe = c_pipes[2];
            if (this.isRunning && !this.gameOver) {
                pipeDown.update();
                pipeUp.update();
                scorePipe.update();
            }

            if (pipeUp.x < this.canvas.width && pipeUp.x > -100) {
                this.ctx.drawImage(pipeDown.img, pipeDown.x, pipeDown.y);
                this.ctx.drawImage(pipeUp.img, pipeUp.x, pipeUp.y);
            }

        }
        if (this.pipes[0][0].x <= -100) {
            this.pipes.shift();
        }
    }

    checkCollisions() {
        if (this.bird.y + this.bird.img.height >= this.base.y) {
            return true;
        }
        const padding = 2;
        const birdWidth = this.bird.img.width - padding * 2;
        const birdHeight = this.bird.img.height - padding * 2;
        const birdLeft = this.bird.x + padding;
        const birdTop = this.bird.y + padding;

        for (let i = 0; i < this.pipes.length; i++) {
            for (let j = 0; j < 3; j++) {
                let pipe = this.pipes[i][j];

                if (
                    birdLeft < pipe.x + pipe.img.width &&
                    birdLeft + birdWidth > pipe.x &&
                    birdTop < pipe.y + pipe.height &&
                    birdTop + birdHeight > pipe.y
                ) {
                    if (j < 2) {
                        return true;
                    } else if (!pipe.hitted) {
                        pipe.hitted = true;
                        this.score += 1
                        console.log(this.score);
                        this.pointSound.play();
                    }
                }
            }
        }
        return false;
    }

    updateTopScores() {
        let arr = JSON.parse(window.localStorage.getItem("topScores"));
        arr.push(this.score);
        arr.sort((a, b) => b - a);
        arr = arr.slice(0, 5);
        window.localStorage.setItem("topScores", JSON.stringify(arr));
    }
    reset() {
        this.bird = new Bird(50, this.canvas.height / 2, "assets/images/yellowbird-midflap.png");
        this.pipes = [];
        this.genPipes();
        this.score = 0;
        this.gameOver = false;
        this.isRunning = false;
        this.scoreSaved = false;
        this.pressed = false;
    }

    addControls() {
        window.addEventListener('keydown', (e) => {
            if (e.code === "Space") {
                if (!this.isRunning && !this.gameOver) {
                    this.isRunning = true;
                    this.bird.verticalSpeed = -3.5;
                }
                else if (this.isRunning && !this.gameOver && !this.pressed) {
                    this.bird.verticalSpeed = -3.5;
                    this.pressed = true;
                }
                else if (!this.isRunning && this.gameOver) {
                    this.reset();
                }
            }
        });


        window.addEventListener('keyup', (e) => {
            if (e.code === "Space") {
                this.pressed = false;
            }
        });
    }
}

const game = new Game();