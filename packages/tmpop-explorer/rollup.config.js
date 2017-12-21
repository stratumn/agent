import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

export default {
  input: 'src/TMPopExplorer.js',
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
    resolve({
      module: false
    }),
    commonjs({
      namedExports: {
        'node_modules/radium/lib/index.js': ['Style'],
        'node_modules/material-ui/Table/index.js': [
          'TableHead',
          'TableRow',
          'TableBody',
          'TableCell'
        ],
        'node_modules/material-ui/Progress/index.js': ['CircularProgress'],
        'node_modules/material-ui/styles/index.js': ['withStyles'],
        'node_modules/material-ui/colors/index.js': ['indigo']
      }
    }),
    postcss({}),
    babel({
      exclude: ['node_modules/**']
    })
  ]
};
