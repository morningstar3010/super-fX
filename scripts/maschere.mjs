/**
 * SUPER FX – dove si vedono gli effetti.
 *
 * Ogni effetto ha un'AREA: tutta la scena oppure una o più Regioni di Foundry (disegnate con i normali strumenti
 * delle Regioni). Dentro l'area si tolgono le ZONE SENZA EFFETTI: Regioni con il comportamento
 * «Super FX – Senza effetti». Nel comportamento si sceglie quali effetti spegnere (vuoto = tutti).
 * Con queste forme il modulo disegna una MASCHERA (immagine in bianco e nero, a risoluzione ridotta e con il bordo
 * sfumato) che fa vedere l'effetto solo dove serve. Si rifà da sola quando una regione cambia.
 *
 * Aiuto: «Crea la maschera dai muri» legge i muri della scena, trova gli spazi chiusi (stanze, edifici, grotte)
 * e crea una Regione «Super FX – Interni» con il comportamento Senza effetti già pronto.
 */
import { MOD, TIPO_ESCLUSIONE, TIPI, t, log } from "./costanti.mjs";

const { SetField, StringField } = foundry.data.fields;

/** Comportamento di regione «Super FX – Senza effetti». */
export class SenzaEffetti extends foundry.data.regionBehaviors.RegionBehaviorType {
  static LOCALIZATION_PREFIXES = ["SUPERFX.Esclusione"];

  static defineSchema() {
    const scelte = Object.fromEntries(Object.keys(TIPI).map(k => [k, `SUPERFX.Tipi.${k}`]));
    return {
      tipi: new SetField(new StringField({ choices: scelte }), { initial: [] })
    };
  }
}

/* -------------------------------------------- */
/*  Forme delle regioni                         */
/* -------------------------------------------- */

/** Punti di un'ellisse (o cerchio) ruotata, come poligono. */
function ellisse(cx, cy, rx, ry, rot = 0, n = 48) {
  const out = [], c = Math.cos(rot), s = Math.sin(rot);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry;
    out.push(cx + x * c - y * s, cy + x * s + y * c);
  }
  return out;
}

/**
 * Forme di una regione come elenco di { punti: [x0, y0, x1, y1, …], buco: bool }.
 * Si leggono i dati delle forme (uguali in Foundry 13 e 14): rettangolo, ellisse, cerchio, poligono.
 */
export function formeRegione(region) {
  const out = [];
  for (const s of region?.shapes ?? []) {
    const d = s.toObject?.() ?? s;
    const buco = !!d.hole;
    const rot = Math.toRadians?.(d.rotation ?? 0) ?? ((d.rotation ?? 0) * Math.PI / 180);
    let punti = null;
    switch (d.type) {
      case "rectangle": {
        const { x, y, width: w, height: h } = d, cx = x + w / 2, cy = y + h / 2, c = Math.cos(rot), sn = Math.sin(rot);
        punti = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].flatMap(([px, py]) => [cx + px * c - py * sn, cy + px * sn + py * c]);
        break;
      }
      case "ellipse": punti = ellisse(d.x, d.y, d.radiusX, d.radiusY, rot); break;
      case "circle": punti = ellisse(d.x, d.y, d.radius, d.radius, 0); break;
      case "polygon": punti = Array.from(d.points ?? []); break;
      default:
        // forme nuove di versioni future: si prova con il poligono già calcolato da Foundry
        try { for (const p of region.polygons ?? []) out.push({ punti: Array.from(p.points), buco: p.isPositive === false }); } catch (err) { /* niente */ }
    }
    if (punti && punti.length >= 6) out.push({ punti, buco });
  }
  return out;
}

/** Regioni «Senza effetti» della scena che spengono un certo tipo di effetto. */
export function esclusioniPer(scene, tipo) {
  const out = [];
  for (const r of scene?.regions ?? []) {
    for (const b of r.behaviors ?? []) {
      if (b.type !== TIPO_ESCLUSIONE || b.disabled) continue;
      const tipi = b.system?.tipi;
      const n = tipi?.size ?? tipi?.length ?? 0;
      if (!n || tipi.has?.(tipo) || (Array.isArray(tipi) && tipi.includes(tipo))) { out.push(r); break; }
    }
  }
  return out;
}

/* -------------------------------------------- */
/*  Maschera                                    */
/* -------------------------------------------- */

/**
 * Disegna la maschera di un effetto.
 * @param {object} effetto   dati dell'effetto (area, sfumatura)
 * @param {Scene} scene
 * @returns {{sprite: PIXI.Sprite, rect: PIXI.Rectangle} | null}  null = nessuna maschera (effetto su tutta la scena)
 */
