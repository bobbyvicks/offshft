// Fleece shorts, Independent Trading IND20SRT. Size M: waist 360 mm flat, hips 520 mm, outseam 500 mm, leg opening
// 320 mm across each leg. Relaxed men's cut that ends above the knee: elastic rib waistband with a drawcord, angled side
// pockets, topstitched hems (the shared drawing in _bottoms.cjs).
// The clock goes on the lower front of the wearer's left leg, 70 mm above the hem.
'use strict';
const { V } = require('./_bezier.cjs');
const { bottoms } = require('./_bottoms.cjs');

module.exports = (kit) => bottoms(kit, {
  name: 'shorts',
  waist: { halfW: 180, band: 40, round: 4 },
  hip: { halfW: 262, y: 180, leave: 36, dir: V(83, 320), handles: [60, 55] },     // rounds into the straight flare below
  crotch: 275,
  outseam: { points: [V(345, 500)], end: V(83, 320) },               // straight down to the hem's outer corner
  inseam: { start: V(0.36, 1), points: [V(28, 478)], end: V(0.02, 1) }, // opens from the crotch, then straight to the hem
  hem: { depth: 20 },
  pocket: { x: 140, y: 160, bow: 3 },
  cord: { x: 12, y: 20, length: 160, width: 8, drift: 3, tip: 16 },
  leftLeg: { above: 70 },
});
