/**
 * SUPER FX – costanti e piccole utilità condivise da tutti i file del modulo.
 */

/** Id del modulo (uguale alla cartella dentro Data/modules). */
export const MOD = "super-fx";

/** Tipo del comportamento di regione «Super FX – Senza effetti» (nel module.json è "senzaEffetti"). */
export const TIPO_ESCLUSIONE = `${MOD}.senzaEffetti`;

/** Messaggio nella console del browser con il prefisso del modulo. */
export const log = (...args) => console.log("Super FX |", ...args);

/** Traduzione breve: t("CHIAVE") oppure t("CHIAVE", {valori}). */
export const t = (chiave, dati) => (dati ? game.i18n.format(chiave, dati) : game.i18n.localize(chiave));

/** Colore "#rrggbb" → numero per PIXI (con un colore di riserva se il testo non è valido). */
export function numeroColore(c, riserva = 0xffffff) {
  try {
    const n = Number(foundry.utils.Color.from(c));
    return Number.isFinite(n) ? n : riserva;
  } catch (err) { return riserva; }
}

/** Limita un numero fra a e b. */
export const fra = (x, a, b) => Math.min(b, Math.max(a, x));

/** Numero casuale fra a e b. */
export const caso = (a, b) => a + Math.random() * (b - a);

/** Id corto e stabile per gli elementi salvati nei flag. */
export const nuovoId = () => foundry.utils.randomID(10);

/**
 * TIPI DI EFFETTO (si piazzano sulla scena o dentro una Regione) con i valori di partenza.
 * Comuni a tutti: id, tipo, nome, attivo, area ("scena" o elenco di id di Regioni), colore, intensita (1-5),
 * sfumatura (bordo morbido della maschera, in caselle), opacita (0-1).
 *   direzione = da dove a dove va il vento / la corrente, in gradi (0 = verso destra, 90 = verso il basso)
 *   inclinazione = per pioggia e neve: 0 = vista dall'alto (cade dritta verso il pavimento), fino a 75 gradi
 */
export const TIPI = {
  nebbia:    { gruppo: "atmosfera",      icona: "fa-solid fa-smog",              colore: "#d8dde6", intensita: 3, direzione: 0,   velocita: 3, scala: 3 },
  pioggia:   { gruppo: "precipitazioni", icona: "fa-solid fa-cloud-showers-heavy", colore: "#a8c4e0", intensita: 3, direzione: 60, inclinazione: 15, velocita: 3, lampi: false, schizzi: true },
  neve:      { gruppo: "precipitazioni", icona: "fa-solid fa-snowflake",         colore: "#ffffff", intensita: 3, direzione: 70, inclinazione: 15, velocita: 3, schizzi: false },
  grandine:  { gruppo: "precipitazioni", icona: "fa-solid fa-cloud-meatball",   colore: "#e8f2ff", intensita: 3, direzione: 80, inclinazione: 15, velocita: 4, schizzi: true },
  sabbia:    { gruppo: "precipitazioni", icona: "fa-solid fa-wind",              colore: "#d9b27a", intensita: 3, direzione: 0,  inclinazione: 75, velocita: 4, schizzi: false },
  foglie:    { gruppo: "particelle",     icona: "fa-solid fa-leaf",              colore: "#c9772b", intensita: 2, direzione: 20, inclinazione: 45, velocita: 2 },
  braci:     { gruppo: "particelle",     icona: "fa-solid fa-fire",              colore: "#ff8a2a", intensita: 3, direzione: 270, velocita: 2 },
  lucciole:  { gruppo: "particelle",     icona: "fa-solid fa-star",              colore: "#d6ff6a", intensita: 2, velocita: 1 },
  liquido:   { gruppo: "liquidi",        icona: "fa-solid fa-water",             colore: "#3fa7c9", intensita: 3, direzione: 0, velocita: 3, scala: 3, liquido: "acqua" },
  tromba:    { gruppo: "vortici",        icona: "fa-solid fa-tornado",           colore: "#8f8676", intensita: 3, velocita: 3, punto: null, vaga: 2, specie: "aria" },
  fulmini:   { gruppo: "atmosfera",      icona: "fa-solid fa-bolt",              colore: "#cfe3ff", intensita: 3, frequenza: 3, suono: "" },
  oscurita:  { gruppo: "atmosfera",      icona: "fa-solid fa-ghost",             colore: "#2a0f3d", intensita: 3, velocita: 2, scala: 3 }
};

/** Liquidi pronti: colore e aspetto (lava e acido brillano). */
export const LIQUIDI = {
  acqua:  { colore: "#3fa7c9", brilla: false },
  palude: { colore: "#5d7a3a", brilla: false },
  sangue: { colore: "#8e0f12", brilla: false },
  lava:   { colore: "#ff5a1a", brilla: true },
  acido:  { colore: "#8cff2a", brilla: true },
  magia:  { colore: "#b06cff", brilla: true }
};

/** Specie delle trombe: d'aria (detriti e polvere) o d'acqua (spruzzi). */
export const SPECIE = { aria: "#8f8676", acqua: "#9fd3ef", fuoco: "#ff7a2a", magia: "#b06cff" };

/** Inclinazioni pronte per pioggia, neve, grandine, sabbia e foglie (0 = vista dall'alto). */
export const INCLINAZIONI = [0, 15, 30, 45, 60, 75];

/** Valori di partenza di un gruppo di raggi. */
export const RAGGIO_BASE = {
  attivo: true, nome: "", larghezza: 0.6, velocita: 3, alMuro: "ferma", lunghezzaMax: 0, scintille: 3, fonti: []
};

/** Valori di partenza del bagliore di un muro. */
export const BAGLIORE_BASE = { colore: "#7ad7ff", intensita: 3, pulsazione: 2, larghezza: 0.5, faville: false };
