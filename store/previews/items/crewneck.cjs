// Crewneck sweatshirt, Comfort Colors 1466 and 1566. Size M: 570 mm wide, 690 mm from the HPS to the hem.
// Relaxed fit, set-in sleeves, ribbed crew collar, cuffs and hem band.
'use strict';
const top = require('./_top.cjs');

module.exports = (kit) => top(kit, {
  name: 'crewneck',
  width: 570,
  length: 690,
  neck: { kind: 'crew', halfW: 90, drop: 72, rib: 22, back: 14 },
  shoulder: { x: 247, y: 46 },
  armhole: { kind: 'set-in', underarm: { x: 288, y: 262 }, pit: { x: 250, y: 236 } },
  sleeve: { angle: 18, topW: 112, round: 0.9, length: 610, cuffW: 96, cuffH: 65, blouse: 6, blouseH: 18 },
  hem: { h: 65, halfW: 268, blouse: 45 },
  chest: { x: 95, y: 190 },
});
