#!/usr/bin/env python3
"""Read local Shopify exports; print JSON, perform no store or file mutations.

Baseline: python -B verify-launch.py
Media:    python -B verify-launch.py --after shopify-after-media-export.json --stage media
Final:    python -B verify-launch.py --after shopify-after-export.json
Stage media requires DRAFT products and no published channel; stage published
(the default) requires ACTIVE products published only to Online Store. Every other
check, including original-catalog preservation, is identical in both stages.
Media order must match planned colour order; original media order is preserved.
Exported processing statuses must be READY. Every inventory location must
explicitly evidence available=0 and on_hand=0; absent location evidence fails.
Optional --url-equivalence accepts exact URL pairs with saved successful fetch
hashes; it never strips cache tokens generally or proves historical file bytes.
Exit 0 means all evidenced checks pass; 1 means discrepancies; 2 means bad input.
Missing required export fields fail explicitly. Arrays, nodes and edges are accepted.
"""
import argparse
from collections import Counter
from decimal import Decimal, InvalidOperation
import hashlib
import json
from pathlib import Path
import sys
from urllib.parse import unquote, urlparse

HERE = Path(__file__).resolve().parent
MISSING = "<not exported>"


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8-sig"))


def rows(value):
    if isinstance(value, list):
        return value
    if isinstance(value, dict):
        if "nodes" in value:
            return rows(value["nodes"])
        if "edges" in value:
            return [e["node"] for e in value["edges"]]
    return []


def products(snapshot):
    value = snapshot.get("products", snapshot.get("data", {}).get("products"))
    if value is None:
        raise ValueError("Export has neither products nor data.products")
    return rows(value)


def pick(obj, *keys):
    for key in keys:
        if key in obj:
            return obj[key]
    return MISSING


def stable(value):
    if isinstance(value, list):
        return sorted((stable(v) for v in value), key=lambda x: json.dumps(x, sort_keys=True))
    if isinstance(value, dict):
        if "nodes" in value or "edges" in value:
            return stable(rows(value))
        return {k: stable(v) for k, v in sorted(value.items())}
    return value


def price(value):
    if isinstance(value, dict):
        value = value.get("amount", MISSING)
    try:
        return str(Decimal(str(value)).quantize(Decimal("0.01")))
    except InvalidOperation:
        return value


def options(variant):
    if "selectedOptions" in variant:
        return {o["name"]: o["value"] for o in rows(variant["selectedOptions"])}
    if isinstance(variant.get("optionValues"), dict):
        return variant["optionValues"]
    return MISSING


def media(obj, include_status=False):
    result = rows(obj.get("media")) or rows(obj.get("images"))
    if not result and isinstance(obj.get("image"), dict):
        result = [obj["image"]]
    normalized = []
    for m in result:
        entry = {"id": m.get("id", MISSING),
                 "url": pick(m.get("image", m), "url", "src"),
                 "alt": pick(m, "alt", "altText") if "alt" in m or "altText" in m
                        else pick(m.get("image", {}), "altText", "alt")}
        if include_status:
            entry["processingStatuses"] = {key: m[key] for key in ("status", "fileStatus", "processingStatus") if key in m}
        normalized.append(entry)
    return normalized


def variant_media(variant, product_media, include_status=False, resolutions=None, product_id=None):
    """Resolve only legacy ProductImage associations to a unique same-product MediaImage.

    Exact URLs must match. A null legacy alt can use the actual media node's alt;
    conflicting non-null alt text, ambiguous URLs or other ID kinds stay strict.
    """
    attached = media(variant, include_status=include_status)
    for index, image in enumerate(attached):
        if not str(image["id"]).startswith("gid://shopify/ProductImage/"):
            continue
        matches = [m for m in product_media if m["url"] != MISSING and m["url"] == image["url"]
                   and str(m["id"]).startswith("gid://shopify/MediaImage/")]
        if len(matches) != 1 or image["alt"] not in (None, matches[0]["alt"]):
            continue
        target = matches[0]
        resolved = {key: target[key] for key in ("id", "url", "alt")}
        if include_status:
            resolved["processingStatuses"] = {**target.get("processingStatuses", {}), **image.get("processingStatuses", {})}
        attached[index] = resolved
        if resolutions is not None:
            resolutions.append({"productId": product_id, "variantId": variant.get("id", MISSING),
                                "sourceProductImageId": image["id"], "resolvedMediaImageId": target["id"],
                                "exactUrl": image["url"]})
    return attached


