// Level 18 — "chata czarna", built from lore/ep18.md (00:00:00–00:02:43). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the plaid man (heavy, bald-ish) is Konon; the hooded `czerwonooki` says "i zazwyczaj" / "kawka tego tu"; the uniform man (`mundur`) says "nie w ten sposób"; the fair man in the T-shirt (`blondyn`) says "trzeba zaglądać"; Konon in the patterned sweater says "wracajmy wojtek" / "w domku być najlepiej" in the forest.
// "nie w ten sposób", "i zazwyczaj" (OCR had "zazwyczaj") and "trzeba zaglądać" are read from frames. Not reproduced: the mirrored "…RZĄDEK" poster in the plaid-table room, the logo "C" on the parcel, the laptop's "ASINOT?".
const L = { pos: 'bottom', charInterval: 100 };
const YG = { pos: { x: 72, y: 90 }, color: '#c8d070', charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
export default {
  id: 'tasma2_ep08',
  tape: 2, index: 8, youtubeIndex: 18,
  title: 'chata czarna',
  loreFile: 'lore/ep18.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'w domku być najlepiej',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:57] the black-and-white house, the parcel on the plaid tablecloth, the man at the window
    { caption: { text: 'TAŚMA 2 · ODC. 18', pos: 'top' } }, { tint: 1 },
    { at: 2, caption: { text: 'chata czarna', pos: 'bottom' } },
    { at: 5, location: 'chata', camera: 'desk' }, place('konon', -1.2, -0.9),
    { beat: { id: 'pakunek', actors: ['konon'], need: 7 } },
    { at: 12, camera: 'zbliz' },
    { at: 19, camera: 'desk' },
    { at: 21, camera: 'window' }, ...hide('konon'), place('szarak', 1.4, 0.4),
    { at: 25, camera: 'zbliz' },
    { at: 30, camera: 'desk' }, place('konon', -1.2, -0.9), ...hide('szarak'),
    { at: 37, camera: 'zbliz' },
    { at: 44, camera: 'window' }, ...hide('konon'), place('szarak', 1.4, 0.4),
    { at: 49, glitch: 0.7 },
    { at: 52, glitch: 1 }, { madness: 0.1 },
    { at: 55, beatEnd: 'pakunek' },
    { at: 57, black: 2000 }, { tint: 0 }, ...hide('szarak'),

    // [00:01:03–00:01:20] the day: the blue gate, the cyclist, the handshake, the night street
    { at: 63, location: 'brama', camera: 'brama' }, place('dres', -0.3, 3.2),
    { beat: { id: 'brama', actors: ['dres', 'mundur'], need: 8 } },
    { at: 66, camera: 'ulica' },
    { at: 71, camera: 'brama' }, place('mundur', 0.7, 3.2),
    { at: 73, glitch: 0.3 },
    { at: 77, tint: 1 }, { line: { text: 'nie w ten sposób', speaker: 'mundur', pos: { x: 45, y: 90 }, color: '#f0f0f0', charInterval: 100 } },
    { at: 79, beatEnd: 'brama' }, ...hide('dres', 'mundur'), { tint: 0 },
    { at: 80, location: 'lazienka', camera: 'twarz' }, place('zoltooki', -1.0, -0.5), { glitch: 0.8 },

    // [00:01:26–00:01:46] the red room: the hooded one and the bald bearded man at a laptop
    { at: 86, location: 'poeta', camera: 'czerwony' }, ...hide('zoltooki'), place('konon', 17.0, -0.4),
    { at: 91, ...place('czerwonooki', 17.2, -0.5) }, ...hide('konon'), place('brodacz', 18.7, -0.3),
    { beat: { id: 'czerwony', actors: ['czerwonooki', 'brodacz'], need: 7 } },
    { at: 92, line: { text: 'i zazwyczaj', speaker: 'czerwonooki', ...YG } },
    { at: 96, line: { text: 'kawka tego tu', speaker: 'czerwonooki', ...YG } },
    { at: 100, line: { text: 'na noc jutrzejszą', speaker: 'czerwonooki', ...L } },
    { at: 106, camera: 'czerwony' },
    { at: 109, beatEnd: 'czerwony' }, ...hide('czerwonooki', 'brodacz'),

    // [00:01:49–00:01:57] the brick wall, the burnt ghost, the smiling mask
    { at: 109, location: 'piwnica', camera: 'korytarz' }, place('dres', -0.5, 0.3), { glitch: 1 },
    { at: 113, glitch: 0.9 }, { madness: 0.1 },
    { at: 117, ...hide('dres') },

    // [00:02:00–00:02:08] the garden with the sheet: "trzeba zaglądać"
    { at: 120, location: 'grill', camera: 'pranie' }, place('konon', -2.2, -1.2), place('blondyn', -1.4, -0.8), { tint: 1 },
    { beat: { id: 'ogrod', actors: ['blondyn', 'konon'], need: 5 } },
    { at: 128, line: { text: 'trzeba zaglądać', speaker: 'blondyn', pos: { x: 62, y: 90 }, color: '#f0f0f0', charInterval: 100 } },
    { at: 130, beatEnd: 'ogrod' }, ...hide('konon', 'blondyn'), { tint: 0 },

    // [00:02:10–00:02:43] the forest: the shadow in the tracksuit with red eyes
    { at: 130, location: 'las', camera: 'kloda' }, place('konon', 0.0, 0.2),
    { beat: { id: 'las', actors: ['konon', 'cien'], need: 8 } },
    { at: 138, camera: 'polana' }, place('cien', 0.6, -0.5), { glitch: 0.6 }, { madness: 0.15 },
    { at: 145, camera: 'kloda' },
    { at: 153, line: { text: 'wracajmy wojtek', speaker: 'konon', ...L } },
    { at: 157, line: { text: 'w domku być najlepiej', speaker: 'konon', ...L } },
    { at: 158, camera: 'polana' }, { glitch: 0.8 },
    { at: 161, glitch: 1 },
    { at: 163, beatEnd: 'las' }, ...hide('cien', 'konon'),
    { at: 164, black: 2500 },
  ],
};
