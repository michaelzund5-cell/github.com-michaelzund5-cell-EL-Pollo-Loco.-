/**
 * Sammelbare Münze im Level. Rotiert durch eine kleine Animation und
 * nutzt eine engere, zentrierte Kollisionsbox statt der vollen Sprite-Größe,
 * damit sie nur bei echter Berührung eingesammelt wird.
 */
class Coin extends MoveableObject {
    IMAGES_COIN = [
        "./assets/img/img_pollo_locco/img/8_coin/coin_1.png",
        "./assets/img/img_pollo_locco/img/8_coin/coin_2.png"
    ];

    /**
     * @param {number} x - X-Position im Level.
     * @param {number} y - Y-Position im Level.
     */
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

    /** Startet die Dreh-Animation der Münze. */
    animate() {
        this.setGameInterval(() => this.playAnimation(this.IMAGES_COIN), 200);
    }

    /**
     * Engere Kollisionsbox (50% der Sprite-Größe, zentriert), damit
     * das Einsammeln realistischer wirkt als mit der vollen Bildgröße.
     */
    getCollisionBox() {
        return {
            x: this.x + this.width * 0.25,
            y: this.y + this.height * 0.25,
            width: this.width * 0.5,
            height: this.height * 0.5
        };
    }
}
