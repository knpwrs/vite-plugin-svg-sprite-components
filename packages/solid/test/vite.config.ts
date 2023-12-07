import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import spritesPlugin from '../src/index.js';

export default defineConfig({
  plugins: [spritesPlugin(), solidPlugin()],
});
