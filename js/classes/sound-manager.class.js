/** Manages music and sound effects for the game. */
class SoundManager {
    sounds = {};
    muted = false;
    musicTrack = null;
    activeSounds = new Set();

    /** Registers all audio files used by the game. */
    constructor() {
        this.register("coin", "./assets/audio/freesound_community-money-pickup-2-89563.mp3");
        this.register("gameOver", "./assets/audio/freesound_community-game-over-38511.mp3");
        this.register("hit", "./assets/audio/u_b32baquv5u-8-bit-explosion-10-340462.mp3");
        this.register("splash", "./assets/audio/universfield-glass-bottle-smash-277554.mp3");
        this.register("win", "./assets/audio/make_more_sound-8-bit-video-game-win-level-sound-version-1-145827.mp3");
        this.register("music", "./assets/audio/liecio-music-box-horror-190275.mp3");
        this.register("jump", "./assets/audio/dragon-studio-cartoon-jump-463196.mp3");
        this.register("throw", "./assets/audio/floraphonic-movement-swipe-whoosh-3-186577.mp3");
        this.register("chicken", "./assets/audio/freesound_community-047876_chicken-clucking-68610.mp3");

    }

    /**
     * Creates and stores an audio element.
     *
     * @param {string} name - Unique sound identifier.
     * @param {string} path - Relative path to the audio file.
     * @returns {void}
     */
    register(name, path) {
        this.sounds[name] = new Audio(path);
    }

    /**
     * Plays a registered sound or a generated enemy sound.
     *
     * @param {string} name - Sound identifier to play.
     * @returns {void}
     */
    play(name) {
        if (this.muted) return;

        if (name === "enemyDeath") {
            return this.playTone(150, 0.18, "sawtooth");
        }

        this.playAudioClone(this.sounds[name]);
    }
    /**
     * Plays a cloned audio element so effects can overlap.
     *
     * @param {HTMLAudioElement} original - Source audio element.
     * @returns {void}
     */
    playAudioClone(original) {
        if (!original || this.muted) return;
        const instance = original.cloneNode();
        instance.volume = original.volume;
        this.activeSounds.add(instance);
        instance.addEventListener("ended", () => this.activeSounds.delete(instance), { once: true });
        instance.play().catch(() => this.activeSounds.delete(instance));
    }

    /** Stops every currently playing sound effect. @returns {void} */
    stopActiveSounds() {
        this.activeSounds.forEach((sound) => {
            sound.pause();
            sound.currentTime = 0;
        });
        this.activeSounds.clear();
    }

    /**
     * Generates a short sound effect with the Web Audio API.
     *
     * @param {number} frequency - Starting frequency in hertz.
     * @param {number} duration - Sound duration in seconds.
     * @param {OscillatorType} type - Oscillator waveform.
     * @returns {void}
     */
    playTone(frequency, duration, type) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const context = new AudioContextClass();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, context.currentTime + duration);
        gain.gain.setValueAtTime(0.12, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + duration);
        oscillator.addEventListener("ended", () => context.close());
    }

    /** Starts the looping background music. @returns {void} */
    playMusic() {
        if (this.musicTrack) return;
        this.musicTrack = this.sounds.music;
        this.musicTrack.loop = true;
        this.musicTrack.volume = 0.3;
        if (!this.muted) this.musicTrack.play().catch(() => { });
    }

    /** Stops and rewinds the background music. @returns {void} */
    stopMusic() {
        if (!this.musicTrack) return;
        this.musicTrack.pause();
        this.musicTrack.currentTime = 0;
        this.musicTrack = null;
    }

    /**
     * Enables or disables every game sound.
     *
     * @param {boolean} muted - Whether audio should be muted.
     * @returns {void}
     */
    setMuted(muted) {
        this.muted = muted;
        if (muted) this.stopActiveSounds();
        if (!this.musicTrack) return;
        if (muted) {
            this.musicTrack.pause();
        } else {
            this.musicTrack.play().catch(() => { });
        }
    }
}
