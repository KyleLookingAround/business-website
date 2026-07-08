/**
 * Viaduct Studios — progressive enhancement.
 * The site is fully functional with JS off; this adds the burger menu,
 * mounts the generative masthead (hero on the home page, parapet strip on
 * inner pages), and sends a train across when you reach the foot of a page.
 * Re-initialised on every view transition (astro:page-load).
 */
import type { MastheadMode } from './viaduct';

let arrive: (() => void) | null = null;

function initNav() {
  const burger = document.querySelector<HTMLButtonElement>('.burger');
  const nav = document.querySelector<HTMLElement>('#site-nav');
  if (!burger || !nav) return;
  const setOpen = (open: boolean) => {
    nav.dataset.open = String(open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setOpen(nav.dataset.open !== 'true'));
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).tagName === 'A') setOpen(false);
  });
}

function initMasthead() {
  arrive = null;
  const stage = document.querySelector<HTMLElement>('[data-masthead]');
  if (!stage || !('IntersectionObserver' in window)) return;
  const mode = (stage.dataset.masthead === 'hero' ? 'hero' : 'strip') as MastheadMode;
  const animate =
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !!document.createElement('canvas').getContext;

  const io = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      obs.disconnect();
      import('./viaduct')
        .then((m) => { arrive = m.mountMasthead(stage, { mode, animate }).arrive; })
        .catch(() => { /* leave the CSS fallback in place */ });
    }
  }, { rootMargin: '120px' });
  io.observe(stage);
}

/** When the footer comes into view, a train crosses the masthead. */
function initArrival() {
  const footer = document.querySelector('.footer');
  if (!footer || !('IntersectionObserver' in window)) return;
  let last = 0;
  new IntersectionObserver(([e]) => {
    const now = Date.now();
    if (e.isIntersecting && now - last > 15000) { last = now; arrive?.(); }
  }, { threshold: 0.4 }).observe(footer);
}

function init() {
  initNav();
  initMasthead();
  initArrival();
}

// astro:page-load fires on first load and after every view transition
document.addEventListener('astro:page-load', init);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const nav = document.querySelector<HTMLElement>('#site-nav');
  const burger = document.querySelector<HTMLButtonElement>('.burger');
  if (nav) nav.dataset.open = 'false';
  burger?.setAttribute('aria-expanded', 'false');
});
