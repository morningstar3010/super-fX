<p align="center"><img src="assets/logo.webp" alt="Super FX" width="320"></p>

<h3 align="center">Animated scene effects for Foundry VTT 13 and 14</h3>

<p align="center">Fog, rain, snow, flowing rivers, tornadoes, clashing beams and glowing walls · one panel for the GM · no macros · any game system</p>

<p align="center">
  <a href="https://github.com/morningstar3010/super-fx/releases"><img alt="Version" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmorningstar3010%2Fsuper-fx%2Fmain%2Fmodule.json&query=%24.version&label=version&color=8e44ad"></a>
  <img alt="Foundry VTT" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmorningstar3010%2Fsuper-fx%2Fmain%2Fmodule.json&query=%24.compatibility.verified&label=Foundry%20VTT&prefix=v&color=f37b21">
  <a href="https://github.com/morningstar3010/super-fx/releases"><img alt="Downloads" src="https://img.shields.io/github/downloads/morningstar3010/super-fx/total?label=downloads&color=16a085"></a>
</p>

<p align="center">
  <a href="README.md" title="English"><img src="https://flagcdn.com/32x24/gb.png" alt="English" width="32" height="24"></a>
  <a href="README.it.md" title="Italiano"><img src="https://flagcdn.com/32x24/it.png" alt="Italiano" width="32" height="24"></a>
</p>

<p align="center">
  🌐 <b>English</b> · <a href="README.it.md">Italiano</a>
</p>

---

**Super FX** brings your scenes to life. You add an effect with one click, you see it on the map at once, and you tune it with sliders while you watch: colour, intensity from 1 to 5, direction, slant, speed. Every effect can cover the whole scene or only the Regions you choose, and the «No effects» Regions keep rain and snow out of houses, caves and tents. Everything is saved in the scene, so it travels with your exported maps and adventures.

## Contents

