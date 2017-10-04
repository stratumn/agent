import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);

module.exports = {
  input: 'src/index.js',
  plugins: [
    babel(babelrc())
  ],
  external,
  globals: {
    'd3-hierarchy': 'd3',
    'd3-transition': 'd3',
    'd3-ease': 'd3',
    'd3-selection': 'd3',
    'd3-zoom': 'd3',
    'd3-array': 'd3'
  },
  output: {
    file: pkg.main,
    format: 'umd'
  },
  name: 'mapexplorerCore',
  sourcemap: true
};
