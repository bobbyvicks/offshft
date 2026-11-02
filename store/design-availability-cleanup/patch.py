from pathlib import Path
folder = Path(__file__).parent
source = (folder / 'before.js').read_text(encoding='utf-8')
start = source.index('  const golfBase=')
end = source.index('    if(!link.defaultNote', start)
replacement = '''  for(const link of this.navigationLinks||[]){
    const id=selectedId&&this.navigationSource?this.resolveDesignContext(this.navigationSource,selectedId,link):null;
    if(selectedId&&this.navigationSource&&this.navigationData){
      if(!id){
        link.element.hidden=true;
        link.element.style.setProperty('display','none','important');
        link.element.setAttribute('data-offshft-design-unavailable-hidden','');
      }else if(link.element.hasAttribute('data-offshft-design-unavailable-hidden')){
        link.element.hidden=false;
        link.element.style.removeProperty('display');
        link.element.removeAttribute('data-offshft-design-unavailable-hidden');
      }
    }
'''
(folder / 'after.js').write_text(source[:start]+replacement+source[end:], encoding='utf-8', newline='\n')
