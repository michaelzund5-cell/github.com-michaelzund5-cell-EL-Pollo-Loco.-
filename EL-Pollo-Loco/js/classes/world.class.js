/**
 * Zentrale Spiel-Klasse. Hält alle Objekte des aktuellen Levels
 * (Charakter, Gegner, Sammelobjekte, Hintergrund), steuert den Haupt-Loop
 * (Zeichnen + Spiellogik pro Frame), die Kamera, Kollisionsprüfungen,
 * den Sound sowie den Spielausgang (Game Over / Sieg).
 */
class World {
    /** @param {HTMLCanvasElement} canvas - Der Canvas, auf dem gezeichnet wird. */
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

        this.sound = new SoundManager();
        this.sound.setMuted(window.isMuted);
        this.sound.playMusic();

        this.animationFrameId = null;
        this.gameFinished = false;
        this.draw();
    }

    /**
     * Der Haupt-Loop: aktualisiert Kamera und Spiellogik (falls nicht
     * pausiert/beendet), zeichnet dann alles neu und plant den nächsten
     * Frame per requestAnimationFrame.
     */
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

    /**
     * Zeichnet alle Objekte, die mit der Kamera mitscrollen (Hintergrund,
     * Wolken, Sammelobjekte, Charakter, Gegner). Nutzt eine Canvas-Translation,
     * damit die Kamera-Verschiebung nicht in jedem Objekt einzeln
     * berücksichtigt werden muss.
     */
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

    /**
     * Zeichnet die feste Benutzeroberfläche (Statusleisten, Zähler-Text).
     * Diese Elemente scrollen nicht mit der Kamera mit.
     */
    drawUserInterface() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);

        if (this.character.x > 1900 || this.endboss.isHurt() || this.endboss.isDefeated) {
            this.addToMap(this.endbossStatusBar);
        }

        this.drawCounterText();
    }

    /** Zeichnet die Coin- und Flaschen-Anzahl als Text über den Statusleisten. */
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

    /**
     * Führt alle Prüfungen und Aktualisierungen aus, die einmal pro Frame
     * passieren müssen: Kollisionen, Sammeln, Werfen, Aufräumen, Spielende.
     */
    updateGameLogic() {
        this.checkCharacterEnemyCollisions();
        this.checkThrowableEnemyCollisions();
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkThrowObjects();
        this.removeFinishedObjects();
        this.checkGameState();
    }

    /** Löscht den kompletten Canvas-Inhalt vor dem Neuzeichnen. */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Zeichnet eine Liste von Objekten nacheinander.
     * @param {DrawableObject[]} objects
     */
    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }

    /**
     * Zeichnet ein einzelnes Objekt, spiegelt es dabei horizontal,
     * falls es gerade in die "andere" Richtung schaut.
     * @param {DrawableObject} object
     */
    addToMap(object) {
        if (!object) return;

        const shouldFlip = object.shouldFlipImage?.() ?? object.otherDirection;
        if (shouldFlip) this.flipImage(object);
        object.draw(this.ctx);
        if (shouldFlip) this.flipImageBack();
    }

    /** Bereitet den Canvas-Kontext für ein horizontal gespiegeltes Zeichnen vor. */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.x + object.width, object.y);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-object.x, -object.y);
    }

    /** Macht die Spiegelung wieder rückgängig (stellt den Kontext wieder her). */
    flipImageBack() {
        this.ctx.restore();
    }

    /**
     * Prüft Kollisionen zwischen Charakter und Gegnern: Draufspringen
     * besiegt den Gegner, seitliche Berührung fügt dem Charakter Schaden zu
     * (inklusive Rückstoß, damit er nicht dauerhaft überlappt).
     */
    checkCharacterEnemyCollisions() {
        this.enemies.forEach((enemy) => {
            if (enemy.isDefeated || !this.character.isColliding(enemy)) return;

            if (this.canStompEnemy(enemy)) {
                enemy.defeat();
                this.character.bounceAfterStomp();
            } else if (this.character.hit()) {
                this.statusBar.setPercentage(this.character.energy);
                this.character.registerAction();
                this.character.updateAnimation();
                this.character.bounceAfterHit(enemy.x < this.character.x);
                this.sound.play("hit");
            }
        });
    }

    /**
     * Prüft, ob der Charakter gerade von oben auf einen Gegner fällt
     * (Stomp-Kill). Der Endboss kann nie zerstampft werden.
     * @param {MoveableObject} enemy
     * @returns {boolean}
     */
    canStompEnemy(enemy) {
        if (enemy instanceof Endboss) return false;

        const characterBottom = this.character.y + this.character.height;
        const stompZone = enemy.y + enemy.height * 0.6;
        return this.character.speedY > 0 && characterBottom <= stompZone;
    }

    /**
     * Prüft, ob eine geworfene Flasche einen Gegner trifft. Beim Endboss
     * wird Schaden angerechnet (siehe takeBottleHit), normale Gegner werden
     * sofort besiegt. Die Flasche zerspringt in jedem Fall.
     */
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

            this.sound.play("splash");
            bottle.splash();
        });
    }

    /**
     * Prüft, ob der Charakter eine Münze berührt. Eingesammelte Münzen
     * werden aus der Liste entfernt und die Statusleiste aktualisiert.
     */
    checkCoinCollisions() {
        const totalCoins = this.level.coins.length;

        this.coins = this.coins.filter((coin) => {
            if (!this.character.isColliding(coin)) return true;

            this.character.coins++;
            const percentage = (this.character.coins / totalCoins) * 100;
            this.coinStatusBar.setPercentage(percentage);
            this.sound.play("coin");
            return false;
        });
    }

    /**
     * Prüft, ob der Charakter eine am Boden liegende Flasche einsammelt.
     * Analog zu checkCoinCollisions.
     */
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

    /**
     * Löst das Werfen einer Flasche aus, wenn die Wurftaste gedrückt ist,
     * der Charakter noch Flaschen übrig hat, und der Wurf-Cooldown (700ms)
     * abgelaufen ist. Erstellt ein neues ThrowableObject an der Hand des
     * Charakters, in die Richtung, in die er gerade schaut.
     */
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
        this.character.registerAction();
        this.sound.play("throw");
        const maxBottles = this.level.bottles.length;
        this.bottleStatusBar.setPercentage((this.character.bottles / maxBottles) * 100);
        this.keyboard.THROW = false;
    }

    /**
     * Entfernt besiegte Gegner (nach kurzer Verzögerung, siehe canBeRemoved)
     * sowie geworfene Flaschen, die entweder fertig zersprungen oder aus dem
     * sichtbaren Levelbereich hinausgeflogen sind.
     */
    removeFinishedObjects() {
        this.enemies = this.enemies.filter((enemy) => !enemy.canBeRemoved());

        this.throwableObjects = this.throwableObjects.filter((bottle) => {
            const outsideLevel = bottle.x < -200 || bottle.x > this.levelEndX + 200 || bottle.y > 650;
            if (bottle.markedForRemoval || outsideLevel) bottle.clearAllIntervals();
            return !bottle.markedForRemoval && !outsideLevel;
        });
    }

    /**
     * Prüft, ob das Spiel zu Ende ist: Charakter gestorben (Game Over)
     * oder Endboss besiegt (Sieg) – jeweils erst, wenn die zugehörige
     * Todesanimation komplett durchgelaufen ist.
     */
    checkGameState() {
        if (this.character.isDead() && this.character.deathAnimationFinished) {
            this.finishGame("Game Over", false);
        }

        if (this.endboss.isDefeated && this.endboss.deathAnimationFinished) {
            this.finishGame("You Win!", true);
        }
    }

    /**
     * Beendet das Spiel endgültig: stoppt alle Intervalle, Musik und
     * spielt den passenden Sound, zeigt den Game-Over- oder Sieg-Bildschirm.
     * @param {string} title - Anzeigetext auf dem End-Bildschirm.
     * @param {boolean} won - true bei Sieg, false bei Niederlage.
     */
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

    /**
     * Berechnet die horizontale Kameraverschiebung, sodass der Charakter
     * ungefähr an einer festen Bildschirmposition bleibt, begrenzt auf
     * den Bereich zwischen Levelanfang und Levelende.
     */
    updateCamera() {
        const characterScreenPosition = 100;
        const maxCameraOffset = Math.max(0, this.levelEndX - this.canvas.width);

        this.cameraX = -this.character.x + characterScreenPosition;
        this.cameraX = Math.min(0, this.cameraX);
        this.cameraX = Math.max(-maxCameraOffset, this.cameraX);
    }

    /**
     * Beendet das aktuelle Spiel vollständig (z.B. beim Zurückgehen ins
     * Hauptmenü): stoppt den Zeichen-Loop, alle Intervalle, die Tastatur-
     * Listener und die Musik.
     */
    stop() {
        this.gameFinished = true;
        cancelAnimationFrame(this.animationFrameId);
        this.stopIntervals();
        this.keyboard.destroy();
        this.sound.stopMusic();
        this.clearCanvas();
    }

    /** Stoppt alle laufenden Intervalle sämtlicher beweglicher Objekte. */
    stopIntervals() {
        this.getAllMoveableObjects().forEach((object) => object.clearAllIntervals());
    }

    /**
     * Sammelt alle Objekte im Spiel, die eigene Intervalle laufen haben
     * (also gestoppt werden müssen, wenn das Spiel endet).
     * @returns {MoveableObject[]}
     */
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
