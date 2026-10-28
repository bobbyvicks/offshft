// Render each mark black-on-white at 40 px/mm at 25 mm and 13 mm and measure the min gap between separate shapes.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');
const fs = require('fs');
const { execSync } = require('child_process');
const ROOT = '/home/user/offshft/designs/mark/explore/I';
const W = `${ROOT}/_work`;
(async () => {
  for (const id of process.argv.slice(2)) {
    const src = `${ROOT}/${id}/mark.svg`;
    const d = kit.readSvg(src);
    const blk = `${W}/meas-${id}.svg`;
    fs.writeFileSync(blk, `<svg xmlns="http://www.w3.org/2000/svg" width="${d.w}mm" height="${d.h}mm" viewBox="${d.viewBox}">${d.inner.replace(/#[0-9A-Fa-f]{6}/g, '#000000')}</svg>`);
    const L = Math.max(d.w, d.h);
    const out = [];
    for (const size of [25, 13]) {
      const width = (size * d.w) / L, hh = (size * d.h) / L;
      await kit.render(blk, `${W}/meas-${id}-${size}.png`, { bg: '#FFFFFF', width, px: 20, tile: `${Math.ceil(width + 4)}x${Math.ceil(hh + 4)}`, twill: false });
      out.push(size + 'mm ' + execSync(`python3 ${ROOT}/gaps.py ${W}/meas-${id}-${size}.png 40`).toString().trim());
    }
    console.log(id, '\n  ' + out.join('\n  '));
  }
  await kit.close();
})();
