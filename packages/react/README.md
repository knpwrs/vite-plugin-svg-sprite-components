# vite-plugin-sprite-components-react

A vite plugin to generate sprite sheets from imported svg files. The imported svg files are transformed into React components. For example:

```tsx
import Icon from './icon.svg?sprite-react';

export function App() {
  return (
    <nav>
      <Icon />
    </nav>
  );
}
```

`icon.svg` is packed into a sprite sheet in your build output, and the `Icon` component renders an inline svg that references said sprite sheet. The `Icon` component also has properly defined TypeScript types. See [`../../examples/react`](../../examples/react) for a complete working example.

## Quick Start:

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import spritesPlugin from 'vite-plugin-svg-sprite-components-react';

export default defineConfig({
  plugins: [react(), spritesPlugin()],
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-svg-sprite-components-react/client"]
  }
}
```
