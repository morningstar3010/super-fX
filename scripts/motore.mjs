/**
 * SUPER FX – il motore che disegna e anima tutto.
 *
 * Quando una scena si apre legge i suoi effetti, i raggi e i muri luminosi e crea un oggetto per ciascuno.
 * Un solo «ticker» (la funzione chiamata a ogni fotogramma) anima tutto, passando a ogni effetto il
 * rettangolo della scena che si vede sullo schermo: chi usa particelle le crea solo lì.
 * Quando i dati cambiano (pannello, macro, altri client) rifà SOLO gli effetti cambiati; quando cambiano le
 * regioni rifà le maschere; quando cambiano i muri rifà i bagliori.
 * Il master attivo decide quando cadono i fulmini e li manda a tutti (socket).
 */
import { MOD, log, fra } from "./costanti.mjs";
import { leggiEffetti, leggiRaggi } from "./dati.mjs";
import { Nebbia, Oscurita } from "./effetti/nebbia.mjs";
import { Precipitazioni } from "./effetti/precipitazioni.mjs";
import { Particelle } from "./effetti/particelle.mjs";
import { Liquido } from "./effetti/liquido.mjs";
import { Tromba } from "./effetti/tromba.mjs";
import { Fulmini, intervalloLampi } from "./effetti/fulmini.mjs";
import { GruppoRaggi } from "./effetti/raggi.mjs";
import { MuriLuminosi } from "./effetti/bagliori.mjs";
import { inviaATutti } from "./socket.mjs";

/** Classe di ogni tipo di effetto. */
const CLASSI = {
  nebbia: Nebbia, oscurita: Oscurita,
  pioggia: Precipitazioni, neve: Precipitazioni, grandine: Precipitazioni, sabbia: Precipitazioni, foglie: Precipitazioni,
  braci: Particelle, lucciole: Particelle,
  liquido: Liquido, tromba: Tromba, fulmini: Fulmini
};

const QUALITA = { alta: 1, media: 0.6, bassa: 0.3 };

/** Rettangolo della scena visibile sullo schermo. */
export function vista() {
  const s = canvas.stage.scale.x || 1, p = canvas.stage.pivot, sc = canvas.app.screen;
  return new PIXI.Rectangle(p.x - sc.width / 2 / s, p.y - sc.height / 2 / s, sc.width / s, sc.height / s);
}

class Motore {
  constructor() {
    this.istanze = new Map();   // chiave ("e:id", "r:id", "muri") → oggetto grafico
    this.firme = new Map();     // chiave → dati in testo, per capire cosa è cambiato
    this.lampi = new Map();     // chiave → secondi al prossimo fulmine (solo master attivo)
    this.radice = null;
    this.radiceSotto = null;
    this.tempo = 0;
    this.qualita = 1;
    this._ticker = null;
    this._rimandi = {};
  }

  get attivo() {
    try { return game.settings.get(MOD, "attivo") !== false; } catch (err) { return true; }
  }

  /** Scena pronta: crea i contenitori, gli effetti e il ticker. */
  avvia() {
    this.ferma();
    if (!canvas?.ready || !canvas.scene) return;
    try { this.qualita = QUALITA[game.settings.get(MOD, "qualita")] ?? 1; } catch (err) { this.qualita = 1; }
    this.radice = new PIXI.Container();
    this.radice.eventMode = "none";
    this.radice.sortableChildren = true;
    (canvas.weather ?? canvas.primary).addChild(this.radice);
    this.radiceSotto = new PIXI.Container();
    this.radiceSotto.eventMode = "none";
    this.radiceSotto.sortableChildren = true;
    // sopra lo sfondo della scena, sotto tessere, disegni e token
    Object.assign(this.radiceSotto, { elevation: 0, sortLayer: 100, sort: 0, zIndex: 0 });
    try { canvas.primary.addChild(this.radiceSotto); canvas.primary.sortDirty = true; }
    catch (err) { this.radice.addChild(this.radiceSotto); }
    this.sincronizza();
    this._ticker = () => this.passo();
    canvas.app.ticker.add(this._ticker);
  }

