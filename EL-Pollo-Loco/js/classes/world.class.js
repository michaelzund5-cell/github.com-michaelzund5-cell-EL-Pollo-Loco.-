class World {
    keyboard = new Keyboard();
    levelEndX = 2880;
    character = new Character(this.keyboard, this.levelEndX);
    camera_x = 0;

    endboss = new Endboss();
    enemies = [
        new Chicken(),
        new Chicken(),
        new BabyChicken(),
        this.endboss
    ];

    throwableObjects = [];
    coins = level1Coins;
    bottles = level1Bottles;

    statusBar = new StatusBar();
    endbossStatusBar = new EndbossStatusBar();

    backgroundObjects = level1Backgrounds;
    clouds = level1Clouds;

    canvas;
    ctx;
    animationFrameId;
    gameFinished = false;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.character.world = this;
        this.draw();
    }

    draw() {
        if (this.gameFinished) return;

        this.clearCanvas();
        this.updateCamera();
        this.updateGameLogic();

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
        this.addToMap(this.endbossStatusBar);

        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    updateGameLogic() {
        this.checkCharacterEnemyCollisions();
        this.checkThrowableEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowObjects();
        this.removeFinishedObjects();
        this.checkGameState();
    }

    stop() {
        cancelAnimationFrame(this.animationFrameId);
        this.clearCanvas();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }

    addToMap(object) {
        object.draw(this.ctx);
    }

    checkCharacterEnemyCollisions() {
        this.enemies.forEach((enemy) => {
            if (enemy.isDefeated || !this.character.isColliding(enemy)) return;

            if (this.canStompEnemy(enemy)) {
                enemy.defeat();
                this.character.bounceAfterStomp();
            } else {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    canStompEnemy(enemy) {
        if (enemy instanceof Endboss) return false;

        const characterBottom = this.character.y + this.character.height;
        const stompZone = enemy.y + enemy.height * 0.55;

        return this.character.speedY > 0 && characterBottom <= stompZone;
    }

    checkThrowableEnemyCollisions() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.isSplashing || bottle.markedForRemoval) return;

            const enemy = this.enemies.find((currentEnemy) => {
                return !currentEnemy.isDefeated && bottle.isColliding(currentEnemy);
            });

            if (!enemy) return;

            if (enemy instanceof Endboss) {
                const bossWasHit = enemy.takeBottleHit(20);
                if (!bossWasHit) return;

                this.endbossStatusBar.setPercentage(enemy.energy);
            } else {
                enemy.defeat();
            }

            bottle.splash();
        });
    }

    checkCoinCollisions() {
        this.coins = this.coins.filter((coin) => {
            if (!this.character.isColliding(coin)) return true;

            this.character.coins++;
            return false;
        });
    }

    checkBottleCollisions() {
        this.bottles = this.bottles.filter((bottle) => {
            if (!this.character.isColliding(bottle)) return true;

            this.character.bottles++;
            return false;
        });
    }

    checkThrowObjects() {
        if (!this.keyboard.THROW || this.character.bottles <= 0 || this.character.isDead()) {
            return;
        }

        const bottle = new ThrowableObject(
            this.character.x + 80,
            this.character.y + 50
        );

        this.throwableObjects.push(bottle);
        this.character.bottles--;
        this.keyboard.THROW = false;
    }

    removeFinishedObjects() {
        this.enemies = this.enemies.filter((enemy) => !enemy.canBeRemoved());

        this.throwableObjects = this.throwableObjects.filter((bottle) => {
            const outsideLevel = bottle.x > this.levelEndX + 200 || bottle.y > 600;
            return !bottle.markedForRemoval && !outsideLevel;
        });
    }

    checkGameState() {
        if (this.character.isDead() && this.character.deathAnimationFinished) {
            this.finishGame("Game Over");
        }

        if (this.endboss.isDefeated && this.endboss.deathAnimationFinished) {
            this.finishGame("You Win!");
        }
    }

    finishGame(title) {
        if (this.gameFinished) return;

        this.gameFinished = true;
        cancelAnimationFrame(this.animationFrameId);

        const endScreen = document.getElementById("end-screen");
        const endScreenTitle = document.getElementById("end-screen-title");

        if (endScreenTitle) endScreenTitle.textContent = title;
        if (endScreen) endScreen.classList.remove("hidden");
    }

    updateCamera() {
        const characterScreenPosition = 100;
        const maxCameraOffset = this.levelEndX - this.canvas.width;

        this.camera_x = -this.character.x + characterScreenPosition;
        this.camera_x = Math.min(0, this.camera_x);
        this.camera_x = Math.max(-maxCameraOffset, this.camera_x);
    }
}
