/** Represents the DrawableObject game component. */
class DrawableObject {
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;

    otherDirection = false;

    imageFacesRight = true;

    /** Executes the loadImage operation. */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /** Executes the loadImageToCache operation. */
    loadImageToCache(path) {
        const img = new Image();
        img.src = path;
        this.imageCache[path] = img;
    }

    /** Executes the loadImages operation. */
    loadImages(paths) {
        paths.forEach((path) => this.loadImageToCache(path));
    }

    /** Executes the draw operation. */
    draw(ctx) {
        if (!(this.img instanceof HTMLImageElement)) return;

        if (this.isHurt?.() && !this.isDead?.()) {
            ctx.globalAlpha = Math.floor(Date.now() / 100) % 2 === 0 ? 0.4 : 1;
        }

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
    }

    /** Executes the playAnimation operation. */
    playAnimation(images) {
        if (!images?.length) return;

        const index = this.currentImage % images.length;
        const path = images[index];
        const nextImage = this.imageCache[path];

        if (nextImage) this.img = nextImage;
        this.currentImage = (this.currentImage + 1) % images.length;
    }

    /** Executes the resetAnimation operation. */
    resetAnimation() {
        this.currentImage = 0;
    }

    /** Executes the shouldFlipImage operation. */
    shouldFlipImage() {
        return this.imageFacesRight ? this.otherDirection : !this.otherDirection;
    }
}
