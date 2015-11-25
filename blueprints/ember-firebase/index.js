module.exports = {
  description: 'Adds Firebase to bower dependencies.',

  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function() {
    return this.addBowerPackageToProject('firebase');
  }
};
