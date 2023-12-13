# vite-plugin-sprite-components-solid

A vite plugin to generate sprite sheets from imported svg files. The imported svg files are transformed into Solid components. For example:

```tsx
import Icon from './icon.svg?sprite-solid';

export function App() {
  return (
    <nav>
      <Icon />
    </nav>
  );
}
```

`icon.svg` is packed into a sprite sheet in your build output, and the `Icon` component renders an inline svg that references said sprite sheet. The `Icon` component also has properly defined TypeScript types. See [`../../examples/solid`](../../examples/solid) for a complete working example.

## Quick Start:

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import spritesPlugin from 'vite-plugin-svg-sprite-components-solid';

export default defineConfig({
  plugins: [solidPlugin(), spritesPlugin()],
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-svg-sprite-components-solid/client"]
  }
}
```
