/**
 * SUPER FX – maniglie sulla mappa (solo per il master) e scelta di un punto con un clic.
 *
 * Ogni punto libero ha una maniglia rotonda col suo colore: le fonti e i bersagli dei raggi, il centro delle trombe.
 * Si trascina col tasto sinistro: mentre la si sposta il raggio si allunga o si interrompe e la tromba la segue
 * subito; quando si lascia il tasto la posizione si salva. Tenendo premuto Maiusc la maniglia si aggancia al
 * centro della casella. Le maniglie si mostrano o si nascondono dal pannello (scheda Strumenti) o dal suo pulsante.
 */
import { MOD, t, numeroColore } from "./costanti.mjs";
import { leggiEffetti, leggiRaggi, modificaEffetto, modificaFonte, impostaBersaglio } from "./dati.mjs";
import { motore } from "./motore.mjs";
import { rettangoloArea } from "./maschere.mjs";

let STRATO = null;

/** Coordinate della scena dal punto del mouse sullo schermo. */
export function coordinateScena(e) {
  if (canvas.canvasCoordinatesFromClient) return canvas.canvasCoordinatesFromClient({ x: e.clientX, y: e.clientY });
  const r = canvas.app.view.getBoundingClientRect();
  return canvas.stage.worldTransform.applyInverse(new PIXI.Point(e.clientX - r.left, e.clientY - r.top));
}

const aggancia = (p, e) => (e.shiftKey && canvas.grid?.getCenterPoint ? canvas.grid.getCenterPoint(p) : p);

export function manigliaVisibili() {
  try { return game.user.isGM && game.settings.get(MOD, "maniglie"); } catch (err) { return false; }
}

/** Elenco delle maniglie della scena. */
function elencoManiglie() {
  const out = [];
  for (const e of leggiEffetti()) {
    if (e.tipo !== "tromba" || !e.attivo) continue;
    const r = rettangoloArea(e, canvas.scene);
    const p = e.punto ?? { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    out.push({ chiave: `e:${e.id}`, x: p.x, y: p.y, colore: e.colore, nome: e.nome || t("SUPERFX.Tipi.tromba"), salva: (x, y) => modificaEffetto(e.id, { punto: { x, y } }) });
  }
  for (const g of leggiRaggi()) {
    if (!g.attivo) continue;
    for (const f of g.fonti ?? []) {
      if (f.tipo !== "punto") continue;
      out.push({ chiave: `r:${g.id}`, sotto: f.id, x: f.x, y: f.y, colore: f.colore, nome: g.nome || t("SUPERFX.Raggi.gruppo"), salva: (x, y) => modificaFonte(g.id, f.id, { x, y }) });
    }
    if (g.bersaglio?.tipo === "punto") {
      out.push({ chiave: `r:${g.id}`, sotto: "bersaglio", x: g.bersaglio.x, y: g.bersaglio.y, colore: "#ffffff", bersaglio: true, nome: t("SUPERFX.Raggi.bersaglio"), salva: (x, y) => impostaBersaglio(g.id, { ...g.bersaglio, x, y }) });
    }
  }
  return out;
}

/** Ridisegna le maniglie. */
export function disegnaManiglie() {
  if (STRATO && !STRATO.destroyed) STRATO.destroy({ children: true });
  STRATO = null;
  if (!canvas?.ready || !manigliaVisibili()) return;
  const G = canvas.dimensions.size, R = Math.max(10, G * 0.18);
  STRATO = new PIXI.Container();
  STRATO.eventMode = "passive";
  STRATO.zIndex = 1000;
  for (const m of elencoManiglie()) {
    const g = new PIXI.Container();
    const cerchio = new PIXI.Graphics();
    const col = numeroColore(m.colore, 0xffffff);
    cerchio.lineStyle(3, 0x000000, 0.8).beginFill(col, 0.85).drawCircle(0, 0, R).endFill();
    cerchio.lineStyle(2, 0xffffff, 1).drawCircle(0, 0, R * 0.55);
    if (m.bersaglio) cerchio.lineStyle(2, 0x000000, 1).moveTo(-R * 0.4, 0).lineTo(R * 0.4, 0).moveTo(0, -R * 0.4).lineTo(0, R * 0.4);
    const testo = new PIXI.Text(m.nome, { fontFamily: "Signika, sans-serif", fontSize: Math.max(12, R * 0.8), fill: 0xffffff, stroke: 0x000000, strokeThickness: 4 });
    testo.anchor.set(0.5, 0); testo.y = R + 2;
    g.addChild(cerchio, testo);
    g.position.set(m.x, m.y);
    g.eventMode = "static"; g.cursor = "grab";
    g.hitArea = new PIXI.Circle(0, 0, R * 1.2);
    g.on("pointerdown", ev => {
      if (ev.button !== 0) return;
      ev.stopPropagation();
      g.cursor = "grabbing";
      let ultimo = { x: m.x, y: m.y };
      const mossa = e => {
        ultimo = aggancia(coordinateScena(e), e);
        g.position.set(ultimo.x, ultimo.y);
        motore.spostaPunto(m.chiave, ultimo.x, ultimo.y, m.sotto);
      };
      const fine = async () => {
        window.removeEventListener("pointermove", mossa);
        g.cursor = "grab";
        await m.salva(Math.round(ultimo.x), Math.round(ultimo.y));
        motore.fineSpostamento(m.chiave, m.sotto);
      };
      window.addEventListener("pointermove", mossa);
      window.addEventListener("pointerup", fine, { once: true });
    });
    STRATO.addChild(g);
  }
  (canvas.controls ?? canvas.interface).addChild(STRATO);
}

/**
 * Aspetta un clic sinistro sulla mappa e restituisce il punto ({x, y}), oppure null con Esc o il tasto destro.
 * Il clic non arriva a Foundry (non deseleziona i token e non muove nulla).
 */
export function scegliPunto() {
  return new Promise(risolvi => {
    ui.notifications.info(t("SUPERFX.Avvisi.cliccaMappa"));
    const vista = canvas.app.view;
    vista.style.cursor = "crosshair";
    const fine = p => {
      window.removeEventListener("pointerdown", giu, true);
      window.removeEventListener("keydown", tasto, true);
      vista.style.cursor = "";
      risolvi(p);
    };
    const giu = e => {
      if (e.target !== vista) return;
      e.stopImmediatePropagation(); e.preventDefault();
      if (e.button !== 0) return fine(null);
      const p = aggancia(coordinateScena(e), e);
      fine({ x: Math.round(p.x), y: Math.round(p.y) });
    };
    const tasto = e => { if (e.key === "Escape") { e.stopImmediatePropagation(); fine(null); } };
    window.addEventListener("pointerdown", giu, true);
    window.addEventListener("keydown", tasto, true);
  });
}

export function registraManiglie() {
  Hooks.on("canvasReady", () => disegnaManiglie());
  Hooks.on("canvasTearDown", () => { if (STRATO && !STRATO.destroyed) STRATO.destroy({ children: true }); STRATO = null; });
  Hooks.on("updateScene", (scene, cambi) => {
    if (scene.id === canvas.scene?.id && foundry.utils.hasProperty(cambi, `flags.${MOD}`)) disegnaManiglie();
  });
  for (const h of ["updateRegion", "deleteRegion"]) Hooks.on(h, doc => { if (doc.parent?.id === canvas.scene?.id) disegnaManiglie(); });
}
