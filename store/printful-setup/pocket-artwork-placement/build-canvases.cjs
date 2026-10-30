'use strict';
// Exact canonical SVG composition: no redrawing, recolouring or source mutation.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../../..');
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const specs = [
  {design:'logo', source:'designs/mark/final/the-o/logo-light.svg', expected:'c9271f97d4c831536889cfc15b7747969df9798647c11f99433b827f18afcbc9', name:'logo-pocket-2in', width:1200},
  {design:'clock', source:'designs/mark/final/the-o/symbol-light.svg', expected:'938ccb2ce5fa6ba345c28e995aa0f9143c4cee5a0a45cd3430f7307adcb07e05', name:'clock-pocket-1in', height:600},
];
(async () => {
  const output = [];
  for (const s of specs) {
    const bytes = fs.readFileSync(path.join(root,s.source));
    if (sha(bytes)!==s.expected) throw new Error('Canonical SVG hash changed: '+s.source);
    const text = bytes.toString('utf8');
    const match = text.match(/<svg\b[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>\s*$/);
    if (!match) throw new Error('Unexpected canonical SVG');
    const view = match[1].split(/\s+/).map(Number);
    const width = s.width || s.height*view[2]/view[3];
    const height = s.height || s.width*view[3]/view[2];
    const left=(1800-width)/2, top=(1200-height)/2;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="76.2mm" height="50.8mm" viewBox="0 0 1800 1200">\n<svg x="${left}" y="${top}" width="${width}" height="${height}" viewBox="${match[1]}" overflow="hidden">${match[2]}</svg>\n</svg>\n`;
    fs.writeFileSync(path.join(__dirname,s.name+'.svg'),svg);
    const png=await sharp(Buffer.from(svg),{density:600}).resize(1800,1200).withMetadata({density:600}).png().toBuffer();
    const meta=await sharp(png).metadata();
    if(meta.width!==1800||meta.height!==1200||!meta.hasAlpha)throw new Error('Canvas format mismatch');
    fs.writeFileSync(path.join(__dirname,s.name+'.png'),png);
    output.push({design:s.design,sourceSvg:s.source,sourceSvgSha256:s.expected,sourceInnerMarkupSha256:sha(match[2]),svg:s.name+'.svg',svgSha256:sha(svg),png:s.name+'.png',pngSha256:sha(png),canvasPixels:[1800,1200],canvasInches:[3,2],dpi:600,artworkPixelsExact:[width,height],artworkPixels:[Math.round(width),Math.round(height)],artworkInches:[width/600,height/600],left,top,palette:['#1F2733','#B4552D'],geometry:'Exact source inner SVG, paths, transforms and viewBox retained; uniformly scaled within centered nested SVG; no redraw or recolour.',supplierPlacementVerified:false});
  }
  fs.writeFileSync(path.join(__dirname,'canvas-manifest.json'),JSON.stringify({files:output},null,2)+'\n');
  console.log(JSON.stringify({canvases:output.map(x=>({name:x.png,pixels:x.canvasPixels,artworkInches:x.artworkInches}))}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
