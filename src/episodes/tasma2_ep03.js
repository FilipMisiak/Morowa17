// Level 13 — (00:00:00–00:02:30). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the masked red-eyed one (`czerwonooki`) demands food and calls Konon "krzysiu"; the plaid-sleeve man who asks "dlaczego ty sie nie podzielisz" is Konon; the bench pair is `rudy` (cap) and `okularnik` (shades).
// The two mirrored lines of 00:06 / 00:08 are OCR-only [?]: the OCR gave them reversed, here they are reversed back (exact letter reversal). "o kabab" and "wyjme" follow the transcript (no frame for "wyjme").
const L = { pos: 'bottom', charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
const MASK = [0.2, -0.8];
export default {
  id: 'tasma2_ep03',
  tape: 2, index: 3, youtubeIndex: 13,
  title: 'Morowa 17 (ep13)',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'zrób coś do jedzenia dla mnie',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:45] the house, the masked one at the table
    { caption: { text: 'TAŚMA 2 · ODC. 13', pos: 'top' } },
    { at: 2, line: { text: 'smacznego krzysiu', speaker: 'czerwonooki', ...L } },
    { at: 4, location: 'chata', camera: 'door' }, place('czerwonooki', ...MASK),
    { beat: { id: 'maska', actors: ['czerwonooki'], need: 8 } },
    { at: 6, caption: { text: 'gdzie był ten chłopiec', pos: 'center' } }, { glitch: 0.6 },
    { at: 8, caption: { text: 'i co sie z nim działo', pos: 'center' } },
    { at: 11, line: { text: 'niepokój nastał w domu bożym', speaker: 'czerwonooki', ...L } },
    { at: 15, line: { text: 'kryje sie w cieniu i patrzy', speaker: 'czerwonooki', ...L } },
    { at: 19, line: { text: 'ale czuć że on nadchodzi', speaker: 'czerwonooki', ...L } }, { madness: 0.1 },
    { at: 21, line: { text: 'o kabab', speaker: 'czerwonooki', pos: { x: 80, y: 85 }, charInterval: 100 } },
    { at: 26, camera: 'window' }, place('konon', 1.4, 0.4),
    { line: { text: 'dlaczego ty sie nie podzielisz', speaker: 'konon', pos: { x: 22, y: 90 }, charInterval: 100 } },
    { at: 30, camera: 'desk' },
    { at: 34, line: { text: 'zrób coś do jedzenia dla mnie', speaker: 'czerwonooki', ...L } },
    { at: 38, glitch: 0.8 },
    { at: 40, beatEnd: 'maska' }, ...hide('czerwonooki', 'konon'),
    { at: 41, camera: 'window' }, place('konon', 1.4, 0.4),
    { at: 45, location: 'podworko', camera: 'front' }, { tint: 1 }, ...hide('konon'),
    { at: 58, camera: 'plot' }, { tint: 0 },

    // [00:01:08–00:01:25] the yard with the pool: "będziesz patrzył jak jem"
    { at: 68, location: 'basen', camera: 'ganek' }, place('szorty', -0.6, -2.4),
    { beat: { id: 'basen', actors: ['szorty', 'konon'], need: 7 } },
    { at: 71, camera: 'basen' }, ...hide('szorty'), place('konon', -0.3, 0.9), place('czerwonooki', 1.0, 0.2),
    { at: 73, line: { text: 'zrobisz jedzenie dla mnie', speaker: 'czerwonooki', ...L } },
    { at: 76, line: { text: 'zrozumiano?', speaker: 'czerwonooki', ...L } },
    { at: 79, camera: 'pienek' },
    { at: 81, line: { text: 'i będziesz patrzył jak jem', speaker: 'czerwonooki', pos: { x: 25, y: 10 }, charInterval: 100 } },
    { at: 84, beatEnd: 'basen' }, ...hide('konon', 'czerwonooki'),
    { at: 85, location: 'podworko', camera: 'front' },

    // [00:01:27–00:02:00] the food in the dark, the kitchen stove, the mask leaning in
    { at: 87, location: 'chata', camera: 'door' }, place('konon', -0.1, 0.4),
    { beat: { id: 'kuchnia', actors: ['konon', 'czerwonooki'], need: 8 } },
    { at: 93, camera: 'stove' }, { line: { text: 'pysznie wygląda', speaker: 'konon', ...L } },
    { at: 99, glitch: 0.5 },
    { at: 102, camera: 'stove' }, place('konon', 1.4, -0.9),
    { at: 110, camera: 'stove' },
    { at: 113, camera: 'door' }, ...hide('konon'), place('czerwonooki', ...MASK),
    { at: 116, glitch: 0.7 }, { madness: 0.15 },
    { at: 119, camera: 'stove' }, place('czerwonooki', 1.3, -0.5),
    { at: 121, beatEnd: 'kuchnia' }, ...hide('czerwonooki'),

    // [00:02:04–00:02:30] the house, the bench by the yellow wall
    { at: 124, location: 'podworko', camera: 'front' },
    { at: 127, location: 'lawa', camera: 'lawa' }, place('rudy', -0.45, -1.0), place('okularnik', 0.45, -1.0),
    { beat: { id: 'lawa', actors: ['rudy', 'okularnik'], need: 8 } },
    { at: 132, line: { text: 'będzie nagroda za to', speaker: 'okularnik', ...L } },
    { at: 136, line: { text: 'dziś ciebie wyjme', speaker: 'okularnik', ...L } },
    { at: 140, line: { text: 'a potem', speaker: 'okularnik', ...L } },
    { at: 141, camera: 'blizej' },
    { at: 147, beatEnd: 'lawa' },
    { at: 150, black: 2500 },
  ],
};
