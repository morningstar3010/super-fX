/**
 * SUPER FX – lingua forzata.
 *
 * Di solito Foundry carica da solo il file lang/<lingua>.json che corrisponde alla lingua del client.
 * Con l'impostazione «Lingua di Super FX» l'utente può sceglierne un'altra: all'avvio (hook i18nInit) i testi
 * di quella lingua, presi da lingue-dati.mjs, vengono copiati sopra quelli caricati da Foundry.
 * Riguarda SOLO i testi di Super FX: la lingua di Foundry, del sistema e degli altri moduli non cambia.
 */
import { MOD, TIPO_ESCLUSIONE, log } from "./costanti.mjs";
import { TESTI } from "./lingue-dati.mjs";
import { SenzaEffetti } from "./maschere.mjs";

export function applicaLinguaForzata() {
  let scelta = "auto";
  try { scelta = game.settings.get(MOD, "lingua"); } catch (err) { return; }
  if (!scelta || scelta === "auto" || !TESTI[scelta]) return;
  const dati = foundry.utils.deepClone(TESTI[scelta]);
  const tr = game.i18n.translations;
  tr.SUPERFX = foundry.utils.mergeObject(tr.SUPERFX ?? {}, dati.SUPERFX, { inplace: false });
  const nome = dati.TYPES?.RegionBehavior?.[TIPO_ESCLUSIONE];
  const descrizione = dati.TYPES?.HINTS?.RegionBehavior?.[TIPO_ESCLUSIONE];
  tr.TYPES ??= {};
  if (nome) { tr.TYPES.RegionBehavior ??= {}; tr.TYPES.RegionBehavior[TIPO_ESCLUSIONE] = nome; }
  if (descrizione) { tr.TYPES.HINTS ??= {}; tr.TYPES.HINTS.RegionBehavior ??= {}; tr.TYPES.HINTS.RegionBehavior[TIPO_ESCLUSIONE] = descrizione; }
  try {
    const L = foundry.helpers?.Localization ?? globalThis.Localization;
    L?.localizeDataModel?.(SenzaEffetti);
  } catch (err) { log("etichette del comportamento non aggiornate", err); }
  log(`lingua forzata: ${scelta}`);
}
