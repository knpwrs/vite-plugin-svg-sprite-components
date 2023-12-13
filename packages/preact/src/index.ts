import core, {
  type SerializeParams,
} from 'vite-plugin-svg-sprite-components-core';
import { stripIndent } from 'proper-tags';
import invariant from 'tiny-invariant';

export function serialize({
  symbol,
  symbolHtml,
  symbolId,
  inline,
  filePlaceholder,
  query,
  context,
  plugins,
  moduleId,
  transformOptions,
}: SerializeParams) {
  if (query !== 'sprite-preact') {
    return false;
  }

  const preactPlugin = plugins.find(
    (plugin) => plugin.name === 'vite:preact-jsx',
  );

  invariant(preactPlugin, 'preact plugin not found');

  const url = new URL(`file://${moduleId}`);

  const attributes = Object.fromEntries(
    Object.entries(symbol.svg)
      .filter(([key]) => key.startsWith('@_'))
      .map(([key, val]) => [key.replace('@_', ''), val]),
  );
  const attributesCode = Object.entries(attributes)
    .map(([key, val]) => `${key}={${JSON.stringify(val)}}`)
    .join(' ');

  const src = inline
    ? stripIndent`
        import { forwardRef } from 'preact/compat';
        export default forwardRef(function Sprite(props, ref) {
          return (
            <svg ${attributesCode} {...props} ref={ref}>
              <symbol ${attributesCode} id="${symbolId}" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(
                symbolHtml,
              )} }} />
              <use href="#${symbolId}" />
            </svg>
            )
        });
      `
    : stripIndent`
      import { forwardRef } from 'preact/compat';
      export default forwardRef(function Sprite(props, ref) {
        return (
          <svg ${attributesCode} {...props} ref={ref}>
            <use href="${filePlaceholder}#${symbolId}" />
          </svg>
        );
      });
    `;

  const transform =
    typeof preactPlugin.transform === 'function'
      ? preactPlugin.transform
      : preactPlugin.transform?.handler;

  return transform?.call(context, src, `${url.pathname}.tsx`, transformOptions);
}

export default function vitePluginSvgSpriteComponentsReact() {
  return core({
    name: 'svg-sprite-components-preact',
    serializers: [serialize],
  });
}
