/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-mapexplorer',
  included(app) {
    this._super.included(app);

    app.import('vendor/mapexplorer-core.js', { type: 'vendor' });
    app.import('vendor/d3.js', { type: 'vendor' });
    app.import('vendor/stratumn-sdk.js', { type: 'vendor' });

    // app.import(app.bowerDirectory + '/mapexplorer-core/dist/mapexplorer-core.js');
    // app.import(app.bowerDirectory + '/d3/d3.js');
    // app.import(app.bowerDirectory + 'stratumn-sdk/dist/stratumn-sdk.js');
  }
};
