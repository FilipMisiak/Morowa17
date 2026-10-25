// Level 14 — "Urodziny" (working title), built from lore/ep14.md (00:00:00–00:01:40). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the man in the yellow-cream jacket (`zolty`) hosts the party and says "urodziny są jego"; Konon asks to wake Wojtek; Wojtek (= Major) lies on the sofa with a green bottle.
// OCR captions run 3–4 s ahead of the frames in the lore ("nie tutaj", "sam musze", "wypij wojtek"): the times below are the frame times. "7 urodziny", "ciągle spi", "lepi" stay without diacritics [?].
// "urodziny są jego" is read from frame 01:02 (not in the OCR). The pale face of 00:13–00:20 is `chudy`; the red-eyed face of 01:09 and 01:34 is `czerwonooki`.
const L = { pos: 'bottom', charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
export default {
  id: 'tasma2_ep04',
  tape: 2, index: 4, youtubeIndex: 14,
  title: 'Urodziny',
  loreFile: 'lore/ep14.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'sto lat wojtek',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:25] the house at night, the window, the pale face, solarised flashes
    { caption: { text: 'TAŚMA 2 · ODC. 14', pos: 'top' } }, { tint: 1 },
    { at: 3, line: { text: '7 urodziny', speaker: 'tasma', ...L } },
    { at: 4, location: 'chata', camera: 'window' }, { tint: 0 }, place('konon', 1.4, 0.4),
    { beat: { id: 'okno', actors: ['konon'], need: 5 } },
    { at: 9, glitch: 0.4 },
    { at: 11, beatEnd: 'okno' }, ...hide('konon'),
    { at: 13, location: 'lazienka', camera: 'twarz' }, place('chudy', -1.0, -0.5),
    { beat: { id: 'twarz', actors: ['chudy'], need: 4 } },
    { at: 16, glitch: 1 }, { madness: 0.1 },
    { at: 18, glitch: 0.9 },
    { at: 20, glitch: 1 },
    { at: 21, beatEnd: 'twarz' }, ...hide('chudy'),
    { at: 22, black: 2500 },

    // [00:00:25–00:01:02] the party: the table with bottles and paper hats
    { at: 25, location: 'podworko', camera: 'front' },
    { at: 27, location: 'strych', camera: 'stol' }, place('zolty', 1.3, 0.1),
    { beat: { id: 'przyjecie', actors: ['zolty', 'konon'], need: 8 } },
    { at: 35, line: { text: 'ciągle spi', speaker: 'zolty', ...L } },
    { at: 42, line: { text: 'wojtek', speaker: 'konon', ...L } },
    { at: 45, place: { id: 'konon', x: 0.4, z: 0.5, face: 0 } },
    { at: 51, location: 'podworko', camera: 'front' },
    { at: 54, location: 'strych', camera: 'stol' },
    { at: 56, place: { id: 'konon', x: 0.4, z: 0.5, face: 0 } },
    { at: 61, line: { text: 'obudzisz go pan?', speaker: 'konon', ...L } },
    { at: 62, line: { text: 'urodziny są jego', speaker: 'zolty', pos: { x: 25, y: 50 }, charInterval: 100 } },
    { at: 64, beatEnd: 'przyjecie' }, ...hide('zolty', 'konon'),

    // [00:01:05–00:01:15] the dark face with red eyes, burnt black-and-white frame
    { at: 65, location: 'lazienka', camera: 'twarz' }, place('czerwonooki', -1.0, -0.5),
    { glitch: 0.6 },
    { at: 67, glitch: 1 },
    { at: 69, line: { text: 'nie tutaj', speaker: 'czerwonooki', ...L } }, { madness: 0.15 },
    { at: 72, glitch: 0.7 }, ...hide('czerwonooki'),

    // [00:01:16–00:01:23] Wojtek on the sofa
    { at: 76, location: 'chata', camera: 'kanapa' },
    { place: { id: 'major', x: 0.4, z: 1.55, face: 0, y: -0.3 } }, { lie: { id: 'major' } },
    { beat: { id: 'kanapa', actors: ['major'], need: 5 } },
    { line: { text: 'sam musze', speaker: 'major', ...L } },
    { at: 78, line: { text: 'wypij wojtek', speaker: 'konon', ...L } },
    { at: 80, glitch: 0.3 },
    { at: 83, beatEnd: 'kanapa' }, ...hide('major'),

    // [00:01:28–00:01:40] the pot, "lepi", red eyes, "sto lat wojtek"
    { at: 88, camera: 'stove' }, place('konon', 1.4, -0.9),
    { beat: { id: 'garnek', actors: ['konon'], need: 4 } },
    { at: 92, line: { text: 'lepi', speaker: 'konon', ...L } },
    { at: 94, location: 'lazienka', camera: 'twarz' }, ...hide('konon'), place('czerwonooki', -1.0, -0.5),
    { glitch: 0.9 }, { madness: 0.1 },
    { at: 96, beatEnd: 'garnek' },
    { at: 97, line: { text: 'sto lat wojtek', speaker: 'konon', ...L } },
    { at: 99, line: { text: 'sto lat wojtek', speaker: 'czerwonooki', ...L } },
    { at: 102, black: 1500 }, ...hide('czerwonooki'),
  ],
};
