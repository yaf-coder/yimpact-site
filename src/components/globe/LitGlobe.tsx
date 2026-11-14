import { useEffect, useRef } from 'react';
import { asset } from '../../lib/asset';
import { COAST } from './coast';

// The homepage globe: a cream shell with panels cut out of it, a lit bulb
// inside, and light leaving through the openings. It turns slowly; with
// reduced motion it holds still.
//
// On wide screens it sits to the right of the hero copy. On narrow ones it is
// centred and the title is drawn around it, warped onto its parallels, so
// the page's own heading is hidden visually there (see Home.tsx).
//
// Keep WIDE in step with Tailwind's `md` breakpoint, which the hero uses.
const WIDE = '(min-width: 768px)';

const RAD = Math.PI / 180;
const LAT0 = 12 * RAD; // viewing latitude
const S0 = Math.sin(LAT0);
const C0 = Math.cos(LAT0);
const SPIN = 2.4 * RAD; // radians per second
const LAT_A = 18; // the parallels the two title lines ride
const LAT_B = -2;
const BEAM_K = 1.9; // how far a shaft of light reaches, in radii

// Palette, as rgb triples for canvas strokes.
const OBLIVION = '38,66,139';
const SAPPHIRE = '81,106,200';
const CARAMEL = '227,175,100';
const PAGE = '#f6f3e7';
const INK = '#0f1939';

// Panels taken out of the shell. Each is one 20° graticule cell, given as
// its west longitude and south latitude.
const HOLES: [number, number][] = [
  [-40, 40], [60, 40],
  [-100, 20], [-20, 20], [0, 20], [120, 20],
  [-60, 0], [40, 0], [60, 0], [120, 0],
  [-40, -20], [20, -20], [80, -20], [140, -20],
  [-100, -40], [40, -40], [120, -40],
  [0, -60],
];

function cellRing(w: number, e: number, s: number, n: number): number[] {
  const ring: number[] = [];
  for (let lon = w; lon < e; lon += 2) ring.push(lon, s);
  for (let lat = s; lat < n; lat += 2) ring.push(e, lat);
  for (let lon = e; lon > w; lon -= 2) ring.push(lon, n);
  for (let lat = n; lat > s; lat -= 2) ring.push(w, lat);
  return ring;
}

const HOLE_RINGS: number[][] = [
  ...HOLES.map(([w, s]) => cellRing(w, w + 20, s, s + 20)),
  // One tall slot over the Pacific, one cell wide and five tall, so the
  // lamp shows top to bottom as it turns past.
  cellRing(-180, -160, -40, 60),
];

type Pt = [number, number];

