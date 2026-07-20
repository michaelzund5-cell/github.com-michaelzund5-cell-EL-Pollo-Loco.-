/**
 * Sammelbare Salsa-Flasche im Level (liegt am Boden, im Gegensatz zu
 * ThrowableObject, das die tatsächlich geworfene, fliegende Flasche ist).
 * Nutzt wie Coin eine engere, zentrierte Kollisionsbox.
 */
class Bottle extends DrawableObject {

    IMAGES_BOTTLE = [
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
    ];

    /**
     * @param {number} x - X-Position im Level.
     * @param {number} y - Y-Position im Level.
     */
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

    /**
     * Engere Kollisionsbox (50% der Sprite-Größe, zentriert). DrawableObject
     * hat von Haus aus keine getCollisionBox() – ohne diese Überschreibung
     * würde die volle 70x70-Sprite-Größe ohne jeden Puffer verwendet.
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