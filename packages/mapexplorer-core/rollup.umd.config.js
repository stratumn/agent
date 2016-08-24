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
  globals: {
    'd3-hierarchy': 'd3',
    'd3-transition': 'd3',
    'd3-ease': 'd3',
    'd3-selection': 'd3',
    'd3-zoom': 'd3',
    'd3-array': 'd3'
  },
  dest: pkg['main'],
  format: 'umd',
  moduleName: 'mapexplorerCore',
  sourceMap: true
};
