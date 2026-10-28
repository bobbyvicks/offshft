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
          // sample the arc around the origin-centred circle through cur and end (our arcs are centred on the hub)
          const r = s[1];
          const a0 = Math.atan2(cur[0], -cur[1]), a1 = Math.atan2(s[4][0], -s[4][1]);
          let d0 = (a0 * 180) / Math.PI, d1 = (a1 * 180) / Math.PI;
          if (s[3] === 1) { while (d1 < d0) d1 += 360; } else { while (d1 > d0) d1 -= 360; }
          for (let i = 0; i <= 120; i++) add(...P(d0 + ((d1 - d0) * i) / 120, r));
          cur = s[4];
        }
      }
    }
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

// Write a mark-only SVG with a tight viewBox. Returns placement info.
function markSvg(file, prims, col, { pad = 0, scale = 1 } = {}) {
  const b = bbox(prims);
  const k = scale;
  const W = b.w * k + 2 * pad, H = b.h * k + 2 * pad;
  const body = emit(prims, { k, dx: pad - b.x0 * k, dy: pad - b.y0 * k, col });
  kit.writeSvg(file, { w: W, h: H, body });
  return { W, H, b, k, hub: [pad - b.x0 * k, pad - b.y0 * k] };
}

module.exports = { P, line, ray, arc, disc, shape, emit, bbox, markSvg, n3 };
