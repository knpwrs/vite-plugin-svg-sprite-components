import { type Plugin } from 'vite';
import { optimize } from 'svgo';
import { hash } from 'hasha';
import { readFile } from 'node:fs/promises';
import invariant from 'tiny-invariant';
import MagicString from 'magic-string';

export type SerializeParams = {
  symbolId: string;
  inline: boolean;
  symbols: Map<string, string>;
};

export type Options = {
  name?: string;
  fileName?: string;
  serialize?: (p: SerializeParams) => string;
  query?: string;
};

async function shortHash(src: string) {
  return (await hash(src)).substring(0, 8);
}

async function resolveOutputFilename(
  tmpl: string,
  symbols: Map<string, string>,
) {
  return `assets/${tmpl
    .replace('[name]', 'sprites')
    .replace(
      '[hash]',
      await shortHash(
        Array.from(symbols.keys())
          .sort()
          .map((id) => symbols.get(id))
          .join(''),
      ),
    )
    .replace('[ext]', 'svg')}`;
}

const PLACEHOLDER = '__SPRITE_ASSET_PLACEHOLDER__';

function defaultSerialize({
  symbolId,
  inline,
  symbols,
}: SerializeParams): string {
  const symbol = symbols.get(symbolId);
  invariant(symbol, 'Missing symbol!');

  const svgRootTag = symbol
    .substring(0, symbol.indexOf('>') + 1)
    .replace(/<symbol id=".+?"/, '<svg');

  if (inline) {
    return `export default '${svgRootTag}${symbols.get(
      symbolId,
    )}<use href="#${symbolId}" /></svg>'`;
  }

  return `export default '${svgRootTag}<use href="${PLACEHOLDER}#${symbolId}" /></svg>'`;
}

export default function ({
  name = 'svg-sprite-components-core',
  fileName = '[name]-[hash].[ext]',
  serialize = defaultSerialize,
  query = 'sprite',
}: Options = {}): Plugin {
  const symbols = new Map<string, string>();
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
      if (!url.pathname.endsWith('.svg') || url.search.slice(1) !== query)
        return null;

      const src = await readFile(url.pathname, 'utf-8');

      const { data } = optimize(src, {
        plugins: ['preset-default', 'removeXMLNS'],
      });

      const symbolId = await shortHash(src);
      const symbol = data
        .replace('<svg', `<symbol id="${symbolId}"`)
        .replace('/svg>', '/symbol>');
      symbols.set(symbolId, symbol);

      return { code: JSON.stringify(symbolId) };
    },
    async transform(src, id) {
      const url = new URL(id, 'file:///');
      if (!url.pathname.endsWith('.svg') || url.search.slice(1) !== query)
        return null;
      const symbolId = JSON.parse(src);
      invariant(typeof symbolId === 'string', 'Improperly formatted symbolId');
      return serialize({
        symbolId,
        inline: cmd === 'serve',
        symbols,
      });
    },
    async renderChunk(code) {
      if (!code.includes(PLACEHOLDER)) return null;

      resolvedFileName ??= await resolveOutputFilename(fileName, symbols);
      const str = new MagicString(code);
      str.replaceAll(PLACEHOLDER, resolvedFileName);

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
        .map((id) => symbols.get(id))
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
