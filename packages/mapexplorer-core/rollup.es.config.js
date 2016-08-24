var babel = require('rollup-plugin-babel');
var babelrc = require('babelrc-rollup').default;

var pkg = require('./package.json');
var external = Object.keys(pkg.dependencies);

module.exports = {
  entry: 'src/index.js',
  plugins: [
    babel(babelrc())
  ],
  external: external,
  dest: pkg['jsnext:main'],
  format: 'es',
  sourceMap: true
};
