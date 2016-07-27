import getAgent from './getAgent';
import deprecated from './deprecated';
import config from './config';

export default function getApplication(name, url) {
  deprecated('getApplication(name, url)', 'getAgent(url)');

  return getAgent(url || config.applicationUrl.replace('%s', name));
}
