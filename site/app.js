// Made in Stockport: the small bits of life on the page.
// Everything here is decoration; the page reads fine without it.
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Email, put together here so it isn't sitting in the source ──
  for (const a of document.querySelectorAll('a.mail')) {
    a.href = 'mailto:' + a.dataset.u + '@' + a.dataset.d;
  }

  // ── The dots follow the zone in view ──
  const dots = new Map([...document.querySelectorAll('.dot')].map((d) => [d.getAttribute('href').slice(1), d]));
  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      for (const d of dots.values()) d.classList.remove('on');
      dots.get(e.target.id)?.classList.add('on');
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  for (const id of dots.keys()) { const el = document.getElementById(id); if (el) seen.observe(el); }

  // ── Hearthworks: an island drawn fresh, villagers walking its lanes ──
  const canvas = document.querySelector('.isle');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    const C = {
      sea: css('--hw-sea'), shallow: css('--hw-shallow'), sand: css('--hw-sand'), grass: css('--hw-grass'),
      grass2: css('--hw-grass-2'), tree: css('--hw-tree'), roof: css('--hw-roof'), wall: css('--hw-wall'), brass: css('--hw-brass-hi'),
    };
    let seed = 1847;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    let ground, lanes = [], walkers = [], T = 24, W = 0, H = 0, dpr = 1;

    const build = () => {
      seed = 1847;
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      T = W < 600 ? 18 : 24;
      const cols = Math.ceil(W / T) + 1, rows = Math.ceil(H / T) + 1;
      // a coarse noise field, smoothed
      const g = 8, nx = Math.ceil(cols / g) + 2, ny = Math.ceil(rows / g) + 2;
      const coarse = Array.from({ length: nx * ny }, rnd);
      const noise = (x, y) => {
        const fx = x / g, fy = y / g, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
        const at = (a, b) => coarse[Math.min(b, ny - 1) * nx + Math.min(a, nx - 1)];
        const s = (t) => t * t * (3 - 2 * t);
        const top = at(ix, iy) + (at(ix + 1, iy) - at(ix, iy)) * s(tx);
        const bot = at(ix, iy + 1) + (at(ix + 1, iy + 1) - at(ix, iy + 1)) * s(tx);
        return top + (bot - top) * s(ty);
      };
      const land = [];
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const dx = (x / cols - 0.6) / 0.52, dy = (y / rows - 0.5) / 0.4;
        land.push(Math.hypot(dx, dy) + (noise(x, y) - 0.5) * 0.55);
      }
      const off = document.createElement('canvas'); off.width = W * dpr; off.height = H * dpr;
      const o = off.getContext('2d'); o.scale(dpr, dpr);
      o.fillStyle = C.sea; o.fillRect(0, 0, W, H);
      const cell = (x, y) => land[y * cols + x];
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const v = cell(x, y);
        if (v < 0.86) o.fillStyle = (x + y) % 2 ? C.grass : C.grass2;
        else if (v < 0.94) o.fillStyle = C.sand;
        else if (v < 1.06) o.fillStyle = C.shallow;
        else continue;
        o.fillRect(x * T, y * T, T, T);
      }
      // a village: a cross of lanes with cottages along them
      const cx = Math.round(cols * 0.72), cy = Math.round(rows * 0.5);
      lanes = [];
      for (let i = -7; i <= 7; i++) { lanes.push([cx + i, cy]); lanes.push([cx, cy + i]); }
      for (let i = -4; i <= 4; i++) { lanes.push([cx + i, cy - 4]); lanes.push([cx + i, cy + 4]); }
      lanes = lanes.filter(([x, y]) => x >= 0 && y >= 0 && x < cols && y < rows && cell(x, y) < 0.8);
      const isLane = new Set(lanes.map(([x, y]) => x + ',' + y));
      o.fillStyle = '#c9a874';
      for (const [x, y] of lanes) o.fillRect(x * T + 2, y * T + 2, T - 4, T - 4);
      const homes = [];
      for (const [x, y] of lanes) {
        for (const ay of [-1, 1]) {
          const hx = x, hy = y + ay;
          if ((x + y) % 3 || isLane.has(hx + ',' + hy) || cell(hx, hy) >= 0.78 || rnd() < 0.45) continue;
          homes.push([hx, hy]);
        }
      }
      const taken = new Set([...isLane, ...homes.map(([x, y]) => x + ',' + y)]);
      // trees, with a soft shadow
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        if (cell(x, y) > 0.8 || taken.has(x + ',' + y) || rnd() < 0.55) continue;
        if (Math.abs(x - cx) < 9 && Math.abs(y - cy) < 7 && rnd() < 0.85) continue;
        const r = T * (0.36 + rnd() * 0.16), px = x * T + T / 2, py = y * T + T / 2;
        o.fillStyle = 'rgba(0,0,0,.18)'; o.beginPath(); o.arc(px + 3, py + 4, r, 0, 7); o.fill();
        o.fillStyle = C.tree; o.beginPath(); o.arc(px, py, r, 0, 7); o.fill();
        o.fillStyle = 'rgba(255,255,255,.08)'; o.beginPath(); o.arc(px - r / 3, py - r / 3, r / 2.4, 0, 7); o.fill();
      }
      for (const [x, y] of homes) {
        const px = x * T, py = y * T;
        o.fillStyle = C.wall; o.fillRect(px + 3, py + T * 0.42, T - 6, T * 0.52);
        o.fillStyle = C.roof; o.fillRect(px + 1, py + 3, T - 2, T * 0.42);
        o.fillStyle = '#5a3a2a'; o.fillRect(px + T * 0.62, py + T * 0.62, T * 0.18, T * 0.32);
        o.fillStyle = '#f2c46a'; o.fillRect(px + T * 0.2, py + T * 0.56, T * 0.16, T * 0.14);
      }
      ground = off;
      walkers = Array.from({ length: Math.min(9, lanes.length) }, (_, i) => {
        const [x, y] = lanes[Math.floor(rnd() * lanes.length)];
        return { x, y, tx: x, ty: y, p: 1, load: i % 3 === 0 ? C.brass : i % 3 === 1 ? '#8a5a3a' : null };
      });
    };

    const isLaneAt = (x, y) => lanes.some(([a, b]) => a === x && b === y);
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(ground, 0, 0, W, H);
      for (const w of walkers) {
        if (w.p >= 1) {
          w.x = w.tx; w.y = w.ty; w.p = 0;
          const options = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => isLaneAt(w.x + dx, w.y + dy));
          const [dx, dy] = options.length ? options[Math.floor(Math.random() * options.length)] : [0, 0]; // cosmetic
          w.tx = w.x + dx; w.ty = w.y + dy;
        }
        w.p += 0.025;
        const px = (w.x + (w.tx - w.x) * w.p) * T + T / 2, py = (w.y + (w.ty - w.y) * w.p) * T + T / 2;
        ctx.fillStyle = '#2f5d8a'; ctx.beginPath(); ctx.arc(px, py + 2, T * 0.2, 0, 7); ctx.fill();
        ctx.fillStyle = '#f0d2b0'; ctx.beginPath(); ctx.arc(px, py - T * 0.16, T * 0.13, 0, 7); ctx.fill();
        if (w.load) { ctx.fillStyle = w.load; ctx.fillRect(px - T * 0.14, py - T * 0.56, T * 0.28, T * 0.22); }
      }
    };

    let running = false, raf = 0;
    const loop = () => { draw(); if (running) raf = requestAnimationFrame(loop); };
    build(); draw();
    if (!still) {
      new IntersectionObserver(([e]) => {
        running = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (running) loop();
      }).observe(canvas);
    }
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); draw(); }, 150); });
  }

  // ── Final Call: the board flaps into place when it comes into view ──
  const board = document.querySelector('.board');
  if (board) {
    const flaps = [...board.querySelectorAll('.flap')];
    for (const f of flaps) f.textContent = f.dataset.t;
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:';
    const flip = () => {
      flaps.forEach((f, i) => {
        const target = f.dataset.t;
        let n = 0;
        const steps = 8 + (i % 5) * 3;
        const tick = () => {
          n++;
          f.textContent = [...target].map((ch, k) =>
            ch === ' ' || n > steps - (target.length - k) * 0.4 ? ch : glyphs[Math.floor(Math.random() * glyphs.length)] // cosmetic
          ).join('');
          if (n < steps + target.length) setTimeout(tick, 45);
          else f.textContent = target;
        };
        setTimeout(tick, i * 30);
      });
    };
    if (!still) {
      new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { flip(); obs.disconnect(); } }, { threshold: 0.4 }).observe(board);
    }
    const clock = board.querySelector('.clock');
    const now = () => { const d = new Date(); clock.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
    now(); setInterval(now, 30000);
  }
})();
