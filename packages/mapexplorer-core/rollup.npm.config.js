import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies).concat(['buffer']);

module.exports = {
  input: 'src/index.js',
  plugins: [babel(babelrc())],
  external,
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  sourcemap: true
};