export function creaMaschera(effetto, scene) {
  const r = canvas.dimensions.sceneRect;
  const regioniArea = Array.isArray(effetto.area) ? effetto.area.map(id => scene.regions.get(id)).filter(Boolean) : [];
  const esclusioni = esclusioniPer(scene, effetto.tipo);
  if (!regioniArea.length && !esclusioni.length && effetto.area === "scena") return null;

  // risoluzione ridotta: lato lungo massimo 2048 pixel
  const k = Math.min(0.5, 2048 / Math.max(r.width, r.height));
  const W = Math.max(8, Math.ceil(r.width * k)), H = Math.max(8, Math.ceil(r.height * k));
  const g = new PIXI.Graphics();
  const disegna = (forme, colore) => {
    for (const f of forme) {
      const p = f.punti.map((v, i) => (v - (i % 2 ? r.y : r.x)) * k);
      g.beginFill(f.buco ? (colore ? 0x000000 : 0xffffff) : colore, 1); g.drawPolygon(p); g.endFill();
    }
  };
  // area: tutta la scena (bianco) oppure le forme delle regioni scelte
  if (regioniArea.length) {
    g.beginFill(0x000000, 1); g.drawRect(0, 0, W, H); g.endFill();
    for (const reg of regioniArea) disegna(formeRegione(reg), 0xffffff);
  } else {
    g.beginFill(0xffffff, 1); g.drawRect(0, 0, W, H); g.endFill();
  }
  // zone senza effetti: nero
  for (const reg of esclusioni) disegna(formeRegione(reg), 0x000000);

  // bordo morbido
  const sf = Math.max(0, Number(effetto.sfumatura ?? 0.5)) * canvas.dimensions.size * k;
  if (sf > 0.5) {
    const blur = new PIXI.BlurFilter(Math.min(40, sf), 4);
    blur.repeatEdgePixels = true;
    g.filters = [blur];
  }
  const rt = PIXI.RenderTexture.create({ width: W, height: H });
  canvas.app.renderer.render(g, { renderTexture: rt, clear: true });
  g.destroy();
  const sprite = new PIXI.Sprite(rt);
  sprite.position.set(r.x, r.y);
  sprite.scale.set(1 / k);
  return { sprite, rect: r };
}

/** Forme dell'area di un effetto (per sapere dove nascono le particelle e dove sta un vortice). */
export function rettangoloArea(effetto, scene) {
  const r = canvas.dimensions.sceneRect;
  if (!Array.isArray(effetto.area) || !effetto.area.length) return new PIXI.Rectangle(r.x, r.y, r.width, r.height);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const id of effetto.area) {
    for (const f of formeRegione(scene.regions.get(id))) {
      for (let i = 0; i < f.punti.length; i += 2) {
        x0 = Math.min(x0, f.punti[i]); x1 = Math.max(x1, f.punti[i]);
        y0 = Math.min(y0, f.punti[i + 1]); y1 = Math.max(y1, f.punti[i + 1]);
      }
    }
  }
  if (!Number.isFinite(x0)) return new PIXI.Rectangle(r.x, r.y, r.width, r.height);
  return new PIXI.Rectangle(x0, y0, x1 - x0, y1 - y0);
}

/* -------------------------------------------- */
/*  Aiuto: maschera dai muri                    */
/* -------------------------------------------- */

/**
 * Trova gli spazi chiusi dai muri (porte comprese) e crea una Regione «Super FX – Interni» con il comportamento
 * Senza effetti. Gli interni sono le celle che non si raggiungono partendo dal bordo della scena senza attraversare
 * un muro. Le celle sono di 1/4 di casella; il muro si allarga di mezza cella per chiudere le fessure.
 * @returns {Promise<RegionDocument|null>}
 */
