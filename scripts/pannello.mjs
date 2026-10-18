/**
 * SUPER FX – il pannello di controllo del master.
 *
 * Si apre dal pulsante con la bacchetta nella barra di sinistra (Token, Regioni, Muri, Luci), dal tasto
 * assegnato in Configura comandi o con game.modules.get("super-fx").api.pannello().
 * Quattro schede:
 *  - EFFETTI: si aggiunge un effetto con un clic e lo si regola nel suo riquadro (colore, intensità 1-5,
 *    direzione, inclinazione, velocità, area, bordo sfumato…). I cursori si vedono SUBITO sulla mappa mentre
 *    li si trascina; il valore si salva quando si lascia il cursore.
 *  - RAGGI: gruppi di raggi con fonti (token o punti) e bersaglio facoltativo.
 *  - MURI LUMINOSI: bagliore sui muri selezionati.
 *  - STRUMENTI: maschera dai muri, zone senza effetti, preset, atmosfera, copia su un'altra scena, maniglie.
 * Tutto il pannello è scritto qui (senza modelli Handlebars); i testi sono nelle lingue del modulo.
 */
import { MOD, TIPI, LIQUIDI, SPECIE, INCLINAZIONI, BAGLIORE_BASE, TIPO_ESCLUSIONE, t } from "./costanti.mjs";
import {
  leggiEffetti, leggiRaggi, aggiungiEffetto, modificaEffetto, eliminaEffetto, spostaEffetto, duplicaEffetto, salvaEffetti,
  nuovoGruppo, modificaGruppo, eliminaGruppo, aggiungiFonti, modificaFonte, togliFonte, impostaBersaglio, salvaRaggi
} from "./dati.mjs";
import { motore } from "./motore.mjs";
import { mascheraDaiMuri, aggiungiEsclusioneAiSelezionati } from "./maschere.mjs";
import { scegliPunto, disegnaManiglie } from "./punti.mjs";
import { PRESET, applicaPreset, atmosferaCinematografica, ripristinaAtmosfera, copiaEffetti } from "./preset.mjs";

const { ApplicationV2, DialogV2 } = foundry.applications.api;

const esc = s => foundry.utils.escapeHTML?.(String(s ?? "")) ?? String(s ?? "").replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);

/** Domanda Sì / No con i pulsanti nella lingua del modulo (si passano le CHIAVI: Foundry le traduce lui). */
async function conferma(titolo, domanda) {
  const ok = await DialogV2.confirm({
    window: { title: titolo },
    content: `<p>${domanda}</p>`,
    yes: { label: "SUPERFX.Comune.si", icon: "fa-solid fa-check" },
    no: { label: "SUPERFX.Comune.no", icon: "fa-solid fa-xmark" },
    rejectClose: false
  });
  return ok === true;
}

/** Quale serie di nomi per i 5 livelli. */
const SERIE_LIVELLI = { pioggia: "pioggia", grandine: "pioggia", neve: "neve", nebbia: "nebbia", oscurita: "nebbia", sabbia: "vento", tromba: "tromba" };
const nomeLivello = (tipo, n) => t(`SUPERFX.Livelli.${SERIE_LIVELLI[tipo] ?? "generico"}.${n}`);

/** Campi del riquadro di ogni tipo di effetto (oltre ad area, bordo e «solo master», che hanno tutti). */
const CAMPI = {
  nebbia:   ["colore", "intensita", "direzione", "velocita", "scala"],
  oscurita: ["colore", "intensita", "velocita", "scala"],
  pioggia:  ["colore", "intensita", "inclinazione", "direzione", "velocita", "schizzi", "lampi", "suono"],
  neve:     ["colore", "intensita", "inclinazione", "direzione", "velocita"],
  grandine: ["colore", "intensita", "inclinazione", "direzione", "velocita", "schizzi"],
  sabbia:   ["colore", "intensita", "inclinazione", "direzione", "velocita"],
  foglie:   ["colore", "intensita", "inclinazione", "direzione", "velocita"],
  braci:    ["colore", "intensita", "direzione", "velocita"],
  lucciole: ["colore", "intensita", "velocita"],
  liquido:  ["liquido", "colore", "intensita", "direzione", "velocita", "scala", "sottoToken"],
  tromba:   ["specie", "colore", "intensita", "velocita", "vaga", "punto"],
  fulmini:  ["colore", "intensita", "frequenza", "suono", "lampoOra"]
};

/** Etichetta e spiegazione di un campo. */
const etichetta = (campo, aiuto = true) => `<label>${esc(t(`SUPERFX.Campi.${campo}.nome`))}${aiuto ? `<i class="fa-solid fa-circle-question sfx-aiuto" data-tooltip="${esc(t(`SUPERFX.Campi.${campo}.hint`))}"></i>` : ""}</label>`;

/** Cursore con il valore scritto accanto. */
function cursore(campo, valore, min, max, passo, testo) {
  return `<div class="form-group sfx-campo">${etichetta(campo)}
    <div class="form-fields"><input type="range" data-campo="${campo}" data-valore="numero" min="${min}" max="${max}" step="${passo}" value="${valore}">
    <span class="sfx-val">${esc(testo ?? valore)}</span></div></div>`;
}

const casella = (campo, valore) => `<div class="form-group sfx-campo">${etichetta(campo)}<div class="form-fields"><input type="checkbox" data-campo="${campo}" data-valore="bool" ${valore ? "checked" : ""}></div></div>`;

