// Yupoong 6606 Retro Trucker: structured, mid profile (89 mm crown), 6 panels. The two front panels are solid,
// buckram-stiffened twill joined by a centre seam; the side and back panels are mesh. Pre-curved visor with
// 8 rows of stitching. Snap closure at the back (not visible from the front).
'use strict';
const cap = require('./_cap.cjs');

module.exports = (kit) => cap(kit, {
  name: 'trucker',
  crownH: 89,
  shape: { top: 0.72, side: 0.62, lean: 3 },
  panels: 6,
  frontAz: 55,
  mesh: { cell: 2.6, until: 87 },
  visor: { centre: 15, drop: 21, rows: 8, first: 0.06, gap: 0.075 },
});
