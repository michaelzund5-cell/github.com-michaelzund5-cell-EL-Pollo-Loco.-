/** Represents the Cloud game component. */
class Cloud extends MoveableObject {

    /** Initializes a new instance. */
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

    /** Executes the animate operation. */
    animate() {
        this.setGameInterval(() => {
            this.moveLeft();
            if (this.x + this.width < 0) this.x = 2880;
        }, 1000 / 60);
    }
}
