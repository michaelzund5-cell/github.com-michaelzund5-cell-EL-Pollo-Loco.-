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
        return this.energy == 0;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; 
        timepassed = timepassed / 1000; 
        return timepassed < 1;
    }
}