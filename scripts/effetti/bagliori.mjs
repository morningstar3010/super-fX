/**
 * SUPER FX – muri che emettono bagliori (rune sulle pareti, barriere magiche, lava nelle crepe, cristalli,
 * campi di forza, porte sigillate).
 *
 * Il bagliore è un flag del muro (`flags.super-fx.bagliore` = { colore, intensita, pulsazione, larghezza, faville }):
 * si mette e si toglie dal pannello sui muri selezionati, e segue il muro se lo si sposta.
 * Disegno: alone largo, anima chiara sottile, due punti di luce alle estremità; PULSAZIONE 0 = luce ferma,
 * da 1 a 5 respira sempre più in fretta; FAVILLE = scintille che si staccano dalla parete.
 */
import { MOD, numeroColore, caso, fra, BAGLIORE_BASE } from "../costanti.mjs";
import { punto, bastone } from "../trame.mjs";
import { EffettoBase, mescola, contenitoreParticelle } from "./base.mjs";

const ALFA = [0.3, 0.5, 0.7, 0.85, 1];

export class MuriLuminosi extends EffettoBase {
  static ordine = 8;
  static usaMaschera = false;

  costruisci() {
    this.muri = [];
    this.cap = Math.round(400 * Math.max(0.4, this.motore.qualita));
    this.faville = contenitoreParticelle(this.cap);
    this.faville.blendMode = PIXI.BLEND_MODES.ADD;
    this.lista = [];
    this.stratoMuri = new PIXI.Container();
    this.corpo.addChild(this.stratoMuri, this.faville);
    this.rifai();
  }

  /** Rilegge i muri con il bagliore. */
  rifai() {
    this.stratoMuri.removeChildren().forEach(c => c.destroy({ children: true }));
    this.muri = [];
    const G = this.G;
    for (const w of canvas.scene?.walls ?? []) {
      const b = w.getFlag(MOD, "bagliore");
      if (!b) continue;
      const o = { ...BAGLIORE_BASE, ...b };
      const [ax, ay, bx, by] = w.c;
      const L = Math.hypot(bx - ax, by - ay);
      if (L < 1) continue;
      const col = numeroColore(o.colore, 0x7ad7ff), W = Math.max(0.05, Number(o.larghezza)) * G;
      const g = new PIXI.Container();
      g.position.set(ax, ay); g.rotation = Math.atan2(by - ay, bx - ax);
      // alone con le estremità sfumate: la trama ha 32 pixel di sfumatura per lato, che restano tali allungandola
      const largo = new PIXI.NineSlicePlane(bastone(), 32, 0, 32, 0); largo.tint = col; largo.blendMode = PIXI.BLEND_MODES.ADD;
      const k = (W * 3) / 64;
      largo.scale.set(k); largo.width = (L + W * 3) / k; largo.height = 64; largo.position.set(-W * 1.5, -W * 1.5);
      const anima = new PIXI.NineSlicePlane(bastone(), 32, 0, 32, 0); anima.tint = mescola(col, 0xffffff, 0.65); anima.blendMode = PIXI.BLEND_MODES.ADD;
      const ka = (W * 0.5) / 64;
      anima.scale.set(ka); anima.width = (L + W * 0.5) / ka; anima.height = 64; anima.position.set(-W * 0.25, -W * 0.25);
      const capi = [0, L].map(x => { const s = new PIXI.Sprite(punto()); s.anchor.set(0.5); s.x = x; s.tint = col; s.blendMode = PIXI.BLEND_MODES.ADD; s.scale.set((W * 1.6) / 64); return s; });
      g.addChild(largo, anima, ...capi);
      this.stratoMuri.addChild(g);
      this.muri.push({ g, largo, anima, capi, o, col, L, W, ax, ay, bx, by, fase: Math.random() * 10, alfa: ALFA[fra(Math.round(o.intensita), 1, 5) - 1] });
    }
  }

  aggiorna(dt, vista, tempo) {
    const G = this.G;
    for (const m of this.muri) {
      const p = fra(Number(m.o.pulsazione ?? 0), 0, 5);
      const k = p ? 0.7 + 0.3 * Math.sin(tempo * p * 1.1 + m.fase) : 1;
      m.largo.alpha = m.alfa * 0.8 * k;
      m.anima.alpha = Math.min(1, m.alfa * 1.1) * (0.8 + 0.2 * k);
      for (const c of m.capi) c.alpha = m.alfa * 0.7 * k;
      if (m.o.faville && this.lista.length < this.cap) {
        // solo se il muro è sullo schermo
        const x0 = Math.min(m.ax, m.bx), x1 = Math.max(m.ax, m.bx), y0 = Math.min(m.ay, m.by), y1 = Math.max(m.ay, m.by);
        if (x1 < vista.x || y1 < vista.y || x0 > vista.x + vista.width || y0 > vista.y + vista.height) continue;
        if (Math.random() < dt * (m.L / G) * 1.5 * m.alfa) {
          const u = Math.random(), x = m.ax + (m.bx - m.ax) * u, y = m.ay + (m.by - m.ay) * u;
          const nor = Math.atan2(m.by - m.ay, m.bx - m.ax) + (Math.random() < 0.5 ? 1 : -1) * Math.PI / 2;
          const sp = new PIXI.Sprite(punto()); sp.anchor.set(0.5); sp.position.set(x, y); sp.tint = mescola(m.col, 0xffffff, caso(0, 0.5));
          this.faville.addChild(sp);
          const v = G * caso(0.2, 0.7);
          this.lista.push({ sp, vx: Math.cos(nor) * v, vy: Math.sin(nor) * v, eta: 0, vita: caso(0.6, 1.6), s: G * caso(0.03, 0.07) });
        }
      }
    }
    for (let i = this.lista.length - 1; i >= 0; i--) {
      const s = this.lista[i];
      s.eta += dt;
      if (s.eta >= s.vita) { s.sp.destroy(); this.lista.splice(i, 1); continue; }
      s.sp.x += s.vx * dt; s.sp.y += s.vy * dt;
      const k = 1 - s.eta / s.vita;
      s.sp.alpha = k; s.sp.scale.set((s.s * (0.5 + k)) / 32);
    }
  }
}
