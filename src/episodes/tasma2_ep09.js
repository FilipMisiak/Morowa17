// Level 19 — "prośba i kara", built from lore/ep19.md (00:00:00–00:02:16). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the heavy man ("grubas" = Konon) sits at the pot in the tiled kitchen; "to ja major" and the red-jacket man at the monitor are Major; the rest of the lines are given to whoever is in frame.
// OCR-only lines (no frame, positions unknown → bottom): "jarek?", "to ja major", "był żeby", "nie zdążyłem", "grubas już go zabrał", "tylko gdzie", "mexykański", "0 scybulko", "aż pociekli łzy", "niesamowite paskudztwo", "krzysztofie", "wyśmienity smalec", "dziękuje tobie", "deserek", "kurcze fu", "ze skórką", "obmyć trzeba" — spellings as in the OCR ("dziękuje", "0 scybulko" [?]).
// Frame-confirmed: "znowu uciekłeś" (centre), "gulasz będzie" (bottom), "smalec z menela" / "starosielski rarytas" (right side; OCR had "menelz"), "jeżeli boga nie ma" (OCR word order was wrong) / "to wszystko jest dozwolone" (centre-low).
const L = { pos: 'bottom', charInterval: 100 };
const RIGHT = { pos: { x: 76, y: 52 }, charInterval: 100 };
const MID = { pos: { x: 50, y: 62 }, charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
export default {
  id: 'tasma2_ep09',
  tape: 2, index: 9, youtubeIndex: 19,
  title: 'prośba i kara',
  loreFile: 'lore/ep19.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'prośba i kara',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:34] the house, the green barrel in the bushes, the table, the porch, the door
    { caption: { text: 'TAŚMA 2 · ODC. 19', pos: 'top' } },
    { at: 3, caption: { text: 'prośba i kara', pos: 'center' } },
    { at: 5, location: 'ogrod', camera: 'krzaki' },
    { at: 7, location: 'grill', camera: 'lawa' }, place('konon', -1.9, 1.0),
    { beat: { id: 'dwor', actors: ['konon', 'major'], need: 6 } },
    { at: 11, location: 'piwnica', camera: 'korytarz' }, place('konon', -0.6, 0.3),
    { at: 14, line: { text: 'jarek?', speaker: 'konon', ...L } },
    { at: 17, line: { text: 'to ja major', speaker: 'major', ...L } }, ...hide('konon'), place('major', -0.6, 0.3),
    { at: 22, camera: 'polki' }, ...hide('major'),
    { line: { text: 'był żeby', speaker: 'major', ...L } },
    { at: 27, location: 'ogrod', camera: 'trawa' },
    { line: { text: 'nie zdążyłem', speaker: 'major', ...L } },
    { at: 30, line: { text: 'grubas już go zabrał', speaker: 'major', ...L } },
    { at: 33, beatEnd: 'dwor' },

    // [00:00:34–00:01:20] the tiled kitchen: the fat man at the pot, "gulasz będzie"
    { at: 34, location: 'lazienka', camera: 'izba' }, place('konon', -1.0, -0.5),
    { beat: { id: 'garnek', actors: ['konon'], need: 8 } },
    { line: { text: 'tylko gdzie', speaker: 'major', ...L } },
    { at: 42, location: 'lazienka', camera: 'twarz' }, { line: { text: 'znowu uciekłeś', speaker: 'chudy', ...MID } }, { glitch: 0.8 },
    { at: 46, camera: 'izba' },
    { at: 51, camera: 'blat' },
    { at: 56, camera: 'izba' },
    { at: 63, line: { text: 'gulasz będzie', speaker: 'konon', ...L } },
    { at: 65, line: { text: 'gulasz będzie', speaker: 'konon', ...L } },
    { at: 70, camera: 'blat' },
    { at: 71, line: { text: 'mexykański', speaker: 'konon', ...L } },
    { at: 75, beatEnd: 'garnek' }, ...hide('konon'),
    { at: 76, location: 'piwnica', camera: 'polki' }, place('kratka', 0.0, -0.4),
    { beat: { id: 'polka', actors: ['kratka'], need: 4 } },
    { at: 77, line: { text: '0 scybulko', speaker: 'kratka', ...L } },
    { at: 78, line: { text: '0 scybulko', speaker: 'kratka', ...L } },
    { at: 83, line: { text: 'aż pociekli łzy', speaker: 'kratka', ...L } },
    { at: 84, beatEnd: 'polka' }, ...hide('kratka'),

    // [00:01:24–00:01:42] the room with the monitor: the man in the red jacket eats the lard
    { at: 84, location: 'poeta', camera: 'zaslony' }, place('major', 6.0, -0.3),
    { beat: { id: 'smalec', actors: ['major'], need: 8 } },
    { at: 89, line: { text: 'niesamowite paskudztwo', speaker: 'major', ...L } },
    { at: 94, line: { text: 'krzysztofie', speaker: 'major', ...L } }, { madness: 0.1 },
    { at: 96, line: { text: 'wyśmienity smalec', speaker: 'major', ...L } },
    { at: 100, line: { text: 'smalec z menela', speaker: 'major', ...RIGHT } },
    { at: 102, line: { text: 'starosielski rarytas', speaker: 'major', ...RIGHT } },
    { at: 104, beatEnd: 'smalec' }, ...hide('major'),

    // [00:01:44–00:02:00] the brick stove, the shelf, the orange thing
    { at: 104, location: 'chata', camera: 'stove' }, place('konon', 1.4, -0.9),
    { beat: { id: 'piec', actors: ['konon'], need: 4 } },
    { at: 106, line: { text: 'dziękuje tobie', speaker: 'konon', ...L } },
    { at: 109, location: 'piwnica', camera: 'polki' }, ...hide('konon'), place('konon', 0.0, -0.4),
    { at: 111, line: { text: 'deserek', speaker: 'konon', ...L } },
    { at: 113, beatEnd: 'piec' }, ...hide('konon'),

    // [00:01:56–00:02:16] the green sphere, the mouth with teeth, the moral
    { at: 116, location: 'lazienka', camera: 'twarz' }, place('chudy', -1.0, -0.5), { glitch: 0.9 },
    { beat: { id: 'usta', actors: ['chudy'], need: 6 } },
    { line: { text: 'kurcze fu', speaker: 'chudy', ...L } },
    { at: 120, line: { text: 'ze skórką', speaker: 'chudy', ...L } }, { madness: 0.1 },
    { at: 125, line: { text: 'obmyć trzeba', speaker: 'chudy', ...L } },
    { at: 129, glitch: 1 },
    { at: 131, line: { text: 'jeżeli boga nie ma', speaker: 'chudy', ...MID } },
    { at: 134, line: { text: 'to wszystko jest dozwolone', speaker: 'chudy', ...MID } }, { madness: 0.15 },
    { at: 136, beatEnd: 'usta' }, ...hide('chudy'),
    { at: 137, black: 2500 },
  ],
};
