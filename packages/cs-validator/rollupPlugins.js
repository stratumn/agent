const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup').default;
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');

const plugins = [
  json(),
  babel(
    Object.assign(
      {
        include: ['src/**', 'test/integration/**']
      },
      babelrc()
    )
  ),
  nodeResolve({
    browser: true,
    module: false,
    preferBuiltins: true
  }),
  commonjs({
    namedExports: {
      '../agent-client-js/node_modules/qs/lib/index.js': ['stringify'],
      'node_modules/qs/lib/index.js': ['stringify'],
      'node_modules/canonicaljson/lib/canonicaljson.js': ['stringify']
    }
  }),
  builtins(),
  globals()
];

module.exports = plugins;
