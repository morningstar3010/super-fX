/**
 * SUPER FX – pioggia, neve, grandine, tempesta di sabbia e foglie al vento.
 *
 * Ogni particella cade davvero: ha un punto a terra, un'altezza che scende e una spinta del vento.
 *   INCLINAZIONE 0 = vista dall'alto: la pioggia cade dritta verso il pavimento; con la prospettiva della
 *   telecamera sopra il centro dello schermo le gocce convergono verso il punto in cui toccano terra e lì
 *   fanno lo schizzo ad anello. Più l'inclinazione cresce, più il vento le porta di lato (fino a 75 gradi:
 *   pioggia battente quasi orizzontale).
 *   DIREZIONE = verso dove soffia il vento (0 = destra, 90 = basso, 180 = sinistra, 270 = alto).
 * Le particelle esistono solo nella parte di scena che si vede: il loro numero dipende da quanta area è sullo
 * schermo, dall'intensità e dalla qualità scelta nelle impostazioni, quindi il costo resta costante anche su
 * mappe enormi. Per la tormenta, la bufera e la tempesta di sabbia si aggiunge un velo di foschia che scorre.
 */
import { numeroColore, caso } from "../costanti.mjs";
import { goccia, fiocco, granello, foglia, anello, rumore } from "../trame.mjs";
import { EffettoBase, mescola, contenitoreParticelle } from "./base.mjs";
import { DisegnoLampo } from "./fulmini.mjs";

/**
 * Parametri per tipo. dens = particelle per casella visibile ai livelli 1-5; vz = velocità di caduta in caselle al
 * secondo (in funzione della velocità 1-5); z0 = altezza da cui cadono (caselle); dim = dimensione (caselle);
 * scia = secondi di movimento disegnati come striscia (0 = punto); schizzo = "anello" | "rimbalzo" | null.
 */
const PARAMETRI = {
  pioggia:  { tex: goccia,   dens: [0.5, 1.2, 2.2, 3.6, 6],      vz: v => 10 + v * 3,    z0: 5, dim: [0.03, 0.04],  scia: 0.04, alfa: 0.5,  schizzo: "anello",   foschia: [0, 0, 0, 0.05, 0.13] },
  neve:     { tex: fiocco,   dens: [0.25, 0.6, 1.1, 1.9, 3.2],   vz: v => 0.6 + v * 0.35, z0: 4, dim: [0.04, 0.11], scia: 0,    alfa: 0.9,  oscilla: 0.35,       foschia: [0, 0, 0.04, 0.1, 0.24] },
  grandine: { tex: granello, dens: [0.15, 0.4, 0.8, 1.3, 2],     vz: v => 14 + v * 3,    z0: 5, dim: [0.05, 0.09],  scia: 0.015, alfa: 0.95, schizzo: "rimbalzo", foschia: [0, 0, 0, 0.04, 0.08] },
  sabbia:   { tex: granello, dens: [0.8, 1.8, 3, 4.5, 7],        vz: v => 1.5 + v * 0.6, z0: 2, dim: [0.02, 0.05],  scia: 0.03, alfa: 0.6,  foschia: [0.05, 0.1, 0.16, 0.25, 0.38] },
  foglie:   { tex: foglia,   dens: [0.04, 0.08, 0.14, 0.22, 0.35], vz: v => 0.5 + v * 0.25, z0: 4, dim: [0.12, 0.22], scia: 0,    alfa: 0.95, oscilla: 0.6, gira: true, varia: true, foschia: [0, 0, 0, 0, 0] }
};

/** Quanto la prospettiva allarga le particelle in alto rispetto al loro punto a terra. */
const PROSPETTIVA = 0.22;

export class Precipitazioni extends EffettoBase {
  static ordine = 40;