1. [Install](#install)
2. [Your first effect in one minute](#quick-start)
3. [Open the panel](#open-panel)
4. [The effects](#effects)
5. [Where an effect is shown: areas and no-effect zones](#areas)
6. [Clashing beams](#beams)
7. [Glowing walls](#walls)
8. [Tools: presets, cinematic atmosphere, copy](#tools)
9. [Settings and language](#settings)
10. [Questions and problems](#faq)
11. [Macros](#macros)

<a name="install"></a>
## 1. Install

1. In Foundry, open **Add-on Modules** and press **Install Module**.
2. At the bottom, in the **Manifest URL** field, paste this address and press **Install**:

```
https://github.com/morningstar3010/super-fx/releases/latest/download/module.json
```

3. Open your world, go to **Manage Modules**, tick **Super FX** and save.

<a name="quick-start"></a>
## 2. Your first effect in one minute

- [ ] Click the **Super FX – Effects panel** button (the magic wand) in the toolbar on the left.
- [ ] In the **Effects** tab press **Rain**: it starts raining on the map.
- [ ] Open its box and move **Intensity** to 5: the rain becomes a **Storm** while you drag.
- [ ] Set **Slant** to **Straight from above** to see the rain falling towards the floor, with splashes where it lands.
- [ ] Done! Your players see exactly the same.

<a name="open-panel"></a>
## 3. Open the panel

The panel is for the GM only. You can open it in three ways:

- with the magic wand button in the toolbar on the left, in the Tokens, Regions, Walls and Lighting tools;
- with a key of your choice: **Configure Controls → Super FX → Open the Super FX panel**;
- with a macro: `game.modules.get("super-fx").api.pannello()`.

The panel has four tabs: **Effects**, **Beams**, **Glowing walls** and **Tools**. It always works on the scene you are viewing.

<a name="effects"></a>
## 4. The effects

| Effect | What it does | Main options |
|---|---|---|
| **Fog** | Drifting, fraying fog banks. Level 5 is a wall of fog | colour, intensity (Haze → Wall of fog), direction, speed, size |
| **Rain** | From drizzle to storm, with splashes and optional lightning | colour, intensity (Drizzle → Storm), slant (also **straight from above**), direction, speed, splashes, lightning, thunder sound |
| **Snow** | Flakes dancing in the wind, up to a blizzard | colour, intensity (A few flakes → Blizzard), slant, direction, speed |
| **Hail** | Hailstones falling fast and bouncing | colour, intensity, slant, direction, speed, splashes |
| **Sandstorm** | Wind-driven grains with a veil of dust | colour, intensity (Breeze → Tempest), slant, direction, speed |
| **Windblown leaves** | Leaves fluttering and spinning | colour, intensity, slant, direction, speed |
| **Embers** | Rising sparks and glowing ash | colour, intensity, direction, speed |
| **Fireflies** | Wandering, pulsing lights | colour, intensity, speed |
| **Flowing liquid** | Rivers, streams, swamps, blood, lava, acid, magical energy | liquid, colour, intensity, current direction, speed, size, below tokens |
| **Tornado / waterspout** | A vortex seen from above, with debris or spray | type (air, water, fire, magic), colour, intensity (Whirl → Hurricane), speed, movement, centre |
| **Lightning** | Random flashes and bolts, the same for every player | colour, intensity, frequency, thunder sound, **Lightning now** |
| **Magical darkness** | A breathing veil of shadow | colour, intensity, speed, size |

Every box also has **Area**, **Soft edge** and **GM only** (only you see the effect: handy to prepare it). The buttons on the box header turn the effect on and off, move it up or down, duplicate it and delete it. **Turn all on** and **Turn all off** act on the whole scene.

<details>
<summary><b>Slant and direction, explained</b></summary>

**Direction** is where the wind (or the current) goes: 0° = right, 90° = down, 180° = left, 270° = up. Next to the slider an arrow shows it.

**Slant** is how much the wind bends the fall. With **Straight from above** the drops fall towards the floor, as if the camera were above the map: they rush towards the point where they land and leave a ring there. At 75° the rain is almost horizontal.
</details>

<details>
<summary><b>Rivers and lava: how to draw them</b></summary>

1. Open the **Regions** tools and draw a polygon that follows the river.
2. Select the Region and, in the panel, press **Flowing liquid**: the liquid uses the selected Regions as its area. (You can also tick the Region later in the **Area** of the box.)
3. Choose the **Liquid** and the **Direction** of the current.

The liquid stays below tokens, so whoever wades the river remains visible. Lava, acid and magical energy glow and bubble.
</details>

<a name="areas"></a>
## 5. Where an effect is shown: areas and no-effect zones

- **Area**: «Whole scene» or one or more Regions ticked in the box.
- **No-effect zones**: Regions with the **Super FX – No effects** behaviour. Inside them the effects disappear: all of them, or only the ones chosen in the behaviour.
- **Mask from walls** (Tools tab) finds rooms, buildings and caves closed by walls by itself and creates the Region **Super FX – Interiors** with that behaviour ready. Press it again after changing the walls: it updates the same Region.
- **«No effects» on selected regions** adds the behaviour to the Regions you selected.
- **Soft edge** makes the border of areas and zones soft, in grid squares.

<a name="beams"></a>
## 6. Clashing beams

A **beam group** has **sources** (tokens or free points on the map, each one with its colour) and, if you want, a **target**.

- **Without a target** the beams clash: with two sources the clash point pushes back and forth, with three or more they meet in the middle.
- **With a target** (a targeted token or a point) every source hits it.
- When a token moves, or you drag a handle, the beams stretch at once.
- **Maximum length**: 0 = the beam always stretches; a number = beyond that many squares the beam breaks with a crackle and comes back when the sources get closer.
- **Against walls**: the beam **stops** at the first wall that blocks sight, or **passes through**.

Quick way: select two or more tokens and press **Clash between selected tokens**.

Free points have a round **handle** that only the GM sees: drag it to move the point (hold Shift to snap to the centre of the square). The handles can be hidden in the Tools tab.

<a name="walls"></a>
## 7. Glowing walls

Runes on a wall, a magical barrier, lava in the cracks, a force field: choose colour, intensity, pulse, width and sparks, select the walls on the **Walls** layer (Shift + click to pick more than one) and press **Apply to selected walls**. The glow stays on the wall and follows it if you move it. **Copy from selected wall** loads the look of a glowing wall into the panel.

<a name="tools"></a>
## 8. Tools: presets, cinematic atmosphere, copy

- **Ready-made combinations**: Thunderstorm, Rain, Rain from above, Snowfall, Blizzard, Hailstorm, Sandstorm, Misty swamp, Autumn wood, Fire, Cursed crypt, Arcane storm, Volcano. They add several effects already tuned together; then you change them as you like.
- **Cinematic atmosphere**: slightly muted colours, deeper shadows and a cold darkness, with the day/night cycle on. **Restore** puts back the previous values. Nothing else changes in the scene.
- **Copy effects to another scene**.
- **Clear this scene**: removes all effects and beams (glowing walls stay).

<a name="settings"></a>
## 9. Settings and language

In **Game Settings → Configure Settings → Super FX**:

- **Super FX language**: «Automatic» follows Foundry; otherwise you choose English, Italiano, Deutsch or Español. It changes only the texts of Super FX.
- **Show effects**: turn it off to hide the effects on this computer only.
- **Effects quality**: High, Medium or Low (how many particles are drawn). Lower it on slow computers.
- **Handles on the map** (GM).

In **Configure Controls** you can set a key to open the panel and one to turn the effects on and off.

<a name="faq"></a>
## 10. Questions and problems

<details>
<summary><b>It rains inside the house</b></summary>

Press **Mask from walls** in the Tools tab, or draw a Region over the house and press **«No effects» on selected regions**.
</details>

<details>
<summary><b>The computer slows down</b></summary>

Set **Effects quality** to Medium or Low. Particles are only created in the part of the map you see, so big maps cost the same as small ones.
</details>

<details>
<summary><b>Players do not see lightning</b></summary>

Lightning is decided by the active GM and sent to everyone: a GM must be connected.
</details>

<a name="macros"></a>
## 11. Macros

```js
const fx = game.modules.get("super-fx").api;
fx.pannello();                               // open the panel
fx.aggiungi("pioggia", { intensita: 5 });    // add a storm to the current scene
fx.preset("temporale");                      // add a ready-made combination
fx.effetti();                                // list of the scene effects
fx.modifica(id, { colore: "#ff0000" });      // change an effect
fx.spegni(id); fx.accendi(id);               // turn an effect off / on
fx.lampo(id);                                // lightning now
fx.scontro(canvas.tokens.controlled);        // beams between the selected tokens
fx.mascheraDaiMuri();                        // create the Interiors zone from walls
```

Effect types: `nebbia` (fog), `pioggia` (rain), `neve` (snow), `grandine` (hail), `sabbia` (sandstorm), `foglie` (leaves), `braci` (embers), `lucciole` (fireflies), `liquido` (liquid), `tromba` (tornado), `fulmini` (lightning), `oscurita` (darkness).

---

<p align="center">Made by <b>MorningStar</b></p>
