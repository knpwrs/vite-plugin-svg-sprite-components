import { defineConfig } from 'vite';
import spritesPlugin from 'vite-plugin-svg-sprite-components-core';

export default defineConfig({
  plugins: [spritesPlugin()],
});
