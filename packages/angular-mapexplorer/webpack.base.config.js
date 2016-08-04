/*eslint-disable */

var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-2']
        }
      },
      {
        loader: 'json',
        test: /\.json$/
      },
      {
        test: /\.html$/,
        loader: "ngtemplate!html"
      }
    ]
  },
  externals: {
    'angular': 'angular',
    'angular-sanitize': '"ngSanitize"',
    'angular-animate': '"ngAnimate"',
    'angular-material': '"ngMaterial"',
    'angular-aria': '"ngAria"',
    'imports?tinycolor=tinycolor2!md-color-picker': '"mdColorPicker"'
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ["web_modules", "node_modules", "bower_components"]
  }
};
