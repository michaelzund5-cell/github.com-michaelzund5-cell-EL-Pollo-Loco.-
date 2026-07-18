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

**Charakter**
- Bewegung, Sprung, Kollisionserkennung
- Hit-Cooldown: Charakter wird bei Gegnerkontakt nicht durchgehend, sondern nur alle 800ms beschädigt
- Rückstoß bei seitlichem Gegnertreffer, damit er nicht dauerhaft mit dem Gegner überlappt und mehrfach hintereinander Schaden nimmt
- Automatische Schlaf-Animation nach 7 Sekunden Inaktivität, wacht bei Bewegung sofort wieder auf
- Lebensanzeige (Statusbar) oben links, zeigt den Energiestand in 20%-Schritten

**Sammelobjekte & Kampf**
- Sammelbare Coins und Flaschen, auf Bodenhöhe im Level platziert
- Wurfsystem mit Cooldown (700ms), damit man nicht durch Halten der Taste spammen kann
- Flaschentreffer und Sprung-auf-Gegner töten normale Chicken/BabyChicken

**Endboss**
- Steht zu Beginn still, wird erst durch Annäherung des Charakters ausgelöst (Trigger-Radius)
- Patrouilliert danach schneller als normale Chicken, ohne den Charakter aktiv zu verfolgen
- Eigene Lebensanzeige, Hurt- und Death-Animation
- Verliert Energie durch Flaschentreffer

**Screens & UI**
- Startscreen, Game-Over- und You-Win-Bildschirm mit passendem Hintergrundbild
- Einheitliches Button-Design (Start, Fullscreen, Restart, Mute, Pause)
- Fullscreen-Modus vergrößert die komplette Seite sauber zentriert, inklusive Hintergrund
- Mobile-Steuerung mit Touch-Buttons, responsives Layout für kleine Screens und Querformat

**Sonstiges**
- Character-Death-Animation läuft einmal durch und bleibt im letzten Bild stehen

## Was als Nächstes kommt

- Sound-Effekte einbauen (Sprung, Coin, Wurf, Treffer, Hintergrundmusik) – aktuell einziger fehlender Punkt
- Code-Kommentare an Klassen und komplexeren Methoden ergänzen, damit sich das Projekt bei wachsender Größe weiterhin schnell lesen lässt
- console.log-Reste im Produktivcode entfernen

## Technologien

Vanilla JavaScript (objektorientiert), HTML5 Canvas, CSS