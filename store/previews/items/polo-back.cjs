// Golf polo, back view: the drawing in polo.cjs seen from behind, so the two outlines match. The collar's fall folded
// down over its stand, with the back neck tape's row of stitching just below it from shoulder to shoulder; the shoulder
// seams along the top; the sleeves with their flat knit cuffs; and the drop tail: the back hem 25 mm below the
// front's, with the side vents running up from it.
// The clock goes on the centre back (backNeck): its centre 45 mm below the back neck seam, so a 25 mm mark's top sits
// about 30 mm below the seam, clear of the collar.
'use strict';
const { polo } = require('./polo.cjs');

module.exports = (kit) => polo(kit, 'back');
