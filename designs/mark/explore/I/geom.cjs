// Geometry helpers for the I (implied clock) variants.
// Mark space: millimetres, hub (clock centre) at (0,0), y down, angles clockwise from 12.
const kit = require('/home/user/offshft/tools/kit/kit.cjs');

const P = (deg, r, c = [0, 0]) => kit.polar(c[0], c[1], deg, r);
const n3 = (v) => (Math.round(v * 1000) / 1000).toString();

// primitives
const line = (a, b, w, o = {}) => ({ t: 'line', a, b, w, cap: o.cap || 'round', role: o.role || 'hand' });
const ray = (deg, r0, r1, w, o = {}) => line(P(deg, r0), P(deg, r1), w, o);
const arc = (r, d0, d1, w, o = {}) => ({ t: 'arc', r, d0, d1, w, cap: o.cap || 'round', role: o.role || 'face', c: o.c || [0, 0] });
const disc = (c, r, o = {}) => ({ t: 'disc', c, r, role: o.role || 'hand' });
// segs: ['M',[x,y]] ['L',[x,y]] ['A',r,large,sweep,[x,y]] ['Z']
const shape = (segs, o = {}) => ({ t: 'path', segs, role: o.role || 'face', evenodd: !!o.evenodd });

function xf(p, k, dx, dy) {
  return [dx + k * p[0], dy + k * p[1]];
}

function emit(prims, { k = 1, dx = 0, dy = 0, col }) {
  const C = (role) => (typeof col === 'string' ? col : col[role] || col.default);
  return prims
    .map((p) => {
      if (p.t === 'line') {
        const a = xf(p.a, k, dx, dy), b = xf(p.b, k, dx, dy);
        return `<path d="M${n3(a[0])} ${n3(a[1])}L${n3(b[0])} ${n3(b[1])}" fill="none" stroke="${C(p.role)}" stroke-width="${n3(p.w * k)}" stroke-linecap="${p.cap}"/>`;
      }
      if (p.t === 'arc') {
        const a = xf(P(p.d0, p.r, p.c), k, dx, dy), b = xf(P(p.d1, p.r, p.c), k, dx, dy);
        const large = p.d1 - p.d0 > 180 ? 1 : 0;
        return `<path d="M${n3(a[0])} ${n3(a[1])}A${n3(p.r * k)} ${n3(p.r * k)} 0 ${large} 1 ${n3(b[0])} ${n3(b[1])}" fill="none" stroke="${C(p.role)}" stroke-width="${n3(p.w * k)}" stroke-linecap="${p.cap}"/>`;
      }
      if (p.t === 'disc') {
        const c = xf(p.c, k, dx, dy);
        return `<circle cx="${n3(c[0])}" cy="${n3(c[1])}" r="${n3(p.r * k)}" fill="${C(p.role)}"/>`;
      }
      if (p.t === 'path') {
        const d = p.segs
          .map((s) => {
            if (s[0] === 'Z') return 'Z';
            if (s[0] === 'A') {
              const e = xf(s[4], k, dx, dy);
              return `A${n3(s[1] * k)} ${n3(s[1] * k)} 0 ${s[2]} ${s[3]} ${n3(e[0])} ${n3(e[1])}`;
            }
            const q = xf(s[1], k, dx, dy);
            return `${s[0]}${n3(q[0])} ${n3(q[1])}`;
          })
          .join('');
        return `<path d="${d}" fill="${C(p.role)}"${p.evenodd ? ' fill-rule="evenodd"' : ''}/>`;
      }
      throw new Error('bad prim ' + p.t);
    })
    .join('\n');
}

