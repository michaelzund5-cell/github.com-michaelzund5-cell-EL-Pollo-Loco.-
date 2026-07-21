/** Represents the ThrowableObject game component. */
class ThrowableObject extends MoveableObject {
    IMAGES_ROTATION = [
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    ];

    IMAGES_SPLASH = [
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "./assets/img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
    ];

    isSplashing = false;
    markedForRemoval = false;
    direction = 1;

    /** Initializes a new instance. */
    constructor(x, y, otherDirection = false) {
        super();

        this.loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);

        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.otherDirection = otherDirection;
        this.direction = otherDirection ? -1 : 1;
        this.groundY = 360;

        this.throw();
        this.animate();
    }

    /** Executes the throw operation. */
    throw() {
        this.speedY = -15;
        this.applyGravity();

        this.setGameInterval(() => {
            if (this.isSplashing || this.markedForRemoval) return;

            this.x += 10 * this.direction;
            if (!this.isAboveGround() && this.speedY === 0) this.splash();
        }, 1000 / 60);
    }

    /** Executes the animate operation. */
    animate() {
        this.setGameInterval(() => {
            if (this.markedForRemoval) return;

            if (this.isSplashing) {
                this.playSplashAnimationOnce();
            } else {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
    }

    /** Executes the splash operation. */
    splash() {
        if (this.isSplashing || this.markedForRemoval) return;

        this.isSplashing = true;
        this.speedY = 0;
        this.resetAnimation();
    }

    /** Executes the playSplashAnimationOnce operation. */
    playSplashAnimationOnce() {
        const index = Math.min(this.currentImage, this.IMAGES_SPLASH.length - 1);
        const path = this.IMAGES_SPLASH[index];
        this.img = this.imageCache[path];

        if (this.currentImage < this.IMAGES_SPLASH.length - 1) {
            this.currentImage++;
        } else {
            this.markedForRemoval = true;
        }
    }
}
