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
      jsnext: true,
      browser: true,
      preferBuiltins: true,
      externals: [
        'angular',
        'angular-animate',
        'angular-material',
        'angular-aria',
        'md-color-picker'
      ]
    }),
    commonjs({
      exclude: [
        'node_modules/rollup-plugin-node-globals/**',
        'node_modules/process-es6/browser.js',
        'node_modules/buffer-es6/index.js'
      ],
      namedExports: {
        '../agent-client-js/node_modules/qs/lib/index.js': ['stringify'],
        'node_modules/qs/lib/index.js': ['stringify'],
        'node_modules/stratumn-agent-client/lib/stratumn-agent-client.mjs': [
          'stringify'
        ],
        'node_modules/stratumn-agent-client/node_modules/qs/lib/index.js': [
          'stringify'
        ]
      }
    }),
    globals()
  ],
  output: {
    format: 'umd',
    sourcemap: true,
    file: 'dist/angular-mapexplorer.js'
  },
  input: 'src/index.js',
  name: 'angularMapexplorer'
};
