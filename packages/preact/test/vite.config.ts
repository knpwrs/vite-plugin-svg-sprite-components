import { defineConfig } from 'vite';
import spritesPlugin from '../src/index.js';

export default defineConfig({
  plugins: [spritesPlugin()],
});
