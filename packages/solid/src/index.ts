import core, { SerializeParams } from 'vite-plugin-svg-sprite-components-core';
import { stripIndent } from 'proper-tags';

export function serialize({
  symbol,
  symbolHtml,
  symbolId,
  inline,
  filePlaceholder,
  query,
}: SerializeParams) {
  if (query !== 'sprite-solid') {
    return false;
  }

  const attributes = Object.fromEntries(
    Object.entries(symbol.svg)
      .filter(([key]) => key.startsWith('@_'))
      .map(([key, val]) => [key.replace('@_', ''), val]),
  );
  const attributesCode = Object.entries(attributes)
    .map(([key, val]) => `${key}=${JSON.stringify(val)}`)
    .join(' ');

  if (inline) {
    return stripIndent`
          import { template as _$template } from "solid-js/web";
          import { spread as _$spread } from "solid-js/web";
          const _tmpl$ = /*#__PURE__*/_$template(\`<svg${
            attributesCode ? ` ${attributesCode}` : ''
          }><symbol id="${symbolId}"${
            attributesCode ? ` ${attributesCode}` : ''
          }></symbol><use href="#${symbolId}">\`);
          export default function Comp(props) {
            return (() => {
              const _el$ = _tmpl$(),
                _el$2 = _el$.firstChild;
              _$spread(_el$, props, true, true);
              _el$2.innerHTML = ${JSON.stringify(symbolHtml)
                .replace(/^<svg.+?>/, '')
                .replace(/<\/svg>$/, '')};
              return _el$;
            })();
          }
        `;
  }

  return stripIndent`
        import { template as _$template } from "solid-js/web";
        import { spread as _$spread } from "solid-js/web";
        const _tmpl$ = /*#__PURE__*/_$template(\`<svg${
          attributesCode ? ` ${attributesCode}` : ''
        }><use href="${filePlaceholder}#${symbolId}">\`);
        export default function Comp(props) {
          return (() => {
            const _el$ = _tmpl$();
            _$spread(_el$, props, true, true);
            return _el$;
          })();
        }
      `;
}

export default function vitePluginSvgSpriteComponentsSolid() {
  return core({
    name: 'svg-sprite-components-solid',
    serializers: [serialize],
  });
}
