class World {

    character = new Character();
    keyboard = new Keyboard();

    canvas;
    ctx;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.draw();
    }

    draw() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.character.draw(this.ctx);

        requestAnimationFrame(() => {
            this.draw();
        });
    }

}