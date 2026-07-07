class MoveableObject extends DrawableObject {

    speed = 0;
    speedY = 0;
    acceleration = 2;

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = -25;
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY < 0) {
                this.y += this.speedY;
                this.speedY += this.acceleration;
            } else {
                this.y = 250;
                this.speedY = 0;
            }
        }, 1000 / 25);

    }
    isAboveGround() {
        return this.y < 250;
    }
}