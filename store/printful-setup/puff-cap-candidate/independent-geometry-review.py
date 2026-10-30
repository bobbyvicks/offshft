"""Read candidate geometry without changing artwork; write bounded review metrics.

This is a geometric design review, not a stitch simulator or supplier approval.
Maximal inscribed discs are measured by a Lipschitz branch-and-bound search.
Reported upper bounds differ from found diameters by at most 0.02 mm.
"""
import heapq
import hashlib
import itertools
import json
import math
import re
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent


def segments(rings):
    a = np.concatenate([np.asarray(r, dtype=float) for r in rings])
    b = np.concatenate([np.roll(np.asarray(r, dtype=float), -1, axis=0) for r in rings])
    return a, b


def signed_distance(point, rings):
    p = np.asarray(point)
    a, b = segments(rings)
    v = b - a
    t = np.clip(np.sum((p - a) * v, axis=1) / np.sum(v * v, axis=1), 0, 1)
    dist = float(np.sqrt(np.min(np.sum((p - a - t[:, None] * v) ** 2, axis=1))))
    crossings = ((a[:, 1] > p[1]) != (b[:, 1] > p[1]))
    aa, bb = a[crossings], b[crossings]
    hits = aa[:, 0] + (p[1] - aa[:, 1]) * (bb[:, 0] - aa[:, 0]) / (bb[:, 1] - aa[:, 1]) > p[0]
    return dist if int(np.count_nonzero(hits)) % 2 else -dist


def largest_disc(rings, radius_tolerance=0.01):
    pts = np.concatenate(rings)
    lo, hi = pts.min(axis=0), pts.max(axis=0)
    cell_size = min(hi - lo)
    queue, counter = [], itertools.count()
    best, bestpoint = 0.0, None

    def put(x, y, h):
        nonlocal best, bestpoint
        d = signed_distance((x, y), rings)
        if d > best:
            best, bestpoint = d, [x, y]
        bound = d + h * math.sqrt(2)
        heapq.heappush(queue, (-bound, next(counter), x, y, h, d))

    for x in np.arange(lo[0], hi[0], cell_size):
        for y in np.arange(lo[1], hi[1], cell_size):
            put(x + cell_size / 2, y + cell_size / 2, cell_size / 2)
    while queue:
        minus_bound, _, x, y, h, d = heapq.heappop(queue)
        if -minus_bound <= best + radius_tolerance:
            continue
        h /= 2
        for dx in (-h, h):
            for dy in (-h, h):
                put(x + dx, y + dy, h)
    return {"foundDiameterMm": round(2 * best, 4),
            "upperBoundDiameterMm": round(2 * (best + radius_tolerance), 4),
            "centreMm": [round(v, 4) for v in bestpoint]}


