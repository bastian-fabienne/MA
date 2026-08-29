// ---------------------------------------------------------------------------
// Dialog.js
// Einfache Dialog-Box im Stil der alten Pokémon-Spiele.
//
// - Am unteren Bildschirmrand erscheint eine Box mit Text.
// - Es werden immer nur 2 Zeilen aufs Mal angezeigt.
// - Ist der Text länger, drückt man die Enter-Taste um weiterzublättern.
// - Ist der ganze Text durch, verschwindet die Box beim nächsten Druck.
//
// Verwendung (Beispiel):
//   const dialog = new Dialog(this);           // this = die aktuelle Szene
//   dialog.show(['Zeile 1', 'Zeile 2', ...]);  // beliebig viele Zeilen
//   dialog.show([...], () => { ... });         // Callback nach dem Schliessen
// ---------------------------------------------------------------------------

// Wie viele Zeilen gleichzeitig sichtbar sind (wie in Pokémon: 2 Zeilen).
const LINES_PER_PAGE = 2;

export class Dialog {
  /**
   * @param {Phaser.Scene} scene – die Szene, in der der Dialog angezeigt wird
   */
  constructor(scene) {
    this.scene = scene;

    // Alle Zeilen des aktuellen Dialogs (wird in show() gesetzt).
    this._lines = [];

    // Index der ersten Zeile, die aktuell angezeigt wird.
    this._currentLine = 0;

    // Merker ob der Dialog gerade sichtbar ist.
    this._visible = false;

    // Callback, das ausgeführt wird sobald der Dialog fertig gelesen ist.
    this._onComplete = null;

    // Bildschirmgrösse auslesen (für Positionierung der Box).
    const { width, height } = scene.scale;

    // Masse der Dialog-Box.
    const boxHeight = 110; // Höhe der Box
    const margin = 100; // Abstand zum Bildschirmrand
    const boxY = height - boxHeight - margin; // obere Kante der Box

    // Hintergrund-Box zeichnen
    // Eine Grafik mit dunklem, halbtransparentem Hintergrund und weissem Rand.
    this._box = scene.add.graphics();
    this._box.fillStyle(0x000000, 0.8); // schwarze Füllung
    this._box.fillRoundedRect(
      margin, 
      boxY, 
      width - margin * 2, 
      boxHeight, 
      12
    );
    this._box.lineStyle(3, 0xffffff, 1); // weisser Rand
    this._box.strokeRoundedRect(
      margin,
      boxY,
      width - margin * 2,
      boxHeight,
      12,
    );
    // Depth hoch setzen, damit die Box über allem anderen liegt.
    this._box.setDepth(100);


    const namenBoxHeight = 40;
    const namenBoxWidth = 180;

    const namenBoxX = margin;
    const namenBoxY = boxY - namenBoxHeight;

    this._namenBox = scene.add.graphics();
    this._namenBox.fillStyle(0x000000, 0.8);

    this._namenBox.fillRoundedRect(
      namenBoxX, 
      namenBoxY, 
      namenBoxWidth, 
      namenBoxHeight, 
      12
    );
    
    this._namenBox.lineStyle(3, 0xffffff, 1); // weisser Rand

    this._namenBox.strokeRoundedRect(
       namenBoxX,
      namenBoxY,
      namenBoxWidth,
      namenBoxHeight,
     12
    );
    this._namenBox.setDepth(100);


    this._nameText = scene.add.text(
  namenBoxX + 15,
  namenBoxY + 8,
  "",
  
  {
    fontSize: "20px",
    fontFamily: "monospace",
    color: "#ffffff",
   }
  );

    this._nameText.setDepth(101);

    this._namenBox.setVisible(false);
    this._nameText.setVisible(false);
   
    // Text-Objekt 
    // Der eigentliche Text startet leicht eingerückt in der Box.
    this._text = scene.add.text(
      margin + 20, 
      boxY + 20, 
      "", 
      {
      fontSize: "20px",
      fontFamily: "monospace",
      color: "#ffffff",
      lineSpacing: 10, // Abstand zwischen den zwei Zeilen
    });
    this._text.setDepth(101);

    // Hinweis "▼" (weiter mit Enter) unten rechts in der Box
    this._hint = scene.add.text(
      width - margin - 30,
      boxY + boxHeight - 30,
      "▼",
      {
        fontSize: "20px",
        fontFamily: "monospace",
        color: "#ffff00",
      },
    );
    this._hint.setDepth(101);

    // Zu Beginn ist alles unsichtbar.
    this._setVisible(false);

    // Enter-Taste abhören
    // Bei jedem Druck auf Enter blättern wir eine Seite weiter.
    scene.input.keyboard.on(
      "keydown-ENTER", 
      () => this._advance()
    );
  }

  /**
   * Startet einen neuen Dialog mit den übergebenen Textzeilen.
   * @param {string[]} lines – Array von Zeilen, z.B. ['Hallo!', 'Wie geht es dir?']
   * @param {function} [onComplete] – wird aufgerufen sobald der Dialog geschlossen wird
   */
  show(lines, onComplete, speakerName = "") {
    this._lines = lines;
    this._currentLine = 0;
    this._onComplete = onComplete ?? null;
    this._nameText.setText(speakerName);
    this._setVisible(true);
    this._render();
  }

  /** Gibt zurück ob der Dialog gerade sichtbar ist. */
  isVisible() {
    return this._visible;
  }

  // Private Hilfsmethoden

  // Blättert zur nächsten Seite oder schliesst den Dialog am Ende.
  _advance() {
    // Wenn der Dialog nicht sichtbar ist, machen wir gar nichts.
    if (!this._visible) return;

    // Um LINES_PER_PAGE (=2) Zeilen weiterspringen.
    this._currentLine += LINES_PER_PAGE;

    // Sind wir über das Ende des Textes hinaus, schliessen wir den Dialog.
    if (this._currentLine >= this._lines.length) {
      this._setVisible(false);

      // Wenn ein Callback gesetzt ist, jetzt ausführen (z.B. Level wechseln).
      const done = this._onComplete;
      this._onComplete = null;
      if (done) done();
      return;
    }

    // Sonst die neue Seite anzeigen.
    this._render();
  }

  // Zeigt die aktuellen 2 Zeilen im Text-Objekt an.
  _render() {
    // slice() schneidet genau die 2 aktuell sichtbaren Zeilen heraus.
    const page = this._lines.slice(
      this._currentLine,
      this._currentLine + LINES_PER_PAGE,
    );
    // Mit '\n' verbunden, damit sie untereinander stehen.
    this._text.setText(page.join("\n"));
  }

  // Blendet Box, Text und Hinweis gemeinsam ein oder aus.
  _setVisible(visible) {

    this._visible = visible;

    this._box.setVisible(visible);
    this._namenBox.setVisible(visible);
    this._nameText.setVisible(visible);
    this._text.setVisible(visible);
    this._hint.setVisible(visible);
  }
}
