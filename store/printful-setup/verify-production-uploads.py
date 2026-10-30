"""Read-only image/source checks; writes only handoff audit and mapping CSV."""
import csv
import hashlib
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageCms

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    manifest = json.loads((HERE / "production-artwork-manifest.json").read_text(encoding="utf-8"))
    assert digest(ROOT / manifest["sourceColourways"]) == manifest["sourceColourwaysSha256"]
    assert len(manifest["mappings"]) == 4
    assert sum(len(item["colourways"]) for item in manifest["mappings"]) == 16
    files = manifest["files"]
    assert len(files) == 12
    results = []
    alpha_by_concept = {}
    for item in files:
        source, vector, raster = (ROOT / item[key] for key in ("sourceSvg", "svg", "png"))
        assert digest(source) == item["sourceSvgSha256"] == digest(vector) == item["svgSha256"]
        assert digest(raster) == item["pngSha256"]
        reference = ROOT / item["sourceReferencePng"]
        assert digest(reference) == item["sourceReferencePngSha256"]
        image = Image.open(raster)
        assert image.mode == "RGBA" and list(image.size) == item["pixels"]
        assert abs(image.info["dpi"][0] - 600) < 0.01
        profile = ImageCms.ImageCmsProfile(io.BytesIO(image.info["icc_profile"]))
        assert "srgb" in ImageCms.getProfileDescription(profile).lower()
        pixels = np.asarray(image)
        alpha = pixels[:, :, 3]
        assert int(alpha.min()) == 0 and int(alpha.max()) == 255
        assert np.count_nonzero(alpha == 0) > 0
        counts = {}
        for colour in item["colourHexes"]:
            rgb = np.array([int(colour[i:i + 2], 16) for i in (1, 3, 5)])
            counts[colour] = int(np.count_nonzero(np.all(pixels[:, :, :3] == rgb, axis=2) & (alpha == 255)))
            assert counts[colour] > 100, (item["id"], colour)
        group = item["conceptId"]
        if group in alpha_by_concept:
            assert np.array_equal(alpha, alpha_by_concept[group]), group
        else:
            alpha_by_concept[group] = alpha.copy()
        ref = Image.open(reference)
        ref_alpha = ref.getchannel("A")
        bbox = ref_alpha.getbbox()
        reference_dpi = (bbox[2] - bbox[0]) * 25.4 / item["physicalWidthMm"]
        results.append({"id": item["id"], "sourceUnchanged": True, "svgByteIdentical": True,
                        "pixels": item["pixels"], "dpiMetadata": image.info["dpi"],
                        "transparentPixels": int(np.count_nonzero(alpha == 0)),
                        "opaqueBrandColourPixelCounts": counts,
                        "alphaBounds": image.getchannel("A").getbbox(),
                        "existingReference": {"path": item["sourceReferencePng"], "pixels": list(ref.size),
                            "alphaBounds": bbox, "dpiMetadata": ref.info.get("dpi"),
                            "effectiveArtworkDpiAtApprovedWidth": round(reference_dpi, 2),
                            "hasReviewPadding": bbox != (0, 0, ref.width, ref.height)}})
    product_ids = {"11-time-well-earned": "15478491971906", "12-the-rest-is-ours": "15478492004674",
                   "13-ours-to-spend": "15478492037442", "14-five-oclock": "15478492070210"}
    placements = {"11-time-well-earned": "Centered embroidery", "12-the-rest-is-ours": "Back DTG (S route unresolved; Large Back M-3XL)",
                  "13-ours-to-spend": "Front embroidery", "14-five-oclock": "Large Front embroidery"}
    file_map = {item["id"]: item for item in files}
    rows = []
    for product in manifest["mappings"]:
        for colour in product["colourways"]:
            applications = [(colour, placements[product["conceptId"]])]
            if "frontLogo" in colour:
                applications.append((colour["frontLogo"], "Left chest embroidery (joint back-DTG configuration unresolved)"))
            for app, placement in applications:
                asset = file_map[app["artworkId"]]
                rows.append({"Product": product["title"], "Shopify product ID": product_ids[product["conceptId"]],
                    "Blank": product["garment"], "Colour": colour["colour"], "Placement": placement,
                    "Width mm": asset["physicalWidthMm"], "Height mm": asset["physicalHeightMm"],
                    "Width inches": round(asset["physicalWidthInches"], 5),
                    "Pixels": " x ".join(map(str, asset["pixels"])), "DPI": 600,
                    "PNG path from repository": asset["png"], "SVG path from repository": asset["svg"],
                    "Artwork colours": " / ".join(asset["colourHexes"]),
                    "Thread mapping": "Not applicable to DTG" if "Back DTG" in placement else "Unconfirmed; candidates only in thread-candidates.json"})
    assert len(rows) == 20
    with (HERE / "production-placement-map.csv").open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    report = {"passed": True, "uniqueArtworkCount": 12, "colourwayCount": 16, "placementCount": 20,
              "sourceArtworkUnchanged": True, "allSvgCopiesByteIdentical": True,
              "allPngsTransparentSrgb": True, "allPngs600Dpi": True,
              "brandColourInteriorsPreserved": True, "alphaGeometryEqualAcrossPaletteVariants": True,
              "digitizedStitchFilesCreated": False, "threadSubstitutionApplied": False,
              "files": results}
    (HERE / "production-artwork-verification.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: value for key, value in report.items() if key != "files"}, indent=2))


if __name__ == "__main__":
    main()
