// Otto Cap 31-069 5 Panel Mid Profile Baseball Cap: structured, mid profile (86 mm crown), 5 panels. One wide,
// seamless, stiffened front panel covers most of the front, with seams only at its two sides; the side panels
// show at the edges. Sewn eyelets: two high on the front panel (sellers note Otto's running change to tonal
// front-panel eyelets) and one on each side panel; Printful lists 6 in all. Curved visor (6 rows of stitching: not
// confirmed for this blank). No centre seam, so the logo stays centred.
'use strict';
const cap = require('./_cap.cjs');

module.exports = (kit) => cap(kit, {
  name: 'five-panel',
  crownH: 86,
  shape: { top: 0.72, side: 0.62, lean: 3 },
  panels: 5,
  frontAz: 55,
  eyelets: [{ az: 28, h: 0.7 }, { az: 66, h: 0.6 }],
  visor: { centre: 15, drop: 21, rows: 6, first: 0.07, gap: 0.085 },
});
