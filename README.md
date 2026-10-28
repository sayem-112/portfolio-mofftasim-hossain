# Mofftasim Hossain Sayem

My portfolio: a static site built with [Astro](https://astro.build), with a page for each project.

## Run it

You need Node 22.23 or newer.

```bash
npm install
npm run dev
```

The site runs at http://localhost:4321. `npm run build` writes the static site to `dist/`.

## Where things live

- `src/content/work/` holds one Markdown file per project. The frontmatter sets the title, dates, links and screenshots, and the body is the write-up.
- `src/pages/` has the home page, the project page template and the 404 page.
- `src/scripts/dither.ts` draws the 1-bit dithered photo frame on the home page.
- `public/` holds screenshots, the frame photos, the cursors and the CV.

## Credits

Space photos in the frame are public domain, from NASA, ESA and the James Webb and Hubble teams. Brand marks in the stack list come from [Simple Icons](https://simpleicons.org) (CC0), and interface icons from [Lucide](https://lucide.dev) (ISC).
