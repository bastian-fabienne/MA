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
    // Erklärung: Hier wird ein Muster mit "Sichtbarkeit" von Variablen verwendet.
    // Man macht das, weil diese Variable einer bestimmten Logik folgen soll. Das 
    // heisst Score kann nicht irgendwie gesetzt werden, sondern es kann nur über
    // die Funktionen in dieser Klasse verändert werden. So hat man Kontrolle darüber
    // wie sich eine Variable verändert. Man sagt das diese Variable "privat" ist,
    // und somit nur für die Klasse selber lesbar. Man macht eine Variable "privat"
    // indem man this._score verwendet. Das "this" bezieht sich auf "diese" Klasse,
    // und mit dem "_" sagt man das die Variable "privat" ist. Es braucht immer beide
    // Teile.
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
