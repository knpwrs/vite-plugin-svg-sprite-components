import core, {
  type SerializeParams,
} from 'vite-plugin-svg-sprite-components-core';
import { stripIndent } from 'proper-tags';

export function serialize({
  symbol,
  symbolHtml,
  symbolId,
  inline,
  filePlaceholder,
  query,
}: SerializeParams) {
  if (query !== 'sprite-react') {
    return false;
  }

  const attributes = Object.fromEntries(
    Object.entries(symbol.svg)
      .filter(([key]) => key.startsWith('@_'))
      .map(([key, val]) => [key.replace('@_', ''), val]),
  );
  const attributesCode = Object.entries(attributes)
    .map(([key, val]) => `${key}: ${JSON.stringify(val)}`)
    .join(',\n');

  if (inline) {
    return stripIndent`
          import { forwardRef } from 'react';
          import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
          export default /*#__PURE__*/forwardRef(function Icon(props, ref) {
            return /*#__PURE__*/_jsxs("svg", {
              ${attributesCode},
              ...props,
              ref: ref,
              children: [/*#__PURE__*/_jsx("symbol", {
                ${attributesCode},
                id: "${symbolId}",
                dangerouslySetInnerHTML: {
                  __html: ${JSON.stringify(
                    symbolHtml.replace(/^<svg.+?>/, '').replace(/<\/svg>$/, ''),
                  )}
                }
              }), /*#__PURE__*/_jsx("use", {
                href: "#${symbolId}"
              })]
            });
          });
        `;
  }

  return stripIndent`
        import { forwardRef } from 'react';
        import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
        export default forwardRef(function Icon(props, ref) {
          return /*#__PURE__*/_jsxs("svg", {
            ${attributesCode},
            ...props,
            ref: ref,
            children: /*#__PURE__*/_jsx("use", {
              href: "${filePlaceholder}#${symbolId}"
            })
          });
        });
      `;
}

export default function vitePluginSvgSpriteComponentsReact() {
  return core({
    name: 'svg-sprite-components-react',
    serializers: [serialize],
  });
}
