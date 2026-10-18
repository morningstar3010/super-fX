/**
 * SUPER FX – liquidi in movimento (fiumi, torrenti, canali, paludi, sangue, lava, acido, energia magica).
 *
 * Si disegna l'area con una Regione che segue il corso d'acqua e si sceglie la DIREZIONE della corrente.
 * Strati: un velo del colore del liquido, due correnti a strisce che scorrono a velocità diverse (i riflessi),
 * una nuvola scura più lenta (le parti profonde), luccichii che si accendono e spengono.
 * I liquidi che BRILLANO (lava, acido, magia) pulsano di luce e fanno bolle che scoppiano.
 * Sta sotto i token (salvo scelta diversa): chi guada il fiume resta sopra l'acqua.
 */
import { numeroColore, caso, LIQUIDI } from "../costanti.mjs";
import { corrente, rumore, punto, anello } from "../trame.mjs";
import { EffettoBase, mescola, contenitoreParticelle } from "./base.mjs";

const VELO = [0.22, 0.32, 0.42, 0.54, 0.68];

export class Liquido extends EffettoBase {
  static strato = "sotto";
  static ordine = 5;

  costruisci() {
    const d = this.dati, L = this.livello, G = this.G;
    const preset = LIQUIDI[d.liquido] ?? LIQUIDI.acqua;
    this.brilla = !!preset.brilla;
    this.col = numeroColore(d.colore, numeroColore(preset.colore));
    const chiaro = mescola(this.col, 0xffffff, this.brilla ? 0.55 : 0.45), scuro = mescola(this.col, 0x000000, 0.45);
    const scala = Math.max(0.5, Number(d.scala ?? 3));

    this.velo = new PIXI.Graphics();
    this.corpo.addChild(this.velo);
    // il contenitore della corrente è ruotato nella direzione del flusso: le trame scorrono sempre «in avanti»
    this.flusso = new PIXI.Container();
    this.flusso.rotation = (Number(d.direzione ?? 0) * Math.PI) / 180;
    this.corpo.addChild(this.flusso);
    const v = G * 0.22 * Math.max(0.15, this.vel);
    const strato = (tex, tinta, alfa, sc, vel, fusione) => {
      const s = new PIXI.TilingSprite(tex, 16, 16);
      s.anchor.set(0.5);
      s.tint = tinta; s.alpha = alfa; s.blendMode = fusione;
      s.tileScale.set((G * sc * scala) / 256 * 1.6, (G * sc * scala) / 256 * 0.8);
      this.flusso.addChild(s);
      return { s, vel, alfa };
    };
    const luce = this.brilla ? PIXI.BLEND_MODES.ADD : PIXI.BLEND_MODES.SCREEN;
    this.strati = [
      strato(rumore(5), scuro, 0.18 + L * 0.04, 2.5, v * 0.45, PIXI.BLEND_MODES.NORMAL),
      strato(corrente(3), chiaro, 0.22 + L * 0.05, 1.6, v, luce),
      strato(corrente(9), chiaro, 0.14 + L * 0.03, 0.9, v * 1.55, luce)
    ];
    this.strati[2].s.tilePosition.set(97, 51);

    this.cap = Math.round(260 * this.motore.qualita);
    this.puntini = contenitoreParticelle(this.cap);
    this.puntini.blendMode = PIXI.BLEND_MODES.ADD;
    this.corpo.addChild(this.puntini);
    this.lista = [];
    this.dopoArea();
  }

  dopoArea() {
    const a = this.area, D = Math.hypot(a.width, a.height) + this.G * 2;
    this.velo.clear();
    this.velo.beginFill(this.col, 1).drawRect(a.x, a.y, a.width, a.height).endFill();
    this.velo.alpha = VELO[this.livello - 1] + (this.brilla ? 0.1 : 0);
    this.flusso.position.set(a.x + a.width / 2, a.y + a.height / 2);
    for (const { s } of this.strati) { s.width = D; s.height = D; }
  }

  nasce(p, r) {
    p.x = r.x + Math.random() * r.width; p.y = r.y + Math.random() * r.height;
    p.eta = 0; p.vita = this.brilla ? caso(0.8, 1.8) : caso(0.4, 1.1);
    p.s = this.G * (this.brilla ? caso(0.1, 0.28) : caso(0.05, 0.12));
    p.sp.texture = this.brilla && Math.random() < 0.5 ? anello() : punto();
    p.sp.tint = this.brilla ? mescola(this.col, 0xffffff, caso(0.2, 0.6)) : 0xffffff;
  }

  aggiorna(dt, vista, tempo) {
    for (const st of this.strati) st.s.tilePosition.x += st.vel * dt;
    if (this.brilla) {
      this.velo.alpha = (VELO[this.livello - 1] + 0.1) * (0.85 + 0.15 * Math.sin(tempo * 1.3));
      this.strati[1].s.alpha = this.strati[1].alfa * (0.75 + 0.35 * Math.sin(tempo * 0.8));
    }
    // luccichii (acqua) o bolle (lava, acido, magia)
    const G = this.G, r = this.visibile(vista, G);
    const dens = (this.brilla ? 0.05 : 0.08) * (0.5 + this.livello * 0.25);
    const voluto = r ? Math.min(this.cap, Math.round(dens * (r.width * r.height) / (G * G) * this.motore.qualita)) : 0;
    while (this.lista.length < voluto) {
      const sp = new PIXI.Sprite(punto()); sp.anchor.set(0.5); this.puntini.addChild(sp);
      const p = { sp }; this.nasce(p, r); p.eta = Math.random() * p.vita; this.lista.push(p);
    }
    while (this.lista.length > voluto) this.lista.pop().sp.destroy();
    for (const p of this.lista) {
      p.eta += dt;
      if (p.eta >= p.vita) this.nasce(p, r);
      const k = p.eta / p.vita;
      p.sp.position.set(p.x, p.y);
      if (this.brilla) { p.sp.scale.set((p.s * (0.3 + k)) / 32); p.sp.alpha = 0.7 * Math.sin(k * Math.PI); }
      else { p.sp.scale.set(p.s / 32); p.sp.alpha = 0.6 * Math.pow(Math.sin(k * Math.PI), 3); }
    }
  }
}