  costruisci() {
    const d = this.dati, P = (this.P = PARAMETRI[d.tipo] ?? PARAMETRI.pioggia), G = this.G, L = this.livello;
    this.col = numeroColore(d.colore, 0xffffff);
    const incl = Math.min(80, Math.max(0, Number(d.inclinazione ?? 0))) * Math.PI / 180;
    const dir = (Number(d.direzione ?? 0) * Math.PI) / 180;
    // la tormenta e la bufera cadono un po' più forte
    this.vz = P.vz(this.vel) * G * (1 + 0.08 * (L - 3));
    const vh = this.vz * Math.tan(incl);
    this.vx = Math.cos(dir) * vh; this.vy = Math.sin(dir) * vh;
    this.z0 = P.z0 * G;
    // più la caduta è dritta, più conta la prospettiva (dall'alto le gocce corrono verso il punto in cui cadono)
    const dritta = Math.max(0, 1 - Number(d.inclinazione ?? 0) / 30);
    this.K = (PROSPETTIVA + 0.55 * dritta) / this.z0;
    this.cap = Math.round(2600 * this.motore.qualita);
    this.particelle = [];

    // velo di foschia per i livelli alti
    const f = P.foschia[L - 1];
    if (f > 0) {
      this.foschia = new PIXI.TilingSprite(rumore(d.tipo === "sabbia" ? 4 : 2), 16, 16);
      this.foschia.tint = this.col;
      this.foschia.alpha = f;
      const tile = (G * 3) / 256;
      this.foschia.tileScale.set(tile, tile);
      this.corpo.addChild(this.foschia);
    }
    this.strato = contenitoreParticelle(this.cap);
    if (d.tipo === "sabbia") this.strato.blendMode = PIXI.BLEND_MODES.NORMAL;
    this.corpo.addChild(this.strato);
    this.schizzi = [];
    if (P.schizzo && d.schizzi !== false) {
      this.stratoSchizzi = contenitoreParticelle(Math.round(500 * this.motore.qualita));
      this.corpo.addChild(this.stratoSchizzi);
    }
    if (d.tipo === "pioggia" && d.lampi) {
      this.lampi = new DisegnoLampo(this, numeroColore("#dfe9ff"));
      this.corpo.addChild(this.lampi.cont);
    }
    this.dopoArea();
  }

  dopoArea() {
    if (!this.foschia) return;
    const a = this.area;
    this.foschia.position.set(a.x, a.y);
    this.foschia.width = a.width; this.foschia.height = a.height;
  }

  /** Mette (o rimette) una particella in cima, con il punto d'arrivo dentro il rettangolo r. */
  nasce(p, r, zCasuale) {
    const z = zCasuale ? Math.random() * this.z0 : this.z0 * caso(0.9, 1.1);
    const lx = r.x + Math.random() * r.width, ly = r.y + Math.random() * r.height;
    const T = z / this.vz;
    p.gx = lx - this.vx * T; p.gy = ly - this.vy * T; p.z = z;
    p.s = caso(this.P.dim[0], this.P.dim[1]) * this.G;
    p.fase = Math.random() * 100;
    p.giro = caso(-3, 3);
    if (this.P.varia) p.sp.tint = mescola(this.col, Math.random() < 0.5 ? 0xffffff : 0x000000, caso(0, 0.3));
  }

  nuova() {
    const sp = new PIXI.Sprite(this.P.tex());
    sp.anchor.set(0.5, this.P.scia ? 1 : 0.5);
    sp.tint = this.col;
    this.strato.addChild(sp);
    return { sp, gx: 0, gy: 0, z: 0, s: 1, fase: 0, giro: 0 };
  }

  schizzo(x, y) {
    if (!this.stratoSchizzi || this.schizzi.length >= this.stratoSchizzi.maxSize) return;
    const rimbalzo = this.P.schizzo === "rimbalzo";
    const sp = new PIXI.Sprite(rimbalzo ? granello() : anello());
    sp.anchor.set(0.5); sp.position.set(x, y); sp.tint = mescola(this.col, 0xffffff, 0.4);
    this.stratoSchizzi.addChild(sp);
    this.schizzi.push({ sp, eta: 0, vita: rimbalzo ? 0.22 : caso(0.25, 0.4), r: this.G * (rimbalzo ? 0.07 : caso(0.1, 0.2)), dx: caso(-1, 1) * this.G * 0.3, dy: caso(-1, 1) * this.G * 0.3, rimbalzo });
  }

