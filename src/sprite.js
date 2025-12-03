class Sprite {
    x;
    y;
    img;

    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = image;
    }
}

class Bird extends Sprite {
    verticalSpeed = 0;
    gravity = 0.1;
    angle = 0;

    update() {
        this.verticalSpeed += this.gravity;
        this.y += this.verticalSpeed;
        if (bird.verticalSpeed < -2) {
            bird.img.src = "assets/images/yellowbird-upflap.png";
        } else if (bird.verticalSpeed < -1) {
            bird.img.src = "assets/images/yellowbird-midflap.png";
        } else {
            bird.img.src = "assets/images/yellowbird-downflap.png";
        }
        if (this.verticalSpeed < 0) {
            this.angle = -45 * (Math.PI / 180);
        } else if (this.angle < 45 * (Math.PI / 180)) {
            this.angle += 0.03;
        }
    }

}

class World extends Sprite {
    position;
    speed;
    score = 0;

    constructor(x, y, image, position, speed) {
        super(x, y, image);
        this.position = position;
        this.speed = speed;
    }
}
class Pipe extends Sprite {
    speed;
    constructor(x, y, image, speed) {
        super(x, y, image);
        this.speed = speed;
    }
    update() {
        this.x += this.speed;
    }
}