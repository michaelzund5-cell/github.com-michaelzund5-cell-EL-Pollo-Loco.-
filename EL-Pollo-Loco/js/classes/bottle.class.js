class Bottle extends DrawableObject {

    IMAGES_BOTTLE = [
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
    ];

    constructor(x, y) {
        super();

        const randomIndex = Math.floor(
            Math.random() * this.IMAGES_BOTTLE.length
        );

        this.loadImage(this.IMAGES_BOTTLE[randomIndex]);

        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 70;
    }
}