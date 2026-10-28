"""Minimum gap between separate shapes in a black-on-white PNG.

usage: python3 gaps.py image.png px_per_mm
Prints JSON: {"components": n, "min_gap_mm": x, "pair": [bboxA, bboxB]}
Separate shapes = 8-connected components of dark pixels. The gap between two shapes is the
smallest distance between their boundary pixels, minus one pixel (boundary pixels sit inside the shapes).
"""
import json
import sys
from collections import deque

import numpy as np
from PIL import Image


def main(path, pxmm):
    a = np.asarray(Image.open(path).convert('L'), dtype=np.uint8)
    shape = a < 150
    h, w = shape.shape
    label = np.zeros((h, w), dtype=np.int32)
    n = 0
    ys, xs = np.nonzero(shape)
    for y0, x0 in zip(ys, xs):
        if label[y0, x0]:
            continue
        n += 1
        label[y0, x0] = n
        q = deque([(y0, x0)])
        while q:
            y, x = q.popleft()
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < h and 0 <= xx < w and shape[yy, xx] and not label[yy, xx]:
                        label[yy, xx] = n
                        q.append((yy, xx))
    # boundary pixels: shape pixels with a background 4-neighbour
    pad = np.pad(shape, 1)
    inner = pad[1:-1, :-2] & pad[1:-1, 2:] & pad[:-2, 1:-1] & pad[2:, 1:-1]
    boundary = shape & ~inner
    comps = []
    for i in range(1, n + 1):
        by, bx = np.nonzero(boundary & (label == i))
        pts = np.stack([by, bx], axis=1).astype(np.float64)
        comps.append(pts)
    best = (float('inf'), None, None)
    for i in range(n):
        for j in range(i + 1, n):
            A, B = comps[i], comps[j]
            # quick reject with bounding boxes
            if A.size == 0 or B.size == 0:
                continue
            lo = np.maximum(A.min(0), B.min(0)) - best[0] if np.isfinite(best[0]) else None
            dmin = float('inf')
            for k in range(0, len(A), 2000):
                d = ((A[k:k + 2000, None, :] - B[None, :, :]) ** 2).sum(-1).min()
                dmin = min(dmin, d)
            dmin = np.sqrt(dmin)
            if dmin < best[0]:
                bb = lambda P: [round(P[:, 1].min() / pxmm, 2), round(P[:, 0].min() / pxmm, 2), round(P[:, 1].max() / pxmm, 2), round(P[:, 0].max() / pxmm, 2)]
                best = (dmin, bb(A), bb(B))
    gap = None if not np.isfinite(best[0]) else round((best[0] - 1) / pxmm, 3)
    print(json.dumps({'components': n, 'min_gap_mm': gap, 'pair': [best[1], best[2]]}))


if __name__ == '__main__':
    main(sys.argv[1], float(sys.argv[2]))
