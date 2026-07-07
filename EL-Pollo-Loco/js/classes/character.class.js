class Character extends MoveableObject {

    IMAGES_WALKING = [
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png",
        "./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png"
    ];

    constructor(keyboard) {
        super();
        this.keyboard = keyboard;
        console.log(this.keyboard);

        this.loadImage("./assets/img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.IMAGES_WALKING);
        //this.loadImages(this.IMAGES_JUMPING);
        //this.loadImages(this.IMAGES_DEAD);

        this.x = 100;
        this.y = 250;
        this.width = 150;
        this.height = 280;
        this.speed = 5;

        this.applyGravity();
        this.animate();

    }


    animate() {
        setInterval(() => {
            if (this.keyboard.RIGHT) {
                this.moveRight();
                this.playAnimation(this.IMAGES_WALKING);
            }

            if (this.keyboard.LEFT) {
                this.moveLeft();
                this.playAnimation(this.IMAGES_WALKING);
            }

            if (this.keyboard.SPACE) {
                this.jump();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.keyboard.RIGHT || this.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);

    }
}