def locations(variant):
    item = variant.get("inventoryItem") or {}
    source = variant.get("locations", item.get("inventoryLevels"))
    if source is None:
        return MISSING
    result = []
    for entry in rows(source):
        location = entry.get("location", {})
        quantities = entry.get("quantities", MISSING)
        if quantities == MISSING and "available" in entry:
            quantities = [{"name": "available", "quantity": entry["available"]}]
        result.append({"location": {k: location.get(k, MISSING) for k in ("id", "name")},
                       "quantities": quantities})
    return stable(result)


def tracked(variant):
    return variant.get("tracked", (variant.get("inventoryItem") or {}).get("tracked", MISSING))


def quantity(variant):
    direct = pick(variant, "quantity", "inventoryQuantity")
    if direct != MISSING:
        return direct
    entries = locations(variant)
    if entries == MISSING or not entries:
        return MISSING
    available = []
    for entry in entries:
        values = [q["quantity"] for q in rows(entry["quantities"]) if q.get("name") == "available"]
        if len(values) != 1:
            return MISSING
        available.extend(values)
    return sum(available)


def fulfillment(variant):
    if "fulfillmentService" in variant:
        return variant["fulfillmentService"]
    source = rows((variant.get("inventoryItem") or {}).get("inventoryLevels"))
    if source and all("fulfillmentService" in x.get("location", {}) for x in source):
        services = [x["location"]["fulfillmentService"] for x in source]
        return None if all(x is None for x in services) else stable(services)
    return MISSING


def publications(product):
    source = pick(product, "publications", "resourcePublications", "resourcePublicationsV2")
    if isinstance(source, dict):
        if "nodes" in source:
            source = source["nodes"]
        elif isinstance(source.get("edges"), list):
            if not all(isinstance(e, dict) and isinstance(e.get("node"), dict) for e in source["edges"]):
                return MISSING
            source = [e["node"] for e in source["edges"]]
        else:
            return MISSING
    if not isinstance(source, list) or not all(isinstance(r, dict) for r in source):
        return MISSING
    return stable([{"name": (r.get("publication") or {}).get("name", r.get("name", MISSING)),
                    "isPublished": r.get("isPublished", MISSING)} for r in source])


def canonical_product(product, resolutions=None):
    result = {k: product.get(k, MISSING) for k in ("id", "title", "handle", "status")}
    result["options"] = stable([{k: o.get(k, MISSING) for k in ("id", "name", "values")}
                                for o in rows(product.get("options"))])
    result["publications"] = publications(product)
    result["media"] = media(product)
    result["collections"] = stable([{k: c.get(k, MISSING) for k in ("id", "title")}
                                    for c in rows(product.get("collections"))]) if "collections" in product else MISSING
    result["variants"] = {}
    for v in rows(product.get("variants")):
        result["variants"][str(v.get("id", MISSING))] = {
            "title": v.get("title", MISSING), "options": options(v),
            "price": price(v.get("price", MISSING)), "sku": v.get("sku", MISSING),
            "inventoryPolicy": v.get("inventoryPolicy", MISSING), "tracked": tracked(v),
            "quantity": quantity(v), "fulfillmentService": stable(fulfillment(v)),
            "locations": locations(v), "media": variant_media(v, result["media"], resolutions=resolutions, product_id=product.get("id"))}
    return result


def changes(before, after, prefix=""):
    if isinstance(before, dict) and isinstance(after, dict):
        for key in sorted(set(before) | set(after)):
            yield from changes(before.get(key, MISSING), after.get(key, MISSING), f"{prefix}/{key}")
    elif before != after:
        yield {"path": prefix, "before": before, "after": after}


def pagination_gaps(value, path=""):
    if isinstance(value, dict):
        if value.get("pageInfo", {}).get("hasNextPage") is True:
            yield path
        for key, child in value.items():
            yield from pagination_gaps(child, path + "/" + key)
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from pagination_gaps(child, path + f"/{index}")


