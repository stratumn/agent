import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import angular from './rollup-plugin-angular1';

export default {
  plugins: [
    angular({
      include: 'src/*.directive.js'
    }),
    babel(Object.assign({
      exclude: 'node_modules/**'
    }, babelrc())),
    builtins(),
    nodeResolve({
      skip: ['angular-drop'],
      preferBuiltins: true,
      browser: true,
      jsnext: true
    }),
    commonjs({
      exclude: ['node_modules/rollup-plugin-node-globals/**']
    }),
    globals()
  ],
  format: 'umd',
  sourceMap: true,
  entry: 'docs/src/app.js',
  dest: 'docs/dist/app.js',
  moduleName: 'angularMapexplorerDemo'
};
