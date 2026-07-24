/** Represents the World game component. */
class World {

    /**
     * Creates a game world for the supplied canvas.
     *
     * @param {HTMLCanvasElement} canvas - Canvas used to render the game.
     */
    constructor(canvas) {
        this.initializeCanvas(canvas);
        this.initializeLevel();
        this.initializeInterface();
        this.initializeSound();
        this.animationFrameId = null;
        this.gameFinished = false;
        this.pendingBottleRespawns = [];
        this.draw();
    }

    /** Sets up canvas, context, and keyboard input. @param {HTMLCanvasElement} canvas @returns {void} */
    initializeCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = new Keyboard();
        this.cameraX = 0;
    }

    /** Creates the level and assigns all world objects. @returns {void} */
    initializeLevel() {
        this.level = createLevel1();
        this.levelEndX = this.level.endX;
        this.character = new Character(this.keyboard, this.levelEndX);
        this.character.world = this;
        this.assignLevelObjects();
    }

    /** Assigns enemies and collectables from the current level. @returns {void} */
    assignLevelObjects() {
        this.enemies = this.level.enemies;
        this.endboss = this.enemies.find((enemy) => enemy instanceof Endboss);
        if (this.endboss) this.endboss.world = this;
        this.backgroundObjects = this.level.backgroundObjects;
        this.clouds = this.level.clouds;
        this.coins = this.level.coins;
        this.bottles = this.level.bottles;
        this.throwableObjects = [];
    }

    /** Creates all game status bars. @returns {void} */
    initializeInterface() {
        this.statusBar = new StatusBar();
        this.coinStatusBar = new CoinStatusBar();
        this.bottleStatusBar = new BottleStatusBar();
        this.endbossStatusBar = new EndbossStatusBar();
    }

    /** Creates the sound manager and starts background music. @returns {void} */
    initializeSound() {
        this.sound = new SoundManager();
        this.sound.setMuted(window.isMuted);
        this.sound.playMusic();
    }

    /** Executes the draw operation. */
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

    /** Executes the drawWorldObjects operation. */
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

    /** Executes the drawUserInterface operation. */
    drawUserInterface() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);

        if (this.character.x > 1900 || this.endboss.isHurt() || this.endboss.isDefeated) {
            this.addToMap(this.endbossStatusBar);
        }

        this.drawCounterText();
    }

    /** Executes the drawCounterText operation. */
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

    /** Executes the updateGameLogic operation. */
    updateGameLogic() {
        this.checkCharacterEnemyCollisions();
        this.checkThrowableEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.respawnCollectedBottles();
        this.checkThrowObjects();
        this.playOccasionalEnemySound();
        this.removeFinishedObjects();
        this.checkGameState();
    }

    /** Executes the clearCanvas operation. */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /** Executes the addObjectsToMap operation. */
    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }

    /** Executes the addToMap operation. */
    addToMap(object) {
        if (!object) return;

        const shouldFlip = object.shouldFlipImage?.() ?? object.otherDirection;
        if (shouldFlip) this.flipImage(object);
        object.draw(this.ctx);
        if (shouldFlip) this.flipImageBack();
    }

    /** Executes the flipImage operation. */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.x + object.width, object.y);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-object.x, -object.y);
    }

    /** Executes the flipImageBack operation. */
    flipImageBack() {
        this.ctx.restore();
    }

    /** Checks and resolves collisions between Pepe and every enemy. @returns {void} */
    checkCharacterEnemyCollisions() {
        this.enemies.forEach((enemy) => this.resolveEnemyCollision(enemy));
    }

    /**
     * Resolves a single enemy collision as a stomp or character hit.
     *
     * @param {Chicken|BabyChicken|Endboss} enemy - Colliding enemy.
     * @returns {void}
     */
    resolveEnemyCollision(enemy) {
        if (enemy.isDefeated || !this.character.isColliding(enemy)) return;
        if (this.canStompEnemy(enemy)) return this.defeatEnemyByStomp(enemy);
        this.damageCharacter(enemy);
    }

    /**
     * Determines whether Pepe is falling onto a regular enemy from above.
     *
     * @param {Chicken|BabyChicken|Endboss} enemy - Enemy being checked.
     * @returns {boolean} True when the collision is a valid stomp.
     */
    canStompEnemy(enemy) {
        if (enemy instanceof Endboss || this.character.speedY < 0) return false;
        const playerBox = this.character.getCollisionBox();
        const enemyBox = enemy.getCollisionBox();
        const playerCenter = playerBox.y + playerBox.height / 2;
        const enemyCenter = enemyBox.y + enemyBox.height / 2;
        return playerCenter < enemyCenter;
    }

    /** Defeats an enemy and bounces Pepe upward. @param {Chicken|BabyChicken} enemy @returns {void} */
    defeatEnemyByStomp(enemy) {
        enemy.defeat();
        this.playChickenDefeatSounds();
        this.character.bounceAfterStomp();
    }

    /** Plays the chicken and defeat sounds for regular enemies. @returns {void} */
    playChickenDefeatSounds() {
        this.sound.play("chicken");
        this.sound.play("enemyDeath");
    }

    /** Applies enemy damage to Pepe. @param {Chicken|BabyChicken|Endboss} enemy @returns {void} */
    damageCharacter(enemy) {
        if (!this.character.hit()) return;
        this.statusBar.setPercentage(this.character.energy);
        this.character.registerAction();
        this.character.updateAnimation();
        this.character.bounceAfterHit(enemy.x < this.character.x);
        this.sound.play("hit");
    }

    /** Executes the checkThrowableEnemyCollisions operation. */
    checkThrowableEnemyCollisions() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.isSplashing || bottle.markedForRemoval) return;

            const enemy = this.enemies.find((candidate) => {
                return !candidate.isDefeated && bottle.isColliding(candidate);
            });

            if (!enemy) return;

            if (enemy instanceof Endboss) {
                if (!enemy.takeBottleHit(15)) return;
                this.endbossStatusBar.setPercentage(enemy.energy);
            } else {
                enemy.defeat();
                this.playChickenDefeatSounds();
            }

            this.sound.play("splash");
            bottle.splash();
        });
    }

    /** Collects coins only after a clear visible overlap. @returns {void} */
    checkCoinCollisions() {
        const totalCoins = this.level.coins.length;
        this.coins = this.coins.filter((coin) => {
            if (!this.isCollectibleTouched(coin)) return true;
            this.collectCoin(totalCoins);
            return false;
        });
    }

    /** Updates the character and interface after collecting a coin. @param {number} totalCoins @returns {void} */
    collectCoin(totalCoins) {
        this.character.coins++;
        this.coinStatusBar.setPercentage((this.character.coins / totalCoins) * 100);
        this.sound.play("coin");
    }

    /** Collects bottles only after a clear visible overlap. @returns {void} */
    checkBottleCollisions() {
        this.bottles = this.bottles.filter((bottle) => {
            if (!this.isCollectibleTouched(bottle)) return true;
            this.collectBottle(bottle);
            return false;
        });
    }

    /** Adds one bottle and schedules its return to the level. @param {Bottle} bottle @returns {void} */
    collectBottle(bottle) {
        this.character.bottles++;
        this.updateBottleStatusBar();
        this.pendingBottleRespawns.push({ x: bottle.x, y: bottle.y, respawnAt: Date.now() + 5000 });
    }

    /** Restores collected bottles after a short delay. @returns {void} */
    respawnCollectedBottles() {
        const now = Date.now();
        const ready = this.pendingBottleRespawns.filter((entry) => entry.respawnAt <= now);
        ready.forEach((entry) => this.bottles.push(new Bottle(entry.x, entry.y)));
        this.pendingBottleRespawns = this.pendingBottleRespawns.filter((entry) => entry.respawnAt > now);
    }

    /** Checks whether a collectible visibly overlaps Pepe by several pixels. @param {Coin|Bottle} object @returns {boolean} */
    isCollectibleTouched(object) {
        const characterBox = this.getCollectibleCharacterBox();
        const objectBox = object.getCollisionBox();
        const overlapX = Math.min(characterBox.x + characterBox.width, objectBox.x + objectBox.width) - Math.max(characterBox.x, objectBox.x);
        const overlapY = Math.min(characterBox.y + characterBox.height, objectBox.y + objectBox.height) - Math.max(characterBox.y, objectBox.y);
        return overlapX >= 6 && overlapY >= 6;
    }

    /** Returns Pepe's narrow collision area used only for collectibles. @returns {{x:number,y:number,width:number,height:number}} */
    getCollectibleCharacterBox() {
        return {
            x: this.character.x + this.character.width * 0.34,
            y: this.character.y + this.character.height * 0.18,
            width: this.character.width * 0.32,
            height: this.character.height * 0.72
        };
    }

    /** Updates the bottle status bar based on the bottles Pepe currently carries. @returns {void} */
    updateBottleStatusBar() {
        const maximumBottles = Math.max(1, this.level.bottles.length);
        const percentage = (this.character.bottles / maximumBottles) * 100;
        this.bottleStatusBar.setPercentage(percentage);
    }

    /** Creates a thrown bottle when the input and cooldown allow it. @returns {void} */
    checkThrowObjects() {
        if (!this.canThrowBottle()) return;
        const bottle = this.createThrowableBottle();
        this.throwableObjects.push(bottle);
        this.consumeBottle();
    }

    /** Checks all requirements for throwing a bottle. @returns {boolean} True when Pepe can throw. */
    canThrowBottle() {
        const cooldownFinished = !this.lastThrowTime || Date.now() - this.lastThrowTime >= 700;
        return this.keyboard.THROW && this.character.bottles > 0 &&
            !this.character.isDead() && cooldownFinished;
    }

    /** Creates a bottle at the correct side of Pepe. @returns {ThrowableObject} New throwable bottle. */
    createThrowableBottle() {
        this.lastThrowTime = Date.now();
        const startX = this.character.otherDirection
            ? this.character.x - 20
            : this.character.x + this.character.width - 35;
        return new ThrowableObject(startX, this.character.y + 55, this.character.otherDirection);
    }

    /** Removes one bottle and updates the bottle interface. @returns {void} */
    consumeBottle() {
        this.character.bottles--;
        this.character.registerAction();
        this.sound.play("throw");
        this.updateBottleStatusBar();
        this.keyboard.THROW = false;
    }


    /** Plays a subtle chicken sound at irregular intervals. @returns {void} */
    playOccasionalEnemySound() {
        if (!this.hasLivingChicken()) return;
        const now = Date.now();
        if (this.lastChickenSound && now - this.lastChickenSound < 5000) return;
        if (Math.random() > 0.008) return;
        this.lastChickenSound = now;
        this.sound.play("chicken");
    }

    /** Checks whether at least one regular chicken is still alive. @returns {boolean} */
    hasLivingChicken() {
        return this.enemies.some((enemy) => {
            return enemy instanceof Chicken && !(enemy instanceof Endboss) && !enemy.isDefeated;
        });
    }

    /** Executes the removeFinishedObjects operation. */
    removeFinishedObjects() {
        this.enemies = this.enemies.filter((enemy) => !enemy.canBeRemoved());

        this.throwableObjects = this.throwableObjects.filter((bottle) => {
            const outsideLevel = bottle.x < -200 || bottle.x > this.levelEndX + 200 || bottle.y > 650;
            if (bottle.markedForRemoval || outsideLevel) bottle.clearAllIntervals();
            return !bottle.markedForRemoval && !outsideLevel;
        });
    }

    /** Executes the checkGameState operation. */
    checkGameState() {
        if (this.character.isDead() && this.character.deathAnimationFinished) {
            this.finishGame("Game Over", false);
        }

        if (this.endboss.isDefeated && this.endboss.deathAnimationFinished) {
            this.finishGame("You Win!", true);
        }
    }

    /** Executes the finishGame operation. */
    finishGame(title, won) {
        if (this.gameFinished) return;

        this.gameFinished = true;
        this.stopIntervals();
        this.sound.stopMusic();
        this.sound.play(won ? "win" : "gameOver");

        const endScreen = document.getElementById("end-screen");
        const endScreenTitle = document.getElementById("end-screen-title");

        if (endScreenTitle) endScreenTitle.textContent = title;
        if (endScreen) {
            endScreen.classList.toggle("won", won);
            endScreen.classList.toggle("lost", !won);
            endScreen.classList.remove("hidden");
        }
    }

    /** Executes the updateCamera operation. */
    updateCamera() {
        const characterScreenPosition = 100;
        const maxCameraOffset = Math.max(0, this.levelEndX - this.canvas.width);

        this.cameraX = -this.character.x + characterScreenPosition;
        this.cameraX = Math.min(0, this.cameraX);
        this.cameraX = Math.max(-maxCameraOffset, this.cameraX);
    }

    /** Executes the stop operation. */
    stop() {
        this.gameFinished = true;
        cancelAnimationFrame(this.animationFrameId);
        this.stopIntervals();
        this.keyboard.destroy();
        this.sound.stopMusic();
        this.clearCanvas();
    }

    /** Executes the stopIntervals operation. */
    stopIntervals() {
        this.getAllMoveableObjects().forEach((object) => object.clearAllIntervals());
    }

    /** Executes the getAllMoveableObjects operation. */
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
