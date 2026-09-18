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

    const SPEAKER_IMAGES = [
    "OttoAbt",
    "Statist_2",
    "Statist_5",
    "Reservierer_cut",
    "ZitigsBueb_cut",
    ];

    for (const key of SPEAKER_IMAGES) {
    this.load.image(
    key,
    `/assets/images/${key}.png`,
  );
  }
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
        speakerImage: "OttoAbt",
        dialog: () => {
         const count = store.getTalkCount('Otto Abt');
         if ((store.getState().Zitig?.collected ?? 0) > 0) {
          return [
            "Juhu!",
            "",
            "!ITEM:Schlussel",
            "Hier mein Schlüssel.",
            "Er öffnet dir die Tür",
            "zu meinem Atelier.",
            "Es ist gleich dort drüben.",
          ]
         }
          if (((store.getTalkCount('Zeitungsjunge') > 0) && (store.getTalkCount('Herr in grau') > 0)) && (store.getTalkCount('Otto Abt') > 1)) {
            store.registerType('Zigarette', 1)
            store.collect('Zigarette')
            return [
              "Du hast den Typen gefunden?",
              "Super!",
              "Wie bitte?",
              "Er möchte eine Zigarette defür?",
              "*Seufz*",
              "",
              "Ich wollte sowieso mit",
              "dem Rauchen aufhören.",
              "!ITEM:Zigarette", 
              "Hier bitteschön.",
            ]
          }
          if ((store.getTalkCount('Zeitungsjunge') >0) && (store.getTalkCount('Otto Abt') > 1)) {
            return [
              "Was?",
              "Die letzte Ausgabe ist reserviert?",
              "Ich bin überzeugt,",
              "wir finden einen Weg.",
              "Sprich doch einmal mit dem Herrn,",
              "Der die Zeitung reserviert hat.",
            ]
          }
          if (count > 0) {
            return [
           "Bevor ich mit dir plaudere,",
           "Möchte ich die heutige Zeitung lesen.",
           "Kaufst du mir bitte eine",
           "von dem Zeitungsjungen dort drüben?",
           ]
          }
          return [ 
            "Hallo",
            "Mein Name ist Otto Abt.",
            "Ich bin Künstler.",
            "Freut mich dich kennenzulernen.",  
          ];  
          }
      },

      
      {key: 'Statist_2',
        x: 640 / 1.01,
        y: 480 / 1.310,
        speakerName: 'Mann',
        speakerImage: "Statist_2",
        dialog: () => {
         const count = store.getTalkCount('Mann');
         if (count > 0) {
            return [
           "ich habe wirklch keine Zeit",
           "für so etwas.",
           ]
          }
          return [
            "Ich bin verspätet.",
            "Bitte lass mich in Ruhe.",
          ]
        }
      },
      {key: 'Statist_5',
        x: 640 / 13,
        y: 480 / 1.37,
        speakerName: 'Frau',
        speakerImage: "Statist_5",
        dialog: [
          "Hallo.",
          "Ich habe zu tun.",
        ]
      },
      {key: 'Reservierer_full',
        x: 640 / 1.31,
        y: 480 / 1.3,
        speakerName: 'Herr in grau',
        speakerImage: "Reservierer_cut",
        dialog: () => {
         const count = store.getTalkCount('Herr in grau');
         if ((store.getState().Zigarette?.collected ?? 0) > 0) {
          return store.registerType('Zitig', 1),
                 store.collect('Zitig'),
          [
            "Vielen dank.",
            "Hier die Zeitung.",
            "!ITEM:Zitig",
          ]
        }
           if ((store.getTalkCount('Zeitungsjunge') > 0) && (count > 0) && (store.getTalkCount('Otto Abt') > 0)) {
            return [
            "Ich lege sehr viel Wert",
            "auf meine Zeigung.",
            "Aber ich würde sie",
            "gegen eine Zigarette tauschen."
          ];
          }
          if (count > 0) {
            return [
           "Suchen Sie jemanden?",
           ]
          }
          return [ 
            "Guten Tag.", 
            ];  
          }
      },
      {key: 'ZitigsBueb_ganz',
        x: 640 / 2,
        y: 480 / 1.31,
        speakerName: 'Zeitungsjunge',
        speakerImage: "ZitigsBueb_cut",
       dialog: () => {
        const count = store.getTalkCount('Zeitungsjunge');
        if (store.getTalkCount('Otto Abt') > 0) {
          return [
            "Eine Ausgabe für Otto Abt?",
          "Tut mir leid.",
          "Die letzte Ausgabe ist für",
          "Herr Stone reserviert.",
          "Das ist der nette Herr in grau",
          "dort drüben.",
          ]
        }
        return [ 
          "Ich verkaufe Zeitungen.",
          "Möchten Sie eine kaufen?",
          ];
        },
      },   
    ];
    
  //if ((store.getState().star?.collected ?? 0) > 0) {
   if (store.getTalkCount('Otto Abt') > 0) {
    PLACED_OBJECTS.push({
      key: 'Atelier_Türe',
      x: 640 / 6,
      y: 480 / 1.49,
    });
}

    // Alle Objekte aus config.js an ihren festen Positionen platzieren
    for (const { key, x, y, dialog, speakerName, speakerImage} of PLACED_OBJECTS) {
      this._placeObject(key, x, y, dialog, speakerName, speakerImage);
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

  _startScene(sceneName, sceneClass) {
    this.scene.start(sceneName);
}

  _placeObject(key, x, y, dialogLines, speakerName, speakerImage) {
    const obj = new ClickableObject(this, x, y, key, (clicked) => {
      const goToLevel = () => {
        if (clicked.sceneName) {
          this._startScene(clicked.sceneName, clicked.sceneClass);
        }
      };
      if (dialogLines) {
        const lines = typeof dialogLines === 'function' ? dialogLines() : dialogLines;
        if (speakerName) {
           store.timesTalked(speakerName);
          }
           this._dialog.show(lines, goToLevel, speakerName, speakerImage);
           } else {
            goToLevel();
          }
          
    });
      this._objects.push(obj);
      store.registerType(key, this._objects.filter(o => o.textureKey === key).length);
  }
  
}
