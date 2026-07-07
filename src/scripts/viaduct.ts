/**
 * Viaduct Studios — the generative hero.
 *
 * A run of brick arches that assembles itself course by course against a
 * date-seeded sky. Same viaduct all day (seeded by the date); a new one
 * tomorrow. Tap to lay a fresh one. prefers-reduced-motion → the finished
 * viaduct as a single static frame. Canvas-2D only, no dependencies.
 */

type Brick = { x: number; y: number; w: number; h: number; fill: string; order: number };
type Sky = { top: string; bottom: string; sun: string; ground: string };

// mulberry32 — small deterministic PRNG
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function daySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// Four skies; which one shows depends on the seed (so it varies by day).
const SKIES: Sky[] = [
  { top: '#bfd6e4', bottom: '#f0e6d4', sun: 'rgba(255,241,214,.7)', ground: '#c9b59a' }, // clear
  { top: '#e7c39b', bottom: '#f6e2c8', sun: 'rgba(255,214,150,.85)', ground: '#c3ad8c' }, // dawn
  { top: '#9aa7b4', bottom: '#d9d2c4', sun: 'rgba(230,228,222,.5)', ground: '#b7ab93' },  // overcast
  { top: '#7c6f86', bottom: '#e0a878', sun: 'rgba(255,180,120,.8)', ground: '#9c8a72' },  // dusk
];

const brickTone = (r: () => number) => {
  // vary around the brand brick — hue 12°, jittered lightness/sat
  const l = 34 + r() * 14;          // 34–48%
  const s = 34 + r() * 16;          // 34–50%
  const h = 8 + r() * 12;           // 8–20°
  return `hsl(${h} ${s}% ${l}%)`;
};

function build(w: number, h: number, seed: number) {
  const r = rng(seed);
  const sky = SKIES[seed % SKIES.length];

  const bricks: Brick[] = [];
  const ground = h * 0.9;
  const structTop = h * (0.24 + r() * 0.06);
  const bandH = Math.max(10, h * 0.07);           // parapet / deck band
  const springY = structTop + bandH + (ground - structTop) * (0.18 + r() * 0.08);

  const nArches = Math.max(4, Math.round(w / 150));
  const sideMargin = w * 0.03;
  const usable = w - sideMargin * 2;
  const pierRatio = 0.34;                          // pier : opening
  const unit = usable / (nArches + (nArches + 1) * pierRatio);
  const openW = unit;
  const pierW = unit * pierRatio;

  const arches = [] as { cx: number; r: number }[];
  let x = sideMargin + pierW;
  for (let i = 0; i < nArches; i++) {
    const cx = x + openW / 2;
    arches.push({ cx, r: openW / 2 });
    x += openW + pierW;
  }

  const insideOpening = (px: number, py: number) => {
    if (py < springY - openW / 2 || py > ground) return false;
    for (const a of arches) {
      if (px < a.cx - a.r || px > a.cx + a.r) continue;
      const dx = px - a.cx;
      const topY = springY - Math.sqrt(Math.max(0, a.r * a.r - dx * dx));
      if (py >= topY) return true;
    }
    return false;
  };

  // Tile the structure with staggered brick courses; keep the masonry, drop
  // bricks that fall inside an arch opening. Order = bottom-up (it "rises").
  const bh = Math.max(7, h * 0.026);
  const mortar = Math.max(1, bh * 0.16);
  const bw = bh * 2.2;
  let course = 0;
  for (let by = ground - bh; by > structTop - bh; by -= bh + mortar) {
    const offset = course % 2 ? bw / 2 : 0;
    for (let bx = sideMargin - bw; bx < w - sideMargin; bx += bw + mortar) {
      const cx = bx + offset;
      const midX = cx + bw / 2;
      const midY = by + bh / 2;
      if (insideOpening(midX, midY)) continue;
      // clip bricks to the structure envelope
      if (cx + bw < sideMargin || cx > w - sideMargin) continue;
      const order = course + r() * 0.9;
      bricks.push({ x: cx, y: by, w: bw, h: bh, fill: brickTone(r), order });
    }
    course++;
  }
  const maxOrder = course;

  return { bricks, maxOrder, sky, ground, structTop, springY, bandH, arches, openW,
           sideMargin, w, h };
}

