// Pocket tee, Comfort Colors 6030: the 1717 tee drawing (_tee.cjs, same size-M body) plus a patch pocket on the
// wearer's left chest, 110 x 130 mm, its top 175 mm below the HPS, centred 100 mm from the centre front.
//
// Printful can't embroider the chest or the pocket, so the clock goes on the wearer's left sleeve, halfway between the
// armhole seam and the hem, turned to stand along the arm. 'centre' is the centre front at the chest-logo height, for
// the logo, which build.cjs sends to the centre spot (designAt) because it is too wide for the sleeve.
'use strict';
const { tee, SIZE_M } = require('./_tee.cjs');

module.exports = (kit) => tee(kit, {
  ...SIZE_M,
  name: 'pocket-tee',
  pocket: { cx: 100, top: 175, w: 110, h: 130, hem: 18, stitch: 4, corner: 3 },
  anchors: ['leftSleeve', 'centre'],
});