// ---- filled-outline emission (no strokes): what an embroidery digitiser wants ----
const rotCW = (v) => [-v[1], v[0]]; // 90 deg clockwise on screen (y down)
function sweepFor(center, from, bulge) {
  const m = rotCW([from[0] - center[0], from[1] - center[1]]);
  return m[0] * bulge[0] + m[1] * bulge[1] > 0 ? 1 : 0;
}
function outlineSegs(p) {
  if (p.t === 'line') {
    const dx = p.b[0] - p.a[0], dy = p.b[1] - p.a[1], L = Math.hypot(dx, dy);
    const u = [dx / L, dy / L], n = [u[1], -u[0]], h = p.w / 2; // n on the counter-clockwise side: outline winds clockwise like everything else
    const add = (q, v, k) => [q[0] + k * v[0], q[1] + k * v[1]];
    const ext = p.cap === 'square' ? h : 0;
    const a = add(p.a, u, -ext), b = add(p.b, u, ext);
    if (p.cap === 'round') {
      const b1 = add(b, n, h), b2 = add(b, n, -h), a2 = add(a, n, -h), a1 = add(a, n, h);
      return [['M', a1], ['L', b1], ['A', h, 0, sweepFor(b, b1, u), b2, b], ['L', a2], ['A', h, 0, sweepFor(a, a2, [-u[0], -u[1]]), a1, a], ['Z']];
    }
    return [['M', add(a, n, h)], ['L', add(b, n, h)], ['L', add(b, n, -h)], ['L', add(a, n, -h)], ['Z']];
  }
  if (p.t === 'arc') {
    const h = p.w / 2, c = p.c, Ro = p.r + h, Ri = p.r - h;
    const large = p.d1 - p.d0 > 180 ? 1 : 0;
    const o0 = P(p.d0, Ro, c), o1 = P(p.d1, Ro, c), i1 = P(p.d1, Ri, c), i0 = P(p.d0, Ri, c);
    if (p.cap === 'round') {
      const e1 = P(p.d1, p.r, c), e0 = P(p.d0, p.r, c);
      const t1 = P(p.d1 + 90, 1), t0 = P(p.d0 - 90, 1); // tangent directions beyond each end
      const tt1 = [t1[0], t1[1]], tt0 = [t0[0], t0[1]];
      return [['M', o0], ['A', Ro, large, 1, o1, c], ['A', h, 0, sweepFor(e1, o1, tt1), i1, e1], ['A', Ri, large, 0, i0, c], ['A', h, 0, sweepFor(e0, i0, tt0), o0, e0], ['Z']];
    }
    return [['M', o0], ['A', Ro, large, 1, o1, c], ['L', i1], ['A', Ri, large, 0, i0, c], ['Z']];
  }
  if (p.t === 'disc') {
    const [x, y] = p.c, r = p.r;
    return [['M', [x - r, y]], ['A', r, 0, 1, [x + r, y], p.c], ['A', r, 0, 1, [x - r, y], p.c], ['Z']];
  }
  if (p.t === 'path') return p.segs;
  throw new Error('bad prim ' + p.t);
}
// Emit every primitive as a filled path; one <path> per colour.
function emitFill(prims, { k = 1, dx = 0, dy = 0, col }) {
  const C = (role) => (typeof col === 'string' ? col : col[role] || col.default);
  const byCol = new Map();
  for (const p of prims) {
    const d = outlineSegs(p)
      .map((s) => {
        if (s[0] === 'Z') return 'Z';
        if (s[0] === 'A') {
          const e = xf(s[4], k, dx, dy);
          return `A${n3(s[1] * k)} ${n3(s[1] * k)} 0 ${s[2]} ${s[3]} ${n3(e[0])} ${n3(e[1])}`;
        }
        const q = xf(s[1], k, dx, dy);
        return `${s[0]}${n3(q[0])} ${n3(q[1])}`;
      })
      .join('');
    const c = C(p.role);
    byCol.set(c, (byCol.get(c) || '') + d);
  }
  return [...byCol].map(([c, d]) => `<path fill="${c}" d="${d}"/>`).join('\n');
}

