/**
 * SUPER FX – trame disegnate dal modulo stesso (nessuna immagine esterna).
 * Si creano una volta sola, al primo uso, su un <canvas> del browser e si tengono in memoria.
 *  - rumore(): nuvola morbida ripetibile senza cuciture (nebbia, oscurità, liquidi)
 *  - corrente(): trama allungata a strisce ripetibile (fiumi, lava)
 *  - vortice(): spirale vista dall'alto (trombe); energia(): corpo dei raggi
 *  - punto(), goccia(), fiocco(), foglia(), anello(), granello(), fascia(): le particelle
 */
const CACHE = new Map();

/** Restituisce la trama già fatta o la crea. */
function memo(chiave, crea) {
  const t = CACHE.get(chiave);
  if (t && !t.destroyed && t.baseTexture && !t.baseTexture.destroyed) return t;
  const n = crea();
  CACHE.set(chiave, n);
  return n;
}

function tela(w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return [c, c.getContext("2d")];
}

/** Rumore a valori ripetibile (periodo px celle in orizzontale e py in verticale), interpolato in modo morbido. */
function grigliaRumore(px, seme, py = px) {
  let s = seme * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const g = new Float32Array(px * py);
  for (let i = 0; i < g.length; i++) g[i] = rnd();
  const v = (x, y) => g[((y % py + py) % py) * px + ((x % px + px) % px)];
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), w = yf * yf * (3 - 2 * yf);
    const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
  };
}

/** Nuvola ripetibile: somma di 5 ottave di rumore; bianco con trasparenza = densità. */
export function rumore(seme = 1) {
  return memo(`rumore${seme}`, () => {
    const N = 256, [c, g] = tela(N, N), img = g.createImageData(N, N);
    const ottave = [4, 8, 16, 32, 64].map((p, i) => [p, grigliaRumore(p, seme * 10 + i), 0.5 ** i]);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      let v = 0, somma = 0;
      for (const [p, f, peso] of ottave) { v += f(x / N * p, y / N * p) * peso; somma += peso; }
      v = v / somma;
      v = Math.max(0, Math.min(1, (v - 0.32) / 0.5));
      const k = (y * N + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 255;
      img.data[k + 3] = Math.round(v * v * 255);
    }
    g.putImageData(img, 0, 0);
    return PIXI.Texture.from(c, { wrapMode: PIXI.WRAP_MODES.REPEAT });
  });
}

/** Corrente ripetibile: rumore stirato in orizzontale con increspature chiare (scorre verso destra). */
export function corrente(seme = 3) {
  return memo(`corrente${seme}`, () => {
    const N = 256, [c, g] = tela(N, N), img = g.createImageData(N, N);
    // le onde sono stirate in orizzontale: periodi diversi nei due versi, così la trama si ripete senza cuciture
    const f1 = grigliaRumore(4, seme), f2 = grigliaRumore(4, seme + 1, 16), f3 = grigliaRumore(8, seme + 2, 32);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const base = f1(x / N * 4, y / N * 4);
      const onde = f2(x / N * 4, y / N * 16) * 0.7 + f3(x / N * 8, y / N * 32) * 0.3;
      let v = Math.abs(onde - 0.5) * 2;
      v = Math.pow(1 - v, 6) * 0.9 + base * 0.25;
      const k = (y * N + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 255;
      img.data[k + 3] = Math.round(Math.max(0, Math.min(1, v)) * 255);
    }
    g.putImageData(img, 0, 0);
    return PIXI.Texture.from(c, { wrapMode: PIXI.WRAP_MODES.REPEAT });
  });
}

/** Punto sfumato (alone, lucciola, brace, scintilla). */
export function punto() {
  return memo("punto", () => {
    const [c, g] = tela(64, 64), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,0.65)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return PIXI.Texture.from(c);
  });
}

/** Goccia di pioggia: trattino verticale sfumato alle due estremità (la testa più chiara in basso). */
export function goccia() {
  return memo("goccia", () => {
    const [c, g] = tela(8, 64), gr = g.createLinearGradient(0, 0, 0, 64);
    gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.75, "rgba(255,255,255,0.75)"); gr.addColorStop(1, "rgba(255,255,255,1)");
    g.fillStyle = gr; g.beginPath(); g.ellipse(4, 32, 2, 32, 0, 0, Math.PI * 2); g.fill();
    return PIXI.Texture.from(c);
  });
}

/** Fiocco di neve: punto morbido con un nucleo pieno. */
export function fiocco() {
  return memo("fiocco", () => {
    const [c, g] = tela(32, 32), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.45, "rgba(255,255,255,0.9)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
    return PIXI.Texture.from(c);
  });
}

