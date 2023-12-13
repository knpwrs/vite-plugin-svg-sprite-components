# vite-plugin-sprite-components-preact

A vite plugin to generate sprite sheets from imported svg files. The imported svg files are transformed into Preact components. For example:

```tsx
import Icon from './icon.svg?sprite-preact';

export function App() {
  return (
    <nav>
      <Icon />
    </nav>
  );
}
```

`icon.svg` is packed into a sprite sheet in your build output, and the `Icon` component renders an inline svg that references said sprite sheet. The `Icon` component also has properly defined TypeScript types. See [`../../examples/preact`](../../examples/preact) for a complete working example.

## Quick Start:

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import spritesPlugin from 'vite-plugin-svg-sprite-components-preact';
import { preact } from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact(), spritesPlugin()],
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-svg-sprite-components-preact/client"]
  }
}
```
