import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';

const angular = require('./rollup-plugin-angular1');

export default {
  plugins: [
    angular({
      include: 'src/*.directive.js'
    }),
    babel(
      Object.assign(
        {
          exclude: [
            'node_modules/**',
            '../mapexplorer-core/**',
            '../agent-client-js/**',
            '../cs-validator/**',
            'vendor/**'
          ]
        },
        babelrc()
      )
    ),
    builtins(),
    nodeResolve({
      preferBuiltins: true,
      module: false
    }),
    commonjs({
      namedExports: {
        '../agent-client-js/node_modules/qs/lib/index.js': ['stringify'],
        'node_modules/qs/lib/index.js': ['stringify']
      }
    }),
    globals()
  ],
  output: {
    format: 'umd',
    sourcemap: true,
    file: 'docs/dist/app.js'
  },
  input: 'docs/src/app.js',
  name: 'angularMapexplorerDemo'
};
