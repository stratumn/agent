/*eslint-disable */

var webpack = require('webpack');
var baseConfig = require('./webpack.base.config.js');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse('true'))
});

baseConfig.cache = true;
baseConfig.plugins = [definePlugin];

module.exports = baseConfig;
