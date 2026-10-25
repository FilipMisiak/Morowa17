// Level 11 — opening of tape 2, built from lore/ep11.md (00:00:00–00:02:15). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the lore has no "krzysiu"/"wojtek" here, so the lines go to the men seen in the frames (cap, bucket hat, lime hoodie, grey jacket).
// OCR-only lines (no frame): "dziś święto", "trzeba świętować", "trzeba sie ubrać elegancko", "i to wezme", "będzie na łbie twoim", "flaczki zostały", "kiszka będzie", "flaczki smaczne", "mexykano też dostał", "mogli nie przychodzić".
// Kept as OCR [?]: "gril" (position unknown), the unreadable line at 01:29 is left out. "i ogułem o" follows the frame (OCR had "0").
const L = { pos: 'bottom', charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
export default {
  id: 'tasma2_ep01',
  tape: 2, index: 1, youtubeIndex: 11,
  title: 'Taśma 2',
  loreFile: 'lore/ep11.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'dziś święto',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:26] the house, the man in the cap, the shouting man, the title card
    { caption: { text: 'TAŚMA 2 · ODC. 11', pos: 'top' } },
    { at: 6, camera: 'plot' },
    { at: 9, location: 'grill', camera: 'pranie' }, place('czapka', -1.6, -1.0),
    { beat: { id: 'czapka', actors: ['czapka'], need: 4 } },
    { at: 12, camera: 'grill' },
    { at: 15, camera: 'pranie' }, place('szarak', -2.4, -1.2), { glitch: 0.5 },
    { at: 19, beatEnd: 'czapka' }, ...hide('czapka', 'szarak'),
    { at: 20, black: 2500 },
    { at: 24, location: 'podworko', camera: 'front' }, { caption: { text: 'taśma 2', pos: 'center' } },

    // [00:00:26–00:00:54] the grill, the skull-like thing, the man in the bucket hat
    { at: 27, location: 'grill', camera: 'grill' }, { caption: { text: 'gril', pos: 'bottom' } },
    { beat: { id: 'grill', actors: [], need: 5 } },
    { at: 34, line: { text: 'i ogułem o', speaker: 'kapelusz', ...L } },
    { at: 37, camera: 'pranie' }, place('kapelusz', -1.3, -0.6),
    { line: { text: 'krwawi', speaker: 'kapelusz', ...L } },
    { at: 41, line: { text: 'dziś święto', speaker: 'kapelusz', ...L } },
    { at: 44, line: { text: 'trzeba świętować', speaker: 'kapelusz', ...L } },
    { at: 46, glitch: 0.9 }, { madness: 0.1 },
    { at: 48, line: { text: 'trzeba sie ubrać elegancko', speaker: 'kapelusz', ...L } },
    { at: 51, camera: 'grill' }, ...hide('kapelusz'),
    { at: 53, beatEnd: 'grill' },

    // [00:00:54–00:01:20] the yellow hoodie, the machete, the stump
    { at: 54, camera: 'pieniek' }, place('bluza', 2.0, 0.5),
    { beat: { id: 'pieniek', actors: ['bluza'], need: 6 } },
    { at: 55, line: { text: 'doigrałeś sie sąsiadku', speaker: 'bluza', ...L } },
    { at: 61, line: { text: 'i to wezme', speaker: 'bluza', ...L } },
    { at: 65, line: { text: 'będzie na łbie twoim', speaker: 'bluza', ...L } }, { sfx: 'knock' },
    { at: 69, glitch: 0.4 }, { sfx: 'knock' },
    { at: 72, beatEnd: 'pieniek' },
    { at: 75, location: 'podworko', camera: 'front' }, ...hide('bluza'),
    { at: 81, line: { text: 'flaczki zostały', speaker: 'bluza', ...L } },

    // [00:01:26–00:02:00] the bowl, the steps, the grey jacket and the guest
    { at: 86, location: 'grill', camera: 'lawa' },
    { at: 92, camera: 'schody' },
    { at: 95, line: { text: 'kiszka będzie', speaker: 'szarak', ...L } },
    { at: 99, camera: 'grill' },
    { at: 103, camera: 'lawa' }, place('szarak', -1.9, 1.0),
    { beat: { id: 'lawa', actors: ['szarak'], need: 5 } },
    { at: 105, line: { text: 'flaczki smaczne', speaker: 'szarak', ...L } },
    { at: 111, line: { text: 'mexykano też dostał', speaker: 'szarak', ...L } },
    { at: 115, camera: 'grill' },
    { at: 117, line: { text: 'mogli nie przychodzić', speaker: 'szarak', ...L } },
    { at: 118, beatEnd: 'lawa' }, ...hide('szarak'),

    // [00:02:03–00:02:15] the gaunt one with red eyes, the ladder, the hatch, the rafters
    { at: 123, location: 'podworko', camera: 'front' }, place('chudy', 0.6, 0.9),
    { beat: { id: 'chudy', actors: ['chudy'], need: 3 } },
    { glitch: 0.8 }, { madness: 0.15 },
    { at: 126, location: 'grill', camera: 'drabina' }, ...hide('chudy'),
    { at: 128, camera: 'drabina' },
    { at: 130, location: 'poddasze', camera: 'ogolny' },
    { at: 133, beatEnd: 'chudy' },
    { at: 135, black: 1500 },
  ],
};
