const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),test=require('node:test'),assert=require('node:assert/strict');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'fixture.json'),'utf8'));
const source=fs.readFileSync(path.join(__dirname,'after.js'),'utf8');
function element(){const attrs=new Map,styles=new Map;return {hidden:false,style:{setProperty:(k,v)=>styles.set(k,v),removeProperty:k=>styles.delete(k),getPropertyValue:k=>styles.get(k)||''},setAttribute:(k,v)=>attrs.set(k,v),getAttribute:k=>attrs.get(k),hasAttribute:k=>attrs.has(k),removeAttribute:k=>attrs.delete(k)};}
function product(handle){return {handle,base:'/products/'+handle,variants:Object.entries(data.products[handle].variants).map(([id,c])=>({id,options:c[4],available:true})),element:element(),note:{hidden:true,textContent:'Choose options'}};}
function browser(handle,handles){const classes=new Map;vm.runInNewContext(source,{HTMLElement:class{},customElements:{get:n=>classes.get(n),define:(n,c)=>classes.set(n,c)},URL,location:{origin:'https://offshft.myshopify.com'},AbortController});const b=new(classes.get('offshft-design-browser'));b.dataset={navigationHandle:handle};b.navigationData=data;b.navigationSource=product(handle);b.navigationLinks=handles.map(product);b.filterPreviewColours=()=>{};return b;}
const caps=Object.keys(data.products).filter(h=>h.endsWith('-hat')&&!h.endsWith('-bucket-hat'));
const visible=b=>b.navigationLinks.filter(l=>!l.element.hidden&&l.element.style.getPropertyValue('display')!=='none').map(l=>l.handle);
test('hide designs unavailable on the selected hat, and restore them after a base change',()=>{
 const b=browser('for-a-reason-hat',caps);
 b.updateDesignNavigation('67958236119362');
 assert.equal(visible(b).length,7);
 assert.ok(!visible(b).includes('suns-still-up-hat'));
 b.updateDesignNavigation('67958236152130');
 assert.deepEqual(visible(b),['for-a-reason-hat']);
 b.updateDesignNavigation('67958236184898');
 assert.equal(visible(b).length,7);
 for(const l of b.navigationLinks.filter(l=>!l.element.hidden))assert.ok(l.element.getAttribute('href')?.includes('variant='));
});
test('keep the current visible choices while selection is unconfirmed',()=>{
 const b=browser('for-a-reason-hat',caps);
 b.updateDesignNavigation('67958236152130');
 b.updateDesignNavigation(null);
 assert.deepEqual(visible(b),['for-a-reason-hat']);
});
test('golf cards show only the four designs on the selected base',()=>{
 const handles=Object.keys(data.products).filter(h=>h.endsWith('-golf-shirt'));
 const h='time-well-spent-performance-golf-shirt',b=browser(h,handles);
 b.updateDesignNavigation(Object.keys(data.products[h].variants)[0]);
 assert.equal(visible(b).length,4);
 assert.ok(visible(b).includes('punched-out-golf-shirt'));
});
test('all confirmed hoodie choices hide only designs lacking the same supplier base and size',()=>{
 const handles=Object.keys(data.products).filter(h=>h.endsWith('-hoodie'));
 let missing=0;
 for(const handle of handles){const b=browser(handle,handles);for(const[id,c]of Object.entries(data.products[handle].variants)){
   b.updateDesignNavigation(id);
   for(const l of b.navigationLinks){const offered=Object.values(data.products[l.handle].variants).some(t=>t[0]===c[0]&&t[3]===c[3]);assert.equal(!l.element.hidden,offered,handle+' to '+l.handle);if(!offered)missing++;}
 }}
 assert.ok(missing>0);
});
test('a configured but sold-out variant remains a design option',()=>{
 const b=browser('for-a-reason-hat',caps);
 for(const l of b.navigationLinks)for(const v of l.variants)v.available=false;
 b.updateDesignNavigation('67958236119362');
 assert.equal(visible(b).length,7);
});
