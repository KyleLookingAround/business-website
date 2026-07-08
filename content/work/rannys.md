---
title: "Ranny's"
client: "Ranny's Coffee Shop"
sector: "Coffee shop · Stockport"
year: "2026"
url: "https://kylelookingaround.github.io/rannys/"
image: "/assets/work-rannys.jpg"
order: 1
featured: true
summary: "A new coffee shop with no website and no time — now running a warm, fast, six-page site the owner edits from her phone."
stack: "Astro · schema-checked YAML content · Sveltia CMS · GitHub Pages · a lazy-loaded three.js flourish"
results:
  - "Live 'open now / closed', accurate to Stockport time"
  - "Owner publishes menu, events & photos from her phone"
  - "Loads in a blink on a phone outside the shop"
  - "A broken edit can never take the site down"
testimonial: ""
testimonialBy: ""
---

## The situation

Ranny's opened on Hempshaw Lane with brilliant coffee, ridiculously good
cake — and no website. Customers were finding a Facebook page and a prayer.
The owner runs the shop solo; the last thing she has time for is learning a
website builder.

## What we built

A six-page site that feels like the shop: her actual paint colours, her
handwriting-style captions, photos of the real place by a local
photographer. Menu, events, photos, bookings — plus the small things that
matter for a café: live "open now / closed" that actually knows the time in
Stockport, the map pin exactly right, and search-engine plumbing so Google
shows the hours and the reviews link.

There's one flourish, because every place deserves one: a little 3D enamel
mug at the foot of the home page that you can spin. It costs nothing on page
speed — it only loads if you scroll to it.

<details>
<summary>For the technically curious</summary>

Static site on Astro with every page pre-rendered; content lives in plain
YAML files validated against schemas at build time, so a broken edit can
never take the site down. Editing happens through a Git-based CMS — every
change is a version-controlled commit. The mug is a lazy-loaded three.js
island gated behind WebGL and reduced-motion checks. Hosted on GitHub Pages;
the whole pipeline rebuilds and republishes in about a minute.

</details>

## The self-serve bit

This is the part that matters. Ranny's updates her own menu, adds her own
events, uploads her own photos — from a phone, through a simple editor with
a Save button. If an edit is ever broken, the build catches it, the live
site stays exactly as it was, and she gets a friendly email instead of a
broken homepage.

## Live proof

The real site is at [kylelookingaround.github.io/rannys](https://kylelookingaround.github.io/rannys/) —
go and spin the mug. Have a look on your phone, on bad signal, in the
street. That's the test that matters.
