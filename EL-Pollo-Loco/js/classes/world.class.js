class World {
    keyboard = new Keyboard();
    levelEndX = 2880;
    character = new Character(this.keyboard, this.levelEndX);
    camera_x = 0;

    enemies = [
        new Chicken(),
        new Chicken(),
        new BabyChicken(),
        new Endboss()
    ];

    throwableObjects = [];

    coins = level1Coins;
    bottles = level1Bottles;

    statusBar = new StatusBar();

    backgroundObjects = level1Backgrounds;
    clouds = level1Clouds;

    canvas;
    ctx;
    animationFrameId;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.character.world = this;
        this.draw();
    }

    draw() {
        this.clearCanvas();
        this.updateCamera();

        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);

        this.ctx.restore();

        this.addToMap(this.statusBar);

        this.checkCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowObjects();

        this.animationFrameId = requestAnimationFrame(() => {
            this.draw();
        });
    }

    stop() {
        cancelAnimationFrame(this.animationFrameId);
        this.clearCanvas();
    }

    clearCanvas() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
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
                this.statusBar.setPercentage(this.character.energy);

                console.log(
                    "Character hit! Energy: " + this.character.energy
                );
            }
        });
    }

    checkCoinCollisions() {
        this.coins = this.coins.filter((coin) => {
            if (this.character.isColliding(coin)) {
                this.character.coins++;

                console.log(
                    "Coins: " + this.character.coins
                );

                return false;
            }

            return true;
        });
    }

    checkBottleCollisions() {
        this.bottles = this.bottles.filter((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottles++;

                console.log(
                    "Bottles: " + this.character.bottles
                );

                return false;
            }

            return true;
        });
    }

    checkThrowObjects() {
        if (this.keyboard.THROW && this.character.bottles > 0) {
            const bottle = new ThrowableObject(
                this.character.x + 80,
                this.character.y + 50
            );

            this.throwableObjects.push(bottle);
            this.character.bottles--;

            this.keyboard.THROW = false;

            console.log(
                "Bottle thrown! Remaining bottles: " +
                this.character.bottles
            );
        }
    }

    updateCamera() {
        const characterScreenPosition = 100;
        const maxCameraOffset =
            this.levelEndX - this.canvas.width;

        this.camera_x =
            -this.character.x + characterScreenPosition;

        this.camera_x = Math.min(
            0,
            this.camera_x
        );

        this.camera_x = Math.max(
            -maxCameraOffset,
            this.camera_x
        );
    }
}