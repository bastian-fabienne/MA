// ---------------------------------------------------------------------------
// UI.js
// HUD-Anzeige: Score und Hinweis-Text.
// Kapselt alle Phaser.GameObjects.Text die zum Interface gehören.
// ---------------------------------------------------------------------------

export class UI {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    const { width } = scene.scale;

    this._score = 0;

    this._scoreText = scene.add
      .text(16, 16, 'Score: 0', {
        fontSize: '26px',
        fontFamily: 'monospace',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setDepth(10);

    scene.add
      .text(
        width / 2,
        14,
        'Objekte anklicken – nur die sichtbare Form trifft!',
        {
          fontSize: '13px',
          fontFamily: 'monospace',
          color: '#94a3b8',
        },
      )
      .setOrigin(0.5, 0)
      .setDepth(10);
  }

  /** Addiert Punkte und aktualisiert die Anzeige. */
  addPoints(points) {
    this._score += points;
    this._scoreText.setText(`Score: ${this._score}`);
  }

  getScore() {
    return this._score;
  }
}
