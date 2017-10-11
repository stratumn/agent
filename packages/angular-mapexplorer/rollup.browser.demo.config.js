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
    babel(
      Object.assign(
        {
          exclude: [
            'node_modules/**',
            '../mapexplorer-core/**',
            '../agent-client-js/**'
          ]
        },
        babelrc()
      )
    ),
    builtins(),
    nodeResolve({
      preferBuiltins: true,
      browser: true,
      jsnext: true
    }),
    commonjs({
      namedExports: {
        '../agent-client-js/node_modules/qs/lib/index.js': ['stringify'],
        'node_modules/stratumn-agent-client/lib/stratumn-agent-client.mjs': [
          'stringify'
        ],
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
