---
title: "Hospital Radio."
client: "Hospital Radio."
sector: "Band · Manchester"
year: "2026"
url: "https://hospitalradiofullstop.co.uk/"
image: "/assets/work-hospital-radio.jpg"
order: 2
featured: true
summary: "A midwest-emo four-piece with shows to sell and lyrics fans kept asking for — now broadcasting from a grain-soaked site the band updates between rehearsals."
stack: "Astro · YAML + markdown content · Sveltia CMS · GitHub Pages · custom domain"
testimonial: ""
testimonialBy: ""
---

## The situation

Hospital Radio. are a Manchester four-piece doing everything themselves —
booking shows, printing merch, answering promoters. Their world changes
weekly: new dates, new setlists, new photos. A static brochure site would
have been out of date before the first gig.

## What we built

A site that feels like their world: a derelict-broadcast-booth aesthetic
with film grain, scanlines and a CRT "tuning in" intro — completely
different from a café site, from the same engine underneath. Shows sort
themselves into upcoming and archive by date. Setlists link to lyrics
pages. There's a press-kit page a promoter can print to PDF. And the
signature flourish: a persistent "Tune In" transport bar that opens the
band's radio station without slowing anything down.

<details>
<summary>For the technically curious</summary>

Originally a client-rendered single page; rebuilt so every view is a real
static page — shows, archive, each song's lyrics — which search engines can
finally read. Tour dates live in one YAML file the band edits; lyrics are
one markdown file per song, with repeated verses auto-styled as the chorus.
Old share links on the hash-route format still work via a redirect shim.
Event structured data means gigs can appear directly in search results.

</details>

## The self-serve bit

Adding a show is editing one file through a form — date, venue, ticket
link, done. The site sorts it into the right page, marks it "aired" after
the night, and keeps the archive honest. Lyrics, photos and merch work the
same way. Nobody in the band has touched a line of code.

*(Screen recording of adding a show — coming soon.)*

## Live proof

The real site is at [hospitalradiofullstop.co.uk](https://hospitalradiofullstop.co.uk/) —
tap "Tune In" at the bottom. Two sites from the same engine, and they
couldn't look less alike. That contrast is the point.

## In their words

> *(Testimonial from the band — coming soon.)*
