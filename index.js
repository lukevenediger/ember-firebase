/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');

module.exports = {
  name: 'ember-firebase',
  included: function(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    if (isFastBoot()) {
      this.importFastBootDependencies(app);
    } else {
      this.importBrowserDependencies(app);
    }
  },

  importBrowserDependencies: function(app) {
    app.import('bower_components/firebase/firebase.js');
    app.import('vendor/ember-firebase/shim.js', {
      type: 'vendor',
      exports: { 'firebase': ['default'] }
    });
  },

  importFastBootDependencies: function(app) {
    app.import("vendor/fastboot-firebase.js");
  },

  treeForVendor: function(vendorTree) {
    if (isFastBoot()) {
      return this.treeForNodeVendor(vendorTree);
    } else {
      return vendorTree;
    }
  },

  treeForNodeVendor: function(vendorTree) {
    var trees = [];

    if (vendorTree) {
      trees.push(vendorTree);
    }

    trees.push(new Funnel(path.join(__dirname, './assets'), {
      files: ['fastboot-firebase.js'],
    }));

    return mergeTrees(trees);
  },
};

// Checks to see whether this build is targeting FastBoot. Note that we cannot
// check this at boot time--the environment variable is only set once the build
// has started, which happens after this file is evaluated.
function isFastBoot() {
  return process.env.EMBER_CLI_FASTBOOT === 'true';
}