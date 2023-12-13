import { defineConfig } from 'vite';
import spritesPlugin from 'vite-plugin-svg-sprite-components-preact';
import { preact } from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact(), spritesPlugin()],
});
