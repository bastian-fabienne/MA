// ---------------------------------------------------------------------------
// EndScene.js
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { GAME, OBJECT_TYPES } from '../config.js';
import { ClickableObject } from '../ClickableObject.js';
import { Dialog } from '../Dialog.js';
import { UI } from '../UI.js';

export class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });

    
    this._objects = [];
  }

  preload() {
    for (const type of OBJECT_TYPES) {
      this.load.image(type.key, `/assets/images/${type.key}.png`);
    }
  }

  create() {
    this._objects = [];
    this._drawBackground();
    this._ui = new UI(this);

    this._dialog = new Dialog(this);

    this.add.text(GAME.width / 2, GAME.height / 5, 'Gratulation.').setOrigin(0.5, 0.5)
      this.add.text(GAME.width / 2, GAME.height / 3, 'Du hast mein Spiel geschafft.').setOrigin(0.5, 0.5)
    this.add.text(GAME.width / 2, GAME.height / 2, 'Vielen Dank fürs spielen :-)').setOrigin(0.5, 0.5)
    this.add.text(GAME.width / 2, GAME.height / 1.5, 'Drücke hier um zum Startscreen zurückzukehren').setOrigin(0.5, 0.5)

 
    const PLACED_OBJECTS = [];
    
   
    for (const { key, x, y, dialog } of PLACED_OBJECTS) {
      this._placeObject(key, x, y, dialog);
    }

  this._addStartButton();
  }


  _drawBackground() {
   
    const { width, height } = this.scale;

   
    const bg = this.add.graphics();

   
    bg.fillStyle(Phaser.Display.Color.ValueToColor(GAME.backgroundColor).color, 1);
    
   
    bg.fillRect(0, 0, width, height);
  }

  

  
  _addStartButton() {
    const btn = this.add
      .text(GAME.width / 2, GAME.height/ 1.25, "New Game", {
        fontSize: "18px",
        color: "#000000",
        backgroundColor: "#777777",
        padding: { x: 100, y: 20 },
      })
      .setOrigin(0.5)
      .setDepth(20)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => btn.setStyle({ color: "#ffffff" }));
    btn.on("pointerout", () => btn.setStyle({ color: "#000000" }));
    btn.on("pointerdown", () => this.scene.start("GameScene"));
  }
}
