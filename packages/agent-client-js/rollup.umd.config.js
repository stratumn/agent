import config from './rollup.base.config';

var pkg = require('./package.json');
var external = Object.keys(pkg.dependencies);

config.format = 'umd';
config.dest = pkg['main'];
config.external = external;

export default config;