  /** Scena chiusa: toglie tutto. */
  ferma() {
    if (this._ticker) canvas.app?.ticker?.remove(this._ticker);
    this._ticker = null;
    for (const i of this.istanze.values()) { try { i.distruggi(); } catch (err) { /* già tolto */ } }
    this.istanze.clear(); this.firme.clear(); this.lampi.clear();
    for (const r of [this.radice, this.radiceSotto]) if (r && !r.destroyed) r.destroy({ children: true });
    this.radice = this.radiceSotto = null;
  }

  /** Dati che devono esistere ora: chiave → { Classe, dati }. */
  voluti() {
    const out = new Map();
    if (!this.attivo || !canvas.scene) return out;
    const gm = game.user.isGM;
    for (const e of leggiEffetti()) {
      if (!e.attivo || (e.soloMaster && !gm) || !CLASSI[e.tipo]) continue;
      out.set(`e:${e.id}`, { Classe: CLASSI[e.tipo], dati: e });
    }
    for (const g of leggiRaggi()) {
      if (!g.attivo || (g.soloMaster && !gm)) continue;
      out.set(`r:${g.id}`, { Classe: GruppoRaggi, dati: g });
    }
    if (canvas.scene.walls.some(w => w.getFlag(MOD, "bagliore"))) out.set("muri", { Classe: MuriLuminosi, dati: { tipo: "muri" } });
    return out;
  }

  /** Crea, rifà o toglie gli effetti in base ai dati attuali. */
  sincronizza() {
    if (!this.radice) return;
    const voluti = this.voluti();
    for (const [k, i] of this.istanze) if (!voluti.has(k)) { i.distruggi(); this.istanze.delete(k); this.firme.delete(k); this.lampi.delete(k); }
    for (const [k, { Classe, dati }] of voluti) {
      const firma = JSON.stringify(dati);
      if (this.firme.get(k) === firma && this.istanze.has(k)) continue;
      this.crea(k, Classe, dati, firma);
    }
  }

  crea(k, Classe, dati, firma) {
    this.istanze.get(k)?.distruggi();
    try {
      const i = new Classe(dati, this);
      const sotto = Classe.strato === "sotto" && dati.sottoToken !== false;
      (sotto ? this.radiceSotto : this.radice).addChild(i.cont);
      this.istanze.set(k, i);
      this.firme.set(k, firma ?? JSON.stringify(dati));
    } catch (err) {
      console.error("Super FX | effetto non creato", dati, err);
      this.istanze.delete(k); this.firme.delete(k);
    }
  }

  /** Anteprima dal pannello (cursori trascinati): rifà l'effetto con dati non ancora salvati. */
  anteprima(id, dati) {
    if (!this.radice) return;
    const k = `e:${id}`, Classe = CLASSI[dati.tipo];
    if (!Classe || !dati.attivo) return;
    cancelAnimationFrame(this._rimandi[k]);
    this._rimandi[k] = requestAnimationFrame(() => this.crea(k, Classe, dati));
  }

  anteprimaRaggi(id, dati) {
    if (!this.radice) return;
    const k = `r:${id}`;
    cancelAnimationFrame(this._rimandi[k]);
    this._rimandi[k] = requestAnimationFrame(() => this.crea(k, GruppoRaggi, dati));
  }

  /** Maniglia trascinata: sposta subito il punto (chiave = "e:id" o "r:id", sotto = id della fonte o "bersaglio"). */
  spostaPunto(k, x, y, sotto) { this.istanze.get(k)?.spostaPunto?.(x, y, sotto); }
  fineSpostamento(k, sotto) { this.istanze.get(k)?.fineSpostamento?.(sotto); }

  /** Le regioni sono cambiate: maschere nuove (con un piccolo ritardo per raggruppare le modifiche). */
  rifaiMaschere() {
    clearTimeout(this._rimandi.maschere);
    this._rimandi.maschere = setTimeout(() => { for (const i of this.istanze.values()) { try { i.rifaiMaschera(); } catch (err) { log("maschera", err); } } }, 150);
  }

