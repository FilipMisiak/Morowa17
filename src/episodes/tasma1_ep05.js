// Level 5 — (00:00:00–00:01:38). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: Major cooks the bigos and talks to "wojtek"/"krzysio"; Konon goes down to the cellar.
// OCR fixes after the frames: "o jutro przyjeżdża" (OCR `0 jutro przyjezdża`). Lines without a frame stay as the OCR has them.
const L = { pos: 'bottom', charInterval: 100 };
const KONON = { x: -0.9, z: -0.6, face: 0 }, MAJOR = { x: -0.1, z: 0.4, face: 0 };
const both = [{ place: { id: 'konon', ...KONON } }, { place: { id: 'major', ...MAJOR } }];
const hide = [{ show: { id: 'konon', on: false } }, { show: { id: 'major', on: false } }];
export default {
  id: 'tasma1_ep05',
  tape: 1, index: 5, youtubeIndex: 5,
  title: 'Morowa 17 (ep05)',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'jest za mało uszek',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00] the house at dusk
    { caption: { text: 'TAŚMA 1 · ODC. 05', pos: 'top' } },
    { at: 2, line: { text: 'dziecięcy przysmak', speaker: 'major', ...L } },

    // [00:00:05–00:00:44] the sofa, the pot of bigos, the table with the bowls
    { at: 5, location: 'chata', camera: 'door' },
    ...both,
    { beat: { id: 'garnek', actors: ['major'], need: 5 } },
    { at: 9, line: { text: 'o jutro przyjeżdża', speaker: 'major', ...L } },
    { at: 16, camera: 'stove' },
    { at: 29, line: { text: 'krew czuć', speaker: 'major', ...L } },
    { at: 32, line: { text: 'krew z uszkami', speaker: 'major', ...L } },
    { at: 34, line: { text: 'dziecięcy przysmak', speaker: 'major', ...L } },
    { at: 37, line: { text: 'trzeba zejść do piwnicy', speaker: 'major', ...L } },
    { at: 40, line: { text: 'jest za mało uszek', speaker: 'major', ...L } },
    { at: 42, beatEnd: 'garnek' },
    { at: 44, camera: 'door' }, { sfx: 'knock' },
    { line: { text: 'ja pójde wojtek', speaker: 'konon', ...L } },

    // [00:00:46–00:01:05] the cellar: stairs, passage, shelves of jars
    ...hide,
    { at: 46, location: 'piwnica', camera: 'schody' },
    { place: { id: 'konon', x: -0.2, z: -0.7, face: 0 } },
    { beat: { id: 'piwnica', actors: [], need: 5 } },
    { at: 51, camera: 'polki' },
    { at: 57, camera: 'korytarz' }, { madness: 0.1 },
    { at: 60, camera: 'polki' },
    { at: 62, line: { text: 'są uszka', speaker: 'konon', ...L } },
    { at: 65, beatEnd: 'piwnica' },
    { show: { id: 'konon', on: false } },

    // [00:01:06–00:01:38] outside once more, the bowls, the one on the sofa, the special
    { at: 66, location: 'podworko', camera: 'front' },
    { at: 69, location: 'chata', camera: 'door' },
    ...both,
    { beat: { id: 'miska', actors: ['major'], need: 4 } },
    { at: 78, beatEnd: 'miska' },
    { at: 78, camera: 'door' }, { glitch: 0.8 },
    { beat: { id: 'kanapa', actors: ['konon'], need: 4 } },
    { at: 83, line: { text: 'krzysio sie obudził?', speaker: 'major', pos: { x: 75, y: 90 }, charInterval: 100 } },
    { at: 86, line: { text: 'pewnie jest głodny', speaker: 'major', ...L } },
    { at: 89, line: { text: 'mnie wojtek troche daj', speaker: 'konon', ...L } },
    { at: 90, beatEnd: 'kanapa' },
    { at: 92, camera: 'stove' },
    { at: 93, line: { text: 'dziś mój specjał', speaker: 'major', ...L } },
    { at: 94, line: { text: 'bigos z dziąślaną ropą', speaker: 'major', ...L } },
    { glitch: 1 }, { madness: 0.15 },
    { at: 98, black: 2000 },
  ],
};
