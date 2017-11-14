const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup').default;
const json = require('rollup-plugin-json');
const nodeResolve = require('rollup-plugin-node-resolve');
const builtins = require('rollup-plugin-node-builtins');
const commonjs = require('rollup-plugin-commonjs');
const angular = require('./rollup-plugin-angular1');

module.exports = [
  angular({
    include: 'src/*.directive.js'
  }),
  json(),
  babel(
    Object.assign(
      {
        exclude: [
          'vendor/*',
          'node_modules/**',
          '../mapexplorer-core/**',
          '../cs-validator/**',
          '../agent-client-js/**'
        ]
      },
      babelrc()
    )
  ),
  builtins(),
  nodeResolve({
    browser: true,
    module: false,
    externals: [
      'angular',
      'angular-animate',
      'angular-material',
      'angular-aria',
      'md-color-picker'
    ]
  }),
  commonjs({
    namedExports: {
      '../agent-client-js/node_modules/qs/lib/index.js': ['stringify'],
      'node_modules/qs/lib/index.js': ['stringify'],
      'node_modules/stratumn-agent-client/node_modules/qs/lib/index.js': [
        'stringify'
      ]
    }
  })
];
