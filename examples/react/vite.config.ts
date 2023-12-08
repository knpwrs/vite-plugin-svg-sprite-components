import { defineConfig } from 'vite';
import spritesPlugin from 'vite-plugin-svg-sprite-components-react';

export default defineConfig({
  plugins: [spritesPlugin()],
});
