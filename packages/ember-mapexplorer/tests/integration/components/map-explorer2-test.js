import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('map-explorer2', 'Integration | Component | map explorer2', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{map-explorer2}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#map-explorer2}}
      template block text
    {{/map-explorer2}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
