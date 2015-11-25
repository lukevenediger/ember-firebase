import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import Firebase from 'firebase';

module('Acceptance | firebase', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('Verify Firebase is available', function(assert) {
  assert.ok(Firebase);
  assert.ok(Firebase.SDK_VERSION);
});
