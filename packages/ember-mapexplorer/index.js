/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-mapexplorer',
  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/d3/d3.js');
    app.import(app.bowerDirectory + '/stratumn-agent-client/dist/stratumn-agent-client.js');
    app.import(app.bowerDirectory + '/mapexplorer-core/dist/mapexplorer-core.js');

    app.options.sassOptions = app.options.sassOptions || {};
    app.options.sassOptions.includePaths = app.options.sassOptions.includePaths || [];

    app.options.sassOptions.includePaths.push(
      app.bowerDirectory + '/mapexplorer-core/assets/stylesheets'
    );
  }
};
