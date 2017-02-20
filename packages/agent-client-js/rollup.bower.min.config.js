import config from './rollup.bower.config';
import uglify from 'rollup-plugin-uglify';

config.plugins.push(uglify());
config.dest = 'dist/stratumn-agent-client.min.js';

export default config;
