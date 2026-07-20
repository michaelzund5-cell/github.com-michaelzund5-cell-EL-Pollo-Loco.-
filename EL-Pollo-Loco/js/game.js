// Aktueller Canvas und die laufende World-Instanz (null, solange kein Spiel läuft).
let canvas;
let world;
let isMuted = false;
window.isGamePaused = false;
window.isMuted = false;

/**
 * Wird beim Laden der Seite aufgerufen (siehe body onload in index.html).
 * Bindet alle Buttons/Controls und versteckt die In-Game-Buttons initial,
 * solange der Startbildschirm sichtbar ist.
 */
function init() {
    canvas = document.getElementById("canvas");
    bindButtonEvents();
    bindMobileControls();
    bindFullscreenChangeListener();
    hideGameActions();
}

/** Registriert Listener, die den Fullscreen-Button-Status aktuell halten. */
function bindFullscreenChangeListener() {
    document.addEventListener("fullscreenchange", updateFullscreenButton);
    document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
}

/** Passt Text und Farbe des Fullscreen-Buttons an den aktuellen Zustand an. */
function updateFullscreenButton() {
    const btn = document.getElementById("fullscreen-btn");
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);

    btn.classList.toggle("active", isFullscreen);
    btn.textContent = isFullscreen ? "Exit Fullscreen" : "Fullscreen";
}

/** Öffnet das Impressum-Fenster. */
function openImprint() {
    document.getElementById("imprint-modal").classList.remove("hidden");
}

/** Schließt das Impressum-Fenster. */
function closeImprint() {
    document.getElementById("imprint-modal").classList.add("hidden");
}

/** Verknüpft alle festen UI-Buttons mit ihren jeweiligen Klick-Funktionen. */
function bindButtonEvents() {
    document.getElementById("fullscreen-btn").addEventListener("click", fullscreenGame);
    document.getElementById("restart-btn").addEventListener("click", restartGame);
    document.getElementById("mute-btn").addEventListener("click", toggleMute);
    document.getElementById("start-game-btn").addEventListener("click", startGame);
    document.getElementById("pause-btn").addEventListener("click", togglePause);
}

/**
 * Startet ein neues Spiel: beendet ein evtl. laufendes vorheriges Spiel,
 * blendet Start-/End-/Pause-Overlays aus, zeigt die In-Game-Buttons und
 * erzeugt eine frische World-Instanz.
 */
function startGame() {
    if (world) world.stop();

    window.isGamePaused = false;
    updatePauseButton();
    hideStartScreen();
    hideEndScreen();
    hidePauseOverlay();
    showGameActions();
    world = new World(canvas);
}

/**
 * Beendet das laufende Spiel und kehrt zum Startbildschirm (Hauptmenü)
 * zurück. Der Button dafür heißt bewusst "Main Menu", nicht "Restart",
 * weil genau das hier passiert.
 */
function restartGame() {
    if (world) {
        world.stop();
        world = null;
    }

    window.isGamePaused = false;
    updatePauseButton();
    hideEndScreen();
    hidePauseOverlay();
    hideGameActions();
    showStartScreen();
}

/** Blendet die In-Game-Buttons (Fullscreen/Main Menu/Mute/Pause) ein. */
function showGameActions() {
    document.querySelector(".game-actions")?.classList.remove("hidden");
}

/** Blendet die In-Game-Buttons aus (z.B. während der Startbildschirm sichtbar ist). */
function hideGameActions() {
    document.querySelector(".game-actions")?.classList.add("hidden");
}

/**
 * Wechselt in den bzw. aus dem Vollbildmodus. Nutzt die gesamte Seite
 * (.page) als Fullscreen-Ziel, nicht nur den Canvas-Kasten, damit Titel
 * und Steuerungshinweise mit vergrößert werden können.
 */
function fullscreenGame() {
    const target = document.querySelector(".page") || document.documentElement;

    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (target.requestFullscreen) {
        target.requestFullscreen();
    }
}

/** Schaltet Musik und Sound-Effekte stumm bzw. wieder an. */
function toggleMute() {
    isMuted = !isMuted;
    window.isMuted = isMuted;
    document.getElementById("mute-btn").textContent = isMuted ? "Unmute" : "Mute";
    world?.sound.setMuted(isMuted);
}

/**
 * Pausiert bzw. setzt das laufende Spiel fort. Setzt dabei auch alle
 * Tasten-Zustände zurück, damit z.B. kein Dauerlauf hängen bleibt.
 */
function togglePause() {
    if (!world || world.gameFinished) return;

    window.isGamePaused = !window.isGamePaused;
    world.keyboard.reset();
    updatePauseButton();

    if (window.isGamePaused) {
        showPauseOverlay();
    } else {
        hidePauseOverlay();
    }
}

/** Aktualisiert die Beschriftung des Pause-Buttons (Pause/Resume). */
function updatePauseButton() {
    const pauseButton = document.getElementById("pause-btn");
    pauseButton.textContent = window.isGamePaused ? "Resume" : "Pause";
}

/** Verknüpft alle vier Touch-Buttons mit den entsprechenden Tasten-Zuständen. */
function bindMobileControls() {
    bindHoldButton("btn-left", "LEFT");
    bindHoldButton("btn-right", "RIGHT");
    bindHoldButton("btn-jump", "SPACE");
    bindHoldButton("btn-throw", "THROW");
}

/**
 * Bindet einen einzelnen Touch-Button so, dass er sich wie eine gehaltene
 * Taste verhält: gedrückt beim Antippen, losgelassen beim Loslassen.
 * Events werden explizit als nicht-passiv registriert, damit
 * preventDefault() zuverlässig funktioniert (sonst gibt es Browser-Fehler).
 * @param {string} buttonId - ID des Buttons im HTML.
 * @param {string} keyName - Name der Eigenschaft im Keyboard-Objekt (z.B. "LEFT").
 */
function bindHoldButton(buttonId, keyName) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const setKey = (value) => {
        if (!world?.keyboard) return;
        world.keyboard[keyName] = value;
    };

    ["pointerdown", "touchstart"].forEach((eventName) => {
        button.addEventListener(eventName, (event) => {
            event.preventDefault();
            setKey(true);
        }, { passive: false });
    });

    ["pointerup", "pointercancel", "pointerleave", "touchend"].forEach((eventName) => {
        button.addEventListener(eventName, (event) => {
            event.preventDefault();
            setKey(false);
        }, { passive: false });
    });
}

/** Blendet den Startbildschirm aus. */
function hideStartScreen() {
    document.getElementById("start-screen").classList.add("hidden");
}

/** Zeigt den Startbildschirm wieder an. */
function showStartScreen() {
    document.getElementById("start-screen").classList.remove("hidden");
}

/** Blendet den Game-Over-/Sieg-Bildschirm aus und setzt seine Zustandsklassen zurück. */
function hideEndScreen() {
    const endScreen = document.getElementById("end-screen");
    if (!endScreen) return;
    endScreen.classList.add("hidden");
    endScreen.classList.remove("won", "lost");
}

/** Zeigt das Pause-Overlay an. */
function showPauseOverlay() {
    document.getElementById("pause-overlay")?.classList.remove("hidden");
}

/** Blendet das Pause-Overlay aus. */
function hidePauseOverlay() {
    document.getElementById("pause-overlay")?.classList.add("hidden");
}
