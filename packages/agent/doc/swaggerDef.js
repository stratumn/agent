const { version } = require('../package.json');

module.exports = {
  info: {
    title: 'Agent',
    version
  },
  consumes: 'application/json',
  produces: 'application/json'
};
