/**
 * SUPER FX – nebbia e oscurità.
 *
 * NEBBIA: due o tre strati di nuvola ripetibile che scorrono nella direzione del vento a velocità e angoli
 * leggermente diversi, così si sfilaccia invece di sembrare un'immagine che trasla. Con l'intensità crescono
 * la densità e il numero di strati; al livello 5 (muro di nebbia) c'è anche un velo uniforme che copre quasi tutto.
 * OSCURITÀ MAGICA: velo scuro che «respira» e lingue d'ombra che si contorcono lentamente.
 */
import { numeroColore } from "../costanti.mjs";
import { rumore } from "../trame.mjs";
import { EffettoBase, mescola } from "./base.mjs";

const ALFA_NEBBIA = [0.16, 0.3, 0.45, 0.62, 0.8];
const VELO_NEBBIA = [0, 0, 0, 0.12, 0.3];

export class Nebbia extends EffettoBase {
  static ordine = 20;

  costruisci() {
    const d = this.dati, L = this.livello, col = numeroColore(d.colore, 0xd8dde6);
    this.strati = [];
    this.velo = new PIXI.Graphics();
    this.corpo.addChild(this.velo);
    const n = L >= 4 ? 3 : 2;
    const angolo = (Number(d.direzione ?? 0) * Math.PI) / 180;
    const base = this.G * 0.09 * Math.max(0.2, this.vel);
    const scala = Math.max(0.5, Number(d.scala ?? 3));
    for (let i = 0; i < n; i++) {
      const s = new PIXI.TilingSprite(rumore(1 + i), 16, 16);
      s.tint = i === 1 ? mescola(col, 0xffffff, 0.25) : i === 2 ? mescola(col, 0x000000, 0.12) : col;
      const tile = (this.G * 2.2 * scala * [1, 1.7, 0.75][i]) / 256;
      s.tileScale.set(tile, tile);
      s.tilePosition.set(i * 173, i * 97);
      const a = angolo + [0, 0.26, -0.2][i];
      const v = base * [1, 0.6, 1.35][i];
      this.strati.push({ s, vx: Math.cos(a) * v, vy: Math.sin(a) * v, alfa: ALFA_NEBBIA[L - 1] * [1, 0.7, 0.55][i], fase: Math.random() * 10 });
      this.corpo.addChild(s);
    }
    this.dopoArea();
  }

  /** Le trame coprono l'area. */
  dopoArea() {
    const a = this.area, col = numeroColore(this.dati.colore, 0xd8dde6);
    for (const { s } of this.strati ?? []) { s.position.set(a.x, a.y); s.width = a.width; s.height = a.height; }
    this.velo?.clear();
    const v = VELO_NEBBIA[this.livello - 1];
    if (v && this.velo) { this.velo.beginFill(col, v); this.velo.drawRect(a.x, a.y, a.width, a.height); this.velo.endFill(); }
  }

  aggiorna(dt, vista, tempo) {
    for (const st of this.strati) {
      st.s.tilePosition.x += st.vx * dt;
      st.s.tilePosition.y += st.vy * dt;
      st.s.alpha = st.alfa * (0.88 + 0.12 * Math.sin(tempo * 0.35 + st.fase));
    }
  }
}

const VELO_BUIO = [0.12, 0.22, 0.36, 0.52, 0.72];

export class Oscurita extends EffettoBase {
  static ordine = 22;

  costruisci() {
    const d = this.dati, L = this.livello, col = numeroColore(d.colore, 0x2a0f3d);
    this.velo = new PIXI.Graphics();
    this.corpo.addChild(this.velo);
    this.strati = [];
    const scala = Math.max(0.5, Number(d.scala ?? 3));
    for (let i = 0; i < 2; i++) {
      const s = new PIXI.TilingSprite(rumore(7 + i), 16, 16);
      s.tint = i ? mescola(col, 0x000000, 0.5) : col;
      const tile = (this.G * 1.6 * scala * (i ? 0.6 : 1)) / 256;
      s.tileScale.set(tile, tile);
      this.strati.push({ s, alfa: 0.35 + L * 0.1, fase: i * 2.1 });
      this.corpo.addChild(s);
    }
    this.dopoArea();
  }

  dopoArea() {
    const a = this.area, col = numeroColore(this.dati.colore, 0x2a0f3d);
    for (const { s } of this.strati ?? []) { s.position.set(a.x, a.y); s.width = a.width; s.height = a.height; }
    this.velo?.clear();
    this.velo?.beginFill(mescola(col, 0x000000, 0.6), 1).drawRect(a.x, a.y, a.width, a.height).endFill();
  }

  aggiorna(dt, vista, tempo) {
    const v = this.G * 0.05 * Math.max(0.2, this.vel);
    const L = this.livello;
    this.velo.alpha = VELO_BUIO[L - 1] * (0.85 + 0.15 * Math.sin(tempo * 0.6));
    this.strati.forEach((st, i) => {
      // le lingue d'ombra girano lentamente in tondo invece di andare in una direzione
      const a = tempo * 0.07 * (i ? -1 : 1) + st.fase;
      st.s.tilePosition.x += Math.cos(a) * v * dt;
      st.s.tilePosition.y += Math.sin(a) * v * dt;
      st.s.alpha = st.alfa * (0.75 + 0.25 * Math.sin(tempo * 0.9 + st.fase));
    });
  }
}
