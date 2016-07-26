/*eslint-disable */

var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        query: {
          presets: ['es2015']
        }
      },
      { loader: 'json', test: /\.json$/ }
    ]
  },
  output: {
    library: 'MapexplorerCore',
    libraryTarget: 'umd'
  },
  externals: {
    d3: 'd3'
  },
  resolve: {
    extensions: ['', '.js']
  }
};
