const fs = require('fs');
const path = require('path');

const { createFilter } = require('rollup-pluginutils');

const templateUrlRegex = /templateUrl\s*:(.*)/g;
const stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function insertText(str, dir) {
  const string = str.replace(stringRegex, (match, quote, url) => {
    const text = fs.readFileSync(path.join(dir, url)).toString();
    return `\`${text}\``;
  });
  return string;
}

module.exports = function angular(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'angular',
    transform(source, map) {
      if (!filter(map)) return null;

      const { dir } = path.parse(map);

      const newSource = source.replace(
        templateUrlRegex,
        (match, url) => `template: ${insertText(url, dir)}`
      );

      return {
        code: newSource,
        map: { mappings: '' }
      };
    }
  };
};
