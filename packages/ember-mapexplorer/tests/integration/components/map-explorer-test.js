import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('map-explorer', 'Integration | Component | map explorer', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{map-explorer application="snake-eyes" mapId="57743311d6a22a8f2bd2bec1"}}`);

  assert.equal(this.$().text().trim(), '');
});
