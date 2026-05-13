// ---------------------------------------------------------------------------
// GameScene.js
// Hauptszene: lädt Assets, erzeugt programmatische Texturen und platziert
// alle Spielobjekte anhand der in config.js definierten PLACED_OBJECTS-Liste.
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { GAME, OBJECT_TYPES } from '../config.js';
import { ClickableObject } from '../ClickableObject.js';
import { UI } from '../UI.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    // Alle aktuell platzierten Objekte in der Szene
    this._objects = [];
  }

  // Lifecycle Schritt 1: Assets laden.
  // Phaser ruft preload() automatisch vor create() auf.
  // Hier werden alle Bild-Typen aus public/assets/images/ geladen.
  preload() {
    for (const type of OBJECT_TYPES) {
      this.load.image(type.key, `/assets/images/${type.key}.png`);
    }
  }

  // Lifecycle Schritt 2: Szene aufbauen.
  // Wird einmalig aufgerufen, nachdem preload() abgeschlossen ist.
  create() {
    this._drawBackground();
    this._ui = new UI(this);

    this.add.text(640 / 2, 480 / 4, "Zu welchem Level möchtest du?").setOrigin(0.5, 0.5)

    // Hier kannst du die Objekte manuell platzieren.
    // Jeder Eintrag: { key: 'star'|'gem'|'circle'|'coin', x: number, y: number }
    const PLACED_OBJECTS = [
      { key: 'star',   x: 640 / 4, y: 480 / 2 },
      { key: 'coin',   x: 640 * 3 / 4, y: 480 / 2 },
    ];

    // Alle Objekte aus config.js an ihren festen Positionen platzieren
    for (const { key, x, y } of PLACED_OBJECTS) {
      this._placeObject(key, x, y);
    }
  }

  // update() wird hier nicht benötigt, da die Objekte feststehen.

  // ── Private Hilfsmethoden ─────────────────────────────────────────────────

  _drawBackground() {
    // Lies Höhe und Breite aus dem Spiel (nicht die Configversion, könnte sich ja im Spiel ändern...)
    const { width, height } = this.scale;

    // Füge eine neue Grafik zur Szene hinzu
    const bg = this.add.graphics();

    // Setze Farbe in der gezeichnet wird
    bg.fillStyle(Phaser.Display.Color.ValueToColor(GAME.backgroundColor).color, 1);
    
    // Fülle ein Rechteck mit der gesetzten Farbe
    bg.fillRect(0, 0, width, height);
  }

  _placeObject(key, x, y) {
    const obj = new ClickableObject(this, x, y, key, (clicked) => {
      this._startScene(clicked.sceneName, clicked.sceneClass);
    });

    // Static Physics Body hinzufügen, damit Arcade Physics die Bounding Box
    // kennt und im Debug-Modus einzeichnen kann. true = statisch (bewegt sich nicht).
    this.physics.add.existing(obj.sprite, true);

    // Fügt das Objekt in die Liste von dieser Szene ein, so wissen wir wie viele Objekte aktuell auf dem Bildschirm sind.
    this._objects.push(obj);
  }

  // Registriert eine Szene lazily (falls noch nicht bekannt) und startet sie.
  _startScene(sceneName, sceneClass) {
    if (!this.scene.manager.keys[sceneName]) {
      this.scene.add(sceneName, sceneClass, false);
    }
    this.scene.start(sceneName);
  }
}
