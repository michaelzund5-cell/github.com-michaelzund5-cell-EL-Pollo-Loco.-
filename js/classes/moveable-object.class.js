/** Represents the MoveableObject game component. */
class MoveableObject extends DrawableObject {
    speed = 0;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;
    groundY = 250;
    intervalIds = [];

    /** Executes the setGameInterval operation. */
    setGameInterval(callback, delay) {
        const intervalId = setInterval(() => {
            if (!window.isGamePaused) callback();
        }, delay);
        this.intervalIds.push(intervalId);
        return intervalId;
    }

    /** Executes the clearAllIntervals operation. */
    clearAllIntervals() {
        this.intervalIds.forEach((intervalId) => clearInterval(intervalId));
        this.intervalIds = [];
    }

    /** Executes the moveRight operation. */
    moveRight() {
        this.x += this.speed;
    }

    /** Executes the moveLeft operation. */
    moveLeft() {
        this.x -= this.speed;
    }

    /** Executes the jump operation. */
    jump() {
        this.speedY = -25;
    }

    /** Executes the applyGravity operation. */
    applyGravity() {
        this.setGameInterval(() => {
            if (this.isAboveGround() || this.speedY < 0) {
                this.y += this.speedY;
                this.speedY += this.acceleration;
            } else {
                this.y = this.groundY;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    /** Executes the isAboveGround operation. */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /** Executes the isDead operation. */
    isDead() {
        return this.energy <= 0;
    }

    /** Executes the hit operation. */
    hit(damage = 5) {
        if (this.isHurt() || this.isDead()) return false;

        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
        this.resetAnimation();
        return true;
    }

    /** Executes the isHurt operation. */
    isHurt() {
        return Date.now() - this.lastHit < 300;
    }

    /** Executes the isColliding operation. */
    isColliding(object) {
        const a = this.getCollisionBox();
        const b = object.getCollisionBox ? object.getCollisionBox() : object;

        return a.x + a.width > b.x &&
            a.y + a.height > b.y &&
            a.x < b.x + b.width &&
            a.y < b.y + b.height;
    }

    /** Executes the getCollisionBox operation. */
    getCollisionBox() {
        return {
            x: this.x + this.width * 0.18,
            y: this.y + this.height * 0.12,
            width: this.width * 0.64,
            height: this.height * 0.82
        };
    }
}
