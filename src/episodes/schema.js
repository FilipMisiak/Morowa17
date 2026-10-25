/**
 * EPISODE MODULE CONTRACT (one file per episode in src/episodes/, e.g. tasma1_ep01.js)
 *
 * export default {
 *   id: 'tasma1_ep01',          // = file name; tape N, episode NN
 *   tape: 1,                    // 1 = Wiosna (ep 1-10), 2 = Lato (ep 11-20)
 *   index: 1,                   // position inside the tape (1..10)
 *   youtubeIndex: 1,            // position in the YouTube playlist (1..20)
 *   title: '...',               // title of the original episode
 *   status: 'stub' | 'wip' | 'done',
 *   sandbox: false,             // true = no verdict at the end (prologue)
 *   startCamera: 'door',        // camera node the level opens on
 *   letter: '...',              // text of the typewriter letter (verbatim from the lore)
 *   items: { kaseta: 1, bateria: 1, wegiel: 2, klodka: 1, przysmak: 2 },   // starting inventory
 *   duties: {                   // chores announced by sound; omit a key = that chore never fires
 *     hatch: { first: 20, every: [30, 45] },   // needs camera 'hatch' + item klodka
 *     dog:   { first: 40, every: [40, 60] },   // needs camera 'window' + item przysmak
 *     stove: { decay: 0.012 },                 // fire drains continuously; needs camera 'stove' + wegiel
 *   },
 *
 *   setup(ctx) {},              // optional: build/modify world (ctx = { scene, cabin, rig, cameras }) before steps run
 *   teardown(ctx) {},           // optional
 *
 *   steps: [                    // run top to bottom, awaited one by one
 *     { camera: 'desk' },                                       // cut to a camera node (with VHS glitch)
 *     { line: { text: '...', speaker: 'gospodarz', pos: 'bottom', color: '#d8c9a3' } },   // subtitle + voice + chatter
 *     { caption: { text: '...', pos: 'top' } },                 // on-screen tape text (chatter only)
 *     { say: { text, speaker } },                               // voice-only line
 *     { black: 2000, burn?: true },                              // ms of black screen (burn = cream, burnt tape)
 *     { tint: 0|1 },                                             // 1 = night-blue grade of the picture
 *     { wait: 1500 },                                           // ms
 *     { overlap: [ {line:{...}}, {line:{...}} ] },              // start several at once on purpose (possessed overlap)
 *     { sfx: 'knock' | 'creak' | 'cut' | 'bowl' | 'silence' },  // see audio/drone.js
 *     { glitch: 1 },                                            // VHS glitch impulse 0..1
 *     { madness: +0.1 },                                        // add / subtract madness
 *     { set: { flagName: true } },                              // state.flags
 *     { waitFor: 'interact:hatch' },                            // wait for a bus event (click on hotspot, etc.)
 *     { place: { id: 'konon', x, z, face } },                   // actors: 'konon' | 'major' | 'shade' | 'dog'
 *     { walk:  { id: 'major', x, z, secs } },                   // walk there (does not block the next step)
 *     { show:  { id: 'shade', on: true } },
 *     { beat: { id: 'rozmowa', actors: ['konon', 'major'], need: 6 } },  // a shot to film: `need` s with ALL actors in frame
 *     { beatEnd: 'rozmowa' },                                   // closes the window; sum of all `need` = 100% footage
 *     { give: 'wegiel' },                                       // add an item (or { item, n })
 *     { duty: { hatch: { first: 3, every: [60, 90] } } },       // replace the duty schedule mid-level
 *     { run: async (ctx) => {} },                               // ctx = { scene, cabin, rig, actors, recording, duties }
 *   ],
 * };
 *
 * Won when coverage >= 99.5% at the end of the steps; lost on 3 strikes, madness 1.0 or missing footage.
 * Use the real timestamps of the original episode for ordering and pacing, and keep dialogue VERBATIM.
 */
export {};
