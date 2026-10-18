/**
 * SUPER FX – braci e lucciole.
 *
 * BRACI (e cenere ardente): scintille che salgono e vanno nella direzione scelta, ondeggiano nell'aria calda,
 * tremolano e si spengono. Ottime per incendi, forge, vulcani, città in fiamme.
 * LUCCIOLE (o spiriti, spore luminose): punti di luce che vagano piano cambiando direzione e pulsano.
 * Come la pioggia esistono solo nella parte visibile dell'area.
 */
import { numeroColore, caso } from "../costanti.mjs";
import { punto } from "../trame.mjs";
import { EffettoBase, mescola, contenitoreParticelle } from "./base.mjs";

const DENSITA = { braci: [0.05, 0.12, 0.25, 0.4, 0.7], lucciole: [0.02, 0.05, 0.09, 0.15, 0.25] };

export class Particelle extends EffettoBase {
  static ordine = 35;

  costruisci() {
    const d = this.dati;
    this.braci = d.tipo === "braci";
    this.col = numeroColore(d.colore, this.braci ? 0xff8a2a : 0xd6ff6a);
    this.cap = Math.round(900 * this.motore.qualita);
    this.strato = contenitoreParticelle(this.cap);
    this.strato.blendMode = PIXI.BLEND_MODES.ADD;
    this.corpo.addChild(this.strato);
    this.lista = [];
    const dir = (Number(d.direzione ?? 270) * Math.PI) / 180;
    const v = this.G * (0.3 + this.vel * 0.25);
    this.vx = Math.cos(dir) * v; this.vy = Math.sin(dir) * v;
  }

  nasce(p, r, subito) {
    p.x = r.x + Math.random() * r.width; p.y = r.y + Math.random() * r.height;
    p.eta = subito ? Math.random() * 3 : 0;
    p.vita = this.braci ? caso(1.8, 4.5) : caso(4, 9);
    p.s = this.G * (this.braci ? caso(0.04, 0.1) : caso(0.08, 0.16));
    p.fase = Math.random() * 100;
    p.ang = Math.random() * Math.PI * 2;
    p.sp.tint = this.braci ? mescola(this.col, 0xffe08a, caso(0, 0.6)) : mescola(this.col, 0xffffff, caso(0, 0.35));
  }

  aggiorna(dt, vista, tempo) {
    const G = this.G, r = this.visibile(vista, G * 2);
    const voluto = r ? Math.min(this.cap, Math.round(DENSITA[this.braci ? "braci" : "lucciole"][this.livello - 1] * (r.width * r.height) / (G * G) * this.motore.qualita)) : 0;
    while (this.lista.length < voluto) {
      const sp = new PIXI.Sprite(punto()); sp.anchor.set(0.5); this.strato.addChild(sp);
      const p = { sp }; this.nasce(p, r, true); this.lista.push(p);
    }
    while (this.lista.length > voluto) this.lista.pop().sp.destroy();
    for (const p of this.lista) {
      p.eta += dt;
      const fuori = p.x < r.x - G || p.y < r.y - G || p.x > r.x + r.width + G || p.y > r.y + r.height + G;
      if (p.eta >= p.vita || fuori) { this.nasce(p, r, false); continue; }
      const k = p.eta / p.vita;
      if (this.braci) {
        p.x += (this.vx + Math.sin(tempo * 2.1 + p.fase) * G * 0.5) * dt;
        p.y += (this.vy + Math.cos(tempo * 1.7 + p.fase) * G * 0.3) * dt;
        const trem = 0.7 + 0.3 * Math.sin(tempo * 23 + p.fase);
        p.sp.alpha = Math.min(1, k * 6) * (1 - k) * trem;
        p.sp.scale.set((p.s * (1 - k * 0.6)) / 64 * 2);
      } else {
        // vaga: la direzione cambia piano piano
        p.ang += Math.sin(tempo * 0.7 + p.fase) * 1.4 * dt;
        const v = G * 0.15 * Math.max(0.3, this.vel);
        p.x += Math.cos(p.ang) * v * dt; p.y += Math.sin(p.ang) * v * dt;
        const pulsa = 0.5 + 0.5 * Math.sin(tempo * 2.2 + p.fase);
        p.sp.alpha = Math.min(1, k * 4, (1 - k) * 4) * (0.25 + 0.75 * pulsa);
        p.sp.scale.set((p.s * (0.7 + 0.3 * pulsa)) / 64 * 2);
      }
      p.sp.position.set(p.x, p.y);
    }
  }
}
