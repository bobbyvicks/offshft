// The size charts shown in each product page's Size & fit row (product metafield custom.size_chart, type json).
// Source: the Size & fit page's charts (makers' spec sheets, cross-checked against copies of Printful's size guides,
// store/research and /tmp/pfs/size-charts.md, 2 Nov 2026). Writes size-charts.json (by handle) and, when asked, the
// metafieldsSet variables.
//   node store/theme/size-charts.cjs            writes store/theme/size-charts.json
//   node store/theme/size-charts.cjs --vars     prints the metafieldsSet variables (ids below)
'use strict';
const fs = require('fs');
const path = require('path');
const C = (title, rows, columns = ['Chest, cm (in)', 'Length, cm (in)']) => ({ title, columns, rows });
const OVER = [['S', '57 (22½)', '70.5 (27¾)'], ['M', '60 (23½)', '73 (28¾)'], ['L', '63 (24¾)', '75.5 (29¾)'], ['XL', '66 (26)', '78 (30¾)'], ['2XL', '69 (27¼)', '80.5 (31¾)'], ['3XL', '72 (28¼)', '83 (32¾)']];
const GD = [['S', '53.5 (21)', '70 (27½)'], ['M', '58.5 (23)', '72.5 (28½)'], ['L', '63.5 (25)', '75 (29½)'], ['XL', '67.5 (26½)', '77.5 (30½)'], ['2XL', '71 (28)', '80 (31½)'], ['3XL', '75 (29½)', '82.5 (32½)']];
const LW = [['S', '51 (20)', '68.5 (27)'], ['M', '56 (22)', '71 (28)'], ['L', '61 (24)', '73.5 (29)'], ['XL', '66 (26)', '76 (30)'], ['2XL', '71 (28)', '78.5 (31)'], ['3XL', '76 (30)', '81.5 (32)']];
const HW = [['S', '46.5 (18¼)', '67.5 (26⅝)'], ['M', '51.5 (20¼)', '71 (28)'], ['L', '56 (22)', '74.5 (29⅜)'], ['XL', '61 (24)', '78 (30¾)'], ['2XL', '66 (26)', '80.5 (31⅝)'], ['3XL', '70.5 (27¾)', '82.5 (32½)']];
const PK = [['S', '44.5 (17½)', '67.5 (26⅝)'], ['M', '49.5 (19½)', '71 (28)'], ['L', '54 (21¼)', '74.5 (29⅜)'], ['XL', '58.5 (23)', '78 (30¾)'], ['2XL', '63.5 (25)', '80.5 (31⅝)']];
const CP = [['S', '50 (19¾)', '70 (27½)'], ['M', '53 (20⅞)', '72 (28⅜)'], ['L', '56 (22)', '74 (29⅛)'], ['XL', '59 (23¼)', '76 (29⅞)'], ['2XL', '62 (24⅜)', '79 (31⅛)'], ['3XL', '66 (26)', '83 (32⅝)']];
const CL = [['S', '52 (20½)', '73.5 (29)'], ['M', '54.5 (21½)', '76 (30)'], ['L', '59.5 (23½)', '78.5 (31)'], ['XL', '65 (25½)', '81.5 (32)'], ['2XL', '68.5 (27)', '84 (33)'], ['3XL', '72.5 (28½)', '85 (33½)']];
const PF = [['S', '51 (20¼)', '73 (28¾)'], ['M', '54 (21¼)', '75 (29½)'], ['L', '59.5 (23½)', '77 (30¼)'], ['XL', '62.5 (24½)', '79 (31)'], ['2XL', '67.5 (26½)', '81.5 (32)'], ['3XL', '72.5 (28½)', '84 (33)']];
const SW = [['S', '38 (15)', '70.5 (27¾)'], ['M', '40.5 (16)', '72 (28¼)'], ['L', '43 (17)', '73 (28¾)'], ['XL', '45.5 (18)', '74.5 (29¼)'], ['2XL', '48.5 (19)', '75.5 (29¾)']];
const JK = [['S', '54 (21¼)', '69 (27¼)'], ['M', '58 (22¾)', '71 (28)'], ['L', '61.5 (24¼)', '73 (28¾)'], ['XL', '65.5 (25¾)', '75 (29½)'], ['2XL', '69 (27¼)', '77 (30¼)']];

