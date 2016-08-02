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
    'd3-hierarchy': 'd3-hierarchy',
    'd3-selection': 'd3-selection',
    'd3-transition': 'd3-transition',
    'd3-array': 'd3-array',
    'd3-zoom': 'd3-zoom',
    'd3-ease': 'd3-ease'
  },
  resolve: {
    extensions: ['', '.js']
  }
};
