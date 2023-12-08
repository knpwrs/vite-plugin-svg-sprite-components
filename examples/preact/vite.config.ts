import { defineConfig } from 'vite';
import spritesPlugin from 'vite-plugin-svg-sprite-components-preact';

export default defineConfig({
  plugins: [spritesPlugin()],
});
