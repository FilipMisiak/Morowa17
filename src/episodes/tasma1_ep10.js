// Level 10 — finale of tape 1, built from lore/ep10.md (00:00:00–00:04:44). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the martyr in the bricks, Major on the sofa, the dog-mask visitor (`maska`) who calls him "morderco", Konon at the window.
// Frame choices: the four-line prophecy follows frame 02-34; "oby tylko strych..." and "co tam sie do kurrrwy wyprawia" come from frames (the OCR missed the latter).
// Left out as unconfirmed OCR: the long prophecy variants of 02:19–02:41, the poster "2016", the dog's noises. "Milc" is completed to "Milcz morderco" (OCR 02:16).
const L = { pos: 'bottom', charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
const MAJOR = [-0.9, -0.6], GUEST = [0.9, 0.6];
// prophecy: four lines on the left, typed one after another (frame 02-34)
const prophecy = (t) => ['Gdy Czterej już nadejdą.', 'A usłyszysz krzyk wilczy.', 'Przy trzecim za późno już będzie.', 'I dokona się.']
  .map((text, i) => ({ at: t + i * 2, caption: { text, pos: { x: 24, y: 42 + i * 7 }, color: '#d8cfa8', hold: 9000, charInterval: 70 } }));
export default {
  id: 'tasma1_ep10',
  tape: 1, index: 10, youtubeIndex: 10,
  title: 'Finał taśmy 1',
  loreFile: 'lore/ep10.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'Gdy Czterej już nadejdą',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:27] the house, the martyr in the bricks
    { caption: { text: 'TAŚMA 1 · ODC. 10', pos: 'top' } },
    { at: 1, location: 'piwnica', camera: 'twarz' }, place('meczennik', 0.0, -1.0),
    { beat: { id: 'cegla', actors: ['meczennik'], need: 5 } },
    { line: { text: 'męczennik', speaker: 'meczennik', ...L } },
    { at: 6, line: { text: 'nie chce odejść', speaker: 'meczennik', ...L } },
    { at: 9, line: { text: 'stoi i patrzy', speaker: 'meczennik', ...L } },
    { at: 11, line: { text: 'zwiastun śmierci', speaker: 'meczennik', pos: 'bottom', color: '#e8dca0', charInterval: 100 } },
    { at: 17, line: { text: 'wojtek co robić', speaker: 'konon', pos: 'bottom', color: '#e8d870', charInterval: 100 } },
    { at: 20, line: { text: 'gdy męczennik przychodzi', speaker: 'meczennik', pos: 'bottom', color: '#e8d870', charInterval: 100 } },
    { at: 23, line: { text: 'ja odejść musze', speaker: 'meczennik', ...L } },
    { at: 27, beatEnd: 'cegla' }, ...hide('meczennik'),

    // [00:00:33–00:00:45] the visitor in the doorway
    { at: 33, location: 'chata', camera: 'door' },
    place('konon', -0.1, 0.4), place('maska', ...GUEST),
    { beat: { id: 'wizyta', actors: ['maska'], need: 4 } },
    { line: { text: 'precz diable', speaker: 'konon', pos: { x: 70, y: 90 }, color: '#e8d870', charInterval: 100 } }, { sfx: 'knock' },
    { at: 36, line: { text: 'czego sie znęcasz ty', speaker: 'konon', ...L } },
    { at: 44, beatEnd: 'wizyta' }, ...hide('maska'),

    // [00:00:48–00:01:05] the man at the window: "kto stoi w oknie?"
    { at: 48, camera: 'window' },
    place('konon', 1.4, 0.4),
    { beat: { id: 'okno', actors: ['konon'], need: 4 } },
    { at: 49, line: { text: 'całe szczęście żeś pan przyszłeś', speaker: 'konon', ...L } },
    { at: 53, line: { text: 'kto stoi w oknie?', speaker: 'konon', ...L } }, { glitch: 0.6 }, { madness: 0.1 },
    { at: 60, line: { text: 'nie znikaj pan!', speaker: 'konon', ...L } },
    { at: 62, beatEnd: 'okno' },
    { at: 65, line: { text: 'nerko?', speaker: 'konon', ...L } },
    ...hide('konon'),

    // [00:01:29–00:01:50] Major on the sofa
    { at: 89, location: 'chata', camera: 'door' },
    place('major', ...MAJOR),
    { beat: { id: 'salon', actors: ['major'], need: 6 } },
    { line: { text: 'opuść mój dom', speaker: 'major', ...L } },
    { at: 96, line: { text: 'odszedł', speaker: 'major', ...L } },
    { at: 98, line: { text: 'ale wróci', speaker: 'major', ...L } },
    { at: 100, line: { text: 'wojtek zawsze wraca', speaker: 'major', ...L } },
    { at: 104, line: { text: 'ktoś przyszedł', speaker: 'major', ...L } }, { sfx: 'knock' },
    { at: 107, line: { text: 'prosze wejść', speaker: 'major', ...L } },
    { at: 111, beatEnd: 'salon' },

    // [00:01:53–00:02:36] "Witaj morderco", the prophecy
    { at: 113, camera: 'door' }, place('maska', ...GUEST),
    { beat: { id: 'wizyta2', actors: ['major', 'maska'], need: 5 } },
    { at: 118, line: { text: 'kto pan jesteś', speaker: 'major', ...L } },
    { at: 123, line: { text: 'Witaj morderco', speaker: 'maska', ...L } }, { madness: 0.1 },
    { at: 127, line: { text: 'Nie jestem już tym za którego chciał', speaker: 'major', ...L } },
    { at: 136, line: { text: 'Milcz morderco', speaker: 'maska', pos: { x: 30, y: 12 }, charInterval: 100 } },
    { at: 148, beatEnd: 'wizyta2' },
    ...prophecy(154),
    { at: 153, line: { text: 'jedzenie podam dla ciebie', speaker: 'major', ...L } },

    // [00:02:47–00:03:04] "Nigdy mnie nie słuchałeś"
    { at: 163, camera: 'door' },
    { beat: { id: 'maska', actors: ['maska'], need: 5 } },
    { at: 167, line: { text: 'akurat wojtek bigos zrobił', speaker: 'maska', ...L } },
    { at: 171, line: { text: 'Nigdy mnie nie słuchałeś', speaker: 'maska', ...L } },
    { at: 175, line: { text: 'Będę obserwował cię', speaker: 'maska', ...L } }, { glitch: 0.7 },
    { at: 180, line: { text: 'Bywaj morderco', speaker: 'maska', ...L } },
    { at: 184, beatEnd: 'maska' }, ...hide('major', 'maska'),

    // [00:03:19–00:03:36] "nerko piesek mój"
    { at: 199, camera: 'door' }, place('konon', ...MAJOR),
    { beat: { id: 'nerko', actors: ['konon'], need: 4 } },
    { at: 202, line: { text: 'nerko piesek mój', speaker: 'konon', ...L } },
    { at: 205, line: { text: 'poszedł sobie', speaker: 'konon', ...L } },
    { at: 210, line: { text: 'zostałem sam', speaker: 'konon', ...L } },
    { at: 212, line: { text: 'W środku nocy', speaker: 'konon', ...L } },
    { at: 216, line: { text: 'oby tylko strych...', speaker: 'konon', ...L } },
    { at: 217, beatEnd: 'nerko' }, ...hide('konon'),

    // [00:03:39–00:04:11] the house, the portrait, the zombie face
    { at: 219, location: 'podworko', camera: 'front' },
    { at: 228, location: 'strych', camera: 'portret' }, place('konon', 1.0, -0.2),
    { beat: { id: 'portret', actors: [], need: 4 } },
    { line: { text: 'odejdźcie diabły szatanske', speaker: 'konon', ...L } },
    { at: 232, glitch: 0.9 }, { sfx: 'creak' }, { madness: 0.15 },
    { at: 236, line: { text: 'precz mnie', speaker: 'konon', ...L } },
    { at: 241, line: { text: 'co tam sie do kurrrwy wyprawia', speaker: 'konon', ...L } },
    { at: 244, beatEnd: 'portret' }, ...hide('konon'),
    { at: 245, location: 'podworko', camera: 'plot' },
    { at: 248, line: { text: 'Zabierzcie mnie', speaker: 'konon', ...L } },
    { at: 251, camera: 'front' },

    // [00:04:17–00:04:44] the tape burns out
    { at: 257, glitch: 1 }, { at: 262, wait: 1500 },
    { at: 270, caption: { text: 'koniec taśmy 1', pos: 'center' } },
    { at: 284, wait: 1500 },
  ],
};
