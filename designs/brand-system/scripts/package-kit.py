"""Package the complete handoff, excluding intermediate PDF review renders."""
from pathlib import Path
import zipfile
ROOT=Path(__file__).resolve().parents[1]
dest=ROOT/'output'/'OFF-SHFT-Brand-Kit.zip'
with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(ROOT.rglob('*')):
        if not p.is_file() or p==dest or '__pycache__' in p.parts or p.name=='.gitignore':continue
        if p.parent.name=='output' and p.name!='OFF-SHFT-Brand-Guide.pdf':continue
        z.write(p,Path('OFF-SHFT-Brand-Kit')/p.relative_to(ROOT))
with zipfile.ZipFile(dest) as z:
    assert z.testzip() is None
    names=z.namelist()
    assert len([n for n in names if '/assets/' in n and n.endswith('.svg')])==12
    assert any(n.endswith('OFF-SHFT-Brand-Guide.pdf') for n in names)
    print(f'Packaged {len(names)} files; ZIP integrity verified: {dest}')
