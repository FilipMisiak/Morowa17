// Level 2 — built from lore/ep02.md (00:00:00–00:01:30). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the visitor "Wojtek" (Major, off-screen) consoles / scolds Konon, who is the only man in the frames.
const L = { charInterval: 100 };
export default {
  id: 'tasma1_ep02',
  tape: 1, index: 2, youtubeIndex: 2,
  title: 'Morowa 17 (ep02)',
  loreFile: 'lore/ep02.md',
  status: 'wip',
  startCamera: 'front',
  location: 'podworko',
  letter: 'nie wolno wchodzić do lasu',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00] the house at night
    { caption: { text: 'TAŚMA 1 · ODC. 02', pos: 'top' } },
    { at: 2, caption: { text: 'przyjaciel na zawsze', pos: 'bottom' } },

    // [00:00:04–00:00:21] Konon lying on the sofa, close-ups
    { at: 4, location: 'chata', camera: 'door' },
    { place: { id: 'konon', x: -0.9, z: -0.6, face: 0 } },
    { beat: { id: 'pokoj', actors: ['konon'], need: 6 } },
    { at: 10, line: { text: 'i pojechałeś po mojej rodzinie', speaker: 'konon', pos: 'bottom', ...L } },
    { at: 14, glitch: 0.6 },
    { at: 21, beatEnd: 'pokoj' },

    // [00:00:23–00:00:40] the forest: the reserve sign, Konon crouching with a colourful blanket
    { at: 23, location: 'las', camera: 'znak' },
    { sfx: 'creak' },
    { at: 26, camera: 'polana' },
    { place: { id: 'konon', x: 0.7, z: -0.3, face: 0 } },
    { madness: 0.1 },
    { beat: { id: 'las', actors: ['konon'], need: 5 } },
    { at: 27, line: { text: 'to tylko omamy krzysiu', speaker: 'major', pos: 'bottom', ...L } },
    { at: 30, line: { text: 'to nieprawda krzysiu', speaker: 'major', pos: 'bottom', ...L } },
    { at: 33, camera: 'kloda' },
    { at: 34, line: { text: 'nie zrobiłeś nic złego', speaker: 'major', pos: 'bottom', ...L } },
    { at: 38, line: { text: 'pora do domku krzysiu', speaker: 'major', pos: 'bottom', ...L } },
    { at: 41, beatEnd: 'las' },

    // [00:00:43] the house by day
    { at: 43, location: 'podworko', camera: 'front' },

    // [00:00:47–00:01:28] the room: the scolding and the banishing
    { at: 47, location: 'chata', camera: 'door' },
    { place: { id: 'konon', x: -0.9, z: -0.6, face: 0 } },
    { beat: { id: 'wygnanie', actors: ['konon'], need: 6 } },
    { at: 48, line: { text: 'znów w lesie byłeś', speaker: 'major', pos: 'bottom', ...L } },
    { at: 52, line: { text: 'nie wolno wchodzić do lasu', speaker: 'major', pos: { x: 50, y: 78 }, ...L } },
    { at: 57, line: { text: 'ja nie chciałem wojtek', speaker: 'konon', pos: 'bottom', ...L } },
    { at: 61, line: { text: 'przepraszam', speaker: 'konon', pos: 'bottom', ...L } },
    { at: 63, line: { text: 'zostaw mnie teraz', speaker: 'konon', pos: 'bottom', ...L } },
    { at: 66, line: { text: 'odejdź', speaker: 'konon', pos: 'center', ...L } },
    { glitch: 0.8 }, { madness: 0.1 },
    { at: 69, line: { text: 'nie ma ciebie', speaker: 'konon', pos: { x: 50, y: 78 }, ...L } },
    { at: 73, line: { text: 'nie ma ciebie', speaker: 'konon', pos: { x: 50, y: 78 }, ...L } },
    { at: 77, line: { text: 'opuść mój dom', speaker: 'konon', pos: 'center', ...L } },
    { sfx: 'knock' },
    { at: 83, line: { text: 'odszedł', speaker: 'konon', pos: 'bottom', ...L } },
    { at: 87, line: { text: 'ale wróci', speaker: 'konon', pos: 'bottom', ...L } },
    { at: 88, line: { text: 'wojtek zawsze wraca', speaker: 'konon', pos: 'bottom', ...L } },
    { at: 91, beatEnd: 'wygnanie' },
    { glitch: 1 },
    { black: 3000 }, // black screen at the end of the original
  ],
};
