/**
 * Verwaltet alle Sound-Effekte und die Hintergrundmusik des Spiels.
 * Effekte werden bei jedem Abspielen geklont (siehe play), damit sich
 * mehrere gleichzeitige Sounds nicht gegenseitig unterbrechen.
 */
class SoundManager {
    sounds = {};
    muted = false;
    musicTrack = null;

    constructor() {
        this.register("coin", "./assets/audio/freesound_community-money-pickup-2-89563.mp3");
        this.register("gameOver", "./assets/audio/freesound_community-game-over-38511.mp3");
        this.register("hit", "./assets/audio/u_b32baquv5u-8-bit-explosion-10-340462.mp3");
        this.register("splash", "./assets/audio/universfield-glass-bottle-smash-277554.mp3");
        this.register("win", "./assets/audio/make_more_sound-8-bit-video-game-win-level-sound-version-1-145827.mp3");
        this.register("music", "./assets/audio/liecio-music-box-horror-190275.mp3");
        this.register("jump", "./assets/audio/dragon-studio-cartoon-jump-463196.mp3");
        this.register("throw", "./assets/audio/floraphonic-movement-swipe-whoosh-3-186577.mp3");
    }

    /**
     * Lädt eine Sounddatei und speichert sie unter einem einfachen Namen,
     * damit sie später per play(name) genutzt werden kann.
     * @param {string} name - Kurzer, sprechender Name (z.B. "coin").
     * @param {string} path - Pfad zur Audiodatei.
     */
    register(name, path) {
        const audio = new Audio(path);
        this.sounds[name] = audio;
    }

    /**
     * Spielt einen registrierten Sound-Effekt einmal ab. Erstellt dafür
     * eine Kopie (cloneNode), damit sich schnell aufeinanderfolgende
     * Sounds (z.B. mehrere Coins) nicht gegenseitig abschneiden.
     * @param {string} name - Name des Sounds (siehe register-Aufrufe oben).
     */
    play(name) {
        if (this.muted) return;

        const original = this.sounds[name];
        if (!original) return;

        const instance = original.cloneNode();
        instance.volume = original.volume;
        instance.play().catch(() => {});
    }

    /**
     * Startet die Hintergrundmusik in Dauerschleife (leiser als die
     * Effekte). Macht nichts, falls die Musik schon läuft.
     */
    playMusic() {
        if (this.musicTrack) return;

        this.musicTrack = this.sounds.music;
        this.musicTrack.loop = true;
        this.musicTrack.volume = 0.3;

        if (!this.muted) this.musicTrack.play().catch(() => {});
    }

    /** Stoppt die Hintergrundmusik komplett und setzt sie zurück auf den Anfang. */
    stopMusic() {
        if (!this.musicTrack) return;

        this.musicTrack.pause();
        this.musicTrack.currentTime = 0;
        this.musicTrack = null;
    }

    /**
     * Schaltet Musik und Effekte stumm oder wieder an.
     * @param {boolean} muted
     */
    setMuted(muted) {
        this.muted = muted;

        if (this.musicTrack) {
            if (muted) {
                this.musicTrack.pause();
            } else {
                this.musicTrack.play().catch(() => {});
            }
        }
    }
}
