/** Represents the Coin game component. */
class Coin extends MoveableObject {
    IMAGES_COIN = [
        "./assets/img/img_pollo_locco/img/8_coin/coin_1.png",
        "./assets/img/img_pollo_locco/img/8_coin/coin_2.png"
    ];

    /** Initializes a new instance. */
    constructor(x, y) {
        super();

        this.loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);

        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 70;

        this.animate();
    }

    /** Executes the animate operation. */
    animate() {
        this.setGameInterval(() => this.playAnimation(this.IMAGES_COIN), 200);
    }

    /** Executes the getCollisionBox operation. */
    getCollisionBox() {
        return {
            x: this.x + this.width * 0.25,
            y: this.y + this.height * 0.25,
            width: this.width * 0.5,
            height: this.height * 0.5
        };
    }
}
