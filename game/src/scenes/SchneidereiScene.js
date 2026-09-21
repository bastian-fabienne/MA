
// ---------------------------------------------------------------------------
// SchneidereiScene.js
// ---------------------------------------------------------------------------
import Phaser from 'phaser';
import { GAME, OBJECT_TYPES } from '../config.js';
import { ClickableObject } from '../ClickableObject.js';
import { UI } from '../UI.js';
import { store } from '../Store.js';
import { Dialog } from '../Dialog.js';

export class SchneidereiScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SchneidereiScene' });


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
       // Alle aktuell platzierten Objekte in der Szene
       this._objects = [];
   
     
       this.load.image(
           "Schneiderei",
           "/assets/images/Schneiderei.png",
       );
     const SPEAKER_IMAGES = [
        'Schneiderin_cut'

     ];
     for (const key of SPEAKER_IMAGES) {
    this.load.image(
    key,
    `/assets/images/${key}.png`,
    );
   }
   
      }
     // Lifecycle Schritt 2: Szene aufbauen.
     // Wird einmalig aufgerufen, nachdem preload() abgeschlossen ist.
     create() {
       this.add.image(640 / 2, 480 / 2, "Schneiderei");
   
       this._ui = new UI(this);
       this._dialog = new Dialog(this);
   
       this._addBackButton();
       this._setupInventoryToggle();
   


      const PLACED_OBJECTS = [
        {key: 'Schneiderin_full',
          x: GAME.width / 3.75,
          y: GAME.height / 1.75,
          size: 1.4,
          speakerName: "Schneiderin",
          speakerImage: "Schneiderin_cut",
          dialog: () => {
         const count = store.getTalkCount('Schneiderin');
        
        if ((store.getState().Brief?.collected ?? 0) > 1) {
        return [
            "Vielen Dank.",
            "Hier der Mantel.",
            "!ITEM:Mantel",
            "Du hast Ottos' Mantel erhalten.",
        ]
        }

        if ((store.getTalkCount('Schneiderin')) > 1) {
         return [
            "Hast du den Brief schon",
            "zur Post gebracht?",
         ]}

          if ((store.getTalkCount('Schneiderin')) > 0) {
          return store.registerType('Brief', 1),
                store.collect('Brief'), 
            [
            "Otto's Mantel?",
            "",
            "Ich hatte noch keine Zeit,",
            "ihn fertigzustellen.",
            "Ich wollte gerade zur Post.",
            "Warum gehst nicht du stattdesssen?",
            "So hätte ich genügend Zeit,",
            "Ottos' Mantel fertigzustellen.",
            "!ITEM:Brief",
            "Du hast einen Brief erhalten.",

          ]}
         return [
          "Wilkommen in meiner Schneiderei",
          "Wie kann ich dir helfen?"
          ]
         }
        },
    ]
       // Alle Objekte aus config.js an ihren festen Positionen platzieren
      for (const { key, x, y, dialog, speakerName, speakerImage, size} of PLACED_OBJECTS) {
         this._placeObject(key, x, y, dialog, speakerName, speakerImage, size);
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
       bg.fillStyle(
         Phaser.Display.Color.ValueToColor(GAME.backgroundColor).color,
         1,
       );
   
       // Fülle ein Rechteck mit der gesetzten Farbe
       bg.fillRect(0, 0, width, height);
     }
   
     // Leertaste öffnet / schließt das Inventar-Overlay.
     _setupInventoryToggle() {
       this.input.keyboard.on("keydown-SPACE", () => {
         if (this.scene.isActive("InventoryScene")) {
           this.scene.stop("InventoryScene");
         } else {
           this.scene.launch("InventoryScene");
         }
       });
     }
   
     // Erzeugt einen klickbaren "Zurück"-Button, der zur GameScene navigiert.
     _addBackButton() {
       const btn = this.add
         .text(16, 16, "Zurück", {
           fontSize: "18px",
           color: "#ffffff",
           backgroundColor: "#333366",
           padding: { x: 10, y: 6 },
         })
         .setDepth(20)
         .setInteractive({ useHandCursor: true });
   
       btn.on("pointerover", () => btn.setStyle({ color: "#ffff00" }));
       btn.on("pointerout", () => btn.setStyle({ color: "#ffffff" }));
       btn.on("pointerdown", () => this.scene.start("MaertScene"));
     }
   
     _startScene(sceneName, sceneClass) {
      this.scene.start(sceneName);
}
   
  _placeObject(key, x, y, dialogLines, speakerName, speakerImage, size) {
    const obj = new ClickableObject(this, x, y, key, (clicked) => {
      const goToLevel = () => {
        if (clicked.sceneName) {
          this._startScene(clicked.sceneName, clicked.sceneClass);
        }
      };



      if (dialogLines) {
        const lines = typeof dialogLines === 'function' ? dialogLines(clicked) : dialogLines;
        if (speakerName) {
           store.timesTalked(speakerName);
          }
           this._dialog.show(lines, goToLevel, speakerName, speakerImage);
           }
       else {
        goToLevel();
       }
        
    }, size,
    );
     
    this._objects.push(obj);
      store.registerType(key, this._objects.filter(o => o.textureKey === key).length);
  }
}
