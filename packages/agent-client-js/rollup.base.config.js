import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

export default {
  plugins: [
    babel(
      Object.assign(
        {
          exclude: 'node_modules/**'
        },
        babelrc()
      )
    )
  ],
  sourcemap: true,
  input: 'src/index.js',
  name: 'StratumnAgentClient',
  output: {}
};
