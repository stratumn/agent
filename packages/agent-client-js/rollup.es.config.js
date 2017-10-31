import config from './rollup.base.config';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies);

config.external = external;
config.output = {
  file: pkg.module,
  format: 'es'
};

export default config;
