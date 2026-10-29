'use strict';
// Read-only artwork analysis: records probe-to-exterior clearance through S/E openings.
const fs = require('node:fs');
const path = require('node:path');
const C = require('../../../tools/node_modules/clipper-lib');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'measurements.json'), 'utf8'));
const SCALE = 10000;
const point = (x, y) => ({ X: Math.round(x * SCALE), Y: Math.round(y * SCALE) });
function difference(subject, clip) {
  const engine = new C.Clipper();
  engine.AddPaths(subject, C.PolyType.ptSubject, true);
  engine.AddPaths(clip, C.PolyType.ptClip, true);
  const out = [];
  engine.Execute(C.ClipType.ctDifference, out, C.PolyFillType.pftNonZero, C.PolyFillType.pftNonZero);
  return out;
}
function inset(paths, radius) {
  const engine = new C.ClipperOffset(2, 0.0005 * SCALE), out = [];
  engine.AddPaths(paths, C.JoinType.jtRound, C.EndType.etClosedPolygon);
  engine.Execute(out, -radius * SCALE);
  return out;
}
function connectedToExterior(paths, probe) {
  const sameOuter = paths.some(ring => C.Clipper.Area(ring) > 0 &&
    C.Clipper.PointInPolygon(probe, ring) !== 0 && C.Clipper.PointInPolygon(point(-5, -5), ring) !== 0);
  const insideHole = paths.some(ring => C.Clipper.Area(ring) < 0 && C.Clipper.PointInPolygon(probe, ring) !== 0);
  return sameOuter && !insideHole;
}
const checks = [];
for (const id of ['glyph-4', 'glyph-7', 'glyph-9']) {
  const glyph = data.glyphs.find(g => g.id === id);
  const all = glyph.finalContoursMm.flat();
  const x0 = Math.min(...all.map(p => p[0])), y0 = Math.min(...all.map(p => p[1]));
  const contours = glyph.finalContoursMm.map(r => r.map(([x, y]) => point(x-x0, y-y0)));
  const exterior = [[point(-10, -10), point(45, -10), point(45, 45), point(-10, 45)]];
  const negative = difference(exterior, contours);
  const probes = glyph.char === 'S' ? [[11, 6.9], [11, 15.2]] : [[11, 6.963], [11, 14.389]];
  checks.push({ id, character: glyph.char, openings: probes.map(([x, y]) => {
    let lo=0, hi=1.25;
    for (let step=0; step<15; step++) {
      const mid=(lo+hi)/2;
      if (connectedToExterior(inset(negative, mid), point(x, y))) lo=mid;
      else hi=mid;
    }
    return { probeLocalMm: [x, y], clearanceDiameterLowerBoundMm: lo*2,
      clearanceDiameterUpperBoundMm: hi*2,
      passes1_27mmProbeToExterior: connectedToExterior(inset(negative, 0.635), point(x, y)) };
  }) });
}
const result = {
  status: 'Independent geometric opening review; not supplier acceptance',
  method: 'Subtract the exact glyph from an exterior rectangle, erode that negative region by a test radius, and require an interior-opening probe and the exterior to share a connected polygon. Binary search gives a conservative rolling-disc corridor clearance from each specified probe to the exterior. Rounded blind ends are not reported as zero-width throats.',
  clipperArcToleranceMm: 0.0005,
  checks,
  allSelectedOpeningsPass1_27mm: checks.every(c => c.openings.every(o => o.passes1_27mmProbeToExterior)),
  minimumTestedOpeningClearanceMm: Math.min(...checks.flatMap(c => c.openings.map(o => o.clearanceDiameterLowerBoundMm))),
  limitation: 'This is a geometric probe-path test of the intended S/E openings, not a claim that every infinitesimal chord at a rounded blind end exceeds1.27mm, nor a stitch simulation.'
};
fs.writeFileSync(path.join(__dirname, 'independent-opening-review.json'), JSON.stringify(result, null, 2)+'\n');
console.log(JSON.stringify(result, null, 2));
