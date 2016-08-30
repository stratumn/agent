import babel from 'rollup-plugin-babel';
import { default as babelrc } from 'babelrc-rollup';

export default {
  plugins: [
    babel(Object.assign({
      exclude: 'node_modules/**'
    }, babelrc()))
  ],
  sourceMap: true,
  entry: 'src/index.js',
  moduleName: 'StratumnSDK'
};
