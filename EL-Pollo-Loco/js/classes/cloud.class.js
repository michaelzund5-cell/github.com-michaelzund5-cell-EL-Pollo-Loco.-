/**
 * Dekorative Wolke im Hintergrund. Bewegt sich langsam nach links und
 * springt zurück ans rechte Levelende, sobald sie links aus dem Bild ist
 * (Endlos-Effekt).
 */
class Cloud extends MoveableObject {
    /**
     * @param {number} [x=100] - Start-X-Position.
     * @param {number} [imageIndex=1] - Welches Wolkenbild genutzt wird.
     */
    constructor(x = 100, imageIndex = 1) {
        super();

        this.loadImage(
            `./assets/img/img_pollo_locco/img/5_background/layers/4_clouds/${imageIndex}.png`
        );

        this.x = x;
        this.y = 20 + Math.random() * 60;
        this.width = 500;
        this.height = 250;
        this.speed = 0.12 + Math.random() * 0.08;

        this.animate();
    }

    animate() {
        this.setGameInterval(() => {
            this.moveLeft();
            if (this.x + this.width < 0) this.x = 2880;
        }, 1000 / 60);
    }
}
