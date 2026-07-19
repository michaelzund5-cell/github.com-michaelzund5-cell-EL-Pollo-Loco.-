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

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImageToCache(path) {
        const img = new Image();
        img.src = path;
        this.imageCache[path] = img;
    }

    loadImages(paths) {
        paths.forEach((path) => this.loadImageToCache(path));
    }

    draw(ctx) {
        if (!(this.img instanceof HTMLImageElement)) return;

        if (this.isHurt?.() && !this.isDead?.()) {
            ctx.globalAlpha = Math.floor(Date.now() / 100) % 2 === 0 ? 0.4 : 1;
        }

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
    }

    playAnimation(images) {
        if (!images?.length) return;

        const index = this.currentImage % images.length;
        const path = images[index];
        const nextImage = this.imageCache[path];

        if (nextImage) this.img = nextImage;
        this.currentImage = (this.currentImage + 1) % images.length;
    }

    resetAnimation() {
        this.currentImage = 0;
    }

    shouldFlipImage() {
        return this.imageFacesRight ? this.otherDirection : !this.otherDirection;
    }
}
