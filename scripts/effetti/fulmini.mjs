/**
 * SUPER FX – fulmini.
 *
 * Il master attivo decide QUANDO e DOVE cade un fulmine e lo manda a tutti (socket), con un seme numerico:
 * ogni client disegna così la stessa saetta nello stesso punto e nello stesso istante.
 * Il lampo illumina tutta la parte visibile dell'area (non dentro le zone «Senza effetti»: al chiuso si
 * vede solo dalle finestre se le zone sono fatte bene), la saetta ramificata si stampa per un attimo sul terreno
 * e il tuono (se è stato scelto un suono) arriva poco dopo.
 * La stessa cosa serve alla pioggia con l'opzione «Lampi».
 */
import { numeroColore, fra } from "../costanti.mjs";
import { punto } from "../trame.mjs";
import { EffettoBase, casoConSeme, mescola } from "./base.mjs";

/** Andamento della luce del lampo nel tempo (secondi → intensità): doppio bagliore e coda. */
const CURVA = [[0, 0], [0.03, 1], [0.08, 0.25], [0.14, 0.95], [0.22, 0.2], [0.32, 0.6], [0.45, 0.15], [0.8, 0]];
const DURATA = 0.8;

function curva(t) {
  for (let i = 1; i < CURVA.length; i++) {
    const [t1, v1] = CURVA[i];
    if (t <= t1) { const [t0, v0] = CURVA[i - 1]; return v0 + (v1 - v0) * ((t - t0) / (t1 - t0)); }
  }
  return 0;
}

/** Il disegno di un lampo, usato dai fulmini e dalla pioggia. */
export class DisegnoLampo {
  constructor(effetto, colore) {
    this.effetto = effetto;
    this.colore = colore;
    this.cont = new PIXI.Container();
    this.velo = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.velo.tint = mescola(colore, 0xffffff, 0.3);
    this.velo.alpha = 0;
    this.saetta = new PIXI.Graphics();
    this.saetta.blendMode = PIXI.BLEND_MODES.ADD;
    this.alone = new PIXI.Sprite(punto());
    this.alone.anchor.set(0.5);
    this.alone.tint = colore;
    this.alone.blendMode = PIXI.BLEND_MODES.ADD;
    this.cont.addChild(this.velo, this.alone, this.saetta);
    this.cont.visible = false;
    this.t = DURATA;
    this.forza = 0.5;
  }

  /** Disegna la saetta con il seme ricevuto. */
  scocca({ seme, x, y, forza = 0.6 }) {
    const G = this.effetto.G, rnd = casoConSeme(seme);
    const g = this.saetta;
    g.clear();
    const rami = [];
    const ramo = (x0, y0, ang, lung, spess, livello) => {
      const punti = [[x0, y0]];
      let px = x0, py = y0;
      const passi = Math.max(4, Math.round(lung / (G * 0.35)));
      for (let i = 0; i < passi; i++) {
        ang += (rnd() - 0.5) * 0.9;
        const l = (lung / passi) * (0.6 + rnd() * 0.8);
        px += Math.cos(ang) * l; py += Math.sin(ang) * l;
        punti.push([px, py]);
        if (livello < 2 && rnd() < 0.22) ramo(px, py, ang + (rnd() < 0.5 ? -1 : 1) * (0.5 + rnd() * 0.6), lung * 0.45, spess * 0.55, livello + 1);
      }
      rami.push({ punti, spess });
    };
    const n = 2 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) ramo(x, y, rnd() * Math.PI * 2, G * (3 + rnd() * 5), G * 0.09, 0);
    for (const [larg, col, a] of [[3.2, this.colore, 0.35], [1.4, mescola(this.colore, 0xffffff, 0.5), 0.8], [0.45, 0xffffff, 1]]) {
      for (const r of rami) {
        g.lineStyle({ width: r.spess * larg, color: col, alpha: a, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.ROUND });
        g.moveTo(r.punti[0][0], r.punti[0][1]);
        for (let i = 1; i < r.punti.length; i++) g.lineTo(r.punti[i][0], r.punti[i][1]);
      }
    }
    this.alone.position.set(x, y);
    this.alone.scale.set((G * 9) / 64);
    this.forza = fra(forza, 0.1, 1);
    this.t = 0;
    this.cont.visible = true;
  }

  aggiorna(dt, vista) {
    if (this.t >= DURATA) { this.cont.visible = false; return; }
    this.t += dt;
    const k = curva(this.t);
    this.velo.position.set(vista.x, vista.y);
    this.velo.width = vista.width; this.velo.height = vista.height;
    this.velo.alpha = k * 0.55 * this.forza;
    this.saetta.alpha = Math.min(1, k * 1.4) * (this.t < 0.5 ? 1 : 0);
    this.alone.alpha = k * 0.8;
  }
}

/** Effetto «Fulmini»: solo lampi, senza pioggia. */
export class Fulmini extends EffettoBase {
  static ordine = 60;

  costruisci() {
    this.disegno = new DisegnoLampo(this, numeroColore(this.dati.colore, 0xcfe3ff));
    this.corpo.addChild(this.disegno.cont);
  }

  aggiorna(dt, vista) { this.disegno.aggiorna(dt, vista); }

  lampo(dati) { this.disegno.scocca({ ...dati, forza: 0.35 + this.livello * 0.13 }); }
}

/** Ogni quanti secondi (in media) cade un fulmine. null = mai. */
export function intervalloLampi(dati) {
  if (dati.tipo === "fulmini") return [40, 25, 15, 8, 4][fra(Math.round(Number(dati.frequenza ?? 3)), 1, 5) - 1];
  if (dati.tipo === "pioggia" && dati.lampi) return [60, 40, 25, 15, 8][fra(Math.round(Number(dati.intensita ?? 3)), 1, 5) - 1];
  return null;
}
