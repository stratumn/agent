import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

const pkg = require('./package.json');

export default {
  sourcemap: true,
  input: 'src/index.js',
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
      sourcemap: true,
      name: 'StratumnAgentClient',
      file: pkg.module,
      format: 'es'
    },
    {
      sourcemap: true,
      name: 'StratumnAgentClient',
      file: pkg.main,
      format: 'cjs'
    }
  ]
};
