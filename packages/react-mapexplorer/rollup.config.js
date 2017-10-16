import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  external: ['react', 'react-dom', 'prop-types'],
  plugins: [
    resolve(),
    commonjs({
      namedExports: {
        'node_modules/stratumn-agent-client/lib/stratumn-agent-client.js': [
          'getAgent',
          'fromSegment'
        ],
        '../agent-client-js/lib/stratumn-agent-client.js': [
          'getAgent',
          'fromSegment'
        ]
      }
    }),
    postcss({}),
    babel({
      exclude: [
        'node_modules/**',
        '../mapexplorer-core/**',
        '../agent-client-js/**'
      ]
    })
  ]
};
