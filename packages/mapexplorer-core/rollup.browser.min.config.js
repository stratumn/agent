import config from './rollup.browser.config';
import uglify from 'rollup-plugin-uglify';

config.plugins.push(uglify());
config.output.file = 'dist/mapexplorer-core.min.js';

export default config;
