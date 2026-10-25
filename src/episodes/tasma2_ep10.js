// Level 20 — finale of the series, built from lore/ep20.md (00:00:00–00:03:51). Dialogue is verbatim; `at` = second of the original episode.
// Speakers are a working guess [?]: man A (`kardigan`, red cardigan, tiger sofa) eats and says "patrz jak jem", "o co ci chodzi", "ja normalnie sie zachowuje"; man B (`kogut`, rooster bib, by the window) says "krzysiek", "na mnie patrz", "dlaczego tak robisz ty"; "no jareczku" and "dziś obiadek z mamą" go to the figure in the doorway.
// OCR-only lines (no frame): "dziękuję tobie", "mi daje )", "hej na na na", "no jareczku", "dziś obiadek z mamą", "dobry; Zły i brzydki" (OCR punctuation kept, the leading quote mark is dropped as junk), "mmmmm", "delicje", "cóż za kunszt kulinarny", "krzysiek", "na mnie patrz", "dlaczego tak robisz ty" / "dlaczego tak wyrabiasz ty", "normalnie wyglądam" (the last two from lore_raw).
// Frame-confirmed: "teraz wszystkim ciepło" (bottom, yellow), "o co ci chodzi" (right, light), "ja normalnie sie zachowuje" (bottom, yellow). "O patrz jak jem" has the capital O as the OCR [?]. Not reproduced: the "TYSKIE" banner, the purple glowing object, the missing frames 03:23 / 03:36. The series ends on black — no end caption.
const L = { pos: 'bottom', charInterval: 100 };
const YELLOW = { pos: 'bottom', color: '#e8d870', charInterval: 100 };
const place = (id, x, z) => ({ place: { id, x, z, face: 0 } });
const hide = (...ids) => ids.map((id) => ({ show: { id, on: false } }));
export default {
  id: 'tasma2_ep10',
  tape: 2, index: 10, youtubeIndex: 20,
  title: 'Morowa 17 (ep20)',
  loreFile: 'lore/ep20.md',
  status: 'wip',
  location: 'podworko',
  startCamera: 'front',
  letter: 'teraz wszystkim ciepło',
  items: { kaseta: 1, bateria: 1, wegiel: 1, klodka: 1, przysmak: 1 },
  duties: {},
  steps: [
    // [00:00:00–00:00:34] the house at dusk, the kitchen stove with fire, the pot
    { caption: { text: 'TAŚMA 2 · ODC. 20', pos: 'top' } }, { tint: 1 },
    { at: 3, location: 'chata', camera: 'stove' }, { tint: 0 }, place('konon', 1.4, -0.9),
    { beat: { id: 'piec', actors: ['konon'], need: 8 } },
    { at: 7, line: { text: 'dziękuję tobie', speaker: 'konon', ...L } },
    { at: 16, line: { text: 'mi daje )', speaker: 'konon', ...L } },
    { at: 26, glitch: 0.3 },
    { at: 36, line: { text: 'hej na na na', speaker: 'konon', ...L } },
    { at: 40, beatEnd: 'piec' }, ...hide('konon'),

    // [00:00:45–00:01:28] winter: the suitcase in the snow, the hooded figure at the door, a smile in the dark
    { at: 45, location: 'zima', camera: 'walizka' }, { tint: 1 },
    { caption: { text: 'teraz wszystkim ciepło', ...YELLOW } },
    { beat: { id: 'zima', actors: ['kaptur'], need: 8 } },
    { at: 50, ...place('kaptur', 2.8, 1.8) },
    { at: 53, camera: 'krata' }, place('kaptur', 0.6, -0.6),
    { at: 56, glitch: 0.4 },
    { at: 62, camera: 'krata' },
    { at: 68, beatEnd: 'zima' }, ...hide('kaptur'), { tint: 0 },
    { at: 70, black: 3000 },
    { at: 74, location: 'lazienka', camera: 'twarz' }, place('czerwonooki', -1.0, -0.5), { glitch: 0.9 }, { madness: 0.15 },
    { at: 77, line: { text: 'no jareczku', speaker: 'czerwonooki', ...L } },
    { at: 80, line: { text: 'dziś obiadek z mamą', speaker: 'czerwonooki', ...L } },
    { at: 86, ...hide('czerwonooki') },
    { at: 88, black: 2000 },

    // [00:01:30–00:02:20] night, the green table, the tiger sofa: "patrz jak jem"
    { at: 90, location: 'podworko', camera: 'front' }, { tint: 1 },
    { at: 92, line: { text: 'dobry; Zły i brzydki', speaker: 'tasma', ...L } },
    { at: 94, location: 'lazienka', camera: 'blat' }, { tint: 0 }, place('kardigan', -1.2, 0.2),
    { beat: { id: 'obiad', actors: ['kardigan', 'kogut'], need: 10 } },
    { line: { text: 'mmmmm', speaker: 'kardigan', ...L } },
    { at: 99, line: { text: 'delicje', speaker: 'kardigan', ...L } },
    { at: 103, location: 'strych', camera: 'sofa' }, place('kardigan', -0.4, -0.6),
    { line: { text: 'cóż za kunszt kulinarny', speaker: 'kardigan', ...L } },
    { at: 106, location: 'lazienka', camera: 'blat' }, place('kardigan', -1.2, 0.2),
    { line: { text: 'O patrz jak jem', speaker: 'kardigan', ...L } },
    { at: 110, location: 'chata', camera: 'window' }, ...hide('kardigan'), place('kogut', 1.4, 0.4),
    { line: { text: 'krzysiek', speaker: 'kogut', ...L } },
    { at: 114, line: { text: 'na mnie patrz', speaker: 'kogut', ...L } },
    { at: 116, location: 'strych', camera: 'sofa' }, ...hide('kogut'), place('kardigan', -0.4, -0.6),
    { at: 119, line: { text: 'o co ci chodzi', speaker: 'kardigan', pos: { x: 72, y: 90 }, color: '#f0f0e0', charInterval: 100 } },
    { at: 122, location: 'chata', camera: 'window' }, ...hide('kardigan'), place('kogut', 1.4, 0.4),
    { line: { text: 'dlaczego tak robisz ty', speaker: 'kogut', ...L } },
    { at: 128, line: { text: 'dlaczego tak wyrabiasz ty', speaker: 'kogut', ...L } },
    { at: 132, beatEnd: 'obiad' }, ...hide('kogut'),

    // [00:02:13–00:02:52] the white face with a skull grin, the yellow eyes, the dark room
    { at: 133, location: 'strych', camera: 'sofa' }, place('kardigan', -0.4, -0.6),
    { beat: { id: 'twarz', actors: ['kardigan'], need: 6 } },
    { line: { text: 'ja normalnie sie zachowuje', speaker: 'kardigan', ...YELLOW } },
    { at: 135, line: { text: 'normalnie wyglądam', speaker: 'kardigan', ...L } }, { glitch: 0.7 }, { madness: 0.15 },
    { at: 140, location: 'lazienka', camera: 'twarz' }, ...hide('kardigan'), place('kardigan', -1.0, -0.5), { glitch: 0.9 },
    { at: 143, ...place('zoltooki', -1.0, -0.5) }, { madness: 0.1 },
    { at: 150, location: 'strych', camera: 'sofa' }, ...hide('zoltooki'),
    { at: 163, glitch: 0.6 },
    { at: 172, location: 'lazienka', camera: 'twarz' }, { glitch: 1 },
    { at: 176, beatEnd: 'twarz' }, ...hide('kardigan'),

    // [00:03:12–00:03:51] the dark passage with the plaid figure; the end
    { at: 192, location: 'piwnica', camera: 'korytarz' }, place('konon', -0.6, 0.3), { tint: 1 },
    { beat: { id: 'przejscie', actors: ['konon'], need: 6 } },
    { at: 200, glitch: 0.5 },
    { at: 210, glitch: 0.8 },
    { at: 216, beatEnd: 'przejscie' }, ...hide('konon'),
    { at: 231, black: 4000 },
  ],
};
