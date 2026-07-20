/**
 * Ein einzelnes Hintergrundbild-Segment (z.B. Himmel, Berge, Boden-Layer).
 * Mehrere Instanzen werden aneinandergereiht, um den Parallax-Hintergrund
 * über die gesamte Levelbreite zu erzeugen.
 */
class BackgroundObject extends DrawableObject {

    /**
     * @param {string} imagePath - Pfad zum Hintergrundbild.
     * @param {number} x - X-Position dieses Segments im Level.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);

        this.x = x;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }



}

