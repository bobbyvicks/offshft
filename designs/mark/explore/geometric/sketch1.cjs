// Round 1 sketches: many quick concepts to compare before choosing four.
const L = require('./lib.cjs');
const { kit, bar, stroke, union, polyD, circleD, rectPoly, dir, add, mul, bbox, movePoly } = L;
const fs = require('fs');
const OUT = __dirname + '/sketch/r1';
fs.mkdirSync(OUT, { recursive: true });

const P = [0, 0];
const sketches = [];
function mk(name, { polys = [], holes = [], holePolys = [], field = null, fill = kit.T.ink }) {
  let loops, d;
  if (field) {
    // field: polygon; polys are knocked out of it
    const ko = union(polys);
    loops = [field, ...ko];
    d = loops.map(polyD).join('') + holes.map(([c, r]) => circleD(c, r)).join('');
  } else {
    loops = union(polys);
    d = loops.map(polyD).join('') + holes.map(([c, r]) => circleD(c, r)).join('') + holePolys.map(polyD).join('');
  }
  const bb = bbox(field ? [field] : loops);
  const pad = 0.5;
  const body = `<g transform="translate(${-bb.x0 + pad} ${-bb.y0 + pad})"><path fill="${fill}" fill-rule="evenodd" d="${d}"/></g>`;
  const file = `${OUT}/${name}.svg`;
  kit.writeSvg(file, { w: bb.w + 2 * pad, h: bb.h + 2 * pad, body });
  sketches.push({ name, file });
}

const MT = (Lm) => add(P, mul(dir(0), Lm));
const HT = (Lh) => add(P, mul(dir(150), Lh));

// S1 baton: equal widths, tails, pin hole
mk('S01-baton-tails', { polys: [bar(P, 0, { len: 15, tail: 3, w: 3.6 }), bar(P, 150, { len: 9.5, tail: 3, w: 3.6 })], holes: [[P, 0.8]] });
// S2 baton: wider hour hand
mk('S02-baton-wide-hour', { polys: [bar(P, 0, { len: 15.5, tail: 2.2, w: 2.9 }), bar(P, 150, { len: 9, tail: 2.2, w: 4.4 })], holes: [[P, 0.8]] });
// S3 mitred, no tails, pin
mk('S03-mitre-pin', { polys: [stroke([MT(15), P, HT(9.5)], 3.6)], holes: [[P, 0.8]] });
// S4 square field, mitred knockout
{
  const S = 22, w = 3.0, c = [S / 2, S / 2];
  const mt = add(c, mul(dir(0), S / 2 - 3.2)), ht = add(c, mul(dir(150), 6.2));
  mk('S04-field-mitre', { field: rectPoly(0, 0, S, S), polys: [stroke([mt, c, ht], w)] });
}
// S5 square field, bars + round pivot knockout
{
  const S = 22, w = 2.8, c = [S / 2, S / 2];
  mk('S05-field-bars-hub', { field: rectPoly(0, 0, S, S), polys: [bar(c, 0, { len: S / 2 - 3, tail: 0, w }), bar(c, 150, { len: 6.4, tail: 0, w }), L.circlePoly(c, w * 0.85)] });
}
// S6 square hub, hands emerging
mk('S06-square-hub', { polys: [bar(P, 0, { len: 15, w: 3 }), bar(P, 150, { len: 9.5, w: 3 }), rectPoly(-3.4, -3.4, 6.8, 6.8)], holes: [[P, 0.9]] });
// S7 diamond hub
mk('S07-diamond-hub', { polys: [bar(P, 0, { len: 15, w: 3 }), bar(P, 150, { len: 9.5, w: 3 }), [[0, -4.2], [4.2, 0], [0, 4.2], [-4.2, 0]]], holes: [[P, 0.9]] });
// S8 tick: continuous mitred stroke, butt ends
mk('S08-tick-butt', { polys: [stroke([MT(15), P, HT(8)], 4.2)] });
// S9 tick: horizontal-cut terminals
mk('S09-tick-horiz', { polys: [stroke([MT(15), P, HT(8.5)], 4.2, { startCut: 90, endCut: 90 })] });
// S10 inline channel
{
  const w = 4.2, ch = 1.4, inset = 1.4;
  const outer = stroke([MT(15), P, HT(9)], w);
  const inner = stroke([MT(15 - inset), P, HT(9 - inset)], ch);
  mk('S10-inline', { polys: [outer], holePolys: [inner] });
}
// S11 outline
{
  const w = 4.4, t = 1.3;
  const outer = stroke([MT(15), P, HT(9)], w);
  const inner = stroke([MT(15 - t), P, HT(9 - t)], w - 2 * t);
  mk('S11-outline', { polys: [outer], holePolys: [inner] });
}
// S12 split square: one continuous slit from the top edge to the hour tip
{
  const S = 22, w = 2.6, c = [S / 2, S / 2 + 1];
  const top = [S / 2, -1];
  const ht = add(c, mul(dir(150), 6.6));
  mk('S12-split-square', { field: rectPoly(0, 0, S, S), polys: [stroke([top, c, ht], w)] });
}

(async () => {
  for (const s of sketches) await kit.render(s.file, s.file.replace('.svg', '.png'), { bg: kit.F.bone });
  await kit.close();
  console.log(sketches.map((s) => s.name).join('\n'));
})();
