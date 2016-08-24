import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import angular from './rollup-plugin-angular1';
import bowerResolve from 'rollup-plugin-bower-resolve';

let pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);

module.exports = {
  entry: 'src/index.js',
  plugins: [
    angular(),
    babel(babelrc()),
    bowerResolve({
      skip: ['angular', 'angular-animate', 'angular-material', 'angular-aria', 'md-color-picker',
        'mapexplorer-core']
    }),
  ],
  external: external,
  targets: [
    {
      dest: pkg['main'],
      format: 'umd',
      moduleName: 'angularMapexplorer',
      sourceMap: true
    },
    {
      dest: pkg['jsnext:main'],
      format: 'es',
      sourceMap: true
    }
  ]
};
