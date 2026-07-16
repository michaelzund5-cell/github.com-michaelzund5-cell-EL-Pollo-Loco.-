class Coin extends MoveableObject {
    IMAGES_COIN = [
        "./assets/img/img_pollo_locco/img/8_coin/coin_1.png",
        "./assets/img/img_pollo_locco/img/8_coin/coin_2.png"
    ];

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

    animate() {
        this.setGameInterval(() => this.playAnimation(this.IMAGES_COIN), 200);
    }
}
