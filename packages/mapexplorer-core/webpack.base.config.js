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
    ],
  },
  output: {
    library: 'MapexplorerCore',
    libraryTarget: 'umd'
  },
  externals: {
    'angular': 'angular',
    'd3': 'd3',
    'stratumn-sdk': 'stratumn-sdk'
  },
  resolve: {
    extensions: ['', '.js']
  }
};
