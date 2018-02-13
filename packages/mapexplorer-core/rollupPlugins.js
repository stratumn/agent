const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup').default;
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const json = require('rollup-plugin-json');

const plugins = [
  babel(
    Object.assign(
      {
        include: ['src/**', 'test/integration/**']
      },
      babelrc()
    )
  ),
  json(),
  builtins(),
  nodeResolve({
    browser: true
  }),
  commonjs({
    namedExports: {
      '../agent-client-js/node_modules/qs/lib/index.js': ['stringify'],
      'node_modules/qs/lib/index.js': ['stringify']
    }
  }),
  globals()
];

module.exports = plugins;