def polygon_distance(rings1, rings2):
    # These glyphs are disjoint, so endpoint-to-segment minima suffice.
    a, b = segments(rings1)
    c, d = segments(rings2)

    def one_direction(points, starts, ends):
        ans = math.inf
        for ps in np.array_split(points, max(1, len(points) // 200)):
            v = ends - starts
            t = np.sum((ps[:, None, :] - starts[None, :, :]) * v[None, :, :], axis=2) / np.sum(v*v, axis=1)
            delta = ps[:, None, :] - starts[None, :, :] - np.clip(t, 0, 1)[:, :, None] * v[None, :, :]
            ans = min(ans, float(np.sqrt(np.min(np.sum(delta*delta, axis=2)))))
        return ans
    return min(one_direction(a, c, d), one_direction(c, a, b))


def area(ring):
    p = np.asarray(ring)
    return float(np.sum(p[:, 0] * np.roll(p[:, 1], -1) - np.roll(p[:, 0], -1) * p[:, 1]) / 2)


def minimum_caliper(ring):
    pts = sorted(set(tuple(p) for p in ring))
    def cross(o,a,b): return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    low, up = [], []
    for p in pts:
        while len(low) > 1 and cross(low[-2], low[-1], p) <= 0: low.pop()
        low.append(p)
    for p in reversed(pts):
        while len(up) > 1 and cross(up[-2], up[-1], p) <= 0: up.pop()
        up.append(p)
    hull = np.array(low[:-1] + up[:-1])
    v = np.roll(hull, -1, axis=0) - hull
    normals = np.column_stack((-v[:, 1], v[:, 0])) / np.linalg.norm(v, axis=1)[:, None]
    projections = hull @ normals.T
    return float(np.min(np.ptp(projections, axis=0)))


def intervals(rings, value, vertical=True):
    a,b=segments(rings)
    axis=0 if vertical else 1
    other=1-axis
    take=(np.minimum(a[:,axis],b[:,axis])<=value)&(value<np.maximum(a[:,axis],b[:,axis]))
    a,b=a[take],b[take]
    positions=np.sort(a[:,other]+(value-a[:,axis])*(b[:,other]-a[:,other])/(b[:,axis]-a[:,axis]))
    return list(zip(positions[::2],positions[1::2]))


def main():
    m=json.loads((HERE/'measurements.json').read_text(encoding='utf-8'))
    svg_checks=[]
    for palette in ('ink-rust','bone-sun','bone'):
        path=HERE/f'candidate-{palette}.svg'
        svg=ET.parse(path).getroot()
        paths=[e for e in svg.iter() if e.tag.endswith('path')]
        assert len(paths)==len(m['glyphs'])
        for node,glyph in zip(paths,m['glyphs']):
            assert node.attrib['id']==glyph['id'] and node.attrib['data-character']==glyph['char']
            parsed=[]
            for part in re.findall(r'M([^M]+)',node.attrib['d']):
                nums=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?',part)]
                parsed.append(np.array(list(zip(nums[::2],nums[1::2]))))
            assert len(parsed)==len(glyph['finalContoursMm'])
            assert all(np.max(np.abs(a-np.asarray(b)))<0.000051 for a,b in zip(parsed,glyph['finalContoursMm']))
        svg_checks.append({'path':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'contoursMatchMeasurements':True})
    source=HERE.parents[2]/m['source']
    assert hashlib.sha256(source.read_bytes()).hexdigest()==m['sourceSha256']
    out={"status":"Independent geometric review; no supplier acceptance", "measuredSvgSource": "measurements.json final contours from candidate SVG build",
         "fieldFits":m['widthMm']<=149.9 and m['heightMm']<=50.8,
         "artworkMm":[m['widthMm'],m['heightMm']],
         "constructiveMinimumNote":"5.3 mm rolling-disc envelope constructed from a connected eroded core for each glyph; this certifies a connected clearance route, not every arbitrary chord near a rounded tip.",
         "svgChecks":svg_checks,"approvedSourceHashUnchanged":True,"glyphs":[],"adjacentGlyphGaps":[]}
    for g in m['glyphs']:
        rings=g['finalContoursMm']
        row={"id":g['id'],"character":g['char'],"coreOuterComponents":sum(area(r)>0 for r in g['coreContoursMm']),
             "coreCounters":sum(area(r)<0 for r in g['coreContoursMm']),
             "finalOuterComponents":sum(area(r)>0 for r in rings),"finalCounters":sum(area(r)<0 for r in rings),
             "maxInscribedDisc":largest_disc(rings),
             "counterMinimumCalipersMm":[round(minimum_caliper(r),4) for r in rings if area(r)<0]}
        out['glyphs'].append(row)
        print(g['char'],row['maxInscribedDisc'],row['counterMinimumCalipersMm'],flush=True)
    for a,b in zip(m['glyphs'],m['glyphs'][1:]):
        if a['row']!=b['row']: continue
        out['adjacentGlyphGaps'].append({"from":a['id'],"to":b['id'],"mm":round(polygon_distance(a['finalContoursMm'],b['finalContoursMm']),4)})
    out['minimumAdjacentGlyphGapMm']=min(x['mm'] for x in out['adjacentGlyphGaps'])
    out['maximumInscribedDiscUpperBoundMm']=max(x['maxInscribedDisc']['upperBoundDiameterMm'] for x in out['glyphs'])
    out['allCoresConnected']=all(g['coreOuterComponents']==1 for g in out['glyphs'])
    out['maximumDiscBelow12_5mm']=out['maximumInscribedDiscUpperBoundMm']<=12.5
    # Analytical cut width and glyph gaps are distinct from taper/corner chords.
    out['sOpeningMethod']='The builder subtracts 1.64 mm high horizontal channels before opening; final opening is a subset of prepared positive geometry. This preserves those clear channels, subject to inspecting where they join each S counter.'
    out['limitations']=['No stitch, foam, thread-tension or substrate simulation.','Round tips have chords below5.08 mm; they are not treated as structural stroke failures.','Closed-counter calipers measure the whole opening, not infinitesimal chords at its rounded end.']
    (HERE/'independent-geometry-review.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in out.items() if k not in ('glyphs','adjacentGlyphGaps')},indent=2))


if __name__=='__main__': main()
