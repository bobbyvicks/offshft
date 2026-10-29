// Oversized crewneck sweatshirt, Bella + Canvas 4711. Size M: about 640 mm wide, 690 mm from the HPS to the hem.
// Very roomy, boxy cut with dropped shoulders, ribbed crew collar, cuffs and hem band.
'use strict';
const top = require('./_top.cjs');

module.exports = (kit) => top(kit, {
  name: 'crewneck-oversized',
  width: 640,
  length: 690,
  neck: { kind: 'crew', halfW: 96, drop: 78, rib: 24, back: 15 },
  shoulder: { x: 340, y: 66 },
  armhole: { kind: 'dropped', underarm: { x: 322, y: 302 }, pit: { x: 322, y: 302 } },
  sleeve: { angle: 14, topW: 134, round: 1, length: 560, cuffW: 108, cuffH: 75, blouse: 7, blouseH: 20 },
  hem: { h: 70, halfW: 314, blouse: 20 },
  chest: { x: 95, y: 190 },
});
