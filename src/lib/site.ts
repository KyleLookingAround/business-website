/**
 * Viaduct Studios — build-time helpers shared by the layout and pages.
 * Content loaders, the encoded-mailto trick, the *asterisk* headline
 * marker, and the ProfessionalService JSON-LD.
 */
import { getEntry, getCollection } from 'astro:content';

// Base-aware URL helper. `import.meta.env.BASE_URL` is "/business-website/"
// now and "/" after a custom-domain move — so u('work.html') stays correct
// at any page depth (including /work/*.html) and the domain move is
// config-only. Content lives in /public, so CSS/font URLs inside styles.css
// stay relative to the stylesheet and are unaffected.
const RAW_BASE = import.meta.env.BASE_URL || '/';
export const BASE = RAW_BASE.endsWith('/') ? RAW_BASE : RAW_BASE + '/';
export const u = (path: string) => BASE + path.replace(/^\.?\//, '');

export async function getSettings() {
  const entry = await getEntry('settings', 'main');
  if (!entry) throw new Error('content/settings.yml is missing');
  return entry.data;
}
type Settings = Awaited<ReturnType<typeof getSettings>>;

export async function getHome() {
  const entry = await getEntry('home', 'main');
  if (!entry) throw new Error('content/home.yml is missing');
  return entry.data;
}

export async function getServices() {
  const entry = await getEntry('services', 'main');
  if (!entry) throw new Error('content/services.yml is missing');
  return entry.data;
}

export async function getAbout() {
  const entry = await getEntry('about', 'main');
  if (!entry) throw new Error('content/about.yml is missing');
  return entry.data;
}

/** Case studies, ordered (lowest `order` first, then by title). */
export async function getWork() {
  const items = await getCollection('work');
  return items.sort((a, b) =>
    (a.data.order - b.data.order) || a.data.title.localeCompare(b.data.title));
}

/** Social-share image as the absolute URL that link unfurlers need. */
export function ogImage(s: Settings, path?: string) {
  const rel = (path ?? '/assets/og-default.png').replace(/^\.?\//, '');
  return s.url.replace(/\/?$/, '/') + rel;
}

/**
 * Entity-encode an email so it never appears as scrapeable plain text in the
 * markup. Returns { href, label } with both the mailto: and the visible text
 * encoded — decoded by the browser, invisible to naive scrapers.
 */
export function encodeMail(email: string, subject = '') {
  const enc = (str: string) => [...str].map((c) => `&#${c.charCodeAt(0)};`).join('');
  const q = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return { href: enc(`mailto:${email}${q}`), label: enc(email) };
}

/**
 * Headline marker: the word wrapped in *asterisks* becomes a
 * <span class="mark"> so the stylesheet can draw the signal-green underline.
 * Everything else is passed through as-is (content is trusted, author-written).
 */
export function markHeading(text: string) {
  return text.replace(/\*([^*]+)\*/g, '<span class="mark">$1</span>');
}

export function jsonLd(s: Settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: s.name,
    description: s.description,
    url: s.url,
    email: s.email,
    areaServed: [s.locality, s.region, 'Manchester'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: s.locality,
      addressRegion: s.region,
      addressCountry: 'GB',
    },
    knowsAbout: ['Web design', 'Web development', 'Small business websites'],
    sameAs: [s.links.github, s.links.linkedin].filter(Boolean),
  };
}

/** Nav items, in order. `href` is base-aware (works at any page depth). */
export const NAV = [
  { href: u('work.html'), label: 'Work' },
  { href: u('services.html'), label: 'Services' },
  { href: u('about.html'), label: 'About' },
  { href: u('contact.html'), label: 'Contact' },
];
