// Level 3 — built from lore/ep03.md (00:00:00–00:01:48). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: Konon (green sweater, white pupils) speaks to "wojtek"; Major (pale, red eyes in the end) answers.
// OCR fixes after the frames: "co obserwujesz" (frame shows lower-case), "moją odleżyne" (OCR had the words swapped),
// "ktoś tam był? co?" (leading "1" is OCR junk) and the closing line "strych sie obudził", which the OCR missed (frame 00-01-46).
const L = { pos: 'bottom', charInterval: 100 };
const both = (a, b) => [{ place: { id: 'konon', ...a } }, { place: { id: 'major', ...b } }];
const KONON = { x: -0.9, z: -0.6, face: 0 }, MAJOR = { x: -0.1, z: 0.4, face: 0 };
export default {
  id: 'tasma1_ep03',
  tape: 1, index: 3, youtubeIndex: 3,
  title: 'Morowa 17 (ep03)',
  loreFile: 'lore/ep03.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'strych sie obudził',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00] the house at night
    { caption: { text: 'TAŚMA 1 · ODC. 03', pos: 'top' } },
    { at: 2, caption: { text: '"znalezisko"', pos: 'center' } },   // OCR: `11 znalezisko"` [?]

    // [00:00:04–00:00:33] Konon and the pale one: "powiedz coś"
    { at: 4, location: 'chata', camera: 'door' },
    ...both(KONON, MAJOR),
    { beat: { id: 'rozmowa', actors: ['konon', 'major'], need: 5 } },
    { at: 6, line: { text: 'wojtek', speaker: 'konon', ...L } },
    { at: 10, line: { text: 'powiedz coś', speaker: 'konon', ...L } },
    { at: 15, line: { text: 'dlaczego nic nie mówisz', speaker: 'konon', ...L } },
    { at: 19, line: { text: 'boje sie wojtek', speaker: 'konon', ...L } },
    { at: 23, line: { text: 'ale prosze być cicho', speaker: 'major', pos: { x: 50, y: 40 }, charInterval: 100 } },
    { at: 26, line: { text: 'obserwuje', speaker: 'major', pos: { x: 50, y: 40 }, charInterval: 100 } },
    { at: 31, line: { text: 'co obserwujesz', speaker: 'konon', ...L } },
    { at: 34, beatEnd: 'rozmowa' },

    // [00:00:34–00:00:46] the bathroom: "znalazłem W wannie" — something dark and alive in the tub
    { show: { id: 'konon', on: false } }, { show: { id: 'major', on: false } },
    { at: 34, location: 'lazienka', camera: 'blat' },
    { beat: { id: 'wanna', actors: [], need: 4 } },
    { at: 36, line: { text: 'znalazłem W wannie', speaker: 'major', ...L } },
    { at: 39, camera: 'wanna' },
    { at: 43, line: { text: 'cuchnie ropą', speaker: 'major', ...L } },
    { at: 46, beatEnd: 'wanna' },

    // [00:00:46–00:00:58] Konon: "nie!" ... "moją odleżyne"
    { at: 46, location: 'chata', camera: 'door' },
    ...both(KONON, MAJOR),
    { beat: { id: 'odlezyna', actors: ['konon'], need: 4 } },
    { at: 48, line: { text: 'nie!', speaker: 'konon', ...L } },
    { glitch: 0.7 },
    { at: 50, line: { text: 'znalazłeś W wannie', speaker: 'konon', ...L } },
    { at: 51, line: { text: 'moją odleżyne', speaker: 'konon', ...L } },
    { at: 55, line: { text: 'wyrzuć ją', speaker: 'konon', ...L } },
    { at: 58, beatEnd: 'odlezyna' },
    { show: { id: 'konon', on: false } }, { show: { id: 'major', on: false } },
    { at: 58, location: 'lazienka', camera: 'blat' },

    // [00:01:01–00:01:10] a sound in the house
    { at: 61, location: 'chata', camera: 'door' },
    ...both(KONON, MAJOR),
    { sfx: 'knock' }, { madness: 0.1 },
    { line: { text: 'co to był za dźwięk', speaker: 'konon', ...L } },
    { at: 65, line: { text: 'sprawdź czy ktoś jest w domu', speaker: 'konon', ...L } },
    { at: 67, location: 'podworko', camera: 'front' },
    { at: 70, location: 'chata', camera: 'door' },
    ...both(KONON, MAJOR),
    { line: { text: 'niczego tu na pewno nie ma!', speaker: 'major', pos: { x: 50, y: 40 }, charInterval: 100 } },
    { at: 74, line: { text: 'wygląda jak zawsze', speaker: 'major', ...L } },

    // [00:01:16–00:01:23] "musiało uciec tą dziurą" — the tub again
    { show: { id: 'konon', on: false } }, { show: { id: 'major', on: false } },
    { at: 76, location: 'lazienka', camera: 'wanna' },
    { at: 79, line: { text: 'musiało uciec tą dziurą', speaker: 'major', ...L } },
    { at: 83, line: { text: 'nie powiem krzyśkowi', speaker: 'major', ...L } },

    // [00:01:27–00:01:48] "ktoś jest w domu" ... "strych sie obudził"
    { at: 87, location: 'chata', camera: 'door' },
    ...both(KONON, MAJOR),
    { at: 89, line: { text: 'ktoś tam był? co?', speaker: 'konon', ...L } },
    { at: 94, line: { text: 'zdawało ci sie', speaker: 'major', ...L } },
    { at: 98, line: { text: 'wyrzuciłeś ją?', speaker: 'major', ...L } },
    { at: 101, beat: { id: 'strych', actors: ['major'], need: 3 } },
    { line: { text: 'wojtek ktoś jest w domu', speaker: 'konon', ...L } },
    { at: 106, sfx: 'creak' }, { glitch: 1 }, { madness: 0.15 },
    { line: { text: 'strych sie obudził', speaker: 'major', pos: { x: 42, y: 90 }, charInterval: 110 } },
    { at: 109, beatEnd: 'strych' },
    { black: 2500 }, // black frame at the end of the original
  ],
};
