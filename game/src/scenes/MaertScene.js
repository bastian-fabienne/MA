// ---------------------------------------------------------------------------
// MaertScene.js
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { GAME, OBJECT_TYPES } from '../config.js';
import { ClickableObject } from '../ClickableObject.js';
import { UI } from '../UI.js';
import { store } from '../Store.js';
import { Dialog } from '../Dialog.js';

export class MaertScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MaertScene' });

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
    this.load.image(
        "Maert",
        `/assets/images/Maert.png`,
      );
  };

  // Lifecycle Schritt 2: Szene aufbauen.
  // Wird einmalig aufgerufen, nachdem preload() abgeschlossen ist.
  create() {
    this._ui = new UI(this);

    this._dialog = new Dialog(this);


    this.add.image(640 / 2, 480 / 2, 'Maert');
    this._addBackButton();
    this._setupInventoryToggle();
    this.add.image()

    // Hier kannst du die Objekte manuell platzieren.
    // Jeder Eintrag: { key: 'star'|'gem'|'circle'|'coin', x: number, y: number }
    const PLACED_OBJECTS = [
      {key: 'OttoFull', 
        x: 640 / 3.1, 
        y: 480 / 1.310,
        speakerName: "Otto Abt",
        dialog: [
          "Hallo",
          "Mein Name ist Otto Abt.",
          "Ich bin Künstler.",
          "Freut mich dich kennenzulernen.",
        ]
      },

      {key: 'Statist_2',
        x: 640 / 1.01,
        y: 480 / 1.310,
        speakerName: 'Mann',
        dialog: [
          "Ich bin verspätet.",
          "Bitte lass mich in Ruhe.",
        ]
      },
      {key: 'Statist_5',
        x: 640 / 13,
        y: 480 / 1.37,
        speakerName: 'Frau',
        dialog: [
          "Hallo.",
          "Ich habe zu tun.",
        ]
      },
      {key: 'Reservierer_full',
        x: 640 / 1.31,
        y: 480 / 1.3,
        speakerName: 'Herr in grau',
        dialog: [
          "Guten Tag.",
        ]
      },
      {key: 'ZitigsBueb_ganz',
        x: 640 / 2,
        y: 480 / 1.31,
        speakerName: 'Zeitungsjunge',
        dialog: [
          "Ich verkaufe Zeitungen.",
          "Leider habe ich nur noch eine übrig.",
          "Und die ist für den netten Mann",
          "in Grau reserviert."
        ]
      },
    ];

    // Alle Objekte aus config.js an ihren festen Positionen platzieren
    for (const { key, x, y, dialog, speakerName } of PLACED_OBJECTS) {
      this._placeObject(key, x, y, dialog, speakerName);
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
    const btn = this.add.text(16, 16, 'Exit', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#474789',
      padding: { x: 10, y: 6 },
    }).setDepth(20).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ color: '#ffff00' }));
    btn.on('pointerout',  () => btn.setStyle({ color: '#ffffff' }));
    btn.on('pointerdown', () => this.scene.start('GameScene'));
  }

  _placeObject(key, x, y, dialogLines, speakerName) {
    const obj = new ClickableObject(this, x, y, key, (clicked) => {
      const goToLevel = () => {
        if (clicked.sceneName) {
          this._startScene(clicked.sceneName, clicked.sceneClass);
        }
      };
      if (dialogLines) {
        this._dialog.show(dialogLines, goToLevel, speakerName);
      } else {
        goToLevel();
      }
    });

  }
}
