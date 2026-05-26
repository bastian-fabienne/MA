// ---------------------------------------------------------------------------
// Store.js
// Globaler Singleton-Store – speichert den Spielfortschritt über alle Szenen.
//
// Struktur von _state:
// {
//   star: { collected: 2, total: 3 },
//   coin: { collected: 0, total: 2 },
// }
//
// Verwendung:
//   import { store } from './Store.js';
//   store.registerType('star', 3);   // beim Aufbau einer Szene
//   store.collect('star');            // beim Klick auf ein Objekt
//   store.getState();                 // aktuellen Stand lesen
// ---------------------------------------------------------------------------

class Store {
  constructor() {
    this._state = {};
  }

  /**
   * Registriert einen Objekt-Typ mit der Gesamtanzahl in der aktuellen Szene.
   * Existierende collected-Werte bleiben erhalten (kein Reset).
   *
   * @param {string} key    – Objekt-Typ (z.B. 'star', 'coin')
   * @param {number} total  – Anzahl Objekte dieses Typs in der Szene
   */
  registerType(key, total) {
    if (!this._state[key]) {
      this._state[key] = { collected: 0, total };
    } else {
      // Gesamtanzahl aktualisieren, collected bleibt erhalten
      this._state[key].total = total;
    }
  }

  /**
   * Markiert ein Objekt als eingesammelt.
   *
   * @param {string} key – Objekt-Typ (z.B. 'star')
   */
  collect(key) {
    if (!this._state[key]) {
      console.warn(`Store: Unbekannter Typ "${key}". Erst registerType() aufrufen.`);
      return;
    }
    this._state[key].collected += 1;
  }

  /**
   * Gibt eine Kopie des aktuellen Zustands zurück.
   *
   * @returns {{ [key: string]: { collected: number, total: number } }}
   */
  getState() {
    return structuredClone(this._state);
  }

  /**
   * Gibt den Eintrag für einen einzelnen Typ zurück.
   *
   * @param {string} key
   * @returns {{ collected: number, total: number } | undefined}
   */
  getType(key) {
    return this._state[key] ? { ...this._state[key] } : undefined;
  }

  /**
   * Gibt zurück ob alle registrierten Objekte eingesammelt wurden.
   *
   * @returns {boolean}
   */
  isComplete() {
    return Object.values(this._state).every(({ collected, total }) => collected >= total);
  }
}

// Singleton – eine einzige Instanz für das gesamte Spiel
export const store = new Store();
