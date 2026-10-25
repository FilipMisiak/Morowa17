// Level 15 — built from lore/ep15.md (00:00:00–00:02:30). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the man in the hi-vis vest (`kamizelka`) reads the letter "od mexykana"; the man in the doorway with the bundle (`kwiat`) says he is leaving and what to guard; the plaid man with yellow eyes is `zoltooki`.
// None of the OCR-only lines was visible on a frame (position unknown): all are shown at the bottom. Cut words "gro", "obie", "całeś" and "[kolor?] ciałem" are kept as the OCR has them [?].
// "prośba" follows frame 00:48 (a title card at the bottom, in quotation marks in the OCR). The letter text itself is unreadable on every frame — the game's own letter is the 12 caption steps.
const L = { pos: 'bottom', charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
export default {
  id: 'tasma2_ep05',
  tape: 2, index: 5, youtubeIndex: 15,
  title: 'Morowa 17 (ep15)',
  loreFile: 'lore/ep15.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'otrzymałem pismo od mexykana',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:46] the house at dusk, the plaid man with yellow eyes
    { caption: { text: 'TAŚMA 2 · ODC. 15', pos: 'top' } },
    { at: 5, location: 'chata', camera: 'window' },
    { at: 10, location: 'strych', camera: 'sofa' }, place('zoltooki', 0.3, 0.1),
    { beat: { id: 'zolte', actors: ['zoltooki'], need: 8 } },
    { at: 15, line: { text: 'pierwsze chłody', speaker: 'zoltooki', ...L } },
    { at: 23, line: { text: 'czym sie ogrzeje', speaker: 'zoltooki', ...L } },
    { at: 27, line: { text: 'gdy ciebie nie ma', speaker: 'zoltooki', ...L } }, { glitch: 0.5 },
    { at: 32, camera: 'sofa' },
    { at: 42, line: { text: '[kolor?] ciałem', speaker: 'zoltooki', pos: { x: 20, y: 35 }, charInterval: 100 } }, { madness: 0.1 },
    { at: 44, beatEnd: 'zolte' }, ...hide('zoltooki'),
    { at: 46, black: 1500 },

    // [00:00:48–00:01:22] "prośba", the shelter, the letter from the Mexican
    { at: 48, location: 'podworko', camera: 'front' }, { caption: { text: '"prośba"', pos: 'bottom' } },
    { at: 50, location: 'wiata', camera: 'wiata' }, place('kamizelka', 0.0, 0.6),
    { beat: { id: 'pismo', actors: ['kamizelka'], need: 8 } },
    { at: 53, line: { text: 'otrzymałem pismo', speaker: 'kamizelka', ...L } },
    { at: 57, line: { text: 'od mexykana', speaker: 'kamizelka', ...L } },
    { at: 59, camera: 'stol' },
    { at: 63, line: { text: 'gro', speaker: 'kamizelka', ...L } },
    { at: 66, line: { text: 'obie', speaker: 'kamizelka', ...L } },
    { at: 69, line: { text: 'całeś', speaker: 'kamizelka', ...L } },
    { at: 71, camera: 'wrak' }, place('czerwonooki', 2.0, 0.3), { glitch: 0.8 }, { madness: 0.15 },
    { at: 77, camera: 'stol' }, ...hide('czerwonooki'),
    { at: 79, beatEnd: 'pismo' },
    { at: 82, location: 'podworko', camera: 'front' }, ...hide('kamizelka'),

    // [00:01:24–00:01:50] the man in the doorway with a bundle, the keys, two portraits
    { at: 84, location: 'chata', camera: 'drzwi' }, place('kwiat', 2.0, 1.1),
    { beat: { id: 'drzwi', actors: ['kwiat'], need: 7 } },
    { at: 86, line: { text: 'wychodzić będę', speaker: 'kwiat', ...L } },
    { at: 90, line: { text: 'domu pilnuj', speaker: 'kwiat', ...L } },
    { at: 94, line: { text: 'oni widzą', speaker: 'kwiat', ...L } },
    { at: 96, line: { text: 'oni widzą', speaker: 'kwiat', ...L } },
    { at: 99, camera: 'door' }, ...hide('kwiat'),
    { at: 100, line: { text: 'tu klucz chowam', speaker: 'kwiat', ...L } },
    { at: 103, camera: 'drzwi' }, place('kwiat', 2.0, 1.1),
    { at: 105, line: { text: 'zrozumiane?', speaker: 'kwiat', ...L } },
    { at: 107, beatEnd: 'drzwi' }, ...hide('kwiat'),
    { at: 108, location: 'strych', camera: 'portret' }, place('zoltooki', 1.0, -0.2), place('czerwonooki', 1.6, -0.4),
    { beat: { id: 'portrety', actors: ['zoltooki', 'czerwonooki'], need: 4 } },
    { at: 111, line: { text: 'bądź dobry dla jego', speaker: 'kwiat', ...L } }, { glitch: 0.7 },
    { at: 113, beatEnd: 'portrety' }, ...hide('zoltooki', 'czerwonooki'),

    // [00:01:54–00:02:30] the silhouette at the window, the night yard, the hall
    { at: 114, location: 'chata', camera: 'window' }, { tint: 1 }, { show: { id: 'shade', on: true } },
    { place: { id: 'shade', x: 2.4, z: 0.4, face: 0 } },
    { beat: { id: 'cien', actors: ['shade'], need: 6 } },
    { at: 117, glitch: 0.8 }, { madness: 0.1 },
    { at: 121, glitch: 0.6 },
    { at: 123, beatEnd: 'cien' }, ...hide('shade'),
    { at: 126, location: 'hala', camera: 'wieza' },
    { at: 146, camera: 'hala' }, { tint: 0 },
    { at: 150, black: 2000 },
  ],
};
