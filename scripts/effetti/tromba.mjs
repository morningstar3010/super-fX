/**
 * SUPER FX – trombe d'aria, trombe d'acqua, turbini di fuoco e vortici magici, visti dall'alto.
 *
 * Il centro si sposta trascinando la sua maniglia sulla mappa (o con «Scegli il punto» nel pannello).
 * VAGA 0 = resta ferma; da 1 a 5 gira per l'area da sola, sempre più veloce, scegliendo nuove mete.
 * Strati: ombra a terra, tre spirali che ruotano a velocità diverse, un anello di polvere o spruzzi alla base
 * e i detriti (o le gocce, le scintille) che girano attorno al centro allargandosi e vengono sputati fuori.
 * Il livello (1-5) decide la grandezza, la forza della rotazione e quanti detriti ci sono.
 */
import { numeroColore, caso, SPECIE } from "../costanti.mjs";
import { vortice, punto, granello, anello } from "../trame.mjs";
import { EffettoBase, mescola, contenitoreParticelle } from "./base.mjs";
import { formeRegione } from "../maschere.mjs";

const RAGGIO = [0.6, 1, 1.5, 2.2, 3.2];
const DETRITI = [40, 70, 110, 160, 240];

export class Tromba extends EffettoBase {
  static ordine = 30;

  costruisci() {
    const d = this.dati, L = this.livello, G = this.G;
    this.specie = SPECIE[d.specie] ? d.specie : "aria";
    this.col = numeroColore(d.colore, numeroColore(SPECIE[this.specie]));
    const luce = this.specie === "fuoco" || this.specie === "magia";
    this.R = RAGGIO[L - 1] * G;
    this.base = d.punto ? { x: d.punto.x, y: d.punto.y } : { x: this.area.x + this.area.width / 2, y: this.area.y + this.area.height / 2 };
    this.pos = { ...this.base };
    this.meta = null;
    this.ruota = 1 + this.vel * 0.35 + L * 0.15;

    this.gruppo = new PIXI.Container();
    this.corpo.addChild(this.gruppo);
    this.ombra = new PIXI.Sprite(punto());
    this.ombra.anchor.set(0.5);
    this.ombra.tint = luce ? this.col : mescola(this.col, 0x000000, 0.7);
    this.ombra.alpha = luce ? 0.35 : 0.4;
    if (luce) this.ombra.blendMode = PIXI.BLEND_MODES.ADD;
    this.ombra.scale.set((this.R * 3) / 64);
    this.polvere = new PIXI.Sprite(anello());
    this.polvere.anchor.set(0.5);
    this.polvere.tint = mescola(this.col, 0xffffff, 0.2);
    this.polvere.alpha = 0.35;
    this.polvere.scale.set((this.R * 2.6) / 64);
    this.gruppo.addChild(this.ombra, this.polvere);
    this.spirali = [];
    [[1, 0.8, 0, 1], [1.35, 0.5, 0.25, 0.7], [0.6, 0.95, -0.25, 1.6]].forEach(([sc, alfa, chiaro, vel], i) => {
      const s = new PIXI.Sprite(vortice(5 + i));
      s.anchor.set(0.5);
      s.tint = chiaro >= 0 ? mescola(this.col, 0xffffff, chiaro) : mescola(this.col, 0x000000, -chiaro);
      s.alpha = alfa;
      if (luce) s.blendMode = PIXI.BLEND_MODES.ADD;
      s.scale.set((this.R * 2 * sc) / 256);
      this.spirali.push({ s, vel });
      this.gruppo.addChild(s);
    });
    this.cap = Math.round(DETRITI[L - 1] * Math.max(0.4, this.motore.qualita));
    this.detriti = contenitoreParticelle(this.cap);
    if (luce) this.detriti.blendMode = PIXI.BLEND_MODES.ADD;
    this.gruppo.addChild(this.detriti);
    this.lista = [];
    for (let i = 0; i < this.cap; i++) {
      const sp = new PIXI.Sprite(this.specie === "aria" ? granello() : punto());
      sp.anchor.set(0.5);
      this.detriti.addChild(sp);
      const p = { sp }; this.nasce(p, true); this.lista.push(p);
    }
  }

