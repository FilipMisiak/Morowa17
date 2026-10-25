// Level 17 — "Poeta", built from lore/ep17.md (00:00:00–00:02:06). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the poet (`poeta`) reads the poem and says goodbye ("Liczę, że mi wybaczysz", "Bywaj druhu"); "piękny dom" and "jesteś czym pan" are OCR-only lines (no frame) given to the yellow-eyed face.
// The poem is read from frame 00:28 (top left, italic): two full lines and the cut "A k" — the OCR reading "A kamrat p(" is not confirmed, so only "A k" is shown. "niczym nie wzruszy" corrects an OCR join.
// Not reproduced: the unreadable yellow writing on the forehead (00:35) and the sign "CURN…". The post-poem montage has no captions; the burning man on the stairs is shown only as a glitch + orange flash.
const L = { pos: 'bottom', charInterval: 100 };
const POEM = { pos: { x: 12, y: 12 }, color: '#c8c898', charInterval: 90 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
export default {
  id: 'tasma2_ep07',
  tape: 2, index: 7, youtubeIndex: 17,
  title: 'Poeta',
  loreFile: 'lore/ep17.md',
  status: 'wip',
  location: 'festyn',
  startCamera: 'domek',
  letter: 'Po krzykach płomienie wzejdą gorliwie',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:15] the night yard with the fair, the title, two OCR-only lines
    { caption: { text: 'TAŚMA 2 · ODC. 17', pos: 'top' } },
    { at: 3, caption: { text: 'poeta', pos: 'bottom' } },
    { at: 5, location: 'lazienka', camera: 'twarz' }, place('zoltooki', -1.0, -0.5),
    { at: 7, line: { text: 'piękny dom', speaker: 'zoltooki', ...L } },
    { at: 14, line: { text: 'jesteś czym pan', speaker: 'zoltooki', ...L } }, ...hide('zoltooki'),

    // [00:00:16–00:00:54] the poet in the barred window, the poem, the goodbye
    { at: 16, location: 'poeta', camera: 'okno' }, place('poeta', 0.5, -1.0),
    { beat: { id: 'wiersz', actors: ['poeta'], need: 10 } },
    { at: 28, caption: { text: 'Po krzykach płomienie wzejdą gorliwie.', ...POEM, pos: { x: 12, y: 12 }, hold: 8000 } },
    { at: 31, caption: { text: 'Lodowa aura niczym nie wzruszy.', ...POEM, pos: { x: 12, y: 19 }, hold: 6000 } },
    { at: 34, caption: { text: 'A k', ...POEM, pos: { x: 12, y: 26 }, hold: 3000 } },
    { at: 35, location: 'lazienka', camera: 'twarz' }, place('chudy', -1.0, -0.5), { glitch: 0.6 },
    { at: 40, glitch: 0.4 },
    { at: 47, location: 'poeta', camera: 'okno' }, ...hide('chudy'),
    { at: 50, line: { text: 'Liczę, że mi wybaczysz', speaker: 'poeta', pos: { x: 68, y: 90 }, charInterval: 100 } },
    { at: 52, line: { text: 'Bywaj druhu', speaker: 'poeta', pos: { x: 58, y: 90 }, charInterval: 100 } },
    { at: 54, beatEnd: 'wiersz' }, ...hide('poeta'),
    { at: 55, black: 8000 },

    // [00:01:05–00:01:22] the face in the dark, the kitchen, the house in black and white
    { at: 65, location: 'lazienka', camera: 'twarz' }, place('chudy', -1.0, -0.5),
    { beat: { id: 'twarz', actors: ['chudy'], need: 5 } },
    { at: 67, glitch: 0.7 }, { madness: 0.1 },
    { at: 70, glitch: 0.5 },
    { at: 75, beatEnd: 'twarz' }, ...hide('chudy'),
    { at: 77, location: 'chata', camera: 'stove' },
    { at: 79, location: 'podworko', camera: 'front' }, { tint: 1 },
    { at: 82, location: 'lazienka', camera: 'twarz' }, place('chudy', -1.0, -0.5), { tint: 0 }, { glitch: 0.9 },
    { at: 85, show: { id: 'chudy', on: false } },

    // [00:01:26–00:01:35] the stairs with smoke and fire
    { at: 86, location: 'piwnica', camera: 'schody' }, place('brazowy', 0.9, 0.9),
    { beat: { id: 'ogien', actors: ['brazowy'], need: 5 } },
    { at: 89, glitch: 0.8 }, { sfx: 'creak' },
    { at: 91, glitch: 1 }, { madness: 0.15 },
    { at: 92, beatEnd: 'ogien' }, ...hide('brazowy'),
    { at: 93, location: 'lazienka', camera: 'twarz' }, place('chudy', -1.0, -0.5), { glitch: 0.7 },

    // [00:01:38–00:01:51] the red velvet room, the zebra sofa, the cigarette
    { at: 98, location: 'poeta', camera: 'zaslony' }, ...hide('chudy'), place('czerwona', 6.0, -0.3),
    { beat: { id: 'zaslony', actors: ['czerwona'], need: 6 } },
    { at: 102, glitch: 0.4 },
    { at: 105, camera: 'zaslony' },
    { at: 107, beatEnd: 'zaslony' }, ...hide('czerwona'),
    { at: 109, location: 'strych', camera: 'sofa' }, place('konon', 0.3, -0.6),
    { beat: { id: 'sofa', actors: ['konon'], need: 4 } },
    { at: 112, glitch: 0.5 },
    { at: 114, beatEnd: 'sofa' }, ...hide('konon'),

    // [00:01:55–00:02:06] the grinning head, the coat, the scream
    { at: 115, location: 'poeta', camera: 'kuchnia' },
    { beat: { id: 'glowa', actors: [], need: 4 } },
    { at: 117, glitch: 0.8 }, { madness: 0.1 },
    { at: 119, location: 'poeta', camera: 'zaslony' }, { beatEnd: 'glowa' },
    { at: 122, location: 'lazienka', camera: 'twarz' }, place('chudy', -1.0, -0.5), { glitch: 1 },
    { at: 126, show: { id: 'chudy', on: false } },
    { at: 128, black: 2000 },
  ],
};
