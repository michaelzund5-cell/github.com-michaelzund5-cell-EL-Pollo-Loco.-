/**
 * Basisklasse für alle zeichenbaren Objekte im Spiel.
 * Kümmert sich ums Laden von Bildern, Zwischenspeichern (Cache)
 * für Animationen und ums eigentliche Zeichnen auf den Canvas.
 */
class DrawableObject {
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;

    // Einheitliche Bedeutung: true = Objekt bewegt/schaut nach links.
    otherDirection = false;

    // Die meisten Pepe-Bilder schauen standardmäßig nach rechts.
    // Chicken und Endboss überschreiben diesen Wert mit false.
    imageFacesRight = true;

    /**
     * Lädt ein einzelnes Bild direkt als aktuelles Bild des Objekts.
     * @param {string} path - Pfad zur Bilddatei.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Lädt ein Bild in den internen Cache, ohne es sofort anzuzeigen.
     * Wird für Animationsbilder genutzt, die später abgerufen werden.
     * @param {string} path - Pfad zur Bilddatei.
     */
    loadImageToCache(path) {
        const img = new Image();
        img.src = path;
        this.imageCache[path] = img;
    }

    /**
     * Lädt mehrere Bilder auf einmal in den Cache.
     * @param {string[]} paths - Liste von Bildpfaden.
     */
    loadImages(paths) {
        paths.forEach((path) => this.loadImageToCache(path));
    }

    /**
     * Zeichnet das aktuelle Bild auf den Canvas.
     * Lässt das Objekt kurz blinken, solange es verwundbar-geschützt ist (isHurt).
     * @param {CanvasRenderingContext2D} ctx - Der Zeichenkontext des Canvas.
     */
    draw(ctx) {
        if (!(this.img instanceof HTMLImageElement)) return;

        if (this.isHurt?.() && !this.isDead?.()) {
            ctx.globalAlpha = Math.floor(Date.now() / 100) % 2 === 0 ? 0.4 : 1;
        }

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
    }

    /**
     * Spielt eine Bilderfolge ab, indem bei jedem Aufruf zum nächsten Bild
     * weitergeschaltet wird (Endlosschleife durch die Bilderliste).
     * @param {string[]} images - Liste der Bildpfade der Animation.
     */
    playAnimation(images) {
        if (!images?.length) return;

        const index = this.currentImage % images.length;
        const path = images[index];
        const nextImage = this.imageCache[path];

        if (nextImage) this.img = nextImage;
        this.currentImage = (this.currentImage + 1) % images.length;
    }

    /**
     * Setzt den Animationszähler zurück auf das erste Bild.
     * Wichtig beim Wechsel zwischen Animationstypen (z.B. Idle -> Sprung),
     * damit die neue Animation nicht mitten im Bilderzyklus startet.
     */
    resetAnimation() {
        this.currentImage = 0;
    }

    /**
     * Bestimmt, ob das Bild horizontal gespiegelt gezeichnet werden muss,
     * abhängig davon, in welche Richtung das Bild von Haus aus schaut
     * und in welche Richtung sich das Objekt gerade bewegt.
     * @returns {boolean}
     */
    shouldFlipImage() {
        return this.imageFacesRight ? this.otherDirection : !this.otherDirection;
    }
}
