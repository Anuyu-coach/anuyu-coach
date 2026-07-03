// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://anuyu.co',
  // Markdown rendering settings
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
