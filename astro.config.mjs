// Viaduct Studios — Astro configuration.
//
// Hosted on GitHub Pages as a project page for now, so the site lives under
// /business-website/ (`base`). Internal links in templates stay relative
// (./work.html) so a future custom-domain move only needs `site`/`base`
// changed here. `build.format: 'file'` keeps URLs as plain .html files.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kylelookingaround.github.io',
  base: '/business-website',
  trailingSlash: 'ignore',
  build: { format: 'file' },
  integrations: [
    sitemap({
      // pages are served as real .html files — keep that in the sitemap
      serialize: (item) => {
        const url = new URL(item.url);
        const root = '/business-website';
        if (url.pathname !== root && url.pathname !== root + '/' && !url.pathname.endsWith('.html')) {
          item.url = item.url.replace(/\/?$/, '.html');
        }
        return item;
      },
    }),
  ],
});