  /** I muri sono cambiati: bagliori nuovi. */
  rifaiMuri() {
    clearTimeout(this._rimandi.muri);
    this._rimandi.muri = setTimeout(() => {
      const m = this.istanze.get("muri");
      if (m) m.rifai();
      this.sincronizza();
    }, 120);
  }

  /** A ogni fotogramma. */
  passo() {
    if (!this.radice || this.radice.destroyed) return;
    const dt = fra(canvas.app.ticker.deltaMS / 1000, 0, 0.1);
    this.tempo += dt;
    const v = vista();
    for (const [k, i] of this.istanze) {
      try { i.aggiorna(dt, v, this.tempo); }
      catch (err) { console.error("Super FX | effetto fermato", i.dati, err); i.distruggi(); this.istanze.delete(k); }
    }
    if (game.users.activeGM?.isSelf) this.programmaLampi(dt, v);
  }

  /** Solo il master attivo: quando arriva il momento manda un fulmine a tutti. */
  programmaLampi(dt, v) {
    for (const [k, i] of this.istanze) {
      if (!k.startsWith("e:")) continue;
      const media = intervalloLampi(i.dati);
      if (!media) continue;
      let resto = this.lampi.get(k);
      if (resto === undefined) resto = media * (0.2 + Math.random() * 0.8);
      resto -= dt;
      if (resto <= 0) {
        resto = media * (0.5 + Math.random());
        const r = i.visibile(v, 0) ?? i.area;
        inviaATutti("lampo", {
          scena: canvas.scene.id, id: i.dati.id, seme: Math.floor(Math.random() * 2 ** 31),
          x: r.x + Math.random() * r.width, y: r.y + Math.random() * r.height
        });
      }
      this.lampi.set(k, resto);
    }
  }

  /** Arriva un fulmine (su ogni client). */
  lampo(dati) {
    if (!this.radice || dati?.scena !== canvas.scene?.id) return;
    const i = this.istanze.get(`e:${dati.id}`);
    if (!i?.lampo) return;
    i.lampo(dati);
    const suono = i.dati.suono;
    if (suono) {
      let volume = 0.5;
      try { volume = 0.8 * (game.settings.get("core", "globalAmbientVolume") ?? 0.6); } catch (err) { /* impostazione assente */ }
      setTimeout(() => foundry.audio.AudioHelper.play({ src: suono, volume, loop: false }, false), 250 + Math.random() * 1100);
    }
  }

  /** Lampo comandato dal pannello (master): fulmine subito su un effetto con i lampi. */
  lampoOra(id) {
    const i = this.istanze.get(`e:${id}`);
    if (!i?.lampo) return;
    const r = i.visibile(vista(), 0) ?? i.area;
    inviaATutti("lampo", { scena: canvas.scene.id, id, seme: Math.floor(Math.random() * 2 ** 31), x: r.x + Math.random() * r.width, y: r.y + Math.random() * r.height });
  }
}

export const motore = new Motore();

/** Hook che tengono il motore aggiornato. Da chiamare una volta, all'avvio. */
export function registraMotore() {
  Hooks.on("canvasReady", () => motore.avvia());
  Hooks.on("canvasTearDown", () => motore.ferma());
  Hooks.on("updateScene", (scene, cambi) => {
    if (scene.id !== canvas.scene?.id) return;
    const f = cambi.flags?.[MOD];
    if (f || Object.keys(cambi.flags ?? {}).some(k => k.startsWith(`${MOD}`) || k.startsWith(`-=${MOD}`))) motore.sincronizza();
  });
  const regione = doc => { const s = doc?.parent?.parent ?? doc?.parent; if (s?.id === canvas.scene?.id) motore.rifaiMaschere(); };
  for (const h of ["createRegion", "updateRegion", "deleteRegion"]) Hooks.on(h, doc => { if (doc.parent?.id === canvas.scene?.id) motore.rifaiMaschere(); });
  for (const h of ["createRegionBehavior", "updateRegionBehavior", "deleteRegionBehavior"]) Hooks.on(h, regione);
  for (const h of ["createWall", "updateWall", "deleteWall"]) Hooks.on(h, doc => { if (doc.parent?.id === canvas.scene?.id) motore.rifaiMuri(); });
}
