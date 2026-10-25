// Level 8 — (00:00:00–00:02:40). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: Konon and Major talk, the man in the yellow jacket at the door is `zolty`; most subtitles were not on sampled frames.
// OCR/frame fixes: "strych" at 00:35 (the frame shows it, OCR had "żyje"), "odleżyne widziałem" and "spierdoliła" (frames). Kept as in the lore [?]:
// "dó domku", "kłodko", "gratuluje panulza to", "sie nadajeci"; "aw drugiej" is written "w drugiej" (leading `a` looks like OCR junk).
const L = { pos: 'bottom', charInterval: 100 };
const TOP = { pos: { x: 75, y: 12 }, charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
export default {
  id: 'tasma1_ep08',
  tape: 1, index: 8, youtubeIndex: 8,
  title: 'Morowa 17 (ep08)',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'trzeba wracać prędko do domku',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:09] the house, the forest
    { caption: { text: 'TAŚMA 1 · ODC. 08', pos: 'top' } },
    { at: 2, caption: { text: '"polowanie"', pos: 'center' } },   // OCR: `71 'polowanie"` — prefix is junk
    { at: 4, location: 'las', camera: 'kloda' },
    { at: 7, camera: 'rama' },    // frame 00:07: an empty frame lying on the leaves
    { at: 9, camera: 'polana' },

    // [00:00:10–00:00:22] the window with the red glow
    { at: 10, location: 'chata', camera: 'window' },
    place('konon', 1.4, 0.4),
    { beat: { id: 'okno', actors: ['konon'], need: 5 } },
    { at: 11, line: { text: 'trzeba uciekać', speaker: 'konon', ...L } },
    { at: 15, line: { text: 'przeklęty dom', speaker: 'konon', ...L } },
    { at: 19, line: { text: 'gdzie jest trawnik', speaker: 'konon', ...L } },
    { at: 22, line: { text: 'nikt nie wyjdzie z domu', speaker: 'konon', ...L } },
    { at: 23, beatEnd: 'okno' },
    ...hide('konon'),

    // [00:00:23–00:00:38] the tiles: "pomóż mnie"
    { at: 23, location: 'lazienka', camera: 'izba' },
    place('major', -1.0, -0.5),
    { beat: { id: 'kafle', actors: ['major'], need: 5 } },
    { at: 27, line: { text: 'pomóż mnie', speaker: 'major', ...L } },
    { at: 30, line: { text: 'przyjacielu', speaker: 'major', ...L } },
    { at: 35, line: { text: 'strych', speaker: 'major', ...L } }, { glitch: 0.8 }, { madness: 0.1 },
    { at: 36, beatEnd: 'kafle' },
    ...hide('major'),
    { at: 37, location: 'chata', camera: 'window' }, { glitch: 0.5 },

    // [00:00:39–00:00:57] the reserve sign, the log: "do widzenia kłodko"
    { at: 39, location: 'las', camera: 'znak' },
    place('konon', 0.7, -0.3),
    { beat: { id: 'las', actors: ['konon'], need: 5 } },
    { at: 45, line: { text: 'skończyło się', speaker: 'konon', ...L } },
    { at: 48, line: { text: 'trzeba wracać do domku', speaker: 'konon', ...L } },
    { at: 51, camera: 'kloda' },
    { at: 52, line: { text: 'do widzenia kłodko', speaker: 'konon', ...L } },
    { at: 55, line: { text: 'do widzenia przyjacielu', speaker: 'konon', ...L } },
    { at: 56, beatEnd: 'las' },

    // [00:00:57–00:01:16] walking back through the forest
    { at: 57, camera: 'polana' },
    { walk: { id: 'konon', x: -1.2, z: -2.5, secs: 12 } },
    { at: 66, line: { text: 'trzeba wracać prędko dó domku', speaker: 'konon', ...L } },
    { at: 69, line: { text: 'zanim sie ściemni', speaker: 'konon', ...L } },
    { at: 73, line: { text: 'trzeba coś sprawdzić', speaker: 'konon', ...L } },
    ...hide('konon'),

    // [00:01:17–00:02:01] the house at dusk, the attic: "pusto", "nikogo nie ma"
    { at: 77, location: 'podworko', camera: 'front' },
    { at: 81, location: 'poddasze', camera: 'ogolny' },
    place('konon', -0.2, 0.2),
    { beat: { id: 'strych', actors: ['konon'], need: 6 } },
    { at: 91, camera: 'ubrania' },
    { at: 101, camera: 'skrzynia' },
    { at: 98, line: { text: 'trzeba otworzyć i sprawdzić', speaker: 'konon', ...L } },
    { at: 107, line: { text: 'pusto', speaker: 'konon', ...L } }, { sfx: 'creak' },
    { at: 111, line: { text: 'w drugiej', speaker: 'konon', ...L } },
    { at: 116, line: { text: 'nikogo nie ma', speaker: 'konon', ...L } },
    { at: 120, line: { text: 'ściemnia sie', speaker: 'konon', ...L } },
    { at: 121, beatEnd: 'strych' },
    ...hide('konon'),

    // [00:02:02–00:02:25] someone at the door: the yellow jacket, "bierz pan broń"
    { at: 122, location: 'chata', camera: 'door' },
    place('konon', -0.9, -0.6), place('zolty', 0.9, 0.6),
    { beat: { id: 'drzwi', actors: ['konon', 'zolty'], need: 5 } },
    { line: { text: 'słucham', speaker: 'konon', ...L } },
    { at: 124, line: { text: 'ktoś przyszedł', speaker: 'konon', ...TOP } }, { sfx: 'knock' },
    { at: 129, line: { text: 'wpuść', speaker: 'konon', ...L } },
    { at: 132, line: { text: 'kurwa ja pierdole', speaker: 'zolty', pos: { x: 58, y: 90 }, charInterval: 100 } },
    { at: 134, line: { text: 'szybko', speaker: 'zolty', ...L } },
    { at: 135, line: { text: 'odleżyne widziałem', speaker: 'zolty', ...L } }, { glitch: 0.8 }, { madness: 0.1 },
    { at: 138, line: { text: 'wychodzimy, prędko!', speaker: 'zolty', ...L } },
    { at: 141, line: { text: 'bierz pan broń', speaker: 'konon', pos: { x: 35, y: 90 }, charInterval: 100 } },
    { at: 143, line: { text: 'strzelaj', speaker: 'konon', ...L } },
    { at: 144, beatEnd: 'drzwi' },
    ...hide('konon', 'zolty'),
    { at: 146, black: 1500 }, // black frame

    // [00:02:29–00:02:40] the clearing: the hunt
    { at: 149, location: 'las', camera: 'polana' }, { sfx: 'knock' },
    place('konon', 0.3, -0.6), place('major', 1.3, -0.4),
    { beat: { id: 'polowanie', actors: ['konon', 'major'], need: 6 } },
    { at: 150, line: { text: 'upolowana', speaker: 'major', ...L } },
    { at: 152, line: { text: 'przeze mnie', speaker: 'major', ...L } },
    { at: 154, line: { text: 'gratuluje panulza to', speaker: 'konon', ...L } },
    { at: 156, line: { text: 'kurwa', speaker: 'konon', ...L } },
    { at: 157, line: { text: 'spierdoliła', speaker: 'konon', ...TOP } }, { glitch: 0.8 },
    { at: 159, line: { text: 'sie nadajeci', speaker: 'konon', ...L } },
    { at: 160, beatEnd: 'polowanie' },
    { black: 1800 }, // black frame
  ],
};
