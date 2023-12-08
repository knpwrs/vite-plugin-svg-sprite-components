import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import spritesPlugin from 'vite-plugin-svg-sprite-components-solid';

export default defineConfig({
  plugins: [solidPlugin(), spritesPlugin()],
});
