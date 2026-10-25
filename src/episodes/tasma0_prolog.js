// PROLOG / TEST SCENE (sandbox: no verdict). Not part of the original series. Demo lines are NOT original dialogue.
// Use it to check the engine: camcorder, beats, duties, typewriter, inventory, voice layers, sanity, glitches.
export default {
  id: 'tasma0_prolog',
  tape: 0, index: 0, youtubeIndex: 0,
  title: 'Taśma Zerowa (prolog / test)',
  status: 'wip',
  sandbox: true,
  letter: 'TEST: Szanowny Panstwo, zglaszam wlaz.',
  duties: { hatch: { first: 25, every: [40, 60] }, dog: { first: 45, every: [50, 70] }, stove: { decay: 0.01 } },
  steps: [
    { place: { id: 'konon', x: 0.9, z: -1.2, face: 2.4 } },
    { place: { id: 'major', x: 0.2, z: -0.4, face: 2.9 } },
    { caption: { text: 'TAŚMA 0 — NAGRANIE TESTOWE', pos: 'top' } },
    { caption: { text: 'Trzymaj PPM / Spację: wizjer. Trzymaj Konona i Majora w kadrze.', pos: 'bottom' } },
    { beat: { id: 'test', actors: ['konon', 'major'], need: 12 } },
    { wait: 800 },
    { line: { text: 'TEST: dom oddycha. sluchaj.', speaker: 'konon', pos: 'bottom' } },
    { overlap: [
      { line: { text: 'TEST: nie otwieraj włazu.', speaker: 'major', pos: 'left' } },
      { line: { text: 'TEST: otwórz.', speaker: 'strych', pos: 'right', color: '#9fb07a' } },
    ] },
    { wait: 20000 },
    { beatEnd: 'test' },
    { caption: { text: 'Puść wizjer: kamery 1-5, biurko = pisanie, właz = kłódka, piec = węgiel, okno = przysmak.', pos: 'bottom' } },
  ],
};
