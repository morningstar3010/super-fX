/**
 * SUPER FX – comunicazione fra i client.
 * Serve ai fulmini: il master attivo sceglie quando e dove cade il lampo e lo manda a tutti,
 * così ognuno vede la stessa saetta nello stesso momento.
 */
import { MOD, log } from "./costanti.mjs";

const SOCKET = `module.${MOD}`;

/** Azioni eseguite da ogni client: nome → funzione(dati). Le riempie main.mjs. */
export const AZIONI = {};

function esegui(azione, dati) {
  const fn = AZIONI[azione];
  if (!fn) return log("azione sconosciuta", azione);
  try { fn(dati); } catch (err) { console.error("Super FX | errore", azione, err); }
}

/** Manda un'azione a tutti i client collegati, compreso questo. */
export function inviaATutti(azione, dati) {
  game.socket.emit(SOCKET, { azione, dati });
  esegui(azione, dati);
}

export function registraSocket() {
  game.socket.on(SOCKET, msg => { if (msg?.azione) esegui(msg.azione, msg.dati); });
}
