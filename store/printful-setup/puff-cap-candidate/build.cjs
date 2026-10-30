'use strict';
// Separate puff adaptation. Owner selection is recorded in owner-approval.json.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const C = require('../../../tools/node_modules/clipper-lib');
const sharp = require('sharp');
const ROOT = path.resolve(__dirname, '../../..');
const SOURCE = path.join(ROOT, 'designs/13-ours-to-spend/design.svg');
const SCALE = 10000;
const cap = 19.75, sourceCap = 10.261, inflate = 0.80, radius = 2.65;
const gap = 1.8, wordGap = 4.5, lineGap = 3.8, dotDiameter = 5.8;
const palettes = {
  'bone-sun': {main:'#ECE5D3', accent:'#D29B3C'},
  'ink-rust': {main:'#1F2733', accent:'#B4552D'},
  'bone': {main:'#ECE5D3', accent:'#ECE5D3'},
};
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const n = v => Number(v.toFixed(4));
function boolean(type, subject, clips=[]) {
  const engine = new C.Clipper();
  engine.AddPaths(subject,C.PolyType.ptSubject,true);
  if (clips.length) engine.AddPaths(clips,C.PolyType.ptClip,true);
  const out=[];
  engine.Execute(type,out,C.PolyFillType.pftNonZero,C.PolyFillType.pftNonZero);
  return out;
}
function offset(paths,mm) {
  const engine=new C.ClipperOffset(2,0.0005*SCALE);
  engine.AddPaths(paths,C.JoinType.jtRound,C.EndType.etClosedPolygon);
  const out=[];engine.Execute(out,mm*SCALE);return out;
}
function rect(x0,y0,x1,y1) {
  return [{X:x0*SCALE,Y:y0*SCALE},{X:x1*SCALE,Y:y0*SCALE},{X:x1*SCALE,Y:y1*SCALE},{X:x0*SCALE,Y:y1*SCALE}].map(p=>({X:Math.round(p.X),Y:Math.round(p.Y)}));
}
function bbox(paths) {
  const p=paths.flat();return {x0:Math.min(...p.map(a=>a.X))/SCALE,y0:Math.min(...p.map(a=>a.Y))/SCALE,x1:Math.max(...p.map(a=>a.X))/SCALE,y1:Math.max(...p.map(a=>a.Y))/SCALE};
}
function translate(paths,x,y) {return paths.map(p=>p.map(a=>({X:a.X+Math.round(x*SCALE),Y:a.Y+Math.round(y*SCALE)})));}
function stats(paths) {return {outerContours:paths.filter(p=>C.Clipper.Area(p)>0).length,counters:paths.filter(p=>C.Clipper.Area(p)<0).length};}
function data(paths) {return paths.map(p=>'M'+p.map(a=>`${n(a.X/SCALE)} ${n(a.Y/SCALE)}`).join(' L')+' Z').join(' ');}
function circle(d) {const out=[];for(let i=0;i<384;i++){let a=i*2*Math.PI/384;out.push({X:Math.round((d/2+d/2*Math.cos(a))*SCALE),Y:Math.round((d/2+d/2*Math.sin(a))*SCALE)});}return [out];}
function parse() {
 const bytes=fs.readFileSync(SOURCE),xml=bytes.toString('utf8');
 const letters=[];
 for(const match of xml.matchAll(/<path\s+([^>]+)\/>/g)) {
  const attrs=Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
  const contours=[...attrs.d.matchAll(/M([^M]+)/g)].map(m=>{let v=m[1].match(/-?\d+(?:\.\d+)?/g).map(Number);return Array.from({length:v.length/2},(_,i)=>({X:Math.round(v[2*i]*cap/sourceCap*SCALE),Y:Math.round(v[2*i+1]*cap/sourceCap*SCALE)}));});
  let paths=boolean(C.ClipType.ctUnion,contours);
  const originalBox=bbox(paths);
  paths=translate(paths,-originalBox.x0,-originalBox.y0);
  letters.push({id:attrs.id,char:attrs['data-character'],source:paths,sourceY0:originalBox.y0});
 }
 return {bytes,letters};
}
function makeSvg(glyphs,width,height,palette) {
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${n(width)}mm" height="${n(height)}mm" viewBox="0 0 ${n(width)} ${n(height)}">\n<title>OURS TO SPEND. — unapproved puff candidate</title>\n<desc>Controlled adaptation of the approved Unbounded Bold outlines. Puff candidate only; not supplier accepted or a stitch file.</desc>\n${glyphs.map(g=>`<path id="${g.id}" data-character="${g.char}" fill="${g.char==='.'?palette.accent:palette.main}" fill-rule="evenodd" d="${data(g.final)}"/>`).join('\n')}\n</svg>\n`;
}
function inner(svg) {return svg.replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');}
function proofSvg(original,candidate,width,height,variants) {
 const w=190,h=244,fieldW=149.9,fieldH=50.8,x=(w-fieldW)/2;
 const label=(text,xx,yy,size=2.8,fill='#1F2733',weight=400)=>`<text x="${xx}" y="${yy}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${text}</text>`;
 const field=(yy,svg,artW,artH)=>`<rect x="${x}" y="${yy}" width="${fieldW}" height="${fieldH}" rx="0.5" fill="#2E3D35"/><g transform="translate(${(w-artW)/2} ${yy+(fieldH-artH)/2})">${inner(svg)}</g><rect x="${x}" y="${yy}" width="${fieldW}" height="${fieldH}" fill="none" stroke="#9AA383" stroke-width="0.22" stroke-dasharray="1.3 1.3"/>`;
 const body=[`<rect width="190" height="244" fill="#F4F0E7"/>`,label('OFF SHFT / PUFF ADAPTATION',x,13,3.0,'#687060',700),label('OURS TO / SPEND.',x,23,6.4,'#1F2733',700),
 label('Candidate for owner review. Flat artwork proof; no stitch or supplier approval.',x,30,2.7),
 label('EXISTING  /  85 × 25.884 mm',x,40,3.2,'#1F2733',700),field(44,original,85,25.884),
 label('CANDIDATE — UNAPPROVED  /  '+width.toFixed(2)+' × '+height.toFixed(2)+' mm',x,106,3.2,'#1F2733',700),field(110,candidate,width,height),
 label('Both frames: 149.9 × 50.8 mm cap field. Both artworks use the same display scale.',x,166,2.65),
 label('Wider footprint · heavier forms · rounded ends · opened S mouths · 5.8 mm period',x,173,2.65),
 label('PALETTES / unchanged artwork colours',x,184,2.8,'#687060',700)];
 const swatches=[['bone-sun','#2E3D35','Bone / Sun'],['ink-rust','#C7B48E','Ink / Rust'],['bone','#A77B50','Bone only']];
 for(const [i,[key,bg,name]] of swatches.entries()) {
  const xx=x+i*51.3,boxW=47.3,boxH=22,scale=43/width;
  body.push(`<rect x="${xx}" y="188" width="${boxW}" height="${boxH}" rx="1" fill="${bg}"/><g transform="translate(${xx+(boxW-width*scale)/2} ${188+(boxH-height*scale)/2}) scale(${scale})">${inner(variants[key])}</g>`,label(name,xx,215,2.7));
 }
 body.push(label('Original masters preserved. This candidate is not a production replacement.',x,228,2.65),label('Review the measured limits and digitization caveats before selecting it.',x,234,2.65));
 return `<svg xmlns="http://www.w3.org/2000/svg" width="190mm" height="244mm" viewBox="0 0 190 244"><title>OFF SHFT puff candidate comparison — unapproved</title>${body.join('\n')}</svg>\n`;
}
async function main() {
 const {bytes,letters}=parse();
 for(const g of letters) {
  let prepared;
  if(g.char==='.') {prepared=circle(dotDiameter);g.core=circle(dotDiameter-2*radius);g.core=translate(g.core,radius,radius);g.final=prepared;}
  else {
   prepared=offset(g.source,inflate);
   if(g.char==='S') {
    // Widen the two open mouths before the positive rolling-disc construction.
    // Values are derived from the approved S's two terminal positions.
    const k=cap/sourceCap,b=bbox(g.source);
    const topY=(-6.6202+10.48)*k,bottomY=(-3.79857+10.48)*k;
    const cuts=[rect((49.25-42.265)*k,topY-0.82,b.x1+5,topY+0.82),
                rect(-5,bottomY-0.82,(45.60-42.265)*k,bottomY+0.82)];
    prepared=boolean(C.ClipType.ctDifference,prepared,cuts);
   }
   g.prepared=prepared;
   g.core=offset(prepared,-radius);
   g.final=offset(g.core,radius);
  }
  g.coreStats=stats(g.core);g.finalStats=stats(g.final);
  const counters='ORPD'.includes(g.char)?1:0;
  if(g.coreStats.outerContours!==1||g.finalStats.outerContours!==1||g.coreStats.counters!==counters||g.finalStats.counters!==counters) {
   throw new Error(`Topology changed for ${g.id}/${g.char}`);
  }
  const b=bbox(g.final);g.width=b.x1-b.x0;g.height=b.y1-b.y0;g.inkY0=g.sourceY0+b.y0;
  g.final=translate(g.final,-b.x0,-b.y0);g.core=translate(g.core,-b.x0,-b.y0);
 }
 const line1=letters.slice(0,6),line2=letters.slice(6);
 const top=Math.min(...letters.filter(g=>g.char!=='.').map(g=>g.inkY0));
 const h=Math.max(...letters.filter(g=>g.char!=='.').map(g=>g.inkY0-top+g.height));
 let widths=[];
 for(const [row,gs] of [line1,line2].entries()) {
  let x=0;
  for(const [i,g] of gs.entries()) {
   const y=row*(h+lineGap)+(g.char==='.'?h-g.height:g.inkY0-top);
   g.final=translate(g.final,x,y);g.core=translate(g.core,x,y);g.row=row;
   x+=g.width+(row===0&&i===3?wordGap:gap);
  }
  widths.push(x-gap);
 }
 const width=Math.max(...widths),height=2*h+lineGap;
 if(width>149.9||height>50.8)throw new Error('Candidate exceeds cap field');
 const measurements={status:'UNAPPROVED CANDIDATE — supplier acceptance pending',source:'designs/13-ours-to-spend/design.svg',sourceSha256:sha(bytes),
  parameters:{sourceCapMm:sourceCap,scaledCapMm:cap,outwardOffsetMm:inflate,rollingDiscRadiusMm:radius,rollingDiscDiameterMm:2*radius,polygonArcToleranceMm:0.0005,letterGapMm:gap,wordGapMm:wordGap,lineGapMm:lineGap,periodDiameterMm:dotDiameter},
  widthMm:n(width),heightMm:n(height),fieldMm:[149.9,50.8],lineWidthsMm:widths.map(n),withinField:width<=149.9&&height<=50.8,
  glyphs:letters.map(g=>({id:g.id,char:g.char,row:g.row,widthMm:n(g.width),heightMm:n(g.height),coreStats:g.coreStats,finalStats:g.finalStats,
    coreContoursMm:g.core.map(p=>p.map(a=>[a.X/SCALE,a.Y/SCALE])),finalContoursMm:g.final.map(p=>p.map(a=>[a.X/SCALE,a.Y/SCALE]))}))};
 fs.writeFileSync(path.join(__dirname,'measurements.json'),JSON.stringify(measurements,null,2)+'\n');
 const variants={},outputs=[];
 for(const [key,palette] of Object.entries(palettes)) {
  const svg=makeSvg(letters,width,height,palette);fs.writeFileSync(path.join(__dirname,`candidate-${key}.svg`),svg);
  variants[key]=svg;
  const w=Math.round(width/25.4*600),hh=Math.round(height/25.4*600);
  const rasterSvg=svg.replace(/width="[\d.]+mm"/,`width="${w}px"`).replace(/height="[\d.]+mm"/,`height="${hh}px"`);
  await sharp(Buffer.from(rasterSvg),{density:72}).ensureAlpha().withMetadata({density:600}).png({compressionLevel:9}).toFile(path.join(__dirname,`candidate-${key}.png`));
  outputs.push({palette:key,svg:`candidate-${key}.svg`,png:`candidate-${key}.png`,pixels:[w,hh],dpi:600,transparent:true,colourSpace:'sRGB',svgSha256:sha(Buffer.from(svg)),pngSha256:sha(fs.readFileSync(path.join(__dirname,`candidate-${key}.png`)))});
 }
 const proof=proofSvg(bytes.toString('utf8'),variants['bone-sun'],width,height,variants);
 fs.writeFileSync(path.join(__dirname,'comparison-proof.svg'),proof);
 await sharp(Buffer.from(proof.replace('width="190mm" height="244mm"','width="1600px" height="2055px"')),{density:72}).png().toFile(path.join(__dirname,'comparison-proof.png'));
 const ownerApproval=fs.existsSync(path.join(__dirname,'owner-approval.json'));
 fs.writeFileSync(path.join(__dirname,'manifest.json'),JSON.stringify({status:ownerApproval?'OWNER APPROVED FOR SETUP — supplier digitization acceptance pending':'UNAPPROVED CANDIDATE — do not upload or replace approved production art without owner proof approval',...(ownerApproval?{ownerApproval:'owner-approval.json'}:{}),source:measurements.source,sourceSha256:measurements.sourceSha256,dimensionsMm:[n(width),n(height)],pngDpi:600,files:outputs,comparisonProof:'comparison-proof.png',builder:'build.cjs',geometry:'measurements.json'},null,2)+'\n');
 if(sha(fs.readFileSync(SOURCE))!==sha(bytes))throw new Error('Source changed');
 console.log(JSON.stringify({width,height,widths,withinField:measurements.withinField,glyphs:letters.map(g=>({id:g.id,char:g.char,core:g.coreStats,final:g.finalStats}))},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