type Scene = ReturnType<typeof build>;

function paintSky(ctx: CanvasRenderingContext2D, sc: Scene) {
  const { w, h, sky } = sc;
  const g = ctx.createLinearGradient(0, 0, 0, sc.ground);
  g.addColorStop(0, sky.top);
  g.addColorStop(1, sky.bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // soft sun/haze
  const sx = w * 0.72, sy = sc.structTop * 0.7;
  const sun = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.28);
  sun.addColorStop(0, sky.sun);
  sun.addColorStop(1, 'transparent');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, sc.ground);
  // ground
  ctx.fillStyle = sky.ground;
  ctx.fillRect(0, sc.ground, w, h - sc.ground);
}

function paintDeck(ctx: CanvasRenderingContext2D, sc: Scene, reveal: number) {
  if (reveal < 0.98) return;
  // parapet band + a hint of rail deck across the top
  ctx.fillStyle = '#5b2c22';
  ctx.fillRect(sc.sideMargin, sc.structTop, sc.w - sc.sideMargin * 2, sc.bandH * 0.55);
  ctx.fillStyle = 'rgba(36,31,28,.25)';
  ctx.fillRect(sc.sideMargin, sc.structTop, sc.w - sc.sideMargin * 2, 2);
}

function paintTrain(ctx: CanvasRenderingContext2D, sc: Scene, t: number) {
  // t in [0,1]: a small train slides across the deck
  const deckY = sc.structTop - sc.h * 0.055;
  const carW = sc.w * 0.06, carH = sc.h * 0.05, n = 3;
  const trainW = carW * n + 6 * (n - 1);
  const x = -trainW + t * (sc.w + trainW);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = i === 0 ? '#0f7a52' : '#123c31';
    const cx = x + i * (carW + 6);
    ctx.fillRect(cx, deckY, carW, carH);
    ctx.fillStyle = 'rgba(244,239,230,.75)';
    ctx.fillRect(cx + carW * 0.12, deckY + carH * 0.2, carW * 0.76, carH * 0.34);
  }
}

export function mountViaduct(stage: HTMLElement, opts: { animate: boolean }) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'A generative illustration of a brick railway viaduct.');
  stage.querySelector('.stage-fallback')?.remove();
  stage.prepend(canvas);
  stage.classList.add('is-interactive');

  const ctx = canvas.getContext('2d')!;
  let sc: Scene;
  let raf = 0;
  let visible = true;

  const size = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = stage.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: rect.width, h: rect.height };
  };

  const drawFrame = (reveal: number, train = -1) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintSky(ctx, sc);
    const cut = reveal * sc.maxOrder;
    for (const b of sc.bricks) {
      if (b.order > cut) continue;
      ctx.fillStyle = b.fill;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    paintDeck(ctx, sc, reveal);
    if (train >= 0) paintTrain(ctx, sc, train);
  };

  let trainTimer = 0;
  const run = (seed: number, instant: boolean) => {
    cancelAnimationFrame(raf);
    const { w, h } = size();
    sc = build(w, h, seed);
    if (instant) { drawFrame(1); scheduleTrain(); return; }
    const start = performance.now();
    const dur = 2200;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 2);
      drawFrame(eased);
      if (p < 1) raf = requestAnimationFrame(step);
      else scheduleTrain();
    };
    raf = requestAnimationFrame(step);
  };

  function scheduleTrain() {
    if (!opts.animate) return;
    clearTimeout(trainTimer);
    trainTimer = window.setTimeout(() => {
      if (!visible) { scheduleTrain(); return; }
      const start = performance.now();
      const dur = 4200;
      const step = (now: number) => {
        const t = (now - start) / dur;
        if (t >= 1) { drawFrame(1); scheduleTrain(); return; }
        drawFrame(1, t);
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, 6000 + Math.random() * 6000);
  }

  // pause train loop when the hero is off-screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; })
      .observe(stage);
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => run(daySeed(), true), 200);
  });

  const rebuild = () => run((Math.random() * 1e9) | 0, !opts.animate);
  stage.addEventListener('click', rebuild);
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rebuild(); }
  });
  stage.tabIndex = 0;
  stage.setAttribute('aria-label', 'Generative viaduct — activate to build a new one.');

  run(daySeed(), !opts.animate);
}
