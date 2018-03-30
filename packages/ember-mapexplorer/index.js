"use strict";

module.exports = {
  name: "@indigocore/ember-mapexplorer",
  included: function(app) {
    this._super.included(app);

    app.options.sassOptions = app.options.sassOptions || {};
    app.options.sassOptions.includePaths =
      app.options.sassOptions.includePaths || [];

    app.options.sassOptions.includePaths.push(
      "node_modules/@indigocore/mapexplorer-core/assets/stylesheets"
    );

    this.import(
      "node_modules/@indigocore/mapexplorer-core/dist/mapexplorer-core.js"
    );
  }
};
