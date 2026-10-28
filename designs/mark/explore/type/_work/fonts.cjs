const kit = require('/home/user/offshft/tools/kit/kit.cjs');
(async () => {
  const fonts = ['xblack','xbold','xsemi','xmed','sxbold','bold','semi'];
  let y = 0, body = '';
  for (const f of fonts) {
    y += 14;
    const t = kit.text('OFF SHFT', { font: f, cap: 10, track: 0.12, x: 4, y, fill: kit.T.ink });
    body += t.svg;
    body += `<text x="${t.width + 8}" y="${y}" font-size="4" font-family="Arial">${f} stem=${kit.stem(f,10).toFixed(2)}</text>`;
  }
  kit.writeSvg(__dirname + '/fonts.svg', { w: 150, h: y + 6, body });
  await kit.render(__dirname + '/fonts.svg', __dirname + '/fonts.png', { tile: '160x110', px: 6 });
  await kit.close();
})();
