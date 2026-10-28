#!/usr/bin/env python3
"""Embroidery thickness check.
usage: check.py mask.png px_per_mm overlay.png [min_mm=1.2]
mask.png: design in black on white (no texture). Reports solid areas and gaps
narrower than min_mm (morphological opening with a disc), and writes an overlay:
thin solid = red, thin gaps = blue. Also prints a removal profile over several
diameters so real thin features (big jumps) can be told from corner rounding.
"""
import sys
import numpy as np
from PIL import Image


def disk(rpx):
    r = int(np.ceil(rpx))
    y, x = np.mgrid[-r:r + 1, -r:r + 1]
    return (x * x + y * y <= rpx * rpx).astype(float)


def fftconv(A, K):
    H, W = A.shape
    kh, kw = K.shape
    sh = (H + kh, W + kw)
    C = np.fft.irfft2(np.fft.rfft2(A, sh) * np.fft.rfft2(K, sh), sh)
    oy, ox = kh // 2, kw // 2
    return C[oy:oy + H, ox:ox + W]


def opening(M, K):
    er = fftconv((~M).astype(float), K) < 0.5
    return fftconv(er.astype(float), K) > 0.5


def main():
    src, pxmm, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    mn = float(sys.argv[4]) if len(sys.argv) > 4 else 1.2
    a = np.asarray(Image.open(src).convert('L'), dtype=float) / 255.0
    solid = a < 0.5
    bg = ~solid
    # only judge background inside the design's bounding box (+margin)
    ys, xs = np.where(solid)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    px2 = (1 / pxmm) ** 2
    prof = []
    for dmm in [0.8, 1.0, 1.2, 1.4, 1.6, 2.0]:
        K = disk(dmm * pxmm / 2 - 1.0)
        ts = solid & ~opening(solid, K)
        tg = bg & ~opening(bg, K)
        prof.append(f"{dmm:.1f}mm: solid {ts.sum() * px2:6.3f} mm2, gaps {tg.sum() * px2:6.3f} mm2")
        if abs(dmm - mn) < 1e-6:
            thin_s, thin_g = ts, tg
    rgb = np.stack([a * 0.55 + 0.45] * 3, -1)
    rgb[solid] = [0.35, 0.35, 0.35]
    rgb[thin_s] = [0.9, 0.1, 0.1]
    rgb[thin_g] = [0.1, 0.3, 0.95]
    Image.fromarray((rgb * 255).astype(np.uint8)).crop((max(0, x0 - 20), max(0, y0 - 20), x1 + 20, y1 + 20)).save(out)
    print(f"size {(x1 - x0) / pxmm:.2f} x {(y1 - y0) / pxmm:.2f} mm; at {mn} mm: thin solid {thin_s.sum() * px2:.3f} mm2, thin gaps {thin_g.sum() * px2:.3f} mm2")
    for p in prof:
        print('   ', p)


main()
