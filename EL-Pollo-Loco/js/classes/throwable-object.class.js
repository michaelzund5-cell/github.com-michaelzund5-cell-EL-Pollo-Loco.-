class ThrowableObject extends MoveableObject {

    constructor(x, y) {
        super();

        this.loadImage(
            "./assets/img/img_pollo_locco/img/6_salsa_bottle/salsa_bottle.png"
        );

        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;

        this.throw();
    }

    throw() {
        this.speedY = -15;
        this.applyGravity();

        setInterval(() => {
            this.x += 10;
        }, 1000 / 60);
    }
}