/**
 * SUPER FX – base comune di tutti gli effetti.
 *
 * Ogni effetto è un contenitore PIXI con dentro il «corpo» (le cose che si muovono) e, se serve, la maschera
 * che lo fa vedere solo nell'area scelta e lo toglie dalle zone «Senza effetti».
 * Il motore chiama aggiorna(dt, vista, tempo) a ogni fotogramma: dt in secondi, vista = rettangolo della
 * scena che si vede sullo schermo, tempo = secondi dall'avvio.
 */
import { fra } from "../costanti.mjs";
import { creaMaschera, rettangoloArea } from "../maschere.mjs";

export class EffettoBase {
  /** "meteo" = sopra token e mappa; "sotto" = sopra la mappa ma sotto i token (liquidi). */
  static strato = "meteo";
  /** Ordine di disegno fra gli effetti dello stesso strato (più alto = sopra). */
  static ordine = 10;
  /** false = l'effetto non usa la maschera (per esempio i raggi). */
  static usaMaschera = true;

  constructor(dati, motore) {
    this.dati = dati;
    this.motore = motore;
    this.G = canvas.dimensions.size;
    this.cont = new PIXI.Container();
    this.cont.eventMode = "none";
    this.cont.zIndex = this.constructor.ordine;
    this.corpo = new PIXI.Container();
    this.cont.addChild(this.corpo);
    this.maschera = null;
    this.calcolaArea();
    if (this.constructor.usaMaschera) this.applicaMaschera();
    this.costruisci();
  }

  /** Livello 1-5. */
  get livello() { return fra(Math.round(Number(this.dati.intensita ?? 3)), 1, 5); }

  /** Velocità 1-5. */
  get vel() { return fra(Number(this.dati.velocita ?? 3), 0, 5); }

  /** Rettangolo dell'area dentro la scena. */
  calcolaArea() {
    const s = canvas.dimensions.sceneRect;
    const a = rettangoloArea(this.dati, canvas.scene);
    const x0 = Math.max(s.x, a.x), y0 = Math.max(s.y, a.y);
    const x1 = Math.min(s.x + s.width, a.x + a.width), y1 = Math.min(s.y + s.height, a.y + a.height);
    this.area = x1 > x0 && y1 > y0 ? new PIXI.Rectangle(x0, y0, x1 - x0, y1 - y0) : new PIXI.Rectangle(s.x, s.y, s.width, s.height);
  }

  /** Ridisegna la maschera (quando cambiano le regioni). */
  applicaMaschera() {
    if (this.maschera) {
      this.corpo.mask = null;
      const tex = this.maschera.texture;
      this.maschera.destroy();
      tex?.destroy(true);
      this.maschera = null;
    }
    const m = creaMaschera(this.dati, canvas.scene);
    if (!m) return;
    this.maschera = m.sprite;
    this.cont.addChild(this.maschera);
    this.corpo.mask = this.maschera;
  }

  /** Regioni cambiate: nuova area e nuova maschera. */
  rifaiMaschera() {
    this.calcolaArea();
    if (this.constructor.usaMaschera) this.applicaMaschera();
    this.dopoArea?.();
  }

  /** Da riscrivere: crea gli oggetti grafici. */
  costruisci() {}

  /** Da riscrivere: anima. */
  aggiorna(dt, vista, tempo) {}

  /** Parte visibile dell'area (con un margine), o null se l'area è fuori dallo schermo. */
  visibile(vista, margine = 0) {
    const a = this.area, m = margine;
    const x0 = Math.max(a.x, vista.x - m), y0 = Math.max(a.y, vista.y - m);
    const x1 = Math.min(a.x + a.width, vista.x + vista.width + m), y1 = Math.min(a.y + a.height, vista.y + vista.height + m);
    return x1 > x0 && y1 > y0 ? new PIXI.Rectangle(x0, y0, x1 - x0, y1 - y0) : null;
  }

  distruggi() {
    this.prima?.();
    const tex = this.maschera?.texture;
    if (!this.cont.destroyed) this.cont.destroy({ children: true, texture: false, baseTexture: false });
    tex?.destroy(true);
    this.maschera = null;
  }
}

/** Generatore di numeri casuali con seme (uguale su tutti i client: fulmini). */
export function casoConSeme(seme) {
  let a = (seme >>> 0) || 1;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mescola due colori numerici (k = 0 → a, 1 → b). */
export function mescola(a, b, k) {
  const r = ((a >> 16) & 255) + (((b >> 16) & 255) - ((a >> 16) & 255)) * k;
  const g = ((a >> 8) & 255) + (((b >> 8) & 255) - ((a >> 8) & 255)) * k;
  const bl = (a & 255) + ((b & 255) - (a & 255)) * k;
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(bl);
}

/** ParticleContainer con posizione, scala, rotazione e tinta (la tinta porta anche la trasparenza). */
export function contenitoreParticelle(max) {
  return new PIXI.ParticleContainer(max, { vertices: true, position: true, rotation: true, tint: true, uvs: false }, 2048, true);
}
