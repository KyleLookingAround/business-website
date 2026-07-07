/**
 * Viaduct Studios — progressive enhancement.
 * The site is fully functional with JS off; this adds the burger menu and
 * lazy-mounts the generative viaduct hero (only when it scrolls into view,
 * motion is allowed, and canvas is supported).
 */

// ── Burger nav ───────────────────────────────────────────────────────
const burger = document.querySelector<HTMLButtonElement>('.burger');
const nav = document.querySelector<HTMLElement>('#site-nav');
if (burger && nav) {
  const setOpen = (open: boolean) => {
    nav.dataset.open = String(open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setOpen(nav.dataset.open !== 'true'));
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).tagName === 'A') setOpen(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

// ── Lazy-mount the generative viaduct hero ───────────────────────────
const stage = document.querySelector<HTMLElement>('[data-viaduct]');
if (stage && 'IntersectionObserver' in window) {
  const canPaint =
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !!document.createElement('canvas').getContext;

  const io = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      obs.disconnect();
      import('./viaduct')
        .then((m) => m.mountViaduct(stage, { animate: canPaint }))
        .catch(() => { /* leave the static fallback in place */ });
    }
  }, { rootMargin: '120px' });
  io.observe(stage);
}