  aggiorna(dt, vista, tempo) {
    const G = this.G, P = this.P;
    const marg = Math.max(vista.width, vista.height) * 0.25;
    const r = this.visibile(vista, marg);
    const cx = vista.x + vista.width / 2, cy = vista.y + vista.height / 2;

    if (this.foschia) { this.foschia.tilePosition.x += this.vx * 0.35 * dt; this.foschia.tilePosition.y += this.vy * 0.35 * dt; }

    // quante particelle servono per la parte visibile
    const voluto = r ? Math.min(this.cap, Math.round(P.dens[this.livello - 1] * (r.width * r.height) / (G * G) * this.motore.qualita)) : 0;
    while (this.particelle.length < voluto) { const p = this.nuova(); this.nasce(p, r, true); this.particelle.push(p); }
    while (this.particelle.length > voluto) this.particelle.pop().sp.destroy();

    for (const p of this.particelle) {
      p.z -= this.vz * dt;
      p.gx += this.vx * dt; p.gy += this.vy * dt;
      if (P.oscilla) {
        p.gx += Math.sin(tempo * 1.3 + p.fase) * G * P.oscilla * dt;
        p.gy += Math.cos(tempo * 0.9 + p.fase * 1.7) * G * P.oscilla * 0.5 * dt;
      }
      if (p.z <= 0) {
        if (this.stratoSchizzi && p.gx > vista.x && p.gx < vista.x + vista.width && p.gy > vista.y && p.gy < vista.y + vista.height) this.schizzo(p.gx, p.gy);
        this.nasce(p, r, false);
      } else {
        // la vista si è spostata: la particella che atterrerebbe fuori rinasce dentro
        const T = p.z / this.vz, lx = p.gx + this.vx * T, ly = p.gy + this.vy * T;
        if (lx < r.x || ly < r.y || lx > r.x + r.width || ly > r.y + r.height) this.nasce(p, r, true);
      }
      const f = 1 + p.z * this.K;
      const x = cx + (p.gx - cx) * f, y = cy + (p.gy - cy) * f;
      const sp = p.sp;
      sp.position.set(x, y);
      // in cima appare, vicino a terra la neve e le foglie si posano
      let a = P.alfa * Math.min(1, (this.z0 - p.z) / (this.z0 * 0.15) + 0.15);
      if (P.oscilla && p.z < this.z0 * 0.06) a *= p.z / (this.z0 * 0.06);
      sp.alpha = Math.max(0, a);
      if (P.scia) {
        // velocità sullo schermo = vento allargato dalla prospettiva + caduta verso il centro
        const vx = this.vx * f - (p.gx - cx) * this.K * this.vz, vy = this.vy * f - (p.gy - cy) * this.K * this.vz;
        const vel = Math.hypot(vx, vy);
        const lung = Math.max(p.s * 1.6, vel * P.scia);
        sp.rotation = Math.atan2(vy, vx) - Math.PI / 2;
        sp.scale.set((p.s * f) / (P.tex === goccia ? 6 : 8), lung / (P.tex === goccia ? 64 : 16));
      } else {
        const k = (p.s * f) / (P.tex === foglia ? 48 : P.tex === fiocco ? 32 : 16);
        if (P.gira) { sp.rotation += p.giro * dt; sp.scale.set(k, k * (0.55 + 0.45 * Math.abs(Math.sin(tempo * 2 + p.fase)))); }
        else sp.scale.set(k);
      }
    }

    // schizzi
    for (let i = this.schizzi.length - 1; i >= 0; i--) {
      const s = this.schizzi[i];
      s.eta += dt;
      if (s.eta >= s.vita) { s.sp.destroy(); this.schizzi.splice(i, 1); continue; }
      const k = s.eta / s.vita;
      if (s.rimbalzo) {
        s.sp.x += s.dx * dt; s.sp.y += s.dy * dt;
        s.sp.scale.set((s.r / 16) * (1 - k * 0.5));
        s.sp.alpha = 0.9 * (1 - k);
      } else {
        s.sp.scale.set((s.r * (0.2 + k)) / 32);
        s.sp.alpha = 0.55 * (1 - k);
      }
    }
    this.lampi?.aggiorna(dt, vista);
  }

  /** Lampo della tormenta (arriva dal master, uguale per tutti). */
  lampo(dati) { this.lampi?.scocca(dati); }
}
