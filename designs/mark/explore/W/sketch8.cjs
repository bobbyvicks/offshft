// Round 3c: dauphine tip angles with consistent lighting (light from the left), and facet colour pairs.
'use strict';
const G = require('/home/user/offshft/designs/mark/explore/W/lib.cjs');
const { kit, PathB, poly, circle, frame, place, svgPaths, sh } = G;
const OUT = '/home/user/offshft/designs/mark/explore/W/sketch';
const C = [0, 0];

// blade edge: base half-width s0 at t=0, shoulder half-width s1 where the point starts, tip half-angle h (deg)
function edge(s0, s1, T, h) {
  const tl = s1 / Math.tan(h * G.D2R);
  return [[0, s0], [T - tl, s1], [T, 0]];
}
// lit side: minute hand -s (left), hour hand +s (lower left). Light from the left.
function dauphine({ R, m, h, lit, shade }) {
  const parts = [];
  for (const [deg, E, litSign] of [[0, m, -1], [150, h, +1]]) {
    const F = frame(C, deg);
    for (const sign of [-1, 1]) {
      const p = new PathB(); p.M(F([0, 0])); for (const q of E) p.L(F([q[0], sign * q[1]])); p.Z();
      parts.push({ d: p.str(), pts: p.pts, fill: sign === litSign ? lit : shade });
    }
  }
  const hub = new PathB(); circle(hub, C, R);
  parts.push({ d: hub.str(), pts: hub.pts, fill: shade });
  return parts;
}
const mk = (hdeg, lit, shade) => dauphine({ R: 2.7, m: edge(1.75, 1.2, 16.4, hdeg), h: edge(2.45, 1.5, 10.4, hdeg), lit, shade });

const S = {
  T20: () => mk(20, kit.T.rust, kit.T.ink),
  T30: () => mk(30, kit.T.rust, kit.T.ink),
  T45: () => mk(45, kit.T.rust, kit.T.ink),
  T20_dark_bone_sun: () => mk(20, kit.T.bone, kit.T.sun),
  T20_dark_sun_rust: () => mk(20, kit.T.sun, kit.T.rust),
  T20_dark_bone_sage: () => mk(20, kit.T.bone, kit.T.sage),
};

(async () => {
  const names = [];
  for (const [name, fn] of Object.entries(S)) {
    const parts = fn();
    const pl = place(parts, { margin: 0.4 });
    const f = `${OUT}/${name}.svg`;
    kit.writeSvg(f, { w: pl.w, h: pl.h, body: svgPaths(parts, pl.dx, pl.dy) });
    await kit.render(f, `${OUT}/${name}-50.png`, { bg: name.includes('dark') ? kit.F.slate : kit.F.bone, width: pl.w * (50 / pl.h), tile: '26x56', px: 6 });
    names.push(name);
  }
  await kit.close();
  sh('montage', ['-label', '%t', ...names.map((n) => `${OUT}/${n}-50.png`), '-tile', `${names.length}x`, '-geometry', '+3+3', '-pointsize', '15', '-background', '#888888', `${OUT}/study8.png`]);
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
