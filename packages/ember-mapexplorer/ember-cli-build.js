/* eslint-env node */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    // Add options here
    'ember-cli-babel': {
      includePolyfill: (EmberAddon.env() === 'test')
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  // console.log(app)

  app.options.sassOptions.includePaths.push(
    'node_modules/mapexplorer-core/assets/stylesheets'
  );

  return app.toTree();
};
