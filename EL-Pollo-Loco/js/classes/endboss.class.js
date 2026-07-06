class Endboss extends Chicken {

    IMAGES_WALKING = [
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png",
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png",
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png",
        "./assets/img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png"
    ];

    constructor() {
        super();


        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);

      
        this.x = 1000 + Math.random() * 1000;
        this.y = 95;
        this.width = 250;
        this.height = 400;

        this.speed = 0.5 + Math.random() * 0.5;



        
    }


}





