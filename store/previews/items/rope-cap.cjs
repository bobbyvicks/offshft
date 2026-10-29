// Big Accessories BA671 golf rope cap: structured (89 mm crown), drawn as 6 panels with a centre seam. Its signature
// is a contrast twisted rope laid across the top of the visor where it meets the crown, its ends tucked in towards
// the visor's sides. The visor is flatter than the other caps: only slightly curved.
//
// Panel count unconfirmed: Printful's and Blankstyle's listings call the BA671 a 5-panel cap with a lined front
// panel. If that holds, set PANELS = 5 (one seamless front, no centre seam) and drop the 5.2 mm shift for rope-cap
// in build.cjs, so the lockup sits centred.
'use strict';
const cap = require('./_cap.cjs');

const PANELS = 6;

module.exports = (kit) => cap(kit, {
  name: 'rope-cap',
  crownH: 89,
  shape: { top: 0.72, side: 0.62, lean: 3 },
  panels: PANELS,
  frontAz: 55,
  visor: { centre: 15, drop: 10, rows: 4, first: 0.08, gap: 0.11, angle: 26 },
  rope: { radius: 2.4, reach: 86, tuck: 10, lift: 1.4, pitch: 3.2, gap: 0.75, slant: 0.9 },
});
