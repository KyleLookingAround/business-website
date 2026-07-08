/**
 * Viaduct Studios — the generative masthead.
 *
 * The viaduct is the site's chrome: every page carries a slice of the same
 * day's structure. Two mounts:
 *   hero  — the tall masthead (home): full sky, the viaduct assembles
 *           course by course, headline sits on the sky.
 *   strip — the slim parapet crop on inner pages: same seed, drawn
 *           instantly, so crossing pages feels like walking the deck.
 *
 * The sky follows the local hour (dawn / day / dusk / night — night also
 * whenever the visitor prefers a dark scheme) and exports its colours as
 * CSS custom properties so the page tints with it. Same viaduct all day
 * (date-seeded); tap to lay a fresh one. prefers-reduced-motion → the
 * finished viaduct as a single static frame. Canvas-2D, no dependencies.
 */

export type MastheadMode = 'hero' | 'strip';

type Brick = { x: number; y: number; w: number; h: number; fill: string; order: number };
type Sky = {
  name: 'dawn' | 'day' | 'dusk' | 'night';
  top: string; bottom: string; sun: string; ground: string;
  dim: number;           // 0..1 darkening laid over the masonry
  stars: boolean;
};

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

const SKIES: Record<Sky['name'], Sky> = {
  dawn:  { name: 'dawn',  top: '#e0b18e', bottom: '#f6e2c8', sun: 'rgba(255,204,140,.55)', ground: '#c3ad8c', dim: 0.06, stars: false },
  day:   { name: 'day',   top: '#bcd4e4', bottom: '#eee5d2', sun: 'transparent',           ground: '#c9b59a', dim: 0,    stars: false },
  dusk:  { name: 'dusk',  top: '#8a7490', bottom: '#e2a878', sun: 'rgba(255,178,118,.55)', ground: '#9c8a72', dim: 0.14, stars: false },
  night: { name: 'night', top: '#1c2337', bottom: '#3c3350', sun: 'rgba(214,224,255,.3)',  ground: '#4a4256', dim: 0.42, stars: true },
};

function pickSky(): Sky {
  if (matchMedia('(prefers-color-scheme: dark)').matches) return SKIES.night;
  const h = new Date().getHours();
  if (h >= 5 && h < 8) return SKIES.dawn;
  if (h >= 8 && h < 17) return SKIES.day;
  if (h >= 17 && h < 21) return SKIES.dusk;
  return SKIES.night;
}

/** Tell the page what sky it's under (tokens + fallback gradient). */
function exportSky(sky: Sky) {
  const root = document.documentElement;
  root.style.setProperty('--sky-top', sky.top);
  root.style.setProperty('--sky-bottom', sky.bottom);
  root.dataset.tod = sky.name;
}

const brickTone = (r: () => number) => {
  const l = 34 + r() * 14;
  const s = 34 + r() * 16;
  const h = 8 + r() * 12;
  return `hsl(${h} ${s}% ${l}%)`;
};

