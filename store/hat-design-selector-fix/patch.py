from pathlib import Path

folder = Path(__file__).parent
source = (folder / 'before.js').read_text(encoding='utf-8')
old = 'selected=source.optionNames.map(name=>options[name]);return source.variants.find'
new = '''selected=source.optionNames.map((name,index)=>{
  if(Object.prototype.hasOwnProperty.call(options,name))return options[name];
  // A single-value option is rendered as text, so the native picker omits it.
  const values=new Set(source.variants.map(variant=>variant.options[index]));
  return values.size===1?values.values().next().value:undefined;
});return source.variants.find'''
assert source.count(old) == 1
(folder / 'after.js').write_text(source.replace(old,new), encoding='utf-8', newline='\n')
