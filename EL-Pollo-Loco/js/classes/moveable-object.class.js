class MoveableObject extends DrawableObject {

    speed = 0;
    speedY = 0;
    acceleration = 2;

    applyGravity() {

    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 5;
    }
}