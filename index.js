/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-firebase',
  included: function(app) {
    app.import('bower_components/firebase/firebase.js');
    app.import('vendor/ember-firebase/shim.js');
  }
};
