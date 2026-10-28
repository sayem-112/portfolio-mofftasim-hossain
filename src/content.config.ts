import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const work = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    // Where it sits on the home page: the card pile, or one of the two lists below it.
    kind: z.enum(["featured", "research", "coursework"]),
    blurb: z.string(),
    // The Markdown body holds the write-up as `##` sections chosen per project; the stack closes it.
    stack: z.array(z.string()).default([]),
    when: z.string(),
    year: z.string(),
    team: z.string().optional(),
    course: z.string().optional(),
    status: z.enum(["shipped", "building", "live", "finalist", "thesis", "coursework"]),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    // Screenshots, homepage first. The card uses `cover` when the first shot is the wrong crop.
    shots: z.array(z.object({ src: z.string(), alt: z.string(), label: z.string() })).default([]),
    cover: z.string().optional(),
    tag: z.string().optional(),
    award: z.string().optional(),
  }),
});

export const collections = { work };
