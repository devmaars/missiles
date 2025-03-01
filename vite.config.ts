import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // base: '/missiles',
  resolve: {
    alias: {
      lib: path.resolve(__dirname, 'src/lib'),
      utils: path.resolve(__dirname, 'src/utils'),
      // assets: path.resolve(__dirname, 'src/assets'),
      entities: path.resolve(__dirname, 'src/entities'),
      components: path.resolve(__dirname, 'src/components'),
    },
  },
});
