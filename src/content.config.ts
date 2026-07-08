/**
 * Viaduct Studios — content collections.
 *
 * Each YAML file in /content is one collection with a single entry ("main");
 * case studies are one markdown file each under /content/work. Everything is
 * validated against the schemas below at build time: a bad edit fails the
 * build with a clear message — the previously deployed site stays live.
 */
import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { load, CORE_SCHEMA } from 'js-yaml';

// CORE_SCHEMA keeps unquoted dates/values as plain strings (the /admin
// editor writes them unquoted).
const single = (path: string) =>
  file(path, { parser: (text) => [{ id: 'main', ...(load(text, { schema: CORE_SCHEMA }) as Record<string, unknown>) }] });

// Image paths are stored root-absolute ("/assets/…", the form the /admin
// editor writes) and rendered through the base-aware u() helper — case
// studies live at /work/*.html, so a relative path wouldn't survive the
// extra directory depth.
const image = z.string()
  .regex(/^\/assets\//, 'image paths start with /assets/');

const optionalUrl = z.union([z.literal(''), z.string().url()]);

const settings = defineCollection({
  loader: single('content/settings.yml'),
  schema: z.object({
    url: z.string().url(),
    name: z.string().min(1),
    strapline: z.string(),
    description: z.string(),
    area: z.string(),
    locality: z.string(),
    region: z.string(),
    email: z.string().email(),
    formAction: z.string().default(''),
    // Optional honest availability line shown near the contact CTA.
    availability: z.string().default(''),
    links: z.object({
      github: optionalUrl.default(''),
      linkedin: optionalUrl.default(''),
    }),
  }),
});

const home = defineCollection({
  loader: single('content/home.yml'),
  schema: z.object({
    hero: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      sub: z.string(),
      note: z.string().default(''),
    }),
    pillars: z.array(z.object({ title: z.string(), body: z.string() })).length(3, 'three pillars'),
    process: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    cta: z.object({ heading: z.string(), body: z.string() }),
  }),
});

const services = defineCollection({
  loader: single('content/services.yml'),
  schema: z.object({
    intro: z.string(),
    packages: z.array(z.object({
      name: z.string(),
      kind: z.string(),
      blurb: z.string(),
      includes: z.array(z.string()).min(1),
    })).min(1),
    note: z.string().default(''),
  }),
});

const about = defineCollection({
  loader: single('content/about.yml'),
  schema: z.object({
    lede: z.string(),
    paragraphs: z.array(z.string()).min(1),
    // Optional portrait for the About panel; a styled brick/arch panel shows
    // in its place until a photo is added.
    portrait: image.optional(),
    // The "short version" facts shown beside the story.
    facts: z.array(z.string()).default([]),
    values: z.array(z.object({ title: z.string(), body: z.string() })).min(1),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: ['*.md', '!_*'], base: './content/work' }),
  schema: z.object({
    title: z.string().min(1),
    client: z.string(),
    sector: z.string(),
    year: z.string(),
    url: z.string().url(),
    image: image.optional(),
    order: z.number().default(999),
    featured: z.boolean().default(false),
    summary: z.string(),
    stack: z.string().default(''),
    results: z.array(z.string()).default([]),
    testimonial: z.string().default(''),
    testimonialBy: z.string().default(''),
  }),
});

const faq = defineCollection({
  loader: single('content/faq.yml'),
  schema: z.object({
    items: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { settings, home, services, about, work, faq };