// exact-enough bounding box (round caps -> discs at ends; arcs sampled)
function bbox(prims) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (x, y, r = 0) => {
    x0 = Math.min(x0, x - r); y0 = Math.min(y0, y - r); x1 = Math.max(x1, x + r); y1 = Math.max(y1, y + r);
  };
  for (const p of prims) {
    if (p.t === 'line') {
      if (p.cap === 'round') { add(...p.a, p.w / 2); add(...p.b, p.w / 2); }
      else {
        const dx = p.b[0] - p.a[0], dy = p.b[1] - p.a[1], L = Math.hypot(dx, dy);
        const ux = dx / L, uy = dy / L, nx = -uy * p.w / 2, ny = ux * p.w / 2;
        const ext = p.cap === 'square' ? p.w / 2 : 0;
        const a = [p.a[0] - ux * ext, p.a[1] - uy * ext], b = [p.b[0] + ux * ext, p.b[1] + uy * ext];
        for (const q of [a, b]) { add(q[0] + nx, q[1] + ny); add(q[0] - nx, q[1] - ny); }
      }
    } else if (p.t === 'arc') {
      const N = 360;
      for (let i = 0; i <= N; i++) {
        const d = p.d0 + ((p.d1 - p.d0) * i) / N;
        const q = P(d, p.r, p.c);
        if (p.cap === 'round' || (i > 0 && i < N)) add(q[0], q[1], p.w / 2);
        else {
          const qi = P(d, p.r - p.w / 2, p.c), qo = P(d, p.r + p.w / 2, p.c);
          add(...qi); add(...qo);
        }
      }
    } else if (p.t === 'disc') add(p.c[0], p.c[1], p.r);
    else if (p.t === 'path') {
      let cur = null;
      for (const s of p.segs) {
        if (s[0] === 'M' || s[0] === 'L') { add(...s[1]); cur = s[1]; }
        else if (s[0] === 'A') {
          // sample the arc; s[5] (optional) is the arc centre, default the hub
          const r = s[1], c = s[5] || [0, 0];
          const a0 = Math.atan2(cur[0] - c[0], -(cur[1] - c[1])), a1 = Math.atan2(s[4][0] - c[0], -(s[4][1] - c[1]));
          let d0 = (a0 * 180) / Math.PI, d1 = (a1 * 180) / Math.PI;
          if (s[3] === 1) { while (d1 < d0) d1 += 360; } else { while (d1 > d0) d1 -= 360; }
          for (let i = 0; i <= 120; i++) add(...P(d0 + ((d1 - d0) * i) / 120, r, c));
          cur = s[4];
        }
      }
    }
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

// Write a mark-only SVG with a tight viewBox. Returns placement info.
function markSvg(file, prims, col, { pad = 0, scale = 1, fill = false } = {}) {
  const b = bbox(prims);
  const k = scale;
  const W = b.w * k + 2 * pad, H = b.h * k + 2 * pad;
  const body = (fill ? emitFill : emit)(prims, { k, dx: pad - b.x0 * k, dy: pad - b.y0 * k, col });
  kit.writeSvg(file, { w: W, h: H, body });
  return { W, H, b, k, hub: [pad - b.x0 * k, pad - b.y0 * k] };
}


// Clean outline for the two hands at 5:00 (minute at 0 deg, hour at 150 deg), no overlapping caps.
//   Lm, Lh: distance from hub to the centre of each round tip; wm, wh: widths.
//   heel: fillet radius at the outer (lower-left) corner where the two hands meet.
//   tail: optional length the minute hand continues below the hub (round end).
function handsOutline({ Lm, wm, Lh, wh, heel = 0, role = 'hand', cap = 'round' }) {
  const a = wm / 2, b = wh / 2;
  const u = P(150, 1);              // hour direction
  const nl = [-u[1], u[0]];         // normal to the outer (lower-left) side: (-0.866, 0.5)
  const add = (p, q, k = 1) => [p[0] + k * q[0], p[1] + k * q[1]];
  // inner corner: x = a meets hour inner edge (t*u - b*nl)
  const ti = (a + b * nl[0]) / u[0];
  const I = add([ti * u[0], ti * u[1]], nl, -b);
  // outer corner: x = -a meets hour outer edge (t*u + b*nl)
  const to = (-a - b * nl[0]) / u[0];
  const O = add([to * u[0], to * u[1]], nl, b);
  const tipH = [Lh * u[0], Lh * u[1]];
  const hIn = add(tipH, nl, -b), hOut = add(tipH, nl, b);
  // cap 'round': Lm/Lh are the tip-circle centres. cap 'butt': Lm/Lh are the full lengths (flat tips).
  const segs = cap === 'round'
    ? [['M', [-a, -Lm]], ['A', a, 0, 1, [a, -Lm], [0, -Lm]], ['L', I], ['L', hIn], ['A', b, 0, 1, hOut, tipH]]
    : [['M', [-a, -Lm]], ['L', [a, -Lm]], ['L', I], ['L', hIn], ['L', hOut]];
  if (heel > 0) {
    // fillet between direction u (coming back along outer edge, reversed) and up the left edge
    const turn = 30 * Math.PI / 180; // exterior turn at O
    const tl = heel * Math.tan(turn / 2);
    const p1 = add(O, u, tl);          // on the hour outer edge, toward the tip
    const p2 = [O[0], O[1] - tl];      // on the left edge, upward
    // centre of fillet: inside the shape, distance heel from both edges
    const c = [p2[0] + heel, p2[1]];
    segs.push(['L', p1], ['A', heel, 0, 1, p2, c]);
  } else segs.push(['L', O]);
  segs.push(['Z']);
  return { t: 'path', segs, role, minw: Math.min(wm, wh) };
}

module.exports = { emitFill, outlineSegs, handsOutline, P, line, ray, arc, disc, shape, emit, bbox, markSvg, n3 };
