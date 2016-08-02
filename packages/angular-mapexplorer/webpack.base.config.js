/*eslint-disable */

var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: [path.join(__dirname, 'src')],
        query: {
          presets: ['es2015']
        }
      },
      { loader: 'json', test: /\.json$/ }
    ]
  },
  externals: {
    'angular': 'angular',
    'MapexplorerCore': 'MapExplorerCore'
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ["web_modules", "node_modules", "bower_components"]
  }
};
