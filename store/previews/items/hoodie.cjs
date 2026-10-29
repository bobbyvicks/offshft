// Pullover hoodie, Comfort Colors 1567 and 1467. Size M: 570 mm wide, 710 mm from the HPS to the hem.
// Relaxed fit, set-in sleeves, hood with two flat drawcords from eyelets, kangaroo pocket, ribbed cuffs and hem band.
'use strict';
const top = require('./_top.cjs');

module.exports = (kit) => top(kit, {
  name: 'hoodie',
  width: 570,
  length: 710,
  neck: { kind: 'hood', halfW: 98, drop: 97 },
  hood: {
    top: -298, wide: { x: 168, y: -120 }, base: { x: 128, y: 45 }, rim: { x: 110, y: -150 }, rimW: 26, meet: 40,
    backNeck: 18, cords: { y: 50, length: 275, width: 10, drift: 4 },
  },
  shoulder: { x: 247, y: 46 },
  armhole: { kind: 'set-in', underarm: { x: 288, y: 262 }, pit: { x: 250, y: 236 } },
  sleeve: { angle: 18, topW: 112, round: 0.9, length: 615, cuffW: 96, cuffH: 70, blouse: 6, blouseH: 18 },
  hem: { h: 70, halfW: 268, blouse: 45 },
  pocket: { top: 420, topHalf: 128, sideX: 205, sideY: 585 },
  chest: { x: 95, y: 190 },
});
