const plugins = require('./rollup.browser.plugins');

export default {
  plugins,
  output: {
    format: 'umd',
    sourcemap: true,
    file: 'dist/angular-mapexplorer.js'
  },
  input: 'src/index.js',
  name: 'angularMapexplorer'
};