export async function mascheraDaiMuri() {
  const scene = canvas.scene;
  if (!scene) return null;
  const r = canvas.dimensions.sceneRect, G = canvas.dimensions.size;
  const passo = Math.max(8, G / 4);
  const nx = Math.ceil(r.width / passo), ny = Math.ceil(r.height / passo);
  if (nx * ny > 6e6) { ui.notifications.warn(t("SUPERFX.Avvisi.scenaTroppoGrande")); return null; }
  const muro = new Uint8Array(nx * ny);
  // muri che fermano la vista (normali, porte, finestre chiuse); i muri invisibili e quelli "solo terreno" no
  for (const w of scene.walls) {
    if (!w.sight && !w.move) continue;
    const [ax, ay, bx, by] = w.c;
    const L = Math.hypot(bx - ax, by - ay), n = Math.max(2, Math.ceil(L / (passo / 3)));
    for (let i = 0; i <= n; i++) {
      const x = ax + (bx - ax) * i / n, y = ay + (by - ay) * i / n;
      const cx = Math.floor((x - r.x) / passo), cy = Math.floor((y - r.y) / passo);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const X = cx + dx, Y = cy + dy;
        if (X >= 0 && Y >= 0 && X < nx && Y < ny && (dx === 0 || dy === 0)) muro[Y * nx + X] = 1;
      }
    }
  }
  // riempimento dall'esterno
  const fuori = new Uint8Array(nx * ny), coda = new Int32Array(nx * ny);
  let testa = 0, fondo = 0;
  const spingi = (x, y) => { const k = y * nx + x; if (!fuori[k] && !muro[k]) { fuori[k] = 1; coda[fondo++] = k; } };
  for (let x = 0; x < nx; x++) { spingi(x, 0); spingi(x, ny - 1); }
  for (let y = 0; y < ny; y++) { spingi(0, y); spingi(nx - 1, y); }
  while (testa < fondo) {
    const k = coda[testa++], x = k % nx, y = (k - x) / nx;
    if (x > 0) spingi(x - 1, y); if (x < nx - 1) spingi(x + 1, y);
    if (y > 0) spingi(x, y - 1); if (y < ny - 1) spingi(x, y + 1);
  }
  // interni = non raggiunti (muri compresi, così la zona copre anche lo spessore del muro)
  const dentro = (x, y) => !fuori[y * nx + x];
  let celle = 0;
  for (let k = 0; k < nx * ny; k++) if (!fuori[k] && !muro[k]) celle++;
  if (celle < 4) { ui.notifications.info(t("SUPERFX.Avvisi.nessunInterno")); return null; }

  // rettangoli per righe, uniti con ClipperLib (incluso in Foundry) in poligoni puliti
  const S = 10;   // ClipperLib lavora con numeri interi
  const paths = [];
  for (let y = 0; y < ny; y++) {
    let x = 0;
    while (x < nx) {
      if (!dentro(x, y)) { x++; continue; }
      let x2 = x; while (x2 < nx && dentro(x2, y)) x2++;
      const X0 = (r.x + x * passo) * S, X1 = (r.x + x2 * passo) * S, Y0 = (r.y + y * passo) * S, Y1 = (r.y + (y + 1) * passo) * S;
      paths.push([{ X: X0, Y: Y0 }, { X: X1, Y: Y0 }, { X: X1, Y: Y1 }, { X: X0, Y: Y1 }]);
      x = x2;
    }
  }
  const CL = globalThis.ClipperLib;
  let poligoni = [];
  if (CL) {
    const c = new CL.Clipper(), sol = new CL.Paths();
    c.AddPaths(paths, CL.PolyType.ptSubject, true);
    c.Execute(CL.ClipType.ctUnion, sol, CL.PolyFillType.pftNonZero, CL.PolyFillType.pftNonZero);
    const puliti = CL.Clipper.CleanPolygons(sol, passo * S * 0.6);
    for (const p of puliti) {
      if (p.length < 3 || Math.abs(CL.Clipper.Area(p)) < (passo * S) ** 2 * 3) continue;
      poligoni.push({ points: p.flatMap(q => [Math.round(q.X / S), Math.round(q.Y / S)]), hole: !CL.Clipper.Orientation(p) });
    }
  } else {
    poligoni = paths.map(p => ({ points: p.flatMap(q => [q.X / S, q.Y / S]), hole: false }));
  }
  if (!poligoni.length) { ui.notifications.info(t("SUPERFX.Avvisi.nessunInterno")); return null; }
  const shapes = poligoni.map(p => ({ type: "polygon", points: p.points, hole: p.hole }));
  const nome = t("SUPERFX.Strumenti.nomeInterni");
  const vecchia = scene.regions.find(x => x.getFlag(MOD, "interni"));
  const dati = {
    name: nome, color: "#4a6fa5", shapes, visibility: 0,
    flags: { [MOD]: { interni: true } }
  };
  let regione;
  if (vecchia) { await vecchia.update({ shapes }); regione = vecchia; }
  else {
    [regione] = await scene.createEmbeddedDocuments("Region", [dati]);
    await regione.createEmbeddedDocuments("RegionBehavior", [{ type: TIPO_ESCLUSIONE, name: t("TYPES.RegionBehavior." + TIPO_ESCLUSIONE), system: { tipi: [] } }]);
  }
  log(`maschera dai muri: ${shapes.length} forme`);
  return regione;
}

/** Aggiunge «Senza effetti» alle regioni selezionate sul livello Regioni. */
export async function aggiungiEsclusioneAiSelezionati() {
  const sel = canvas.regions?.controlled ?? [];
  if (!sel.length) return ui.notifications.warn(t("SUPERFX.Avvisi.selezionaRegioni"));
  let n = 0;
  for (const reg of sel) {
    const doc = reg.document;
    if (doc.behaviors.some(b => b.type === TIPO_ESCLUSIONE)) continue;
    await doc.createEmbeddedDocuments("RegionBehavior", [{ type: TIPO_ESCLUSIONE, name: t("TYPES.RegionBehavior." + TIPO_ESCLUSIONE), system: { tipi: [] } }]);
    n++;
  }
  ui.notifications.info(t("SUPERFX.Avvisi.esclusioniAggiunte", { n }));
}
