'use strict';

module.exports = {
  name: 'ember-mapexplorer',

  afterInstall: function() {
    return this.addBowerPackageToProject({ name: 'mapexplorer-core', target: 'latest' })
      .then(function () {
        return _this.addPackagesToProject(
          { name: 'ember-cli-sass', target: 'latest' }
        );
      });
  }
};
