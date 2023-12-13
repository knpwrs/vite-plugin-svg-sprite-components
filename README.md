# vite-plugin-sprite-components-{core,preact,react,solid}

A vite plugin to generate sprite sheets from imported svg files. The imported svg files are transformed into components which can be used in the frontend framework of your choice. For example:

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

`icon.svg` is packed into a sprite sheet in your build output, and the `Icon` component renders an inline svg that references said sprite sheet. The `Icon` component also has properly defined TypeScript types.

See the following examples for specific frameworks, all with TypeScript support:

- [`./examples/react`](./examples/react)
- [`./examples/preact`](./examples/preact)
- [`./examples/solid`](./examples/solid)
- [`./examples/html`](./examples/html)

If your build uses multiple frontend frameworks (e.g., an Astro project with multiple islands), you can set up this plugin to generate components for all of them, and they will all reference the same sprite sheet. See [./examples/multi](./examples/multi) for a working example.
