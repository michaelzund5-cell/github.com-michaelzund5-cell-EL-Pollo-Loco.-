class Chicken extends MoveableObject {
    IMAGES_WALKING = [
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    IMAGE_DEAD =
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

    isDefeated = false;
    removeAt = 0;
    leftBorder = 100;
    rightBorder = 0;

    constructor(x = 500 + Math.random() * 1800, leftBorder = 100, rightBorder = x) {
        super();

        this.imageFacesRight = false;
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImageToCache(this.IMAGE_DEAD);

        this.x = x;
        this.y = 360;
        this.width = 80;
        this.height = 80;
        this.speed = 0.15 + Math.random() * 0.5;
        this.energy = 1;

        this.leftBorder = Math.max(100, leftBorder);
        this.rightBorder = Math.max(this.leftBorder + 50, rightBorder);

        // Chicken-Bilder schauen von Haus aus nach links.
        // Deshalb startet das Chicken ohne Spiegelung Richtung Character-Start.
        this.otherDirection = true;

        this.animate();
    }

    animate() {
        this.setGameInterval(() => {
            if (!this.isDefeated) this.patrol();
        }, 1000 / 60);

        this.setGameInterval(() => this.updateAnimation(), 200);
    }

    patrol() {
        if (this.x <= this.leftBorder) {
            this.x = this.leftBorder;
            this.otherDirection = false;
        } else if (this.x >= this.rightBorder) {
            this.x = this.rightBorder;
            this.otherDirection = true;
        }

        if (this.otherDirection) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    updateAnimation() {
        if (this.isDefeated) {
            this.img = this.imageCache[this.IMAGE_DEAD];
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    defeat() {
        if (this.isDefeated) return;

        this.isDefeated = true;
        this.energy = 0;
        this.speed = 0;
        this.removeAt = Date.now() + 700;
        this.currentImage = 0;
        this.img = this.imageCache[this.IMAGE_DEAD];
    }

    canBeRemoved() {
        return this.isDefeated && Date.now() >= this.removeAt;
    }
}
