import config from './rollup.base.config';

var pkg = require('./package.json');
var external = Object.keys(pkg.dependencies);

config.external = external;
config.dest = pkg['jsnext:main'];

export default config;
