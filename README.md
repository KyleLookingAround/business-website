# Kyle · Things I've made

A one-page portfolio of two websites and four games:

| Project | What | Link |
|---|---|---|
| Ranny's | Website for a coffee shop on Hempshaw Lane, Stockport | https://rannys.co.uk |
| Hospital Radio | Website for a Manchester midwest-emo band | https://hospitalradiofullstop.co.uk |
| Hearthworks | Town builder where the villagers plan the town | https://kylelookingaround.github.io/hearthworks/ |
| The Commute | Transport tycoon on the real line from Stockport to Piccadilly | https://kylelookingaround.github.io/the-commute/ |
| Door Duty | Crowd-science puzzle tycoon about fitting entrances | https://kylelookingaround.github.io/door-duty-game/ |
| Final Call | Airport management game | https://kylelookingaround.github.io/final-call/ |

The top of the page is a field of all six names, each in its own type, sitting
in a blot of its colours that bleeds into its neighbours. Below that, each
project is a poster in its own palette with a piece of its world drawn round
it, and each poster starts on the colour the last one ended on.

## Files

```
site/index.html    the page
site/styles.css    every theme's colours as tokens at the top, then one block per zone
site/app.js        decoration only: the dot nav, the Hearthworks island, the departures board
site/assets/       screenshots of each project (960×600 webp) and og.png for link previews
```

No build step and no dependencies. Open `site/index.html` in a browser, or
serve the folder (`npx serve site`). Fonts come from Google Fonts. Motion is
switched off for visitors who prefer reduced motion.

## Publishing

Every push to `main` deploys `site/` to GitHub Pages
(`.github/workflows/deploy.yml`):
https://kylelookingaround.github.io/business-website/

To refresh a screenshot, replace the matching file in `site/assets/` with a
960×600 image of the same name.
