// Level 7 — built from lore/ep07.md (00:00:00–00:01:17). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the man searching the yard and the yellow-eyed face are both Konon (he asks for wojtek).
// OCR fixes: "o cieplej już" (OCR `0`, same junk as in ep04/ep05). "odlezyna" is kept as the OCR has it [?]. Most subtitles are not visible
// on the sampled frames (lore marks them), so their timing follows the OCR.
const L = { pos: 'bottom', charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
export default {
  id: 'tasma1_ep07',
  tape: 1, index: 7, youtubeIndex: 7,
  title: 'Morowa 17 (ep07)',
  loreFile: 'lore/ep07.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'gdzie jest wojtek',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:08] the house at dusk, "idzie lato"
    { caption: { text: 'TAŚMA 1 · ODC. 07', pos: 'top' } },
    { at: 2, line: { text: 'idzie lato', speaker: 'konon', ...L } },
    { at: 4, camera: 'plot' },
    { at: 6, line: { text: 'o cieplej już', speaker: 'konon', ...L } },

    // [00:00:09–00:00:28] the back yard: the welded pig-shed, the storeroom with barrels
    { at: 9, location: 'ogrod', camera: 'brama' },
    place('konon', 0.1, -1.4),
    { beat: { id: 'ogrod', actors: ['konon'], need: 4 } },
    { at: 11, line: { text: 'gdzie jest odlezyna', speaker: 'konon', ...L } },
    { at: 15, line: { text: 'chlewik zaspawany', speaker: 'konon', ...L } },
    { at: 19, camera: 'schowek' },
    place('konon', 0.9, -2.6),
    { line: { text: 'może tu', speaker: 'konon', ...L } },
    { at: 25, line: { text: 'czegoś takiego na pewno tu nie ma', speaker: 'konon', ...L } },
    { at: 28, beatEnd: 'ogrod' },

    // [00:00:28–00:00:48] the bushes: "jakaś klapa"
    { at: 28, camera: 'brama' },
    place('konon', 1.6, 0.4),
    { at: 32, line: { text: 'słysze cie', speaker: 'konon', ...L } }, { sfx: 'creak' },
    { at: 34, camera: 'krzaki' },
    place('konon', 0.2, 2.4),
    { beat: { id: 'klapa', actors: [], need: 5 } },
    { at: 36, line: { text: 'jakaś klapa', speaker: 'konon', ...L } },
    { at: 42, sfx: 'knock' }, { madness: 0.1 },
    { at: 48, beatEnd: 'klapa' },
    { show: { id: 'konon', on: false } },
    { at: 49, black: 1500 }, // black frame

    // [00:00:51] the house in rain-green, then the yellow-eyed face under the tiles
    { at: 51, location: 'podworko', camera: 'front' },
    { at: 55, location: 'lazienka', camera: 'twarz' },
    place('konon', -1.0, -0.5),
    { beat: { id: 'twarz', actors: ['konon'], need: 4 } },
    { at: 58, line: { text: 'gdzie jest wojtek', speaker: 'konon', pos: 'bottom', charInterval: 100 } },
    { at: 60, line: { text: 'boje sie burzy', speaker: 'konon', pos: { x: 40, y: 90 }, charInterval: 100 } },
    { glitch: 0.7 }, { madness: 0.1 },
    { at: 63, beatEnd: 'twarz' },
    { show: { id: 'konon', on: false } },

    // [00:01:06–00:01:17] the distorted family portrait, then the face again from below
    { at: 66, location: 'strych', camera: 'portret' },
    { beat: { id: 'portret', actors: [], need: 4 } },
    { at: 70, glitch: 0.9 }, { sfx: 'creak' }, { madness: 0.15 },
    { at: 75, beatEnd: 'portret' },
    { at: 75, location: 'lazienka', camera: 'twarz' },
    place('konon', -1.0, -0.5),
    { glitch: 1 },
    { at: 77, black: 1800 },
  ],
};
