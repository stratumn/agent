var babel = require('rollup-plugin-babel');
var babelrc = require('babelrc-rollup').default;
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var json = require('rollup-plugin-json');
var builtins = require('rollup-plugin-node-builtins');
var globals = require('rollup-plugin-node-globals');

module.exports = {
  plugins: [
    json(),
    babel(Object.assign({
      exclude: 'node_modules/**'
    }, babelrc())),
    builtins(),
    nodeResolve({
      jsnext: true,
      browser: true,
      preferBuiltins: true,
      skip: ['d3-hierarchy', 'd3-transition', 'd3-ease', 'd3-selection', 'd3-zoom', 'd3-array']
    }),
    commonjs({
      exclude: ['node_modules/rollup-plugin-node-globals/**']
    }),
    globals()
  ],
  format: 'umd',
  sourceMap: true,
  globals: {
    'd3-hierarchy': 'd3',
    'd3-transition': 'd3',
    'd3-ease': 'd3',
    'd3-selection': 'd3',
    'd3-zoom': 'd3',
    'd3-array': 'd3'
  },
  entry: 'src/index.js',
  dest: 'dist/mapexplorer-core.js',
  moduleName: 'mapexplorerCore'
};
