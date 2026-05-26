// ---------------------------------------------------------------------------
// InventoryScene.js
// Overlay-Szene: zeigt den globalen Store als Inventar an.
//
// Wird mit this.scene.launch('InventoryScene') über einer anderen Szene
// gestartet und mit this.scene.stop('InventoryScene') wieder geschlossen.
// Die darunterliegende Szene läuft dabei weiter (pause wäre auch möglich).
//
// Öffnen / Schließen: Leertaste (geregelt von der jeweiligen Eltern-Szene)
// ---------------------------------------------------------------------------

import Phaser from 'phaser';
import { store } from '../Store.js';

const PAD = 24;          // Innenabstand des Panels
const ROW_HEIGHT = 48;   // Höhe einer Inventar-Zeile

export class InventoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InventoryScene' });
  }

  create() {
    const { width, height } = this.scale;

    // ── Abdunkelndes Overlay ──────────────────────────────────────────────
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);

    // ── Panel ─────────────────────────────────────────────────────────────
    const panelW = 340;
    const state = store.getState();
    const entries = Object.entries(state);
    const panelH = PAD * 2 + 40 + entries.length * ROW_HEIGHT + 20;
    const panelX = (width - panelW) / 2;
    const panelY = (height - panelH) / 2;

    this.add.rectangle(panelX, panelY, panelW, panelH, 0x1a1a4e)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x6666cc);

    // ── Titel ─────────────────────────────────────────────────────────────
    this.add.text(width / 2, panelY + PAD, 'Inventar', {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5, 0);

    // ── Einträge aus dem Store ─────────────────────────────────────────────
    if (entries.length === 0) {
      this.add.text(width / 2, panelY + PAD + 50, 'Noch nichts eingesammelt.', {
        fontSize: '16px',
        color: '#aaaaaa',
      }).setOrigin(0.5, 0);
    } else {
      entries.forEach(([key, { collected, total }], i) => {
        const rowY = panelY + PAD + 44 + i * ROW_HEIGHT;
        const allCollected = collected >= total;

        // Icon (Sprite aus dem Texture-Cache, falls vorhanden)
        if (this.textures.exists(key)) {
          this.add.image(panelX + PAD + 16, rowY + ROW_HEIGHT / 2, key)
            .setDisplaySize(32, 32)
            .setAlpha(allCollected ? 1 : 0.4);
        }

        // Name des Typs
        this.add.text(panelX + PAD + 44, rowY + ROW_HEIGHT / 2, key, {
          fontSize: '18px',
          color: allCollected ? '#ffffff' : '#aaaaaa',
        }).setOrigin(0, 0.5);

        // Fortschrittsanzeige: "2 / 3"
        const countText = `${collected} / ${total}`;
        this.add.text(panelX + panelW - PAD, rowY + ROW_HEIGHT / 2, countText, {
          fontSize: '18px',
          color: allCollected ? '#66ff66' : '#ffaa33',
        }).setOrigin(1, 0.5);
      });
    }

    // ── Hinweis zum Schließen ──────────────────────────────────────────────
    this.add.text(width / 2, panelY + panelH - PAD, '[Leertaste] Schließen', {
      fontSize: '13px',
      color: '#666688',
    }).setOrigin(0.5, 1);

    // ── Leertaste schließt das Inventar wieder ─────────────────────────────
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.stop();
    });
  }
}
