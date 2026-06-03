// ---------------------------------------------------------------------------
// KuMuScene.js
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { GAME, OBJECT_TYPES } from '../config.js';
import { ClickableObject } from '../ClickableObject.js';
import { UI } from '../UI.js';
import { store } from '../Store.js';

export class KuMuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'KuMuScene' });

    // Alle aktuell platzierten Objekte in der Szene
    this._objects = [];
  }

  // Lifecycle Schritt 1: Assets laden.
  // Phaser ruft preload() automatisch vor create() auf.
  // Hier werden alle Bild-Typen aus public/assets/images/ geladen.
  preload() {
    for (const type of OBJECT_TYPES) {
      this.load.image(type.key, `/assets/images/${type.key}.png`);
      this.load.image('KuMuOhniTüre1', `/assets/images/KuMuOhniTüre1.png`);
    }
  }

  // Lifecycle Schritt 2: Szene aufbauen.
  // Wird einmalig aufgerufen, nachdem preload() abgeschlossen ist.
  create() {
    this.add.image(640 / 2, 480 / 2, 'KuMuOhniTüre1');
    this._ui = new UI(this);

    this._addBackButton();
    this._setupInventoryToggle();

    // Hier kannst du die Objekte manuell platzieren.
    // Jeder Eintrag: { key: 'star'|'gem'|'circle'|'coin', x: number, y: number }
    const PLACED_OBJECTS = [
      { key: 'KuMu_Türe', x: 640 / 2, y: 480 / 2 },
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

  // Leertaste öffnet / schließt das Inventar-Overlay.
  _setupInventoryToggle() {
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.scene.isActive('InventoryScene')) {
        this.scene.stop('InventoryScene');
      } else {
        this.scene.launch('InventoryScene');
      }
    });
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

}
