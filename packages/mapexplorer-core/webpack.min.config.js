/*eslint-disable */

var webpack = require('webpack');
var baseConfig = require('./webpack.base.config.js');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse('false'))
});

baseConfig.plugins = [
  definePlugin,
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: false,
      warnings: false
    }
  })
];

module.exports = baseConfig;
