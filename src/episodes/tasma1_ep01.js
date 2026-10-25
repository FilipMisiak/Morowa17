// Level 1 — built from lore/ep01.md (lore_parts/tasma1_ep01.md, 00:00:00–00:00:40). Dialogue is verbatim.
// Speaker attribution is a working guess (see lore/ep01.md → Otwarte pytania).
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
    { place: { id: 'konon', x: 0.9, z: -1.2, face: 2.4 } },
    { place: { id: 'major', x: 0.4, z: 1.7, face: Math.PI } },
    { caption: { text: 'TAŚMA 1 · ODC. 01', pos: 'top' } },

    // [00:00:00–00:00:12] bigos on the stove (pot close-up in the original)
    { beat: { id: 'gotowanie', actors: ['konon'], need: 4 } },
    { wait: 4000 },
    { walk: { id: 'major', x: 0.2, z: -0.3, secs: 5 } },
    { wait: 5000 },
    { beatEnd: 'gotowanie' },

    // [00:00:05–00:00:22] the exchange about the bigos — a two-shot, both must be in frame
    { beat: { id: 'rozmowa', actors: ['konon', 'major'], need: 6 } },
    { line: { text: 'ale pachnie', speaker: 'major', pos: 'bottom', charInterval: 90 } },
    { wait: 2200 },
    { line: { text: 'CO gotujesz', speaker: 'major', pos: 'bottom', charInterval: 90 } },
    { wait: 2200 },
    { line: { text: 'bigos', speaker: 'konon', pos: 'bottom', charInterval: 110 } },
    { wait: 2800 },
    { line: { text: 'obecki', speaker: 'konon', pos: 'bottom', charInterval: 110 } },
    { wait: 3200 },
    { line: { text: 'twoja rodzina obecka była', speaker: 'konon', pos: 'bottom', charInterval: 90 } },
    { wait: 3500 },
    { beatEnd: 'rozmowa' },

    // [00:00:27] "strych został otwarty": tracking glitch, the hatch duty starts, the shade stands under it
    { sfx: 'creak' },
    { glitch: 1 },
    { madness: 0.1 },
    { duty: { stove: { decay: 0.014 }, hatch: { first: 3, every: [60, 90] } } },
    { beat: { id: 'strych', actors: ['konon'], need: 4 } },
    { line: { text: 'strych został otwarty', speaker: 'konon', pos: 'bottom', charInterval: 90 } },
    { show: { id: 'shade', on: true } },
    { place: { id: 'shade', x: 0.1, z: -0.3, face: 0 } },
    { wait: 4000 },
    { show: { id: 'shade', on: false } },
    { wait: 5000 },
    { beatEnd: 'strych' },
    { wait: 12000 }, // time left on the tape to answer the hatch / write the letter
  ],
};
