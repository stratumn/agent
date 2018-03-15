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
  external: [
    'react',
    'react-dom',
    'prop-types',
    '@indigoframework/mapexplorer-core',
    'radium'
  ],
  plugins: [
    babel({
      include: ['src/**']
    }),
    resolve({
      module: false
    }),
    commonjs({
      namedExports: {
        '../agent-client-js/node_modules/qs/lib/index.js': ['stringify'],
        'node_modules/qs/lib/index.js': ['stringify']
      }
    }),
    postcss({})
  ]
};