function build(w: number, h: number, seed: number, sky: Sky, mode: MastheadMode, skylineY?: number) {
  const r = rng(seed);

  const bricks: Brick[] = [];
  const ground = h * (mode === 'hero' ? 0.97 : 0.94);
  // hero: the masonry starts below the measured headline block (skylineY),
  // so text and structure never collide; strip keeps the deck high
  const structTop = mode === 'hero'
    ? Math.min(h * 0.86, Math.max(h * 0.5, (skylineY ?? h * 0.55) + 30))
    : h * (0.22 + r() * 0.04);
  const bandH = Math.max(10, h * 0.05);
  const springY = structTop + bandH + (ground - structTop) * (0.2 + r() * 0.08);

  const nArches = Math.max(4, Math.round(w / 170));
  const sideMargin = -w * 0.02;                 // run past the edges — infrastructure, not an object
  const usable = w - sideMargin * 2;
  const pierRatio = 0.34;
  const unit = usable / (nArches + (nArches + 1) * pierRatio);
  const openW = unit;
  const pierW = unit * pierRatio;

  const arches = [] as { cx: number; r: number }[];
  let x = sideMargin + pierW;
  for (let i = 0; i < nArches; i++) {
    arches.push({ cx: x + openW / 2, r: openW / 2 });
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

  const bh = Math.max(7, h * (mode === 'hero' ? 0.022 : 0.05));
  const mortar = Math.max(1, bh * 0.16);
  const bw = bh * 2.2;
  let course = 0;
  for (let by = ground - bh; by > structTop - bh; by -= bh + mortar) {
    const offset = course % 2 ? bw / 2 : 0;
    for (let bx = -bw; bx < w; bx += bw + mortar) {
      const cx = bx + offset;
      if (insideOpening(cx + bw / 2, by + bh / 2)) continue;
      bricks.push({ x: cx, y: by, w: bw, h: bh, fill: brickTone(r), order: course + r() * 0.9 });
    }
    course++;
  }
  const maxOrder = course;

  // seeded stars for night skies
  const stars = sky.stars
    ? Array.from({ length: 70 }, () => ({ x: r() * w, y: r() * structTop * 0.92, s: r() < 0.15 ? 1.6 : 1 }))
    : [];

  return { bricks, maxOrder, sky, ground, structTop, springY, bandH, arches, w, h, stars };
}

type Scene = ReturnType<typeof build>;

function paintSky(ctx: CanvasRenderingContext2D, sc: Scene) {
  const { w, h, sky } = sc;
  const g = ctx.createLinearGradient(0, 0, 0, sc.ground);
  g.addColorStop(0, sky.top);
  g.addColorStop(1, sky.bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  for (const st of sc.stars) {
    ctx.fillStyle = 'rgba(240,240,255,.8)';
    ctx.fillRect(st.x, st.y, st.s, st.s);
  }
  const sx = w * 0.78, sy = sc.structTop * 0.42;
  const sun = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.17);
  sun.addColorStop(0, sky.sun);
  sun.addColorStop(1, 'transparent');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, sc.ground);
  ctx.fillStyle = sky.ground;
  ctx.fillRect(0, sc.ground, w, h - sc.ground);
}

function paintArchRings(ctx: CanvasRenderingContext2D, sc: Scene, reveal: number) {
  const t = Math.max(0, Math.min(1, (reveal - 0.5) / 0.45));
  if (t <= 0) return;
  const ringW = Math.max(6, sc.h * (sc.h > 400 ? 0.028 : 0.06));
  ctx.save();
  ctx.globalAlpha = t;
  for (const a of sc.arches) {
    ctx.lineWidth = ringW;
    ctx.strokeStyle = '#6f3227';
    ctx.beginPath();
    ctx.arc(a.cx, sc.springY, a.r, Math.PI, 2 * Math.PI);
    ctx.stroke();
    const n = Math.max(7, Math.round((a.r * Math.PI) / (ringW * 1.6)));
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(36,31,28,.30)';
    for (let i = 0; i <= n; i++) {
      const ang = Math.PI + (i / n) * Math.PI;
      const c = Math.cos(ang), s = Math.sin(ang);
      ctx.beginPath();
      ctx.moveTo(a.cx + c * (a.r - ringW / 2), sc.springY + s * (a.r - ringW / 2));
      ctx.lineTo(a.cx + c * (a.r + ringW / 2), sc.springY + s * (a.r + ringW / 2));
      ctx.stroke();
    }
    const kw = ringW * 0.95, kh = ringW * 1.7;
    ctx.fillStyle = '#844030';
    ctx.fillRect(a.cx - kw / 2, sc.springY - a.r - ringW * 0.55, kw, kh);
  }
  ctx.restore();
}

function paintDeck(ctx: CanvasRenderingContext2D, sc: Scene, reveal: number) {
  if (reveal < 0.98) return;
  ctx.fillStyle = '#5b2c22';
  ctx.fillRect(0, sc.structTop, sc.w, sc.bandH * 0.55);
  ctx.fillStyle = 'rgba(36,31,28,.25)';
  ctx.fillRect(0, sc.structTop, sc.w, 2);
}

/** Night falls on the masonry, not the sky. */
function paintDim(ctx: CanvasRenderingContext2D, sc: Scene) {
  if (!sc.sky.dim) return;
  ctx.fillStyle = `rgba(12,12,26,${sc.sky.dim})`;
  ctx.fillRect(0, sc.structTop, sc.w, sc.h - sc.structTop);
}

