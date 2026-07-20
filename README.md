# EL Pollo Loco

Ein 2D Jump-'n'-Run-Spiel in Vanilla JavaScript, objektorientiert aufgebaut. Entstanden als Lernprojekt bei der Developer Academy, um OOP-Konzepte (Vererbung, Kapselung) praktisch anzuwenden statt nur in der Theorie zu verstehen.

## Wie ich das Projekt angegangen bin

Bevor ich angefangen habe zu coden, habe ich mir zuerst die Ordnerstruktur überlegt: eigene Ordner für Klassen (`classes`), Level-Daten (`levels`) und Hilfsfunktionen (`utils`), damit das Projekt auch bei wachsendem Umfang übersichtlich bleibt.

Beim Aufbau der Spielfiguren ist mir aufgefallen, dass Charakter, Chicken, BabyChicken und Endboss viele gemeinsame Eigenschaften haben (Position, Bewegung, Schwerkraft, Kollision). Statt das für jede Figur einzeln zu schreiben, habe ich eine gemeinsame Basisklasse `MoveableObject` gebaut, von der alle erben. Das hält den Code kleiner, vermeidet Wiederholung (DRY) und macht Bugs leichter auffindbar – ein Fehler in der Bewegungslogik muss nur an einer Stelle gefixt werden, nicht in vier.

Beim Endboss wollte ich kein stures Hin-und-Her-Patrouillieren von Anfang an. Deshalb steht er zu Beginn still und wird erst aktiv, sobald der Charakter in seine Nähe kommt (Trigger-Radius). Danach patrouilliert er wie ein normales Chicken, nur schneller – er verfolgt den Charakter aber bewusst nicht ständig, damit sich das Kampfverhalten vorhersehbar und fair anfühlt, statt frustrierend zu wirken.

Mein Vorgehen pro Feature: zuerst überlegen, wie ich es angehe und warum genau so – erst danach coden. Grober Zeitaufwand liegt bei ca. 70–80 % Überlegen/Debuggen und 20–30 % tatsächlichem Tippen.

## Aktueller Stand

**Grundgerüst**
- Klassenstruktur mit Vererbung (`DrawableObject` → `MoveableObject` → `Character`/`Chicken`/`BabyChicken`/`Endboss`)
- Kamera folgt dem Charakter, Grenzen sauber an die Levelbreite gekoppelt
- Alle Klassen und komplexeren Methoden mit JSDoc-Kommentaren dokumentiert

**Charakter**
- Bewegung, Sprung, Kollisionserkennung
- Hit-Cooldown: Charakter wird bei Gegnerkontakt nicht durchgehend, sondern nur alle 300ms beschädigt
- Rückstoß bei seitlichem Gegnertreffer, damit er nicht dauerhaft mit dem Gegner überlappt
- Automatische Schlaf-Animation nach 7 Sekunden Inaktivität, wacht bei Bewegung, Treffer oder Flaschenwurf sofort wieder auf
- Lebensanzeige (Statusbar) oben links, zeigt den Energiestand in 20%-Schritten

**Sammelobjekte & Kampf**
- Sammelbare Coins und Flaschen, auf Bodenhöhe im Level platziert, mit eng anliegender Kollisionsbox (kein Einsammeln ohne echte Berührung)
- Wurfsystem mit Cooldown (700ms), damit man nicht durch Halten der Taste spammen kann
- Flaschentreffer und Sprung-auf-Gegner töten normale Chicken/BabyChicken

**Endboss**
- Steht zu Beginn still, wird erst durch Annäherung des Charakters ausgelöst (Trigger-Radius)
- Patrouilliert danach schneller als normale Chicken, ohne den Charakter aktiv zu verfolgen
- Eigene Lebensanzeige, Hurt- und Death-Animation
- Verliert Energie durch Flaschentreffer

**Sound**
- Eigener SoundManager verwaltet alle Effekte zentral
- Sprung-, Coin-, Wurf-, Treffer- und Splash-Sound sowie Game-Over-/Sieg-Sound
- Hintergrundmusik in Dauerschleife, stoppt automatisch bei Spielende oder Rückkehr ins Hauptmenü
- Mute-Button schaltet Musik und Effekte zuverlässig stumm

**Screens & UI**
- Startscreen, Game-Over- und You-Win-Bildschirm mit passendem Hintergrundbild
- Einheitliches Button-Design (Start, Fullscreen, Main Menu, Mute, Pause)
- In-Game-Buttons sind im Hauptmenü ausgeblendet und erscheinen erst nach Spielstart
- Fullscreen-Modus vergrößert die komplette Seite sauber zentriert, inklusive Hintergrund
- Mobile-Steuerung mit Touch-Buttons (funktioniert auf jeder Bildschirmgröße), Tastatur-Hinweise werden auf Touch-Geräten automatisch ausgeblendet
- Rotate-Hinweis bei Hochformat auf kleinen Screens
- Seite ist nicht mehr versehentlich scrollbar
- Impressum über eigenen Button erreichbar

**Sonstiges**
- Character-Death-Animation läuft einmal durch und bleibt im letzten Bild stehen
- Kein `console.log` im Produktivcode

## Technologien

Vanilla JavaScript (objektorientiert), HTML5 Canvas, CSS