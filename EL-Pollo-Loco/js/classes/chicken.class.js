class Chicken extends MoveableObject {


    IMAGES_WALKING = [
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];


    constructor() {
        super();

        this.loadImage(this.IMAGES_WALKING[0]);

        this.x = 500 + Math.random() * 500;
        this.y = 360;
        this.width = 80;
        this.height = 80;

        this.speed = 0.15 + Math.random() * 0.5;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

    moveLeft() {
        this.x -= this.speed;
    }

}
