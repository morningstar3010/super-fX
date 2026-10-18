/**
 * SUPER FX – tutti i testi in tutte le lingue (file creato da strumenti/lingue.py, non modificarlo a mano).
 * Serve all'impostazione «Lingua di Super FX» per usare una lingua diversa da quella di Foundry.
 */
export const NOMI_LINGUE = {"en": "English", "it": "Italiano", "de": "Deutsch", "es": "Español"};

export const TESTI = {
 "en": {
  "TYPES": {
   "RegionBehavior": {
    "super-fx.senzaEffetti": "Super FX – No effects"
   },
   "HINTS": {
    "RegionBehavior": {
     "super-fx.senzaEffetti": "Super FX effects are not shown inside this region (all of them, or only the chosen ones). Perfect for interiors, caves, tents and roofs."
    }
   }
  },
  "SUPERFX": {
   "Comune": {
    "si": "Yes",
    "no": "No"
   },
   "Esclusione": {
    "FIELDS": {
     "tipi": {
      "label": "Effects to remove",
      "hint": "Choose which effects are hidden inside this region. If you choose none, all of them disappear."
     }
    }
   },
   "Tipi": {
    "nebbia": "Fog",
    "pioggia": "Rain",
    "neve": "Snow",
    "grandine": "Hail",
    "sabbia": "Sandstorm",
    "foglie": "Windblown leaves",
    "braci": "Embers",
    "lucciole": "Fireflies",
    "liquido": "Flowing liquid",
    "tromba": "Tornado / waterspout",
    "fulmini": "Lightning",
    "oscurita": "Magical darkness"
   },
   "Descrizioni": {
    "nebbia": "Drifting, fraying fog, from light haze to a wall of fog.",
    "pioggia": "From drizzle to storm, with splashes and lightning; also seen from above.",
    "neve": "Flakes dancing in the wind, up to a blizzard.",
    "grandine": "Hailstones falling fast and bouncing.",
    "sabbia": "Wind-driven grains with a veil of dust.",
    "foglie": "Leaves fluttering and spinning.",
    "braci": "Rising sparks and glowing ash: fires, forges, volcanoes.",
    "lucciole": "Wandering, pulsing lights: swamps, fey woods, spirits.",
    "liquido": "Rivers, streams, blood, lava, acid or magical energy flowing.",
    "tromba": "Vortex seen from above: air, water, fire or magic. Drag it to move it.",
    "fulmini": "Random flashes and bolts, the same for everyone, with thunder.",
    "oscurita": "A breathing veil of shadow with writhing dark tendrils."
   },
   "Livelli": {
    "generico": {
     "1": "Faint",
     "2": "Moderate",
     "3": "Medium",
     "4": "Strong",
     "5": "Extreme"
    },
    "pioggia": {
     "1": "Drizzle",
     "2": "Light rain",
     "3": "Rain",
     "4": "Downpour",
     "5": "Storm"
    },
    "neve": {
     "1": "A few flakes",
     "2": "Light snow",
     "3": "Snowfall",
     "4": "Heavy snow",
     "5": "Blizzard"
    },
    "nebbia": {
     "1": "Haze",
     "2": "Light fog",
     "3": "Fog",
     "4": "Thick fog",
     "5": "Wall of fog"
    },
    "vento": {
     "1": "Breeze",
     "2": "Wind",
     "3": "Strong wind",
     "4": "Gale",
     "5": "Tempest"
    },
    "tromba": {
     "1": "Whirl",
     "2": "Small twister",
     "3": "Twister",
     "4": "Large twister",
     "5": "Hurricane"
    }
   },
   "Liquidi": {
    "acqua": "Water",
    "palude": "Swamp",
    "sangue": "Blood",
    "lava": "Lava",
    "acido": "Acid",
    "magia": "Magical energy"
   },
   "Specie": {
    "aria": "Air (dust and debris)",
    "acqua": "Water (spray)",
    "fuoco": "Fire",
    "magia": "Magical"
   },
   "Campi": {
    "nome": {
     "nome": "Name",
     "hint": "Name of the effect in the panel. If empty, the type is used."
    },
    "colore": {
     "nome": "Colour",
     "hint": "Colour of the effect."
    },
    "intensita": {
     "nome": "Intensity",
     "hint": "From 1 (faint) to 5 (extreme): density, amount and strength of the effect."
    },
    "direzione": {
     "nome": "Direction",
     "hint": "Where the wind or current goes: 0° = right, 90° = down, 180° = left, 270° = up."
    },
    "inclinazione": {
     "nome": "Slant",
     "hint": "How much the wind bends the fall. «Straight from above» = falls towards the floor as seen from above, splashing where it lands.",
     "dallAlto": "Straight from above"
    },
    "velocita": {
     "nome": "Speed",
     "hint": "From 1 (slow) to 5 (very fast)."
    },
    "scala": {
     "nome": "Size",
     "hint": "Size of the fog banks or of the current's ripples."
    },
    "frequenza": {
     "nome": "Frequency",
     "hint": "How often lightning strikes: from 1 (rare) to 5 (constant)."
    },
    "vaga": {
     "nome": "Movement",
     "hint": "0 = stays at the chosen point; 1 to 5 = roams the area on its own, faster and faster.",
     "ferma": "Still"
    },
    "schizzi": {
     "nome": "Splashes",
     "hint": "Water rings or bounces where the drops hit the ground."
    },
    "lampi": {
     "nome": "Lightning",
     "hint": "Lightning also strikes during the rain (more often at higher intensity)."
    },
    "sottoToken": {
     "nome": "Below tokens",
     "hint": "The liquid is drawn above the map but below tokens: whoever wades stays visible."
    },
    "liquido": {
     "nome": "Liquid",
     "hint": "Kind of liquid: sets the colour and look. Lava, acid and magic glow and bubble."
    },
    "specie": {
     "nome": "Vortex type",
     "hint": "Air, water, fire or magic: sets the colour and the debris."
    },
    "suono": {
     "nome": "Thunder sound",
     "hint": "Audio file played to everyone shortly after each flash (empty = no sound)."
    },
    "punto": {
     "nome": "Centre",
     "hint": "Click the button and then the map; or drag its handle."
    },
    "area": {
     "nome": "Area",
     "hint": "Where the effect is shown: the whole scene or inside the ticked Regions. «No effects» regions remove it anyway.",
     "scena": "Whole scene",
     "nessuna": "No regions in the scene: draw one with the Region tools to limit the effect."
    },
    "sfumatura": {
     "nome": "Soft edge",
     "hint": "How soft the edge of the area and of the no-effect zones is, in grid squares."
    },
    "soloMaster": {
     "nome": "GM only",
     "hint": "Only you see it: handy to prepare it before showing it to the players."
    },
    "larghezza": {
     "nome": "Width",
     "hint": "Thickness of the beams, in grid squares."
    },
    "scintille": {
     "nome": "Sparks",
     "hint": "How many sparks fly from the clash and impacts (0 = none)."
    },
    "alMuro": {
     "nome": "Against walls",
     "hint": "If a wall stands between the source and the end, the beam stops there or passes through.",
     "ferma": "Stops",
     "attraversa": "Passes through"
    },
    "lunghezzaMax": {
     "nome": "Maximum length",
     "hint": "0 = when a source moves away the beam always stretches. A number = beyond that many squares the beam breaks, and comes back when the sources get closer.",
     "caselle": "squares: breaks beyond",
     "sempre": "always stretches"
    },
    "pulsazione": {
     "nome": "Pulse",
     "hint": "0 = steady light; 1 to 5 = the glow breathes faster and faster.",
     "ferma": "Steady"
    },
    "larghezzaBagliore": {
     "nome": "Width",
     "hint": "How far the glow spreads around the wall, in grid squares."
    },
    "faville": {
     "nome": "Sparks",
     "hint": "Sparks coming off the wall."
    }
   },
   "Schede": {
    "effetti": "Effects",
    "raggi": "Beams",
    "muri": "Glowing walls",
    "strumenti": "Tools"
   },
   "Pannello": {
    "titolo": "Super FX",
    "pulsante": "Super FX – Effects panel",
    "nessunaScena": "No scene is open.",
    "aggiungi": "Add an effect",
    "effettiScena": "Effects of this scene",
    "nessunEffetto": "No effects. Click a button above to add one: it shows up on the map right away.",
    "tuttiAccesi": "Turn all on",
    "tuttiSpenti": "Turn all off",
    "accendi": "Turn on",
    "spegni": "Turn off",
    "su": "Move up",
    "giu": "Move down",
    "duplica": "Duplicate",
    "elimina": "Delete",
    "scegliPunto": "Pick on the map",
    "lampoOra": "Lightning now",
    "sfoglia": "Browse files"
   },
   "Raggi": {
    "spiega": "Select two or more tokens and press «Clash between selected tokens», or create a group and add tokens or free points. Without a target the beams clash with each other; with a target they hit it. When a token or a handle moves, the beams stretch or break at once.",
    "scontroSelezionati": "Clash between selected tokens",
    "nuovo": "New beam group",
    "nessuno": "No beam groups in this scene.",
    "gruppo": "Beams",
    "fonti": "Sources",
    "nessunaFonte": "No sources: add tokens or points.",
    "aggiungiToken": "Add selected tokens",
    "aggiungiPunto": "Add a point",
    "bersaglio": "Target",
    "nessunBersaglio": "none: the beams clash",
    "bersaglioToken": "Targeted token",
    "bersaglioPunto": "Point on the map",
    "bersaglioNessuno": "None (clash)",
    "punto": "Point",
    "tokenSparito": "token no longer in the scene"
   },
   "Muri": {
    "spiega": "Choose the look of the glow, then select the walls on the Walls layer (Shift + click to pick more than one) and press «Apply».",
    "stato": "Glowing walls in the scene: {luminosi}. Selected walls: {sel}.",
    "applica": "Apply to selected walls",
    "togli": "Remove from selected",
    "leggi": "Copy from selected wall",
    "seleziona": "Select glowing walls",
    "togliTutti": "Remove all glows"
   },
   "Strumenti": {
    "zone": "No-effect zones",
    "zoneSpiega": "Effects are removed by Regions with the «Super FX – No effects» behaviour. «Mask from walls» finds rooms, buildings and caves closed by walls by itself and creates the «Super FX – Interiors» region. You can also draw the regions yourself and add the behaviour to the selected ones.",
    "mascheraMuri": "Mask from walls",
    "esclusione": "«No effects» on selected regions",
    "nomeInterni": "Super FX – Interiors",
    "maniglie": "Handles on the map",
    "maniglieSpiega": "Free beam points and tornado centres have a round handle only you can see: drag it to move them (Shift = snap to the square's centre).",
    "mostraManiglie": "Show handles",
    "nascondiManiglie": "Hide handles",
    "preset": "Ready-made combinations",
    "presetSpiega": "They add several effects already tuned together to the scene. Then change them as you like.",
    "atmosfera": "Cinematic atmosphere",
    "atmosferaSpiega": "Slightly muted colours, deeper shadows and a cold darkness, with the day/night cycle on. «Restore» puts back the previous values.",
    "applicaAtmosfera": "Apply to the scene",
    "ripristina": "Restore",
    "copia": "Copy effects to another scene",
    "copiaPulsante": "Copy",
    "svuota": "Clear this scene",
    "svuotaPulsante": "Remove effects and beams"
   },
   "Preset": {
    "temporale": "Thunderstorm",
    "pioggia": "Rain",
    "dallAlto": "Rain from above",
    "nevicata": "Snowfall",
    "bufera": "Blizzard",
    "grandinata": "Hailstorm",
    "sabbia": "Sandstorm",
    "palude": "Misty swamp",
    "autunno": "Autumn wood",
    "incendio": "Fire",
    "cripta": "Cursed crypt",
    "magia": "Arcane storm",
    "vulcano": "Volcano"
   },
   "Domande": {
    "eliminaEffetto": "Delete the effect «{nome}»?",
    "eliminaGruppo": "Delete the beam group «{nome}»?",
    "togliBagliori": "Remove the glow from {n} walls?",
    "svuota": "Remove all effects and beams from the scene «{nome}»? Glowing walls stay."
   },
   "Avvisi": {
    "soloMaster": "Only the GM can use the Super FX panel.",
    "cliccaMappa": "Click on the map to pick the point (Esc or right click to cancel).",
    "scenaTroppoGrande": "The scene is too large for the automatic mask: draw the regions by hand.",
    "nessunInterno": "No spaces enclosed by walls were found in this scene.",
    "selezionaRegioni": "Select one or more regions first (Regions layer).",
    "esclusioniAggiunte": "«No effects» behaviour added to {n} regions.",
    "liquidoArea": "Tip: draw a Region along the river, select it and add the liquid; or choose the area in the effect's box.",
    "dueToken": "Select at least two tokens (or select one token and target another with T).",
    "selezionaToken": "Select one or more tokens first.",
    "prendiDiMira": "Target a token (T key) and try again.",
    "selezionaMuri": "Select one or more walls first (Walls layer).",
    "nessunMuroLuminoso": "None of the selected walls has a glow.",
    "baglioreApplicato": "Glow applied to {n} walls.",
    "presetAggiunto": "Added: {nome}.",
    "atmosferaApplicata": "Cinematic atmosphere applied.",
    "atmosferaRipristinata": "Previous atmosphere restored.",
    "nienteDaRipristinare": "There is no previous atmosphere to restore.",
    "effettiCopiati": "{n} effects copied to «{scena}»."
   },
   "Impostazioni": {
    "lingua": {
     "nome": "Super FX language",
     "hint": "Language of the Super FX texts. «Automatic» follows Foundry's language.",
     "auto": "Automatic"
    },
    "attivo": {
     "nome": "Show effects",
     "hint": "Turn off to hide the effects on this computer (the others still see them)."
    },
    "qualita": {
     "nome": "Effects quality",
     "hint": "How many particles to draw. Lower it if your computer slows down.",
     "alta": "High",
     "media": "Medium",
     "bassa": "Low"
    },
    "maniglie": {
     "nome": "Handles on the map",
     "hint": "GM only: shows the handles of beam points and tornadoes."
    },
    "tastoPannello": {
     "nome": "Open the Super FX panel",
     "hint": "Opens the effects panel (GM only)."
    },
    "tastoAccendi": {
     "nome": "Turn effects on / off",
     "hint": "On this computer only."
    }
   }
  }
 },
 "it": {
  "TYPES": {
   "RegionBehavior": {
    "super-fx.senzaEffetti": "Super FX – Senza effetti"
   },
   "HINTS": {
    "RegionBehavior": {
     "super-fx.senzaEffetti": "Dentro questa regione gli effetti di Super FX non si vedono (tutti, oppure solo quelli scelti). Perfetta per interni, grotte, tende e tettoie."
    }
   }
  },
  "SUPERFX": {
   "Comune": {
    "si": "Sì",
    "no": "No"
   },
   "Esclusione": {
    "FIELDS": {
     "tipi": {
      "label": "Effetti da togliere",
      "hint": "Scegli quali effetti non si vedono dentro questa regione. Se non ne scegli nessuno, spariscono tutti."
     }
    }
   },
   "Tipi": {
    "nebbia": "Nebbia",
    "pioggia": "Pioggia",
    "neve": "Neve",
    "grandine": "Grandine",
    "sabbia": "Tempesta di sabbia",
    "foglie": "Foglie al vento",
    "braci": "Braci",
    "lucciole": "Lucciole",
    "liquido": "Liquido in movimento",
    "tromba": "Tromba d'aria / d'acqua",
    "fulmini": "Fulmini",
    "oscurita": "Oscurità magica"
   },
   "Descrizioni": {
    "nebbia": "Nebbia che scorre e si sfilaccia, dalla foschia al muro di nebbia.",
    "pioggia": "Dalla pioviggine alla tormenta, con schizzi e lampi; anche vista dall'alto.",
    "neve": "Fiocchi che danzano nel vento, fino alla bufera.",
    "grandine": "Chicchi che cadono veloci e rimbalzano.",
    "sabbia": "Granelli spinti dal vento con un velo di polvere.",
    "foglie": "Foglie che volteggiano girando su sé stesse.",
    "braci": "Scintille e cenere ardente che salgono: incendi, forge, vulcani.",
    "lucciole": "Punti di luce che vagano e pulsano: paludi, boschi fatati, spiriti.",
    "liquido": "Fiumi, torrenti, sangue, lava, acido o energia magica che scorrono.",
    "tromba": "Vortice visto dall'alto: aria, acqua, fuoco o magia. Si sposta trascinandolo.",
    "fulmini": "Lampi e saette che cadono a caso, uguali per tutti, con il tuono.",
    "oscurita": "Un velo d'ombra che respira con lingue scure che si contorcono."
   },
   "Livelli": {
    "generico": {
     "1": "Lieve",
     "2": "Moderata",
     "3": "Media",
     "4": "Forte",
     "5": "Estrema"
    },
    "pioggia": {
     "1": "Pioviggine",
     "2": "Pioggia leggera",
     "3": "Pioggia",
     "4": "Acquazzone",
     "5": "Tormenta"
    },
    "neve": {
     "1": "Qualche fiocco",
     "2": "Nevicata leggera",
     "3": "Nevicata",
     "4": "Nevicata fitta",
     "5": "Bufera"
    },
    "nebbia": {
     "1": "Foschia",
     "2": "Nebbia leggera",
     "3": "Nebbia",
     "4": "Nebbia fitta",
     "5": "Muro di nebbia"
    },
    "vento": {
     "1": "Brezza",
     "2": "Vento",
     "3": "Vento forte",
     "4": "Burrasca",
     "5": "Tempesta"
    },
    "tromba": {
     "1": "Mulinello",
     "2": "Piccola tromba",
     "3": "Tromba",
     "4": "Grande tromba",
     "5": "Uragano"
    }
   },
   "Liquidi": {
    "acqua": "Acqua",
    "palude": "Palude",
    "sangue": "Sangue",
    "lava": "Lava",
    "acido": "Acido",
    "magia": "Energia magica"
   },
   "Specie": {
    "aria": "D'aria (polvere e detriti)",
    "acqua": "D'acqua (spruzzi)",
    "fuoco": "Di fuoco",
    "magia": "Magica"
   },
   "Campi": {
    "nome": {
     "nome": "Nome",
     "hint": "Nome dell'effetto nel pannello. Se lo lasci vuoto si usa il tipo."
    },
    "colore": {
     "nome": "Colore",
     "hint": "Colore dell'effetto."
    },
    "intensita": {
     "nome": "Intensità",
     "hint": "Da 1 (lieve) a 5 (estrema): densità, quantità e forza dell'effetto."
    },
    "direzione": {
     "nome": "Direzione",
     "hint": "Verso dove va il vento o la corrente: 0° = destra, 90° = basso, 180° = sinistra, 270° = alto."
    },
    "inclinazione": {
     "nome": "Inclinazione",
     "hint": "Quanto il vento piega la caduta. «Dritta dall'alto» = cade verso il pavimento come vista da sopra, con gli schizzi dove tocca terra.",
     "dallAlto": "Dritta dall'alto"
    },
    "velocita": {
     "nome": "Velocità",
     "hint": "Da 1 (lenta) a 5 (velocissima)."
    },
    "scala": {
     "nome": "Grandezza",
     "hint": "Grandezza dei banchi di nebbia o delle onde della corrente."
    },
    "frequenza": {
     "nome": "Frequenza",
     "hint": "Quanto spesso cadono i fulmini: da 1 (rari) a 5 (continui)."
    },
    "vaga": {
     "nome": "Movimento",
     "hint": "0 = resta ferma nel punto scelto; da 1 a 5 gira da sola per l'area, sempre più veloce.",
     "ferma": "Ferma"
    },
    "schizzi": {
     "nome": "Schizzi a terra",
     "hint": "Gli anelli d'acqua o i rimbalzi dove le gocce toccano terra."
    },
    "lampi": {
     "nome": "Lampi",
     "hint": "Durante la pioggia cadono anche dei fulmini (più spessi con l'intensità più alta)."
    },
    "sottoToken": {
     "nome": "Sotto i token",
     "hint": "Il liquido si vede sopra la mappa ma sotto i token: chi guada resta visibile."
    },
    "liquido": {
     "nome": "Liquido",
     "hint": "Tipo di liquido: imposta il colore e il suo aspetto. Lava, acido e magia brillano e fanno bolle."
    },
    "specie": {
     "nome": "Tipo di tromba",
     "hint": "D'aria, d'acqua, di fuoco o magica: imposta il colore e i detriti."
    },
    "suono": {
     "nome": "Suono del tuono",
     "hint": "File audio suonato a tutti poco dopo ogni lampo (vuoto = nessun suono)."
    },
    "punto": {
     "nome": "Centro",
     "hint": "Clicca sul pulsante e poi sulla mappa; oppure trascina la sua maniglia."
    },
    "area": {
     "nome": "Area",
     "hint": "Dove si vede l'effetto: tutta la scena oppure dentro le Regioni spuntate. Le regioni «Senza effetti» lo tolgono comunque.",
     "scena": "Tutta la scena",
     "nessuna": "Nessuna regione nella scena: disegnane una con gli strumenti delle Regioni per limitare l'effetto."
    },
    "sfumatura": {
     "nome": "Bordo sfumato",
     "hint": "Quanto è morbido il bordo dell'area e delle zone senza effetti, in caselle."
    },
    "soloMaster": {
     "nome": "Solo per il master",
     "hint": "Lo vedi solo tu: comodo per prepararlo prima di mostrarlo ai giocatori."
    },
    "larghezza": {
     "nome": "Larghezza",
     "hint": "Spessore dei raggi, in caselle."
    },
    "scintille": {
     "nome": "Scintille",
     "hint": "Quante scintille schizzano dallo scontro e dagli impatti (0 = nessuna)."
    },
    "alMuro": {
     "nome": "Contro i muri",
     "hint": "Se un muro sta fra la fonte e l'arrivo, il raggio si ferma lì oppure lo attraversa.",
     "ferma": "Si ferma",
     "attraversa": "Attraversa"
    },
    "lunghezzaMax": {
     "nome": "Lunghezza massima",
     "hint": "0 = quando una fonte si allontana il raggio si allunga sempre. Un numero = oltre quelle caselle il raggio si interrompe e torna quando le fonti si riavvicinano.",
     "caselle": "caselle: oltre si interrompe",
     "sempre": "si allunga sempre"
    },
    "pulsazione": {
     "nome": "Pulsazione",
     "hint": "0 = luce ferma; da 1 a 5 il bagliore respira sempre più in fretta.",
     "ferma": "Ferma"
    },
    "larghezzaBagliore": {
     "nome": "Larghezza",
     "hint": "Quanto si allarga il bagliore attorno al muro, in caselle."
    },
    "faville": {
     "nome": "Faville",
     "hint": "Scintille che si staccano dalla parete."
    }
   },
   "Schede": {
    "effetti": "Effetti",
    "raggi": "Raggi",
    "muri": "Muri luminosi",
    "strumenti": "Strumenti"
   },
   "Pannello": {
    "titolo": "Super FX",
    "pulsante": "Super FX – Pannello degli effetti",
    "nessunaScena": "Nessuna scena aperta.",
    "aggiungi": "Aggiungi un effetto",
    "effettiScena": "Effetti di questa scena",
    "nessunEffetto": "Nessun effetto. Clicca un pulsante qui sopra per aggiungerne uno: si vede subito sulla mappa.",
    "tuttiAccesi": "Accendi tutti",
    "tuttiSpenti": "Spegni tutti",
    "accendi": "Accendi",
    "spegni": "Spegni",
    "su": "Sposta su",
    "giu": "Sposta giù",
    "duplica": "Duplica",
    "elimina": "Elimina",
    "scegliPunto": "Scegli sulla mappa",
    "lampoOra": "Fulmine adesso",
    "sfoglia": "Sfoglia i file"
   },
   "Raggi": {
    "spiega": "Seleziona due o più token e premi «Scontro fra i token selezionati», oppure crea un gruppo e aggiungi token o punti liberi. Senza bersaglio i raggi si scontrano fra loro; con un bersaglio lo colpiscono. Quando un token o una maniglia si spostano, i raggi si allungano o si interrompono subito.",
    "scontroSelezionati": "Scontro fra i token selezionati",
    "nuovo": "Nuovo gruppo di raggi",
    "nessuno": "Nessun gruppo di raggi in questa scena.",
    "gruppo": "Raggi",
    "fonti": "Fonti",
    "nessunaFonte": "Nessuna fonte: aggiungi dei token o dei punti.",
    "aggiungiToken": "Aggiungi i token selezionati",
    "aggiungiPunto": "Aggiungi un punto",
    "bersaglio": "Bersaglio",
    "nessunBersaglio": "nessuno: i raggi si scontrano",
    "bersaglioToken": "Token preso di mira",
    "bersaglioPunto": "Punto sulla mappa",
    "bersaglioNessuno": "Nessuno (scontro)",
    "punto": "Punto",
    "tokenSparito": "token non più nella scena"
   },
   "Muri": {
    "spiega": "Scegli l'aspetto del bagliore, poi seleziona i muri dal livello Muri (Maiusc + clic per sceglierne più di uno) e premi «Applica».",
    "stato": "Muri luminosi nella scena: {luminosi}. Muri selezionati: {sel}.",
    "applica": "Applica ai muri selezionati",
    "togli": "Togli dai selezionati",
    "leggi": "Copia dal muro selezionato",
    "seleziona": "Seleziona i muri luminosi",
    "togliTutti": "Togli tutti i bagliori"
   },
   "Strumenti": {
    "zone": "Zone senza effetti",
    "zoneSpiega": "Gli effetti si tolgono dalle Regioni con il comportamento «Super FX – Senza effetti». «Maschera dai muri» trova da sola stanze, edifici e grotte chiuse dai muri e crea la regione «Super FX – Interni». Puoi anche disegnare tu le regioni e aggiungere il comportamento a quelle selezionate.",
    "mascheraMuri": "Maschera dai muri",
    "esclusione": "«Senza effetti» sulle regioni selezionate",
    "nomeInterni": "Super FX – Interni",
    "maniglie": "Maniglie sulla mappa",
    "maniglieSpiega": "I punti liberi dei raggi e il centro delle trombe hanno una maniglia rotonda che vedi solo tu: trascinala per spostarli (Maiusc = al centro della casella).",
    "mostraManiglie": "Mostra le maniglie",
    "nascondiManiglie": "Nascondi le maniglie",
    "preset": "Combinazioni pronte",
    "presetSpiega": "Aggiungono alla scena più effetti già regolati insieme. Poi li cambi come vuoi.",
    "atmosfera": "Atmosfera cinematografica",
    "atmosferaSpiega": "Colori un po' spenti, ombre più profonde e un buio freddo, con il ciclo giorno/notte attivo. «Ripristina» rimette i valori di prima.",
    "applicaAtmosfera": "Applica alla scena",
    "ripristina": "Ripristina",
    "copia": "Copia gli effetti su un'altra scena",
    "copiaPulsante": "Copia",
    "svuota": "Togli tutto da questa scena",
    "svuotaPulsante": "Togli effetti e raggi"
   },
   "Preset": {
    "temporale": "Temporale",
    "pioggia": "Pioggia",
    "dallAlto": "Pioggia dall'alto",
    "nevicata": "Nevicata",
    "bufera": "Bufera di neve",
    "grandinata": "Grandinata",
    "sabbia": "Tempesta di sabbia",
    "palude": "Palude nebbiosa",
    "autunno": "Bosco d'autunno",
    "incendio": "Incendio",
    "cripta": "Cripta maledetta",
    "magia": "Tempesta magica",
    "vulcano": "Vulcano"
   },
   "Domande": {
    "eliminaEffetto": "Eliminare l'effetto «{nome}»?",
    "eliminaGruppo": "Eliminare il gruppo di raggi «{nome}»?",
    "togliBagliori": "Togliere il bagliore da {n} muri?",
    "svuota": "Togliere tutti gli effetti e tutti i raggi dalla scena «{nome}»? I muri luminosi restano."
   },
   "Avvisi": {
    "soloMaster": "Solo il master può usare il pannello di Super FX.",
    "cliccaMappa": "Clicca sulla mappa per scegliere il punto (Esc o tasto destro per annullare).",
    "scenaTroppoGrande": "La scena è troppo grande per la maschera automatica: disegna le regioni a mano.",
    "nessunInterno": "Non ho trovato spazi chiusi dai muri in questa scena.",
    "selezionaRegioni": "Seleziona prima una o più regioni (livello Regioni).",
    "esclusioniAggiunte": "Comportamento «Senza effetti» aggiunto a {n} regioni.",
    "liquidoArea": "Consiglio: disegna una Regione lungo il fiume, selezionala e aggiungi il liquido; oppure scegli l'area nel riquadro dell'effetto.",
    "dueToken": "Seleziona almeno due token (o seleziona un token e prendine di mira un altro con T).",
    "selezionaToken": "Seleziona prima uno o più token.",
    "prendiDiMira": "Prendi di mira un token (tasto T) e riprova.",
    "selezionaMuri": "Seleziona prima uno o più muri (livello Muri).",
    "nessunMuroLuminoso": "Nessuno dei muri selezionati ha un bagliore.",
    "baglioreApplicato": "Bagliore applicato a {n} muri.",
    "presetAggiunto": "Aggiunto: {nome}.",
    "atmosferaApplicata": "Atmosfera cinematografica applicata.",
    "atmosferaRipristinata": "Atmosfera di prima ripristinata.",
    "nienteDaRipristinare": "Non c'è un'atmosfera precedente da ripristinare.",
    "effettiCopiati": "{n} effetti copiati su «{scena}»."
   },
   "Impostazioni": {
    "lingua": {
     "nome": "Lingua di Super FX",
     "hint": "Lingua dei testi di Super FX. «Automatica» segue la lingua di Foundry.",
     "auto": "Automatica"
    },
    "attivo": {
     "nome": "Mostra gli effetti",
     "hint": "Spegni per non vedere gli effetti su questo computer (gli altri li vedono comunque)."
    },
    "qualita": {
     "nome": "Qualità degli effetti",
     "hint": "Quante particelle disegnare. Abbassala se il computer rallenta.",
     "alta": "Alta",
     "media": "Media",
     "bassa": "Bassa"
    },
    "maniglie": {
     "nome": "Maniglie sulla mappa",
     "hint": "Solo per il master: mostra le maniglie dei punti dei raggi e delle trombe."
    },
    "tastoPannello": {
     "nome": "Apri il pannello di Super FX",
     "hint": "Apre il pannello degli effetti (solo master)."
    },
    "tastoAccendi": {
     "nome": "Accendi / spegni gli effetti",
     "hint": "Solo su questo computer."
    }
   }
  }
 },
 "de": {
  "TYPES": {
   "RegionBehavior": {
    "super-fx.senzaEffetti": "Super FX – Keine Effekte"
   },
   "HINTS": {
    "RegionBehavior": {
     "super-fx.senzaEffetti": "In dieser Region werden die Effekte von Super FX nicht angezeigt (alle oder nur die gewählten). Ideal für Innenräume, Höhlen, Zelte und Dächer."
    }
   }
  },
  "SUPERFX": {
   "Comune": {
    "si": "Ja",
    "no": "Nein"
   },
   "Esclusione": {
    "FIELDS": {
     "tipi": {
      "label": "Zu entfernende Effekte",
      "hint": "Wähle, welche Effekte in dieser Region nicht zu sehen sind. Wählst du keinen, verschwinden alle."
     }
    }
   },
   "Tipi": {
    "nebbia": "Nebel",
    "pioggia": "Regen",
    "neve": "Schnee",
    "grandine": "Hagel",
    "sabbia": "Sandsturm",
    "foglie": "Blätter im Wind",
    "braci": "Glut",
    "lucciole": "Glühwürmchen",
    "liquido": "Fließende Flüssigkeit",
    "tromba": "Windhose / Wasserhose",
    "fulmini": "Blitze",
    "oscurita": "Magische Dunkelheit"
   },
   "Descrizioni": {
    "nebbia": "Ziehender, zerfasernder Nebel, vom Dunst bis zur Nebelwand.",
    "pioggia": "Vom Nieselregen bis zum Unwetter, mit Spritzern und Blitzen; auch von oben gesehen.",
    "neve": "Flocken, die im Wind tanzen, bis zum Schneesturm.",
    "grandine": "Hagelkörner, die schnell fallen und abprallen.",
    "sabbia": "Vom Wind getriebene Körner mit einem Staubschleier.",
    "foglie": "Blätter, die flattern und sich drehen.",
    "braci": "Aufsteigende Funken und glühende Asche: Brände, Schmieden, Vulkane.",
    "lucciole": "Umherwandernde, pulsierende Lichter: Sümpfe, Feenwälder, Geister.",
    "liquido": "Flüsse, Bäche, Blut, Lava, Säure oder magische Energie, die fließen.",
    "tromba": "Wirbel von oben gesehen: Luft, Wasser, Feuer oder Magie. Zum Verschieben ziehen.",
    "fulmini": "Zufällige Blitze und Einschläge, für alle gleich, mit Donner.",
    "oscurita": "Ein atmender Schattenschleier mit sich windenden dunklen Ranken."
   },
   "Livelli": {
    "generico": {
     "1": "Schwach",
     "2": "Mäßig",
     "3": "Mittel",
     "4": "Stark",
     "5": "Extrem"
    },
    "pioggia": {
     "1": "Nieselregen",
     "2": "Leichter Regen",
     "3": "Regen",
     "4": "Platzregen",
     "5": "Unwetter"
    },
    "neve": {
     "1": "Ein paar Flocken",
     "2": "Leichter Schneefall",
     "3": "Schneefall",
     "4": "Dichter Schneefall",
     "5": "Schneesturm"
    },
    "nebbia": {
     "1": "Dunst",
     "2": "Leichter Nebel",
     "3": "Nebel",
     "4": "Dichter Nebel",
     "5": "Nebelwand"
    },
    "vento": {
     "1": "Brise",
     "2": "Wind",
     "3": "Starker Wind",
     "4": "Sturm",
     "5": "Orkan"
    },
    "tromba": {
     "1": "Wirbel",
     "2": "Kleine Windhose",
     "3": "Windhose",
     "4": "Große Windhose",
     "5": "Hurrikan"
    }
   },
   "Liquidi": {
    "acqua": "Wasser",
    "palude": "Sumpf",
    "sangue": "Blut",
    "lava": "Lava",
    "acido": "Säure",
    "magia": "Magische Energie"
   },
   "Specie": {
    "aria": "Luft (Staub und Trümmer)",
    "acqua": "Wasser (Gischt)",
    "fuoco": "Feuer",
    "magia": "Magisch"
   },
   "Campi": {
    "nome": {
     "nome": "Name",
     "hint": "Name des Effekts im Panel. Bleibt er leer, wird der Typ verwendet."
    },
    "colore": {
     "nome": "Farbe",
     "hint": "Farbe des Effekts."
    },
    "intensita": {
     "nome": "Intensität",
     "hint": "Von 1 (schwach) bis 5 (extrem): Dichte, Menge und Stärke des Effekts."
    },
    "direzione": {
     "nome": "Richtung",
     "hint": "Wohin der Wind oder die Strömung geht: 0° = rechts, 90° = unten, 180° = links, 270° = oben."
    },
    "inclinazione": {
     "nome": "Neigung",
     "hint": "Wie stark der Wind den Fall neigt. «Senkrecht von oben» = fällt von oben gesehen auf den Boden und spritzt dort, wo er aufkommt.",
     "dallAlto": "Senkrecht von oben"
    },
    "velocita": {
     "nome": "Geschwindigkeit",
     "hint": "Von 1 (langsam) bis 5 (sehr schnell)."
    },
    "scala": {
     "nome": "Größe",
     "hint": "Größe der Nebelbänke oder der Wellen der Strömung."
    },
    "frequenza": {
     "nome": "Häufigkeit",
     "hint": "Wie oft Blitze einschlagen: von 1 (selten) bis 5 (ständig)."
    },
    "vaga": {
     "nome": "Bewegung",
     "hint": "0 = bleibt am gewählten Punkt; 1 bis 5 = zieht allein durch das Gebiet, immer schneller.",
     "ferma": "Still"
    },
    "schizzi": {
     "nome": "Spritzer am Boden",
     "hint": "Wasserringe oder Abpraller, wo die Tropfen auf den Boden treffen."
    },
    "lampi": {
     "nome": "Blitze",
     "hint": "Während des Regens schlagen auch Blitze ein (häufiger bei höherer Intensität)."
    },
    "sottoToken": {
     "nome": "Unter den Tokens",
     "hint": "Die Flüssigkeit liegt über der Karte, aber unter den Tokens: wer watet, bleibt sichtbar."
    },
    "liquido": {
     "nome": "Flüssigkeit",
     "hint": "Art der Flüssigkeit: legt Farbe und Aussehen fest. Lava, Säure und Magie leuchten und blubbern."
    },
    "specie": {
     "nome": "Art des Wirbels",
     "hint": "Luft, Wasser, Feuer oder Magie: legt Farbe und Trümmer fest."
    },
    "suono": {
     "nome": "Donnergeräusch",
     "hint": "Audiodatei, die allen kurz nach jedem Blitz abgespielt wird (leer = kein Ton)."
    },
    "punto": {
     "nome": "Mitte",
     "hint": "Klicke auf die Schaltfläche und dann auf die Karte; oder ziehe den Griff."
    },
    "area": {
     "nome": "Bereich",
     "hint": "Wo der Effekt zu sehen ist: ganze Szene oder in den angehakten Regionen. Regionen «Keine Effekte» entfernen ihn trotzdem.",
     "scena": "Ganze Szene",
     "nessuna": "Keine Regionen in der Szene: zeichne eine mit den Regionswerkzeugen, um den Effekt zu begrenzen."
    },
    "sfumatura": {
     "nome": "Weicher Rand",
     "hint": "Wie weich der Rand des Bereichs und der effektfreien Zonen ist, in Feldern."
    },
    "soloMaster": {
     "nome": "Nur für die SL",
     "hint": "Nur du siehst ihn: praktisch, um ihn vorzubereiten, bevor die Spieler ihn sehen."
    },
    "larghezza": {
     "nome": "Breite",
     "hint": "Dicke der Strahlen, in Feldern."
    },
    "scintille": {
     "nome": "Funken",
     "hint": "Wie viele Funken vom Zusammenprall und den Einschlägen sprühen (0 = keine)."
    },
    "alMuro": {
     "nome": "An Wänden",
     "hint": "Steht eine Wand zwischen Quelle und Ziel, endet der Strahl dort oder geht hindurch.",
     "ferma": "Endet",
     "attraversa": "Geht hindurch"
    },
    "lunghezzaMax": {
     "nome": "Maximale Länge",
     "hint": "0 = entfernt sich eine Quelle, wird der Strahl immer länger. Eine Zahl = über so viele Felder hinaus reißt der Strahl ab und kehrt zurück, wenn die Quellen näher kommen.",
     "caselle": "Felder: darüber reißt er ab",
     "sempre": "wird immer länger"
    },
    "pulsazione": {
     "nome": "Pulsieren",
     "hint": "0 = ruhiges Licht; 1 bis 5 = das Leuchten atmet immer schneller.",
     "ferma": "Ruhig"
    },
    "larghezzaBagliore": {
     "nome": "Breite",
     "hint": "Wie weit sich das Leuchten um die Wand ausbreitet, in Feldern."
    },
    "faville": {
     "nome": "Funken",
     "hint": "Funken, die sich von der Wand lösen."
    }
   },
   "Schede": {
    "effetti": "Effekte",
    "raggi": "Strahlen",
    "muri": "Leuchtende Wände",
    "strumenti": "Werkzeuge"
   },
   "Pannello": {
    "titolo": "Super FX",
    "pulsante": "Super FX – Effekt-Panel",
    "nessunaScena": "Keine Szene geöffnet.",
    "aggiungi": "Effekt hinzufügen",
    "effettiScena": "Effekte dieser Szene",
    "nessunEffetto": "Keine Effekte. Klicke oben auf eine Schaltfläche, um einen hinzuzufügen: er erscheint sofort auf der Karte.",
    "tuttiAccesi": "Alle einschalten",
    "tuttiSpenti": "Alle ausschalten",
    "accendi": "Einschalten",
    "spegni": "Ausschalten",
    "su": "Nach oben",
    "giu": "Nach unten",
    "duplica": "Duplizieren",
    "elimina": "Löschen",
    "scegliPunto": "Auf der Karte wählen",
    "lampoOra": "Blitz jetzt",
    "sfoglia": "Dateien durchsuchen"
   },
   "Raggi": {
    "spiega": "Wähle zwei oder mehr Tokens und drücke «Zusammenprall zwischen gewählten Tokens», oder erstelle eine Gruppe und füge Tokens oder freie Punkte hinzu. Ohne Ziel prallen die Strahlen aufeinander; mit Ziel treffen sie es. Bewegt sich ein Token oder ein Griff, werden die Strahlen sofort länger oder reißen ab.",
    "scontroSelezionati": "Zusammenprall zwischen gewählten Tokens",
    "nuovo": "Neue Strahlengruppe",
    "nessuno": "Keine Strahlengruppen in dieser Szene.",
    "gruppo": "Strahlen",
    "fonti": "Quellen",
    "nessunaFonte": "Keine Quellen: füge Tokens oder Punkte hinzu.",
    "aggiungiToken": "Gewählte Tokens hinzufügen",
    "aggiungiPunto": "Punkt hinzufügen",
    "bersaglio": "Ziel",
    "nessunBersaglio": "keines: die Strahlen prallen aufeinander",
    "bersaglioToken": "Anvisierter Token",
    "bersaglioPunto": "Punkt auf der Karte",
    "bersaglioNessuno": "Keines (Zusammenprall)",
    "punto": "Punkt",
    "tokenSparito": "Token nicht mehr in der Szene"
   },
   "Muri": {
    "spiega": "Wähle das Aussehen des Leuchtens, markiere dann die Wände auf der Wandebene (Umschalt + Klick für mehrere) und drücke «Anwenden».",
    "stato": "Leuchtende Wände in der Szene: {luminosi}. Gewählte Wände: {sel}.",
    "applica": "Auf gewählte Wände anwenden",
    "togli": "Von gewählten entfernen",
    "leggi": "Von gewählter Wand übernehmen",
    "seleziona": "Leuchtende Wände auswählen",
    "togliTutti": "Alle Leuchteffekte entfernen"
   },
   "Strumenti": {
    "zone": "Effektfreie Zonen",
    "zoneSpiega": "Effekte werden durch Regionen mit dem Verhalten «Super FX – Keine Effekte» entfernt. «Maske aus Wänden» findet selbst Räume, Gebäude und Höhlen, die von Wänden umschlossen sind, und erstellt die Region «Super FX – Innenräume». Du kannst die Regionen auch selbst zeichnen und den gewählten das Verhalten hinzufügen.",
    "mascheraMuri": "Maske aus Wänden",
    "esclusione": "«Keine Effekte» auf gewählte Regionen",
    "nomeInterni": "Super FX – Innenräume",
    "maniglie": "Griffe auf der Karte",
    "maniglieSpiega": "Freie Strahlenpunkte und die Mitte von Windhosen haben einen runden Griff, den nur du siehst: ziehe ihn, um sie zu verschieben (Umschalt = zur Feldmitte).",
    "mostraManiglie": "Griffe anzeigen",
    "nascondiManiglie": "Griffe ausblenden",
    "preset": "Fertige Kombinationen",
    "presetSpiega": "Fügen der Szene mehrere aufeinander abgestimmte Effekte hinzu. Danach kannst du sie beliebig ändern.",
    "atmosfera": "Filmische Atmosphäre",
    "atmosferaSpiega": "Etwas gedämpfte Farben, tiefere Schatten und eine kalte Dunkelheit, mit aktivem Tag-/Nachtzyklus. «Wiederherstellen» setzt die vorherigen Werte zurück.",
    "applicaAtmosfera": "Auf die Szene anwenden",
    "ripristina": "Wiederherstellen",
    "copia": "Effekte in eine andere Szene kopieren",
    "copiaPulsante": "Kopieren",
    "svuota": "Diese Szene leeren",
    "svuotaPulsante": "Effekte und Strahlen entfernen"
   },
   "Preset": {
    "temporale": "Gewitter",
    "pioggia": "Regen",
    "dallAlto": "Regen von oben",
    "nevicata": "Schneefall",
    "bufera": "Schneesturm",
    "grandinata": "Hagelsturm",
    "sabbia": "Sandsturm",
    "palude": "Nebliger Sumpf",
    "autunno": "Herbstwald",
    "incendio": "Brand",
    "cripta": "Verfluchte Gruft",
    "magia": "Magischer Sturm",
    "vulcano": "Vulkan"
   },
   "Domande": {
    "eliminaEffetto": "Den Effekt «{nome}» löschen?",
    "eliminaGruppo": "Die Strahlengruppe «{nome}» löschen?",
    "togliBagliori": "Das Leuchten von {n} Wänden entfernen?",
    "svuota": "Alle Effekte und Strahlen aus der Szene «{nome}» entfernen? Leuchtende Wände bleiben."
   },
   "Avvisi": {
    "soloMaster": "Nur die SL kann das Super-FX-Panel benutzen.",
    "cliccaMappa": "Klicke auf die Karte, um den Punkt zu wählen (Esc oder Rechtsklick zum Abbrechen).",
    "scenaTroppoGrande": "Die Szene ist zu groß für die automatische Maske: zeichne die Regionen von Hand.",
    "nessunInterno": "In dieser Szene wurden keine von Wänden umschlossenen Räume gefunden.",
    "selezionaRegioni": "Wähle zuerst eine oder mehrere Regionen (Regionsebene).",
    "esclusioniAggiunte": "Verhalten «Keine Effekte» zu {n} Regionen hinzugefügt.",
    "liquidoArea": "Tipp: Zeichne eine Region entlang des Flusses, wähle sie aus und füge die Flüssigkeit hinzu; oder wähle den Bereich im Feld des Effekts.",
    "dueToken": "Wähle mindestens zwei Tokens (oder wähle einen Token und visiere mit T einen anderen an).",
    "selezionaToken": "Wähle zuerst einen oder mehrere Tokens.",
    "prendiDiMira": "Visiere einen Token an (Taste T) und versuche es erneut.",
    "selezionaMuri": "Wähle zuerst eine oder mehrere Wände (Wandebene).",
    "nessunMuroLuminoso": "Keine der gewählten Wände leuchtet.",
    "baglioreApplicato": "Leuchten auf {n} Wände angewendet.",
    "presetAggiunto": "Hinzugefügt: {nome}.",
    "atmosferaApplicata": "Filmische Atmosphäre angewendet.",
    "atmosferaRipristinata": "Vorherige Atmosphäre wiederhergestellt.",
    "nienteDaRipristinare": "Es gibt keine vorherige Atmosphäre zum Wiederherstellen.",
    "effettiCopiati": "{n} Effekte nach «{scena}» kopiert."
   },
   "Impostazioni": {
    "lingua": {
     "nome": "Sprache von Super FX",
     "hint": "Sprache der Texte von Super FX. «Automatisch» folgt der Sprache von Foundry.",
     "auto": "Automatisch"
    },
    "attivo": {
     "nome": "Effekte anzeigen",
     "hint": "Ausschalten, um die Effekte auf diesem Computer nicht zu sehen (die anderen sehen sie trotzdem)."
    },
    "qualita": {
     "nome": "Effektqualität",
     "hint": "Wie viele Partikel gezeichnet werden. Senke sie, wenn dein Computer langsamer wird.",
     "alta": "Hoch",
     "media": "Mittel",
     "bassa": "Niedrig"
    },
    "maniglie": {
     "nome": "Griffe auf der Karte",
     "hint": "Nur für die SL: zeigt die Griffe der Strahlenpunkte und Windhosen."
    },
    "tastoPannello": {
     "nome": "Super-FX-Panel öffnen",
     "hint": "Öffnet das Effekt-Panel (nur SL)."
    },
    "tastoAccendi": {
     "nome": "Effekte ein / aus",
     "hint": "Nur auf diesem Computer."
    }
   }
  }
 },
 "es": {
  "TYPES": {
   "RegionBehavior": {
    "super-fx.senzaEffetti": "Super FX – Sin efectos"
   },
   "HINTS": {
    "RegionBehavior": {
     "super-fx.senzaEffetti": "Dentro de esta región no se ven los efectos de Super FX (todos, o solo los elegidos). Perfecta para interiores, cuevas, tiendas y tejados."
    }
   }
  },
  "SUPERFX": {
   "Comune": {
    "si": "Sí",
    "no": "No"
   },
   "Esclusione": {
    "FIELDS": {
     "tipi": {
      "label": "Efectos que quitar",
      "hint": "Elige qué efectos no se ven dentro de esta región. Si no eliges ninguno, desaparecen todos."
     }
    }
   },
   "Tipi": {
    "nebbia": "Niebla",
    "pioggia": "Lluvia",
    "neve": "Nieve",
    "grandine": "Granizo",
    "sabbia": "Tormenta de arena",
    "foglie": "Hojas al viento",
    "braci": "Brasas",
    "lucciole": "Luciérnagas",
    "liquido": "Líquido en movimiento",
    "tromba": "Tornado / tromba marina",
    "fulmini": "Rayos",
    "oscurita": "Oscuridad mágica"
   },
   "Descrizioni": {
    "nebbia": "Niebla que avanza y se deshilacha, de la bruma al muro de niebla.",
    "pioggia": "De la llovizna a la tormenta, con salpicaduras y relámpagos; también vista desde arriba.",
    "neve": "Copos que bailan en el viento, hasta la ventisca.",
    "grandine": "Granizo que cae rápido y rebota.",
    "sabbia": "Granos empujados por el viento con un velo de polvo.",
    "foglie": "Hojas que revolotean girando sobre sí mismas.",
    "braci": "Chispas y ceniza ardiente que suben: incendios, forjas, volcanes.",
    "lucciole": "Luces que vagan y laten: pantanos, bosques feéricos, espíritus.",
    "liquido": "Ríos, arroyos, sangre, lava, ácido o energía mágica que fluyen.",
    "tromba": "Vórtice visto desde arriba: aire, agua, fuego o magia. Se mueve arrastrándolo.",
    "fulmini": "Relámpagos y rayos al azar, iguales para todos, con el trueno.",
    "oscurita": "Un velo de sombra que respira con tentáculos oscuros que se retuercen."
   },
   "Livelli": {
    "generico": {
     "1": "Leve",
     "2": "Moderada",
     "3": "Media",
     "4": "Fuerte",
     "5": "Extrema"
    },
    "pioggia": {
     "1": "Llovizna",
     "2": "Lluvia ligera",
     "3": "Lluvia",
     "4": "Aguacero",
     "5": "Tormenta"
    },
    "neve": {
     "1": "Algunos copos",
     "2": "Nevada ligera",
     "3": "Nevada",
     "4": "Nevada intensa",
     "5": "Ventisca"
    },
    "nebbia": {
     "1": "Bruma",
     "2": "Niebla ligera",
     "3": "Niebla",
     "4": "Niebla espesa",
     "5": "Muro de niebla"
    },
    "vento": {
     "1": "Brisa",
     "2": "Viento",
     "3": "Viento fuerte",
     "4": "Vendaval",
     "5": "Temporal"
    },
    "tromba": {
     "1": "Remolino",
     "2": "Tornado pequeño",
     "3": "Tornado",
     "4": "Gran tornado",
     "5": "Huracán"
    }
   },
   "Liquidi": {
    "acqua": "Agua",
    "palude": "Pantano",
    "sangue": "Sangre",
    "lava": "Lava",
    "acido": "Ácido",
    "magia": "Energía mágica"
   },
   "Specie": {
    "aria": "De aire (polvo y escombros)",
    "acqua": "De agua (rocío)",
    "fuoco": "De fuego",
    "magia": "Mágica"
   },
   "Campi": {
    "nome": {
     "nome": "Nombre",
     "hint": "Nombre del efecto en el panel. Si lo dejas vacío se usa el tipo."
    },
    "colore": {
     "nome": "Color",
     "hint": "Color del efecto."
    },
    "intensita": {
     "nome": "Intensidad",
     "hint": "De 1 (leve) a 5 (extrema): densidad, cantidad y fuerza del efecto."
    },
    "direzione": {
     "nome": "Dirección",
     "hint": "Hacia dónde va el viento o la corriente: 0° = derecha, 90° = abajo, 180° = izquierda, 270° = arriba."
    },
    "inclinazione": {
     "nome": "Inclinación",
     "hint": "Cuánto dobla el viento la caída. «Recta desde arriba» = cae hacia el suelo vista desde encima, salpicando donde toca tierra.",
     "dallAlto": "Recta desde arriba"
    },
    "velocita": {
     "nome": "Velocidad",
     "hint": "De 1 (lenta) a 5 (rapidísima)."
    },
    "scala": {
     "nome": "Tamaño",
     "hint": "Tamaño de los bancos de niebla o de las ondas de la corriente."
    },
    "frequenza": {
     "nome": "Frecuencia",
     "hint": "Con qué frecuencia caen los rayos: de 1 (raros) a 5 (continuos)."
    },
    "vaga": {
     "nome": "Movimiento",
     "hint": "0 = se queda en el punto elegido; de 1 a 5 recorre el área sola, cada vez más rápido.",
     "ferma": "Quieta"
    },
    "schizzi": {
     "nome": "Salpicaduras",
     "hint": "Anillos de agua o rebotes donde las gotas tocan el suelo."
    },
    "lampi": {
     "nome": "Relámpagos",
     "hint": "Durante la lluvia también caen rayos (más a menudo con más intensidad)."
    },
    "sottoToken": {
     "nome": "Bajo los tokens",
     "hint": "El líquido se ve sobre el mapa pero bajo los tokens: quien vadea sigue visible."
    },
    "liquido": {
     "nome": "Líquido",
     "hint": "Tipo de líquido: fija el color y el aspecto. La lava, el ácido y la magia brillan y burbujean."
    },
    "specie": {
     "nome": "Tipo de tornado",
     "hint": "De aire, de agua, de fuego o mágico: fija el color y los escombros."
    },
    "suono": {
     "nome": "Sonido del trueno",
     "hint": "Archivo de audio que suena para todos poco después de cada relámpago (vacío = sin sonido)."
    },
    "punto": {
     "nome": "Centro",
     "hint": "Pulsa el botón y luego el mapa; o arrastra su asa."
    },
    "area": {
     "nome": "Área",
     "hint": "Dónde se ve el efecto: toda la escena o dentro de las Regiones marcadas. Las regiones «Sin efectos» lo quitan de todos modos.",
     "scena": "Toda la escena",
     "nessuna": "No hay regiones en la escena: dibuja una con las herramientas de Regiones para limitar el efecto."
    },
    "sfumatura": {
     "nome": "Borde suave",
     "hint": "Lo suave que es el borde del área y de las zonas sin efectos, en casillas."
    },
    "soloMaster": {
     "nome": "Solo para el DJ",
     "hint": "Solo lo ves tú: útil para prepararlo antes de mostrarlo a los jugadores."
    },
    "larghezza": {
     "nome": "Anchura",
     "hint": "Grosor de los rayos, en casillas."
    },
    "scintille": {
     "nome": "Chispas",
     "hint": "Cuántas chispas saltan del choque y de los impactos (0 = ninguna)."
    },
    "alMuro": {
     "nome": "Contra los muros",
     "hint": "Si hay un muro entre la fuente y el destino, el rayo se detiene allí o lo atraviesa.",
     "ferma": "Se detiene",
     "attraversa": "Atraviesa"
    },
    "lunghezzaMax": {
     "nome": "Longitud máxima",
     "hint": "0 = cuando una fuente se aleja el rayo siempre se alarga. Un número = más allá de esas casillas el rayo se corta y vuelve cuando las fuentes se acercan.",
     "caselle": "casillas: más allá se corta",
     "sempre": "siempre se alarga"
    },
    "pulsazione": {
     "nome": "Pulsación",
     "hint": "0 = luz fija; de 1 a 5 el resplandor respira cada vez más rápido.",
     "ferma": "Fija"
    },
    "larghezzaBagliore": {
     "nome": "Anchura",
     "hint": "Cuánto se extiende el resplandor alrededor del muro, en casillas."
    },
    "faville": {
     "nome": "Chispas",
     "hint": "Chispas que se desprenden de la pared."
    }
   },
   "Schede": {
    "effetti": "Efectos",
    "raggi": "Rayos",
    "muri": "Muros luminosos",
    "strumenti": "Herramientas"
   },
   "Pannello": {
    "titolo": "Super FX",
    "pulsante": "Super FX – Panel de efectos",
    "nessunaScena": "No hay ninguna escena abierta.",
    "aggiungi": "Añadir un efecto",
    "effettiScena": "Efectos de esta escena",
    "nessunEffetto": "No hay efectos. Pulsa un botón de arriba para añadir uno: aparece enseguida en el mapa.",
    "tuttiAccesi": "Encender todos",
    "tuttiSpenti": "Apagar todos",
    "accendi": "Encender",
    "spegni": "Apagar",
    "su": "Subir",
    "giu": "Bajar",
    "duplica": "Duplicar",
    "elimina": "Eliminar",
    "scegliPunto": "Elegir en el mapa",
    "lampoOra": "Rayo ahora",
    "sfoglia": "Explorar archivos"
   },
   "Raggi": {
    "spiega": "Selecciona dos o más tokens y pulsa «Choque entre los tokens seleccionados», o crea un grupo y añade tokens o puntos libres. Sin objetivo los rayos chocan entre sí; con un objetivo lo golpean. Cuando un token o un asa se mueven, los rayos se alargan o se cortan al instante.",
    "scontroSelezionati": "Choque entre los tokens seleccionados",
    "nuovo": "Nuevo grupo de rayos",
    "nessuno": "No hay grupos de rayos en esta escena.",
    "gruppo": "Rayos",
    "fonti": "Fuentes",
    "nessunaFonte": "Sin fuentes: añade tokens o puntos.",
    "aggiungiToken": "Añadir los tokens seleccionados",
    "aggiungiPunto": "Añadir un punto",
    "bersaglio": "Objetivo",
    "nessunBersaglio": "ninguno: los rayos chocan",
    "bersaglioToken": "Token apuntado",
    "bersaglioPunto": "Punto en el mapa",
    "bersaglioNessuno": "Ninguno (choque)",
    "punto": "Punto",
    "tokenSparito": "el token ya no está en la escena"
   },
   "Muri": {
    "spiega": "Elige el aspecto del resplandor, luego selecciona los muros en la capa de Muros (Mayús + clic para elegir varios) y pulsa «Aplicar».",
    "stato": "Muros luminosos en la escena: {luminosi}. Muros seleccionados: {sel}.",
    "applica": "Aplicar a los muros seleccionados",
    "togli": "Quitar de los seleccionados",
    "leggi": "Copiar del muro seleccionado",
    "seleziona": "Seleccionar los muros luminosos",
    "togliTutti": "Quitar todos los resplandores"
   },
   "Strumenti": {
    "zone": "Zonas sin efectos",
    "zoneSpiega": "Los efectos se quitan con las Regiones que tienen el comportamiento «Super FX – Sin efectos». «Máscara desde los muros» encuentra sola las habitaciones, edificios y cuevas cerrados por muros y crea la región «Super FX – Interiores». También puedes dibujar tú las regiones y añadir el comportamiento a las seleccionadas.",
    "mascheraMuri": "Máscara desde los muros",
    "esclusione": "«Sin efectos» en las regiones seleccionadas",
    "nomeInterni": "Super FX – Interiores",
    "maniglie": "Asas en el mapa",
    "maniglieSpiega": "Los puntos libres de los rayos y el centro de los tornados tienen un asa redonda que solo ves tú: arrástrala para moverlos (Mayús = al centro de la casilla).",
    "mostraManiglie": "Mostrar las asas",
    "nascondiManiglie": "Ocultar las asas",
    "preset": "Combinaciones listas",
    "presetSpiega": "Añaden a la escena varios efectos ya ajustados juntos. Después los cambias como quieras.",
    "atmosfera": "Atmósfera cinematográfica",
    "atmosferaSpiega": "Colores algo apagados, sombras más profundas y una oscuridad fría, con el ciclo día/noche activo. «Restaurar» devuelve los valores anteriores.",
    "applicaAtmosfera": "Aplicar a la escena",
    "ripristina": "Restaurar",
    "copia": "Copiar los efectos a otra escena",
    "copiaPulsante": "Copiar",
    "svuota": "Vaciar esta escena",
    "svuotaPulsante": "Quitar efectos y rayos"
   },
   "Preset": {
    "temporale": "Tormenta eléctrica",
    "pioggia": "Lluvia",
    "dallAlto": "Lluvia desde arriba",
    "nevicata": "Nevada",
    "bufera": "Ventisca",
    "grandinata": "Granizada",
    "sabbia": "Tormenta de arena",
    "palude": "Pantano brumoso",
    "autunno": "Bosque otoñal",
    "incendio": "Incendio",
    "cripta": "Cripta maldita",
    "magia": "Tormenta arcana",
    "vulcano": "Volcán"
   },
   "Domande": {
    "eliminaEffetto": "¿Eliminar el efecto «{nome}»?",
    "eliminaGruppo": "¿Eliminar el grupo de rayos «{nome}»?",
    "togliBagliori": "¿Quitar el resplandor de {n} muros?",
    "svuota": "¿Quitar todos los efectos y todos los rayos de la escena «{nome}»? Los muros luminosos se quedan."
   },
   "Avvisi": {
    "soloMaster": "Solo el DJ puede usar el panel de Super FX.",
    "cliccaMappa": "Haz clic en el mapa para elegir el punto (Esc o clic derecho para cancelar).",
    "scenaTroppoGrande": "La escena es demasiado grande para la máscara automática: dibuja las regiones a mano.",
    "nessunInterno": "No he encontrado espacios cerrados por muros en esta escena.",
    "selezionaRegioni": "Selecciona primero una o más regiones (capa de Regiones).",
    "esclusioniAggiunte": "Comportamiento «Sin efectos» añadido a {n} regiones.",
    "liquidoArea": "Consejo: dibuja una Región a lo largo del río, selecciónala y añade el líquido; o elige el área en el recuadro del efecto.",
    "dueToken": "Selecciona al menos dos tokens (o selecciona un token y apunta a otro con T).",
    "selezionaToken": "Selecciona primero uno o más tokens.",
    "prendiDiMira": "Apunta a un token (tecla T) y vuelve a intentarlo.",
    "selezionaMuri": "Selecciona primero uno o más muros (capa de Muros).",
    "nessunMuroLuminoso": "Ninguno de los muros seleccionados tiene resplandor.",
    "baglioreApplicato": "Resplandor aplicado a {n} muros.",
    "presetAggiunto": "Añadido: {nome}.",
    "atmosferaApplicata": "Atmósfera cinematográfica aplicada.",
    "atmosferaRipristinata": "Atmósfera anterior restaurada.",
    "nienteDaRipristinare": "No hay una atmósfera anterior que restaurar.",
    "effettiCopiati": "{n} efectos copiados a «{scena}»."
   },
   "Impostazioni": {
    "lingua": {
     "nome": "Idioma de Super FX",
     "hint": "Idioma de los textos de Super FX. «Automático» sigue el idioma de Foundry.",
     "auto": "Automático"
    },
    "attivo": {
     "nome": "Mostrar los efectos",
     "hint": "Desactívalo para no ver los efectos en este ordenador (los demás los siguen viendo)."
    },
    "qualita": {
     "nome": "Calidad de los efectos",
     "hint": "Cuántas partículas dibujar. Bájala si el ordenador va lento.",
     "alta": "Alta",
     "media": "Media",
     "bassa": "Baja"
    },
    "maniglie": {
     "nome": "Asas en el mapa",
     "hint": "Solo para el DJ: muestra las asas de los puntos de los rayos y de los tornados."
    },
    "tastoPannello": {
     "nome": "Abrir el panel de Super FX",
     "hint": "Abre el panel de efectos (solo DJ)."
    },
    "tastoAccendi": {
     "nome": "Encender / apagar los efectos",
     "hint": "Solo en este ordenador."
    }
   }
  }
 }
};
