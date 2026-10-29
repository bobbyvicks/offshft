// Fleece sweatpants: Comfort Colors 1469, Bella + Canvas 4737, Cotton Heritage M7580 and Jerzees 975MPR.
// Size M: waist 360 mm flat, hips 520 mm, outseam 1040 mm, inseam 760 mm, crotch 280 mm below the top. The legs taper
// from the thigh to 230 mm at the knee and 150 mm above the cuff. Elastic rib waistband 45 mm tall with a drawcord,
// slanted side pockets, gathered rib ankle cuffs 70 mm tall (the shared drawing in _bottoms.cjs).
// The clock goes on the front of the wearer's left leg, 130 mm below the waistband, under the pocket openings.
'use strict';
const { V } = require('./_bezier.cjs');
const { bottoms } = require('./_bottoms.cjs');

module.exports = (kit) => bottoms(kit, {
  name: 'sweatpants',
  waist: { halfW: 180, band: 45, round: 4 },
  hip: { halfW: 260, y: 195, leave: 25, dir: V(0, 1), handles: [70, 75] },
  crotch: 280,
  outseam: { points: [V(248, 620), V(208, 944)] },                  // knee, then just above the cuff
  inseam: { start: V(0.07, 1), points: [V(18, 620), V(58, 944)] },
  cuff: { width: 116, height: 70, blouseH: 26, taper: 2, gathers: [[-0.36, 0.8], [-0.12, 1], [0.12, 1], [0.36, 0.8]] },
  pocket: { x: 130, y: 155, bow: 3 },                                // opening ends above the clock
  cord: { x: 12, y: 22.5, length: 185, width: 8, drift: 3, tip: 18 },
  leftLeg: { below: 130 },
});
