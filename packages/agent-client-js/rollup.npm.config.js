import config from './rollup.base.config';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies);

config.external = external;
config.output = [
  {
    file: pkg.module,
    format: 'es'
  },
  {
    file: pkg.main,
    format: 'cjs'
  }
];

export default config;
