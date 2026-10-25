// Level 4 — built from lore/ep04.md (00:00:00–00:01:36). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the ghost with the rosary and the man with the milk are Konon; the "zombie" and the red-eyed one are Major.
// OCR fixes after the frames: "znów uciekłeś" (OCR `Iznów`), "o majorku" (OCR `0`), "tak jak wojtka wykończyliście" (OCR missed the accent).
// Dropped as OCR junk: "Ooo 0", "Lty". Lines the frames did not confirm are kept as the OCR has them, in the lore file with [?].
const L = { pos: 'bottom', charInterval: 100 };
const KONON = { x: -0.3, z: -0.6, face: 0 };
const only = (id, p) => [{ show: { id: id === 'konon' ? 'major' : 'konon', on: false } }, { place: { id, ...p } }];
export default {
  id: 'tasma1_ep04',
  tape: 1, index: 4, youtubeIndex: 4,
  title: 'Morowa 17 (ep04)',
  loreFile: 'lore/ep04.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'wracajcie na strych',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00] the house at night
    { caption: { text: 'TAŚMA 1 · ODC. 04', pos: 'top' } },
    { at: 1, caption: { text: 'morowa noc', pos: 'bottom' } },

    // [00:00:03–00:00:27] the ghost with the rosary: "wracajcie na strych"
    { at: 3, location: 'chata', camera: 'door' },
    ...only('konon', KONON),
    { beat: { id: 'rozaniec', actors: ['konon'], need: 6 } },
    { at: 4, line: { text: 'odejdźcie duchy', speaker: 'konon', ...L } },
    { at: 6, line: { text: 'wracajcie na strych', speaker: 'konon', ...L } },
    { sfx: 'knock' }, { madness: 0.05 },
    { at: 8, line: { text: 'dlaczego wy tak robicie', speaker: 'konon', ...L } },
    { at: 10, line: { text: 'chcecie mnie wykończyć', speaker: 'konon', ...L } },
    { glitch: 0.6 }, { madness: 0.1 },
    { at: 13, line: { text: 'tak jak wojtka wykończyliście', speaker: 'konon', ...L } },
    { at: 23, line: { text: 'dość mnie tego', speaker: 'konon', ...L } },
    { at: 26, line: { text: 'cierpienia męczeństwa', speaker: 'konon', pos: { x: 30, y: 50 }, charInterval: 100 } },
    { at: 28, beatEnd: 'rozaniec' },
    { show: { id: 'konon', on: false } },

    // [00:00:33] the yard in daylight, then [00:00:37–00:00:50] "moje mleczko"
    { at: 28, black: 4500 },
    { at: 33, location: 'podworko', camera: 'plot' },
    { at: 37, location: 'strych', camera: 'stol' },
    ...only('konon', { x: 1.0, z: -0.3, face: 0 }),
    { beat: { id: 'mleczko', actors: ['konon'], need: 5 } },
    { line: { text: 'moje mleczko', speaker: 'konon', ...L } },
    { at: 40, line: { text: 'mi zostałeś tylko ty', speaker: 'konon', ...L } },
    { at: 44, line: { text: 'kurcze spleśniałe', speaker: 'konon', ...L } },
    { at: 46, line: { text: 'po rzadkiemu będzie', speaker: 'konon', ...L } },
    { at: 48, line: { text: 'ale to nic', speaker: 'konon', ...L } },
    { at: 51, beatEnd: 'mleczko' },

    // [00:00:52–00:01:28] the sofa with the zebra blanket and the poster wall; Major talks to someone off-screen
    { at: 52, camera: 'sofa' },
    ...only('major', { x: -0.2, z: -0.7, face: 0 }),
    { beat: { id: 'kanapa', actors: ['major'], need: 6 } },
    { line: { text: 'odwilż idzie', speaker: 'major', ...L } },
    { at: 55, line: { text: 'pogoda będzie', speaker: 'major', ...L } },
    { at: 56, camera: 'plakaty' },
    { line: { text: 'znów uciekłeś', speaker: 'major', ...L } },
    { at: 59, line: { text: 'dlaczego ty tak znikasz', speaker: 'major', ...L } },
    { at: 61, camera: 'sofa' }, { madness: 0.1 },
    { line: { text: 'przepraszam bardzo', speaker: 'major', ...L } },
    { at: 64, line: { text: 'dwa lata temu chciałeś sie mnie pozbyć', speaker: 'major', ...L } },
    { at: 67, line: { text: 'to sie pozbyłeś', speaker: 'major', ...L } },
    { glitch: 0.8 },
    { at: 70, camera: 'plakaty' },
    { line: { text: 'to jest nieprawda', speaker: 'major', ...L } },
    { at: 74, line: { text: 'trzeba wezwać łowce duchów', speaker: 'major', ...L } },
    { at: 77, line: { text: 'siedź cicho majorku', speaker: 'major', ...L } },
    { at: 78, camera: 'sofa' },
    { at: 79, line: { text: 'o majorku', speaker: 'major', ...L } },
    { sfx: 'creak' }, { glitch: 1 }, { madness: 0.15 },
    { at: 88, beatEnd: 'kanapa' },
    { show: { id: 'major', on: false } },

    // [00:01:30–00:01:36] the yard again, then black
    { at: 90, location: 'podworko', camera: 'plot' },
    { at: 96, black: 2000 },
  ],
};
