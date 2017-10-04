var babel = require('rollup-plugin-babel');
var babelrc = require('babelrc-rollup').default;
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var json = require('rollup-plugin-json');
var builtins = require('rollup-plugin-node-builtins');
var globals = require('rollup-plugin-node-globals');

var plugins = [
  json(),
  babel(Object.assign({
    exclude: ['node_modules/**', '../**/node_modules/**']
  }, babelrc())),
  builtins(),
  nodeResolve({
    jsnext: true,
    browser: true,
    preferBuiltins: true
  }),
  commonjs({
    exclude: ['node_modules/rollup-plugin-node-globals/**',
      'node_modules/process-es6/**', 'node_modules/buffer-es6/**']
  }),
  globals()
];

module.exports = plugins;
