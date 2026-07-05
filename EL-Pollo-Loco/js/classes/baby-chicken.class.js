class BabyChicken extends Chicken {


    IMAGES_WALKING = [
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];



    constructor() {
        super();

        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);

        this.width = 60;
        this.height = 60;
        this.y = 380;
        this.speed = 0.1 + Math.random() * 0.3;
    }


}

