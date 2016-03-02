/* jshint node: true */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var replace = require('broccoli-string-replace');

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
    app.import('vendor/firebase-web.js');
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
      return this.treeForBrowserVendor(vendorTree);
    }
  },

  treeForBrowserVendor: function(vendorTree) {
    var trees = [];

    if (vendorTree) {
      trees.push(vendorTree);
    }

    var libDir = path.dirname(require.resolve('firebase'));
    var firebaseTree = new Funnel(libDir, {
      files: ['firebase-web.js'],
    });

    // poor man's browserify
    // we just need to get rid of the module.exports line and everything works
    var replacedFirebaseTree = replace(firebaseTree, {
      files: ['firebase-web.js'],
      pattern: {
        match: "module.exports = Firebase;",
        replacement: ''
      }
    });

    trees.push(replacedFirebaseTree);

    return this._super.treeForVendor.call(this, mergeTrees(trees));
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