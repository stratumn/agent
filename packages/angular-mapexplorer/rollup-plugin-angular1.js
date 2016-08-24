import fs from 'fs';
import path from 'path';

import { createFilter } from 'rollup-pluginutils';

const templateUrlRegex = /templateUrl\s*:(.*)/g;
const stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function insertText(str, dir) {
  str = str.replace(stringRegex, (match, quote, url) => {
    const text = fs.readFileSync(path.join(dir, url)).toString();
    return '`' + text + '`';
  });
  return str;
}

export default function angular(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'angular',
    transform(source, map) {
      if (!filter(map)) return;

      const dir = path.parse(map).dir;

      source = source.replace(templateUrlRegex, (match, url) =>
        `template: ${insertText(url, dir)}`
      );

      return {
        code: source,
        map: { mappings: '' }
      };
    }
  };
}