/** Foglia: ellisse a punta con la venatura (bianca: il colore lo dà la tinta). */
export function foglia() {
  return memo("foglia", () => {
    const [c, g] = tela(48, 32);
    g.fillStyle = "rgba(255,255,255,0.95)";
    g.beginPath(); g.moveTo(2, 16); g.quadraticCurveTo(24, -6, 46, 16); g.quadraticCurveTo(24, 38, 2, 16); g.fill();
    g.strokeStyle = "rgba(120,120,120,0.6)"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(4, 16); g.lineTo(44, 16); g.stroke();
    return PIXI.Texture.from(c);
  });
}

/** Anello (schizzo della pioggia vista dall'alto). */
export function anello() {
  return memo("anello", () => {
    const [c, g] = tela(64, 64);
    g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 3;
    g.beginPath(); g.arc(32, 32, 26, 0, Math.PI * 2); g.stroke();
    return PIXI.Texture.from(c);
  });
}

/** Fascia: sfumata sopra e sotto, piena al centro (corpo dei raggi e dei bagliori dei muri). */
export function fascia() {
  return memo("fascia", () => {
    const [c, g] = tela(4, 64), gr = g.createLinearGradient(0, 0, 0, 64);
    gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 4, 64);
    return PIXI.Texture.from(c);
  });
}

/** Bastone di luce: come la fascia ma con le estremità sfumate (bagliore dei muri, si allunga con NineSlicePlane). */
export function bastone() {
  return memo("bastone", () => {
    const W = 128, H = 64, [c, g] = tela(W, H), img = g.createImageData(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const u = (y - H / 2 + 0.5) / (H / 2), fy = Math.exp(-u * u * 3);
      const e = Math.min(x + 0.5, W - x - 0.5) / 32, fx = e >= 1 ? 1 : e * e * (3 - 2 * e);
      const k = (y * W + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 255;
      img.data[k + 3] = Math.round(fy * fx * 255);
    }
    g.putImageData(img, 0, 0);
    return PIXI.Texture.from(c);
  });
}

/** Granello (sabbia, grandine, detriti). */
export function granello() {
  return memo("granello", () => {
    const [c, g] = tela(16, 16), gr = g.createRadialGradient(8, 8, 0, 8, 8, 8);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.6, "rgba(255,255,255,0.8)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 16, 16);
    return PIXI.Texture.from(c);
  });
}

/** Vortice visto dall'alto: bracci a spirale che sfumano verso il bordo, con l'occhio al centro (trombe). */
export function vortice(seme = 5) {
  return memo(`vortice${seme}`, () => {
    const N = 256, [c, g] = tela(N, N), img = g.createImageData(N, N);
    const f = grigliaRumore(16, seme);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const dx = (x - N / 2) / (N / 2), dy = (y - N / 2) / (N / 2), r = Math.hypot(dx, dy);
      const k = (y * N + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 255;
      if (r >= 1) { img.data[k + 3] = 0; continue; }
      const a = Math.atan2(dy, dx);
      const braccio = 0.5 + 0.5 * Math.cos(4 * (a + 3.4 * Math.log(r + 0.08)));
      const rum = f(x / N * 16, y / N * 16);
      const bordo = Math.pow(1 - r, 1.4), occhio = Math.min(1, r / 0.12);
      const v = (braccio * 0.7 + rum * 0.45) * bordo * occhio;
      img.data[k + 3] = Math.round(Math.max(0, Math.min(1, v)) * 255);
    }
    g.putImageData(img, 0, 0);
    return PIXI.Texture.from(c);
  });
}

/** Energia dei raggi: strisce che si ripetono in orizzontale, sfumate sopra e sotto (niente maschere da calcolare). */
export function energia(seme = 7) {
  return memo(`energia${seme}`, () => {
    const W = 256, H = 64, [c, g] = tela(W, H), img = g.createImageData(W, H);
    const f1 = grigliaRumore(8, seme, 2), f2 = grigliaRumore(32, seme + 1, 6);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const u = (y - H / 2) / (H / 2), fascia = Math.exp(-u * u * 3.2);
      const strisce = f1(x / W * 8, y / H * 2) * 0.55 + f2(x / W * 32, y / H * 6) * 0.45;
      const v = fascia * (0.35 + 0.9 * Math.pow(strisce, 2));
      const k = (y * W + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 255;
      img.data[k + 3] = Math.round(Math.max(0, Math.min(1, v)) * 255);
    }
    g.putImageData(img, 0, 0);
    return PIXI.Texture.from(c, { wrapMode: PIXI.WRAP_MODES.REPEAT });
  });
}

/** Elimina le trame (alla chiusura del mondo non serve: si usa se il browser perde il contesto grafico). */
export function svuotaTrame() {
  for (const t of CACHE.values()) try { t.destroy(true); } catch (err) { /* già distrutta */ }
  CACHE.clear();
}
