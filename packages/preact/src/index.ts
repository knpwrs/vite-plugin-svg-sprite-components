import core from 'vite-plugin-svg-sprite-components-core';
import { stripIndent } from 'proper-tags';

export default function vitePluginSvgSpriteComponentsReact() {
  return core({
    name: 'svg-sprite-components-preact',
    query: 'sprite-preact',
    serialize({ symbol, symbolHtml, symbolId, inline, filePlaceholder }) {
      const attributes = Object.fromEntries(
        Object.entries(symbol.svg)
          .filter(([key]) => key.startsWith('@_'))
          .map(([key, val]) => [key.replace('@_', ''), val]),
      );
      const attributesCode = Object.entries(attributes)
        .map(([key, val]) => `${key}: ${JSON.stringify(val)}`)
        .join(', ');

      if (inline) {
        return stripIndent`
          import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
          import { forwardRef } from 'preact/compat';
          const Svg = forwardRef(function C(props, ref) {
              return (_jsxs("svg", { ${attributesCode}, ...props, ref: ref, children: [_jsx("symbol", { id: "${symbolId}", dangerouslySetInnerHTML: { __html: ${JSON.stringify(
                symbolHtml.replace(/^<svg.+?>/, '').replace(/<\/svg>$/, ''),
              )} } }), _jsx("use", { href: "#${symbolId}" })] }));
          });
          export default Svg;
        `;
      }

      return stripIndent`
        import { jsx as _jsx } from "preact/jsx-runtime";
        import { forwardRef } from 'preact/compat';
        const Comp = forwardRef(function C(props, ref) {
            return (_jsx("svg", { ${attributesCode}, ...props, ref: ref, children: _jsx("use", { href: "${filePlaceholder}#${symbolId}" }) }));
        });
        export default Comp;
      `;
    },
  });
}
