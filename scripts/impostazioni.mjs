/**
 * SUPER FX – impostazioni e tasti rapidi.
 * Si trovano in: Impostazioni di gioco → Configura impostazioni → Super FX.
 * Sono tutte PERSONALI (ogni giocatore sceglie per il suo computer), tranne nessuna: gli effetti stanno nelle scene.
 */
import { MOD } from "./costanti.mjs";
import { NOMI_LINGUE } from "./lingue-dati.mjs";
import { motore } from "./motore.mjs";
import { disegnaManiglie } from "./punti.mjs";
import { apriPannello } from "./pannello.mjs";

export function registraImpostazioni() {
  // Lingua dei testi di Super FX: «Automatica» segue Foundry; le altre la forzano (vedi lingua.mjs).
  game.settings.register(MOD, "lingua", {
    name: "SUPERFX.Impostazioni.lingua.nome",
    hint: "SUPERFX.Impostazioni.lingua.hint",
    scope: "client", config: true, type: String, default: "auto",
    choices: { auto: "SUPERFX.Impostazioni.lingua.auto", ...NOMI_LINGUE },
    requiresReload: true
  });

  // Effetti accesi o spenti su questo computer (per chi ha un computer lento o non li vuole).
  game.settings.register(MOD, "attivo", {
    name: "SUPERFX.Impostazioni.attivo.nome",
    hint: "SUPERFX.Impostazioni.attivo.hint",
    scope: "client", config: true, type: Boolean, default: true,
    onChange: () => motore.avvia()
  });

  // Quantità di particelle: alta, media, bassa.
  game.settings.register(MOD, "qualita", {
    name: "SUPERFX.Impostazioni.qualita.nome",
    hint: "SUPERFX.Impostazioni.qualita.hint",
    scope: "client", config: true, type: String, default: "alta",
    choices: { alta: "SUPERFX.Impostazioni.qualita.alta", media: "SUPERFX.Impostazioni.qualita.media", bassa: "SUPERFX.Impostazioni.qualita.bassa" },
    onChange: () => motore.avvia()
  });

  // Maniglie dei punti sulla mappa (solo master).
  game.settings.register(MOD, "maniglie", {
    name: "SUPERFX.Impostazioni.maniglie.nome",
    hint: "SUPERFX.Impostazioni.maniglie.hint",
    scope: "client", config: true, type: Boolean, default: true,
    onChange: () => disegnaManiglie()
  });

  game.keybindings.register(MOD, "pannello", {
    name: "SUPERFX.Impostazioni.tastoPannello.nome",
    hint: "SUPERFX.Impostazioni.tastoPannello.hint",
    editable: [],
    restricted: true,
    onDown: () => { apriPannello(); return true; }
  });

  game.keybindings.register(MOD, "accendiSpegni", {
    name: "SUPERFX.Impostazioni.tastoAccendi.nome",
    hint: "SUPERFX.Impostazioni.tastoAccendi.hint",
    editable: [],
    onDown: () => { game.settings.set(MOD, "attivo", !game.settings.get(MOD, "attivo")); return true; }
  });
}
