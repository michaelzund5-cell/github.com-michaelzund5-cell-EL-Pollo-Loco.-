class BabyChicken extends Chicken {

    constructor() {
        super();

        // Spezifische Eigenschaften für Baby Chicken
        this.loadImage("./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");

        this.width = 60;
        this.height = 60;
        this.y = 380;
        this.speed = 0.1 + Math.random() * 0.3;
    }
}