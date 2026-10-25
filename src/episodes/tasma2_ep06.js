// Level 16 — "domek strachów", built from lore/ep16.md (00:00:00–00:02:40). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the man in the sweater with the bag (`kratka`) says "ja pomogłem"; the bald man with the sign (`lysy`) asks "zadowolony mexykanie?" and says "magia"; the hat man (`kapelusznik`) leads the way and says "nie ma ratunku"; the yellow-eyed face (`zoltooki`) says "ja sie nie boje sie". Konon stands at the door at 00:02:25.
// OCR-only lines (no frame): "a mógł słuchać", "nie zrobiłeś nic złego", "będzie cieplej", "zjeść trzeba", "krew z uszkami", "za drogo", "Za mną prędko", "do strasznego domu", "piękny dom", "jesteś czym pan" (kept as the OCR has it).
// "domy nie są tym" / "czym się wydają" are read from frames 01:53–01:57 (not in the OCR). The sign's Cyrillic text is read from frame 00:55.
const L = { pos: 'bottom', charInterval: 100 };
const RIGHT = { pos: { x: 78, y: 90 }, charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
export default {
  id: 'tasma2_ep06',
  tape: 2, index: 6, youtubeIndex: 16,
  title: 'domek strachów',
  loreFile: 'lore/ep16.md',
  status: 'wip',
  location: 'lazienka',
  startCamera: 'twarz',
  letter: 'domy nie są tym czym się wydają',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:38] a face in the dark, the man in the bushes
    { caption: { text: 'TAŚMA 2 · ODC. 16', pos: 'top' } }, place('zoltooki', -1.0, -0.5),
    { beat: { id: 'ciemnosc', actors: ['zoltooki'], need: 5 } },
    { at: 8, line: { text: 'a mógł słuchać', speaker: 'zoltooki', ...L } },
    { at: 16, line: { text: 'nie zrobiłeś nic złego', speaker: 'zoltooki', ...L } },
    { at: 20, beatEnd: 'ciemnosc' }, ...hide('zoltooki'),
    { at: 23, line: { text: 'będzie cieplej', speaker: 'zoltooki', ...L } },
    { at: 29, location: 'ogrod', camera: 'krzaki' }, place('kratka', 0.6, 2.3),
    { beat: { id: 'krzaki', actors: ['kratka'], need: 5 } },
    { at: 32, line: { text: 'ja pomogłem', speaker: 'kratka', pos: { x: 25, y: 90 }, charInterval: 100 } },
    { at: 37, beatEnd: 'krzaki' }, ...hide('kratka'),
    { at: 38, black: 1500 },

    // [00:00:40–00:01:09] the title, the entrance panels, the prizes, the man with the sign
    { at: 40, location: 'festyn', camera: 'domek' }, { caption: { text: '"domek strachów"', pos: 'bottom' } },
    { at: 42, camera: 'panel' },
    { at: 46, camera: 'lody' },
    { at: 48, camera: 'karuzela' }, place('kapelusznik', -1.2, 0.6),
    { beat: { id: 'kapelusz', actors: ['kapelusznik'], need: 6 } },
    { at: 50, glitch: 0.4 },
    { at: 55, camera: 'karuzela' }, ...hide('kapelusznik'), place('lysy', -1.0, 0.3),
    { caption: { text: 'извади ме из бурета', pos: 'center' } },
    { at: 58, line: { text: 'zadowolony mexykanie?', speaker: 'lysy', ...L } },
    { at: 63, line: { text: 'magia', speaker: 'lysy', pos: { x: 75, y: 40 }, charInterval: 100 } },
    { at: 68, glitch: 0.5 },
    { at: 71, line: { text: 'zjeść trzeba', speaker: 'lysy', ...L } },
    { at: 73, beatEnd: 'kapelusz' }, ...hide('lysy'),

    // [00:01:15–00:01:31] the hat man leads through the fair "to the scary house"
    { at: 75, camera: 'zamek' }, place('kapelusznik', 1.0, 0.6),
    { beat: { id: 'prowadzi', actors: ['kapelusznik'], need: 6 } },
    { at: 76, line: { text: 'krew z uszkami', speaker: 'kapelusznik', ...L } },
    { at: 81, line: { text: 'za drogo', speaker: 'kapelusznik', ...L } },
    { at: 82, camera: 'lody' }, place('kapelusznik', -0.6, -1.0),
    { at: 84, line: { text: 'Za mną prędko', speaker: 'kapelusznik', ...L } },
    { at: 87, camera: 'zamek' }, place('kapelusznik', 2.4, -1.0),
    { at: 88, line: { text: 'do strasznego domu', speaker: 'kapelusznik', ...L } },
    { at: 91, camera: 'parking' }, place('kapelusznik', -1.0, 1.4),
    { at: 94, beatEnd: 'prowadzi' }, ...hide('kapelusznik'),

    // [00:01:35–00:01:42] the empty rooms of the house
    { at: 95, location: 'domek', camera: 'pokoj' }, { tint: 1 },
    { beat: { id: 'dom', actors: [], need: 5 } },
    { at: 97, camera: 'pokoj' },
    { at: 100, camera: 'przedpokoj' },
    { at: 102, camera: 'przedpokoj' },
    { at: 104, beatEnd: 'dom' }, { tint: 0 },

    // [00:01:45–00:01:57] the fair from above, the hat man with red eyes: "nie ma ratunku"
    { at: 105, location: 'festyn', camera: 'zamek' },
    { at: 109, camera: 'karuzela' }, place('kapelusznik', -1.4, 0.8),
    { beat: { id: 'ratunek', actors: ['kapelusznik'], need: 6 } },
    { at: 111, line: { text: 'nie ma ratunku', speaker: 'kapelusznik', ...RIGHT } }, { glitch: 0.8 }, { madness: 0.15 },
    { at: 113, line: { text: 'domy nie są tym', speaker: 'kapelusznik', ...RIGHT } },
    { at: 115, glitch: 1 },
    { at: 117, line: { text: 'czym się wydają', speaker: 'kapelusznik', ...RIGHT } },
    { at: 118, beatEnd: 'ratunek' }, ...hide('kapelusznik'),

    // [00:02:00–00:02:15] the corridor with the stove, the pot with flowers, the doll
    { at: 120, location: 'domek', camera: 'piec' }, { tint: 1 },
    { beat: { id: 'piec', actors: [], need: 5 } },
    { at: 122, camera: 'piec' },
    { at: 124, camera: 'piec' },
    { at: 127, camera: 'lalka' },
    { at: 129, beatEnd: 'piec' }, { tint: 0 },

    // [00:02:23–00:02:38] the face in the doorway, the man by the door
    { at: 143, camera: 'przedpokoj' }, place('zoltooki', 1.1, -1.4),
    { beat: { id: 'drzwi', actors: ['zoltooki'], need: 6 } },
    { line: { text: 'ja sie nie boje sie', speaker: 'zoltooki', pos: { x: 22, y: 90 }, charInterval: 100 } },
    { at: 145, ...place('konon', 1.4, -1.5) }, { glitch: 0.5 },
    { at: 149, line: { text: 'piękny dom', speaker: 'konon', ...L } },
    { at: 155, show: { id: 'konon', on: false } }, { glitch: 0.8 },
    { at: 157, camera: 'przedpokoj' },
    { at: 158, line: { text: 'jesteś czym pan', speaker: 'zoltooki', ...L } }, { madness: 0.1 },
    { at: 161, beatEnd: 'drzwi' }, ...hide('zoltooki'),
    { at: 162, black: 2000 },
  ],
};
