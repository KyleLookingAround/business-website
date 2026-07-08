# Viaduct Studios — brand notes (v2, the "Full Span" system)

The identity is the **Stockport viaduct**: twenty-seven brick arches, built
by hand, still carrying the railway a hundred and eighty years on. In v1 the
viaduct was an illustration beside the headline; in v2 it is the **site's
structure**. Every page carries a slice of the same day's generative
viaduct, sections are mileposts along the route, and a signal rail tracks
your progress down the page.

## The masthead

`src/scripts/viaduct.ts` draws the viaduct on a canvas, seeded by the date
(same structure all day, a new one tomorrow; tap to lay a fresh one). Two
mounts, chosen by `data-masthead` on the `.masthead` element:

- **hero** (home) — full sky, the headline sits *on* the sky, and the
  masonry assembles course by course **below the measured content** (the
  script reads where the text block ends, so they can never collide).
- **strip** (inner pages) — a slim parapet crop of the same day's build,
  drawn instantly: crossing pages feels like walking the deck.

The **sky follows the local hour** — dawn / day / dusk / night — and night
also whenever the visitor prefers a dark scheme. The script exports the sky
as `--sky-top` / `--sky-bottom` custom properties and stamps
`data-tod` on `<html>`. At night: stars, dimmed masonry, lit train windows.

Fallbacks, in order: reduced motion → the finished viaduct as one static
frame; JS off → the CSS gradient sky plus a pure-CSS arch silhouette
(`.masthead::after`). The island is lazy-mounted and pauses off-screen.
When the footer scrolls into view, a train crosses the masthead — arrival.

## Palette

Tokens live in `:root` at the top of `public/styles.css`; the dark scheme
overrides them under `@media (prefers-color-scheme: dark)`. Nothing else
hardcodes a colour (links use `--link`/`--link-hover` so dark mode stays
legible).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--brick` family | `#9e4a37` etc. | same (pale lifted) | masonry, accents |
| `--paper` | `#f4efe6` | `#211c19` | page |
| `--limestone` | `#ece4d6` | `#2b2521` | raised surfaces |
| `--mortar` | `#ddd2be` | `#463b33` | hairlines |
| `--ink` family | `#241f1c` … | `#f0e8db` … | text |
| `--signal` family | `#0f7a52` … | links `#4fd0a0` | the one accent |
| `--sky-top/bottom` | day sky | night sky | masthead + fallback |

## Wayfinding

- **Mileposts** (`Milepost.astro`, `.milepost`): every section is labelled
  `MP n · Name` in mono with a signal-lamp dot. The 404 is `MP 404 · off
  the route`.
- **Signal rail** (`.rail`): a 3px signal-green line down the right edge
  that fills as you scroll — pure CSS (`animation-timeline: scroll()`),
  absent where unsupported, desktop only.
- **Scroll reveals** (`.reveal`): transform-only (never opacity), so
  content is always readable even if the timeline never advances.
- **View transitions**: Astro's `<ClientRouter />`; the topbar and masthead
  carry `transition:name` so the structure persists between pages.

## Type

Self-hosted woff2 in `public/assets/fonts/`:

- **Bricolage Grotesque** — display; true display sizes on the masthead
  (up to ~5rem), weight 800 for the headline and wordmark.
- **Source Serif 4** — body.
- **IBM Plex Mono** — wayfinding only: mileposts, nav, meta, facts.

## The arch motif

Arch-topped masks on case images and the about panel; the work index is an
**elevation drawing** — one continuous deck line with an arch-framed card
per project (horizontal scroll-snap on desktop, stacked on mobile); the
colonnade divider and the footer arcade close every page. Oversized brick
numerals (`.case-no`, `.step-n`) number the spans and steps.

## Voice

Plain, warm, a little wry. Railway-infrastructure language for wayfinding
("MP", spans, arrival) without becoming a theme park. Honest advice, no
price list — a real number after a real conversation.