const CHARTS = {
  hoodie3: { tables: [C('Oversized', OVER), C('Garment-Dyed', GD), C('Lightweight', LW)] },
  hoodie2: { tables: [C('Oversized', OVER), C('Garment-Dyed', GD)] },
  lightweightHoodie: { tables: [C('Lightweight hoodie', LW)] },
  crewneck: { tables: [C('Crewneck', LW)] },
  sweatpants: { tables: [C('Sweatpants', SW, ['Waist, cm (in)', 'Inseam, cm (in)'])] },
  tee2: { tables: [C('Heavyweight', HW), C('Pocket', PK)] },
  heavyweightTee: { tables: [C('Heavyweight tee', HW)] },
  jacket: { tables: [C('Jacket', JK)] },
  quarterZip: { tables: [C('Quarter-zip', LW)] },
  golf: { tables: [C('Cotton Pique', CP), C("Classic (men's cut)", CL), C('Performance', PF)], note: 'The Cotton Pique runs small by most accounts. Between sizes? Take the bigger one.' },
};
// Shopify product ids (read 2 Nov 2026) and which chart each listing gets. Hats, beanies and bucket hats have none.
const PRODUCTS = {
  'off-shft-logo-hoodie': ['15476770144578', 'hoodie3'], 'the-clock-hoodie': ['15476770210114', 'hoodie3'], 'punched-out-hoodie': ['15476770275650', 'hoodie3'],
  'nowhere-to-be-hoodie': ['15479092183362', 'hoodie2'], 'not-picking-up-hoodie': ['15479092314434', 'hoodie2'],
  'the-rest-is-ours-hoodie': ['15478492004674', 'lightweightHoodie'],
  'off-shft-logo-crewneck': ['15476774764866', 'crewneck'], 'the-clock-crewneck': ['15476774830402', 'crewneck'], 'punched-out-crewneck': ['15476774895938', 'crewneck'],
  'five-oclock-crewneck': ['15478492070210', 'crewneck'], 'no-alarm-set-crewneck': ['15479092248898', 'crewneck'],
  'off-shft-logo-sweatpants': ['15476774961474', 'sweatpants'], 'the-clock-sweatpants': ['15476774994242', 'sweatpants'], 'punched-out-sweatpants': ['15476775059778', 'sweatpants'],
  'off-shft-logo-t-shirt': ['15476778631490', 'tee2'], 'the-clock-t-shirt': ['15476778729794', 'tee2'], 'time-well-earned-t-shirt': ['15478491971906', 'heavyweightTee'],
  'off-shft-logo-jacket': ['15476778795330', 'jacket'], 'the-clock-jacket': ['15476778860866', 'jacket'], 'punched-out-jacket': ['15476778926402', 'jacket'],
  'off-shft-logo-quarter-zip': ['15478605218114', 'quarterZip'], 'the-clock-quarter-zip': ['15478605250882', 'quarterZip'], 'punched-out-quarter-zip': ['15478605316418', 'quarterZip'],
  'punched-out-golf-shirt': ['15478605381954', 'golf'],
};

const byHandle = Object.fromEntries(Object.entries(PRODUCTS).map(([h, [, k]]) => [h, CHARTS[k]]));
fs.writeFileSync(path.join(__dirname, 'size-charts.json'), JSON.stringify(byHandle, null, 1) + '\n');
if (process.argv.includes('--vars')) {
  const metafields = Object.entries(PRODUCTS).map(([, [id, k]]) => ({ ownerId: `gid://shopify/Product/${id}`, namespace: 'custom', key: 'size_chart', type: 'json', value: JSON.stringify(CHARTS[k]) }));
  process.stdout.write(JSON.stringify({ metafields }));
} else console.log(`${Object.keys(PRODUCTS).length} listings, written to size-charts.json`);
