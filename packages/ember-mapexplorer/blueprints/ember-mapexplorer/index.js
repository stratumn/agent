/*jshint node:true*/
module.exports = {
  description: '',

  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function() {
    return this.addBowerPackageToProject('mapexplorer-core', 'alpha')
      .then(function () {
        return this.addPackageToProject('ember-cli-sass', 'latest');
      }.bind(this));
  }
};