// Level 6 — (00:00:00–00:01:51). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: the host in the plaid jersey = Konon, the grinning guest ("pan") = `gosc`. The lore marks all of them [?].
// OCR fixes after the frames: "poczęstuje pana nalewką" (OCR had the words shuffled), "teraz pan jesteś mój" (same), "i napijemy sie" (frame only).
// Cut-off OCR fragments are used only where a clean word is left: "pomóż pan" (from "...ałeś to pomóż pan przyjech"), "wypędzisz duchy? pan" (from "ypędzisz duchy? pan").
const L = { pos: 'bottom', charInterval: 100 };
const HOST = { x: -1.0, z: -0.5, face: 0 }, GUEST = { x: -0.3, z: 0.1, face: 0 };
const T_HOST = { x: 1.55, z: 0.3, face: 0 }, T_GUEST = { x: 0.45, z: 0.3, face: 0 };
const both = (a, b) => [{ place: { id: 'konon', ...a } }, { place: { id: 'gosc', ...b } }];
const hide = [{ show: { id: 'konon', on: false } }, { show: { id: 'gosc', on: false } }];
export default {
  id: 'tasma1_ep06',
  tape: 1, index: 6, youtubeIndex: 6,
  title: 'Morowa 17 (ep06)',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'trzeba odprawić rytuał',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00] the house
    { caption: { text: 'TAŚMA 1 · ODC. 06', pos: 'top' } },

    // [00:00:04–00:00:41] the tiled room: the host asks the guest to drive out the ghosts, "ale w nocy"
    { at: 4, location: 'lazienka', camera: 'izba' },
    ...both(HOST, GUEST),
    { beat: { id: 'izba', actors: ['konon', 'gosc'], need: 8 } },
    { at: 5, line: { text: 'pomóż pan', speaker: 'konon', ...L } },
    { at: 9, line: { text: 'wypędzisz duchy? pan', speaker: 'konon', ...L } },
    { at: 13, line: { text: 'trzeba odprawić rytuał', speaker: 'gosc', ...L } },
    { at: 17, line: { text: 'ale w nocy', speaker: 'gosc', ...L } },
    { at: 19, line: { text: 'broń BOŻE w dzień', speaker: 'gosc', ...L } }, { glitch: 0.5 },
    { at: 23, line: { text: 'tylko po strychu nie łaź mnie', speaker: 'konon', ...L } }, { sfx: 'knock' },
    { at: 25, line: { text: 'broń BOŻE', speaker: 'konon', pos: { x: 35, y: 90 }, charInterval: 100 } },
    { at: 28, line: { text: 'ciszej bo mama śpi', speaker: 'gosc', ...L } },
    { at: 33, line: { text: 'poczęstuje pana nalewką', speaker: 'konon', ...L } },
    { at: 36, line: { text: 'zaczekajmy do nocy', speaker: 'gosc', ...L } },
    { at: 39, line: { text: 'i napijemy sie', speaker: 'gosc', ...L } },
    { at: 41, beatEnd: 'izba' },
    ...hide,

    // [00:00:42–00:00:48] the house at night, the yellow window
    { at: 42, location: 'podworko', camera: 'front' },

    // [00:00:49–00:01:03] the table: the tincture
    { at: 49, location: 'strych', camera: 'stol' },
    ...both(T_HOST, T_GUEST),
    { beat: { id: 'nalewka', actors: ['konon', 'gosc'], need: 8 } },
    { at: 51, line: { text: 'napij sie pan', speaker: 'konon', ...L } },
    { at: 54, line: { text: 'mamusia sama zrobiła', speaker: 'konon', ...L } },
    { at: 57, line: { text: 'i zaczynaj pan', speaker: 'konon', ...L } },
    { at: 62, beatEnd: 'nalewka' },
    ...hide,

    // [00:01:04–00:01:51] "15 minut później": it was not a tincture
    { at: 64, location: 'podworko', camera: 'front' },
    { caption: { text: '15 minut później', pos: 'center' } },
    { at: 68, location: 'strych', camera: 'stol' },
    ...both(T_HOST, T_GUEST),
    { beat: { id: 'noc', actors: ['konon', 'gosc'], need: 8 } },
    { at: 74, line: { text: 'to nie jest nalewka', speaker: 'gosc', ...L } }, { glitch: 0.8 }, { madness: 0.1 },
    { at: 85, line: { text: 'co sie dzieje', speaker: 'gosc', ...L } },
    { at: 89, line: { text: 'czuje sie taki samotny', speaker: 'gosc', ...L } },
    { at: 93, line: { text: 'wypiłeś pan mój napój', speaker: 'konon', ...L } },
    { at: 96, line: { text: 'teraz pan jesteś mój', speaker: 'konon', ...L } },
    { at: 103, line: { text: 'czujesz go pan?', speaker: 'konon', ...L } }, { sfx: 'creak' },
    { at: 109, line: { text: 'to będzie wspaniała noc', speaker: 'konon', ...L } }, { glitch: 1 }, { madness: 0.15 },
    { at: 111, beatEnd: 'noc' },
    { black: 2000 }, // black frame at the end of the original
  ],
};