function paintTrain(ctx: CanvasRenderingContext2D, sc: Scene, t: number) {
  const carH = Math.min(sc.h * 0.07, 26);
  const deckY = sc.structTop - carH - sc.h * 0.004;
  const carW = carH * 2.6, gap = 6, n = 3;
  const trainW = carW * n + gap * (n - 1);
  const x = -trainW + t * (sc.w + trainW);
  const lit = sc.sky.stars;
  for (let i = 0; i < n; i++) {
    const cx = x + i * (carW + gap);
    ctx.fillStyle = i === 0 ? '#0f7a52' : '#123c31';
    ctx.fillRect(cx, deckY, carW, carH);
    ctx.fillStyle = lit ? 'rgba(255,214,140,.95)' : 'rgba(244,239,230,.8)';
    ctx.fillRect(cx + carW * 0.12, deckY + carH * 0.22, carW * 0.76, carH * 0.32);
    ctx.fillStyle = 'rgba(36,31,28,.5)';
    ctx.fillRect(cx + carW * 0.1, deckY + carH, carW * 0.8, Math.max(2, sc.h * 0.005));
  }
}

export function mountMasthead(stage: HTMLElement, opts: { mode: MastheadMode; animate: boolean }) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'A generative illustration of a brick railway viaduct.');
  stage.querySelectorAll('canvas').forEach((c) => c.remove());
  stage.prepend(canvas);
  stage.classList.add('has-canvas');

  const ctx = canvas.getContext('2d')!;
  const sky = pickSky();
  exportSky(sky);

  let sc: Scene;
  let raf = 0;
  let visible = true;
  let trainTimer = 0;
  let trainRunning = false;

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
    paintArchRings(ctx, sc, reveal);
    paintDeck(ctx, sc, reveal);
    paintDim(ctx, sc);
    if (train >= 0) paintTrain(ctx, sc, train);
  };

  const runTrain = (onDone?: () => void) => {
    if (trainRunning) return;
    trainRunning = true;
    const start = performance.now();
    const dur = 4600;
    const step = (now: number) => {
      const t = (now - start) / dur;
      if (t >= 1) { drawFrame(1); trainRunning = false; onDone?.(); return; }
      drawFrame(1, t);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  function scheduleTrain() {
    if (!opts.animate) return;
    clearTimeout(trainTimer);
    trainTimer = window.setTimeout(() => {
      if (!visible) { scheduleTrain(); return; }
      runTrain(scheduleTrain);
    }, 3500 + Math.random() * 3500);
  }

  const run = (seed: number, instant: boolean) => {
    cancelAnimationFrame(raf);
    trainRunning = false;
    const { w, h } = size();
    // where does the headline block end? masonry starts below it
    let skylineY: number | undefined;
    const content = stage.querySelector<HTMLElement>('.mast-content');
    if (content) {
      const cr = content.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      // ignore the reserved bottom padding — measure the last child instead
      const kids = [...content.children] as HTMLElement[];
      const lastBottom = kids.length
        ? Math.max(...kids.map((k) => k.getBoundingClientRect().bottom))
        : cr.bottom;
      skylineY = lastBottom - sr.top;
    }
    sc = build(w, h, seed, sky, opts.mode, skylineY);
    if (instant || opts.mode === 'strip') { drawFrame(1); scheduleTrain(); return; }
    const start = performance.now();
    const dur = 2200;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      drawFrame(1 - Math.pow(1 - p, 2));
      if (p < 1) raf = requestAnimationFrame(step);
      else scheduleTrain();
    };
    raf = requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => run(daySeed(), true), 200);
  });

  const rebuild = () => run((Math.random() * 1e9) | 0, !opts.animate || opts.mode === 'strip');
  stage.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a, button')) return; // headline links stay links
    rebuild();
  });
  stage.addEventListener('keydown', (e) => {
    if (e.target !== stage) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rebuild(); }
  });
  stage.tabIndex = 0;
  stage.setAttribute('aria-label', 'Generative viaduct — activate to build a new one.');

  run(daySeed(), !opts.animate);

  return {
    /** The end-of-page flourish: a train crosses the masthead. */
    arrive() { if (opts.animate && visible) runTrain(scheduleTrain); },
  };
}
