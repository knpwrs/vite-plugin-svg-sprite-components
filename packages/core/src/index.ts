import { type Plugin } from 'vite';
import { optimize } from 'svgo';
import { hash } from 'hasha';
import { readFile } from 'node:fs/promises';
import invariant from 'tiny-invariant';
import MagicString from 'magic-string';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export type SerializeParams = {
  symbol: Record<'svg', object>;
  symbolHtml: string;
  symbolId: string;
  inline: boolean;
  filePlaceholder: string;
  query: string;
};

export type Options = {
  name?: string;
  fileName?: string;
  serializers?: Array<(p: SerializeParams) => string | false>;
};

async function shortHash(src: string) {
  return (await hash(src)).substring(0, 8);
}

async function resolveOutputFilename(
  tmpl: string,
  symbols: Map<string, Record<'svg', object>>,
) {
  return `assets/${tmpl
    .replace('[name]', 'sprites')
    .replace(
      '[hash]',
      await shortHash(
        Array.from(symbols.keys())
          .sort()
          .map((id) => {
            const symbol = symbols.get(id);
            invariant(symbol, 'Symbol not found');
            return xmlBuilder.build(symbol);
          })
          .join(''),
      ),
    )
    .replace('[ext]', 'svg')}`;
}

const FILE_PLACEHOLDER = '__SPRITE_ASSET_PLACEHOLDER__';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  allowBooleanAttributes: true,
});

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
});

function defaultSerialize({
  symbol,
  symbolId,
  inline,
  filePlaceholder,
}: SerializeParams): string {
  const attributes = Object.fromEntries(
    Object.entries(symbol.svg).filter(([key]) => key.startsWith('@_')),
  );

  if (inline) {
    const svg = {
      svg: {
        ...attributes,
        symbol: { ...symbol.svg, ['@_id']: symbolId },
        use: { ['@_href']: `#${symbolId}` },
      },
    };

    return `export default ${JSON.stringify(xmlBuilder.build(svg))};`;
  }

  const svg = {
    svg: {
      ...attributes,
      use: { ['@_href']: `${filePlaceholder}#${symbolId}` },
    },
  };

  return `export default ${JSON.stringify(xmlBuilder.build(svg))};`;
}

export default function vitePluginSvgSpriteComponentsCore({
  name = 'svg-sprite-components-core',
  fileName = '[name]-[hash].[ext]',
  serializers = [defaultSerialize],
}: Options = {}): Plugin {
  const symbols = new Map<string, Record<'svg', object>>();
  let cmd = 'unknown';
  let resolvedFileName: string;

  return {
    name,
    enforce: 'pre',
    configResolved({ command }) {
      cmd = command;
    },
    async load(id) {
      const url = new URL(id, 'file:///');
      if (
        !url.pathname.endsWith('.svg') ||
        url.search.slice(1).startsWith('sprite')
      )
        return null;

      const src = await readFile(url.pathname, 'utf-8');

      const { data } = optimize(src, {
        plugins: ['preset-default', 'removeXMLNS'],
      });

      const symbolId = await shortHash(src);
      symbols.set(symbolId, xmlParser.parse(data));

      return { code: JSON.stringify(symbolId) };
    },
    async transform(src, id) {
      const url = new URL(id, 'file:///');

      if (
        !url.pathname.endsWith('.svg') ||
        url.search.slice(1).startsWith('sprite')
      ) {
        return null;
      }

      const symbolId = JSON.parse(src);
      invariant(typeof symbolId === 'string', 'Improperly formatted symbolId');
      const symbol = symbols.get(symbolId);
      invariant(symbol, 'Symbol not found');

      for (const serialize of serializers) {
        const result = serialize({
          symbol,
          symbolHtml: xmlBuilder.build(symbol),
          symbolId,
          inline: cmd === 'serve',
          filePlaceholder: FILE_PLACEHOLDER,
          query: url.search.slice(1),
        });

        if (result) return result;
      }

      return null;
    },
    async renderChunk(code) {
      if (!code.includes(FILE_PLACEHOLDER)) return null;

      resolvedFileName ??= await resolveOutputFilename(fileName, symbols);
      const str = new MagicString(code);
      str.replaceAll(FILE_PLACEHOLDER, resolvedFileName);

      return {
        code: str.toString(),
        map: str.generateMap({ hires: true }),
      };
    },
    async generateBundle() {
      const source = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">${Array.from(
        symbols.keys(),
      )
        .sort()
        .map((id) => {
          const symbol = symbols.get(id);
          invariant(symbol, 'Symbol not found');
          return xmlBuilder.build({ symbol: { ...symbol.svg, ['@_id']: id } });
        })
        .join('')}</svg>`;

      resolvedFileName ??= await resolveOutputFilename(fileName, symbols);

      this.emitFile({
        type: 'asset',
        fileName: resolvedFileName,
        source,
      });
    },
  };
}
