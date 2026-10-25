// Level 9 — built from lore/ep09.md (00:00:00–00:02:46). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: Major cooks and calls Konon "krzysztofie"; Konon thanks him; Wojtek (Major) lies in the bedroom;
// the masked "męczennik" sits on the sofa and shows up as a face in the bricks.
// Frame/OCR choices: "jaki męczennik" follows the frame (OCR had "męczennik jaki"); "0 toluen" is kept as the OCR has it [?];
// the poster "2016" and the "bigos z niespodzianką" caption position are not reproduced.
const L = { pos: 'bottom', charInterval: 100 };
const LEFT = { pos: { x: 30, y: 90 }, charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
const HOSTS = [place('major', 1.55, 0.3), place('konon', 0.45, 0.3)];
export default {
  id: 'tasma1_ep09',
  tape: 1, index: 9, youtubeIndex: 9,
  title: 'Morowa 17 (ep09)',
  loreFile: 'lore/ep09.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'zwiastun śmierci',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:09] the house, the yard: "zwiastun"
    { caption: { text: 'TAŚMA 1 · ODC. 09', pos: 'top' } },
    { at: 2, caption: { text: 'zwiastun', pos: 'center' } },
    { at: 4, camera: 'plot' },
    { at: 6, line: { text: 'tu jestes', speaker: 'major', ...L } },

    // [00:00:09–00:00:29] the dead animal in the grass
    { at: 9, location: 'ogrod', camera: 'brama' },
    { beat: { id: 'ogrod', actors: [], need: 5 } },
    { at: 10, line: { text: 'ledwo zywa', speaker: 'major', ...L } },
    { at: 14, location: 'lazienka', camera: 'twarz' }, place('major', -1.0, -0.5),
    { beat: { id: 'twarz', actors: ['major'], need: 3 } },
    { at: 15, line: { text: 'trzeba dobić', speaker: 'major', ...L } }, { madness: 0.05 },
    { at: 17, beatEnd: 'twarz' }, ...hide('major'),
    { at: 17, location: 'ogrod', camera: 'brama' },
    { at: 21, line: { text: 'zdechła', speaker: 'major', ...L } },
    { at: 22, camera: 'trawa' },
    { at: 23, line: { text: 'i coś wypluła', speaker: 'major', ...L } },
    { at: 29, beatEnd: 'ogrod' },

    // [00:00:30–00:00:43] the bigos
    { at: 30, location: 'chata', camera: 'stove' },
    place('major', 1.4, -0.9),
    { beat: { id: 'kolacja', actors: ['major'], need: 6 } },
    { at: 32, line: { text: 'kolacja gotowa krzysztofie', speaker: 'major', ...L } },
    { at: 38, line: { text: 'jeszcze kompot usmażyłem', speaker: 'major', ...L } },
    { at: 42, line: { text: 'twój ulubiony', speaker: 'major', ...L } },
    { at: 43, beatEnd: 'kolacja' }, ...hide('major'),

    // [00:00:44–00:01:35] the table: the milk, "bigos z niespodzianką", "dobranoc wojtek"
    { at: 44, location: 'strych', camera: 'stol' },
    ...HOSTS,
    { beat: { id: 'stol', actors: ['major', 'konon'], need: 8 } },
    { at: 45, line: { text: 'dziękuję bardzo tobie', speaker: 'konon', ...L } },
    { at: 49, line: { text: 'smacznego', speaker: 'major', ...L } },
    { at: 54, line: { text: 'pyszna kolacja', speaker: 'konon', ...L } },
    { at: 58, line: { text: 'mleczka trzeba dolać', speaker: 'major', ...L } },
    { at: 66, line: { text: '0 toluen', speaker: 'major', ...L } }, { madness: 0.1 },
    { at: 71, line: { text: 'ale pyszne', speaker: 'konon', ...L } },
    { at: 74, line: { text: 'jak to nazwałeś?', speaker: 'konon', ...L } },
    { at: 78, line: { text: 'bigos z niespodzianką', speaker: 'major', ...L } },
    { at: 82, line: { text: 'my na warmii już takie robili', speaker: 'major', ...L } },
    { at: 89, line: { text: 'pora iść spać', speaker: 'major', ...LEFT } },
    { at: 91, line: { text: 'dobranoc wojtek', speaker: 'major', ...LEFT } },
    { at: 95, beatEnd: 'stol' }, ...hide('major', 'konon'),
    { at: 96, black: 1500 }, // black frame

    // [00:01:38–00:01:50] the house, the bedroom: "kurwa diabeł"
    { at: 98, location: 'podworko', camera: 'front' },
    { at: 101, location: 'chata', camera: 'door' },
    place('major', -0.9, -0.6),
    { beat: { id: 'sypialnia', actors: ['major'], need: 4 } },
    { at: 108, line: { text: 'kurwa diabeł', speaker: 'major', ...L } }, { glitch: 0.6 },
    { at: 110, beatEnd: 'sypialnia' }, ...hide('major'),

    // [00:01:51–00:02:46] the martyr on the sofa and in the bricks
    // [00:01:49] the broad man in the brown jacket at the table
    { at: 109, location: 'strych', camera: 'stol' }, place('brazowy', 1.5, 0.3),
    { at: 111, location: 'chata', camera: 'door' }, ...hide('brazowy'),
    place('meczennik', -0.9, -0.6), place('konon', -0.1, 0.4),
    { beat: { id: 'meczennik', actors: ['meczennik'], need: 6 } },
    { at: 115, line: { text: 'czemu tu siedzisz wojtek', speaker: 'konon', ...L } },
    { at: 118, location: 'piwnica', camera: 'twarz' }, place('meczennik', 0.0, -1.0), ...hide('konon'),
    { at: 121, line: { text: 'nie patrz w okno', speaker: 'meczennik', ...L } }, { glitch: 0.7 },
    { at: 125, location: 'chata', camera: 'door' }, place('meczennik', -0.9, -0.6), place('konon', -0.1, 0.4),
    { line: { text: 'co sie dzieje', speaker: 'konon', ...L } },
    { at: 130, location: 'piwnica', camera: 'twarz' }, place('meczennik', 0.0, -1.0), ...hide('konon'),
    { line: { text: 'tam stoi on', speaker: 'meczennik', ...L } },
    { at: 137, line: { text: 'kto', speaker: 'konon', ...L } },
    { at: 139, line: { text: 'męczennik', speaker: 'meczennik', ...L } }, { madness: 0.1 },
    { at: 144, location: 'chata', camera: 'door' }, place('meczennik', -0.9, -0.6), place('konon', -0.1, 0.4),
    { line: { text: 'jaki męczennik', speaker: 'konon', ...L } },
    { at: 150, beatEnd: 'meczennik' }, ...hide('meczennik', 'konon'),

    // [00:02:32–00:02:46] the house in blue, "zwiastun śmierci"
    { at: 152, location: 'podworko', camera: 'front' }, { tint: 1 },
    { at: 153, line: { text: 'nie chce odejść', speaker: 'konon', ...L } },
    { at: 156, line: { text: 'stoi i patrzy', speaker: 'konon', ...L } },
    { at: 160, location: 'piwnica', camera: 'twarz' }, place('konon', 0.0, -1.0),
    { line: { text: 'zwiastun śmierci', speaker: 'konon', pos: 'bottom', color: '#e8dca0', charInterval: 100 } },
    { glitch: 1 }, { madness: 0.15 },
    { at: 163, black: 1500 }, { tint: 0 },
  ],
};
