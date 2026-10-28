// Measure the narrowest gap in the S (aperture) per font at cap 7 by closing with growing discs.
const L = require('/home/user/offshft/designs/mark/explore/type/lib.cjs');
const { kit } = L;
const fs = require('fs');
const { execFileSync } = require('child_process');
(async () => {
  const out = [];
  for (const font of ['xbold', 'xsemi', 'xmed', 'sxbold', 'xblack']) {
    const cap = 7;
    const t = L.text('S', { font, cap });
    const f = __dirname + `/ap-${font}.svg`;
    L.writeArt(f, [{ item: t.item, fill: '#000' }], { pad: 1 });
    // render at 40 px/mm black on white
    const src = fs.readFileSync(f, 'utf8');
    const vb = src.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    const px = 40;
    fs.writeFileSync(f.replace('.svg', '.big.svg'), src.replace(/width="[^"]+" height="[^"]+"/, `width="${vb[2] * px}" height="${vb[3] * px}"`).replace('<path', `<rect width="100%" height="100%" fill="#fff"/><path`));
    await new Promise((r) => r());
    out.push({ font, file: f.replace('.svg', '.big.svg'), px });
  }
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  for (const o of out) {
    const p = await b.newPage({ deviceScaleFactor: 1 });
    await p.setContent(`<html><body style="margin:0">${fs.readFileSync(o.file, 'utf8')}</body></html>`);
    const png = o.file.replace('.svg', '.png');
    await (await p.$('svg')).screenshot({ path: png });
    await p.close();
    // aperture: smallest closing disc radius r at which the gap in the S fills (new ink pixels appear inside the aperture)
    const ink = +execFileSync('convert', [png, '-colorspace', 'gray', '-threshold', '50%', '-negate', '-format', '%[fx:mean*w*h]', 'info:']).toString();
    let res = null;
    for (let r = 4; r <= 40; r += 1) {
      const closed = +execFileSync('convert', [png, '-colorspace', 'gray', '-threshold', '50%', '-negate', '-morphology', 'Close', `Disk:${r}`, '-format', '%[fx:mean*w*h]', 'info:']).toString();
      if (closed - ink > 400) { res = (2 * r) / o.px; break; }
    }
    console.log(o.font, 'approx narrowest S gap at cap 7 =', res && res.toFixed(2), 'mm  -> cap needed for 1.2mm:', res && (7 * 1.2 / res).toFixed(1));
  }
  await b.close();
  await L.closeAll();
})();
