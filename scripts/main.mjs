/**
 * SUPER FX  (modulo Foundry VTT 13 e 14, funziona con qualsiasi sistema di gioco)
 * ------------------------------------------------------------------------------------------
 * Effetti animati per le scene, regolati da un pannello di controllo del master (niente macro):
 *   nebbia, oscurità magica, pioggia (anche vista dall'alto), neve, grandine, tempesta di sabbia, foglie,
 *   braci, lucciole, liquidi in movimento (acqua, palude, sangue, lava, acido, magia), trombe d'aria e d'acqua,
 *   fulmini, raggi che si scontrano fra token o punti, muri che emettono bagliori.
 * Ogni effetto ha colore, intensità da 1 a 5 e un'area (tutta la scena o delle Regioni); le Regioni con il
 * comportamento «Super FX – Senza effetti» li tolgono dove non servono (interni, grotte, tende).
 * Tutto è salvato nelle scene: si esporta e si importa insieme a loro.
 *
 * API per macro e altri moduli:  game.modules.get("super-fx").api
 *   .pannello()                          apre il pannello del master
 *   .effetti(scena?)                     elenco degli effetti della scena
 *   .aggiungi("pioggia", {intensita: 5}) aggiunge un effetto alla scena attuale (restituisce i suoi dati)
 *   .modifica(id, {colore: "#ff0000"})   cambia un effetto
 *   .elimina(id)                         toglie un effetto
 *   .accendi(id) / .spegni(id)           accende o spegne un effetto
 *   .preset("temporale")                 aggiunge una combinazione pronta
 *   .lampo(id)                           fa cadere subito un fulmine (effetto fulmini o pioggia con lampi)
 *   .raggi(scena?)                       elenco dei gruppi di raggi
 *   .scontro([token, token…], {colori})  crea un gruppo di raggi fra token
 *   .mascheraDaiMuri()                   crea la zona «Interni» dai muri della scena
 *   .ridisegna()                         rifà tutti gli effetti della scena
 */
import { MOD, TIPO_ESCLUSIONE, log } from "./costanti.mjs";
import { SenzaEffetti, mascheraDaiMuri } from "./maschere.mjs";
import { registraImpostazioni } from "./impostazioni.mjs";
import { applicaLinguaForzata } from "./lingua.mjs";
import { motore, registraMotore } from "./motore.mjs";
import { registraSocket, AZIONI } from "./socket.mjs";
import { registraManiglie } from "./punti.mjs";
import { apriPannello, aggiungiPulsanti, registraAggiornamentoPannello } from "./pannello.mjs";
import { applicaPreset } from "./preset.mjs";
import { leggiEffetti, leggiRaggi, aggiungiEffetto, modificaEffetto, eliminaEffetto, nuovoGruppo, COLORI_RAGGI } from "./dati.mjs";

Hooks.once("init", () => {
  log("inizializzazione");
  CONFIG.RegionBehavior.dataModels[TIPO_ESCLUSIONE] = SenzaEffetti;
  CONFIG.RegionBehavior.typeIcons[TIPO_ESCLUSIONE] = "fa-solid fa-ban";
  registraImpostazioni();
  registraMotore();
  registraManiglie();
});

Hooks.once("i18nInit", () => applicaLinguaForzata());

Hooks.on("getSceneControlButtons", aggiungiPulsanti);

Hooks.once("ready", () => {
  Object.assign(AZIONI, { lampo: dati => motore.lampo(dati) });
  registraSocket();
  registraAggiornamentoPannello();

  game.modules.get(MOD).api = {
    pannello: () => apriPannello(),
    effetti: (scena = canvas.scene) => leggiEffetti(scena),
    aggiungi: (tipo, dati = {}) => aggiungiEffetto(tipo, dati),
    modifica: (id, cambi) => modificaEffetto(id, cambi),
    elimina: id => eliminaEffetto(id),
    accendi: id => modificaEffetto(id, { attivo: true }),
    spegni: id => modificaEffetto(id, { attivo: false }),
    preset: nome => applicaPreset(nome),
    lampo: id => motore.lampoOra(id),
    raggi: (scena = canvas.scene) => leggiRaggi(scena),
    scontro: (tokens = canvas.tokens.controlled, o = {}) => nuovoGruppo(
      tokens.map((tk, i) => ({ tipo: "token", token: (tk.document ?? tk).id, colore: o.colori?.[i] ?? COLORI_RAGGI[i % COLORI_RAGGI.length] })),
      { nome: o.nome ?? "" }),
    mascheraDaiMuri: () => mascheraDaiMuri(),
    ridisegna: () => motore.avvia()
  };
});