  nasce(p, subito) {
    p.a = Math.random() * Math.PI * 2;
    p.r = this.R * (subito ? Math.random() * 1.1 : caso(0.05, 0.35));
    p.cresce = this.R * caso(0.15, 0.5);
    p.s = this.G * (this.specie === "aria" ? caso(0.03, 0.09) : caso(0.04, 0.1));
    p.fuga = Math.random() < 0.12;
    const varia = this.specie === "aria" ? mescola(this.col, Math.random() < 0.5 ? 0x000000 : 0xffffff, caso(0, 0.35)) : mescola(this.col, 0xffffff, caso(0.2, 0.7));
    p.sp.tint = varia;
  }

  /** Il punto è dentro l'area? (per le mete quando la tromba vaga) */
  dentroArea(x, y) {
    if (!Array.isArray(this.dati.area) || !this.dati.area.length) return true;
    for (const id of this.dati.area) {
      for (const f of formeRegione(canvas.scene.regions.get(id))) {
        if (!f.buco && new PIXI.Polygon(f.punti).contains(x, y)) return true;
      }
    }
    return false;
  }

  nuovaMeta() {
    const a = this.area;
    for (let i = 0; i < 20; i++) {
      const x = a.x + this.R + Math.random() * Math.max(1, a.width - this.R * 2), y = a.y + this.R + Math.random() * Math.max(1, a.height - this.R * 2);
      if (this.dentroArea(x, y)) return { x, y };
    }
    return { ...this.base };
  }

  /** Spostamento dalla maniglia (anteprima mentre si trascina). */
  spostaPunto(x, y) { this.base = { x, y }; this.pos = { x, y }; this.meta = null; }

  aggiorna(dt, vista, tempo) {
    const vaga = Number(this.dati.vaga ?? 0);
    if (vaga > 0) {
      if (!this.meta) this.meta = this.nuovaMeta();
      const dx = this.meta.x - this.pos.x, dy = this.meta.y - this.pos.y, dist = Math.hypot(dx, dy);
      const v = this.G * 0.3 * vaga;
      if (dist < this.G * 0.5) this.meta = null;
      else { this.pos.x += (dx / dist) * v * dt + Math.sin(tempo * 1.7) * this.G * 0.2 * dt; this.pos.y += (dy / dist) * v * dt + Math.cos(tempo * 1.3) * this.G * 0.2 * dt; }
    } else {
      // anche ferma ondeggia appena
      this.pos.x = this.base.x + Math.sin(tempo * 0.9) * this.R * 0.08;
      this.pos.y = this.base.y + Math.cos(tempo * 0.7) * this.R * 0.08;
    }
    this.gruppo.position.set(this.pos.x, this.pos.y);
    // fuori dallo schermo non serve animare i detriti
    const m = this.R * 3;
    if (this.pos.x < vista.x - m || this.pos.y < vista.y - m || this.pos.x > vista.x + vista.width + m || this.pos.y > vista.y + vista.height + m) return;
    for (const { s, vel } of this.spirali) s.rotation += this.ruota * vel * dt;
    this.polvere.rotation -= this.ruota * 0.4 * dt;
    this.polvere.scale.set(((this.R * 2.6) / 64) * (1 + 0.05 * Math.sin(tempo * 3)));
    for (const p of this.lista) {
      // più è vicino al centro, più gira veloce
      const w = this.ruota * 2.2 * (this.R / Math.max(p.r, this.R * 0.25));
      p.a += w * dt;
      p.r += (p.fuga ? p.cresce * 3 : p.cresce) * dt;
      if (p.r > this.R * (p.fuga ? 2.6 : 1.35)) this.nasce(p, false);
      const k = p.r / (this.R * 1.35);
      p.sp.position.set(Math.cos(p.a) * p.r, Math.sin(p.a) * p.r * 0.92);
      p.sp.alpha = Math.min(1, k * 4) * (p.fuga ? 0.9 : Math.max(0, 1.2 - k));
      p.sp.rotation += w * dt;
      p.sp.scale.set(p.s / (this.specie === "aria" ? 8 : 32));
    }
  }
}
