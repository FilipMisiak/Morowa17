import { defineConfig } from 'vite';

// base './' = relative paths, so the build works on GitHub Pages under /repo-name/,
// on Vercel, on itch.io and from any other static folder.
export default defineConfig({
  base: './',
  build: { target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 900 },
});
