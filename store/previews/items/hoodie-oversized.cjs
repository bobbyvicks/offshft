// Oversized hoodie, AS Colour 5161 Relax Hood. Size M: 600 mm wide, 730 mm from the HPS to the hem.
// Relaxed, roomy cut with dropped shoulders and a deep armhole, lined hood with no drawcord, kangaroo pocket,
// ribbed cuffs and hem band.
'use strict';
const top = require('./_top.cjs');

module.exports = (kit) => top(kit, {
  name: 'hoodie-oversized',
  width: 600,
  length: 730,
  neck: { kind: 'hood', halfW: 102, drop: 100 },
  hood: {
    top: -305, wide: { x: 180, y: -118 }, base: { x: 136, y: 50 }, rim: { x: 118, y: -150 }, rimW: 30, meet: 42,
    backNeck: 18, lined: 9,
  },
  shoulder: { x: 322, y: 64 },
  armhole: { kind: 'dropped', underarm: { x: 302, y: 312 }, pit: { x: 302, y: 312 } },
  sleeve: { angle: 15, topW: 136, round: 1, length: 565, cuffW: 108, cuffH: 80, blouse: 7, blouseH: 20 },
  hem: { h: 80, halfW: 294, blouse: 25 },
  pocket: { top: 440, topHalf: 140, sideX: 218, sideY: 600 },
  chest: { x: 95, y: 190 },
});
