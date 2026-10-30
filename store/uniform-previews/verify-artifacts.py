"""Read-only integrity checks for the uniform-preview asset handoff."""
import hashlib
import json
import sys
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

plan = json.loads((HERE / "media-deployment-plan.json").read_text(encoding="utf-8"))
inventory = json.loads((HERE / "catalogue-inventory.json").read_text(encoding="utf-8"))
rows = plan["replacements"]
assert len(rows) == 28
assert len({r["originalCdnFilename"] for r in rows}) == 28
assert sum(r["isLead"] for r in rows) == 26
assert len({r["productHandle"] for r in rows if r["isLead"]}) == 26

for record in plan["sources"]:
    assert sha(ROOT / record["file"]) == record["sha256"], record["file"]
for row in rows:
    source, output = ROOT / row["sourcePath"], ROOT / row["outputPath"]
    assert sha(source) == row["sourceSha256"], row["sourcePath"]
    assert sha(output) == row["outputSha256"], row["outputPath"]
    with Image.open(output) as im:
        assert im.size == (1254, 1254), (output.name, im.size)
        assert im.mode == "RGB", (output.name, im.mode)
        im.verify()

assert inventory["summary"]["products"] == 32
assert inventory["summary"]["galleryImages"] == 86
assert plan["verifiedCounts"]["retainedWarmBoneLeads"] == 6
assert plan["validation"]["all32LeadProductsCoveredExactlyOnceByReplacementOrRetention"]
retained = plan["retainedLeads"]
assert len(retained) == 6
for row in retained:
    assert sha(ROOT / row["activeLocalPath"]) == row["sha256"]
covered = [r["productHandle"] for r in rows if r["isLead"]] + [r["productHandle"] for r in retained]
assert len(covered) == len(set(covered)) == 32
assert set(covered) == {p["handle"] for p in inventory["products"]}

css = (HERE / "uniform-previews.css").read_text(encoding="utf-8")
assert css.count("{") == css.count("}") == 3
assert "--gallery-aspect-ratio: 1 !important" in css
assert "object-fit: contain" in css and "padding: 4%" in css

for path in HERE.glob("*.json"):
    json.loads(path.read_text(encoding="utf-8-sig"))
print("PASS: 28 unique PNG replacements, 26 lead replacements + 6 retained leads = 32 products.")
print("PASS: all source/output hashes, 1254-square RGB files, JSON and scoped preview CSS.")
if "--require-deployed" in sys.argv:
    deployed = json.loads((HERE / "deployment-progress.json").read_text(encoding="utf-8-sig"))
    expected = {r["originalCdnFilename"] for r in rows}
    assert len(deployed) == 28, len(deployed)
    assert {r["filename"] for r in deployed} == expected
    assert len({r["fileId"] for r in deployed}) == 28
    assert all(r["status"].startswith("replaced") for r in deployed)
    assert all("MB" in r["size"] and "pending" not in r["size"] for r in deployed)
    print("PASS: deployment log covers all 28 unique file IDs and expected filenames with verified sizes.")
print("NOTE: local integrity/log checks supplement the native UI readbacks and final live screenshots.")
