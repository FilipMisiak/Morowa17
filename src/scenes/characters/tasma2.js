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
  // ep12: pale green face with glowing yellow eyes and an open red mouth
  garbDef({ id: 'zoltooki', height: 1.76, face: face({ w: 60, h: 80, skin: [150, 170, 138], hair: [150, 170, 138], glow: [240, 220, 40], teeth: [230, 226, 190], stubble: 0, jaw: 0.04, brow: 3, seed: 76 }), torso: '#10120e', pants: '#14161a' }),
  // ep13: the masked one, grey-brown wrinkled face, deep black sockets with red LED points, black hood, dark green hoodie
  garbDef({ id: 'czerwonooki', height: 1.8, face: face({ w: 66, h: 80, skin: [130, 118, 98], hair: [14, 14, 12], glow: [255, 20, 10], teeth: [200, 190, 160], nose: 0.2, jaw: 0.08, brow: 9, stubble: 0, seed: 77 }), torso: '#1c2a1c', pocket: '#142014', pants: '#101410', hat: { kind: 'hood', color: '#0c120c' } }),
  // ep13: heavy man in light striped shorts and a dark tee
  garbDef({ id: 'szorty', height: 1.78, face: face({ w: 66, h: 78, skin: [182, 160, 130], hair: [30, 24, 18], stubble: 80, jaw: 0.06, seed: 78 }), torso: '#16161a', pants: '#a8c8a0' }),
  // ep13: older man, green cap, rusty sweater with a cream collar, dark gloves
  garbDef({ id: 'rudy', height: 1.74, face: face({ w: 64, h: 78, skin: [176, 150, 124], hair: [110, 104, 96], stubble: 100, jaw: 0.06, seed: 79 }), torso: '#9a5a2c', pocket: '#caa878', pants: '#2a2a28', gloves: '#14120e', hat: { kind: 'cap', color: '#3a6a34' } }),
  // ep13: bald man in black sunglasses and a green pocket shirt
  garbDef({ id: 'okularnik', height: 1.8, face: face({ w: 64, h: 80, skin: [190, 170, 146], hair: [190, 170, 146], glow: [8, 8, 8], stubble: 20, jaw: 0.04, seed: 80 }), torso: '#4a6a3a', pocket: '#e0e0cc', pants: '#2a2c2e', gloves: '#14120e' }),
  // ep15: stocky man, buzz cut, yellow hi-vis vest over a red-brown shirt (reads the letter from the Mexican)
  garbDef({ id: 'kamizelka', height: 1.72, face: face({ w: 66, h: 76, skin: [168, 146, 122], hair: [30, 26, 22], stubble: 90, jaw: 0.08, seed: 81 }), torso: '#6a3a2c', vest: '#c8d020', pants: '#24262a' }),
  // ep15: balding man in a floral / camo jacket, holds a bundle in the doorway
  garbDef({ id: 'kwiat', height: 1.74, face: face({ w: 62, h: 78, skin: [160, 146, 130], hair: [40, 34, 28], glow: [220, 200, 180], stubble: 70, jaw: 0, seed: 82 }), torso: '#4a5a3a', pocket: '#8a9a70', pants: '#1c1c1e' }),
  // ep16: man in an orange-brown waffle-knit sweater with a yellow-orange bag on the hip, dark short hair
  garbDef({ id: 'kratka', height: 1.74, face: face({ w: 62, h: 78, skin: [170, 148, 124], hair: [26, 22, 18], stubble: 70, seed: 83 }), torso: '#a8602c', pocket: '#e0a030', pants: '#6a707a' }),
  // ep16: stocky man in a felt hat, grey-dark face with black sockets, rusty-orange shirt with a blue badge, big belly
  garbDef({ id: 'kapelusznik', height: 1.72, face: face({ w: 70, h: 80, skin: [120, 120, 112], hair: [60, 60, 52], glow: [230, 40, 30], stubble: 40, jaw: 0.1, nose: 0.16, seed: 84 }), torso: '#b8662a', pocket: '#3a62c8', pants: '#101012', hat: { kind: 'bucket', color: '#6a6a52' } }),
  // ep16: bald man in wrap-around sunglasses holding a paper sign, dark high-collar hoodie
  garbDef({ id: 'lysy', height: 1.76, face: face({ w: 64, h: 78, skin: [150, 112, 84], hair: [150, 112, 84], glow: [6, 6, 6], stubble: 40, seed: 85 }), torso: '#16161a', pants: '#26282a' }),
  // ep17: the poet — long black coat, wide-brim black hat, curly light hair, thin pensive face
  garbDef({ id: 'poeta', height: 1.76, face: face({ w: 54, h: 80, skin: [196, 182, 156], hair: [200, 190, 150], glow: [200, 170, 80], stubble: 10, jaw: -0.1, brow: 4, curly: true, seed: 86 }), torso: '#0c0c0c', pants: '#0c0c0c', hat: { kind: 'bucket', color: '#0a0a0a' } }),
  // ep17: thin man in a red blazer, striped tie, light-brown hair combed aside
  garbDef({ id: 'czerwona', height: 1.76, face: face({ w: 56, h: 80, skin: [190, 168, 144], hair: [150, 116, 80], stubble: 20, jaw: -0.06, seed: 87 }), torso: '#a82020', pocket: '#d8d0c0', pants: '#1c1c20' }),
];
