import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
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
      jsnext: true,
      browser: true,
      preferBuiltins: true,
      skip: ['angular', 'angular-animate', 'angular-material', 'angular-aria', 'md-color-picker',
        'angular-drop']
    }),
    commonjs({
      exclude: ['node_modules/rollup-plugin-node-globals/**',
      'node_modules/process-es6/browser.js', 'node_modules/buffer-es6/index.js']
    }),
    globals()
  ],
  format: 'umd',
  sourceMap: true,
  entry: 'src/index.js',
  dest: 'dist/angular-mapexplorer.js',
  moduleName: 'angularMapexplorer'
};
