// Yupoong 6245CM Classic Dad Hat: unstructured, low profile (78 mm crown), 6 panels with a centre seam. No buckram,
// so the crown is softer, lower and rounder and the front panels slouch into soft creases. Sewn eyelets on the
// panels, pre-curved visor with 4 rows of stitching. Buckle strap at the back (not visible from the front).
'use strict';
const cap = require('./_cap.cjs');

module.exports = (kit) => cap(kit, {
  name: 'dad-hat',
  crownH: 78,
  shape: { top: 0.62, side: 0.5, lean: 5 },
  panels: 6,
  frontAz: 55,
  eyelets: [{ az: 28, h: 0.7 }, { az: 66, h: 0.58 }],
  creases: [
    { ridge: [[71, 3], [68, 11], [62, 19], [53, 27]], depth: 1.6 },
    { ridge: [[58, 2], [56, 7], [52, 11], [46, 15]], depth: 1.1 },
  ],
  visor: { centre: 15, drop: 21, rows: 4, first: 0.08, gap: 0.11 },
});
