// Round 5a: dauphine with a bigger collet, stacked two-tone (no seams), single-colour points.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, handsOutline, circle, frame, place, svgPaths, sh, cutProfile, emitProfile } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];
const half = 20;

function hands(R, mb, ms, hb, hs) {
  const edge = (s0, s1, T) => poly([0, s0], [T - s1 / Math.tan(half * G.D2R), s1], [T, 0]);
  return [{ deg: 0, profile: edge(mb, ms, 16.4), litSign: -1, T: 16.4, s1: ms }, { deg: 150, profile: edge(hb, hs, 10.4), litSign: 1, T: 10.4, s1: hs }];
}
// facet stripe: between the axis and the edge on one side, from the hub circle to the shoulder (flat end)
function facet(F, prof, R, sign, tEnd) {
  const cut = cutProfile(prof, R);
  const pb = new PathB();
  pb.M(F([R, 0]));
  pb.A(C, R, F([cut.start[0], sign * cut.start[1]]), sign > 0);
  // edge points up to the shoulder only
  const pts = [cut.start, ...cut.segs.map((s) => s[1])].filter((p) => p[0] <= tEnd + 1e-6);
  for (const p of pts.slice(1)) pb.L(F([p[0], sign * p[1]]));
  pb.L(F([tEnd, 0]));
  pb.Z();
  return pb;
}
function build({ R, mb, ms, hb, hs, base, top, hubFill, mono }) {
  const H = hands(R, mb, ms, hb, hs);
  const sil = handsOutline(new PathB(), C, R, H);
  if (mono) return [{ d: sil.str(), pts: sil.pts, fill: mono }];
  const parts = [{ d: sil.str(), pts: sil.pts, fill: base }];
  for (const h of H) {
    const F = frame(C, h.deg);
    const tEnd = h.T - h.s1 / Math.tan(half * G.D2R);   // shoulder
    // the facet drawn on top is the one whose colour is not the base colour
    const topSign = top.which === 'lit' ? h.litSign : -h.litSign;
    const pb = facet(F, h.profile, R, topSign, tEnd);
    parts.push({ d: pb.str(), pts: pb.pts, fill: top.fill });
  }
  const hub = circle(new PathB(), C, R);
  parts.push({ d: hub.str(), pts: hub.pts, fill: hubFill });
  return parts;
}
const geo = { R: 3.0, mb: 1.62, ms: 1.2, hb: 2.2, hs: 1.4 };

const S = {
  P_mono: () => build({ ...geo, mono: kit.T.rust }),
  P_litpoint: () => build({ ...geo, base: kit.T.rust, top: { which: 'shade', fill: kit.T.ink }, hubFill: kit.T.ink }),
  P_shadepoint: () => build({ ...geo, base: kit.T.ink, top: { which: 'lit', fill: kit.T.rust }, hubFill: kit.T.ink }),
  P_dark_litpoint: () => build({ ...geo, base: kit.T.bone, top: { which: 'shade', fill: kit.T.sun }, hubFill: kit.T.sun }),
  P_dark_shadepoint: () => build({ ...geo, base: kit.T.sun, top: { which: 'lit', fill: kit.T.bone }, hubFill: kit.T.sun }),
};

(async () => {
  const names = [];
  for (const [name, fn] of Object.entries(S)) {
    const parts = fn();
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    const bg = name.includes('dark') ? kit.F.slate : kit.F.bone;
    await kit.render(f, `${OUT}/${name}-50.png`, { bg, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    await kit.render(f, `${OUT}/${name}-25.png`, { bg, width: pl.w * (25 / pl.h), tile: '26x34', px: 6 });
    names.push(name);
  }
  await kit.close();
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-50.png`), '-tile', `${names.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study11.png`]);
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-25.png`), '-tile', `${names.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study11-25.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
