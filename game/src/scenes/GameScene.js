// ---------------------------------------------------------------------------
// GameScene.js
// Hauptszene: lädt Assets, erzeugt programmatische Texturen und platziert
// alle Spielobjekte anhand der in config.js definierten PLACED_OBJECTS-Liste.
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { GAME, OBJECT_TYPES } from '../config.js';
import { ClickableObject } from '../ClickableObject.js';
import { Dialog } from '../Dialog.js';
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

    // Dialog-Box anlegen (ist zu Beginn unsichtbar).
    this._dialog = new Dialog(this);

    this.add.text(GAME.width / 2, GAME.height / 4, "Zu welchem Level möchtest du?").setOrigin(0.5, 0.5)

    // Hier kannst du die Objekte manuell platzieren.
    // Jeder Eintrag: { key: 'star'|'gem'|'circle'|'coin', x: number, y: number, dialog? }
    //   dialog (optional): Array von Textzeilen. Ist es gesetzt, erscheint
    //   beim Klick zuerst ein Dialog. Sobald der Dialog fertig gelesen ist,
    //   wird (falls vorhanden) zum passenden Level gewechselt.
    const PLACED_OBJECTS = [
      {
        key: 'star',
        x: GAME.width / 4,
        y: GAME.height / 2,
        dialog: [
          "Du hast den Stern angeklickt!",
          "Drücke Enter um weiterzulesen.",
          "Danach geht es zum Level.",
          "Los geht's!",
        ],
      },
      { key: 'coin',   x: GAME.width * 3 / 4, y: GAME.height / 2 },
      { key: 'KuMu_Türe', x: GAME.width / 2, y: GAME.height / 2 },
    ];

    // Alle Objekte aus config.js an ihren festen Positionen platzieren
    for (const { key, x, y, dialog } of PLACED_OBJECTS) {
      this._placeObject(key, x, y, dialog);
    }

    this._setupInventoryToggle();
    this._setupKuMu();
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

  // dialogLines (optional): Ist der Parameter gesetzt, zeigt DIESE Instanz
  // beim Klick zuerst einen Dialog. Nach dem Schliessen des Dialogs wird zum
  // Level gewechselt. Ohne Dialog wird sofort gewechselt.
  _placeObject(key, x, y, dialogLines) {
    const obj = new ClickableObject(this, x, y, key, (clicked) => {
      const goToLevel = () => {
        if (clicked.sceneName) {
          this._startScene(clicked.sceneName, clicked.sceneClass);
        }
      };

      // Mit Dialog: erst Text zeigen, danach das Level wechseln.
      // Ohne Dialog: direkt das Level wechseln.
      if (dialogLines) {
        this._dialog.show(dialogLines, goToLevel);
      } else {
        goToLevel();
      }
    });

    // Static Physics Body hinzufügen, damit Arcade Physics die Bounding Box
    // kennt und im Debug-Modus einzeichnen kann. true = statisch (bewegt sich nicht).
    this.physics.add.existing(obj.sprite, true);

    // Fügt das Objekt in die Liste von dieser Szene ein, so wissen wir wie viele Objekte aktuell auf dem Bildschirm sind.
    this._objects.push(obj);
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

  _setupKuMu() {
    this.input.keyboard.on('keydown-M', () => {
      if (this.scene.isActive('KuMuScene')) {
        this.scene.stop('KuMuScene');
      } else {
        this.scene.launch('KuMuScene');
      }
    });
  }


  // Registriert eine Szene lazily (falls noch nicht bekannt) und startet sie.
  _startScene(sceneName, sceneClass) {
    if (!this.scene.manager.keys[sceneName]) {
      this.scene.add(sceneName, sceneClass, false);
    }
    this.scene.start(sceneName);
  }
}
