import uglify from 'rollup-plugin-uglify';
import config from './rollup.browser.config';

config.plugins.push(uglify());
config.output.file = 'dist/mapexplorer-core.min.js';

export default config;
