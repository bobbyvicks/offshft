// Embroidery check: renders a mark at 25 mm (longest side) as a black mask and runs
// morphological opening / closing with a 1.2 mm disc. Red = thread thinner than 1.2 mm,
// blue = gap/hole narrower than 1.2 mm. Isolated specks at sharp corners are expected.
// usage: node check.cjs G1 [G2 ...]   -> sketch/check-<id>.png and pixel counts
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { kit } = require('./lib.cjs');
const OUT = path.join(__dirname, 'sketch');
const S = '/tmp/claude-0/-home-user/baaa626f-827d-5693-ad14-ed0dd81cc068/scratchpad';
(async () => {
  const args = process.argv.slice(2);
  const flag = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : d; };
  const ids = args.filter((a) => !a.startsWith('--'));
  const FILE = flag('file', 'mark.svg'), SIZE = +flag('size', 25);
  for (const id of ids) {
    const src = fs.readFileSync(path.join(__dirname, id, FILE), 'utf8').replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="#000000"');
    const tmpSvg = path.join(S, `chk-${id}.svg`);
    fs.writeFileSync(tmpSvg, src);
    const d = kit.readSvg(tmpSvg);
    const longest = Math.max(d.w, d.h);
    const width = (SIZE * d.w) / longest; // so the longest side is SIZE mm
    const raw = path.join(S, `chk-${id}-raw.png`);
    await kit.render(tmpSvg, raw, { bg: '#ffffff', width, px: 20, tile: `${SIZE + 9}x${SIZE + 9}`, twill: false });
    const pxmm = 40; // 20 px/mm x deviceScaleFactor 2
    const r = Math.round(0.6 * pxmm);
    const mask = path.join(S, `chk-${id}-mask.png`);
    execFileSync('convert', [raw, '-colorspace', 'Gray', '-threshold', '50%', '-negate', mask]); // shape = white
    const opened = path.join(S, `chk-${id}-open.png`);
    const closed = path.join(S, `chk-${id}-close.png`);
    execFileSync('convert', [mask, '-morphology', 'Open', `Disk:${r}`, opened]);
    execFileSync('convert', [mask, '-morphology', 'Close', `Disk:${r}`, closed]);
    const thin = path.join(S, `chk-${id}-thin.png`);
    const gaps = path.join(S, `chk-${id}-gaps.png`);
    execFileSync('convert', [mask, opened, '-compose', 'difference', '-composite', '-threshold', '50%', thin]);
    execFileSync('convert', [closed, mask, '-compose', 'difference', '-composite', '-threshold', '50%', gaps]);
    const count = (f) => +execFileSync('convert', [f, '-format', '%[fx:mean*w*h]', 'info:']).toString();
    const nThin = count(thin), nGap = count(gaps);
    // overlay: grey shape, red thin, blue gaps
    const out = path.join(OUT, `check-${id}-${FILE.replace('.svg', '')}-${SIZE}mm.png`);
    execFileSync('convert', [mask, '-negate', '-fill', '#999999', '-opaque', 'black', '(', thin, '-transparent', 'black', '-fill', 'red', '-opaque', 'white', ')', '-composite', '(', gaps, '-transparent', 'black', '-fill', 'blue', '-opaque', 'white', ')', '-composite', '-resize', '50%', out]);
    const mm2 = (n) => (n / (pxmm * pxmm)).toFixed(3);
    console.log(`${id}: thin ${nThin}px (${mm2(nThin)} mm2), narrow gaps ${nGap}px (${mm2(nGap)} mm2) -> ${out}`);
  }
  await kit.close();
})();
