// ---------------------------------------------------------------------------
// ClickableObject.js
// Spielobjekt-Entity: ein Sprite mit pixel-perfect Alpha-Masken-Input.
//
// Wie die Pixel-genaue Maske funktioniert:
//   Phaser's setInteractive({ pixelPerfect: true }) liest den Alpha-Wert
//   des Textur-Pixels unter dem Mauszeiger aus. Ein Klick wird nur registriert
//   wenn Alpha > alphaTolerance (Standard: 1). Dadurch werden transparente
//   Bereiche (z.B. die Ecken eines Sterns) ignoriert – der Klickbereich
//   entspricht exakt der sichtbaren Form.
// ---------------------------------------------------------------------------

import { OBJECT_TYPES } from './config.js';

const ALPHA_TOLERANCE = 10; // 0–255: Pixel muss mindestens diesen Alpha-Wert haben

export class ClickableObject {
  /**
   * @param {Phaser.Scene}  scene
   * @param {number}        x
   * @param {number}        y
   * @param {string}        textureKey  – muss in TextureFactory registriert sein
   * @param {function}      onClicked   – Callback(clickableObject)
   */
  constructor(scene, x, y, textureKey, onClicked) {
    this.scene = scene;
    this.textureKey = textureKey;
    this.onClicked = onClicked;
    this.alive = true;

    const typeDef = OBJECT_TYPES.find((t) => t.key === textureKey);
    this.points = typeDef?.points ?? 10;

    // Sprite anlegen
    this.sprite = scene.add.image(x, y, textureKey);

    // ── Pixel-perfect Input aktivieren ──────────────────────────────────────
    // pixelPerfect: true  → Phaser liest den Alpha-Kanal der Textur aus.
    // alphaTolerance       → Pixel unter diesem Alpha-Wert gelten als "nicht getroffen".
    this.sprite.setInteractive({
      pixelPerfect: true,
      alphaTolerance: ALPHA_TOLERANCE,
    });

    // Hover-Feedback
    this.sprite.on('pointerover', () => this._onHover(true));
    this.sprite.on('pointerout',  () => this._onHover(false));

    // Klick-Handler
    this.sprite.on('pointerdown', () => this._handleClick());
  }

  // ── Private Methoden ──────────────────────────────────────────────────────

  _onHover(isOver) {
    if (!this.alive) return;
    this.sprite.setScale(isOver ? 1.15 : 1.0);
    this.scene.game.canvas.style.cursor = isOver ? 'pointer' : 'default';
  }

  _handleClick() {
    if (!this.alive) return;
    this.alive = false;

    // Cursor zurücksetzen
    this.scene.game.canvas.style.cursor = 'default';

    // Pop-Animation: kurz skalieren, dann zerstören
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.6,
      scaleY: 1.6,
      alpha: 0,
      duration: 180,
      ease: 'Power2',
      onComplete: () => {
        this.sprite.destroy();
      },
    });

    // Punkte-Label kurz einblenden
    this._spawnPointsLabel();

    // Callback aufrufen
    this.onClicked(this);
  }

  _spawnPointsLabel() {
    const label = this.scene.add.text(
      this.sprite.x,
      this.sprite.y - 10,
      `+${this.points}`,
      {
        fontSize: '22px',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      },
    ).setOrigin(0.5);

    this.scene.tweens.add({
      targets: label,
      y: label.y - 55,
      alpha: 0,
      duration: 700,
      ease: 'Power1',
      onComplete: () => label.destroy(),
    });
  }
}
