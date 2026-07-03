import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ─── Journal posts ──────────────────────────────────────────────
// Long-form writing. Sveltia editor adds new entries here.
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// ─── Letters (testimonials) ─────────────────────────────────────
// Updated 2-3 times a year via Sveltia. Each letter is one .md.
const letters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/letters' }),
  schema: z.object({
    order: z.number(),
    name: z.string(),                          // e.g. "Mr S. Shaikh" or "Anonymous"
    role: z.string().optional(),               // location / context, e.g. "India" or "By email"
    container: z.string().optional(),          // which offering, if known
    season: z.string().optional(),             // when, if known
    featured: z.boolean().default(false),
  }),
});

// ─── Offerings (services / containers) ──────────────────────────
// Price + bullet list per tier. Editable in Sveltia.
// The markdown body becomes the long description (multi-paragraph)
// shown on the dedicated /offerings page; `summary` is the short
// one-liner shown on the homepage preview.
const offerings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/offerings' }),
  schema: z.object({
    order: z.number(),
    eyebrow: z.string(),       // e.g. "A · Single session"
    title: z.string(),         // e.g. "The Untangle"
    price: z.string(),         // string so editor can write "CHF 150" or "Free"
    summary: z.string(),       // short, for homepage preview
    bullets: z.array(z.string()),
    featured: z.boolean().default(false),
    cta: z.string().default("Book a session"),
  }),
});

export const collections = { journal, letters, offerings };
