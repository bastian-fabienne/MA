// ---------------------------------------------------------------------------
// CoinScene.js
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { GAME, OBJECT_TYPES } from '../config.js';
import { ClickableObject } from '../ClickableObject.js';
import { UI } from '../UI.js';

export class CoinScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CoinScene' });

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

    this.add.text(640 / 2, 480 / 4, "Klicke auf Münzen, um Punkte zu sammeln!").setOrigin(0.5, 0.5);

    this._addBackButton();

    // Hier kannst du die Objekte manuell platzieren.
    // Jeder Eintrag: { key: 'star'|'gem'|'circle'|'coin', x: number, y: number }
    const PLACED_OBJECTS = [
      { key: 'coin',   x: 640 / 4, y: 480 / 2 },
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

  // Erzeugt einen klickbaren "Zurück"-Button, der zur GameScene navigiert.
  _addBackButton() {
    const btn = this.add.text(16, 16, '← Zurück', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#333366',
      padding: { x: 10, y: 6 },
    }).setDepth(20).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ color: '#ffff00' }));
    btn.on('pointerout',  () => btn.setStyle({ color: '#ffffff' }));
    btn.on('pointerdown', () => this.scene.start('GameScene'));
  }

  _placeObject(key, x, y) {
    const obj = new ClickableObject(this, x, y, key, (clicked) => {
      this._ui.addPoints(clicked.points);

      // Wenn alle Objekte weggeklickt wurden, zurück zur GameScene.
      // delayedCall wartet bis die Pop-Animation (180ms) fertig ist.
      if (this._objects.every(obj => !obj.alive)) {
        this.time.delayedCall(300, () => this.scene.start('GameScene'));
      }
    });

    // Static Physics Body hinzufügen, damit Arcade Physics die Bounding Box
    // kennt und im Debug-Modus einzeichnen kann. true = statisch (bewegt sich nicht).
    this.physics.add.existing(obj.sprite, true);

    // Fügt das Objekt in die Liste von dieser Szene ein, so wissen wir wie viele Objekte aktuell auf dem Bildschirm sind.
    this._objects.push(obj);
  }
}
