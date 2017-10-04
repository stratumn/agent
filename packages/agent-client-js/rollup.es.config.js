import config from './rollup.base.config';

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);

config.external = external;
config.output = {
  file: pkg['jsnext:main'],
  format: 'es',
};

export default config;
