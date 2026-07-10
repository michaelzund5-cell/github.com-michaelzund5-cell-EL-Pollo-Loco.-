class World {

    keyboard = new Keyboard();

    character = new Character(this.keyboard);

    camera_x = 0;
    levelEndX = 3000;

    enemies = [
        new Chicken(),
        new Chicken(),
        new BabyChicken(),
        new Endboss()

    ];

    backgroundObjects = level1Backgrounds;
    clouds = level1Clouds;



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
        this.updateCamera();

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);

        this.ctx.restore();

        this.checkCollisions();

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



    checkCollisions() {
        this.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                console.log("Character hit! Energy: " + this.character.energy);
            }
        });


    }
    updateCamera() {
        this.camera_x = -this.character.x + 100;
         if (this.camera_x > 0) {
            this.camera_x = 0;
            
        }
        if (this.camera_x < -1500) {
            this.camera_x = -1500;
        }

    }


}