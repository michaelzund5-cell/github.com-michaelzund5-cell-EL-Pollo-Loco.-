/** Represents the SoundManager game component. */
class SoundManager {
    sounds = {};
    muted = false;
    musicTrack = null;

    /** Initializes a new instance. */
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

    /** Executes the register operation. */
    register(name, path) {
        const audio = new Audio(path);
        this.sounds[name] = audio;
    }

    /** Executes the play operation. */
    play(name) {
        if (this.muted) return;

        const original = this.sounds[name];
        if (!original) return;

        const instance = original.cloneNode();
        instance.volume = original.volume;
        instance.play().catch(() => {});
    }

    /** Executes the playMusic operation. */
    playMusic() {
        if (this.musicTrack) return;

        this.musicTrack = this.sounds.music;
        this.musicTrack.loop = true;
        this.musicTrack.volume = 0.3;

        if (!this.muted) this.musicTrack.play().catch(() => {});
    }

    /** Executes the stopMusic operation. */
    stopMusic() {
        if (!this.musicTrack) return;

        this.musicTrack.pause();
        this.musicTrack.currentTime = 0;
        this.musicTrack = null;
    }

    /** Executes the setMuted operation. */
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
