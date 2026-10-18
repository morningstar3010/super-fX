/**
 * SUPER FX – raggi di energia che si scontrano.
 *
 * Un GRUPPO di raggi ha delle FONTI (token oppure punti liberi sulla mappa, ognuna col suo colore) e,
 * se si vuole, un BERSAGLIO (token o punto):
 *  - con il bersaglio, ogni fonte spara un raggio sul bersaglio;
 *  - senza bersaglio, i raggi si incontrano: con due fonti il punto di scontro va avanti e indietro (si
 *    contendono il centro), con tre o più si scontrano nel mezzo;
 *  - con una sola fonte e nessun bersaglio la fonte si carica (globo pulsante).
 * Le posizioni si leggono a ogni fotogramma: quando un token si muove (anche durante l'animazione del
 * movimento) o una maniglia viene trascinata, il raggio si allunga o si accorcia subito.
 * LUNGHEZZA MASSIMA: 0 = il raggio si allunga sempre; altrimenti, oltre quella distanza (in caselle) il raggio
 * si interrompe con uno sfrigolio e torna quando le fonti si riavvicinano.
 * CONTRO I MURI: «si ferma» = il raggio si spegne contro il primo muro che blocca la vista; «attraversa» = li ignora.
 */
import { numeroColore, caso, fra } from "../costanti.mjs";
import { fascia, punto, energia } from "../trame.mjs";
import { EffettoBase, mescola, contenitoreParticelle } from "./base.mjs";

const ADD = () => PIXI.BLEND_MODES.ADD;

/** Primo muro fra due punti (null se non ce ne sono). */
function collisione(a, b) {
  try {
    const be = CONFIG.Canvas.polygonBackends?.sight;
    const hit = be?.testCollision?.({ x: a.x, y: a.y }, { x: b.x, y: b.y }, { type: "sight", mode: "closest" });
    return hit ? { x: hit.x, y: hit.y } : null;
  } catch (err) { return null; }
}

export class GruppoRaggi extends EffettoBase {
  static ordine = 50;
  static usaMaschera = false;

  costruisci() {
    this.raggi = new Map();
    this.anteprime = new Map();
    this.stratoRaggi = new PIXI.Container();
    this.centro = new PIXI.Container();
    for (let k = 0; k < 4; k++) { const s = new PIXI.Sprite(punto()); s.anchor.set(0.5); s.blendMode = ADD(); this.centro.addChild(s); }
    this.centro.visible = false;
    this.alfaCentro = 0;
    this.cap = Math.round(500 * Math.max(0.4, this.motore.qualita));
    this.scintille = contenitoreParticelle(this.cap);
    this.scintille.blendMode = ADD();
    this.lista = [];
    this.corpo.addChild(this.stratoRaggi, this.centro, this.scintille);
  }

  /** Posizione di una fonte o del bersaglio (null se il token non c'è o è nascosto ai giocatori). */
  posizione(ancora, chiave) {
    if (!ancora) return null;
    const ant = this.anteprime.get(chiave);
    if (ant) return ant;
    if (ancora.tipo === "token") {
      const tok = canvas.tokens?.get(ancora.token);
      if (!tok || tok.destroyed) return null;
      if (!game.user.isGM && tok.document.hidden) return null;
      return { x: tok.x + tok.w / 2, y: tok.y + tok.h / 2 };
    }
    return Number.isFinite(ancora.x) ? { x: ancora.x, y: ancora.y } : null;
  }

  /** Spostamento dalla maniglia (anteprima mentre si trascina): chiave = id della fonte o "bersaglio". */
  spostaPunto(x, y, chiave) { this.anteprime.set(chiave, { x, y }); }
  fineSpostamento(chiave) { this.anteprime.delete(chiave); }

