/**
 * Kleinere Variante des normalen Chicken – gleiche Logik (geerbt von Chicken),
 * nur mit eigenen Bildern, kleinerer Größe und etwas geringerer Geschwindigkeit.
 */
class BabyChicken extends Chicken {
    IMAGES_WALKING = [
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];

    IMAGE_DEAD =
        "./assets/img/img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png";

    /** @param {number} [x] - Start-X-Position (zufällig, falls nicht angegeben). */
    constructor(x = 850 + Math.random() * 1200) {
        super(x, 100, x);

        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImageToCache(this.IMAGE_DEAD);

        this.width = 60;
        this.height = 60;
        this.y = 380;
        this.speed = 0.1 + Math.random() * 0.3;
    }
}
