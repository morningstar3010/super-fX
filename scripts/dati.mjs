/**
 * SUPER FX – dove si salvano effetti e raggi.
 *
 * Tutto sta nei flag della scena, quindi viaggia con la scena (esportazioni, compendi, avventure):
 *   flags.super-fx.effetti = [ { id, tipo, nome, attivo, soloMaster, area, sfumatura, colore, intensita, … } ]
 *   flags.super-fx.raggi   = [ { id, nome, attivo, larghezza, velocita, alMuro, lunghezzaMax, scintille,
 *                                fonti: [ { id, tipo: "token"|"punto", token, x, y, colore } ], bersaglio } ]
 * I bagliori dei muri stanno nei muri: flags.super-fx.bagliore.
 * Si salvano come elenchi interi (gli elenchi in Foundry si sostituiscono, non si fondono): così togliere un
 * elemento funziona allo stesso modo in Foundry 13 e 14.
 */
import { MOD, TIPI, RAGGIO_BASE, nuovoId } from "./costanti.mjs";

/** Colori proposti per le fonti dei raggi, in ordine. */
export const COLORI_RAGGI = ["#e001fe", "#fe6601", "#2ad4ff", "#7dff4a", "#ffd23a", "#ff3a5c", "#ffffff", "#5a6bff"];

const copia = x => foundry.utils.deepClone(x);

export const leggiEffetti = (scene = canvas.scene) => copia(scene?.getFlag(MOD, "effetti") ?? []).filter(e => e && TIPI[e.tipo]);
export const leggiRaggi = (scene = canvas.scene) => copia(scene?.getFlag(MOD, "raggi") ?? []).filter(Boolean);

export const salvaEffetti = (lista, scene = canvas.scene) => scene?.setFlag(MOD, "effetti", lista);
export const salvaRaggi = (lista, scene = canvas.scene) => scene?.setFlag(MOD, "raggi", lista);

/* -------------------------------------------- */
/*  Effetti                                     */
/* -------------------------------------------- */

/** Dati di un nuovo effetto del tipo scelto, con i valori di partenza. */
export function nuovoEffetto(tipo, altro = {}) {
  const { gruppo, icona, ...base } = TIPI[tipo];
  return { id: nuovoId(), tipo, nome: "", attivo: true, soloMaster: false, area: "scena", sfumatura: 0.5, ...copia(base), ...(tipo === "liquido" ? { sottoToken: true } : {}), ...altro };
}

export async function aggiungiEffetto(tipo, altro = {}, scene = canvas.scene) {
  if (!TIPI[tipo] || !scene) return null;
  const e = nuovoEffetto(tipo, altro);
  await salvaEffetti([...leggiEffetti(scene), e], scene);
  return e;
}

export async function modificaEffetto(id, cambi, scene = canvas.scene) {
  const lista = leggiEffetti(scene), e = lista.find(x => x.id === id);
  if (!e) return null;
  Object.assign(e, cambi);
  await salvaEffetti(lista, scene);
  return e;
}

export async function eliminaEffetto(id, scene = canvas.scene) {
  await salvaEffetti(leggiEffetti(scene).filter(x => x.id !== id), scene);
}

/** Sposta un effetto di un posto in su (-1) o in giù (+1) nell'elenco. */
export async function spostaEffetto(id, verso, scene = canvas.scene) {
  const lista = leggiEffetti(scene), i = lista.findIndex(x => x.id === id), j = i + verso;
  if (i < 0 || j < 0 || j >= lista.length) return;
  [lista[i], lista[j]] = [lista[j], lista[i]];
  await salvaEffetti(lista, scene);
}

export async function duplicaEffetto(id, scene = canvas.scene) {
  const lista = leggiEffetti(scene), e = lista.find(x => x.id === id);
  if (!e) return;
  lista.splice(lista.indexOf(e) + 1, 0, { ...copia(e), id: nuovoId() });
  await salvaEffetti(lista, scene);
}

/* -------------------------------------------- */
/*  Raggi                                       */
/* -------------------------------------------- */

export function nuovaFonte(altro = {}, n = 0) {
  return { id: nuovoId(), tipo: "punto", token: null, x: 0, y: 0, colore: COLORI_RAGGI[n % COLORI_RAGGI.length], ...altro };
}

export async function nuovoGruppo(fonti = [], altro = {}, scene = canvas.scene) {
  const g = { ...copia(RAGGIO_BASE), id: nuovoId(), bersaglio: null, ...altro, fonti: fonti.map((f, i) => nuovaFonte(f, i)) };
  await salvaRaggi([...leggiRaggi(scene), g], scene);
  return g;
}

/** Modifica un gruppo: cambi = oggetto, oppure funzione che riceve il gruppo e lo cambia. */
export async function modificaGruppo(id, cambi, scene = canvas.scene) {
  const lista = leggiRaggi(scene), g = lista.find(x => x.id === id);
  if (!g) return null;
  if (typeof cambi === "function") cambi(g); else Object.assign(g, cambi);
  await salvaRaggi(lista, scene);
  return g;
}

export const eliminaGruppo = (id, scene = canvas.scene) => salvaRaggi(leggiRaggi(scene).filter(x => x.id !== id), scene);

export const aggiungiFonti = (id, fonti, scene = canvas.scene) =>
  modificaGruppo(id, g => { for (const f of fonti) g.fonti.push(nuovaFonte(f, g.fonti.length)); }, scene);

export const modificaFonte = (id, fid, cambi, scene = canvas.scene) =>
  modificaGruppo(id, g => { const f = g.fonti.find(x => x.id === fid); if (f) Object.assign(f, cambi); }, scene);

export const togliFonte = (id, fid, scene = canvas.scene) =>
  modificaGruppo(id, g => { g.fonti = g.fonti.filter(x => x.id !== fid); }, scene);

export const impostaBersaglio = (id, bersaglio, scene = canvas.scene) => modificaGruppo(id, { bersaglio }, scene);
