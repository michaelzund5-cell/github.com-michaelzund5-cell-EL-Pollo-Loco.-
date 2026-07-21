/** Represents the BackgroundObject game component. */
class BackgroundObject extends DrawableObject {

    /** Initializes a new instance. */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);

        this.x = x;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }

}
