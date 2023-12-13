import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import preact from "@astrojs/preact";
import solid from "@astrojs/solid-js";
import svgSprites, {
  serializeHtml,
} from "vite-plugin-svg-sprite-components-core";
import { serialize as serializeReact } from "vite-plugin-svg-sprite-components-react";
import { serialize as serializePreact } from "vite-plugin-svg-sprite-components-preact";
import { serialize as serializeSolid } from "vite-plugin-svg-sprite-components-solid";

export default defineConfig({
  integrations: [preact(), react(), solid()],
  vite: {
    plugins: [
      svgSprites({
        serializers: [
          serializeHtml,
          serializePreact,
          serializeReact,
          serializeSolid,
        ],
      }),
    ],
  },
});
