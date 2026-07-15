class MoveableObject extends DrawableObject {

    speed = 0;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;

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

    isDead() {
        return this.energy <= 0;
    }

    hit(damage = 5) {
        if (this.isHurt() || this.isDead()) return false;

        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
        return true;
    }

    isHurt() {
        return Date.now() - this.lastHit < 800;
    }

    isColliding(object) {
        return this.x + this.width > object.x &&
               this.y + this.height > object.y &&
               this.x < object.x + object.width &&
               this.y < object.y + object.height;
    }
}