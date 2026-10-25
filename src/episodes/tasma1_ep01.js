// Level 1 — built from lore/ep01.md (00:00:00–00:00:40). Dialogue is verbatim.
// Speakers follow the frames: Konon (green sweater) asks about the smell at the stove; Major (curly hair, red eyes) is the cook
// and says "strych został otwarty" (caption bottom-left). Attribution is still a working guess [?].
const bottom = { pos: 'bottom', charInterval: 100 };
export default {
  id: 'tasma1_ep01',
  tape: 1, index: 1, youtubeIndex: 1,
  title: 'Morowa 17 (ep01)',
  loreFile: 'lore/ep01.md',
  status: 'wip',
  startCamera: 'door',
  letter: 'strych został otwarty',
  items: { kaseta: 1, bateria: 1, wegiel: 2, klodka: 1, przysmak: 1 },
  duties: { stove: { decay: 0.014 } },
  steps: [
    { place: { id: 'major', x: 1.2, z: -1.05, face: 0 } },
    { place: { id: 'konon', x: 0.1, z: 0.9, face: 0 } },
    { caption: { text: 'TAŚMA 1 · ODC. 01', pos: 'top' } },

    // [00:00:00–00:00:05] the cook at the stove, the pot of bigos in close-up
    { beat: { id: 'gotowanie', actors: ['major'], need: 4 } },
    { wait: 5000 },
    { beatEnd: 'gotowanie' },

    // [00:00:05–00:00:22] Konon comes closer and asks; Major answers. A two-shot: both must be in frame.
    { beat: { id: 'rozmowa', actors: ['konon', 'major'], need: 6 } },
    { walk: { id: 'konon', x: 0.55, z: -0.3, secs: 4 } },
    { line: { text: 'ale pachnie', speaker: 'konon', ...bottom } },       // 00:05
    { wait: 1800 },
    { line: { text: 'CO gotujesz', speaker: 'konon', ...bottom } },       // 00:08
    { wait: 2600 },
    { line: { text: 'bigos', speaker: 'major', ...bottom } },              // 00:12
    { wait: 1000 },
    { line: { text: 'obecki', speaker: 'major', ...bottom } },             // 00:14
    { wait: 5200 },
    { line: { text: 'twoja rodzina obecka była', speaker: 'major', ...bottom } }, // 00:22
    { wait: 2200 },
    { beatEnd: 'rozmowa' },

    // [00:00:27] "strych został otwarty" (caption bottom-left): tracking glitch, the hatch duty starts, the shade stands under it
    { sfx: 'creak' },
    { glitch: 1 },
    { madness: 0.1 },
    { duty: { stove: { decay: 0.014 }, hatch: { first: 3, every: [60, 90] } } },
    { beat: { id: 'strych', actors: ['major'], need: 4 } },
    { line: { text: 'strych został otwarty', speaker: 'major', pos: { x: 33, y: 91 }, charInterval: 100 } },
    { show: { id: 'shade', on: true } },
    { place: { id: 'shade', x: 0.1, z: -0.3, face: 0 } },
    { wait: 4000 },
    { show: { id: 'shade', on: false } },
    { wait: 5000 },
    { beatEnd: 'strych' },
    { wait: 12000 }, // time left on the tape to answer the hatch / write the letter
  ],
};
