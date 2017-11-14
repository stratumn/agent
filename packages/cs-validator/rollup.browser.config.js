const plugins = require('./rollupPlugins');

export default {
  plugins,
  sourcemap: true,
  input: 'src/index.js',
  output: {
    file: 'dist/stratumn-cs-validator.js',
    format: 'umd'
  },
  name: 'stratumnCsValidator'
};
