import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

const angular = require('./rollup-plugin-angular1');
const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies);

module.exports = {
  input: 'src/index.js',
  plugins: [
    angular(),
    babel(
      Object.assign(
        {
          exclude: ['vendor/*']
        },
        babelrc()
      )
    )
  ],
  external,
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    }
  ]
};
