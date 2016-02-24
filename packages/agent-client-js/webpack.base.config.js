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
      }
    ],
  },
  output: {
    library: 'StratumnSDK',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  }
};