def baseline(snapshot):
    ps = products(snapshot)
    vs = [v for p in ps for v in rows(p.get("variants"))]
    store = snapshot.get("store", snapshot.get("data", {}).get("shop", {}))
    domain = store.get("publicDomain", store.get("myshopifyDomain", MISSING))
    currency = pick(store, "currency", "currencyCode")
    printful = store.get("printfulInstalled", MISSING)
    result = {"productCount": len(ps), "variantCount": len(vs),
              "uniqueProductIds": len({p.get("id") for p in ps}),
              "uniqueVariantIds": len({v.get("id") for v in vs}),
              "publicDomain": domain, "currency": currency, "printfulInstalled": printful,
              "incompleteConnections": list(pagination_gaps(snapshot)),
              "products": [{"id": p.get("id"), "title": p.get("title"), "handle": p.get("handle"),
                            "variantCount": len(rows(p.get("variants")))} for p in ps]}
    errors = []
    for key, expected in {"productCount": 17, "variantCount": 253, "uniqueProductIds": 17,
                          "uniqueVariantIds": 253, "publicDomain": "offshft.myshopify.com", "currency": "CAD",
                          "printfulInstalled": False, "incompleteConnections": []}.items():
        if result[key] != expected:
            errors.append(f"Baseline {key}: expected {expected!r}, got {result[key]!r}")
    for key, actual in (("productCount", len(ps)), ("variantCount", len(vs))):
        if key in snapshot and snapshot[key] != actual:
            errors.append(f"Baseline declared {key} differs from counted records")
    result.update({"passed": not errors, "errors": errors})
    return result


