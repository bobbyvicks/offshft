// Inspection only: lockups with cap line, baseline and gap guides drawn in.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const B = require('/home/user/offshft/designs/mark/explore/contained/build.cjs');
const { execSync } = require('child_process');
const W = '/home/user/offshft/designs/mark/explore/contained/_work/guides';
require('fs').mkdirSync(W, { recursive: true });
(async () => {
  const out = [];
  for (const id of ['C1', 'C2', 'C3', 'C4']) {
    const v = B.V[id];
    const lk = B.lockup(v, { two: v.two && v.two.light });
    const cap = 6;
    // find baseline: for baseline-aligned = h of mark; else derive from info: re-run geometry
    const g = v.geom(); const s = +lk.info.scale; const mh = g.h * s;
    const base = v.lockAlign === 'baseline' ? mh : g.cy * s + cap / 2;
    const lines = [base, base - cap, base - cap / 2].map((y, i) => `<line x1="-2" x2="${lk.w + 2}" y1="${y}" y2="${y}" stroke="${i === 2 ? '#0a0' : '#e00'}" stroke-width="0.08"/>`).join('');
    kit.writeSvg(`${W}/${id}.svg`, { w: lk.w, h: lk.h, body: lk.body + lines });
    await kit.render(`${W}/${id}.svg`, `${W}/${id}.png`, { bg: kit.F.bone, px: 8, tile: '96x26' });
    out.push(`${id}.png`);
  }
  await kit.close();
  execSync(`cd ${W} && montage ${out.join(' ')} -tile 1x -geometry 1000x+4+4 -background '#888888' ../guides.png`);
})();
