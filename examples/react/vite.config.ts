import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import spritesPlugin from 'vite-plugin-svg-sprite-components-react';

export default defineConfig({
  plugins: [react(), spritesPlugin()],
});