const colore = (campo, valore) => `<div class="form-group sfx-campo">${etichetta(campo)}<div class="form-fields"><input type="color" data-campo="${campo}" data-valore="testo" value="${esc(valore || "#ffffff")}"><span class="sfx-val">${esc(valore || "")}</span></div></div>`;

function scelta(campo, valore, opzioni) {
  const o = Object.entries(opzioni).map(([k, v]) => `<option value="${esc(k)}" ${String(k) === String(valore) ? "selected" : ""}>${esc(v)}</option>`).join("");
  return `<div class="form-group sfx-campo">${etichetta(campo)}<div class="form-fields"><select data-campo="${campo}" data-valore="${typeof valore === "number" ? "numero" : "testo"}">${o}</select></div></div>`;
}

/** Testo della direzione: gradi e una freccia. */
const direzioneTesto = g => `${g}° ${["→", "↘", "↓", "↙", "←", "↖", "↑", "↗"][Math.round(((g % 360) + 360) % 360 / 45) % 8]}`;

export class PannelloSuperFX extends ApplicationV2 {
  static DEFAULT_OPTIONS = {
    id: "super-fx-pannello",
    classes: ["super-fx"],
    tag: "div",
    window: { title: "SUPERFX.Pannello.titolo", icon: "fa-solid fa-wand-magic-sparkles", resizable: true },
    position: { width: 600, height: 760 },
    actions: {
      scheda: PannelloSuperFX.#scheda,
      aggiungi: PannelloSuperFX.#aggiungi,
      attiva: PannelloSuperFX.#attiva,
      su: (ev, el) => { ev.preventDefault(); return spostaEffetto(PannelloSuperFX.#id(el), -1); },
      giu: (ev, el) => { ev.preventDefault(); return spostaEffetto(PannelloSuperFX.#id(el), 1); },
      duplica: (ev, el) => { ev.preventDefault(); return duplicaEffetto(PannelloSuperFX.#id(el)); },
      elimina: PannelloSuperFX.#elimina,
      tuttiAccesi: () => PannelloSuperFX.#tutti(true),
      tuttiSpenti: () => PannelloSuperFX.#tutti(false),
      punto: PannelloSuperFX.#punto,
      lampoOra: (ev, el) => motore.lampoOra(PannelloSuperFX.#id(el)),
      suono: PannelloSuperFX.#suono,
      nuovoGruppo: () => nuovoGruppo([], { nome: t("SUPERFX.Raggi.gruppo") }),
      scontroSelezionati: PannelloSuperFX.#scontroSelezionati,
      attivaGruppo: PannelloSuperFX.#attivaGruppo,
      eliminaGruppo: PannelloSuperFX.#eliminaGruppo,
      fontiToken: PannelloSuperFX.#fontiToken,
      fontePunto: PannelloSuperFX.#fontePunto,
      spostaFonte: PannelloSuperFX.#spostaFonte,
      togliFonte: (ev, el) => togliFonte(PannelloSuperFX.#id(el), el.closest("[data-fonte]").dataset.fonte),
      bersaglioToken: PannelloSuperFX.#bersaglioToken,
      bersaglioPunto: PannelloSuperFX.#bersaglioPunto,
      bersaglioNessuno: (ev, el) => impostaBersaglio(PannelloSuperFX.#id(el), null),
      applicaBagliore: PannelloSuperFX.#applicaBagliore,
      togliBagliore: PannelloSuperFX.#togliBagliore,
      leggiBagliore: PannelloSuperFX.#leggiBagliore,
      selezionaLuminosi: PannelloSuperFX.#selezionaLuminosi,
      togliTuttiBagliori: PannelloSuperFX.#togliTuttiBagliori,
      mascheraMuri: () => mascheraDaiMuri(),
      esclusioneSelezionate: () => aggiungiEsclusioneAiSelezionati(),
      maniglie: PannelloSuperFX.#maniglie,
      preset: (ev, el) => applicaPreset(el.dataset.preset),
      atmosfera: () => atmosferaCinematografica(),
      ripristina: () => ripristinaAtmosfera(),
      copia: PannelloSuperFX.#copia,
      svuotaScena: PannelloSuperFX.#svuotaScena
    }
  };

  /** Scheda aperta e riquadri aperti (restano tali fra un ridisegno e l'altro). */
  schedaAperta = "effetti";
  aperti = new Set();
  bagliore = { ...BAGLIORE_BASE };
  scorrimento = 0;

  get title() { return t("SUPERFX.Pannello.titolo"); }

  static #id(el) { return el.closest("[data-id]")?.dataset.id; }

  /* -------------------------------------------- */
  /*  Disegno                                     */
  /* -------------------------------------------- */

  async _renderHTML() {
    const schede = ["effetti", "raggi", "muri", "strumenti"].map(s =>
      `<button type="button" class="${s === this.schedaAperta ? "attiva" : ""}" data-action="scheda" data-scheda="${s}"><i class="${{ effetti: "fa-solid fa-cloud-bolt", raggi: "fa-solid fa-burst", muri: "fa-solid fa-border-all", strumenti: "fa-solid fa-toolbox" }[s]}"></i> ${esc(t(`SUPERFX.Schede.${s}`))}</button>`).join("");
    let corpo;
    if (!canvas.scene) corpo = `<p class="sfx-vuoto">${esc(t("SUPERFX.Pannello.nessunaScena"))}</p>`;
    else corpo = { effetti: () => this.#effetti(), raggi: () => this.#raggi(), muri: () => this.#muri(), strumenti: () => this.#strumenti() }[this.schedaAperta]();
    return `<nav class="sfx-schede">${schede}</nav><section class="sfx-corpo">${corpo}</section>`;
  }

  _replaceHTML(risultato, contenuto) {
    const vecchio = contenuto.querySelector(".sfx-corpo");
    if (vecchio) this.scorrimento = vecchio.scrollTop;
    contenuto.innerHTML = risultato;
    const nuovo = contenuto.querySelector(".sfx-corpo");
    if (nuovo) nuovo.scrollTop = this.scorrimento;
  }

  _onFirstRender(context, options) {
    super._onFirstRender?.(context, options);
    this.element.addEventListener("input", ev => this.#inCorso(ev));
    this.element.addEventListener("change", ev => this.#cambiato(ev));
    this.element.addEventListener("toggle", ev => {
      const d = ev.target.closest?.("details[data-id]");
      if (d) d.open ? this.aperti.add(d.dataset.id) : this.aperti.delete(d.dataset.id);
    }, true);
  }

  /** Riquadro di un effetto. */
  #riquadroEffetto(e, regioni) {
    const def = TIPI[e.tipo];
    const nome = e.nome || t(`SUPERFX.Tipi.${e.tipo}`);
    const campi = CAMPI[e.tipo].map(c => this.#campo(e, c)).join("");
    const areaScelta = Array.isArray(e.area) ? e.area : [];
    const area = `<div class="form-group sfx-campo">${etichetta("area")}<div class="form-fields sfx-area">
      <label><input type="checkbox" data-area="scena" ${areaScelta.length ? "" : "checked"}> ${esc(t("SUPERFX.Campi.area.scena"))}</label>
      ${regioni.map(r => `<label><input type="checkbox" data-area="${r.id}" ${areaScelta.includes(r.id) ? "checked" : ""}> ${esc(r.name)}</label>`).join("")}
      ${regioni.length ? "" : `<span class="sfx-nota">${esc(t("SUPERFX.Campi.area.nessuna"))}</span>`}
    </div></div>`;
    return `<details class="sfx-riquadro ${e.attivo ? "" : "spento"}" data-id="${e.id}" data-genere="effetto" ${this.aperti.has(e.id) ? "open" : ""}>
      <summary><i class="${def.icona}"></i><span class="sfx-titolo">${esc(nome)}</span>
        ${e.soloMaster ? `<i class="fa-solid fa-user-secret" data-tooltip="${esc(t("SUPERFX.Campi.soloMaster.nome"))}"></i>` : ""}
        <span class="sfx-pulsanti">
          <a data-action="attiva" data-tooltip="${esc(t(e.attivo ? "SUPERFX.Pannello.spegni" : "SUPERFX.Pannello.accendi"))}"><i class="fa-solid ${e.attivo ? "fa-eye" : "fa-eye-slash"}"></i></a>
          <a data-action="su" data-tooltip="${esc(t("SUPERFX.Pannello.su"))}"><i class="fa-solid fa-arrow-up"></i></a>
          <a data-action="giu" data-tooltip="${esc(t("SUPERFX.Pannello.giu"))}"><i class="fa-solid fa-arrow-down"></i></a>
          <a data-action="duplica" data-tooltip="${esc(t("SUPERFX.Pannello.duplica"))}"><i class="fa-solid fa-clone"></i></a>
          <a data-action="elimina" data-tooltip="${esc(t("SUPERFX.Pannello.elimina"))}"><i class="fa-solid fa-trash"></i></a>
        </span></summary>
      <div class="sfx-campi">
        <div class="form-group sfx-campo">${etichetta("nome", false)}<div class="form-fields"><input type="text" data-campo="nome" data-valore="testo" value="${esc(e.nome)}" placeholder="${esc(t(`SUPERFX.Tipi.${e.tipo}`))}"></div></div>
        ${campi}${area}
        ${cursore("sfumatura", e.sfumatura ?? 0.5, 0, 3, 0.25, `${e.sfumatura ?? 0.5}`)}
        ${casella("soloMaster", e.soloMaster)}
      </div></details>`;
  }

  /** Un campo di un effetto. */
  #campo(e, c) {
    const v = e[c];
    switch (c) {
      case "colore": return colore(c, v);
      case "intensita": return cursore(c, v ?? 3, 1, 5, 1, `${v ?? 3} – ${nomeLivello(e.tipo, v ?? 3)}`);
      case "direzione": return cursore(c, v ?? 0, 0, 355, 5, direzioneTesto(v ?? 0));
      case "inclinazione": return scelta(c, Number(v ?? 0), Object.fromEntries(INCLINAZIONI.map(g => [g, g === 0 ? t("SUPERFX.Campi.inclinazione.dallAlto") : `${g}°`])));
      case "velocita": return cursore(c, v ?? 3, 1, 5, 1);
      case "scala": return cursore(c, v ?? 3, 1, 5, 0.5);
      case "frequenza": return cursore(c, v ?? 3, 1, 5, 1, `${v ?? 3} – ${t(`SUPERFX.Livelli.generico.${v ?? 3}`)}`);
      case "vaga": return cursore(c, v ?? 0, 0, 5, 1, v ? `${v}` : t("SUPERFX.Campi.vaga.ferma"));
      case "schizzi": case "lampi": case "sottoToken": return casella(c, v !== false && (c !== "lampi" || v));
      case "liquido": return scelta(c, v ?? "acqua", Object.fromEntries(Object.keys(LIQUIDI).map(k => [k, t(`SUPERFX.Liquidi.${k}`)])));
      case "specie": return scelta(c, v ?? "aria", Object.fromEntries(Object.keys(SPECIE).map(k => [k, t(`SUPERFX.Specie.${k}`)])));
      case "suono":
        if (e.tipo === "pioggia" && !e.lampi) return "";
        return `<div class="form-group sfx-campo">${etichetta(c)}<div class="form-fields"><input type="text" data-campo="suono" data-valore="testo" value="${esc(v ?? "")}" placeholder="sounds/…">
          <a class="sfx-mini" data-action="suono" data-tooltip="${esc(t("SUPERFX.Pannello.sfoglia"))}"><i class="fa-solid fa-file-audio"></i></a></div></div>`;
      case "punto":
        return `<div class="form-group sfx-campo">${etichetta(c)}<div class="form-fields"><button type="button" data-action="punto"><i class="fa-solid fa-crosshairs"></i> ${esc(t("SUPERFX.Pannello.scegliPunto"))}</button></div></div>`;
      case "lampoOra":
        return `<div class="form-group sfx-campo"><label></label><div class="form-fields"><button type="button" data-action="lampoOra"><i class="fa-solid fa-bolt"></i> ${esc(t("SUPERFX.Pannello.lampoOra"))}</button></div></div>`;
    }
    return "";
  }

  #effetti() {
    const lista = leggiEffetti();
    const regioni = canvas.scene.regions.filter(r => !r.behaviors.some(b => b.type === TIPO_ESCLUSIONE)).sort((a, b) => a.name.localeCompare(b.name));
    const pulsanti = Object.entries(TIPI).map(([k, d]) =>
      `<button type="button" data-action="aggiungi" data-tipo="${k}" data-tooltip="${esc(t(`SUPERFX.Descrizioni.${k}`))}"><i class="${d.icona}"></i><span>${esc(t(`SUPERFX.Tipi.${k}`))}</span></button>`).join("");
    return `<div class="sfx-testata"><span><i class="fa-solid fa-map"></i> ${esc(canvas.scene.name)}</span>
        <span><button type="button" data-action="tuttiAccesi"><i class="fa-solid fa-eye"></i> ${esc(t("SUPERFX.Pannello.tuttiAccesi"))}</button>
        <button type="button" data-action="tuttiSpenti"><i class="fa-solid fa-eye-slash"></i> ${esc(t("SUPERFX.Pannello.tuttiSpenti"))}</button></span></div>
      <h3>${esc(t("SUPERFX.Pannello.aggiungi"))}</h3>
      <div class="sfx-griglia">${pulsanti}</div>
      <h3>${esc(t("SUPERFX.Pannello.effettiScena"))} (${lista.length})</h3>
      ${lista.length ? lista.map(e => this.#riquadroEffetto(e, regioni)).join("") : `<p class="sfx-vuoto">${esc(t("SUPERFX.Pannello.nessunEffetto"))}</p>`}`;
  }

  #nomeAncora(a) {
    if (!a) return t("SUPERFX.Raggi.nessunBersaglio");
    if (a.tipo === "token") return canvas.scene.tokens.get(a.token)?.name ?? t("SUPERFX.Raggi.tokenSparito");
    return `${t("SUPERFX.Raggi.punto")} (${Math.round(a.x)}, ${Math.round(a.y)})`;
  }

  #raggi() {
    const lista = leggiRaggi();
    const gruppi = lista.map(g => {
      const fonti = (g.fonti ?? []).map(f => `<div class="sfx-fonte" data-fonte="${f.id}">
          <i class="fa-solid ${f.tipo === "token" ? "fa-user" : "fa-location-dot"}"></i><span>${esc(this.#nomeAncora(f))}</span>
          <input type="color" data-campo="colore" data-valore="testo" data-genere="fonte" value="${esc(f.colore)}">
          ${f.tipo === "punto" ? `<a data-action="spostaFonte" data-tooltip="${esc(t("SUPERFX.Pannello.scegliPunto"))}"><i class="fa-solid fa-crosshairs"></i></a>` : ""}
          <a data-action="togliFonte" data-tooltip="${esc(t("SUPERFX.Pannello.elimina"))}"><i class="fa-solid fa-xmark"></i></a></div>`).join("");
      const b = g.bersaglio;
      return `<details class="sfx-riquadro ${g.attivo ? "" : "spento"}" data-id="${g.id}" data-genere="raggio" ${this.aperti.has(g.id) ? "open" : ""}>
        <summary><i class="fa-solid fa-burst"></i><span class="sfx-titolo">${esc(g.nome || t("SUPERFX.Raggi.gruppo"))}</span>
          <span class="sfx-nota">${(g.fonti ?? []).length} <i class="fa-solid fa-bolt"></i>${b ? ` → ${esc(this.#nomeAncora(b))}` : ""}</span>
          <span class="sfx-pulsanti">
            <a data-action="attivaGruppo" data-tooltip="${esc(t(g.attivo ? "SUPERFX.Pannello.spegni" : "SUPERFX.Pannello.accendi"))}"><i class="fa-solid ${g.attivo ? "fa-eye" : "fa-eye-slash"}"></i></a>
            <a data-action="eliminaGruppo" data-tooltip="${esc(t("SUPERFX.Pannello.elimina"))}"><i class="fa-solid fa-trash"></i></a>
          </span></summary>
        <div class="sfx-campi">
          <div class="form-group sfx-campo">${etichetta("nome", false)}<div class="form-fields"><input type="text" data-campo="nome" data-valore="testo" value="${esc(g.nome)}"></div></div>
          ${cursore("larghezza", g.larghezza ?? 0.6, 0.2, 2, 0.1)}
          ${cursore("velocita", g.velocita ?? 3, 1, 5, 1)}
          ${cursore("scintille", g.scintille ?? 3, 0, 5, 1)}
          ${scelta("alMuro", g.alMuro ?? "ferma", { ferma: t("SUPERFX.Campi.alMuro.ferma"), attraversa: t("SUPERFX.Campi.alMuro.attraversa") })}
          <div class="form-group sfx-campo">${etichetta("lunghezzaMax")}<div class="form-fields"><input type="number" min="0" step="0.5" data-campo="lunghezzaMax" data-valore="numero" value="${g.lunghezzaMax ?? 0}"><span class="sfx-val">${esc(t(Number(g.lunghezzaMax) > 0 ? "SUPERFX.Campi.lunghezzaMax.caselle" : "SUPERFX.Campi.lunghezzaMax.sempre"))}</span></div></div>
          ${casella("soloMaster", g.soloMaster)}
          <h4>${esc(t("SUPERFX.Raggi.fonti"))}</h4>
          ${fonti || `<p class="sfx-nota">${esc(t("SUPERFX.Raggi.nessunaFonte"))}</p>`}
          <div class="sfx-fila"><button type="button" data-action="fontiToken"><i class="fa-solid fa-users"></i> ${esc(t("SUPERFX.Raggi.aggiungiToken"))}</button>
            <button type="button" data-action="fontePunto"><i class="fa-solid fa-location-dot"></i> ${esc(t("SUPERFX.Raggi.aggiungiPunto"))}</button></div>
          <h4>${esc(t("SUPERFX.Raggi.bersaglio"))}: <span class="sfx-nota">${esc(this.#nomeAncora(b))}</span></h4>
          <div class="sfx-fila"><button type="button" data-action="bersaglioToken"><i class="fa-solid fa-bullseye"></i> ${esc(t("SUPERFX.Raggi.bersaglioToken"))}</button>
            <button type="button" data-action="bersaglioPunto"><i class="fa-solid fa-crosshairs"></i> ${esc(t("SUPERFX.Raggi.bersaglioPunto"))}</button>
            <button type="button" data-action="bersaglioNessuno"><i class="fa-solid fa-burst"></i> ${esc(t("SUPERFX.Raggi.bersaglioNessuno"))}</button></div>
        </div></details>`;
    }).join("");
    return `<p class="sfx-spiega">${esc(t("SUPERFX.Raggi.spiega"))}</p>
      <div class="sfx-fila"><button type="button" data-action="scontroSelezionati"><i class="fa-solid fa-burst"></i> ${esc(t("SUPERFX.Raggi.scontroSelezionati"))}</button>
      <button type="button" data-action="nuovoGruppo"><i class="fa-solid fa-plus"></i> ${esc(t("SUPERFX.Raggi.nuovo"))}</button></div>
      ${gruppi || `<p class="sfx-vuoto">${esc(t("SUPERFX.Raggi.nessuno"))}</p>`}`;
  }

  #muri() {
    const b = this.bagliore;
    const luminosi = canvas.scene.walls.filter(w => w.getFlag(MOD, "bagliore")).length;
    const sel = canvas.walls?.controlled?.length ?? 0;
    return `<p class="sfx-spiega">${esc(t("SUPERFX.Muri.spiega"))}</p>
      <div class="sfx-campi" data-genere="bagliore">
        ${colore("colore", b.colore)}
        ${cursore("intensita", b.intensita, 1, 5, 1, `${b.intensita} – ${nomeLivello("muri", b.intensita)}`)}
        ${cursore("pulsazione", b.pulsazione, 0, 5, 1, b.pulsazione ? `${b.pulsazione}` : t("SUPERFX.Campi.pulsazione.ferma"))}
        ${cursore("larghezzaBagliore", b.larghezza, 0.1, 2, 0.1)}
        ${casella("faville", b.faville)}
      </div>
      <p class="sfx-nota">${esc(t("SUPERFX.Muri.stato", { luminosi, sel }))}</p>
      <div class="sfx-fila">
        <button type="button" data-action="applicaBagliore"><i class="fa-solid fa-sun"></i> ${esc(t("SUPERFX.Muri.applica"))}</button>
        <button type="button" data-action="togliBagliore"><i class="fa-solid fa-moon"></i> ${esc(t("SUPERFX.Muri.togli"))}</button>
        <button type="button" data-action="leggiBagliore"><i class="fa-solid fa-eye-dropper"></i> ${esc(t("SUPERFX.Muri.leggi"))}</button>
      </div>
      <div class="sfx-fila">
        <button type="button" data-action="selezionaLuminosi"><i class="fa-solid fa-object-group"></i> ${esc(t("SUPERFX.Muri.seleziona"))}</button>
        <button type="button" data-action="togliTuttiBagliori"><i class="fa-solid fa-trash"></i> ${esc(t("SUPERFX.Muri.togliTutti"))}</button>
      </div>`;
  }

  #strumenti() {
    let maniglie = true;
    try { maniglie = game.settings.get(MOD, "maniglie"); } catch (err) { /* niente */ }
    const scene = game.scenes.filter(s => s.id !== canvas.scene.id).sort((a, b) => a.name.localeCompare(b.name));
    const preset = Object.keys(PRESET).map(k => `<button type="button" data-action="preset" data-preset="${k}"><span>${esc(t(`SUPERFX.Preset.${k}`))}</span></button>`).join("");
    const haPrima = !!canvas.scene.getFlag(MOD, "ambientePrecedente");
    return `<h3><i class="fa-solid fa-draw-polygon"></i> ${esc(t("SUPERFX.Strumenti.zone"))}</h3>
      <p class="sfx-spiega">${esc(t("SUPERFX.Strumenti.zoneSpiega"))}</p>
      <div class="sfx-fila"><button type="button" data-action="mascheraMuri"><i class="fa-solid fa-house-chimney"></i> ${esc(t("SUPERFX.Strumenti.mascheraMuri"))}</button>
        <button type="button" data-action="esclusioneSelezionate"><i class="fa-solid fa-ban"></i> ${esc(t("SUPERFX.Strumenti.esclusione"))}</button></div>
      <h3><i class="fa-solid fa-hand"></i> ${esc(t("SUPERFX.Strumenti.maniglie"))}</h3>
      <p class="sfx-spiega">${esc(t("SUPERFX.Strumenti.maniglieSpiega"))}</p>
      <div class="sfx-fila"><button type="button" data-action="maniglie"><i class="fa-solid ${maniglie ? "fa-eye-slash" : "fa-eye"}"></i> ${esc(t(maniglie ? "SUPERFX.Strumenti.nascondiManiglie" : "SUPERFX.Strumenti.mostraManiglie"))}</button></div>
      <h3><i class="fa-solid fa-wand-magic-sparkles"></i> ${esc(t("SUPERFX.Strumenti.preset"))}</h3>
      <p class="sfx-spiega">${esc(t("SUPERFX.Strumenti.presetSpiega"))}</p>
      <div class="sfx-griglia sfx-preset">${preset}</div>
      <h3><i class="fa-solid fa-film"></i> ${esc(t("SUPERFX.Strumenti.atmosfera"))}</h3>
      <p class="sfx-spiega">${esc(t("SUPERFX.Strumenti.atmosferaSpiega"))}</p>
      <div class="sfx-fila"><button type="button" data-action="atmosfera"><i class="fa-solid fa-film"></i> ${esc(t("SUPERFX.Strumenti.applicaAtmosfera"))}</button>
        <button type="button" data-action="ripristina" ${haPrima ? "" : "disabled"}><i class="fa-solid fa-rotate-left"></i> ${esc(t("SUPERFX.Strumenti.ripristina"))}</button></div>
      <h3><i class="fa-solid fa-copy"></i> ${esc(t("SUPERFX.Strumenti.copia"))}</h3>
      <div class="sfx-fila"><select class="sfx-destinazione">${scene.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select>
        <button type="button" data-action="copia" ${scene.length ? "" : "disabled"}><i class="fa-solid fa-copy"></i> ${esc(t("SUPERFX.Strumenti.copiaPulsante"))}</button></div>
      <h3><i class="fa-solid fa-broom"></i> ${esc(t("SUPERFX.Strumenti.svuota"))}</h3>
      <div class="sfx-fila"><button type="button" data-action="svuotaScena"><i class="fa-solid fa-trash"></i> ${esc(t("SUPERFX.Strumenti.svuotaPulsante"))}</button></div>`;
  }

  /* -------------------------------------------- */
  /*  Campi                                       */
  /* -------------------------------------------- */

  /** Valore letto da un campo del pannello. */
  static #valore(el) {
    if (el.dataset.valore === "bool") return el.checked;
    if (el.dataset.valore === "numero") return Number(el.value);
    return el.value;
  }

  /** Testo accanto a un cursore mentre lo si trascina. */
  #aggiornaTesto(el, genere, tipo) {
    const out = el.parentElement?.querySelector(".sfx-val");
    if (!out) return;
    const v = PannelloSuperFX.#valore(el), c = el.dataset.campo;
    if (c === "intensita") out.textContent = `${v} – ${nomeLivello(genere === "bagliore" ? "muri" : tipo, v)}`;
    else if (c === "direzione") out.textContent = direzioneTesto(v);
    else if (c === "frequenza") out.textContent = `${v} – ${t(`SUPERFX.Livelli.generico.${v}`)}`;
    else if (c === "vaga") out.textContent = v ? `${v}` : t("SUPERFX.Campi.vaga.ferma");
    else if (c === "pulsazione") out.textContent = v ? `${v}` : t("SUPERFX.Campi.pulsazione.ferma");
    else out.textContent = `${v}`;
  }

  /** Mentre si trascina un cursore: anteprima sulla mappa, senza salvare. */
  #inCorso(ev) {
    const el = ev.target;
    if (!el.dataset?.campo || !(el.type === "range" || el.type === "color")) return;
    const box = el.closest("[data-genere]"), genere = el.dataset.genere ?? box?.dataset.genere;
    const id = box?.dataset.id;
    if (genere === "effetto") {
      const e = leggiEffetti().find(x => x.id === id);
      if (!e) return;
      this.#aggiornaTesto(el, genere, e.tipo);
      motore.anteprima(id, { ...e, [el.dataset.campo]: PannelloSuperFX.#valore(el) });
    } else if (genere === "raggio") {
      const g = leggiRaggi().find(x => x.id === id);
      if (!g) return;
      this.#aggiornaTesto(el, genere);
      if (g.attivo) motore.anteprimaRaggi(id, { ...g, [el.dataset.campo]: PannelloSuperFX.#valore(el) });
    } else if (genere === "bagliore") this.#aggiornaTesto(el, genere);
  }

  /** Valore confermato: si salva. */
  async #cambiato(ev) {
    const el = ev.target;
    if (el.classList.contains("sfx-destinazione")) return;
    const box = el.closest("[data-genere]");
    const genere = el.dataset.genere ?? box?.dataset.genere, id = box?.dataset.id;
    // area: caselle «Tutta la scena» e regioni
    if (el.dataset.area !== undefined) {
      const caselle = [...box.querySelectorAll("[data-area]")];
      if (el.dataset.area === "scena" && el.checked) caselle.forEach(c => { if (c !== el) c.checked = false; });
      const scelte = caselle.filter(c => c.checked && c.dataset.area !== "scena").map(c => c.dataset.area);
      return modificaEffetto(id, { area: scelte.length ? scelte : "scena" });
    }
    const campo = el.dataset.campo;
    if (!campo) return;
    const valore = PannelloSuperFX.#valore(el);
    if (genere === "effetto") {
      const cambi = { [campo]: valore };
      if (campo === "liquido") cambi.colore = LIQUIDI[valore]?.colore;
      if (campo === "specie") cambi.colore = SPECIE[valore];
      return modificaEffetto(id, cambi);
    }
    if (genere === "fonte") return modificaFonte(id, el.closest("[data-fonte]").dataset.fonte, { [campo]: valore });
    if (genere === "raggio") return modificaGruppo(id, { [campo]: valore });
    if (genere === "bagliore") {
      const k = campo === "larghezzaBagliore" ? "larghezza" : campo;
      this.bagliore[k] = valore;
    }
  }

  /* -------------------------------------------- */
  /*  Azioni                                      */
  /* -------------------------------------------- */

  static #scheda(ev, el) { this.schedaAperta = el.dataset.scheda; this.render(); }

  static async #aggiungi(ev, el) {
    const tipo = el.dataset.tipo;
    const altro = {};
    // un liquido vuole un'area: se ci sono regioni selezionate si usano quelle
    const sel = (canvas.regions?.controlled ?? []).map(r => r.document.id);
    if (sel.length) altro.area = sel;
    else if (tipo === "liquido") ui.notifications.info(t("SUPERFX.Avvisi.liquidoArea"));
    if (tipo === "tromba") {
      const r = canvas.dimensions.sceneRect;
      const c = canvas.stage.pivot;
      altro.punto = { x: Math.round(Math.min(r.right, Math.max(r.x, c.x))), y: Math.round(Math.min(r.bottom, Math.max(r.y, c.y))) };
    }
    const e = await aggiungiEffetto(tipo, altro);
    if (e) { this.aperti.add(e.id); this.render(); }
  }

  static async #attiva(ev, el) {
    ev.preventDefault();
    const id = PannelloSuperFX.#id(el), e = leggiEffetti().find(x => x.id === id);
    if (e) await modificaEffetto(id, { attivo: !e.attivo });
  }

  static async #elimina(ev, el) {
    ev.preventDefault();
    const id = PannelloSuperFX.#id(el), e = leggiEffetti().find(x => x.id === id);
    if (!e) return;
    if (await conferma("SUPERFX.Pannello.elimina", t("SUPERFX.Domande.eliminaEffetto", { nome: esc(e.nome || t(`SUPERFX.Tipi.${e.tipo}`)) }))) await eliminaEffetto(id);
  }

  static async #tutti(acceso) {
    const lista = leggiEffetti();
    for (const e of lista) e.attivo = acceso;
    await salvaEffetti(lista);
  }

  static async #punto(ev, el) {
    const id = PannelloSuperFX.#id(el);
    this.minimize();
    const p = await scegliPunto();
    this.maximize();
    if (p) await modificaEffetto(id, { punto: p });
  }

  static #suono(ev, el) {
    const input = el.parentElement.querySelector("input");
    const FP = foundry.applications.apps?.FilePicker?.implementation ?? globalThis.FilePicker;
    new FP({ type: "audio", current: input.value, callback: percorso => { input.value = percorso; input.dispatchEvent(new Event("change", { bubbles: true })); } }).render(true);
  }

  static async #scontroSelezionati() {
    const tok = canvas.tokens?.controlled ?? [];
    const presi = [...game.user.targets];
    if (tok.length + presi.length < 2) return ui.notifications.warn(t("SUPERFX.Avvisi.dueToken"));
    const fonti = [...new Set([...tok, ...presi])].map(x => ({ tipo: "token", token: x.document.id }));
    const g = await nuovoGruppo(fonti, { nome: fonti.map(f => canvas.scene.tokens.get(f.token)?.name).join(" × ") });
    this.aperti.add(g.id);
  }

  static async #attivaGruppo(ev, el) {
    ev.preventDefault();
    const id = PannelloSuperFX.#id(el), g = leggiRaggi().find(x => x.id === id);
    if (g) await modificaGruppo(id, { attivo: !g.attivo });
  }

  static async #eliminaGruppo(ev, el) {
    ev.preventDefault();
    const id = PannelloSuperFX.#id(el), g = leggiRaggi().find(x => x.id === id);
    if (g && await conferma("SUPERFX.Pannello.elimina", t("SUPERFX.Domande.eliminaGruppo", { nome: esc(g.nome || t("SUPERFX.Raggi.gruppo")) }))) await eliminaGruppo(id);
  }

  static async #fontiToken(ev, el) {
    const tok = canvas.tokens?.controlled ?? [];
    if (!tok.length) return ui.notifications.warn(t("SUPERFX.Avvisi.selezionaToken"));
    await aggiungiFonti(PannelloSuperFX.#id(el), tok.map(x => ({ tipo: "token", token: x.document.id })));
  }

  static async #fontePunto(ev, el) {
    const id = PannelloSuperFX.#id(el);
    this.minimize();
    const p = await scegliPunto();
    this.maximize();
    if (p) await aggiungiFonti(id, [{ tipo: "punto", ...p }]);
  }

  static async #spostaFonte(ev, el) {
    const id = PannelloSuperFX.#id(el), fid = el.closest("[data-fonte]").dataset.fonte;
    this.minimize();
    const p = await scegliPunto();
    this.maximize();
    if (p) await modificaFonte(id, fid, p);
  }

  static async #bersaglioToken(ev, el) {
    const b = [...game.user.targets][0];
    if (!b) return ui.notifications.warn(t("SUPERFX.Avvisi.prendiDiMira"));
    await impostaBersaglio(PannelloSuperFX.#id(el), { tipo: "token", token: b.document.id });
  }

  static async #bersaglioPunto(ev, el) {
    const id = PannelloSuperFX.#id(el);
    this.minimize();
    const p = await scegliPunto();
    this.maximize();
    if (p) await impostaBersaglio(id, { tipo: "punto", ...p });
  }

  static #muriSelezionati() {
    const sel = canvas.walls?.controlled ?? [];
    if (!sel.length) ui.notifications.warn(t("SUPERFX.Avvisi.selezionaMuri"));
    return sel;
  }

  static async #applicaBagliore() {
    const sel = PannelloSuperFX.#muriSelezionati();
    if (!sel.length) return;
    await canvas.scene.updateEmbeddedDocuments("Wall", sel.map(w => ({ _id: w.document.id, [`flags.${MOD}.bagliore`]: { ...this.bagliore } })));
    ui.notifications.info(t("SUPERFX.Avvisi.baglioreApplicato", { n: sel.length }));
  }

  static async #togliBagliore() {
    const sel = PannelloSuperFX.#muriSelezionati();
    for (const w of sel) await w.document.unsetFlag(MOD, "bagliore");
  }

  static #leggiBagliore() {
    const w = (canvas.walls?.controlled ?? []).find(x => x.document.getFlag(MOD, "bagliore"));
    if (!w) return ui.notifications.warn(t("SUPERFX.Avvisi.nessunMuroLuminoso"));
    this.bagliore = { ...BAGLIORE_BASE, ...w.document.getFlag(MOD, "bagliore") };
    this.render();
  }

  static #selezionaLuminosi() {
    canvas.walls?.activate?.();
    canvas.walls?.releaseAll?.();
    for (const w of canvas.walls?.placeables ?? []) if (w.document.getFlag(MOD, "bagliore")) w.control({ releaseOthers: false });
    this.render();
  }

  static async #togliTuttiBagliori() {
    const muri = canvas.scene.walls.filter(w => w.getFlag(MOD, "bagliore"));
    if (!muri.length) return;
    if (!await conferma("SUPERFX.Muri.togliTutti", t("SUPERFX.Domande.togliBagliori", { n: muri.length }))) return;
    for (const w of muri) await w.unsetFlag(MOD, "bagliore");
  }

  static async #maniglie() {
    const ora = game.settings.get(MOD, "maniglie");
    await game.settings.set(MOD, "maniglie", !ora);
    disegnaManiglie();
    this.render();
  }

  static async #copia() {
    const id = this.element.querySelector(".sfx-destinazione")?.value;
    if (id) await copiaEffetti(id);
  }

  static async #svuotaScena() {
    if (!await conferma("SUPERFX.Strumenti.svuota", t("SUPERFX.Domande.svuota", { nome: esc(canvas.scene.name) }))) return;
    await salvaEffetti([]);
    await salvaRaggi([]);
  }
}

/* -------------------------------------------- */

let PANNELLO = null;

export function apriPannello() {
  if (!game.user.isGM) return ui.notifications.warn(t("SUPERFX.Avvisi.soloMaster"));
  PANNELLO ??= new PannelloSuperFX();
  PANNELLO.render({ force: true });
  return PANNELLO;
}

/** Ridisegna il pannello se è aperto (con un piccolo ritardo per raggruppare più modifiche). */
let rimando = null;
export function ridisegnaPannello() {
  if (!PANNELLO?.rendered) return;
  clearTimeout(rimando);
  rimando = setTimeout(() => PANNELLO?.rendered && PANNELLO.render(), 60);
}

export function registraAggiornamentoPannello() {
  Hooks.on("canvasReady", ridisegnaPannello);
  Hooks.on("updateScene", (scene) => { if (scene.id === canvas.scene?.id) ridisegnaPannello(); });
  for (const h of ["createRegion", "updateRegion", "deleteRegion", "createRegionBehavior", "deleteRegionBehavior", "createWall", "updateWall", "deleteWall", "controlWall"]) {
    Hooks.on(h, () => { if (PANNELLO?.schedaAperta !== "effetti" || !h.includes("Wall")) ridisegnaPannello(); });
  }
}

/** Pulsante del pannello nella barra a sinistra (Foundry 13 e 14). */
export function aggiungiPulsanti(controls) {
  if (!game.user.isGM) return;
  for (const nome of ["tokens", "regions", "walls", "lighting"]) {
    const gruppo = controls[nome];
    if (!gruppo?.tools) continue;
    gruppo.tools.superFx = {
      name: "superFx",
      title: "SUPERFX.Pannello.pulsante",
      icon: "fa-solid fa-wand-magic-sparkles",
      order: Object.keys(gruppo.tools).length + 1,
      button: true,
      visible: true,
      onChange: () => apriPannello()
    };
  }
}
