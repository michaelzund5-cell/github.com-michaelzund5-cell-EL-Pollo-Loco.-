class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new BabyChicken(),
        new Endboss()
    ];

    canvas;
    ctx;
    animationFrameId;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.draw();
    }

    draw() {
        this.clearCanvas();

        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);

        this.animationFrameId = requestAnimationFrame(() => {
            this.draw();
        });
    }

    stop() {
        cancelAnimationFrame(this.animationFrameId);
        this.clearCanvas();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    addToMap(object) {
        object.draw(this.ctx);
    }
}
