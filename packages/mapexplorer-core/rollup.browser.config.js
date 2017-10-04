const plugins = require('./rollupPlugins');

export default {
  plugins,
  sourcemap: true,
  input: 'src/index.js',
  output: {
    file: 'dist/mapexplorer-core.js',
    format: 'umd',
  },
  name: 'mapexplorerCore'
};
