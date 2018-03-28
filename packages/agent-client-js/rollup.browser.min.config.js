import uglify from 'rollup-plugin-uglify';
import config from './rollup.browser.config';

config.plugins.push(uglify());
config.output = {
  name: 'StratumnAgentClient',
  file: 'dist/stratumn-agent-client.min.js',
  format: 'iife'
};

export default config;
