import { defineConfig } from "astro/config";

export default defineConfig({
  trailingSlash: "never",
  build: { format: "file" },
  // Code blocks are set in the page's own colours, not a syntax theme.
  markdown: { syntaxHighlight: false },
  devToolbar: { enabled: false },
});
