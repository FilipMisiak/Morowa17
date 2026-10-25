import { garbDef } from './garb.js';

/** Minor characters of tape 2, drawn from the frames in lore/ep11–ep20 (see each lore file's "Wygląd"). Add new ones at the end. */
const face = (o) => ({ w: 62, h: 78, skin: [168, 160, 130], hair: [20, 18, 14], glow: [220, 200, 80], teeth: [218, 208, 172], nose: 0.12, jaw: 0, brow: 6, stubble: 60, curly: false, part: false, seed: 70, ...o });

export default [
  // ep11: gaunt man with a turquoise flat cap and a black T-shirt with an animal print
  garbDef({ id: 'czapka', height: 1.74, face: face({ skin: [176, 168, 138], hair: [120, 118, 110], stubble: 90, jaw: -0.05, seed: 71 }), torso: '#0c0c0c', pants: '#22262c', hat: { kind: 'flat', color: '#3aa8a0' } }),
  // ep11: green bucket hat, black T-shirt with a crest
  garbDef({ id: 'kapelusz', height: 1.76, face: face({ skin: [150, 150, 120], seed: 72 }), torso: '#101010', pocket: '#303030', pants: '#1c2028', hat: { kind: 'bucket', color: '#4a7a3a' } }),
  // ep11: broad man, lime hoodie, thick jaw, dark gloves
  garbDef({ id: 'bluza', height: 1.8, face: face({ w: 68, h: 80, skin: [172, 150, 124], jaw: 0.08, stubble: 110, seed: 73 }), torso: '#b8c030', pocket: '#98a028', pants: '#1c1c20', gloves: '#14120e' }),
  // ep11: stocky man in a grey-green jacket with a white patch
  garbDef({ id: 'szarak', height: 1.72, face: face({ w: 66, h: 76, skin: [170, 152, 126], jaw: 0.06, stubble: 100, seed: 74 }), torso: '#6a7260', pocket: '#e0e0d0', pants: '#26282a' }),
  // ep11: the gaunt bald one with red points for eyes in front of the house
  garbDef({ id: 'chudy', height: 1.78, face: face({ w: 58, h: 82, skin: [186, 190, 180], hair: [186, 190, 180], glow: [230, 30, 20], stubble: 0, jaw: -0.1, brow: 3, seed: 75 }), torso: '#0a0a0a', pants: '#14141a' }),
];
