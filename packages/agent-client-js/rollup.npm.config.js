import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

const pkg = require('./package.json');

export default {
  sourcemap: true,
  input: 'src/index.js',
  name: 'StratumnAgentClient',
  external: Object.keys(pkg.dependencies),
  plugins: [
    babel(
      Object.assign(
        {
          include: ['src/**']
        },
        babelrc()
      )
    )
  ],
  output: [
    {
      file: pkg.module,
      format: 'es'
    },
    {
      file: pkg.main,
      format: 'cjs'
    }
  ]
};
