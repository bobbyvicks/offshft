// Heavyweight tee, Comfort Colors 1717. Size M: 560 mm wide, 720 mm from the HPS to the hem. Relaxed fit, set-in
// short sleeves, ribbed crew collar, double-needle sleeve and bottom hems (the shared drawing in _tee.cjs).
// The logo goes on the wearer's left chest.
'use strict';
const { tee, SIZE_M } = require('./_tee.cjs');

module.exports = (kit) => tee(kit, { ...SIZE_M, name: 'tee', anchors: ['chest'] });