  raggio(f) {
    let r = this.raggi.get(f.id);
    if (r) return r;
    const col = numeroColore(f.colore, 0xe001fe);
    const g = new PIXI.Container();
    const largo = new PIXI.Sprite(fascia()); largo.anchor.set(0, 0.5); largo.tint = col; largo.alpha = 0.5; largo.blendMode = ADD();
    const corpo = new PIXI.TilingSprite(energia(), 16, 64); corpo.anchor.set(0, 0.5); corpo.tint = col; corpo.blendMode = ADD();
    const anima = new PIXI.Sprite(fascia()); anima.anchor.set(0, 0.5); anima.tint = mescola(col, 0xffffff, 0.75); anima.alpha = 0.85; anima.blendMode = ADD();
    const impatto = new PIXI.Container();
    for (let k = 0; k < 2; k++) { const s = new PIXI.Sprite(punto()); s.anchor.set(0.5); s.blendMode = ADD(); s.tint = k ? 0xffffff : col; impatto.addChild(s); }
    g.addChild(largo, corpo, anima);
    this.stratoRaggi.addChild(g, impatto);
    r = { g, largo, corpo, anima, impatto, col, alfa: 0, fase: Math.random() * 10 };
    this.raggi.set(f.id, r);
    return r;
  }

  scintilla(x, y, col, ang, ventaglio) {
    if (this.lista.length >= this.cap) return;
    const sp = new PIXI.Sprite(punto()); sp.anchor.set(0.5); sp.position.set(x, y);
    sp.tint = mescola(col, 0xffffff, caso(0, 0.6));
    this.scintille.addChild(sp);
    const a = ang + (Math.random() - 0.5) * ventaglio, v = this.G * caso(1.5, 4.5);
    this.lista.push({ sp, vx: Math.cos(a) * v, vy: Math.sin(a) * v, eta: 0, vita: caso(0.3, 0.8), s: this.G * caso(0.05, 0.12) });
  }

