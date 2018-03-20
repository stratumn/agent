"use strict";

module.exports = {
  name: "@indigoframework/ember-mapexplorer",
  included: function(app) {
    this._super.included(app);

    app.options.sassOptions = app.options.sassOptions || {};
    app.options.sassOptions.includePaths =
      app.options.sassOptions.includePaths || [];

    app.options.sassOptions.includePaths.push(
      "node_modules/@indigoframework/mapexplorer-core/assets/stylesheets"
    );

    this.import(
      "node_modules/@indigoframework/mapexplorer-core/dist/mapexplorer-core.js"
    );
  }
};