function hull(input: Pt[]): Pt[] {
  const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [];
  const hi: Pt[] = [];
  for (const p of pts) {
    while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (hi.length > 1 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop();
    hi.push(p);
  }
  lo.pop();
  hi.pop();
  return lo.concat(hi);
}

export function LitGlobe({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const cv: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;

    const wide = matchMedia(WIDE);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const yale = new Image();
    yale.src = asset('/brand/yale-wordmark.png');

    // Open on the Pacific just east of centre, so the tall slot drifts over
    // the lamp in the first few seconds. A still globe holds it centred.
    let lon0 = (still ? -170 : -186) * RAD;
    let last = 0;
    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let R = 0;
    let layer: HTMLCanvasElement | null = null;
    let layerKey = '';
    let fontsReady = false;
    let beams: HTMLCanvasElement | null = null;
    let raf = 0;
    let alive = true;

    // Orthographic projection: screen x, y, and depth (positive faces us).
    function proj(lonDeg: number, latDeg: number): [number, number, number] {
      const dl = lonDeg * RAD - lon0;
      const ph = latDeg * RAD;
      const cp = Math.cos(ph);
      const sp = Math.sin(ph);
      const cd = Math.cos(dl);
      return [cx + R * cp * Math.sin(dl), cy - R * (C0 * sp - S0 * cp * cd), S0 * sp + C0 * cp * cd];
    }

    // Stroke a lon/lat polyline on the near side or the far side, breaking
    // it at the horizon.
    function strokeGeo(pts: number[], front: boolean) {
      let drawing = false;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i += 2) {
        const [x, y, z] = proj(pts[i], pts[i + 1]);
        if (z >= 0 !== front) {
          drawing = false;
          continue;
        }
        if (drawing) ctx.lineTo(x, y);
        else {
          ctx.moveTo(x, y);
          drawing = true;
        }
      }
      ctx.stroke();
    }

    function graticuleLines(front: boolean) {
      for (let lat = -60; lat <= 60; lat += 20) {
        const ring: number[] = [];
        for (let lon = -180; lon <= 180; lon += 4) ring.push(lon, lat);
        strokeGeo(ring, front);
      }
      for (let lon = -180; lon < 180; lon += 20) {
        const ring: number[] = [];
        for (let lat = -88; lat <= 88; lat += 4) ring.push(lon, lat);
        strokeGeo(ring, front);
      }
    }

    // The openings on one side of the shell, as screen points. A cell that
    // runs over the horizon has its hidden corners pinned to the rim.
    function slotRings(front: boolean): Pt[][] {
      const out: Pt[][] = [];
      for (const ring of HOLE_RINGS) {
        let seen = 0;
        const pts: Pt[] = [];
        for (let i = 0; i < ring.length; i += 2) {
          let [x, y, z] = proj(ring[i], ring[i + 1]);
          if (z >= 0 === front) seen++;
          else {
            const dx = x - cx;
            const dy = y - cy;
            const d = Math.hypot(dx, dy) || 1;
            x = cx + (dx / d) * R;
            y = cy + (dy / d) * R;
          }
          pts.push([x, y]);
        }
        if (seen) out.push(pts);
      }
      return out;
    }

    function holePath(front: boolean): Path2D {
      const p = new Path2D();
      for (const ring of slotRings(front)) {
        p.moveTo(ring[0][0], ring[0][1]);
        for (let i = 1; i < ring.length; i++) p.lineTo(ring[i][0], ring[i][1]);
        p.closePath();
      }
      return p;
    }

    // The lamp at the core: centre and size.
    function lamp() {
      return { x: cx, y: cy - R * 0.12, s: R * 0.36 };
    }

    // The outside of the shell: opaque cream, lit softly from the upper
    // left. The lamp's light leaves only through the slots.
    function shell() {
      const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      g.addColorStop(0, '#fcf9f0');
      g.addColorStop(0.6, '#f1e9d6');
      g.addColorStop(1, '#ddd0ae');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${CARAMEL},0.6)`;
      graticuleLines(true);
      ctx.lineWidth = 1.15;
      ctx.strokeStyle = `rgba(${OBLIVION},0.78)`;
      for (const ring of COAST) strokeGeo(ring, true);
    }

    // A lit bulb at (x, y), size s. The glass and base are barely there; the
    // filament is white-hot and throws a yellow aura.
    function bulb(x: number, y: number, s: number) {
      const fx = x;
      const fy = y + 0.12 * s;

      const aura = ctx.createRadialGradient(fx, fy, 0, fx, fy, s * 3.2);
      aura.addColorStop(0, 'rgba(255,255,236,1)');
      aura.addColorStop(0.08, 'rgba(255,246,170,1)');
      aura.addColorStop(0.25, 'rgba(255,221,90,0.6)');
      aura.addColorStop(0.55, 'rgba(255,196,60,0.22)');
      aura.addColorStop(1, 'rgba(255,186,50,0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(fx, fy, s * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(x, y);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Glass, just a suggestion of it.
      ctx.beginPath();
      ctx.arc(0, -0.25 * s, s, 140 * RAD, 400 * RAD);
      ctx.bezierCurveTo(0.6 * s, 0.62 * s, 0.4 * s, 0.82 * s, 0.4 * s, 1.05 * s);
      ctx.lineTo(-0.4 * s, 1.05 * s);
      ctx.bezierCurveTo(-0.4 * s, 0.82 * s, -0.6 * s, 0.62 * s, -0.766 * s, 0.393 * s);
      ctx.closePath();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = `rgba(${OBLIVION},0.9)`;
      ctx.stroke();

      // Lead wires.
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(${OBLIVION},0.85)`;
      ctx.beginPath();
      ctx.moveTo(-0.14 * s, 1.05 * s);
      ctx.lineTo(-0.22 * s, 0.16 * s);
      ctx.moveTo(0.14 * s, 1.05 * s);
      ctx.lineTo(0.22 * s, 0.16 * s);
      ctx.stroke();

      // Screw base.
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(${OBLIVION},0.9)`;
      ctx.beginPath();
      ctx.rect(-0.4 * s, 1.05 * s, 0.8 * s, 0.5 * s);
      ctx.moveTo(-0.2 * s, 1.55 * s);
      ctx.quadraticCurveTo(0, 1.78 * s, 0.2 * s, 1.55 * s);
      for (let k = 0; k < 3; k++) {
        ctx.moveTo(-0.4 * s, 1.2 * s + k * 0.12 * s);
        ctx.lineTo(0.4 * s, 1.15 * s + k * 0.12 * s);
      }
      ctx.stroke();

      // The filament: a coil, stroked white-hot over a yellow bloom.
      ctx.beginPath();
      const n = 48;
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const px = (-0.22 + 0.44 * t) * s + 0.035 * s * Math.sin(t * Math.PI * 12);
        const py = 0.16 * s - 0.07 * s * Math.abs(Math.cos(t * Math.PI * 6));
        if (i) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      }
      ctx.shadowColor = 'rgba(255,200,40,1)';
      ctx.shadowBlur = 22;
      ctx.lineWidth = 3.2;
      ctx.strokeStyle = 'rgba(255,214,80,1)';
      ctx.stroke();
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = '#fffbe6';
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    // Light leaving the slots. In this projection a ray from the centre
    // through a rim point p lands on c + k(p - c), so a shaft is the convex
    // hull of the slot and the slot scaled out by k about the centre.
    function castLight(front: boolean, strength: number) {
      const dpr = cv.width / W;
      if (!beams || beams.width !== cv.width || beams.height !== cv.height) {
        beams = document.createElement('canvas');
        beams.width = cv.width;
        beams.height = cv.height;
      }
      const b = beams.getContext('2d');
      if (!b) return;
      b.setTransform(1, 0, 0, 1, 0, 0);
      b.clearRect(0, 0, beams.width, beams.height);
      b.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Brightest where the light leaves the shell, gone by BEAM_K radii.
      const ramp = (a: number) => {
        const g = b.createRadialGradient(cx, cy, 0, cx, cy, R * BEAM_K);
        g.addColorStop(0, `rgba(255,214,90,${0.2 * a})`);
        g.addColorStop(1 / BEAM_K, `rgba(255,198,60,${a})`);
        g.addColorStop(0.72, `rgba(255,194,58,${0.35 * a})`);
        g.addColorStop(1, 'rgba(255,190,60,0)');
        return g;
      };
      b.fillStyle = ramp(0.14 * strength);
      b.strokeStyle = ramp(0.3 * strength);
      b.lineWidth = 1.4;

      for (const ring of slotRings(front)) {
        const pts: Pt[] = ring.slice();
        for (const [x, y] of ring) pts.push([cx + BEAM_K * (x - cx), cy + BEAM_K * (y - cy)]);
        const h = hull(pts);
        b.beginPath();
        b.moveTo(h[0][0], h[0][1]);
        for (let i = 1; i < h.length; i++) b.lineTo(h[i][0], h[i][1]);
        b.closePath();
        b.fill();

        // The rays themselves, from every other point of the rim, so each
        // shaft is streaked like real light.
        b.beginPath();
        for (let i = 0; i < ring.length; i += 2) {
          const [x, y] = ring[i];
          b.moveTo(x, y);
          b.lineTo(cx + BEAM_K * (x - cx), cy + BEAM_K * (y - cy));
        }
        b.stroke();
      }

      const blur = `blur(${(2.5 * dpr).toFixed(1)}px)`;
      if (!front) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.filter = blur;
        ctx.drawImage(beams, 0, 0);
        ctx.restore();
        return;
      }
      // Near shafts: full strength only once they leave the sphere. Over the
      // solid shell, just a faint haze, so the pieces stay solid.
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip('evenodd');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.filter = blur;
      ctx.drawImage(beams, 0, 0);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.filter = blur;
      ctx.globalAlpha = 0.06;
      ctx.drawImage(beams, 0, 0);
      ctx.restore();
    }

    // What shows through the openings: the lit inside of the far wall, any
    // opening in that wall (through to the page), and the lamp at the core.
    function inside(front: Path2D) {
      ctx.save();
      ctx.clip(front);

      const L = lamp();
      const lx = L.x;
      const ly = L.y + 0.1 * L.s;
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, R * 1.1);
      g.addColorStop(0, '#fffef6');
      g.addColorStop(0.3, '#fff7d6');
      g.addColorStop(0.65, '#ffeaae');
      g.addColorStop(1, '#f6d184');
      ctx.fillStyle = g;
      ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);

      // The far wall, seen from inside.
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${CARAMEL},0.35)`;
      graticuleLines(false);
      ctx.strokeStyle = `rgba(${OBLIVION},0.3)`;
      for (const ring of COAST) strokeGeo(ring, false);

      // Openings in the far wall look out onto the page behind.
      const back = holePath(false);
      ctx.fillStyle = PAGE;
      ctx.fill(back);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${OBLIVION},0.35)`;
      ctx.stroke(back);

      bulb(L.x, L.y, L.s);

      // A soft shade just inside each edge gives the shell some thickness.
      ctx.strokeStyle = 'rgba(15,25,57,0.10)';
      ctx.lineWidth = 9;
      ctx.stroke(front);
      ctx.lineWidth = 3.5;
      ctx.stroke(front);
      ctx.restore();

      ctx.lineWidth = 1.3;
      ctx.strokeStyle = `rgba(${OBLIVION},0.75)`;
      ctx.stroke(front);
    }

    /* ---- The title, for narrow screens --------------------------------
       A line rides a parallel at latitude `lat`, on a sphere of radius `rf`
       larger than the globe. These give the point, its tangent, and the
       speed needed to step along it by true arc length. */
    function pointAt(u: number, lat: number, rf: number): Pt {
      const ph = lat * RAD;
      const cp = Math.cos(ph);
      const sp = Math.sin(ph);
      return [cx + rf * cp * Math.sin(u), cy - rf * (C0 * sp - S0 * cp * Math.cos(u))];
    }
    function angleAt(u: number, lat: number, rf: number) {
      const cp = Math.cos(lat * RAD);
      return Math.atan2(-rf * S0 * cp * Math.sin(u), rf * cp * Math.cos(u));
    }
    function speedAt(u: number, lat: number, rf: number) {
      const cp = Math.cos(lat * RAD);
      return rf * cp * Math.hypot(Math.cos(u), S0 * Math.sin(u));
    }
    // Advance u so the curve covers arc length ds, in steps, because the
    // speed varies along the parallel.
    function advance(u: number, ds: number, lat: number, rf: number) {
      const n = 6;
      const h = ds / n;
      for (let i = 0; i < n; i++) u += h / speedAt(u, lat, rf);
      return u;
    }

    function widthOf(c: CanvasRenderingContext2D, text: string, font: string) {
      c.font = font;
      let w = 0;
      for (const ch of text) w += c.measureText(ch).width;
      return w;
    }

    function putText(c: CanvasRenderingContext2D, text: string, lat: number, rf: number, font: string, u: number) {
      c.font = font;
      c.fillStyle = INK;
      c.textAlign = 'center';
      c.textBaseline = 'alphabetic';
      for (const ch of text) {
        const w = c.measureText(ch).width;
        const um = advance(u, w / 2, lat, rf);
        const [x, y] = pointAt(um, lat, rf);
        c.save();
        c.translate(x, y);
        c.rotate(angleAt(um, lat, rf));
        c.fillText(ch, 0, 0);
        c.restore();
        u = advance(u, w, lat, rf);
      }
      return u;
    }

    // The wordmark is warped the same way, in thin vertical slices.
    function putImage(c: CanvasRenderingContext2D, lat: number, rf: number, height: number, u: number) {
      if (!yale.complete || !yale.naturalWidth) return u;
      const w = yale.naturalWidth * (height / yale.naturalHeight);
      const n = 64;
      const sw = yale.naturalWidth / n;
      const dw = w / n;
      for (let i = 0; i < n; i++) {
        const um = advance(u, dw / 2, lat, rf);
        const [x, y] = pointAt(um, lat, rf);
        c.save();
        c.translate(x, y);
        c.rotate(angleAt(um, lat, rf));
        // A hair of overlap hides the seams between slices.
        c.drawImage(yale, i * sw, 0, sw, yale.naturalHeight, -dw / 2 - 0.35, -height, dw + 0.7, height);
        c.restore();
        u = advance(u, dw, lat, rf);
      }
      return u;
    }

    // The title never turns with the globe, so it is rendered once and
    // composited.
    function buildLayer(): HTMLCanvasElement | null {
      const key = `${W}x${H}${fontsReady ? 'f' : ''}${yale.complete ? 'y' : ''}`;
      if (layer && layerKey === key) return layer;
      layerKey = key;
      layer = document.createElement('canvas');
      layer.width = cv.width;
      layer.height = cv.height;
      const c = layer.getContext('2d');
      if (!c) return null;
      c.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);

      const rf = R * 1.3; // the title floats well clear of the shell
      const serif = (px: number, wt: number) => `${wt} ${px.toFixed(1)}px "EB Garamond", Georgia, serif`;
      const fTitle = R * 0.42;
      const hYale = fTitle * 0.68; // matched to the capitals below
      const fThe = serif(R * 0.31, 500);
      const fBig = serif(fTitle, 600);

      // Line one: the article, then the wordmark, centred together.
      const gap = R * 0.1;
      const yaleWidth = yale.naturalHeight ? yale.naturalWidth * (hYale / yale.naturalHeight) : 0;
      const line1 = widthOf(c, 'The', fThe) + gap + yaleWidth;
      let u = advance(0, -line1 / 2, LAT_A, rf);
      u = putText(c, 'The', LAT_A, rf, fThe, u);
      u = advance(u, gap, LAT_A, rf);
      putImage(c, LAT_A, rf, hYale, u);

      // Line two, on a parallel close below it.
      const line2 = widthOf(c, 'Impact Expo', fBig);
      putText(c, 'Impact Expo', LAT_B, rf, fBig, advance(0, -line2 / 2, LAT_B, rf));
      return layer;
    }

    function frame(t: number) {
      if (!alive) return;
      if (!last) last = t;
      if (!still) lon0 += ((t - last) / 1000) * SPIN;
      last = t;
      if (!W || !H) {
        if (!still) raf = requestAnimationFrame(frame);
        return;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      const dpr = cv.width / W;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      castLight(false, 0.8);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      shell();
      inside(holePath(true));
      castLight(true, 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = `rgba(${SAPPHIRE},0.7)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // On narrow screens the title wraps the globe.
      if (!wide.matches) {
        const title = buildLayer();
        if (title) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.shadowColor = 'rgba(15,25,57,0.24)';
          ctx.shadowBlur = 40 * dpr;
          ctx.shadowOffsetY = 24 * dpr;
          ctx.drawImage(title, 0, 0);
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
        }
      }

      if (!still) raf = requestAnimationFrame(frame);
    }

    function redraw() {
      if (still) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    }

    function resize() {
      const box = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = box.width;
      H = box.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      if (wide.matches) {
        // Right of the copy, which takes the left 40% or so of the stage.
        R = Math.min(H * 0.4, W * 0.27);
        cx = Math.min(W * 0.7, W - R * 1.08);
      } else {
        R = Math.min(H * 0.4, W * 0.36);
        cx = W / 2;
      }
      cy = H / 2;
      layer = null;
      redraw();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(cv);
    resize();

    // Redraw the title once the wordmark and the serif have arrived.
    const refresh = () => {
      layer = null;
      redraw();
    };
    yale.addEventListener('load', refresh);
    document.fonts
      ?.load('500 40px "EB Garamond"')
      .then(() => document.fonts.load('600 40px "EB Garamond"'))
      .catch(() => undefined)
      .then(() => {
        fontsReady = true;
        refresh();
      });

    raf = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      yale.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <div className={`lit-globe ${className}`}>
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
    </div>
  );
}
