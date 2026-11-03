"""Materialize exact pinned builder dependencies without checking out another branch."""
import subprocess
from pathlib import Path
H=Path(__file__).parent;R=H.parents[1];commit=(H/'source-ref.txt').read_text(encoding='utf-8-sig').strip()
assert len(commit)==40
for name in ['designs/mark/final/the-o/build.cjs','designs/09-punched-out/v3/build.cjs','designs/phrases/build.cjs','tools/fonts/Unbounded-Bold.ttf']:
 data=subprocess.check_output(['git','show',commit+':'+name],cwd=R)
 dest=H/'masters'/name;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
print('Restored four exact canonical build dependencies.')
