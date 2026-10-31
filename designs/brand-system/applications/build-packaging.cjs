// OFF SHFT apparel / packaging artwork. Run from any directory with Node.
// Uses the chosen logo masters verbatim. All support type is outlined Archivo.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '../../..');
const kit = require(path.join(root, 'tools/kit/kit.cjs'));
const masterDir = path.join(root, 'designs/mark/final/the-o');
const C = { bone: '#ECE5D3', ink: '#1F2733', rust: '#B4552D', sun: '#D29B3C' };
const masters = {};
for (const name of ['logo-light', 'logo-dark', 'symbol-light', 'symbol-dark']) {
  const file = path.join(masterDir, name + '.svg');
  const raw = fs.readFileSync(file, 'utf8');
  masters[name] = { ...kit.readSvg(file), sha256: crypto.createHash('sha256').update(raw).digest('hex') };
}
const rect = (x,y,w,h,fill,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
const line = (x1,y1,x2,y2,stroke,width=.25,extra='') => `<path d="M${x1} ${y1}H${x2}" stroke="${stroke}" stroke-width="${width}" fill="none" ${extra}/>`;
const copy = (s,x,y,cap,fill=C.ink,options={}) => kit.text(s,{x,y,cap,fill,font:'semi',...options}).svg;
const mark = (name,x,y,w) => {
  const m=masters[name];
  return `<svg x="${x}" y="${y}" width="${w}" height="${w*m.h/m.w}" viewBox="${m.viewBox}" data-source="designs/mark/final/the-o/${name}.svg">${m.inner}</svg>`;
};
const symbol = (name,cx,y,h) => mark(name,cx-h*masters[name].w/masters[name].h/2,y,h*masters[name].w/masters[name].h);
const docs = {};
function write(name,w,h,body,title,desc) {
  docs[name] = {w,h,body};
  const content=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}">\n<title>${title}</title>\n<desc>${desc}</desc>\n${body}\n</svg>\n`;
  fs.writeFileSync(path.join(__dirname,name+'.svg'),content);
}

// 55 x 90 mm trim with 3 mm bleed. Hole is a separate technical guide.
write('hangtag-front',61,96,
  rect(0,0,61,96,C.bone)+
  mark('logo-light',10.5,37.15,40)+
  copy('Your time.',30.5,80,2.5,C.ink,{anchor:'middle',track:.015})+
  rect(0,91,61,5,C.rust),
  'OFF SHFT — hangtag front',
  '55 x 90 mm finished; 3 mm bleed on all sides. Outlined artwork. Use separate hangtag-cut-guide.svg for trim and proposed punch position.');
write('hangtag-back',61,96,
  rect(0,0,61,96,C.ink)+symbol('symbol-dark',30.5,34,28),
  'OFF SHFT — hangtag back',
  '55 x 90 mm finished; 3 mm bleed on all sides. Pair with hangtag-front.svg. Outlined artwork; no product claims.');

// Brand label only. Finished face is x 7–97. End folds carry ground only.
write('woven-neck-label',104,35,
  rect(0,0,104,35,C.ink)+mark('logo-dark',(104-62.641)/2,(35-18.039)/2,62.641),
  'OFF SHFT — woven neck brand label',
  '90 x 35 mm finished face, plus a 7 mm end fold at each side: 104 x 35 mm overall. Brand label only. Supplier construction and weave proof required.');

// This is the outer top-panel artwork, not a complete box cutting pattern.
write('box-top-panel',300,220,
  rect(0,0,300,220,C.bone)+mark('logo-light',60,78,180)+
  copy('Your time.',25,193,4,C.ink,{track:.015}),
  'OFF SHFT — box top panel artwork',
  'Indicative 300 x 220 mm top panel. No bleed or production box dieline is supplied. Transfer to the selected supplier dieline and approve a physical print proof.');

// A quiet, generous insert. The opening phrase has one typographic role.
write('package-insert',154,111,
  rect(0,0,154,111,C.bone)+
  mark('logo-light',15,16,43)+
  copy('Your time.',14.2,80.5,14,C.ink,{font:'semi',track:-.015})+
  rect(15,94,18,1.2,C.rust),
  'OFF SHFT — package insert',
  '148 x 105 mm finished; 3 mm bleed on all sides. Front artwork only; reverse intentionally unspecified. All type is outlined.');

// Square bleed canvas for a 45 mm circular die-cut. The circular cutter is separate.
write('seal-sticker',51,51,
  rect(0,0,51,51,C.ink)+symbol('symbol-dark',25.5,15.5,20),
  'OFF SHFT — circular seal sticker',
  '45 mm finished circle, centered at 25.5,25.5 on a 51 x 51 mm canvas; 3 mm bleed. Use separate seal-cut-guide.svg.');

// Technical guides remain independent of printable art. No guide is production ink.
write('hangtag-cut-guide',61,96,
  '<g fill="none" stroke="#FF00FF" stroke-width=".15"><rect x="3" y="3" width="55" height="90"/><circle cx="30.5" cy="10" r="1.75"/></g>'+
  '<rect x="7" y="7" width="47" height="82" fill="none" stroke="#00A6C8" stroke-width=".12" stroke-dasharray="1.2 1.2"/>',
  'Technical guide — hangtag',
  'NON-PRINTING. Magenta: 55 x 90 mm trim and proposed 3.5 mm hole, centered 7 mm below top trim. Cyan: 4 mm live-area inset. Confirm hole and cord with supplier.');