def verify(before, after, plan, upload_map, stage="published", url_equivalence=None):
    if stage not in ("media", "published"):
        raise ValueError("stage must be media or published")
    report = {"stage": stage, "baseline": baseline(before), "errors": [], "originalChanges": [], "newProducts": []}
    errors = report["errors"]
    errors.extend(report["baseline"]["errors"])
    evidence = {}
    for pair in (url_equivalence or {}).get("pairs", []):
        first, second = pair.get("beforeFetch", {}), pair.get("afterFetch", {})
        digest = first.get("sha256", "")
        if (first.get("status") == second.get("status") == 200
                and first.get("url") == pair.get("beforeUrl") and second.get("url") == pair.get("afterUrl")
                and len(digest) == 64 and all(c in "0123456789abcdef" for c in digest)
                and digest == second.get("sha256")
                and first.get("bytes", 0) > 0 and first.get("bytes") == second.get("bytes")):
            evidence[(pair.get("productId"), pair.get("mediaId"), pair.get("beforeUrl"), pair.get("afterUrl"))] = digest
        else:
            errors.append(f"Invalid URL-equivalence evidence for {pair.get('mediaId', MISSING)}")
    report["urlEquivalencesUsed"] = []
    report["legacyVariantImageResolutions"] = []
    report["normalizationNotes"] = ["Collection membership compares IDs and titles, the fields present in the before export; newly exported handles are not historical changes."]
    report["normalizationNotes"].append("ProductImage associations resolve only through a unique exact-URL match to a MediaImage belonging to the same product; actual product media IDs/order/alts remain strict.")
    old = {str(p["id"]): p for p in products(before)}
    now_list = products(after)
    now = {str(p["id"]): p for p in now_list}
    if len(now) != len(now_list):
        errors.append("Duplicate product IDs in after export")
    if list(pagination_gaps(after)):
        errors.append("After export contains incomplete paginated connections")
    for pid, original in old.items():
        if pid not in now:
            errors.append(f"Original product missing: {pid}")
        else:
            first, second = canonical_product(original), canonical_product(now[pid], resolutions=report["legacyVariantImageResolutions"])
            lists = [(first["media"], second["media"])]
            lists += [(v["media"], second["variants"][vid]["media"]) for vid, v in first["variants"].items() if vid in second["variants"]]
            for original_media, current_media in lists:
                originals_by_id = {m["id"]: m for m in original_media}
                for current in current_media:
                    old_image = originals_by_id.get(current["id"])
                    if old_image and old_image["url"] != current["url"]:
                        key = (pid, current["id"], old_image["url"], current["url"])
                        if key in evidence:
                            report["urlEquivalencesUsed"].append({"productId": pid, "mediaId": current["id"],
                                                               "beforeUrl": old_image["url"], "afterUrl": current["url"], "sha256": evidence[key]})
                            current["url"] = old_image["url"]
            delta = list(changes(first, second, pid))
            report["originalChanges"].extend(delta)
    if report["originalChanges"]:
        errors.append(f"Original catalog changed in {len(report['originalChanges'])} normalized fields")
    added = [p for pid, p in now.items() if pid not in old]
    if len(added) != 4:
        errors.append(f"Expected 4 new products; got {len(added)}")
    all_variants = [v for p in now_list for v in rows(p.get("variants"))]
    if len(all_variants) != 329 or len({v.get("id") for v in all_variants}) != 329:
        errors.append("After export must contain 329 unique variant IDs")
    expected_handles = {p["handle"] for p in plan["products"]}
    if {p.get("handle") for p in added} != expected_handles:
        errors.append("New product handles differ from plan")
    map_rows = rows(upload_map.get("images", upload_map.get("files", [])))
    for expected in plan["products"]:
        matches = [p for p in added if p.get("handle") == expected["handle"]]
        if len(matches) != 1:
            errors.append(f"Expected one new product for {expected['handle']}; got {len(matches)}")
            continue
        actual = matches[0]
        label = expected["handle"]
        if actual.get("title") != expected["title"]:
            errors.append(f"{label}: title differs from plan")
        expected_status = "DRAFT" if stage == "media" else "ACTIVE"
        if actual.get("status") != expected_status:
            errors.append(f"{label}: status is not {expected_status}")
        pubs = publications(actual)
        if stage == "media" and (pubs == MISSING or any(p["isPublished"] is not False for p in pubs)):
            errors.append(f"{label}: unpublished-channel evidence missing or a channel is published")
        elif stage == "published":
            if (pubs == MISSING or any(type(p["isPublished"]) is not bool for p in pubs)
                    or [p["name"] for p in pubs if p["isPublished"] is True] != ["Online Store"]):
                errors.append(f"{label}: require exactly Online Store published, with all other channels explicitly unpublished")
        actual_options = rows(actual.get("options"))
        if [o.get("name") for o in actual_options] != ["Size", "Colour"]:
            errors.append(f"{label}: options must be Size, Colour in that order")
        for opt in expected["options"]:
            found = [o for o in actual_options if o.get("name") == opt["name"]]
            if len(found) != 1 or set(found[0].get("values", [])) != set(opt["values"]):
                errors.append(f"{label}: {opt['name']} values differ from plan")
        expected_keys = Counter(tuple(sorted(v["optionValues"].items())) for v in expected["variants"])
        actual_variants = rows(actual.get("variants"))
        actual_keys = Counter(tuple(sorted(options(v).items())) if isinstance(options(v), dict) else ((MISSING, MISSING),)
                              for v in actual_variants)
        if expected_keys != actual_keys:
            errors.append(f"{label}: variant combinations differ from plan")
        colour_media = {}
        actual_media = media(actual, include_status=True)
        planned_media_order = []
        for colour in expected["colourways"]:
            mapped = [m for m in map_rows if m.get("conceptId") == expected["conceptId"] and m.get("colour") == colour["name"]]
            if len(mapped) != 1:
                errors.append(f"{label}/{colour['name']}: upload mapping absent or ambiguous")
                continue
            mapping = mapped[0]
            planned_media_order.append(mapping["filename"])
            found = [m for m in actual_media if unquote(Path(urlparse(str(m["url"])).path).name) == mapping["filename"]]
            if len(found) != 1:
                errors.append(f"{label}/{colour['name']}: expected exactly one media filename {mapping['filename']}")
                continue
            colour_media[colour["name"]] = found[0]
            if found[0]["alt"] != mapping.get("intendedAltText"):
                errors.append(f"{label}/{colour['name']}: media alt differs from approved upload mapping")
        if len(actual_media) != 4:
            errors.append(f"{label}: expected 4 product media, got {len(actual_media)}")
        actual_media_order = [unquote(Path(urlparse(str(m["url"])).path).name) for m in actual_media]
        if actual_media_order != planned_media_order:
            errors.append(f"{label}: product media order differs from planned colourway order")
        for image in actual_media:
            for field, state in image["processingStatuses"].items():
                if state != "READY":
                    errors.append(f"{label}/{image['id']}: exported {field} is {state!r}, not READY")
        for variant in actual_variants:
            selected = options(variant)
            vlabel = f"{label}/{variant.get('id', MISSING)}"
            if price(variant.get("price", MISSING)) != price(expected["priceProposal"]["amount"]):
                errors.append(vlabel + ": price mismatch")
            if tracked(variant) is not True or quantity(variant) != 0 or variant.get("inventoryPolicy") != "DENY":
                errors.append(vlabel + ": expected tracked=true, quantity=0, inventoryPolicy=DENY")
            locs = locations(variant)
            if locs == MISSING or not locs:
                errors.append(vlabel + ": inventory location evidence missing")
            else:
                for loc in locs:
                    for name in ("available", "on_hand"):
                        observed = [q.get("quantity", MISSING) for q in rows(loc["quantities"]) if q.get("name") == name]
                        if len(observed) != 1 or observed[0] != 0 or type(observed[0]) is bool:
                            errors.append(f"{vlabel}/{loc['location']['id']}: require one explicit {name}=0, got {observed!r}")
            target = colour_media.get(selected.get("Colour")) if isinstance(selected, dict) else None
            attached = variant_media(variant, actual_media, include_status=True,
                                     resolutions=report["legacyVariantImageResolutions"], product_id=actual["id"])
            for image in attached:
                for field, state in image["processingStatuses"].items():
                    if state != "READY":
                        errors.append(f"{vlabel}: exported media {field} is {state!r}, not READY")
            if not target or len(attached) != 1 or attached[0]["id"] != target["id"] or attached[0]["url"] != target["url"]:
                errors.append(vlabel + ": variant media does not map uniquely to its colour")
        report["newProducts"].append({"id": actual["id"], "handle": label,
                                      "variants": len(actual_variants), "matchedColourMedia": len(colour_media)})
    store = after.get("store", after.get("data", {}).get("shop", {}))
    if pick(store, "currency", "currencyCode") != "CAD":
        errors.append("After export CAD currency evidence missing or changed")
    if store.get("publicDomain", store.get("myshopifyDomain", MISSING)) != "offshft.myshopify.com":
        errors.append("After export store domain missing or changed")
    report.update({"afterProductCount": len(now_list), "afterVariantCount": len(all_variants),
                   "newVariantCount": sum(len(rows(p.get("variants"))) for p in added),
                   "exportReportedState": after.get("exportState"), "exportReportedErrors": after.get("errors", []),
                   "urlEvidenceLimitation": "Exact URL endpoints served equal bytes when fetched. No historical image-byte snapshot was captured with the before export.",
                   "passed": not errors})
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--before", type=Path, default=HERE / "shopify-before-export.json")
    parser.add_argument("--after", type=Path)
    parser.add_argument("--plan", type=Path, default=HERE / "listing-plan.json")
    parser.add_argument("--media-map", type=Path, default=HERE / "media-upload-map.json")
    parser.add_argument("--url-equivalence", type=Path, help="saved exact URL-pair fetch/hash evidence; no general query-string normalization")
    parser.add_argument("--stage", choices=("media", "published"), default="published",
                        help="media: DRAFT and unpublished; published (default): ACTIVE and only Online Store published")
    args = parser.parse_args()
    try:
        before = load(args.before)
        evidence = load(args.url_equivalence) if args.url_equivalence else None
        if evidence and evidence.get("beforeExportSha256") != hashlib.sha256(args.before.read_bytes()).hexdigest():
            raise ValueError("URL-equivalence evidence is bound to a different before export")
        result = verify(before, load(args.after), load(args.plan), load(args.media_map), stage=args.stage,
                        url_equivalence=evidence) if args.after else baseline(before)
        result["beforeSha256"] = hashlib.sha256(args.before.read_bytes()).hexdigest()
        if args.after:
            result["afterSha256"] = hashlib.sha256(args.after.read_bytes()).hexdigest()
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0 if result["passed"] else 1
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print(json.dumps({"passed": False, "inputError": str(exc)}, indent=2))
        return 2


if __name__ == "__main__":
    sys.exit(main())
