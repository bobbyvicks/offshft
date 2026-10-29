// Big Accessories BA671 golf rope cap (89 mm crown). A 5-panel cap: one seamless, lined front panel with seams only at
// its two sides, so there is no centre seam and the logo stays centred (build.cjs gives it no seam shift). Its
// signature is a contrast twisted rope laid across the top of the visor where it meets the crown, its ends tucked in
// towards the visor's sides. The visor is flatter than the other caps: sellers call it semi-curved.
//
// Panel count: Printful files the BA671 under its 5-panel hats ("Unstructured, 5-panel, front panel lined"), and
// Blankstyle and Walmart sell it as the "5-Panel Golf Cap". Printful says unstructured and Blankstyle
// semi-structured; the crown is drawn with the same profile as the trucker's.
'use strict';
const cap = require('./_cap.cjs');

const PANELS = 5;

module.exports = (kit) => cap(kit, {
  name: 'rope-cap',
  crownH: 89,
  shape: { top: 0.72, side: 0.62, lean: 3 },
  panels: PANELS,
  frontAz: 55,
  visor: { centre: 15, drop: 10, rows: 4, first: 0.08, gap: 0.11, angle: 26 },
  rope: { radius: 2.4, reach: 86, tuck: 10, lift: 1.4, pitch: 3.2, gap: 0.75, slant: 0.9 },
});
