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
  output: {
    file: pkg['jsnext:main'],
    format: 'es',
  },
  sourcemap: true
};
