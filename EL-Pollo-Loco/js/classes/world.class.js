class World {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = new Keyboard();
        this.level = createLevel1();
        this.levelEndX = this.level.endX;
        this.character = new Character(this.keyboard, this.levelEndX);
        this.character.world = this;

        this.cameraX = 0;
        this.enemies = this.level.enemies;
        this.endboss = this.enemies.find((enemy) => enemy instanceof Endboss);
        if (this.endboss) this.endboss.world = this;
        this.backgroundObjects = this.level.backgroundObjects;
        this.clouds = this.level.clouds;
        this.coins = this.level.coins;
        this.bottles = this.level.bottles;
        this.throwableObjects = [];

        this.statusBar = new StatusBar();
        this.coinStatusBar = new CoinStatusBar();
        this.bottleStatusBar = new BottleStatusBar();
        this.endbossStatusBar = new EndbossStatusBar();

        this.animationFrameId = null;
        this.gameFinished = false;
        this.draw();
    }

    draw() {
        if (this.gameFinished) return;

        if (!window.isGamePaused) {
            this.updateCamera();
            this.updateGameLogic();
        }

        this.clearCanvas();
        this.drawWorldObjects();
        this.drawUserInterface();

        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    drawWorldObjects() {
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);

        this.ctx.restore();
    }

    drawUserInterface() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);

        if (this.character.x > 1900 || this.endboss.isHurt() || this.endboss.isDefeated) {
            this.addToMap(this.endbossStatusBar);
        }

        this.drawCounterText();
    }

    drawCounterText() {
        this.ctx.save();
        this.ctx.font = "bold 18px Arial";
        this.ctx.fillStyle = "#ffffff";
        this.ctx.strokeStyle = "#2b1608";
        this.ctx.lineWidth = 4;

        const coinText = `${this.character.coins}/${this.level.coins.length}`;
        const bottleText = `${this.character.bottles}`;

        this.ctx.strokeText(coinText, 178, 97);
        this.ctx.fillText(coinText, 178, 97);
        this.ctx.strokeText(bottleText, 178, 142);
        this.ctx.fillText(bottleText, 178, 142);
        this.ctx.restore();
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

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }

    addToMap(object) {
        if (!object) return;

        const shouldFlip = object.shouldFlipImage?.() ?? object.otherDirection;
        if (shouldFlip) this.flipImage(object);
        object.draw(this.ctx);
        if (shouldFlip) this.flipImageBack();
    }

    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.x + object.width, object.y);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-object.x, -object.y);
    }

    flipImageBack() {
        this.ctx.restore();
    }

    checkCharacterEnemyCollisions() {
        this.enemies.forEach((enemy) => {
            if (enemy.isDefeated || !this.character.isColliding(enemy)) return;

            if (this.canStompEnemy(enemy)) {
                enemy.defeat();
                this.character.bounceAfterStomp();
            } else if (this.character.hit()) {
                this.statusBar.setPercentage(this.character.energy);
                this.character.updateAnimation();
                this.character.bounceAfterHit(enemy.x < this.character.x);
            }
        });
    }

    canStompEnemy(enemy) {
        if (enemy instanceof Endboss) return false;

        const characterBottom = this.character.y + this.character.height;
        const stompZone = enemy.y + enemy.height * 0.6;
        return this.character.speedY > 0 && characterBottom <= stompZone;
    }

    checkThrowableEnemyCollisions() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.isSplashing || bottle.markedForRemoval) return;

            const enemy = this.enemies.find((candidate) => {
                return !candidate.isDefeated && bottle.isColliding(candidate);
            });

            if (!enemy) return;

            if (enemy instanceof Endboss) {
                if (!enemy.takeBottleHit(20)) return;
                this.endbossStatusBar.setPercentage(enemy.energy);
            } else {
                enemy.defeat();
            }

            bottle.splash();
        });
    }

    checkCoinCollisions() {
        const totalCoins = this.level.coins.length;

        this.coins = this.coins.filter((coin) => {
            if (!this.character.isColliding(coin)) return true;

            this.character.coins++;
            const percentage = (this.character.coins / totalCoins) * 100;
            this.coinStatusBar.setPercentage(percentage);
            return false;
        });
    }

    checkBottleCollisions() {
        const maxBottles = this.level.bottles.length;

        this.bottles = this.bottles.filter((bottle) => {
            if (!this.character.isColliding(bottle)) return true;

            this.character.bottles++;
            const percentage = (this.character.bottles / maxBottles) * 100;
            this.bottleStatusBar.setPercentage(percentage);
            return false;
        });
    }

    checkThrowObjects() {
        const now = Date.now();
        const throwCooldown = 700;

        if (
            !this.keyboard.THROW ||
            this.character.bottles <= 0 ||
            this.character.isDead() ||
            (this.lastThrowTime && now - this.lastThrowTime < throwCooldown)
        ) {
            return;
        }

        this.lastThrowTime = now;

        const startX = this.character.otherDirection
            ? this.character.x - 20
            : this.character.x + this.character.width - 35;

        const bottle = new ThrowableObject(
            startX,
            this.character.y + 55,
            this.character.otherDirection
        );

        this.throwableObjects.push(bottle);
        this.character.bottles--;
        const maxBottles = this.level.bottles.length;
        this.bottleStatusBar.setPercentage((this.character.bottles / maxBottles) * 100);
        this.keyboard.THROW = false;
    }

    removeFinishedObjects() {
        this.enemies = this.enemies.filter((enemy) => !enemy.canBeRemoved());

        this.throwableObjects = this.throwableObjects.filter((bottle) => {
            const outsideLevel = bottle.x < -200 || bottle.x > this.levelEndX + 200 || bottle.y > 650;
            if (bottle.markedForRemoval || outsideLevel) bottle.clearAllIntervals();
            return !bottle.markedForRemoval && !outsideLevel;
        });
    }

    checkGameState() {
        if (this.character.isDead() && this.character.deathAnimationFinished) {
            this.finishGame("Game Over", false);
        }

        if (this.endboss.isDefeated && this.endboss.deathAnimationFinished) {
            this.finishGame("You Win!", true);
        }
    }

    finishGame(title, won) {
        if (this.gameFinished) return;

        this.gameFinished = true;
        this.stopIntervals();

        const endScreen = document.getElementById("end-screen");
        const endScreenTitle = document.getElementById("end-screen-title");

        if (endScreenTitle) endScreenTitle.textContent = title;
        if (endScreen) {
            endScreen.classList.toggle("won", won);
            endScreen.classList.toggle("lost", !won);
            endScreen.classList.remove("hidden");
        }
    }

    updateCamera() {
        const characterScreenPosition = 100;
        const maxCameraOffset = Math.max(0, this.levelEndX - this.canvas.width);

        this.cameraX = -this.character.x + characterScreenPosition;
        this.cameraX = Math.min(0, this.cameraX);
        this.cameraX = Math.max(-maxCameraOffset, this.cameraX);
    }

    stop() {
        this.gameFinished = true;
        cancelAnimationFrame(this.animationFrameId);
        this.stopIntervals();
        this.keyboard.destroy();
        this.clearCanvas();
    }

    stopIntervals() {
        this.getAllMoveableObjects().forEach((object) => object.clearAllIntervals());
    }

    getAllMoveableObjects() {
        return [
            this.character,
            ...this.enemies,
            ...this.clouds,
            ...this.coins,
            ...this.throwableObjects
        ].filter((object) => object?.clearAllIntervals);
    }
}
