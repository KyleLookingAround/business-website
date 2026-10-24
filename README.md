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

The home page is a field of all six projects' colours bleeding into each
other, then a poster for each project in its own palette, each starting on
the colour the last one ended on. Each project also has its own page: the
poster, a phone screenshot, three notes and what it's built with, and at
the bottom the colours run into the next project.

## Files

```
site/index.html    the home page
site/<project>.html  a page per project (rannys, hospital-radio, hearthworks,
                   the-commute, door-duty, final-call)
site/styles.css    every theme's colours as tokens at the top, then one block per zone
site/app.js        decoration only: the dot nav, the Hearthworks island, the departures board
site/assets/       screenshots of each project (960×600 and a 390×780 phone shot, webp) and og.png for link previews
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
