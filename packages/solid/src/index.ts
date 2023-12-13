import core, { SerializeParams } from 'vite-plugin-svg-sprite-components-core';
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
  if (query !== 'sprite-solid') {
    return false;
  }

  const solidPlugin = plugins.find((plugin) => plugin.name === 'solid');
  invariant(solidPlugin, 'solid plugin not found');

  const url = new URL(`file://${moduleId}`);

  const attributes = Object.fromEntries(
    Object.entries(symbol.svg)
      .filter(([key]) => key.startsWith('@_'))
      .map(([key, val]) => [key.replace('@_', ''), val]),
  );
  const attributesCode = Object.entries(attributes)
    .map(([key, val]) => `${key}=${JSON.stringify(val)}`)
    .join(' ');

  const src = inline
    ? stripIndent`
        export default function Sprite(props) {
          return (
            <svg {...props} ${attributesCode}>
              <symbol ${attributesCode} id="${symbolId}" innerHTML={${JSON.stringify(
                symbolHtml,
              )}} />
              <use href="#${symbolId}" />
            </svg>
          );
        }
      `
    : stripIndent`
      export default function Sprite(props) {
        return (
          <svg {...props} ${attributesCode}>
            <use href="${filePlaceholder}#${symbolId}" />
          </svg>
        );
      }
    `;

  const transform =
    typeof solidPlugin.transform === 'function'
      ? solidPlugin.transform
      : solidPlugin.transform?.handler;

  return transform?.call(context, src, `${url.pathname}.tsx`, transformOptions);
}

export default function vitePluginSvgSpriteComponentsSolid() {
  return core({
    name: 'svg-sprite-components-solid',
    serializers: [serialize],
  });
}
