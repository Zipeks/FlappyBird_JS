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
    hitbox;

    constructor(x, y, image) {
        super(x, y, image);
        this.setHitbox();
    }

    setHitbox() {
        this.hitbox = this.img.width - 3;
    }

    update() {
        this.verticalSpeed += this.gravity;
        this.y += this.verticalSpeed;
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.verticalSpeed < -2) {
            this.img.src = "assets/images/yellowbird-upflap.png";
        } else if (this.verticalSpeed < -1) {
            this.img.src = "assets/images/yellowbird-midflap.png";
        } else {
            this.img.src = "assets/images/yellowbird-downflap.png";
        }
        if (this.verticalSpeed < 0) {
            this.angle = -45 * (Math.PI / 180);
        } else if (this.angle < 45 * (Math.PI / 180)) {
            this.angle += 0.06;
        }
    }

    fall(groundLevel) {
        this.angle = 90 * (Math.PI / 180);
        this.verticalSpeed += this.gravity + 0.1;
        if (this.y + this.hitbox - 10 < groundLevel) {
            this.y += this.verticalSpeed;
            return false;
        }
        return true;
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
    hitbox;
    hitted = false;
    height;

    constructor(x, y, image, speed, hitbox, height) {
        super(x, y, image);
        this.speed = speed;
        if (hitbox !== undefined) {
            this.hitbox = hitbox;
        } else {
            this.setHitbox();
        }
        this.height = this.img.height;
    }

    setHitbox() {
        this.hitbox = this.img.width;
    }

    update() {
        this.x += this.speed;
    }
}