  aggiorna(dt, vista, tempo) {
    const d = this.dati, G = this.G;
    const W = Math.max(0.1, Number(d.larghezza ?? 0.6)) * G;
    const vel = Math.max(0.2, Number(d.velocita ?? 3));
    const max = Number(d.lunghezzaMax ?? 0) * G;
    const quanteScintille = fra(Number(d.scintille ?? 3), 0, 5);
    const fonti = (d.fonti ?? []).map(f => ({ f, p: this.posizione(f, f.id) })).filter(x => x.p);
    const bersaglio = this.posizione(d.bersaglio, "bersaglio");

    // punto d'arrivo comune: bersaglio, oppure punto di scontro
    let C = bersaglio, scontro = false;
    if (!C && fonti.length >= 2) {
      scontro = true;
      if (fonti.length === 2) {
        const [a, b] = fonti.map(x => x.p);
        const f = 0.5 + 0.09 * Math.sin(tempo * 0.9 * vel / 3 + 1.3) + 0.04 * Math.sin(tempo * 3.1 * vel / 3);
        C = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
      } else {
        C = { x: 0, y: 0 };
        for (const { p } of fonti) { C.x += p.x / fonti.length; C.y += p.y / fonti.length; }
        C.x += Math.sin(tempo * 1.7) * W * 0.15; C.y += Math.cos(tempo * 1.3) * W * 0.15;
      }
    }

    const vivi = new Set();
    let arrivano = 0;
    const coloriCentro = [];
    for (const { f, p: S } of fonti) {
      vivi.add(f.id);
      const r = this.raggio(f);
      const pulsa = 1 + 0.12 * Math.sin(tempo * 7 * vel / 3 + r.fase) + 0.06 * Math.sin(tempo * 17 + r.fase);
      if (!C) {
        // fonte sola: si carica
        r.g.visible = false;
        r.impatto.visible = true; r.impatto.position.set(S.x, S.y);
        r.impatto.children.forEach((s, k) => { s.scale.set((W * (k ? 1.2 : 2.6) * pulsa) / 64); s.alpha = k ? 0.85 : 0.55; });
        continue;
      }
      let E = { x: C.x, y: C.y }, bloccato = false;
      const lungTot = Math.hypot(E.x - S.x, E.y - S.y);
      const rotto = max > 0 && lungTot > max;
      if (!rotto && d.alMuro !== "attraversa") {
        const hit = collisione(S, E);
        if (hit) { E = hit; bloccato = true; }
      }
      r.alfa += ((rotto ? 0 : 1) - r.alfa) * Math.min(1, dt * 8);
      const L = Math.hypot(E.x - S.x, E.y - S.y), ang = Math.atan2(E.y - S.y, E.x - S.x);
      r.g.visible = r.alfa > 0.02 && L > 2;
      r.g.position.set(S.x, S.y); r.g.rotation = ang; r.g.alpha = r.alfa;
      r.largo.width = L; r.largo.height = W * 1.9 * pulsa;
      r.corpo.width = L; r.corpo.height = W * pulsa;
      r.corpo.tileScale.set(W / 64 * 1.4, (W * pulsa) / 64);
      r.corpo.tilePosition.x += G * 2.2 * vel * dt;
      r.anima.width = L; r.anima.height = W * 0.28 * pulsa;
      // impatto: sul bersaglio, contro un muro o sulla fonte quando il raggio si interrompe
      const colpisce = !rotto && (bloccato || (bersaglio && !scontro));
      r.impatto.visible = colpisce || rotto;
      if (rotto) {
        r.impatto.position.set(S.x, S.y);
        r.impatto.children.forEach((s, k) => { s.scale.set((W * (k ? 0.6 : 1.3)) / 64 * (0.6 + Math.random() * 0.6)); s.alpha = 0.6; });
        if (quanteScintille && Math.random() < dt * 6 * quanteScintille) this.scintilla(S.x, S.y, r.col, ang, Math.PI * 2);
      } else if (colpisce) {
        r.impatto.position.set(E.x, E.y);
        r.impatto.children.forEach((s, k) => { s.scale.set((W * (k ? 1 : 2.4) * pulsa) / 64); s.alpha = (k ? 0.9 : 0.6) * r.alfa; });
        if (quanteScintille && Math.random() < dt * 10 * quanteScintille) this.scintilla(E.x, E.y, r.col, ang + Math.PI, 2.2);
      }
      if (scontro && !rotto && !bloccato) { arrivano++; coloriCentro.push(r.col); }
    }

    // punto di scontro
    const acceso = scontro && arrivano >= 2;
    this.alfaCentro += ((acceso ? 1 : 0) - this.alfaCentro) * Math.min(1, dt * 8);
    this.centro.visible = this.alfaCentro > 0.02;
    if (this.centro.visible && C) {
      this.centro.position.set(C.x, C.y);
      this.centro.children.forEach((s, k) => {
        s.tint = k === 3 ? 0xffffff : coloriCentro[k % Math.max(1, coloriCentro.length)] ?? 0xffffff;
        const base = W * (k === 3 ? 1.6 : 2.8 - k * 0.3);
        s.scale.set((base / 64) * (1 + 0.25 * Math.sin(tempo * (9 + k * 3) + k)));
        s.alpha = (k === 3 ? 0.95 : 0.65) * this.alfaCentro;
      });
      if (acceso && quanteScintille) {
        const n = dt * 14 * quanteScintille, quante = Math.min(20, Math.floor(n) + (Math.random() < n % 1 ? 1 : 0));
        const dir = Math.atan2(fonti[0].p.y - C.y, fonti[0].p.x - C.x) + Math.PI / 2;
        for (let i = 0; i < quante; i++) this.scintilla(C.x, C.y, coloriCentro[Math.floor(Math.random() * coloriCentro.length)] ?? 0xffffff, dir + (Math.random() < 0.5 ? Math.PI : 0), 2.4);
      }
    }

    // raggi di fonti tolte
    for (const [id, r] of this.raggi) if (!vivi.has(id)) { r.g.destroy({ children: true }); r.impatto.destroy({ children: true }); this.raggi.delete(id); }

    for (let i = this.lista.length - 1; i >= 0; i--) {
      const s = this.lista[i];
      s.eta += dt;
      if (s.eta >= s.vita) { s.sp.destroy(); this.lista.splice(i, 1); continue; }
      s.sp.x += s.vx * dt; s.sp.y += s.vy * dt; s.vx *= 0.94; s.vy *= 0.94;
      const k = 1 - s.eta / s.vita;
      s.sp.alpha = k; s.sp.scale.set((s.s * (0.4 + k)) / 32);
    }
  }
}
