const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixture.json'), 'utf8'));
const source = fs.readFileSync(path.join(__dirname, 'after.js'), 'utf8');
function browser(handle, names, selected) {
  const classes = new Map();
  vm.runInNewContext(source, {HTMLElement: class {}, customElements: {get: n => classes.get(n), define: (n,c) => classes.set(n,c)}, URL, location: {origin: 'https://offshft.myshopify.com'}, AbortController});
  const b = new (classes.get('offshft-design-browser'))();
  b.navigationData = data;
  b.navigationSource = {handle, optionNames: names, variants: Object.entries(data.products[handle].variants).map(([id,c]) => ({id,options:c[4],available:true}))};
  b.navigationPicker = {getAllSelectedOptions: () => selected};
  return b;
}
test('one-size hat resolves the selected colour even though Size is rendered as text', () => {
  for (const [id,c] of Object.entries(data.products['for-a-reason-hat'].variants)) {
    const b = browser('for-a-reason-hat', ['Size','Colour'], [{name:'Colour',value:c[4][1]}]);
    assert.equal(b.selectedDesignVariant(), id);
  }
});
test('Charcoal and Evergreen expose other real designs on the same trucker base', () => {
  for (const colour of ['Charcoal','Evergreen']) {
    const b = browser('for-a-reason-hat', ['Size','Colour'], [{name:'Colour',value:colour}]);
    const selected = b.selectedDesignVariant();
    assert.ok(selected);
    for (const h of ['off-shft-logo-hat','punched-out-hat','the-clock-hat','ours-to-spend-trucker-hat','banked-time-hat','parked-trucker-hat']) {
      const target = {handle:h, variants:Object.entries(data.products[h].variants).map(([id,c]) => ({id,options:c[4],available:true}))};
      const id = b.resolveDesignContext(b.navigationSource,selected,target);
      assert.ok(id, h);
      const c = data.products[h].variants[id];
      assert.equal(c[0],252);
      if (colour === 'Evergreen') assert.equal(c[2],colour);
    }
  }
});
test('does not guess a missing choice when that option has multiple values', () => {
  const b = browser('off-shft-logo-hat',['Style','Colour'],[{name:'Colour',value:'Black'}]);
  assert.equal(b.selectedDesignVariant(),null);
});
test('retains an explicit invalid selection rather than replacing it with a constant', () => {
  const b = browser('for-a-reason-hat',['Size','Colour'],[{name:'Size',value:'XL'},{name:'Colour',value:'Charcoal'}]);
  assert.equal(b.selectedDesignVariant(),null);
});
test('fully selected clothing still resolves the same native variant', () => {
  const handle='off-shft-golf-club-performance-golf-shirt';
  for(const [id,c] of Object.entries(data.products[handle].variants)) {
    const names=['Style','Size','Colour'];
    const b=browser(handle,names,names.map((name,i)=>({name,value:c[4][i]})));
    assert.equal(b.selectedDesignVariant(),id);
  }
});
