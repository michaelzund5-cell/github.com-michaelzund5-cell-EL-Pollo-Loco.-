class World {

    character;
    keyboard;
    canvas;
    ctx;
    animationFrameId;
    isRunning = true;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.character = new Character();
        this.keyboard = new Keyboard();

        this.draw();
    }

    draw() {
        if (!this.isRunning) {
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.character.draw(this.ctx);

        this.animationFrameId = requestAnimationFrame(() => {
            this.draw();
        });
    }

    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
    }
}