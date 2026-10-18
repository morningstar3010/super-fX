/**
 * SUPER FX – combinazioni pronte e atmosfera della scena.
 *
 * PRESET: con un clic aggiungono alla scena più effetti già regolati che stanno bene insieme (temporale,
 * bufera, palude, incendio…). Dopo si cambiano a piacere come tutti gli altri.
 * ATMOSFERA CINEMATOGRAFICA: colori un po' spenti, ombre più profonde e buio freddo, con il ciclo giorno/notte
 * della scena attivo. I valori di prima si salvano nella scena e «Ripristina» li rimette com'erano.
 * Non tocca altro: dimensioni, margini, griglia, luci e muri restano uguali.
 */
import { MOD, t, nuovoId, TIPI } from "./costanti.mjs";
import { leggiEffetti, salvaEffetti, nuovoEffetto } from "./dati.mjs";

export const PRESET = {
  temporale:   [{ tipo: "pioggia", intensita: 5, inclinazione: 30, direzione: 70, lampi: true }, { tipo: "nebbia", intensita: 2, colore: "#8a94a6", velocita: 4 }],
  pioggia:     [{ tipo: "pioggia", intensita: 3, inclinazione: 15 }],
  dallAlto:    [{ tipo: "pioggia", intensita: 3, inclinazione: 0 }],
  nevicata:    [{ tipo: "neve", intensita: 2, inclinazione: 15 }],
  bufera:      [{ tipo: "neve", intensita: 5, inclinazione: 45, direzione: 10, velocita: 5 }, { tipo: "nebbia", intensita: 3, colore: "#f2f6ff", velocita: 5 }],
  grandinata:  [{ tipo: "grandine", intensita: 4, inclinazione: 15 }, { tipo: "pioggia", intensita: 2, inclinazione: 15 }],
  sabbia:      [{ tipo: "sabbia", intensita: 4, direzione: 0, inclinazione: 75 }],
  palude:      [{ tipo: "nebbia", intensita: 3, colore: "#a7b88f", velocita: 1 }, { tipo: "lucciole", intensita: 2 }],
  autunno:     [{ tipo: "foglie", intensita: 2, direzione: 20 }],
  incendio:    [{ tipo: "braci", intensita: 4, direzione: 280 }, { tipo: "nebbia", intensita: 2, colore: "#5a4a42", direzione: 280, velocita: 2 }],
  cripta:      [{ tipo: "nebbia", intensita: 2, colore: "#9a8fb5", velocita: 1, scala: 2 }, { tipo: "oscurita", intensita: 2 }],
  magia:       [{ tipo: "fulmini", intensita: 4, frequenza: 4, colore: "#c080ff" }, { tipo: "oscurita", intensita: 3, colore: "#2a0f3d" }, { tipo: "braci", intensita: 2, colore: "#b06cff", direzione: 270 }],
  vulcano:     [{ tipo: "braci", intensita: 5, colore: "#ff6a1a", direzione: 260, velocita: 3 }, { tipo: "nebbia", intensita: 3, colore: "#3b2a26", velocita: 2 }]
};

/** Aggiunge alla scena gli effetti di un preset. */
export async function applicaPreset(nome, scene = canvas.scene) {
  const voci = PRESET[nome];
  if (!voci || !scene) return;
  const nuovi = voci.filter(v => TIPI[v.tipo]).map(({ tipo, ...resto }) => nuovoEffetto(tipo, { ...resto, nome: t(`SUPERFX.Preset.${nome}`) }));
  await salvaEffetti([...leggiEffetti(scene), ...nuovi], scene);
  ui.notifications.info(t("SUPERFX.Avvisi.presetAggiunto", { nome: t(`SUPERFX.Preset.${nome}`) }));
}

const ATMOSFERA = {
  cycle: true,
  base: { hue: 0.08, intensity: 0.12, luminosity: -0.05, saturation: -0.25, shadows: 0.2 },
  dark: { hue: 0.68, intensity: 0.55, luminosity: -0.25, saturation: -0.45, shadows: 0.35 }
};

export async function atmosferaCinematografica(scene = canvas.scene) {
  if (!scene) return;
  const env = scene.toObject().environment ?? {};
  if (!scene.getFlag(MOD, "ambientePrecedente")) {
    await scene.setFlag(MOD, "ambientePrecedente", { cycle: env.cycle, base: env.base, dark: env.dark });
  }
  await scene.update({ environment: foundry.utils.deepClone(ATMOSFERA) });
  ui.notifications.info(t("SUPERFX.Avvisi.atmosferaApplicata"));
}

export async function ripristinaAtmosfera(scene = canvas.scene) {
  const prima = scene?.getFlag(MOD, "ambientePrecedente");
  if (!prima) return ui.notifications.warn(t("SUPERFX.Avvisi.nienteDaRipristinare"));
  await scene.update({ environment: prima });
  await scene.unsetFlag(MOD, "ambientePrecedente");
  ui.notifications.info(t("SUPERFX.Avvisi.atmosferaRipristinata"));
}

/**
 * Copia gli effetti di questa scena su un'altra. Gli effetti legati a regioni che là non esistono
 * diventano «tutta la scena»; i punti delle trombe tornano al centro.
 */
export async function copiaEffetti(idDestinazione, scene = canvas.scene) {
  const dest = game.scenes.get(idDestinazione);
  if (!dest || dest === scene) return;
  const copie = leggiEffetti(scene).map(e => {
    const area = Array.isArray(e.area) ? e.area.filter(id => dest.regions.get(id)) : "scena";
    return { ...e, id: nuovoId(), area: Array.isArray(area) && area.length ? area : "scena", punto: null };
  });
  await salvaEffetti([...leggiEffetti(dest), ...copie], dest);
  ui.notifications.info(t("SUPERFX.Avvisi.effettiCopiati", { n: copie.length, scena: dest.name }));
}