write('woven-neck-label-fold-guide',104,35,
  '<rect x="0.1" y="0.1" width="103.8" height="34.8" fill="none" stroke="#FF00FF" stroke-width=".15"/>'+
  '<path d="M7 0V35 M97 0V35" fill="none" stroke="#00A6C8" stroke-width=".15" stroke-dasharray="1.2 1.2"/>'+
  '<rect x="12" y="4" width="80" height="27" fill="none" stroke="#00A6C8" stroke-width=".12" stroke-dasharray=".4 1"/>',
  'Technical guide — woven neck brand label',
  'NON-PRINTING. Magenta: overall 104 x 35 mm cut. Cyan dashed: 7 mm end folds. Dotted cyan: suggested live-art area x12–92, y4–31. No care or fiber information.');
write('insert-cut-guide',154,111,
  '<rect x="3" y="3" width="148" height="105" fill="none" stroke="#FF00FF" stroke-width=".15"/>'+
  '<rect x="8" y="8" width="138" height="95" fill="none" stroke="#00A6C8" stroke-width=".12" stroke-dasharray="1.2 1.2"/>',
  'Technical guide — package insert',
  'NON-PRINTING. Magenta: 148 x 105 mm trim. Cyan: 5 mm safe inset from trim.');
write('seal-cut-guide',51,51,
  '<circle cx="25.5" cy="25.5" r="22.5" fill="none" stroke="#FF00FF" stroke-width=".15"/>'+
  '<circle cx="25.5" cy="25.5" r="19.5" fill="none" stroke="#00A6C8" stroke-width=".12" stroke-dasharray="1.2 1.2"/>',
  'Technical guide — circular seal sticker',
  'NON-PRINTING. Magenta: 45 mm diameter circular cut. Cyan: 3 mm safe inset.');

// Contact board shows finished faces with technical bleed and folds cropped away.
function tile(name,x,y,w,{trim=[0,0,docs[name].w,docs[name].h],round=false,hole=false}={}) {
  const d=docs[name], h=w*trim[3]/trim[2], id='clip-'+name;
  const clip=round?`<circle cx="${x+w/2}" cy="${y+h/2}" r="${w/2}"/>`:`<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const shadow=round?`<circle cx="${x+w/2+1.1}" cy="${y+h/2+1.4}" r="${w/2}" fill="${C.ink}" opacity=".10"/>`:rect(x+1.1,y+1.4,w,h,C.ink,'opacity=".10"');
  return shadow+`<defs><clipPath id="${id}">${clip}</clipPath></defs><g clip-path="url(#${id})"><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${trim.join(' ')}">${d.body}</svg></g>`+
    (hole?`<circle cx="${x+w/2}" cy="${y+7*w/55}" r="${1.75*w/55}" fill="#D4D0C4"/>`:'');
}
const neutral='#D4D0C4';
let board=rect(0,0,480,390,neutral)+
  mark('logo-light',20,16,72)+
  copy('APPAREL / PACKAGING',460,25,3,C.ink,{font:'semi',track:.09,anchor:'end'})+
  copy('Application study · 01',460,34,2.1,C.ink,{font:'semi',anchor:'end'})+
  line(20,48,460,48,C.ink,.2,'opacity=".25"')+
  tile('hangtag-front',20,66,57,{trim:[3,3,55,90],hole:true})+
  tile('hangtag-back',94,66,57,{trim:[3,3,55,90],hole:true})+
  copy('01  HANGTAG / FRONT + BACK',20,171,2.1,C.ink,{track:.035})+
  copy('55 × 90 mm',20,179,2,C.ink)+
  tile('woven-neck-label',20,214,131,{trim:[7,0,90,35]})+
  copy('02  WOVEN BRAND LABEL',20,278,2.1,C.ink,{track:.035})+
  copy('90 × 35 mm finished',20,286,2,C.ink)+
  tile('box-top-panel',180,66,280)+
  copy('03  BOX TOP / INDICATIVE PANEL',180,284,2.1,C.ink,{track:.035})+
  copy('300 × 220 mm',180,292,2,C.ink)+
  tile('package-insert',180,311,86,{trim:[3,3,148,105]})+
  copy('04  INSERT',278,335,2.1,C.ink,{track:.035})+
  copy('148 × 105 mm',278,343,2,C.ink)+
  tile('seal-sticker',20,315,45,{trim:[3,3,45,45],round:true})+
  copy('05  SEAL',78,335,2.1,C.ink,{track:.035})+
  copy('45 mm diameter',78,343,2,C.ink)+
  copy('Artwork proposal. Physical supplier proofs required. Items shown at different scales.',460,380,1.8,C.ink,{anchor:'end'});
write('application-contact-board',480,390,board,
  'OFF SHFT — apparel and packaging applications',
  'Presentation contact board, not production artwork. Finished faces at different scales. The official logo geometry and colors are embedded unchanged.');

// Reproducible source provenance, deliberately external to the artwork canvas.
fs.writeFileSync(path.join(__dirname,'source-manifest.json'),JSON.stringify({
  generatedBy:'build-packaging.cjs',
  note:'Logo SVG inner markup is embedded verbatim; wrappers only position and uniformly scale it.',
  sources:Object.fromEntries(Object.entries(masters).map(([name,m])=>[name,{file:'designs/mark/final/the-o/'+name+'.svg',sha256:m.sha256}])),
  productionArtwork:['hangtag-front','hangtag-back','woven-neck-label','box-top-panel','package-insert','seal-sticker'].map(x=>x+'.svg'),
  technicalGuides:['hangtag-cut-guide','woven-neck-label-fold-guide','insert-cut-guide','seal-cut-guide'].map(x=>x+'.svg')
},null,2)+'\n');
console.log('Wrote 6 artwork SVGs, 4 separate technical guides, contact board and source manifest.');
