# Viaduct Studios — brand notes

The identity is the **Stockport viaduct**: twenty-seven brick arches, built by
hand, still carrying the railway a hundred and eighty years on. Built to carry,
built to last. Everything below serves that one idea.

## Palette

All tokens live in `:root` at the top of `public/styles.css`. Change them
there; nothing else hardcodes a colour.

| Token | Value | Use |
|---|---|---|
| `--brick` | `#9e4a37` | primary brick / accents |
| `--brick-deep` | `#6f3227` | dark brick, CTA band, footer arches |
| `--brick-warm` / `--brick-pale` | `#b25c43` / `#c8836b` | brick tone family |
| `--paper` | `#f4efe6` | page background (pale limestone) |
| `--limestone` | `#ece4d6` | raised surfaces / alt sections |
| `--mortar` | `#ddd2be` | hairlines, borders (mortar lines) |
| `--ink` | `#241f1c` | body text (soot) |
| `--ink-soft` / `--ink-faint` | `#4c443e` / `#7a6f66` | secondary text |
| `--signal` | `#0f7a52` | **the one accent** — links, CTAs, the headline underline (railway signal green) |

One accent only. If something needs to stand out, it's signal green; if it
needs to feel structural, it's brick. Resist adding a third colour.

## Type

Self-hosted (woff2, latin subset) in `public/assets/fonts/`, declared at the
top of `styles.css`:

- **Bricolage Grotesque** — display, headings, the wordmark (`--display`)
- **Source Serif 4** — body copy (`--body`)
- **IBM Plex Mono** — eyebrows, labels, meta, nav (`--mono`)

## The arch motif — used sparingly

The arch is the recurring shape, but it earns its place; it is not wallpaper.

- **Wordmark**: solid Bricolage with a four-arch brick rule beneath it (`.arch-rule`).
- **Case-study images**: arch-topped masks (rounded-top rectangles, `--arch`).
- **List bullets** on the services page: small arch shapes.
- **Section dividers / footer**: a repeating arch colonnade silhouette
  (`.colonnade`, `.footer-arches`) — the viaduct in negative space.
- **Headline**: the word in `*asterisks*` gets the signal-green underline
  (`markHeading()` in `src/lib/site.ts`).

Structure over decoration everywhere else. Whitespace, sturdy type, honest
alignment.

## The generative hero

`src/scripts/viaduct.ts` draws a brick viaduct that assembles itself course by
course against a date-seeded sky (same viaduct all day, a new one tomorrow;
tap to rebuild). It's a lazy-loaded canvas-2D island — mounted only when it
scrolls into view, only if `prefers-reduced-motion` is not set. With motion
reduced or JS off it shows the finished viaduct as a single static frame (the
CSS gradient stands in until the island loads). No dependencies.

## Voice

Plain, warm, a little wry. Northern-plain, not corporate. Lean into "carry",
"span", "built to last" where it's natural — without turning into a pun site.
Real prices, honest advice, including "you don't need this" when it's true.
