// Render two new one-colour variants from the existing outlined SVGs.
// Requires installed Sharp, resolved through Node or NODE_PATH. Installs nothing.
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
(async () => {
  const out = path.join(__dirname, 'artwork');
  fs.mkdirSync(out, { recursive: true });
  for (const id of ['13-ours-to-spend', '14-five-oclock']) {
    const source = fs.readFileSync(path.join(__dirname, '..', id, 'design.svg'), 'utf8');
    if (!source.includes('fill="#D29B3C"')) throw new Error('Expected Sun accent in ' + id);
    const svg = source.replaceAll('fill="#D29B3C"', 'fill="#ECE5D3"');
    fs.writeFileSync(path.join(out, id + '-bone.svg'), svg);
    await sharp(Buffer.from(svg), { density: 300 }).resize({ width: 1800 }).png().toFile(path.join(out, id + '-bone.png'));
    console.log(id + ': same geometry; Bone letters and punctuation');
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
