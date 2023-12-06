import { defineConfig } from 'vite';
import spritesPlugin from '../src/index';

export default defineConfig({
  plugins: [spritesPlugin()],
});
